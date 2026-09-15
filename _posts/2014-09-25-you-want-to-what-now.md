---
title: "You want to “what” now??"
date: 2014-09-25
---

A friend of my recently asked me how he could hack the output of a gem I had been part of writing. The gem was responsible for turning objects into complex JSON graphs, this is achieved by using a simple DSL to define the properties that should be output, with some simple customisation allowed based on user permissions.

When he asked me what the best way to modify the outputted JSON object was, I immediately felt that something was wrong. However, not knowing the exactly actual requirements meant I was in the dark - so to speak.

A quick 5 minute chat later and I had the details:

> My friend had developed a new data source for some of the outputted data and wanted to be able to overwrite those fields. The changes were in beta testing, so he did not want to modify the existing code.

Thinking about this I immediately recognised that he could far more easily achieve his goal by working with the existing implementation, instead of working against it as he had initially planned.

With this in mind I suggested he subclass the JSON builder, overwriting the updated fields in the subclass. This achieved his goal, avoided adding additional code to the gem or a complex hack elsewhere in the system, and provides a simple migration path for deploying this changes once he finished testing.

So what is my point here? I think it is important for all developers to remember that good code is generally easy to write and/or extend. If it feels like you are fighting an uphill battle against the code or library you are using, it is fairly likely that you are using it wrong and it is time to step back and think of alternative approaches.

Even if the alternative is to ask a friend or colleague for help on the problem.
