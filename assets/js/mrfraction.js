/* ============================================================
   Mr Fraction — inline SVG character.
   No image assets, no network requests, recolored by CSS vars.

   Four expressions only (theme spec §1.2). He is NEVER sad or
   disappointed — on a wrong answer he is CURIOUS, because a wrong
   answer is genuinely interesting information about where the
   track diverged.
   ============================================================ */
(function (global) {
  'use strict';

  var EXPRESSIONS = {
    // [left brow dy, right brow dy, head tilt deg, mustache tilt deg]
    steady:   [0,  0,  0,  0],
    thinking: [-3, 1, -3,  0],
    pleased:  [-1,-1,  0, -6],
    curious:  [-4, 2,  7,  2]
  };

  var TITLES = {
    steady:   'Mr Fraction, the conductor, looking attentive.',
    thinking: 'Mr Fraction, thinking, one eyebrow raised.',
    pleased:  'Mr Fraction, pleased, his mustache tilted up at one end.',
    curious:  'Mr Fraction, curious, head tilted to one side.'
  };

  /**
   * Build Mr Fraction as an SVG string.
   * @param {string} mood  steady | thinking | pleased | curious
   * @param {number} size  pixel width
   * @param {boolean} decorative  if true, hidden from assistive tech
   */
  function svg(mood, size, decorative) {
    mood = EXPRESSIONS[mood] ? mood : 'steady';
    size = size || 96;
    var e = EXPRESSIONS[mood];
    var id = 'mf' + Math.random().toString(36).slice(2, 8);

    var a11y = decorative
      ? 'aria-hidden="true" focusable="false"'
      : 'role="img" aria-labelledby="' + id + 't"';
    var title = decorative ? '' : '<title id="' + id + 't">' + TITLES[mood] + '</title>';

    return '' +
'<svg class="mf-svg" viewBox="0 0 120 130" width="' + size + '" ' + a11y + ' xmlns="http://www.w3.org/2000/svg">' +
  title +
  '<g transform="rotate(' + e[2] + ' 60 70)">' +

    /* shoulders / coat */
    '<path d="M18 130 C18 104 34 92 60 92 C86 92 102 104 102 130 Z" fill="var(--brand-rail)"/>' +
    /* lapels */
    '<path d="M60 92 L44 130 L52 130 L60 104 L68 130 L76 130 Z" fill="#0B463E"/>' +
    /* brass buttons */
    '<circle cx="60" cy="112" r="3.2" fill="var(--brand-brass)"/>' +
    '<circle cx="60" cy="124" r="3.2" fill="var(--brand-brass)"/>' +

    /* neck */
    '<rect x="52" y="84" width="16" height="12" rx="5" fill="#E8B98F"/>' +

    /* head */
    '<ellipse cx="60" cy="60" rx="30" ry="29" fill="#F2C79C"/>' +
    /* ears */
    '<circle cx="30" cy="62" r="5.5" fill="#E8B98F"/>' +
    '<circle cx="90" cy="62" r="5.5" fill="#E8B98F"/>' +

    /* cap brim + crown */
    '<path d="M25 42 C25 24 40 15 60 15 C80 15 95 24 95 42 Z" fill="var(--brand-rail)"/>' +
    '<path d="M20 42 C20 38 30 36 60 36 C90 36 100 38 100 42 C100 47 88 49 60 49 C32 49 20 47 20 42 Z" fill="#0B463E"/>' +
    /* cap badge — reads x/y */
    '<rect x="49" y="22" width="22" height="15" rx="3" fill="var(--brand-brass)"/>' +
    '<text x="60" y="33" font-size="10" font-family="Verdana,sans-serif" font-weight="bold" ' +
      'text-anchor="middle" fill="#14343A">x/y</text>' +

    /* eyebrows */
    '<rect x="41" y="' + (55 + e[0]) + '" width="14" height="3.4" rx="1.7" fill="#5A3B22"/>' +
    '<rect x="65" y="' + (55 + e[1]) + '" width="14" height="3.4" rx="1.7" fill="#5A3B22"/>' +

    /* eyes — wide set, slightly crinkled */
    '<circle cx="48" cy="65" r="4.4" fill="#FFFDF7"/>' +
    '<circle cx="72" cy="65" r="4.4" fill="#FFFDF7"/>' +
    '<circle cx="48.8" cy="65.5" r="2.5" fill="#1C2B30"/>' +
    '<circle cx="72.8" cy="65.5" r="2.5" fill="#1C2B30"/>' +
    /* crinkle = warmth without a grin */
    '<path d="M41 71 Q48 74 55 71" stroke="#D3A47C" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M65 71 Q72 74 79 71" stroke="#D3A47C" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +

    /* nose */
    '<path d="M60 66 L60 74" stroke="#D3A47C" stroke-width="2.4" stroke-linecap="round"/>' +

    /* THE MUSTACHE — a fraction bar. This one shape is the whole brand. */
    '<g transform="rotate(' + e[3] + ' 60 79)">' +
      '<rect x="36" y="76" width="48" height="6.5" rx="3.2" fill="#5A3B22"/>' +
    '</g>' +

  '</g>' +
'</svg>';
  }

  /**
   * Mr Fraction says something.
   *
   * THIS NO LONGER RENDERS ANYTHING INTO THE PAGE. It queues the line for the
   * floating companion (companion.js) and returns an empty string, so the 18
   * call sites across app.js and stations.js did not have to change and cannot
   * drift out of step with each other.
   *
   * Why the indirection rather than editing all 18: a call site building an
   * html string has no idea whether it is the only aside on that screen, and
   * the companion does — it collects everything queued during one render pass
   * and shows it together. Making each site talk to the companion directly
   * would have meant 18 places deciding that, wrongly.
   *
   * The inline `.mf-aside` block it used to return cost vertical space on every
   * screen and interrupted the reading order with commentary. He lives in the
   * corner now.
   */
  function aside(mood, html) {
    if (global.Companion) global.Companion.queue(mood, html);
    return '';
  }

  global.MrFraction = { svg: svg, aside: aside, moods: Object.keys(EXPRESSIONS) };
})(window);
