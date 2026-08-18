/* ============================================================
   Animated scene illustrations for The Compare Line.

   WHY THESE EXIST
   The same reason ratio-scenes.js and change-scenes.js exist: the unit grid is
   the Part–Whole picture, and a tray of coloured cells is the wrong idea on a
   line about two amounts standing side by side. Until this file, Compare was
   the only line with no illustration at all — three problems riding with an
   empty column beside the words.

   THE RULE THIS LINE MAKES HARDER, AND WHY IT NEEDED THINKING ABOUT
   Every scene library so far obeys "no numerals anywhere", and on the other two
   lines that is nearly free: a press throwing posters or a tank filling has no
   natural count in it. Here it is not free, because a Compare scene is a
   picture of THE TWO QUANTITIES THEMSELVES. Draw the benches and you have drawn
   the answer; draw the queue and a student can count the people and read off a
   number the first read is deliberately withholding. There are no digits in
   either picture and both would leak.

   So the objects on this line are drawn UNCOUNTABLE, by construction:
     - benches and queuers run off BOTH edges of the frame, so what is visible
       is not a total and cannot be mistaken for one;
     - queuers overlap each other, so there is no clean thing to tally;
     - the bench rows are phase-shifted between the two platforms, so they never
       line up into countable pairs — aligned rows would invite exactly the
       comparison the picture must not make.
   `delays` is the one problem whose quantity is time, which cannot be counted
   off a picture at all — so it is the only scene here that draws its two
   subjects whole.

   AND: NO MEASUREMENT FURNITURE. Not one bracket, gap marker, dashed outline or
   aligned baseline anywhere in this file, even though the gap is the idea of
   the line. That is compare-model.js's job on the Plan phase, where the bars
   ARE derived from the current number set and the drawn ratio is asserted to
   match the true one. A scene bar drawn to an authored width would be a second,
   unchecked picture of the same relationship — right for set 1 and silently
   wrong for the other three, which is the exact defect the Plan model's header
   records being found by eye. The scene tells the story; the model measures it.

   RULES INHERITED FROM THE OTHER TWO LIBRARIES (each written after a real bug)
   - Placement lives on an OUTER group, animation on an INNER one. A CSS
     transform beats the transform attribute in SVG, so animating a placed
     element wipes its position and stacks everything at the origin.
   - Anything that rotates about a point draws that point at the bottom centre
     of its own bounding box, so `transform-origin: 50% 100%` is the real pivot;
     `transform-box: fill-box` makes the box its own reference.
   - Every scene carries a text description, and prefers-reduced-motion freezes
     the motion — the picture still has to read frozen.

   It reuses the `rsc-` animation classes and frame CSS and defines no new ones,
   as change-scenes.js does. Those classes are contrast-checked and already have
   their reduced-motion rules. Where a stagger was needed on a class that has no
   `--i` rule (`rsc-bounce`), the delay is set inline rather than by adding a
   parallel keyframe: a second animation vocabulary doing the same job is how
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

  var INK = '#241B10', CREAM = '#FDF8F0', MID = '#EFE4D0', SHADE = '#BCAA8C';
  var LINE = 'var(--line-compare)';

  /* A rotating part: outer group places it, inner group spins. Same shape as
     the ratio library's, kept local so this file has no load-order dependency
     on that one — index.html is free to reorder the scene libraries. */
  function spinner(x, y, r, cls) {
    return '<g transform="translate(' + x + ',' + y + ')"><g class="' + cls + '">' +
      '<circle r="' + r + '" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
      '<path d="M0 ' + (-r) + ' V' + r + ' M' + (-r) + ' 0 H' + r + '" stroke="' + INK + '" stroke-width="1.6" opacity=".6"/>' +
      '</g></g>';
  }

  /* A clock face whose hand sweeps. The hand is a rect running from its pivot
     upward, so the bbox bottom-centre IS the pivot.

     ONE hand, and only ever one clock in a scene. Two dials frozen at different
     angles would be two readable times, which is two numbers — on the very
     screen where the minutes are masked. A single sweeping hand says "time is
     passing" and states nothing. */
  function dial(x, y, r) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<circle r="' + r + '" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle r="1.8" fill="' + INK + '"/>' +
      '<g class="rsc-hand"><rect x="-1.3" y="' + (-r + 4) + '" width="2.6" height="' + (r - 4) + '" rx="1.3" fill="' + INK + '"/></g>' +
      '</g>';
  }

  /* Track: a rail with sleepers under it. Runs the full frame and past both
     ends, so it reads as a line going somewhere rather than a length. */
  function track(y) {
    var s = '';
    for (var x = -12; x < 336; x += 26) {
      s += '<rect x="' + x + '" y="' + (y + 2) + '" width="14" height="6" rx="2" fill="' + SHADE +
           '" stroke="' + INK + '" stroke-width="1.4"/>';
    }
    return s + '<path d="M-8 ' + y + ' H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
  }

  /* A locomotive facing RIGHT, standing on wheels whose centres sit on `y`.
     Footprint is x-6..x+74, top at y-54.

     Drawn facing right on purpose. The house locomotive artwork faces LEFT, and
     dropping it in unmirrored once had the ratio line's train smoking backwards
     down the track it had just covered; the fix there was a mirror on the outer
     placement group. This one is drawn right-facing from the start so there is
     no mirror to fight the bounce, and it agrees with the direction the ratio
     scenes already established for anything that travels. */
  function engine(x, y, moving) {
    var s = '';
    s += '<g transform="translate(' + x + ',' + y + ')">' +
           (moving ? '<g class="rsc-bounce">' : '<g>') +
             '<rect x="-6" y="-18" width="80" height="8" rx="3" fill="' + INK + '"/>' +
             '<rect x="-4" y="-52" width="28" height="34" rx="4" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="2" y="-46" width="16" height="13" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<rect x="24" y="-42" width="44" height="24" rx="12" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="62" y="-43" width="10" height="26" rx="3" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="48" y="-54" width="12" height="14" rx="3" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.4"/>' +
           '</g></g>';
    s += spinner(x + 16, y, 9, moving ? 'rsc-roller' : '');
    s += spinner(x + 52, y, 9, moving ? 'rsc-roller rsc-roller-b' : '');
    return s;
  }

  /* One person, standing. Head + shoulders only — no arms, no legs, no faces.
     A figure detailed enough to have a face is a figure detailed enough to be
     told apart from its neighbour, and a queue of distinguishable people is a
     queue you can count. These are meant to read as a crowd. */
  function person(x, y, h, fill, i) {
    /* BODY_W and QUEUE_PITCH are a pair and must be read together: the body is
       22 wide and the queue steps 17, so every figure overlaps its neighbours
       by about five. That overlap is the uncountability, not decoration.

       The first version had a body of 18 at a pitch of 25 — a 5px GAP — under a
       comment asserting they overlapped. Measured on screen at 6.6px apart. The
       drawing was a tidy line of separately countable people, which is the one
       thing this scene may not be, and the comment above it said the opposite.
       Neither the validator nor the sweep can see this; it took getBoundingClientRect. */
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<g class="rsc-bounce" style="animation-delay:' + (i * 0.23).toFixed(2) + 's">' +
               '<path d="M-11 0 V' + (-h + 14) + ' q0 -10 11 -10 q11 0 11 10 V0 Z" fill="' + fill +
                 '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
               /* HEAD_R is set against QUEUE_PITCH, exactly as BODY_W is.
                  At 6.4 the heads were 12.8 wide on a 17 pitch — 4.2 apart,
                  never touching, 18 of 21 whole inside the frame — while the
                  bodies below them overlapped by 5. So the crowd was uncountable
                  from the neck down and a tidy row of tallyable circles from the
                  neck up, which is the same defect the bodies already had, in
                  the one part of a figure a person naturally counts.

                  8.6 makes the heads 17.2 wide against a 17 pitch, so they meet;
                  with the 2.2 stroke they overlap by about 2.4. Change either
                  number and re-measure both, or the row separates again. */
               '<circle cy="' + (-h + 2) + '" r="' + HEAD_R + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '</g>' +
           '</g>';
  }
  var BODY_W = 22, QUEUE_PITCH = 17, HEAD_R = 8.6;

  /* A bench, seen side on, sitting on a platform deck at `y`. */
  function bench(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<rect x="0" y="-6" width="26" height="5" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<rect x="0" y="-16" width="26" height="4" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
             '<path d="M3 -1 V0 M23 -1 V0 M2 -12 V-6 M24 -12 V-6" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
           '</g>';
  }

  /* A car, side on, standing on `y`. Width 44 — paired with CAR_PITCH below. */
  function car(x, y, fill) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<rect x="0" y="-20" width="44" height="14" rx="4" fill="' + fill + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M9 -20 L15 -30 H31 L37 -20 Z" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<path d="M23 -30 V-20" stroke="' + INK + '" stroke-width="1.6" opacity=".5"/>' +
             '<circle cx="11" cy="-5" r="5" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<circle cx="34" cy="-5" r="5" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
           '</g>';
  }

  /* A bicycle in a rack, side on. Width 30 — paired with BIKE_PITCH below.
     Its wheels do NOT spin: see the note on the `spaces` scene about motion
     that would imply something arriving or leaving. */
  function bike(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<circle cx="7" cy="-7" r="7" fill="none" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<circle cx="27" cy="-7" r="7" fill="none" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M7 -7 L14 -20 L24 -7 M14 -20 H25 M27 -7 L24 -20 M12 -21 H18" fill="none" stroke="' + LINE +
               '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</g>';
  }

  /* A cup of something hot, standing on `y`. Body 18 wide, handle to 25. */
  function cup(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<path d="M18 -18 q8 3 0 11" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
             '<path d="M0 -22 H18 L16 -4 Q16 0 12 0 H6 Q2 0 2 -4 Z" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<path d="M1 -17 H17" stroke="' + LINE + '" stroke-width="3" opacity=".75"/>' +
           '</g>';
  }

  /* A bottle of something cold, standing on `y`. Body 14 wide. */
  function bottle(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<rect x="5" y="-24" width="4" height="8" fill="' + MID + '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '<rect x="0" y="-17" width="14" height="17" rx="3.5" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<rect x="2" y="-11" width="10" height="6" rx="1.5" fill="' + CREAM + '" opacity=".8"/>' +
           '</g>';
  }

  var CAR_PITCH = 52, BIKE_PITCH = 38, CUP_PITCH = 34, BOTTLE_PITCH = 26;

  var ART = {

    /* ---- The delays: two late trains, one further down the line ----
       cp-late-trains, where BOTH amounts are given and the gap is the question.

       The quantity here is TIME, so this is the one scene on the line that can
       safely draw its two subjects whole: no arrangement of two locomotives
       tells you how many minutes late either of them was.

       What the picture does carry is the shape of the line — two separate
       things, both present at once, with a space between them and nothing
       happening to either. That space is deliberately not marked, measured or
       bracketed; see the file header. The far train runs and the near one
       stands, which is what stops the pair reading as one train before and
       after itself — the Change/Compare confusion this problem's Platform Check
       is written to head off. */
    delays: function () {
      var s = '';
      // the far line, higher in the frame, with the train still coming in
      s += track(99);
      s += engine(24, 90, true);
      // steam trailing BACKWARDS from the far engine's chimney (world x ~78),
      // which is the correct trail for something heading right
      for (var k = 0; k < 3; k++) {
        s += '<g transform="translate(78,42)"><g class="rsc-puff" style="--i:' + k + '">' +
             '<circle r="8" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.8" opacity=".9"/></g></g>';
      }
      // the near line, and the train that has already stopped
      s += track(117);
      s += engine(196, 108, false);
      s += dial(292, 26, 15);
      return s;
    },

    /* ---- The ticket hall: two places to queue, neither with an end in sight ----
       cp-ticket-queues, where the LARGER amount is unknown.

       THE PEOPLE ARE THE QUANTITY, so none of them may be countable. They
       overlap, they run off both edges of the frame, and they are drawn as
       silhouettes with no features — what is on screen is a crowd, not a
       number. A student who tries to count gets a lower bound on a queue whose
       end is outside the picture, which is exactly the honest answer.

       The picture also declines to say WHICH queue is longer, though the story
       states it outright. It could show it without leaking anything. It does
       not, because a drawn length difference here would be the second picture
       of a relationship the Plan model already draws to scale, and the two
       would disagree the moment a number set changed. */
    queues: function () {
      var s = '';
      // back wall and floor
      s += '<rect x="0" y="0" width="320" height="120" fill="none"/>';
      s += '<path d="M-8 120 H328" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';

      // the row of ticket machines, running off the left edge
      for (var m = -12; m < 116; m += 42) {
        s += '<g transform="translate(' + m + ',0)">' +
               '<rect x="0" y="44" width="34" height="56" rx="4" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.5"/>' +
               '<rect x="6" y="51" width="22" height="16" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>' +
               '<path d="M6 78 H28 M6 86 H21" stroke="' + INK + '" stroke-width="2" opacity=".45" stroke-linecap="round"/>' +
               '<circle cx="28" cy="73" r="2.6" fill="' + LINE + '" stroke="' + INK + '" stroke-width="1.4" class="rsc-blink"/>' +
             '</g>';
      }

      // the ticket window: an opening in the wall with a clerk behind it
      s += '<rect x="196" y="26" width="112" height="74" rx="5" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.6"/>';
      s += '<path d="M208 78 V46 a44 26 0 0 1 88 0 V78 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>';
      s += '<path d="M252 46 V78" stroke="' + INK + '" stroke-width="1.8" opacity=".4"/>';
      // the clerk, behind the glass
      s += '<circle cx="252" cy="58" r="7" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2.2"/>';
      s += '<path d="M240 78 q0 -12 12 -12 q12 0 12 12 Z" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
      // the counter ledge
      s += '<rect x="192" y="80" width="120" height="9" rx="3" fill="' + SHADE + '" stroke="' + INK + '" stroke-width="2.4"/>';

      /* The crowd. Figures overlap by BODY_W - QUEUE_PITCH and the run starts
         left of the frame and finishes right of it, so neither queue has a
         first person or a last one. Two tones alternate for depth only — they
         do not group the figures into anything, and the ragged heights stop the
         row reading as a repeated stamp. */
      for (var i = 0, x = -18; x < 336; i++, x += QUEUE_PITCH) {
        s += person(x, 120, i % 3 === 1 ? 30 : 34, i % 2 ? LINE : SHADE, i);
      }
      return s;
    },

    /* ---- The two platforms: benches going away along both ----
       cp-bench-count, where the SMALLER amount is unknown and "more" means
       take away. The keystone problem of the line, and the one whose picture
       could do the most damage.

       THE BENCHES ARE THE ANSWER. So neither row has a first bench or a last
       one: both start left of the frame and end right of it, and the two rows
       are deliberately half a pitch out of step with each other so they never
       pair up into something a student could count across. Aligned rows would
       be an invitation to compare them, and comparing them is precisely the
       thing this problem's number set decides and this picture must not.

       The canopy is the only thing distinguishing the express platform from the
       local one, and it distinguishes them without ranking them by size. */
    /* ---- The buffet: hot on the shelf, cold on the counter ----
       cp-hot-drinks, the percent compare.

       DRINKS ARE THE QUANTITY, so both rows run off both edges and the pitches
       differ (34 against 26) so cups and bottles never pair up into something
       countable across. Same discipline as `platforms` and `spaces`.

       The rows must ALSO not imply which is the longer, because on this problem
       that IS the answer: the story gives the cold drinks and a percentage, and
       the hot drinks are what the student works out. Neither row has an end in
       the frame, so neither is longer in the picture.

       Motion is ambient for the reason set out on `spaces` — nothing may look
       like it is being sold, because a drink leaving the counter would change
       one of the two amounts being compared, and this problem's Platform Check
       is keyed to "no amount ends up different". Steam rises and a menu board
       swings; no cup moves. */
    buffet: function () {
      var s = '', x;

      /* The menu board hangs from y 6, not from y 0. At 0 the straps measured
         y -2.7..8.6 in a 0..130 frame — flush with the ceiling at rest and
         sliced off through the swing, because `rsc-swing` rotates the group and
         a rotation lifts the outer corner above where the geometry says it sits.
         Found by the geometric check added to tools/sweep.js, which is the first
         thing on this project able to see it: a clipped strap is not a token,
         not a leak and not a render error.

         LEFT AND RIGHT MAY RUN OFF THIS FRAME. TOP AND BOTTOM MAY NOT. The
         straddle is a deliberate device for making a row uncountable; a shape
         cut by the ceiling is just a shape drawn too high. */
      s += '<g transform="translate(250,6)"><g class="rsc-swing">' +
             '<path d="M-22 0 V6 M22 0 V6" stroke="' + INK + '" stroke-width="2"/>' +
             '<rect x="-30" y="6" width="60" height="22" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M-22 14 H22 M-22 21 H4" stroke="' + INK + '" stroke-width="2" opacity=".5" stroke-linecap="round"/>' +
           '</g></g>';

      // steam off one of the cups — the only thing on the shelf that moves
      for (var k = 0; k < 3; k++) {
        s += '<g transform="translate(78,40)"><g class="rsc-puff" style="--i:' + k + '">' +
             '<circle r="5" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6" opacity=".85"/></g></g>';
      }

      /* Steam off a second cup and a rocking urn tap. Three animated puffs and a
         swinging board was thin next to the busier scenes; nothing here fills or
         empties, so `moments: steady` still holds. */
      for (var k2 = 0; k2 < 3; k2++) {
        s += '<g transform="translate(180,40)"><g class="rsc-puff" style="--i:' + (k2 + 1) + '">' +
             '<circle r="4" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.5" opacity=".8"/></g></g>';
      }
      s += '<circle cx="36" cy="52" r="2.8" fill="' + LINE + '" stroke="' + INK +
           '" stroke-width="1.4" class="rsc-blink"/>';
      s += '<circle cx="300" cy="100" r="2.8" fill="' + LINE + '" stroke="' + INK +
           '" stroke-width="1.4" class="rsc-blink" style="animation-delay:.6s"/>';

      // the hot shelf
      for (x = -6; x < 336; x += CUP_PITCH) s += cup(x, 62);
      s += '<path d="M-8 62 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<rect x="-8" y="62" width="336" height="8" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';

      // the cold counter below it
      for (x = -4; x < 336; x += BOTTLE_PITCH) s += bottle(x, 112);
      s += '<path d="M-8 112 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<rect x="-8" y="112" width="336" height="8" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';
      return s;
    },

    /* ---- The car park and the bike rack: the multiplicative compare ----
       cp-parking-spaces, where the story says "times as many" and the move is a
       division.

       SPACES ARE THE QUANTITY, so both rows run off both edges of the frame and
       the two pitches differ (52 against 38) so the rows never line up into
       countable pairs. Same discipline as `platforms`.

       AND ONE MORE CONSTRAINT THIS SCENE ADDS: NO MOTION THAT IMPLIES ARRIVAL
       OR DEPARTURE. A car driving into frame would change how many spaces are
       taken — and the Platform Check on this very problem asks the student
       whether any amount ends up different from how it started, keyed to "no".
       An illustration answering "yes" beside that question would be the site
       arguing with itself on one screen. So the motion here is ambient and
       stationary: hazard lights blinking, a sign swinging. Nothing moves in or
       out, and no wheel turns.

       (The `delays` scene DOES run a train, and that is fine: a moving train
       changes neither train's lateness, and the Check says so in as many words
       — "a train can run all day and still be running at the same rate". The
       test is not whether something moves. It is whether the motion would
       change one of the two amounts being compared.) */
    spaces: function () {
      var s = '', x;

      /* Forecourt lamps, and they are a COMPOSITION fix rather than decoration.
         Measured, this scene first drew between y 28 and y 118 in a frame 130
         tall — a 28-unit empty band across the top, where the other three fill
         their frames to within a few units. It read bottom-heavy beside them.
         The lamp heads sit at y 8..16, clear above the car roofs at y 28, and
         the shafts drop between cars: the gaps between parked cars are 8 units
         wide at x 24..32 and x 180..188, which is where these two stand. Move
         CAR_PITCH and these land on a bonnet. */
      [28, 184].forEach(function (lx) {
        s += '<path d="M' + lx + ' 58 V16" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
             '<path d="M' + (lx - 8) + ' 16 H' + (lx + 8) + ' L' + (lx + 5) + ' 8 H' + (lx - 5) + ' Z" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
      });

      // the car park, on the upper level
      for (x = -20; x < 336; x += CAR_PITCH) {
        s += car(x, 58, ((x + 20) / CAR_PITCH) % 2 ? SHADE : LINE);
      }
      /* Hazard lights, and a barrier arm at the entrance. The arm ROCKS in place
         rather than lifting: a barrier that raised would mean a car coming in,
         and a car coming in changes how many spaces are taken — see the note at
         the top of this scene. Added after a motion audit found three animated
         elements here against nine and thirteen elsewhere. */
      s += '<circle cx="87" cy="43" r="3" fill="#D9822B" stroke="' + INK + '" stroke-width="1.6" class="rsc-blink"/>';
      s += '<circle cx="129" cy="43" r="3" fill="#D9822B" stroke="' + INK + '" stroke-width="1.6" class="rsc-blink" style="animation-delay:.5s"/>';
      s += '<circle cx="231" cy="43" r="3" fill="#D9822B" stroke="' + INK + '" stroke-width="1.6" class="rsc-blink" style="animation-delay:.9s"/>';
      s += '<g transform="translate(14,58)"><g class="rsc-swing">' +
             '<path d="M0 0 V-26" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
             '<path d="M0 -24 H44" stroke="' + LINE + '" stroke-width="4" stroke-linecap="round"/>' +
             '<path d="M12 -24 H20 M30 -24 H38" stroke="' + CREAM + '" stroke-width="4" stroke-linecap="round"/>' +
           '</g></g>';
      s += '<path d="M-8 58 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<rect x="-8" y="58" width="336" height="8" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';

      // the sign between the two levels — lines standing in for lettering,
      // never a glyph and never a number
      s += '<g transform="translate(256,66)"><g class="rsc-swing">' +
             '<path d="M0 0 V7" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<rect x="-26" y="7" width="52" height="16" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M-19 13 H19 M-19 19 H6" stroke="' + INK + '" stroke-width="2" opacity=".5" stroke-linecap="round"/>' +
           '</g></g>';

      // the bike rack below, on a different pitch so the rows never pair up
      s += '<path d="M-8 104 H328" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>';
      for (x = -8; x < 336; x += BIKE_PITCH) s += bike(x, 118);
      s += '<path d="M-8 118 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      return s;
    },

    platforms: function () {
      var s = '';
      var i;

      // the express platform: canopy, posts, deck
      s += '<path d="M-8 12 H328 V22 H-8 Z" fill="' + LINE + '" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>';
      s += '<path d="M40 22 V62 M264 22 V62" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';

      // the hanging sign — lines standing in for lettering, never a glyph and
      // never a platform number, which would be a digit on a masked screen
      s += '<g transform="translate(152,22)"><g class="rsc-swing">' +
             '<path d="M0 0 V8" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<rect x="-30" y="8" width="60" height="18" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M-22 15 H22 M-22 21 H8" stroke="' + INK + '" stroke-width="2" opacity=".5" stroke-linecap="round"/>' +
           '</g></g>';

      /* A train running through behind the express platform, and lamps down
         both. A motion audit found this scene carrying two animated elements —
         a swinging sign and a blinking lamp — against nine and thirteen on the
         busier ones. Attention is the point of these pictures.

         A train PASSING changes no bench count, so `moments: steady` still
         holds; the Platform Check's own wording allows it in as many words. */
      s += '<g class="rsc-scroll"><g transform="translate(0,54)">' +
             '<rect x="-96" y="-26" width="88" height="26" rx="5" fill="' + MID +
               '" stroke="' + INK + '" stroke-width="2.2" opacity=".85"/>' +
             '<rect x="-88" y="-20" width="24" height="11" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6"/>' +
             '<rect x="-56" y="-20" width="24" height="11" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6"/>' +
           '</g>' +
           '<g transform="translate(320,54)">' +
             '<rect x="-96" y="-26" width="88" height="26" rx="5" fill="' + MID +
               '" stroke="' + INK + '" stroke-width="2.2" opacity=".85"/>' +
             '<rect x="-88" y="-20" width="24" height="11" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6"/>' +
             '<rect x="-56" y="-20" width="24" height="11" rx="2" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6"/>' +
           '</g></g>';
      [70, 200].forEach(function (lx, k) {
        s += '<circle cx="' + lx + '" cy="26" r="2.8" fill="' + LINE + '" stroke="' + INK +
             '" stroke-width="1.4" class="rsc-blink" style="animation-delay:' + (k * 0.7) + 's"/>';
      });
      for (i = -24; i < 336; i += 46) s += bench(i, 62);
      s += '<path d="M-8 62 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<rect x="-8" y="62" width="336" height="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';

      // the local platform below it: no canopy, one lamp
      s += '<g transform="translate(230,112)">' +
             '<path d="M0 0 V-30" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
             '<path d="M-9 -30 H9 L5 -40 H-5 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
             '<circle cy="-34" r="2.8" fill="' + LINE + '" class="rsc-blink"/>' +
           '</g>';

      /* Out of step with the row above, but by ELEVEN and not by half a pitch.
         Half a pitch (start -1) reads better on paper and is wrong on screen:
         with a pitch of 46 it puts this row's last bench at 275..301, which
         stops 19px short of the frame and hands the local platform a visible
         LAST BENCH — the exact thing the row must not have, on the problem
         whose answer is a count of these benches. A start of -13 keeps the rows
         from pairing up AND leaves both of them cut by both edges: -13..13 over
         the left edge, 309..335 over the right. Move either number and check
         both edges again. */
      for (i = -13; i < 336; i += 46) s += bench(i, 112);
      s += '<path d="M-8 112 H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<rect x="-8" y="112" width="336" height="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';
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

  global.CompareScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
