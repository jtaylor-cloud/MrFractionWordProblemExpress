/* ============================================================
   The Scene — a literal picture of the problem, beside the words.

   The Model Yard shows the ABSTRACT structure (equal parts of a bar) at
   one station. This is different and complementary: actual bowls, actual
   coins, actual basketballs, sitting next to the problem text on every
   screen where that text appears.

   Why both: a bar model teaches the mathematical structure, but a student
   who cannot picture "three quarters of a pot of soup" has nothing to
   attach the structure to. The scene gives them the objects; the yard
   gives them the maths.

   The count is DERIVED from the bar model, never authored twice — draw
   `segments` objects and fill `marked` of them. If the maths changes, the
   picture changes with it and cannot drift out of step.

   Note on the motion rule: THEME §3.3 previously banned animation within
   200px of problem text. That rule exists to stop decorative movement
   competing with reading. These objects ARE the problem — they count out
   the quantity and then sit still, apart from a slow idle on the filled
   ones. Rule amended rather than ignored; see THEME-AND-ACCESSIBILITY.
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* Each icon is drawn in a 40x40 box. `on` = this one is counted/used. */
  var ICONS = {
    bowl: function (on) {
      return '<path d="M5 20 H35 A15 15 0 0 1 20 35 A15 15 0 0 1 5 20 Z" fill="' +
             (on ? 'var(--sc-fill)' : 'var(--sc-empty)') + '" stroke="var(--sc-ink)" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<ellipse cx="20" cy="20" rx="15" ry="3.4" fill="' + (on ? 'var(--sc-fill-hi)' : 'var(--sc-empty-hi)') +
             '" stroke="var(--sc-ink)" stroke-width="2"/>' +
             '<path d="M27 12 L31 6" stroke="var(--sc-ink)" stroke-width="2.4" stroke-linecap="round"/>' +
             (on ? '<g class="sc-steam">' +
                   '<path d="M15 15 q-3 -5 0 -9" stroke="var(--sc-ink)" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".55"/>' +
                   '<path d="M21 14 q3 -6 0 -10" stroke="var(--sc-ink)" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".4"/>' +
                   '</g>' : '');
    },
    coin: function (on) {
      return '<circle cx="20" cy="20" r="14" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
             '<circle cx="20" cy="20" r="9.5" fill="none" stroke="var(--sc-ink)" stroke-width="1.4" opacity=".55"/>' +
             '<text x="20" y="25" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" ' +
             'font-size="13" font-weight="700" fill="var(--sc-ink)">$</text>';
    },
    ball: function (on) {
      return '<circle cx="20" cy="20" r="14" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
             '<path d="M6 20 H34 M20 6 V34" stroke="var(--sc-ink)" stroke-width="1.6" opacity=".65"/>' +
             '<path d="M10 10 Q20 20 10 30 M30 10 Q20 20 30 30" stroke="var(--sc-ink)" stroke-width="1.4" fill="none" opacity=".5"/>';
    },
    box: function (on) {
      return '<rect x="6" y="12" width="28" height="22" rx="2" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
             '<path d="M6 19 H34" stroke="var(--sc-ink)" stroke-width="1.8"/>' +
             '<path d="M20 12 V34" stroke="var(--sc-ink)" stroke-width="1.6" opacity=".6"/>' +
             '<path d="M13 12 L20 6 L27 12" fill="none" stroke="var(--sc-ink)" stroke-width="2" stroke-linejoin="round"/>';
    },
    patch: function (on) {
      return '<rect x="6" y="6" width="28" height="28" rx="3" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
             '<path d="M6 20 H34 M20 6 V34" stroke="var(--sc-ink)" stroke-width="1.2" stroke-dasharray="3 3" opacity=".6"/>';
    },
    horn: function (on) {
      return '<circle cx="15" cy="22" r="11" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2"/>' +
             '<path d="M24 16 L34 9 L34 27 L24 22" fill="' + (on ? 'var(--sc-fill)' : 'var(--sc-empty)') +
             '" stroke="var(--sc-ink)" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<circle cx="15" cy="22" r="4.5" fill="none" stroke="var(--sc-ink)" stroke-width="1.5" opacity=".6"/>';
    },
    /* Each wheel is its OWN group. They used to share one, so `transform-origin:
       center` resolved to the midpoint BETWEEN them and the pair orbited the
       frame instead of spinning. Spokes are what make a spin visible at all —
       a plain circle rotating looks like nothing is happening. */
    bike: function (on) {
      function wheel(cx) {
        var w = '<g class="sc-wheel">' +
          '<circle cx="' + cx + '" cy="26" r="8" fill="none" stroke="var(--sc-ink)" stroke-width="2.2"/>';
        for (var k = 0; k < 4; k++) {
          var a = (k * 45) * Math.PI / 180;
          w += '<line x1="' + (cx - 7 * Math.cos(a)).toFixed(1) + '" y1="' + (26 - 7 * Math.sin(a)).toFixed(1) +
               '" x2="' + (cx + 7 * Math.cos(a)).toFixed(1) + '" y2="' + (26 + 7 * Math.sin(a)).toFixed(1) +
               '" stroke="var(--sc-ink)" stroke-width="1" opacity=".7"/>';
        }
        return w + '<circle cx="' + cx + '" cy="26" r="2" fill="var(--sc-ink)"/></g>';
      }
      return wheel(11) + wheel(30) +
             '<path d="M11 26 L18 14 L26 26 M18 14 L28 14 M30 26 L26 14" fill="none" stroke="' +
             (on ? 'var(--sc-fill)' : 'var(--sc-ink)') + '" stroke-width="' + (on ? '3' : '2.2') +
             '" stroke-linejoin="round" stroke-linecap="round"/>';
    }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** Every loaded per-line illustration library, found rather than remembered. */
  function sceneLibs() {
    return Object.keys(global).filter(function (k) {
      var v = global[k];
      return /Scenes$/.test(k) && v && typeof v.has === 'function' && typeof v.html === 'function';
    }).map(function (k) { return global[k]; });
  }

  /**
   * "unit" mode — ONE object, subdivided.
   *
   * Drawing 20 separate patches for a single quilt says there are 20 quilts.
   * When the whole is one continuous thing, the picture has to be one thing
   * cut up.
   *
   * It also draws each GIVEN quantity in its own colour and leaves the
   * unknown hatched with "?". The previous version filled 13 of 20 in a
   * single colour — but 13/20 is what you get from adding 2/5 + 1/4, so the
   * picture was stating the answer to the first step as though it had been
   * given. Show what the problem gives you; leave what it asks for blank.
   */
  /* @param masked  the first read hides every quantity (Pedagogy §1.4).
     The GRID may still be drawn — a picture of shares with nothing named is
     exactly what that read is for — but the legend must not print the
     fractions, and neither must the aria-label.

     Found 2026-08-03: the quilt legend read "blue 2/5 · red 1/4" and its
     description said "8 of 20 blue" while the prose beside it was masked.
     Every file was correct alone; the leak lived in the composition
     (VERIFICATION.md §13) — and the version a screen-reader user got was the
     worse of the two, because the aria-label spelled out the counts. */
  function unitHtml(p, sc, bar, masked) {
    var groups = sc.groups || [];
    var total = groups.reduce(function (a, g) { return a + g.n; }, 0);
    if (total !== bar.segments) return '';       // picture must match the maths

    var cells = '', idx = 0, legend = '';
    groups.forEach(function (g, gi) {
      for (var i = 0; i < g.n; i++, idx++) {
        /* The quilt keeps its colours on every phase. Blanking them turned it
           into twenty grey squares of "?" — the user's words — while the Ratio
           and Change lines went on showing full illustrations, because their
           scenes are not countable grids and so escaped the same rule. What is
           withheld while masked is the legend's VALUE ("blue 2/5"), which is a
           digit on a numberless screen, and the counts in the description. The
           picture itself stays a picture. */
        var key = g.key;
        cells += '<span class="ucell u-' + esc(key) + '" style="--u-i:' + idx + '">' +
                 (key === 'unknown' ? '?' : '') + '</span>';
      }
      legend += '<span class="ulg"><span class="usw u-' + esc(g.key) + '"></span>' +
                esc(g.label) + (g.as && !masked ? ' <strong>' + esc(g.as) + '</strong>' : '') + '</span>';
    });

    // Names the shares without counting them, which is what the sighted reader
    // gets too. Restored to the original wording after a brief detour.
    var words = masked
      ? groups.map(function (g) { return g.label; }).join('; ')
      : groups.map(function (g) { return g.n + ' of ' + bar.segments + ' ' + g.label; }).join('; ');
    var cap = sc.caption;

    return '<figure class="scene scene-unit">' +
             '<div class="unit-frame" role="img" aria-label="' + esc(cap + ' ' + words) + '">' +
               '<div class="unit-grid" style="--u-cols:' + (sc.cols || 5) + '">' + cells + '</div>' +
             '</div>' +
             '<div class="unit-legend">' + legend + '</div>' +
             '<figcaption class="sc-cap">' + esc(cap) + '</figcaption>' +
           '</figure>';
  }

  /**
   * @param {object} p  a problem manifest
   * @returns {string} html, or '' if the problem has no scene
   */
  function html(p, masked) {
    var sc = p.scene;
    /* An "anim" scene is a bespoke illustration for its problem, not a
       partition of anything — see ratio-scenes.js for why the Ratio & Rate
       line needed its own pictures instead of the unit grid. */
    /* An "anim" scene is a bespoke illustration for its problem, and each LINE
       owns its own set — ask every library that is loaded, not just the first
       one written. Routing straight to RatioScenes returned '' for any art it
       did not have, so a Change problem would have rendered a silent empty
       frame; the validator now refuses an art name no library claims. */
    /* DISCOVERED, NOT LISTED. This was a hand-written chain of four `if`s, and
       a fifth library added without editing it would have returned '' — a
       silent empty frame, which is the failure this very chain was written to
       fix when it was one `if`. The same hardcoded-list defect has now been
       found in five files on this project, twice inside a checker; the fix is
       always the same, so it is applied here before the fifth library exists
       rather than after it ships blank. Ask the world what libraries there are:
       anything named `*Scenes` exposing `has` and `html` is one. */
    if (sc && sc.mode === 'anim') {
      var lib = sceneLibs().filter(function (L) { return L.has(sc.art); })[0];
      return lib ? lib.html(p) : '';
    }
    var bar0 = p.signalBox && p.signalBox.barModel && p.signalBox.barModel.bars && p.signalBox.barModel.bars[0];
    if (sc && sc.mode === 'unit' && bar0) return unitHtml(p, sc, bar0, masked);
    var bar = p.signalBox && p.signalBox.barModel && p.signalBox.barModel.bars && p.signalBox.barModel.bars[0];
    if (!sc || !bar || !ICONS[sc.icon]) return '';

    var n = bar.segments, on = bar.marked;
    var draw = ICONS[sc.icon];
    var items = '';
    for (var i = 0; i < n; i++) {
      /* THE PICTURE IS DRAWN IN FULL, ON EVERY PHASE.
         This briefly lit nothing while the numbers were masked, on the grounds
         that three filled boxes out of ten IS the masked number to anyone who
         counts. True — but the cure emptied the illustration, and only on the
         Part–Whole line, because those are the problems whose scenes happen to
         be countable grids. The Ratio and Change lines draw bespoke `anim`
         scenes, which were never touched, so the first read showed a full
         illustration on two lines and a blank grid on the third.

         That is the mis-scoped-safety-rule pattern this project has recorded
         twice before, and the user found it on the screen both times. The
         resolution is not deletion. What is masked here is what the picture
         SAYS — see `words` below and the legend in unitHtml — not what it
         shows. A student who counts filled bowls has done some reading; a
         student looking at an empty frame has been given nothing. */
      var lit = i < on;
      items += '<span class="sc-item ic-' + esc(sc.icon) + (lit ? ' is-on' : '') + '" style="--sc-i:' + i + '">' +
               '<svg viewBox="0 0 40 40" xmlns="' + NS + '" aria-hidden="true">' + draw(lit) + '</svg>' +
               '</span>';
    }

    /* The written equivalent is the real content; the picture supports it.
       Masked, it must not count either — this said "3 of 10 tenths of the day
       packed, 7 still to do" beside prose reading "some number", so the
       student least able to cross-check got the answer read aloud. */
    /* The picture is fully drawn either way; the DESCRIPTION is what stops
       counting. Masked it names what is happening without saying how much —
       "Some are served, the rest are still in the pot" — so a screen-reader
       user gets the same information a sighted one does, and no more. It used
       to read "3 of 10 tenths of the day packed, 7 still to do" beside prose
       saying "some number", which handed the answer to exactly the student
       least able to cross-check it. */
    var words = masked
      ? 'Some are ' + esc(sc.onWord || 'counted') + ', the rest are ' + esc(sc.offWord || 'not') + '.'
      : on + ' of ' + n + ' ' + (sc.plural || 'parts') + ' ' + esc(sc.onWord || 'counted') +
        ', ' + (n - on) + ' ' + esc(sc.offWord || 'not');

    /* The caption is the authored one on every phase. It was briefly trimmed
       while masked, because the blanked picture made "the served ones are
       steaming" false — a fix for a problem that should not have existed. With
       the picture drawn in full the caption is true again. */
    var cap = sc.caption;

    return '<figure class="scene" data-count="' + n + '">' +
             '<div class="sc-grid" role="img" aria-label="' + esc(cap + ' ' + words) + '">' + items + '</div>' +
             '<figcaption class="sc-cap">' + esc(cap) + '</figcaption>' +
           '</figure>';
  }

  global.Scene = { html: html, icons: Object.keys(ICONS), libs: sceneLibs };
})(window);
