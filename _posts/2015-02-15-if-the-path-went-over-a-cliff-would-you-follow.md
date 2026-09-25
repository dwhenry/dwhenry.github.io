---
title: "“If everyone else walked off a cliff, would you do it too” - mothers everywhere"
summary: "Why some of the opinionated advice in React's official docs worries me — technical documentation isn't the place for it."
date: 2015-02-15
---

Generally when I am trying to learn a new tech I do so by reading guides. For instance, I saw a [redbull can stove on youtube](https://www.youtube.com/watch?v=fbHHQrh9m58&index=1&list=PL4BA305BB19EAB1C5&spfreload=1) and thought “I can make this.. maybe”. So I watched a video and read the guide, had a couple of trial attempts and am still some distance from a finished product.

Why then, when I read the one of the official react guides - as I plan to use it on a personal project - do I feel like something is wrong. It is not react itself, the idea is sound, I have been to a few meetup, read a few blogs and generally think it sounds like cool tech.

But having read one of the instructions on the react site I am not sure I agree with the message they are sending. The following quotes will hopefully explain what I mean by this:

> [That’s because user interfaces and data models tend to adhere to the same information architecture which means the work of separating your UI into components is often trivial.](http://facebook.github.io/react/docs/thinking-in-react.html)

Maybe I am over-reading this statement, as it does say “tend”, but isn’t the problem that ActiveRecord introduced into rails. Database Models and Business Objects are not the same things. If you are unsure, talk to the JAVA, they battled this problem and understand the reasons for the required separation years ago.

> [In simpler examples it’s usually easier to go top-down and on larger projects it’s easier to go bottom-up and write tests as you build](http://facebook.github.io/react/docs/thinking-in-react.html)

I have tried bottom-up and generally end up with a mess of code that solves a problem, just not the one I have right now. I most likely feel this way due to my BDD work.

## conculsion

In all honesty, it worries me that this is part of the core documentation. If the core team have an opinion about how the technology should be used or the best way to develop an application, the forum for this is blogs rather than the technical documentation.

Hopefully, they will remove this sort of opinionated - and unnecessary - commentary from the online instructions.
