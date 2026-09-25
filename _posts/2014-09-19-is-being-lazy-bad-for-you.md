---
title: "Is being lazy bad for you?"
summary: "I try to be as lazy as possible when coding, but is picking a third-party service because they once gave me a free t-shirt taking it too far?"
date: 2014-09-19
---

As a general rule, I try and be as lazy as possible with my coding. When I am given a problem I always refer to code I have written previously, just in case I have already solved this problem, or one like it.

If that fails I look on Google and see if it has the answer I need, only once I have exhausted these options do I consider actually doing the work myself.

This allows me to work quickly and ensure I focus my efforts.

The one area of my job where I question this approach is when choosing third party services. In this situation, I have a tendency to go with a provider that I know or have used previously.

A recent example of this was while writing an angular application and looking to send events to the client. I choose to use [Pusher](http://pusher.com) primarily because I had heard of them, had created a very small chat application using their service in the past - so knew it was easy to use. All of this history stemmed from the given me a free t-shirt a conference I attended serveral years ago.

So, is receiving a free t-shirt a good reason for choosing a particular provider, even if they seem to provide a good service? Probably not, but I have combated this by ensuring the Pusher code resides in an isolated section of the application, with an appropriate wrapper, so that I can swap it out if at any stage it proves a mistake.
