---
title: "Setting myself up to fail"
date: 2014-12-03
---

As a developer, I like to work as quickly as possible. I’m always ensuring that a task is completed on time, or in the case of crazy deadlines as close to as humanly possible.

This can sometimes backfire.

In one particular role, I was so good at finishing projects, that I was regularly asked to assist/rescue a project that was in the process of failing. This wasn’t too bad, as it allowed me to move around in the team and work on interesting and difficult parts of the system. Which always gave me the nice feeling of being appreciated.

At another role, I was constantly agreeing to pull off impossible deadlines. I was able to do this because of my understanding of the system. Looking back, I have serious regrets about doing this as the architecture resulted in something that looked like a two-year-old’s crayon drawing. It wasn’t quite that bad, but it meant we had to make significant sacrifices to time. This left my colleagues in a lurch when I left as they were not able to work to the same timelines.

The final example I have of this is letting project pressures and weekly deadlines result in significantly less testing towards the end of the project as deadlines ran tight in comparison with the start of the project. This reduced both system stability and the speed at which later tasks could be completed.

While the first example may not initially appear to fit with the other two, they are all the result of the same mentality. That being that the timeline is the most important part of the project. The main differences in outcomes between the three examples were the timescales involved and the amount of pressure applied.

The solution is obvious, “don’t let time pressures affect your quality of work.” This is, however, particularly hard to do, especially when deadlines approach and the work is not completed to schedule, or your boss has committed to an external deadline and is only telling you this now.

One solution I have tried and seen others fail with is the “I’ll do it quickly now and then add more tests later.” Please, for the love of God, can we stop lying to ourselves, as this never happens?!

In some cases, it is better to fail now and miss the deadline while ensuring that code quality is maintained and future deadlines are safe. This is not always practical, especially when working on a contract to deliver to a set timeline.

As such, I leave you with some last thoughts:

  * Do the best you can whenever this situation presents itself.
  * Try to push back, but realise that sometimes you can’t.
  * Write test stubs so at least the lack of actual testing in this part of the code is visible and hopefully the test descriptions will help others understand your intent in the future.
  * Do small refactorings when you don’t have time to do a larger ones, as even small improvements make a difference over time.
  * Everyone fails, and while it may seem to be the end of the world to not deliver as promised right now, it is rare for anyone to remember if you succeeded or failed in a week’s time.
