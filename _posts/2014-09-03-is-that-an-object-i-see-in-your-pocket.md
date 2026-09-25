---
title: "Is that an object I see in your pocket.."
summary: "A worked Ruby example of object extraction done halfway, and how finishing the refactoring properly leaves the code in a much better place."
date: 2014-09-03
---

## or are you just happy to see me..

Object extraction, like other refactoring patterns is both a powerful tool when used successfully and a good way to destroy a code based when performed by rote.

The key thing about this pattern is that you are extracting an object, with all of it associated data and functionality. Once the object extraction is completed, it is important to review the code change, check that you have extracted all of the object concerns and check for any additional refactorings highlighted by the object extraction

This ensures that “..you leave the code better than you found it..” which I believe should be a key tenant of any refactoring being performed.

The below is an example where I believe this pattern has not been successfully applied:

### Before:

```ruby
def property(name, options={})
  unknown_configuration_params = options.keys - [:delegate, :to, :restrict_to, :doc]
  raise(UnknownConfigurationParameter, unknown_configuration_params.join(", ")) if unknown_configuration_params.any?

  properties[name.to_sym] = options
  delegate_method(name, options[:to]) if options[:delegate]
end

def properties
  @properties ||= {}
end

private

def delegate_method(name, to)
  define_method name do
    __data__.send(to || name)
  end
end
```

### After:

```ruby
class Property
  attr_reader :name, :options

  def initialize(name, options)
    @name, @options = name, options
  end

end

def property(name, options={})
  unknown_configuration_params = options.keys - [:delegate, :to, :restrict_to, :doc]
  raise(UnknownConfigurationParameter, unknown_configuration_params.join(", ")) if unknown_configuration_params.any?

  property = Property.new(name.to_sym, options)

  properties << property
  delegate_method(property.name, property.options[:to]) if property.options[:delegate]
end

def properties
  @properties ||= []
end

private

def delegate_method(name, to)
  define_method name do
    __data__.send(to || name)
  end
end
```

The issue here is that an object has been extracted and a hash converted into an array, then the refactoring was stopped. This leaves a bad taste in my mouth, more so given my name is associated with this bit of code.

My biggest question with this code is if you are going to the effort of extracting the object why stop half way? I would suggest the below code shows what could have been done to complete this refactoring.

### Suggested improvements:

```ruby
class Property
  KNOWN_KEYS = [:delegate, :to, :restrict_to, :doc]
  attr_reader :name

  def initialize(name, options)
    unknown_configuration_params = options.keys - KNOWN_KEYS
    raise(UnknownConfigurationParameter, unknown_configuration_params.join(", ")) if unknown_configuration_params.any?

    @name, @options = name.to_sym, options
  end

  def delegated_method_name
    @options[:to] || name
  end

  def delegates?
    !!@options[:delegate]
  end
end

def property(name, options={})
  property = Property.new(name, options)

  properties << property
  delegate_method(property) if property.delegates?
end

def properties
  @properties ||= []
end

private

def delegate_method(property)
  define_method name do
    __data__.send(property.delegated_method_name)
  end
end
```

This feels like a better solution to the refactoring, the property object is now responsible for the data it contains. I have been able to hide the options parameter that is passed into it, and providing accessor methods when I need to access its values.

Finally, when I looked for additional refactorings of the updated code, I was able to extract `delegated_method_name` into the property object instead of needing to pass both the property’s `name` and `to` option in. This feels like cleaner solution to me and should hopefully make the code easier to test.
