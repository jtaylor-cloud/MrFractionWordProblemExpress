/* ============================================================
   Scenery — ambient life and the railroad map.

   Everything here is DECORATIVE. The map is aria-hidden and sits
   above a real semantic <nav> list that carries the accessible
   names; sighted mouse users may also click a running line on the
   map, which is a redundant affordance, never the only one.
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var DISPLAY = 'Black Han Sans, Arial Black, sans-serif';
  var BODY    = 'Atkinson Hyperlegible, Verdana, sans-serif';

  /* HOW WIDE IS THIS LABEL, ACTUALLY — for anything that needs a plate drawn
     behind text in an SVG that is built as a string.

     MEASURED WITH AN SVG TEXT NODE, NOT WITH A CANVAS, and that is the whole
     point of this function. The first version used `canvas.measureText`, which
     is the obvious tool and is WRONG HERE: with the webfont fully loaded
     (`document.fonts.status === 'loaded'`) and the font shorthand verifiably
     applied, canvas reported 127.2px for a string that SVG then rendered at
     143.3px — 13% narrow, and narrow is the direction that produces a plate
     smaller than the words on it. Canvas returns an advance-width sum; SVG
     text is laid out by a different path that also carries this site's
     inherited `letter-spacing`. Measuring one engine to place something in the
     other is the same mistake as measuring the check instead of the subject.

     So the probe is an off-screen `<svg><text>` — the same engine, the same
     inherited CSS, `getBBox` on the real thing. Off-screen rather than
     `display: none`, because a node in a `display: none` subtree has no boxes
     and `getBBox` returns zeros.

     THE FALLBACK EXISTS BECAUSE A PLATE SIZED 0 IS A PLATE THAT IS NOT THERE,
     which would look exactly like the defect this was written to fix. Callers
     pad the result; none of them should trust it to the pixel. */
  var _probeSvg, _probeText;
  function labelWidth(str, weight, size) {
    str = String(str == null ? '' : str);
    if (_probeSvg === undefined) {
      try {
        _probeSvg = document.createElementNS(NS, 'svg');
        _probeSvg.setAttribute('aria-hidden', 'true');
        _probeSvg.setAttribute('width', '10');
        _probeSvg.setAttribute('height', '10');
        _probeSvg.style.cssText = 'position:absolute;left:-9999px;top:0;overflow:hidden';
        _probeText = document.createElementNS(NS, 'text');
        _probeSvg.appendChild(_probeText);
        document.body.appendChild(_probeSvg);
      } catch (e) { _probeSvg = null; }
    }
    if (_probeSvg && _probeText) {
      _probeText.setAttribute('font-family', BODY);
      _probeText.setAttribute('font-size', size);
      _probeText.setAttribute('font-weight', weight);
      _probeText.textContent = str;
      try {
        var w = _probeText.getBBox().width;
        if (w > 0) return w;
      } catch (e) { /* fall through */ }
    }
    return str.length * size * 0.62;
  }

  /* ---------- Ambient marks ---------- */

  function wheelSVG() {
    var spokes = '';
    for (var i = 0; i < 8; i++) {
      var a = (i * 45) * Math.PI / 180;
      spokes += '<line x1="' + (50 + 13 * Math.cos(a)) + '" y1="' + (50 + 13 * Math.sin(a)) +
                '" x2="' + (50 + 40 * Math.cos(a)) + '" y2="' + (50 + 40 * Math.sin(a)) +
                '" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>';
    }
    return '<svg viewBox="0 0 100 100" xmlns="' + NS + '" aria-hidden="true">' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="7"/>' +
      '<circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
      spokes +
      '<circle cx="50" cy="50" r="12" fill="currentColor"/>' +
      '<circle cx="50" cy="50" r="5" fill="none" stroke="var(--cream)" stroke-width="3"/>' +
      '</svg>';
  }

  function steamSVG() {
    return '<svg viewBox="0 0 100 100" xmlns="' + NS + '" aria-hidden="true">' +
      '<circle cx="34" cy="66" r="20" fill="currentColor"/>' +
      '<circle cx="58" cy="56" r="26" fill="currentColor"/>' +
      '<circle cx="76" cy="70" r="17" fill="currentColor"/>' +
      '<circle cx="50" cy="78" r="18" fill="currentColor"/>' +
      '</svg>';
  }

  function ambient() {
    var host = document.createElement('div');
    host.className = 'ambient';
    host.setAttribute('aria-hidden', 'true');
    var html = '';
    ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'].forEach(function (k) {
      html += '<div class="amb amb-' + k + '">' + wheelSVG() + '</div>';
    });
    ['s1', 's2', 's3'].forEach(function (k) {
      html += '<div class="amb amb-' + k + '">' + steamSVG() + '</div>';
    });
    host.innerHTML = html;
    return host;
  }

  /* ---------- Geometry ---------- */

  /**
   * Smooth curve THROUGH a list of points (Catmull-Rom -> cubic Bezier).
   * Building track this way means every station sits exactly on the rail
   * by construction, so nothing has to be measured back off the path.
   */
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    var t = 1 / 6;
    var d = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      d += ' C ' + (p1[0] + (p2[0] - p0[0]) * t) + ' ' + (p1[1] + (p2[1] - p0[1]) * t) +
           ', '  + (p2[0] - (p3[0] - p1[0]) * t) + ' ' + (p2[1] - (p3[1] - p1[1]) * t) +
           ', '  + p2[0] + ' ' + p2[1];
    }
    return d;
  }

  /** Sample the same spline smoothPath draws, so geometry tests and the
      rendered curve can never disagree. */
  function splinePoints(pts, perSeg) {
    var t = 1 / 6, out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      var c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      for (var j = 0; j < perSeg; j++) {
        var u = j / perSeg, m = 1 - u;
        out.push([
          m*m*m*p1[0] + 3*m*m*u*c1x + 3*m*u*u*c2x + u*u*u*p2[0],
          m*m*m*p1[1] + 3*m*m*u*c1y + 3*m*u*u*c2y + u*u*u*p2[1]
        ]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  /** Closed version, for the lake — same curve used to draw and to hit-test. */
  function closedSpline(pts, perSeg) {
    var t = 1 / 6, out = [], n = pts.length, d = '';
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      var c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      var c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      if (i === 0) d = 'M ' + p1[0] + ' ' + p1[1];
      d += ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + p2[0] + ' ' + p2[1];
      for (var j = 0; j < perSeg; j++) {
        var u = j / perSeg, m = 1 - u;
        out.push([
          m*m*m*p1[0] + 3*m*m*u*c1x + 3*m*u*u*c2x + u*u*u*p2[0],
          m*m*m*p1[1] + 3*m*m*u*c1y + 3*m*u*u*c2y + u*u*u*p2[1]
        ]);
      }
    }
    return { d: d + ' Z', pts: out };
  }

  /* --- where the land is --- */

  function parsePolygon(d) {
    var nums = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number), out = [];
    for (var i = 0; i + 1 < nums.length; i += 2) out.push([nums[i], nums[i + 1]]);
    return out;
  }

  function pointInPoly(pt, poly) {
    var x = pt[0], y = pt[1], inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  /**
   * A bridge belongs wherever track crosses water — ocean, river or lake.
   * Treating those as one rule rather than three is why the river crossing
   * gets a bridge too instead of the track ploughing straight through it.
   */
  function makeWaterTest(landPolys, riverPts, lakePts) {
    return function (p) {
      var i;
      if (lakePts.length && pointInPoly(p, lakePts)) return true;
      for (i = 0; i < riverPts.length; i++) {
        var dx = p[0] - riverPts[i][0], dy = p[1] - riverPts[i][1];
        if (dx * dx + dy * dy < 121) return true;      // within 11px of a river
      }
      for (i = 0; i < landPolys.length; i++) if (pointInPoly(p, landPolys[i])) return false;
      return true;                                      // not on any land = ocean
    };
  }

  /**
   * Contiguous runs of a route that sit over water.
   * `pad` extends each span a little onto dry ground either side, so the
   * abutments land on the bank the way a real bridge does.
   */
  function waterSpans(routePts, isWater, pad) {
    var samples = splinePoints(routePts, 26), runs = [], cur = null;
    for (var i = 0; i < samples.length; i++) {
      if (isWater(samples[i])) {
        if (!cur) { cur = { a: i, b: i }; runs.push(cur); }
        cur.b = i;
      } else { cur = null; }
    }
    pad = pad || 0;
    return runs.map(function (r) {
      // A very short crossing padded by the same amount ends up as two
      // abutments almost touching, which reads as a stray mark rather than a
      // bridge. Give narrow spans a little more deck so they still scan.
      var p = (r.b - r.a) < 3 ? pad + 2 : pad;
      return samples.slice(Math.max(0, r.a - p), Math.min(samples.length, r.b + p + 1));
    }).filter(function (s) { return s.length >= 2; });
  }

  /** Unit normal at point i of a polyline. */
  function normalAt(span, i) {
    var a = span[Math.max(0, i - 1)], b = span[Math.min(span.length - 1, i + 1)];
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
    return [-dy / L, dx / L];
  }

  function offsetPoly(span, dist) {
    return span.map(function (p, i) {
      var n = normalAt(span, i);
      return [p[0] + n[0] * dist, p[1] + n[1] * dist];
    });
  }

  function polyD(pts) {
    return 'M ' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L ');
  }

  /**
   * Trestle bridge, drawn under the track.
   * A single thick band reads as a road, not a bridge — what makes it legible
   * is the pair of guard rails running either side of the deck plus a squared
   * abutment at each bank. Kept deliberately narrow so the rail stays the
   * dominant line.
   */
  function bridge(span) {
    var d = polyD(span);
    var s = '<path d="' + d + '" fill="none" stroke="#E8DCC4" stroke-width="11" stroke-linecap="butt"/>';

    // cross ties
    for (var i = 1; i < span.length - 1; i += 2) {
      var n = normalAt(span, i), p = span[i], t = 5.4;
      s += '<line x1="' + (p[0] - n[0] * t).toFixed(1) + '" y1="' + (p[1] - n[1] * t).toFixed(1) +
           '" x2="' + (p[0] + n[0] * t).toFixed(1) + '" y2="' + (p[1] + n[1] * t).toFixed(1) +
           '" stroke="#B9A98C" stroke-width="1.5"/>';
    }

    // guard rails either side — the detail that actually says "bridge"
    s += '<path d="' + polyD(offsetPoly(span, 5.8)) + '" fill="none" stroke="#5A3E28" stroke-width="2.1"/>';
    s += '<path d="' + polyD(offsetPoly(span, -5.8)) + '" fill="none" stroke="#5A3E28" stroke-width="2.1"/>';

    // abutments at both banks
    [0, span.length - 1].forEach(function (i) {
      var n = normalAt(span, i), p = span[i], a = 8;
      s += '<line x1="' + (p[0] - n[0] * a).toFixed(1) + '" y1="' + (p[1] - n[1] * a).toFixed(1) +
           '" x2="' + (p[0] + n[0] * a).toFixed(1) + '" y2="' + (p[1] + n[1] * a).toFixed(1) +
           '" stroke="#5A3E28" stroke-width="3.4" stroke-linecap="round"/>';
    });
    return s;
  }

  /**
   * Railway track along any path.
   * Sleepers are a WIDE dashed stroke underneath; the rail is a solid
   * stroke on top, with a hairline down the middle for the twin-rail read.
   * Under construction = sleepers only, which reads as "coming", not "broken".
   */
  function trackPath(d, colour, built) {
    var s = '<path d="' + d + '" fill="none" stroke="' + (built ? '#8F7F63' : '#BCAA8C') +
            '" stroke-width="13" stroke-dasharray="3 10"/>';
    if (built) {
      s += '<path d="' + d + '" fill="none" stroke="' + colour + '" stroke-width="5.5" stroke-linecap="round"/>';
      s += '<path d="' + d + '" fill="none" stroke="#FDF8F0" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>';
    }
    return s;
  }

  function stop(x, y, colour) {
    return '<circle cx="' + x + '" cy="' + y + '" r="8.5" fill="#FDF8F0" stroke="#2C2214" stroke-width="2"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="' + colour + '"/>';
  }

  function terminus(x, y, colour) {
    return '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#FDF8F0" stroke="#2C2214" stroke-width="2.5"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="8.5" fill="' + colour + '"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="3.4" fill="#FDF8F0"/>';
  }

  function interchange(x, y) {
    return '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#FDF8F0" stroke="#A85413" stroke-width="3.5"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="9" fill="none" stroke="#A85413" stroke-width="2"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="3.6" fill="#A85413"/>';
  }

  /** Where two or more lines meet. Neutral ink, so it reads the same
      whether the lines it joins are running or still being built. */
  function junction(x, y) {
    return '<circle cx="' + x + '" cy="' + y + '" r="12.5" fill="#FDF8F0" stroke="#2C2214" stroke-width="3"/>' +
           '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="none" stroke="#2C2214" stroke-width="2"/>';
  }

  /* ---------- Water and terrain ---------- */

  /* Flow is a dashed highlight riding the river's own path with an animated
     dash-offset. Rivers are authored source-first, so the current runs
     downstream without any extra bookkeeping. */
  function river(d) {
    return '<path d="' + d + '" fill="none" stroke="#8FBBD1" stroke-width="6.5" stroke-linecap="round"/>' +
           '<path d="' + d + '" fill="none" stroke="#CFE7F2" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>' +
           '<path class="mf-flow" d="' + d + '" fill="none" stroke="#F0FAFE" stroke-width="2.2" ' +
           'stroke-linecap="round" stroke-dasharray="13 21"/>';
  }

  function near(p, pts, d) {
    var dd = d * d;
    for (var i = 0; i < pts.length; i++) {
      var dx = p[0] - pts[i][0], dy = p[1] - pts[i][1];
      if (dx * dx + dy * dy < dd) return true;
    }
    return false;
  }

  function inBoxes(p, boxes, pad) {
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      if (p[0] > b[0] - pad && p[0] < b[2] + pad && p[1] > b[1] - pad && p[1] < b[3] + pad) return true;
    }
    return false;
  }

  /** A conifer. Muted on purpose — terrain must not compete with the lines. */
  function tree(x, y, sc) {
    return '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + sc.toFixed(2) + ')">' +
      '<rect x="-1.3" y="3" width="2.6" height="5.5" fill="#7A6A50"/>' +
      '<path d="M 0 -10.5 L 6 1.5 L -6 1.5 Z" fill="#8FAE76"/>' +
      '<path d="M 0 -5.5 L 7.4 5 L -7.4 5 Z" fill="#7C9C66"/>' +
      '</g>';
  }

  /**
   * Forests are placed procedurally and rejected against everything already
   * on the plate — coast, rivers, lake, track, mountains, stations, labels
   * and furniture. Placing them by hand would mean guessing at collisions on
   * a map I cannot see; this way "no tree sits on anything" holds by
   * construction rather than by inspection.
   */
  function forests(opts) {
    var placed = [], out = '';
    opts.clusters.forEach(function (c) {
      var got = 0;
      for (var a = 0; a < 34 && got < c[2]; a++) {
        // deterministic scatter — same layout on every load
        var ang = a * 2.399963, rad = 4 + (a % 7) * 5.5;
        var p = [c[0] + Math.cos(ang) * rad * 1.5, c[1] + Math.sin(ang) * rad];
        // Test the whole canopy footprint, not just the trunk. Checking the
        // anchor alone lets a tree stand on the beach with its branches
        // hanging out over the sea.
        var footprint = [[0, 0], [0, -13], [-10, 5], [10, 5], [0, 7], [-8, -6], [8, -6]];
        var clear = true, i, j;
        for (j = 0; j < footprint.length && clear; j++) {
          var q = [p[0] + footprint[j][0], p[1] + footprint[j][1]], hit = false;
          for (i = 0; i < opts.land.length; i++) if (pointInPoly(q, opts.land[i])) { hit = true; break; }
          if (!hit) clear = false;
        }
        if (!clear) continue;
        if (pointInPoly(p, opts.lake)) continue;
        if (near(p, opts.rivers, 19)) continue;
        if (near(p, opts.track, 25)) continue;
        if (near(p, opts.nodes, 34)) continue;
        if (near(p, placed, 15)) continue;
        if (inBoxes(p, opts.boxes, 14)) continue;
        placed.push(p);
        got++;
      }
    });
    placed.sort(function (a, b) { return a[1] - b[1]; });   // paint back-to-front
    placed.forEach(function (p, i) { out += tree(p[0], p[1], 0.82 + ((i * 7) % 5) * 0.09); });
    return { svg: out, count: placed.length };
  }

  /** A run of peaks along a baseline. */
  function range(x, y, n, w, h) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var px = x + i * w, py = y - (i % 2) * (h * 0.22);
      s += '<path d="M ' + px + ' ' + py + ' l ' + (w * 0.62) + ' ' + (-h) + ' l ' + (w * 0.62) + ' ' + h + ' Z" ' +
           'fill="#EFE4D0" stroke="#8F7F63" stroke-width="1.8" stroke-linejoin="round"/>';
      s += '<path d="M ' + (px + w * 0.62) + ' ' + (py - h) + ' l ' + (w * 0.22) + ' ' + (h * 0.34) +
           ' l ' + (-w * 0.44) + ' 0 Z" fill="#FDF8F0" opacity=".9"/>';
    }
    return s;
  }

  function waves(spots) {
    return spots.map(function (p, i) {
      return '<path class="mf-wave" style="animation-delay:' + (i * 0.37).toFixed(2) + 's" ' +
             'd="M ' + p[0] + ' ' + p[1] + ' q 7 -5, 14 0 t 14 0" fill="none" ' +
             'stroke="#A9CFE2" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>';
    }).join('');
  }

  /** Locomotive, drawn large enough to read as an illustration. */
  function locomotive(x, y, s, colour) {
    var w = '<g fill="#241B10">' +
      '<circle cx="26" cy="70" r="11"/><circle cx="60" cy="70" r="14"/><circle cx="96" cy="70" r="14"/>' +
      '</g>' +
      '<g fill="#F5EDE0">' +
      '<circle cx="26" cy="70" r="4"/><circle cx="60" cy="70" r="5"/><circle cx="96" cy="70" r="5"/>' +
      '</g>';
    /* Smoke. The locomotive faces left, so the plume trails right and up —
       drifting it forward would read as the train going backwards.
       Two plumes are drawn: an animated one, and a static one that only
       appears under prefers-reduced-motion. Freezing the animated puffs
       would land them all at opacity 0 and the chimney would go out. */
    // Each puff is a cluster of overlapping circles, not one disc — that is
    // what makes it billow and read as smoke rather than as bubbles.
    var puffs = '';
    for (var i = 0; i < 7; i++) {
      puffs += '<g class="mf-smoke" fill="#9E8E76" style="animation-delay:' + (i * 0.5).toFixed(2) + 's">' +
        '<circle cx="36"   cy="1"    r="7"/>' +
        '<circle cx="42.5" cy="-1.5" r="5.6"/>' +
        '<circle cx="29.5" cy="-0.5" r="5.4"/>' +
        '<circle cx="36.5" cy="-6.5" r="5.6"/>' +
        '<circle cx="32"   cy="4"    r="4.6"/>' +
        '<circle cx="40"   cy="4.5"  r="4.4"/>' +
        '</g>';
    }
    var stillPuffs =
      '<g class="mf-smoke-still" fill="#9E8E76" opacity=".34">' +
      '<circle cx="42" cy="-4" r="8"/><circle cx="49" cy="-9" r="6.5"/>' +
      '<circle cx="57" cy="-16" r="10"/><circle cx="66" cy="-23" r="8"/>' +
      '<circle cx="74" cy="-30" r="8.5"/><circle cx="85" cy="-38" r="6"/>' +
      '</g>';

    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      puffs + stillPuffs +
      // frame
      '<rect x="4" y="56" width="112" height="9" rx="4" fill="#241B10"/>' +
      // boiler
      '<rect x="26" y="28" width="66" height="30" rx="14" fill="' + colour + '"/>' +
      // cab
      '<rect x="86" y="14" width="34" height="44" rx="5" fill="' + colour + '"/>' +
      '<rect x="94" y="22" width="18" height="15" rx="3" fill="#FDF8F0" opacity=".82"/>' +
      // stack + dome
      '<rect x="30" y="12" width="13" height="18" rx="3" fill="' + colour + '"/>' +
      '<rect x="26" y="8"  width="21" height="7" rx="3" fill="' + colour + '"/>' +
      '<circle cx="62" cy="30" r="8" fill="' + colour + '"/>' +
      // lamp + cowcatcher
      '<circle cx="22" cy="42" r="6.5" fill="#F0B429" stroke="#241B10" stroke-width="2"/>' +
      '<path d="M 16 46 L 4 62 L 16 62 Z" fill="#241B10"/>' +
      w +
      '</g>';
  }

  function compassRose(cx, cy, r) {
    var pts = function (a) {
      var rad = a * Math.PI / 180;
      return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
    };
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 13) + '" fill="#FDF8F0" stroke="#8F7F63" stroke-width="2"/>';
    [0, 90, 180, 270].forEach(function (a) {
      var p = pts(a), l = pts(a - 34), rr = pts(a + 34);
      s += '<path d="M ' + p[0] + ' ' + p[1] + ' L ' + (cx + (l[0] - cx) * .3) + ' ' + (cy + (l[1] - cy) * .3) +
           ' L ' + cx + ' ' + cy + ' Z" fill="#2C2214"/>';
      s += '<path d="M ' + p[0] + ' ' + p[1] + ' L ' + (cx + (rr[0] - cx) * .3) + ' ' + (cy + (rr[1] - cy) * .3) +
           ' L ' + cx + ' ' + cy + ' Z" fill="#A85413"/>';
    });
    s += '<text x="' + cx + '" y="' + (cy - r - 1) + '" text-anchor="middle" font-family="' + BODY +
         '" font-size="12" font-weight="700" fill="#2C2214">N</text>';
    return s;
  }

  /* ---------- Map data: a place, not a diagram ---------- */

  /* Territories are built from SHARED border edges, not from independent
     outlines. Curving each territory on its own would open gaps and overlaps
     along every internal border; here each edge is bowed once, tessellated
     into a dense polyline, and both neighbours consume the identical points —
     so the coastline is organic and the tiling is still exact.

     Kept as M/L polylines rather than beziers on purpose: the same `d` feeds
     the point-in-polygon tests used for forests, bridges and water. */
  var NODE = {
    A: [62, 252],  B: [154, 176], C: [248, 202], D: [272, 322], E: [302, 120],
    F: [442, 146], G: [472, 266], H: [352, 302], I: [236, 432], J: [130, 456],
    K: [64, 362],  L: [522, 382], M: [472, 472], N: [332, 482], O: [562, 166],
    P: [722, 130], Q: [872, 202], R: [902, 342], S: [802, 422], T: [642, 432],
    U: [702, 542], V: [602, 622], W: [402, 642], X: [266, 562]
  };

  // [from, to, bow]. Positive and negative alternate so the land reads as
  // rounded rather than uniformly inflated. Coastal edges bow harder.
  var EDGE_DEF = {
    AB: ['A', 'B', -13], BC: ['B', 'C', -9],  CD: ['C', 'D', 8],   DI: ['D', 'I', -7],
    IJ: ['I', 'J', -12], JK: ['J', 'K', -14], KA: ['K', 'A', -12],
    BE: ['B', 'E', -11], EF: ['E', 'F', -13], FG: ['F', 'G', -10], GH: ['G', 'H', 7],
    HD: ['H', 'D', -6],  GL: ['G', 'L', 9],   LM: ['L', 'M', 8],   MN: ['M', 'N', -7],
    NI: ['N', 'I', 8],   GO: ['G', 'O', 9],   OP: ['O', 'P', -12], PQ: ['P', 'Q', -13],
    QR: ['Q', 'R', -12], RS: ['R', 'S', -11], ST: ['S', 'T', -10], TL: ['T', 'L', 7],
    TU: ['T', 'U', -11], UV: ['U', 'V', -12], VW: ['V', 'W', -13], WX: ['W', 'X', -11],
    XI: ['X', 'I', -12]
  };

  var edgeCache = {};
  function edgePoints(name) {
    if (edgeCache[name]) return edgeCache[name];
    var e = EDGE_DEF[name], a = NODE[e[0]], b = NODE[e[1]], amt = e[2];
    var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
    var mid = [(a[0] + b[0]) / 2 - dy / len * amt, (a[1] + b[1]) / 2 + dx / len * amt];
    edgeCache[name] = splinePoints([a, mid, b], 9);
    return edgeCache[name];
  }

  function ringPath(seq) {
    var out = [];
    seq.forEach(function (name) {
      var rev = name.charAt(0) === '-';
      var pts = edgePoints(rev ? name.slice(1) : name).slice();
      if (rev) pts.reverse();
      if (out.length) pts.shift();          // shared node already present
      out = out.concat(pts);
    });
    return 'M ' + out.map(function (p) {
      return p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' L ') + ' Z';
  }

  var TERRITORY = {
    change:    { seq: ['AB', 'BC', 'CD', 'DI', 'IJ', 'JK', 'KA'],
                 label: ['Change', 152, 300] },
    compare:   { seq: ['BE', 'EF', 'FG', 'GH', 'HD', '-CD', '-BC'],
                 label: ['Compare', 328, 216] },
    /* Label moved off the track. It sat at (374,430), 10 units from its own
       rail — close enough that the type crossed the sleepers. Position chosen
       by search rather than by eye: every point inside the territory scored on
       its clearance from all rails (built and under construction), the stops,
       the junctions, the Learning Hub and the map furniture, with the whole
       text box required to stay inside the territory. Clearance 67, up from 10.

       The box was MEASURED, not estimated. A first pass guessed the label at
       96 units wide; it renders 116, and both relocated labels ended up with a
       corner over their own coastline. Ask the DOM for getBBox. */
    partwhole: { seq: ['-HD', '-GH', 'GL', 'LM', 'MN', 'NI', '-DI'],
                 label: ['Part–Whole', 350, 339] },
    groups:    { seq: ['GO', 'OP', 'PQ', 'QR', 'RS', 'ST', 'TL', '-GL'],
                 label: ['Equal Groups', 692, 250] },
    /* Same treatment, and this one was worse: (470,572) sat ONE unit from the
       rail — the words were printed straight through the track. Clearance now
       79, with the full 130-unit-wide box inside the territory. */
    ratio:     { seq: ['-NI', '-MN', '-LM', '-TL', 'TU', 'UV', 'VW', 'WX', 'XI'],
                 label: ['Ratio & Rate', 557, 443] }
  };
  Object.keys(TERRITORY).forEach(function (k) { TERRITORY[k].d = ringPath(TERRITORY[k].seq); });

  /* One network, not five diagrams.
     Four junctions are shared endpoints — adjacent lines literally start and
     end on the same coordinate, so the track meets rather than merely
     approaching. J2 is also the Part–Whole terminus, which is why the big
     station sits where three lines converge. */
  var J1 = [243, 230];   // Change  <-> Compare
  var J2 = [492, 248];   // Compare <-> Equal Groups <-> Part-Whole terminus
  var J3 = [650, 430];   // Equal Groups <-> Ratio
  var J4 = [272, 452];   // Ratio <-> Change <-> Part-Whole

  // Station positions. Deliberately uneven — real lines don't tick evenly.
  var STOPS = {
    change:    [J4, [198, 424], [128, 356], [106, 284], [170, 258], J1],
    compare:   [J1, [298, 176], [368, 192], [436, 166], J2],
    groups:    [J2, [560, 192], [642, 168], [724, 198], [800, 264], [786, 354], J3],
    ratio:     [J3, [602, 514], [502, 558], [400, 588], [318, 528], J4],
    // The 4th stop was at [404,352] — sitting in the river, which put a station
    // on top of its own bridge. Moved ~33px east so the crossing is clean track.
    partwhole: [J4, [312, 398], [364, 424], [436, 344], [452, 396], [480, 320], J2]
  };

  var JUNCTIONS = [J1, J3, J4];   // J2 is drawn as the terminus instead

  /* Rivers run from high ground out past the coast; a clip-path to the
     landmass then trims each one exactly at the shoreline, so no river
     ever continues across open sea. Deliberately over-drawn at the mouth
     and cut by geometry rather than by a guessed end coordinate. */
  /* Every river now springs from high ground and ends in water — ocean, or
     the lake which itself drains to the ocean. Previously one began out at
     sea and another welled up in open country ten pixels off the coast. */
  var RIVERS = [
    [[378, 254], [394, 316], [386, 388], [404, 456], [422, 552], [410, 670]],  // north range -> south sea
    [[192, 356], [160, 386], [120, 410], [70, 432], [20, 450]],                // west range  -> west sea
    // Runs INSIDE the lake, not up to its edge — the lake fill is painted
    // over it afterwards, which is what makes the join seamless.
    [[742, 337], [790, 360], [828, 394], [890, 444]],                          // lake outflow -> east sea
    [[668, 302], [684, 314], [698, 324], [712, 332]]                           // central range -> lake
  ];

  var LAKE = [[678, 330], [692, 312], [716, 306], [742, 313], [757, 331],
              [747, 353], [718, 363], [692, 355]];

  var ORDER = ['change', 'compare', 'partwhole', 'groups', 'ratio'];

  /* The world's own bounds. Module-level because the leg view has to know
     where the map stops in order to frame against it, and a second copy of
     these numbers would be free to drift from the first. */
  var MAP_W = 1040, MAP_H = 664;

  /* The world itself — land, water, terrain, track, stations. Extracted so the
     zoomed leg view can reuse EXACTLY this geometry and only change the
     viewBox. Terrain, bridges and the water rules then come along unchanged
     rather than being re-derived for a second renderer and drifting. */
  function mapBody(counts) {
    var W = MAP_W, MAPH = MAP_H;
    var s = '';

    /* --- the landmass, as a clipping region for anything that must stop at the coast --- */
    s += '<defs><clipPath id="mf-land">' +
         ORDER.map(function (k) { return '<path d="' + TERRITORY[k].d + '"/>'; }).join('') +
         '</clipPath></defs>';

    /* --- ocean --- */
    s += '<rect x="0" y="0" width="' + W + '" height="' + MAPH + '" rx="10" fill="#DCEEF6"/>';
    s += waves([[36, 128], [30, 300], [58, 470], [128, 596], [300, 84],
                [560, 62], [828, 76], [956, 300], [900, 552], [744, 616], [420, 660]]);

    /* --- land: an opaque cream landmass under the tinted territories, so the
           ocean does not show through and the coast reads as a real edge --- */
    ORDER.forEach(function (k) {
      s += '<path d="' + TERRITORY[k].d + '" fill="#F5EDE0" stroke="#A9CFE2" stroke-width="7" stroke-linejoin="round"/>';
    });
    ORDER.forEach(function (k) {
      s += '<path d="' + TERRITORY[k].d + '" fill="#F5EDE0" stroke="none"/>';
    });
    ORDER.forEach(function (k) {
      var built = (counts[k] || 0) >= 3;
      s += '<path d="' + TERRITORY[k].d + '" fill="var(--line-' + k + ')" ' +
           'fill-opacity="' + (built ? '.22' : '.10') + '" stroke="#2C2214" stroke-width="2.5" ' +
           'stroke-linejoin="round"' + (built ? ' data-line="' + k + '" class="map-hit"' : '') + '/>';
    });

    /* --- inland water ---
       Order matters. Rivers run INTO the lake, then the lake fill is painted
       over them so no river stripe shows across open water, then the lake
       outline is drawn with a mask that erases it at each river mouth —
       otherwise the darker border cuts straight across the water where the
       river arrives, and the two stop reading as one connected system. */
    var lake = closedSpline(LAKE, 8);

    // River ends that touch the lake, found by measurement rather than by hand.
    var mouths = [];
    RIVERS.forEach(function (r) {
      [r[0], r[r.length - 1]].forEach(function (p) {
        if (near(p, lake.pts, 22) || pointInPoly(p, lake.pts)) mouths.push(p);
      });
    });

    s += '<g clip-path="url(#mf-land)">' +
         RIVERS.map(function (r) { return river(smoothPath(r)); }).join('') +
         '</g>';

    s += '<path d="' + lake.d + '" fill="#BFE0EF"/>';
    s += '<defs><mask id="mf-lake-edge">' +
         '<rect x="0" y="0" width="' + W + '" height="' + MAPH + '" fill="#fff"/>' +
         mouths.map(function (p) {
           return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#000"/>';
         }).join('') +
         '</mask></defs>';
    s += '<path d="' + lake.d + '" fill="none" stroke="#8FBBD1" stroke-width="2.5" mask="url(#mf-lake-edge)"/>';
    // a little movement on the open water, so the lake is not a flat disc
    s += '<path class="mf-flow mf-flow-slow" d="M 690 340 C 706 332, 730 336, 748 330" fill="none" ' +
         'stroke="#E4F4FB" stroke-width="2" stroke-linecap="round" stroke-dasharray="10 16"/>';
    s += '<text x="717" y="352" text-anchor="middle" font-family="' + BODY +
         '" font-size="9.5" font-style="italic" fill="#4E7C92">Lake Remainder</text>';

    /* --- mountains --- */
    var RANGES = [[196, 350, 3, 26, 30], [556, 302, 4, 25, 28],
                  [408, 502, 2, 24, 26], [828, 296, 2, 22, 24],
                  [358, 246, 2, 22, 24]];   // headwaters for the central river
    RANGES.forEach(function (r) { s += range(r[0], r[1], r[2], r[3], r[4]); });
    // Bounds, so forest placement can reject peaks properly.
    var rangeBoxes = RANGES.map(function (r) {
      return [r[0] - 2, r[1] - r[4] * 1.22 - 2, r[0] + (r[2] - 1) * r[3] + r[3] * 1.24 + 2, r[1] + 2];
    });

    /* --- shared geometry for forests and bridges --- */
    var landPolys = ORDER.map(function (k) { return parsePolygon(TERRITORY[k].d); });
    var riverSamples = [];
    RIVERS.forEach(function (r) {
      splinePoints(r, 20).forEach(function (p) { riverSamples.push(p); });
    });
    var trackSamples = [];
    ORDER.forEach(function (k) {
      splinePoints(STOPS[k], 18).forEach(function (p) { trackSamples.push(p); });
    });

    /* --- forests --- */
    var nodePts = [];
    ORDER.forEach(function (k) { STOPS[k].forEach(function (p) { nodePts.push(p); }); });
    nodePts.push([352, 496]);                                    // Learning Hub
    ORDER.forEach(function (k) { nodePts.push([TERRITORY[k].label[1], TERRITORY[k].label[2]]); });
    nodePts.push([717, 346]);                                    // lake label
    var avoidBoxes = [
      [770, 470, 940, 620],   // locomotive
      [890, 70, 1010, 190],   // compass rose
      [30, 30, 430, 95]       // map title block
    ].concat(rangeBoxes);     // and every mountain range
    var wood = forests({
      land: landPolys, lake: lake.pts, rivers: riverSamples, track: trackSamples,
      nodes: nodePts, boxes: avoidBoxes,
      clusters: [
        [148, 296, 7], [206, 392, 6], [318, 262, 6], [300, 340, 5],
        [560, 402, 7], [690, 476, 7], [846, 236, 5], [498, 452, 5],
        [372, 556, 6], [636, 336, 5], [120, 232, 5], [452, 604, 5]
      ]
    });
    s += wood.svg;
    railMap.treeCount = wood.count;

    /* --- bridges, drawn UNDER the track wherever a route crosses water --- */
    var isWater = makeWaterTest(landPolys, riverSamples, lake.pts);
    ORDER.forEach(function (k) {
      waterSpans(STOPS[k], isWater, 2).forEach(function (span) { s += bridge(span); });
    });

    /* --- lines --- */
    ORDER.forEach(function (k) {
      var built = (counts[k] || 0) >= 3;
      var colour = 'var(--line-' + k + ')';
      var pts = STOPS[k];
      var g = trackPath(smoothPath(pts), colour, built);
      if (built) {
        // Skip index 0 — that end is a shared junction, drawn once below.
        for (var i = 1; i < pts.length - 1; i++) g += stop(pts[i][0], pts[i][1], colour);
        s += '<g data-line="' + k + '" class="map-hit">' + g + '</g>';
      } else {
        s += '<g opacity=".85">' + g + '</g>';
      }
    });

    /* --- junctions, drawn on top of every track so the network reads as joined --- */
    JUNCTIONS.forEach(function (p) { s += junction(p[0], p[1]); });

    // J2 doubles as the Part–Whole terminus and the meeting point of three lines.
    s += terminus(J2[0], J2[1], 'var(--line-partwhole)');
    s += '<text x="' + J2[0] + '" y="' + (J2[1] - 24) + '" text-anchor="middle" font-family="' + BODY +
         '" font-size="10" font-weight="700" letter-spacing="1.5" fill="#5A3E28">TERMINUS HUB</text>';

    /* --- the Learning Hub: a real junction off the Part–Whole line --- */
    var hx = 364, hy = 424, jx = 352, jy = 496;
    s += '<path d="M ' + hx + ' ' + hy + ' C ' + (hx + 8) + ' ' + (hy + 30) + ', ' + (jx + 8) + ' ' + (jy - 30) + ', ' + jx + ' ' + jy + '" ' +
         'fill="none" stroke="#A85413" stroke-width="3.5" stroke-dasharray="8 6"/>';
    s += interchange(jx, jy);
    s += '<text x="' + (jx + 24) + '" y="' + (jy + 5) + '" font-family="' + BODY +
         '" font-size="12" font-weight="700" letter-spacing=".8" fill="#5A3E28">Learning Hubs</text>';

    /* --- territory labels, last so they sit on top --- */
    ORDER.forEach(function (k) {
      var L = TERRITORY[k].label;
      var built = (counts[k] || 0) >= 3;
      s += '<text x="' + L[1] + '" y="' + L[2] + '" text-anchor="middle" font-family="' + DISPLAY +
           '" font-size="17" letter-spacing="1" fill="#2C2214" opacity="' + (built ? '.72' : '.4') + '">' +
           L[0] + '</text>';
    });

    return s;
  }

  function railMap(counts) {
    var W = 1040, H = 800, MAPH = 664;
    var s = mapBody(counts);

    /* --- furniture --- */
    s += locomotive(792, 512, 1.15, '#3A3A44');
    s += compassRose(946, 128, 34);
    s += '<text x="52" y="60" font-family="' + DISPLAY + '" font-size="21" letter-spacing="1.5" fill="#2C2214" opacity=".8">' +
         'The Word Problem Territories</text>';
    s += '<text x="52" y="82" font-family="' + BODY + '" font-size="11.5" font-weight="700" letter-spacing="2.6" fill="#A85413">' +
         'MR FRACTION&rsquo;S EXPRESS &middot; ALL LINES</text>';

    /* --- key --- */
    var ky = MAPH + 14;
    s += '<rect x="26" y="' + ky + '" width="' + (W - 52) + '" height="106" rx="10" ' +
         'fill="#FDF8F0" stroke="#8F7F63" stroke-width="2"/>';
    s += '<text x="46" y="' + (ky + 25) + '" font-family="' + BODY +
         '" font-size="11" font-weight="700" letter-spacing="2.2" fill="#A85413">KEY</text>';

    ORDER.forEach(function (k, i) {
      var built = (counts[k] || 0) >= 3;
      var colour = 'var(--line-' + k + ')';
      var x = 46 + i * 196, y = ky + 52;
      s += trackPath('M ' + x + ' ' + y + ' L ' + (x + 34) + ' ' + y, colour, built);
      s += '<text x="' + (x + 44) + '" y="' + (y + 4) + '" font-family="' + BODY +
           '" font-size="11.5" font-weight="700" fill="#2C2214">' + MF.LINES[k].name.replace(/^The /, '') + '</text>';
      s += '<text x="' + (x + 44) + '" y="' + (y + 19) + '" font-family="' + BODY +
           '" font-size="10" fill="#6B5138">' + (built ? (counts[k] + ' problems · running') : 'under construction') + '</text>';
    });

    var sy = ky + 88;
    s += stop(48, sy, '#6B5138');
    s += '<text x="62" y="' + (sy + 4) + '" font-family="' + BODY + '" font-size="10.5" fill="#5A3E28">Strategy stop</text>';
    s += junction(176, sy);
    s += '<text x="194" y="' + (sy + 4) + '" font-family="' + BODY + '" font-size="10.5" fill="#5A3E28">Junction — lines meet here</text>';
    s += terminus(392, sy, 'var(--line-partwhole)');
    s += '<text x="410" y="' + (sy + 4) + '" font-family="' + BODY + '" font-size="10.5" fill="#5A3E28">Terminus Hub — you choose the strategy</text>';
    s += interchange(700, sy);
    s += '<text x="720" y="' + (sy + 4) + '" font-family="' + BODY + '" font-size="10.5" fill="#5A3E28">Learning Hub — open to anyone, any time</text>';

    /* The running/building sentence is DERIVED, never written down. It used to
       be the hardcoded string "Only the Part–Whole Loop is running; the other
       four are still under construction", which silently became a lie to
       screen-reader users the moment a second line opened. Same `>= 3` rule as
       the visible key above, so the two can never disagree. */
    var NWORD = ['no', 'one', 'two', 'three', 'four', 'five'];
    var running = ORDER.filter(function (k) { return (counts[k] || 0) >= 3; })
                       .map(function (k) { return MF.LINES[k].name.replace(/^The /, ''); });
    var idle = ORDER.length - running.length;
    var built;
    if (!running.length) {
      built = 'No line is open yet; all five are still under construction.';
    } else if (!idle) {
      built = 'All five lines are running.';
    } else {
      var list = running.length < 2 ? running[0]
               : running.slice(0, -1).join(', ') + ' and ' + running[running.length - 1];
      built = 'The ' + list + (running.length > 1 ? ' are' : ' is') + ' running; the other ' +
              NWORD[idle] + (idle > 1 ? ' are' : ' is') + ' still under construction.';
    }
    built = built.replace(/&/g, '&amp;');

    var fig = document.createElement('figure');
    fig.className = 'map-figure';
    fig.style.margin = '0';
    fig.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="' + NS + '" role="img" aria-label="' +
      'Illustrated route map of the Word Problem Territories: five coastal territories, one for each kind of word ' +
      'problem, with mountains, rivers and a lake. Five winding rail lines join at four junctions to form a single ' +
      'connected network, so any line can be reached from any other. ' + built + ' A Terminus Hub sits where three ' +
      'lines meet, and a Learning Hub junction branches off it. The same choices are listed as buttons below.">' +
      s + '</svg>';
    return fig;
  }

  /* ---------- The leg view: a zoom-in on the stretch you're travelling ----------
     Not a second map. It is the SAME world with a tighter viewBox, so the
     coastline, rivers, bridges and forests around this particular stretch of
     line are the ones already drawn — verified, not assumed. */

  /* Cumulative arc length along a sampled polyline, so vehicles can be placed
     by DISTANCE rather than by index — the spline's points are not evenly
     spaced, so index-based placement bunches on tight curves. */
  function arcTable(pts) {
    var cum = [0];
    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    return cum;
  }

  /** Point and heading at a given distance along the path. */
  function atDist(pts, cum, d) {
    var total = cum[cum.length - 1];
    d = Math.max(0, Math.min(total, d));
    var i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    var span = (cum[i] - cum[i - 1]) || 1;
    var t = (d - cum[i - 1]) / span;
    var a = pts[i - 1], b = pts[i];
    return {
      x: a[0] + (b[0] - a[0]) * t,
      y: a[1] + (b[1] - a[1]) * t,
      a: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
    };
  }

  /**
   * A train that follows the rails.
   *
   * Every vehicle is placed at its own distance along the line and rotated to
   * the heading THERE, so the consist bends through curves instead of cutting
   * across them as one rigid block. It also runs along the whole line, not
   * just the current leg — legs are as short as 54 units and the train is
   * longer than that, so the tail correctly lies back over track already
   * travelled.
   *
   * The locomotive artwork faces LEFT, so it is mirrored on x to lead.
   */
  /**
   * Keep a vehicle the right way up, whichever way the track runs.
   *
   * Rotating a body to a LEFTWARD heading turns it upside down: rotate(180) is
   * the same as scaling by -1 on both axes, so the roof ends up under the rails
   * and the wheels over them. The Ratio & Rate Rail is the only line that runs
   * right to left (x 602 → 318), which is why every other line looked fine and
   * this one shipped a train on its back.
   *
   * The fix is to rotate to the REVERSED heading — same line, body upright —
   * and let the horizontal mirror decide which way the thing faces.
   */
  function upright(a) {
    return (a > 90 || a < -90) ? { rot: a + 180, back: true } : { rot: a, back: false };
  }

  function consistOnPath(pts, cum, dEngine, colour, cars) {
    var S = 0.26;                       // small enough to sit on the rails
    var CAR_GAP = 15, CAR_W = 12, FIRST_CAR = 25;
    var MIN_SEP = CAR_W + 5;            // straight-line clearance between bodies
    var s = '';

    /* Spacing by arc length alone is not enough. Where the route hairpins —
       and the Part–Whole line does, running y 344 → 396 → 320 — two vehicles
       an equal distance apart ALONG the rails can end up on top of each other
       in space, because the track folds back on itself. So each car is pushed
       further back until it clears the one in front by a real straight-line
       distance. */
    var slots = [], prev = atDist(pts, cum, dEngine), d = dEngine;
    for (var k = 0; k < cars; k++) {
      d -= (k === 0 ? FIRST_CAR : CAR_GAP);
      var q = atDist(pts, cum, d), guard = 0;
      while (d > 0 && guard++ < 400 &&
             Math.sqrt((q.x - prev.x) * (q.x - prev.x) + (q.y - prev.y) * (q.y - prev.y)) < MIN_SEP) {
        d -= 2;
        q = atDist(pts, cum, d);
      }
      slots.push(q);
      prev = q;
    }
    consistOnPath.lastDist = d;

    // far car first so nearer vehicles paint over it; engine last of all
    for (var c = cars - 1; c >= 0; c--) {
      var q = slots[c];
      /* Placement lives on an OUTER group and the animation on an inner one.
         A CSS transform beats the transform attribute in SVG, so animating
         `.leg-car` directly wiped each car's position and dumped the whole
         consist at the origin. The two must not share an element. */
      /* A carriage is symmetric front-to-back, so it needs no mirror — but it
         is NOT symmetric top-to-bottom (body above the axle, wheels below), so
         it still has to be kept upright. */
      s += '<g transform="translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) +
             ') rotate(' + upright(q.a).rot.toFixed(1) + ')">' +
           '<g class="leg-car" style="--lc-i:' + c + '">' +
           '<rect x="' + (-CAR_W / 2 - 3) + '" y="-1.5" width="' + (CAR_W + 6) + '" height="2.2" rx="1" fill="#241B10"/>' +
           '<rect x="' + (-CAR_W / 2) + '" y="-11" width="' + CAR_W + '" height="10" rx="2" fill="#EFE4D0" stroke="#241B10" stroke-width="1.6"/>' +
           '<rect x="' + (-CAR_W / 2 + 2.5) + '" y="-8.5" width="' + (CAR_W - 5) + '" height="4" rx="1" fill="#BCAA8C"/>' +
           '<circle cx="' + (-CAR_W / 2 + 3) + '" cy="1.6" r="2" fill="#241B10"/>' +
           '<circle cx="' + (CAR_W / 2 - 3) + '" cy="1.6" r="2" fill="#241B10"/>' +
           '</g></g>';
    }

    /* The locomotive artwork faces LEFT. Travelling right it is mirrored to
       lead; travelling left it is already facing the right way, so the mirror
       comes OFF rather than being stacked on top of the reversed rotation.
       The nose offset flips with it — in the reversed frame, forward is -x. */
    var e = atDist(pts, cum, dEngine), u = upright(e.a);
    s += '<g class="leg-engine" transform="translate(' + e.x.toFixed(1) + ',' + e.y.toFixed(1) +
         ') rotate(' + u.rot.toFixed(1) + ') translate(' + (u.back ? -15 : 15) + ',' + (-9) +
         ') scale(' + (u.back ? S : -S) + ',' + S + ')">' +
         '<rect x="4" y="56" width="112" height="9" rx="4" fill="#241B10"/>' +
         '<rect x="26" y="28" width="66" height="30" rx="14" fill="' + colour + '"/>' +
         '<rect x="86" y="14" width="34" height="44" rx="5" fill="' + colour + '"/>' +
         '<rect x="30" y="12" width="13" height="18" rx="3" fill="' + colour + '"/>' +
         '<rect x="26" y="8" width="21" height="7" rx="3" fill="' + colour + '"/>' +
         '<circle cx="26" cy="70" r="11" fill="#241B10"/><circle cx="60" cy="70" r="14" fill="#241B10"/>' +
         '<circle cx="96" cy="70" r="14" fill="#241B10"/>' +
         '</g>';

    consistOnPath.tailDist = (cars ? consistOnPath.lastDist : dEngine) - 8;
    consistOnPath.noseDist = dEngine + 16;
    return s;
  }

  /** Kept for the old rigid-group call signature; unused by the leg view. */
  function consist(pts, tPos, colour, cars) {
    var lead = 0.52 + Math.max(0, Math.min(1, tPos)) * 0.24;
    var idx = Math.max(1, Math.min(pts.length - 1, Math.round(lead * (pts.length - 1))));
    var a = pts[idx - 1], b = pts[idx];
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;

    // Where the consist actually reaches, so the caller can frame it. Padding
    // the x-axis alone failed on steep legs, where the tail runs vertically.
    var rad = ang * Math.PI / 180;
    var tailLen = 78 + cars * 28, noseLen = 30;
    consist.extent = {
      tail:  [b[0] - Math.cos(rad) * tailLen, b[1] - Math.sin(rad) * tailLen],
      front: [b[0] + Math.cos(rad) * noseLen, b[1] + Math.sin(rad) * noseLen]
    };

    var s = '<g class="leg-train" transform="translate(' + b[0].toFixed(1) + ',' + b[1].toFixed(1) +
            ') rotate(' + ang.toFixed(1) + ')">';

    /* Cars are emitted FIRST so the engine paints over them where they meet —
       SVG has no z-index, only document order. They also start clear of the
       engine's rear. The engine group is translate(26) scale(-.5), so its
       local 4..120 lands at 24..-34 in this space: anything starting at -32
       sat on top of the cab, which is what "cars on top of the train" was. */
    var CAR_W = 22, GAP = 28, FIRST = -68;   // engine rear is at -34
    for (var c = cars - 1; c >= 0; c--) {    // far car first, nearest last
      var x = FIRST - c * GAP;
      s += '<g class="leg-car" style="--lc-i:' + c + '">' +
           // coupling to whatever is in front
           '<rect x="' + (x + CAR_W) + '" y="-6" width="' + (GAP - CAR_W + 4) + '" height="3" rx="1.5" fill="#241B10"/>' +
           '<rect x="' + (x - 3) + '" y="-3" width="' + (CAR_W + 6) + '" height="3.5" rx="1.5" fill="#241B10"/>' +
           '<rect x="' + x + '" y="-20" width="' + CAR_W + '" height="19" rx="3" fill="#EFE4D0" stroke="#241B10" stroke-width="2.5"/>' +
           '<rect x="' + (x + 4) + '" y="-16" width="14" height="7" rx="1.5" fill="#BCAA8C"/>' +
           '<circle cx="' + (x + 5) + '" cy="3" r="3.6" fill="#241B10"/>' +
           '<circle cx="' + (x + CAR_W - 5) + '" cy="3" r="3.6" fill="#241B10"/>' +
           '</g>';
    }

    // scale(-.5,.5) mirrors it, so the cowcatcher leads in the travel direction
    s += '<g class="leg-engine" transform="translate(26,-11) scale(-.5,.5)">' +
         '<rect x="4" y="56" width="112" height="9" rx="4" fill="#241B10"/>' +
         '<rect x="26" y="28" width="66" height="30" rx="14" fill="' + colour + '"/>' +
         '<rect x="86" y="14" width="34" height="44" rx="5" fill="' + colour + '"/>' +
         '<rect x="30" y="12" width="13" height="18" rx="3" fill="' + colour + '"/>' +
         '<rect x="26" y="8" width="21" height="7" rx="3" fill="' + colour + '"/>' +
         '<circle cx="26" cy="70" r="11" fill="#241B10"/><circle cx="60" cy="70" r="14" fill="#241B10"/>' +
         '<circle cx="96" cy="70" r="14" fill="#241B10"/>' +
         '</g>';
    s += '</g>';
    return s;
  }

  /**
   * @param {object} counts  problems per line
   * @param {string} line    which line
   * @param {number} i       index of the stop just left
   * @param {number} progress 0..1 through this leg
   * @param {number} cars    stations completed so far
   */
  /* @param tint  optional colour override. The percent ROUTE has no geometry of
     its own — `STOPS` is keyed by schema and `STOPS.percent` is undefined, so
     passing the route key here would throw and take the whole station with it.
     A percent ride therefore draws its problem's REAL line for the shape and
     overrides only the colour, because the colour is the part a student can
     read off at a glance, and on that ride which line they are on is the
     question they are about to be asked. */
  function legMap(counts, line, i, progress, cars, tint) {
    var stops = STOPS[line];
    var from = stops[Math.max(0, Math.min(stops.length - 1, i))];
    var to   = stops[Math.max(0, Math.min(stops.length - 1, i + 1))];

    var colour = tint || ('var(--line-' + line + ')');

    /* Sample the WHOLE line, not just this leg. The train is longer than a
       short leg, so its tail has to lie back along the track it has already
       covered — which is also what makes it look like it is on the rails. */
    var PER = 24;
    var pts = splinePoints(stops, PER);
    var cum = arcTable(pts);
    var iFrom = Math.max(0, Math.min(stops.length - 1, i));
    var dFrom = cum[Math.min(cum.length - 1, iFrom * PER)];
    var dTo   = cum[Math.min(cum.length - 1, (iFrom + 1) * PER)];
    var dEngine = dFrom + (0.45 + Math.max(0, Math.min(1, progress)) * 0.42) * (dTo - dFrom);

    var trainSvg = consistOnPath(pts, cum, dEngine, '#3A3A44', cars);
    var tail = atDist(pts, cum, consistOnPath.tailDist);
    var nose = atDist(pts, cum, consistOnPath.noseDist);

    var xs = [from[0], to[0], tail.x, nose.x];
    var ys = [from[1], to[1], tail.y, nose.y];
    var padX = 78, padY = 62;
    var x1 = Math.min.apply(null, xs) - padX, x2 = Math.max.apply(null, xs) + padX;
    var y1 = Math.min.apply(null, ys) - padY, y2 = Math.max.apply(null, ys) + padY;
    var vw = x2 - x1, vh = y2 - y1;
    // keep a wide, letterbox-ish shape so the line runs across the panel
    if (vw / vh < 2.6) { var need = vh * 2.6; x1 -= (need - vw) / 2; vw = need; }
    else { var needH = vw / 2.6; y1 -= (needH - vh) / 2; vh = needH; }

    /* Then aim the frame at the TERRITORY the student is riding through.

       This used to be "slide down as far as it will go", which was written for
       the Ratio & Rate Rail — its territory runs along the south coast to y 646
       and the frame was cutting the coastline off. Applied to every line it was
       wrong: the Part–Whole Loop ends at y 484, so every one of its legs got
       shoved up to 66 units past its own southern edge, the top of the section
       was never shown at all, and barely a third of the frame landed on
       Part–Whole land. The rule optimised for one line and quietly mis-framed
       another.

       So the target is the section's own centre, and the leg stays visible.
       Two hard constraints bracket the frame — the leg's stops and train must
       keep AIR_ABOVE clear, and the frame must stay inside the world — and
       within that window the frame moves as close to the territory centre as
       it can get. A line hugging the coast still slides down; a compact line
       in the middle of the map now stays centred on itself. */
    var poly = parsePolygon(TERRITORY[line] ? TERRITORY[line].d : ''), tx1, ty1, tx2, ty2;
    if (poly.length) {
      tx1 = ty1 = Infinity; tx2 = ty2 = -Infinity;
      poly.forEach(function (p) {
        if (p[0] < tx1) tx1 = p[0]; if (p[0] > tx2) tx2 = p[0];
        if (p[1] < ty1) ty1 = p[1]; if (p[1] > ty2) ty2 = p[1];
      });

      /* THE FRAME MUST CONTAIN THE WHOLE SECTION IT IS AIMED AT.

         Aiming at the territory centre is not enough when the territory does
         not FIT. The frame is sized by the leg — two stops and the train — and
         the Change section is compact and portrait (221 wide by 282 tall),
         so every one of its legs framed a slice of it: the first leg cut 150
         units off the top, and a student riding the Change Line never saw the
         northern half of their own territory.

         Moving the frame could not have fixed it. The section is 282 tall and
         the leg frames were 152–197 tall — you cannot show a tall thing in a
         short window by sliding the window. It has to grow.

         Deliberately NOT a Change-only rule. The comment above records a fix
         that was written for the Ratio & Rate Rail and quietly mis-framed
         Part–Whole; a second line-specific rule would be the same mistake
         twice. Every section stays smaller than the world, so every leg view
         is still a zoom — it is now a zoom on the whole section rather than on
         an arbitrary slice of it. */
      var TERR_PAD = 18;
      var needW = (tx2 - tx1) + TERR_PAD * 2;
      var needH = (ty2 - ty1) + TERR_PAD * 2;
      if (needW > vw) vw = needW;
      if (needH > vh) vh = needH;
      // Restore the letterbox shape, then keep the frame inside the world.
      if (vw / vh < 2.6) vw = vh * 2.6; else vh = vw / 2.6;
      vw = Math.min(vw, MAP_W); vh = Math.min(vh, MAP_H);
    }

    /* Now place the frame. Two hard requirements bracket it on each axis — the
       whole section stays inside the frame, and the frame stays inside the
       world — and within whatever slack is left it FOLLOWS THE LEG.

       Aiming at the section's centre was the previous rule, and once the frame
       grew big enough to contain the section it became the only thing that
       mattered: every leg of a line produced an identical frame, and the
       zoom-in stopped following the journey at all. It still contained the
       section, so a containment check passed while the feature was gone —
       which is what happens when you fix a proxy and stop looking at the
       objective (VERIFICATION.md 21).

       Targeting the LEG and clamping to containment gives both: the whole
       section is always visible, and the frame still tracks along the line as
       the student rides it, using whatever room the section leaves over. */
    var AIR = 26;
    function aim(contentMin, contentMax, span, tLo, tHi, worldMax) {
      // Keep the whole section in frame, when the frame is big enough to hold it.
      var lo = 0, hi = worldMax - span;
      if (tLo !== undefined && (tHi - tLo) <= span) {
        lo = Math.max(lo, tHi - span);
        hi = Math.min(hi, tLo);
      }
      // Never crop the leg's own stops or train.
      lo = Math.max(lo, contentMax + AIR - span);
      hi = Math.min(hi, contentMin - AIR);
      if (lo > hi) {
        // Cannot satisfy both — centre on the section, which is the thing the
        // student is riding through, and let the leg sit where it falls.
        var c = (tLo !== undefined) ? (tLo + tHi) / 2 : (contentMin + contentMax) / 2;
        return Math.max(0, Math.min(worldMax - span, c - span / 2));
      }
      // Follow the leg within the room that is left.
      var target = (contentMin + contentMax) / 2 - span / 2;
      return Math.max(lo, Math.min(hi, target));
    }
    var cxMin = Math.min.apply(null, xs), cxMax = Math.max.apply(null, xs);
    var cyMin = Math.min.apply(null, ys), cyMax = Math.max.apply(null, ys);
    x1 = aim(cxMin, cxMax, vw, tx1, tx2, MAP_W);
    y1 = aim(cyMin, cyMax, vh, ty1, ty2, MAP_H);

    var s = mapBody(counts);
    s += '<circle cx="' + from[0] + '" cy="' + from[1] + '" r="7" fill="#FDF8F0" stroke="#2C2214" stroke-width="2.5"/>';
    s += '<circle cx="' + to[0] + '" cy="' + to[1] + '" r="10" fill="#FDF8F0" stroke="' + colour + '" stroke-width="4"/>';
    s += trainSvg;

    return '<svg class="leg-svg" viewBox="' + x1.toFixed(0) + ' ' + y1.toFixed(0) + ' ' +
           vw.toFixed(0) + ' ' + vh.toFixed(0) + '" xmlns="' + NS + '" aria-hidden="true">' + s + '</svg>';
  }

  /* ---------- Ticker ---------- */

  function ticker(items) {
    var one = items.map(function (t) {
      return '<span class="ticker-item">' + t + '<span class="ticker-dot"></span></span>';
    }).join('');
    return '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + one + one + '</div></div>';
  }

  /* ---------- The painted furniture ----------
     The station, the loco, the caboose, the ticket booth and the ticket. Not
     illustrations OF a problem — those are the scene libraries, and they obey
     the uncountability rules because they draw the quantities. These are the
     building the problems happen inside, so they are decorative and are marked
     as such: `alt=""` plus `aria-hidden`, so a screen-reader user is not read a
     description of wallpaper before every question.

     ONE PLACE FOR THE PATH RULES, because all three of them bite silently:
       - the folder is `assets/art/`, NOT the delivered folder with spaces in
         its name, which would become %20 in every URL;
       - the case must match the file exactly. GitHub Pages serves from Linux
         and is case-sensitive; Windows is not, so a wrong capital works all the
         way through development and 404s the moment it is published;
       - relative, never leading-slash, which would resolve to the domain root
         rather than the project on a project Pages site.
     `lazy` + `async` because these run 340–680 KB each and none of them is
     needed before the text they sit beside. */
  var ART = 'assets/art/';
  function art(file, cls) {
    return '<img class="art ' + (cls || '') + '" src="' + ART + file + '" alt="" ' +
           'aria-hidden="true" loading="lazy" decoding="async">';
  }

  /* ============================================================
     CROSSOVER ISLAND — the Challenge Line's own map.

     A SINGLE island with ONE irregular circuit running round it, against a
     mainland of five separate territories with five lines meeting at
     junctions. That contrast is the point and not a saving: on the mainland
     you pick a line and it takes you somewhere; here there is one line and it
     comes back to where it started, because every stop on it is the same kind
     of problem wearing a different pair.

     STYLE MATCHES BY CONSTRUCTION, NOT BY IMITATION. Every primitive below is
     the mainland's — `closedSpline`, `trackPath`, `river`, `range`, `forests`,
     `waves`, `bridge`, `compassRose`, `makeWaterTest`, `waterSpans`. Redrawing
     a coastline or a bridge "in the same style" by hand is how two maps drift
     into looking like two maps. The only genuinely new marks here are the ones
     the mainland has no concept of: a stop belonging to TWO lines, an
     unstaffed halt, and a lighthouse.

     THE BRIDGES ARE FOUND, NOT PLACED, and that is worth knowing because it is
     also the pedagogy. `waterSpans` walks the circuit and returns every stretch
     that crosses water; each becomes a bridge. So a bridge appears wherever the
     line crosses a river — and a bridge is exactly what a crossover is: the
     span that carries you from one side to the other. Nothing was positioned to
     make that true; it falls out of running the mainland's own water test over
     the loop.

     MEASURED: TWO BRIDGES, NOT THREE. This comment first said the circuit
     "happens to cross three rivers", which was a guess written beside a
     generator whose whole point is that I do not have to guess. The island has
     three rivers; the loop crosses water in two places, because the short
     feeder runs into the lake well inside the circuit. `islandMap.bridgeCount`
     reports it and the map's own aria-label is built from `spans.length`, so
     the description cannot drift from the drawing the way this sentence did.
     Also measured on the rendered SVG: 390 samples along the 1557-unit
     circuit, none of them off the island, and all five stops within 1.4px of
     the rail.

     WHY THE TRACK IS NEUTRAL INK RATHER THAN A LINE COLOUR. Challenge is a
     route, not a sixth schema — the same reason `MIXED` and `PERCENT` are kept
     out of `LINES`. A single colour would claim it is one of the five; six
     colours would need a palette decision that ROADMAP §5b has open. So the
     track is the same neutral the mainland uses for junctions, for the same
     stated reason — "it reads the same whether the lines it joins are running
     or still being built" — and the two line colours live on the STOPS, where
     they are true: each stop is one pair.
     ============================================================ */

  var ISL_W = 1040, ISL_H = 700;

  /* One landmass. Irregular on purpose: a circle would make the circuit a
     racetrack, and the whole reading of this map is that the line goes round
     something with a shape. Deep bay on the west, headland north-east, a spit
     running south. */
  var ISLAND = [[214, 132], [318, 96], [438, 88], [548, 104], [612, 78], [706, 92],
                [792, 140], [846, 214], [858, 300], [896, 356], [872, 430],
                [806, 486], [742, 512], [700, 574], [612, 606], [508, 596],
                [430, 618], [346, 592], [286, 528], [214, 500], [166, 434],
                [140, 350], [124, 258], [158, 178]];

  /* The circuit. Closed, irregular, and threaded so it crosses each river once
     — which is what puts the bridges where they belong. It runs inside the
     coast the whole way except at the two coastal stops, where it comes out to
     meet the sea. */
  var CIRCUIT = [[286, 214], [386, 168], [498, 158], [598, 176], [686, 168],
                 [762, 210], [788, 286], [812, 356], [780, 424], [706, 452],
                 [648, 508], [552, 528], [462, 520], [392, 540], [330, 494],
                 [278, 428], [252, 350], [244, 268]];

  /* RIVERS ARE CLIPPED TO THE LAND, so a river that is to reach the sea must be
     drawn PAST the coast and let the clip cut it at the shoreline. Ending one
     exactly on the coast leaves it short, because the coast is a spline through
     these points rather than the polygon itself and it bows.

     The east river ended at [820, 440] and stopped about forty units inland —
     the user saw it, 2026-08-16. Its tail now runs on to [880, 500], which is
     outside the landmass, and crosses the coast at roughly [838, 458]. The
     south-west river already did this correctly: [286, 552] is well south of
     the coast, which is why that one has always had a mouth. */
  var ISL_RIVERS = [
    [[402, 250], [388, 306], [366, 372], [330, 436], [300, 500], [286, 552]],   // south-west, to the sea
    [[672, 246], [700, 300], [736, 348], [772, 392], [820, 440], [880, 500]],   // east, to the sea
    [[498, 300], [520, 336], [548, 364], [586, 384]]                            // short feeder into the lake
  ];

  var ISL_LAKE = [[586, 380], [622, 362], [664, 366], [692, 392],
                  [684, 428], [644, 446], [604, 434], [582, 408]];

  /* THE FIVE STOPS, AND THE ORDER IS NOT A SEQUENCE. The island is open — any
     stop, any order (user, 2026-08-15) — so these are positions round a loop,
     not steps 1 to 5. `kind` is what the map has to say instead: staffed
     platforms teach, unstaffed halts do not.

     A STOP HOLDS A POOL, NOT A PROBLEM. `ids` is a list, and two of these five
     hold two problems each — so a second visit differs by PROBLEM and not only
     by number set, which is what "seven built, five ridden" meant in the plan.
     `key` is the stop's own identity and is what `data-stop` carries; a problem
     id cannot serve as that any more, because a stop can hold two.

     WHICH TWO POOL, AND THE CONSTRAINT THAT DECIDED IT. The fade is driven by
     the PROBLEM's `fadeLevel`, not by the stop — so a staffed-content problem
     pooled at an unstaffed halt would make that stop staffed half the time
     while the map draws it with a signpost and no one on the platform. Both
     pool problems are staffed content, so both go to staffed platforms:
     `cl-carriage-clean` (Ratio → Change) joins Thorne Bridge, which already
     holds a problem with ratio in it, and `cl-track-sleepers` (Equal Groups →
     Change) joins Fell Crossing, which already holds one with groups.

     `pair` IS GONE, and its absence is the point. It used to give each stop two
     line colours, and it could never be right for a pooled stop — two problems,
     two different pairings, one marker. It was already unused: `pairStop` draws
     both halves in neutral ink because showing the real colours told a student
     which two situations were waiting before the Crossover Read asked. If the
     `reveal` path is ever built, it must take the pair from the problem
     ACTUALLY RIDDEN, which is known only after the ride and lives on the
     problem rather than on the stop. */
  var ISL_STOPS = [
    { key: 'thorne', at: [386, 168], kind: 'staffed',
      ids: ['cl-signal-delay', 'cl-carriage-clean'],
      /* `note` says what the stop IS, never which two situations it joins.
         This read "Compare, then a rate" and was the same leak as the marker
         colours in English — see `pairStop`. */
      name: 'Thorne Bridge',  note: 'Open — Assistance Available' },
    { key: 'kelder', at: [788, 286], kind: 'staffed',
      ids: ['cl-season-tickets'],
      name: 'Kelder Sands',   note: 'Open — Assistance Available' },
    { key: 'fell',   at: [648, 508], kind: 'staffed',
      ids: ['cl-platform-planters', 'cl-track-sleepers'],
      name: 'Fell Crossing',  note: 'Open — Assistance Available' },
    { key: 'cold',   at: [330, 494], kind: 'halt',
      ids: ['cl-lost-umbrellas'],
      name: 'Cold Halt',      note: 'Open — No Assistance' },
    { key: 'marsh',  at: [252, 350], kind: 'halt',
      ids: ['cl-buffet-crates'],
      name: 'Marsh Halt',     note: 'Open — No Assistance' }
  ];

  /* A stop is open when ANY problem in its pool is published. Derived here so
     the map, the button list and the line card cannot disagree about it — they
     each used to test `counts[st.id]` in their own words, which is three places
     to update the day a stop gains a second problem. */
  function stopIsOpen(st, published) {
    for (var i = 0; i < st.ids.length; i++) if (published[st.ids[i]]) return true;
    return false;
  }

  var ISL_TERMINUS = [762, 210];

  /* A stop belonging to TWO situations. The mainland's `stop()` takes one
     colour because a mainland stop is on one line; this one is split down the
     middle, which is the only honest way to draw a problem that is two.

     THE TWO HALVES ARE NOT PAINTED IN THE PAIR'S LINE COLOURS, AND THAT IS A
     CHANGE FROM THE PLAN. `CHALLENGE-MODE.md` §2 said each stop should carry
     the two `--line-*` colours of its pair, so "the map states the pedagogy".
     Building the zoomed station view is what showed what that costs: the
     journey panel sits at the top of EVERY phase, Platform Check included, so
     a student who has learned that blue is Compare and orange is Ratio reads
     both halves of the answer off a marker, with no words involved and three
     screens before they are asked. The stop's caption said it outright too —
     "Compare, then a rate" — which is the same leak in English.

     This is the site's oldest rule and it outranks the visual idea: no answer
     may reach a student before it is asked. What survives is the part that
     leaks nothing, because it is true of EVERY stop on the island: the disc is
     still split, so the map still says "each of these is two situations
     joined". It just no longer says which two.

     `reveal` paints the real pair colours, and nothing passes it yet. It is
     the hook for showing a pair AFTER it has been ridden — the "you can see
     which pairs you rode" half of the original idea, which was always the
     defensible half.

     Colour is never the only signal either way. A staffed platform is a filled
     disc; a halt is an open disc with a post and crossbar — different SHAPES,
     so the difference survives greyscale and a screen reader, and the button
     list below the map says which is which in words. */
  function pairStop(x, y, staffed, reveal, c1, c2) {
    var r = staffed ? 11 : 9;
    var a = reveal ? 'var(--line-' + c1 + ')' : '#6B5138';
    var b = reveal ? 'var(--line-' + c2 + ')' : '#8F7F63';
    var s = '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 2.5) + '" fill="#FDF8F0" stroke="#2C2214" stroke-width="2.4"/>';
    if (staffed) {
      // Split vertically: the first situation on the left, the second on the
      // right, which is the order they are read in.
      s += '<path d="M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + x + ' ' + (y + r) + ' Z" fill="' + a + '"/>';
      s += '<path d="M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + r) + ' Z" fill="' + b + '"/>';
      s += '<line x1="' + x + '" y1="' + (y - r) + '" x2="' + x + '" y2="' + (y + r) + '" stroke="#FDF8F0" stroke-width="1.6"/>';
    } else {
      s += '<path d="M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + x + ' ' + (y + r) + '" fill="none" stroke="' + a + '" stroke-width="3.4"/>';
      s += '<path d="M ' + x + ' ' + (y - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + r) + '" fill="none" stroke="' + b + '" stroke-width="3.4"/>';
      s += '<line x1="' + x + '" y1="' + (y - r - 3) + '" x2="' + x + '" y2="' + (y - r - 15) + '" stroke="#5A3E28" stroke-width="2.2"/>';
      s += '<line x1="' + (x - 7) + '" y1="' + (y - r - 15) + '" x2="' + (x + 7) + '" y2="' + (y - r - 15) + '" stroke="#5A3E28" stroke-width="2.6" stroke-linecap="round"/>';
    }
    return s;
  }

  /* The terminus, on the headland. A lighthouse rather than another disc,
     because it is the one place on the island that is not a problem — and it is
     what you steer by from anywhere on the loop. */
  function lighthouse(x, y) {
    return '<g>' +
      '<path d="M ' + (x - 9) + ' ' + y + ' L ' + (x - 6) + ' ' + (y - 30) + ' L ' + (x + 6) + ' ' + (y - 30) + ' L ' + (x + 9) + ' ' + y + ' Z" ' +
        'fill="#FDF8F0" stroke="#2C2214" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<rect x="' + (x - 7.6) + '" y="' + (y - 23) + '" width="15.2" height="5" fill="#A85413"/>' +
      '<rect x="' + (x - 6.6) + '" y="' + (y - 13) + '" width="13.2" height="5" fill="#A85413"/>' +
      '<rect x="' + (x - 7) + '" y="' + (y - 38) + '" width="14" height="8" rx="1.5" fill="#F2C230" stroke="#2C2214" stroke-width="1.8"/>' +
      '<path d="M ' + (x - 10) + ' ' + (y - 40) + ' L ' + x + ' ' + (y - 45) + ' L ' + (x + 10) + ' ' + (y - 40) + ' Z" fill="#2C2214"/>' +
      // the beam, and it sweeps — the one animated mark on the island
      '<path class="mf-beam" d="M ' + (x + 7) + ' ' + (y - 34) + ' L ' + (x + 62) + ' ' + (y - 50) + ' L ' + (x + 62) + ' ' + (y - 16) + ' Z" ' +
        'fill="#F2C230" opacity=".28"/>' +
      '</g>';
  }

  /**
   * Crossover Island.
   * @param {object} counts  map of stop id -> true when that stop has a
   *                         published problem behind it. Discovered by the
   *                         caller from the problem bank, never listed here —
   *                         a map that hardcodes what is built is a map that
   *                         lies the day something opens.
   */
  /* THE ISLAND'S WORLD, EXTRACTED — same reason `mapBody` is extracted from
     `railMap`: the zoomed view has to reuse EXACTLY this geometry and change
     only the viewBox, or the coastline, rivers, bridges and forests around a
     stop are re-derived by a second renderer and free to drift from the first.

     `opts.trainAt` is the fraction round the loop the consist stands at, so the
     zoomed view can bring the train to the stop being ridden without a second
     copy of the train code. `opts.reveal` is the answer-leak switch — see
     `pairStop`. */
  function islandBody(counts, opts) {
    counts = counts || {}; opts = opts || {};
    var W = ISL_W, H = ISL_H, s = '';
    var land = closedSpline(ISLAND, 9);
    var lake = closedSpline(ISL_LAKE, 8);
    var circuit = closedSpline(CIRCUIT, 10);

    s += '<defs><clipPath id="xo-land"><path d="' + land.d + '"/></clipPath></defs>';

    /* --- sea --- */
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="10" fill="#DCEEF6"/>';
    s += waves([[52, 118], [46, 300], [72, 470], [140, 606], [300, 60],
                [560, 46], [852, 96], [962, 300], [934, 520], [760, 646],
                [420, 664], [180, 640]]);

    /* --- the island --- */
    s += '<path d="' + land.d + '" fill="#F5EDE0" stroke="#A9CFE2" stroke-width="7" stroke-linejoin="round"/>';
    s += '<path d="' + land.d + '" fill="#F5EDE0" stroke="#2C2214" stroke-width="2.5" stroke-linejoin="round"/>';

    /* --- inland water. Same ordering rule as the mainland: rivers first,
           then the lake painted over them, then the lake's outline masked at
           each river mouth so the border does not cut across the water where a
           river arrives. Copied as an ORDER, not as code. --- */
    var mouths = [];
    ISL_RIVERS.forEach(function (r) {
      [r[0], r[r.length - 1]].forEach(function (p) {
        if (near(p, lake.pts, 22) || pointInPoly(p, lake.pts)) mouths.push(p);
      });
    });
    s += '<g clip-path="url(#xo-land)">' +
         ISL_RIVERS.map(function (r) { return river(smoothPath(r)); }).join('') +
         '</g>';
    s += '<path d="' + lake.d + '" fill="#BFE0EF"/>';
    s += '<defs><mask id="xo-lake-edge">' +
         '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#fff"/>' +
         mouths.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#000"/>'; }).join('') +
         '</mask></defs>';
    s += '<path d="' + lake.d + '" fill="none" stroke="#8FBBD1" stroke-width="2.5" mask="url(#xo-lake-edge)"/>';
    s += '<path class="mf-flow mf-flow-slow" d="M 600 400 C 618 392, 646 396, 668 390" fill="none" ' +
         'stroke="#E4F4FB" stroke-width="2" stroke-linecap="round" stroke-dasharray="10 16"/>';
    s += '<text x="636" y="412" text-anchor="middle" font-family="' + BODY +
         '" font-size="9.5" font-style="italic" fill="#4E7C92">Lake Transfer</text>';

    /* --- mountains, inland and away from the circuit --- */
    var RANGES = [[452, 306, 3, 26, 30], [606, 268, 2, 24, 27], [368, 424, 2, 22, 24]];
    RANGES.forEach(function (r) { s += range(r[0], r[1], r[2], r[3], r[4]); });
    var rangeBoxes = RANGES.map(function (r) {
      return [r[0] - 2, r[1] - r[4] * 1.22 - 2, r[0] + (r[2] - 1) * r[3] + r[3] * 1.24 + 2, r[1] + 2];
    });

    /* --- forests, placed procedurally and rejected against everything already
           on the plate. Same reason as the mainland: placing them by hand means
           guessing at collisions on a map I cannot see. --- */
    var riverSamples = [];
    ISL_RIVERS.forEach(function (r) { splinePoints(r, 20).forEach(function (p) { riverSamples.push(p); }); });
    var nodePts = ISL_STOPS.map(function (st) { return st.at; }).concat([ISL_TERMINUS, [636, 406]]);
    var wood = forests({
      land: [land.pts], lake: lake.pts, rivers: riverSamples, track: circuit.pts,
      nodes: nodePts,
      boxes: [[30, 30, 430, 96], [846, 560, 1010, 670]].concat(rangeBoxes),
      clusters: [
        [340, 260, 6], [520, 220, 5], [700, 340, 6], [430, 470, 5],
        [560, 470, 6], [250, 300, 5], [740, 420, 4], [470, 560, 5], [620, 130, 4]
      ]
    });
    s += wood.svg;
    islandMap.treeCount = wood.count;

    /* --- BRIDGES, FOUND BY RUNNING THE MAINLAND'S WATER TEST OVER THE CIRCUIT.
           Not placed. Wherever the loop crosses a river or the lake, a bridge
           is drawn, which is why the number of bridges on this island is a
           consequence of its geography rather than a decision. --- */
    var isWater = makeWaterTest([land.pts], riverSamples, lake.pts);
    var spans = waterSpans(circuit.pts, isWater, 2);
    spans.forEach(function (span) { s += bridge(span); });
    islandMap.bridgeCount = spans.length;

    /* --- the circuit itself --- */
    s += trackPath(circuit.d, '#5A3E28', true);

    /* --- THE TRAIN, ON THE RAILS ---

       `consistOnPath` is the leg view's own train, and using it rather than the
       mainland's static `locomotive()` is deliberate: this one is placed by
       DISTANCE along the circuit and each vehicle is rotated to the heading at
       its own point, so the consist bends through the island's curves instead
       of cutting across them as one rigid block. On a loop this irregular that
       is the difference between a train on the track and a train near it.

       WHERE IT SITS WAS CHOSEN BY MEASUREMENT — AND THE FIRST CHOICE WAS
       CHOSEN BY EYE AND WAS WRONG. I put it at 0.62 "on the long southern run",
       wrote a comment saying that stretch was the only one long enough to hold
       four vehicles clear of a marker, and measured afterwards: the engine
       landed at [646.8, 508.5] against Fell Crossing at [648, 508]. It was
       parked ON the stop, with 0.5 units of clearance. The sentence justifying
       the position was written before anything had been measured, which is the
       whole of how it happened.

       Swept the loop instead. Clearance is the closest any of the four
       vehicles comes to any stop or the lighthouse, sampled every 5 units over
       the ~70 units the consist occupies: 0.62 scores 0.5, and the best is
       0.215 at 152.8 — the NORTHERN run, x 544 to 606 along the top of the
       island, measured after the move rather than described before it.
       Neighbouring positions score 130 to 151, so this is a broad plateau
       rather than a knife-edge that the next nudge to a stop would ruin.
       `islandMap.trainClear` reports it on every render; it reads 150 here. */

    /* IT DOES NOT DRIVE ROUND THE ISLAND, and that is a real limit rather than
       an oversight. Every vehicle here is positioned and rotated individually,
       so a CSS motion path on the group would add its offset on top of each
       car's own placement and scatter the consist — the same collision the leg
       view records, where a CSS transform on `.leg-car` "wiped each car's
       position and dumped the whole consist at the origin". Genuine motion
       needs the consist recomputed frame by frame, which is a timer redrawing
       SVG on a page that is otherwise still. The mainland's map train is static
       too, so a still train is the house style rather than a shortfall.

       What it does have is life on arrival: `.leg-car` carries a one-shot
       entrance animation, already reduced-motion safe, so the train pulls in
       when the map opens. The plume reuses `.mf-smoke` and `.mf-smoke-still`
       exactly as `locomotive()` does — freezing the animated puffs would land
       them all at opacity 0 and put the chimney out, which is why the still
       pair exists. */
    var cum = arcTable(circuit.pts);
    var dTrain = cum[cum.length - 1] * (typeof opts.trainAt === 'number' ? opts.trainAt : 0.215);
    var engineAt = atDist(circuit.pts, cum, dTrain);
    /* SMOKE TRAILS BACKWARD, AND ON A LOOP "BACKWARD" IS NOT A CONSTANT.
       User-found, and the reasoning is worth keeping because the first version
       looked right in the one place I checked.

       `@keyframes mf-smoke-rise` drifts a FIXED `translate(42px, -58px)` —
       right and up. That is correct on the mainland map, whose comment says
       so: the locomotive art faces LEFT, so drifting right is drifting
       backward, and "drifting it forward would read as the train going
       backwards". One map, one direction, no problem.

       The island train runs round a closed circuit, so its heading is whatever
       the track is doing where it stands — and the zoomed station view moves it
       to a different stop with a different heading on every ride.

       I FIRST WROTE HERE THAT THE WIDE MAP WAS FINE AND ONLY THE ZOOMED VIEW
       WAS WRONG. It was not: measured, the engine on the wide map stands at
       [606,176] with its carriages trailing back to the WEST, so that train is
       travelling east and the fixed rightward drift was blowing smoke out
       ahead of the chimney there too — which is the view the user was looking
       at. My reasoning had the direction backwards because `consistOnPath`
       paints the carriages first and the engine last, so the engine is the
       LAST element a document-order query returns, not the first. Two guesses
       in a row about which end of a list is which; the fix is measured from
       the geometry now and reported on every render.

       Fixed the way this file already fixes the locomotive facing the wrong
       way: a horizontal mirror, not a rotation. `scale(-1,1)` flips the drift
       to trail left while leaving "up" as up — smoke rises whichever way the
       train is pointed, and only the trailing direction depends on travel.
       Rotating the plume to the heading would have tipped the rise with it and
       laid the smoke sideways on a steep stretch.

       `upright()` already answers the same question for the engine body, so
       the plume asks it rather than working out its own answer — one place
       decides which way this train is facing. */
    var heading = upright(engineAt.a);
    var trailsLeft = !heading.back;   // travelling rightward, so smoke goes left
    var smoke = '';
    for (var pf = 0; pf < 6; pf++) {
      smoke += '<g class="mf-smoke" fill="#9E8E76" style="animation-delay:' + (pf * 0.55).toFixed(2) + 's">' +
        '<circle cx="0" cy="0" r="4.4"/><circle cx="3.4" cy="-1.6" r="3.4"/>' +
        '<circle cx="-3.2" cy="-1" r="3.2"/><circle cx="0.4" cy="-4" r="3.4"/>' +
        '</g>';
    }
    s += '<g>' +
         /* The chimney offset flips with the mirror too: the plume starts just
            BEHIND the engine, and behind changes sides with the direction. */
         '<g transform="translate(' + (engineAt.x + (trailsLeft ? -6 : 6)).toFixed(1) + ',' +
           (engineAt.y - 16).toFixed(1) + ')' + (trailsLeft ? ' scale(-1,1)' : '') + '">' +
           smoke +
           '<g class="mf-smoke-still" fill="#9E8E76" opacity=".34">' +
             '<circle cx="2" cy="-2" r="5"/><circle cx="8" cy="-8" r="4.2"/>' +
             '<circle cx="15" cy="-15" r="5.4"/><circle cx="23" cy="-21" r="4.4"/>' +
           '</g>' +
         '</g>' +
         consistOnPath(circuit.pts, cum, dTrain, '#3A3A44', 3) +
         '</g>';

    /* Reported so the direction is checkable rather than asserted — it is the
       thing that was wrong, and it changes with where the train stands. */
    /* Reported on `islandMap`, where `treeCount`, `bridgeCount` and
       `trainClear` already live. Two places to look for this map's diagnostics
       is one too many. */
    islandMap.smokeTrails = trailsLeft ? 'left' : 'right';
    islandMap.engineHeading = Math.round(engineAt.a);

    /* Reported so the placement above is checkable rather than asserted. */
    islandMap.trainClear = (function () {
      var worst = 1e9;
      [dTrain, consistOnPath.tailDist, (dTrain + consistOnPath.tailDist) / 2].forEach(function (d) {
        var q = atDist(circuit.pts, cum, d);
        ISL_STOPS.concat([{ at: ISL_TERMINUS }]).forEach(function (st) {
          var dx = q.x - st.at[0], dy = q.y - st.at[1];
          worst = Math.min(worst, Math.sqrt(dx * dx + dy * dy));
        });
      });
      return Math.round(worst);
    })();

    /* --- stops ---
       `st.note` is what the stop is FOR, never which two situations it joins.
       See the note on `pairStop`: naming the pair here answers the Platform
       Check before the student has read the story. */
    ISL_STOPS.forEach(function (st) {
      var open = stopIsOpen(st, counts);
      /* `data-stop` carries the STOP now, not a problem — a pooled stop has two
         and the map cannot know which one a student will get. */
      var below = st.at[1] > 400;
      var noteTxt = open ? st.note : 'track being laid';

      /* A PLATE UNDER EVERY STOP LABEL — the user's call, 2026-08-16: the note
         line was unreadable where it crossed the track.

         These labels are the only text on the island that lands wherever the
         circuit put its stop, so what sits behind them is whatever happens to
         be there — rails, a river, forest, coast. The name is 11px bold and
         mostly survived it; the note is 9.5px in `--ink-muted` and did not.
         Everything else on this map either sits in cleared ground (the title,
         LIGHTHOUSE HUB) or is deliberately faint (Lake Transfer, in italic on
         open water).

         SIZED FROM MEASURED TEXT, NOT FROM A GUESS. `labelWidth` measures the
         real string in the real font, so a plate cannot come out too narrow for
         the words it is backing — the failure that would be invisible on the
         four stops whose notes are short and obvious on the one whose are not.

         DRAWN BEFORE THE MARKER, so it passes UNDER it. A label plate is
         backing for text and has no business in front of the thing it labels:
         emitted after the marker it covered the top of every stop drawn with
         its label above — 8.5px of the round staffed discs and 19px of Marsh
         Halt's signpost, which is more than half that marker's height. Painting
         order is the whole fix; not one label moved. The alternative was to
         push the labels far enough clear to miss the tallest marker, which
         costs the association between a name and the stop it names.

         `pointer-events="none"` because the stop's hit area is the marker's
         own `<g>`; a plate that swallowed clicks would make the labels look
         pressable and do nothing. */
      var plateW = Math.max(labelWidth(st.name, 700, 11), labelWidth(noteTxt, 400, 9.5)) + 16;

      /* THE TWO MARKERS ARE NOT THE SAME HEIGHT, and a fixed offset cannot
         serve both. Measured off the rendered map: a staffed disc reaches
         13.5 above its centre; an unstaffed halt's signpost reaches 24, because
         the post stands up out of it. With one constant for both, Marsh Halt's
         note was drawn straight across its own signpost — which put a dark
         line immediately behind 9.5px text, in the one place this whole change
         exists to make readable.

         So the clearance comes from the marker's kind. Painting the plate
         under the marker (below) fixes what the plate covers; it does nothing
         about what the TEXT covers, since text is drawn last and must be. Only
         moving the label clear does that. */
      var clear = (st.kind === 'staffed' ? 17 : 28);
      var plateY = below ? st.at[1] + 21 : st.at[1] - clear - 34;

      s += '<rect x="' + (st.at[0] - plateW / 2).toFixed(1) + '" y="' + plateY.toFixed(1) + '" ' +
           'width="' + plateW.toFixed(1) + '" height="34" rx="6" pointer-events="none" ' +
           'fill="#FDF8F0" fill-opacity=".88" stroke="#C8B89A" stroke-opacity=".7" stroke-width="1"/>';

      /* `data-stop` carries the STOP, not a problem — a pooled stop has two and
         the map cannot know which one a student will get. */
      s += '<g' + (open ? ' data-stop="' + st.key + '" class="map-hit"' : ' opacity=".72"') + '>' +
           pairStop(st.at[0], st.at[1], st.kind === 'staffed', !!opts.reveal && open) +
           '</g>';

      /* Both baselines are DERIVED FROM THE PLATE rather than from the stop, so
         the box and the words it backs cannot drift apart when either moves. */
      s += '<text x="' + st.at[0] + '" y="' + (plateY + 13).toFixed(1) + '" text-anchor="middle" ' +
           'font-family="' + BODY + '" font-size="11" font-weight="700" fill="#2C2214">' + st.name + '</text>';
      s += '<text x="' + st.at[0] + '" y="' + (plateY + 26).toFixed(1) + '" text-anchor="middle" ' +
           'font-family="' + BODY + '" font-size="9.5" fill="#6B5138">' + noteTxt + '</text>';
    });

    /* --- the terminus --- */
    s += lighthouse(ISL_TERMINUS[0], ISL_TERMINUS[1]);
    s += '<text x="' + ISL_TERMINUS[0] + '" y="' + (ISL_TERMINUS[1] + 20) + '" text-anchor="middle" font-family="' + BODY +
         '" font-size="10" font-weight="700" letter-spacing="1.4" fill="#5A3E28">LIGHTHOUSE HUB</text>';

    /* FURNITURE IS NOT DRAWN HERE, and the mainland's split is the reason.
       `mapBody` holds the world and `railMap` adds the title, compass and key
       on top, precisely so the zoomed leg view inherits the world without the
       chrome. The island's first draft kept its title and compass inside this
       function; they happened to fall outside the frame for the one stop I
       tested, which is luck rather than design — a stop near the top-left
       would have put "Crossover Island" across the middle of a station's
       journey panel. Moved to `islandMap`, where it belongs. */

    islandBody.circuit = circuit;
    islandBody.cum = cum;
    islandBody.bridges = spans.length;
    return s;
  }

  function islandMap(counts) {
    counts = counts || {};
    var s = islandBody(counts, {});

    /* --- furniture, on top of the world and only on the wide map --- */
    s += compassRose(946, 610, 30);
    s += '<text x="52" y="60" font-family="' + DISPLAY + '" font-size="21" letter-spacing="1.5" fill="#2C2214" opacity=".8">' +
         'Crossover Island</text>';
    s += '<text x="52" y="82" font-family="' + BODY + '" font-size="11.5" font-weight="700" letter-spacing="2.6" fill="#A85413">' +
         'MR FRACTION&rsquo;S EXPRESS &middot; THE CHALLENGE LINE</text>';

    var openCount = ISL_STOPS.filter(function (st) { return stopIsOpen(st, counts); }).length;

    /* The built/being-laid sentence is DERIVED, exactly as the mainland's is.
       That one used to be a hardcoded string and silently became a lie to
       screen-reader users the moment a second line opened; this is the same
       trap with one problem built and four to come, so it is counted. */
    var openSay = !openCount
      ? 'No stop on the island is open yet; the whole circuit is still being laid.'
      : openCount === ISL_STOPS.length
        ? 'All five stops are open.'
        : openCount + ' of the ' + ISL_STOPS.length + ' stops ' + (openCount > 1 ? 'are' : 'is') +
          ' open; the rest of the circuit is still being laid.';

    var fig = document.createElement('figure');
    fig.className = 'map-figure';
    fig.style.margin = '0';
    fig.innerHTML =
      '<svg viewBox="0 0 ' + ISL_W + ' ' + ISL_H + '" xmlns="' + NS + '" role="img" aria-label="' +
      'Illustrated map of Crossover Island: a single island with a coast, mountains, forest, three rivers and a lake, ' +
      'ringed by one irregular circuit of railway that crosses the rivers on ' + islandBody.bridges + ' bridges. ' +
      'A steam train of an engine and three carriages stands on the circuit along the north of the island. ' +
      /* No longer "marked in two colours for the two situations": the marker
         does not say which two any more, and a description claiming it does
         would be the leak surviving in the one place nobody looks at it. */
      'Five stops sit round the loop, each drawn as a disc split down the middle because every problem here ' +
      'joins two situations. Three are staffed platforms, drawn filled, where the join is taught; ' +
      'two are unstaffed halts, drawn open with a signpost, where you work it out yourself. ' +
      'A lighthouse on the north-east headland is the hub. ' + openSay +
      ' The same stops are listed as buttons below.">' +
      s + '</svg>';
    return fig;
  }

  /* ---------- The island leg view: a zoom on the stop you are riding ----------

     Not a second island. The SAME world with a tighter viewBox, exactly as
     `legMap` is the same mainland — so the coast, rivers, bridges and forest
     around this stop are the ones already drawn and verified, not a fresh set
     re-derived by a second renderer.

     WHY THE ISLAND NEEDED ITS OWN. Until now a paired problem's journey panel
     called `legMap` with `p.line`, so a student standing on Crossover Island
     was shown a zoomed fragment of the MAINLAND Compare Line. Wrong place, and
     the fragment's own geometry was the residual tell recorded in stations.js:
     the shape of that curve is the first half of the answer to anyone who has
     ridden the line before.

     The train is brought to the stop rather than left where the wide map puts
     it, because the panel's job is "where am I" — and `progress` walks it in
     as the student moves through the phases, which is what `legMap` does with
     its own leg. */
  function islandLeg(stopId, progress, cars) {
    /* MATCHED ON A STOP KEY, and it takes either a stop key or a problem id so
       that a caller holding one of a pooled stop's problems still frames the
       right place. Problem ids were the only handle before stops could hold
       two; the station knows its problem, not its stop.

       Falling back to stop 0 on no match would put the panel somewhere
       plausible and wrong, which is the failure that hides. A caller asking for
       a stop this map does not have is a programming error, so it says so and
       draws nothing. (This rule was earned: while every unbuilt stop carried a
       null id, `st.id === stopId` matched all of them at once and four stops
       framed the same corner of the island.) */
    var here = null;
    ISL_STOPS.forEach(function (st) {
      if (st.key === stopId || st.ids.indexOf(stopId) >= 0) here = st;
    });
    if (!here) return '';

    /* Draw the world once to get the circuit and its arc table, then find how
       far round the loop this stop sits. Measured off the geometry rather than
       authored beside it: a stop that moves takes its own frame with it. */
    islandBody({}, {});
    var pts = islandBody.circuit.pts, cum = islandBody.cum;
    var total = cum[cum.length - 1];
    var dStop = 0, best = 1e9;
    for (var d = 0; d <= total; d += 3) {
      var q = atDist(pts, cum, d);
      var dx = q.x - here.at[0], dy = q.y - here.at[1], m = dx * dx + dy * dy;
      if (m < best) { best = m; dStop = d; }
    }

    /* The train approaches the platform and stops short of it. Arriving ON the
       marker hides the thing the panel exists to point at — which is exactly
       how the wide map's first train ended up parked on Fell Crossing. */
    var lead = 34 + (1 - Math.max(0, Math.min(1, progress))) * 78;
    var dEngine = dStop - lead;

    /* REAL COUNTS, NOT `{}`. This passed an empty published-map, so
       `stopIsOpen` was false for every stop and the zoomed panel labelled all
       five "track being laid" — on a station screen, inside a ride the student
       is currently taking, at a stop that is plainly open because they are
       standing on it. Found by riding it; nothing in the sweep looks at label
       text on the journey panel. The wide map was always right because
       `renderIsland` hands it the real thing. */
    var counts = {};
    if (global.MF && MF.pairedProblems) {
      MF.pairedProblems().forEach(function (p) { counts[p.id] = true; });
    }
    var s = islandBody(counts, { trainAt: ((dEngine % total) + total) % total / total });
    // Ring the stop being ridden, the way legMap rings its destination.
    s += '<circle cx="' + here.at[0] + '" cy="' + here.at[1] + '" r="17" fill="none" ' +
         'stroke="var(--ink)" stroke-width="3.5" opacity=".85"/>';

    var tail = atDist(pts, cum, consistOnPath.tailDist);
    var xs = [here.at[0], tail.x, atDist(pts, cum, dEngine).x];
    var ys = [here.at[1], tail.y, atDist(pts, cum, dEngine).y];
    var padX = 86, padY = 68;
    var x1 = Math.min.apply(null, xs) - padX, x2 = Math.max.apply(null, xs) + padX;
    var y1 = Math.min.apply(null, ys) - padY, y2 = Math.max.apply(null, ys) + padY;
    var vw = x2 - x1, vh = y2 - y1;
    // The same letterbox the mainland leg uses, so the two panels are one shape.
    if (vw / vh < 2.6) { var need = vh * 2.6; x1 -= (need - vw) / 2; vw = need; }
    else { var needH = vw / 2.6; y1 -= (needH - vh) / 2; vh = needH; }
    // And kept inside the world, or the frame shows sea where the island ends.
    vw = Math.min(vw, ISL_W); vh = Math.min(vh, ISL_H);
    x1 = Math.max(0, Math.min(ISL_W - vw, x1));
    y1 = Math.max(0, Math.min(ISL_H - vh, y1));

    return '<svg class="leg-svg" viewBox="' + x1.toFixed(0) + ' ' + y1.toFixed(0) + ' ' +
           vw.toFixed(0) + ' ' + vh.toFixed(0) + '" xmlns="' + NS + '" aria-hidden="true">' + s + '</svg>';
  }

  global.Scenery = {
    art: art,
    ambient: ambient,
    railMap: railMap,
    islandMap: islandMap,
    islandLeg: islandLeg,
    /* Exported so the view can build its button list from the SAME array the
       map draws. Two copies of the stop list is how the map and the buttons
       below it come to disagree about what exists. */
    islandStops: function () { return ISL_STOPS.slice(); },
    legMap: legMap,
    stopsOn: function (line) { return (STOPS[line] || []).length; },
    ticker: ticker,
    wheelSVG: wheelSVG,
    locomotive: locomotive
  };
})(window);
