/* ============================================================
   Mr Fraction, as a floating companion.

   WHY THIS REPLACED THE INLINE ASIDES. Every phase used to render its own
   `.mf-aside` block — a portrait and a speech bubble sitting in the flow of the
   page, pushing the actual work down. On a site whose students are told a dense
   page is a barrier before any maths begins, Mr Fraction was costing vertical
   space on every screen and interrupting the reading order to do it.

   He now lives in ONE place, bottom right, and the page underneath is just the
   work. The pattern is the sister site's (`mr-companion` on Mr. Fraction
   Factory): fixed to the corner, bubble above the figure with its tail pointing
   down at him, `pointer-events: none` on the container so the page stays
   clickable through it and `auto` on the bubble so the text is still
   selectable.

   THE ART, AND THE ONE RULE A GIF BREAKS
   `Conductor_Mr_Fraction_GIF.gif` is a real animation — 6 frames, 130ms each,
   0.78s, looping forever — of Mr Fraction talking: the mouth cycles out to
   closed while the arms see-saw. It is exactly right for "he is saying this".

   But **CSS cannot pause a GIF**, and every other animation on this site has a
   reduced-motion pose. So the figure is a `<picture>`: the GIF is the default
   source and `(prefers-reduced-motion: reduce)` swaps in the Front PNG, which
   is frame 0 of the same animation. No JavaScript, no flash of the wrong asset.

   AND HE ONLY TALKS WHILE HE IS TALKING. A 0.78s loop running forever in the
   corner of a page where a student is reading a word problem is precisely what
   THEME §3.3 restricts. `data-speaking` is set when a new line arrives and
   cleared a few seconds later, so the animation MEANS something — it marks that
   he just said this — instead of being ambient wallpaper.
   ============================================================ */
