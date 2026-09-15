---
title: "A broken test suite, a tree and finding a rabbit"
subtitle: "How we de-flaked our test suite by trusting a database feature that already existed"
date: 2026-09-15
---

I'm not always the best at leaving well enough alone. For years our test suite cleaned up after itself with all the elegance of a toddler tidying a bedroom by sweeping everything under the rug: when needed, we called `clearDatabase()` and truncated every table. Simple. Confident. Wrong, not in the dramatic "everything's on fire" sense, but a slow death by a thousand cuts — one that had apparently crept up to failing around 50% of test runs by the time I found out, which someone mentioned to me only once I was already elbow-deep in replacing it.

## The problem we'd been living with

`clearDatabase()` had been there so long it had achieved a sort of tenure — untouchable, load-bearing, the kind of code nobody wants to be the one who breaks. Previous attempts had pruned the easy wins, but the mountain still loomed. It "worked," in the sense that the tests mostly ran and mostly went green, which is a very low bar we had somehow decided was good enough. As the suite grew into the thousands of tests, two things kept nagging at me, each more embarrassing than the last:

- **It didn't actually guarantee isolation — it just *looked* like it did.** `clearDatabase()` only ran *when called*, which is a generous way of saying it ran whenever someone remembered to call it. Two tests in the same `describe` regularly depended on each other's leftovers, and in fact plenty of tests had come to depend on exactly that — meaning they couldn't be run in isolation without falling over, which rather defeats the point of calling it "isolation" in the first place.
- **And that's exactly what caused the flakiness.** Because isolation only ever existed on paper, whether a test passed depended on what had run before it, in what order, and under what conditions — which is a fancy way of saying it was basically luck. Locally, with everyone running a handful of files at a time, that luck mostly held. Under CI, with the full suite running in whatever order and however much parallelism it decided to use that day, the luck ran out — and because nothing about this was subtle, a single test's hidden dependency on another test's leftovers would cheerfully cascade into a dozen unrelated failures, none of which had anything to do with the code actually being tested.

That last one is the kind of bug that quietly kills trust in your own test suite. A red build that's "probably nothing, just re-run it" is worse than no test suite at all — at least an empty suite doesn't lie to you. Eventually nobody looks at red builds anymore, and at that point you don't have a safety net, you have a very expensive gut feeling.

## Reaching for a feature that was already there

This didn't start as "let's rewrite how the test suite cleans up." It started as a bug hunt — the cascade failures above needed a root cause, and the obvious first move was to see whether anyone else had already solved this. They had: Postgres transactions, rolled back instead of committed, are a well-known pattern for exactly this problem, and there's an existing library for it — [pg-transactional-tests](https://github.com/romeerez/pg-transactional-tests) — that wraps each test in a transaction against the `pg` package directly.

It didn't fit us. The library assumes a fairly clean hook structure — transaction opens, test runs, transaction rolls back — and our suite doesn't play by those rules. We have describe blocks with real database writes happening in `before()`, not just `beforeEach()`, which a purely per-test wrapper would either miss entirely or roll back at the wrong time. And in more places than I'd like to admit, tests were quietly relying on state a previous test had left behind — which a library built around strict per-test isolation would break in ways that looked like the library's fault, not ours.

So more of this was failure than success at first: the off-the-shelf fix didn't fit our shape of problem, and untangling *why* it didn't fit taught us more about the suite's hidden assumptions than the fix itself ever did. What we ended up building — `transactionPerTest()` and `transactionPerDescribe()` — is the same core idea as that library, just built to cope with our `before()`-heavy, occasionally state-sharing suite instead of assuming a cleaner one.

`transactionPerTest()` now wraps every `it()` globally via `beforeEach`/`afterEach`. In the common case, you don't call anything yourself — you just write a normal, independent test, and the rollback happens for free underneath you.

That sentence undersells how much work it took to get there. But — as with most "just use the database properly" fixes — the real story is in the edge cases it surfaced once it was actually running against our suite.

## Edge case one: a `before()` that runs before any transaction exists

This one cost us a real, silently-leaking row before we understood it.

`transactionPerTest()` opens and rolls back its transaction from `beforeEach`/`afterEach`, which Mocha runs *per test*. A describe-level `before()` runs once, and — crucially — runs before the first `beforeEach` of that suite fires. Which means: if a `before()` writes to the database directly, and nothing further up the chain has already opened a transaction, that write goes straight to the real connection. There's no transaction for `afterEach` to roll back, so the row just... stays. Forever, or until someone notices.

```ts
// ❌ Leaks a real, permanent row — before() runs before any
// per-test transaction exists, so this insert is never rolled back.
describe('LpaCase#willsuiteStatus', () => {
  let lpaCase: LpaCase

  before(async () => {
    lpaCase = await lpaCaseFactory({ status: 'in_progress' })
  })

  it('returns the mapped status for in_progress', () => {
    expect(lpaCase.willsuiteStatus).to.equal('IN_PROGRESS')
  })
})
```

The fix is `transactionPerDescribe()`, called as the first line of the block, so its own `before()` opens a transaction before the fixture-creating `before()` gets a chance to run (Mocha runs `before()` hooks outside-in, so this ordering is guaranteed):

```ts
// ✅ transactionPerDescribe()'s before() runs first, so the fixture
// is created inside a transaction and rolled back once the describe finishes.
describe('LpaCase#willsuiteStatus', () => {
  transactionPerDescribe()

  let lpaCase: LpaCase

  before(async () => {
    lpaCase = await lpaCaseFactory({ status: 'in_progress' })
  })

  it('returns the mapped status for in_progress', () => {
    expect(lpaCase.willsuiteStatus).to.equal('IN_PROGRESS')
  })
})
```

