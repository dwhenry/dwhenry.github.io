---
title: "A test too far?"
summary: "How I approached a 'simple' GitHub technical test as a senior developer — and the untested Sinatra page that came back to bite me."
date: 2014-11-02
---

As part of a recent job application, I was asked to complete a technical test. The test was not too complicated - write a program to determine the favourite programming language of a ‘GitHub’ user account - in fact, the work to actual implement a solution was quite easy.

However, as this is a test designed identify you technical strength there are a number of other - hidden - questions being asked of me as a developer:

  * Do you do TDD/BDD - i.e. do you have tests for your test project.
  * Are all the parts in the logical place - i.e. have you thought about the architecture of your program.
  * How hard would it be to add new/change existing requirements - i.e. have you implemented a flexible design that can grow over time.
  * Do you use version control - it is easy to show a polished final product, but ultimately it is better for potential employers to see how you arrived at your destination, for one thing this increases their confidence that you wrote the code and didn’t just copy it from the internet - GitHub is your friend here.

While none of these questions are mention by the recruiter or in the test definition they’re all things that need to be consider. Especially given that I am trying to market myself as a senior developer.

So how did I approach this simple test?

### Step 1 - Testing

I have used both RSpec and cucumber to test projects, and while I can see the advantage of cucumber as a tool, I feel that RSpec is easier to use fro a developer point of view, so I have written both unit and integration test in RSpec for this example.

On top of this I wanted to use live data in my system, without requiring a live data connection. I used [VCR](https://github.com/vcr/vcr), mostly because I had used it before and it simplifies the setup of test data.

### Step 2 - Connect to github API

Multiple gem’s exist that can be used to do this, and as I didn’t want to be reliant on any single one of them, my design allows the connection gem to be injected, and then uses the adapter pattern so the data returned, and the calling interface for the different gems can be safely ignored.

I only ended up implementing a single gem within this pattern, and did not worry about normalising the return data - primarily as the data for already in the desired format - but hopefully they will be able to see where I was heading with the abstraction.

### Step 3 - Favourite language

I felt this was quite a subjective question, are they referring to the Language a majority of the repositories are in; or are they only interested in the ten most recently edited repositories; or possibly only those the user has actually contributed to (i.e. ignore watches)?

As such I felt that once again the code to determine this should be abstracted out of the core system. I made use of the factory pattern to select the favourite language 'mode’ so to speak.

I implemented two (three) separate modes here:

  1. As I needed something simple during the initial stages of development I went with 'first past the post’ or more simply the language from the users first repository.
  2. Once I had everything connected to the GitHub API, I was then able to quickly implement a 'most popular language’ alternative.
  3. Lastly I added a 'multiple modes’ mode, mostly because I wanted to see if I could, this doesn’t really add to the test answer, but does show how the system could be extended if anyone ever feel the urge.

### Step 3 - Extensibility

At this point, I start to thing maybe I am over-engineering the solution, but I had made it this far so I decided it was worth my time finishing.

The test was related to finding the users favourite language, and it would be quite easy to do this, in a way that if wanted to add additional queries onto the GitHub data you would need a complete redesign - or at least renaming - of the system to allow this.

I avoided this by make my main class `GithubAccount` which has a method `favourite_langage`. Thus avoid issues that would be present had I started with a `FavouriteLanguage` class and then implemented fro there.

### Step 4 - The interface

I had initially planned to have CLI application and test drive the code from there. I found however that it was easier to implement the core without considering which interface I would use - and I could get the CLI testing tool to work. This sped up my testing and allowed me to defer design decisions until later, and ideally I will try to take this approach more in the future when I have a small set of requirements - without that this approach can easily lead to the implementation not being usable in the design.

When later arrived, I decided that a simple `sinatra` application would be the easiest solution - especially considering the test had a secondary design question.

I will admit that I don’t currently have any tests for connecting the `sinatra` web pages to the backend implementation, and given that I have already spent over 4 hours working on this solution it is unlikely I will add them at this stage. However, I feel this can be justified due to the simple nature of the implementation: two views, one with an input field for the github username and one to display the favourite language for the user.

I have tested these manually and would use the argument that until there is an increase in complexity of the pages, testing here can be left for the next iteration of the code - or at least until I am being paid for the work.

### Final thoughts

This test took significantly longer for me to complete that I was expecting for such a simple piece of work. However, a majority of that time was taken up with implementing design solutions that would at home of a far larger application where up front design will save untold hours later on. As such, I think it was time well spent, and hopefully the will help me get an interview for my next role.

If you are interested in viewing the code or commenting on it, it is available freely on [github](https://github.com/dwhenry/unboxed). I would only ask that if you are a similar interview test, then answering the solution your will be far more benefical for both yourself and the empoyer than coping my will be. :)

## Update…

Oh, so confident for all the wrong reasons. It turns out I did need testing on the sinatra interface to the code I had written. While I had manually tested the clean path of the code through the system, I had completely overlooked what the front end looked like if you entered an invalid username.

![](https://64.media.tumblr.com/b34542a8edda29cb74567ab430a36133/tumblr_inline_nehey7WRCo1smxuaw.png)

As you can see it was not pretty, I have now added the required test cases and can deal with a failure in a logical way.
