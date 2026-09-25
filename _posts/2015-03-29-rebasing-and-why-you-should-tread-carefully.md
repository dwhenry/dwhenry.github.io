---
title: "Rebasing - I always tread carefully."
summary: "Rebasing is like time travel: mostly fine, until you kill the wrong butterfly. Why I still have my doubts about rewriting git history."
date: 2015-03-29
---

I think it is fair to say, that most of the time rebasing is fine, but everyone should be aware that rewriting you git history can be dangerous..

In fact, it has many similarities to traveling back in time. As long as you are careful, make sure you don’t kill any important butterflies or stop your parents from meeting* then it will be a great vacation.

But beware, for eventually you will accidently kill that butterfly. Sure you can force a fix out, and most of the time no one will even know.

But occasionally, very occasionally, things will badly go wrong. You will lose a commit, end up without a branch, break your CI build, or have to manually resync your production system. Three of those four things have happened to me - I am yet to need to resync a production system.

It’s for this reason I still have my doubts about rebasing, especially when it come to merging commit history, after all, those are the steps I took to get this feature working.

That is not to say that it is without its advantages. Simplified rollback options are definitely useful. A cleaner git history is useful for developers who like to look through commit logs to track what others are working on.

If they outweigh the risks? Of that, I’m still not sure.

For now, my job requires me to rebase, whether I will continue this process in my next role only time will tell.

* yes that is a “Back to the future” reference.