By default this doesn't remove per-test isolation, either — the global per-test wrapping just becomes a nested savepoint on top of the describe's transaction, so individual tests still can't leak into each other. It only changes where the *shared* fixture setup lives. There's an opt-in flag, `skipIndividualTransaction`, that removes that per-test nesting entirely and lets tests deliberately share state — but that reintroduces exactly the ordering-dependent fragility we were trying to get rid of, so it's a deliberate, rare choice, not a default.

We didn't just write this down and hope people remembered — a `before()` leaking a real row was exactly the kind of thing everyone agrees is bad and then does anyway six months later, so there's now a custom ESLint rule (`require-transaction-wrapper-for-before`) that flags any describe-level `before()` without `transactionPerDescribe()` or `skipTransactionWrapping()` somewhere in its own or an ancestor describe. A `before()` that never touches the database can opt out with a plain disable comment — but by default, the lint rule assumes guilty until proven innocent.

## Edge case two: when a test needs a real, aborted transaction

Postgres aborts an *entire* transaction on any query error — not just the failing query. Every later query on that connection fails with "current transaction is aborted" until something rolls back, in full or to a savepoint. A `try`/`catch` around the failing query doesn't save you from this on its own.

That's a real problem once every test is already running inside an ambient transaction: a test that deliberately triggers and recovers from a DB-level error (say, a unique constraint violation) can take down every query that runs afterwards in that test, or worse, in a later one on the same connection.

The fix, `runInSavepoint()`, runs the risky call inside its own nested savepoint on top of whatever transaction is already active, and only rolls back *that*, leaving the ambient transaction healthy:

```ts
try {
  await runInSavepoint(() =>
    Country.query().insert({ id: duplicateId, name: 'Second', code: 'ZZ-D2' })
  )
} catch (error) {
  // the savepoint was rolled back, not the ambient (per-test) transaction —
  // so this query still works instead of failing with
  // "current transaction is aborted"
  expect(await Country.query().findOne({ code: 'ZZ-D1' })).to.exist
}
```

It's not just a testing trick, either — it's the same pattern our production code already uses to catch a constraint violation mid-request without taking the whole request down.

For the handful of cases where none of this is enough — tests that need real, independent transactions racing each other (proving row locking works, for instance) — there's `skipTransactionWrapping(reason)`, which opts a block out entirely and falls back to a `clearDatabase()` safety net once it finishes. It's the escape hatch, not the default, and it comes with a mandatory `reason` so nobody has to reverse-engineer *why* a block needed it six months later.

## Edge case three: everything happens at the same instant

A smaller but more insidious one: rows created in the same test do end up with an identical `createdAt`, because Postgres's `now()` is fixed for the whole transaction rather than the wall clock. Depending on where the ambiguity actually bites, the fix is either a monotonic `nextCreatedAt()` in the factory, a real id-based tie-breaker in production code where the id is a reliable insertion-order surrogate, or — usually the right call — just asserting on the row's `id` instead of its position in an array. Not exotic, just another place the old truncate-based setup had been quietly hiding an assumption.

## What I'd tell past me

The tempting version of this story is "we replaced a flaky thing with a reliable thing." The more honest version is that the replacement exposed assumptions our tests had been quietly making for years — about ordering, about hook timing, about what "isolated" actually meant — that a full table wipe had been papering over the whole time.

None of the fixes above were exotic. A monotonic counter. A documented hook-ordering gotcha. A savepoint instead of a full rollback. The hard part wasn't the Postgres feature — it was noticing where our tests had been relying on `clearDatabase()`'s side effects without anyone writing that reliance down anywhere. If there's a lesson in here, it's the same one I keep relearning: the "obviously safe" cleanup step is usually hiding a few assumptions that are worth writing down before you rip it out, not after.

## The rabbit at the bottom of the hole

Here's the bit I keep coming back to. Partway through this, we hit a test that only ever failed once it was running inside a transaction — never before, never in isolation, only as part of the wider suite, only with rollback-based isolation switched on. That's about as unhelpful a signal as a test can give you: the thing you just built to make failures more honest was itself producing one, and it wasn't obvious whether the bug was in the test, the production code, or the new transaction plumbing.

It turned out to be a real bug — a genuine race in how state was shared between two things that used to be accidentally separated by `clearDatabase()`'s side effects, and were now sharing a transaction that made the collision visible for the first time. Not a bug in the new approach; a bug the new approach finally had the honesty to show us. I'm not entirely sure why that felt like such a big reveal at the time — it's "a test caught a real bug," which is the whole point of a test suite — but it did. Maybe because it was proof the whole exercise hadn't just moved the flakiness somewhere else.

That's the tree-and-rabbit of the title, really: VS Code's worktrees meant this didn't have to be my whole week to be worth chasing. I could spin the investigation off into its own worktree, on its own branch, and let it run as a side task while I stayed on my actual tickets in the main checkout — the kind of thing that, on paper, could have swallowed weeks of focus: a root-cause investigation, a rejected library, three edge cases, and a bug hiding under all of it. It still needed hand-holding, and it still went wrong more than once along the way — but that's what experience (and `git revert`) is for. In practice it stayed a contained side quest of a couple of days, running alongside everything else, without taking the rest of the work off track. Whatever else I take from this, that's the part worth remembering: the rabbit hole didn't need to become the whole week.

---

The full source for everything above — the transaction wrapper, the savepoint helper, the monotonic timestamp helper, and the ESLint rule — is up in the [complete code reference](/2026/09/15/a-broken-test-suite-a-tree-and-finding-a-rabbit/code-reference/), if you want to see it rather than take my word for it.
