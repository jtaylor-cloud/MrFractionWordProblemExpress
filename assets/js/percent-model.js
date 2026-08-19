/* ============================================================
   The Percent model — a double number line.

   WHY IT DISPATCHES ON `surface`, NOT ON `line`.
   Every other Plan model belongs to one schema: the ratio table IS the Ratio
   Rail, the change train IS the Change Line. This one is not a schema at all.
   Percent is a way of WRITING a number, like a fraction or a decimal, and it
   can sit on top of any of the five situations — percent change is a Change
   story, percent comparison is a Compare story (`cp-hot-drinks` already), a
   percentage of a total is Part–Whole.

   So a problem opts in with `surface: "percent"` and keeps its real `line`.
   That is the whole hybrid decision recorded in ROADMAP.md §3: percent gets its
   own picture and its own front door on the map, and the Platform Check answer
   key is never touched, because structurally these problems are still whatever
   they always were. `applies()` checks the surface, and `model.js` asks this
   model FIRST — a percent problem on the Compare Line must draw the number line
   rather than the compare bars, or the surface has no picture of its own.

   WHAT THE STUDENT DOES: taps the amount that is 100%.

   That is this surface's version of the one decision each Plan model asks for —
   the ratio table's scale factor, the change train's operation, the compare
   bars' referent, the tray's repeated unit. "Twenty per cent more" is
   meaningless until you say more than WHAT, and every classic percent error is
   the same error: taking the percentage of the wrong thing. Reverse percent —
   "after a 20% rise it is £60, what was it before?" — is that error's purest
   form, because the tempting move takes 20% of the number you were handed
   instead of the number you are looking for.

   THE PICTURE STOPS BEFORE THE ARITHMETIC, like every model here. The line
   shows 0, the stated percentage and 100%; the unknown carries "?" and is never
   computed. The Plan phase runs BEFORE the Engine Room, and a model that fills
   that gap has done the student's work — recorded five times on this project.

   NOTHING IS AUTHORED THAT CAN BE DERIVED. The mark's position along the line
   is the percentage, so it comes from the token; an authored offset would be
   right for one number set and quietly wrong for the other three
   (VERIFICATION.md §33).
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function barOf(p) { return p && p.signalBox && p.signalBox.percentLine; }

  /** Opt-in by SURFACE, so a percent problem keeps its structural line. */
  function applies(p) { return !!(p && p.surface === 'percent' && barOf(p)); }

  /* Same parse as the other models, and it exists for the same reason:
     parseFloat("2/3") is 2. Percent problems carry values like "12.5" and
     "1/4" in the same slot, so this has to cope with both. */
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

  /* WHERE THE MARK SITS IS NOT ALWAYS A PERCENTAGE THE STORY STATES.
     On a percent COMPARISON the two are the same thing: "20% more hot drinks
     than cold" puts the mark at 20 and the story says 20. On a percent CHANGE
     they part company. "Saturdays are busier by 20%" means last Saturday is
     120% of the old one, and 120 is where the known amount has to be drawn —
     put it at 20 and the picture says the crowd shrank.

     So a problem may state the mark as `percentAt` instead of naming a token.
     It is authored as a {{token}} filled from the number set, never as a
     literal: the rise varies per set, so an authored 120 would be right for
     one set and silently wrong for the other three (VERIFICATION.md §33).

     Exactly one of `percentToken` and `percentAt`, enforced by the validator —
     two would mean the mark's position is decided by which branch happens to be
     written first, which is a picture chosen by accident. */
  function percentOf(p, pl) {
    if (pl.percentAt != null && String(pl.percentAt) !== '') return numOf(pl.percentAt);
    return valueOf(p, pl.percentToken);
  }

  /** What the percent axis PRINTS at the mark. Same source as its position. */
  function percentSaid(p, pl) {
    if (pl.percentAt != null && String(pl.percentAt) !== '') return String(pl.percentAt) + '%';
    var n = p.problem && p.problem.numbers && p.problem.numbers[pl.percentToken];
    return n ? n.value + '%' : '';
  }

  function labelOf(p, token) {
    var n = p.problem && p.problem.numbers && p.problem.numbers[token];
    if (!n) return '';
    return n.value + (n.unit ? ' ' + n.unit : '');
  }

  /* THREE SHAPES, ONE FOR EACH THING THAT CAN BE MISSING — and which one is
     missing is the whole lesson, exactly as on Compare and Equal Groups.

       part     the percentage and the whole are given; how much is that?
       whole    the percentage and the part are given — REVERSE PERCENT, the
                hard one, and the reason this surface exists
       percent  both amounts given; what percentage is it?

     The mark sits at `pct` along the line in every case. Where the "?" goes is
     what changes, and it is the only thing that changes. */
  function geometry(p, pl) {
    var pct = percentOf(p, pl);
    if (!isFinite(pct) || pct <= 0) return null;
    /* Above ~200% the mark runs off the end of a line drawn to 100%, and a
       picture that cannot show its own mark is worse than none. Percent change
       problems stay well inside this; a guard rather than a limit. */
    if (pct > 200) return null;
    var unknown = pl.unknownIs;                       // 'part' | 'whole' | 'percent'
    if (['part', 'whole', 'percent'].indexOf(unknown) === -1) return null;
    return {
      pct: pct,
      unknown: unknown,
      /* The line is drawn to whichever is further along — 100%, or the mark if
         the percentage exceeds it. Otherwise a 130% mark would sit outside the
         axis it is measured on. */
      span: Math.max(100, pct)
    };
  }

  function html(p) {
    var pl = barOf(p);
    if (!pl) return '';
    var g = geometry(p, pl);
    if (!g) return '';

    var markPct = (g.pct / g.span) * 100;
    var hundredPct = (100 / g.span) * 100;

    var partLabel  = g.unknown === 'part'  ? '?' : labelOf(p, pl.partToken);
    var wholeLabel = g.unknown === 'whole' ? '?' : labelOf(p, pl.wholeToken);
    var pctLabel   = g.unknown === 'percent' ? '?' : percentSaid(p, pl);

    /* A LABEL AT EITHER END OF THE LINE IS ANCHORED, NOT CENTRED, and this is a
       correctness fix rather than a tidiness one.

       Every tick was `transform: translateX(-50%)`, which centres the label on
       its own point. That is right in the middle of the line and wrong at the
       ends: a label at 100% hangs half its width past the axis. Measured at a
       772px card, "660 passengers" ran from 690 to 821 — FIFTY PIXELS PAST THE
       EDGE OF THE CARD IT SITS IN, and it is the amount the student was given.
       cp-hot-drinks has always done the same with "40 cold drinks", so this is
       the shipped model rather than the new problem (VERIFICATION.md §14 — fix
       the class). Both ends are handled, not only the one that was caught, and
       the left is included even though at today's padding it happens to fit
       (§32: enumerate the complement rather than the instance).

       The STALK still lands on the point. Only the label is anchored, so the
       picture's claim — that this label belongs to this place on the axis — is
       untouched; see the `is-edge` rules in app.css. */
    function edge(pos) {
      if (pos >= 99.5) return ' is-edge-r';
      if (pos <= 0.5) return ' is-edge-l';
      return '';
    }

    /* The two axes. Amounts above, percents below, sharing one line — which is
       the entire idea: the same journey measured two ways, so "20% of it" and
       "that many pounds" are visibly the same place. */
    var line =
      '<div class="pcl-line">' +
        '<div class="pcl-axis pcl-amounts">' +
          '<span class="pcl-tick is-edge-l" style="left:0%"><em>0</em></span>' +
          '<span class="pcl-tick pcl-mark' + (g.unknown === 'part' ? ' is-unknown' : '') + edge(markPct) +
            '" style="left:' + markPct.toFixed(2) + '%"><em>' + esc(partLabel) + '</em></span>' +
          '<span class="pcl-tick pcl-end' + (g.unknown === 'whole' ? ' is-unknown' : '') + edge(hundredPct) +
            '" style="left:' + hundredPct.toFixed(2) + '%"><em>' + esc(wholeLabel) + '</em></span>' +
        '</div>' +
        '<div class="pcl-rule" aria-hidden="true">' +
          '<span class="pcl-fill" style="width:' + markPct.toFixed(2) + '%"></span>' +
        '</div>' +
        '<div class="pcl-axis pcl-percents">' +
          '<span class="pcl-tick is-edge-l" style="left:0%"><em>0%</em></span>' +
          '<span class="pcl-tick pcl-mark' + (g.unknown === 'percent' ? ' is-unknown' : '') + edge(markPct) +
            '" style="left:' + markPct.toFixed(2) + '%"><em>' + esc(pctLabel) + '</em></span>' +
          '<span class="pcl-tick pcl-end' + edge(hundredPct) +
            '" style="left:' + hundredPct.toFixed(2) + '%"><em>100%</em></span>' +
        '</div>' +
      '</div>';

    /* SHUFFLED, SEEDED — because the picks were rendered in authored order and
       the authored order put the correct one first. That is this project's
       most-repeated authoring bias: every ratio table shipped with the answer
       at the top, then all twenty hub taps did, and `teacher.md` had already
       written it down ("You will write the correct option first. It happened in
       all seven problems.") before it happened again.

       Same salt grammar and the same one implementation as Read 3, the Ticket
       Booth and the Ratio Table — `MF.seededShuffle`, keyed to the problem id,
       so the order is stable across a re-render and nothing moves under the
       student mid-question. Wrong-pick copy is keyed by `key` and the correct
       pick is `base`, so neither depends on position. */
    var choices = MF.seededShuffle(pl.choices || [], p.id + '|pcl|').map(function (c) {
      return '<button class="pcl-pick" type="button" data-key="' + esc(c.key) + '" aria-pressed="false" ' +
        'aria-label="' + esc(c.label + ', ' + (c.said || '') + '. Tap if this is the amount that counts as 100 per cent.') + '">' +
        '<span class="pcl-pick-name">' + esc(c.label) + '</span>' +
        '<span class="pcl-pick-val">' + esc(c.said || '') + '</span>' +
      '</button>';
    }).join('');

    return '' +
      '<div class="model pctline" data-mode="' + esc(g.unknown) + '">' +
        '<div class="section-head">' +
          '<span class="eyebrow">' + esc(pl.title || 'Per hundred') + '</span>' +
          '<h3>' + esc(pl.heading || 'The same journey, measured two ways') + '</h3>' +
        '</div>' +
        line +
        '<p class="yard-say pcl-say" role="status">' + esc(pl.prompt ||
          'Which amount is the whole — the one that counts as 100%?') + '</p>' +
        '<div class="pcl-picks">' + choices + '</div>' +
        '<div class="pcl-settled" id="pcl-settled" hidden>' +
          '<span class="pcl-settled-label">' + esc(pl.settledLabel || 'so the question is') + ' <strong>' +
          esc(pl.questionLabel || '?') + '</strong></span>' +
        '</div>' +
        '<div class="feedback" role="status" id="pcl-fb"></div>' +
        '<p class="hint-text"><strong>In words:</strong> ' + esc(pl.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function wire(root, p, onDone) {
    var pl = barOf(p);
    if (!pl) return;
    var wrap = root.querySelector('.pctline');
    if (!wrap) return;
    var done = false;

    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-key]');
      if (!b || done || b.disabled) return;
      var key = b.getAttribute('data-key');
      var fb = wrap.querySelector('#pcl-fb');

      if (key !== pl.base) {
        /* Choosing the wrong 100% is THE percent error, so a wrong pick is
           answered in terms of what the story says and never marked. */
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        var wrong = (pl.whyWrong && pl.whyWrong[key]) ||
          'Read it again and ask which amount the percentage is being taken OF.';
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
      wrap.setAttribute('data-settled', 'yes');
      wrap.querySelector('#pcl-settled').hidden = false;
      fb.innerHTML = '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span>' +
                     '<p><strong>Yes.</strong> ' + esc(pl.why || '') + '</p></div>';
      fb.setAttribute('tabindex', '-1'); fb.focus();
      if (global.A11y && A11y.announce) A11y.announce('Correct. ' + (pl.why || ''));
      if (onDone) onDone();
    });
  }

  global.PercentModel = { applies: applies, html: html, wire: wire };
})(window);
