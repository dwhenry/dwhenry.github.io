---
title: "These are not the solutions you are looking for.."
summary: "Filtering, grouping and sorting in Angular, and how stepping back from a complicated array-diffing fix led to a much simpler answer."
date: 2014-10-09
---

My angular application need to filter, then group, then sort some data - all using angular filters. I can perform most of this manipulation within the view, however this then becomes a maintenance nightmare and limits how the code can be tested.

The alternative is to perform the manipulations within the controller, manually, watch the data object for changes and update as required - I prefer to avoid this approach until the manipulation has become significantly complex - the below complex code performs the previously mentioned tasks:

```javascript
// changes to the search Term
$scope.$watch('searchTerm', updateFilterGroupSort);

// changes to the sort order
$scope.$watch('sortBy', updateFilterGroupSort);

// changes to feeds array
$scope.$watchCollection('feeds', updateFilterGroupSort);

// update function
function updateFilterGroupSort() {
  var filtered = $filter('filterBy')(vm.feeds, filterFields, vm.searchTerm);
  var grouped = $filter('groupBy')(filtered, 'name');
  var groupedArray = $.map(grouped, function(feeds, name) {
    return {name: name, feeds: feeds};
  });
  vm.sorted = $filter('orderBy')(groupedArray, vm.sortBy.sortMethods)
}
```

**NOTE:** I will be changing this to use the [$watchGroup](https://docs.angularjs.org/api/ng/type/%24rootScope.Scope#%24watchGroup) method once I upgrade my angular version.

I have three different items that can change - search term, sort order and the feeds array. As I am using $watchCollection on the feeds array this is only looking for inserts and deletions, updates to the individual feeds are handled by ng-repeat.

The issue is that when I change the grouping field - ‘name’ - on an object - 'feed’ - the feed is updated with the new name, but is not moved to it’s new group. This is because the change did not trigger a recalculation of the data.

I can capture fix this by changing how I watch the array, using the $watch method instead of $watchCollection, with 'objectEquality’ set to true:

```javascript
// changes to feeds array
$scope.$watch('feeds', updateFilterGroupSort, true);
```

Now when I change the name on a feed it is moved to it’s new group in the view.

Win - however as the view is fully rerender on each change this introduces other issues.. The view itself has the ability to collapse. It will initially, show a list of grouped names - with feed counts - and when you click the name it will expand to show the feeds.

With the above change, all of my view group expansions automatically collapse on rerender - i.e. when I edit a feed. The first solution I thought of was to avoid overwriting the array by updating its element - this has the added advance of reducing rendering time. The below code is a starting point for how this could be done:

Replace

```
vm.sorted = $filter('orderBy')(groupedArray, vm.sortBy.sortMethods)
```

With

```javascript
update(
  vm.sorted,
  $filter('orderBy')(groupedArray, vm.sortBy.sortMethods),
  'name',
  'feeds'
)

function update(arr1, arr2, matcher, data) {
  // update existing objects
  var found, elemToRemove = [];
  arr1.forEach(function(elem1) {
    found = false;
    arr2.forEach(function(elem2) {
      if(!elem2.found && elem1[matcher] === elem2[matcher]) {
        elem1[data].length = 0;
        [].push.apply(elem1[data], elem2[data]);
        found = elem2.found = true;
      }
    });
    if( ! found ) {
      elemToRemove.push(elem1);
    }
  });

  // delete any missing object
  elemToRemove.forEach(function(elem) {
    arr1.splice(arr1.indexOf(elem, 1));
  });

  // insert any new objects in the correct order
  var lastFound = -1;
  arr2.forEach(function(elem2, i) {
    if(elem2.found) {
      lastFound = i;
    } else {
      if(lastFound === -1) {
        arr1.splice(0, 0, elem2);
      }   else {
        arr1.splice(arr1.indexOf(arr2[lastFound]) + 1, 0, elem2);
      }
    }
  });
});
```

So looking at this - especially given it does not cover all use-cases - and you can see **this is not the solution I was looking for**.

So I went back to consider the problem I was trying to solve:

  * ensure that feeds are displayed in under the correct group after update.
  * expanded groups stay expanded after edits

Given these requirements, the first issue of moving feeds to the correct group is already working, so I only need to find a solution to ensure expanded groups don’t collapse on re-rendering.

The code currently stored the expanded state on the view - I am using slim templates:

```
.source ng-init="expanded = false"

  .feed(
    ng-repeat="feed in source.feed"
    ng-click="expanded = ! expanded"
    ng-class="{expanded: expanded}"
  )

    // Feed related html here
```

By storing the expanded state on the controller, I can persist the expanded stated across changes in the data.

First I need to add an object to hold the expanded state to the controller. As I have multiple objects I have used an object - hash - and will have the object id as the property - key:

```javascript
$scope.expanded = {}
```

The view template then becomes:

```
.source

  .feed(
    ng-repeat="feed in source.feed"
    ng-click="expanded[name] = ! expanded[name]"
    ng-class="{expanded: expanded[name]}"
  )

    // Feed html
```

As the expanded state is persisted I am able to change the data without having to just through hoops to keep the expanded state.
