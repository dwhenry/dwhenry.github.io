// Site-wide. Keeps one small opaque record in localStorage and, while a hunt
// is open, counts every page viewed that isn't the hunt itself. The record is
// XOR'd with a keyed stream under a random nonce before it is stored, so the
// storage inspector shows a different blob on every write and nothing
// readable. It is obfuscation, not secrecy: the key is in this file.
(function () {
  'use strict';
  var KEY = 'fixing that thing i broke last week';
  var SLOT = '_dw';

  function seed(str) { // FNV-1a, 32-bit
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h || 1;
  }
  function stream(nonce, n) {
    var x = seed(KEY + nonce), out = new Uint8Array(n);
    for (var i = 0; i < n; i++) {
      x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
      out[i] = x & 255;
    }
    return out;
  }
  function enc(obj) {
    var nonce = Math.random().toString(36).slice(2, 10);
    var b = new TextEncoder().encode(JSON.stringify(obj));
    var s = stream(nonce, b.length);
    for (var i = 0; i < b.length; i++) b[i] ^= s[i];
    return nonce + '.' + btoa(String.fromCharCode.apply(null, b));
  }
  function dec(str) {
    try {
      var p = str.split('.');
      var b = Uint8Array.from(atob(p[1]), function (c) { return c.charCodeAt(0); });
      var s = stream(p[0], b.length);
      for (var i = 0; i < b.length; i++) b[i] ^= s[i];
      return JSON.parse(new TextDecoder().decode(b));
    } catch (e) { return null; }
  }
  var store = {
    get: function () { try { var v = localStorage.getItem(SLOT); return v ? dec(v) : null; } catch (e) { return null; } },
    set: function (o) { try { localStorage.setItem(SLOT, enc(o)); } catch (e) { /* ignore */ } },
    clear: function () { try { localStorage.removeItem(SLOT); } catch (e) { /* ignore */ } }
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = { enc: enc, dec: dec }; return; }
  window.__dw = store;
  var s = store.get();
  if (s && !s.finished && s.path !== location.pathname) { s.pages = (s.pages || 0) + 1; store.set(s); }
})();
