/* ============================================================
   The Crossover — the Plan-phase model for a two-line problem.

   One picture, then a slot, then a second picture that cannot start yet.

   WHY IT IS BUILT THIS WAY, AND WHAT I GOT WRONG FIRST
   The plan (CHALLENGE-MODE.md §6.1) said "model A, a transfer slot the student
   fills with the value that crosses, then model B built on it". Two of those
   three turned out to be impossible, and finding out why produced a better
   screen than the one that was specified.

   1. THE SLOT CANNOT HOLD A VALUE. The transfer is the answer to step 1, and
      the Plan phase runs before the Engine Room. A slot the student types a
      number into is the Engine Room moved one screen earlier — the exact
      defect Cycle 6 spent itself removing from the Model Yard. So the slot
      holds the transfer's NAME. Naming a quantity you cannot yet compute is
      the move this whole site is built on: the ratio table stops at the scale
      factor, the compare model stops at the gap.

   2. MODEL B CANNOT BE ANSWERED. `RatioModel` asks which operation carries one
      row across to the other, and that question needs one target cell to hold
      a number. On a two-line problem NEITHER target is known at Plan time —
      the minutes cell is the transfer, and the miles cell is the final answer.
      Rendering the real ratio table here would put a question on the screen
      that no honest student can answer.

      That is not a gap to paper over. It is the thing being taught. The second
      picture is drawn, and it is drawn WAITING: both cells a question mark,
      and a line saying why it cannot start. A student who has spent thirty
      problems being able to begin immediately meets a picture that will not
      let them, and the reason is the crossover.

   SO THE SECOND PICTURE IS STATIC AND HAS NO BUTTONS. An unanswerable question
   with live buttons under it would be worse than no buttons at all. It borrows
   `.rtab` / `.rt-grid` from ratio-model.js rather than growing a second table
   style — the markup is small enough to state here and the styling is not
   duplicated.

   WHAT THIS DOES NOT YET DO: the second picture never becomes live. Once the
   Engine Room has produced the transfer there is a real case for coming back
   and finishing the table, and nothing here supports that. Said plainly rather
   than left to be discovered.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cfg(p) { return (p && p.signalBox && p.signalBox.crossover) || null; }

  /* A paired problem owns the Plan phase, and this must be asked BEFORE every
     other model. `cl-signal-delay` carries `compareBars` for its first half,
     so CompareModel would otherwise claim it and draw half the problem while
     reporting success. Dispatched first in model.js for that reason.

     Both halves are required. A `pair` with no `crossover` block would render
     the first picture and nothing else, which is the silent-half-a-screen
     failure this file exists to prevent — so it declines the problem outright
     and the Plan phase falls through to whatever else claims it. `MF.validate()`
     refuses that combination, so it cannot reach a student either way. */
  /* `cfg(p)` is absent on an unstaffed halt by design — see the matched rules
     in `data.js`. That makes this false there, which is what fades the Plan
     phase to the estimate alone, and the validator guarantees no first-half
     model is left behind to be claimed by something else. */
  function applies(p) {
    return !!(p && p.pair && cfg(p) && global.Model && Model.applies(firstView(p)));
  }

  /* THE FIRST PICTURE IS WHICHEVER MODEL THE FIRST HALF WANTS — ASKED BY
     ASKING `Model` ITSELF, not by keeping a list of models here.

     This WAS a list: `['ChangeModel','RatioModel','CompareModel','GroupsModel']`,
     copied out of `model.js`'s dispatch order. It worked for the first two
     island problems and would have failed silently on the third. The Model
     Yard — the fallback that draws Part–Whole — is not one of those four; it is
     the `else` at the bottom of `model.js`. So `cl-platform-planters`, whose
     first half is Part–Whole, would have found no first model, made
     `applies()` false, and dropped through to the Model Yard, which would have
     drawn the first half alone and reported success. Half a picture that looks
     finished, from a hardcoded list that did not know about the fifth thing —
     the defect class this project has seven files of, in the file I wrote to
     avoid it.

     Asking `Model` instead means this cannot happen again and a sixth model
     needs no change here. The trick is the proxy: a problem with `pair`
     removed, so `Model`'s own chain skips PairModel and lands on whatever the
     first half actually needs, Model Yard included. `Object.create` keeps every
     other field by prototype, so nothing is copied and nothing can go stale.

     The recursion terminates at depth two by construction: `Model.applies` asks
     `PairModel.applies`, which asks `Model.applies` with a proxy that has no
     `pair`, so the second call declines immediately. */
  function firstView(p) {
    var q = Object.create(p);
    q.pair = null;
    return q;
  }

  /* The second picture. Static by design — see the header. Every cell that
     would hold a derived number holds a question mark instead, and the two
     given cells are the rate as the problem states it, so nothing here is
     computed from anything. */
  function secondHtml(c) {
    var s = c.second || {};
    var rows = (s.rows || []).map(function (r) {
      return '<tr>' +
        '<th scope="row">' + esc(r.label) +
          (r.unit ? ' <span class="rt-unit">(' + esc(r.unit) + ')</span>' : '') + '</th>' +
        '<td class="rt-val rt-given"><span>' + esc(r.given) + '</span></td>' +
        '<td class="rt-op"><span class="rt-arrow" aria-hidden="true"></span>' +
          '<span class="visually-hidden">operation not found yet</span></td>' +
        '<td class="rt-val rt-unknown"><span data-cell="' + esc(r.key || '') + '">?</span></td>' +
      '</tr>';
    }).join('');

    return '' +
      '<div class="rtab xo-second" data-stage="waiting">' +
        '<div class="yard-head">' +
          '<span class="eyebrow">' + esc(s.title || 'The second picture') + '</span>' +
          '<h3>' + esc(s.heading || 'And this is what it turns into') + '</h3>' +
        '</div>' +
        '<div class="rt-wrap">' +
          '<table class="rt-grid">' +
            '<caption class="visually-hidden">' + esc(s.a11yDescription || '') + '</caption>' +
            '<thead><tr>' +
              '<th scope="col"><span class="visually-hidden">Quantity</span></th>' +
              '<th scope="col">' + esc(s.givenHeading || 'What you were told') + '</th>' +
              '<th scope="col" class="rt-op"><span class="visually-hidden">Operation</span></th>' +
              '<th scope="col">' + esc(s.targetHeading || 'What you need') + '</th>' +
            '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
        '<p class="xo-waiting" id="xo-waiting">' + esc(s.waiting || '') + '</p>' +
        '<p class="hint-text"><strong>In words:</strong> ' + esc(s.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function html(p) {
    var c = cfg(p), first = firstView(p);
    if (!c || !global.Model || !Model.applies(first)) return '';

    /* Options are SHUFFLED and seeded, AND THE SALT WAS MEASURED RATHER THAN
       PICKED — which is the only reason this surface is not shipping with the
       defect it was always going to ship with.

       Read 3, the Test Track, the ratio table and the hidden-line booth have
       each landed the correct option in a degenerate position at least once;
       this is the fifth choice surface on the site and the first draft put the
       answer at position 4 of 4, measured on the rendered screen. "Always pick
       the bottom one" would have scored 100% against 25% by chance.

       Seven salts were measured on this problem's options: |crossover| 4,
       |xover| 4, |join| 3, |transfer| 1, |crossing| 1, |seam| 3, |hands| 2.
       `|hands|` is used. Note that a shuffle is not a defence here — an
       arbitrary arrangement can still be degenerate across a small set, and
       with one problem on the island "not first and not last" is the whole of
       what can be claimed.

       ▸ RE-MEASURE WHEN ISLAND PROBLEMS 2 AND 3 LAND. With one problem this is
         a single data point dressed as a decision. The target is a flat spread
         across the four positions, and picking a salt that is merely "never
         last" would be the same tell inverted (VERIFICATION.md §21). */
    var opts = MF.seededShuffle(c.options || [], p.id + '|hands|')
      .map(function (o, i) {
        return '<button class="opt xo-opt" type="button" data-i="' + i + '" aria-pressed="false">' +
               esc(o.text) + '</button>';
      }).join('');

    return '' +
      '<div class="xo" data-stage="first">' +
        '<div class="xo-half xo-first">' + Model.html(first) + '</div>' +

        /* The slot is HIDDEN until the first picture settles. Shown from the
           start it would say "which number does the first picture hand over"
           beside a picture that has not yet established there is one. */
        '<div class="xo-slot" id="xo-slot" hidden>' +
          '<div class="xo-arrow" aria-hidden="true"></div>' +
          '<div class="yard-head">' +
            '<span class="eyebrow">The crossover</span>' +
            '<h3>' + esc(c.heading || 'What crosses over?') + '</h3>' +
          '</div>' +
          '<p class="yard-say" id="xo-say" role="status">' + esc(c.prompt || '') + '</p>' +
          '<div class="opt-row xo-opts">' + opts + '</div>' +
          '<div class="feedback" id="xo-fb"></div>' +
        '</div>' +

        /* And the second picture is hidden until the crossover is named. The
           order is the lesson: you cannot see what the second half needs until
           you know what the first half hands it. */
        '<div class="xo-half xo-secondwrap" id="xo-secondwrap" hidden>' + secondHtml(c) + '</div>' +
      '</div>';
  }

  function wire(root, p, onDone) {
    var c = cfg(p), first = firstView(p);
    if (!c || !global.Model || !Model.applies(first)) return;
    var xo = root.querySelector('.xo');
    if (!xo) return;

    var slot = root.querySelector('#xo-slot');
    var fb = root.querySelector('#xo-fb');
    var say = root.querySelector('#xo-say');
    var secondWrap = root.querySelector('#xo-secondwrap');
    var shuffled = MF.seededShuffle(c.options || [], p.id + '|hands|');
    var settled = false;

    /* The first model reports completion through the same `onDone` callback
       every model uses — which is why this passes its own function rather than
       forwarding the station's. The Plan phase is NOT done when the first
       picture is done; it is done when the crossover has been named. Passing
       `onDone` straight through here would have unlocked the station a whole
       screen early, with the second picture never seen. */
    Model.wire(root, first, function () {
      if (slot.hidden === false) return;
      slot.hidden = false;
      xo.setAttribute('data-stage', 'crossing');
      /* Not focused. The first model has just written its own settled feedback
           and moving focus would talk over a screen reader mid-sentence; the
           slot is announced instead. */
      if (global.A11y && A11y.announce) {
        A11y.announce('That is the first picture. Now: ' + (c.prompt || 'what crosses over?'));
      }
    });

    root.querySelectorAll('.xo-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (settled) return;
        var o = shuffled[+btn.getAttribute('data-i')];
        if (!o) return;

        if (!o.correct) {
          btn.setAttribute('data-result', 'wrong');
          btn.setAttribute('aria-pressed', 'false');
          fb.innerHTML =
            '<div class="msg msg-stop"><span class="ico" aria-hidden="true">→</span><p>' +
            '<strong>Not that one.</strong> ' + esc(o.why || '') + '</p></div>';
          if (global.A11y && A11y.announce) A11y.announce('Not that one. ' + (o.why || ''));
          return;
        }

        settled = true;
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('data-result', 'right');
        root.querySelectorAll('.xo-opt').forEach(function (b) { b.disabled = true; });

        /* THE NAME GOES INTO THE CELL, NEVER THE NUMBER. This is the one line
           in the file where a value could leak into the Plan phase, and it
           writes `o.text` — the label the student just chose — into the cell
           the transfer will eventually occupy. The number is still a question
           mark everywhere on this screen. */
        var cell = secondWrap.querySelector('[data-cell="transfer"]');
        if (cell) cell.textContent = c.cellLabel || o.text;

        secondWrap.hidden = false;
        xo.setAttribute('data-stage', 'crossed');
        say.innerHTML = esc(c.settledSay || '');
        fb.innerHTML =
          '<div class="msg msg-go"><span class="ico" aria-hidden="true">✓</span><p>' +
          '<strong>That is what crosses.</strong> ' + esc(o.why || '') + '</p></div>';

        if (global.A11y && A11y.announce) {
          A11y.announce('Correct. ' + (o.why || '') + ' ' + ((c.second || {}).waiting || ''));
        }
        if (onDone) onDone();
      });
    });
  }

  global.PairModel = { applies: applies, html: html, wire: wire };
})(window);
