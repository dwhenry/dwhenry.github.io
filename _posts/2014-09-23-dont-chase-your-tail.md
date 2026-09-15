---
title: "Don’t chase your tail."
date: 2014-09-23
---

## The application setup

Dependencies in Angular applications require love and care the same as they do in any other system. Towards this end I have - currently - separated my application into three main modules:

### The Main application.

It contains a majority of the application code, include a “settings” service which I use to passing in system configuration and user permissions.

### Pub/Sub notification and Pusher communication.

This hides the pub/sub communication channel implementation. Allowing the main application code to listen for events which are propagated from the system using the [Pusher](http://pusher.com) service. This is in a separate module to ensure it’s isolated from the rest of the system.

### Error logging.

This is general purpose module for system logging, primarily used for debugging. This is likely to become a general purpose toolbox that will be included in future project.

## Where it went wrong

Things started going wrong before I noticed - which is generally the case - I allowed both the secondary modules - pub/sub and error logging - to create dependencies on the main application.

This meant that I had suddenly had the following circular references:

  * Configuration settings for the “pub/sub” module coming from the server - via the main application - allowing environment based configuration settings.
  * Configuring settings for the “logging” modules coming from the server - via the main application - allowing debugging to be enabled on a case by case basis.

![](https://64.media.tumblr.com/f122d4e09ac72237fb1cc249d55b8f5b/tumblr_inline_nca0e3ChKj1smxuaw.png)

## How did I fix it

First was to identify the issue. This was pretty easy, I was requesting configuration settings for the various sub-modules, and as the main application held the configuration library, circular dependency inject.

This was actually pretty easy to fix, the key was to invert the dependency.

Instead of passing the `settingService` into the secondary modules and requesting the settings:

```javascript
angular.module("decoybecoy.notifier")
  .service('cbNotifier', cbNotifier);

cbNotifier.$inject = ['settingsService'];

function cbNotifier(settingsService) {
  var channel = settingsService.pusher.channel;
  setupChannel()

  function setupChannel() {
    // Implementation code
  }
})
```

I created setter methods within the secondary modules. I then made it the responsibility of the main application to “tell” the secondary modules their configuration settings. This fitted nicely into my design, as the settingService had previously been required to expose these settings anyway:

```javascript
angular.module("decoybecoy.notifier")
  .service('cbNotifier', cbNotifier);

function cbNotifier(settingsService) {
  var vm = this;
  var channel;

  vm.config = config;

  function config(pusher) {
    channel = pusher.channel;
    setupChannel()
  }

  function setupChannel() {
    // Implementation code
  }
})
```

## How did I miss this.

It was actually pretty easy, I had initially hard-coded the configuration settings during development. Once I had it working I modified code the pass the settings in, reusing the existing settingsService to avoid request overhead.

Only later did I separate everything into modules - even here the circular dependencies did not raise any errors. From here I refactored my HTTP interceptor class to log errors using the “pub/sub” module.

angular.module(‘decoybecoy.mainApp’) .service('httpErrorHandler’, httpErrorHandler);

```javascript
httpErrorHandler.$inject = ['$q', 'cbPubSub'];
function httpErrorHandler($q, cbPubSub) {
  return function(promise) {
    return promise.then(function(response) {
      if(response.data.status == 'success') {
        return response.data;
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
      cbPubSub.publish('error', response.data);
      return $q.reject(response);
    })
  }
}
```

At this point my lack of disipline which managing my dependency graph caught up with me resulting in angular “circular dependency” error.

## Alternative solutions

Initially, I removed the circular dependency by using an angular trick to hide the dependency. This involved adding the ’$injector’ service and changing:

```
      cbPubSub.publish('error', response.data);
```

to

```
      $injector.get('cbPubSub').publish('error', response.data);
```

This removed the circular dependency within the code. This did not solve the larger problem of interdependent modules, meaning that similar errors where likley to continue apearing if I went down this path.

Another alternative would be to extract the “settingService” into a “settings” module, which was a dependency of the three I had. It would however mean that if I wanted to reuse the pub/sub or error logging modules in future project, I would also be required to include the settings module, ensuring I only included the settings parts that I required. I do not feel this a good solution to the given problem so shelved it as a solution.

## Learnings

The same as any application it is important to remember the principle of [tell don’t ask](http://martinfowler.com/bliki/TellDontAsk.html) as this will ensure that you can avoid creating circular dependencies within your code.

At the same time ensure that you are aware when you are creating dependencies within your application, maybe keep a map of then for reference. Be aware that as the code base grows leaving code smells like this in your application will reduce the ability to add features and maintain a clean codebase.
