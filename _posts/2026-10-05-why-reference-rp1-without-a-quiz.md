---
title: "Why reference RP1 without a quiz?"
summary: "Someone pointed out I did it wrong."
date: 2026-10-05
structure: quiz
---

<!-- The questions after the first, and the answers, are not in this file:
     they're encrypted in the JSON block below. Rebuild it with
     `ruby _drafts/rp1-quiz/build.rb` after editing the (untracked) plaintext. -->

Looking at the past is just cheating. Every answer below is sitting in this blog's archive, some of it twelve years deep, and I'm counting on nobody being bothered enough to go and look.

Someone pointed out that [the last time I mentioned _Ready Player One_]({% post_url 2026-09-26-first-to-the-key %}) I did it wrong. You can't reference a book that is one long treasure hunt and then not set one. Fair. So here are five questions. Each answer unlocks the next, and the answers aren't in the page source: every section is encrypted with every answer that came before it, so the third needs the first two, the fourth needs the first three, and so on. Get one wrong and nothing past it exists yet.

Enigma's famous weakness was that a letter could never encrypt to itself. I'm not using Enigma (I'm not a lunatic) but I did use a different cipher at every level, because if you're going to show off you might as well do it properly. Wrong answers get a nudge after the second try. Progress sticks around in this browser until you wipe it.

<div class="rp1" id="rp1">
<section data-section="0">
<p><strong>One.</strong> In a post about going a test too far, I numbered one step twice. Which number?</p>
<p class="rp1-nudge" hidden>Count the headings. One of them repeats.</p>
</section>
</div>

<noscript><p>This one needs JavaScript. Question one is still up there, though.</p></noscript>

<!-- rp1-data:begin -->
<script type="application/json" id="rp1-data">{"sections":[{"alg":"aes-gcm","salt":"YU1n5saUDAHs6Zyf+HiMaw==","iv":"KnrxJf40hIImo0aA","ct":"eLkwe1j9AFDeJQYwaurJBeoY+hr+4p+c7tUFi/kxGFIB32fpbIi54A71yyZNh3JuV+KDjE866IDQ6rBBHsql0T44WbZjekh4vDRNwmUUMYqXnzIA7vTSRrYSyBrG9UIka0h7LaidpOEYxh/CqHKnU5rP2PlLxceVSgW5xDJsZTS8B4vL1Ffv7IuxjCpS3mGdo1fOQ2KEn1s8tStW5sFmnAZS9P4eJna3MkGQ99XKPWaS7RMlwFntBrxsOqux0sW4d7tQeidkMEKWpqFrIiF+E+e+Q5TXaLa8tOI8OT0r5VV9HlvfMRVWSkgy8pPTS64Wo2xQ986qFIMw/OpCrhMwzfANaf2EV++dD4PzO5YT7ct+6JgnCVaJ7nvgF/LusAXYbIo2BXIg5D8uf3ZsREl2xNQve+bFWGA0WB3d3WfFHsucLWedR/hlndRyjJoir3ZdqzI0"},{"alg":"aes-cbc","salt":"T16LBvpa4haZQ+4Rv7BnVg==","iv":"7vsEc5M00yfa++JL/d7pzQ==","ct":"Ssc/xc0rR3ca3WvXuBXOchWpS4WpEa7lWiYWhLdqzK631JCxDfcwmWy3qL6JjU2bGXvOAh1zTrDDkvZjnW+rpR9FrNnYPVvYJu+74qw8lEXweQabptBJlXyTO+3oDWRci6sMXW+e8LDItcMxmxHe98x0ycFETnErbHTrNbL5CknvO3cNa/fak5Tu0YDUcC1L3abc8RZDB/KaXuKZllrX1cSEbmDmKsoZ5Cxs0kNdIukjpRB5XUADHQ0J8aAsDuHFkEHx05XTA20ICBWMDyGxmTVASupb/VRZzUdVi/CN4nSTCuqZkZZufswPQNVtbT0owYRN0wiV0BmYEN+tujPXlSrBkDSayYmpakHWIBwI1s4="},{"alg":"aes-ctr","salt":"hf27ocqmRfY3Cyp0UsaWWA==","iv":"EgspmMS0pJri1qvyi+S6/Q==","ct":"vvZEf+KWRKn2+hTkWmEdxcUUNUtAWp7C7To7Zuuc5IbnjbTz+3glOv0EPDy1BqM965gNcoT65EQrC0Th+B97gzbQyWYt5XDilF6HJjqTuEPok2mK2dcH06wh1VCKLrg+lKnCTQaDbmjKjsN0t0nNKdsh2rp4OEbWLC0EGwsRLuCFQyB5BEHTb+gwNuuK1SkSs19bt8ERuV6kB8xWbsObX5O3jE3ld1LPBRm7e3drbxoKnd7F6sNIsEZI73i0lUJn2gPKWqG4VO3kBs+/fXE2JGAxYODYBT/h7TvOfQ8BAt5tWeX4OFo/iJYoPgC0bXW5wiSO7qSUzv5zD2su71uRWuVm8+0/SieqMeiSBGxQ8un5ylABvqfxcec7HnhHhOoxzPKM9fI5/uJztl8D"},{"alg":"xor-sha256","salt":"p1s2yy0VcWjlB3WmckK2ag==","iv":null,"ct":"UCIkMp1W/EtTpJbHJhppBU8AH2KCYFWtHo+w6AxNxyHjaAGuwmf32OMUczXJyJWUqfTiDjOeGwWZsehTdeHaCzYPJNzSiKRPBkgMqV9pLDotczC6I67WdkFv1hRfyuhO8wzBFbuSGZlCjJnTNKuXeKscpc578CaFjmwnvefDslgvunN0m025t7Sl1THwYg7xK+isEXssrXUPW9tRTXU3nE2IZqCUXB+T146vCmmNmlJIXy/b3lShqdS6ON3LM3fOTC7GG9h43FS2/KU6v1HShj3Nx3eUq2jehS9FiGJxRQrJ8/xwAmV1LWM4NFVJFz+xU2eZR1I8WENI1fM+tDjFiQhGPhGTWhJsnRFSw+9dGUtByZwdeHMcyctTNxiuZoLfCOfz"},{"alg":"rotor","salt":"bVHtFVWw6B9ql5zbXGMq0Q==","iv":null,"ct":"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"}]}</script>
<!-- rp1-data:end -->

<style>
.rp1 section { margin: 1.5em 0; }
.rp1-nudge { font-style: italic; opacity: 0.8; }
.rp1-form { display: flex; gap: 0.5em; align-items: center; flex-wrap: wrap; margin: 1em 0 2em; }
.rp1-form input { font: inherit; padding: 0.4em 0.6em; min-width: 12em; }
.rp1-form button { font: inherit; padding: 0.4em 0.9em; cursor: pointer; }
.rp1-msg { opacity: 0.8; }
</style>
<script src="{{ '/assets/js/rp1-quiz.js' | relative_url }}" defer></script>
