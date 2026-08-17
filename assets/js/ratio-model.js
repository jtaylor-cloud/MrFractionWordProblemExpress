/* ============================================================
   The Ratio Table — the Plan-phase model for the Ratio & Rate Rail.

   WHY THIS EXISTS
   The Model Yard splits ONE whole into equal parts. That is the correct
   picture for Part + Part = Whole and the wrong picture for a ratio: it
   teaches a student to look for a total to carve up, when a ratio problem
   often has no total at all (500g of flour to 300g of water — where is the
   whole?). Using it on this line taught the wrong structure.

   A ratio is two quantities moving together. So the model is two ROWS that
   scale in step, which is the representation the standards use and the one
   that makes the multiplicative relationship visible.

   WHAT THE STUDENT DOES
     1. SEE     — the pair they were given, side by side
     2. FIND    — the operation that carries one row from its given value to
                  its target value
     3. WATCH   — that same operation sweep across BOTH rows together

   Step 3 is the entire lesson. The additive error (flour went up by 1500, so
   add 1500 to the water) survives every verbal explanation, because in words
   "do the same to both" sounds like it endorses adding the same amount. Seen
   as two rows scaling together, it stops being arguable. So "+1500" is on the
   button row as a real choice, and picking it is answered by the picture.

   WHAT IT DELIBERATELY DOES NOT DO
   It never fills in the unknown cell. This runs in the PLAN phase, before the
   Engine Room — computing the answer here would hand it over a screen early,
   which is precisely the defect Cycle 6 spent its time removing from the
   Model Yard. The table establishes the RELATIONSHIP; the arithmetic is the
   Engine Room's job. The unknown cell stays "?" and says so.

   Animation rules, inherited from the accessibility spec:
     - Motion is decorative; every state is also in text and in aria.
     - State is NEVER set by a transition; the sweep is a separate overlay.
     - prefers-reduced-motion drops the sweep and the table still reads.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* One table or several. A comparison problem needs one per thing being
     compared — tabling only the first stall and leaving the second to the
     Engine Room made the two look like different kinds of task, when the
     whole point is that you do the identical move to both and only then
     compare. Authors write `ratioTables: [...]`; a single `ratioTable` is
     still accepted and wrapped. */
  function tablesOf(p) {
    var sb = p && p.signalBox; if (!sb) return [];
    if (sb.ratioTables && sb.ratioTables.length) return sb.ratioTables;
    return sb.ratioTable ? [sb.ratioTable] : [];
  }

  /** Does this problem carry a ratio table? If so it owns the Plan phase. */
  function applies(p) { return tablesOf(p).length > 0; }

  /* Options are SHUFFLED, seeded per problem and per table. Every table was
     authored with the correct operation written first, so the answer sat at
     the top of every one of them — the same defect the Read 3 options had, and
     fixed the same way. Seeded so a re-render does not move the buttons under
     the student mid-question. */
  function optionsFor(p, rt, idx) {
    /* The salt is "|choose|" rather than anything more obvious because of what
       it produces across the CURRENT seven tables: the correct option lands at
       every one of the four positions. The first salt tried never put it first
       on any table — better than the authored order, where it was always
       first, but still a regularity a student could learn after six problems.
       This is mild overfitting to today's content and it will drift as
       problems are added; the shuffle is uniform either way, so the drift is
       harmless. What must never come back is an unshuffled list. */
    return MF.seededShuffle(rt.options || [], p.id + '|choose|' + idx);
  }

  function tableHtml(p, rt, idx) {
    var rows = rt.rows || [];
    var head =
      '<tr><th scope="col"><span class="visually-hidden">Quantity</span></th>' +
        '<th scope="col">' + esc(rt.givenHeading || 'What you were told') + '</th>' +
        '<th scope="col" class="rt-op"><span class="visually-hidden">Operation</span></th>' +
        '<th scope="col">' + esc(rt.targetHeading || 'What you need') + '</th></tr>';

    var body = rows.map(function (r, i) {
      var unknown = String(r.target) === '?';
      return '<tr data-row="' + i + '">' +
        '<th scope="row">' + esc(r.label) +
          (r.unit ? ' <span class="rt-unit">(' + esc(r.unit) + ')</span>' : '') + '</th>' +
        '<td class="rt-val rt-given"><span>' + esc(r.given) + '</span></td>' +
        '<td class="rt-op"><span class="rt-arrow" aria-hidden="true"></span>' +
          '<span class="visually-hidden rt-opsr">operation not found yet</span></td>' +
        '<td class="rt-val' + (unknown ? ' rt-unknown' : '') + '"><span>' + esc(r.target) + '</span></td>' +
      '</tr>';
    }).join('');

    /* data-i indexes the SHUFFLED list, so the click handler must read from
       the same shuffled array — not from rt.options. */
    var opts = optionsFor(p, rt, idx).map(function (o, i) {
      return '<button class="opt rt-opt" type="button" data-i="' + i + '" aria-pressed="false">' +
             esc(o.text) + '</button>';
    }).join('');

    return '' +
      '<div class="rtab" data-stage="ask" data-tab="' + idx + '">' +
        '<div class="yard-head">' +
          '<span class="eyebrow">' + esc(rt.title || 'The Ratio Table') + '</span>' +
          '<h3>' + esc(rt.heading || 'Set the two amounts side by side') + '</h3>' +
        '</div>' +

        '<p class="yard-say rt-say" role="status">' + esc(rt.prompt || '') + '</p>' +

        '<div class="rt-wrap">' +
          '<table class="rt-grid">' +
            '<caption class="visually-hidden">' + esc(rt.a11yDescription || '') + '</caption>' +
            '<thead>' + head + '</thead><tbody>' + body + '</tbody>' +
          '</table>' +
        '</div>' +

        '<p class="rt-ask">' + esc(rt.question || 'Which operation gets you across?') + '</p>' +
        '<div class="opt-row rt-opts">' + opts + '</div>' +
        '<div class="feedback rt-fb"></div>' +
        '<div class="rt-law" hidden></div>' +

        '<p class="hint-text"><strong>In words:</strong> ' + esc(rt.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function html(p) {
    var tables = tablesOf(p);
    if (!tables.length) return '';
    return tables.map(function (rt, i) { return tableHtml(p, rt, i); }).join('');
  }

  function wire(root, p, onDone) {
    var tables = tablesOf(p);
    if (!tables.length) return;
    var remaining = tables.length;

    root.querySelectorAll('.rtab').forEach(function (tab) {
      wireOne(tab, p, tables[+tab.getAttribute('data-tab')], +tab.getAttribute('data-tab'), function () {
        /* Every table has to be solved before the Plan phase is done. With two
           stalls, settling one and moving on would be exactly the half-answer
           the problem is about. */
        if (--remaining === 0 && onDone) onDone();
      });
    });
  }

  function wireOne(tab, p, rt, idx, onSettled) {
    var q = function (s) { return tab.querySelector(s); };
    var say = q('.rt-say'), fb = q('.rt-fb'), law = q('.rt-law');
    var shuffledOpts = optionsFor(p, rt, idx);
    var settled = false;

    tab.querySelectorAll('.rt-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (settled) return;
        var o = shuffledOpts[+btn.getAttribute('data-i')];
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
        // Scoped to THIS table — with two stalls on screen, disabling by
        // document would lock the other table's buttons before it was answered.
        tab.querySelectorAll('.rt-opt').forEach(function (b) { b.disabled = true; });

        // Write the operation into every row — the point is that it is the SAME one.
        tab.querySelectorAll('tbody tr').forEach(function (tr) {
          var a = tr.querySelector('.rt-arrow'), sr = tr.querySelector('.rt-opsr');
          if (a) a.textContent = o.text;
          if (sr) sr.textContent = 'same operation, ' + o.text;
        });

        tab.setAttribute('data-stage', 'applied');   // CSS sweeps the arrows
        say.innerHTML = esc(rt.settledSay || 'The same operation carries both rows across.');
        fb.innerHTML =
          '<div class="msg msg-go"><span class="ico" aria-hidden="true">✓</span><p>' +
          '<strong>That is the link.</strong> ' + esc(o.why || '') + '</p></div>';

        law.hidden = false;
        law.innerHTML =
          '<p class="rt-law-txt"><strong>' + esc(rt.law || 'Whatever you do to one row, you do to the other.') +
          '</strong></p>' +
          '<p class="rt-pending">' + esc(rt.pending ||
            'The missing amount stays a question mark on purpose — working it out is the next stop.') + '</p>';

        if (global.A11y && A11y.announce) {
          A11y.announce('Correct. ' + (o.text || '') + ' applies to both rows. ' + (rt.pending || ''));
        }
        if (onSettled) onSettled();
      });
    });
  }

  global.RatioModel = { applies: applies, html: html, wire: wire };
})(window);
