---
title: "Meta, meta, meta.."
date: 2014-09-11
---

I think of metaprogramming in the same way I think of TDD/BDD. This might shock many people as they are two completely different things, one being a crazy way to functionality to an application while the other is a testing and development philosophy.

They do share I common thread in that they are both tools that I can use in my day to day job. The important point here is the word “can”, because I don’t always test drive, and I rarely include metaprogramming.

I do think that everyone should read the [Metaprogramming ruby](https://pragprog.com/book/ppmetr2/metaprogramming-ruby-2) book as it exposes some of the advanced functionality that is available within the ruby programming language. Once you have read the book it is very important that you then **DO NOT** use any of the techniques discussed in any production code.

The reason for this is that metaprogramming is hard to understand, almost always difficult to debug and rarely required. That being said it can make a complex problem easy to solve or understand.

If you run across code that meets the following requirements, it may just be time to try out some metaprogramming in you code:

  * The complexity is isolated and does not bleed throughout the application.
  * The problem space is well understood.
  * Once complete it would make sense to extract the code into a gem so that it could potentially be reused.
  * You understanding the codes intended use-case and have the time to thoroughly test the metaprogramming code in isolation against those use-cases and any associated edge-cases

Two items of work stand out of me where metaprogramming has simplified a problem:

In the [Responsible gem](https://github.com/reevoo/responsible) we used metaprogramming to setup a DSL for specifying how the JSON builder would work. This was then extracted to a gem and made available for public use

Code that was required to traverse a multilevel decision tree, before producing the appropriate documentation for an equity trading platform. Here I was able to significantly simplify the code by moving the functionality to a DSL. The main saving here was that previously we had used multiple classes, making it difficult to see how the decision tree was structured.
