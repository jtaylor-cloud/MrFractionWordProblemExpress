/* ============================================================
   Content registry + answer checking.

   NOTE ON FILE FORMAT
   The schema doc describes problems as JSON. They are stored as
   .js files that call MF.registerProblem({...}) with a plain JSON
   object literal, because fetch() is blocked on file:// URLs and
   the project requires the site to run by double-clicking
   index.html with no server. The object inside is exactly the
   documented schema — only the wrapper differs.
   ============================================================ */
(function (global) {
  'use strict';

  var problems = {};
  var hubs = {};

  var LINES = {
    change:    { name: 'The Change Line',      marker: '●', form: 'Start ± Change = Result',
                 desc: 'Something starts, something happens, something ends.' },
    compare:   { name: 'The Compare Line',     marker: '■', form: 'Larger − Smaller = Difference',
                 desc: 'Two quantities, side by side.' },
    groups:    { name: 'Equal Groups Express', marker: '▲', form: 'Groups × Size = Total',
                 desc: 'The same amount, repeated.' },
    ratio:     { name: 'The Ratio & Rate Rail',marker: '◆', form: 'Rate × Time = Distance',
                 desc: 'A fixed relationship, scaled up or down.' },
    partwhole: { name: 'The Part–Whole Loop', marker: '⬢', form: 'Part + Part = Whole',
                 desc: 'Pieces that make up a total.' }
  };

  /* A ride across every line, rather than along one.
     Deliberately NOT an entry in LINES: that object is the five schemas, and
     everything iterating it — the map, the route key, the Ticket Booth
     distractors, the validator's `unknown line` check — would gain a sixth
     phantom line the moment it were added there. A mixed ride is a way of
     travelling, not a place. */
  var MIXED = 'mixed';
  var MIXED_INFO = {
    name: 'The Grand Tour', marker: '✳',
    form: 'Any situation, any stop',
    desc: 'Stops drawn from every line. You will not know which situation is coming.'
  };

  /* PERCENT IS A ROUTE, NOT A SIXTH LINE, and it is kept out of `LINES` for
     exactly the reason MIXED is — everything that iterates that object would
     gain a sixth phantom schema the moment it were added: the map, the route
     key, the Ticket Booth's distractor coverage, `PLATFORM`, the Platform
     Check's answer arrays, and the validator's "unknown line" rule. Adding it
     there is also the one thing ROADMAP.md §3 spent a page rejecting: percent
     is a way of WRITING a number, and the five are situation structures, so
     putting it beside them is a category error the site is otherwise careful
     about.

     What it gets instead is everything a line has on the map — a card, a
     colour, a marker — and a pool drawn by `surface`, not by `line`. A problem
     on this route keeps its real schema, and the Ticket Booth asks the student
     to find it. That is the hybrid from §3: percent gets its own front door,
     and arriving at it is the START of the question rather than the end. */
  var PERCENT = 'percent';
  var PERCENT_INFO = {
    name: 'The Percent Line', marker: '%',
    form: 'Per cent = per hundred',
    desc: 'Not a sixth situation. Percent is a way of writing a number, and it can sit on top of any of the five — so every stop here is hiding one of them.'
  };

  /** Describe a ride: one line, the mixed tour, or the percent route. */
  function rideInfo(k) {
    return k === MIXED ? MIXED_INFO : k === PERCENT ? PERCENT_INFO : LINES[k];
  }

  /** Every published problem wearing the percent surface. */
  function percentProblems() {
    return publishedProblems().filter(function (p) { return p.surface === 'percent'; });
  }

  var STATIONS = {
    reading:    { name: 'The Reading Room',      strategy: 'Read it three times, each with a different job.' },
    drafting:   { name: 'The Drafting Table',    strategy: 'Draw the relationship before you calculate it.' },
    estimation: { name: 'The Estimation Tower',  strategy: 'Decide roughly what the answer should be first.' },
    switchyard: { name: 'The Switchyard',        strategy: 'Work out which operation, and which direction.' },
    signalbox:  { name: 'The Signal Box',        strategy: 'Spot the words that send you down the wrong track.' }
  };

  function registerProblem(p) {
    if (!p || !p.id) { console.warn('Problem missing id', p); return; }
    // Gate: nothing unreviewed reaches a student. See PROCESS.md.
    problems[p.id] = p;
  }
  function registerHub(h) { if (h && h.id) hubs[h.id] = h; }

  function publishedProblems() {
    return Object.keys(problems)
      .map(function (k) { return problems[k]; })
      .filter(function (p) { return p.status === 'published'; });
  }

  /* ---------- Number sets: the same problem, different numbers ----------

     A problem may carry `numberSets`: 3–5 hand-picked sets of values, one of
     which is chosen per ride. Hand-picked rather than generated, because a
     random number generator produces seven people sharing thirteen pizzas —
     the arithmetic works and the story stops making sense.

     THE HARD PART IS NOT THE NUMBERS, IT IS EVERYTHING DOWNSTREAM. A single
     problem mentions its values in the worked explanation, the hint ladder,
     every misconception response, the bar model, the ratio table, the
     estimate bracket and the reasonableness checks — 56 lines carry digits in
     `rr-poster-run` alone. Change `problem.numbers` and leave those, and the
     problem contradicts itself in a dozen places at once.

     So a set supplies the values AND the results that cannot be inferred from
     them (answers, misconception responses, the estimate bracket), and every
     other mention is written as a {{token}} that is filled in from those.
     Authors state answers here exactly as they already do in a single-set
     problem; `validate()` re-checks every set independently.

     `problem.text` and `problem.sentences` are deliberately NOT filled: they
     keep their {{n1}} tokens so `renderText` can still mask numbers for the
     numberless first read. Everything else is materialised. */

  /* The only two top-level fields materialize() must leave alone, and so the
     only two the unfilled-token scan must not read.

     `problem` is filled separately, because problem.text and problem.sentences
     KEEP their {{n1}} tokens on purpose — renderText masks them for the
     numberless first read, so a filled one would defeat Read 1 entirely.
     `numberSets` is the source the values are filled FROM; filling it would be
     rewriting the answer key with the answers. Everything else gets filled,
     whether or not anyone remembered to name it. */
  var UNFILLED_BY_DESIGN = ['problem', 'numberSets'];

  function numberSetsOf(p) {
    return (p && p.numberSets && p.numberSets.length) ? p.numberSets : null;
  }
  function setCount(p) { var s = numberSetsOf(p); return s ? s.length : 1; }

  function fillTokens(str, ctx) {
    return str.replace(/\{\{([a-zA-Z][\w]*)\}\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(ctx, key) ? String(ctx[key]) : m;
    });
  }

  /* Walk every string in the manifest and fill its tokens, leaving the two
     fields that must keep theirs. */
  function fillDeep(node, ctx, skip) {
    if (typeof node === 'string') return fillTokens(node, ctx);
    if (Array.isArray(node)) return node.map(function (x) { return fillDeep(x, ctx, null); });
    if (node && typeof node === 'object') {
      var out = {};
      Object.keys(node).forEach(function (k) {
        out[k] = (skip && skip.indexOf(k) !== -1) ? node[k] : fillDeep(node[k], ctx, null);
      });
      return out;
    }
    return node;
  }

  /**
   * Produce the problem as a student would meet it, using set `i`.
   * A problem with no numberSets is returned unchanged.
   */
  function materialize(p, i) {
    var sets = numberSetsOf(p);
    if (!sets) return p;
    var set = sets[((i % sets.length) + sets.length) % sets.length];
    var clone = JSON.parse(JSON.stringify(p));

    Object.keys(set.numbers || {}).forEach(function (k) {
      var slot = clone.problem.numbers[k];
      if (!slot) return;
      slot.value = String(set.numbers[k]);
      slot.spoken = String((set.spoken && set.spoken[k]) || set.numbers[k]);
    });

    var ctx = {};
    Object.keys(clone.problem.numbers).forEach(function (k) { ctx[k] = clone.problem.numbers[k].value; });
    Object.keys(set.derived || {}).forEach(function (k) { ctx[k] = set.derived[k]; });

    clone.problem = fillDeep(clone.problem, ctx, ['text', 'sentences']);
    /* Discovered, not listed. This used to name six fields outright —
       threeReads, ticketBooth, signalBox, engineRoom, arrivals, scene — and a
       field missing from that list was silently never filled, with nothing
       anywhere saying so. That is exactly what happened to `signalFailure`:
       authored on nine problems, top-level on pw-quilt-colors, and its
       {{trapFrac}} would have reached the screen as four literal braces the
       moment anything rendered it. The identical list appears a second time in
       validate()'s unfilled-token scan, so the checker shared the blind spot
       it was supposed to catch.

       Both now derive from UNFILLED_BY_DESIGN, so they cannot drift apart, and
       a new top-level field is covered by both without anyone remembering to
       add it. */
    Object.keys(clone).forEach(function (k) {
      if (UNFILLED_BY_DESIGN.indexOf(k) !== -1) return;
      clone[k] = fillDeep(clone[k], ctx, null);
    });

    // Numeric fields cannot carry tokens, so a set states them outright.
    if (set.estimate && clone.signalBox && clone.signalBox.estimate) {
      if (set.estimate.min != null) clone.signalBox.estimate.reasonableMin = set.estimate.min;
      if (set.estimate.max != null) clone.signalBox.estimate.reasonableMax = set.estimate.max;
    }
    if (set.segments && clone.signalBox && clone.signalBox.barModel) {
      (clone.signalBox.barModel.bars || []).forEach(function (b, bi) {
        if (set.segments[bi] != null) b.segments = set.segments[bi];
        if (set.marked && set.marked[bi] != null) b.marked = set.marked[bi];
      });
    }
    /* The unit-grid scene counts its cells in NUMBERS, so tokens cannot reach
       them either — and a scene whose group sizes are frozen while the
       fractions vary is the "60 squares" defect all over again, with the text
       and the picture disagreeing about the same quilt. Stated per set, in the
       order the groups are authored, and reconciled against the bar by
       validator rule 6f (groups must total the segment count). */
    if (set.sceneGroups && clone.scene && clone.scene.groups) {
      clone.scene.groups.forEach(function (g, gi) {
        if (set.sceneGroups[gi] != null) g.n = set.sceneGroups[gi];
      });
    }
    clone.numberSetIndex = ((i % sets.length) + sets.length) % sets.length;
    return clone;
  }

  /* ---------- Number rendering & masking ---------- */

  /**
   * Turn "{{n1}} cups" into HTML, masking or revealing numbers.
   * Masked numbers get a screen-reader text of "some number" so that a
   * student listening rather than reading gets the same pedagogical
   * experience — not silence, and not the actual value.
   */
  function renderText(str, numbers, masked) {
    return str.replace(/\{\{(n\d+)\}\}/g, function (m, key) {
      var n = numbers && numbers[key];
      if (!n) return m;
      if (masked) {
        return '<span class="masked" aria-hidden="true">' +
                 String(n.value).replace(/./g, '█') +
               '</span><span class="visually-hidden">some number</span>';
      }
      return '<span class="num">' + n.value + '</span>';
    });
  }

  /** Plain-text version for speech synthesis. */
  function speechText(str, numbers, masked) {
    return str.replace(/\{\{(n\d+)\}\}/g, function (m, key) {
      var n = numbers && numbers[key];
      if (!n) return m;
      return masked ? 'some number' : (n.spoken || String(n.value));
    });
  }

  /* ---------- Answer equivalence ---------- */

  /**
   * Parse a student answer into a number.
   * Accepts: 12, 12.5, 3/4, 1 1/2, 75%, "$18", "18 miles", "1,200"
   * Returns null if nothing numeric is found.
   */
  function parseAnswer(raw) {
    if (raw === null || raw === undefined) return null;
    var s = String(raw).trim().toLowerCase();
    if (!s) return null;

    s = s.replace(/\$/g, '');

    /* Commas mean two different things and cannot all be dropped.
       "1,200" is a thousands separator; "0,35" is a decimal comma. Stripping
       both turned 0,35 into 35 — a hundred times the intended value. */
    s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');      // 1,200 -> 1200
    s = s.replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2');   // 0,35  -> 0.35
    s = s.replace(/,/g, '');

    var isPercent = /%|\bpercent\b/.test(s);
    s = s.replace(/%|\bpercent\b/g, ' ');

    /* A LEADING DECIMAL POINT IS A NUMBER.
       This pattern used to require `\d+` before the optional `.\d+`, so ".35"
       matched only the "35" and parsed as thirty-five — a hundred times what
       was meant. A student who estimated 7/20 correctly, wrote it as .35, and
       was told at the Arrivals Board that their estimate did not match the
       answer. Writing a decimal without the leading zero is ordinary; the
       parser has to accept it. */
    var m = s.match(/-?(?:\d+(?:\s+\d+\s*\/\s*\d+|\s*\/\s*\d+|\.\d+)?|\.\d+)/);
    if (!m) return null;
    var t = m[0].replace(/\s*\/\s*/g, '/').trim();

    var val;
    var mixed = t.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    var frac  = t.match(/^(-?\d+)\/(\d+)$/);
    if (mixed) {
      var whole = parseFloat(mixed[1]);
      var f = parseFloat(mixed[2]) / parseFloat(mixed[3]);
      val = whole < 0 ? whole - f : whole + f;
    } else if (frac) {
      if (parseFloat(frac[2]) === 0) return null;
      val = parseFloat(frac[1]) / parseFloat(frac[2]);
    } else {
      val = parseFloat(t);
    }
    if (isNaN(val)) return null;
    if (isPercent) val = val / 100;
    return val;
  }

  /**
   * Is the student's answer equivalent to the expected one?
   * Returns { ok, exact, note }.
   *
   * Equivalence is CONTENT, not leniency (schema §6.1). A student who
   * writes 0.75 where we expected 3/4 is right, and we say so by name.
   */
  function checkAnswer(raw, answer) {
    var got = parseAnswer(raw);
    if (got === null) return { ok: false, reason: 'unparsed' };

    var want = parseAnswer(answer.exact);
    var tol = typeof answer.tolerance === 'number' ? answer.tolerance : 0;
    var close = tol > 0 ? Math.abs(got - want) <= tol
                        : Math.abs(got - want) < 1e-9;

    if (!close) {
      // Percent-vs-decimal slip: 75 typed where 0.75 wanted, or vice versa.
      if (Math.abs(got / 100 - want) < 1e-9 || Math.abs(got * 100 - want) < 1e-9) {
        return { ok: false, reason: 'scale', got: got };
      }
      return { ok: false, reason: 'wrong', got: got };
    }

    var typed = String(raw).trim();
    var pref = answer.preferredForm || answer.exact;
    var note = null;
    if (typed.replace(/\s|\$/g, '') !== String(pref).replace(/\s|\$/g, '')) {
      var looksFraction = /\//.test(typed);
      var looksPercent = /%/.test(typed);
      var prefFraction = /\//.test(String(pref));
      if (looksFraction !== prefFraction || looksPercent) {
        note = 'You wrote ' + typed + ' and we had ' + pref +
               ' — same amount, written a different way. Both are right.';
      }
    }
    return { ok: true, note: note };
  }

  /** Does a wrong answer match a known misconception? */
  function matchMisconception(raw, misconceptions) {
    if (!misconceptions) return null;
    var got = parseAnswer(raw);
    if (got === null) return null;
    for (var i = 0; i < misconceptions.length; i++) {
      var v = parseAnswer(misconceptions[i].response);
      if (v !== null && Math.abs(got - v) < 1e-9) return misconceptions[i];
    }
    return null;
  }

  /* ---------- Validation (schema §10) ---------- */

  var ROLES = ['reading', 'drafting', 'estimation', 'switchyard', 'signalbox'];

  /** Every numeric value the problem STATES to the student. */
  function givenValues(p) {
    var nums = (p.problem || {}).numbers || {};
    return Object.keys(nums).map(function (k) { return parseAnswer(nums[k].value); })
                            .filter(function (v) { return v !== null; });
  }

  /**
   * Run every mechanical check from PROBLEM-SCHEMA.md §10.
   * Errors block publication; warnings are reported but allowed.
   * Call MF.validate() in the console, or open dispatch.html.
   */
  function validate() {
    var report = [];

    /* Every check below runs against a MATERIALISED problem, so a problem with
       four number sets is validated four times over. A set whose answer, hint
       ladder or estimate bracket disagrees with its own numbers is exactly the
       defect this feature invites, and it would otherwise surface only for the
       student unlucky enough to draw that set. */
    function checkProblem(id, p, err, warn) {
      if (p.id !== id) err.push('id mismatch');
      if (!/^[a-z0-9-]+$/.test(p.id)) err.push('id must be kebab-case');
      if (!LINES[p.line]) err.push('unknown line "' + p.line + '"');

      // 3. tokens in text <-> numbers
      var pb = p.problem || {};
      var inText = (pb.text || '').match(/\{\{(n\d+)\}\}/g) || [];
      inText = inText.map(function (t) { return t.slice(2, -2); });
      var declared = Object.keys(pb.numbers || {});
      inText.forEach(function (t) { if (declared.indexOf(t) === -1) err.push('token ' + t + ' not in numbers'); });
      declared.forEach(function (t) { if (inText.indexOf(t) === -1) warn.push('number ' + t + ' unused in text'); });

      // 4. sentences concatenate to text
      var joined = (pb.sentences || []).join(' ').replace(/\s+/g, ' ').trim();
      if (joined !== (pb.text || '').replace(/\s+/g, ' ').trim()) err.push('sentences do not match text');

      // 5. question index in range
      if (!(pb.questionSentenceIndex >= 0 && pb.questionSentenceIndex < (pb.sentences || []).length))
        err.push('questionSentenceIndex out of range');

      /* 5b. Every number must be a {{token}}. A bare digit in the prose would
         survive the numberless first read — the whole point of that station is
         that NO quantity is visible — and it could never be spoken correctly
         by the read-aloud. Descriptive colour is welcome; digits in it are not. */
      (pb.sentences || []).forEach(function (s, si) {
        var bare = s.replace(/\{\{[^}]+\}\}/g, '');
        if (/\d/.test(bare))
          err.push('sentence ' + si + ' has a digit outside a {{token}} — it would not be masked');
      });

      // (text/sentences agreement is already checked above — not repeated here)

      // 6. distractors cover all four other lines
      var tb = p.ticketBooth;
      if (tb) {
        var covered = (tb.distractors || []).map(function (d) { return d.line; });
        Object.keys(LINES).forEach(function (k) {
          if (k === tb.correctLine) return;
          if (covered.indexOf(k) === -1) err.push('no distractor explanation for "' + k + '"');
        });
        (tb.distractors || []).forEach(function (d) {
          if (!d.whyWrong || d.whyWrong.length < 20) err.push('distractor "' + d.line + '" needs a real explanation');
        });

        // 6b. The Ticket Booth grades the missing-car question, so its answer
        // must be gradeable. The unknownCar CODE cannot be relied on here —
        // options are often prose ("the part left"), so the answer has to be
        // stated verbatim or the station renders an unanswerable question.
        var carOpts = tb.unknownCarOptions || [];
        if (carOpts.length < 2) err.push('ticketBooth needs at least 2 unknownCarOptions');
        if (!tb.unknownCarAnswer) err.push('ticketBooth.unknownCarAnswer is missing');
        else if (carOpts.indexOf(tb.unknownCarAnswer) === -1)
          err.push('unknownCarAnswer "' + tb.unknownCarAnswer + '" is not one of unknownCarOptions');
        if (!tb.unknownCarWhy || tb.unknownCarWhy.length < 15)
          err.push('unknownCarWhy needs a real explanation — it is the teaching moment');
      }

      /* 6b-i. THE PICTURE SHOWS WHAT IS GIVEN, NOT WHAT IS DERIVED.
         A bar's `segmentValue` is printed in the Model Yard once the student
         marks a part. If that value was computed rather than given, the picture
         has done the student's arithmetic — and with the part count visible,
         one multiplication reaches the answer. That is the Cycle 6 defect, and
         it has now recurred three times, each time in a slightly different
         disguise. Stating it as a property of the DATA rather than of the
         render is what stops the fourth. */
      var bars = ((p.signalBox || {}).barModel || {}).bars || [];
      var givenVals = {};
      Object.keys(pb.numbers || {}).forEach(function (k) {
        var t = String(pb.numbers[k].value).replace(/[^0-9./]/g, '');
        var v = t.indexOf('/') > 0 ? parseFloat(t.split('/')[0]) / parseFloat(t.split('/')[1]) : parseFloat(t);
        givenVals[v] = 1;
      });
      bars.forEach(function (bar, bi) {
        if (!bar.segmentValue || bar.segmentValue === '?') return;
        var t = String(bar.segmentValue).replace(/[^0-9./]/g, '');
        var v = t.indexOf('/') > 0 ? parseFloat(t.split('/')[0]) / parseFloat(t.split('/')[1]) : parseFloat(t);
        if (!givenVals[v])
          warn.push('bar ' + bi + ' segmentValue "' + bar.segmentValue + '" is not a value the problem gives — ' +
                    'the Model Yard will hide it, because a derived value in the picture does the student\'s work');
      });

      /* 6b-ii. The Platform Check (Pedagogy §3.7) runs at the end of Read 1.
         Four rules, and the last two are the ones that matter:

           - it must point at a sentence that exists;
           - it must not point at the QUESTION sentence. If the structural tell
             and the question are the same sentence there is nothing to find,
             and the phase degrades into "tap the bold one";
           - its copy carries NO DIGITS. Read 1 is the numberless phase (§1.4)
             and this text sits on that screen, so a digit here defeats the
             masking exactly as a digit in the prose would (rule 5b above);
           - and no SPELLED-OUT number either. `tools/sweep.js` scans rendered
             text for values written as words because Cycle 6 shipped four of
             them. "One kind, two moments" would collide with any problem
             answering 1 or 2, and a cleared-noise line is how a real leak gets
             skimmed past. Say the shape instead of counting it. */
      var pc = ((p.threeReads || {}).read1 || {}).platformCheck;
      var NUMWORD = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dozen|half|quarter|third|twice|double)\b/i;
      if (!pc) err.push('read1.platformCheck is missing — Read 1 renders it (Pedagogy §3.7)');
      else {
        var nSent = (pb.sentences || []).length;
        var sents = pc.sentences;
        if (!sents || !sents.length) err.push('platformCheck.sentences must name at least one sentence');
        else {
        /* The task is "tap the sentences you need to SOLVE it" (user decision,
           2026-08-04), so the answer is every sentence carrying a quantity the
           problem actually uses, plus any sentence stating a relationship that
           makes the solution possible — the invariance line on a rate, "the
           rest is white" on the quilt. Scene-setting and the declared
           distractor are excluded, and selecting the distractor is wrong.

           The question sentence may be included ONLY when it carries a needed
           quantity — rr-bread-dough asks "how much water for ▮ kilograms",
           and that ▮ is a given. Anywhere else it is barred, because it tells
           you what to FIND rather than what you have. */
          var needTok = ((p.threeReads || {}).read2 || {}).quantities || [];
          needTok = needTok.filter(function (q) { return q.needed !== false; })
                           .map(function (q) { return q.token; });
          var qCarriesNeeded = needTok.some(function (t) {
            return (pb.sentences[pb.questionSentenceIndex] || '').indexOf('{{' + t + '}}') > -1;
          });
          var disTok = Object.keys(pb.numbers || {}).filter(function (k) {
            return (pb.numbers[k] || {}).role === 'distractor';
          });

          /* THE ANSWER IS DERIVABLE, SO DERIVE IT AND ASSERT EQUALITY.
             The set is exactly the sentences carrying a quantity the problem
             uses — no more, no less. Authoring it by hand is kept only so a
             reviewer can see it, and this check stops the two of them drifting.

             This replaced a judgement call, twice, after the user found the
             same defect from both directions:
               - too NARROW: nine problems required only the sentence showing
                 the structure, so a student who also tapped the sentence
                 holding a number they needed was told "Not quite";
               - too WIDE: five problems additionally demanded a number-free
                 sentence stating the relationship — "the recipe never changes",
                 "the press never pauses", "the rest of it is white". Those are
                 worth NOTICING and are said in `why`; they are not things you
                 need in order to solve, and requiring them marked a correct
                 reading wrong.

             Deriving also gets two earlier decisions for free: the question
             sentence qualifies exactly when it carries a given (rr-bread-dough,
             rr-van-hours), and a distractor-only sentence never qualifies. */
          var derived = [];
          pb.sentences.forEach(function (s, i) {
            if (needTok.some(function (t) { return s.indexOf('{{' + t + '}}') > -1; })) derived.push(i);
          });
          var mine = sents.slice().sort(function (a, b) { return a - b; }).join(',');
          if (derived.length && mine !== derived.join(','))
            err.push('platformCheck.sentences is [' + mine + '] but the sentences carrying quantities you need are [' +
                     derived.join(',') + '] — the answer must be exactly what the problem needs to be solved');
          if (sents.length !== sents.filter(function (v, i) { return sents.indexOf(v) === i; }).length)
            err.push('platformCheck.sentences has a duplicate');
          if (sents.length >= nSent)
            err.push('platformCheck.sentences names every sentence — then there is nothing to pick out');
        }
        /* Per-problem Platform Check questions (optional). Keyed by the shared
           question and option ids in `stations.js`. A typo in a key would
           silently fall back to the generic copy and nothing would look wrong,
           so the keys are checked against the known sets — and the same
           numberless rules apply, because this text renders on read1. */
        var QIDS = { kinds: 1, moments: 1, things: 1, shape: 1, fit: 1 };
        var OIDS = { same: 1, different: 1, changed: 1, steady: 1, single: 1, separate: 1,
                     paired: 1, cut: 1, repeat: 1, neither: 1, onekind: 1, stacked: 1, nofit: 1 };
        /* Authored at `read1.questions` — a SIBLING of platformCheck. Nesting
           it inside platformCheck by mistake produces a field nothing reads and
           nothing complains about, because the whole block is optional. That
           happened on the first attempt and cost a round trip, so it is an
           error now rather than a silence. */
        if (pc.questions)
          err.push('platformCheck.questions is nested one level too deep — it belongs at read1.questions');
        var qover = (p.threeReads || {}).read1 && p.threeReads.read1.questions;
        if (qover) {
          Object.keys(qover).forEach(function (qid) {
            if (!QIDS[qid]) { err.push('platformCheck.questions has unknown question "' + qid + '"'); return; }
            var strings = [];
            // Named with its question id — "questions.ask" alone does not say
            // which of the five, and there are five of them.
            if (qover[qid].ask) strings.push([qid + '.ask', qover[qid].ask]);
            var oo = qover[qid].options || {};
            Object.keys(oo).forEach(function (oid) {
              if (!OIDS[oid]) { err.push('platformCheck.questions.' + qid + ' has unknown option "' + oid + '"'); return; }
              ['text', 'yes', 'no'].forEach(function (f) {
                if (oo[oid][f]) strings.push([qid + '.' + oid + '.' + f, oo[oid][f]]);
              });
            });
            strings.forEach(function (pair) {
              if (/\d/.test(pair[1]))
                err.push('platformCheck.questions.' + pair[0] + ' has a digit — read1 is the numberless phase');
              else if (NUMWORD.test(pair[1]))
                err.push('platformCheck.questions.' + pair[0] + ' spells out a number ("' +
                         pair[1].match(NUMWORD)[0] + '") — say the shape, not the count');
            });
          });
        }

        /* THESE TWO FIELDS ARE ESCAPED AT RENDER; THE `questions` COPY IS NOT.
           `phPlatform.finish()` puts `why` and `kinds` through esc(), so an
           HTML entity in them renders as literal text — "&mdash;" on the page,
           user-found on the Ratio problems. The `questions` overrides are
           inserted raw and use entities freely (93 of them), which is what
           makes the asymmetry easy to trip over. Write the character itself. */
        ['why', 'kinds'].forEach(function (k) {
          if (/&[a-z]+;/i.test(pc[k] || ''))
            err.push('platformCheck.' + k + ' contains the HTML entity "' + (pc[k].match(/&[a-z]+;/i) || [])[0] +
                     '" — this field is escaped at render, so write the character itself');
        });

        ['why', 'kinds'].forEach(function (k) {
          var v = pc[k];
          if (!v || v.length < 15) err.push('platformCheck.' + k + ' needs a real explanation');
          else if (/\d/.test(v)) err.push('platformCheck.' + k + ' has a digit — Read 1 is the numberless phase');
          else if (NUMWORD.test(v)) err.push('platformCheck.' + k + ' spells out a number ("' +
            v.match(NUMWORD)[0] + '") — say the shape, not the count');
        });
      }

      /* 6c. Read 3 is now a graded multiple choice, not a textarea. It needs
         real options with real explanations, or it goes back to being a
         station a student can pass without reading anything. */
      var r3 = (p.threeReads || {}).read3 || {};
      var r3o = r3.options || [];
      if (r3o.length < 3) err.push('read3 needs at least 3 options');
      var correct = r3o.filter(function (o) { return o.correct; });
      if (correct.length !== 1) err.push('read3 must have exactly one correct option (found ' + correct.length + ')');
      r3o.forEach(function (o, i) {
        if (!o.text) err.push('read3 option ' + i + ' has no text');
        if (!o.why || o.why.length < 15) err.push('read3 option "' + (o.text || i) + '" needs a why — a wrong pick must teach something');
      });

      /* 6d. Distracting information must be declared, not just dropped in the
         text. Every number gets described at Read 2, and anything tagged
         "distractor" must be marked needed:false so the station can grade the
         relevance question honestly. */
      var r2q = ((p.threeReads || {}).read2 || {}).quantities || [];
      var described = r2q.map(function (q) { return q.token; });
      Object.keys((p.problem || {}).numbers || {}).forEach(function (tok) {
        if (described.indexOf(tok) === -1)
          err.push('number "' + tok + '" is never described in read2.quantities');
        var isDistractor = p.problem.numbers[tok].role === 'distractor';
        var q = r2q.filter(function (x) { return x.token === tok; })[0];
        if (q && isDistractor && q.needed !== false)
          err.push('"' + tok + '" is role:distractor but not marked needed:false in read2');
        if (q && !isDistractor && q.needed === false)
          err.push('"' + tok + '" is marked needed:false but its role is not "distractor"');
      });
      if (!r2q.filter(function (q) { return q.needed !== false; }).length)
        err.push('read2 has no needed quantities — nothing to select');
      if (!r2q.filter(function (q) { return q.needed === false; }).length)
        warn.push('no distracting information — problem may read as elementary');

      /* 6e. The Model Yard is the interactive picture of the problem. It needs
         to know how many parts are the quantity in question, or it cannot
         respond to what the student does and reverts to decoration. */
      var bm = ((p.signalBox || {}).barModel || {});
      (bm.bars || []).forEach(function (b, i) {
        var where = 'barModel.bars[' + i + ']';
        if (typeof b.marked !== 'number')
          err.push(where + '.marked is missing — the Model Yard cannot check the picture');
        else if (b.marked < 0 || b.marked > b.segments)
          err.push(where + '.marked (' + b.marked + ') is outside 0..' + b.segments);
        if (!b.markedLabel) err.push(where + '.markedLabel is missing — nothing to ask the student to find');
        if (!b.restLabel)   err.push(where + '.restLabel is missing — the remainder would go unnamed');
      });

      /* 6f. The Scene is a picture of THIS problem's numbers. If it can drift
         from the maths it will eventually contradict it — which is exactly
         what happened when a quilt described as 60 squares was drawn in
         twentieths. The counts must reconcile against the bar model. */
      var seg = (bm.bars && bm.bars[0]) ? bm.bars[0].segments : null;

      /* SCENE EXISTENCE IS CHECKED WITHOUT A BAR; RECONCILIATION NEEDS ONE.
         These used to sit together behind `if (p.scene && seg)`, which was
         harmless while every problem had a bar model and became a hole the
         moment one did not: a line bringing its own Plan picture and no
         Part–Whole bar could name a nonexistent illustration and ship a silent
         empty frame. The counts-versus-segments reconciliation genuinely needs
         a bar; whether the named artwork EXISTS does not. */
      if (p.scene && p.scene.mode === 'anim') {
        if (!p.scene.art) err.push('scene.mode "anim" needs an art name');
        else {
          /* Only assert the artwork is missing when a library is actually
             loaded to be asked. dispatch.html loads the validator WITHOUT the
             scene libraries, so an unguarded check reported every valid art
             name as missing — a teacher authoring a perfectly good problem
             would have been told to fix something that was not wrong. Adding
             a rule and breaking the Dispatch Office with it has happened
             before; see VERIFICATION.md 7. */
          /* DISCOVERED, NOT LISTED — and this was the LAST hardcoded copy of
             the four scene libraries. It sat inside the checker, which is the
             worst place for it: a fifth library's artwork would have been
             exempt from the does-this-illustration-exist rule while the
             validator reported clean, exactly as `groups-scenes.js` was exempt
             from the sweep's geometry check for a whole cycle. `Scene.libs()`
             asks the world; when it is absent (dispatch.html loads the
             validator without any scene libraries) the check correctly stands
             down rather than failing every valid art name. */
          var libs = (global.Scene && Scene.libs) ? Scene.libs() : [];
          if (libs.length && !libs.some(function (l) { return l.has(p.scene.art); }))
            err.push('scene.art "' + p.scene.art + '" has no illustration — it would render nothing');
        }
        if (!p.scene.caption) err.push('an animated scene needs a caption; it is the only text a screen reader gets');
      }

      if (p.scene && seg) {
        if (p.scene.mode === 'unit') {
          var gs = p.scene.groups || [];
          if (!gs.length) err.push('scene.mode "unit" needs groups');
          var sum = gs.reduce(function (a, g) { return a + (g.n || 0); }, 0);
          if (sum !== seg)
            err.push('scene groups total ' + sum + ' but the bar model has ' + seg + ' parts — the picture contradicts the maths');
          gs.forEach(function (g) {
            if (!g.key || !g.label) err.push('every scene group needs a key and a label');
          });
        } else if (p.scene.mode === 'anim') {
          /* Checked above, without needing a bar. Deliberately empty here: the
             checks used to live in this branch and were lifted out so a
             problem with no bar model still gets them. Leaving a copy behind
             would report every fault twice, which this validator has done
             before. */
        } else if (!p.scene.icon) {
          err.push('scene needs an icon (or mode:"unit"/"anim")');
        }
        /* A number stated in the problem text must not imply a DIFFERENT
           partition from the one drawn. Only units that describe pieces of
           the whole can be misread that way — "90 minutes" of practice
           cannot be mistaken for a partition of shots, but "60 squares" of a
           quilt drawn in twentieths absolutely can, and was. */
        var PARTITION_WORDS = /square|piece|part|section|slice|segment|portion|share|block|tile/i;
        var barUnit = (bm.bars && bm.bars[0] && bm.bars[0].unit) || '';
        var nums = (p.problem || {}).numbers || {};
        Object.keys(nums).forEach(function (k) {
          var v = parseFloat(nums[k].value), u = nums[k].unit || '';
          if (nums[k].role !== 'distractor' || !(v > seg && v % seg === 0)) return;
          if (PARTITION_WORDS.test(u) || (barUnit && u === barUnit))
            warn.push('distractor "' + nums[k].value + ' ' + u + '" names pieces of the whole and is a ' +
                      'multiple of the ' + seg + ' parts drawn — the text and the picture disagree');
        });
      }

      // 7. bar models need an a11y description
      if (p.signalBox && p.signalBox.barModel && !p.signalBox.barModel.a11yDescription)
        err.push('bar model missing a11yDescription');

      // 8. hints present, rungs ascending from 1
      ((p.engineRoom || {}).steps || []).forEach(function (s) {
        var rungs = (s.hints || []).map(function (h) { return h.rung; });
        if (!rungs.length) err.push('step ' + s.id + ' has no hints');
        rungs.forEach(function (rg, i) { if (rg !== i + 1) err.push('step ' + s.id + ' hint rungs must ascend from 1'); });
        if (!s.misconceptions || !s.misconceptions.length) warn.push('step ' + s.id + ' has no misconceptions');
      });

      // 9 & 11. answers parse, and every accepted form is truly equivalent
      var checkAns = function (a, where) {
        if (!a) { err.push(where + ' missing answer'); return; }
        var want = parseAnswer(a.exact);
        if (want === null) { err.push(where + ' answer "' + a.exact + '" not parseable'); return; }
        (a.acceptedForms || []).forEach(function (f) {
          var v = parseAnswer(f);
          if (v === null || Math.abs(v - want) > 1e-9)
            err.push(where + ' accepted form "' + f + '" is NOT equal to ' + a.exact);
        });
      };
      ((p.engineRoom || {}).steps || []).forEach(function (s) { checkAns(s.answer, 'step ' + s.id); });
      checkAns((p.arrivals || {}).answer, 'arrivals');

      // 10. estimate range must contain the true answer
      var est = (p.signalBox || {}).estimate;
      var fin = parseAnswer(((p.arrivals || {}).answer || {}).exact);
      if (est && fin !== null) {
        if (fin < est.reasonableMin || fin > est.reasonableMax)
          err.push('estimate range ' + est.reasonableMin + '-' + est.reasonableMax + ' EXCLUDES the answer ' + fin);
      }

      /* 10b. The Model Yard must not hand over an answer the student has not
         reached yet. It renders bars[0].segmentValue on EVERY car and
         knownTotal on the whole-car, and it does that during the PLAN phase —
         which runs before the Engine Room. So any bar field whose value equals
         a step answer or the final answer is a spoiler sitting one screen
         early. Found in five approved problems at once, none of which looked
         wrong when read: pw-soup-serving printed "3" on every car while step 1
         asked "how many cups is ONE quarter of the pot?".

         The fix is to write "?" in the field. model.js already treats
         knownTotal "?" as unknown and drops it from the yard-say line, and an
         unparseable segmentValue renders as "?" on each car, which reads as
         "this is the thing you are working out". Values that are GIVEN in the
         problem text are fine and common — only answers are barred. */
      /* SCOPE NARROWED, DELIBERATELY. This rule once covered segmentValue too,
         because the Model Yard printed it on every car the moment the bar was
         split. It no longer does: model.js reveals a part's value only when the
         student marks that part, so it is a consequence of their own action,
         not something handed over on arrival.

         That was the user's call, made after three reports, and it is the right
         one — a bar model whose boxes are empty is not a model, and clicking a
         part to see what it is worth is the moment the whole-and-parts
         relationship becomes concrete. knownTotal is still covered, because it
         is printed on the whole-car before the student has done anything. */
      var barsList = ((p.signalBox || {}).barModel || {}).bars || [];
      var answerVals = [];
      ((p.engineRoom || {}).steps || []).forEach(function (s) {
        var v = parseAnswer((s.answer || {}).exact);
        if (v !== null) answerVals.push({ v: v, where: 'step ' + s.id });
      });
      if (fin !== null) answerVals.push({ v: fin, where: 'the final answer' });
      barsList.forEach(function (b, i) {
        ['knownTotal'].forEach(function (field) {
          var shown = parseAnswer(b[field]);
          if (shown === null) return;               // "?" and prose are fine
          answerVals.forEach(function (a) {
            if (Math.abs(shown - a.v) < 1e-9)
              err.push('barModel.bars[' + i + '].' + field + ' is "' + b[field] +
                       '", which is ' + a.where + ' — the Model Yard shows it during Plan, ' +
                       'before the student solves it. Use "?" instead.');
          });
        });
      });

      /* 10c. The Model Yard reads bars[0] and nothing else (model.js), so any
         further bars are authored content that never reaches a student. A
         warning rather than an error: the data is not wrong, it is invisible. */
      if (barsList.length > 1)
        warn.push('barModel has ' + barsList.length + ' bars but the Model Yard renders only bars[0] — ' +
                  'bars[1..] are never shown to anyone');

      /* 10c-2. THE TEST TRACK. Sits between the estimate and the Engine Room
         and demonstrates the strategy, so everything here is shown BEFORE the
         student answers. Two things can go wrong and only one of them looks
         wrong when you read it.

         Structure first: exactly one correct option, every wrong one teaching.

         Then the one that matters. A `share` demo runs on a PARALLEL example
         precisely so it does not perform the move on the student's own
         numbers — but "parallel" is a claim about the numbers, not a property
         of them. The first Test Track written demonstrated on 12 blocks split
         into 4, taking 3, and announced the result: 9. Set 1 of that problem
         is a 12-cup pot whose answer is 9. It was solving the problem it was
         supposed to be preparing for, in every word, one screen early.

         So the demo's three numbers are checked against every value a student
         can see in EVERY set — givens, distractors and derived alike. A demo
         number that collides is not "a coincidence", it is the answer. */
      var tt = (p.signalBox || {}).testTrack;
      if (tt) {
        if (!tt.a11yDescription)
          err.push('testTrack needs an a11yDescription — it is the whole demonstration for anyone who cannot see it move');
        if (!tt.law)   warn.push('testTrack has no `law` — nothing states the strategy being demonstrated');
        if (!tt.bridge) warn.push('testTrack has no `bridge` — nothing carries the student to their own numbers');

        var w = tt.worked || {}, y = tt.yours || {};
        function countOf(opts) {
          var o = (opts || []).filter(function (x) { return x.correct; })[0];
          return o ? parseInt(o.text, 10) : NaN;
        }
        /* Common to every kind: two real questions, each with one answer and
           every wrong option teaching something. */
        function checkQ(opts, which, mustBeCount) {
          var right = (opts || []).filter(function (o) { return o.correct; });
          if (right.length !== 1)
            err.push('testTrack.yours.' + which + ' must have exactly one correct option (found ' + right.length + ')');
          (opts || []).forEach(function (o) {
            if (!o.why || o.why.length < 20)
              err.push('testTrack.yours.' + which + ' option "' + (o.text || '?') + '" needs a real explanation');
            if (mustBeCount && isNaN(parseInt(o.text, 10)))
              err.push('testTrack.yours.' + which + ' option "' + o.text + '" must be a count — the bar is drawn from it');
          });
          if ((opts || []).length < 3)
            err.push('testTrack.yours.' + which + ' needs at least 3 options');
        }
        if (!y.q1 || !y.q2) err.push('testTrack.yours needs both questions');
        checkQ(y.options1, 'options1', tt.kind === 'section');
        checkQ(y.options2, 'options2', tt.kind === 'section');
        if (!w.sayCut || !w.sayTake)
          err.push('testTrack.worked needs sayCut and sayTake — they are the commentary a screen reader gets');

        /* `drive` moves an engine to a car index, so the option that settles
           the direction has to say where it starts from, and the gap has to be
           a real car. Without these the engine has nowhere to go and the
           demonstration silently does nothing. */
        if (tt.kind === 'drive') {
          var cars = (y.cars || []).length;
          if (cars < 2) err.push('testTrack.yours.cars needs at least 2 cars');
          if (!(y.gap >= 0 && y.gap < cars))
            err.push('testTrack.yours.gap must be the index of one of the cars');
          var d2 = (y.options2 || []).filter(function (o) { return o.correct; })[0];
          if (d2 && !(d2.from >= 0 && d2.from < cars))
            err.push('testTrack.yours.options2 correct option needs a valid `from` car index to run the engine from');
        }
        /* `cross` draws a 2x2 proportion and lights its diagonals. Two rows of
           two, or there are no diagonals to cross. The equation is the whole
           output of the screen, and it must stay UNEVALUATED — a bare number on
           the right-hand side would be the answer, which is the one thing this
           phase may never print. */
        if (tt.kind === 'cross') {
          [['worked', w], ['yours', y]].forEach(function (pair) {
            var g = pair[1], rows = g.rows || [];
            if (rows.length !== 2)
              err.push('testTrack.' + pair[0] + ' needs exactly 2 rows to cross-multiply (found ' + rows.length + ')');
            rows.forEach(function (r) {
              if (!r.name || r.a == null || r.b == null)
                err.push('testTrack.' + pair[0] + ' every row needs a name and both values');
            });
            if (!g.equation)
              err.push('testTrack.' + pair[0] + ' needs an `equation` — it is what the crossing produces');
            else if (!/[x×*]/.test(g.equation))
              err.push('testTrack.' + pair[0] + '.equation does not show a multiplication; cross-multiplying produces two products');
          });
          if (y.equation && !/\?/.test(y.equation))
            err.push('testTrack.yours.equation has no "?" left in it — if both sides are worked out, the screen has solved the problem');
        }

        /* NO NUMBER IN A WORKED EXAMPLE MAY BE AN ANSWER. Applies to every
           kind, because every kind now has one.

           This class of fault has bitten three times. The first Test Track
           demonstrated on 12 blocks split into 4 taking 3 — announcing 9 —
           against a 12-cup pot whose answer is 9. Then the cross-multiplying
           worked example used "2 to 3 is the same as 8 to 12" on a problem
           whose third set answers 12, and another remarked that adding the
           pairs "would give 15 and 13" on a problem whose second set answers
           15. Every time it read perfectly well on the page, because the
           number belongs to the example and looks like it has nothing to do
           with the student's problem. It has everything to do with it.

           So: sweep every number out of the worked example — its values, its
           equation, its commentary — and compare against this set's answers.
           checkProblem runs once per set, so the four runs cover all of them. */
        /* EVERY string in the whole testTrack, not a hand-listed few. The first
           version of this rule checked worked.label, .equation, .sayCut and
           .sayTake — and missed the a11yDescription, which narrates the same
           worked example in prose. Both leaks it was written to catch survived
           in that one field, and the rendered sweep found them anyway. A rule
           that inspects a list of fields goes stale the moment a field is
           added; walking the object does not. */
        var wNums = [];
        (function walk(node) {
          if (typeof node === 'string') {
            (node.match(/\d+(?:\.\d+)?/g) || []).forEach(function (n) { wNums.push(parseFloat(n)); });
          } else if (typeof node === 'number') { wNums.push(node); }
          else if (Array.isArray(node)) { node.forEach(walk); }
          else if (node && typeof node === 'object') {
            Object.keys(node).forEach(function (k) { walk(node[k]); });
          }
        })(tt);

        var answers = {};
        ((p.engineRoom || {}).steps || []).forEach(function (st) {
          var v = parseAnswer((st.answer || {}).exact); if (v !== null) answers[v] = 'step ' + st.id;
        });
        var fin = parseAnswer(((p.arrivals || {}).answer || {}).exact);
        if (fin !== null) answers[fin] = 'the final answer';

        var flagged = {};
        wNums.forEach(function (n) {
          if (answers[n] && !flagged[n]) {
            flagged[n] = 1;
            err.push('testTrack contains ' + n + ', which is ' + answers[n] +
                     ' for this number set — the demonstration is printing the student\'s answer');
          }
        });

        if (tt.kind === 'section') {
          var nParts = countOf(y.options1), nHeld = countOf(y.options2);
          if (!(nParts > 0)) err.push('testTrack.yours.options1 has no usable section count');
          if (!(nHeld > 0))  err.push('testTrack.yours.options2 has no usable held count');
          if (nParts > 0 && nHeld > nParts)
            err.push('testTrack: cannot hold ' + nHeld + ' of only ' + nParts + ' sections');

          /* THE WORKED EXAMPLE MUST NOT BE THE STUDENT'S OWN QUESTION.
             It is there to model the move first. If it sections into the same
             number and takes the same number, the two questions underneath it
             are answered by copying what is already on screen — which is the
             copy-exercise this whole phase was built to remove. Differing on
             the TAKE is enough; percent problems legitimately cut into ten
             every time, and that invariant is the lesson there. */
          if (!(w.parts > 0 && w.take > 0))
            err.push('testTrack.worked needs parts and take above zero');
          else if (w.take === nHeld && w.parts === nParts)
            err.push('testTrack.worked sections ' + w.parts + ' and takes ' + w.take +
                     ', identical to the student\'s own answer — they can copy it off the screen');
          if (w.take > w.parts)
            err.push('testTrack.worked cannot take ' + w.take + ' of only ' + w.parts + ' sections');

          /* This kind computes NOTHING — no value is derived on screen — so
             there is no arithmetic to leak. The counts it does show are the
             fraction's own numerator and denominator, which the problem text
             states outright. That is the whole reason it replaced the parallel
             mini-example, which did leak. Nothing further to check here, and
             saying so is better than a silent gap. */
        }
      }

      /* 10d. Ratio tables. These own the Plan phase for their problem, so a
         malformed one is a station with nothing gradeable in it. The order of
         `options` does NOT matter — they are shuffled at render — but exactly
         one has to be correct, and a wrong pick has to teach something. */
      var rtabs = (p.signalBox || {}).ratioTables ||
                  ((p.signalBox || {}).ratioTable ? [p.signalBox.ratioTable] : []);
      rtabs.forEach(function (rt, ti) {
        var where = 'ratioTable[' + ti + ']';
        var opts = rt.options || [];
        var right = opts.filter(function (o) { return o.correct; });
        if (right.length !== 1)
          err.push(where + ' must have exactly one correct option (found ' + right.length + ')');
        if (opts.length < 3) err.push(where + ' needs at least 3 options');
        opts.forEach(function (o) {
          if (!o.text) err.push(where + ' has an option with no text');
          if (!o.why || o.why.length < 20)
            err.push(where + ' option "' + (o.text || '?') + '" needs a real explanation — a wrong pick must teach');
        });
        /* The additive trap is the misconception this whole line exists to
           beat. A table without one lets a student succeed by elimination. */
        if (!opts.some(function (o) { return /^\s*[+−-]/.test(o.text || ''); }))
          warn.push(where + ' offers no additive distractor — the commonest ratio error is not on the table');
        var unknowns = (rt.rows || []).filter(function (r) { return String(r.target) === '?'; });
        if (unknowns.length !== 1)
          err.push(where + ' needs exactly one unknown cell (found ' + unknowns.length + ')');
        if ((rt.rows || []).length !== 2) err.push(where + ' needs exactly 2 rows — a ratio relates two quantities');
        if (!rt.a11yDescription) err.push(where + ' needs an a11yDescription; it is the table\'s only text for a screen reader');
      });

      /* 10e. The Change Train. Owns the Plan phase for its problem the same way
         a ratio table does, so a malformed one is a station with nothing
         gradeable in it. Order of `options` does NOT matter — they are shuffled
         at render — but exactly one must be correct.

         The rule that carries the pedagogy: the train must offer the INVERSE
         operation. The whole Change Line exists to break "more means add", and
         a student can only learn that by being offered the addition and shown
         why it is wrong when the START is what is missing. A train with only
         one direction on the button row tests nothing. */
      var ct = (p.signalBox || {}).changeTrain;
      if (ct) {
        var cars = ct.cars || [];
        if (cars.length !== 3)
          err.push('changeTrain needs exactly 3 cars — start, change, result (found ' + cars.length + ')');
        cars.forEach(function (c, i) {
          if (!c.label) err.push('changeTrain car ' + i + ' has no label');
        });
        var unknownCars = cars.filter(function (c) { return String(c.value) === '?'; });
        if (unknownCars.length !== 1)
          err.push('changeTrain needs exactly one missing car (found ' + unknownCars.length + ')');
        var copts = ct.options || [];
        var cright = copts.filter(function (o) { return o.correct; });
        if (cright.length !== 1)
          err.push('changeTrain must have exactly one correct option (found ' + cright.length + ')');
        if (copts.length < 3) err.push('changeTrain needs at least 3 options');
        copts.forEach(function (o) {
          if (!o.text) err.push('changeTrain has an option with no text');
          if (!o.why || o.why.length < 20)
            err.push('changeTrain option "' + (o.text || '?') + '" needs a real explanation — a wrong pick must teach');
        });
        var hasPlus  = copts.some(function (o) { return /\+/.test(o.text || ''); });
        var hasMinus = copts.some(function (o) { return /[−-]/.test(o.text || ''); });
        if (!(hasPlus && hasMinus))
          err.push('changeTrain must offer BOTH an addition and a subtraction — the inverse operation is the ' +
                   'misconception this whole line exists to break');
        if (!ct.a11yDescription)
          err.push('changeTrain needs an a11yDescription; it is the train\'s only text for a screen reader');
        /* The Plan phase runs BEFORE the Engine Room, so no option may state a
           value the student is about to be asked for. An option names a MOVE
           ("415 − 75"), never its result. */
        var stepAnswers = ((p.engineRoom || {}).steps || []).map(function (s) {
          return parseAnswer((s.answer || {}).exact);
        }).filter(function (v) { return v !== null; });
        copts.forEach(function (o) {
          var nums = String(o.text).match(/\d+(?:\.\d+)?/g) || [];
          nums.forEach(function (nstr) {
            var v = parseFloat(nstr);
            if (givenValues(p).indexOf(v) !== -1) return;   // givens are fine
            if (stepAnswers.indexOf(v) !== -1)
              err.push('changeTrain option "' + o.text + '" contains ' + v +
                       ', which is a step answer — the Plan phase runs before the Engine Room');
          });
        });
      }

      /* 10f. The Compare bars. Owns the Plan phase for its line exactly as the
         ratio table and the change train own theirs — and until 2026-08-08 it
         had NO validation at all, on three shipped problems. The hole was found
         while adding the multiplicative shape: `referent` names the bar the
         student must tap, and a typo in it makes every bar wrong with no error
         anywhere. The student taps all three, is told "not that one" each time,
         and the Plan phase becomes unpassable. Nothing on this project would
         have reported that — not the validator, not the sweep, which renders a
         phase but never clicks it.

         Enumerating the complement, per VERIFICATION.md §32: the ratio table is
         checked, the change train is checked, the Model Yard is checked, the
         compare bars were not. Three of four is how this kind of gap hides. */
      var cbv = (p.signalBox || {}).compareBars;
      if (cbv) {
        var cbars = cbv.bars || [];
        if (cbars.length !== 2)
          err.push('compareBars needs exactly 2 bars — a compare holds two amounts side by side (found ' + cbars.length + ')');
        var keys = [];
        cbars.forEach(function (b, i) {
          if (!b.key)   err.push('compareBars bar ' + i + ' has no key — the referent is named by key');
          if (!b.label) err.push('compareBars bar ' + i + ' has no label');
          if (b.key) keys.push(b.key);
          if (!b.unknown && !b.token)
            err.push('compareBars bar "' + (b.key || i) + '" is neither unknown nor bound to a token, so it has no length');
          if (b.token && !(p.problem.numbers || {})[b.token])
            err.push('compareBars bar "' + (b.key || i) + '" names token "' + b.token + '", which this problem does not define');
        });
        if (cbars.filter(function (b) { return b.unknown; }).length > 1)
          err.push('compareBars has more than one unknown bar — only one amount may be missing');
        if (!cbv.referent)
          err.push('compareBars needs a referent — naming it IS the task the student is set');
        else if (keys.indexOf(cbv.referent) === -1)
          err.push('compareBars referent "' + cbv.referent + '" is not one of the bar keys (' + keys.join(', ') +
                   ') — every pick would be marked wrong and the Plan phase could not be passed');
        Object.keys(cbv.whyWrong || {}).forEach(function (k) {
          if (keys.indexOf(k) === -1)
            err.push('compareBars.whyWrong names "' + k + '", which is not a bar — that explanation can never be shown');
          if (k === cbv.referent)
            err.push('compareBars.whyWrong explains the referent itself, which is the CORRECT pick');
        });
        /* Additive shapes carry a gapToken; the multiplicative shape carries a
           factorToken instead. Exactly one of them, or the model falls through
           to a geometry that does not match the story. */
        /* Exactly one of the three, always. Two of them means the model picks a
           shape by the order the branches happen to be written in, which is a
           picture chosen by accident. Enumerated rather than pairwise, so adding
           a fourth token cannot quietly escape the rule (VERIFICATION.md §32). */
        var shapeTokens = ['gapToken', 'factorToken', 'percentToken'].filter(function (tk) { return cbv[tk]; });
        if (shapeTokens.length > 1)
          err.push('compareBars carries ' + shapeTokens.join(' and ') + ' — a compare is additive, ' +
                   'multiplicative or percent, and the model draws a different picture for each');
        ['gapToken', 'factorToken', 'percentToken'].forEach(function (tk) {
          if (cbv[tk] && !(p.problem.numbers || {})[cbv[tk]])
            err.push('compareBars.' + tk + ' names "' + cbv[tk] + '", which this problem does not define');
        });
        if (cbv.factorToken && (p.problem.numbers || {})[cbv.factorToken]) {
          var fv = parseFloat(p.problem.numbers[cbv.factorToken].value);
          if (!(fv > 1))
            err.push('compareBars.factorToken "' + cbv.factorToken + '" is ' + fv +
                     ' — a multiplicative compare needs a factor above 1, and the model draws nothing below it');
        }
        if (cbv.percentToken && (p.problem.numbers || {})[cbv.percentToken]) {
          var pvv = parseFloat(p.problem.numbers[cbv.percentToken].value);
          if (!(pvv > 0))
            err.push('compareBars.percentToken "' + cbv.percentToken + '" is ' + pvv +
                     ' — a percent compare needs a percentage above zero, and the model draws nothing at or below it');
        }
        if (cbv.gapToken && !cbv.factorToken && cbars.some(function (b) { return b.unknown; }) &&
            cbv.unknownIs !== 'larger' && cbv.unknownIs !== 'smaller')
          err.push('compareBars has an unknown amount and a gap, so unknownIs must be "larger" or "smaller" — ' +
                   'it decides which end the difference comes off, which is the entire lesson of this line');
        if (!cbv.a11yDescription)
          err.push('compareBars needs an a11yDescription; it is the picture\'s only text for a screen reader');
      }

      /* 10g. The Equal Groups tray. Written WITH the model rather than years
         after it, because 10f above exists only because `compareBars` shipped
         on three problems with nothing checking it at all. Same failure mode
         here: `repeater` names the choice the student must tap, and a typo in
         it makes every choice wrong, with no error anywhere and a Plan phase
         that cannot be passed. The sweep renders a phase; it never clicks one. */
      var gmv = (p.signalBox || {}).groupsModel;
      if (gmv) {
        var MODES = ['total', 'size', 'groups'];
        if (MODES.indexOf(gmv.unknownIs) === -1)
          err.push('groupsModel.unknownIs must be one of ' + MODES.join(' / ') +
                   ' (found "' + gmv.unknownIs + '") — it decides what the picture may legally draw');
        /* Which tokens are REQUIRED depends on which quantity is missing, and
           the missing one must NOT be tokenised: a token for it would be the
           answer, sitting in the manifest, one render away from the screen. */
        var need = { total: ['groupsToken', 'sizeToken'],
                     size: ['groupsToken', 'totalToken'],
                     groups: ['sizeToken', 'totalToken'] }[gmv.unknownIs] || [];
        need.forEach(function (tk) {
          if (!gmv[tk]) err.push('groupsModel.' + tk + ' is required when unknownIs is "' + gmv.unknownIs + '"');
          else if (!(p.problem.numbers || {})[gmv[tk]])
            err.push('groupsModel.' + tk + ' names "' + gmv[tk] + '", which this problem does not define');
        });
        var gkeys = (gmv.choices || []).map(function (c) { return c.key; });
        if (gkeys.length < 2)
          err.push('groupsModel needs at least 2 choices — naming the repeating amount is the task');
        (gmv.choices || []).forEach(function (c, i) {
          if (!c.key)   err.push('groupsModel choice ' + i + ' has no key');
          if (!c.label) err.push('groupsModel choice ' + i + ' has no label');
        });
        if (!gmv.repeater)
          err.push('groupsModel needs a repeater — it names the amount that repeats, which IS the question');
        else if (gkeys.indexOf(gmv.repeater) === -1)
          err.push('groupsModel repeater "' + gmv.repeater + '" is not one of the choice keys (' + gkeys.join(', ') +
                   ') — every pick would be marked wrong and the Plan phase could not be passed');
        Object.keys(gmv.whyWrong || {}).forEach(function (k) {
          if (gkeys.indexOf(k) === -1)
            err.push('groupsModel.whyWrong names "' + k + '", which is not a choice — it can never be shown');
          if (k === gmv.repeater)
            err.push('groupsModel.whyWrong explains the repeater itself, which is the CORRECT pick');
        });
        if (!gmv.a11yDescription)
          err.push('groupsModel needs an a11yDescription; it is the tray\'s only text for a screen reader');
      }

      /* 10h. The percent double number line. Written because 10f exists: the
         compare bars shipped on three problems with NOTHING checking them, the
         hole was found by accident, and the note there says the shape of it is
         "three of four is how this kind of gap hides". This was four of five.
         `percentLine` went live on cp-hot-drinks with no rule of its own, and
         it has the same fatal typo as every other Plan model — `base` names the
         choice the student must tap, and one wrong character makes every pick
         wrong, with no error anywhere and a Plan phase that cannot be passed.
         The sweep renders a phase; it never clicks one.

         And the one that is specific to this model: it draws its mark from a
         percentage that may come from EITHER a token or `percentAt`. Neither
         present means no geometry, so `html()` returns '' and the Plan phase is
         a silent empty frame — VERIFICATION.md §24's "what is it testing for
         when it means does this exist". */
      var plv = (p.signalBox || {}).percentLine;
      if (plv) {
        var PMODES = ['part', 'whole', 'percent'];
        if (PMODES.indexOf(plv.unknownIs) === -1)
          err.push('percentLine.unknownIs must be one of ' + PMODES.join(' / ') +
                   ' (found "' + plv.unknownIs + '") — it decides which end of the line carries the "?"');
        /* The MISSING amount must not be tokenised. A token for it would be the
           answer sitting in the manifest, one render away from the screen —
           and the model would print it instead of the question mark. */
        if (plv.unknownIs === 'whole' && plv.wholeToken)
          err.push('percentLine.unknownIs is "whole" but a wholeToken is authored — the whole is the ' +
                   'thing being asked for, and naming it would print the answer on the Plan screen');
        if (plv.unknownIs === 'part' && plv.partToken)
          err.push('percentLine.unknownIs is "part" but a partToken is authored — the part is the ' +
                   'thing being asked for, and naming it would print the answer on the Plan screen');
        var pneed = { part: ['wholeToken'], whole: ['partToken'], percent: ['partToken', 'wholeToken'] }[plv.unknownIs] || [];
        pneed.forEach(function (tk) {
          if (!plv[tk]) err.push('percentLine.' + tk + ' is required when unknownIs is "' + plv.unknownIs + '"');
          else if (!(p.problem.numbers || {})[plv[tk]])
            err.push('percentLine.' + tk + ' names "' + plv[tk] + '", which this problem does not define');
        });
        /* Where the mark sits comes from exactly one source. Both, and the
           position is decided by whichever branch percentOf() tests first. */
        /* REQUIRED IN ALL THREE MODES, INCLUDING `percent`, and the exemption
           that used to sit here was wrong.

           It read `if (plv.unknownIs !== 'percent')`, on the reasoning that a
           problem asking WHAT the percentage is has no percentage to state. But
           `geometry()` computes the mark's position from this value in every
           mode and bails to `null` without it — so `html()` returns '' and the
           Plan phase renders a silent empty frame, which is the exact failure
           §24 catalogues and the exact failure the rest of this rule exists to
           prevent. Caught while designing a `percent`-unknown problem: the
           model needs the mark's PLACE even when its LABEL is "?".

           Worth knowing before authoring one: placing that mark truthfully also
           discloses the answer positionally, which is why no problem on the
           site uses `percent` yet. That is a content decision, not a bug, and it
           belongs to whoever writes the first one. */
        var pSrc = ['percentToken', 'percentAt'].filter(function (tk) { return plv[tk] != null && plv[tk] !== ''; });
        if (pSrc.length !== 1)
          err.push('percentLine needs exactly one of percentToken / percentAt (found ' + pSrc.length +
                   ') — it is where the mark is drawn, in every mode including "percent", and with ' +
                   'neither the model refuses to draw at all');
        if (plv.percentToken && !(p.problem.numbers || {})[plv.percentToken])
          err.push('percentLine.percentToken names "' + plv.percentToken + '", which this problem does not define');
        /* Same guards the model itself applies, stated here so a bad set is a
           build error rather than an empty frame the student meets. */
        var pAt = plv.percentAt != null && String(plv.percentAt) !== ''
          ? parseAnswer(plv.percentAt)
          : parseAnswer(((p.problem.numbers || {})[plv.percentToken] || {}).value);
        if (pAt === null || !(pAt > 0))
          err.push('percentLine mark is "' + (plv.percentAt || plv.percentToken) + '", which is not a percentage ' +
                   'above zero — the model refuses to draw and the Plan phase renders nothing');
        else if (pAt > 200)
          err.push('percentLine mark is ' + pAt + '%, past the 200% the model will draw — a picture that ' +
                   'cannot show its own mark is worse than none');
        var pkeys = (plv.choices || []).map(function (c) { return c.key; });
        if (pkeys.length < 2)
          err.push('percentLine needs at least 2 choices — naming the amount that is 100% IS the task');
        (plv.choices || []).forEach(function (c, i) {
          if (!c.key)   err.push('percentLine choice ' + i + ' has no key');
          if (!c.label) err.push('percentLine choice ' + i + ' has no label');
        });
        if (!plv.base)
          err.push('percentLine needs a base — it names the amount that counts as 100%, which is the question');
        else if (pkeys.indexOf(plv.base) === -1)
          err.push('percentLine base "' + plv.base + '" is not one of the choice keys (' + pkeys.join(', ') +
                   ') — every pick would be marked wrong and the Plan phase could not be passed');
        Object.keys(plv.whyWrong || {}).forEach(function (k) {
          if (pkeys.indexOf(k) === -1)
            err.push('percentLine.whyWrong names "' + k + '", which is not a choice — it can never be shown');
          if (k === plv.base)
            err.push('percentLine.whyWrong explains the base itself, which is the CORRECT pick');
        });
        if (!plv.a11yDescription)
          err.push('percentLine needs an a11yDescription; it is the line\'s only text for a screen reader');
        /* The model is reached through `surface`, not through `line`. A
           percentLine on a problem that never opts in is authored content no
           student can ever see — dead content raises no alarm (§8). */
        if (p.surface !== 'percent')
          err.push('percentLine is authored but surface is not "percent" — PercentModel.applies() ' +
                   'checks the surface, so this picture would never be drawn');
      }
      if (p.surface === 'percent' && !(p.signalBox || {}).percentLine)
        err.push('surface is "percent" but there is no signalBox.percentLine — PercentModel would claim ' +
                 'nothing, and the problem falls through to its line\'s own model with no error anywhere');

      // 12. transfer ticket resolves
      if (p.transferTicket && !problems[p.transferTicket]) err.push('transferTicket "' + p.transferTicket + '" not found');

      /* 16-17. signalFailure — shape, and the placement that keeps it honest.

         This field was authored on nine problems and read by NO code for the
         whole of its life, so nothing ever enforced either. Two shapes drifted
         apart in that silence: eight problems used trigger/prompt/why while
         pw-quilt-colors used trapWord/trapReading/whyItFails/studentPrompt —
         and PROBLEM-SCHEMA documented the one used by a single problem. One
         shape now, and the checker holds the line.

         Rule 17 is the important one. The field used to live INSIDE signalBox,
         which is the Plan screen — three phases before the Engine Room. Six of
         the nine name the operation or the direction outright and cp-hot-drinks
         states a step answer verbatim, so a signalFailure sitting in signalBox
         is a pre-solve answer leak waiting for someone to render it where it
         sits. It is a top-level field, it renders only at the Arrivals Board,
         and putting it back inside signalBox is an error, not a style choice. */
      if (p.signalBox && Object.prototype.hasOwnProperty.call(p.signalBox, 'signalFailure'))
        err.push('signalFailure is nested inside signalBox — it must be top-level. Inside signalBox ' +
                 'it reads as Plan-screen content, and its text routinely names the operation, the ' +
                 'direction, or a step answer. It renders at the Arrivals Board, after the solve');

      if (p.signalFailure) {
        var sfOld = ['trapWord', 'trapReading', 'whyItFails', 'studentPrompt'].filter(function (k) {
          return Object.prototype.hasOwnProperty.call(p.signalFailure, k);
        });
        if (sfOld.length)
          err.push('signalFailure uses the retired shape (' + sfOld.join(', ') + ') — ' +
                   'use trigger/prompt/why');
        ['trigger', 'prompt', 'why'].forEach(function (k) {
          if (!p.signalFailure[k]) err.push('signalFailure.' + k + ' is missing or empty');
        });
      }

      // 13-15. randomization tags
      if (!(p.stationRoles || []).length) warn.push('no stationRoles — excluded from randomized trips');
      (p.stationRoles || []).forEach(function (rl) { if (ROLES.indexOf(rl) === -1) err.push('unknown stationRole "' + rl + '"'); });
      if (!p.context) warn.push('no context tag — weakens trip variety');
      if (!p.unknownCar) warn.push('no unknownCar tag — weakens trip variety');

      // grade-level leak
      var blob = JSON.stringify(p.problem) + JSON.stringify(p.ticketBooth) +
                 JSON.stringify(p.arrivals) + JSON.stringify(p.threeReads);
      if (/\bgrade\b|\b[6-9]th grade\b|middle school|high school/i.test(blob))
        err.push('grade level appears in student-visible text');

    }

    Object.keys(problems).forEach(function (id) {
      var base = problems[id], n = setCount(base), err = [], warn = [];
      for (var i = 0; i < n; i++) {
        var e = [], w = [];
        checkProblem(id, materialize(base, i), e, w);
        var tag = n > 1 ? 'number set ' + (i + 1) + ': ' : '';
        e.forEach(function (m) { err.push(tag + m); });
        w.forEach(function (m) { warn.push(tag + m); });
      }
      /* An unfilled token means a set forgot a value the prose asks for. It
         would otherwise reach a student as a literal "{{ans}}" on the page.

         This scan named the same six fields materialize() did, so a field
         absent from both was unfilled AND unchecked — the checker carrying the
         identical blind spot to the thing it checks. It reads everything now
         except the two fields that keep their tokens by design. */
      for (var j = 0; j < n; j++) {
        var mat = materialize(base, j), scan = {};
        Object.keys(mat).forEach(function (k) {
          if (UNFILLED_BY_DESIGN.indexOf(k) === -1) scan[k] = mat[k];
        });
        var blob = JSON.stringify(scan);
        var left = blob.match(/\{\{[a-zA-Z][\w]*\}\}/g);
        if (left) err.push((n > 1 ? 'number set ' + (j + 1) + ': ' : '') +
          'unfilled token(s) ' + Array.from(new Set(left)).join(', '));

        /* THE CHECK THIS FEATURE LIVES OR DIES ON.
           Everything else here verifies a set against ITSELF — accepted forms
           match the exact answer, the bracket contains it, no misconception
           collides with it. All of that passes happily when the answer is
           simply wrong: setting 168 / 14 to "13" produced zero errors, because
           nothing knew the two numbers were meant to divide.

           So a problem with number sets declares the arithmetic that ties them
           together, and every set is made to satisfy it. Stated as tokens
           rather than an expression string, so there is nothing to parse and
           nothing to evaluate. */
        (base.numberChecks || []).forEach(function (chk) {
          var mv = materialize(base, j), c = {};
          Object.keys(mv.problem.numbers).forEach(function (k) { c[k] = parseFloat(mv.problem.numbers[k].value); });
          var set = (base.numberSets || [])[j] || {};
          Object.keys(set.derived || {}).forEach(function (k) { c[k] = parseFloat(set.derived[k]); });

          /* THE BAR IS PART OF THE ARITHMETIC, SO IT IS CHECKABLE.
             `seg1` is how many parts bars[0] is drawn in for THIS set, `seg2`
             bars[1], and so on. Without them a set could carry a picture that
             contradicts its own numbers and every check still passed: an hour
             drawn in 3 stretches while the set's stretch is 15 minutes and the
             hour holds 4 of them. Planted exactly that and the validator
             reported clean, which is how this rule came to exist.

             It is the same defect as the quilt described in sixtieths and drawn
             in twentieths (rule 6f above), arriving through the door number sets
             opened — 6f reconciles the SCENE against the segments and never
             asks whether the segments themselves are right.

             `mark1` is how many of those parts are shaded, which carries just
             as much meaning: on a ratio bar the marked parts ARE the share the
             problem hands you, so "mark1 x perPart = n3" states in a check what
             the picture claims. */
          ((mv.signalBox || {}).barModel || {}).bars &&
            mv.signalBox.barModel.bars.forEach(function (b, bi) {
              if (typeof b.segments === 'number') c['seg' + (bi + 1)] = b.segments;
              if (typeof b.marked === 'number') c['mark' + (bi + 1)] = b.marked;
            });
          /* A term is either a name from the set or a bare number, so a check
             can say ["n1","/","3","=","part"] — the 3 is the fraction's
             denominator, a constant of the problem rather than something that
             varies per set. */
          var val = function (k) {
            if (c[k] !== undefined) return c[k];
            var lit = parseFloat(k);
            return isFinite(lit) && String(k).trim() !== '' ? lit : undefined;
          };
          var a = val(chk[0]), op = chk[1], b = val(chk[2]), want = val(chk[4]);
          if (a === undefined || b === undefined || want === undefined) {
            err.push('number set ' + (j + 1) + ': check ' + chk.join(' ') + ' names a value the set does not define');
            return;
          }
          var got = op === '/' ? a / b : op === '*' ? a * b : op === '+' ? a + b : a - b;
          if (Math.abs(got - want) > 1e-9)
            err.push('number set ' + (j + 1) + ': ' + chk[0] + ' ' + op + ' ' + chk[2] + ' is ' +
                     got + ', but ' + chk[4] + ' says ' + want);
        });
      }
      report.push({ id: id, status: base.status, errors: err, warnings: warn, numberSets: n });
    });

    /* PROBLEM-SCHEMA 10 has listed "no signalFailure anywhere in a line's whole
       set" as a warning since the schema was written, and it had never been
       implemented — the rule existed only as a sentence in a document, which is
       the same silence that let the field itself go nine problems without a
       reader. It is a per-LINE property, so it cannot live in checkProblem.

       A line with no Signal Failure anywhere has no problem that makes the
       student wrong on purpose, which for this site is a gap in the teaching
       rather than a defect in any one manifest. Hence a warning, on every
       problem of the offending line so it is visible wherever you happen to be
       looking. */
    var lineHasSF = {};
    Object.keys(problems).forEach(function (id) {
      var p = problems[id];
      if (!p.line) return;
      if (!(p.line in lineHasSF)) lineHasSF[p.line] = false;
      if (p.signalFailure) lineHasSF[p.line] = true;
    });
    report.forEach(function (row) {
      var ln = problems[row.id] && problems[row.id].line;
      if (ln && lineHasSF[ln] === false)
        row.warnings.push('no signalFailure anywhere on the "' + ln + '" line — nothing on it ' +
                          'springs a trap deliberately');
    });

    return report;
  }

  /* Deterministic shuffle, seeded by a string.
     Lives here rather than in stations.js because the Ratio Table needed it
     too and promptly grew a second copy — the answer sat at the top of every
     table for the same reason it once sat at the top of every Read 3. One
     implementation, two callers. Seeding keeps the order stable across a
     re-render so nothing moves under the student mid-question. */
  function seedFrom(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seededShuffle(arr, seedStr) {
    var a = (arr || []).slice(), s = seedFrom(String(seedStr)) || 1;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  global.MF = {
    validate: validate,
    seededShuffle: seededShuffle,
    registerProblem: registerProblem,
    registerHub: registerHub,
    problems: problems,
    hubs: hubs,
    publishedProblems: publishedProblems,
    LINES: LINES,
    MIXED: MIXED,
    PERCENT: PERCENT,
    percentProblems: percentProblems,
    rideInfo: rideInfo,
    materialize: materialize,
    setCount: setCount,
    STATIONS: STATIONS,
    renderText: renderText,
    speechText: speechText,
    parseAnswer: parseAnswer,
    checkAnswer: checkAnswer,
    matchMisconception: matchMisconception
  };
})(window);
