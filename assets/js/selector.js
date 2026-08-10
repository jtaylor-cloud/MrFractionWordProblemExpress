/* ============================================================
   Trip generation.

   Randomizes by TYPE, not just numbers (JOURNEY-ARCHITECTURE §4):
     - no two stations in a trip share an unknownCar
     - no two stations in a trip share a context
     - the Hub problem uses an unknown position AND context not
       seen anywhere in the trip
     - a station's ROLE biases which problem it gets, but does not
       gate it, so a line does not serve the same trip every ride

   WHICH SIDE YIELDS ON HUB NOVELTY — CHANGED, DELIBERATELY.
   This once read: "if no novel Hub problem exists, the trip runs
   WITHOUT a Hub and says so." That held while each station had one
   eligible problem. Once stations could draw freely they consumed the
   Hub's pool, and 91 of 300 Part–Whole trips ended with no Hub —
   removing the trip's only unaided assessment, which is far worse
   than a Hub that happens to share a context with one station.

   So the Hub is now reserved FIRST and the stations work around it.
   The novelty rule is unchanged in intent and holds on the large
   majority of trips (measured: 400/400 on Ratio and mixed rides,
   385/400 on a Part–Whole Local); when the bank is too thin for both,
   it is the novelty that gives, not the assessment.
   ============================================================ */
