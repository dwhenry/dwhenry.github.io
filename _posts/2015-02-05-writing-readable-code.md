---
title: "Writing readable code"
summary: "Using a technical test to show how simple, staged refactorings turn working-but-opaque Ruby into code that's easy to read and extend."
date: 2015-02-05
---

I have recently been applying for a number of jobs, and one of the reoccurring themes of IT job applications seems to be the technical test.

> Given problem X solve it using technology A, B or C.

I quite like completing technical tests. I find it is an opportunity for me to practice writing “readable code”, implementing all the good practices I know and posting to my public Github account. Basically, doing the things that can be a struggle in your day job given the pressure of looming deadlines.

## What do I mean by “Readable code”?

I am talking about something that I used to believe was a black art. Something that “those” people could do. What I am talking about here is writing code that is logical, easy to follow and most importantly easy to extend.

In actual fact this is not as hard as it seems, the key is to simply write your code as you normally would. Then tidy it up using simple refactoring techniques.

> I will admit this is not always the case especially if your algorithm is fundamentally wrong. But this rule does hold try in most other cases.

## An example?

_NOTE_ : The code extract I am talking about comes from a larger problem that I have been asked not to blog about specific details.

### The problem

Calculate the total cost of a group of items, given:

  * There are different rates, which apply depending on the number of items you buy.
  * There will always be a valid rate.
  * A base cost can be added to the calculated price.

### The initial code

```ruby
def initialize(data)
  @rates = data['rates']
  @daily_charge = data['daily_charge']
end

def price(items)
  cost = 0
  remaining = items.to_i
  @rates.each do |rate|
    if remaining > 0
      amount_at_rate = [remaining, rate['limit']].compact.min
      cost += amount_at_rate * rate['price']
      remaining -= amount_at_rate
    end
  end
  cost += DAYS_IN_YEAR * @daily_charge if @daily_charge
  cost
end
```

So it works and that is a bonus. But what does it do, and why and how could I ever extend it.

### Simple refactorings

 _NOTE_ : This refactoring was only possible due to the use of functional tests over implementation tests. This meant that I had to make only a few modifications to the test cases as I changed the codebase.

#### Create a rate object to ensure you are not using Hash object everywhere. This will allow future refactorings to extract the logic out of the price method.

```ruby
def initialize(data)
  @rates = data['rates'].map { |rate| Rate.new(rate) }
  @daily_charge = data['daily_charge']
end

class Rate
  attr_reader :limit, :price
  def initialize(data)
    @limit = data['limit']
    @price = data['price']
  end
end
```

#### Extract the daily rate calculation

```
cost += DAYS_IN_YEAR * @daily_charge if @daily_charge
```

becomes:

```
cost += base_charge
```

and add

```ruby
def base_change
  DAYS_IN_YEAR * (@daily_charge || 0)
end
```

#### Optimize the algorithm

I need to simplify the loop. I have chosen to do this by storing the cost of previous rating on each rating object.

```ruby
def initialize(data)
  @rates = data['rates'].map {|rate| Rate.new(rate) }
  @daily_charge = data['daily_charge']
end
```

becomes:

```ruby
def initialize(data)
  @rates = RateBuilder.build(data['rates'])
  @daily_charge = data['daily_charge']
end
```

And then implement the RatesBuilder class. This class creates an accumulator for existing rates and creates each new rate object with a min_limit, min_cost and price field:

```ruby
class RatesBuilder
  def self.build(rates_hash)
    builder = new
    rates_hash.each do |rate_hash|
      builder.add(rate_hash['price'], rate_hash['limit'])
    end
    builder.rates
  end

  attr_reader :rates

  def initialize
    @min_limit = 0
    @min_cost = 0
    @rates = []
  end

  def add(price, limit)
    @rates << Rate.new(@min_limit, @min_cost, price)
    @min_limit += limit
    @min_cost += limit * price
  end
end
```

#### The price method

I would like to point out that each of the previous refactorings was done in multiple stages, not all of which were shown. I kept the tests passing as I went, this gave me confidence in the changes I was making. It also meant that I could detect when things weren’t working and were able to roll back to a previous good state and start again.

```ruby
def price(items)
  items = items.to_i
  selected_rate = @rates.reverse.detect do |rate|
    rate.min_limit < items
  end
  selected_rate.min_cost +
    (item - selected_rate.min_limit) * selected_rate.price +
    base_change
end
```

#### Move some methods across to the “Rate” object

```ruby
class Rate
  def intialize(max_limit, min_cost, price)
    @max_limit = max_limit
    @min_cost = min_cost
    @price = price
  end

  def cost(items)
    min_cost + (item - min_limit) * price
  end

  def used_for_count?(items)
    min_limit < items
  end
end

def initialize(data)
  @rates = RateBuilder.build(data['rates']).reverse
  @daily_charge = data['daily_charge']
end

def price(items)
  items = items.to_i

  @rates.detect { |rate| rate.used_for_count?(items) }.cost +
    base_change
end
```

## What did I do?

  1. I simplified the rate selection. I did this by using an accumulator to build an array of rate objects rather than iterating over any array of hashes.
  2. I reversed the order of the rate objects, this was the key to getting everything working, it allowed me to greatly simplify the selection logic.
  3. Store the min_limit and min_cost on the rate instead of the limit for that rate. This meant that I did need to accumulate the cost each time, this method is called. This makes sense if the object is initialized once and the price method is called multiple times, which was my expected use case.

## Conclusion

I think the final version of the code is much easier to read, and would allow the next developer in to understand my intent. Added to this it proved to be easy to extend, something I was required to do when being interviewed for the position.

As such I hope that this helps understand a little more about the art of writing beautiful code.
