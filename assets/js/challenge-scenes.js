/* ============================================================
   Animated scene illustrations for Crossover Island.

   WHY THESE EXIST, AND IT IS NOT DECORATION.
   The seven island problems borrowed their pictures from the mainland, and
   measured across the five that had one, EVERY borrowed scene turned out to be
   the art of that problem's own FIRST-half line: `cl-signal-delay` wore the
   Compare Line's `delays`, `cl-season-tickets` wore Compare's `queues`,
   `cl-lost-umbrellas` wore Change's `lostproperty`, `cl-buffet-crates` wore
   Ratio's `urn`. That art renders on read1 — the screen where the student runs
   the five-question checklist and answers whether this story is one kind of
   situation or two. A student who has ridden the mainland was being shown the
   Compare Line's picture while being asked what kind of situation they were
   looking at. It is a weak tell — you have to recognise the artwork — but it is
   a tell pointing at half the answer, and it is the same class as the leg-map
   geometry recorded in stations.js. Unique art removes it.

   Two of the seven had no picture at all, which was the other half of the
   problem: `cl-platform-planters` and both pool problems shipped with a blank
   where every other problem on the site has an illustration.

   HOW A LIBRARY IS FOUND. `Scene.sceneLibs()` collects any global matching
   `*Scenes` that exposes `has` and `html` — discovered, never listed — so this
   file needs no registration anywhere. Dispatch is by ART NAME rather than by
   line, which is what lets an island problem carrying `line: "ratio"` draw from
   here instead of from `RatioScenes`. Art names must therefore be unique across
   ALL libraries; every name below was checked against the other five.

   RULES THESE FOLLOW — the same ones the other five libraries follow, plus one.

   - NO NUMERALS ANYWHERE, in the drawing or the caption. These render on
     numberless screens and the sweep fails the build if a digit reaches one,
     including through `aria-label`.

   - THE OBJECTS THAT ARE THE QUANTITY MUST BE UNCOUNTABLE. This is the Compare
     Line's rule and it binds harder here, because on a two-line problem the
     transfer is a count nobody states. Every scene below whose subject IS the
     counted thing — planters, umbrellas, bottles, sleepers, tickets — draws it
     running off both edges of the frame and overlapping, so no student can
     count the picture instead of reading the story. Where the counted thing is
     NOT the subject (minutes and miles on `signalbox`, carriages per hour on
     `washshed`) the objects may be whole, because counting them tells you
     nothing.

   - PLACEMENT ON AN OUTER GROUP, ANIMATION ON AN INNER ONE. A CSS transform
     beats the transform attribute in SVG, so animating a placed element wipes
     its position and stacks everything at the origin. That has happened twice
     on this project.

   - NO NEW CSS. Every class used here is from the shared `rsc-*` vocabulary
     the other five libraries already use, which means reduced motion is
     already handled: `.rsc-svg [class*="rsc-"] { animation: none !important }`
     freezes the lot, and the classes that need a resting state already declare
     one. A new animation class would have been a new thing to keep in step for
     no gain.
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
  /* NEUTRAL INK, NEVER A LINE COLOUR. Every other library paints its subject in
     its own line's colour — that is how `--line-compare` on a picture became a
     tell. The island's track is drawn in ink for the same reason (scenery.js),
     so its scenes are too. */
  var TONE = '#5A3E28', TONE2 = '#8F7F63';

  function ground(y) {
    return '<path d="M0 ' + y + ' H320" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
  }

  /* Rails running off both edges, which is the island's visual signature and
     also the honest way to draw track: a line does not begin at the frame. */
  function rails(y) {
    return '<path d="M0 ' + y + ' H320" stroke="' + INK + '" stroke-width="2.4"/>' +
           '<path d="M0 ' + (y + 6) + ' H320" stroke="' + SHADE + '" stroke-width="2"/>';
  }

  /* A carriage-wash brush: an upright core with bristles along its length,
     swaying as it works. Outer group places it, inner group moves — the rule
     this file follows everywhere, and the reason `rsc-sway` is on a child
     rather than on the placed element. */
  function brush(x, y, h) {
    var b = '';
    for (var i = 0; i < 9; i++) {
      var by = (i / 8) * h, len = 9 + (i % 2) * 4;
      b += '<path d="M' + (-len) + ' ' + by + ' H' + len + '" stroke="' + TONE +
           '" stroke-width="3" stroke-linecap="round"/>';
    }
    return '<g transform="translate(' + x + ',' + y + ')"><g class="rsc-sway">' +
      b +
      '<rect x="-4" y="-4" width="8" height="' + (h + 8) + '" rx="4" fill="' + INK + '"/>' +
      '</g></g>';
  }

  var ART = {

    /* ---- signalbox · cl-signal-delay ----
       Two trains on parallel roads with a signal box between them, one further
       along than the other. The counted quantities here are MINUTES and MILES,
       neither of which is drawable, so the trains themselves may be whole —
       counting them tells a student nothing. The signal arm drops and the
       plumes drift, which is what says "these are moving at different rates"
       without measuring anything. */
    signalbox: function () {
      var s = '';
      s += rails(48);
      s += rails(104);

      // the box, between the two roads
      s += '<g transform="translate(140,54)">' +
        '<rect x="-22" y="-6" width="44" height="34" rx="3" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="-18" y="-2" width="36" height="14" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<path d="M-26 -6 L0 -20 L26 -6 Z" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '</g>';

      // the signal, arm dropping
      s += '<g transform="translate(250,20)">' +
        '<path d="M0 0 V60" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<g class="rsc-swing"><rect x="0" y="2" width="26" height="7" rx="2" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2"/></g>' +
        '</g>';

      // leading train, upper road
      s += '<g transform="translate(196,30)"><g class="rsc-bounce">' +
        '<rect x="-30" y="0" width="60" height="16" rx="4" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="-24" y="4" width="14" height="8" rx="2" fill="' + CREAM + '"/>' +
        '<circle cx="-18" cy="18" r="4" fill="' + INK + '"/><circle cx="16" cy="18" r="4" fill="' + INK + '"/>' +
        '</g></g>';
      // trailing train, lower road, further back
      s += '<g transform="translate(84,86)"><g class="rsc-bounce rsc-roller-b">' +
        '<rect x="-30" y="0" width="60" height="16" rx="4" fill="' + TONE2 + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="-24" y="4" width="14" height="8" rx="2" fill="' + CREAM + '"/>' +
        '<circle cx="-18" cy="18" r="4" fill="' + INK + '"/><circle cx="16" cy="18" r="4" fill="' + INK + '"/>' +
        '</g></g>';

      // drifting steam, no count implied
      s += '<g transform="translate(176,22)"><g class="rsc-puff"><circle r="7" fill="' + SHADE + '" opacity=".5"/></g></g>';
      s += '<g transform="translate(64,78)"><g class="rsc-puff rsc-drop-b"><circle r="6" fill="' + SHADE + '" opacity=".4"/></g></g>';
      return s;
    },

    /* ---- seasonrack · cl-season-tickets ----
       A booking office window with a rack of season ticket wallets behind it.
       Tickets ARE the counted quantity, so the rack runs off both edges and the
       wallets overlap: there is no first wallet and no last one. The stamp
       lifts and falls, which is the office working without saying how much
       work there is. */
    seasonrack: function () {
      var s = '';
      s += '<rect x="0" y="18" width="320" height="86" rx="4" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
      // the rack: wallets overlapping, running past both edges
      for (var i = -1; i < 12; i++) {
        var x = -14 + i * 28;
        s += '<g transform="translate(' + x + ',30)">' +
          '<rect x="0" y="0" width="34" height="40" rx="3" fill="' + (i % 2 ? CREAM : TONE2) +
            '" stroke="' + INK + '" stroke-width="2"/>' +
          '<path d="M6 10 H28 M6 18 H24" stroke="' + INK + '" stroke-width="1.6" opacity=".45"/>' +
          '</g>';
      }
      // the window bar in front, so the rack reads as behind glass
      s += '<path d="M0 76 H320" stroke="' + INK + '" stroke-width="3"/>';
      s += '<rect x="0" y="76" width="320" height="28" fill="' + CREAM + '" opacity=".9"/>';
      s += '<path d="M0 76 H320" stroke="' + INK + '" stroke-width="2.4"/>';
      // the stamp
      s += '<g transform="translate(230,90)"><g class="rsc-lift">' +
        '<rect x="-13" y="-16" width="26" height="10" rx="2" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<rect x="-4" y="-24" width="8" height="9" rx="2" fill="' + INK + '"/>' +
        '</g></g>';
      return s;
    },

    /* ---- planters · cl-platform-planters ----
       A platform edge with planters along it, running past both frame edges and
       overlapping. Planters ARE the counted quantity. Flowers sway; nothing
       else moves, because nothing else should draw the eye to a count. */
    planters: function () {
      var s = '';
      s += rails(112);
      s += '<rect x="0" y="76" width="320" height="30" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
      for (var i = -1; i < 8; i++) {
        var x = -18 + i * 44, tall = i % 2 === 0;
        s += '<g transform="translate(' + x + ',' + (tall ? 34 : 42) + ')">' +
          '<g class="rsc-sway"' + (i % 3 ? ' style="animation-delay:' + (i * 0.4).toFixed(1) + 's"' : '') + '>' +
            '<path d="M14 26 C4 16, 10 4, 20 8 C28 0, 40 8, 34 18 C42 22, 38 30, 28 28 Z" fill="' + TONE2 + '" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
          '</g>' +
          '<path d="M2 26 H46 L41 44 H7 Z" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
          '</g>';
      }
      return s;
    },

    /* ---- umbrellas · cl-lost-umbrellas ----
       A STAND, NOT A RAIL, and the difference is the whole point of the
       redraw. The first version was a rail of umbrellas hanging and swinging,
       which is `lostproperty` in change-scenes.js almost line for line — same
       rail, same hanging canopies, same swing. Two scenes that look alike on a
       site where the picture is meant to say which situation you are in is
       worse than no picture, and it was user-found.

       So this is the other end of the same office: a stand on the counter with
       umbrellas jammed in at angles. A BARREL HIDES ITS COUNT BY
       CONSTRUCTION — you cannot see how many are in it — which does the
       uncountability job better than a rail ever did, because a rail displays
       exactly what a stand conceals.

       And the motion is REMOVAL. The mainland scene shows one arriving; this
       shows one being lifted out, which is the half of the day that scene does
       not draw. Rain on the window says umbrella weather without counting
       anything. */
    umbrellas: function () {
      var s = '';
      s += '<rect x="0" y="0" width="320" height="130" fill="none"/>';

      // the window, rain running down it
      s += '<rect x="14" y="14" width="86" height="62" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<path d="M57 14 V76 M14 45 H100" stroke="' + INK + '" stroke-width="1.8" opacity=".5"/>';
      for (var r = 0; r < 5; r++) {
        s += '<g transform="translate(' + (26 + r * 17) + ',22)"><g class="rsc-drop"' +
             (r % 2 ? ' style="animation-delay:.7s"' : '') + '>' +
             '<path d="M0 0 V12" stroke="' + SHADE + '" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
             '</g></g>';
      }

      // the counter
      s += '<path d="M0 96 H320" stroke="' + INK + '" stroke-width="3"/>';
      s += '<rect x="0" y="96" width="320" height="34" fill="' + MID + '"/>';

      /* The stand. Umbrellas go in at angles and overlap, and the rim cuts
         every shaft, so nothing in here can be counted off the picture. */
      var ANG = [-26, -14, -5, 4, 13, 24, -19, 8];
      for (var i = 0; i < ANG.length; i++) {
        var lean = ANG[i], up = 30 + (i % 3) * 8;
        s += '<g transform="translate(' + (176 + (i - 3) * 7) + ',96) rotate(' + lean + ')">' +
          '<path d="M0 0 V' + (-up - 26) + '" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
          '<path d="M-15 ' + (-up - 24) + ' q15 -17 30 0 Z" fill="' + (i % 2 ? TONE : TONE2) +
            '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
          '</g>';
      }
      // the barrel in front, cutting the shafts off
      s += '<path d="M146 96 L152 44 H206 L212 96 Z" fill="' + TONE + '" stroke="' + INK +
           '" stroke-width="2.6" stroke-linejoin="round"/>';
      s += '<path d="M150 60 H208 M148 78 H210" stroke="' + INK + '" stroke-width="2" opacity=".55"/>';

      /* The one being claimed, on its way out. Outer group places, inner lifts
         — the rule this file follows everywhere. */
      s += '<g transform="translate(266,72)"><g class="rsc-lift">' +
        '<path d="M0 0 V34" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M0 34 q0 7 7 7 q5 0 5 -5" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M-16 0 q16 -18 32 0 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '</g></g>';
      return s;
    },

    /* ---- bottling · cl-buffet-crates ----
       A filling head over a belt of bottles. Bottles ARE the counted quantity,
       so the belt runs off both edges and the bottles overlap the frame at
       both ends. The head drips and the belt scrolls: a plant working, with no
       total implied anywhere. */
    bottling: function () {
      /* THE MECHANICS HAVE TO LINE UP WITH THE BOTTLES, and in the first draft
         they did not — user-found. The filling head sat at x=150 and the
         bottles were pitched from x=-12, so no neck was ever under the nozzle
         and the drips fell into the gap between two bottles. Worse, the belt
         scrolled underneath bottles that never moved, which is a conveyor
         running with its load stuck to the floor.

         Both come from the same mistake: the parts were placed independently
         and then expected to agree. So the geometry is DERIVED from one number
         now. `FILL_X` is where the nozzle is, the bottle pitch is measured back
         from it, and the bottle under the nozzle is filling — its level rises,
         and the drips land in its neck because the neck is at FILL_X by
         construction rather than by luck.

         And the belt no longer scrolls. A filling line INDEXES: it moves, stops
         to fill, moves again. Stopped is the honest frame to draw, and it also
         retired the two scroll-geometry faults the sweep caught here. The
         motion that remains is the machine doing its job — rollers turning,
         liquid falling, a level rising. */
      var FILL_X = 150, PITCH = 28, BW = 16;
      var s = '';
      s += ground(112);

      // the belt, still, with its rollers turning at the ends
      s += '<rect x="-4" y="88" width="328" height="14" rx="3" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2.2"/>';
      s += '<g transform="translate(16,95)"><g class="rsc-roller">' +
        '<circle r="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M0 -9 V9 M-9 0 H9" stroke="' + INK + '" stroke-width="1.6" opacity=".55"/></g></g>';
      s += '<g transform="translate(304,95)"><g class="rsc-roller rsc-roller-b">' +
        '<circle r="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M0 -9 V9 M-9 0 H9" stroke="' + INK + '" stroke-width="1.6" opacity=".55"/></g></g>';

      /* Bottles pitched OUT FROM the nozzle in both directions, so one of them
         is exactly under it and the row still runs off both edges. */
      for (var k = -6; k <= 6; k++) {
        var cx = FILL_X + k * PITCH, x = cx - BW / 2;
        var filling = (k === 0);
        s += '<g transform="translate(' + x + ',56)">' +
          '<rect x="0" y="8" width="' + BW + '" height="24" rx="3" fill="' + CREAM +
            '" stroke="' + INK + '" stroke-width="2"/>' +
          // what is already in it: full ones on one side, empties on the other
          (k < 0 ? '<rect x="2" y="16" width="' + (BW - 4) + '" height="14" rx="2" fill="' + TONE2 + '"/>' : '') +
          (filling ? '<g class="rsc-fill-rise"><rect x="2" y="16" width="' + (BW - 4) +
                     '" height="14" rx="2" fill="' + TONE2 + '"/></g>' : '') +
          '<rect x="' + (BW / 2 - 3) + '" y="0" width="6" height="10" rx="2" fill="' + INK + '" opacity=".8"/>' +
          '</g>';
      }

      // the filling head, directly over the neck at FILL_X
      s += '<g transform="translate(' + FILL_X + ',10)">' +
        '<rect x="-36" y="0" width="72" height="26" rx="4" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="-5" y="26" width="10" height="14" fill="' + INK + '"/>' +
        // the stream lands at y=56+0..10, which is the neck of the bottle below
        '<g class="rsc-drop"><circle cx="0" cy="44" r="3.6" fill="' + TONE2 + '"/></g>' +
        '<g class="rsc-drop-b"><circle cx="0" cy="44" r="3" fill="' + TONE2 + '"/></g>' +
        '</g>';
      return s;
    },

    /* ---- sleepers · cl-track-sleepers ----
       Track receding with sleepers under it, running off both edges. Sleepers
       ARE the counted quantity, so they are drawn in perspective and overlap
       toward the horizon where they become uncountable by construction. A gang
       hut sits beside the line. The only motion is a lifted sleeper swinging
       on the crane — one thing happening, no total. */
    sleepers: function () {
      /* THE FIRST DRAFT WAS A STILL LIFE AND THE USER SAID SO. It drew a row of
         sleepers, a hut and a crane, and the only thing that moved was one
         sleeper swinging in a corner — a picture of a worksite where no work is
         happening, on a problem whose second half is entirely about work
         happening.

         The story is sleepers coming OUT and new ones going IN, and the redraw
         puts exactly that in the frame: a GAP where one has been lifted, the
         old sleeper swinging away on the crane, a pale new one descending into
         the gap, and dust where it has been disturbed. The absence is the part
         that makes it read — a row with a hole in it is obviously mid-job in a
         way that a complete row never is.

         The sleepers still run off both edges and vary in width, because they
         ARE the counted quantity and must stay uncountable. The gap does not
         change that: you cannot count what a hole is worth. */
      /* GAP_X is computed once and everything that has to agree with the hole —
         the dust, the crane's jib, the chain, the load — is placed from it. The
         first draft repeated the arithmetic at each use, which is how a load
         ends up hanging next to a hole instead of over it. */
      var GAP_I = 8, GAP_X = -20 + GAP_I * 26, s = '';

      // ballast under everything
      s += '<rect x="0" y="76" width="320" height="34" fill="' + MID + '"/>';

      // sleepers, off both edges, with one missing
      for (var i = -1; i < 14; i++) {
        if (i === GAP_I) continue;
        var x = -20 + i * 26, w = 22 - (i % 4);
        s += '<rect x="' + x + '" y="78" width="' + w + '" height="30" rx="2" fill="' + TONE2 +
             '" stroke="' + INK + '" stroke-width="1.8"/>';
      }
      // the hole itself, darker so it reads as absence rather than as ballast
      s += '<rect x="' + GAP_X + '" y="78" width="22" height="30" rx="2" fill="' + SHADE +
           '" stroke="' + INK + '" stroke-width="1.8" stroke-dasharray="4 3" opacity=".85"/>';

      s += rails(84);
      s += rails(100);

      // dust kicked up at the gap
      s += '<g transform="translate(' + (GAP_X + 2) + ',96)"><g class="rsc-puff">' +
        '<circle r="6" fill="' + SHADE + '" opacity=".5"/></g></g>';
      s += '<g transform="translate(' + (GAP_X + 24) + ',98)"><g class="rsc-puff rsc-drop-b">' +
        '<circle r="5" fill="' + SHADE + '" opacity=".4"/></g></g>';

      /* THE OLD ONE, ALREADY OUT AND LYING ON THE CESS. It used to be the thing
         on the crane, which left the NEW one arriving from nowhere. Putting the
         old one on the ground instead frees the hook for the sleeper that is
         actually going somewhere, and a sleeper lying askew beside the track is
         unmistakably one that has been taken up. */
      s += '<g transform="translate(112,62) rotate(-7)">' +
        '<rect x="-24" y="0" width="48" height="10" rx="2" fill="' + TONE2 +
          '" stroke="' + INK + '" stroke-width="2.2"/></g>';

      /* THE LINESIDE HUT, and the first version of it was a square with a
         triangle on top — a child's house, drawn on a railway. User-found, and
         fair: nothing about it said permanent way.

         This one is the real thing: a curved corrugated roof, a stovepipe with
         the fire lit, and the gang's tools leaning where they were dropped. The
         smoke is the point — a hut with a fire going says somebody is out here
         working, which is what the whole scene is about, and it costs one
         animated element. */
      s += '<g transform="translate(40,32)">' +
        '<rect x="-22" y="0" width="44" height="34" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        // corrugated barrel roof
        '<path d="M-26 2 Q0 -20 26 2" fill="' + TONE + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M-17 -3 Q0 -16 17 -3 M-9 -7 Q0 -13 9 -7" fill="none" stroke="' + INK +
          '" stroke-width="1.4" opacity=".45"/>' +
        // stovepipe, and the fire lit
        '<rect x="10" y="-22" width="8" height="14" rx="1.5" fill="' + INK + '"/>' +
        '<g transform="translate(14,-24)"><g class="rsc-puff">' +
          '<circle r="5" fill="' + SHADE + '" opacity=".55"/></g></g>' +
        // door and window
        '<rect x="-14" y="12" width="14" height="22" rx="1.5" fill="' + TONE + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<rect x="4" y="10" width="12" height="10" rx="1.5" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        // tools leaning against the end wall
        '<path d="M24 34 L30 8" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M30 8 q4 -3 6 1" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M28 34 L36 12" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M32 12 H40" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '</g>';

      /* THE CRANE NOW STANDS OVER THE GAP, and the new sleeper hangs from its
         hook on a visible chain. The first draft had a pale box appear in
         mid-air near the hole with nothing holding it and nothing above it —
         "the drop box doesn't make much sense", and it did not: a thing falling
         from nowhere is not a thing being fitted.

         The jib reaches LEFT to the gap's own centre, computed from the same
         number the gap is, so the load hangs over the hole rather than beside
         it. Chain, hook, load: the eye can follow where it came from and where
         it is going. */
      s += '<g transform="translate(252,6)">' +
        '<path d="M0 4 V70" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<path d="M0 8 H' + (GAP_X + 11 - 252) + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M0 20 L' + (GAP_X + 40 - 252) + ' 8" stroke="' + INK + '" stroke-width="1.8" opacity=".6"/>' +
        '</g>';
      s += '<g transform="translate(' + (GAP_X + 11) + ',14)"><g class="rsc-swing">' +
        // the chain
        '<path d="M0 0 V34" stroke="' + INK + '" stroke-width="1.8" stroke-dasharray="3 3"/>' +
        // the hook
        '<path d="M0 34 q0 6 5 6 q4 0 4 -4" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
        // the new concrete sleeper, pale against the creosoted row below
        '<rect x="-15" y="40" width="30" height="11" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<path d="M-9 45 H9" stroke="' + SHADE + '" stroke-width="1.6"/>' +
        '</g></g>';
      return s;
    },

    /* ---- washshed · cl-carriage-clean ----
       A carriage part-way through a wash shed, brushes turning. The counted
       quantity is CARRIAGES PER HOUR, which is a rate rather than a heap — and
       the carriage is deliberately cut by the shed at both ends, so there is no
       whole carriage to count and no sense of a queue. Brushes spin and water
       falls: a machine working at a speed. */
    washshed: function () {
      var s = '';
      s += rails(108);
      // the shed, framing the carriage at both ends
      s += '<rect x="0" y="10" width="320" height="94" rx="4" fill="none" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<rect x="0" y="10" width="42" height="94" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<rect x="278" y="10" width="42" height="94" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>';
      // the carriage, running under both shed ends
      s += '<g transform="translate(60,44)">' +
        '<rect x="0" y="0" width="200" height="52" rx="6" fill="' + TONE2 + '" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<rect x="14" y="10" width="34" height="20" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<rect x="62" y="10" width="34" height="20" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<rect x="110" y="10" width="34" height="20" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<rect x="158" y="10" width="34" height="20" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<circle cx="42" cy="58" r="6" fill="' + INK + '"/><circle cx="164" cy="58" r="6" fill="' + INK + '"/>' +
        '</g>';
      /* BRUSHES, NOT SPINNERS. The first draft drew each brush as a dashed
         circle rotating — which is the universal loading spinner, and that is
         exactly what the user saw. A dashed ring turning says "waiting"; it
         cannot say "bristles".

         A carriage wash brush is a tall vertical roller, so this draws one:
         an upright core with bristles standing out along its whole length,
         swaying as it works. Bristles at alternating lengths give the ragged
         edge that reads as a brush from any distance, and the sway is what a
         column of bristles does against a carriage side — the rotation itself
         is not drawable side-on, and faking it with a spin was the mistake. */
      s += brush(88, 42, 54);
      s += brush(232, 42, 54);

      // spray coming off the brushes, and water running down the carriage
      s += '<g transform="translate(112,34)"><g class="rsc-puff"><circle r="5" fill="' + CREAM + '" opacity=".75"/></g></g>';
      s += '<g transform="translate(210,38)"><g class="rsc-puff rsc-drop-b"><circle r="4" fill="' + CREAM + '" opacity=".65"/></g></g>';
      s += '<g transform="translate(150,88)"><g class="rsc-drop"><circle r="3.4" fill="' + SHADE + '"/></g></g>';
      s += '<g transform="translate(178,88)"><g class="rsc-drop-b"><circle r="3" fill="' + SHADE + '"/></g></g>';
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

  global.ChallengeScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
