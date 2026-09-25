---
title: "Angular generic error handling"
summary: "Handling server-side errors generically in an Angular app — why interceptors turned out to be a much simpler answer than decorators."
date: 2014-08-20
---

# Background:

I wanted to handle server side errors in a generic way within the angular application. Whatever is used should be as seamless as possible (i.e. I don’t have to remember to do anything when I create new $http requests) and handle more complex error cases, such as the user being logged out, etc..

# Server side response format

The JSON data being returned to the angular application will be use one of the following formats:

```
# successful request
{ status: 'success', data: <data object> }

# unsuccessful request
{ status: 'error', message: <error message> }
```

# Client side solution

I wanted to be able to generically handle any error states within the angular application without having to litter the the code around the application. So google to the rescue..

## Solution 1 - Decorators.

So after some search I discover that most people appear to have solved this problem (with varying levels of success) using angular decorators. But as I looked through the code in the examples all I could think to myself was “this looks completely overcomplicated”.

**EDIT**

After feedback on this article I have decided to add a little more scope around the decorator option. Before I start I want to say that I the code itself is of a far higher quality than mine and that it could easily be modified to serve my requirements.

My issue was around the complexity involved in the solution and the barrier to understanding the code. This was the main driver for looking for a simpler solution.

Anyway, here is the [link](http://www.codelord.net/2014/06/25/generic-error-handling-in-angularjs/).

## Solution 2 - Interceptors.

So unhappy with that solution I investigated further and it appears that angular provides a convenient tool for modifying both the http request and response object using [interceptors](https://docs.angularjs.org/api/ng/service/%24http#interceptors).

This has proven to be a far easier solution:

```javascript
angular.module('myApp')
  .config(config);

config.$inject = ['$httpProvider'];

function config($httpProvider) {
  $httpProvider.responseInterceptors.push(httpErrorHandler);
}

httpErrorHandler.$inject = ['$q', '$rootScope'];
function httpErrorHandler($q, $rootScope) {
  return function(promise) {
    return promise.then(function(response) {
      if(response.data.status == 'success') {
        return response.data.data;
      } else if(response.data.status == 'error') {
        return $q.reject(response);
      } else {
        if(typeof(response.data) !== 'string') {
          console.log("[DEPRECIATED] response should contain a status of success or error: " + response.config.url);
          console.log(response);
        }
        return response;
      }

    }).catch(function(response) {
      $rootScope.sendError(response);
      return $q.reject(response);
    })
  }
}
```

NOTE: Please forgive the use of $rootScope to pass the error message around, I am still thinking about ways to avoid this.
