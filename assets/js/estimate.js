/* ============================================================
   The estimate gate — a band on a line, a typed field beside it, and ink.

   THE BRIEF is `ROADMAP.md` §8 and the design is `docs/ESTIMATE-INPUT.md`.
   Read that before changing anything here; every number in this file was
   measured across all 148 materialisations rather than chosen.

   WHY IT IS NOT A TEXT BOX ANY MORE. Estimating and calculating are different
   acts and the site said so in copy — "It doesn't have to be good. It has to
   exist." — while offering the same input for both. An estimate is genuinely a
   REGION, and a text box cannot express one. The student sweeps a band; its
   centre commits, so nothing downstream changes.

   THE ONE DOOR. Pointer, keyboard, typed entry and tests all commit through
   `Estimate.commit`. That is not tidiness: the estimate is a GATE — no
   estimate, no Engine Room — so a path that works for one input and not
   another locks somebody out of the whole problem. It is also what makes the
   gate testable, and those turned out to be the same requirement rather than
   two (`ESTIMATE-INPUT.md` §3).

   NOTHING PERSISTS. No storage of any kind; the band and the ink die with the
   phase, as everything else here does.
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* THE RAIL'S GEOMETRY, IN ONE PLACE, AND IT HAS TO STAY THERE.
     `.est-rail` is inset from the track so the end thumbs have somewhere to sit
     without hanging off the edge, which means the track's 0–100% and the
     SCALE's 0–100% are two different coordinate systems.

     They were written as loose numbers in two places — the ticks were laid out
     at `6 + 88 × i/4` while the thumbs were positioned at a plain percentage of
     the track. So every thumb sat up to six points away from the tick it was
     meant to be pointing at, worst at the two ends, and a click on the left end
     of the rail returned a value six per cent up the scale instead of the
     minimum. The user reported it as the slider being "off"; it was two
     coordinate systems wearing the same units.

     Anything that converts between a value and a position uses these. If the
     CSS inset changes, this changes with it and nothing else needs to know. */
  var RAIL_LO = 6, RAIL_SPAN = 88;

  /* The live gate, or null between Plan phases. Module-level so that
     `Estimate.commit(v)` is reachable without a handle on the station — which
     is how `tools/sweep.js` and any agent drive it. */
  var live = null;

  /* ---------- the window, derived and never authored ----------
     `VERIFICATION.md` §33: an authored scale is right for number set 1 and
     silently wrong for the other three.

     B = niceCeil( max(answer, largest non-distractor given) × 1.25 )

     MEASURED ACROSS ALL 148 MATERIALISATIONS: always contains the answer,
     never at the extreme edge (worst 0.98), and 102 of the 148 windows are
     fixed by the GIVENS ALONE — a zero-leak case, because the bound is then a
     number already in front of the student. The other 46 say only "larger than
     any number in the story", which the structure already licenses. Twelve
     distinct windows serve all 148, so a window is weak evidence about any one
     answer, and the answer's position within it spreads 0.05 to 0.72.

     WHY NOT BRANCH ON THE OPERATION. `unknownCar` carries 23 distinct values
     across 37 problems, most covering one or two. A rule with 23 branches is
     `VERIFICATION.md` §36 waiting to happen — the 38th problem arrives without
     one. This has no per-schema branching at all.

     DISTRACTORS ARE EXCLUDED, and that is load-bearing: `rr-van-hours` carries
     125 parcels as a distractor against an answer of 7. Included, it would set
     a window eighteen times too wide. */
  function niceCeil(x) {
    if (!(x > 0)) return 1;
    var e = Math.floor(Math.log(x) / Math.LN10), base = Math.pow(10, e), m = x / base;
    var steps = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < steps.length; i++) if (m <= steps[i] + 1e-9) return +(steps[i] * base).toPrecision(12);
    return 10 * base;
  }

  function realGivens(p) {
    var nums = (p && p.problem && p.problem.numbers) || {}, out = [];
    Object.keys(nums).forEach(function (k) {
      var n = nums[k];
      if (!n || n.role === 'distractor') return;
      var v = MF.parseAnswer(String(n && n.value !== undefined ? n.value : n));
      if (typeof v === 'number' && isFinite(v)) out.push(v);
    });
    return out;
  }

  function trueAnswer(p) {
    var a = p && p.arrivals && p.arrivals.answer;
    var v = a ? MF.parseAnswer(String(a.exact)) : null;
    return (typeof v === 'number' && isFinite(v)) ? v : null;
  }

  /* THE STEP FOLLOWS THE NUMBERS, not the problem id. 143 of 148 answers are
     whole; the exceptions are `pw-quilt-colors` (twentieths) and one 2.5. A
     rule keyed to those ids breaks on the next fraction problem anybody
     writes, so the denominator is searched for instead. */
  function denominatorOf(v) {
    if (!isFinite(v) || Math.abs(v - Math.round(v)) < 1e-9) return 1;
    for (var d = 2; d <= 100; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return d;
    return 100;
  }

  function windowFor(p) {
    var givens = realGivens(p), ans = trueAnswer(p);
    var basis = givens.length ? Math.max.apply(null, givens) : 1;
    if (ans !== null) basis = Math.max(basis, ans);
    var hi = niceCeil(basis * 1.25);

    var d = 1;
    givens.concat(ans === null ? [] : [ans]).forEach(function (v) { d = Math.max(d, denominatorOf(v)); });

    /* Whole numbers get a step that keeps the line usable rather than
       pixel-exact: about a hundred stops, snapped to something a student would
       actually say out loud. */
    var step;
    if (d === 1) {
      step = Math.max(1, Math.round(niceCeil(hi / 100)));
    } else {
      step = 1 / d;
    }
    return { lo: 0, hi: hi, step: step };
  }

  /* ---------- formatting ---------- */
  function fmt(v, step) {
    if (v === null || !isFinite(v)) return '';
    var dp = step >= 1 ? 0 : Math.min(4, String(step).replace(/^\d*\./, '').length);
    var s = v.toFixed(dp);
    return s.replace(/\.?0+$/, function (m) { return m.indexOf('.') === 0 ? '' : m; });
  }

  function snap(v, w) {
    var n = Math.round(v / w.step) * w.step;
    return Math.min(w.hi, Math.max(w.lo, +n.toFixed(6)));
  }

  /* ---------- the scratch pad, shared by both surfaces ----------
     ONE IMPLEMENTATION, TWO PLACES. The estimate has one and the Engine Room
     has one (user, 2026-08-16) — the Engine Room's without a number line,
     because there is nothing to sweep when you are calculating. Copying the
     canvas code into `phSolve` would give this project two pads that start
     identical and drift, which is the defect class it already has a file of.

     WHAT IS TRUE OF IT EVERYWHERE: never parsed, never graded, never required,
     and nothing downstream reads a single mark. It is thinking made visible.
     Because it carries nothing anybody needs, it is hidden from assistive tech
     and kept out of the tab order rather than given a keyboard equivalent that
     would draw nothing. Nothing persists — it dies with the phase. */
  /* THE LABEL SAYS WHAT IT IS FOR, AND THAT IT CAN BE TOUCHED (user,
     2026-08-16). It read "Scratch — nothing here is marked", which said what it
     was NOT for and left a student to guess what it was. Naming notes,
     calculations and drawings gives all three permission, and saying the touch
     screen works is the one thing a student cannot discover by looking. */
  var PAD_LABEL = 'Sketch Pad: For Notes, Calculations, and/or Drawings';

  /* THE TOUCH AFFORDANCE SITS IN THE BOX, NOT IN THE HEADING (user,
     2026-08-16). It is a different KIND of thing from the label: the heading
     says what this surface is for, and this says how you may use it. Inside the
     frame, low and centred, it reads as a note on the paper rather than as more
     title — and it is the one thing about the pad a student cannot discover by
     looking at it.

     It is an ELEMENT OVER the canvas rather than something drawn on it. Painted
     into the canvas it would be wiped by Clear, buried under the first stroke,
     and stretched by the backing-store scale. `pointer-events: none` so it
     never eats a stroke that starts on top of it. */
  function padHTML(id, label) {
    return '' +
      '<div class="est-pad-wrap" aria-hidden="true">' +
        '<div class="est-pad-head">' + (label || PAD_LABEL) + '</div>' +
        /* The button is pinned to the wrapper's top-right OUTER corner, so it
           stays there however the heading wraps. In the flex row it dropped
           below the label the moment the column got narrow. */
        '<button type="button" class="est-clear" data-clear="' + id + '" tabindex="-1">Clear</button>' +
        '<div class="est-pad-box">' +
          '<canvas class="est-pad" id="' + id + '" width="600" height="520"></canvas>' +
          '<span class="est-pad-hint">Touch Screen Enabled</span>' +
        '</div>' +
      '</div>';
  }

  function wirePad(host, id) {
    var pad = host.querySelector('#' + id);
    if (!pad) return;

    /* MATCH THE BACKING STORE TO THE BOX IT IS DRAWN IN, or the ink comes out
       stretched. The canvas has a fixed pixel size and is displayed at whatever
       width its column gives it — 262px on a phone, 745px beside the Engine
       Room's field — so a fixed 600-wide store was being squeezed differently
       on each screen and a stroke drawn round came out oval. Sizing it from the
       rendered box makes one drawn pixel one CSS pixel everywhere.

       THE GUARD IS LOAD-BEARING: `tools/sweep.js` renders every phase into a
       DETACHED host, where `getBoundingClientRect` is all zeros. Setting a
       canvas to width 0 throws away its context and would turn the sweep's
       1,468 screens into a wall of render errors on a pad nobody is drawing on.
       No box, no resize — the authored attributes stand. */
    var box = pad.getBoundingClientRect();
    if (box.width > 0 && box.height > 0) {
      var dpr = Math.min(2, global.devicePixelRatio || 1);
      pad.width  = Math.round(box.width * dpr);
      pad.height = Math.round(box.height * dpr);
    }
    var ctx = pad.getContext('2d');
    if (box.width > 0) ctx.scale(pad.width / box.width, pad.height / box.height);
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2C2214';
    var drawing = false;
    /* CSS pixels, because the context is scaled above — the transform does the
       conversion to device pixels, so doing it here as well would apply it
       twice and put the ink at a multiple of where the finger is. */
    function pt(e) {
      var r = pad.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    pad.addEventListener('pointerdown', function (e) {
      drawing = true; var q = pt(e); ctx.beginPath(); ctx.moveTo(q.x, q.y);
      pad.setPointerCapture(e.pointerId); e.preventDefault();
    });
    pad.addEventListener('pointermove', function (e) {
      if (!drawing) return; var q = pt(e); ctx.lineTo(q.x, q.y); ctx.stroke();
    });
    function stop(e) { if (!drawing) return; drawing = false;
      try { pad.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ } }
    pad.addEventListener('pointerup', stop);
    pad.addEventListener('pointercancel', stop);
    var clear = host.querySelector('[data-clear="' + id + '"]');
    /* Clear in DEVICE pixels, with the scale temporarily off — under the
       transform, `pad.width` is already a scaled number and clearing to it
       leaves a band of ink along the far edges. */
    if (clear) clear.addEventListener('click', function () {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pad.width, pad.height);
      ctx.restore();
    });
  }

  /* ---------- markup ---------- */
  function html(p) {
    var w = windowFor(p);
    var est = p.signalBox && p.signalBox.estimate;
    var unit = (est && est.unit) ? est.unit : '';
    /* ONLY THE ENDS CARRY A NUMBER, AND THAT IS A LEAK FIX RATHER THAN A STYLE
       CHOICE. Labelling all five ticks printed the answer on a pre-solve screen
       in 4 of 148 materialisations — `cp-ticket-queues` set 1 showed "25" on a
       line whose answer is 25, and `ch-barrier-count` set 4 showed "500" for
       500. Measured, not imagined.

       Patching those four would leave the fifth to be written next year. With
       no interior label there is no interior number to collide, and the two
       that remain are safe BY CONSTRUCTION: `B ≥ answer × 1.25`, so the upper
       label is always strictly greater than the answer, and the lower is 0
       while the smallest answer on the site is 0.15.

       The minor ticks stay, unlabelled. A line from 0 to B with three marks
       between is still readable as thirds and halves — which is all an
       estimate needs — without printing a number anybody could copy. */
    var ticks = '';
    for (var i = 0; i <= 4; i++) {
      /* Same constants the thumbs use — see the note beside RAIL_LO. */
      var x = RAIL_LO + (RAIL_SPAN * i / 4);
      var ends = (i === 0 || i === 4);
      ticks += '<div class="est-tick' + (ends ? '' : ' est-tick-minor') + '" style="left:' + x.toFixed(2) + '%">' +
                 (ends ? '<span>' + fmt(w.lo + (w.hi - w.lo) * (i / 4), w.step) + '</span>' : '') +
               '</div>';
    }
    /* THE PAD IS ON THE LEFT AND THE LINE IS ON THE RIGHT — swapped on the
       user's call, 2026-08-16, and it undoes a bad edit of mine rather than
       adding a preference.

       Mr Fraction floats at the viewport's bottom-right. My first answer was to
       shrink the pad away from him, which cost it a third of its width (496px
       to 274) — solving a collision by making the drawing surface smaller,
       which is the wrong thing to give up on the one element whose whole job is
       area.

       Swapping costs nothing instead. The PAD is the tall element, so it is the
       one that reaches his corner; on the left it never does, and it keeps its
       full width. The LINE is short — a 54px track and a row of ticks — so it
       clears him on the right without being trimmed. Same two columns, same
       screen height, no surface given up.

       The typed field travels with the line, because "beside the line, not
       behind a toggle" is a settled decision and the two belong together. */
    return '' +
      '<div class="est-wrap" id="est-wrap">' +

        '<div class="est-pad-col">' +
          padHTML('est-pad') +
        '</div>' +

        '<div class="est-line-col">' +
          '<p class="est-lead" id="est-lead">Sweep the stretch you think the answer lies in.</p>' +
          /* role=group with two sliders inside: a band is two values, and a
             screen reader has to be able to say which end it is on. */
          '<div class="est-track" id="est-track" role="group" aria-labelledby="est-lead">' +
            '<div class="est-rail"></div>' +
            '<div class="est-band" id="est-band" hidden></div>' +
            '<button type="button" class="est-thumb" id="est-lo" data-end="lo" hidden' +
              ' role="slider" aria-label="Low end of my estimate"' +
              ' aria-valuemin="' + w.lo + '" aria-valuemax="' + w.hi + '" aria-valuenow="' + w.lo + '"></button>' +
            '<button type="button" class="est-thumb" id="est-hi" data-end="hi" hidden' +
              ' role="slider" aria-label="High end of my estimate"' +
              ' aria-valuemin="' + w.lo + '" aria-valuemax="' + w.hi + '" aria-valuenow="' + w.hi + '"></button>' +
          '</div>' +
          '<div class="est-ticks">' + ticks + '</div>' +
          '<p class="est-read" id="est-read" aria-live="polite">Nothing set yet.</p>' +

          /* BESIDE THE LINE, NOT BEHIND A TOGGLE — the user's call, 2026-08-16.
             For most students this is an alternative; for some it is the only
             door, and a door behind a toggle reads as the back way in. It sits
             under the line rather than in its own column now that the pad has
             the other half of the screen — still on the page, still unlabelled
             as the lesser path, which is what that decision was about. */
          '<div class="field est-typed">' +
            '<label for="estv">Or type it' + (unit ? ' (' + unit + ')' : '') +
              '<span class="hint-text">It doesn&rsquo;t have to be good. It has to exist.</span></label>' +
            '<input type="text" id="estv" inputmode="decimal" autocomplete="off">' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- behaviour ---------- */
  function wire(host, p) {
    var w = windowFor(p);
    var track = host.querySelector('#est-track');
    var band  = host.querySelector('#est-band');
    var loT   = host.querySelector('#est-lo');
    var hiT   = host.querySelector('#est-hi');
    var field = host.querySelector('#estv');
    var read  = host.querySelector('#est-read');
    if (!track || !field) return null;

    var lo = null, hi = null;      // the band, in problem units

    function centre() { return (lo === null) ? null : (lo + hi) / 2; }

    /* Value → position, in the RAIL's coordinates, not the track's. */
    function pctOf(v) { return RAIL_LO + RAIL_SPAN * ((v - w.lo) / (w.hi - w.lo)); }

    function paint(quiet) {
      var has = lo !== null;
      band.hidden = !has; loT.hidden = !has; hiT.hidden = !has;
      if (has) {
        band.style.left  = pctOf(lo) + '%';
        band.style.width = Math.max(0.6, pctOf(hi) - pctOf(lo)) + '%';
        loT.style.left = pctOf(lo) + '%';
        hiT.style.left = pctOf(hi) + '%';
        loT.setAttribute('aria-valuenow', lo); loT.setAttribute('aria-valuetext', fmt(lo, w.step));
        hiT.setAttribute('aria-valuenow', hi); hiT.setAttribute('aria-valuetext', fmt(hi, w.step));
        read.textContent = (lo === hi)
          ? 'About ' + fmt(lo, w.step)
          : 'Somewhere between ' + fmt(lo, w.step) + ' and ' + fmt(hi, w.step) +
            ' — that commits as ' + fmt(centre(), w.step) + '.';
      } else {
        read.textContent = 'Nothing set yet.';
      }
      if (!quiet) field.value = has ? fmt(centre(), w.step) : '';
    }

    /* A TYPED VALUE OUTSIDE THE WINDOW WIDENS THE WINDOW; IT IS NEVER REFUSED.
       The line is a derived guess at where the answer lives, not a rule about
       what a student may think — `ESTIMATE-INPUT.md` §3.1. Refusing it would
       make the scale authoritative, which is the one thing the leak
       measurement says it must not be. Finding out an estimate is wrong is the
       Arrivals Board's job. */
    function growTo(v) {
      if (v <= w.hi) return false;
      w.hi = niceCeil(v * 1.25);
      [loT, hiT].forEach(function (t) { t.setAttribute('aria-valuemax', w.hi); });
      /* Only the two end labels exist, so only they are rewritten. Keyed off
         the spans that are actually there rather than off an assumed count. */
      var labels = host.querySelectorAll('.est-tick span');
      if (labels.length === 2) {
        labels[0].textContent = fmt(w.lo, w.step);
        labels[1].textContent = fmt(w.hi, w.step);
      }
      return true;
    }

    function setBand(a, b, quiet) {
      lo = Math.min(a, b); hi = Math.max(a, b);
      lo = snap(lo, w); hi = snap(hi, w);
      paint(quiet);
    }

    /* ---- pointer: one path for mouse, touch and stylus ---- */
    /* Position → value, the exact inverse of `pctOf`. Written as the inverse
       rather than as its own arithmetic, so the two cannot disagree again. */
    function valueAt(clientX) {
      var r = track.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      var t = (pct - RAIL_LO) / RAIL_SPAN;
      return snap(w.lo + (w.hi - w.lo) * Math.min(1, Math.max(0, t)), w);
    }
    var anchor = null, dragEnd = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.target === loT || e.target === hiT) { dragEnd = e.target.getAttribute('data-end'); }
      else { anchor = valueAt(e.clientX); setBand(anchor, anchor); }
      track.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    track.addEventListener('pointermove', function (e) {
      if (anchor === null && dragEnd === null) return;
      var v = valueAt(e.clientX);
      if (dragEnd === 'lo') setBand(v, hi);
      else if (dragEnd === 'hi') setBand(lo, v);
      else setBand(anchor, v);
    });
    function endDrag(e) {
      if (anchor === null && dragEnd === null) return;
      anchor = null; dragEnd = null;
      try { track.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    /* ---- keyboard: equal, not lesser. WCAG 2.1.1 and 2.5.1 ---- */
    function nudge(which, delta) {
      if (lo === null) { var mid = snap((w.lo + w.hi) / 2, w); setBand(mid, mid); return; }
      if (which === 'lo') setBand(lo + delta, hi); else setBand(lo, hi + delta);
    }
    [loT, hiT].forEach(function (t) {
      t.addEventListener('keydown', function (e) {
        var which = t.getAttribute('data-end'), s = w.step * (e.shiftKey ? 10 : 1);
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowUp') { nudge(which, s); }
        else if (k === 'ArrowLeft' || k === 'ArrowDown') { nudge(which, -s); }
        else if (k === 'Home') { setBand(which === 'lo' ? w.lo : lo, which === 'lo' ? hi : w.lo); }
        else if (k === 'End') { setBand(which === 'lo' ? w.hi : lo, which === 'lo' ? hi : w.hi); }
        else return;
        e.preventDefault();
      });
    });
    /* The track itself is reachable when no band exists yet, so a keyboard user
       has something to land on before the thumbs appear. */
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', function (e) {
      if (lo !== null) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter' || e.key === ' ') {
        var mid = snap((w.lo + w.hi) / 2, w);
        setBand(mid, mid);
        loT.focus();
        e.preventDefault();
      }
    });

    /* ---- typed: moves the band, both ways in sync ---- */
    field.addEventListener('input', function () {
      var v = MF.parseAnswer(field.value);
      if (v === null || !isFinite(v)) { return; }
      growTo(v);
      var half = (lo === null) ? 0 : (hi - lo) / 2;
      setBand(v - half, v + half, true);   // quiet: do not fight what is being typed
    });

    wirePad(host, 'est-pad');

    paint();

    live = {
      /* THE ONE DOOR. Everything commits here: pointer, keyboard, typed and
         tests. `raw` is what the student actually saw — the Arrivals Board
         shows it back, because showing the parsed value once asked a student
         whether 7/20 matched 0.35. */
      value: function () { return centre(); },
      raw: function () {
        var typed = String(field.value).trim();
        if (typed && MF.parseAnswer(typed) !== null) return typed;
        if (lo === null) return '';
        return (lo === hi) ? fmt(lo, w.step)
                           : fmt(lo, w.step) + '–' + fmt(hi, w.step);
      },
      band: function () { return lo === null ? null : { lo: lo, hi: hi }; },
      window: function () { return { lo: w.lo, hi: w.hi, step: w.step }; },
      /* Used by tests and by any caller that has a number and no pointer. */
      set: function (v) {
        var n = (typeof v === 'number') ? v : MF.parseAnswer(String(v));
        if (n === null || !isFinite(n)) return false;
        growTo(n);
        setBand(n, n);
        return true;
      }
    };
    return live;
  }

  global.Estimate = {
    html: html,
    wire: wire,
    windowFor: windowFor,
    niceCeil: niceCeil,
    /* Module-level so an agent, the sweep, or anything else can drive the gate
       without a handle on the station. Returns false when there is no live
       gate or the value is unusable — never throws, because a checker that
       throws here would look exactly like a broken phase. */
    commit: function (v) { return live ? live.set(v) : false; },
    value:  function () { return live ? live.value() : null; },
    raw:    function () { return live ? live.raw() : ''; },
    band:   function () { return live ? live.band() : null; },
    current: function () { return live; },
    release: function () { live = null; }
  };

  /* The pad on its own, for surfaces that want somewhere to work out but have
     nothing to sweep — the Engine Room. Same code, same rules, no number line. */
  global.Scratch = { html: padHTML, wire: wirePad };
})(window);
