# Migration notes: blog.decoybecoy.com -> Jekyll

Migrated on 2026-09-15. Source: the Tumblr blog at `https://blog.decoybecoy.com`, paginated via `/page/2` through `/page/7` (plus the root page). 69 posts were found in total; 68 were newly converted into `_posts/` in this pass. The 69th, "A broken test suite, a tree and finding a rabbit" (2026-09-15), was already present in `_posts/` before this migration started and was left untouched.

Two posts were missed by the first pagination pass (their titles didn't surface in the page-by-page listing) and were only found by cross-checking the raw HTML of each page against the rendered summaries:
- "So I have an idea but no design" (post id `138723051723`) — sits on the same page as, and has a very similar post id to, "Github groups" (`138729076263`); the two were initially conflated as one post.
- "Criteria pattern for complex filtering in Ruby on Rails" (post id `98379626958`) on page 5.

Both are included below and have been migrated.

## Full post list (69), oldest first

| Date | Title | Original URL | Output file |
|---|---|---|---|
| 2014-08-20 | So I'm a blogger | https://blog.decoybecoy.com/post/95316278438/so-im-a-blogger | `2014-08-20-so-im-a-blogger.md` |
| 2014-08-20 | Angular generic error handling | https://blog.decoybecoy.com/post/95320421968/angular-generic-error-handling | `2014-08-20-angular-generic-error-handling.md` |
| 2014-08-21 | So what is the senior developer thing anyway | https://blog.decoybecoy.com/post/95390653778/so-what-is-the-senior-developer-thing-anyway | `2014-08-21-so-what-is-the-senior-developer-thing-anyway.md` |
| 2014-08-22 | Process Queue v's Promise Chain | https://blog.decoybecoy.com/post/95442664247/process-queue-vs-promise-chain | `2014-08-22-process-queue-vs-promise-chain.md` |
| 2014-08-22 | You're doing it wrong.. | https://blog.decoybecoy.com/post/95499244208/youre-doing-it-wrong | `2014-08-22-youre-doing-it-wrong.md` |
| 2014-08-22 | loved this so much i had to share it.. (photo post) | https://blog.decoybecoy.com/post/95499900748/loved-this-so-much-i-had-to-share-it-pretty-sure | `2014-08-22-loved-this-so-much-i-had-to-share-it-pretty-sure.md` |
| 2014-08-23 | Why was this sooo hard | https://blog.decoybecoy.com/post/95501341793/why-was-this-sooo-hard | `2014-08-23-why-was-this-sooo-hard.md` |
| 2014-08-27 | I Love my dog | https://blog.decoybecoy.com/post/95945966553/i-love-my-dog | `2014-08-27-i-love-my-dog.md` |
| 2014-08-27 | Dynamic Directive Injection | https://blog.decoybecoy.com/post/95948573553/dynamic-directive-injection | `2014-08-27-dynamic-directive-injection.md` |
| 2014-08-28 | Don't fear the delete button | https://blog.decoybecoy.com/post/96032760338/dont-fear-the-delete-button | `2014-08-28-dont-fear-the-delete-button.md` |
| 2014-08-29 | Time v's Output | https://blog.decoybecoy.com/post/96118524688/time-vs-output | `2014-08-29-time-vs-output.md` |
| 2014-09-02 | Are all editors equal? | https://blog.decoybecoy.com/post/96479390698/are-all-editors-are-equal | `2014-09-02-are-all-editors-are-equal.md` |
| 2014-09-03 | Is that an object I see in your pocket.. | https://blog.decoybecoy.com/post/96564839868/is-that-an-object-i-see-in-your-pocket | `2014-09-03-is-that-an-object-i-see-in-your-pocket.md` |
| 2014-09-04 | It was like that when I found it.. | https://blog.decoybecoy.com/post/96644876688/it-was-like-that-when-i-found-it | `2014-09-04-it-was-like-that-when-i-found-it.md` |
| 2014-09-05 | It's all about the learning | https://blog.decoybecoy.com/post/96733063883/its-all-about-the-learning | `2014-09-05-its-all-about-the-learning.md` |
| 2014-09-08 | Merging never hurt anyone | https://blog.decoybecoy.com/post/96997785773/merging-never-hurt-anyone | `2014-09-08-merging-never-hurt-anyone.md` |
| 2014-09-09 | Start small | https://blog.decoybecoy.com/post/97086311213/start-small | `2014-09-09-start-small.md` |
| 2014-09-11 | Meta, meta, meta.. | https://blog.decoybecoy.com/post/97241041118/meta-meta-meta | `2014-09-11-meta-meta-meta.md` |
| 2014-09-11 | I assume this is right.. | https://blog.decoybecoy.com/post/97256269473/i-assume-this-is-right | `2014-09-11-i-assume-this-is-right.md` |
| 2014-09-19 | Is being lazy bad for you? | https://blog.decoybecoy.com/post/97921403963/is-being-lazy-bad-for-you | `2014-09-19-is-being-lazy-bad-for-you.md` |
| 2014-09-20 | Drugs are bad.. | https://blog.decoybecoy.com/post/98003374743/drugs-are-bad | `2014-09-20-drugs-are-bad.md` |
| 2014-09-21 | Value your happiness | https://blog.decoybecoy.com/post/98094101808/value-your-happiness | `2014-09-21-value-your-happiness.md` |
| 2014-09-23 | Don't chase your tail. | https://blog.decoybecoy.com/post/98224273453/dont-chase-your-tail | `2014-09-23-dont-chase-your-tail.md` |
| 2014-09-25 | You want to "what" now?? | https://blog.decoybecoy.com/post/98377365623/you-want-to-what-now | `2014-09-25-you-want-to-what-now.md` |
| 2014-09-25 | Criteria pattern for complex filtering in Ruby on Rails (link post) | https://blog.decoybecoy.com/post/98379626958/criteria-pattern-for-complex-filtering-in-ruby-on-rails | `2014-09-25-criteria-pattern-for-complex-filtering-in-ruby-on-rails.md` |
| 2014-10-09 | These are not the solutions you are looking for.. | https://blog.decoybecoy.com/post/99597953438/these-are-not-the-solutions-you-are-looking-for | `2014-10-09-these-are-not-the-solutions-you-are-looking-for.md` |
| 2014-10-27 | Blast from the past | https://blog.decoybecoy.com/post/101127205763/blast-from-the-past | `2014-10-27-blast-from-the-past.md` |
| 2014-10-28 | Clever.. Clever.. Clever.. | https://blog.decoybecoy.com/post/101158390383/clever-clever-clever | `2014-10-28-clever-clever-clever.md` |
| 2014-11-01 | Perception is everything | https://blog.decoybecoy.com/post/101531602643/perceptive-is-everything | `2014-11-01-perceptive-is-everything.md` |
| 2014-11-02 | A test too far? | https://blog.decoybecoy.com/post/101607032813/a-test-too-far | `2014-11-02-a-test-too-far.md` |
| 2014-11-05 | You want how much | https://blog.decoybecoy.com/post/101880665238/you-want-how-much | `2014-11-05-you-want-how-much.md` |
| 2014-11-27 | It can be cold on the outside.. | https://blog.decoybecoy.com/post/103725208878/it-can-be-cold-on-teh-outside | `2014-11-27-it-can-be-cold-on-teh-outside.md` |
| 2014-12-02 | Thinking before programming (link post) | https://blog.decoybecoy.com/post/104149515838/thinking-before-programming | `2014-12-02-thinking-before-programming.md` |
| 2014-12-03 | Setting myself up to fail | https://blog.decoybecoy.com/post/104238642683/setting-myself-up-to-fail | `2014-12-03-setting-myself-up-to-fail.md` |
| 2014-12-30 | Steve Tooke - Your tests want you to change your design (link post) | https://blog.decoybecoy.com/post/106594727828/steve-tooke-your-tests-want-you-to-change-your | `2014-12-30-steve-tooke-your-tests-want-you-to-change-your.md` |
| 2015-01-14 | Are interviews like speed dating? | https://blog.decoybecoy.com/post/108085042128/are-interviews-like-speed-dating | `2015-01-14-are-interviews-like-speed-dating.md` |
| 2015-01-28 | Fit for purpose? | https://blog.decoybecoy.com/post/109380380698/fit-for-purpose | `2015-01-28-fit-for-purpose.md` |
| 2015-01-28 | The future is unknown.. | https://blog.decoybecoy.com/post/109428898288/a-plan-for-the-future | `2015-01-28-a-plan-for-the-future.md` |
| 2015-02-02 | Don't rock the boat? | https://blog.decoybecoy.com/post/109913910113/dont-rock-the-boat | `2015-02-02-dont-rock-the-boat.md` |
| 2015-02-05 | Writing readable code | https://blog.decoybecoy.com/post/110191077138/writing-readable-code | `2015-02-05-writing-readable-code.md` |
| 2015-02-07 | Why I write bad code | https://blog.decoybecoy.com/post/110292981193/why-i-write-bad-code | `2015-02-07-why-i-write-bad-code.md` |
| 2015-02-07 | "Have you tried turning it off and on again" - a guide to surviving the end of the world | https://blog.decoybecoy.com/post/110352489358/the-big-reset-a-guide-to-surviving-the-end-of | `2015-02-07-the-big-reset-a-guide-to-surviving-the-end-of.md` |
| 2015-02-13 | Angular, and what I did wrong.. | https://blog.decoybecoy.com/post/110850690643/angular-and-what-i-did-wrong | `2015-02-13-angular-and-what-i-did-wrong.md` |
| 2015-02-15 | "If everyone else walked off a cliff, would you do it too" - mothers everywhere | https://blog.decoybecoy.com/post/111117484818/if-the-path-went-over-a-cliff-would-you-follow | `2015-02-15-if-the-path-went-over-a-cliff-would-you-follow.md` |
| 2015-02-18 | Angular v's React - and why I don't care | https://blog.decoybecoy.com/post/111364897338/angular-vs-react-and-why-i-dont-care | `2015-02-18-angular-vs-react-and-why-i-dont-care.md` |
| 2015-03-16 | Enthusiasm is dead.. Long live enthusiasm | https://blog.decoybecoy.com/post/113821738833/enthusiasm-is-dead-long-live-enthusiasm | `2015-03-16-enthusiasm-is-dead-long-live-enthusiasm.md` |
| 2015-03-29 | Are you in the "zone"? | https://blog.decoybecoy.com/post/114971529393/do-we-need-zone-defences | `2015-03-29-do-we-need-zone-defences.md` |
| 2015-03-29 | Rebasing - I always tread carefully. | https://blog.decoybecoy.com/post/114972703048/rebasing-and-why-you-should-tread-carefully | `2015-03-29-rebasing-and-why-you-should-tread-carefully.md` |
| 2015-04-16 | "As long as we don't neglect code cleanup..." (quote post) | https://blog.decoybecoy.com/post/116589346218/as-long-as-we-dont-neglect-code-cleanup-once | `2015-04-16-as-long-as-we-dont-neglect-code-cleanup-once.md` |
| 2015-04-23 | The value of goals | https://blog.decoybecoy.com/post/117197822453/the-value-of-goals | `2015-04-23-the-value-of-goals.md` |
| 2015-06-08 | State of mind over technology. | https://blog.decoybecoy.com/post/121054541378/state-of-mind-over-technology | `2015-06-08-state-of-mind-over-technology.md` |
| 2015-06-20 | Are you expert? | https://blog.decoybecoy.com/post/121963408613/are-you-expert | `2015-06-20-are-you-expert.md` |
| 2016-02-05 | Github groups | https://blog.decoybecoy.com/post/138729076263/github-groups | `2016-02-05-github-groups.md` |
| 2016-02-05 | So I have an idea but no design | https://blog.decoybecoy.com/post/138723051723/so-i-have-an-idea-but-no-design | `2016-02-05-so-i-have-an-idea-but-no-design.md` |
| 2016-02-11 | Uber | https://blog.decoybecoy.com/post/139137501928/uber | `2016-02-11-uber.md` |
| 2016-02-18 | A little change | https://blog.decoybecoy.com/post/139561515943/a-little-change | `2016-02-18-a-little-change.md` |
| 2016-09-07 | Why are you trolling me? | https://blog.decoybecoy.com/post/150075967658/why-are-you-trolling-me | `2016-09-07-why-are-you-trolling-me.md` |
| 2017-03-06 | Where does the time go? | https://blog.decoybecoy.com/post/158074970278/where-does-the-time-go | `2017-03-06-where-does-the-time-go.md` |
| 2017-03-11 | Who is that horrid little developer? | https://blog.decoybecoy.com/post/158272978088/who-is-that-horrid-little-developer | `2017-03-11-who-is-that-horrid-little-developer.md` |
| 2017-03-11 | Simple &lt;strike&gt;Form&lt;/strike&gt; Foe | https://blog.decoybecoy.com/post/158273241893/simple-strike-form-strike-foe | `2017-03-11-simple-strike-form-strike-foe.md` |
| 2017-10-26 | Home Again | https://blog.decoybecoy.com/post/166817365148/home-again | `2017-10-26-home-again.md` |
| 2018-08-04 | Talking the talk | https://blog.decoybecoy.com/post/176635753998/talking-the-talk | `2018-08-04-talking-the-talk.md` |
| 2018-12-17 | Order of magnitude | https://blog.decoybecoy.com/post/181194952903/order-of-magnitude | `2018-12-17-order-of-magnitude.md` |
| 2020-05-15 | Optimising for trouble | https://blog.decoybecoy.com/post/618220286862573568/optimising-for-trouble | `2020-05-15-optimising-for-trouble.md` |
| 2020-05-15 | Why was that so hard to find | https://blog.decoybecoy.com/post/618220307121127424/why-was-that-so-hard-to-find | `2020-05-15-why-was-that-so-hard-to-find.md` |
| 2020-06-23 | Getting a snapshot downloading from Heroku Elasticsearch | https://blog.decoybecoy.com/post/621747638675652608/getting-a-snapshot-downloading-from-heroku | `2020-06-23-getting-a-snapshot-downloading-from-heroku.md` |
| 2020-07-20 | Celebrating the little things | https://blog.decoybecoy.com/post/624194698070933504/celebrating-the-little-things | `2020-07-20-celebrating-the-little-things.md` |
| 2020-11-12 | Dropbox root folder access | https://blog.decoybecoy.com/post/634597213483532288/dropbox-root-folder-access | `2020-11-12-dropbox-root-folder-access.md` |
| 2026-09-15 | A broken test suite, a tree and finding a rabbit | https://blog.decoybecoy.com/post/827860366166048768/a-broken-test-suite-a-tree-and-finding-a-rabbit | `2026-09-15-a-broken-test-suite-a-tree-and-finding-a-rabbit.md` (pre-existing, not touched this pass) |

Note: several posts share the same publish date (e.g. two on 2015-01-28, two on 2015-02-07, two on 2015-03-29, two on 2016-02-05, three on 2014-08-22) — this is genuine, Tumblr shows the same day for both. Filenames stay unique because they include the original URL slug.

Comment widgets (Disqus embed script + "powered by Disqus" footer) were present on every single post and were dropped entirely per instructions, along with the Facebook "like" iframe and Twitter share button that Tumblr injected into every post — none of that is blog content.

## Posts I wasn't fully confident about

- **"loved this so much i had to share it.." (2014-08-22)** — a Tumblr *photo* post with no separate title field; Tumblr used the image's alt text/caption as the effective title. I used that caption as both the front-matter title and the slug source. The post also carries a Tumblr "reblogged via theahi" attribution, which I kept as a line at the bottom (`(via [theahi](...))`) since it's part of what was actually published, not a comment.
- **"Criteria pattern for complex filtering in Ruby on Rails" (2014-09-25)**, **"Thinking before programming" (2014-12-02)**, and **"Steve Tooke - Your tests want you to change your design" (2014-12-30)** — all Tumblr *link* posts (the post type used for sharing another site's article). Each is essentially just a title linking out to an external page, sometimes with a one- or two-line comment from the author underneath. I rendered these as `[Title](external URL)` followed by any commentary. Two of the three external links (Steve Tooke's `tooky.co.uk` post, Alistair Cockburn's article) are old and I could not confirm they still resolve; I did not attempt to archive or re-host them, per the instruction not to re-host content.
- **"As long as we don't neglect code cleanup once we've found what works..." (2015-04-16)** — a Tumblr *quote* post. The "title" Tumblr recorded for this post is the full quote text itself (there was no separate short title), which is why the front-matter title is an entire sentence. I left it as-is rather than inventing a shorter title, since a shorter title was never actually published.
- **"Getting a snapshot downloading from Heroku Elasticsearch" (2020-06-23)** — the original post body's very first line is a verbatim repeat of the title ("Getting a snapshot downloading from Heroku Elasticsearch") before the article proper begins. This looks like the author accidentally left the title in the body when writing the post. I preserved it exactly as published rather than removing it, per the instruction not to alter original wording/structure.
- Same post also ends with a stray run of literal, unescaped closing-tag-like text: `</local_path></bucket_name></client_id></secret_key></access_key></bucket_name></repository_name></es_host>`. I checked the raw Tumblr HTML directly and this text is genuinely present in the original source (not an artifact of my conversion) — it looks like a copy/paste or editor mistake by the author when writing the code samples that use `<placeholder>`-style tokens. I preserved it verbatim.
- **"Simple Form Foe" (2017-03-11)** — the original title contains an HTML `<strike>` tag around the word "Form" (`Simple <strike>Form</strike> Foe`), presumably meant to render as struck-through text on Tumblr. Jekyll/Markdown front matter doesn't support inline HTML this way inside a quoted YAML string cleanly, so I kept the raw `<strike>...</strike>` tags in the title string as-is — when this renders through Jekyll's default templating the tag should still work as literal HTML in most themes, but it's worth a visual check once the site builds.
- A handful of code samples were pasted into Tumblr as indented (4-space) blocks with no language annotated. I converted these to fenced ```` ``` ```` blocks and guessed a language hint from content (ruby/javascript/bash/sql/css/html) where the code made it reasonably obvious; a few (mostly short shell/URL/config snippets) were left with no language hint because I couldn't tell confidently. Worth a skim if precise syntax highlighting matters.
- Several older posts use "v's" throughout as the author's own shorthand for "vs" (e.g. "Angular v's React", "Time v's Output", "Process Queue v's Promise Chain", and once inside "Blast from the past"). This isn't a one-off typo but a recurring personal style choice, so I preserved it verbatim in the titles and bodies as required, but flagging it here since it reads as non-standard.

## Spelling / grammar issues spotted (not fixed, flagged for a future pass)

These are quoted verbatim from the migrated files — nothing has been corrected.

- **2014-08-20-angular-generic-error-handling.md** — doubled word: "without having to litter **the the** code around the application."
- **2014-08-22-process-queue-vs-promise-chain.md** — "then" used for "than": "adding/removing individual tags **rather then** sending through the entire tag list"; and a subject/verb slip: "if **a users adds** a tag and then removes it".
- **2014-08-29-time-vs-output.md** — doubled word: "advocates that having a regular 5 min break every 25 minutes, **then then** a longer break every 4 Pomodoro's".
- **2014-10-27-blast-from-the-past.md** — "v's" used where "vs" or "versus" was meant, mid-sentence: "just giving directions on what to type next **v's** times when I sit back".
- **2015-02-13-angular-and-what-i-did-wrong.md** — several in one short post: "it has **it's** problems" (should be "its"); "I want to highlight the issues to help **other** avoid them" (should be "others"); "**There ay be** a technology out there" (should be "may be"); "I love angular and **thing** it has added a great deal" (should be "think"); "as such **and solution** that is offered should take that into account" (should be "any solution").
- **2020-06-23-getting-a-snapshot-downloading-from-heroku.md** — several: "Get access to the **Elastcisearch** instance" (should be "Elasticsearch", repeated as `elastcisearch.yaml` later in the same post); "be careful if you are doing this on a production system as **you easy lock you main** application out" (garbled — probably meant "you could easily lock your main application out"); "This works great **is your bucket** is in `us-east-1` which is **teh** default, but **what is you need** to store the data in a different region?" (should be "if your bucket", "the", "what if you need"); "I am using a **tool call** `Elasticvue`" (should be "tool called"); "In the repository screen I could see the existing repository **and but** hovering over the settings" (garbled, redundant "and"); "a copy of **you ES indicies**" / "to manage my ES **indicies**" (should be "your", "indices", used twice).
- Ellipsis-heavy titles (e.g. "Clever.. Clever.. Clever..", "Drugs are bad..", "Meta, meta, meta..") use a double-dot `..` instead of a proper ellipsis `…` or triple-dot `...` throughout many post titles from 2014–2017. This is a consistent personal style rather than a one-off typo, so it wasn't corrected, but it's called out here in case a future style pass wants to standardise it.

I did not do an exhaustive word-by-word proofread of every one of the 68 migrated posts (that would be a very large undertaking on its own) — the above are the issues that surfaced while reading through post content during conversion and via a few automated scans (repeated-word detection, a common-misspellings list). A dedicated proofreading pass is recommended before treating this as final copy.

## Technical notes on the conversion

- Fetched each post's raw HTML directly from `blog.decoybecoy.com` (not via a rendering proxy) to guarantee wording was preserved exactly, then parsed the `<div class="realpost">` body with BeautifulSoup and converted to Markdown with `html2text`.
- The post title and original body are the same HTML region that Tumblr also duplicates into a `datePublished`/`headline` JSON-LD block on each page; I cross-checked the two so the front-matter title matches what actually rendered on the page (in one case, "It can be cold on **teh** outside" vs "It can be cold on **the** outside", the JSON-LD/rendered title had already been corrected to "the" even though the URL slug still contains the old "teh" typo — I used the corrected title and kept the original slug in the filename for traceability).
- All image URLs (`64.media.tumblr.com/...`) were checked and are still live (HTTP 200) at the time of migration; they were referenced by their original URL as instructed, not re-hosted.
- Facebook/Twitter share widgets and Disqus comment embeds were stripped from every post before conversion, per instructions.
