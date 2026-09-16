---
title: "A broken test suite, a tree and finding a rabbit"
subtitle: "How we de-flaked our test suite by trusting a database feature that already existed"
date: 2026-09-15
---

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Patrick+Hand&display=swap">
<figure class="ci-diary-sketch">
<style>
  .ci-diary-sketch { margin: 0 0 1.5rem; }
  .ci-diary-sketch svg { display: block; width: 100%; height: auto; border-radius: 8px; }
  .ci-diary-sketch figcaption { margin-top: 0.6rem; font-size: 0.85rem; color: var(--muted); }

@media (prefers-reduced-motion: reduce) {
.ci-diary-sketch .scene, .ci-diary-sketch .anim { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
}

.ci-diary-sketch .flash { fill: #ffffff; opacity: 0; }

.ci-diary-sketch .scene { animation-duration: 24s; animation-timing-function: linear; animation-iteration-count: infinite; }
.ci-diary-sketch .scene-idle { animation-name: idle-vis; }
.ci-diary-sketch .scene-ci { animation-name: ci-vis; opacity: 0; }
.ci-diary-sketch .scene-smash { animation-name: smash-vis; opacity: 0; }
.ci-diary-sketch .scene-sign { animation-name: sign-vis; opacity: 0; }

@keyframes idle-vis {
0%{opacity:1} 12.5%{opacity:1} 13.2%{opacity:0}
94%{opacity:0} 94.6%{opacity:1} 100%{opacity:1}
}
@keyframes ci-vis {
0%{opacity:0} 13.2%{opacity:0} 14%{opacity:1}
67.5%{opacity:1} 68.2%{opacity:0} 100%{opacity:0}
}
@keyframes smash-vis {
0%{opacity:0} 68.2%{opacity:0} 69%{opacity:1}
81.4%{opacity:1} 82.1%{opacity:0} 100%{opacity:0}
}
@keyframes sign-vis {
0%{opacity:0} 81.4%{opacity:0} 82.3%{opacity:1}
94%{opacity:1} 94.6%{opacity:0} 100%{opacity:0}
}
@keyframes flash-pulse {
0%,12.8%{opacity:0} 13.2%{opacity:.85} 13.6%{opacity:0}
67.8%{opacity:0} 68.2%{opacity:.85} 68.6%{opacity:0}
100%{opacity:0}
}
.ci-diary-sketch .flash { animation: flash-pulse 24s linear infinite; }

.ci-diary-sketch #bubble { animation: bubble-pop 24s linear infinite; transform-box: fill-box; transform-origin: 50% 100%; }
@keyframes bubble-pop {
0%,4%{opacity:0; transform:scale(.5)} 6%{opacity:1; transform:scale(1)}
11.2%{opacity:1; transform:scale(1)} 12.5%{opacity:0; transform:scale(.5)} 100%{opacity:0; transform:scale(.5)}
}
.ci-diary-sketch .type-bounce { animation: type-bounce .46s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 0%; }
.ci-diary-sketch #hand-right { animation-delay: .23s; }
@keyframes type-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }

.ci-diary-sketch #bar-fill { fill:#2f9e58; transform-box:fill-box; transform-origin:0% 50%; animation: bar-fill 24s linear infinite; }
@keyframes bar-fill {
0%,14%{ transform:scaleX(0); fill:#2f9e58 }
27%{ transform:scaleX(.75); fill:#2f9e58 }
27.3%{ transform:scaleX(.75); fill:#e0483f }
29.4%{ transform:scaleX(.75); fill:#e0483f }
30.2%{ transform:scaleX(0); fill:#2f9e58 }
31.7%{ transform:scaleX(0); fill:#2f9e58 }
45%{ transform:scaleX(.60); fill:#2f9e58 }
45.3%{ transform:scaleX(.60); fill:#e0483f }
47.7%{ transform:scaleX(.60); fill:#e0483f }
48.4%{ transform:scaleX(0); fill:#2f9e58 }
50%{ transform:scaleX(0); fill:#2f9e58 }
65%{ transform:scaleX(.99); fill:#2f9e58 }
65.3%{ transform:scaleX(.99); fill:#e0483f }
67.7%{ transform:scaleX(.99); fill:#e0483f }
68.3%{ transform:scaleX(0); fill:#2f9e58 }
100%{ transform:scaleX(0); fill:#2f9e58 }
}
.ci-diary-sketch #fail-1, .ci-diary-sketch #fail-2, .ci-diary-sketch #fail-3 { opacity: 0; }
.ci-diary-sketch #fail-1 { animation: fail-1 24s linear infinite; }
.ci-diary-sketch #fail-2 { animation: fail-2 24s linear infinite; }
.ci-diary-sketch #fail-3 { animation: fail-3 24s linear infinite; }
@keyframes fail-1 { 0%,27.2%{opacity:0} 27.5%{opacity:1} 29.4%{opacity:1} 30%{opacity:0} 100%{opacity:0} }
@keyframes fail-2 { 0%,45.2%{opacity:0} 45.5%{opacity:1} 47.7%{opacity:1} 48.2%{opacity:0} 100%{opacity:0} }
@keyframes fail-3 { 0%,65.2%{opacity:0} 65.5%{opacity:1} 67.7%{opacity:1} 68.1%{opacity:0} 100%{opacity:0} }

.ci-diary-sketch #retry-btn { opacity: 0; animation: retry-vis 24s linear infinite; }
@keyframes retry-vis {
0%,27.4%{opacity:0} 27.6%{opacity:1} 30.4%{opacity:1} 30.9%{opacity:0}
45.4%{opacity:0} 45.6%{opacity:1} 48.6%{opacity:1} 49.1%{opacity:0}
100%{opacity:0}
}
.ci-diary-sketch #cursor { opacity: 0; animation: cursor-move 24s linear infinite; transform-box: fill-box; transform-origin: 50% 50%; }
@keyframes cursor-move {
0%,28%{opacity:0; transform:translate(140px,-70px) scale(1)}
28.6%{opacity:1; transform:translate(0,0) scale(1)}
29.6%{opacity:1; transform:translate(0,0) scale(.8)}
30%{opacity:1; transform:translate(0,0) scale(1)}
30.6%{opacity:0; transform:translate(0,0) scale(1)}
46.2%{opacity:0; transform:translate(140px,-70px) scale(1)}
46.8%{opacity:1; transform:translate(0,0) scale(1)}
47.8%{opacity:1; transform:translate(0,0) scale(.8)}
48.2%{opacity:1; transform:translate(0,0) scale(1)}
48.8%{opacity:0; transform:translate(0,0) scale(1)}
100%{opacity:0}
}

.ci-diary-sketch #shake-group { animation: shake 24s linear infinite; }
@keyframes shake {
0%,76.6%{ transform:translate(0,0) }
76.8%{ transform:translate(-6px,2px) } 77%{ transform:translate(7px,-3px) }
77.2%{ transform:translate(-5px,3px) } 77.4%{ transform:translate(4px,-2px) }
77.7%{ transform:translate(0,0) } 100%{ transform:translate(0,0) }
}
.ci-diary-sketch #bat-arm { transform-origin: 283px 224px; animation: bat-swing 24s linear infinite; }
@keyframes bat-swing {
0%,69.3%{ transform:rotate(0deg) } 71%{ transform:rotate(-58deg) } 75%{ transform:rotate(-58deg) }
76.9%{ transform:rotate(38deg) } 78%{ transform:rotate(20deg) } 80.5%{ transform:rotate(20deg) }
81.4%{ transform:rotate(0deg) } 100%{ transform:rotate(0deg) }
}
.ci-diary-sketch #impact { opacity: 0; animation: impact 24s linear infinite; }
@keyframes impact { 0%,76.7%{opacity:0} 77%{opacity:1} 77.6%{opacity:1} 78.3%{opacity:0} 100%{opacity:0} }
.ci-diary-sketch #crack { opacity: 0; animation: crack 24s linear infinite; }
@keyframes crack { 0%,76.9%{opacity:0} 77.1%{opacity:1} 81.4%{opacity:1} 81.6%{opacity:0} 100%{opacity:0} }

.ci-diary-sketch #sign-inner { transform-box: fill-box; transform-origin: 50% 50%; animation: sign-pop 24s linear infinite; }
@keyframes sign-pop {
0%,82.1%{ transform:scale(.6) rotate(-3deg) } 82.6%{ transform:scale(1.06) rotate(-3deg) }
83%{ transform:scale(1) rotate(-3deg) } 94%{ transform:scale(1) rotate(-3deg) } 100%{ transform:scale(.6) rotate(-3deg) }
}
</style>
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rough sketch of a stick figure typing happily, watching a CI build fail at 75%, 60%, then 99% across three retries, smashing the computer with a bat, and holding up a sign that says tests getting you down, before looping.">
<defs>
<filter id="sketch" x="-30%" y="-30%" width="160%" height="160%">
<feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="noise"/>
<feDisplacementMap in="SourceGraphic" in2="noise" scale="4"/>
</filter>
<pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
<circle cx="2" cy="2" r="1.3" fill="#d7dee6"/>
</pattern>
</defs>

  <rect width="800" height="500" fill="#f2f5f7"/>
  <rect width="800" height="500" fill="url(#dots)"/>

  <!-- ============ SCENE 1: idle typing (side view) ============ -->
  <g class="scene scene-idle">
    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <rect x="230" y="330" width="340" height="14" rx="3" fill="#f7f9fb"/>
      <rect x="246" y="344" width="10" height="74"/>
      <rect x="540" y="344" width="10" height="74"/>
      <path d="M392 186 L400 186 Q432 190 428 239 Q432 288 400 292 L392 292 Z" fill="#f7f9fb"/>
      <rect x="336" y="314" width="128" height="16" rx="3"/>
      <rect x="398" y="292" width="14" height="26" fill="#f7f9fb"/>
      <path d="M382 318 L438 318 L432 330 L388 330 Z" fill="#f7f9fb"/>
    </g>

    <g id="bubble" transform="translate(-120,0)">
      <circle cx="486" cy="196" r="4" class="sketch" fill="none" stroke="#2b3440" stroke-width="2"/>
      <circle cx="500" cy="182" r="7" class="sketch" fill="none" stroke="#2b3440" stroke-width="2"/>
      <path class="sketch" d="M498 168 q-16 -18 4 -26 q10 -14 28 -8 q18 -10 30 4 q18 -2 20 16 q10 12 -4 22 q-4 14 -22 12 q-16 10 -30 -2 q-20 4 -26 -18 Z"
            fill="#f7f9fb" stroke="#2b3440" stroke-width="3"/>
      <path d="M514 150 l12 12 l22 -24" fill="none" stroke="#2f9e58" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="sketch"/>
    </g>

    <!-- chair -->
    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round">
      <path d="M248 218 L248 306"/>
      <path d="M248 302 L292 302"/>
    </g>

    <!-- person, profile facing the desk, head-to-hip ~ head-diameter x2 -->
    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="280" cy="200" r="20" fill="#f2f5f7"/>
      <path d="M261 189 q-8 -12 6 -16"/>
      <path d="M268 184 q-2 -10 10 -10"/>
      <path d="M300 197 L308 201 L300 206"/>
      <path d="M280 220 L286 300"/>
    </g>

    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round">
      <path d="M283 224 L316 248"/>
    </g>
    <g class="type-bounce" id="hand-left">
      <path class="sketch" d="M316 248 L360 276" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round">
      <path d="M283 230 L322 256"/>
    </g>
    <g class="type-bounce" id="hand-right">
      <path class="sketch" d="M322 256 L372 288" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round"/>
    </g>

  </g>

  <!-- ============ SCENE 2: CI zoom ============ -->
  <g class="scene scene-ci">
    <g class="sketch" fill="none" stroke="#2b3440" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="70" y="50" width="660" height="400" rx="8" fill="#f7f9fb"/>
    </g>
    <g class="sketch" fill="none" stroke="#6b7784" stroke-width="2">
      <rect x="100" y="82" width="600" height="290" fill="#eef1f4"/>
    </g>
    <g class="sketch" stroke="#2b3440" stroke-width="2">
      <circle cx="126" cy="104" r="6" fill="#e0483f"/>
      <circle cx="146" cy="104" r="6" fill="#ffd23f"/>
      <circle cx="166" cy="104" r="6" fill="#2f9e58"/>
    </g>
    <text x="400" y="112" text-anchor="middle" font-family="'Patrick Hand',cursive" font-size="19" fill="#6b7784" letter-spacing="1">ci · build pipeline</text>

    <rect class="sketch" x="200" y="230" width="400" height="30" rx="4" fill="none" stroke="#2b3440" stroke-width="3"/>
    <rect id="bar-fill" x="200" y="230" width="400" height="30" rx="2"/>

    <g id="fail-1"><text x="400" y="302" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="34" fill="#e0483f" transform="rotate(-2 400 290)">failed — 75%!</text></g>
    <g id="fail-2"><text x="400" y="302" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="34" fill="#e0483f" transform="rotate(-2 400 290)">failed — 60%!</text></g>
    <g id="fail-3"><text x="400" y="302" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="34" fill="#e0483f" transform="rotate(-2 400 290)">failed — 99%!!</text></g>

    <g id="retry-btn">
      <rect class="sketch" x="325" y="330" width="150" height="48" rx="6" fill="#f7f9fb" stroke="#3b6fd9" stroke-width="3"/>
      <text x="400" y="362" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="24" fill="#3b6fd9">retry?</text>
    </g>

    <g id="cursor" class="sketch">
      <path d="M400 355 L400 384 L406 377 L412 388 L417 385 L411 375 L420 373 Z" fill="#2b3440" stroke="#2b3440" stroke-width="1"/>
    </g>

  </g>

  <!-- ============ SCENE 3: smash (side view) ============ -->
  <g class="scene scene-smash">
    <g id="shake-group">
      <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="230" y="330" width="340" height="90" rx="4"/>
        <path d="M392 186 L400 186 Q432 190 428 239 Q432 288 400 292 L392 292 Z" fill="#f7f9fb"/>
        <rect x="336" y="342" width="128" height="16" rx="3"/>
        <rect x="398" y="292" width="14" height="26" fill="#f7f9fb"/>
        <path d="M382 318 L438 318 L432 330 L388 330 Z" fill="#f7f9fb"/>
      </g>
      <path id="crack" class="sketch" d="M400 200 L418 222 L408 232 L422 248 L410 260 L424 276" fill="none" stroke="#e0483f" stroke-width="3" stroke-linejoin="round"/>
      <path id="impact" class="sketch" d="M410 162 L418 142 L424 164 L442 148 L432 170 L454 168 L434 182 L450 196 L428 188 L430 210 L416 192 L400 206 L404 184 L384 188 L402 174 Z" fill="#ffd23f" stroke="#2b3440" stroke-width="2"/>
      <text id="impact-txt" x="438" y="136" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="28" fill="#2b3440" transform="rotate(6 438 136)" opacity="0" style="animation:impact 24s linear infinite">smash!</text>

      <!-- person, profile, standing to swing -->
      <g class="sketch" fill="none" stroke="#2b3440" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="280" cy="195" r="20" fill="#f2f5f7"/>
        <path d="M261 184 q-8 -12 6 -16"/>
        <path d="M268 179 q-2 -10 10 -10"/>
        <path d="M300 192 L308 196 L300 201"/>
        <path d="M280 215 L288 300"/>
        <path d="M285 300 L270 330"/>
        <path d="M291 300 L306 330"/>
      </g>

      <g id="bat-arm" class="sketch" stroke="#2b3440" stroke-width="3" stroke-linecap="round">
        <path d="M283 224 L326 206" fill="none"/>
        <circle cx="326" cy="206" r="6" fill="#f2f5f7"/>
        <path d="M326 206 L398 168" fill="none" stroke="#c99a5b" stroke-width="9"/>
        <ellipse cx="400" cy="167" rx="11" ry="8" fill="#8a5a2b" stroke="#2b3440" stroke-width="2" transform="rotate(-27 400 167)"/>
      </g>
    </g>

  </g>

  <!-- ============ SCENE 4: sign ============ -->
  <g class="scene scene-sign">
    <g id="sign-inner">
      <rect class="sketch" x="210" y="150" width="380" height="200" rx="4" fill="#f7f9fb" stroke="#2b3440" stroke-width="4"/>
      <text x="400" y="230" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="42" fill="#2b3440">ci getting</text>
      <text x="400" y="280" text-anchor="middle" font-family="'Caveat',cursive" font-weight="700" font-size="42" fill="#2b3440">you down?</text>
      <path class="sketch" d="M300 288 q100 14 200 0" fill="none" stroke="#e0483f" stroke-width="3"/>
      <text x="400" y="322" text-anchor="middle" font-family="'Patrick Hand',cursive" font-size="18" fill="#6b7784">— just never merge</text>
    </g>
  </g>

  <rect class="flash" width="800" height="500"/>
</svg>
<figcaption>CI Fail</figcaption>
</figure>

I'm not always the best at leaving well enough alone. For years our test suite cleaned up after itself with all the elegance of a toddler tidying a bedroom by sweeping everything under the rug: when needed, we called `clearDatabase()` and truncated every table. Simple. Confident. Wrong, not in the dramatic "everything's on fire" sense, but a slow death by a thousand cuts — one that had apparently crept up to failing around 50% of test runs by the time I found out, which someone mentioned to me only once I was already elbow-deep in replacing it.

## The problem we'd been living with

`clearDatabase()` had been there so long it had achieved a sort of tenure — untouchable, load-bearing, the kind of code nobody wants to be the one who breaks. Previous attempts had pruned the easy wins, but the mountain still loomed. It "worked," in the sense that the tests mostly ran and mostly went green, which is a very low bar we had somehow decided was good enough. As the suite grew into the thousands of tests, two things kept nagging at me, each more embarrassing than the last:

- **It didn't actually guarantee isolation — it just _looked_ like it did.** `clearDatabase()` only ran _when called_, which is a generous way of saying it ran whenever someone remembered to call it. Two tests in the same `describe` regularly depended on each other's leftovers, and in fact plenty of tests had come to depend on exactly that — meaning they couldn't be run in isolation without falling over, which rather defeats the point of calling it "isolation" in the first place.
- **And that's exactly what caused the flakiness.** Because isolation only ever existed on paper, whether a test passed depended on what had run before it, in what order, and under what conditions — which is a fancy way of saying it was basically luck. Locally, with everyone running a handful of files at a time, that luck mostly held. Under CI, with the full suite running in whatever order and however much parallelism it decided to use that day, the luck ran out — and because nothing about this was subtle, a single test's hidden dependency on another test's leftovers would cheerfully cascade into a dozen unrelated failures, none of which had anything to do with the code actually being tested.

That last one is the kind of bug that quietly kills trust in your own test suite. A red build that's "probably nothing, just re-run it" is worse than no test suite at all — at least an empty suite doesn't lie to you. Eventually nobody looks at red builds anymore, and at that point you don't have a safety net, you have a very expensive gut feeling.

## Reaching for a feature that was already there

This didn't start as "let's rewrite how the test suite cleans up." It started as a bug hunt — the cascade failures above needed a root cause, and the obvious first move was to see whether anyone else had already solved this. They had: Postgres transactions, rolled back instead of committed, are a well-known pattern for exactly this problem, and there's an existing library for it — [pg-transactional-tests](https://github.com/romeerez/pg-transactional-tests) — that wraps each test in a transaction against the `pg` package directly.

It didn't fit us. The library assumes a fairly clean hook structure — transaction opens, test runs, transaction rolls back — and our suite doesn't play by those rules. We have describe blocks with real database writes happening in `before()`, not just `beforeEach()`, which a purely per-test wrapper would either miss entirely or roll back at the wrong time. And in more places than I'd like to admit, tests were quietly relying on state a previous test had left behind — which a library built around strict per-test isolation would break in ways that looked like the library's fault, not ours.

So more of this was failure than success at first: the off-the-shelf fix didn't fit our shape of problem, and untangling _why_ it didn't fit taught us more about the suite's hidden assumptions than the fix itself ever did. What we ended up building — `transactionPerTest()` and `transactionPerDescribe()` — is the same core idea as that library, just built to cope with our `before()`-heavy, occasionally state-sharing suite instead of assuming a cleaner one.

`transactionPerTest()` now wraps every `it()` globally via `beforeEach`/`afterEach`. In the common case, you don't call anything yourself — you just write a normal, independent test, and the rollback happens for free underneath you.

That sentence undersells how much work it took to get there. But — as with most "just use the database properly" fixes — the real story is in the edge cases it surfaced once it was actually running against our suite.

## Edge case one: a `before()` that runs before any transaction exists

This one cost us a real, silently-leaking row before we understood it.

`transactionPerTest()` opens and rolls back its transaction from `beforeEach`/`afterEach`, which Mocha runs _per test_. A describe-level `before()` runs once, and — crucially — runs before the first `beforeEach` of that suite fires. Which means: if a `before()` writes to the database directly, and nothing further up the chain has already opened a transaction, that write goes straight to the real connection. There's no transaction for `afterEach` to roll back, so the row just... stays. Forever, or until someone notices.

```ts
// ❌ Leaks a real, permanent row — before() runs before any
// per-test transaction exists, so this insert is never rolled back.
describe("LpaCase#willsuiteStatus", () => {
  let lpaCase: LpaCase;

  before(async () => {
    lpaCase = await lpaCaseFactory({ status: "in_progress" });
  });

  it("returns the mapped status for in_progress", () => {
    expect(lpaCase.willsuiteStatus).to.equal("IN_PROGRESS");
  });
});
```

The fix is `transactionPerDescribe()`, called as the first line of the block, so its own `before()` opens a transaction before the fixture-creating `before()` gets a chance to run (Mocha runs `before()` hooks outside-in, so this ordering is guaranteed):

```ts
// ✅ transactionPerDescribe()'s before() runs first, so the fixture
// is created inside a transaction and rolled back once the describe finishes.
describe("LpaCase#willsuiteStatus", () => {
  transactionPerDescribe();

  let lpaCase: LpaCase;

  before(async () => {
    lpaCase = await lpaCaseFactory({ status: "in_progress" });
  });

  it("returns the mapped status for in_progress", () => {
    expect(lpaCase.willsuiteStatus).to.equal("IN_PROGRESS");
  });
});
```

By default this doesn't remove per-test isolation, either — the global per-test wrapping just becomes a nested savepoint on top of the describe's transaction, so individual tests still can't leak into each other. It only changes where the _shared_ fixture setup lives. There's an opt-in flag, `skipIndividualTransaction`, that removes that per-test nesting entirely and lets tests deliberately share state — but that reintroduces exactly the ordering-dependent fragility we were trying to get rid of, so it's a deliberate, rare choice, not a default.

We didn't just write this down and hope people remembered — a `before()` leaking a real row was exactly the kind of thing everyone agrees is bad and then does anyway six months later, so there's now a custom ESLint rule (`require-transaction-wrapper-for-before`) that flags any describe-level `before()` without `transactionPerDescribe()` or `skipTransactionWrapping()` somewhere in its own or an ancestor describe. A `before()` that never touches the database can opt out with a plain disable comment — but by default, the lint rule assumes guilty until proven innocent.

## Edge case two: when a test needs a real, aborted transaction

Postgres aborts an _entire_ transaction on any query error — not just the failing query. Every later query on that connection fails with "current transaction is aborted" until something rolls back, in full or to a savepoint. A `try`/`catch` around the failing query doesn't save you from this on its own.

That's a real problem once every test is already running inside an ambient transaction: a test that deliberately triggers and recovers from a DB-level error (say, a unique constraint violation) can take down every query that runs afterwards in that test, or worse, in a later one on the same connection.

The fix, `runInSavepoint()`, runs the risky call inside its own nested savepoint on top of whatever transaction is already active, and only rolls back _that_, leaving the ambient transaction healthy:

```ts
try {
  await runInSavepoint(() =>
    Country.query().insert({ id: duplicateId, name: "Second", code: "ZZ-D2" }),
  );
} catch (error) {
  // the savepoint was rolled back, not the ambient (per-test) transaction —
  // so this query still works instead of failing with
  // "current transaction is aborted"
  expect(await Country.query().findOne({ code: "ZZ-D1" })).to.exist;
}
```

It's not just a testing trick, either — it's the same pattern our production code already uses to catch a constraint violation mid-request without taking the whole request down.

For the handful of cases where none of this is enough — tests that need real, independent transactions racing each other (proving row locking works, for instance) — there's `skipTransactionWrapping(reason)`, which opts a block out entirely and falls back to a `clearDatabase()` safety net once it finishes. It's the escape hatch, not the default, and it comes with a mandatory `reason` so nobody has to reverse-engineer _why_ a block needed it six months later.

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
