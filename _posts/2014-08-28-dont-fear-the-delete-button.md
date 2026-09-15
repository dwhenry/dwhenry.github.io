---
title: "Don’t fear the delete button"
date: 2014-08-28
---

This is one of the best words of advice I can give to any new developer starting out.

And by this I am not talking about deleting small sections of code, refactoring, or using the undo key on the last bit of work you just did.

I am referring to two major code decisions:

## Deleting the bad branch

In this one, I am talking about the big purge, the one where you realise the last two days are a right off and the whole branch can be deleted. Even as a seasoned developer I find this hard, as like everyone else out there I get attached to my code. I did after all spend a heap of time just writing it, when I started out I thought I had the perfect solution.

So when is it time to pull the plug and start again? Generally for me this is after about 2-3 hours of trying to force the code I have, to work in a way that is just not going to happen. While this may sound like a significant waste of time, I have seen more junior developers continue to “hit their head against the wall” for days before understanding the wisdom in the above words. Or worst still, when developers have managed to get the code working, but have made such a mess of the implementation you know it will haunt you for the rest of your time at the company (and yes I have been guilty of this myself).

## The data model is wrong

The other equally important time to not be afraid of the delete button is when you realise the data model does not fix the customer requirements. Again it is often hard to do a restructure, for one it takes time away from actual development, it breaks all your lovely tests (this means your tests have value, so I a redesign does not break your test, then you’re doing it wrong).

I have done this twice in the past week, and after the first one I thought to myself, I didn’t want to do this again anytime soon. Yet when I looked at the data model this morning I realised I had f***** it up, not through any intention of mine, I had just made an assumption, and a wrong one at that. My first thought was can I fudge this and avoid another refactor of a design that up to now has worked fine.

The short answer was NO, as similar to mention above when talking about pushing through code that doesn’t really work. You can do it, but ultimately it will cost you, and this is something that any developer wants to avoid.

## Conclusion

So in short do the right thing. Don’t continue if the solution does not work, refactor when you have it wrong, and try to identify this early as it will save time later.
