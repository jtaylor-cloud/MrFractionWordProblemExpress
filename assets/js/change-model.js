/* ============================================================
   The Change Train — the Plan-phase model for The Change Line.

   WHY THIS EXISTS
   Neither existing model fits Start ± Change = Result.

   The Model Yard splits ONE whole into equal parts. That is the Part–Whole
   picture, and on a change problem it is simply false: nothing is being cut
   up. A shop that had 340 bulbs and took 75 more is not 415 divided into
   anything.

   The Ratio Table shows two quantities scaling together. Also wrong here —
   there is one quantity, at two moments in time, and the thing between them
   is an event rather than a multiplier.

   So the Change Line gets the site's own metaphor made literal: a train of
   THREE CARS — what you started with, what happened, what you ended with —
   with one car missing. That is exactly the structure of the line, and the
   Ticket Booth has already been asking students to name the missing car for
   every problem on the site. Here they can see it.

   WHAT THE STUDENT DOES
     1. SEE   — the three cars, one of them a question mark
     2. FIND  — the move that reaches the missing car FROM the two they have
     3. READ  — that move written back into the train

   Step 2 is the whole lesson, and it is the anti-keyword lesson this project
   exists for. A story that says "more" does NOT mean you add. If the START is
   missing, "she was given 75 more and ended with 415" is solved by
   SUBTRACTING. Any student running on keywords gets it wrong every time the
   unknown moves to the front, which is precisely why the three problems on
   this line put the unknown in all three positions.

   WHAT IT DELIBERATELY DOES NOT DO
   It never fills the missing car. This runs in the PLAN phase, before the
   Engine Room; computing the answer here would hand it over a screen early —
   the defect Cycle 6 spent itself removing from the Model Yard, and the same
   discipline the Ratio Table already keeps. The car stays "?" and says so.

   Animation rules, inherited from the accessibility spec:
     - Motion is decorative; every state is also in text and in aria.
     - State is NEVER set by a transition; the sweep is a separate overlay.
     - prefers-reduced-motion drops the sweep and the train still reads.

   It reuses the Ratio Table's CSS (.rtab, .rt-grid, .rt-opt, .rt-law). Two
   models on one site that look like two different products is its own defect,
   and the classes were already styled and contrast-checked.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function trainOf(p) { return p && p.signalBox && p.signalBox.changeTrain; }

  /** Does this problem carry a change train? If so it owns the Plan phase. */
  function applies(p) { return !!trainOf(p); }

  /* Options are SHUFFLED, seeded per problem. Every table on the ratio line
     was authored with the correct operation first, so the answer sat at the
     top of every one — the same defect the Read 3 options had. Authoring a new
     model without the shuffle would reintroduce it on day one. Seeded so a
     re-render does not move the buttons under the student mid-question. */
  function optionsFor(p, ct) {
    return MF.seededShuffle(ct.options || [], p.id + '|changemove|');
  }

  function html(p) {
    var ct = trainOf(p);
    if (!ct) return '';
    var cars = ct.cars || [];

    var body = cars.map(function (c, i) {
      var unknown = String(c.value) === '?';
      return '<tr data-car="' + i + '"' + (unknown ? ' data-unknown="1"' : '') + '>' +
        '<th scope="row">' + esc(c.label) +
          (c.unit ? ' <span class="rt-unit">(' + esc(c.unit) + ')</span>' : '') + '</th>' +
        '<td class="rt-val' + (unknown ? ' rt-unknown' : '') + '"><span>' + esc(c.value) + '</span></td>' +
      '</tr>';
    }).join('');

    /* data-i indexes the SHUFFLED list, so the click handler must read from
       the same shuffled array — not from ct.options. */
    var opts = optionsFor(p, ct).map(function (o, i) {
      return '<button class="opt rt-opt" type="button" data-i="' + i + '" aria-pressed="false">' +
             esc(o.text) + '</button>';
    }).join('');

    return '' +
      '<div class="rtab ctrain" data-stage="ask">' +
        '<div class="yard-head">' +
          '<span class="eyebrow">' + esc(ct.title || 'The Change Train') + '</span>' +
          '<h3>' + esc(ct.heading || 'Three cars, one of them missing') + '</h3>' +
        '</div>' +

        '<p class="yard-say ct-say" role="status">' + esc(ct.prompt || '') + '</p>' +

        '<div class="rt-wrap">' +
          '<table class="rt-grid ct-grid">' +
            '<caption class="visually-hidden">' + esc(ct.a11yDescription || '') + '</caption>' +
            '<tbody>' + body + '</tbody>' +
          '</table>' +
        '</div>' +

        '<p class="rt-ask">' + esc(ct.question || 'Which move reaches the missing car?') + '</p>' +
        '<div class="opt-row ct-opts">' + opts + '</div>' +
        '<div class="feedback ct-fb"></div>' +
        '<div class="rt-law ct-law" hidden></div>' +

        '<p class="hint-text"><strong>In words:</strong> ' + esc(ct.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function wire(root, p, onDone) {
    var ct = trainOf(p);
    if (!ct) return;
    var tab = root.querySelector('.ctrain');
    if (!tab) return;

    var q = function (s) { return tab.querySelector(s); };
    var say = q('.ct-say'), fb = q('.ct-fb'), law = q('.ct-law');
    var shuffled = optionsFor(p, ct);
    var settled = false;

    tab.querySelectorAll('.rt-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (settled) return;
        var o = shuffled[+btn.getAttribute('data-i')];
        if (!o) return;

        if (!o.correct) {
          /* State flips instantly and is carried in aria — never by the
             animation. A wrong pick is answered, not just refused. */
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
        tab.querySelectorAll('.rt-opt').forEach(function (b) { b.disabled = true; });

        /* Name the move on the missing car — WITHOUT evaluating it. The car
           still reads "?" underneath; what appears is the route to it. */
        var row = tab.querySelector('tr[data-unknown="1"]');
        if (row) {
          var cell = row.querySelector('.rt-val');
          if (cell) {
            cell.innerHTML = '<span>?</span>' +
              '<span class="ct-move"> &nbsp;=&nbsp; ' + esc(o.text) + '</span>';
          }
        }

        tab.setAttribute('data-stage', 'applied');
        say.innerHTML = esc(ct.settledSay || 'That is the move that reaches the missing car.');
        fb.innerHTML =
          '<div class="msg msg-go"><span class="ico" aria-hidden="true">✓</span><p>' +
          '<strong>That is the move.</strong> ' + esc(o.why || '') + '</p></div>';

        law.hidden = false;
        law.innerHTML =
          '<p class="rt-law-txt"><strong>' + esc(ct.law ||
            'Which move you make depends on WHICH car is missing, not on the words in the story.') +
          '</strong></p>' +
          '<p class="rt-pending">' + esc(ct.pending ||
            'The missing car stays a question mark on purpose — actually working it out is the next stop.') + '</p>';

        if (global.A11y && A11y.announce) {
          A11y.announce('Correct. The missing car is ' + (o.text || '') + '. ' + (ct.pending || ''));
        }
        if (onDone) onDone();
      });
    });
  }

  global.ChangeModel = { applies: applies, html: html, wire: wire };
})(window);
