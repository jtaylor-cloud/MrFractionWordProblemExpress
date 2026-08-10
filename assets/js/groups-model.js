/* ============================================================
   The Equal Groups model — the Plan phase for Equal Groups Express.

   WHY THIS FILE EXISTS. Same reason as the ratio table, the change train and
   the compare bars: the Model Yard draws one whole cut into equal parts, which
   is the Part–Whole signature, and handing it to another line teaches the wrong
   structure. Equal Groups has a whole that gets BUILT rather than cut — the
   same amount, laid down again and again until it makes a total.

   WHAT THE STUDENT DOES: taps the amount that REPEATS.

   That is this line's version of the one decision each Plan model asks for —
   the ratio table's scale factor, the change train's operation, the compare
   bars' referent. Once you know which quantity is the repeating unit and which
   is the total it builds, the operation follows without being told. Getting it
   backwards is the error the line exists to catch: in "how many 2/3-cup
   servings in 4 cups?" the 2/3 is the unit and the 4 is the total, and a
   student who reads it the other way multiplies and gets 2 2/3.

   THE RULE THAT DECIDES THE GEOMETRY, AND IT IS NOT OPTIONAL:

     THE PICTURE MAY NEVER DRAW AS MANY GROUPS AS THE ANSWER, WHEN THE NUMBER
     OF GROUPS IS THE ANSWER.

   Tiling the total with eight boxes when "how many fit?" is the question does
   not illustrate the problem — it performs it, and a student can count the
   boxes and never divide anything. So the geometry branches on WHICH quantity
   is missing, and the groups-unknown case deliberately draws the total, ONE
   unit beside it, and stops. That is the same stopping point the ratio table
   has at the scale factor and the compare bars have at the gap: the Plan phase
   runs BEFORE the Engine Room, and this project has recorded a model doing the
   student's work five times.

   WIDTHS ARE DERIVED, NEVER AUTHORED — from the tokens in the CURRENT number
   set. An authored width is right for set 1 and quietly wrong for the other
   three (VERIFICATION.md §33), which is how the compare bars once drew the
   unknown longer than the amount it was measured against.

   AND THE DISTINCTION THIS LINE MUST HOLD AGAINST ITS NEIGHBOUR: multiplicative
   compare (cp-parking-spaces) also draws one bar as copies of another. It is
   not this. There, exactly TWO things exist and one is measured against the
   other; nothing is a group of anything. Here the groups are separate real
   things and they BUILD A TOTAL. The Platform Check keys `shape: repeat` to
   this line alone, and cp-parking-spaces argues at length that it is not a
   repeat — the two have to stay arguable in opposite directions.
   ============================================================ */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function modelOf(p) { return p && p.signalBox && p.signalBox.groupsModel; }

  /** Does this problem carry an equal-groups picture? If so it owns the Plan phase. */
  function applies(p) { return !!modelOf(p); }

  /* Fractions, decimals and whole numbers all have to become a length. This is
     the same parse the compare model uses and it exists for the same reason:
     parseFloat("2/3") is 2, which draws a bar three times too long and
     validates perfectly clean. On THIS line that bug would be worse than
     anywhere else, because fraction division is the line's keystone problem and
     "2/3" is exactly the value it turns on. */
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

  function labelOf(p, token) {
    var n = p.problem && p.problem.numbers && p.problem.numbers[token];
    if (!n) return '';
    return n.value + (n.unit ? ' ' + n.unit : '');
  }

  /* THREE SHAPES, ONE FOR EACH THING THAT CAN BE MISSING. Which one is missing
     is the whole lesson, exactly as it is on the Compare Line — and here it
     also decides what may legally be drawn.

       total   — groups and size given. Lay out the groups; the TOTAL is a
                 bracket carrying the question. Counting the boxes and
                 multiplying is the work, and the picture stops before it.
       size    — groups and total given. Lay out the groups inside the total,
                 each one carrying "?" — safe, because how many boxes there are
                 is a value the story states.
       groups  — size and total given, and THE ANSWER IS A COUNT OF BOXES. Draw
                 the total, draw ONE unit beside it, and stop. Tiling here would
                 hand over the answer to anyone who can count. */
  function geometry(p, gm) {
    var unknown = gm.unknownIs;                       // 'total' | 'size' | 'groups'
    var n = valueOf(p, gm.groupsToken);
    var s = valueOf(p, gm.sizeToken);
    var t = valueOf(p, gm.totalToken);

    if (unknown === 'total') {
      if (!isFinite(n) || !isFinite(s) || n <= 0 || s <= 0) return null;
      if (n > 12) return null;                        // beyond this the boxes stop being legible
      return { mode: 'total', groups: n, size: s };
    }
    if (unknown === 'size') {
      if (!isFinite(n) || !isFinite(t) || n <= 0 || t <= 0) return null;
      if (n > 12) return null;
      return { mode: 'size', groups: n, total: t };
    }
    if (unknown === 'groups') {
      if (!isFinite(s) || !isFinite(t) || s <= 0 || t <= 0) return null;
      /* The unit must be drawable as a fraction of the total, and must not be
         bigger than it — "how many 6-cup servings in 4 cups?" is a fine
         question but not a picture this model can draw honestly. */
      if (s > t) return null;
      return { mode: 'groups', size: s, total: t, unitPct: (s / t) * 100 };
    }
    return null;
  }

  /* The boxes LAY DOWN one after another rather than appearing all at once, and
     that is teaching rather than decoration: this line's whole idea is the same
     amount put down again and again, and a tray that arrives fully formed shows
     the result of that without ever showing the act. `--eg-i` staggers each box
     against the one before it. Frozen under reduced motion the tray is simply
     complete, which is the honest still. */
  function box(i, widthPct, label, unknown) {
    return '<span class="eg-box' + (unknown ? ' eg-box-unknown' : '') +
           '" style="width:' + widthPct.toFixed(3) + '%;--eg-i:' + i + '">' +
           '<span class="eg-box-val">' + esc(label) + '</span></span>';
  }

  function html(p) {
    var gm = modelOf(p);
    if (!gm) return '';
    var g = geometry(p, gm);
    if (!g) return '';

    var tray = '', totalVal, sizeVal;

    if (g.mode === 'total') {
      sizeVal = labelOf(p, gm.sizeToken);
      for (var i = 0; i < g.groups; i++) tray += box(i, 100 / g.groups, sizeVal, false);
      totalVal = '?';
    } else if (g.mode === 'size') {
      for (var j = 0; j < g.groups; j++) tray += box(j, 100 / g.groups, '?', true);
      totalVal = labelOf(p, gm.totalToken);
    } else {
      /* GROUPS UNKNOWN. One unit, drawn to scale against the total, and an open
         run of track after it. The dashed remainder is not "the other groups" —
         it is the part of the total this one unit does not cover, which is
         precisely the question. See the header. */
      tray = box(0, g.unitPct, labelOf(p, gm.sizeToken), false) +
             '<span class="eg-rest" style="width:' + (100 - g.unitPct).toFixed(3) + '%">' +
             '<span class="eg-rest-q">' + esc(gm.restLabel || 'how many more of these?') + '</span></span>';
      totalVal = labelOf(p, gm.totalToken);
    }

    /* The two things a student can tap. They are the QUANTITIES, not the boxes:
       the question is which amount repeats, and a row of boxes is already an
       answer to it. So the tap targets are named amounts and the picture sits
       above them, the same grammar the compare bars use. */
    var choices = (gm.choices || []).map(function (c) {
      return '<button class="eg-pick" type="button" data-key="' + esc(c.key) + '" aria-pressed="false" ' +
        'aria-label="' + esc(c.label + ', ' + (c.said || '') +
          '. Tap if this is the amount that repeats.') + '">' +
        '<span class="eg-pick-name">' + esc(c.label) + '</span>' +
        '<span class="eg-pick-val">' + esc(c.said || '') + '</span>' +
      '</button>';
    }).join('');

    return '' +
      '<div class="model eggroups" data-mode="' + esc(g.mode) + '">' +
        '<div class="section-head">' +
          '<span class="eyebrow">' + esc(gm.title || 'The same amount, again') + '</span>' +
          '<h3>' + esc(gm.heading || 'One group, laid down over and over') + '</h3>' +
        '</div>' +

        '<div class="eg-tray-wrap">' +
          '<div class="eg-tray">' + tray + '</div>' +
          '<div class="eg-total"><span class="eg-total-bracket" aria-hidden="true"></span>' +
            '<span class="eg-total-label">' + esc(gm.totalLabel || 'in total') + ': <strong>' +
            esc(totalVal) + '</strong></span></div>' +
        '</div>' +

        '<p class="yard-say eg-say" role="status">' + esc(gm.prompt ||
          'Which amount is the one that repeats?') + '</p>' +
        '<div class="eg-picks">' + choices + '</div>' +

        '<div class="eg-settled" id="eg-settled" hidden>' +
          '<span class="eg-settled-label">' + esc(gm.settledLabel || 'so the question is') + ' <strong>' +
          esc(gm.questionLabel || '?') + '</strong></span>' +
        '</div>' +

        '<div class="feedback" role="status" id="eg-fb"></div>' +
        '<p class="hint-text"><strong>In words:</strong> ' + esc(gm.a11yDescription || '') + '</p>' +
      '</div>';
  }

  function wire(root, p, onDone) {
    var gm = modelOf(p);
    if (!gm) return;
    var wrap = root.querySelector('.eggroups');
    if (!wrap) return;
    var done = false;

    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-key]');
      if (!b || done || b.disabled) return;
      var key = b.getAttribute('data-key');
      var fb = wrap.querySelector('#eg-fb');

      if (key !== gm.repeater) {
        /* A wrong pick is answered in terms of what the story says and never
           marked — the same shape the compare bars use, because reading the
           unit backwards is the error this line is built around and it has to
           be walked into rather than punished. */
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        var wrong = (gm.whyWrong && gm.whyWrong[key]) ||
          'Read it again and ask which amount is the one being laid down over and over.';
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
      wrap.querySelector('#eg-settled').hidden = false;
      fb.innerHTML = '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span>' +
                     '<p><strong>Yes.</strong> ' + esc(gm.why || '') + '</p></div>';
      fb.setAttribute('tabindex', '-1'); fb.focus();
      if (global.A11y && A11y.announce) {
        A11y.announce('Correct. ' + (gm.why || ''));
      }
      if (onDone) onDone();
    });
  }

  global.GroupsModel = { applies: applies, html: html, wire: wire };
})(window);
