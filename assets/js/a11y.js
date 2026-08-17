/* ============================================================
   Accessibility panel: typeface, size, tint, reading ruler,
   read-aloud, and the number-reveal escape hatch.

   Preferences are session-only by project constraint (no storage
   of any kind). Because the whole journey is one page, they
   persist for as long as the student is here — which is what the
   single-page decision was for.
   ============================================================ */
(function (global) {
  'use strict';

  var TINTS = {
    none:  'transparent',
    peach: 'rgba(255, 214, 170, .38)',
    blue:  'rgba(170, 214, 255, .34)',
    green: 'rgba(186, 232, 196, .34)',
    grey:  'rgba(190, 190, 190, .30)'
  };

  var state = { revealNumbers: false, ruler: false, rate: 1 };
  var root = document.documentElement;

  function $(id) { return document.getElementById(id); }

  function setPressed(group, attr, value) {
    var btns = group.querySelectorAll('[' + attr + ']');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute(attr) === value ? 'true' : 'false');
    }
  }

  function announce(msg) {
    var live = $('live');
    if (live) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 60); }
  }

  /* ---------- Panel open/close ---------- */

  var panel, opener, lastFocus;

  function openPanel() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    opener.setAttribute('aria-expanded', 'true');
    /* Mr Fraction stops talking while this panel is open. The panel is a list
       of options a student has come here to READ, and a speech bubble in the
       corner competing with it is precisely the wrong moment for commentary.
       He stays on screen — only the bubble goes — so it is obvious he is still
       there and nothing has broken. */
    if (global.Companion) global.Companion.collapse();
    var first = panel.querySelector('button, input');
    if (first) first.focus();
    document.addEventListener('keydown', onPanelKey, true);
  }

  function closePanel() {
    panel.hidden = true;
    opener.setAttribute('aria-expanded', 'false');
    if (global.Companion) global.Companion.open();
    document.removeEventListener('keydown', onPanelKey, true);
    // Return focus to whatever interactive control the student was on. Alt+A
    // can be pressed from anywhere, so lastFocus is often <body> or the <main>
    // container — focusing either of those strands a keyboard user with no
    // obvious next Tab stop. Fall back to the button that opens the panel.
    var ok = lastFocus && lastFocus.focus &&
             /^(BUTTON|INPUT|TEXTAREA|SELECT|A)$/.test(lastFocus.tagName) &&
             document.contains(lastFocus);
    (ok ? lastFocus : opener).focus();
  }

  function onPanelKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
    if (e.key !== 'Tab') return;
    // Keep focus inside the panel while it is open.
    var f = panel.querySelectorAll('button, input, [href], select, textarea');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Reading ruler ---------- */

  var rulerY = 0.4, top, bottom;
  var BAND = 130; // px of clear reading window

  function drawRuler() {
    if (!state.ruler) { top.hidden = true; bottom.hidden = true; return; }
    var h = window.innerHeight;
    var centre = rulerY * h;
    var t = Math.max(0, centre - BAND / 2);
    var b = Math.min(h, centre + BAND / 2);
    top.hidden = false; bottom.hidden = false;
    top.style.top = '0px';    top.style.height = t + 'px';
    bottom.style.top = b + 'px'; bottom.style.height = Math.max(0, h - b) + 'px';
  }

  function onMove(e) {
    if (!state.ruler) return;
    rulerY = e.clientY / window.innerHeight;
    drawRuler();
  }

  function onRulerKey(e) {
    if (!state.ruler) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowDown') { rulerY = Math.min(1, rulerY + 0.04); drawRuler(); }
    else if (e.key === 'ArrowUp') { rulerY = Math.max(0, rulerY - 0.04); drawRuler(); }
  }

  /* ---------- Read aloud ---------- */

  var synth = global.speechSynthesis;

  /**
   * Collect everything on screen, in reading order.
   *
   * This used to be a fixed tag list — `h1, h2, h3, p, li, label` — which
   * silently skipped every standalone <button>, <span> and <figcaption>.
   * In practice that meant the answer buttons, the eyebrow labels naming the
   * station, the Model Yard readout, the Shunting Yard results and the picture
   * captions were never spoken. A student relying on read-aloud simply never
   * heard them, and the omission tracked whatever markup a thing happened to
   * use rather than anything about the content.
   *
   * Walking the DOM instead means new UI is read by default, rather than
   * needing to be remembered and added to a list.
   */
  function collectSpeech(root) {
    var parts = [], buf = [];
    function flush() {
      var t = buf.join(' ').replace(/\s+/g, ' ').trim();
      if (t) parts.push(t);
      buf = [];
    }
    (function walk(n) {
      if (n.nodeType === 3) {                       // text
        var t = n.nodeValue.replace(/\s+/g, ' ');
        if (t.trim()) buf.push(t.trim());
        return;
      }
      if (n.nodeType !== 1) return;
      if (n.hidden) return;
      if (n.getAttribute('aria-hidden') === 'true') return;      // decorative
      if (n.classList && n.classList.contains('visually-hidden')) return;
      var cs = global.getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;

      // Where the app supplies speech text, use it and don't descend —
      // that is what keeps masked numbers as "some number".
      if (n.hasAttribute('data-speak')) {
        flush();
        var sp = (n.getAttribute('data-speak') || '').replace(/\s+/g, ' ').trim();
        if (sp) parts.push(sp);
        return;
      }
      var isBlock = cs.display !== 'inline';
      if (isBlock) flush();
      for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
      if (isBlock) flush();
    })(root);
    flush();
    return parts;
  }

  function speakPage() {
    if (!synth) { announce('Read aloud is not available in this browser.'); return; }
    synth.cancel();
    var view = $('view');
    if (!view) return;

    var parts = collectSpeech(view);
    if (!parts.length) return;

    var u = new SpeechSynthesisUtterance(parts.join('. '));
    u.rate = state.rate;
    u.lang = 'en-US';
    synth.speak(u);
    announce('Reading the page aloud.');
  }

  function stopSpeaking() { if (synth) { synth.cancel(); announce('Stopped reading.'); } }

  /* ---------- Wire up ---------- */

  function init() {
    panel = $('a11y-panel');
    opener = $('btn-a11y');
    top = $('ruler-top');
    bottom = $('ruler-bottom');
    if (!panel || !opener) return;

    opener.addEventListener('click', function () {
      panel.hidden ? openPanel() : closePanel();
    });
    $('a11y-close').addEventListener('click', closePanel);

    // Alt+A opens the panel from anywhere — it must be fast to reach,
    // because preferences reset on reload.
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        panel.hidden ? openPanel() : closePanel();
      }
    });

    var gFont = $('grp-font');
    gFont.addEventListener('click', function (e) {
      var b = e.target.closest('[data-font]'); if (!b) return;
      var v = b.getAttribute('data-font');
      if (v === 'standard') root.removeAttribute('data-font'); else root.setAttribute('data-font', v);
      setPressed(gFont, 'data-font', v);
      announce('Typeface set to ' + b.textContent + '.');
    });

    var gScale = $('grp-scale');
    gScale.addEventListener('click', function (e) {
      var b = e.target.closest('[data-scale]'); if (!b) return;
      var v = b.getAttribute('data-scale');
      if (v === '100') root.removeAttribute('data-scale'); else root.setAttribute('data-scale', v);
      setPressed(gScale, 'data-scale', v);
      announce('Text size ' + v + ' percent.');
    });

    var gTint = $('grp-tint');
    gTint.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tint]'); if (!b) return;
      var v = b.getAttribute('data-tint');
      root.style.setProperty('--tint', TINTS[v] || 'transparent');
      setPressed(gTint, 'data-tint', v);
      announce('Page tint ' + v + '.');
    });

    var rulerBtn = $('opt-ruler');
    rulerBtn.addEventListener('click', function () {
      state.ruler = !state.ruler;
      rulerBtn.setAttribute('aria-pressed', String(state.ruler));
      drawRuler();
      announce(state.ruler ? 'Reading ruler on. Use the up and down arrow keys to move it.'
                           : 'Reading ruler off.');
    });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('keydown', onRulerKey);
    window.addEventListener('resize', drawRuler);

    var chunk = $('opt-chunked');
    chunk.addEventListener('click', function () {
      var on = root.getAttribute('data-chunked') === 'on';
      if (on) root.removeAttribute('data-chunked'); else root.setAttribute('data-chunked', 'on');
      chunk.setAttribute('aria-pressed', String(!on));
      announce(!on ? 'Extra line spacing on.' : 'Extra line spacing off.');
    });

    $('opt-speak').addEventListener('click', speakPage);
    $('opt-stop-speak').addEventListener('click', stopSpeaking);
    $('speak-rate').addEventListener('input', function (e) { state.rate = parseFloat(e.target.value); });
    if (!synth) {
      $('speak-note').textContent = 'Read aloud is not available in this browser.';
      $('opt-speak').disabled = true;
    }

    var reveal = $('opt-reveal');
    reveal.addEventListener('click', function () {
      state.revealNumbers = !state.revealNumbers;
      reveal.setAttribute('aria-pressed', String(state.revealNumbers));
      announce(state.revealNumbers ? 'Numbers will always be shown.'
                                   : 'Numbers hidden until your second read.');
      if (global.App && global.App.rerender) global.App.rerender();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.A11y = {
    state: state,
    announce: announce,
    stopSpeaking: stopSpeaking
  };
})(window);
