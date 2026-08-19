/* ============================================================
   Animated scene illustrations for the Ratio & Rate Rail.

   WHY THESE EXIST
   The ratio problems were shipping the same unit-grid picture as the quilt:
   a tray of coloured cells. That is the Part–Whole illustration, it is static,
   and on this line it was both the wrong idea and the wrong invitation — a
   student glancing at the page saw a spreadsheet, not a story.

   A rate is something HAPPENING over time. So each of these is a small
   machine doing its job: a press throwing out posters, a van eating road, an
   urn filling. The motion is the point — it is what makes the quantity feel
   like it is accumulating rather than sitting still.

   RULES THESE FOLLOW
   - No numerals anywhere. The illustration says "posters keep coming", never
     how many. Nothing here can leak an answer because nothing here counts.
   - Placement lives on an OUTER group, animation on an INNER one. A CSS
     transform beats the transform attribute in SVG, so animating a placed
     element wipes its position and stacks everything at the origin. That has
     already happened once on this project; see the leg-car comment.
   - Any element that rotates about a point draws that point at the bottom
     centre of its own bounding box, so `transform-origin: 50% 100%` is the
     real pivot. `transform-box: fill-box` makes the box its own reference.
   - Every scene carries a text description; prefers-reduced-motion freezes
     the motion and the picture still has to read.
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var INK = '#241B10', CREAM = '#FDF8F0', MID = '#EFE4D0', SHADE = '#BCAA8C';
  var LINE = 'var(--line-ratio)';

  function ground(y) {
    return '<path d="M0 ' + y + ' H320" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
  }

  /* A rotating part: outer group places it, inner group spins. */
  function spinner(x, y, r, cls) {
    return '<g transform="translate(' + x + ',' + y + ')"><g class="' + cls + '">' +
      '<circle r="' + r + '" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M0 ' + (-r) + ' V' + r + ' M' + (-r) + ' 0 H' + r + '" stroke="' + INK + '" stroke-width="1.6" opacity=".6"/>' +
      '</g></g>';
  }

  /* A clock face whose hand sweeps. The hand is a rect running from its pivot
     upward so the bbox bottom-centre IS the pivot. */
  function dial(x, y, r) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<circle r="' + r + '" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle r="1.8" fill="' + INK + '"/>' +
      '<g class="rsc-hand"><rect x="-1.3" y="' + (-r + 4) + '" width="2.6" height="' + (r - 4) + '" rx="1.3" fill="' + INK + '"/></g>' +
      '</g>';
  }

  var ART = {

    /* ---- The print shop: the press throws posters, the clock keeps time ---- */
    printer: function () {
      var s = '';
      s += '<rect x="0" y="0" width="320" height="130" fill="none"/>';
      s += ground(112);

      // press body
      s += '<rect x="18" y="44" width="116" height="60" rx="7" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.6"/>';
      s += '<rect x="30" y="30" width="76" height="16" rx="4" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<rect x="30" y="56" width="58" height="22" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>';
      s += '<circle cx="118" cy="58" r="4" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2" class="rsc-blink"/>';
      s += spinner(46, 90, 11, 'rsc-roller');
      s += spinner(78, 90, 11, 'rsc-roller rsc-roller-b');
      // output slot
      s += '<rect x="130" y="66" width="12" height="26" rx="2" fill="' + INK + '"/>';

      // posters leaving the slot, one after another
      for (var i = 0; i < 3; i++) {
        s += '<g transform="translate(140,68)"><g class="rsc-sheet" style="--i:' + i + '">' +
             '<rect x="0" y="0" width="30" height="38" rx="2.5" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<rect x="5" y="6" width="20" height="11" rx="1.5" fill="' + LINE + '" opacity=".55"/>' +
             '<path d="M5 24 H25 M5 30 H19" stroke="' + INK + '" stroke-width="1.8" opacity=".5" stroke-linecap="round"/>' +
             '</g></g>';
      }

      // the stack they land on
      s += '<g transform="translate(232,86)">' +
           '<rect x="0" y="18" width="46" height="8" rx="2" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2"/>' +
           '<rect x="2" y="10" width="44" height="8" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
           '<g class="rsc-stacktop"><rect x="1" y="2" width="45" height="8" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/></g>' +
           '</g>';

      s += dial(288, 34, 18);
      return s;
    },

    /* ---- The bakery: one bowl, two hoppers, and a baker sliding the bowl
       under each in turn.

       The hoppers sit at x 74 and x 220; the bowl's mouth is only 128 wide.
       Standing still in the middle it can catch the water and NOTHING ELSE —
       the flour fell past its left edge onto the floor, which is both wrong
       and worse than wrong, because a picture of a ratio that only ever
       receives one of its two ingredients teaches the opposite of the lesson.

       So the bowl shuttles, and the two streams are timed to the shuttle:
       flour pours while the bowl is left, water while it is right. Nothing
       ever falls where the bowl is not. The cycle length is shared between
       bowl and drops on purpose — if they were set independently they would
       drift apart and the picture would start lying again. ---- */
    mixer: function () {
      var s = ground(114);
      // two hoppers
      s += '<path d="M40 22 H108 L94 52 H54 Z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>';
      s += '<path d="M186 22 H254 L240 52 H200 Z" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>';

      // the bowl, drawn BEFORE the drops so falling grain lands in front of it
      s += '<g class="rsc-bowl">' +
             '<path d="M96 76 H224 A64 64 0 0 1 160 112 A64 64 0 0 1 96 76 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.8" stroke-linejoin="round"/>' +
             '<ellipse cx="160" cy="76" rx="64" ry="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<g class="rsc-swirl"><ellipse cx="160" cy="76" rx="34" ry="5" fill="' + LINE + '" opacity=".5"/></g>' +
           '</g>';

      // flour falls on the left half of the cycle, water on the right half
      for (var i = 0; i < 3; i++) {
        s += '<g transform="translate(74,54)"><g class="rsc-mdrop rsc-mdrop-l" style="--i:' + i + '">' +
             '<rect x="-3.5" y="0" width="7" height="12" rx="3.5" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
        s += '<g transform="translate(220,54)"><g class="rsc-mdrop rsc-mdrop-r" style="--i:' + i + '">' +
             '<rect x="-3.5" y="0" width="7" height="12" rx="3.5" fill="' + LINE + '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
      }
      return s;
    },

    /* ---- The delivery run: road going by, wheels turning ---- */
    van: function () {
      var s = '';
      // hills drifting behind
      s += '<g class="rsc-scroll-slow">' +
           '<path d="M-40 96 q40 -34 80 0 t80 0 t80 0 t80 0 t80 0" fill="none" stroke="' + SHADE + '" stroke-width="2.4"/></g>';
      s += ground(104);
      /* Road dashes rushing past. ONE SUBPATH, and it has to stay one.
         This was `M0 110 H320 M340 110 H660` — two subpaths with a 20-unit
         hole between them, and SVG restarts the dash pattern at every subpath.
         The result was a 38-unit gap where every other gap is 18, scrolling
         through the frame once a second, plus a 20-unit (half-period) jump in
         the dash phase every time the loop restarted. Neither is visible in a
         still; both are obvious in a strip that is meant to be endless.
         Length 660 with a 40-unit repeat covers the frame at both ends of a
         320-unit travel, and 320/40 = 8 exactly, so the loop is seamless. */
      s += '<g class="rsc-scroll"><path d="M0 110 H660" stroke="' + INK + '" stroke-width="3" stroke-dasharray="22 18" stroke-linecap="round" opacity=".55"/></g>';
      // van
      s += '<g transform="translate(96,52)">' +
           '<g class="rsc-bounce">' +
             '<rect x="0" y="6" width="86" height="40" rx="6" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.6"/>' +
             '<path d="M86 18 H108 L124 34 V46 H86 Z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
             '<rect x="90" y="22" width="22" height="13" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<path d="M10 16 H40 M10 26 H32" stroke="' + CREAM + '" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>' +
           '</g></g>';
      s += spinner(122, 104, 13, 'rsc-roller');
      s += spinner(196, 104, 13, 'rsc-roller');
      return s;
    },

    /* ---- The coast line: sleepers scrolling under a moving train ---- */
    train: function () {
      var s = '';
      /* THE SLEEPERS SCROLL 312, NOT 320, AND THE NUMBER IS NOT ARBITRARY.
         A scrolling strip is only endless if the last frame of the loop is
         identical to the first, which means the travel must be a whole
         multiple of the strip's own repeat. The sleeper pitch is 26; the
         shared keyframe's default travel is 320; 320 mod 26 = 8. So this
         ground snapped 8 units BACKWARDS under the train every 1.6 seconds,
         for as long as the scene has existed. Measured on screen: pitch
         26.00, travel 319.98, mismatch 7.98.

         312 = 12 x 26. Change the pitch and you must change this with it, and
         check the strip still reaches past x=320 at full travel: the last
         sleeper starts at 650, and 650 - 312 = 338. The dead stroke-width="0"
         path that used to sit here drew nothing and is gone. */
      s += '<g class="rsc-scroll" style="--rsc-span:312px">';
      for (var i = 0; i < 26; i++) {
        s += '<rect x="' + (i * 26) + '" y="100" width="14" height="7" rx="2" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="1.4"/>';
      }
      s += '</g>';
      s += '<path d="M0 98 H320 M0 110 H320" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      /* The engine is MIRRORED to face right.
         The house locomotive artwork is drawn facing left (same as the one on
         the route map, which mirrors it to lead). Dropped in unmirrored it
         pointed its chimney back down the track it had just covered, while the
         sleepers scrolled left and the steam trailed left — both of which say
         the train is travelling RIGHT. The picture was running backwards.

         Turning the engine rather than reversing the world, because the van
         scene in this same section already travels right; flipping the track
         here would leave the two vehicle scenes contradicting each other.

         The mirror lives on the OUTER placement group, so it never fights the
         bounce animation on the inner one. translate(182) then scale(-1,1)
         reflects local x 0..116 onto world 182..66 — the same footprint the
         engine had before, so the wheels below it do not move. */
      s += '<g transform="translate(182,44) scale(-1,1)"><g class="rsc-bounce">' +
           '<rect x="0" y="22" width="112" height="10" rx="4" fill="' + INK + '"/>' +
           '<rect x="22" y="-6" width="66" height="30" rx="14" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
           '<rect x="82" y="-20" width="34" height="44" rx="5" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
           '<rect x="88" y="-14" width="22" height="14" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
           '<rect x="26" y="-22" width="13" height="18" rx="3" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
           '</g></g>';
      s += spinner(96, 96, 12, 'rsc-roller');
      s += spinner(134, 96, 12, 'rsc-roller');
      s += spinner(168, 96, 12, 'rsc-roller');
      /* Steam follows the chimney to its new side. Mirroring put the chimney
         at world x 143..156, so the puffs start at its centre and still drift
         BACKWARDS — left — which is the correct trail for a train heading
         right. Leave this at the old 102 and the engine smokes from its cab. */
      for (var k = 0; k < 3; k++) {
        s += '<g transform="translate(150,22)"><g class="rsc-puff" style="--i:' + k + '">' +
             '<circle r="9" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8" opacity=".9"/></g></g>';
      }
      s += dial(288, 34, 18);
      return s;
    },

    /* ---- The market: two stalls, two price tags, one of them better ---- */
    stall: function () {
      var s = ground(114);
      [[16, LINE], [176, SHADE]].forEach(function (st, idx) {
        var x = st[0];
        s += '<g transform="translate(' + x + ',0)">';
        s += '<path d="M8 44 H120 V56 H8 Z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
        // striped awning
        for (var i = 0; i < 5; i++) {
          s += '<path d="M' + (8 + i * 22.4) + ' 44 v-18 h22.4 v18 z" fill="' + (i % 2 ? CREAM : st[1]) + '" stroke="' + INK + '" stroke-width="2"/>';
        }
        s += '<path d="M14 56 V112 M114 56 V112" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
        // sacks on the counter
        s += '<path d="M34 96 q-6 -22 12 -24 q18 2 12 24 z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
        s += '<path d="M70 96 q-6 -18 10 -20 q16 2 10 20 z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
        // the swinging price tag
        s += '<g transform="translate(' + (idx ? 96 : 96) + ',58)"><g class="rsc-swing" style="--i:' + idx + '">' +
             '<path d="M0 0 V14" stroke="' + INK + '" stroke-width="2"/>' +
             '<path d="M-13 14 H13 L18 26 L0 38 L-18 26 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<circle cy="22" r="3.4" fill="' + INK + '" opacity=".65"/>' +
             '</g></g>';
        s += '</g>';
      });
      return s;
    },

    /* ---- The cafe urn: two liquids in fixed proportion, level rising ---- */
    urn: function () {
      var s = ground(116);
      // two streams
      for (var i = 0; i < 3; i++) {
        s += '<g transform="translate(132,26)"><g class="rsc-drop" style="--i:' + i + '">' +
             '<rect x="-4" y="0" width="8" height="13" rx="4" fill="' + LINE + '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
        s += '<g transform="translate(188,26)"><g class="rsc-drop rsc-drop-b" style="--i:' + i + '">' +
             '<rect x="-4" y="0" width="8" height="13" rx="4" fill="#7FB6C9" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
      }
      // urn body
      s += '<rect x="102" y="46" width="116" height="66" rx="10" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.8"/>';
      s += '<rect x="96" y="38" width="128" height="12" rx="5" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.5"/>';
      // rising contents, clipped to the urn
      s += '<clipPath id="rsc-urn-clip"><rect x="105" y="49" width="110" height="60" rx="8"/></clipPath>';
      s += '<g clip-path="url(#rsc-urn-clip)"><g class="rsc-fill-rise">' +
           '<rect x="105" y="49" width="110" height="60" fill="' + LINE + '" opacity=".45"/></g></g>';
      // tap and handle
      s += '<path d="M218 78 H236 V92" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
      s += '<path d="M112 30 q46 -20 96 0" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      return s;
    },

    /* ---- The barrow: a fixed share of a passing crowd ----
       A RATE written in per cent. What has to be visible is the RELATIONSHIP —
       people going past, and a steady trickle of them peeling off to the
       barrow — because that is the thing a rate is, and it is what makes this a
       Ratio problem rather than a percentage of a total.

       BOTH QUANTITIES ARE COUNTS, AND BOTH ARE IN THE PROBLEM, so both have to
       be untallyable. The crowd runs off both edges at a pitch of eleven
       against a coat eighteen wide and a head fourteen wide, so every figure
       overlaps its neighbours and there is no first or last. The cups on the
       barrow are stacked rather than laid out, so the stack states a height and
       not a number, and it is drawn behind the barrow's front board so its
       bottom is hidden — a stack you can see the base of is a stack you can
       count.

       NOTHING MAY LOOK LIKE IT IS RUNNING OUT. This problem's Platform Check
       answers "steady": the rate holds whatever the crowd, and no amount ends
       up different from how it started. So the urn steams, the awning flaps and
       the crowd walks, and the stack of cups never gets shorter. */
    barrow: function () {
      var s = ground(120);

      /* The crowd, drawn FIRST so the barrow and its customer paint over it —
         which is also what puts the barrow in front and the crowd behind. */
      for (var x = -12, i = 0; x < 340; x += 11, i++) {
        s += '<g transform="translate(' + x + ',120)"><g class="rsc-sway" style="--i:' + (i % 5) + '">' +
               '<path d="M-4 -11 V0 M4 -11 V0" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
               '<path d="M-9 -11 V-28 q9 -6 18 0 V-11 Z" fill="#8FA6B8" stroke="' + INK + '" stroke-width="1.8"/>' +
               '<circle cy="-35" r="7" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '</g></g>';
      }

      // the barrow: a board front on two wheels, with an awning over it
      s += '<rect x="176" y="74" width="118" height="34" rx="4" fill="' + MID +
           '" stroke="' + INK + '" stroke-width="2.6"/>';
      s += '<path d="M170 70 H300 L292 56 H178 Z" fill="' + LINE + '" stroke="' + INK +
           '" stroke-width="2.4" stroke-linejoin="round"/>';
      ['196', '274'].forEach(function (wx) {
        s += '<g transform="translate(' + wx + ',112)"><g class="rsc-roller">' +
               '<circle r="8" fill="none" stroke="' + INK + '" stroke-width="2.2"/>' +
               '<path d="M-8 0 H8 M0 -8 V8" stroke="' + INK + '" stroke-width="1.4" opacity=".7"/>' +
             '</g></g>';
      });

      /* The urn on the barrow, steaming. Steam is the only thing on this scene
         that changes shape, and it changes nothing's amount. */
      s += '<rect x="186" y="46" width="30" height="30" rx="5" fill="' + CREAM +
           '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<path d="M216 58 H224 V66" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
      [0, 1].forEach(function (k) {
        s += '<g transform="translate(' + (194 + k * 12) + ',44)"><g class="rsc-puff" style="--i:' + k + '">' +
               '<path d="M0 0 q-5 -8 0 -14" fill="none" stroke="' + INK +
                 '" stroke-width="1.8" stroke-linecap="round" opacity=".5"/>' +
             '</g></g>';
      });

      /* The cup stack, clipped by the barrow's front board so its base cannot be
         seen and therefore cannot be counted. It states "there are cups", which
         is all the story needs, and no number. */
      s += '<clipPath id="rsc-barrow-clip"><rect x="240" y="40" width="48" height="36"/></clipPath>';
      s += '<g clip-path="url(#rsc-barrow-clip)">';
      for (var c = 0; c < 5; c++) {
        s += '<path d="M252 ' + (72 - c * 8) + ' h22 l-3 8 h-16 Z" fill="' + CREAM +
             '" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>';
      }
      s += '</g>';

      /* One customer, turned in towards the barrow — the trickle peeling off the
         crowd. Deliberately a SINGLE figure and deliberately not the quantity:
         how many buy is what the Engine Room asks. */
      s += '<g transform="translate(232,120)"><g class="rsc-bounce">' +
             '<path d="M-4 -12 V0 M4 -12 V0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M-10 -12 V-30 q10 -7 20 0 V-12 Z" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<circle cy="-38" r="7.5" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
           '</g></g>';
      return s;
    }
  };

  function has(name) { return Object.prototype.hasOwnProperty.call(ART, name); }

  function html(p) {
    var sc = p.scene;
    if (!sc || !has(sc.art)) return '';
    return '<figure class="scene rsc">' +
             '<div class="rsc-frame" role="img" aria-label="' + esc(sc.caption || '') + '">' +
               '<svg viewBox="0 0 320 130" xmlns="' + NS + '" class="rsc-svg" aria-hidden="true">' +
                 ART[sc.art]() +
               '</svg>' +
             '</div>' +
             '<figcaption class="sc-cap">' + esc(sc.caption || '') + '</figcaption>' +
           '</figure>';
  }

  global.RatioScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