(function (global) {
  'use strict';

  var ORDER = ['reading', 'drafting', 'estimation', 'switchyard', 'signalbox'];
  var ROUTE_STOPS = { local: 5, express: 4, limited: 3 };

  /* Small seeded PRNG so a reload mid-trip gives the SAME trip. */
  /* SCRAMBLE THE SEED BEFORE DRAWING FROM IT.
     A raw xorshift32 seeded with a small integer emits a near-linear ramp:
     seeds 1, 2, 3 gave first draws of 0.000063, 0.000126, 0.000189, and ALL
     of seeds 1–300 drew below 0.5. Every two-way shuffle therefore resolved
     the same way, and `pw-soup-serving` — one of only two problems that can
     fill the Reading Room — became unreachable across 300 consecutive seeds
     while its rival won 300/300.

     Only large Date.now()-shaped seeds hid this, which is what the code had
     always passed. It surfaced the moment a reproducible seed was used, which
     is exactly when a generator most needs to be sound. The `>> 17` was also
     a sign-propagating shift; xorshift32 wants `>>>`. */
  function makeRng(seed) {
    var s = (seed >>> 0) || 1;
    s ^= 0x9E3779B9;
    s = Math.imul(s ^ (s >>> 16), 0x85EBCA6B) >>> 0;
    s = Math.imul(s ^ (s >>> 13), 0xC2B2AE35) >>> 0;
    s = (s ^ (s >>> 16)) >>> 0;
    if (!s) s = 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /**
   * Build a trip.
   * @returns {{line, route, stations:[{role, problem}], hub, seed, notes:[]}}
   */
  /* How many stops a ride has.
     The three named routes are presets, not a limit — `route` may also be a
     number, so a ride can be any length the bank can actually fill. Past five
     the role sequence cycles: a longer trip revisits a strategy with a
     different problem, which is the point of a longer trip. */
  var MIN_STOPS = 2, MAX_STOPS = 8;

  /* How much more likely a station is to draw a problem written FOR it.
     A weight, not a probability — and the difference matters.

     This was first written as a coin flip: honour the role 60% of the time,
     otherwise draw freely. That reads as reasonable and is not, because most
     roles are declared by exactly ONE problem. Honouring the role then does
     not choose among candidates, it pins the stop: `pw-soup-serving` is the
     only Part–Whole problem tagged `reading`, and reading is always stop one,
     so it opened roughly two trips in three. The user saw it every time.

     Weighting fixes that without a special case: a declared problem goes into
     the bag twice, everything else once, so a sole declarer is favoured but
     never guaranteed, while a role with several declarers still prefers them
     collectively.

     Tuned by measuring the DISTRIBUTION of first stops, not the count of
     distinct ones — the count said "7 different problems open the trip" and
     was true and useless, because one of them opened two trips in three.
     At weight 3 the sole `reading` declarer still took 40% of first stops;
     at 2 it takes about 29%, with no problem dominating. Set this to 1 to
     drop the preference entirely and draw flat. */
  var ROLE_WEIGHT = 2;

  function stopsFor(route) {
    /* A NUMBER is always honoured and clamped — including 0 and 1, which the
       stops input can produce and which must land on MIN_STOPS rather than
       falling through to the default. Only a missing or unknown route NAME
       defaults to five. */
    if (typeof route === 'number' && isFinite(route))
      return Math.max(MIN_STOPS, Math.min(MAX_STOPS, Math.round(route)));
    var n = ROUTE_STOPS[route] || 5;
    return Math.max(MIN_STOPS, Math.min(MAX_STOPS, n));
  }

  function rolesFor(stops) {
    // Shorter than the full set: drop from the middle, keeping the Reading
    // Room first and the Signal Box last.
    if (stops <= ORDER.length) {
      var roles = ORDER.slice();
      /* Drop from the middle — but never the last entry. Plain `splice(2,1)`
         was safe only while the shortest route was three stops: at length 3
         index 2 IS the Signal Box, so a two-stop ride silently ended at the
         Drafting Table instead. Clamp to the second-from-last slot. */
      while (roles.length > stops) roles.splice(Math.min(2, roles.length - 2), 1);
      return roles;
    }
    // Longer: keep Reading first and Signal Box last, cycling the middle.
    var out = [ORDER[0]], mid = ORDER.slice(1, ORDER.length - 1);
    for (var i = 0; out.length < stops - 1; i++) out.push(mid[i % mid.length]);
    out.push(ORDER[ORDER.length - 1]);
    return out;
  }

  /**
   * Build a trip.
   * @param {string} line  a line key, or MF.MIXED for a ride across all lines
   * @param {string|number} route  'local'|'express'|'limited', or a stop count
   */
  function buildTrip(line, route, seed) {
    seed = seed || (Date.now() & 0x7fffffff);
    var rng = makeRng(seed);
    var notes = [];
    var mixed = (line === MF.MIXED);
    /* The percent route draws on `surface`, which is the whole point of it —
       the pool is spread across several schemas and the student is not told
       which. Its stops are chosen exactly like a themed line's otherwise; the
       LINE-alternation rule below stays mixed-only, because this pool is small
       and a constraint that admits almost nothing costs variety without buying
       anything (VERIFICATION.md §21). */
    var percent = (line === MF.PERCENT);

    var pool = MF.publishedProblems().filter(function (p) {
      return mixed ? true : percent ? p.surface === 'percent' : p.line === line;
    });

    var roles = rolesFor(stopsFor(route));

    /* On a mixed ride the LINE becomes a randomization axis of its own: two
       consecutive stops on the same schema would quietly turn a Grand Tour
       back into a themed trip, and the whole value of the mode is that the
       student cannot predict which situation is coming. */
    var used = { unknown: {}, context: {}, id: {}, line: {} };
    var stations = [], prevLine = null;

    /* RESERVE THE HUB FIRST.
       It used to be chosen last, from whatever the five stations had left.
       That was survivable while each station had exactly one eligible problem;
       the moment stations could draw freely, they ate the Hub's pool and
       **91 of 300 Part–Whole trips ended with no Hub at all** — losing the one
       unaided assessment on the trip, which is the point of the trip.

       Reserving it first guarantees a Hub whenever the line has one. The
       novelty rule still holds, just from the other direction: the stations
       now work around the Hub's unknown car and context instead of the Hub
       hunting for a gap the stations left. Its LINE is deliberately not
       reserved — that would over-constrain a mixed ride for no gain. */
    /* Which Hub problem to reserve depends on how much slack the line has.
       The Ratio & Rate Rail holds six problems, one of which (`rr-cordial-mix`)
       opts out of stations entirely. A five-stop Local therefore fits only one
       way round: Hub takes the non-stationable problem, stations take the other
       five. Reserve any other and a station goes unfilled — which is what
       happened, silently, as soon as the Hub was reserved first.

       So: when the line is TIGHT, prefer a Hub that costs no station slot.
       When it has slack — Part–Whole, a mixed ride, or any shorter route —
       take any eligible problem, because Hub variety is worth having too. */
    var hubPool = pool.filter(function (p) { return p.hubEligible; });
    var stationableCount = pool.filter(function (p) { return (p.stationRoles || []).length; }).length;
    var tight = (stationableCount - 1) < roles.length;
    var hub =
      (tight ? pick(hubPool.filter(function (p) { return !(p.stationRoles || []).length; }), function () { return true; }, rng) : null) ||
      pick(hubPool, function () { return true; }, rng);
    if (hub) {
      used.id[hub.id] = 1;
      used.unknown[hub.unknownCar] = 1;
      used.context[hub.context] = 1;
    } else {
      notes.push('NO_HUB');
    }

    roles.forEach(function (role) {
      /* THE ROLE IS A BIAS, NOT A GATE.
         It used to be a hard filter, and since most problems declare exactly
         one role, each station had exactly one candidate: the Ratio & Rate
         Rail served the identical five problems in the identical order on
         every seed, and Part–Whole managed three variations. A student
         re-riding a line saw nothing new.

         Loosening it is safe because a station's role does not change what
         the station does. `stations.js` reads it once, to look up the stop's
         name and strategy line; every station runs all three reads, the
         Ticket Booth, Plan, Solve and Look Back whichever role it carries.
         (The file header claims the role "decides which phase carries the
         teaching" — that was never built. Noted, not relied on.)

         So a station prefers a problem authored FOR it, most of the time, and
         otherwise takes any problem the line can spare. What it will never do
         is use a problem whose `stationRoles` is empty: that is an explicit
         authorial opt-out — `rr-cordial-mix` is reserved as a Hub problem —
         and honouring it is also what keeps a Hub problem in reserve. */
      var fits = pool.filter(function (p) {
        return !used.id[p.id] && (p.stationRoles || []).length;
      });

      /* Preference order enforces the randomization constraints, and degrades
         in the documented priority when the bank is thin.

         The mixed-only tier spreads a trip across as many schemas as it can,
         which is the right goal once five lines are running. With only two it
         binds for the first two stops and then falls through, leaving some
         clumping — 37.5% of adjacent stops share a line, against 50% for a
         blind draw.

         A STRICTER RULE WAS TRIED AND REJECTED. Adding tiers that forbade a
         stop matching the one before it produced perfect alternation and 0%
         adjacency — and cut distinct trip line-ups from 20 to 4 across 300
         seeds, because with two lines the constraint admits almost nothing.
         Variety is the requirement here; tidy alternation is not. Do not
         reintroduce it without re-measuring line-up count. */
      var best =
        (mixed ? pickForRole(fits, function (p) {
          return !used.unknown[p.unknownCar] && !used.context[p.context] && !used.line[p.line];
        }, rng, role) : null) ||
        pickForRole(fits, function (p) { return !used.unknown[p.unknownCar] && !used.context[p.context]; }, rng, role) ||
        pickForRole(fits, function (p) { return !used.unknown[p.unknownCar]; }, rng, role) ||
        pickForRole(fits, function () { return true; }, rng, role);

      if (!best) {
        notes.push('No problem available for ' + MF.STATIONS[role].name + ' — station skipped.');
        return;
      }
      if (used.context[best.context]) notes.push('Repeated context at ' + MF.STATIONS[role].name + '.');

      used.id[best.id] = 1;
      used.unknown[best.unknownCar] = 1;
      used.context[best.context] = 1;
      used.line[best.line] = 1;
      prevLine = best.line;
      /* Pick the number set here, from the trip's own rng, so the same seed
         reproduces the same trip down to the values on the page. Everything
         downstream reads the materialised object and never the manifest. */
      stations.push({ role: role, problem: MF.materialize(best, Math.floor(rng() * MF.setCount(best))) });
    });

    if (hub) hub = MF.materialize(hub, Math.floor(rng() * MF.setCount(hub)));

    return { line: line, route: route, stations: stations, hub: hub, seed: seed, notes: notes };
  }

  function pick(list, test, rng) {
    var ok = list.filter(test);
    if (!ok.length) return null;
    return shuffle(ok, rng)[0];
  }

  /** Like pick, but a problem written for this station counts ROLE_WEIGHT times. */
  function pickForRole(list, test, rng, role) {
    var ok = list.filter(test);
    if (!ok.length) return null;
    var bag = [];
    ok.forEach(function (p) {
      var n = (p.stationRoles || []).indexOf(role) !== -1 ? ROLE_WEIGHT : 1;
      while (n--) bag.push(p);
    });
    return bag[Math.floor(rng() * bag.length)] || ok[0];
  }

  /** Which lines currently have enough published content to ride? */
  function availableLines() {
    var counts = {};
    MF.publishedProblems().forEach(function (p) {
      counts[p.line] = (counts[p.line] || 0) + 1;
    });
    return counts;
  }

  /* How many stops this ride can actually FILL.
     `buildTrip` degrades honestly when the bank runs out — it skips the
     station and records a note — but nothing in the UI reads `trip.notes`, so
     a student asking the Ratio line for seven stops was quietly given five.
     Asking capacity up front means the request never exceeds it. Probed over
     several seeds because which problems fit is itself randomised. */
  function capacityFor(line) {
    var best = 0;
    for (var s = 1; s <= 6; s++)
      best = Math.max(best, buildTrip(line, MAX_STOPS, s * 7919 + 13).stations.length);
    return Math.max(MIN_STOPS, best);
  }

  /** Can a mixed ride actually be built? It needs more than one line running. */
  function mixedAvailable() {
    var counts = availableLines();
    return Object.keys(counts).filter(function (k) { return counts[k] >= 3; }).length >= 2;
  }

  /* A line lights at THREE problems, and this route opens at two — deliberately
     a different threshold, because the two are answering different questions.

     Three is what a schema needs before it can honestly claim to teach a
     situation: one problem is an example, two is a pair, three is a pattern.
     The percent route makes no such claim. Its pitch is that the same surface
     sits on top of DIFFERENT structures, and the smallest thing that can
     demonstrate that is two problems on two different lines — which is exactly
     what exists today (`cp-hot-drinks` is a Compare, `ch-barrier-count` is a
     Change). One problem could not: a single stop teaches "percent problems are
     Compare problems", which is the keyword strategy this whole surface was
     designed to refute. So the threshold is two problems AND two lines. */
  function percentAvailable() {
    var ps = MF.percentProblems();
    var lines = {};
    ps.forEach(function (p) { lines[p.line] = 1; });
    return ps.length >= 2 && Object.keys(lines).length >= 2;
  }

  global.Selector = {
    buildTrip: buildTrip,
    availableLines: availableLines,
    mixedAvailable: mixedAvailable,
    percentAvailable: percentAvailable,
    capacityFor: capacityFor,
    stopsFor: stopsFor,
    rolesFor: rolesFor,
    ORDER: ORDER,
    ROUTE_STOPS: ROUTE_STOPS,
    MIN_STOPS: MIN_STOPS,
    MAX_STOPS: MAX_STOPS
  };
})(window);
