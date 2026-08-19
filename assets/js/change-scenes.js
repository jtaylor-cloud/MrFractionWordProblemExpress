/* ============================================================
   Animated scene illustrations for The Change Line.

   WHY THESE EXIST
   The same reason ratio-scenes.js exists: the unit grid is the Part–Whole
   picture, and a tray of coloured cells is both the wrong idea and the wrong
   invitation on a line about something HAPPENING to an amount.

   A change is a before and an after with an event between them. So each of
   these shows a quantity in motion — umbrellas arriving on a counter,
   sandwiches leaving a stack, a tank filling — with the direction of travel
   visible. On this line the direction is the lesson: two of the three problems
   describe an increase and one of those is solved by subtracting.

   RULES THESE FOLLOW (inherited, and every one was written after a real bug)
   - No numerals anywhere. The illustration says "more keep arriving", never
     how many. Nothing here can leak an answer because nothing here counts.
     This matters more on this line than on any other, because the Plan phase
     sits beside a picture of the very quantity being asked for.
   - Placement lives on an OUTER group, animation on an INNER one. A CSS
     transform beats the transform attribute in SVG, so animating a placed
     element wipes its position and stacks everything at the origin.
   - Anything that rotates about a point draws that point at the bottom centre
     of its own bounding box, so `transform-origin: 50% 100%` is the real
     pivot; `transform-box: fill-box` makes the box its own reference.
   - Every scene carries a text description, and prefers-reduced-motion freezes
     the motion — the picture still has to read frozen.

   It reuses the `rsc-` animation classes and frame CSS rather than defining a
   parallel set. Those classes are already contrast-checked and already have
   their reduced-motion rules; a second vocabulary doing the same job is how
   two halves of one site start to look like two sites.
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
  var LINE = 'var(--line-change)';

  function ground(y) {
    return '<path d="M0 ' + y + ' H320" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
  }

  /* Which slot on the rack the new umbrella comes down into. It is a slot IN
     the run, not one past the end of it: the run has no end, and it must not
     acquire one just so the arrival has somewhere to land. Keep it on the
     pitch (-6 + 28k) or the row develops a hole. */
  var ARRIVING_AT = 218;

  /* A counter or shelf to put things on. */
  function counter(x, y, w) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="9" rx="3" fill="' + MID +
           '" stroke="' + INK + '" stroke-width="2.4"/>';
  }

  var ART = {

    /* ---- Lost property: umbrellas hanging, another one arriving ----
       An INCREASE with the result unknown. The arriving umbrella comes down
       onto the rail, so the direction of the change is in the motion.

       THE RACK RUNS OFF BOTH EDGES, AND THAT IS THE COMPARE LINE'S RULE
       ARRIVING HERE. It used to be four umbrellas, each one whole and well
       inside the frame, on a problem whose quantity is a count of umbrellas
       and whose sets hold 46 to 71 of them. Measured before the change: four
       canopies at 53..87, 91..125, 129..163, 167..201, every one of them
       clear of both frame edges — a picture that could be tallied, saying
       "four", on the screen where the story's number is deliberately hidden.

       It did not LEAK: 4 and 5 are not values this problem uses (the nearest
       coincidence is set 3's five shelves, and the picture draws no shelf).
       That is luck, not construction, and it is one number set away from
       stopping being true. It was also plainly false about scale — the prose
       says almost everything on the rack is an umbrella nobody came back for,
       and the picture showed four.

       So the rack is now built the way compare-scenes.js builds its benches
       and its queue: a run at a 28 pitch on canopies 34 wide, so every
       umbrella overlaps its neighbours by six and there is nothing separate
       to tally, starting left of the frame and finishing right of it, so
       there is no first umbrella and no last one. What is visible is a lower
       bound on a rack that carries on out of the picture, which is the honest
       answer to anyone who counts. Move the pitch or the start and re-measure
       BOTH edges — the Compare Line shipped a row that stopped 19 units short
       of its own frame under a comment claiming it did not.

       The one that is arriving lands INTO the row rather than on the end of
       it, because a row with an end is a row with a length. It is drawn last
       so it paints over its neighbours, and it is the only cream one. */
    lostproperty: function () {
      var s = ground(116);
      s += counter(-8, 100, 336);

      // the rail they hang from, running past both edges like the row below it
      s += '<path d="M-8 40 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<path d="M40 40 V28 M268 40 V28" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';

      /* Pitch 28 against a canopy 34 wide: a six-unit overlap, which is the
         uncountability, not decoration. The swing stagger wraps at four so no
         umbrella waits more than 1.8s of a 3.2s cycle to start moving —
         animation-fill-mode is backwards, so a long delay is a long lean. */
      var UMB_PITCH = 28;
      for (var x = -6, i = 0; x < 336; x += UMB_PITCH, i++) {
        if (x === ARRIVING_AT) continue;               // the gap it comes down into
        s += '<g transform="translate(' + x + ',40)"><g class="rsc-swing" style="--i:' + (i % 4) + '">' +
               '<path d="M0 0 V44" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
               '<path d="M0 44 q0 8 8 8 q6 0 6 -6" fill="none" stroke="' + INK +
                 '" stroke-width="2.2" stroke-linecap="round"/>' +
               '<path d="M-17 22 q17 -20 34 0 Z" fill="' + LINE + '" stroke="' + INK +
                 '" stroke-width="2.2" stroke-linejoin="round"/>' +
             '</g></g>';
      }

      /* The newest one, landing. Same drawing, arriving from above — this is
         the "change" made visible, and it is the only moving-in element. */
      s += '<g transform="translate(' + ARRIVING_AT + ',40)"><g class="rsc-stacktop">' +
             '<path d="M0 0 V44" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
             '<path d="M0 44 q0 8 8 8 q6 0 6 -6" fill="none" stroke="' + INK +
               '" stroke-width="2.2" stroke-linecap="round"/>' +
             '<path d="M-17 22 q17 -20 34 0 Z" fill="' + CREAM + '" stroke="' + INK +
               '" stroke-width="2.2" stroke-linejoin="round"/>' +
           '</g></g>';

      // an arrow of arrival, pointing IN, directly above the one arriving
      s += '<g transform="translate(' + ARRIVING_AT + ',16)"><g class="rsc-bounce">' +
           '<path d="M0 -10 V6 M-5 1 L0 6 L5 1" fill="none" stroke="' + LINE +
             '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</g></g>';
      return s;
    },

    /* ---- The platform kiosk: a stack being sold down ----
       A DECREASE with the change unknown. The top item lifts away and the
       counter stays put, so what moved is the thing that is missing.

       IT DID NOT LIFT AWAY. It wore `rsc-stacktop`, which is the ARRIVAL
       keyframe — measured on screen, the sandwich descended from y0 56 to 62
       and faded IN from opacity .35 to 1, directly under an arrow pointing
       out. Three cues about which way this quantity is going, and the only
       animated one said the opposite of the other two, on the one scene of the
       three whose whole job is to show a decrease. `rsc-lift` is the missing
       other half of that vocabulary; see app.css.

       Nothing in the source says this. The comment above described a lift and
       the file had been drawing a landing since the day it shipped, which is
       the same class Cycle 20 found twice in the new Compare art: a comment
       asserting a property that was never measured. */
    kiosk: function () {
      var s = ground(116);
      s += counter(46, 98, 228);

      // kiosk awning
      s += '<path d="M40 30 H280 L268 48 H52 Z" fill="' + LINE + '" stroke="' + INK +
           '" stroke-width="2.6" stroke-linejoin="round"/>';
      s += '<path d="M60 30 V16 M260 30 V16" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';

      // the stack that stays
      [0, 1, 2].forEach(function (i) {
        var y = 88 - i * 13;
        s += '<rect x="96" y="' + y + '" width="62" height="12" rx="3" fill="' + MID +
             '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M96 ' + (y + 6) + ' H158" stroke="' + INK + '" stroke-width="1.4" opacity=".45"/>';
      });

      // the one leaving, and an arrow pointing OUT
      s += '<g transform="translate(196,62)"><g class="rsc-lift">' +
             '<rect x="0" y="0" width="62" height="12" rx="3" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M0 6 H62" stroke="' + INK + '" stroke-width="1.4" opacity=".45"/>' +
           '</g></g>';
      s += '<g transform="translate(227,44)"><g class="rsc-bounce">' +
           '<path d="M0 6 V-10 M-5 -5 L0 -10 L5 -5" fill="none" stroke="' + LINE +
             '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</g></g>';
      return s;
    },

    /* ---- The water tank: filling from a pipe ----
       An INCREASE with the START unknown — the problem this line exists for,
       because the story says "more went in" and the move is a subtraction.
       The picture deliberately shows only the AFTER level rising; what was in
       the tank to begin with is not drawn, because that is the question. */
    tank: function () {
      var s = ground(118);

      // supply pipe
      s += '<path d="M28 26 H150 V44" fill="none" stroke="' + INK +
           '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<rect x="20" y="18" width="14" height="16" rx="3" fill="' + MID +
           '" stroke="' + INK + '" stroke-width="2.2"/>';

      // falling water
      [0, 1, 2].forEach(function (i) {
        s += '<g transform="translate(150,46)"><g class="rsc-drop" style="--i:' + i + '">' +
             '<rect x="-4" y="0" width="8" height="13" rx="4" fill="' + LINE +
               '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
      });

      // tank body
      s += '<rect x="96" y="58" width="128" height="56" rx="8" fill="' + CREAM +
           '" stroke="' + INK + '" stroke-width="2.8"/>';
      // rising contents, clipped so it cannot spill past the walls
      s += '<clipPath id="csc-tank-clip"><rect x="99" y="61" width="122" height="50" rx="6"/></clipPath>';
      s += '<g clip-path="url(#csc-tank-clip)"><g class="rsc-fill-rise">' +
           '<rect x="99" y="61" width="122" height="50" fill="' + LINE + '" opacity=".45"/></g></g>';
      // a sight gauge with NO markings — a scale here would be a number
      s += '<rect x="232" y="58" width="10" height="56" rx="4" fill="' + CREAM +
           '" stroke="' + INK + '" stroke-width="2.2"/>';
      s += '<g transform="translate(237,86)"><g class="rsc-bounce">' +
           '<circle r="3.4" fill="' + LINE + '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
      return s;
    },

    /* ---- The ticket barriers: a crowd pressing through ----
       An INCREASE with the START unknown, told in per cent — so this picture
       carries the same burden `tank` does and one more besides.

       WHAT IT MAY NOT LET YOU DO IS COUNT PEOPLE. The quantity in this problem
       IS a count of passengers, so the rule compare-scenes.js states applies at
       its sharpest: the objects that ARE the quantity must be uncountable, and
       "no numerals" is nowhere near enough. Measured, not asserted:

         figures    pitch 12, coat 20 wide and head 14 wide, so every traveller
                    overlaps both neighbours — 8 units of coat and 2 of head.
                    The run starts at -10 and finishes at 338 against a 320-wide
                    frame, so there is no first person and no last one.
         barriers   pitch 64, pedestal 26 wide, run -18 to 302 — the first is
                    cut by the left edge and the last (302..328) by the right,
                    so the row of gates has no total either. They are furniture
                    and not the quantity, but `lostproperty` shipped a countable
                    rack under a comment saying it was fine, and the note there
                    calls that luck rather than construction.

       AND THE PER CENT MAY NOT BE DRAWN. Nothing here is a bar, a gauge or a
       scale, because a picture that shows how much busier this Saturday is than
       the last one would be answering the question. What is drawn is a crowd
       and an arrow saying "more than there used to be" — the direction of the
       change, which the story states outright, and nothing about its size. */
    barriers: function () {
      var s = ground(118);

      // the canopy the gateline stands under, running past both edges
      s += '<path d="M-8 30 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<path d="M30 30 V18 M290 30 V18" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>';

      /* The gateline. Pedestal, then a paddle on a hinge — the paddles are the
         only thing on this scene that moves of its own accord, and they clack
         open and shut, which is a gate working rather than a quantity changing.
         Pitch 64 on a 26-wide pedestal: both end pedestals are cut by the frame
         (see the measurement above), so the row states no count. */
      for (var bx = -18, bi = 0; bx < 320; bx += 64, bi++) {
        s += '<rect x="' + bx + '" y="72" width="26" height="42" rx="5" fill="' + MID +
             '" stroke="' + INK + '" stroke-width="2.4"/>';
        // a reader panel, blank — a lit display is somewhere a number could go
        s += '<rect x="' + (bx + 6) + '" y="80" width="14" height="9" rx="2" fill="' + CREAM +
             '" stroke="' + INK + '" stroke-width="1.8"/>';
        /* Placement on the OUTER group, animation on the INNER one: a CSS
           transform beats the transform attribute, so animating a placed
           element wipes its position and stacks everything at the origin. */
        s += '<g transform="translate(' + (bx + 26) + ',96)"><g class="rsc-sway" style="--i:' + (bi % 4) + '">' +
               '<path d="M0 0 H30" stroke="' + LINE + '" stroke-width="5" stroke-linecap="round"/>' +
             '</g></g>';
      }

      /* The crowd, drawn last so each traveller paints over the one behind and
         no single figure can be picked out of the press. The lean is a walk;
         `rsc-sway` pivots about the bottom centre of the figure's own box,
         which is where the feet are. */
      for (var x = -10, i = 0; x < 338; x += 12, i++) {
        s += '<g transform="translate(' + x + ',118)"><g class="rsc-sway" style="--i:' + (i % 5) + '">' +
               '<path d="M-4 -12 V0 M4 -12 V0" stroke="' + INK +
                 '" stroke-width="2.4" stroke-linecap="round"/>' +
               '<path d="M-10 -12 V-30 q10 -7 20 0 V-12 Z" fill="' + LINE + '" stroke="' + INK +
                 '" stroke-width="2"/>' +
               '<circle cy="-38" r="7" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
             '</g></g>';
      }

      /* "More than there used to be", and nothing about how many more. The
         arrow points up out of the crowd, the way the umbrella's arrow on
         `lostproperty` points in at the thing arriving. */
      s += '<g transform="translate(160,54)"><g class="rsc-bounce">' +
           '<path d="M0 14 V-8 M-7 -1 L0 -8 L7 -1" fill="none" stroke="' + LINE +
             '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</g></g>';
      return s;
    },

    /* ---- The fares board: a price going up ----
       An INCREASE with the RESULT unknown, told in per cent. The gentlest shape
       on the line and the mirror of `barriers`, so the picture has to carry the
       same burden and one release: the quantity here is a PRICE, which is not a
       thing you can count off a drawing at all. There is nothing to tally, so
       the uncountability rule is satisfied by the subject rather than by
       construction — which is the same licence `delays` has on the Compare Line
       for drawing minutes.

       WHAT IT STILL MAY NOT DO IS SHOW A NUMBER. The fares board's price panels
       are deliberately blank slats, the same way the water tank's sight gauge
       carries no markings: a board with figures on it would be the problem's
       givens and its answer, drawn. What moves is a slat FLIPPING — the board
       re-setting itself, which is the event — and an arrow saying which way. */
    fares: function () {
      var s = ground(118);

      // the board's frame, standing on a post
      s += '<rect x="66" y="24" width="188" height="72" rx="6" fill="' + MID +
           '" stroke="' + INK + '" stroke-width="2.8"/>';
      s += '<path d="M160 96 V112" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<path d="M132 112 H188" stroke="' + INK + '" stroke-width="3.4" stroke-linecap="round"/>';

      /* Four blank slats. No digits, no dots, no tick marks — nothing that
         could be read as a value or counted as one. */
      [0, 1, 2, 3].forEach(function (i) {
        var y = 32 + i * 16;
        s += '<rect x="74" y="' + y + '" width="76" height="12" rx="2" fill="' + CREAM +
             '" stroke="' + INK + '" stroke-width="1.8"/>';
        s += '<rect x="158" y="' + y + '" width="38" height="12" rx="2" fill="' + CREAM +
             '" stroke="' + INK + '" stroke-width="1.8"/>';
      });

      /* The one that is changing. It flips on its own horizontal axis — the
         fare being re-set — and it is the only moving slat, so the eye goes to
         the event rather than to the furniture. `rsc-swirl` scales in X about
         the centre, which reads as a slat turning edge-on. */
      s += '<g transform="translate(215,54)"><g class="rsc-swirl">' +
             '<rect x="-19" y="-6" width="38" height="12" rx="2" fill="' + LINE +
               '" stroke="' + INK + '" stroke-width="1.8"/>' +
           '</g></g>';

      // an arrow of increase, pointing UP beside the panel that is changing
      s += '<g transform="translate(232,72)"><g class="rsc-bounce">' +
           '<path d="M0 12 V-6 M-6 0 L0 -6 L6 0" fill="none" stroke="' + LINE +
             '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</g></g>';

      /* A DRAUGHTY STATION, and the motion count is why. Measured at three
         animated elements — the flipping slat, the arrow and the passenger —
         which the standing instruction calls thin (anything at 1 to 3 is). The
         fix is not more slats: only one price may be changing, because the
         change is the event. So the extra motion is weather. Nothing here is
         the quantity — the quantity is a price — so none of it can be counted
         into anything. */
      s += '<g transform="translate(280,24)"><g class="rsc-swing">' +
             '<path d="M0 0 V12" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
             '<path d="M-8 12 H8 L5 22 H-5 Z" fill="' + CREAM + '" stroke="' + INK +
               '" stroke-width="2" stroke-linejoin="round"/>' +
           '</g></g>';
      // timetable bills pinned up beside the board, corners lifting in the draught
      [0, 1, 2].forEach(function (k) {
        s += '<g transform="translate(' + (18 + k * 15) + ',62)"><g class="rsc-sway" style="--i:' + k + '">' +
               '<rect x="-6" y="-14" width="12" height="28" rx="1.5" fill="' + CREAM +
                 '" stroke="' + INK + '" stroke-width="1.6"/>' +
             '</g></g>';
      });

      /* A passenger looking up at it, so the board has a scale and a reason to
         exist. Deliberately ONE figure and deliberately not the quantity —
         nobody is counting people on this problem. */
      s += '<g transform="translate(44,118)"><g class="rsc-sway">' +
             '<path d="M-4 -12 V0 M4 -12 V0" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
             '<path d="M-10 -12 V-30 q10 -7 20 0 V-12 Z" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<circle cy="-38" r="7" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
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

  global.ChangeScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
