/* ============================================================
   The Model Yard — an interactive, animated picture of the problem.

   The student does the work in three moves:
     1. SPLIT  — cut the whole into equal parts (the denominator, made physical)
     2. MARK   — pick out the part(s) the problem talks about
     3. READ   — see what one part is worth, and what the parts total

   MULTI-GROUP MARKING (added for the quilt): when a problem gives more than
   one part — two fifths blue AND one quarter red — the student marks each
   colour in its own stage. This is the whole point of that problem: you
   cannot know the coloured total until you have added the two givens, so the
   yard makes the addition physical rather than stating its result.

   Prompts name the FRACTION, never the count. "Two fifths of the quilt is
   blue" makes the student work out that two fifths of twenty is eight;
   "tap 8 parts" would hand it over. For the same reason staged marking is
   confirmed by a button rather than auto-settling the moment the count is
   right — otherwise a student can tap one at a time and watch for the click.

   Animation rules, inherited from the accessibility spec:
     - Motion is decorative; every state is also in text and aria-pressed.
     - State is NEVER set by a transition. Fills animate on a separate
       overlay; the button's own state flips instantly.
     - prefers-reduced-motion removes stagger and sweep; the model still
       reads correctly frozen.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function barOf(p) {
    return p.signalBox && p.signalBox.barModel && p.signalBox.barModel.bars && p.signalBox.barModel.bars[0];
  }

  /** Stages to mark, in order. Empty means single-group behaviour. */
  function stagesOf(p) {
    var g = p.scene && p.scene.mode === 'unit' && p.scene.groups;
    if (!g) return [];
    var real = g.filter(function (x) { return x.key !== 'unknown'; });
    return real.length >= 2 ? real : [];
  }

  /* The Plan-phase model is chosen by SCHEMA, not one-size-fits-all. Splitting
     a whole into parts is the Part–Whole picture; a ratio needs two quantities
     scaling together, and a change needs one quantity at two moments with an
     event between. Each is claimed by the presence of its own schema key —
     ratioTable(s), changeTrain — and falls through to the Model Yard.

     ALL THREE BRANCHES MUST BE ADDED TOGETHER — html(), wire() AND applies().
     They dispatch separately, and each omission fails in its own silent way:
     missing from html() and the buttons have nothing to sit on; missing from
     wire() and the picture's buttons do nothing; missing from applies() and
     `phPlan` never asks for the picture at all, so the Plan phase renders
     without one and nothing anywhere reports it.

     This comment used to say "BOTH branches" and name only the first two. It
     was believed, CompareModel was added to those two, and the Compare Line's
     first problem shipped a Plan phase with no model. A wrong note about where
     the dispatches are is worse than no note. */
  function html(p) {
    /* PERCENT IS ASKED FIRST, and the order is deliberate. It dispatches on
       `surface`, not on `line`, so a percent problem still carries its real
       schema — a percent Compare problem would otherwise be caught by
       CompareModel below and draw the compare bars, and the surface would have
       no picture of its own. */
    if (global.PercentModel && PercentModel.applies(p)) return PercentModel.html(p);
    if (global.ChangeModel && ChangeModel.applies(p)) return ChangeModel.html(p);
    if (global.RatioModel && RatioModel.applies(p)) return RatioModel.html(p);
    if (global.CompareModel && CompareModel.applies(p)) return CompareModel.html(p);
    if (global.GroupsModel && GroupsModel.applies(p)) return GroupsModel.html(p);
    var bar = barOf(p);
    if (!bar) return '';
    var desc = p.signalBox.barModel.a11yDescription;
    var n = bar.segments;
    var stages = stagesOf(p);

    /* WHAT A PART IS WORTH IS REVEALED BY MARKING IT, NOT BEFORE.
       Cycle 6 blanked this value wherever it matched a step answer, to stop the
       Plan phase handing the answer over. The cost was a bar model with no
       numbers in it — and a bar model with no numbers is not a model, it is a
       row of empty boxes. Clicking a part and seeing what it is worth is the
       moment the whole-and-parts relationship becomes concrete; that is the
       station's entire job.

       So the value is rendered but hidden until the student marks the part.
       Nothing is pre-printed, nothing is given away for free, and the number
       appears as a consequence of the student's own action. The readout's
       "each part =" is gated the same way.

       ...AND IT MUST ALSO BE A VALUE THE PROBLEM GIVES. (2026-08-04, user-found,
       third recurrence of the Cycle 6 defect.) Revealing on interaction fixed
       WHEN the number appears; it did nothing about WHICH number. Every per-part
       value in this bank turns out to be DERIVED — 54 orders over 3 parts is 18,
       and the yard printed 18 next to ten visible parts, so the Engine Room's
       question ("how many orders in the whole day?") was one multiplication off
       the picture. Measured: 6 problems, 24 screens, by "value x parts",
       "value x marked" or "value x unmarked".

       This is `math-reviewer.md`'s standing rule, which the yard was breaking:
       THE PICTURE SHOWS WHAT IS GIVEN, NOT WHAT IS DERIVED.

       Why this is not Cycle 6 repeating: that fix blanked the value and left the
       yard with no numbers at all, which is why it was reversed after the user
       reported it three times. It is checked here rather than assumed — with
       derived values hidden, every one of the 24 screens still shows a given
       number, either `whole =` or `marked parts =`. Neither of those is on the
       path to an answer; both are printed in the problem. */
    function numOf(s) {
      if (s == null) return NaN;
      var t = String(s).replace(/[^0-9./]/g, '');
      if (t.indexOf('/') > 0) { var q = t.split('/'); return parseFloat(q[0]) / parseFloat(q[1]); }
      return parseFloat(t);
    }
    var givens = {};
    Object.keys((p.problem && p.problem.numbers) || {}).forEach(function (k) {
      givens[numOf(p.problem.numbers[k].value)] = 1;
    });
    var knowsPart = bar.segmentValue && bar.segmentValue !== '?' && givens[numOf(bar.segmentValue)];

    var cars = '';
    for (var i = 0; i < n; i++) {
      cars +=
        '<button class="car" type="button" data-i="' + i + '" aria-pressed="false" ' +
        'style="--car-i:' + i + '" ' +
        'aria-label="Part ' + (i + 1) + ' of ' + n + '. Not marked.">' +
          '<span class="car-fill" aria-hidden="true"></span>' +
          /* THE PART'S SHARE, WHEN ITS VALUE IS NOT OURS TO GIVE.
             Hiding derived values left the boxes blank, which is how the Cycle 6
             fix failed the first time — "a bar model with no numbers is not a
             model, it is a row of empty boxes." So a box with no given value
             shows what the part IS rather than what it is worth: split into
             four, each part is 1/4 of the whole.

             That is read off the picture, not computed from the problem, so it
             hands over nothing — and it is the Fraction Yard's own lesson made
             literal: the bottom number cuts, the top number counts. */
          '<span class="car-val">' + esc(knowsPart ? bar.segmentValue : ('1/' + n)) + '</span>' +
          // "of the whole" is said once in the readout, not twenty times in the bar.
          (knowsPart && bar.unit ? '<span class="car-unit">' + esc(bar.unit) + '</span>' : '') +
        '</button>';
    }

    /* "?" is a QUESTION, not a value, and it must not be printed where a value
       goes. Blanking segmentValue to stop the Plan phase leaking a step answer
       (Cycle 6) left the yard saying "each part = ? shots" and, on completion,
       "Each part is ? shots." — which reads as broken software rather than as
       something still to work out.

       So when a part's value is unknown the readout does not pretend to state
       it. Instead it shows what the problem GIVES: `markedTotal` is the amount
       the marked parts come to, and naming it turns the unknown into a real
       question — "three parts are 21 shots, so what is one part?" It is only
       set where that total is genuinely given; on problems where the marked
       parts ARE the answer (pw-soup-serving, pw-helmet-savings) it is absent
       and the yard simply says nothing about it. */
    var readout = stages.length
      ? stages.map(function (s) {
          return '<span class="ro-item"><span class="ro-dot g-' + esc(s.key) + '"></span>' +
                 esc(s.label) + ' <strong id="ro-' + esc(s.key) + '">0</strong></span>';
        }).join('') +
        '<span class="ro-item">left over <strong id="ro-rest">' + n + '</strong></span>'
      : /* The known whole stays on screen. It is printed on the whole-car
           before you split, and the whole-car is then hidden — so on a problem
           with no per-part value and no marked total (pw-helmet-savings,
           pw-soup-serving) the yard went completely numberless the moment the
           student split it, which is when they most need something to reason
           from. It is GIVEN in the problem, so showing it leaks nothing. */
        ((bar.knownTotal && bar.knownTotal !== '?')
          ? '<span class="ro-item">whole = <strong>' + esc(bar.knownTotal) + '</strong></span>' : '') +
        '<span class="ro-item"><strong id="ro-marked">0</strong> marked</span>' +
        '<span class="ro-item"><strong id="ro-rest">' + n + '</strong> not marked</span>' +
        (knowsPart
          ? '<span class="ro-item ro-part" hidden>each part = <strong>' +
            esc(bar.segmentValue) + (bar.unit ? ' ' + esc(bar.unit) : '') + '</strong></span>'
          /* Where the value is not ours to give, name the SHARE instead. Said
             once here rather than repeated in every box, and shown from the
             moment the bar is split, because it is true as soon as you cut it. */
          : '<span class="ro-item">each part = <strong>1/' + n + '</strong> of the whole</span>') +
        (bar.markedTotal
          ? '<span class="ro-item">marked parts = <strong>' + esc(bar.markedTotal) + '</strong></span>'
          : '');

    return '' +
      '<div class="yard" data-stage="whole">' +
        '<div class="yard-head">' +
          '<span class="eyebrow">The Model Yard</span>' +
          '<h3 id="yard-title">Make a picture of it</h3>' +
        '</div>' +

        '<p class="yard-say" id="yard-say" role="status">' +
          'This whole bar is <strong>' + esc(bar.label) + '</strong>' +
          (bar.knownTotal && bar.knownTotal !== '?' ? ' &mdash; ' + esc(bar.knownTotal) : '') +
          '. Split it into equal parts to get started.</p>' +

        '<div class="yard-track" aria-hidden="true"></div>' +
        '<div class="yard-train" id="yard-train">' +
          /* An unknown total is "?" — which, printed alone in the whole car,
             told the student nothing about what the bar even represents. Fall
             back to the bar's own label, the same way the say-line above
             already does. */
          '<div class="whole-car" id="whole-car">' +
            esc((bar.knownTotal && bar.knownTotal !== '?') ? bar.knownTotal : bar.label) + '</div>' +
          '<div class="cars" id="cars" hidden>' + cars + '</div>' +
        '</div>' +

        '<div class="yard-readout" id="yard-readout" hidden>' + readout + '</div>' +

        '<div class="btn-row">' +
          '<button class="btn" id="yard-split" type="button">Split into ' + n + ' equal parts</button>' +
          '<button class="btn" id="yard-confirm" type="button" hidden>Done &mdash; check these</button>' +
          '<button class="btn btn-secondary" id="yard-reset" type="button" hidden>Start the picture again</button>' +
        '</div>' +
        '<div class="feedback" role="status" id="yard-fb"></div>' +

        '<p class="hint-text"><strong>In words:</strong> ' + esc(desc) + '</p>' +
      '</div>';
  }

  /* Does ANY Plan-phase model claim this problem?

     stations.js used to decide this for itself, by testing for
     signalBox.barModel.bars[0] — which was true of every problem then written,
     including the ratio ones, because they all kept a bar. The first problem
     to carry a model and NO bar would have rendered an empty Plan phase with
     no error anywhere. Asking the model layer instead means a line that brings
     its own picture does not have to also carry a Part–Whole one to be seen. */
  /* THE THIRD DISPATCH. `phPlan` asks this before it asks for html(), so a
     model missing from here renders NOTHING and raises nothing — the picture
     simply is not there. The note above html() said "BOTH BRANCHES MUST BE
     ADDED IN PAIRS" and named html() and wire(); there are three, and the
     comment was wrong. CompareModel was added to the two the comment listed
     and the Compare Line's first problem rendered a Plan phase with no model
     (2026-08-04). VERIFICATION.md §24: the first content of a new shape tests
     the engine, and the defect is in the code that predates it. */
  function applies(p) {
    if (global.PercentModel && PercentModel.applies(p)) return true;
    if (global.ChangeModel && ChangeModel.applies(p)) return true;
    if (global.RatioModel && RatioModel.applies(p)) return true;
    if (global.CompareModel && CompareModel.applies(p)) return true;
    if (global.GroupsModel && GroupsModel.applies(p)) return true;
    return !!barOf(p);
  }

  function wire(root, p, onDone) {
    // Paired with the dispatch in html() — see the note there.
    if (global.PercentModel && PercentModel.applies(p)) return PercentModel.wire(root, p, onDone);
    if (global.ChangeModel && ChangeModel.applies(p)) return ChangeModel.wire(root, p, onDone);
    if (global.RatioModel && RatioModel.applies(p)) return RatioModel.wire(root, p, onDone);
    if (global.CompareModel && CompareModel.applies(p)) return CompareModel.wire(root, p, onDone);
    if (global.GroupsModel && GroupsModel.applies(p)) return GroupsModel.wire(root, p, onDone);
    var bar = barOf(p);
    if (!bar) return;
    var n = bar.segments;
    var stages = stagesOf(p);
    var target = typeof bar.marked === 'number' ? bar.marked : null;
    var q = function (s) { return root.querySelector(s); };
    var yard = q('.yard'), say = q('#yard-say'), fb = q('#yard-fb');
    var splitBtn = q('#yard-split'), resetBtn = q('#yard-reset'), okBtn = q('#yard-confirm');
    var stageIdx = 0, settled = false;

    function cars() { return root.querySelectorAll('.car'); }
    function live() { return root.querySelectorAll('.car[aria-pressed="true"]:not([data-locked])'); }
    function lockedCount(key) { return root.querySelectorAll('.car[data-group="' + key + '"]').length; }

    function refresh() {
      if (stages.length) {
        var used = 0;
        stages.forEach(function (s) {
          var c = lockedCount(s.key) || (stages[stageIdx] === s ? live().length : 0);
          var el = q('#ro-' + s.key); if (el) el.textContent = c;
          used += c;
        });
        q('#ro-rest').textContent = n - used;
      } else {
        var m = root.querySelectorAll('.car[aria-pressed="true"]').length;
        q('#ro-marked').textContent = m;
        q('#ro-rest').textContent = n - m;
      }
    }

    function askStage() {
      var s = stages[stageIdx];
      /* Tell the CSS which colour is being asked for. Without this the
         in-progress fill fell back to the LINE colour (red on Part–Whole), so
         the student was told "blue" and watched parts turn red — and then on
         the red stage nothing appeared to change. The colour you are marking
         with must match the colour you were asked for. */
      yard.setAttribute('data-active', s.key);
      say.innerHTML = '<strong>' + esc(s.as || '') + ' of ' + esc(bar.label) + ' is ' + esc(s.label) + '.</strong> ' +
        'Work out how many parts that is, and tap them.';
      okBtn.hidden = false;
      okBtn.textContent = 'Done with ' + s.label + ' →';
      var first = root.querySelector('.car:not([data-locked])');
      if (first) first.focus();
    }

    splitBtn.addEventListener('click', function () {
      yard.setAttribute('data-stage', 'split');
      q('#whole-car').hidden = true;
      q('#cars').hidden = false;
      q('#yard-readout').hidden = false;
      splitBtn.hidden = true;
      resetBtn.hidden = false;
      if (stages.length) { askStage(); }
      else {
        say.innerHTML = 'Now tap the parts that are <strong>' +
          esc(bar.markedLabel || 'the part in question') + '</strong>.';
        var first = root.querySelector('.car'); if (first) first.focus();
      }
      refresh();
    });

    resetBtn.addEventListener('click', function () {
      settled = false; stageIdx = 0;
      yard.setAttribute('data-stage', 'whole');
      q('#whole-car').hidden = false;
      q('#cars').hidden = true;
      q('#yard-readout').hidden = true;
      splitBtn.hidden = false;
      resetBtn.hidden = true;
      okBtn.hidden = true;
      fb.innerHTML = '';
      yard.removeAttribute('data-revealed');
      var rp = q('.ro-part'); if (rp) rp.hidden = true;
      [].forEach.call(cars(), function (c) {
        c.setAttribute('aria-pressed', 'false');
        c.removeAttribute('data-group');
        c.removeAttribute('data-locked');
        c.disabled = false;
        c.setAttribute('aria-label', c.getAttribute('aria-label').replace(/\. .*$/, '. Not marked.'));
      });
      say.innerHTML = 'Back to one whole. Split it again whenever you are ready.';
      splitBtn.focus();
    });

    q('#cars').addEventListener('click', function (e) {
      var c = e.target.closest('.car');
      if (!c || settled || c.hasAttribute('data-locked')) return;
      var on = c.getAttribute('aria-pressed') === 'true';
      c.setAttribute('aria-pressed', String(!on));      // instant, never animated
      var i = +c.getAttribute('data-i') + 1;
      /* The screen-reader label carries the revealed value too, or a student
         listening would be told "Marked" and never learn what the part is
         worth — the one thing marking it is for. */
      var worth = (!on && bar.segmentValue && bar.segmentValue !== '?')
        ? ' Worth ' + bar.segmentValue + (bar.unit ? ' ' + bar.unit : '') + '.' : '';
      c.setAttribute('aria-label', 'Part ' + i + ' of ' + n + '. ' + (on ? 'Not marked.' : 'Marked.') + worth);
      if (!on) {
        yard.setAttribute('data-revealed', '1');
        var roPart = q('.ro-part'); if (roPart) roPart.hidden = false;
      }
      refresh();

      if (stages.length || target === null) return;
      // single-group problems settle as soon as the picture is right
      if (root.querySelectorAll('.car[aria-pressed="true"]').length === target) finishSingle();
      else fb.innerHTML = '';
    });

    function finishSingle() {
      settled = true;
      yard.setAttribute('data-stage', 'done');
      var restN = n - target;
      var knows = bar.segmentValue && bar.segmentValue !== '?';
      var wholeKnown = bar.knownTotal && bar.knownTotal !== '?';
      var tail = knows
        ? ' Each part is ' + esc(bar.segmentValue) + (bar.unit ? ' ' + esc(bar.unit) : '') + '.'
        : (bar.markedTotal
            ? ' Those ' + target + ' parts together are ' + esc(bar.markedTotal) +
              ' &mdash; so what is <strong>one</strong> part worth? That is the next thing to work out.'
            : (wholeKnown
                ? ' The whole is ' + esc(bar.knownTotal) + ' split into ' + n +
                  ' equal parts &mdash; so what is <strong>one</strong> part worth? That is the next thing to work out.'
                : ' What one part is worth is the next thing to work out.'));
      fb.innerHTML =
        '<div class="msg msg-go"><span class="ico" aria-hidden="true">✓</span><p>' +
        '<strong>That is the picture.</strong> ' + target + ' of the ' + n + ' parts are ' +
        esc(bar.markedLabel || 'the part') + ', which leaves ' + restN + ' as ' +
        esc(bar.restLabel || 'the rest') + '.' + tail +
        '</p></div>';
      if (global.A11y && A11y.announce) A11y.announce('Picture complete.');
      if (onDone) onDone();
    }

    okBtn.addEventListener('click', function () {
      var s = stages[stageIdx];
      var picked = live();
      if (picked.length !== s.n) {
        fb.innerHTML =
          '<div class="msg msg-stop"><span class="ico" aria-hidden="true">→</span><p>' +
          '<strong>That is ' + picked.length + ' parts.</strong> ' +
          esc(s.as) + ' of ' + n + ' means splitting ' + n + ' into ' +
          esc((s.as || '/').split('/')[1] || '') + ' equal groups and taking ' +
          esc((s.as || '/').split('/')[0] || '') + ' of them. How many parts is that?' +
          '</p></div>';
        if (global.A11y && A11y.announce) A11y.announce('Not the right number of parts.');
        return;
      }
      // lock this colour in
      [].forEach.call(picked, function (c) {
        c.setAttribute('data-group', s.key);
        c.setAttribute('data-locked', '1');
        c.disabled = true;
      });
      fb.innerHTML = '';
      stageIdx++;
      refresh();

      if (stageIdx < stages.length) { askStage(); return; }

      // all colours placed — now make the addition explicit
      settled = true;
      yard.setAttribute('data-stage', 'done');
      yard.removeAttribute('data-active');
      okBtn.hidden = true;
      var used = stages.reduce(function (a, x) { return a + x.n; }, 0);
      var sumTxt = stages.map(function (x) { return x.n; }).join(' + ') + ' = ' + used;
      var restGroup = (p.scene.groups || []).filter(function (x) { return x.key === 'unknown'; })[0];
      [].forEach.call(root.querySelectorAll('.car:not([data-locked])'), function (c) {
        c.setAttribute('data-group', 'unknown');
        c.disabled = true;
      });
      say.innerHTML = 'Every part is accounted for.';
      fb.innerHTML =
        '<div class="msg msg-go"><span class="ico" aria-hidden="true">✓</span><p>' +
        '<strong>There is the addition.</strong> ' + sumTxt + ' of the ' + n + ' parts are spoken for, ' +
        'which leaves <strong>' + (n - used) + '</strong>' +
        (restGroup ? ' as ' + esc(restGroup.label) : '') + '. ' +
        'That is why you have to add the two fractions before you can find what is left.' +
        '</p></div>';
      if (global.A11y && A11y.announce) A11y.announce('Picture complete. ' + sumTxt + '.');
      if (onDone) onDone();
    });
  }

  global.Model = { html: html, wire: wire, applies: applies };
})(window);
