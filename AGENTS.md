# dwhenry.github.io

Personal blog built with Jekyll. Posts live in `_posts/`, named `YYYY-MM-DD-title-slug.md`.

## Writing tone for blog posts

When drafting or editing a post, match the tone of the most recently *dated* post(s)
in `_posts/` (sort by the date in the filename, not file mtime — migrated posts can
have newer mtimes but older dates). Read at least the single latest post before writing.

Rules:
- Follow the tone, don't set it. The latest post is the reference for voice,
  sentence rhythm, how self-deprecating/dry the humour is, how technical detail is
  woven into narrative, and formatting habits (headings, callouts, code blocks,
  footer links). Match it as-is.
- If the user's own draft or instructions for a new post imply a tone shift, that's
  fine — the user drives tone changes, not the assistant. Don't "improve," neutralize,
  or drift the tone toward a generic/default AI writing voice on your own initiative.
- Don't average across the whole archive. Older posts (pre-2020ish) are a different
  era of this blog's voice; they're historical context, not the target to match.
- If a post is a big outlier from its neighbors, treat it as the new baseline going
  forward rather than reverting to older posts — tone is allowed to evolve, it just
  shouldn't evolve because the assistant nudged it.

## Post structure: rotate templates, don't default to one shape

Two posts in a row (2026-09-15, 2026-09-17) used the identical shape — problem,
alternatives considered, complication, "reframe" twist, honest caveat, footer link —
and it read as obviously AI-generated *because* it was the same scaffold twice, not
because of any one sentence. Older posts in this blog have no such consistent shape:
some have no headings at all, some are just numbered solutions, some are a straight
chronological account. Avoid defaulting to one "essay" template.

**Template list** (add to this list over time; don't treat it as fixed):
- `diary` — chronological, first-person, minimal/no headings, reads like a log entry.
- `problem-solutions` — states the problem once, then heads for each candidate fix
  tried (`## Solution 1`, `## Solution 2`, ...), picks a winner.
- `in-medias-res` — opens mid-scene/mid-incident, backfills context afterward, ends
  on the resolution without a tidy "lesson" wrap-up paragraph.
- `plain-essay` — no headings at all, a handful of paragraphs, conversational.
- `walkthrough` — step-by-step, code-first, narration kept to a minimum between steps.
- `list-of-lessons` — short intro, then the bulk of the post is a numbered/bulleted
  list of concrete takeaways rather than a flowing narrative.

**Selecting one, mechanically (not by just picking what feels different):**
1. Find the template of the most recent post: check its front matter for a
   `structure:` field (e.g. `structure: diary`). If recent posts predate this field,
   treat their shape as `narrative-arc` (the problem → alternatives → reframe →
   caveat shape used above) for the purposes of exclusion.
2. Run an actual random pick, excluding that one template. This repo always has
   Ruby available (it's a Jekyll site), so use it rather than `shuf` (not on macOS):
   `ruby -e "puts (%w[diary problem-solutions in-medias-res plain-essay walkthrough list-of-lessons] - ['<last-template>']).sample"`
   Don't substitute your own judgement for the RNG here — the point is to avoid
   the assistant's own bias toward one "safe" shape.
3. Add `structure: <chosen>` to the new post's front matter (not rendered, just
   metadata for the next run of this rule) and actually write to that shape —
   picking a template and then writing the usual essay anyway defeats the point.

**Regardless of template**, avoid these specific tics regardless of which shape is
chosen, since they're AI tells independent of structure:
- Bulleted lists where every item starts with a **bold lead-in phrase**.
- Meta-commentary about the post's own honesty ("worth saying, since that's the more
  honest version of this story", "the honest state of a fix is...").
- A "the real twist is reframing X as Y" beat as the pivot of the piece.
- A mandatory footer link to a code-reference page — only add one when there's
  genuinely too much code to inline, not as a habit every post repeats.

## Git workflow: commit straight to main

This is a personal blog — no PRs, no feature branches. Commit new posts and edits
directly on `main` and `git push origin main`. Don't create `post/...` branches or
open pull requests unless explicitly asked.

## Stage before each round of edits

When working on a post, `git add` it before making changes to it — both before
the assistant edits and before handing a draft over for the user to edit — so
`git diff` shows only the latest round of changes. Stage again after each round
is reviewed.
