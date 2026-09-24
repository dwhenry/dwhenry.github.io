---
title: "A broken test suite, a tree and finding a rabbit"
subtitle: "How we de-flaked our test suite by trusting a database feature that already existed"
date: 2026-09-15
structure: narrative-arc
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

I'm not always the best at leaving well enough alone. For years our test suite cleaned up after itself with all the elegance of a toddler tidying a bedroom by sweeping everything under the rug — it finally got to the point that it felt like it failed more than it passed (because it did - we had stats). Tests had always failed on occasion, but over the last 12 months it went from occasionally to most of the time, so one afternoon I thought I would have a look. I had 90 minutes left before I stopped.

> **Background:** the backend here is TypeScript, talking to Postgres through [Objection.js](https://vincit.github.io/objection.js/) (a library that the original developer is no longer supporting), with [Mocha](https://mochajs.org/) running the tests. `clearDatabase()` was our test suite's cleanup step — a helper that, when called, truncated every table, and then reseeded the database so the next test would start from a known state. It wasn't automatic: something had to actually call it, usually in an `after()`/`afterEach()` hook. Our VP had made multiple attempts to remove this, reducing the number of times it was called in the test suite, but before this change we still had >200.

## The problem we'd been living with

`clearDatabase()` was there when I joined the company. Coming from Ruby and RSpec, it felt insane that transactions weren't standard, but this was the test suite and it was hard to change — the kind of code nobody wants to be the one who breaks. Previous attempts had pruned the easy wins, but the mountain still loomed. It "worked," in the sense that the tests mostly ran and mostly went green, which is a very low bar we had somehow decided was good enough. However, as we added features, the failure rate kept climbing without anyone really noticing, because it had always failed a bit.

What did this mean? We had tests that failed in isolation but passed in the full run. When you start writing a new test you might have the database filled with the past 100 inserts, or it might be newly reset — there was no way to tell. I was used to test isolation; `clearDatabase()` did not give that, since it only ran when called. Further to that, it appeared to be the cause of our test failures, and we had no clear reason why. Sure, some failures were obvious (e.g. counts that didn't match), but most were just random timeouts.

I never believed that the `clearDatabase()` call caused the timeout, but the timeouts happened when it was running. I took a sample of errors and asked Claude to investigate - it agreed, `clearDatabase()` was at the center of the problem. Knowing what I do know, I could likely have fixed the test failures and kept `clearDatabase()`.

But a rabbit hole beckoned, and I still had 60 minutes left in the day, so down I went.

## Reaching for a feature that was already there

I started looking at testing with Objection and how others solved this problem. I found [pg-transactional-tests](https://github.com/romeerez/pg-transactional-tests): Postgres transactions, rolled back instead of committed — the pattern I was used to, the pattern I already knew I liked.

It didn't fit us. The library assumes a clean hook structure, `describe` blocks using `beforeEach` and `it`, but we had `before` blocks and shared state between tests. But the core concept could work — I saw the beginning of a solution: implement testing isolation by default with the library's code, then layer that with conditionals to escape transactions when needed. It wouldn't be pretty, but it was an improvement.

I started with `transactionPerTest()` — it wraps every `it()` globally via `beforeEach`/`afterEach` (same as the library). In the common case, you don't call anything yourself — you just write a normal, independent test, and the rollback happens for free underneath you.

## `before()` runs before `beforeEach`, so it's outside the transaction

For this I added `transactionPerDescribe()` — this could be added to test files to create a transaction around a `before` block (which executed before any `beforeEach` blocks). Objection.js allows nested transactions, and that's what this provided. It wasn't pretty, but it moved me towards my goal: stopping rows being committed to the database.

```ts
// transactionPerDescribe()'s before() runs first, so the fixture
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

By default this doesn't remove per-test isolation, either — the global per-test wrapping just adds a nested savepoint, which stops tests leaking into each other. But lots of our describe blocks actually depended on test leakage, and rewriting the test suite was not something I could do. So I added an opt-in flag, `skipIndividualTransaction`, to `transactionPerDescribe`, that stopped the per-test nested transaction. It still isolated the before block, but tests inside it could now share DB state, allowing the wider improvement without needing a major rewrite.

But leaking state was an issue, and having everyone remember to do this was a risk, so there's now a custom ESLint rule (`require-transaction-wrapper-for-before`) that flags any describe-level `before()` without `transactionPerDescribe()` or `skipTransactionWrapping()` somewhere in its own or an ancestor describe. A `before()` that never touches the database can opt out with a plain disable comment — but by default, the lint rule assumes guilty until proven innocent.

## Some tests need a real, aborted transaction

Fun fact, postgres aborts an _entire_ transaction on any query error — not just the failing query. Every later query on that connection fails with "current transaction is aborted" until something rolls back, in full or to a savepoint. A `try`/`catch` around the failing query doesn't save you from this on its own.

This was a hidden problem, made very visible once tests were executed inside a transaction: tests that deliberately trigger and recover from a DB-level error now just fail. We had seen this occasionally in the test run, but now it was a constant.

The fix, `runInSavepoint()`, runs the risky call inside its own nested transaction, and only rolls back _that_, leaving the ambient transaction healthy:

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

## Everything happens at the same instant

A smaller but more insidious issue is that records created in the same transaction all share the same `createdAt` timestamp. Why? Because Postgres's `now()` is fixed for the whole transaction. This highlighted broken tests and code that passed due to default ordering logic that wasn't explicit.

## The rabbit at the bottom of the hole

Was the time invested worth it (2 hours dedicated to the task, plus 2 days of Claude fixing bugs in the background with occasional input)? It didn't fix everything and there is still work to do, but we exposed assumptions our tests had been quietly making for years — about ordering, about hook timing, about what "isolated" actually meant — that a full table wipe had been papering over the whole time.

But yes, I think so, and the rabbit, well my boss was happy — he was the one who had been working on this previously. I can already tell that our CI system is passing more consistently (after a few post-merge fixes). Overall this will save me time, but more than that it touches what I most enjoy about programming, finding a bug and fixing it.

---

The full source for everything above — the transaction wrapper, the savepoint helper, the monotonic timestamp helper, and the ESLint rule — is up in the [complete code reference](/2026/09/15/a-broken-test-suite-a-tree-and-finding-a-rabbit/code-reference/), if you want to see it rather than take my word for it.
