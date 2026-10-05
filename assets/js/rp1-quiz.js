// Decrypts the gated sections of "Why reference RP1 without a quiz?".
// Each section is encrypted with a key derived from EVERY answer before it
// (answers 1..n, normalised, joined with "|"), and each level uses a
// different cipher. The plaintext starts with a magic prefix so the
// unauthenticated ciphers can tell a wrong key from a right one.
// State (answers, page tally, misses, timings) is kept through the opaque
// store in site.js (window.__dw); site.js bumps `pages` on every other page
// while a hunt is open.
(function () {
  'use strict';
  const MAGIC = 'dwh:';
  const ITERATIONS = 100000;
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const subtle = globalThis.crypto.subtle;

  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const be32 = (i) => new Uint8Array([(i >>> 24) & 255, (i >>> 16) & 255, (i >>> 8) & 255, i & 255]);
  const concat = (...parts) => {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  };
  const sha = async (alg, bytes) => new Uint8Array(await subtle.digest(alg, bytes));

  async function deriveKey(answers, salt) {
    const base = await subtle.importKey('raw', enc.encode(answers.join('|')), 'PBKDF2', false, ['deriveBits']);
    const bits = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, base, 256);
    return new Uint8Array(bits);
  }

  // Keystream block i = HASH(key || be32(i)); XOR over the data.
  async function xorStream(hash, key, data) {
    const out = new Uint8Array(data.length);
    let i = 0, o = 0;
    while (o < data.length) {
      const block = await sha(hash, concat(key, be32(i++)));
      for (let k = 0; k < block.length && o < data.length; k++, o++) out[o] = data[o] ^ block[k];
    }
    return out;
  }

  // xorshift32, kept to unsigned 32-bit so Ruby and JS agree.
  const xorshift = (x) => {
    x = (x ^ (x << 13)) >>> 0;
    x = (x ^ (x >>> 17)) >>> 0;
    x = (x ^ (x << 5)) >>> 0;
    return x;
  };
  function permutation(seed, n) {
    const perm = Array.from({ length: n }, (_, i) => i);
    let x = seed === 0 ? 1 : seed;
    for (let i = n - 1; i >= 1; i--) {
      x = xorshift(x);
      const j = x % (i + 1);
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    return perm;
  }

  const aes = async (name, key, params, ct) =>
    new Uint8Array(await subtle.decrypt({ name, ...params }, await subtle.importKey('raw', key, name, false, ['decrypt']), ct));

  const ciphers = {
    'aes-gcm': (key, s) => aes('AES-GCM', key, { iv: b64(s.iv) }, b64(s.ct)),
    'aes-cbc': (key, s) => aes('AES-CBC', key, { iv: b64(s.iv) }, b64(s.ct)),
    'aes-ctr': (key, s) => aes('AES-CTR', key, { counter: b64(s.iv), length: 128 }, b64(s.ct)),
    'xor-sha256': (key, s) => xorStream('SHA-256', key, b64(s.ct)),
    // Not Enigma. A key-seeded transposition of the bytes, then a SHA-512 keystream.
    'rotor': async (key, s) => {
      const ct = b64(s.ct);
      const seedBytes = await sha('SHA-256', concat(key, enc.encode('rotor')));
      const seed = new DataView(seedBytes.buffer).getUint32(0, false);
      const perm = permutation(seed, ct.length);
      const x = new Uint8Array(ct.length);
      for (let j = 0; j < ct.length; j++) x[perm[j]] = ct[j];
      return xorStream('SHA-512', key, x);
    },
  };

  // Returns the section's HTML, or null when the answers don't open it.
  async function open(section, answers) {
    try {
      const key = await deriveKey(answers.map(norm), b64(section.salt));
      const text = dec.decode(await ciphers[section.alg](key, section));
      return text.startsWith(MAGIC) ? text.slice(MAGIC.length) : null;
    } catch (_) {
      return null;
    }
  }

  function ui() {
    const root = document.getElementById('rp1');
    const dataEl = document.getElementById('rp1-data');
    if (!root || !dataEl) return;
    const sections = JSON.parse(dataEl.textContent).sections;
    const fresh = () => ({ answers: [], pages: 0, misses: 0, started: Date.now(), finished: null, path: location.pathname });
    const store = window.__dw || { get: () => null, set: () => {}, clear: () => {} };
    let state = store.get();
    if (!state || !Array.isArray(state.answers)) state = fresh();
    // Other tabs (and the back button restoring this page) move the stored
    // tally on without this copy knowing, so fold the stored counts in before
    // every write rather than overwriting them with stale ones.
    const save = () => {
      const stored = store.get();
      if (stored && stored.started === state.started) {
        state.pages = Math.max(state.pages || 0, stored.pages || 0);
        state.misses = Math.max(state.misses || 0, stored.misses || 0);
        state.clicks = Math.max(state.clicks || 0, stored.clicks || 0);
        state.someone = !!(state.someone || stored.someone);
      }
      store.set(state);
      badge();
    };

    // Running score, top right. Same sums as the scorecard: ten an answer,
    // minus pages, misses and one per five minutes, plus the bonus.
    const badgeEl = document.createElement('div');
    badgeEl.className = 'rp1-badge';
    badgeEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(badgeEl);
    function badge() {
      const s = store.get() || state;
      const end = s.finished || Date.now();
      const slow = s.started ? Math.floor((end - s.started) / 300000) : 0;
      const score = (s.answers || []).length * 10 - (s.pages || 0) - (s.misses || 0) - slow + (s.someone ? 20 : 0);
      badgeEl.textContent = (s.finished ? 'final ' : 'score ') + score;
      badgeEl.classList.toggle('rp1-badge-final', !!s.finished);
    }
    setInterval(badge, 30000);
    window.addEventListener('storage', badge);
    save();

    function render(index, html) {
      const sec = document.createElement('section');
      sec.dataset.section = String(index + 1);
      sec.innerHTML = html;
      root.appendChild(sec);
      // innerHTML never runs scripts; swap each one for a live copy so a
      // section can carry its own behaviour.
      sec.querySelectorAll('script').forEach((old) => {
        const live = document.createElement('script');
        for (const a of old.attributes) live.setAttribute(a.name, a.value);
        live.textContent = old.textContent;
        old.replaceWith(live);
      });
    }

    // The form that unlocks sections[index]; its nudge lives in the section above it.
    function addForm(index) {
      const form = document.createElement('form');
      form.className = 'rp1-form';
      form.innerHTML =
        '<input type="text" autocomplete="off" spellcheck="false" aria-label="Answer" placeholder="answer">' +
        '<button type="submit">Unlock</button><span class="rp1-msg" aria-live="polite"></span>';
      const input = form.querySelector('input');
      const msg = form.querySelector('.rp1-msg');
      let misses = 0;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const a = norm(input.value);
        if (!a) return;
        msg.textContent = '…';
        const html = await open(sections[index], [...state.answers.slice(0, index), a]);
        if (html === null) {
          misses += 1;
          state.misses = (state.misses || 0) + 1;
          save();
          msg.textContent = misses === 1 ? 'Not that.' : 'Still not that.';
          if (misses >= 2) {
            const nudge = root.querySelector('[data-section="' + index + '"] .rp1-nudge');
            if (nudge) nudge.hidden = false;
          }
          input.select();
          return;
        }
        state.answers = [...state.answers.slice(0, index), a];
        if (state.answers.length === sections.length) state.finished = Date.now();
        save();
        form.remove();
        render(index, html);
        if (index + 1 < sections.length) addForm(index + 1);
      });
      root.appendChild(form);
      input.focus({ preventScroll: true });
    }

    // Replay what this browser has already answered, then offer the next gate.
    (async () => {
      let i = 0;
      for (; i < state.answers.length && i < sections.length; i++) {
        const html = await open(sections[i], state.answers.slice(0, i + 1));
        if (html === null) break;
        render(i, html);
      }
      state.answers = state.answers.slice(0, i);
      save();
      if (i < sections.length) addForm(i);
    })();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { open, norm, permutation, xorshift };
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ui);
  } else {
    ui();
  }
})();
