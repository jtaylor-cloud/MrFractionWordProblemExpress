/* ============================================================
   Station engine.

   A station runs ONE problem through the four Polya phases
   (Pedagogy §4). The station's ROLE decides which phase carries
   the scaffolding — that is the strategy being taught.

   Gates enforced here:
     - all three reads attempted before continuing
     - correct schema required (support increases, gate holds)
     - an estimate must exist before the Engine Room unlocks
     - Look Back is not skippable
   ============================================================ */
(function (global) {
  'use strict';

  var RUNGS = { 1: 'Whistle', 2: 'Signal', 3: 'Coupling', 4: 'Full route' };

  /* ------------------------------------------------------------------
     The Platform Check — Pedagogy §3.7. Kinds · Moments · Shape · Question.

     Run at the end of Read 1, while the numbers are still masked. The student
     points at the SENTENCE that carries the structural signal, and Mr Fraction
     names the line. Three constraints decided this design, all of them things
     the screen does that the source does not show:

     1. THE HEADER ALREADY NAMES THE LINE. render() prints
        "The Change Line · Start ± Change = Result" above every phase,
        Read 1 included. So the check can never ask the student to NAME the
        line inside a trip — that is readable off the furniture. It asks what
        is in the story; the site supplies the name. Which is the point: the
        student should finish able to say WHY this problem is on this line.

     2. NO NUMBER WORDS IN ANY OF THIS COPY. Read 1 is the numberless phase,
        and `tools/sweep.js` scans rendered text for spelled-out values because
        Cycle 6 shipped four leaks written as words. "One kind, two moments"
        would collide with any problem answering 1 or 2 and bury a real leak in
        cleared noise. Hence "a single kind of thing", "a before and an after".
        Say it in shapes, not counts — which reads better anyway.

     3. THE PICK IS A PROMPT TO LOOK, NOT AN ASSESSMENT. On a four-sentence
        stem a guess lands often, and nothing here is scored, so guessing costs
        the student nothing and teaches them nothing. The teaching is in what
        comes back — which is why a wrong pick is answered, and why the second
        wrong pick just shows the answer rather than grinding.
     ------------------------------------------------------------------ */
  var PLATFORM = {
    change: {
      ask:  'Which sentences do you actually need to solve this?',
      look: 'You need where the amount stood and what happened to it. A detail that never touches that amount is scenery, however interesting it is.',
      shape: 'a single kind of thing, with a before and an after',
      found: 'A single kind of thing, with a before and an after',
      because: 'before, event, after'
    },
    compare: {
      ask:  'Which sentences do you actually need to solve this?',
      look: 'You need both of the things being measured against each other. Anything that touches neither of them is scenery.',
      shape: 'separate things side by side, and nothing happening to either',
      found: 'Separate things, and nothing happening',
      because: 'you are measuring the gap'
    },
    ratio: {
      ask:  'Which sentences do you actually need to solve this?',
      look: 'You need the sentence that fixes the pairing, the amounts it pairs, and any amount you are asked to scale to. Anything else is scenery.',
      shape: 'different kinds of thing, locked together and scaled',
      found: 'Different kinds, moving together',
      because: 'change either, and the other follows'
    },
    groups: {
      ask:  'Which sentences do you actually need to solve this?',
      look: 'You need the size of the amount that repeats and the total it has to build. Anything else is scenery.',
      shape: 'the same amount, repeating',
      found: 'A single thing, the same amount repeating',
      because: 'you could act it out, a group at a time'
    },
    partwhole: {
      ask:  'Which sentences do you actually need to solve this?',
      look: 'You need the share you are given and the sentence tying it to the whole it came out of. Anything outside that whole is scenery.',
      shape: 'a whole thing, cut into shares',
      found: 'A single whole, cut into shares',
      because: 'the pieces have to account for all of it'
    }
  };

  /* The five questions. Each option declares the lines it is TRUE of, so the
     answer key is the schema itself and cannot drift from it. `no` is what a
     student reads on a wrong tap: it says what that choice would have meant,
     which sends them back to the story rather than handing over the answer.

     Same no-number-words rule as everything else on these two screens — no
     "one whole", no "the five lines". See the note above PLATFORM. */
  var CHECK = [
    {
      id: 'kinds', label: 'Kinds',
      ask: 'What is being counted in this story?',
      options: [
        { id: 'same', text: 'A single kind of thing', lines: ['change', 'compare', 'groups', 'partwhole'],
          yes: 'Everything here is measured in the same stuff.',
          no: 'That would mean the story counts the same stuff all the way through. Look again at what is being measured, and whether it is all the same sort of thing.' },
        { id: 'different', text: 'Different kinds, locked together', lines: ['ratio'],
          yes: 'Change either and the other follows. That is a relationship, not an amount.',
          no: 'That would mean different sorts of thing are pinned to each other, so changing either drags the other with it. Check whether the story really does that.' }
      ]
    },
    {
      /* Reworded 2026-08-04. It used to ask "Does anything happen to it?" and
         key every rate problem to "Nothing happens — it all sits still", while
         confirming "Nothing moves." The user hit this on a train problem —
         "something IS happening as the train is moving" — and the teacher and
         math agents raised it independently the same day. Three findings, one
         defect.

         The KEYING was never wrong: no quantity in a rate problem acquires a
         before-value and an after-value. The WORDING was false about the story
         and told a careful reader to distrust what they had just read. The
         right criterion was already in the file, in the sibling response — "an
         amount is different by the end than it was at the start" — so the fix
         is to ask that, and to say out loud that motion is not change. */
      id: 'moments', label: 'Moments',
      ask: 'Does any amount end up different from how it started?',
      options: [
        { id: 'changed', text: 'Yes &mdash; something was added or taken away', lines: ['change'],
          yes: 'The story runs through time, and an amount is not what it was.',
          no: 'That would mean an amount ends up different from how it started. Read it again and check whether any amount actually changes.' },
        { id: 'steady', text: 'No &mdash; the amounts stay as they are, even if something is moving', lines: ['compare', 'groups', 'partwhole', 'ratio'],
          yes: 'Things can be busy without any amount changing. A train can run all day and still be running at the same rate.',
          no: 'That would mean every amount is still what it was at the start. Look again for something being added or taken away.' }
      ]
    },
    {
      id: 'things', label: 'Things',
      ask: 'How many separate things is the story keeping track of?',
      options: [
        { id: 'single', text: 'Just a single thing', lines: ['change', 'groups', 'partwhole'],
          yes: 'A single thing, and everything else in the story is about it.',
          no: 'That would mean only a single thing is ever in view. Look again at what the story is holding up beside what.' },
        { id: 'separate', text: 'Separate things, held up against each other', lines: ['compare'],
          yes: 'Both exist at once, and the story is interested in the gap between them.',
          /* Was "That is not what is going on here." — false on rr-market-stall,
             which sets two stalls side by side and asks which is better value.
             Generic copy must not assert a fact about a particular story. */
          no: 'That would mean separate things sitting side by side and measured against each other, with neither of them changing.' },
        { id: 'paired', text: 'Amounts that always go together', lines: ['ratio'],
          yes: 'Not really separate things at all &mdash; a relationship that holds at any size.',
          no: 'That would mean a fixed pairing you could scale up or down. Check whether the story pairs anything off like that.' }
      ]
    },
    {
      id: 'shape', label: 'Shape',
      ask: 'Is anything being cut up, or repeated?',
      options: [
        { id: 'cut', text: 'A whole thing, cut into shares', lines: ['partwhole'],
          yes: 'The shares belong to it, and between them they account for all of it.',
          no: 'That would mean a single whole being divided, with the pieces adding back up to it. Is there a whole here to cut?' },
        { id: 'repeat', text: 'The same amount, over and over', lines: ['groups'],
          yes: 'You could act it out: make a group, then another the same, then another.',
          no: 'That would mean an identical amount repeating, and the question counting how many of them there are.' },
        { id: 'neither', text: 'Neither &mdash; nothing is being carved up or repeated', lines: ['change', 'compare', 'ratio'],
          /* Was "nothing repeats", which is false of a rate — a rate is the same
             amount per unit, over and over, and the manifests say so themselves
             ("Bags do come in lots, which sounds like groups"). Narrowed to the
             thing that actually separates the lines. */
          yes: 'Nothing is being carved into shares, and no fixed amount is being repeated to build a total.',
          no: 'Something here is being cut or repeated. Have another look before ruling it out.' }
      ]
    },
    {
      /* The option below used to read "there is a step in between" and was keyed
         always-wrong, with a reply claiming "a single move from what you are
         given". SIX problems declare steps: 2 — pw-helmet-savings, pw-band-brass,
         pw-cycling-club, pw-quilt-colors, rr-van-hours, rr-market-stall — so the
         option was TRUE and the reply FALSE on more than a third of the bank.
         Found by teacher and math independently.

         The root cause was mine and it was in the spec: PEDAGOGY §3.7 verdict 2
         read "Two lines, stacked. Multi-step." Those are different things. A
         problem can take several steps inside a single situation. The question
         is about situations, so the option and its reply now are too — and the
         reply teaches the distinction rather than denying the student's reading. */
      id: 'fit', label: 'Question',
      ask: 'Does a single kind of situation cover this whole story?',
      options: [
        { id: 'onekind', text: 'Yes &mdash; the same kind of situation all the way through', lines: ['change', 'compare', 'groups', 'partwhole', 'ratio'],
          yes: 'Everything the question needs is the same kind of situation &mdash; even where it takes more than a single move to get there.',
          no: '' },
        { id: 'stacked', text: 'No &mdash; it stacks different kinds of situation, one after another', lines: [],
          yes: '',
          no: 'Worth asking every time, and often the right answer &mdash; plenty of problems do stack different kinds of situation. This story stays inside a single kind the whole way, even where the working takes more than a single step. Steps and situations are not the same thing.' },
        { id: 'nofit', text: 'None of them really fits', lines: [],
          yes: '',
          no: 'That is a real answer and you should keep it in your pocket &mdash; not every problem you meet fits these lines. This one does, though. Look at the shape you just described.' }
      ]
    }
  ];

  /* A control that disables itself on activation drops focus to <body>.
     Measured across the site: pressing an option in the Platform Check, Read 3
     or the Ticket Booth left `document.activeElement === BODY` every time. On
     its own that is an annoyance; combined with feedback that carried no live
     region, a screen-reader user pressed a button, heard nothing at all, and
     was thrown to the top of the document — five times per station on the
     first screen alone.

     Send focus to the feedback panel. Every one of them is now role="status",
     so it is both the teaching and the right place to be standing. */
  /* PER-PROBLEM QUESTIONS — `read1.platformCheck.questions`.

     The shared CHECK table asks in the abstract: "What is being counted in this
     story?" That question has the same answer for all seven Part–Whole problems,
     and the station header names the line above it, so a student two stations
     into a line can answer all five without reading. Shuffling fixed the
     POSITIONS; it could not fix that.

     A problem may therefore replace the question text and any option's text,
     `yes` or `no` with copy that NAMES ITS OWN QUANTITIES — "litres of water,
     and taps on the platform". That cannot be answered off the header, because
     it cannot be answered without knowing what is in the story.

     Overrides are keyed by stable ids (`kinds`/`moments`/`things`/`shape`/`fit`,
     and the option ids), never by position, so reordering CHECK cannot silently
     repoint them. `lines` is NEVER overridable: correctness stays the schema's,
     so authored copy can be wrong about tone but never about the answer. */
  function tailor(q, over) {
    if (!over) return q;
    return {
      id: q.id, label: q.label, ask: over.ask || q.ask,
      options: q.options.map(function (o) {
        var ov = over.options && over.options[o.id];
        if (!ov) return o;
        return { id: o.id, lines: o.lines,
                 text: ov.text || o.text, yes: ov.yes || o.yes, no: ov.no || o.no };
      })
    };
  }

  function focusFeedback(node) {
    if (!node) return;
    node.setAttribute('tabindex', '-1');
    node.focus();
  }

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ============================================================
     Station controller
     ============================================================ */
  function Station(problem, role, metrics, onComplete) {
    this.p = problem;
    this.role = role;
    this.m = metrics;
    this.onComplete = onComplete;
    this.phase = 'read1';
    this.schemaTries = 0;
    this.stepIndex = 0;
    this.hintRung = 0;
    this.estimate = null;
    this.root = null;
    /* Set when the student brings an answer to the Arrivals Board that
       `checkAnswer` has not passed. It picks which of the two boards renders,
       and it is initialised here so the choice is never made on `undefined`. */
    this.solvedWrong = false;
    this.expandAll = false;   // test scaffolding — see phRead1
  }

  Station.prototype.masked = function () {
    if (A11y.state.revealNumbers) return false;
    // Both screens of the first read are numberless — the Platform Check is
    // about the shape of the story, and a visible number invites arithmetic.
    return this.phase === 'read1' || this.phase === 'platform';
  };

  /**
   * @param highlightQ  outline the question sentence (Read 3 and the Hub)
   * @param pick        render each sentence as a button the student can choose.
   *                    Used by the Platform Check at Read 1. The class list is
   *                    unchanged so `.s` keeps working — read-aloud reads
   *                    `data-speak`, and the "chunk sentences" reading option
   *                    styles `.s`, so a <button> that drops either would break
   *                    both for the one phase that most needs them.
   */
  Station.prototype.problemHTML = function (highlightQ, pick) {
    var p = this.p, masked = this.masked();
    var out = '';
    /* One paragraph, sentences as inline spans — a problem is prose, and a
       stack of separate <p>s read as a spaced-out list rather than something
       written. The spans keep per-sentence read-aloud working, and the
       "chunk sentences" reading option turns them back into separate lines
       for anyone who wants that. */
    p.problem.sentences.forEach(function (s, i) {
      var isQ = i === p.problem.questionSentenceIndex;
      var cls = 's' + (isQ ? ' q-sentence' + (highlightQ ? ' highlight' : '') : '');
      var speak = esc(MF.speechText(s, p.problem.numbers, masked));
      var body = MF.renderText(esc(s), p.problem.numbers, masked);
      /* A SPAN WITH role="button", NOT A <button>.
         This was a <button> first, and it could not be made to read as prose:
         a button is an ATOMIC inline-level element, so it never breaks across
         lines whatever `display` says. Measured — `display: inline` computed
         back as `inline-block`, with no other rule touching it, and every
         sentence rendered as one unbreakable block. Six of them stacked and
         the paragraph became a worksheet.

         A span flows as text. The cost is doing by hand what the button gave
         free: role, tab stop, aria-pressed, and Enter/Space (see phPlatform).
         That is a real cost and worth paying only because this phase's whole
         job is getting the story read as a story. */
      out += pick
        ? '<span class="' + cls + ' pickable" role="button" tabindex="0" aria-pressed="false"' +
          ' data-sent="' + i + '" data-speak="' + speak + '">' + body + '</span> '
        : '<span class="' + cls + '" data-speak="' + speak + '">' + body + '</span> ';
    });
    // The picture sits beside the words, on every screen that shows them.
    // The picture obeys the same masking as the prose beside it.
    var scene = (window.Scene && Scene.html(p, masked)) || '';
    return '<div class="problem-pair' + (scene ? '' : ' no-scene') + '">' +
             '<div class="problem-well"><p>' + out + '</p></div>' + scene +
           '</div>';
  };

  Station.prototype.render = function () {
    var st = MF.STATIONS[this.role];

    /* THE STATION HEADER WAS PRINTING THE ANSWER TO THE TICKET BOOTH'S NEW
       QUESTION, and this is the composition defect §13 describes exactly: every
       file correct on its own, the fault only in what one renders crossed with
       when another asks.

       `.station-desc` prints "The Change Line · Start ± Change = Result" above
       EVERY phase — the Platform Check's own note says so, and it is why that
       check has two screens. The moment the booth started asking which line is
       hiding under the percent, that header became a giveaway sitting two
       inches above the question. Found by scanning the whole screen rather than
       the phase host; the phase itself was clean.

       On a percent ride the header now names the ROUTE, which is both honest —
       they really are riding the Percent Line — and silent about the answer.
       The colour goes with it, because a student who has learned that green is
       Change reads the answer off the tint without any words at all.

       The LEG MAP keeps the problem's real line, because `STOPS` is keyed by
       schema and has no `percent` entry: passing the route key there throws and
       kills the station (VERIFICATION.md §24 — the first content of a new shape
       tests what the engine assumed). Only its colour is overridden. The
       residual tell is the geometry, and it is real but weak: a student would
       have to recognise a zoomed fragment of one line's curve. Stated rather
       than claimed away. */
    var onPercentRoute = this.asksHiddenLine();
    var route = onPercentRoute ? MF.rideInfo(MF.PERCENT) : MF.LINES[this.p.line];
    var colour = onPercentRoute ? 'var(--line-percent)' : 'var(--line-' + this.p.line + ')';
    /* The journey panel sits ABOVE the station title, so the first thing on
       the screen is where you are on the line — not a heading. The picture is
       a zoom-in on the leg you are travelling right now; the numbered stops
       beneath it are the accessible equivalent. */
    var leg = '';
    if (typeof this.legIndex === 'number' && window.Scenery && Scenery.legMap) {
      var dots = '';
      // NB: not `st` — that is the station object above, and `var` would hoist
      // this over it, blanking the station title. It did exactly that once.
      for (var d = 0; d < this.legTotal; d++) {
        var dstate = d < this.legIndex ? 'done' : (d === this.legIndex ? 'here' : 'ahead');
        dots += '<li class="jd" data-s="' + dstate + '"><span class="visually-hidden">Stop ' + (d + 1) +
                ' of ' + this.legTotal + (dstate === 'here' ? ', you are here' : dstate === 'done' ? ', done' : '') +
                '</span></li>';
      }
      leg =
        '<div class="journey">' +
          '<div class="journey-map">' +
            Scenery.legMap(Selector.availableLines(), this.p.line, this.legIndex,
                           this.legProgress || 0, this.legIndex,
                           onPercentRoute ? 'var(--line-percent)' : null) +
          '</div>' +
          '<div class="journey-bar">' +
            '<span class="eyebrow">Stop ' + (this.legIndex + 1) + ' of ' + this.legTotal + '</span>' +
            '<ol class="journey-dots" aria-label="Progress along this trip">' + dots + '</ol>' +
          '</div>' +
        '</div>';
    }

    var html =
      '<div style="--line-current:' + colour + '">' +
        leg +
        '<div class="station-head">' +
          '<span class="station-thumb" aria-hidden="true">' +
            Scenery.wheelSVG().replace('<svg', '<svg style="color:' + colour + ';opacity:.85"') +
          '</span>' +
          '<div class="station-meta">' +
            '<span class="eyebrow">' + esc(st.name) + '</span>' +
            '<h2>' + esc(st.strategy) + '</h2>' +
            '<p class="station-desc">' + esc(route.name) + ' &middot; ' +
              esc(route.form) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="card"><div id="phase-host"></div></div>' +
      '</div>';
    this.root = el(html);
    this.renderPhase();
    return this.root;
  };

  Station.prototype.host = function () { return this.root.querySelector('#phase-host'); };

  Station.prototype.renderPhase = function () {
    var f = {
      read1: this.phRead1, platform: this.phPlatform,
      read2: this.phRead2, read3: this.phRead3,
      ticket: this.phTicket, plan: this.phPlan, demo: this.phDemo,
      solve: this.phSolve, check: this.phCheck
    }[this.phase];
    if (f) f.call(this);
    var h = this.host();
    var focusTarget = h.querySelector('h3');
    if (focusTarget) { focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus(); }
    /* Hand whatever Mr Fraction queued during this phase to the floating
       companion. Focus has already gone to the phase heading above, and the
       companion never takes it — he is commentary, not a step, so he announces
       through aria-live and leaves the student where they were. */
    if (global.Companion) Companion.flush();
  };

  Station.prototype.go = function (phase) { this.phase = phase; this.renderPhase(); };

  /* ---------- Phase 1: Three Reads ---------- */

  /* ---------- First read, across two screens ----------

     read1      the five questions — WHAT KIND of situation is this?
     platform   prove it from the text, then see where it sits on the map

     The free-text retelling that used to open Read 1 was replaced by the five
     questions on the user's instruction (2026-08-03). Mr Fraction's reading of
     the story is still shown, at the end of the five — so the comprehension
     anchor and the sixteen authored `modelAnswer`s stay live rather than
     becoming content nothing renders (VERIFICATION.md §9).

     Why the split is two screens and not one: the five questions can be part
     answered from the station header, which prints the line and its equation
     above every phase. The EVIDENCE cannot — the sentences that carry the
     signal move from problem to problem. So the first screen classifies and
     the second makes you prove it, and only the second one needs reading. */
  Station.prototype.phRead1 = function () {
    var self = this, p = this.p;
    var line = p.line;

    /* SHUFFLE. Source order shipped unshuffled and "tap the first option every
       time" scored 57.5% against a 40% baseline — 4 of 5 on Part–Whole, which
       is seven of the sixteen problems. The student agent then rode five
       Part–Whole stations on a fixed tap pattern and scored 5/5 without
       reading a word.

       phRead3 has shuffled since it was written, fifty lines below this, above
       a comment explaining why. That is VERIFICATION §15 exactly: the working
       fix was already in the file and was not read.

       `data-o` carries the ORIGINAL index, so the answer key is unaffected —
       correctness is decided by the option's own `lines`, never by position.

       This kills the positional shortcut. What kills the DEEPER one — the
       header naming the line, so the answers are constant within a line — is
       `platformCheck.questions`, which lets a problem ask in terms of its own
       quantities. See `tailor()`. */
    /* `read1.questions`, a sibling of `platformCheck` rather than a child of it,
       because they drive different screens: these five questions are screen
       one, and `platformCheck.sentences/why/kinds` is screen two. */
    var over = (p.threeReads.read1 || {}).questions || {};
    var CHECKS = CHECK.map(function (q) { return tailor(q, over[q.id]); });

    var qs = CHECKS.map(function (q, qi) {
      var order = shuffled(q.options.map(function (o, i) { return i; }),
                           seedFrom(self.p.id + '|check|' + q.id));
      var opts = order.map(function (oi) {
        var o = q.options[oi];
        return '<li><button class="choice" type="button" data-q="' + qi + '" data-o="' + oi + '">' +
          '<span class="marker" aria-hidden="true">&#9723;</span><span>' + o.text + '</span></button></li>';
      }).join('');
      return '<div class="card"><span class="eyebrow">' + esc(q.label) + '</span>' +
        '<h3>' + q.ask + '</h3>' +
        '<ul class="choices">' + opts + '</ul>' +
        '<div class="feedback" role="status" id="cf' + qi + '"></div></div>';
    }).join('');

    this.host().innerHTML =
      MrFraction.aside('steady',
        '<p><strong>First read.</strong> The numbers are covered up on purpose &mdash; you cannot work ' +
        'anything out yet, and you are not meant to. Read it for what <em>kind</em> of thing is going on.</p>') +
      this.problemHTML(false) +
      '<div class="section-head"><span class="eyebrow">The Platform Check &middot; part one</span>' +
        '<h2>What kind of situation is this?</h2><div class="rule"></div></div>' +
      '<p class="hint-text">Kinds &middot; Moments &middot; Things &middot; Shape &middot; Question. ' +
        'Nothing is marked, and a wrong tap will tell you what it would have meant.</p>' +
      '<div id="r1checks">' + qs + '</div>' +
      '<div class="feedback" role="status" id="r1fb"></div>' +
      '<div class="btn-row"><button class="btn" id="r1go" type="button">Now show me the proof →</button></div>';

    var got = {}, host = this.host(), revealed = false;

    /* Bind to the freshly-built container, NOT to the persistent phase host.
       `renderPhase()` replaces the host's children but keeps the host itself,
       so a listener on the host survives every re-render and they stack up.
       The stacked copies are not merely wasteful: the first one disables the
       buttons, and every later copy starts with `if (b.disabled) return`, so
       the CURRENT render's handler never records the answer. The phase looked
       dead while the previous render quietly did the work.
       `App.rerender()` re-renders the live phase whenever a student toggles
       "always show numbers", so this was reachable, not just a sweep artifact. */
    host.querySelector('#r1checks').addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]');
      if (!b || b.disabled) return;
      var qi = +b.getAttribute('data-q'), oi = +b.getAttribute('data-o');
      var q = CHECKS[qi], o = q.options[oi];
      var ok = o.lines.indexOf(line) >= 0;
      b.setAttribute('data-result', ok ? 'right' : 'wrong');
      b.querySelector('.marker').innerHTML = '&#9724;';
      host.querySelector('#cf' + qi).innerHTML = ok
        ? msg('go', '&#10003;', '<strong>Yes.</strong> ' + o.yes)
        : msg('caution', '&rarr;', '<strong>Not this time.</strong> ' + o.no);
      if (ok) {
        got[qi] = 1;
        var sib = b.closest('ul').querySelectorAll('[data-q]');
        for (var i = 0; i < sib.length; i++) sib[i].disabled = true;
        // Fills this stop on the rail. Answered, not correct — see app.css.
        b.closest('.card').classList.add('answered');
        A11y.announce('Yes.');
      } else {
        b.disabled = true;
        A11y.announce('Not this time.');
      }
      focusFeedback(host.querySelector('#cf' + qi));
      if (Object.keys(got).length === CHECKS.length && !revealed) {
        revealed = true;
        /* The retelling is gone, so this is now the only place the student
           hears the story said back to them. It lands after the five rather
           than before, because by here they have described the shape and this
           confirms the content. */
        host.querySelector('#r1fb').innerHTML = msg('info', '&rarr;',
          '<strong>Mr Fraction read it as:</strong> ' + esc(p.threeReads.read1.modelAnswer));
        A11y.announce('All five done.');
      }
    });

    host.querySelector('#r1go').addEventListener('click', function () {
      if (Object.keys(got).length < CHECKS.length) {
        host.querySelector('#r1fb').innerHTML = msg('caution', '!',
          'Have a go at all of them first. Nothing is being marked &mdash; a wrong tap just tells you ' +
          'what that answer would have meant.');
        A11y.announce('Answer all of them first.');
        return;
      }
      self.go('platform');
    });

    if (this.expandAll) {
      /* Test scaffolding: land every correct option so the sweep sees the
         revealed state. See phPlatform and VERIFICATION.md §2. */
      CHECKS.forEach(function (q, qi) {
        var oi = 0;
        q.options.forEach(function (o, i) { if (o.lines.indexOf(line) >= 0) oi = i; });
        var b = host.querySelector('[data-q="' + qi + '"][data-o="' + oi + '"]');
        if (b) b.click();
      });
    }
  };

  /* Second screen of the first read: prove it from the text, then see the map.

     The student picks EVERY sentence carrying the signal, not just one — a
     Change problem shows its shape across the before and the after, and a
     two-stall ratio states its pairing twice. Toggle-then-check is the Read 2
     idiom (see phRead2), reused rather than reinvented. */
  Station.prototype.phPlatform = function () {
    var self = this, p = this.p;
    var pc = (p.threeReads.read1 || {}).platformCheck;
    var L = PLATFORM[p.line];
    if (!pc || !L) { this.go('read2'); return; }

    var rows = Object.keys(MF.LINES).map(function (k) {
      var PL = PLATFORM[k], LN = MF.LINES[k], here = k === p.line;
      /* `aria-current` and a visible chip, not fill alone. The row was marked
         by a background tint and an inset bar — nothing a screen reader could
         reach, and "your row is marked" is the stated payoff of this screen.
         The chip is VISIBLE rather than .visually-hidden on purpose:
         a11y.js:139 skips hidden text, so a hidden marker would be silent to
         read-aloud, which is the provision most likely to be in use here. */
      return '<tr' + (here ? ' class="row-here" aria-current="true"' : '') + '>' +
        '<td><span class="marker" aria-hidden="true" style="color:var(--line-' + k + ')">' + LN.marker + '</span> ' +
          esc(PL.found) + '</td>' +
        '<td><span class="line-name">' + esc(LN.name.replace(/^The /, '')) + '</span>' +
          (here ? '<span class="you-are-here">You are here</span>' : '') + '</td>' +
        '<td>' + esc(PL.because) + '</td></tr>';
    }).join('');

    this.host().innerHTML =
      MrFraction.aside('steady',
        '<p><strong>Still the first read.</strong> You have said what kind of situation this is. ' +
        'Now show me where the story says so.</p>') +
      '<div id="r1story">' + this.problemHTML(false, true) + '</div>' +
      /* This screen had no section-head at all — a bare h3 at 16.8px, smaller
         than the body text above it, and no display face doing any work until
         after the student had already answered. The two screens also shared
         their first ~1050px verbatim, so they read as the same screen twice
         rather than one phase in two parts. The step eyebrow says which. */
      '<div class="section-head"><span class="eyebrow">The Platform Check &middot; part two</span>' +
        '<h2>Now show me where it says so</h2><div class="rule"></div></div>' +
      '<h3>' + L.ask + '</h3>' +
      /* "there may be more than a single one" read as a promise that there
         usually is; on most problems there is exactly one, and a student who
         hunted for a second was misled. Says the truth instead. */
      '<p class="platform-instruction">Tap every sentence you need. Sometimes that is a single ' +
      'sentence, sometimes more &mdash; and some of them are only there to set the scene. ' +
      'Tap again to change your mind.</p>' +
      '<div class="feedback" role="status" id="pcfb"></div>' +
      '<div class="btn-row"><button class="btn" id="pcheck" type="button">Check these</button></div>' +
      '<div id="pcmap" hidden>' +
        '<div class="section-head"><span class="eyebrow">Where that puts you</span>' +
          '<h2>The shape decides the line</h2><div class="rule"></div></div>' +
        '<div class="table-scroll"><table class="map-table">' +
          '<thead><tr><th scope="col">What you found</th><th scope="col">The line</th>' +
            '<th scope="col">Why it has to be</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table></div>' +
        '<div class="btn-row"><button class="btn" id="pcgo" type="button">Second read →</button></div>' +
      '</div>';

    var host = this.host(), want = pc.sentences.slice().sort(), done = false;
    var picked = {};

    function toggle(b) {
      if (!b || done) return;
      var i = b.getAttribute('data-sent');
      if (picked[i]) { delete picked[i]; b.removeAttribute('data-picked'); }
      else { picked[i] = 1; b.setAttribute('data-picked', 'yes'); }
      b.setAttribute('aria-pressed', picked[i] ? 'true' : 'false');
    }

    var story = host.querySelector('#r1story');
    story.addEventListener('click', function (e) {
      toggle(e.target.closest('[data-sent]'));
    });
    /* The keyboard half of role="button". A real <button> gave this free, and
       it is the price of the span that lets the paragraph flow. Space must be
       preventDefault-ed or it scrolls the page instead of choosing. */
    story.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      var b = e.target.closest('[data-sent]');
      if (!b) return;
      e.preventDefault();
      toggle(b);
    });

    /* @param gotIt  did the student actually find it, or did the gate open?
       This used to take no argument and always render msg('go','✓'). So a
       student who picked every sentence on the page, twice, got a green tick
       and the full explanation — indistinguishable from getting it right. The
       student agent recorded exactly that as "select everything → ✓ correct"
       on two problems, and it is why "tap everything except the question"
       looked like a working strategy. Support still increases and the gate
       still opens; it just stops calling that a win. */
    function finish(gotIt) {
      done = true;
      /* KEEP THE EVIDENCE. This used to replace the story with plain prose, so
         every pick vanished at the exact moment a table headed "What you found"
         appeared. The sentences stay marked; they just stop being operable. */
      [].forEach.call(host.querySelectorAll('.pickable'), function (b) {
        b.setAttribute('aria-disabled', 'true');
        b.removeAttribute('tabindex');        // out of the tab order, still readable
        b.removeAttribute('role');            // no longer a control, just marked text
        b.removeAttribute('aria-pressed');
      });
      host.querySelector('#pcfb').innerHTML = msg(gotIt ? 'go' : 'info', gotIt ? '&#10003;' : '&rarr;',
        '<strong>' + (gotIt ? 'Yes &mdash; that is it.' : 'Here is what carries it.') + '</strong> ' +
        esc(pc.why) + '<br><br>' + esc(pc.kinds) +
        ' So: ' + L.shape + '. <strong>That is why this problem is on ' +
        esc(MF.LINES[p.line].name) + '.</strong>');
      host.querySelector('#pcheck').hidden = true;
      host.querySelector('#pcmap').hidden = false;
      host.querySelector('#pcgo').addEventListener('click', function () { self.go('read2'); });
      /* MAKE THE REVEAL LAND. Measured before this: the map's top sat at
         y=1430 on a document 2003px tall, with the student's fold around
         y=1300 — so the payoff of the whole screen rendered below the fold and
         nothing pointed at it. The only visible change on click was a button
         disappearing. Move focus to the section head, which scrolls it into
         view and takes a screen reader there too. */
      var head = host.querySelector('#pcmap h2');
      if (head) {
        head.setAttribute('tabindex', '-1');
        head.focus();
        if (head.scrollIntoView) head.scrollIntoView({ block: 'center' });
      }
      A11y.announce('Platform check done. ' + (head ? head.textContent : ''));
    }

    var tries = 0;
    host.querySelector('#pcheck').addEventListener('click', function () {
      if (done) return;
      var mine = Object.keys(picked).map(Number).sort();
      if (!mine.length) {
        host.querySelector('#pcfb').innerHTML = msg('caution', '!', 'Tap at least one sentence first.');
        A11y.announce('Nothing picked yet.');
        return;
      }
      var missing = want.filter(function (i) { return mine.indexOf(i) < 0; });
      var extra = mine.filter(function (i) { return want.indexOf(i) < 0; });
      if (!missing.length && !extra.length) { finish(true); return; }

      tries++;
      if (tries >= 2) { finish(false); return; }   // support increases; the gate opens

      /* Read 2 tells a student who over-picks that they have taken something
         they do not need, without saying which. This screen used to say only
         "Not quite" and repeat the generic coaching, so a student who had the
         right sentence PLUS extras was told nothing about which half was
         wrong — and the commonest wrong answer of all, "select everything",
         got the same reply as a near miss. */
      var note;
      if (extra.indexOf(p.problem.questionSentenceIndex) >= 0) {
        note = 'The sentence with the question in it tells you what to FIND, not what kind of story this is. ' + L.look;
      } else if (missing.length && !extra.length) {
        note = 'What you have is right, but not all of it &mdash; there is something else you need. ' + L.look;
      } else if (extra.length && !missing.length) {
        note = 'You have what you need, and something extra. A story can mention things that only set the scene, or a number that nothing in the question asks about. Take those off.';
      } else {
        note = L.look;
      }
      host.querySelector('#pcfb').innerHTML = msg('caution', '&rarr;', '<strong>Not quite.</strong> ' + note);
      A11y.announce('Not quite.');
    });

    if (this.expandAll) {
      want.forEach(function (i) {
        var b = host.querySelector('[data-sent="' + i + '"]');
        if (b) b.click();
      });
      host.querySelector('#pcheck').click();   // lands finish(true) — the success copy
    }
  };


  /* Second read — WHICH numbers matter.
     Problems now carry deliberately irrelevant quantities, so simply listing
     the numbers would teach nothing. Sorting the useful from the decorative
     is the skill; a student who grabs every number in sight is the exact
     student this station is for. */
  Station.prototype.phRead2 = function () {
    var self = this, p = this.p;
    var qs = p.threeReads.read2.quantities || [];
    var needed = qs.filter(function (q) { return q.needed !== false; }).map(function (q) { return q.token; });

    var rows = qs.map(function (q) {
      var n = p.problem.numbers[q.token];
      return '<li><button class="choice" type="button" data-tok="' + q.token + '" aria-pressed="false"' +
        ' aria-label="' + esc((n ? n.value + (n.unit ? ' ' + n.unit : '') : '?') + '. ' + q.describe) + '">' +
        '<span class="marker" aria-hidden="true">&#9723;</span>' +
        '<span><strong>' + esc(n ? n.value + (n.unit ? ' ' + n.unit : '') : '?') + '</strong>' +
        '<small>' + esc(q.describe) + '</small></span></button></li>';
    }).join('');

    this.host().innerHTML =
      MrFraction.aside('steady',
        '<p><strong>Second read.</strong> The numbers are showing now &mdash; but not every number in a ' +
        'problem is there to be used.</p>') +
      this.problemHTML(false) +
      '<h3>Which of these do you actually need?</h3>' +
      '<p class="hint-text">Tap the ones the question depends on. Leave the rest.</p>' +
      '<ul class="choices" id="quants">' + rows + '</ul>' +
      '<div class="feedback" role="status" id="r2fb"></div>' +
      '<div class="btn-row"><button class="btn" id="r2go" type="button">Check these</button></div>';

    this.host().querySelector('#quants').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tok]'); if (!b) return;
      var on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      b.querySelector('.marker').innerHTML = on ? '&#9723;' : '&#9724;';
    });

    var checked = false;
    this.host().querySelector('#r2go').addEventListener('click', function () {
      if (checked) { self.go('read3'); return; }
      var picked = [].map.call(self.host().querySelectorAll('[data-tok][aria-pressed="true"]'),
        function (b) { return b.getAttribute('data-tok'); });
      var missing = needed.filter(function (t) { return picked.indexOf(t) === -1; });
      var extra   = picked.filter(function (t) { return needed.indexOf(t) === -1; });

      if (!picked.length) {
        self.host().querySelector('#r2fb').innerHTML = msg('caution', '!', 'Pick at least one first.');
        return;
      }
      if (missing.length || extra.length) {
        var say = '';
        if (extra.length)   say += '<strong>You picked something you don&rsquo;t need.</strong> ' +
          'A problem can mention a number just because it belongs to the story. ';
        if (missing.length) say += '<strong>Something you need is still unpicked.</strong> ';
        self.host().querySelector('#r2fb').innerHTML = msg('stop', '→', say +
          'Read it once more and ask: would the answer change if this number were different?');
        A11y.announce('Not quite. Try again.');
        return;
      }
      checked = true;
      self.host().querySelector('#r2fb').innerHTML = msg('go', '✓',
        '<strong>That&rsquo;s the set.</strong> ' + esc(p.threeReads.read2.relationship));
      this.textContent = 'Third read →';
      A11y.announce('Correct set of quantities.');
    });
  };

  /* Third read — pick what the question asks for.
     This used to be a textarea: type anything, then be shown the answer.
     That checks nothing — you can pass it with a single keystroke. The
     distractors here are real misreadings (answering the part instead of the
     whole, giving the leftover, restating a number you were handed), so a
     wrong pick tells the student something specific about their own reading. */
  /* Deterministic shuffle, seeded by the problem id.
     Every problem was authored with the correct option written first, so the
     answer was always at the top — a student could score full marks without
     reading. Seeding by id means the order is stable if the station re-renders
     (so it doesn't move under you mid-question) but differs per problem.

     The implementation moved into MF (data.js) once the Ratio Table needed the
     same thing and grew a second copy of it. These two are thin wrappers so the
     existing call sites below read unchanged. */
  function seedFrom(str) { return str; }
  function shuffled(arr, seed) { return MF.seededShuffle(arr, seed); }

  Station.prototype.phRead3 = function () {
    var self = this, r3 = this.p.threeReads.read3;
    var order = shuffled(r3.options || [], seedFrom(this.p.id + '|read3'));
    var opts = order.map(function (o, i) {
      return '<li><button class="choice" type="button" data-opt="' + i + '" aria-label="' + esc(o.text) + '">' +
        '<span class="marker" aria-hidden="true">&#9723;</span>' +
        '<span><strong>' + esc(o.text) + '</strong></span></button></li>';
    }).join('');

    this.host().innerHTML =
      MrFraction.aside('steady',
        '<p><strong>Third read.</strong> One job only: what is the question actually asking you to produce?</p>') +
      this.problemHTML(true) +
      '<h3>Which one is the question asking for?</h3>' +
      '<p class="hint-text">More than one of these is a real number you could work out. Only one is what was asked.</p>' +
      '<ul class="choices" id="r3opts">' + opts + '</ul>' +
      '<div class="feedback" role="status" id="r3fb"></div>';

    this.host().querySelector('#r3opts').addEventListener('click', function (e) {
      var b = e.target.closest('[data-opt]'); if (!b || b.disabled) return;
      var o = order[+b.getAttribute('data-opt')];
      if (o.correct) {
        b.setAttribute('data-result', 'right');
        var all = self.host().querySelectorAll('[data-opt]');
        for (var i = 0; i < all.length; i++) all[i].disabled = true;
        self.host().querySelector('#r3fb').innerHTML =
          msg('go', '✓', '<strong>Yes.</strong> ' + esc(o.why || r3.modelAnswer)) +
          '<div class="btn-row"><button class="btn" id="r3go" type="button">To the Ticket Booth →</button></div>';
        self.host().querySelector('#r3go').addEventListener('click', function () { self.go('ticket'); });
        A11y.announce('Correct.');
      } else {
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        self.host().querySelector('#r3fb').innerHTML = msg('stop', '→', esc(o.why ||
          'That isn’t what was asked. Read the last sentence again.'));
        A11y.announce('Not what was asked.');
      }
      focusFeedback(self.host().querySelector('#r3fb'));
    });
  };

  /* ---------- Phase 2: Ticket Booth (which car is missing) ----------
     This station used to ask "which line is this?" — but the student picked
     the line off the map two screens ago, so the answer was handed to them.
     A question you already know the answer to teaches nothing.

     Inside a themed trip the genuine, un-given-away skill is spotting WHICH
     QUANTITY IS MISSING. That is what decides the operation, and it is what
     the Switchyard and Engine Room go on to use. Every problem has always
     authored this (unknownCarPrompt / Options / Answer / Why); the UI simply
     never rendered it. Choosing among the five lines still happens, but only
     where it is honest: the Learning Hub, and the Terminus Hub when the
     problem there can come from a line you did not just ride. */

  /* WHICH LINE IS HIDING UNDER THE PERCENT — asked here, and only where asking
     it is honest.

     The rule this station was built on is that a question the student already
     answered teaches nothing: they picked the line off the map two screens ago,
     so "which line is this?" was a gift and was removed. The percent route
     changes the premise rather than the rule. A student who chose the Percent
     Line chose a SURFACE, not a situation — they have not been told which of
     the five is underneath, and finding it is the whole reason the route exists
     (ROADMAP.md §3). The same is true on the Grand Tour, where the line is
     deliberately withheld.

     So the test is not "is this a percent problem" but "did this ride already
     tell them the answer". On a themed Change ride, `ch-barrier-count` must NOT
     be asked — the station header says Change and the map card said Change.

     THE ANSWER KEY IS ALREADY IN EVERY MANIFEST and is not authored again:
     `ticketBooth.correctLine`, `whyCorrect`, and a `whyWrong` for each of the
     other four. The validator has enforced full distractor coverage since the
     beginning, so this question is derivable on every problem on the site
     (VERIFICATION.md §33) and needed no new content to switch on. */
  Station.prototype.asksHiddenLine = function () {
    return this.p.surface === 'percent' &&
           typeof this.rideLine === 'string' &&
           this.rideLine !== this.p.line;
  };

  Station.prototype.phTicket = function () {
    var self = this, tb = this.p.ticketBooth;
    var L = MF.LINES[this.p.line];
    var choices = shuffled(tb.unknownCarOptions || [], seedFrom(this.p.id + '|car'));
    var hidden = this.asksHiddenLine();

    var opts = choices.map(function (c, i) {
      return '<li><button class="choice" type="button" data-car="' + i + '"' +
        ' aria-label="' + esc(c) + '">' +
        '<span class="marker" aria-hidden="true">&#9723;</span>' +
        '<span><strong>' + esc(c.charAt(0).toUpperCase() + c.slice(1)) + '</strong></span></button></li>';
    }).join('');

    /* The five situations, in a stable shuffled order. Built from `MF.LINES`
       so a sixth schema would appear here automatically and percent — which is
       not in that object — cannot appear as an answer to itself.

       THE SALT WAS MEASURED, NOT PICKED. `|hidden|` put the correct option
       LAST on both percent problems — "always pick the bottom one" scoring
       100% against 20% by chance, which is this project's most-repeated defect
       arriving on a brand-new choice surface for the fourth time. A seeded
       shuffle is not a defence against it; it just makes the arrangement
       arbitrary rather than authored, and an arbitrary arrangement can still be
       degenerate across a small set. `|booth-line|` puts them at 2 and 4.

       Deliberately spread rather than driven off the last slot — "the answer is
       never last" is the same tell inverted (VERIFICATION.md §21). RE-MEASURE
       WHEN PERCENT PROBLEMS 3, 4 AND 5 LAND: with five problems the target is a
       flat-ish spread across five positions, not two happy numbers. */
    var lineOpts = MF.seededShuffle(Object.keys(MF.LINES), this.p.id + '|booth-line|')
      .map(function (k, i) {
        var LL = MF.LINES[k];
        return '<li><button class="choice" type="button" data-line="' + esc(k) + '"' +
          ' aria-label="' + esc(LL.name + '. ' + LL.form) + '">' +
          '<span class="marker" aria-hidden="true">' + LL.marker + '</span>' +
          '<span><strong>' + esc(LL.name) + '</strong><small>' + esc(LL.form) + '</small></span>' +
          '</button></li>';
      }).join('');

    /* THE ANSWER WAS PRINTED ABOVE THE QUESTION. This caution box names the
       line, its form and `whyCorrect` — which is the full answer to the hidden
       line question, sitting one paragraph above it. Nobody had noticed because
       until now the student always already knew the line. It is withheld until
       they have answered, and then it becomes the confirmation. */
    var lineBox =
      '<div class="msg msg-caution"><span class="ico" aria-hidden="true">' + L.marker + '</span>' +
        '<p><strong>' + esc(L.name) + ':</strong> ' + esc(L.form) + '. ' + esc(tb.whyCorrect) + '</p></div>';

    this.host().innerHTML =
      MrFraction.aside('thinking', hidden
        ? '<p><strong>You bought a ticket for the Percent Line, and I told you it isn&rsquo;t one.</strong> ' +
          'Per cent is how this story writes its numbers. Underneath it is one of the five &mdash; ' +
          'so before we go anywhere, which one?</p>'
        : '<p><strong>You know which line you&rsquo;re on. So here&rsquo;s the harder question.</strong> ' +
          'A train on this line always has the same cars &mdash; and one of them is missing.</p>') +
      /* The booth itself. This phase IS the Ticket Booth, so the art names the
         place rather than decorating it — the student is standing at a window
         being asked what they want before the train will take them. */
      '<figure class="art-band art-band-booth">' +
        Scenery.art('Mr_Fraction_Ticket_Booth.png', 'art-booth') +
        Scenery.art('Mr_Fraction_Train_Ticket.png', 'art-ticket') +
      '</figure>' +
      this.problemHTML(false) +
      (hidden
        ? '<h3>Which of the five situations is hiding under the per cent?</h3>' +
          '<ul class="choices" id="hidden-line">' + lineOpts + '</ul>' +
          '<div class="feedback" role="status" id="hlfb"></div>' +
          '<div id="carq" hidden>' + lineBox +
            '<h3>' + esc(tb.unknownCarPrompt || 'Which car is missing?') + '</h3>' +
            '<ul class="choices" id="cars">' + opts + '</ul>' +
            '<div class="feedback" role="status" id="tbfb"></div>' +
          '</div>'
        : lineBox +
          '<h3>' + esc(tb.unknownCarPrompt || 'Which car is missing?') + '</h3>' +
          '<ul class="choices" id="cars">' + opts + '</ul>' +
          '<div class="feedback" role="status" id="tbfb"></div>');

    if (hidden) {
      var lineTries = 0;
      this.host().querySelector('#hidden-line').addEventListener('click', function (e) {
        var b = e.target.closest('[data-line]');
        if (!b || b.disabled) return;
        var picked = b.getAttribute('data-line');
        lineTries++;
        var fb = self.host().querySelector('#hlfb');

        if (picked === (tb.correctLine || self.p.line)) {
          [].forEach.call(self.host().querySelectorAll('#hidden-line [data-line]'),
            function (x) { x.disabled = true; });
          b.setAttribute('data-result', 'right');
          fb.innerHTML = msg('go', '✓', '<strong>That is the one underneath.</strong> ' +
            esc(tb.whyCorrect));
          /* Only now does the box naming the line appear, and with it the
             question this station has always asked. */
          self.host().querySelector('#carq').hidden = false;
          A11y.announce('Correct. ' + tb.whyCorrect);
        } else {
          b.setAttribute('data-result', 'wrong');
          b.disabled = true;
          var d = (tb.distractors || []).filter(function (x) { return x.line === picked; })[0];
          fb.innerHTML = msg('stop', '→', '<strong>Not that one.</strong> ' +
            esc(d ? d.whyWrong : 'Read the story again and ask what is actually happening in it.'));
          A11y.announce('Not that one.');
        }
        focusFeedback(fb);
      });
    }

    this.host().querySelector('#cars').addEventListener('click', function (e) {
      var b = e.target.closest('[data-car]');
      if (!b || b.disabled) return;
      var picked = choices[+b.getAttribute('data-car')];
      self.schemaTries++;

      if (picked === tb.unknownCarAnswer) {
        if (self.schemaTries === 1) self.m.schemaFirstTry++;
        self.m.schemaAttempts.push(self.schemaTries);
        b.setAttribute('data-result', 'right');
        var all = self.host().querySelectorAll('[data-car]');
        for (var i = 0; i < all.length; i++) all[i].disabled = true;
        self.host().querySelector('#tbfb').innerHTML =
          msg('go', '✓', '<strong>That&rsquo;s the one.</strong> ' + esc(tb.unknownCarWhy || '')) +
          '<div class="btn-row"><button class="btn" id="tbgo" type="button">On to the plan →</button></div>';
        self.host().querySelector('#tbgo').addEventListener('click', function () { self.go('plan'); });
        A11y.announce('Correct. That is the missing car.');
      } else {
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        var body = '<strong>That one you already know.</strong> Read it again and ask which ' +
                   'number the question is actually asking you to produce.';
        var support = '';
        if (self.schemaTries >= 2) {
          support = msg('caution', '⚑', '<strong>Try it this way.</strong> ' +
            'Cover each option with your finger. If the problem already tells you that number, ' +
            'it isn&rsquo;t the missing one.');
        }
        self.host().querySelector('#tbfb').innerHTML = msg('stop', '→', body) + support;
        A11y.announce('Not that one. Try again.');
      }
      focusFeedback(self.host().querySelector('#tbfb'));
    });
  };

  /* ---------- Phase 3: Plan (bar model + estimate) ---------- */

  Station.prototype.phPlan = function () {
    var self = this, sb = this.p.signalBox;
    /* Ask the MODEL LAYER whether there is a picture, rather than testing for
       a Part–Whole bar here. This used to read barModel.bars[0], which was
       true of every problem written at the time — the ratio problems included,
       because they all kept a bar alongside their table. A line that brings
       its own picture and no bar would have rendered an empty Plan phase and
       raised nothing. */
    var bar = Model.applies(this.p);
    var bars = bar ? Model.html(this.p) : '';

    var est = sb && sb.estimate;
    this.host().innerHTML =
      MrFraction.aside('thinking',
        '<p><strong>Before you calculate.</strong> An estimate gives you something to check against. ' +
        'Without one, a wrong answer looks exactly like a right one.</p>') +
      this.problemHTML(false) + bars +
      '<h3>Commit to an estimate</h3>' +
      '<p>' + esc(est ? est.prompt : 'Roughly what do you think the answer will be?') + '</p>' +
      '<div class="field" style="max-width:320px">' +
        '<label for="estv">My estimate' + (est && est.unit ? ' (' + esc(est.unit) + ')' : '') +
        '<span class="hint-text">It doesn&rsquo;t have to be good. It has to exist.</span></label>' +
        '<input type="text" id="estv" inputmode="decimal">' +
      '</div>' +
      '<div class="feedback" role="status" id="pfb"></div>' +
      '<div class="btn-row"><button class="btn" id="pgo" type="button">Lock it in →</button></div>';

    if (bar) Model.wire(this.host(), this.p);

    var locked = false;
    this.host().querySelector('#pgo').addEventListener('click', function () {
      if (locked) { self.go(self.nextAfterPlan()); return; }
      var raw = self.host().querySelector('#estv').value;
      var v = MF.parseAnswer(raw);
      if (v === null) {
        self.host().querySelector('#pfb').innerHTML = msg('caution', '!',
          'Put a number in &mdash; any number you think is in the right area.');
        self.host().querySelector('#estv').focus();
        return;
      }
      locked = true;
      self.estimate = v;
      /* Keep what they actually typed. The Arrivals Board used to show the
         PARSED value, so a student who estimated "7/20" was asked whether it
         matched an answer of "7/20" while being shown their own estimate as
         "0.35" — a comparison that needs the conversion they have not been
         asked to do yet. Compare like with like. */
      self.estimateRaw = String(raw).trim();
      self.m.estimates.push({ id: self.p.id, estimate: v });
      var reasoning = est && est.modelReasoning
        ? '<br><br><strong>One way to think about it:</strong> ' + esc(est.modelReasoning) : '';
      self.host().querySelector('#pfb').innerHTML = msg('go', '✓',
        'Estimate locked in: <strong>' + esc(raw) + '</strong>. Hold on to that.' + reasoning);
      this.textContent = (global.TestTrack && TestTrack.applies(self.p))
        ? 'To the Test Track →' : 'To the Engine Room →';
    });
  };

  /* ---------- Phase 3b: The Test Track — watch the move before you make it ----

     REPLACED THE JUNCTION (2026-08-02). The Junction filled this slot with a
     prose route choice: no interaction, no motion, and on a struggling
     student's screen not much to think about. It sat between the estimate and
     the Engine Room on seven problems, and three more had nothing there at all.

     The Test Track is the same slot done properly — an animated, interactive
     demonstration of the strategy, with the route choice folded in so that
     picking the move and watching it play out are one act. See
     `assets/js/testtrack.js` for the three kinds and, more importantly, for
     how each one avoids performing the move on the student's own numbers.

     Ungraded on purpose, exactly as the Junction was: a wrong pick is answered
     and the student picks again. Problems with real work already between the
     estimate and the answer do not define a testTrack and skip this. */

  Station.prototype.nextAfterPlan = function () {
    return (global.TestTrack && TestTrack.applies(this.p)) ? 'demo' : 'solve';
  };

  Station.prototype.phDemo = function () {
    var self = this;
    this.host().innerHTML =
      MrFraction.aside('thinking',
        '<p><strong>Before you calculate.</strong> You have a rough idea of the size of the answer. ' +
        'Now watch what the move actually does &mdash; then you will do it yourself.</p>') +
      this.problemHTML(false) +
      TestTrack.html(this.p) +
      '<div class="btn-row" id="drow" hidden>' +
        '<button class="btn" id="dgo" type="button">To the Engine Room →</button></div>';

    var host = this.host();
    /* Wired in BOTH places — html() above and wire() here. A model added to one
       and not the other renders a picture whose buttons do nothing, which is
       exactly what Cycle 9 shipped and had to fix. */
    TestTrack.wire(host, this.p, function () {
      host.querySelector('#drow').hidden = false;
    });
    host.querySelector('#dgo').addEventListener('click', function () { self.go('solve'); });
  };

  /* ---------- Phase 4a: Engine Room ---------- */

  Station.prototype.phSolve = function () {
    var self = this;
    var steps = (this.p.engineRoom && this.p.engineRoom.steps) || [];
    var step = steps[this.stepIndex];
    if (!step) { this.go('check'); return; }
    this.hintRung = 0;

    /* NO WORKED EXAMPLE ON THIS SCREEN. It used to print
       `step.workedExplanation` above the input whenever `fadeLevel === 'worked'`
       — and that string is the same one shown as the confirmation AFTER a
       correct answer, so it contained the answer. "The top number says how many
       of those to take: 3 × 3 = 9 cups", directly above a box asking how many
       cups. Three problems, all four sets each: 26 screens. User-found.

       The worked-example rung of the fade (Pedagogy §1.7) is not lost — it moved
       to where it already was and belongs. All three of these problems run a
       TEST TRACK one screen earlier, which demonstrates the same strategy on
       DIFFERENT numbers: soup on threes and twos, posters on 4-5-8-10. That is
       a worked example that cannot hand over this problem's answer, which is
       exactly the distinction. `workedExplanation` still runs, as the
       confirmation once the student has answered. */
    var worked = this.p.engineRoom.fadeLevel === 'worked' && this.stepIndex === 0;

    /* LOOK BACK COULD ONLY EVER RUN ON A CORRECT ANSWER, AND THAT MADE IT A
       FORMALITY. `stepDone` below flips only when `MF.checkAnswer` says ok, so
       `go('check')` was unreachable with a wrong value — the student could not
       leave this screen until they were right. The Arrivals Board therefore
       always opened on an answer already known to be correct, and its first
       question, "does it match your estimate?", could never be the thing that
       caught anything. The site's own flagship scenario — estimated 40,
       computed 400, spotted it — was impossible to reach. Cycle 15 review.

       So there is a way through with a wrong answer, and three constraints on
       it, because a bad version of this is worse than the bug:

       LAST STEP ONLY. The estimate is an estimate of the FINAL answer. Offering
       this on step one of two would ask a student to compare an intermediate
       value against an estimate of something else, which is not a check, it is
       a trick question.

       EARNED, NEVER FREE. Revealed only once the student has genuinely tried —
       the whole hint ladder read, or three wrong answers. A button that is
       there from the start is a bypass, and a gate that opens to the laziest
       input checks nothing (VERIFICATION.md §4).

       AND IT IS NOT AN EXIT. The board it leads to offers one way onward: back
       to here. Nobody escapes the Engine Room by this route, and nobody is
       trapped by it either — measured across all 27 problems, every one of the
       140 steps ends its hint ladder by stating the answer outright, so a
       student who cannot get there always has a way and this is a detour rather
       than a dead end. */
    var lastStep = this.stepIndex === steps.length - 1 && this.estimate !== null;

    this.host().innerHTML =
      MrFraction.aside('thinking', '<p><strong>Step ' + (this.stepIndex + 1) + ' of ' + steps.length + '.</strong> ' +
        (worked ? 'You have just seen how this kind works, on different numbers. These ones are yours.'
                : 'Take it one step at a time.') + '</p>') +
      this.problemHTML(false) +
      '<h3>' + esc(step.prompt) + '</h3>' +
      '<div class="field" style="max-width:320px">' +
        '<label for="ans">Your answer' + (step.answer.unit ? ' (' + esc(step.answer.unit) + ')' : '') + '</label>' +
        '<input type="text" id="ans" inputmode="decimal">' +
      '</div>' +
      '<div class="feedback" role="status" id="sfb"></div>' +
      '<div class="btn-row">' +
        '<button class="btn" id="sgo" type="button">Check this step</button>' +
        '<button class="btn btn-quiet" id="shint" type="button">I&rsquo;d like a hint</button>' +
        /* THE WAY TO THE ARRIVALS BOARD WITH AN ANSWER THAT IS NOT RIGHT.
           Hidden until earned — see the note on `offerBoard` below. */
        (lastStep
          ? '<button class="btn btn-quiet" id="stakeit" type="button" hidden>' +
            'Take it to the arrivals board &rarr;</button>'
          : '') +
      '</div>' +
      '<div class="hints" id="hints"></div>';

    /* Reveal the board route once it has been earned, from either direction —
       the ladder run out, or three wrong answers. Called from both handlers so
       neither has to know about the other's counter. */
    var wrongTries = 0;
    function offerBoard() {
      var b = self.host().querySelector('#stakeit');
      if (!b || !b.hidden) return;
      var hints = step.hints || [];
      if (wrongTries < 3 && self.hintRung < hints.length) return;
      b.hidden = false;
      A11y.announce('You can also take the answer you have to the arrivals board and check it against your estimate.');
    }

    this.host().querySelector('#shint').addEventListener('click', function () {
      var hints = step.hints || [];
      if (self.hintRung >= hints.length) { this.disabled = true; return; }
      var h = hints[self.hintRung++];
      self.m.hints.push({ id: self.p.id, rung: h.rung });
      var box = self.host().querySelector('#hints');
      box.insertAdjacentHTML('beforeend',
        '<div class="hint-rung"><span class="rung-name">' + esc(RUNGS[h.rung] || 'HINT').toUpperCase() +
        '</span>' + esc(h.text) + '</div>');
      A11y.announce('Hint ' + h.rung + '. ' + h.text);
      if (self.hintRung >= hints.length) { this.disabled = true; offerBoard(); }
    });

    if (lastStep) {
      this.host().querySelector('#stakeit').addEventListener('click', function () {
        var raw = self.host().querySelector('#ans').value;
        var v = MF.parseAnswer(raw);
        if (v === null) {
          self.host().querySelector('#sfb').innerHTML = msg('caution', '!',
            'Put the answer you have got in the box first &mdash; the board checks YOUR number, ' +
            'and there is nothing to check without one.');
          self.host().querySelector('#ans').focus();
          return;
        }
        self.solved = v;
        self.solvedRaw = String(raw).trim();
        /* The flag the Arrivals Board branches on. Set here rather than
           inferred there, because "is this right" is a question only
           `checkAnswer` should answer and only once. */
        self.solvedWrong = true;
        self.go('check');
      });
    }

    var stepDone = false;
    this.host().querySelector('#sgo').addEventListener('click', function () {
      var raw = self.host().querySelector('#ans').value;
      var fb = self.host().querySelector('#sfb');

      if (stepDone) {
        self.stepIndex++;
        if (self.stepIndex < steps.length) self.phSolve();
        else {
          self.solved = MF.parseAnswer(raw);
          self.solvedRaw = String(raw).trim();
          self.solvedWrong = false;      // arrived the ordinary way, with it right
          self.go('check');
        }
        return;
      }
      if (!raw.trim()) { fb.innerHTML = msg('caution', '!', 'Put your answer in first.'); return; }

      var res = MF.checkAnswer(raw, step.answer);
      if (res.ok) {
        stepDone = true;
        var note = res.note ? '<br><br>' + esc(res.note) : '';
        fb.innerHTML = msg('go', '✓', '<strong>That&rsquo;s it.</strong> ' +
          esc(step.workedExplanation) + note);
        this.textContent = self.stepIndex + 1 < steps.length ? 'Next step →' : 'To the Arrivals Board →';
        self.host().querySelector('#shint').disabled = true;
        A11y.announce('Correct.');
      } else {
        var mis = MF.matchMisconception(raw, step.misconceptions);
        if (mis) {
          self.m.misconceptions.push(mis.tag);
          fb.innerHTML = msg('stop', '→', esc(mis.diagnosis));
        } else if (res.reason === 'scale') {
          fb.innerHTML = msg('caution', '→',
            'You&rsquo;ve got the right digits but the wrong scale &mdash; check whether you want a percent or a decimal.');
        } else if (res.reason === 'unparsed') {
          fb.innerHTML = msg('caution', '!', 'I couldn&rsquo;t read that as a number. Try something like 12, 3/4, 0.75 or 75%.');
        } else {
          fb.innerHTML = msg('stop', '→',
            'Not this time. Look back at what this step is asking for &mdash; and there&rsquo;s a hint if you want one.');
        }
        wrongTries++;
        offerBoard();
        A11y.announce('Not correct. Feedback shown.');
      }
    });
  };

  /* ---------- Phase 4b: Arrivals Board (Look Back) ---------- */

  /* ---------- The Arrivals Board, arrived at UNSURE ----------

     What this screen may and may not do is the whole design, so it is worth
     stating both.

     IT MAY NOT PRINT THE ANSWER. The ordinary board opens with "the answer is
     550 passengers", which is right when the student has already produced 550
     and ruinous when they have not — it would answer the question they came
     here to check. So this screen shows the student's OWN two numbers and
     nothing else, and the arithmetic checks that assume a correct answer
     (`reasonablenessCheck`, the Signal Failure, `connection`) stay behind on
     the ordinary board where they are true.

     IT MAY NOT GRADE. It never says "that is wrong". It asks the one question a
     student can genuinely answer for themselves — do these two numbers agree? —
     and lets the disagreement do the teaching. That is Polya's fourth step
     working as designed, and it is the first time this site has been able to
     run it.

     IT IS NOT AN EXIT. One control, and it goes back to the Engine Room.

     THE CASE IT CANNOT CATCH, stated rather than hidden: an answer that is
     wrong but still in the estimate's ballpark passes this screen. Nothing here
     can catch that without revealing the answer, which is the one thing this
     screen may not do. The hint ladder is the route for that student. */
  Station.prototype.phCheckUnsure = function () {
    var self = this, a = this.p.arrivals;
    var est = this.estimate, mine = this.solved;

    /* "Same ballpark" as a rule the student can apply themselves, rather than a
       threshold only the software knows: one number more than DOUBLE the other
       is a disagreement. It catches the scale slips this check exists for —
       estimated forty, computed four hundred — and forgives the ordinary
       looseness of an estimate. Stated in the copy below, so the student is
       being taught the rule and not marked against a secret one. */
    var lo = Math.min(Math.abs(est), Math.abs(mine));
    var hi = Math.max(Math.abs(est), Math.abs(mine));
    var agree = lo > 0 ? hi < lo * 2 : hi === 0;

    this.host().innerHTML =
      MrFraction.aside('thinking', '<p><strong>Not sure about it?</strong> ' +
        'Good &mdash; that is what this board is for. Bring it here before you commit it.</p>') +
      '<figure class="art-band art-band-end">' +
        Scenery.art('Mr_Fraction_Caboose.png', 'art-caboose') +
      '</figure>' +
      '<h3>Does your answer agree with your own estimate?</h3>' +
      '<p>Back at the Estimation Tower you said about <strong>' +
        esc(this.estimateRaw || est) + '</strong>. ' +
        'You have worked out <strong>' + esc(this.solvedRaw || mine) + '</strong>.</p>' +
      '<p class="hint-text">A rough rule you can use anywhere: if one of them is more than ' +
        'twice the other, they do not agree, and one of the two is wrong.</p>' +
      '<ul class="choices" id="unsck">' +
        '<li><button class="choice" type="button" data-v="yes" ' +
          'aria-label="Yes, they are in the same area"><span><strong>Yes &mdash; they are in the same area</strong></span></button></li>' +
        '<li><button class="choice" type="button" data-v="no" ' +
          'aria-label="No, they do not agree"><span><strong>No &mdash; they don&rsquo;t agree</strong></span></button></li>' +
      '</ul>' +
      '<div class="feedback" role="status" id="unsfb"></div>' +
      '<div id="unsrest" hidden>' +
        '<h3>The other two you can check without me</h3>' +
        '<p><strong>Did you answer the question that was asked?</strong> ' + esc(a.questionCheck) + '</p>' +
        '<p><strong>Units.</strong> The answer wants to be in <strong>' + esc(a.unitsCheck) +
          '</strong>. Is yours?</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="backtoer" type="button">&larr; Back to the Engine Room</button>' +
        '</div>' +
      '</div>';

    this.host().querySelector('#unsck').addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var said = b.getAttribute('data-v') === 'yes';
      var right = said === agree;
      /* Spotting your own mismatch is the skill this station exists for, so it
         counts on the trip report exactly as it does on the ordinary board. */
      if (right) self.m.selfChecks++;

      var all = self.host().querySelectorAll('#unsck [data-v]');
      for (var i = 0; i < all.length; i++) all[i].disabled = true;
      b.setAttribute('data-result', right ? 'right' : 'wrong');

      var text;
      if (agree && right) {
        text = '<strong>Agreed &mdash; so whatever is bothering you, it is not the size.</strong> ' +
               'Your two numbers are in the same area, which rules out a slipped decimal point or a ' +
               'stray nought. Check the other two below, then take it back and commit it.';
      } else if (agree) {
        text = 'Look again &mdash; those two are closer than you think. Neither is more than twice ' +
               'the other, so as far as size goes they do agree.';
      } else if (right) {
        text = '<strong>That is the catch, and it is the whole point of this board.</strong> ' +
               'Your estimate and your answer are not in the same area, so one of them is wrong &mdash; ' +
               'and you found that yourself, without being told. Go back and look for a step where the ' +
               'size jumped.';
      } else {
        text = 'Put them side by side once more. One of those really is more than twice the other, ' +
               'and that is worth noticing rather than shrugging at.';
      }
      self.host().querySelector('#unsfb').innerHTML =
        msg(right ? 'go' : 'caution', right ? '✓' : '→', text);
      self.host().querySelector('#unsrest').hidden = false;
      A11y.announce(right ? 'Checked.' : 'Have another look.');
      focusFeedback(self.host().querySelector('#unsfb'));

      self.host().querySelector('#backtoer').addEventListener('click', function () {
        self.solvedWrong = false;
        self.go('solve');
      });
    });

    if (this.expandAll) {
      var r = this.host().querySelector('#unsrest');
      if (r) r.hidden = false;
    }
  };

  Station.prototype.phCheck = function () {
    /* Arrived here unsure, with an answer that is not right. Different screen,
       and the reasons are on it. */
    if (this.solvedWrong) { this.phCheckUnsure(); return; }

    var self = this, a = this.p.arrivals;
    var actual = MF.parseAnswer(a.answer.exact);
    var est = this.estimate;
    var sb = this.p.signalBox && this.p.signalBox.estimate;
    var inRange = sb ? (est >= sb.reasonableMin && est <= sb.reasonableMax) : null;

    /* The Signal Failure — rendered HERE and only here (see PROBLEM-SCHEMA 8).
       It was authored on nine problems and read by no code at all until now,
       which is why its placement got decided twice: it SAT inside signalBox
       (the Plan screen, phase 3) while being written for after the solve. Six
       of the nine name the operation or the direction outright and one
       (cp-hot-drinks) states a step answer, so on the Plan screen the field
       would have handed over the very thinking the Engine Room asks for. It is
       a top-level field now so that its position in the manifest matches the
       only phase that may render it.

       `trigger` is deliberately NOT rendered. It is authoring metadata and it
       is not uniform: five problems tag a keyword ("more", "each", "and"),
       three tag a property of the answer ("smaller", "bigger", "divide"). Any
       single label over it — "the word that tricked you" — would be a lie on
       a third of them. The prompt names the trap in prose instead. */
    var sf = this.p.signalFailure;

    this.host().innerHTML =
      MrFraction.aside('steady', '<p><strong>Arrivals board.</strong> ' +
        'This is the stop everyone skips. It&rsquo;s also the one that catches mistakes.</p>') +
      /* The caboose is the last car on the train, which is exactly what this
         phase is — the end of the trip, looking back down it. */
      '<figure class="art-band art-band-end">' +
        Scenery.art('Mr_Fraction_Caboose.png', 'art-caboose') +
      '</figure>' +
      '<h3>1. Does it match your estimate?</h3>' +
      '<p>You estimated <strong>' + esc(est === null ? '—' : (this.estimateRaw || est)) + '</strong>. ' +
        'The answer is <strong>' + esc(a.answer.exact) + ' ' + esc(a.answer.unit || '') + '</strong>.</p>' +
      '<ul class="choices" id="estck">' +
        '<li><button class="choice" type="button" data-v="yes" aria-label="Yes, my estimate was in the right area">' +
          '<span><strong>Yes &mdash; my estimate was in the right area</strong></span></button></li>' +
        '<li><button class="choice" type="button" data-v="no" aria-label="No, they do not match">' +
          '<span><strong>No &mdash; they don&rsquo;t match</strong></span></button></li>' +
      '</ul>' +
      '<div class="feedback" role="status" id="ckfb"></div>' +
      '<div id="rest" hidden>' +
        '<h3>2. Did you answer the question that was asked?</h3>' +
        '<p>' + esc(a.questionCheck) + '</p>' +
        '<h3>3. Units</h3>' +
        '<p>The answer is in <strong>' + esc(a.unitsCheck) + '</strong>. Did yours have that label?</p>' +
        '<h3>4. Is it reasonable?</h3>' +
        '<p>' + esc(a.reasonablenessCheck) + '</p>' +
        (a.reasonablenessFailExample ? '<p class="hint-text">' + esc(a.reasonablenessFailExample) + '</p>' : '') +
        /* The `why` stays behind a click on purpose. The prompt is a real
           question, and a student who reads the explanation off the same
           screen has not been asked anything — the same reason the Test
           Track's worked example hides behind "Show me". */
        (sf ? '<h3>5. The signal that failed</h3>' +
              '<p>' + esc(sf.prompt) + '</p>' +
              '<div class="btn-row">' +
                '<button class="btn" id="sfgo" type="button" aria-controls="sffb" aria-expanded="false">' +
                  'Show me why &rarr;</button>' +
              '</div>' +
              '<div class="feedback" role="status" id="sffb"></div>'
            : '') +
        (a.connection ? msg('info', '◆', '<strong>Worth remembering:</strong> ' + esc(a.connection)) : '') +
        '<div class="btn-row"><button class="btn" id="donebtn" type="button">Leave the station →</button></div>' +
      '</div>';

    /* Bound at render time, not inside the #estck handler where #donebtn is
       bound. The node exists from the moment innerHTML is set — it is inside
       #rest, which is `hidden`, and a hidden element takes listeners fine. */
    if (sf) {
      this.host().querySelector('#sfgo').addEventListener('click', function () {
        this.disabled = true;
        this.setAttribute('aria-expanded', 'true');
        var box = self.host().querySelector('#sffb');
        box.innerHTML = msg('info', '◆', esc(sf.why));
        A11y.announce('Explanation shown.');
        focusFeedback(box);
      });
    }

    this.host().querySelector('#estck').addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var said = b.getAttribute('data-v') === 'yes';
      var truth = inRange === null ? said : inRange;
      var correct = said === truth;
      if (correct) self.m.selfChecks++;

      var all = self.host().querySelectorAll('#estck [data-v]');
      for (var i = 0; i < all.length; i++) all[i].disabled = true;
      b.setAttribute('data-result', correct ? 'right' : 'wrong');

      var text = correct
        ? (truth ? '<strong>Right &mdash; and that&rsquo;s worth noticing.</strong> Your estimate and your answer agree, which is good evidence you didn&rsquo;t slip somewhere.'
                 : '<strong>Good catch.</strong> Spotting that your estimate and answer disagree is exactly the skill this station is for. It means you&rsquo;d have known to check.')
        : 'Look at the two numbers again side by side. Are they in the same ballpark or not?';
      self.host().querySelector('#ckfb').innerHTML = msg(correct ? 'go' : 'caution', correct ? '✓' : '→', text);
      self.host().querySelector('#rest').hidden = false;
      A11y.announce(correct ? 'Checked.' : 'Have another look.');
      focusFeedback(self.host().querySelector('#ckfb'));

      self.host().querySelector('#donebtn').addEventListener('click', function () {
        self.m.stationsDone++;
        self.onComplete();
      });
    });

    if (this.expandAll) {
      /* Test scaffolding, and not optional. Section 5 lives inside #rest, which
         is hidden until the estimate check is answered, and its `why` sits
         behind a second click on top of that. Without this the sweep renders
         phCheck, reports it clean, and has read NONE of the Signal Failure —
         the same shape as the two planted defects in read1.modelAnswer that
         both came back NOT CAUGHT (sweep.js header). A check pointed at the
         old place is this project's most-repeated defect; this one is pointed
         at a place that would never have existed.

         #rest is revealed directly rather than by clicking #estck, because
         that handler does `self.m.selfChecks++` and the sweep passes {}. */
      var rest = this.host().querySelector('#rest');
      if (rest) rest.hidden = false;
      var sfb = this.host().querySelector('#sfgo');
      if (sfb) sfb.click();
    }
  };

  /* ---------- helpers ---------- */

  function msg(kind, ico, html) {
    var cls = { go: 'msg-go', stop: 'msg-stop', caution: 'msg-caution', info: '' }[kind] || '';
    return '<div class="msg ' + cls + '"><span class="ico" aria-hidden="true">' + ico + '</span><p>' + html + '</p></div>';
  }

  global.Stations = { Station: Station, msg: msg, esc: esc, el: el };
})(window);
