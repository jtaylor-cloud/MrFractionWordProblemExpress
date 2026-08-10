/* ============================================================
   The Learning Hub, as a journey rather than a page.

   WHY THIS FILE EXISTS. A hub used to render as one long scroll: every section
   concatenated, then the checks, then the quiz. For a site whose students "may
   have a reading-related disability that makes a dense paragraph a barrier
   BEFORE any math begins" (PEDAGOGY.md §1), the single longest wall of text on
   the site was the page we point them at to learn how to read. The user put it
   plainly: we already ask them to read a lot, so a hub needs a section per page,
   buttons, animation, and something to do on every topic.

   WHAT A PAGED HUB IS
     - `pages[]`  one topic per screen, with its own diagram and its own tap.
     - a RAIL across the top, showing every page at once and letting a student
       jump. They can see the whole shape of what they are being taught, which
       is the thing a scroll hides.
     - `checklist`  the five questions AS A WHOLE, on their own page and
       reachable from every page. This hub is what we point students at to learn
       the process, so the process has to be visible as one object.
     - `vocab`      the words, in the three tiers of PEDAGOGY.md §2.2.

   BACKWARDS COMPATIBLE ON PURPOSE. A hub with `pages` renders here; a hub with
   only `sections` keeps the old renderer in app.js. `fraction-yard` is still on
   the old shape and must keep working — migrating two hubs at once would mean
   neither is testable against the other.

   NOTHING HERE IS GATED. A student may jump to any page, in any order, at any
   time, and nothing is scored. Learning Hubs are never gated and never framed
   as remedial — that is a locked decision, and the rail is a map, not a track.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function applies(h) { return !!(h && h.pages && h.pages.length); }

  /* ---------- the animated shape of each line ----------
     Small, and deliberately the SAME IDEA as that line's Plan model rather than
     a decorative picture: a student who meets the tray here should recognise it
     at the Drafting Table. They reuse the `rsc-` and `eg-` animation classes for
     the same reason every scene library does — one vocabulary, one set of
     reduced-motion poses, already contrast-checked. */
  var INK = '#241B10', CREAM = '#FDF8F0', MID = '#EFE4D0';

  function svg(inner, label) {
    return '<div class="hub-art" role="img" aria-label="' + esc(label) + '">' +
             '<svg viewBox="0 0 260 92" xmlns="http://www.w3.org/2000/svg" class="rsc-svg" aria-hidden="true">' +
               inner +
             '</svg></div>';
  }

  var ART = {
    /* One amount, at two moments, with the event between them. */
    change: function () {
      var c = 'var(--line-change)';
      return svg(
        '<rect x="10" y="26" width="86" height="26" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<text x="10" y="70" font-size="12" fill="' + INK + '" font-family="inherit">start</text>' +
        '<g class="rsc-bounce"><path d="M108 39 H148 M138 31 L148 39 L138 47" fill="none" stroke="' + INK +
          '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<text x="106" y="24" font-size="12" fill="' + INK + '" font-family="inherit">what happened</text>' +
        '<rect x="160" y="26" width="86" height="26" rx="4" fill="none" stroke="' + INK +
          '" stroke-width="2.4" stroke-dasharray="5 4"/>' +
        '<text x="160" y="70" font-size="12" fill="' + INK + '" font-family="inherit">result</text>',
        'One amount at two moments, with an arrow for the event between them.');
    },
    /* Two amounts side by side, and the gap between them. */
    compare: function () {
      var c = 'var(--line-compare)';
      return svg(
        '<rect x="10" y="18" width="150" height="22" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="10" y="52" width="96" height="22" rx="4" fill="' + c + '" stroke="' + INK +
          '" stroke-width="2.4" opacity=".55"/>' +
        '<g class="rsc-bounce"><path d="M110 52 V74 M110 63 H158 M150 57 L158 63 L150 69" fill="none" stroke="' + INK +
          '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<text x="166" y="67" font-size="12" fill="' + INK + '" font-family="inherit">the gap</text>',
        'Two bars of different lengths, one above the other, with the gap between their ends marked.');
    },
    /* The same amount, laid down again and again, building a total. */
    groups: function () {
      var c = 'var(--line-groups)', s = '';
      for (var i = 0; i < 4; i++) {
        s += '<rect class="eg-box" style="--eg-i:' + i + '" x="' + (10 + i * 58) + '" y="20" width="50" height="26" rx="4" fill="' + c +
             '" stroke="' + INK + '" stroke-width="2.4"/>';
      }
      s += '<path d="M10 56 V64 H244 V56" fill="none" stroke="' + c + '" stroke-width="3"/>' +
           '<text x="104" y="82" font-size="12" fill="' + INK + '" font-family="inherit">the total</text>';
      return svg(s, 'Four identical boxes in a row with a bracket underneath spanning all of them.');
    },
    /* A pairing that holds at any size. */
    ratio: function () {
      var c = 'var(--line-ratio)';
      return svg(
        '<rect x="10" y="16" width="44" height="22" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="10" y="50" width="66" height="22" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4" opacity=".6"/>' +
        '<g class="rsc-bounce">' +
          '<rect x="132" y="16" width="88" height="22" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4"/>' +
          '<rect x="132" y="50" width="132" height="22" rx="4" fill="' + c + '" stroke="' + INK + '" stroke-width="2.4" opacity=".6"/>' +
        '</g>' +
        '<text x="84" y="34" font-size="14" fill="' + INK + '" font-family="inherit">&times;2</text>',
        'A short pair of bars and the same pair drawn twice as long, keeping the same proportion.');
    },
    /* ---------- percent ----------
       FOUR DIAGRAMS FOR A SURFACE, NOT A SIXTH LINE. The percent hub reuses
       `change`, `compare` and `partwhole` above for its three sub-type pages,
       which is the argument made in pictures: the same five shapes, with a per
       cent sign laid over them. These four are for the ideas percent adds.

       `percentline` is deliberately the SAME PICTURE as `percent-model.js`
       draws at the Drafting Table — amounts above, percents below, sharing one
       axis — for the reason every art here is its line's Plan model: a student
       who meets it in the hub should recognise it inside a trip. */

    /* Per hundred, literally: a hundred cells, twenty-five of them shaded.

       SHADED BY COLUMN, NOT BY INDEX, and that is not a detail. Filling the
       first twenty-five cells in reading order leaves an L — a whole row plus
       part of the next — which reads as "some of them" rather than as a
       quarter. Five columns of five is a clean block you can see is a quarter
       of the whole without counting anything, which is what the picture is for.

       It also gives the outline something to enclose. The first version of this
       art carried an `rsc-bounce` group holding two paths at stroke-width 0 and
       opacity 0 — left over from an earlier idea, invisible, and counted by
       every animation check as a moving element. An animated nothing passes a
       count and moves no pixels. */
    percenthundred: function () {
      var c = 'var(--line-percent)', s = '';
      for (var r = 0; r < 5; r++) {
        for (var i = 0; i < 20; i++) {
          s += '<rect x="' + (10 + i * 11) + '" y="' + (10 + r * 11) + '" width="9" height="9" rx="1.5" fill="' +
               (i < 5 ? c : CREAM) + '" stroke="' + INK + '" stroke-width="1"/>';
        }
      }
      s += '<g class="rsc-bounce"><rect x="7" y="7" width="60" height="60" rx="3" fill="none" stroke="' + INK +
           '" stroke-width="2.4" stroke-dasharray="5 4"/></g>';
      s += '<text x="10" y="84" font-size="12" fill="' + INK + '" font-family="inherit">' +
           'a hundred cells &mdash; twenty-five of them is 25%</text>';
      return svg(s, 'A block of one hundred small cells in five rows of twenty, with a square of twenty-five of them shaded and outlined, showing what twenty-five per cent means.');
    },

    /* The double number line: amounts above, percents below, one shared axis. */
    percentline: function () {
      var c = 'var(--line-percent)';
      return svg(
        '<text x="10" y="18" font-size="12" fill="' + INK + '" font-family="inherit">0</text>' +
        '<text x="96" y="18" font-size="12" fill="' + INK + '" font-family="inherit">?</text>' +
        '<text x="196" y="18" font-size="12" fill="' + INK + '" font-family="inherit">the whole</text>' +
        '<rect x="10" y="26" width="236" height="12" rx="3" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
        '<rect x="12" y="28" width="86" height="8" fill="' + c + '" opacity=".55"/>' +
        '<g class="rsc-bounce"><path d="M98 22 V42" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/></g>' +
        '<text x="10" y="56" font-size="12" fill="' + INK + '" font-family="inherit">0%</text>' +
        '<text x="86" y="56" font-size="12" fill="' + INK + '" font-family="inherit">35%</text>' +
        '<text x="212" y="56" font-size="12" fill="' + INK + '" font-family="inherit">100%</text>' +
        '<text x="10" y="80" font-size="12" fill="' + INK + '" font-family="inherit">' +
          'the same journey, measured two ways</text>',
        'A double number line. Amounts along the top, percentages along the bottom, sharing one axis, with a mark part way along.');
    },

    /* Reverse percent: the amount you were GIVEN sits past the hundred. */
    percentreverse: function () {
      var c = 'var(--line-percent)';
      return svg(
        '<text x="10" y="18" font-size="12" fill="' + INK + '" font-family="inherit">0</text>' +
        '<text x="150" y="18" font-size="12" fill="' + INK + '" font-family="inherit">?</text>' +
        '<text x="196" y="18" font-size="12" fill="' + INK + '" font-family="inherit">you were told this</text>' +
        '<rect x="10" y="26" width="236" height="12" rx="3" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
        '<rect x="12" y="28" width="232" height="8" fill="' + c + '" opacity=".55"/>' +
        '<path d="M158 22 V42" stroke="' + INK + '" stroke-width="2.4" stroke-dasharray="4 3"/>' +
        '<g class="rsc-bounce"><path d="M246 22 V42" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/></g>' +
        '<text x="10" y="56" font-size="12" fill="' + INK + '" font-family="inherit">0%</text>' +
        '<text x="140" y="56" font-size="12" fill="' + INK + '" font-family="inherit">100%</text>' +
        '<text x="206" y="56" font-size="12" fill="' + INK + '" font-family="inherit">120%</text>' +
        '<text x="10" y="80" font-size="12" fill="' + INK + '" font-family="inherit">' +
          'the hundred per cent is the thing you are looking for</text>',
        'A double number line where the amount you were given sits past the hundred per cent mark, and the hundred per cent itself is unknown.');
    },

    /* Percent sitting ON TOP of the five, which is the hub's whole thesis. */
    percentover: function () {
      var c = 'var(--line-percent)', s = '';
      var cols = ['var(--line-change)', 'var(--line-compare)', 'var(--line-groups)',
                  'var(--line-ratio)', 'var(--line-partwhole)'];
      cols.forEach(function (col, i) {
        s += '<rect x="' + (12 + i * 48) + '" y="52" width="40" height="22" rx="4" fill="' + col +
             '" stroke="' + INK + '" stroke-width="2"/>';
      });
      s += '<g class="rsc-bounce"><rect x="12" y="18" width="232" height="22" rx="6" fill="' + c +
           '" stroke="' + INK + '" stroke-width="2.4"/>' +
           '<text x="104" y="34" font-size="13" fill="' + CREAM + '" font-family="inherit">per cent</text></g>';
      s += '<path d="M40 40 V50 M88 40 V50 M136 40 V50 M184 40 V50 M232 40 V50" stroke="' + INK +
           '" stroke-width="1.8" stroke-dasharray="3 3"/>';
      s += '<text x="10" y="88" font-size="12" fill="' + INK + '" font-family="inherit">' +
           'one band, sitting on top of any of the five</text>';
      return svg(s, 'A band labelled per cent lying across the top of five separate coloured blocks, one for each of the five situations, joined to them by dotted lines.');
    },

    /* One whole, cut into shares that account for all of it. */
    partwhole: function () {
      var c = 'var(--line-partwhole)';
      return svg(
        '<rect x="10" y="24" width="236" height="30" rx="4" fill="none" stroke="' + INK + '" stroke-width="2.6"/>' +
        '<rect x="12" y="26" width="96" height="26" fill="' + c + '"/>' +
        '<rect x="110" y="26" width="64" height="26" fill="' + c + '" opacity=".55"/>' +
        '<path d="M108 22 V56 M176 22 V56" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<text x="10" y="74" font-size="12" fill="' + INK + '" font-family="inherit">part + part + part = the whole</text>',
        'One long bar divided into three unequal named parts.');
    }
  };

  /* ---------- the checklist, as one object ----------
     Built from `stations.js`'s own CHECK if it is loaded, so the hub cannot
     drift from the questions the trip actually asks. That drift is the whole
     risk of teaching a process on one screen and running it on another. */
  function checklistHTML(cl) {
    var rows = (cl.questions || []).map(function (q, i) {
      return '<li class="hub-cl-row" style="--cl-i:' + i + '">' +
        '<span class="hub-cl-n" aria-hidden="true">' + (i + 1) + '</span>' +
        '<div><h4>' + esc(q.label) + '</h4><p>' + esc(q.ask) + '</p>' +
        '<p class="hub-cl-tell"><strong>What it tells you:</strong> ' + esc(q.tells) + '</p></div></li>';
    }).join('');
    return '<ol class="hub-checklist">' + rows + '</ol>' +
      (cl.note ? '<p class="hub-note">' + cl.note + '</p>' : '');
  }

  /* ---------- vocabulary ----------
     Three tiers, and the tier is DATA. Tier 3 is hazard copy that quotes the
     keyword rules in order to refute them, so it will trip the keyword greps —
     the exemption is this tag, never a reading of intent (VERIFICATION.md §30).
     Widening the exemption is the failure; tagging the section is the fix. */
  /* `only` names a single tier, so a hub can give each tier its own page rather
     than stacking all three on one screen. Passing nothing renders the lot,
     which is what a short hub would want. */
  function vocabHTML(v, only) {
    return (v.tiers || []).filter(function (t) {
      return !only || t.tier === only;
    }).map(function (t) {
      var words = (t.words || []).map(function (w, i) {
        return '<li class="hub-word"><button class="hub-word-btn" type="button" aria-expanded="false">' +
          '<span class="hub-word-w">' + esc(w.word) + '</span>' +
          '<span class="hub-word-hint">' + esc(t.badge) + '</span></button>' +
          '<div class="hub-word-body" hidden><p>' + esc(w.means) + '</p>' +
          (w.examples || []).map(function (ex) {
            return '<p class="hub-word-ex">' + ex + '</p>';
          }).join('') + '</div></li>';
      }).join('');
      return '<section class="hub-tier" data-tier="' + esc(t.tier) + '">' +
        '<h4>' + esc(t.title) + '</h4><p>' + t.note + '</p>' +
        '<ul class="hub-words">' + words + '</ul></section>';
    }).join('');
  }

  function msg(kind, ico, body) {
    return '<div class="msg msg-' + kind + '"><span class="ico" aria-hidden="true">' + ico + '</span><p>' + body + '</p></div>';
  }

  /* ---------- The Shunting Yard ----------
     Factors and multiples LISTED rather than guessed at. Students were expected
     to find a common denominator with no way to see what 5 and 4 have in common;
     this shows both lists and highlights the overlap, which is the whole idea
     made visible.

     MOVED HERE FROM app.js 2026-08-09, when `fraction-yard` became a paged hub.
     It is exported as `Hub.tool` and the old single-page renderer now calls the
     same code, so there is one implementation rather than a copy on each path —
     a second copy of a teaching tool is a second thing to fix when it is wrong. */
  var TOOL = {
    html: function () {
      return '<div class="card" id="fx">' +
          '<span class="eyebrow">Try it</span>' +
          '<h3>The Shunting Yard</h3>' +
          '<p>Put in the two bottom numbers and see what they share.</p>' +
          '<div class="inline-fields">' +
            '<div class="field"><label for="fxa">First number</label>' +
              '<input type="number" id="fxa" value="5" min="1" max="144"></div>' +
            '<div class="field"><label for="fxb">Second number</label>' +
              '<input type="number" id="fxb" value="4" min="1" max="144"></div>' +
          '</div>' +
          '<div id="fxout" role="status"></div>' +
        '</div>';
    },
    wire: function (node) {
      var A = node.querySelector('#fxa'), B = node.querySelector('#fxb'), OUT = node.querySelector('#fxout');
      if (!A || !B || !OUT) return;
      function factors(n) { var o = []; for (var d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; }
      function gcf(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
      function chips(list, shared, hi) {
        return list.map(function (v) {
          var on = shared.indexOf(v) !== -1;
          return '<span class="chip' + (on ? ' is-shared' : '') + (v === hi ? ' is-best' : '') + '">' + v + '</span>';
        }).join('');
      }
      function draw() {
        var a = Math.max(1, Math.min(144, parseInt(A.value, 10) || 1));
        var b = Math.max(1, Math.min(144, parseInt(B.value, 10) || 1));
        var fa = factors(a), fb = factors(b);
        var shared = fa.filter(function (v) { return fb.indexOf(v) !== -1; });
        var g = gcf(a, b), l = a * b / g;
        /* Count each row up to the LCM itself, so the number the tool names is
           always visible in both lists. A fixed 12 terms hid it whenever the LCM
           was large — 7 and 13 meet at 91, which a 12-term row never reaches, so
           the answer appeared out of nowhere. */
        var CAP = 24;
        var stepsA = Math.min(CAP, Math.max(4, l / a)), stepsB = Math.min(CAP, Math.max(4, l / b));
        var ma = [], mb = [], i;
        for (i = 1; i <= stepsA; i++) ma.push(a * i);
        for (i = 1; i <= stepsB; i++) mb.push(b * i);
        var sharedM = ma.filter(function (v) { return mb.indexOf(v) !== -1; });
        var truncated = (l / a > CAP) || (l / b > CAP);
        OUT.innerHTML =
          '<h4 class="fx-h">What divides into them &mdash; for simplifying</h4>' +
          '<p class="fx-row"><span class="fx-lab">' + a + '</span>' + chips(fa, shared, g) + '</p>' +
          '<p class="fx-row"><span class="fx-lab">' + b + '</span>' + chips(fb, shared, g) + '</p>' +
          msg('go', '&#10003;', '<strong>GCF = ' + g + '.</strong> ' +
            (g === 1
              ? 'They share nothing but 1, so a fraction with these numbers is already as simple as it gets.'
              : 'Divide top and bottom by ' + g + ' to write the fraction more simply.')) +
          '<h4 class="fx-h">What they both count up to &mdash; for adding</h4>' +
          '<p class="fx-row"><span class="fx-lab">' + a + 's</span>' + chips(ma, sharedM, l) + '</p>' +
          '<p class="fx-row"><span class="fx-lab">' + b + 's</span>' + chips(mb, sharedM, l) + '</p>' +
          msg('go', '&#10003;', '<strong>LCD = ' + l + '.</strong> Rewrite both fractions in ' + l +
            'ths and then you can add them: ' + a + ' &times; ' + (l / a) + ' = ' + l +
            ', and ' + b + ' &times; ' + (l / b) + ' = ' + l + '.' +
            (truncated ? ' <em>These two take a long way to meet &mdash; the lists above are cut short, ' +
              'but ' + l + ' is where they land.</em>' : ''));
      }
      A.addEventListener('input', draw);
      B.addEventListener('input', draw);
      draw();
    }
  };

  /* Free-text self-checks. Nothing is scored and nothing is gated — a blank box
     stays blank rather than being marked wrong, because a student who skips one
     has not failed anything. */
  function checksHTML(list) {
    return (list || []).map(function (c, i) {
      return '<div class="field"><label for="hc' + i + '">' + esc(c.q) + '</label>' +
        '<input type="text" id="hc' + i + '" data-ans="' + esc(c.a) + '">' +
        '<div class="feedback" role="status" id="hcf' + i + '"></div></div>';
    }).join('') +
    '<div class="btn-row"><button class="btn" id="hcheckbtn" type="button">Check these</button></div>';
  }

  function wireChecks(node) {
    var btn = node.querySelector('#hcheckbtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var ins = node.querySelectorAll('[data-ans]');
      for (var i = 0; i < ins.length; i++) {
        var fb = node.querySelector('#hcf' + i);
        var res = global.MF.checkAnswer(ins[i].value, { exact: ins[i].getAttribute('data-ans') });
        fb.innerHTML = ins[i].value.trim()
          ? (res.ok ? msg('go', '&#10003;', 'Yes.') : msg('caution', '&rarr;', 'Not yet &mdash; have another look back through the pages.'))
          : '';
      }
      if (global.A11y && A11y.announce) A11y.announce('Checked.');
    });
  }

  /* MR FRACTION WALKS THE HUB.
     He used to sit once in the card header, in the same pose, on every page —
     which made a nine-page journey feel like one page with the content swapped
     underneath. Now each page gets him in a different VIEW and a different
     PLACE, so turning a page moves him: he is ahead of you on one, watching from
     the far side on the next, walking away on the one after.

     The two cycles are deliberately different lengths — 4 poses against 3
     positions — so the pairing does not repeat until page 12, and no hub on the
     site is that long. A single cycle would have him back in the same pose AND
     the same corner every fourth page, which is exactly the sameness this is
     meant to break.

     Derived from the page index, never authored: a hub author should not have to
     think about where he stands, and a hub that gains a page should not need its
     art re-assigned. */
  var POSES = ['Conductor_Mr_Fraction_(Front).png',
               'Conductor_Mr_Fraction_(Right_Side).png',
               'Conductor_Mr_Fraction_(Back).png',
               'Conductor_Mr_Fraction_(Left_Side).png'];
  /* ALL DOWN THE LEFT, at three heights. He was hard to see on the right — the
     eye finishes a line of text there and moves on — and the right is also
     where the diagrams and the rail sit, so he kept landing on top of them.
     The left margin is empty on every page, so it is both the visible side and
     the safe one. What varies now is how far down the page he stands. */
  var SPOTS = ['high', 'mid', 'low'];

  function conductor(i) {
    return '<img class="hub-mf" data-spot="' + SPOTS[i % SPOTS.length] + '" ' +
      'src="assets/art/' + POSES[i % POSES.length] + '" ' +
      'alt="" aria-hidden="true" loading="lazy" decoding="async">';
  }

  function pageBody(h, p) {
    var s = '';
    if (p.art && ART[p.art]) s += ART[p.art]();
    if (p.body) s += p.body;
    if (p.kind === 'checklist' && h.checklist) s += checklistHTML(h.checklist);
    if (p.kind === 'vocab' && h.vocab) s += vocabHTML(h.vocab, p.tier);
    if (p.kind === 'tool') s += TOOL.html();
    if (p.kind === 'checks' && h.checks) s += checksHTML(h.checks);
    if (p.tap) {
      /* THE CORRECT OPTION IS SHUFFLED, AND THIS IS NOT OPTIONAL.
         Every one of the twenty taps across the three hubs was authored with
         `correct: true` FIRST — all nine here, all six in the Fraction Yard, all
         five in the Word Board. That is the defect CLAUDE.md records happening
         twice before ("the correct answer as the first option on all six ratio
         tables") and warns will happen again, and it did, in brand-new content.
         A student who always taps the top option scores without reading.

         Seeded on the hub id and page index, so the order is stable across a
         re-render — nothing moves under a student mid-question — but differs
         from page to page. Same `MF.seededShuffle` phRead3 and the Platform
         Check use; one implementation, not a fourth copy.

         `data-i` carries the ORIGINAL index, so `wire()` still looks the option
         up in the authored array and the shuffle cannot desync the answer. */
      var opts = (p.tap.options || []).map(function (o, i) { return { o: o, i: i }; });
      opts = global.MF && MF.seededShuffle
        ? MF.seededShuffle(opts, (h.id || 'hub') + '|tap|' + (p.short || p.heading))
        : opts;
      s += '<div class="hub-tap"><p class="hub-ask">' + esc(p.tap.ask) + '</p><ul class="hub-opts">' +
        opts.map(function (x) {
          return '<li><button class="hub-opt" type="button" data-i="' + x.i + '">' + esc(x.o.text) + '</button></li>';
        }).join('') +
        '</ul><div class="feedback hub-fb" role="status"></div></div>';
    }
    return s;
  }

  function html(h) {
    var pages = h.pages;
    var rail = pages.map(function (p, i) {
      return '<li><button class="hub-dot" type="button" data-go="' + i + '"' +
        (i === 0 ? ' aria-current="step"' : '') +
        ' aria-label="' + esc((i + 1) + '. ' + p.heading) + '"><span>' + (i + 1) + '</span>' +
        '<em>' + esc(p.short || p.heading) + '</em></button></li>';
    }).join('');

    var panels = pages.map(function (p, i) {
      return '<section class="hub-page" data-page="' + i + '"' + (i ? ' hidden' : '') + '>' +
        conductor(i) +
        (p.eyebrow ? '<span class="eyebrow">' + esc(p.eyebrow) + '</span>' : '') +
        '<h3>' + esc(p.heading) + '</h3>' +
        pageBody(h, p) +
        '</section>';
    }).join('');

    return '<div class="hubj" data-at="0">' +
        '<div class="card hubj-card">' +
          '<span class="phase-label">LEARNING HUB</span>' +
          '<h2>' + esc(h.name) + '</h2>' +
          /* The rail is the whole point of paging: a student can see every
             topic at once and go straight to one. A scroll hides the shape; a
             rail shows it and still lets you read one thing at a time. */
          '<nav class="hub-rail" aria-label="Sections of this hub"><ul>' + rail + '</ul></nav>' +
          '<div class="hub-pages">' + panels + '</div>' +
          '<div class="hub-nav">' +
            '<button class="btn btn-secondary" id="hubprev" type="button" disabled>&larr; Back</button>' +
            '<span class="hub-count" role="status">1 of ' + pages.length + '</span>' +
            '<button class="btn" id="hubnext" type="button">Next &rarr;</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function wire(node, h, onAny) {
    var wrap = node.querySelector('.hubj');
    if (!wrap) return;
    var pages = [].slice.call(wrap.querySelectorAll('.hub-page'));
    var dots  = [].slice.call(wrap.querySelectorAll('.hub-dot'));
    var prev  = wrap.querySelector('#hubprev');
    var next  = wrap.querySelector('#hubnext');
    var count = wrap.querySelector('.hub-count');
    var at = 0;

    function show(i, announce) {
      at = Math.max(0, Math.min(pages.length - 1, i));
      pages.forEach(function (p, k) {
        p.hidden = k !== at;
        /* Re-trigger the entrance each time a page is shown. Without the reflow
           the animation only ever runs once, because the element is not
           re-created — the same restart trick the Test Track uses. */
        if (k === at) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; }
      });
      dots.forEach(function (d, k) {
        if (k === at) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      wrap.setAttribute('data-at', at);
      prev.disabled = at === 0;
      next.disabled = at === pages.length - 1;
      count.textContent = (at + 1) + ' of ' + pages.length;
      if (announce && global.A11y && A11y.announce) {
        A11y.announce(h.pages[at].heading + '. Section ' + (at + 1) + ' of ' + pages.length + '.');
      }
      /* Move focus to the panel heading so a keyboard or screen-reader user
         lands on the new content instead of staying on a button that has just
         changed meaning underneath them. */
      if (announce) {
        var hd = pages[at].querySelector('h3');
        if (hd) { hd.setAttribute('tabindex', '-1'); hd.focus(); }
      }
      if (onAny) onAny(at);
    }

    prev.addEventListener('click', function () { show(at - 1, true); });
    next.addEventListener('click', function () { show(at + 1, true); });

    wrap.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-go]');
      if (dot) { show(+dot.getAttribute('data-go'), true); return; }

      /* A word opens and closes. Nothing is scored and nothing is hidden behind
         getting something right — this is a glossary, not a test. */
      var wbtn = e.target.closest('.hub-word-btn');
      if (wbtn) {
        var body = wbtn.parentNode.querySelector('.hub-word-body');
        var open = wbtn.getAttribute('aria-expanded') === 'true';
        wbtn.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open;
        return;
      }

      var opt = e.target.closest('.hub-opt');
      if (!opt || opt.disabled) return;
      var page = opt.closest('.hub-page');
      var idx = +page.getAttribute('data-page');
      var tap = h.pages[idx].tap;
      var o = tap.options[+opt.getAttribute('data-i')];
      var fb = page.querySelector('.hub-fb');
      opt.setAttribute('data-result', o.correct ? 'right' : 'wrong');
      if (o.correct) {
        [].forEach.call(page.querySelectorAll('.hub-opt'), function (b) { b.disabled = true; });
        fb.innerHTML = '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span><p><strong>Yes.</strong> ' +
                       esc(o.why) + '</p></div>';
        if (global.A11y && A11y.announce) A11y.announce('Correct. ' + o.why);
      } else {
        opt.disabled = true;
        fb.innerHTML = '<div class="msg msg-stop"><span class="ico" aria-hidden="true">&rarr;</span><p><strong>Not that one.</strong> ' +
                       esc(o.why) + '</p></div>';
        if (global.A11y && A11y.announce) A11y.announce('Not that one. ' + o.why);
      }
    });

    /* The tool and the self-checks live inside pages that are hidden at wire
       time. Wiring them anyway is deliberate: a listener on a hidden element is
       fine, and deferring it until the page is shown would mean re-wiring on
       every visit and stacking duplicate listeners. */
    if (wrap.querySelector('#fx')) TOOL.wire(wrap);
    wireChecks(wrap);

    show(0, false);
  }

  global.Hub = { applies: applies, html: html, wire: wire, art: Object.keys(ART), tool: TOOL };
})(window);
