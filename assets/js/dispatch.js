/* ============================================================
   The Dispatch Office — build a problem manifest by hand.
   Live preview + live validation against PROBLEM-SCHEMA.md §10.
   ============================================================ */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  /* ---------- Distractor fields, built from the line list ---------- */

  function buildDistractorFields() {
    var line = $('f-line').value;
    var host = $('distractor-fields');
    var existing = {};
    [].forEach.call(host.querySelectorAll('textarea'), function (t) { existing[t.dataset.line] = t.value; });

    host.innerHTML = Object.keys(MF.LINES).filter(function (k) { return k !== line; })
      .map(function (k) {
        var L = MF.LINES[k];
        return '<div class="field">' +
          '<label for="d-' + k + '">If they pick ' + L.marker + ' ' + L.name +
          '<span class="hint-text">' + L.form + '</span></label>' +
          '<textarea id="d-' + k + '" data-line="' + k + '" rows="2">' +
          (existing[k] || '') + '</textarea></div>';
      }).join('');
    [].forEach.call(host.querySelectorAll('textarea'), function (t) { t.addEventListener('input', update); });
  }

  /* ---------- Parse the form into a manifest ---------- */

  /**
   * n1 = 12 | cups | 12 | how much the whole pot holds
   * A leading "-" marks a number the student does NOT need — deliberately
   * distracting information. It becomes role:"distractor" and needed:false.
   */
  function parseNumbers(raw) {
    var out = {};
    raw.split('\n').forEach(function (line) {
      line = line.trim(); if (!line) return;
      var m = line.match(/^(-?)\s*(n\d+)\s*=\s*(.+)$/);
      if (!m) return;
      var parts = m[3].split('|').map(function (s) { return s.trim(); });
      out[m[2]] = {
        value: parts[0] || '',
        unit: parts[1] || '',
        role: m[1] === '-' ? 'distractor' : '',
        spoken: parts[2] || parts[0] || '',
        describe: parts[3] || '',
        needed: m[1] !== '-'
      };
    });
    return out;
  }

  /**
   * One option per line. "*" marks the correct one, "|" adds the explanation:
   *   *The cups served at lunch | The part of the pot that went out
   */
  function parseOptions(raw) {
    return raw.split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) {
        var correct = l.charAt(0) === '*';
        if (correct) l = l.slice(1).trim();
        var i = l.indexOf('|');
        var text = i < 0 ? l : l.slice(0, i).trim();
        var why  = i < 0 ? '' : l.slice(i + 1).trim();
        var o = { text: text, why: why };
        if (correct) o.correct = true;
        return o;
      });
  }

  /** Comma separated; "*" marks the answer:  *part, whole, fraction */
  function parseCars(raw) {
    var opts = [], answer = '';
    raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
      if (s.charAt(0) === '*') { s = s.slice(1).trim(); answer = s; }
      opts.push(s);
    });
    return { options: opts, answer: answer };
  }

  function parseMisconceptions(raw) {
    return raw.split('\n').map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) {
        var i = l.indexOf('=');
        if (i < 0) return null;
        return { response: l.slice(0, i).trim(), diagnosis: l.slice(i + 1).trim(), tag: 'teacher-supplied' };
      }).filter(Boolean);
  }

  function build() {
    var sentences = $('f-text').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var text = sentences.join(' ');
    var numbers = parseNumbers($('f-numbers').value);
    var forms = $('f-forms').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var hints = [1, 2, 3, 4].map(function (n) {
      var v = $('f-h' + n).value.trim();
      return v ? { rung: n, type: ['whistle', 'signal', 'coupling', 'route'][n - 1], text: v } : null;
    }).filter(Boolean);

    var distractors = [].map.call(document.querySelectorAll('#distractor-fields textarea'), function (t) {
      return t.value.trim() ? { line: t.dataset.line, whyWrong: t.value.trim() } : null;
    }).filter(Boolean);

    var ans = { exact: $('f-ans').value.trim(), unit: $('f-unit').value.trim(), acceptedForms: forms };
    var misc = parseMisconceptions($('f-misc').value);
    var cars = parseCars($('f-cars').value);
    var r3opts = parseOptions($('f-read3').value);

    // Read 2 is generated from the numbers themselves, so a teacher can never
    // add a quantity and forget to say what it measures.
    var quantities = Object.keys(numbers).map(function (tok) {
      return { token: tok, describe: numbers[tok].describe || 'this quantity', needed: numbers[tok].needed !== false };
    });
    Object.keys(numbers).forEach(function (tok) {
      delete numbers[tok].describe; delete numbers[tok].needed;   // not part of the schema
    });

    var m = {
      id: $('f-id').value.trim(),
      schemaVersion: 1,
      status: 'draft',
      title: $('f-title').value.trim() || $('f-id').value.trim(),
      line: $('f-line').value,
      topics: [],
      steps: 1,
      unknownCar: $('f-unknown').value.trim(),
      context: $('f-context').value,
      fadeLevel: 'independent',
      stationRoles: ['reading', 'drafting', 'estimation', 'switchyard', 'signalbox'],
      hubEligible: false,
      provenance: { source: 'dispatch-office', author: '', addedOn: new Date().toISOString().slice(0, 10) },

      problem: {
        text: text,
        sentences: sentences,
        questionSentenceIndex: Math.max(0, (parseInt($('f-qindex').value, 10) || 1) - 1),
        numbers: numbers,
        context: { setting: $('f-context').value, requiresCulturalKnowledge: false }
      },

      threeReads: {
        /* The Platform Check is authored here too, or teacher-written problems
           would run a Read 1 that stops short of naming why the problem is on
           its line — and the validator would report every one of them as
           broken. Adding a required field without coming here is the recorded
           failure in VERIFICATION.md §7, which is exactly what this is. */
        read1: {
          prompt: "What's the story? Who or what is involved, and what's happening?",
          modelAnswer: '',
          platformCheck: {
            // "3" or "3, 4" — the signal often spans more than one sentence.
            sentences: ($('f-pcindex').value || '').split(',')
              .map(function (s) { return parseInt(s, 10); })
              .filter(function (n) { return n > 0; })
              .map(function (n) { return n - 1; }),
            why: $('f-pcwhy').value.trim(),
            kinds: $('f-pckinds').value.trim()
          },
          authored: 'dispatch'
        },
        read2: {
          prompt: 'What quantities do you have, and how are they connected?',
          quantities: quantities,
          relationship: $('f-relationship').value.trim(),
          authored: 'dispatch'
        },
        read3: {
          prompt: 'Which one is the question asking for?',
          modelAnswer: (r3opts.filter(function (o) { return o.correct; })[0] || {}).text || '',
          options: r3opts,
          authored: 'dispatch'
        }
      },

      ticketBooth: {
        correctLine: $('f-line').value,
        whyCorrect: $('f-whycorrect').value.trim(),
        distractors: distractors,
        unknownCar: $('f-unknown').value.trim(),
        unknownCarPrompt: 'Which car is missing?',
        unknownCarOptions: cars.options,
        unknownCarAnswer: cars.answer,
        unknownCarWhy: $('f-carwhy').value.trim()
      },

      signalBox: {
        estimate: {
          prompt: 'Before you calculate — roughly what do you think the answer will be?',
          reasonableMin: MF.parseAnswer($('f-estmin').value),
          reasonableMax: MF.parseAnswer($('f-estmax').value),
          modelReasoning: '',
          unit: $('f-unit').value.trim()
        }
      },

      engineRoom: {
        fadeLevel: 'independent',
        steps: [{
          id: 's1',
          prompt: sentences[Math.max(0, (parseInt($('f-qindex').value, 10) || 1) - 1)] || 'Work it out.',
          answer: ans,
          workedExplanation: '',
          misconceptions: misc,
          hints: hints
        }]
      },

      arrivals: {
        answer: ans,
        questionCheck: 'Does this answer the question that was actually asked?',
        unitsCheck: $('f-unit').value.trim(),
        reasonablenessCheck: 'Does this answer make sense in the real world?'
      },

      review: {
        math: { status: 'unverified', notes: 'Authored in the Dispatch Office. Maths NOT independently checked.' },
        theme: { status: 'untested' }, teacher: { status: 'untested' },
        student: { status: 'untested' }, oversight: { status: 'pending' }
      }
    };
    return m;
  }

  /* ---------- Validation (reuses the real validator) ---------- */

  function validateManifest(m) {
    var backup = MF.problems[m.id];
    MF.registerProblem(m);
    var rep = MF.validate().filter(function (r) { return r.id === m.id; })[0];
    delete MF.problems[m.id];
    if (backup) MF.registerProblem(backup);
    return rep || { errors: [], warnings: [] };
  }

  /* ---------- Render ---------- */

  function update() {
    var m = build();

    // preview
    // Prose, matching how the student will actually see it.
    function preview(maskNums) {
      return '<p>' + m.problem.sentences.map(function (s, i) {
        return '<span class="s' + (i === m.problem.questionSentenceIndex ? ' q-sentence' : '') + '">' +
          MF.renderText(s, m.problem.numbers, maskNums) + '</span>';
      }).join(' ') + '</p>';
    }
    var masked = m.problem.sentences.length ? preview(true) : '';
    var plain  = m.problem.sentences.length ? preview(false) : '';
    $('preview-masked').innerHTML = masked || '<p>—</p>';
    $('preview-plain').innerHTML = plain || '<p>—</p>';
    $('preview-speech').textContent =
      '“' + m.problem.sentences.map(function (s) {
        return MF.speechText(s, m.problem.numbers, false);
      }).join(' ') + '”';

    // Validation, split into what's BROKEN versus what's merely UNFINISHED.
    // A half-filled problem is valid by design (schema §6.2) — the site just
    // skips the stations it has no data for. Flagging that as an error would
    // tell teachers their work is wrong when it is only partial.
    var rep = validateManifest(m);
    var INCOMPLETE = /no distractor explanation|has no hints|needs a real explanation|has no misconceptions/;

    var broken = rep.errors.filter(function (e) { return !INCOMPLETE.test(e); });
    var unfinished = [];

    if (!m.ticketBooth.distractors.length)
      unfinished.push('No wrong-line explanations — the Ticket Booth will be skipped, so students never practise spotting the line.');
    else if (rep.errors.some(function (e) { return /no distractor explanation/.test(e); }))
      unfinished.push('Some lines still have no explanation. All four need one before the Ticket Booth can run.');

    var mpc = m.threeReads.read1.platformCheck;
    if (!mpc.why || !mpc.kinds)
      unfinished.push('The Platform Check has no explanation yet — the first read will still work, but it will stop before telling the student why this problem is on its line.');

    if (!m.engineRoom.steps[0].hints.length)
      unfinished.push('No hints — a stuck student has nothing to ask for.');
    if (!m.engineRoom.steps[0].misconceptions.length)
      unfinished.push('No common wrong answers — students get a generic “not quite” instead of a diagnosis.');

    rep.warnings.filter(function (w) { return !INCOMPLETE.test(w); })
       .forEach(function (w) { unfinished.push(w); });

    var items = [];
    if (broken.length) {
      items.push('<li><strong>Needs fixing</strong></li>');
      broken.forEach(function (e) { items.push('<li class="val-err">✗ ' + e + '</li>'); });
    } else {
      items.push('<li class="val-ok">✓ Nothing broken — this problem will run.</li>');
    }
    if (unfinished.length) {
      items.push('<li style="padding-top:12px"><strong>Still to fill in</strong> ' +
                 '<span class="hint-text">Optional. Each gap just means that station is skipped.</span></li>');
      unfinished.forEach(function (w) { items.push('<li class="val-warn">◦ ' + w + '</li>'); });
    } else if (!broken.length) {
      items.push('<li class="val-ok">✓ Fully scaffolded. The maths is still unchecked.</li>');
    }
    $('validation').innerHTML = items.join('');

    // output file
    $('filename').textContent = 'content/problems/' + (m.id || 'problem') + '.js';
    $('out').value =
      '/* Authored in the Dispatch Office. Maths NOT independently verified. */\n' +
      'MF.registerProblem(' + JSON.stringify(m, null, 2) + ');\n';
  }

  /* ---------- Wire up ---------- */

  function init() {
    $('sign-portrait').innerHTML = MrFraction.svg('steady', 44, true);
    $('mf-here').innerHTML = MrFraction.svg('steady', 64, true);

    buildDistractorFields();
    [].forEach.call(document.querySelectorAll('input, textarea, select'), function (e) {
      e.addEventListener('input', update);
      e.addEventListener('change', update);
    });
    $('f-line').addEventListener('change', function () { buildDistractorFields(); update(); });

    $('copy').addEventListener('click', function () {
      var t = $('out');
      t.removeAttribute('readonly'); t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      t.setAttribute('readonly', 'readonly');
      $('copied').textContent = ok ? 'Copied. Paste it into ' + $('filename').textContent
                                   : 'Copy failed — select the text and copy it manually.';
    });

    $('download').addEventListener('click', function () {
      var blob = new Blob([$('out').value], { type: 'text/javascript' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = ($('f-id').value.trim() || 'problem') + '.js';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      $('copied').textContent = 'Downloaded. Put it in content/problems/ and add a script tag in index.html.';
    });

    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
