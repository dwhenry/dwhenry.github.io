---
title: "Process Queue v’s Promise Chain"
summary: "Keeping tag updates in order in an Angular app by chaining promises, instead of building the Ruby-style process queue I first reached for."
date: 2014-08-22
---

Within the Angular app that I have been working on there is the ability for the user to add and remove tag from articles. In addition to this it is possible for multiple users to edit the same article simultaneously.

I have gone with the pattern of adding/removing individual tags rather then sending through the entire tag list whenever it changes.

As a result it is important that the events are sent to the backend server in the same order that they are input by the user. The reason for this being if a users adds a tag and then removes it and the initial add takes longer to hit the server than the remove it is possible for the system to get out of sync.

My initial approach (based on my experience coding in ruby) was to create a action queue and the have a worker that processed through the queue. However when I started on this it felt like I was fighting the code, and as an ex-colleague used to say “stop write you javascript like ruby”.

So what is the javascript way to achieve my goals? Well as you can probably guess from the title of this post it was promises that came to the rescue.

** Promises

So as a quick refresh for those who can’t remember what promises are, they are those crazy things in javascript that are passed around and expose a `then` function which is called once the promise is resolved (i.e. the data has loaded).

So my plan was to keep a current promise object in memory and then when a new action arrives add the http request within the then callback of the previous promise. I would then store the promise returned from the http request back into memory.

Clear as mud right… so lets look at the code:

```javascript
function change(id, data) {
  changePromise.then(function() {
    changePromise = $http.put('/articles/' + id, data);
  });
}
```

of course we need to do some initial setup to get the first promise object:

```javascript
var deferred = $q.defer();
var changePromise = deferred.promise;
deferred.resolve();
```

Notice that we resolve the initial promise before we set the then callback, this is fine it just means the first http request runs immediately.

** Is this new?

Well actually it seems this is not a new pattern, and that people writing node applications think this is a common pattern (as do potential lots of other developers out there).

The most likely reason is that it is an implementation of the [chain of responsibility](http://www.joezimjs.com/javascript/javascript-design-patterns-chain-of-responsibility/) pattern (just realised this as I finished the post).
