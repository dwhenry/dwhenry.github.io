---
title: "Clever.. Clever.. Clever.."
summary: "Clever code is rarely better code — a JavaScript reduce trick compared with the boring loop that turned out simpler anyway."
date: 2014-10-28
---

But is it better? In most case’s the answer is no.

For instance, the following code is clever:

```javascript
// Ensure only single consecutive empty paragraph
results = [];
paragraphs.reduce(function(current_paragraph, next_paragraph) {
  // only include last empty paragraph
  // i.e. paragraph is not an empty string or
  // it is an empty string but the next paragraph is not
  if(current_paragraph !== '' || current_paragraph !== next_paragraph) {
    results.push({
      index: results.length,
      text: current_paragraph
    });
  }
  return next_paragraph
});
// manually add last item as it is not processed by loop
results.push({
  index: results.length,
  text: current_paragraph
});
```

It uses the fact reduce if you do not pass a starting item into reduce, it will use the first item in the array as the first argument on the first iteration. It will then passes the return value from the function as the first parameter on subsequent iterations.

As a result, the above code calls the function with each consecutive pair of items in the array.

This is a clever use of the reduce function, however it means that unless you understand what the original intent of the code is - i.e. you wrote it - it will take time to understand what the developer was trying to achieve (even with comments) and why they have taken this approach. The first question I try to ask myself whenever I find that I have written clever code is, “Can I do this without being clever?”.

The answer here is yes, the following code performs the same functionality without being as clever:

```javascript
var results = [], i, length = paragraphs.length;
for(i=0; i<length; i++) {
  // only include last empty paragraph
  // i.e. paragraph is empty but next paragaph is not
  if(paragraphs[i] !== '' || paragraphs[i] !== paragraphs[i+1]) {
    results.push({
      index: results.length,
      text: paragraphs[i]
    });
  }
}
```

So the non-clever code in this case is actually far easier as it doesn’t need to deal with the edge case - i.e. the last element is processed within the loop.

Obviously this is not always the case. Though I do find it does turn out this way quite regularly. Though YMMV. :P
