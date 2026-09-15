---
title: "Dynamic Directive Injection"
date: 2014-08-27
---

So a couple of days ago I [blogged](http://blog.decoybecoy.com/post/95499244208/youre-doing-it-wrong) about some work I had done which was not to spec. The difference wasn’t that big; when editing tags on a document the customer wanted the user to click an edit button, modify the tags and then click a save button prior to the changes being persisted; I had implemented a system where changes where automatically persisted to the backend (what I called continuous save).

I knew I would be able to reuse a majority of the code I had written and get the (actual) requirements implemented relatively quickly. However I wanted more than this, I wanted to be able to have different users within the system have different experiences depending on “feature flags”.

Given that the customer could see the possible use cases for the continuous save functionality, and that feature flagging was something we had previously spoken about, this did not feel like an unreasonable goal. The only impediment being development time.

So the next question was how to do this in an angular application, and in a way that I could reuse later as I added more flag-able features.

The solution I come up with was to have an extra directive in the system whose responsibility was to inject the desired directive (and hence functionality) into the site. The below code is a cut down version of the code I implemented.

```javascript
angular.module('retechnica.newgenia')
  .directive('rnTagSets', rnTagSets);

function rnTagSets($compile) {
  return {
    restrict: 'E',
    scope: {
      directiveName: "=directiveName",
      commonData:  "=commonData"
    },
    link: function ( scope, element, attrs ) {
      var el = $compile( "<" + scope.directiveName + " common-data='commonData' />" )( scope );
      element.parent().append( el );
    }
  };
}
```

This allows me to pass in the directive name to be rendered in the `directiveName` parameter.

The key to using this functionality is that all the rendered directives have a common interface (see the commonData variable on the scope). It is then possible to pass the common data through, this then allows me to achieve my goal in what I feel is a repeatable functionality.

Only future blog posts will tell.
