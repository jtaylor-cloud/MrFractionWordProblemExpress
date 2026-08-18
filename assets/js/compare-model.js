/* ============================================================
   The Compare model — the Plan phase for the Compare Line.

   WHY THIS FILE EXISTS AT ALL. The Model Yard draws one whole cut into equal
   parts. That is the Part–Whole signature, and handing it to another line
   teaches the wrong structure — Cycle 6 shipped the Ratio Rail on the Yard and
   every problem on the line taught students to hunt for a total to carve up.
   Compare has no whole to cut. It has two amounts standing side by side and a
   gap between them, so it gets its own picture. (VERIFICATION.md, and the note
   at the top of `model.js` about adding models in pairs.)

   WHAT THE STUDENT DOES: names the REFERENT — the amount the other one is being
   measured against. That is the whole lesson of this line. "Three times as many
   as WHAT?" is the #1 error here per Pedagogy §3.2, and it is the error that
   survives every keyword strategy: "Ana ran a quarter mile more than Ben" and
   "Ana ran a quarter mile, Ben ran more" put the same words around opposite
   pictures. Picking the wrong bar is the mistake worth making here.

   WHERE IT STOPS. On a correct pick the gap appears, bracketed and labelled
   with the question — never with a number. This is the same stopping point the
   ratio table has: it shows the scale factor and refuses to fill the unknown
   cell, because the Plan phase runs BEFORE the Engine Room. If this model ever
   computes the gap it has done the student's work, and that is the defect this
   project has now recorded five times.

   BAR LENGTHS ARE DERIVED, NEVER AUTHORED. Each bar names a token and the width
   comes from that token's value in the CURRENT number set. Authored widths
   would be right for set 1 and quietly wrong for the other three — the picture
   would contradict its own numbers, which is exactly the class of defect
   `numberChecks` exists to catch elsewhere. See VERIFICATION.md §33.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function barsOf(p) { return p && p.signalBox && p.signalBox.compareBars; }

  /** Does this problem carry a compare picture? If so it owns the Plan phase. */
  function applies(p) { return !!barsOf(p); }

  /* Fractions, decimals and whole numbers all have to become a length. "2/3"
     must not come back as 2 — parseFloat would say 2, draw the wrong bar, and
     nothing downstream would notice, because a picture that is merely the wrong
     SIZE still validates. */
  function numOf(raw) {
    var t = String(raw == null ? '' : raw).replace(/[^0-9./]/g, '');
    if (t.indexOf('/') > 0) {
      var q = t.split('/');
      var d = parseFloat(q[1]);
      return d ? parseFloat(q[0]) / d : NaN;
    }
    return parseFloat(t);
  }

  function valueOf(p, token) {
    var n = p.problem && p.problem.numbers && p.problem.numbers[token];
    return n ? numOf(n.value) : NaN;
  }

  function labelOf(p, token) {
    var n = p.problem && p.problem.numbers && p.problem.numbers[token];
    if (!n) return '';
    return n.value + (n.unit ? ' ' + n.unit : '');
  }

  /* TWO SHAPES OF COMPARE PROBLEM, ONE PICTURE.

     Both amounts given (difference unknown) — cp-late-trains. Two plain bars,
     and the gap between their ends is what the question wants.

     One amount MISSING (larger or smaller unknown) — the problems where the
     story says "▮ more than". Here the difference is a GIVEN, so the picture
     draws the shorter bar and then the difference marked off on the end of the
     longer one. That is the tape diagram that makes "smaller + difference =
     larger" visible, and it is the whole reason those two problems exist: on
     one of them "more" means add and on the other it means subtract, and the
     picture is identical both times. The words move; the structure does not.

     The unknown bar carries "?" and never a value, at either end. */
  /* THE THIRD SHAPE: MULTIPLICATIVE COMPARE — "▮ times as many as…"
     Added 2026-08-08 for cp-parking-spaces, and it is a genuinely different
     picture rather than a variation on the gap.

     An additive compare is base + a difference marked off the end. A
     multiplicative one has no difference to mark: what is given is the FACTOR,
     and the honest picture is the referent drawn ONCE and the other amount
     drawn as that many copies of it. That is what makes "four times as many as
     WHAT" answerable from the picture — the thing being copied is the referent,
     and it is the only bar you can point at.

     Letting this ride the `gap` shape would have drawn a difference the story
     never states, at a width derived from nothing, which is the Cycle 6 mistake
     in miniature: the wrong structure, drawn convincingly.

     THE COPIES CARRY NO VALUES. Four blank segments beside a total of 52 is the
     relationship the story states; four segments labelled 13 is the answer,
     drawn, on the screen before the Engine Room asks for it. The Model Yard
     hides its per-part values for exactly this reason and the validator warns
     about authoring them — see `segmentValue` in data.js. */
  function geometry(p, cb) {
    var bars = cb.bars || [];
    if (bars.length < 2) return null;
    var known = null, unknown = null;
    bars.forEach(function (b) { if (b.unknown) unknown = b; else known = b; });

    /* THE FOURTH SHAPE: PERCENT COMPARE — "▮% more than…"
       Added 2026-08-08 for cp-hot-drinks.

       It looks like the additive gap and is not one. In an additive compare the
       difference is GIVEN, so the picture can mark it off the end. Here the
       difference is exactly what the student has to work out, and what is given
       is a percentage — so the extra piece takes its width FROM THE REFERENT
       BAR, at the stated percentage of it, and carries the percentage as its
       label rather than a count.

       That is the whole reason this problem is on this line: "twenty per cent
       more" is meaningless until you say more than WHAT, and the picture answers
       it by construction — the extra is visibly a fifth of the cold-drinks bar,
       not a fifth of anything else. Draw it as a gap of authored width and the
       question stops being askable.

       Riding `gapToken` was not an option: a gapToken names a number the problem
       states, and this problem states no difference. */
    if (cb.percentToken) {
      var pv = valueOf(p, cb.percentToken);
      if (!isFinite(pv) || pv <= 0) return null;
      return { mode: 'percent', pct: pv, factor: 1 + (pv / 100) };
    }

    if (cb.factorToken) {
      var f = valueOf(p, cb.factorToken);
      if (!isFinite(f) || f <= 1) return null;
      var unitBar = null, multBar = null;
      bars.forEach(function (b) { if (b.key === cb.referent) unitBar = b; else multBar = b; });
      if (!unitBar || !multBar) return null;
      /* Dividers only when the factor is a whole number. A factor of 1.25 has
         no "copies" to draw, and faking them with a part-segment would be a
         picture of something the story does not say. The bars still take their
         true proportions in that case. */
      var copies = (f % 1 === 0 && f <= 12) ? f : 0;
      return { mode: 'times', factor: f, copies: copies, unit: unitBar, mult: multBar };
    }

    if (!unknown) {                       // both given: plain two-bar compare
      var vals = bars.map(function (b) { return valueOf(p, b.token); });
      var max = Math.max.apply(null, vals);
      if (!isFinite(max) || max <= 0) return null;
      return { mode: 'both', max: max, vals: vals };
    }

    var gap = valueOf(p, cb.gapToken);
    var kv = valueOf(p, known.token);
    if (!isFinite(gap) || !isFinite(kv) || gap <= 0 || kv <= 0) return null;

    // The unknown is either the longer bar (known + gap) or the shorter (known - gap).
    var unknownIsLarger = cb.unknownIs !== 'smaller';
    var base = unknownIsLarger ? kv : kv - gap;
    var total = unknownIsLarger ? kv + gap : kv;
    if (base <= 0 || total <= 0) return null;
    return { mode: 'gap', base: base, gap: gap, total: total,
             unknownIsLarger: unknownIsLarger, known: known, unknown: unknown };
  }

  function html(p) {
    var cb = barsOf(p);
    if (!cb) return '';
    var bars = cb.bars || [];
    var g = geometry(p, cb);
    if (!g) return '';

    var rows = bars.map(function (b, i) {
      var isUnknown = !!b.unknown;
      var valTxt = isUnknown ? '?' : labelOf(p, b.token);
      var fill;

      if (g.mode === 'percent') {
        /* The referent is the whole bar; the other is that bar plus the stated
           percentage of it, marked on the tail. Reuses `.cmp-diff` — the same
           hatched overlay the additive shape uses — because it is the same idea
           wearing a different label, and a second class doing one job is how the
           two halves of a stylesheet drift apart. */
        var isRef = b.key === cb.referent;
        var refPct = 100 / g.factor;
        fill = '<span class="cmp-fill' + (isUnknown ? ' cmp-fill-unknown' : '') +
               '" style="width:' + (isRef ? refPct : 100).toFixed(2) + '%"></span>';
        if (!isRef) {
          fill += '<span class="cmp-diff" style="left:' + refPct.toFixed(2) + '%;width:' +
                  (100 - refPct).toFixed(2) + '%">' + esc(g.pct + '% more') + '</span>';
        }
      } else if (g.mode === 'times') {
        /* The referent is one copy; the other bar is `factor` of them. Widths
           come from the factor, which the story states — nothing here is
           authored and nothing is derived from the answer. */
        var isUnit = b.key === cb.referent;
        var pct = isUnit ? (100 / g.factor) : 100;
        fill = '<span class="cmp-fill' + (isUnknown ? ' cmp-fill-unknown' : '') +
               '" style="width:' + pct.toFixed(2) + '%"></span>';
        if (!isUnit && g.copies) {
          for (var c = 1; c < g.copies; c++) {
            fill += '<span class="cmp-copy" aria-hidden="true" style="left:' +
                    ((c * 100) / g.copies).toFixed(2) + '%"></span>';
          }
        }
      } else if (g.mode === 'both') {
        fill = '<span class="cmp-fill" style="width:' +
               Math.max(6, Math.round((g.vals[i] / g.max) * 100)) + '%"></span>';
      } else {
        /* The longer bar is drawn as base + the difference marked off. Which
           bar is longer depends on where the unknown sits, not on the order
           the bars are authored in. */
        /* The bar's own outline spans its own total; the difference is an
           OVERLAY on the tail. Drawing the difference as a box tacked past the
           end left the dashed "?" outline short of the amount it labelled —
           user-found, and it made the unknown look like the shorter one on
           problems where it is the longer. Same fix as cmpBar in testtrack.js. */
        var isLonger = g.unknownIsLarger ? isUnknown : !isUnknown;
        var basePct = Math.max(5, Math.round((g.base / g.total) * 100));
        var gapPct = Math.max(4, Math.round((g.gap / g.total) * 100));
        fill = '<span class="cmp-fill' + (isUnknown ? ' cmp-fill-unknown' : '') +
               '" style="width:' + (isLonger ? basePct + gapPct : basePct) + '%"></span>';
        if (isLonger) {
          fill += '<span class="cmp-diff" style="left:' + basePct + '%;width:' + gapPct + '%">' +
                  esc(labelOf(p, cb.gapToken)) + '</span>';
        }
      }

      /* The shape of the bar is information, and a screen-reader user gets it
         only if it is said. Sighted readers can see that one bar is four copies
         of the other; without this they were told two amounts and no relation
         between them, on the line whose entire lesson is the relation. */
      /* IT SAYS WHAT IS DRAWN, NEVER WHAT IT MEANS. The first version ended the
         referent's label with "— the amount the other is measured against",
         which is the answer to the question this screen is asking, read aloud to
         the one student who cannot see the picture and check. A sighted student
         has to work out which bar is being copied; so must this one. The same
         defect as the quilt's aria-label reading "8 of 20 blue" beside masked
         prose (scene.js), and it survived that fix because it is a different
         file. Say the geometry: how many copies, of which bar. */
      var shapeSaid = '';
      if (g.mode === 'percent') {
        shapeSaid = (b.key === cb.referent) ? ''
          : ', drawn as that same bar with ' + g.pct + ' per cent more marked on its end';
      } else if (g.mode === 'times') {
        shapeSaid = (b.key === cb.referent)
          ? ', drawn as a single copy'
          /* NOT escaped here — the whole label goes through esc() below, and
             escaping twice turns an apostrophe into &amp;#39; in the spoken
             string. */
          : ', drawn as ' + g.factor + ' copies of ' + (bars.filter(function (x) {
              return x.key === cb.referent; })[0] || {}).label;
      }
      return '<button class="cmp-row" type="button" data-key="' + esc(b.key) + '" aria-pressed="false" ' +
        'aria-label="' + esc(b.label + ', ' + (isUnknown ? 'amount unknown' : labelOf(p, b.token)) +
          shapeSaid + '. Tap if this is the amount the other is measured against.') + '">' +
          '<span class="cmp-name">' + esc(b.label) + '</span>' +
          '<span class="cmp-track">' + fill + '</span>' +
          '<span class="cmp-val' + (isUnknown ? ' cmp-val-unknown' : '') + '">' + esc(valTxt) + '</span>' +
        '</button>';
    }).join('');

    /* The gap is rendered but hidden, and it carries the QUESTION rather than a
       value. Revealing it is the reward for naming the referent — the same
       reveal-on-interaction shape the Model Yard uses for a part's value. */
    return '' +
      '<div class="model cmpbars">' +
        '<div class="section-head">' +
          '<span class="eyebrow">' + esc(cb.title || 'Side by side') + '</span>' +
          '<h3>' + esc(cb.heading || 'Two amounts, and the gap between them') + '</h3>' +
        '</div>' +

        '<p class="yard-say cmp-say" role="status">' + esc(cb.prompt ||
          'Which amount is the other one being measured against?') + '</p>' +

        '<div class="cmp-stack">' + rows + '</div>' +

        '<div class="cmp-gap" id="cmp-gap" hidden>' +
          '<span class="cmp-gap-bracket" aria-hidden="true"></span>' +
          '<span class="cmp-gap-label">' + esc(cb.gapLabel || 'the difference') + ' = <strong>?</strong></span>' +
        '</div>' +

        '<div class="feedback" role="status" id="cmp-fb"></div>' +
        '<p class="hint-text"><strong>In words:</strong> ' + esc(cb.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function wire(root, p, onDone) {
    var cb = barsOf(p);
    if (!cb) return;
    var wrap = root.querySelector('.cmpbars');
    if (!wrap) return;
    var done = false;

    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-key]');
      if (!b || done || b.disabled) return;
      var key = b.getAttribute('data-key');
      var fb = wrap.querySelector('#cmp-fb');

      if (key !== cb.referent) {
        /* The referent error is the teaching moment on this line, so a wrong
           pick is answered in terms of what the story says, never marked. */
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        var wrong = (cb.whyWrong && cb.whyWrong[key]) ||
          'Read the sentence again and ask which amount the other one is being measured against.';
        fb.innerHTML = '<div class="msg msg-stop"><span class="ico" aria-hidden="true">&rarr;</span>' +
                       '<p><strong>Not that one.</strong> ' + esc(wrong) + '</p></div>';
        fb.setAttribute('tabindex', '-1'); fb.focus();
        if (global.A11y && A11y.announce) A11y.announce('Not that one.');
        return;
      }

      done = true;
      b.setAttribute('data-result', 'right');
      b.setAttribute('aria-pressed', 'true');
      [].forEach.call(wrap.querySelectorAll('[data-key]'), function (x) { x.disabled = true; });
      wrap.querySelector('#cmp-gap').hidden = false;
      fb.innerHTML = '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span>' +
                     '<p><strong>Yes.</strong> ' + esc(cb.why || '') + '</p></div>';
      fb.setAttribute('tabindex', '-1'); fb.focus();
      if (global.A11y && A11y.announce) {
        A11y.announce('Correct. ' + (cb.why || '') + ' The gap is what the next step asks for.');
      }
      if (onDone) onDone();
    });
  }

  global.CompareModel = { applies: applies, html: html, wire: wire };
})(window);
