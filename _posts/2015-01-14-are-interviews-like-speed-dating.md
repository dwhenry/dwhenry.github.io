---
title: "Are interviews like speed dating?"
summary: "Feedback on an interview pairing challenge — reimplementing SecureRandom — that tested Ruby trivia more than it tested real coding skill."
date: 2015-01-14
---

I ask this as I have recently done a number of interviews, where I either completing a pairing session and solved a technical challenge or extending one I had worked on previously.

The topic of this post is about a particular pairing session I completed. The goal was to re-implementation of the Ruby Secure Random library without using any external gems. I wanted to leave some feedback on this challenge as I don’t feel it allowed me to demonstrate my range of skills and feel it likely other could also struggle with the format of this challenge.

> **NOTE:** I may be influenced by the fact I did not get great feedback from the code I wrote for this particular bit of work.

So what did I like and dislike about this particular challenge that I thought it worth a blog post?

### Positives

  * it tests the applicant’s knowledge of some of the obscure parts of the Ruby code base such as IO object, reading on a UNIX device/pipe and converting bytes into.. well other things.

### Negatives

  * the solutions did not contain any logic, simply from an IO stream and wrapping that in the correct formatting (see below for example)
  * difficult to test drive due to lack of behaviour.
  * ended up testing the implementation - which to my mind is about as value adding as coding with your eye shut.

### Conclusion

I feel like a fairly well-rounded developer, but I did struggle with this challenge. I felt that given enough time I could have produced a solution, but most of that time would have been spent reading the class docs for String, IO and Base64, NOT writing well-tested code. The challenge puts me in mind of University exams, which focus on retention of knowledge, over application of ideas.

So on the whole I feel that while the test was for an interesting technical challenge and means that I know a great deal more about how secure random works. Using it to determine good coders, especially good Ruby and Rails coders is somehow missing the mark. Hopefully, they will change the test for future candidates as I feel they are limiting their hiring pool at the moment.

### Example code

```ruby
module SimpleSecureRandom
  extend self

  def base64(n=16)
    Base64.encode64(random_bytes(n))
  end

  def hex(n=16)
    random_bytes(n).unpack("h*")
  end

  def random_bytes(n=16)
    IO.read('/dev/random', n)
  end
end
```
