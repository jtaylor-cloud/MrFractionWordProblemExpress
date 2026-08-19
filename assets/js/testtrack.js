/* ============================================================
   THE TEST TRACK — the demonstration between the estimate and the answer.

   WHY IT EXISTS
   A student committed an estimate and was then asked for the final answer with
   nothing in between: no demonstration of the strategy, nothing to interact
   with, nothing to think about. For a struggling student that gap is where
   attention goes, and it is the exact moment they most need to be SHOWN how
   this kind of problem is done. It replaces the Junction, which was prose and
   a choice and no motion at all.

   ---------------------------------------------------------------
   THE FIRST VERSION OF THIS WAS WRONG, AND THE USER WAS RIGHT ABOUT WHY.

   It ran a parallel mini-example: forty blocks in four boxes, take three. Two
   faults, and the second is the serious one.

   1. It introduced a SECOND WHOLE. The student is holding a pot of soup, and
      the screen hands them forty blocks and asks them to map between the two.
      That mapping is work, and it is not the lesson.

   2. IT GAVE AWAY THE THING THEY SHOULD BE DERIVING. The first option read
      "Split the 40 into 4 equal parts" — so the screen announced that the
      whole cuts into four. But how many sections, and why, is precisely what
      the fraction or the percent is telling them. On the percent problem it
      said "four of them hold 44", doing the sectioning outright. The
      percent-to-whole relationship — the whole point — was never taught. It
      was also redundant with the Model Yard, which already draws the bar
      pre-split into the right number of parts.

   SO: `section` works on the problem's OWN whole and computes NOTHING.

     Watch  — Mr Fraction sections a plain, storyless bar on a DIFFERENT
              fraction from the student's, so the principle is modelled without
              the counts being copyable.
     Yours  — the student's own whole, and two questions:
                how many equal sections does this whole cut into?
                how many of those sections has the story given you?
              Each answer animates the bar.

   Nothing is ever multiplied or divided here, so there is no value to leak —
   the counts involved are the fraction's own numerator and denominator, which
   the problem text already states. The arithmetic stays in the Engine Room.
   ---------------------------------------------------------------

   UNGRADED, DELIBERATELY. A wrong pick is answered and the student picks
   again. The gates that matter are already at Read 1/2/3, the Ticket Booth and
   the estimate.

   MOTION IS NEVER THE MESSAGE. Every state change lands in the DOM and in aria
   immediately; animation decorates it. Under prefers-reduced-motion the
   sequence resolves at once to the same final state, and the commentary is
   written out either way.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function trackOf(p) { return p && p.signalBox && p.signalBox.testTrack; }
  function applies(p) { return !!trackOf(p); }

  function reduced() {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function announce(msg) {
    if (msg && global.A11y && A11y.announce) A11y.announce(msg);
  }

  /* The picture is driven by the CORRECT option, not by a separate count field.
     One source of truth, so the bar cannot drift out of step with the answer
     the student is being marked against. */
  function correctCount(opts) {
    var o = (opts || []).filter(function (x) { return x.correct; })[0];
    return o ? parseInt(o.text, 10) : 0;
  }

  function shuffleFor(p, opts, salt) {
    return MF.seededShuffle(opts || [], p.id + '|tt' + salt + '|');
  }

  function barHTML(cls, n, filled) {
    var s = '';
    for (var i = 0; i < n; i++) {
      s += '<span class="tt-seg" data-i="' + i + '"' + (filled ? ' data-filled="1"' : '') + '></span>';
    }
    return '<div class="tt-bar ' + cls + '" data-parts="' + n + '">' + s + '</div>';
  }

  function optRow(p, opts, salt) {
    return shuffleFor(p, opts, salt).map(function (o, i) {
      return '<button class="opt tt-opt" type="button" data-i="' + i + '" aria-pressed="false">' +
             esc(o.text) + '</button>';
    }).join('');
  }

  /* ---------- section: the whole, cut by its own fraction or percent ------- */

  /* The frame every kind wears. `.rtab` is deliberate: the border, padding and
     shadow are the Ratio Table's, so this reads as another stop on the same
     railway rather than a new kind of screen. */
  function shellHTML(tt, kind, watchStage, yoursInner, p, y) {
    return '' +
      '<div class="rtab ttrack" data-kind="' + esc(kind) + '" data-stage="watch">' +
        '<div class="yard-head">' +
          '<span class="eyebrow">' + esc(tt.title || 'The Test Track') + '</span>' +
          '<h3>' + esc(tt.heading || '') + '</h3>' +
        '</div>' +
        '<p class="yard-say tt-say" role="status">' + esc(tt.intro || '') + '</p>' +
        watchStage +
        // Hidden until the worked example has run — one thing at a time.
        '<div class="tt-stage tt-yours" hidden>' +
          yoursInner +
          '<div class="tt-q" data-q="1">' +
            '<p class="rt-ask">' + esc(y.q1 || '') + '</p>' +
            '<div class="opt-row tt-opts-1">' + optRow(p, y.options1, '1') + '</div>' +
          '</div>' +
          '<div class="tt-q" data-q="2" hidden>' +
            '<p class="rt-ask">' + esc(y.q2 || '') + '</p>' +
            '<div class="opt-row tt-opts-2">' + optRow(p, y.options2, '2') + '</div>' +
          '</div>' +
          '<div class="feedback tt-fb"></div>' +
        '</div>' +
        '<div class="rt-law tt-law" hidden></div>' +
        '<p class="hint-text"><strong>In words:</strong> ' + esc(tt.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function sectionHTML(p, tt) {
    var w = tt.worked || {}, y = tt.yours || {};
    return shellHTML(tt, 'section',
      // WATCH — a plain bar, no story attached to it at all.
      '<div class="tt-stage tt-watch">' +
        '<p class="tt-demo-label">' + esc(w.label || '') + '</p>' +
        barHTML('tt-bar-worked', 1, true) +
        '<p class="tt-count tt-watch-say" role="status" aria-live="polite"></p>' +
        '<div class="btn-row"><button class="btn btn-quiet" id="tt-play" type="button">' +
          esc(w.button || 'Show me') + '</button></div>' +
      '</div>',
      '<p class="tt-demo-label">' + esc(y.wholeLabel || 'your whole') + '</p>' +
      barHTML('tt-bar-yours', 1, true) +
      '<p class="tt-count tt-yours-say" role="status" aria-live="polite"></p>',
      p, y);
  }

  /** Re-draw a bar to n sections, then shade the first `held` of them. */
  function cutBar(bar, n, held, fast) {
    var stagger = Math.min(80, Math.round(560 / Math.max(1, n)));
    bar.setAttribute('data-parts', n);
    bar.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'tt-seg';
      s.setAttribute('data-i', i);
      s.setAttribute('data-filled', '1');
      if (!fast) s.style.transitionDelay = (i * stagger) + 'ms';
      if (held && i < held) s.setAttribute('data-held', '1');
      bar.appendChild(s);
    }
  }

  /* ---------- the shape every kind shares ----------
     Watch a worked example, then answer two questions about your own problem,
     each of which moves the picture. Only the pictures differ between kinds,
     so only the pictures are supplied per kind — the staging, the shuffling,
     the wrong-answer handling and the announcements live here once. */
  function twoQuestionWire(root, p, tt, onDone, hooks) {
    var tab = root.querySelector('.ttrack');
    if (!tab) return;
    var w = tt.worked || {}, y = tt.yours || {};
    var fast = reduced();
    var fb = tab.querySelector('.tt-fb'), law = tab.querySelector('.tt-law');
    var yoursBox = tab.querySelector('.tt-yours');
    var yoursSay = tab.querySelector('.tt-yours-say');
    var wsay = tab.querySelector('.tt-watch-say');

    var play = tab.querySelector('#tt-play');
    play.addEventListener('click', function () {
      play.disabled = true;
      wsay.textContent = w.sayCut || '';
      announce(w.sayCut || '');
      hooks.worked(tab, w, fast, function () {
        wsay.textContent = (w.sayCut || '') + ' ' + (w.sayTake || '');
        announce(w.sayTake || '');
        tab.setAttribute('data-stage', 'yours');
        yoursBox.hidden = false;
        announce('Your turn. ' + (y.q1 || ''));
      });
    });

    function wireQ(sel, opts, salt, onRight) {
      var shuffled = shuffleFor(p, opts, salt);
      var done = false;
      Array.prototype.slice.call(tab.querySelectorAll(sel + ' .tt-opt')).forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (done) return;
          var o = shuffled[+btn.getAttribute('data-i')];
          if (!o) return;
          if (!o.correct) {
            /* Answered, never refused, and the student may pick again — this
               phase is a rehearsal and gates nothing. */
            btn.setAttribute('data-result', 'wrong');
            fb.innerHTML = '<div class="msg msg-stop"><span class="ico" aria-hidden="true">&rarr;</span><p>' +
              '<strong>Not quite.</strong> ' + esc(o.why || '') + '</p></div>';
            announce('Not quite. ' + (o.why || ''));
            return;
          }
          done = true;
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('data-result', 'right');
          Array.prototype.slice.call(tab.querySelectorAll(sel + ' .tt-opt'))
            .forEach(function (b) { b.disabled = true; });
          fb.innerHTML = '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span><p>' +
            '<strong>Yes.</strong> ' + esc(o.why || '') + '</p></div>';
          onRight(o);
        });
      });
    }

    wireQ('.tt-opts-1', y.options1, '1', function (o) {
      hooks.q1(tab, y, correctCount(y.options1), fast, o);
      yoursSay.textContent = y.settled1 || '';
      announce((y.settled1 || '') + ' ' + (y.q2 || ''));
      tab.querySelector('.tt-q[data-q="2"]').hidden = false;
    });

    wireQ('.tt-opts-2', y.options2, '2', function (o) {
      hooks.q2(tab, y, correctCount(y.options2), fast, o);
      yoursSay.textContent = y.settled2 || '';
      tab.setAttribute('data-stage', 'done');
      law.hidden = false;
      law.innerHTML =
        '<p class="rt-law-txt"><strong>' + esc(tt.law || '') + '</strong></p>' +
        '<p class="rt-pending">' + esc(tt.bridge || '') + '</p>';
      announce((y.settled2 || '') + ' ' + (tt.bridge || ''));
      if (onDone) onDone();
    });
  }

  function sectionWire(root, p, tt, onDone) {
    twoQuestionWire(root, p, tt, onDone, {
      worked: function (tab, w, fast, then) {
        var bar = tab.querySelector('.tt-bar-worked');
        cutBar(bar, w.parts || 0, 0, fast);
        function shade() {
          var segs = bar.querySelectorAll('.tt-seg');
          for (var i = 0; i < (w.take || 0) && i < segs.length; i++) segs[i].setAttribute('data-held', '1');
          then();
        }
        if (fast) shade(); else global.setTimeout(shade, 220 + (w.parts || 0) * 80);
      },
      q1: function (tab, y, n, fast) { cutBar(tab.querySelector('.tt-bar-yours'), n, 0, fast); },
      q2: function (tab, y, n) {
        var segs = tab.querySelector('.tt-bar-yours').querySelectorAll('.tt-seg');
        for (var i = 0; i < n && i < segs.length; i++) segs[i].setAttribute('data-held', '1');
      }
    });
  }

  /* ---------- cross: Ratio & Rate — cross-multiplying a set proportion ------

     REPLACED `lock`, WHICH WAS REJECTED AND DESERVED IT. That version animated
     two bars scaling together and stated the law "whatever you do to one row
     you do to the other" — which is, almost word for word, what the Ratio
     Table on the PREVIOUS screen already teaches. It was a second helping of
     the first lesson dressed as a new one, and the abstract bars made it
     harder to read rather than easier.

     THE LESSON NOW: once the ratio is set, the two diagonals of the table
     multiply to the same thing. That is a genuinely different method from the
     scaling the Ratio Table teaches — and having a second honest route through
     is the point of a site about choosing strategies.

     WHY IT STOPS SHORT. Cross-multiplying has two halves: SETTING UP the
     equation and SOLVING it. Setting it up cannot leak, because both sides
     stay unevaluated — `{{n1}} x 1 = {{n2}} x ?` names no answer. Solving it is
     the Engine Room's job and this screen never does it. Nothing on this
     screen is ever multiplied out, deliberately; the products are shown as
     products, not as numbers. */

  function gridHTML(cls, colA, colB, rows) {
    var body = rows.map(function (r, i) {
      return '<tr>' +
        '<th scope="row">' + esc(r.name) + '</th>' +
        '<td class="tt-cell" data-r="' + i + '" data-c="0"><span>' + esc(r.a) + '</span></td>' +
        '<td class="tt-cell" data-r="' + i + '" data-c="1"><span>' + esc(r.b) + '</span></td>' +
      '</tr>';
    }).join('');
    /* NO CROSSING LINES. There was an SVG overlay drawing a line along each
       diagonal; the user found the orange one distracting, and it was — it cut
       across the numbers the student is meant to be reading. The pairing is
       carried by the cells themselves instead: a tint, and a bracket shape
       that differs per diagonal so the two pairs stay distinguishable without
       relying on colour. */
    return '<div class="tt-cross ' + cls + '">' +
      '<table class="rt-grid tt-grid"><thead><tr><td></td>' +
        '<th scope="col">' + esc(colA) + '</th><th scope="col">' + esc(colB) + '</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table>' +
    '</div>';
  }

  function crossHTML(p, tt) {
    var w = tt.worked || {}, y = tt.yours || {};
    return shellHTML(tt, 'cross',
      '<div class="tt-stage tt-watch">' +
        '<p class="tt-demo-label">' + esc(w.label || '') + '</p>' +
        gridHTML('tt-cross-worked', w.colA || '', w.colB || '', w.rows || []) +
        '<p class="tt-eq tt-eq-worked" role="status" aria-live="polite"></p>' +
        '<p class="tt-count tt-watch-say" role="status" aria-live="polite"></p>' +
        '<div class="btn-row"><button class="btn btn-quiet" id="tt-play" type="button">' +
          esc(w.button || 'Show me') + '</button></div>' +
      '</div>',
      '<p class="tt-demo-label">' + esc(y.wholeLabel || '') + '</p>' +
      gridHTML('tt-cross-yours', y.colA || '', y.colB || '', y.rows || []) +
      '<p class="tt-eq tt-eq-yours" role="status" aria-live="polite"></p>' +
      '<p class="tt-count tt-yours-say" role="status" aria-live="polite"></p>',
      p, y);
  }

  /* Light one diagonal: cells [0][0]+[1][1] is diagonal 1, [0][1]+[1][0] is 2. */
  function lightDiagonal(box, d) {
    var pairs = d === 1 ? [[0, 0], [1, 1]] : [[0, 1], [1, 0]];
    pairs.forEach(function (rc) {
      var cell = box.querySelector('.tt-cell[data-r="' + rc[0] + '"][data-c="' + rc[1] + '"]');
      if (cell) cell.setAttribute('data-diag', d);
    });
  }

  function crossWire(root, p, tt, onDone) {
    twoQuestionWire(root, p, tt, onDone, {
      worked: function (tab, w, fast, then) {
        var box = tab.querySelector('.tt-cross-worked');
        var eq = tab.querySelector('.tt-eq-worked');
        lightDiagonal(box, 1);
        function second() {
          lightDiagonal(box, 2);
          eq.textContent = w.equation || '';
          then();
        }
        if (fast) second(); else global.setTimeout(second, 620);
      },
      q1: function (tab) { lightDiagonal(tab.querySelector('.tt-cross-yours'), 1); },
      q2: function (tab, y) {
        var box = tab.querySelector('.tt-cross-yours');
        lightDiagonal(box, 2);
        /* The equation, both sides UNEVALUATED. Multiplying either side out is
           the Engine Room's job — doing it here would hand over the answer. */
        var eq = tab.querySelector('.tt-eq-yours');
        eq.textContent = y.equation || '';
        announce(y.equation || '');
      }
    });
  }

  /* ---------- drive: Change — which way the story runs ----------

     THE LESSON: where the gap sits decides the direction you travel, and the
     direction decides the operation. The words in the story do not.

     WHY NO VALUES. Arriving at the missing car with a number IS the answer, so
     the engine stops AT the gap and the gap stays blank. What is demonstrated
     is the journey, not its arithmetic. */

  function trainHTML(cls, cars, gap) {
    var s = cars.map(function (c, i) {
      return '<span class="tt-car' + (i === gap ? ' tt-car-gap' : '') + '" data-i="' + i + '">' +
             '<span class="tt-car-label">' + esc(c) + '</span>' +
             '<span class="tt-car-slot">' + (i === gap ? '?' : '') + '</span></span>';
    }).join('<span class="tt-link" aria-hidden="true"></span>');
    return '<div class="tt-train ' + cls + '"><span class="tt-loco" aria-hidden="true">&#9679;</span>' + s + '</div>';
  }

  function driveHTML(p, tt) {
    var w = tt.worked || {}, y = tt.yours || {};
    return shellHTML(tt, 'drive',
      '<div class="tt-stage tt-watch">' +
        '<p class="tt-demo-label">' + esc(w.label || '') + '</p>' +
        trainHTML('tt-train-worked', w.cars || ['start', 'change', 'end'], typeof w.gap === 'number' ? w.gap : 2) +
        '<p class="tt-count tt-watch-say" role="status" aria-live="polite"></p>' +
        '<div class="btn-row"><button class="btn btn-quiet" id="tt-play" type="button">' +
          esc(w.button || 'Show me') + '</button></div>' +
      '</div>',
      '<p class="tt-demo-label">' + esc(y.wholeLabel || '') + '</p>' +
      trainHTML('tt-train-yours', y.cars || ['start', 'change', 'end'], typeof y.gap === 'number' ? y.gap : 0) +
      '<p class="tt-count tt-yours-say" role="status" aria-live="polite"></p>',
      p, y);
  }

  function runEngine(train, from, to, fast, then) {
    var cars = train.querySelectorAll('.tt-car');
    var loco = train.querySelector('.tt-loco');
    var step = from, dir = to >= from ? 1 : -1;
    function place(i) {
      if (!cars[i]) return;
      loco.style.transform = 'translateX(' + (cars[i].offsetLeft) + 'px)';
      train.setAttribute('data-at', i);
      cars[i].setAttribute('data-visited', '1');
    }
    place(step);
    if (fast || step === to) { place(to); if (then) then(); return; }
    var t = global.setInterval(function () {
      step += dir;
      place(step);
      if (step === to) { global.clearInterval(t); if (then) then(); }
    }, 480);
  }

  function driveWire(root, p, tt, onDone) {
    twoQuestionWire(root, p, tt, onDone, {
      worked: function (tab, w, fast, then) {
        var train = tab.querySelector('.tt-train-worked');
        runEngine(train, w.from || 0, typeof w.gap === 'number' ? w.gap : 2, fast, then);
      },
      /* Q1 settles which end of the story you can start from — the engine goes
         and sits there. */
      q1: function (tab, y, n, fast, o) {
        var train = tab.querySelector('.tt-train-yours');
        runEngine(train, o.from != null ? o.from : 0, o.from != null ? o.from : 0, true);
      },
      /* Q2 settles the direction. The engine runs to the gap and stops on it,
         with the gap still reading "?" — the value is the Engine Room's. */
      q2: function (tab, y, n, fast, o) {
        var train = tab.querySelector('.tt-train-yours');
        var gap = typeof y.gap === 'number' ? y.gap : 0;
        runEngine(train, o.from != null ? o.from : 0, gap, fast);
      }
    });
  }

  /* ---------- the Compare kind ----------
     WHY IT EXISTS. Every other line demonstrates its strategy between the
     estimate and the Engine Room; Compare shipped without one and went straight
     from estimating to calculating. That is the gap Cycle 11 was created to
     close, and the user found it again here.

     WHAT IT TEACHES, which is the thing the line turns on: the words do not
     decide the operation — the POSITION OF THE UNKNOWN does. cp-ticket-queues
     and cp-bench-count use almost identical sentences ("▮ more ... than") and
     need opposite operations, and the only visible difference is which end of
     the picture carries the question mark. So the demo shows one worked pair on
     numbers belonging to no problem here, then asks two questions about the
     student's own picture: which amount you already have, and therefore which
     way you travel. Nothing is calculated. */
  /* A BAR'S OUTLINE SPANS THAT BAR'S OWN TOTAL, and the hatched difference is
     an OVERLAY on its tail — not a separate box tacked on the end.

     It was tacked on the end, and the user caught it: on a bar whose amount is
     unknown and larger, the dashed outline stopped at the base while the amount
     it was labelling ran a quarter further, so the box carrying the "?" did not
     enclose the thing it was asking about. Drawn that way the picture says the
     unknown is the shorter one, on problems where it is the longer. */
  function cmpBar(cls, label, len, opts) {
    opts = opts || {};
    var total = len + (opts.gap || 0);
    /* `copies` seams the bar into that many equal parts, for the multiplicative
       shape below. Same grammar as the Plan model's `.cmp-copy`, and same rule:
       a seam is a boundary, never a labelled value. */
    var seams = '';
    for (var c = 1; c < (opts.copies || 0); c++) {
      seams += '<span class="ttc-copy" aria-hidden="true" style="left:' +
               ((c * total) / opts.copies).toFixed(2) + '%"></span>';
    }
    return '<div class="ttc-row ' + cls + '"' + (opts.unknown ? ' data-unknown="1"' : '') + '>' +
      '<span class="ttc-name">' + esc(label) + '</span>' +
      '<span class="ttc-track">' +
        '<span class="ttc-fill" style="width:' + total + '%"></span>' + seams +
        (opts.gap ? '<span class="ttc-gap" style="left:' + len + '%;width:' + opts.gap + '%">' +
                    esc(opts.gapText || '') + '</span>' : '') +
      '</span>' +
      '<span class="ttc-val">' + esc(opts.unknown ? '?' : (opts.val || '')) + '</span>' +
    '</div>';
  }

  /* Three shapes, because a compare problem can be missing any of the three
     pieces, and which one is missing is the entire lesson:
       gapUnknown        both amounts given, the gap is the question
       unknownIsLarger   the smaller amount and the gap given, add
       else              the larger amount and the gap given, take off
     The hatched segment is always the gap; only the "?" moves. */
  function comparePicture(cls, d) {
    var base = 55, gap = 25;
    var body;
    /* THE FOURTH SHAPE — multiplicative, added with cp-parking-spaces.
       No gap is drawn, because a multiplicative compare states no difference.
       The referent is one copy and the other bar is `factor` of them, seamed,
       which is the same picture the Plan model draws. The demonstration and the
       student's own picture have to be the same object or the demo teaches a
       diagram the next screen does not use. */
    if (d.factor) {
      var f = d.factor, unitLen = Math.round(88 / f);
      var unitRow = cmpBar(d.unitUnknown ? 'ttc-miss' : 'ttc-known',
                           d.unit.label, unitLen,
                           { unknown: !!d.unitUnknown, val: d.unit.val });
      var multRow = cmpBar(d.unitUnknown ? 'ttc-known' : 'ttc-miss',
                           d.mult.label, unitLen * f,
                           { unknown: !d.unitUnknown, val: d.mult.val, copies: f });
      // The referent is drawn first, because it is what the other is built from.
      return '<div class="ttcmp ' + cls + '">' + unitRow + multRow + '</div>';
    }
    if (d.gapUnknown) {
      body = cmpBar('ttc-known', (d.short || {}).label, base, { val: (d.short || {}).val }) +
             cmpBar('ttc-known', (d.long || {}).label, base,
                    { val: (d.long || {}).val, gap: gap, gapText: d.gapText || '?' });
    } else if (d.unknownIsLarger) {
      body = cmpBar('ttc-known', d.known.label, base, { val: d.known.val }) +
             cmpBar('ttc-miss',  d.unknown.label, base, { unknown: true, gap: gap, gapText: d.gapText });
    } else {
      body = cmpBar('ttc-miss',  d.unknown.label, base, { unknown: true }) +
             cmpBar('ttc-known', d.known.label, base, { val: d.known.val, gap: gap, gapText: d.gapText });
    }
    return '<div class="ttcmp ' + cls + '">' + body + '</div>';
  }

  function compareHTML(p, tt) {
    var w = tt.worked || {}, y = tt.yours || {};
    return shellHTML(tt, 'compare',
      '<div class="tt-stage tt-watch">' +
        '<p class="tt-demo-label">' + esc(w.label || '') + '</p>' +
        comparePicture('ttcmp-worked', w) +
        '<p class="tt-count tt-watch-say" role="status" aria-live="polite"></p>' +
        '<div class="btn-row"><button class="btn btn-quiet" id="tt-play" type="button">' +
          esc(w.button || 'Show me') + '</button></div>' +
      '</div>',
      '<p class="tt-demo-label">' + esc(y.wholeLabel || '') + '</p>' +
      comparePicture('ttcmp-yours', y) +
      '<p class="tt-count tt-yours-say" role="status" aria-live="polite"></p>',
      p, y);
  }

  function compareWire(root, p, tt, onDone) {
    twoQuestionWire(root, p, tt, onDone, {
      /* The worked pair simply lights up: the amount you have, then the gap.
         No motion to depend on, so reduced-motion needs no special case. */
      worked: function (tab, w, fast, then) {
        var pic = tab.querySelector('.ttcmp-worked');
        if (pic) pic.setAttribute('data-stage', 'shown');
        if (then) then();
      },
      // Q1 marks the amount the student says they already have.
      q1: function (tab, y, n, fast, o) {
        var pic = tab.querySelector('.ttcmp-yours');
        if (pic) pic.setAttribute('data-have', o.marks || 'known');
      },
      /* Q2 settles the DIRECTION and stops there — the gap keeps its label and
         never becomes a number. That is the Engine Room's. */
      q2: function (tab, y, n, fast, o) {
        var pic = tab.querySelector('.ttcmp-yours');
        if (pic) pic.setAttribute('data-way', o.marks || 'off');
      }
    });
  }

  /* ---------- Equal Groups: the tray, laid down ----------

     THE DEMONSTRATION THIS LINE NEEDED, and the reason it exists is a user
     riding eg-crate-bottles and going from the estimate straight to the
     arithmetic with nothing interactive in between. The manifest had a comment
     justifying that on the grounds that the Plan phase already showed the
     picture — which is the same argument the handoff already lists as a KNOWN
     GAP on six other problems. Restraint is not a reason to ship less.

     It reuses the `.eg-` classes the Plan model uses, and the laying-down
     animation with them, so the demonstration and the student's own picture are
     visibly the same object. A second visual vocabulary for one idea is how two
     halves of a site start to look like two sites.

     WHAT IT TEACHES: which of the three amounts you were handed decides the
     direction. Build up from a group, or share a total out into groups. The
     words never decide it — "each" is in every problem on this line and it is a
     multiplication on two of them and a division on three. */
  function groupsTray(cls, d) {
    var n = Math.max(1, Math.min(12, parseInt(d.groups, 10) || 3));
    var body = '';
    if (d.groupsUnknown) {
      /* The count is the answer, so the tray shows the total with ONE group
         against it and stops — the same refusal groups-model.js makes. */
      var pct = Math.max(8, Math.min(60, parseFloat(d.unitPct) || 22));
      body = '<span class="eg-box ttg-box" style="width:' + pct + '%;--eg-i:0">' +
               '<span class="eg-box-val">' + esc(d.sizeLabel || '') + '</span></span>' +
             '<span class="eg-rest" style="width:' + (100 - pct) + '%">' +
               '<span class="eg-rest-q">' + esc(d.restLabel || 'how many more?') + '</span></span>';
    } else {
      for (var i = 0; i < n; i++) {
        body += '<span class="eg-box ttg-box' + (d.sizeUnknown ? ' eg-box-unknown' : '') +
                '" style="width:' + (100 / n).toFixed(3) + '%;--eg-i:' + i + '">' +
                '<span class="eg-box-val">' + esc(d.sizeUnknown ? '?' : (d.sizeLabel || '')) + '</span></span>';
      }
    }
    return '<div class="ttg ' + cls + '">' +
             '<div class="eg-tray">' + body + '</div>' +
             '<div class="eg-total"><span class="eg-total-bracket" aria-hidden="true" style="--eg-n:' + n + '"></span>' +
               '<span class="eg-total-label">' + esc(d.totalLabel || 'in total') + ': <strong>' +
               esc(d.totalVal || '?') + '</strong></span></div>' +
           '</div>';
  }

  function groupsHTML(p, tt) {
    var w = tt.worked || {}, y = tt.yours || {};
    return shellHTML(tt, 'groups',
      '<div class="tt-stage tt-watch">' +
        '<p class="tt-demo-label">' + esc(w.label || '') + '</p>' +
        groupsTray('ttg-worked', w) +
        '<p class="tt-count tt-watch-say" role="status" aria-live="polite"></p>' +
        '<div class="btn-row"><button class="btn btn-quiet" id="tt-play" type="button">' +
          esc(w.button || 'Show me') + '</button></div>' +
      '</div>',
      '<p class="tt-demo-label">' + esc(y.wholeLabel || '') + '</p>' +
      groupsTray('ttg-yours', y) +
      '<p class="tt-count tt-yours-say" role="status" aria-live="polite"></p>',
      p, y);
  }

  function groupsWire(root, p, tt, onDone) {
    twoQuestionWire(root, p, tt, onDone, {
      /* Replaying the lay-down is the whole demonstration, so the worked tray
         re-runs its animation on demand rather than just lighting up. Under
         reduced motion `fast` is true and it settles immediately — the tray is
         complete either way, which is the honest still. */
      worked: function (tab, w, fast, then) {
        var pic = tab.querySelector('.ttg-worked');
        if (pic) {
          pic.setAttribute('data-stage', 'shown');
          if (!fast) {
            [].forEach.call(pic.querySelectorAll('.ttg-box'), function (b) {
              b.style.animation = 'none';
              void b.offsetWidth;              // force reflow so the restart takes
              b.style.animation = '';
            });
          }
        }
        if (then) then();
      },
      q1: function (tab, y, n, fast, o) {
        var pic = tab.querySelector('.ttg-yours');
        if (pic) pic.setAttribute('data-have', o.marks || 'group');
      },
      q2: function (tab, y, n, fast, o) {
        var pic = tab.querySelector('.ttg-yours');
        if (pic) pic.setAttribute('data-way', o.marks || 'build');
      }
    });
  }

  /* ---------- dispatch ---------- */

  var KINDS = {
    section: { html: sectionHTML, wire: sectionWire },
    cross:   { html: crossHTML,   wire: crossWire },
    drive:   { html: driveHTML,   wire: driveWire },
    compare: { html: compareHTML, wire: compareWire },
    groups:  { html: groupsHTML,  wire: groupsWire }
  };

  function html(p) {
    var tt = trackOf(p);
    if (!tt) return '';
    var k = KINDS[tt.kind];
    return k ? k.html(p, tt) : '';
  }

  /* Dispatched in BOTH html() and wire(). A model added to one and not the
     other renders a picture whose buttons do nothing, which is exactly what
     Cycle 9 shipped and had to fix. */
  function wire(root, p, onDone) {
    var tt = trackOf(p);
    if (!tt) return;
    var k = KINDS[tt.kind];
    if (k) k.wire(root, p, tt, onDone);
  }

  global.TestTrack = { applies: applies, html: html, wire: wire };
})(window);