(function (global) {
  'use strict';

  var ART = 'assets/art/';
  var SPEAK_MS = 2600;          // ~3 loops of the 780ms cycle, then settle

  /* The moods the rest of the site asks for, mapped to a turnaround view. The
     art has no expressions, so mood becomes ORIENTATION and bubble colour
     rather than a face: he turns to you to explain, and looks away to think.
     `proud` is included because a call site asks for it and the SVG character
     never had it — it fell through to a default and nobody noticed. */
  var VIEW = {
    steady:   'Conductor_Mr_Fraction_(Front).png',
    pleased:  'Conductor_Mr_Fraction_(Front).png',
    proud:    'Conductor_Mr_Fraction_(Front).png',
    thinking: 'Conductor_Mr_Fraction_(Left_Side).png',
    curious:  'Conductor_Mr_Fraction_(Right_Side).png'
  };
  var TONE = { steady: 'tell', pleased: 'good', proud: 'good', thinking: 'probe', curious: 'probe' };

  var host = null, queue = [], timer = null;
  var said = [], at = 0, turn = null;
  /* Slow. He is not paging through a deck, he is making remarks. Long enough
     that a student who is reading the actual problem is not tugged sideways
     every few seconds, and long enough to finish a sentence twice over. */
  var TURN_MS = 11000;

  /* HE ROTATES ON HIS OWN. NOBODY CLICKS THROUGH HIM.
     There was a next button with a counter, and it was the wrong idea: it made
     reading his commentary a task with controls, on a site where the student
     already has a real task on the same screen. Anything with a button on it
     asks to be finished.

     He turns over slowly by himself instead, the way the sister site's
     companion does. The dots are a POSITION MARK, not a control — no tap
     target, aria-hidden, purely so the movement reads as a rotation rather than
     the text changing at random. */
  function render() {
    if (!host || !said.length) return;
    var l = said[at];
    var dots = '';
    if (said.length > 1) {
      dots = '<div class="mf-c-dots" aria-hidden="true">';
      for (var i = 0; i < said.length; i++) dots += '<span' + (i === at ? ' data-on="1"' : '') + '></span>';
      dots += '</div>';
    }
    host.querySelector('#mf-c-bubble').innerHTML =
      '<div class="mf-c-line" data-tone="' + esc(TONE[l.mood] || 'tell') + '">' + l.html + '</div>' + dots;
    if (turn) clearTimeout(turn);
    if (said.length > 1) turn = setTimeout(advance, TURN_MS);
  }

  function advance() {
    if (!said.length) return;
    at = (at + 1) % said.length;
    render();
    if (host) {
      host.setAttribute('data-speaking', 'yes');
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () { if (host) host.setAttribute('data-speaking', 'no'); }, SPEAK_MS);
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function ensure() {
    if (host) return host;
    host = document.createElement('div');
    host.className = 'mf-companion';
    host.id = 'mf-companion';
    host.hidden = true;
    /* aria-live so a screen reader hears what he says WITHOUT the focus moving.
       He is commentary, never a step in the task — stealing focus to the corner
       of the page mid-question is exactly the nuisance a11y.js exists to avoid. */
    host.innerHTML =
      '<div class="mf-c-bubble" id="mf-c-bubble" role="status" aria-live="polite"></div>' +
      '<button class="mf-c-figure" id="mf-c-figure" type="button" ' +
        'aria-label="Mr Fraction. Tap to hide what he said.">' +
        '<picture>' +
          '<source media="(prefers-reduced-motion: reduce)" srcset="' + ART + 'Conductor_Mr_Fraction_(Front).png">' +
          '<img src="' + ART + 'Conductor_Mr_Fraction_GIF.gif" alt="" id="mf-c-img">' +
        '</picture>' +
      '</button>';
    /* FIRST IN THE DOM, NOT LAST. The user's instruction, 2026-08-16: Mr
       Fraction is to be READ FIRST when the page is read.

       He was `appendChild`ed to the body, which put him last in the document
       and therefore last in a screen reader's browse order — after every
       station phase, every option and every button on the screen. A sighted
       student sees him immediately, in the corner; a student reading the page
       linearly reached his commentary only after working through the thing he
       was commenting on. Those are two different pages.

       THIS COSTS NOTHING VISUALLY, and that is why it is the right fix rather
       than an ARIA one. `.mf-companion` is `position: fixed`, so where it sits
       in the document has no bearing on where it is painted. There is no
       `aria-flowto` here, no tabindex ordering, no duplicate copy for screen
       readers — the reading order is simply made to match what the eye already
       does.

       AFTER THE SKIP LINK, NOT BEFORE IT. The skip link has to stay the first
       focusable thing on the page: its whole job is to let a keyboard user
       bypass what comes next, and the companion is now part of what comes
       next. Putting him ahead of it would mean tabbing THROUGH him to reach
       the control that exists to let you skip him.

       ONE THING THIS CHANGES THAT IS NOT READING ORDER, recorded because it is
       invisible until it matters: `.a11y-panel` also sits at `z-index: 200`,
       and among equal z-index the later element in the document paints on top.
       Last in the body, the companion floated OVER the accessibility drawer;
       second in the body, the drawer now covers him, which is the correct way
       round for a settings panel the student has deliberately opened. */
    var skip = document.querySelector('.skip-link');
    if (skip && skip.parentNode === document.body) document.body.insertBefore(host, skip.nextSibling);
    else document.body.insertBefore(host, document.body.firstChild);
    host.querySelector('#mf-c-figure').addEventListener('click', function () {
      if (host.getAttribute('data-open') === 'no') open(); else collapse();
    });
    return host;
  }

  function collapse() { if (host) host.setAttribute('data-open', 'no'); }
  function open()     { if (host) host.setAttribute('data-open', 'yes'); }

  /** Queue a line. Called by MrFraction.aside() during html construction. */
  function queueLine(mood, html) {
    queue.push({ mood: mood || 'steady', html: html || '' });
  }

  /** Show everything queued since the last flush. Called after a render. */
  function flush() {
    var h = ensure();
    if (!queue.length) { hide(); return; }

    var lines = queue.slice();
    queue = [];

    /* The LAST mood wins for the figure, because it is the most recent thing he
       said. All lines are shown — a phase that queues two is giving two pieces
       of commentary and dropping one would be silent data loss. */
    var mood = lines[lines.length - 1].mood;
    var img = h.querySelector('#mf-c-img');
    var still = VIEW[mood] || VIEW.steady;
    /* Swap only the STILL source. The gif stays the animated one for every
       mood — the art has a single talking loop and pretending otherwise would
       mean showing a front-facing animation under a side-facing still. */
    h.querySelector('source').setAttribute('srcset', ART + still);
    if (img && img.getAttribute('data-still') !== still) img.setAttribute('data-still', still);

    /* ONE THING AT A TIME, LIKE A CONVERSATION.
       Every queued line used to be stacked into one bubble, which on the Five
       Situations hub produced a wall of text taller than the page it was
       commenting on — a speech bubble several times the size of the speaker.
       He now says one line, waits, and moves to the next: rotating, the way a
       person talking to you does, rather than handing over a transcript.

       Nothing is lost — every line still gets said, and a student can tap
       through them at their own speed instead of waiting. */
    said = lines;
    at = 0;
    render();

    h.hidden = false;
    open();
    h.setAttribute('data-speaking', 'yes');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { if (host) host.setAttribute('data-speaking', 'no'); }, SPEAK_MS);
  }

  function hide() { if (host) { host.hidden = true; host.setAttribute('data-speaking', 'no'); } }

  global.Companion = {
    queue: queueLine, flush: flush, hide: hide,
    collapse: collapse, open: open,
    _pending: function () { return queue.length; }
  };
})(window);
