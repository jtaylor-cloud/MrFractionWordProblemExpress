/* ============================================================
   Animated scene illustrations for The Part–Whole Loop.

   WHY THIS FILE EXISTS AT ALL, WHEN PART–WHOLE ALREADY HAD PICTURES.
   Every other Part–Whole problem draws the unit grid — `scene.mode: "unit"` in
   scene.js — a single whole cut into its own denominator and coloured by share.
   That picture is exactly right for those problems and it is derived from the
   BAR MODEL: `unitHtml` refuses to draw unless the group counts total
   `bars[0].segments`.

   A percent problem on this line has no bar model. `surface: "percent"` hands
   the Plan phase to the double number line, so there is no `barModel` for the
   grid to derive itself from, and the unit branch correctly draws nothing. The
   line needed the other kind of picture — a bespoke `anim` scene, the same
   shape Ratio, Change, Compare and Equal Groups all have — and did not have it.

   THIS IS THE FIFTH SCENE LIBRARY, and it is the first one that could be added
   without editing a hardcoded list somewhere. `Scene.html` and the validator's
   artwork check both DISCOVER `*Scenes` globals now (and `tools/sweep.js`
   already did). That change was made immediately before this file, because the
   same hardcoded-list defect has been found in five files on this project and
   twice inside a checker — adding a library was going to be the sixth.

   RULES THESE FOLLOW, inherited and every one written after a real failure:
   - No numerals anywhere.
   - When the drawn objects ARE the quantity, they must be UNCOUNTABLE: pitched
     closer than their own width so neighbours overlap, and running off both
     edges of the frame so there is no first one and no last one. Measured, not
     asserted — see the note on `seats`.
   - Placement on an OUTER group, animation on an INNER one. A CSS transform
     beats the transform attribute in SVG, so animating a placed element wipes
     its position and stacks everything at the origin.
   - Motion may not imply that a quantity CHANGED on a line whose Platform Check
     answers "steady". Busy is allowed; changing is not.
   - Every scene reads correctly frozen, because `prefers-reduced-motion` stops
     it dead.

   It reuses the `rsc-` animation classes rather than defining a parallel set,
   for the reason change-scenes.js gives: a second vocabulary doing the same job
   is how two halves of one site start to look like two sites.
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var INK = '#241B10', CREAM = '#FDF8F0', MID = '#EFE4D0';
  var LINE = 'var(--line-partwhole)';

  var ART = {

    /* ---- A carriage of seats, some of them reserved ----

       THE SEATS ARE THE QUANTITY, so this is the sharpest version of the
       uncountability rule on the site: the problem asks how many seats are not
       reserved, and a picture you can tally is the answer drawn.

       Measured rather than asserted. Seat backs are 34 wide at a pitch of 24,
       so every seat overlaps both neighbours by ten; the run starts at -18 and
       finishes past 338 against a 320-wide frame, so there is no first seat and
       no last one. What is visible is a lower bound on a carriage that carries
       on out of the picture, which is the honest answer to anyone who counts.

       AND THE RESERVED ONES ARE NOT MARKED, which is the part that took a
       second pass. The obvious drawing — a reservation card on some seats —
       makes the RESERVED count tallyable, and that is step one's answer. So the
       slips are in the guard's hand instead: the story is told (somebody has
       been round reserving seats) without any seat being marked as one of them.

       Motion is ambient on purpose. This problem's Platform Check answers
       "steady" — no amount ends up different — so nothing may look like it is
       being filled, sold or handed over. The straps swing, the slips fan in his
       hand, and nobody sits down. */
    seats: function () {
      var s = '';

      // the carriage: floor, window strip, luggage rack, all running off both edges
      s += '<path d="M0 122 H320" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
      s += '<rect x="-8" y="14" width="336" height="26" rx="4" fill="' + CREAM +
           '" stroke="' + INK + '" stroke-width="2.2"/>';
      s += '<path d="M-8 50 H328" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';

      /* Hanging straps. They swing about the rail, which is the top of their own
         box, so `rsc-swing` is the right half of that vocabulary — `rsc-sway`
         pivots at the bottom and is for things rooted to the floor. */
      for (var hx = 16, hi = 0; hx < 330; hx += 58, hi++) {
        s += '<g transform="translate(' + hx + ',50)"><g class="rsc-swing" style="--i:' + (hi % 4) + '">' +
               '<path d="M0 0 V16" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
               '<circle cy="21" r="5" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
             '</g></g>';
      }

      /* The seats. Pitch 24 against a back 34 wide: a ten-unit overlap, which is
         the uncountability and not decoration. Drawn in document order so each
         one paints over its neighbour and none can be picked out of the row.
         Move the pitch or the start and RE-MEASURE both edges. */
      for (var x = -18; x < 340; x += 24) {
        s += '<g transform="translate(' + x + ',0)">' +
               // seat back
               '<path d="M0 116 V80 q0 -10 17 -10 q17 0 17 10 V116 Z" fill="' + LINE +
                 '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
               /* Headrest, so the row reads as seats rather than as a fence —
                  and 28 WIDE, NOT 22, which is the whole point of this line.
                  At 22 against a pitch of 24 the headrests stood two units
                  apart: measured, 13 of 17 were completely clear of both
                  neighbours, so the row of BACKS was uncountable and the row of
                  headrests sitting on top of it was a tally of the same seats.
                  A picture is only as uncountable as its most countable part,
                  and this one was caught by measuring the wrong element first
                  and then measuring the right one. At 28 they overlap by four
                  and nothing in the carriage can be counted. */
               '<rect x="3" y="66" width="28" height="10" rx="4" fill="' + MID +
                 '" stroke="' + INK + '" stroke-width="2"/>' +
             '</g>';
      }

      /* The guard, standing in the aisle with a fan of reservation slips. The
         slips say what the story says — some of these seats are spoken for —
         and being in his hand rather than on the seats keeps the reserved count
         off the picture entirely. */
      s += '<g transform="translate(258,122)"><g class="rsc-sway">' +
             '<path d="M-4 -14 V0 M4 -14 V0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M-11 -14 V-36 q11 -8 22 0 V-14 Z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<circle cy="-45" r="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
             // peaked cap, so he reads as staff and not as another passenger
             '<path d="M-9 -50 q9 -7 18 0 Z" fill="' + INK + '"/>' +
             '<path d="M-12 -50 H10" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
           '</g></g>';
      // the slips, fanning in his hand
      s += '<g transform="translate(243,92)"><g class="rsc-sway" style="--i:2">' +
             '<rect x="-9" y="-7" width="18" height="13" rx="2" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="1.8" transform="rotate(-14)"/>' +
             '<rect x="-6" y="-8" width="18" height="13" rx="2" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="1.8" transform="rotate(6)"/>' +
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

  global.PartWholeScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
