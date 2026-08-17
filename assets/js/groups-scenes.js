/* ============================================================
   Animated scene illustrations for Equal Groups Express.

   The fourth library, after ratio-scenes.js, change-scenes.js and
   compare-scenes.js. Read the header of compare-scenes.js first — the
   uncountability rules were written there and they all apply here.

   WHY THIS LINE IS THE HARDEST ONE TO ILLUSTRATE HONESTLY.

   On Compare there are two quantities and the picture must not let you count
   either. Equal Groups has THREE — how many groups, how big a group is, and
   what they come to — and ANY of the three can be the thing the question asks
   for. So an Equal Groups scene has three ways to leak instead of two, and the
   worst of them is the one that looks most natural: draw six crates of twelve
   bottles and you have drawn the number of groups, the size of a group, and
   handed over the total to anyone willing to multiply.

   The construction that answers it, on every art here:

     - THE ROW RUNS OFF BOTH EDGES. No row has a first member or a last one, so
       the number of groups is never on screen.
     - WHAT IS INSIDE A GROUP IS NEVER RESOLVED into countable items. A crate
       shows slats and a mass, not bottles; a carriage shows a band of seating,
       not seats. Draw the contents and the group size becomes readable.
     - NOTHING IS TOTALLED. No stack, no pile, no shelf with an end to it.

   The Plan model is where the counting lives, and it is careful about which of
   the three it may draw — see the header of groups-model.js, which refuses to
   tile the total when the number of groups is the answer. The scene is the
   story; the model is the arithmetic. Same division as everywhere else here.

   MOTION MAY NOT IMPLY A GROUP BEING ADDED OR EMPTIED. Same rule as the
   `spaces` scene on the Compare Line: this line's Platform Check is keyed to
   `moments: steady`, so an illustration showing a crate being loaded would be
   the site contradicting itself on one screen. Motion here is ambient —
   couplings rocking, steam drifting, a lamp blinking. Nothing arrives.

   Reuses the `rsc-` animation vocabulary and frame CSS, as the other three do.
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
  var LINE = 'var(--line-groups)';

  /* Pitches, each paired with the width of the thing it repeats. Every pair is
     chosen so the row is cut by BOTH frame edges — see each art for the
     positions, and re-measure if you change either number. */
  var CRATE_W = 54, CRATE_PITCH = 62;
  var CAR_W = 96,   CAR_PITCH = 104;
  /* SACK_W is the DRAWN width, 28 — the path spans x 6..34, not the 40 the
     first version of this constant claimed. A width constant that disagrees
     with the path is how a row ends up ending inside the frame while the
     arithmetic above it says otherwise. Measured, not counted from the source. */
  var SACK_W = 28,  SACK_PITCH = 48,  SACK_START = -26;
  var FLAG_PITCH = 26, FLAG_START = 4;
  var CAN_W = 42,   CAN_PITCH = 50;

  function ground(y) {
    return '<path d="M-8 ' + y + ' H328" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
  }

  /* A crate: slats and a mass inside, never items. The contents are drawn as a
     single filled band precisely so they cannot be counted — resolve them into
     bottles and the group size is on screen. */
  function crate(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<rect x="0" y="-38" width="' + CRATE_W + '" height="38" rx="3" fill="' + MID +
               '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="5" y="-31" width="' + (CRATE_W - 10) + '" height="16" rx="2" fill="' + LINE +
               '" opacity=".8" stroke="' + INK + '" stroke-width="1.6"/>' +
             '<path d="M0 -26 H' + CRATE_W + ' M0 -12 H' + CRATE_W + '" stroke="' + INK +
               '" stroke-width="2" opacity=".5"/>' +
           '</g>';
  }

  /* A carriage: windows are a continuous band, not panes. */
  function carriage(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<rect x="0" y="-46" width="' + CAR_W + '" height="38" rx="6" fill="' + LINE +
               '" stroke="' + INK + '" stroke-width="2.6"/>' +
             '<rect x="8" y="-38" width="' + (CAR_W - 16) + '" height="14" rx="3" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '<path d="M0 -16 H' + CAR_W + '" stroke="' + INK + '" stroke-width="1.8" opacity=".45"/>' +
             '<circle cx="20" cy="-4" r="6" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<circle cx="' + (CAR_W - 20) + '" cy="-4" r="6" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             /* the coupling — the only moving part, and it moves in place */
             '<g transform="translate(' + CAR_W + ',-20)"><g class="rsc-swing">' +
               '<path d="M0 0 H8" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
             '</g></g>' +
           '</g>';
  }

  /* A mailbag: tied at the neck, contents never shown. */
  function sack(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
             '<path d="M6 0 q-4 -26 14 -30 q18 4 14 30 z" fill="' + LINE +
               '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
             '<path d="M12 -28 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
             '<path d="M10 -14 H30" stroke="' + INK + '" stroke-width="1.8" opacity=".45"/>' +
           '</g>';
  }

  var ART = {

    /* ---- The goods platform: crates, and no end to the row ----
       Positions: -18, 44, 106, 168, 230, 292 — the first straddles the left
       edge (-18..36) and the last straddles the right (292..346). */
    crates: function () {
      var s = '', x, i;

      /* A LOADER RUNNING THE LENGTH OF THE PLATFORM. The first version of this
         scene had a single blinking lamp and nothing else, which a user called
         out directly: the illustrations are how this site holds attention, and a
         static picture with one flashing dot does not. Compare the ratio line —
         a press throwing sheets, a van eating road, an urn filling.

         The motion still obeys the line's rule: nothing may look like a group
         being added or emptied, because this problem's Platform Check is keyed
         to `moments: steady`. So the loader TRAVELS past crates that stay put.
         It carries nothing and it changes nothing — it is the platform being
         busy, which is exactly what the Check's own wording allows ("things can
         be busy without any amount changing"). */
      s += '<path d="M-8 30 H328" stroke="' + SHADE + '" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>';

      // gantry lamps along the canopy, blinking out of step with each other
      [40, 150, 260].forEach(function (lx, k) {
        s += '<g transform="translate(' + lx + ',30)">' +
               '<path d="M0 0 V14" stroke="' + INK + '" stroke-width="2.2"/>' +
               '<path d="M-9 14 H9 L6 22 H-6 Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
               '<circle cy="18" r="2.6" fill="' + LINE + '" class="rsc-blink" style="animation-delay:' + (k * 0.55) + 's"/>' +
             '</g>';
      });

      for (x = -18; x < 336; x += CRATE_PITCH) s += crate(x, 112);
      s += ground(112);
      s += '<rect x="-8" y="112" width="336" height="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';

      /* The loader, drawn LAST so it passes in front of the crates. It scrolls
         the full frame width and wraps, so the row behind it is never disturbed. */
      s += '<g class="rsc-scroll-slow"><g transform="translate(0,112)">' +
             '<rect x="-70" y="-34" width="52" height="26" rx="4" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="-62" y="-28" width="16" height="12" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '<path d="M-18 -30 H-4 V-8 H-18" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
           '</g>' +
           '<g transform="translate(320,112)">' +
             '<rect x="-70" y="-34" width="52" height="26" rx="4" fill="' + CREAM +
               '" stroke="' + INK + '" stroke-width="2.4"/>' +
             '<rect x="-62" y="-28" width="16" height="12" rx="2" fill="' + MID + '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '<path d="M-18 -30 H-4 V-8 H-18" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
           '</g></g>';
      // its wheels, on the same scroll so they travel with it
      s += '<g class="rsc-scroll-slow">';
      for (i = 0; i < 2; i++) {
        var bx = i * 320;
        s += '<g transform="translate(' + (bx - 56) + ',108)"><g class="rsc-roller">' +
               '<circle r="7" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
               '<path d="M0 -7 V7 M-7 0 H7" stroke="' + INK + '" stroke-width="1.5" opacity=".6"/>' +
             '</g></g>';
        s += '<g transform="translate(' + (bx - 28) + ',108)"><g class="rsc-roller rsc-roller-b">' +
               '<circle r="7" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>' +
               '<path d="M0 -7 V7 M-7 0 H7" stroke="' + INK + '" stroke-width="1.5" opacity=".6"/>' +
             '</g></g>';
      }
      s += '</g>';
      return s;
    },

    /* ---- The train: carriages, and you cannot see either end ----
       Positions: -30, 74, 178, 282 — first straddles left (-30..66), last
       straddles right (282..378). */
    carriages: function () {
      var s = '', x;
      for (var k = 0; k < 3; k++) {
        s += '<g transform="translate(58,26)"><g class="rsc-puff" style="--i:' + k + '">' +
             '<circle r="7" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6" opacity=".85"/></g></g>';
      }
      for (x = -30; x < 336; x += CAR_PITCH) s += carriage(x, 108);
      s += ground(108);
      for (x = -12; x < 336; x += 26) {
        s += '<rect x="' + x + '" y="112" width="14" height="6" rx="2" fill="' + SHADE +
             '" stroke="' + INK + '" stroke-width="1.4"/>';
      }
      return s;
    },

    /* ---- The sorting office: mailbags along a bench ----
       Positions from SACK_START at SACK_PITCH: -26, 22, 70, 118, 166, 214, 262,
       310. The body sits x+6..x+34, so the first spans -20..8 across the left
       edge and the last spans 316..344 across the right.

       It started at -14 and the last sack landed at 274..308 — twelve units
       short of the frame, so the row had a visible LAST BAG on a line where how
       many groups there are can be the answer. Caught by measuring, not by
       looking. Change either constant and re-check both edges. */
    sacks: function () {
      var s = '', x;
      s += '<path d="M-8 30 H328" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';

      /* An overhead sorting belt, running. Added after a motion audit found this
         scene carrying a single animated element — the swinging sign — which is
         the same thinness that got the crates scene rebuilt.

         It runs ABOVE the bags and carries nothing, because a parcel dropping
         into a sack would show a group being filled, and this problem's Platform
         Check is keyed to `moments: steady`. A belt that turns while the bags sit
         is the platform being busy, not an amount changing. */
      s += '<g transform="translate(0,44)">' +
             '<path d="M-8 0 H328" stroke="' + INK + '" stroke-width="2.2" opacity=".5"/>';
      for (var r = -10; r < 336; r += 44) {
        s += '<g transform="translate(' + r + ',0)"><g class="rsc-roller">' +
               '<circle r="6" fill="' + MID + '" stroke="' + INK + '" stroke-width="2"/>' +
               '<path d="M0 -6 V6 M-6 0 H6" stroke="' + INK + '" stroke-width="1.4" opacity=".6"/>' +
             '</g></g>';
      }
      s += '</g>';
      // lamps along the office wall, blinking out of step with each other
      [64, 196, 292].forEach(function (lx, k) {
        s += '<circle cx="' + lx + '" cy="60" r="3" fill="' + LINE + '" stroke="' + INK +
             '" stroke-width="1.4" class="rsc-blink" style="animation-delay:' + (k * 0.6) + 's"/>';
      });

      // a hanging sign, swinging — lines for lettering, never a glyph
      s += '<g transform="translate(160,30)"><g class="rsc-swing">' +
             '<path d="M0 0 V8" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<rect x="-30" y="8" width="60" height="18" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2.2"/>' +
             '<path d="M-22 15 H22 M-22 21 H6" stroke="' + INK + '" stroke-width="2" opacity=".5" stroke-linecap="round"/>' +
           '</g></g>';
      for (x = SACK_START; x < 336; x += SACK_PITCH) s += sack(x, 114);
      s += ground(114);
      s += '<rect x="-8" y="114" width="336" height="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';
      return s;
    },

    /* ---- Bunting along the platform canopy ----
       For the fraction-times-whole problem: the repeated thing is a LENGTH, so
       the row is a continuous swag rather than a set of objects. Deliberately
       the least countable art here — the flags are pennants on a line that
       leaves the frame at both ends, and they are all the same. */
    bunting: function () {
      var s = '', x;
      s += '<path d="M-8 18 q80 26 160 20 q80 -6 176 -22" fill="none" stroke="' + INK +
           '" stroke-width="2.6" stroke-linecap="round"/>';
      /* FLAG_START is 4, not the -10 it began as. A pennant spans x-8..x+8, so
         starting at -10 put the first flag entirely off-frame at -18..-2 and
         the second fully inside at 8..24 — a row that visibly BEGINS just
         inside the left edge. From 4 the first spans -4..12 across the edge and
         the thirteenth spans 308..324 across the right one. */
      for (x = FLAG_START; x < 336; x += FLAG_PITCH) {
        var t = (x + 10) / 346;
        var y = 18 + 26 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * 0.78;
        s += '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')"><g class="rsc-swing" style="--i:' +
             ((x / FLAG_PITCH) % 3) + '">' +
               '<path d="M-8 0 H8 L0 17 Z" fill="' + LINE + '" stroke="' + INK +
                 '" stroke-width="2" stroke-linejoin="round"/>' +
             '</g></g>';
      }
      s += '<path d="M-8 96 H328" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>';
      s += ground(118);
      s += '<rect x="-8" y="118" width="336" height="9" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.2"/>';
      return s;
    },

    /* ---- The water tower and the watering cans ----
       For fraction division: how many of THIS fit into THAT. The tower is a
       single continuous body with NO gauge and no markings — a scale on it
       would be a number, and on this problem it would be the number. The cans
       are identical and run off both edges, so how many there are is not on
       screen; that is the question.
       Positions: -16, 34, 84, 134, 184, 234, 284, 334 — first straddles left,
       last straddles right (284..326 crosses 320). */
    cans: function () {
      var s = '', x;
      // the tower, drawn as one mass
      s += '<rect x="196" y="14" width="86" height="52" rx="8" fill="' + CREAM +
           '" stroke="' + INK + '" stroke-width="2.8"/>';
      s += '<rect x="190" y="6" width="98" height="12" rx="5" fill="' + MID + '" stroke="' + INK + '" stroke-width="2.5"/>';
      /* THE SPINNING VANE IS GONE, and it was wrong twice over.

         WRONG AS A PICTURE: `rsc-roller` is a 360° spin at 1.5s a turn — it is
         the class the loader's wheels and the sorting belt's rollers use, where
         a full continuous rotation is what those parts do. A weather vane does
         not whirl. Dropped onto a roof it read as an abstract cross rotating
         like a fan, which is why it did not make sense: the motion belonged to
         a different kind of object entirely. Reusing an animation vocabulary is
         right; reusing it on something that does not move that way is not.

         WRONG AS GEOMETRY: it sat at translate(239,-2) with arms spanning ±8,
         so it measured y -10..6 in a 0..130 frame and was sliced off by the
         ceiling. Nothing caught it, because tools/sweep.js's geometry check
         carried a hardcoded list of three scene libraries and this one is the
         fourth — so every art in this file had been shipped unchecked. Fixed
         there by discovering libraries instead of listing them.

         WHAT REPLACES IT HAS TO MEAN SOMETHING. The tap drips, and the garden
         it waters sways. Both are ambient and neither touches a quantity: the
         drip falls to the ground rather than into a can, because a can visibly
         filling is a group being built, and this problem's Platform Check is
         keyed to "no amount ends up different from how it started". A tower
         that empties or a can that fills would put the illustration in direct
         contradiction with the question the student is being asked. */
      s += '<circle cx="276" cy="56" r="3" fill="' + LINE + '" stroke="' + INK +
           '" stroke-width="1.4" class="rsc-blink"/>';
      s += '<path d="M212 66 V96 M266 66 V96" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round"/>';
      s += '<path d="M239 66 V80 H150" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      /* The drip, and where it lands matters. It falls from the tap to the
         GROUND — there is no can beneath it — so the picture shows a tap that
         drips and never a can that fills. A drop landing in a can would be a
         group being built on the one line where how many groups there are can
         be the answer. */
      for (var k = 0; k < 3; k++) {
        s += '<g transform="translate(150,82)"><g class="rsc-drop" style="--i:' + k + '">' +
             '<rect x="-3.5" y="0" width="7" height="11" rx="3.5" fill="' + LINE +
               '" stroke="' + INK + '" stroke-width="1.6"/></g></g>';
      }
      // the puddle it has been falling into all morning
      s += '<ellipse cx="150" cy="113" rx="15" ry="3.4" fill="' + LINE + '" opacity=".5" stroke="' + INK +
           '" stroke-width="1.6"/>';

      /* THE GARDEN THIS WATER IS FOR — the story says flower beds run the length
         of the platform, and until now none was drawn. They sway from the BASE,
         which is why `rsc-sway` had to exist: `rsc-swing` pivots about the top
         of its own box, which is right for a hanging sign and upside down for a
         growing plant. Staggered so the row ripples rather than pulsing as one
         block. Deliberately behind the cans, and never countable — they run off
         both edges on their own pitch and nothing in the story counts flowers. */
      for (x = -9; x < 336; x += 31) {
        s += '<g transform="translate(' + x + ',114)"><g class="rsc-sway" style="--i:' + ((x + 9) / 31 % 4) + '">' +
               '<path d="M0 0 V-17" stroke="#4A7C2F" stroke-width="2.4" stroke-linecap="round"/>' +
               '<path d="M0 -9 q-7 -2 -9 -8 q7 -1 9 4" fill="#4A7C2F" stroke="' + INK + '" stroke-width="1.4"/>' +
               '<circle cy="-19" r="4.2" fill="' + LINE + '" stroke="' + INK + '" stroke-width="1.8"/>' +
             '</g></g>';
      }
      for (x = -16; x < 336; x += CAN_PITCH) {
        s += '<g transform="translate(' + x + ',114)">' +
               '<rect x="0" y="-26" width="' + (CAN_W - 12) + '" height="26" rx="4" fill="' + LINE +
                 '" stroke="' + INK + '" stroke-width="2.4"/>' +
               '<path d="M' + (CAN_W - 12) + ' -20 L' + (CAN_W - 1) + ' -26" stroke="' + INK +
                 '" stroke-width="2.6" stroke-linecap="round"/>' +
               '<path d="M6 -26 q6 -8 14 -2" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/>' +
             '</g>';
      }
      s += ground(114);
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

  global.GroupsScenes = { html: html, has: has, names: Object.keys(ART) };
})(window);
