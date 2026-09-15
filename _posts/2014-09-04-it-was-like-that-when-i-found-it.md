---
title: "It was like that when I found it.."
date: 2014-09-04
---

I discovered an interesting feature of rspec today, mainly that it is broken.

Interestingly enough if you write the following spec and try to run it you will get a segfault.

```ruby
require 'rspec'
describe "doubles" do
  let(:my_object) { my_object }
  it "can cause segfaults" do
    my_object
  end
end
```

This is only true on ruby 2.1.0 and above as outlined [here](https://github.com/danielfone/rspec-memoization-segfault)
