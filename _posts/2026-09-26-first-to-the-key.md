---
title: "First to the key! First to the egg!"
subtitle: "The future is closer than you think"
summary: "A 15-month env-var migration that never moved, finished in two days with AI doing the typing and me doing the steering — plus the bugs the types dug up."
date: 2026-09-26
structure: in-medias-res
---

Every env var in the app finally had a type. All 146 of them, each one checked against every environment config to work out if it should be required or optional (tedious, but it had to be done). I ran the tests, sat back feeling pretty pleased with myself... and it all went red.

```
TypeError: Cannot stub non-existent property
```

Turns out typing our environment variables hadn't been done because our code didn't want types. It was happy failing silently with what it already had. Fix that, and the failures stop being silent. It was the point I realised this wasn't going to be a simple find and replace.

So how did we get here? The new typed env module was added back in June 2025, it was a better solution, the old module even got a `@deprecated` comment pointing at it — the plan being to replace old imports as we touched the code. It didn't happen, I have the stats to prove it:

| Date        | Files using the old module | Files using the new module |
| ----------- | -------------------------: | -------------------------: |
| Jun 2025    |                        241 |                          2 |
| Sep 2025    |                        241 |                         11 |
| Dec 2025    |                        229 |                         52 |
| Mar 2026    |                        232 |                         67 |
| Jun 2026    |                        229 |                        110 |
| 24 Sep 2026 |                        217 |                        153 |
| 25 Sep 2026 |                        107 |                        273 |
| 26 Sep 2026 |                          0 |                        389 |

New code used the new module, old code stayed exactly where it was, and at one point the old way had actually gained files. 15 months, and we'd moved a grand total of 24.

It reminds me of the first race in _Ready Player One_. Everyone puts their foot down and heads for the finish line, King Kong smashes them all, and nobody ever gets there... until Parzival works out the trick is to go backwards. I'm not sure how far the metaphor stretches, since we didn't go backwards like Parzival. But we sure as hell didn't finish the race as expected either — a common trait with migrations in our codebase.

Those last two rows were an hour or so at the end of two days (plus a little overtime). It wasn't a sprint goal or a ticket, it was a side project, running in its own git worktree while I got on with my actual work, with AI doing most of the typing and me doing the steering (and the reviewing, lots of reviewing). I've talked about working this way before, and I'll go into it properly in a future post.

A change touching this many files could easily turn into a mess, especially with an AI doing the bulk of the work. So before it started, we agreed some ground rules — and "agreed" here means I set them and then spent the day making sure they were actually being followed:

1. Type everything first, change nothing else. The first commit just added the 146 missing vars to the schema, no code moved. I used the actual settings to determine which variables could be required (present in all envs), then made the code deal with the types that came back for each.
2. Limit the scope of each commit, migrating the code in chunks (we use product slices here).
3. Stub, don't mutate. A lot of the old tests just assigned values straight onto `ENV`, then "reset" them to hard-coded values rather than the real config. I would never follow this pattern and am glad this refactor could remove it — another rule for the AI?
4. When a var can be missing, decide what happens — don't guess. Most of the time the answer was a new helper, `getRequiredInProduction`, which blows up if the var is missing in production and returns `undefined` everywhere else, so the code can just skip whatever it was about to do.

And then there were the bugs, the slight differences between the new and old approach, areas where types highlighted silent failures — or even loud ones that we had been muting. Plus some dead code we finally deleted. None of these changes fix a codebase, but they add up; they result in a better system that is easier to extend.

The tests weren't much better. One suite only passed because later tests relied on a value leaked from the first block, some feature flag stubs were never being put back, and a handful of tests only passed because a Slack channel var happened to be unset.

> First to the key!
>
> First to the egg!
>
> — Wade and Aech, _Ready Player One_

And then the race was over. The old module is gone — deleted, along with its `@deprecated` comment. A migration that spent 15 months without a finish line crossed it in two days.

And it isn't the only one. When I actually took notice, I found six migrations in this codebase that had been started and never finished. This one is finished... the other five are still sat on the starting line, but I don't imagine it will stay that way for long.

So when you are next waiting for your task to finish — AI, test suite or something else — maybe that thing you could never get to could be done now.

<!-- if 'Arran France' is reading this... just tell me how, you fucker -->
