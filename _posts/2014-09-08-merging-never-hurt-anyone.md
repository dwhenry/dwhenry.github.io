---
title: "Merging never hurt anyone"
summary: "A contrarian take on git best practice: merge instead of rebasing, never rewrite history, and be proud of your bad commits."
date: 2014-09-08
---

If someone suggested to me that I played Russian roulette, even if the gun took a million bullets slots and only one bullet I would still say no. Yet I consistently hear people talking of the best practise with `git` is to rebase and when required, force push.

I recently saw the following diagram posted as an outline of how to fix a bad code when using git:

![](https://64.media.tumblr.com/5baf1bab9f2285b4d9df6e9a959411e9/tumblr_inline_nblmyqHE0E1smxuaw.png)[*http://justinhileman.info/article/git-pretty/](http://justinhileman.info/article/git-pretty/)

What I would like to put forward as an alternative is the that you should never need to rebase/force push:

  * merge all code instead of rebasing.
  * never rewrite history, be proud of you code, bad code even more than good, that is the stuff you can really learn from.
  * remember that you do not lose pay by having extra commits in your git history.

Why do I take this approach, because, I have never made a mess of my code, history and just life in general when doing merges, yet have had numerous bad experiences with things going wrong after rebasing.
