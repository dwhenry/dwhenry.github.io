---
title: "Angular, and what I did wrong.."
summary: "I love Angular, but single page apps, bad blogs and the 2.0 rewrite are why I probably won't be using it on my next project."
date: 2015-02-13
---

I really like the angular framework. I think that it has added a lot to my JavaScript development skills. I find the separation of logic from the DOM makes testing a task that I enjoy, rather than one I avoid.

All that said it has it’s problems. I am not saying this so that I can plug an alternative library as being better. Instead, I want to highlight the issues to help other avoid them.

## Single page applications

There ay be a technology out there that makes this idea work, but angular is not it. While the routing engine works, it just adds unnecessary overhead to your implementation, and for no real gain.

Instead, I will be avoiding this pitfall and creating angular pages the next time round. I can still share code and reload elements onto pages, but when it is a different page there is nothing wrong with a separate request.

## Online blogs

The online blogs suck, everyone and their dog seems to have decided they can give advice on how to write Angular. Unfortunately, most of it is either how to write the next chat application - which I doubt is the information you need or just plain wrong.

There are some good blogs to be found, written by people who know their stuff and will help you find the correct path. The issue is finding it amidst everything else.

## 2.0 rewrite

I have only watched the 2.0 intro once in passing. And while I admit there are issues with the infrastructure and changes are needed, does it have to be a big bang approach. In fact wouldn’t it have been easier to instead spread the changes across the 2.X versions so that people could adapt that application over time.

## Everything is greenfield

This is just not true. In fact even for greenfield projects this is mostly not true after the first month!

Then why do all the blogs seems to only refer to greenfield solutions? Most projects around today are a culmination of months if not years of code, as such and solution that is offered should take that into account.

By this I mean if you need to make a significant system change to implement a process you need to be able to isolate it from the rest of the system.

## Conclusion

In conclusion, I would like to end where I started. I love angular and thing it has added a great deal to the JavaScript community.

Unfortunately, it is unlikely I will be using it on any future project, this is mainly due to having to relearn the syntax once 2.0 is released. This may change post-release, but in the meantime I will focus my efforts elsewhere.
