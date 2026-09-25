---
title: "A solution that broke out tests"
subtitle: "Objections.js's executionPromise - a hidden background worker"
summary: "Objection.js's executionPromise let us defer a job until a transaction committed, then quietly broke half our test runs — capturing it like a job queue fixed that."
date: 2026-09-17
---

Some bugs break tests, and some hide in the shadows — and as we copied the pattern, the rot spread, we didn't even notice, attributing it to a single flakey test, when it was 50% of test runs.

## The problem: a transaction wrapping a deeply nested call, that needed to trigger a background job.

Nested inside a critical process we needed to trigger a job (this job needed to delay until the transaction complete - as it needed to requery the current state from the DB). This was bad design, but also what we had to work with. Using the executionPromise allowed us to avoid returning a flag for a single execution path - a pattern that we had spread through teh codebase - just to trigger a job.

```ts
if (conditon0()) {
  trx.transaction(trx1 =>  call1(trx1))
}

const call1 (trx1) => () =>{
  if (condition1()) {
    trx1.transaction(trx2 =>  return call2(trx2)
  }
  return noCallBackRequired()
}

const call2 (trx2) => () =>{
  if (condition2()) {
    trx2.transaction(trx3 =>  return call2(trx3)
  }
  return noCallBackRequired()
}
......
const callN (trxN) => () =>{
  if (conditionN()) {
    // we need to wait for the transaction to commit before this code executes
    trxN.executionPromise.then(() => {
      callExternalService()
    })
  }
  return noCallBackRequired()
}
```

]
_"we need to wait for the transaction to commit"_ — highlights the problem. The enqueue can't run inside the transaction, because the transaction might not be finished before the job starts. Just return a flag that would allow us to run the process after teh commit. But this function is called from multiple points in the application, so that a[pproach woudl spread the smell, making it harder to unwind in the future. ], It also can't run synchronously right after `trx.commit()`, as mention we could because return a flag, but that is a smeel, expecially when "right after commit" — it's N function calls and four conditionals away from whoever actually owns the transaction and decides when it commits.

## Why executionPromise, and what we didn't do instead

Objection's `Transaction` exposes `executionPromise`, which resolves once the transaction settles — commit or rollback, either way. Attaching to it with `.then()` gives you exactly the guarantee you need at exactly the point in the code where you need it, no matter how deep that point is:

```ts
trx.executionPromise.then(fn);
```

That's the entire mechanism. No return value has to travel back up through `enqueueInvoiceRequest` → `convertProduct` → the product-dispatch switch → whatever called that, just to tell the transaction's owner "also run this once you're done." Every intermediate function stays exactly as it is.

We did consider the alternatives, briefly:

- **Thread the deferred action back out through the return value**, and let the code that actually owns the transaction run it after commit. This is the "correct" version in some abstract sense — no fire-and-forget, no ambient coupling to a transaction object passed four calls deep. It's also a real cost: every function between the enqueue and the transaction's owner would need its return type widened to carry "oh, and also run this afterwards," purely to plumb one job dispatch through call sites that have nothing to do with it. Given that we had multiple use cases like this it just didn't make sense.
- **Just delay it.** Fire the job on a `setTimeout` a few hundred milliseconds after the write, on the assumption the transaction will have committed by then. This isn't a guarantee, it's a bet — one that gets worse under load, not better, since a slow commit and a fast timer are exactly the conditions you'd expect during the traffic spike you most need this to be correct for.

`executionPromise` won on both counts: it's precise (it resolves on the actual event, not a guess about timing), and it's local (the code that needs the deferral is the only code that has to know about it).

## The CI failure that got worse, not better

The trouble is that "fire-and-forget" and "test suite" don't get along. The first sign of it was a commit back in April with an admirably honest message: _"Add a executionPromise callback has made test more flakey"_ — the fix at the time was a global Mocha hook that stubbed the relevant client, wrapped its deferred callback in a 2-second timeout, and collected any errors to re-throw in a global `afterEach`. It made the symptom quieter without doing anything about the cause: a callback that isn't awaited by anything can still be running, or about to run, after the test that triggered it has already finished and moved on.

It didn't go away. It got worse, and predictably so, once we started rolling out transaction-based test isolation more broadly — every test now ran inside its own transaction that got rolled back at the end. That's a good change on its own merits, but it also changed where a callback firing "late" actually landed: instead of writing to an already-cleaned-up database, it wrote straight into whatever other test happened to have its own transaction open at that exact moment, silently adding a row to whatever that test was counting, a row that wasn't part of a transaction, and wouldn't get rolled back. Small suites rarely lined up that unluckily. Running the full suite did, as a handful of count assertions that failed for no reason anyone could reproduce in isolation.

## Reframing executionPromise as a background job, not a callback

The thing that actually unlocked the fix was stepping back from "this is a callback attached to a transaction" and treating it as what it really is: background job execution, deferred past a boundary the test environment doesn't otherwise care about. Once it's framed that way, the fix looks exactly like how you'd handle any other job queue in tests — don't run it for real, capture it, and let the test decide if and when to run it:

```ts
export const attachToExecutionPromise = (
  trx: Transaction,
  description: string,
  fn: () => Promise<void>,
): void => {
  if (ENV.NODE_ENV === "test") {
    capturedCallbacks.push({ description, fn });
    return;
  }

  trx.executionPromise.then(fn);
};
```

Under test, nothing fires unawaited and nothing can outlive the test that triggered it — the callback just sits in an array until something asks for it by name, or the next test's `beforeEach` clears it out. A test that cares can pull its own callback out with `getCapturedExecutionPromiseCallback('invoice-enqueue')` and run it deliberately, on its own schedule, same as it would call any other job handler directly.

It wasn't a total, clean victory, though — worth saying, since that's the more honest version of this story. One integration test, after adopting this fix, still leaked a row into unrelated tests at full-suite scale, from somewhere in the same request flow that this fix didn't reach. We had a custom patch for it until we figure out a proper fix, and a comment saying as much, rather than a triumphant "and then everything was fine." Sometimes the honest state of a fix is "this part's solved, that part's still open," and it's better to write that down than to pretend otherwise.

---

The full source — `attachToExecutionPromise()`, the capture/flush test helpers, and the wiring into the test suite — is up in the [complete code reference](/2026/09/17/a-background-job-hiding-three-conditionals-deep/code-reference/), if you want the whole thing rather than the excerpts above.
