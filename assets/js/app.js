/* ============================================================
   App shell. Single page by design: the whole journey happens
   here so accessibility preferences survive the entire session
   without any storage at all.
   ============================================================ */
(function (global) {
  'use strict';

  var esc = Stations.esc, msg = Stations.msg;
  var view, routeNav, routeMap;
  /* `tripDone` distinguishes "no trip" from "a trip that has finished", and the
     distinction is what lets the map be non-destructive (see renderMap). It
     cannot be done by nulling `trip` at the end, because the report's "Same
     line, the Local" button reads `trip.line` after the trip is over. */
  var trip = null, stationIdx = 0, current = null, metrics = null, tripDone = false;

  function newMetrics() {
    return { schemaFirstTry: 0, schemaAttempts: [], estimates: [], hints: [],
             misconceptions: [], selfChecks: 0, stationsDone: 0,
             hubStrategyOk: null, hubSchemaFirstTry: null, hubCorrect: null,
             hubCarFirstTry: null };
  }

  function setView(node) {
    view.innerHTML = '';
    view.appendChild(node);
    document.getElementById('main').focus();
    window.scrollTo(0, 0);
    /* Everything Mr Fraction queued while this view's html was being built now
       goes to the floating companion. It has to run AFTER the node is in the
       document: the companion sits outside `view` and would otherwise be
       showing commentary for a screen that is not on the page yet. */
    if (global.Companion) Companion.flush();
  }

  function html(s) { var d = document.createElement('div'); d.innerHTML = s; return d.firstElementChild; }

  /* ---------- The Map ---------- */

  /* LOOKING AT THE MAP IS NOT LEAVING THE TRIP.

     This function used to open with `trip = null`, and the Map pill in the top
     bar calls it directly — so one tap, anywhere inside a station, silently
     destroyed the ride with no confirmation and no way back. The student agent
     called it a blocker in the Cycle 15 review and it has sat here since.

     It was also making the map's own copy false: the Learning Hubs are
     advertised as somewhere to "drop in whenever you want a refresher — before
     a trip, DURING one, or just because", and every hub is reached through this
     screen. Following that invitation cost you the trip.

     The map is this site's orientation device. Pressing it almost always means
     "where am I?", never "throw this away". So it is non-destructive now: a
     trip in progress survives being looked away from, and the map offers it
     back. Abandoning is still possible — it is choosing a different line, which
     is a deliberate second act with the resume banner sitting right above it. */
  function renderMap() {
    routeNav.hidden = true;
    document.getElementById('sign-sub').textContent = 'All lines running';

    var counts = Selector.availableLines();

    /* THE FIVE COME FIRST, IN A FIXED ORDER, AND ON ONE ROW.

       Everything used to be one undifferentiated grid of six or seven cards, so
       the map's most important claim — that there are FIVE situations and
       everything else is a way of travelling across them — was something a
       student had to already know in order to see. The Grand Tour and the
       Percent Line each said "not one of the five" in their own blurb, which is
       a caption doing a layout's job.

       Two groups now, and the grouping carries the meaning: the five on a
       single row, then the specials underneath. `SITUATION_ORDER` is authored
       rather than taken from `Object.keys(MF.LINES)`, because that object's
       order is an implementation detail — it is the order the lines happened to
       be declared in — and this is a teaching sequence. */
    var SITUATION_ORDER = ['compare', 'groups', 'ratio', 'change', 'partwhole'];

    /* Every line in `MF.LINES` must appear in the row, or a schema would be
       silently missing from the map — dead content raising no alarm, which is
       VERIFICATION.md §8 and has cost this project a problem that was
       unreachable for forty trips. Discovered against the registry rather than
       trusted, so adding a sixth schema breaks loudly here instead of quietly
       vanishing. */
    var ordered = SITUATION_ORDER.filter(function (k) { return MF.LINES[k]; });
    Object.keys(MF.LINES).forEach(function (k) {
      if (ordered.indexOf(k) === -1) ordered.push(k);
    });

    var lines = ordered.map(function (k) {
      var L = MF.LINES[k], n = counts[k] || 0, ready = n >= 3;
      // Explicit aria-label: these buttons hold several pieces of text, and a
      // name assembled from all of them reads as noise. Say the useful part.
      var label = ready
        ? L.name + '. ' + L.desc + ' ' + n + ' problems, ready to ride.'
        : L.name + '. ' + L.desc + ' No trips available yet.';
      /* A ticket beside every line, because choosing a line IS buying a ticket.
         It is tinted to the line's own colour so five identical tickets do not
         read as five copies of one thing — see `.line-ticket` in the CSS. */
      return '<li><button class="line-card" type="button" data-line="' + k + '"' +
        (ready ? '' : ' disabled') +
        ' aria-label="' + esc(label) + '"' +
        ' style="border-left-color:var(--line-' + k + ')">' +
        '<img class="line-ticket" src="assets/art/Mr_Fraction_Train_Ticket.png" alt="" ' +
          'aria-hidden="true" loading="lazy" decoding="async">' +
        '<span class="line-name"><span aria-hidden="true" style="color:var(--line-' + k + ')">' +
          L.marker + '</span>' + esc(L.name) + '</span>' +
        '<span class="line-form">' + esc(L.form) + '</span>' +
        '<span class="line-desc">' + esc(L.desc) + '</span>' +
        (ready ? '<span class="badge">' + n + ' problems &middot; ready to ride</span>'
               : '<span class="soon">Track still being laid &mdash; no trips yet.</span>') +
        '</button></li>';
    }).join('');

    /* ---------- the specials ----------
       Ways of TRAVELLING, not places. They build into their own list so the row
       above stays exactly five. */
    var special = '';

    /* The Grand Tour sits with the lines but is not one of them — it only
       exists once two lines are running, because a "mixed" ride across a
       single available schema is just that schema with extra wording. */
    if (Selector.mixedAvailable()) {
      var MX = MF.rideInfo(MF.MIXED), total = MF.publishedProblems().length;
      special += '<li><button class="line-card line-card-mixed" type="button" data-line="' + MF.MIXED + '"' +
        ' aria-label="' + esc(MX.name + '. ' + MX.desc + ' ' + total + ' problems across every running line.') + '">' +
        /* The Grand Tour is a line card too, and it was the only one without a
           ticket — five cards carrying one and a sixth conspicuously bare. */
        '<img class="line-ticket" src="assets/art/Mr_Fraction_Train_Ticket.png" alt="" ' +
          'aria-hidden="true" loading="lazy" decoding="async">' +
        '<span class="line-name"><span aria-hidden="true">' + MX.marker + '</span>' + esc(MX.name) + '</span>' +
        '<span class="line-form">' + esc(MX.form) + '</span>' +
        '<span class="line-desc">' + esc(MX.desc) + '</span>' +
        '<span class="badge">' + total + ' problems &middot; every running line</span>' +
        '</button></li>';
    }

    /* The percent card. It sits with the lines and is not one of them, exactly
       as the Grand Tour does — and its own blurb says so, because the card is
       the first place a student meets the idea that percent is a way of writing
       a number rather than a thing that happens in a story.

       This is the map presence ROADMAP §3 approved and the half of the hybrid
       that was never built. The other half — the Ticket Booth asking which line
       is hiding underneath — is what makes arriving here the start of a
       question instead of the end of one. Without it, "it has a % sign so it
       goes here" would never be falsified, which is a keyword strategy with
       extra steps and the one risk §3 flagged as serious. */
    if (Selector.percentAvailable()) {
      var PC = MF.rideInfo(MF.PERCENT), pcount = MF.percentProblems().length;
      var plines = {};
      MF.percentProblems().forEach(function (p) { plines[p.line] = 1; });
      special += '<li><button class="line-card line-card-percent" type="button" data-line="' + MF.PERCENT + '"' +
        ' aria-label="' + esc(PC.name + '. ' + PC.desc + ' ' + pcount + ' problems, hiding ' +
          Object.keys(plines).length + ' different situations.') + '"' +
        ' style="border-left-color:var(--line-percent)">' +
        '<img class="line-ticket" src="assets/art/Mr_Fraction_Train_Ticket.png" alt="" ' +
          'aria-hidden="true" loading="lazy" decoding="async">' +
        '<span class="line-name"><span aria-hidden="true" style="color:var(--line-percent)">' +
          PC.marker + '</span>' + esc(PC.name) + '</span>' +
        '<span class="line-form">' + esc(PC.form) + '</span>' +
        '<span class="line-desc">' + esc(PC.desc) + '</span>' +
        /* The count of SITUATIONS underneath is derived, never authored — it is
           the one number on this card that makes its own point, and an authored
           copy would go stale the moment a percent problem is added to a new
           line (VERIFICATION.md §33). */
        '<span class="badge">' + pcount + ' problems &middot; ' + Object.keys(plines).length +
          ' different situations underneath</span>' +
        '</button></li>';
    }

    /* THE CHALLENGE LINE — announced, not built. `ROADMAP.md` item 6.

       IT CARRIES NO `data-line`, AND THAT IS THE POINT RATHER THAN AN
       OVERSIGHT. `disabled` is the reason it cannot be pressed; having no
       route key is the reason it could not go anywhere even if something got
       past that. The map's click handler reads `[data-line]` and hands the
       value straight to `chooseRoute`, which would call `MF.rideInfo` on a key
       that does not exist and throw — so the inert card is inert by
       CONSTRUCTION, not merely by a flag one refactor could drop.

       Showing an unbuilt line at all is a deliberate call and worth stating.
       The five and the specials are what this railway IS; a student who can see
       that something is coming knows the map is not finished, which is more
       honest than a map that pretends it is. It says "under construction" in
       the same `.soon` pill a line with too few problems uses, so the vocabulary
       for "not yet" is already one a student has met. */
    /* THE CHALLENGE LINE IS OPEN, and it does not go to `chooseRoute`.
       It used to be inert by CONSTRUCTION — no `data-line`, so the map's
       handler could not route it even if `disabled` were dropped. That is now
       deliberately reversed: `data-island` is its own attribute and its own
       handler, because the island is not a line and must never be handed to
       `chooseRoute`. There is no Local/Express/Limited here — the island is
       open, any stop, any order (user, 2026-08-15) — so the map IS the route
       screen and the ticket window has nothing to ask.

       Counted, never claimed. `MF.pairedProblems()` is the same source the
       island map draws from, so the card cannot advertise stops the island
       does not have. With one problem built it says so. */
    /* COUNT OPEN STOPS, NOT PAIRED PROBLEMS. This read
       `MF.pairedProblems().length` against the number of stops, which was the
       same number until pool content existed — and then problems 6 and 7 were
       written with no stop pointing at them and the card said "7 of 5 stops
       open". A count of one thing measured against a total of another is only
       ever right by coincidence. A stop is open when it names a problem that
       is published, which is the same test the island map itself uses. */
    var open = {};
    MF.pairedProblems().forEach(function (p) { open[p.id] = true; });
    var isleTotal = Scenery.islandStops().length;
    /* A stop is open when ANY problem in its pool is published — the same test
       the map uses, restated here rather than shared only because this file
       cannot see `stopIsOpen`. If a third place ever needs it, export it. */
    var isle = Scenery.islandStops().filter(function (s) {
      return s.ids.some(function (id) { return !!open[id]; });
    }).length;
    special += '<li><button class="line-card line-card-challenge" type="button" data-island="1" ' +
      'aria-label="The Challenge Line, on Crossover Island. ' +
      'Every stop joins two of the five situations together. ' +
      isle + ' of ' + isleTotal + ' stops open. Opens the island map.">' +
      /* THE SEVENTH CARD WAS THE ONE WITHOUT A TICKET, and the comment on the
         Grand Tour card forty lines up says exactly this happened there once
         already: "the only one without a ticket — five cards carrying one and
         a sixth conspicuously bare." The Challenge Line shipped the same way
         and it read as an unfinished card sitting among six finished ones.

         The grid was never the problem — `.map-lines .line-card .line-ticket`
         has held a column for it since the cards were laid out — so this is
         the missing element, not a missing rule. The island is not a line and
         takes no line colour, but it does sell a ticket like everywhere else. */
      '<img class="line-ticket" src="assets/art/Mr_Fraction_Train_Ticket.png" alt="" ' +
        'aria-hidden="true" loading="lazy" decoding="async">' +
      /* ✦, not ◆◆ — the first draft doubled the Ratio Rail's marker, which on a
         map whose markers are how a line is identified reads as "two of those"
         rather than as a line of its own. Every marker on this map is unique
         and this one has to be too. */
      '<span class="line-name"><span aria-hidden="true">&#10022;</span>The Challenge Line</span>' +
      '<span class="line-form">Two situations, joined</span>' +
      '<span class="line-desc">Problems that need two of the five together, with the scaffolding fading as you go. Its own island, and one line all the way round it.</span>' +
      (isle
        ? '<span class="badge">' + isle + ' of ' + isleTotal + ' stops open &middot; Crossover Island</span>'
        : '<span class="soon">Track still being laid &mdash; the island opens with its first stop.</span>') +
      '</button></li>';

    var hubs = Object.keys(MF.hubs).map(function (k) {
      var h = MF.hubs[k];
      return '<li><button class="hub-card" type="button" data-hub="' + k + '"' +
        ' aria-label="' + esc(h.name + '. ' + h.blurb) + '">' +
        '<strong>' + esc(h.name) + '</strong>' +
        '<small>' + esc(h.blurb) + '</small></button></li>';
    }).join('');

    /* The way back. It names WHERE the trip is, not just that one exists —
       "a trip is in progress" is a fact about the software; "Stop 2 of 3 on the
       Change Line" is a fact about the student, and it is the one that makes
       the button obviously theirs to press. It also says plainly what choosing
       a line below would cost, because that is now the only way to lose a ride
       and it should never be a surprise. */
    var resumeBanner = '';
    if (trip && !tripDone) {
      var where = stationIdx >= trip.stations.length
        ? 'at the Terminus Hub'
        : 'at stop ' + (stationIdx + 1) + ' of ' + trip.stations.length;
      resumeBanner =
        '<div class="card resume-card">' +
          '<span class="eyebrow">Your trip is still running</span>' +
          '<h2>' + esc(MF.rideInfo(trip.line).name) + ' &mdash; ' + esc(where) + '</h2>' +
          '<p>Nothing has been lost. Pick up exactly where you left off, or carry on ' +
          'looking around &mdash; the hubs below are here for that.</p>' +
          '<div class="btn-row">' +
            '<button class="btn" id="resume" type="button">&larr; Back to your trip</button>' +
          '</div>' +
          '<p class="hint-text">Choosing a line below starts a new trip, and this one ends there.</p>' +
        '</div>';
    }

    var node = html(
      '<div>' +
      /* THE HERO — ported from the sister site's `.home-hero`, 2026-08-16.
         The map screen had no display-scale type at all: its biggest text was
         a 22.4px section heading, and once the offer strip landed at the foot
         of the page the three 32px numerals became the largest thing on the
         screen — the strongest focal point sitting at the very bottom, three
         thousand pixels down. The Factory does not have that problem because
         its home page OPENS at 52px. This is that opening.

         IT IS A `<p>`, NOT A HEADING, AND THAT IS DELIBERATE. The top bar
         already carries the site's `<h1>`, and this file records what happens
         when the same words are set as a heading twice a screen apart. A
         display-scale line repeating the page's identity is branding, not
         structure: an `h1` would give the page two, and an `h2` would sit
         above "The Five Situations" in the outline while saying less.

         THE COPY COLLIDES WITH NOTHING, which took some doing on a page this
         dense with short phrases — "Five situations", "The Five Situations",
         "Choose your route", "All lines running" and every ticker line are
         already on this screen. It asks the one question the map exists to
         answer, and states the no-gating decision in the student's own terms
         rather than as a policy. */
      '<div class="home-hero">' +
        '<p class="home-eyebrow"><span class="home-eyebrow-line"></span>Welcome aboard</p>' +
        '<p class="home-heading">Where are you <span class="home-heading-accent">going?</span></p>' +
        '<p class="home-intro">Five lines, one for each kind of word problem, and a few ways of ' +
        'travelling across them. Start anywhere you like &mdash; nothing on this railway is locked.</p>' +
      '</div>' +

      MrFraction.aside('steady',
        '<p>Afternoon &mdash; Mr Fraction, thirty years on these lines.</p>' +
        '<p>Tell me what&rsquo;s happening in a problem and I&rsquo;ll tell you which train to catch.</p>', 104) +
      resumeBanner +

      // Deliberately NOT in Mr Fraction's italic serif aside. This is the one
      // explanation the whole site rests on; it belongs in the plainest,
      // most readable type on the page.
      '<div class="card">' +
        '<span class="eyebrow">How this railway works</span>' +
        /* NOT "The Five Situations" — that is the heading over the line cards
           further down, and setting both to the same words put the identical
           <h2> on the page twice, a screen apart. This one introduces the idea;
           that one labels the buttons. */
        '<h2>Five situations</h2>' +
        '<p>Word problems look like there are thousands of different ones. There aren&rsquo;t. ' +
        'Nearly all of them describe one of <strong>five situations</strong> &mdash; five things that ' +
        'can happen to a set of amounts.</p>' +
        '<p>Each line on this map is one of those five. Work out which situation a problem is ' +
        'describing, and you already know most of what to do about it.</p>' +
        '<p>Harder problems join two lines together. They are still built out of these five.</p>' +
      '</div>' +

      /* The station is the hero: it is the place the whole metaphor is set, and
         it carries the "Word Express" sign, so it does the job the old text
         header was doing and does it faster. */
      '<figure class="art-hero">' + Scenery.art('Mr_Fraction_Train_Station.png', 'art-station') + '</figure>' +

      '<div class="map-hero" id="map-hero"></div>' +

      '<div class="section-head"><span class="eyebrow">Choose your route</span>' +
        '<h2>The Five Situations</h2><div class="rule"></div></div>' +
      '<p style="color:var(--ink-mid)">One line each. Nearly every word problem you will meet is one of ' +
      'these five &mdash; work out which, and you already know most of what to do about it.</p>' +
      /* `map-lines-five` is the row. The modifier is on the LIST rather than on
         the cards, because what is being said is about the group: these five go
         together and nothing else belongs among them. */
      '<ul class="map-lines map-lines-five">' + lines + '</ul>' +

      '<div class="section-head"><span class="eyebrow">Ways of travelling</span>' +
        '<h2>Special Lines</h2><div class="rule"></div></div>' +
      '<p style="color:var(--ink-mid)">Not situations of their own &mdash; each one is a way of travelling ' +
      'ACROSS the five above. Whatever you meet on these, it is still one of the five underneath.</p>' +
      '<ul class="map-lines map-lines-special">' + special + '</ul>' +

      '<div class="section-head"><span class="eyebrow">All change</span>' +
        '<h2>Learning Hubs</h2><div class="rule"></div></div>' +
      '<p style="color:var(--ink-mid)">Interchange stops. Drop in whenever you want a refresher on the ' +
      'basics behind a line &mdash; before a trip, during one, or just because.</p>' +
      '<ul class="hub-list">' + (hubs || '<li class="soon">Hubs opening soon.</li>') + '</ul>' +

      /* THE OFFER STRIP — the sister site's `.stats-strip`, ported 2026-08-16
         on the user's instruction. It closes the Factory's home page with
         three boxes saying what the place holds, in the fewest possible words,
         and this site had nothing of the kind: the map ends on a list of hubs
         and simply stops.

         CLASS NAMES ARE THE FACTORY'S, DELIBERATELY. `.stats-strip`,
         `.stat-item`, `.stat-value`, `.stat-label` — so anyone holding the two
         sites side by side can see that this is the same component rather than
         a lookalike, which is the whole point of a sister site.

         EVERY NUMBER IS DERIVED. VERIFICATION.md §33: an authored count goes
         stale the moment content is added, and this one would be wrong on the
         day somebody writes problem 38 — on the page whose job is to say how
         much there is. `MF.LINES` is the five situations and
         `MF.publishedProblems()` is the same source the Grand Tour counts
         from, so neither can drift from what the map above actually offers.

         The third box is a joke the Factory makes too, and it is kept because
         the two sites are meant to read as one family. */
      '<ul class="stats-strip">' +
        [{ value: Object.keys(MF.LINES).length, label: 'Situations' },
         { value: MF.publishedProblems().length, label: 'Word problems' },
         { value: 1, label: 'Mr Fraction' }].map(function (s) {
          return '<li class="stat-item">' +
                   '<span class="stat-value">' + esc(s.value) + '</span>' +
                   '<span class="stat-label">' + esc(s.label) + '</span>' +
                 '</li>';
        }).join('') +
      '</ul>' +
      '</div>');

    node.querySelector('#map-hero').appendChild(Scenery.railMap(counts));

    node.addEventListener('click', function (e) {
      if (e.target.closest('#resume')) { resumeTrip(); return; }
      /* Before [data-line], because the island card carries neither and must
         not fall through to a route chooser that would call MF.rideInfo on a
         key describing a place rather than a line. */
      if (e.target.closest('[data-island]')) { renderIsland(); return; }
      var l = e.target.closest('[data-line]');
      if (l && !l.disabled) { chooseRoute(l.getAttribute('data-line')); return; }
      var h = e.target.closest('[data-hub]');
      if (h) renderHub(h.getAttribute('data-hub'));
    });
    setView(node);
  }

  /* ---------- Crossover Island ----------

     THE MAP IS THE ROUTE SCREEN. Every other line goes map → route choice →
     first stop; the island goes map → stop, because it is open and there is no
     number of stops to choose. That is why this is its own view rather than a
     branch inside `chooseRoute`.

     A STOP IS A TRIP OF ONE. Nothing on the island is a multi-stop journey
     yet, and pretending otherwise would promise a circuit that four unbuilt
     problems cannot fill — the exact overpromise `routeChoices` was rewritten
     to stop making on the mainland. */
  function renderIsland() {
    var open = {}, built = 0;
    MF.pairedProblems().forEach(function (p) { open[p.id] = true; built++; });

    /* The buttons are built from the map's OWN stop list, so the two cannot
       disagree about what exists or about which stops are staffed. This is the
       list the map's aria-label promises is "below". */
    var stops = Scenery.islandStops().map(function (st) {
      var pool = st.ids.filter(function (id) { return !!open[id]; });
      var isOpen = pool.length > 0;
      var kindWord = st.kind === 'staffed' ? 'Staffed platform' : 'Unstaffed halt';
      var kindNote = st.kind === 'staffed'
        ? 'The crossover is taught here.'
        : 'No one on the platform. The five-situations checklist is the only thing to hand.';
      /* SAID OUT LOUD WHEN A STOP HOLDS MORE THAN ONE, because a student who
         rides Thorne Bridge twice and gets a different story deserves to know
         that is the stop working rather than the site being inconsistent. It
         does not say WHICH problems — that is the pairing, and naming it here
         would answer the Crossover Read before the student arrives. */
      var poolNote = pool.length > 1
        ? ' More than one problem stops here, so this is not the same ride twice.'
        : '';
      return '<li><button class="choice" type="button"' +
        (isOpen ? ' data-stop="' + esc(st.key) + '"' : ' disabled') +
        ' aria-label="' + esc(st.name + '. ' + kindWord + '. ' + kindNote + poolNote +
          (isOpen ? ' Open.' : ' Track still being laid.')) + '">' +
        '<span class="marker" aria-hidden="true">' + (st.kind === 'staffed' ? '&#9679;' : '&#9675;') + '</span>' +
        '<span><strong>' + esc(st.name) + '</strong>' +
        '<small>' + esc(kindWord + ' &mdash; ' + kindNote).replace('&amp;mdash;', '&mdash;') + '</small>' +
        (poolNote ? '<small>' + esc(poolNote.trim()) + '</small>' : '') +
        (isOpen ? '' : '<small>Track still being laid.</small>') +
        '</span></button></li>';
    }).join('');

    var node = html(
      '<div>' +
      MrFraction.aside('steady',
        '<p><strong>This is Crossover Island, and it is not one of the five.</strong> ' +
        'Every stop here joins two of them together &mdash; one situation, and then a different one, ' +
        'with a number handed between them.</p>' +
        /* Said before the map rather than after it, because it is the thing a
           student needs in order to read the map: the two colours on a stop
           are not decoration, they are what is waiting. */
        '<p>Each stop is marked in <strong>two colours</strong> for the two situations it joins. ' +
        'Ride them in any order you like &mdash; the three filled stops teach the join, and the two ' +
        'open ones leave it to you.</p>') +
      '<div class="island-hero" id="island-hero"></div>' +
      '<div class="section-head"><span class="eyebrow">Crossover Island</span>' +
        '<h2>Pick a stop</h2><div class="rule"></div></div>' +
      '<ul class="choices">' + stops + '</ul>' +
      /* THE LIGHTHOUSE IS ON THE MAP, SO IT HAS TO BE PRESSABLE FROM IT.
         It is drawn on the island as the hub and labelled LIGHTHOUSE HUB;
         without this it was a picture of a door. Rendered as a hub card, the
         same control the mainland map uses, so it is the same kind of thing in
         the same clothes — and it is listed among the stops rather than below
         them because on this map it IS one of the places you can go.

         Not gated and never framed as remedial: a locked decision, and worth
         restating here because a hub sitting on the island's own map is the
         easiest place on the site to accidentally imply "go here if the stops
         were too hard". The copy says what it teaches, not who should read
         it. */
      (MF.hubs['lighthouse']
        ? '<div class="section-head"><span class="eyebrow">All change</span>' +
            '<h2>The Lighthouse</h2><div class="rule"></div></div>' +
          '<p style="color:var(--ink-mid)">The island&rsquo;s hub, and it is open to anyone at any time &mdash; ' +
          'before a stop, during one, or instead of one.</p>' +
          '<ul class="hub-list"><li><button class="hub-card" type="button" data-hub="lighthouse" ' +
            'aria-label="' + esc(MF.hubs['lighthouse'].name + '. ' + MF.hubs['lighthouse'].blurb) + '">' +
            '<strong>' + esc(MF.hubs['lighthouse'].name) + '</strong>' +
            '<small>' + esc(MF.hubs['lighthouse'].blurb) + '</small></button></li></ul>'
        : '') +
      (built < Scenery.islandStops().length
        ? '<div class="msg msg-caution"><span class="ico" aria-hidden="true">&#9888;</span><p>' +
          '<strong>The island is still being built.</strong> ' + built + ' of ' +
          Scenery.islandStops().length + ' stops ' + (built === 1 ? 'is' : 'are') + ' open. ' +
          'The rest have their track laid on the map and nothing behind them yet.</p></div>'
        : '') +
      '<div class="btn-row"><button class="btn btn-secondary" data-back="1" type="button">&larr; Back to the map</button></div>' +
      '</div>');

    node.querySelector('#island-hero').appendChild(Scenery.islandMap(open));

    node.addEventListener('click', function (e) {
      if (e.target.closest('[data-back]')) { renderMap(); return; }
      var hb = e.target.closest('[data-hub]');
      if (hb) { renderHub(hb.getAttribute('data-hub')); return; }
      var s = e.target.closest('[data-stop]');
      if (s && !s.disabled) startIslandStop(s.getAttribute('data-stop'));
    });
    setView(node);
  }

  /* Put the student back where they were.

     `Station.render()` rebuilds its root and then calls `renderPhase()`, which
     reads `this.phase` off the instance — so the station comes back on the
     screen it was on rather than at the top. What does NOT survive is progress
     WITHIN a phase: a settled Plan model or a half-answered Test Track is
     rebuilt fresh, because that state lives in closures inside the phase
     renderers and nowhere else. Saying so plainly rather than implying the
     resume is perfect — it returns you to the screen, not to the click. */
  function resumeTrip() {
    if (!trip || tripDone) return;
    document.getElementById('sign-sub').textContent = trip.rideLabel || '';
    drawRoute();
    if (stationIdx >= trip.stations.length) { renderHubAssessment(); return; }
    setView(current.render());
    A11y.announce('Back on your trip. ' + MF.STATIONS[trip.stations[stationIdx].role].name + '.');
  }

  /* ---------- Route choice ---------- */

  /* THE NAMED ROUTES MUST NOT PROMISE STOPS THE LINE CANNOT FILL.

     Local/Express/Limited were hardcoded at 5/4/3. That was true of every line
     running at the time and stopped being true the moment a line shipped with
     three problems: the Change Line can fill two stations (one of its three is
     reserved for the Terminus Hub), so a student choosing "Local — 5 stops"
     got two, with the shortfall reported only in a trip note they never see.

     Route names map to stop counts by design — that is the rail semantics the
     whole route system is built on — so the honest fix is to offer only the
     routes the line can actually run. When none of them fits, the line says
     what it can do and why, rather than offering three buttons that all
     quietly do the same short thing. */
  var ROUTE_COPY = {
    local:   { name: 'Local',   desc: 'Stops everywhere. Every strategy taught in full. The thorough way round.' },
    express: { name: 'Express', desc: 'Skips a stop. Some scaffolding, faster going.' },
    limited: { name: 'Limited', desc: 'Runs direct. Least support, quickest to the hub.' }
  };

  /* THE BOOTH IS A SECTION NOW, NOT A FLOAT — and it is built in ONE place.

     It used to be an absolutely-positioned image, and out of the flow it never
     once stood beside the thing it illustrates. Measured on the rendered page:
     at 1280 the booth sat at x1123–1280, hard against the right edge of the
     SHELL rather than the content column, 89px clear of the choices list and
     centred on the viewport rather than on the buttons; at 390 it ran from
     x312 to x406 — 16px past the window, giving the page a horizontal scroll —
     and lay across both the "pick your own number of stops" summary and the
     Back to the map button. Both are what "out of the flow" buys you: the
     layout cannot see the art, so nothing can make room for it, and every
     attempt to place it is a guess at a height that changes with the number of
     routes on offer. Three such guesses are in this file's history.

     In the flow it needs no guess. `.route-window` puts the booth beside the
     buttons where there is room for two columns and above them where there is
     not, and the grid measures both.

     ONE STRING, TWO EXITS. The float was pasted into both returns below, and
     for a while only into one — so a line thin enough to fall back to a short
     run, which is every new line on the day it opens, showed the choice with no
     booth beside it. A wrapper cannot be half-applied. */
  function ticketWindow(inner) {
    return '<div class="route-window">' +
      '<figure class="route-booth">' +
        '<img src="assets/art/Mr_Fraction_Ticket_Booth.png" alt="" aria-hidden="true" ' +
        'loading="lazy" decoding="async">' +
      '</figure>' +
      inner +
    '</div>';
  }

  function routeChoices(cap) {
    var fits = ['local', 'express', 'limited'].filter(function (r) {
      return Selector.ROUTE_STOPS[r] <= cap;
    });

    if (!fits.length) {
      /* A line too thin for even the shortest named route. Say so plainly —
         a student who is told the track is still being laid is not being let
         down; a student promised five stops and given two is. */
      return ticketWindow('<ul class="choices">' +
        '<li><button class="choice" type="button" data-route="' + cap + '" ' +
          'aria-label="A short run, ' + cap + ' stops. This is everything the line can fill so far."><span>' +
          '<strong>A short run &mdash; ' + cap + ' stop' + (cap === 1 ? '' : 's') + '</strong>' +
          '<small>This line is still being built, so a ride fills ' + cap + ' stop' + (cap === 1 ? '' : 's') +
          ' and then runs to the Terminus Hub. Every stop is the real thing.</small>' +
          '</span></button></li>' +
      '</ul>');
    }

    /* This is the moment the student is at the window deciding what to buy, so
       the booth belongs on the screen — but as scenery beside the choice, never
       as something the choice has to be worked around. `aria-hidden`, so it
       adds nothing to what a screen reader has to hear before choosing. */
    return ticketWindow('<ul class="choices">' + fits.map(function (r) {
      var n = Selector.ROUTE_STOPS[r], c = ROUTE_COPY[r];
      return '<li><button class="choice" type="button" data-route="' + r + '" ' +
        'aria-label="' + esc(c.name) + ', ' + n + ' stops. ' + esc(c.desc) + '"><span>' +
        '<strong>' + esc(c.name) + ' &mdash; ' + n + ' stops</strong><small>' + esc(c.desc) + '</small>' +
        '</span></button></li>';
    }).join('') + '</ul>');
  }

  function chooseRoute(line) {
    var L = MF.rideInfo(line);
    var mixed = line === MF.MIXED;
    var percent = line === MF.PERCENT;
    var cap = Selector.capacityFor(line);
    var node = html(
      '<div>' +
      MrFraction.aside('steady',
        '<p>You&rsquo;re riding <strong>' + esc(L.name) + '</strong>. How many stops do you want?</p>' +
        (mixed ? '<p>Every stop is drawn from a different line, and I won&rsquo;t tell you which ' +
                 'until you&rsquo;re on it. Same five strategies &mdash; you just won&rsquo;t know ' +
                 'which situation is coming.</p>' : '') +
        /* Said HERE, before the first stop, because it is the promise the route
           makes and the thing the Ticket Booth will hold them to. */
        (percent ? '<p>A warning about this one. Percent is not a situation &mdash; it is a way of ' +
                   'writing a number, and it sits on TOP of one of the five. So every stop here is ' +
                   'really one of the other lines wearing a per cent sign, and at the ticket booth ' +
                   'I&rsquo;ll ask you which.</p>' : '')) +
      '<h2>Choose your route</h2>' +
      routeChoices(cap) +
      /* Any number of stops, not just the three presets. Kept as a separate,
         plainly-labelled control so the named routes stay the obvious choice
         and this reads as the extra it is. */
      '<details class="route-more"><summary>Or pick your own number of stops</summary>' +
        '<div class="field" style="max-width:320px">' +
          '<label for="stopn">Stops (' + Selector.MIN_STOPS + '&ndash;' + cap + ')' +
          '<span class="hint-text">' +
            (cap > 5
              ? 'Past five, the trip revisits a strategy with a different problem.'
              : 'This ride can fill ' + cap + ' stops &mdash; there are not enough problems on it for more.') +
          '</span></label>' +
          '<input type="number" id="stopn" min="' + Selector.MIN_STOPS + '" max="' + cap + '" value="' +
            Math.min(6, cap) + '">' +
        '</div>' +
        '<div class="btn-row"><button class="btn" data-customstops="1" type="button">Ride that many →</button></div>' +
      '</details>' +
      '<div class="btn-row"><button class="btn btn-secondary" data-back="1" type="button">← Back to the map</button></div>' +
      '</div>');

    node.addEventListener('click', function (e) {
      if (e.target.closest('[data-back]')) { renderMap(); return; }
      if (e.target.closest('[data-customstops]')) {
        var v = parseInt(node.querySelector('#stopn').value, 10);
        if (isNaN(v)) v = 5;
        // Clamp to what this ride can actually fill, not just to MAX_STOPS —
        // the input's max attribute is advisory and typing past it is allowed.
        startTrip(line, Math.min(Selector.stopsFor(v), cap));
        return;
      }
      var r = e.target.closest('[data-route]');
      if (r) {
        /* A thin line offers its capacity as a NUMBER of stops rather than a
           named route. Attributes are strings, and stopsFor only honours a
           real number — "2" would miss ROUTE_STOPS and silently default to
           five, which is the exact overpromise this control exists to end. */
        var v = r.getAttribute('data-route');
        startTrip(line, /^\d+$/.test(v) ? parseInt(v, 10) : v);
      }
    });
    setView(node);
  }

  /* ---------- Trip ---------- */

  /* One stop on Crossover Island. Not `startTrip`: that builds its ride label
     from a route that is either a number of stops or a name like "Local", and
     the island has neither — the label has to name the STOP, because that is
     what the student chose off the map and what the top bar has to say when
     they come back to it from the map (`resumeTrip` reads `rideLabel`). */
  function startIslandStop(stopKey) {
    var t = Selector.buildIslandStop(stopKey);
    if (!t) return;
    trip = t;
    stationIdx = 0;
    metrics = newMetrics();
    tripDone = false;
    /* The label names the STOP, not the problem — the student chose a place off
       a map, and on a pooled stop naming the problem would announce which of
       the two they drew before they have read a word of it. */
    var stops = Scenery.islandStops().filter(function (s) { return s.key === stopKey; });
    trip.rideLabel = 'Crossover Island · ' + (stops.length ? stops[0].name : 'one stop');
    document.getElementById('sign-sub').textContent = trip.rideLabel;
    drawRoute();
    nextStation();
  }

  function startTrip(line, route) {
    trip = Selector.buildTrip(line, route);
    stationIdx = 0;
    metrics = newMetrics();
    tripDone = false;
    var routeName = typeof route === 'number'
      ? route + ' stops'
      : route.charAt(0).toUpperCase() + route.slice(1);
    /* Kept on the trip rather than only written to the sign, because the sign
       is overwritten by the map and `resumeTrip` has to put it back. */
    trip.rideLabel = MF.rideInfo(line).name + ' · ' + routeName;
    document.getElementById('sign-sub').textContent = trip.rideLabel;
    drawRoute();
    nextStation();
  }

  function drawRoute() {
    // The stops indicator now lives above the problem title, inside the
    // station itself (see Station.render). The old sticky strip stayed put
    // while the content scrolled, which put your progress nowhere near the
    // thing you were working on.
    if (!trip) { routeNav.hidden = true; return; }
    routeNav.hidden = true;
    var items = trip.stations.map(function (s, i) {
      var state = i < stationIdx ? 'done' : (i === stationIdx ? 'current' : 'todo');
      return '<li data-state="' + state + '"' + (state === 'current' ? ' aria-current="step"' : '') + '>' +
        '<span class="node">' + esc(MF.STATIONS[s.role].name) +
        (state === 'done' ? ' <span aria-hidden="true">✓</span><span class="visually-hidden"> done</span>' : '') +
        '</span><span class="connector" aria-hidden="true"></span></li>';
    });
    var hubState = stationIdx >= trip.stations.length ? 'current' : 'todo';
    items.push('<li data-state="' + hubState + '"' + (hubState === 'current' ? ' aria-current="step"' : '') +
      '><span class="node">★ Terminus Hub</span></li>');
    routeMap.innerHTML = items.join('');
  }

  function nextStation() {
    drawRoute();
    if (stationIdx >= trip.stations.length) { renderHubAssessment(); return; }
    var s = trip.stations[stationIdx];
    current = new Stations.Station(s.problem, s.role, metrics, function () {
      stationIdx++;
      nextStation();
    });
    // Where this station sits on the line, so it can draw the leg you're on
    // and hang one car off the engine for each stop already behind you.
    current.legIndex = stationIdx;
    current.legTotal = trip.stations.length;
    /* WHICH RIDE THIS IS, and the Ticket Booth needs it to know what it may
       honestly ask. A question whose answer the student picked off the map two
       screens ago teaches nothing — that is why this station stopped asking
       "which line is this?" in the first place. On the percent route and the
       Grand Tour they picked no line, so the question comes back. */
    current.rideLine = trip.line;
    setView(current.render());
    A11y.announce('Now arriving: ' + MF.STATIONS[s.role].name);
  }

  /* ---------- Terminus Hub ---------- */

  /* A TRIP REPORT IS A REPORT ON A TRIP, AND ONE STOP IS NOT ONE.

     User-found. Crossover Island rides are a single stop — you pick a stop off
     the map and go — so finishing one used to fall straight into
     `renderHubAssessment`, which said "End of the line. I'd normally hand you
     one more problem here… I haven't got a fresh one for you today" and then
     offered a trip report. Both halves were wrong on the island. The apology
     names a shortage that does not exist: the island is not out of problems,
     it never promised a second one. And a report that draws conclusions about
     estimates, hint use and misconception patterns across a journey is
     drawing them from a single station.

     The rule is the one the mainland already runs on: a named route is 2 to 5
     stops, so `Selector.MIN_STOPS` is the threshold, read rather than
     hardcoded. Below it there is no journey to report on and the student goes
     back to the island to pick another stop.

     NOT A CONSOLATION SCREEN. It says what they did and offers the obvious
     next thing, because a student who has just finished the hardest problem
     on the site should not be handed a page explaining what they did not get.
     The Arrivals Board they have just come through is where the work was
     checked; this is a door, not a verdict. */
  function renderHubAssessment() {
    if (trip.stations.length < Selector.MIN_STOPS) {
      var isle = trip.line === MF.CHALLENGE;
      /* 'pleased', not 'go'. The moods are `steady`, `thinking`, `pleased` and
         `curious` — `MrFraction.moods` is the list — and 'go' is a MESSAGE
         kind from `msg()`, not an expression. The two vocabularies sit next to
         each other in this file and the first draft crossed them.

         AND THE SCREEN HAS TO STAND UP WITHOUT HIM. The first version put
         everything in the aside and nothing in the view — and Mr Fraction is a
         FLOATING COMPANION, so `#view` came out holding a single button on an
         otherwise empty page. Ridden end to end, that is what a student meets
         after finishing the hardest problem on the site: a blank area, one
         button, and the words off in a bubble in the corner.

         That is this project's most-repeated failure and it is in my own
         memory as such — remove the thing that was wrong and leave the surface
         empty. The words belong in the view; the companion may echo the voice,
         but it may not BE the content. */
      var one = html('<div>' +
        MrFraction.aside('pleased',
          isle ? '<p>Two situations, joined &mdash; and you took them apart.</p>'
               : '<p>Nicely worked.</p>') +
        '<div class="section-head"><span class="eyebrow">' +
          (isle ? 'Crossover Island' : 'End of the ride') + '</span>' +
          '<h2>That is the stop done.</h2><div class="rule"></div></div>' +
        '<p>' + (isle
          ? 'You took a story that was two situations and pulled it apart at the join.'
          : 'Nicely worked.') + '</p>' +
        '<p style="color:var(--ink-mid)"><strong>There is no trip report for this one</strong>, ' +
        'and that is not something going wrong: a report is about a journey, and this was a single ' +
        'stop. Ride a few and there will be something worth telling you about how you went.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="again" type="button">' +
            (isle ? 'Back to Crossover Island &rarr;' : 'Back to the map &rarr;') + '</button>' +
        '</div>' +
        '</div>');
      tripDone = true;
      one.querySelector('#again').addEventListener('click', function () {
        if (isle) renderIsland(); else renderMap();
      });
      setView(one);
      return;
    }
    if (!trip.hub) {
      // Non-negotiable #10: never fake a transfer assessment.
      var n = html('<div>' +
        MrFraction.aside('steady',
          '<p>End of the line. I&rsquo;d normally hand you one more problem here &mdash; a new one, no help from me &mdash; ' +
          'to see whether the strategies stuck.</p>' +
          '<p><strong>I haven&rsquo;t got a fresh one for you today.</strong> Everything left on this line is ' +
          'something you&rsquo;ve already seen, and testing you on a problem you recognise wouldn&rsquo;t tell ' +
          'either of us anything true.</p>') +
        '<div class="btn-row"><button class="btn" id="toreport" type="button">See your trip report →</button></div>' +
        '</div>');
      n.querySelector('#toreport').addEventListener('click', renderReport);
      setView(n);
      return;
    }

    var p = trip.hub;
    var strategies = [
      { k: 'reading',    t: 'Read it again carefully and work out what it&rsquo;s asking' },
      { k: 'drafting',   t: 'Draw a bar model of the relationship' },
      { k: 'estimation', t: 'Estimate first, then calculate' },
      { k: 'switchyard', t: 'Work out which operation, and which direction' },
      { k: 'signalbox',  t: 'Check for words that might be misleading me' }
    ];

    /* WHAT THIS HUB MAY HONESTLY ASK depends on one thing only: did the hub
       problem come from a line the student did NOT just ride?

       The old test also turned the line question back on as soon as a second
       line had content anywhere on the site — which measured the wrong thing.
       Selector.buildTrip draws the hub from the ridden line's pool, so the hub
       problem is always on that line; the arrival of the Ratio & Rate Rail
       flipped that clause to true and the Hub started asking riders to name
       the line they had just spent five stations on.

       The same objection retires the strategy question on a single-section
       ride. A student who has just been walked through five strategies on one
       line is not choosing cold — the section itself has narrowed the field,
       so "how will you approach it?" measures the ride, not the student.

       Both questions are honest on a MIXED ride, and both switch themselves
       back on for one. Until that mode exists, a single-section Hub asks the
       question the section cannot answer for you: which car is missing. */
    var mixedRide = p.line !== trip.line;
    var askLine = mixedRide, askStrategy = mixedRide;

    var stepNo = {}, c = 0;
    if (mixedRide) { stepNo.line = ++c; stepNo.strategy = ++c; } else { stepNo.car = ++c; }
    stepNo.solve = ++c; stepNo.why = ++c;

    var carOpts = MF.seededShuffle(p.ticketBooth.unknownCarOptions || [], p.id + '|hubcar')
      .map(function (t) {
        return '<li><button class="choice" type="button" data-hcar="' + esc(t) + '">' +
               '<span><strong>' + esc(t) + '</strong></span></button></li>';
      }).join('');

    var lineOpts = Object.keys(MF.LINES).map(function (k) {
      var L = MF.LINES[k];
      return '<li><button class="choice" type="button" data-hline="' + k + '"' +
        ' aria-label="' + esc(L.name + '. ' + L.form) + '">' +
        '<span class="marker" aria-hidden="true">' + L.marker + '</span>' +
        '<span><strong>' + esc(L.name) + '</strong><small>' + esc(L.form) + '</small></span></button></li>';
    }).join('');

    var stratOpts = strategies.map(function (s) {
      var plain = s.t.replace(/&rsquo;/g, "'").replace(/<[^>]+>/g, '');
      return '<li><button class="choice" type="button" data-strat="' + s.k + '"' +
        ' aria-label="' + esc(plain) + '"><span><strong>' +
        s.t + '</strong></span></button></li>';
    }).join('');

    // Same prose treatment as the stations — see Station.problemHTML.
    var sentences = '<p>' + p.problem.sentences.map(function (s, i) {
      var isQ = i === p.problem.questionSentenceIndex;
      return '<span class="s' + (isQ ? ' q-sentence' : '') + '" data-speak="' +
        esc(MF.speechText(s, p.problem.numbers, false)) + '">' +
        MF.renderText(esc(s), p.problem.numbers, false) + '</span>';
    }).join(' ') + '</p>';

    var sceneHtml = (window.Scene && Scene.html(p)) || '';

    var node = html('<div class="card">' +
      '<span class="phase-label">TERMINUS HUB</span>' +
      '<h2>Last stop. You&rsquo;re on your own for this one.</h2>' +
      MrFraction.aside('steady',
        '<p>New problem. I&rsquo;m not telling you which line it is, and I&rsquo;m not telling you what to do with it.</p>' +
        '<p>That&rsquo;s the whole point &mdash; anyone can follow a strategy they&rsquo;ve been handed. ' +
        'Choosing one is the part that travels with you.</p>') +
      /* The Hub builds its own problem markup rather than going through
         Station.problemHTML, which is why it was the one screen with no
         picture beside the words. The illustration shows the quantities the
         problem STATES — it doesn't name the line or suggest a strategy, so
         it costs the assessment nothing. */
      '<div class="problem-pair' + (sceneHtml ? '' : ' no-scene') + '">' +
        '<div class="problem-well">' + sentences + '</div>' + sceneHtml +
      '</div>' +

      /* ON A SINGLE-LINE RIDE, SAY NOTHING HERE.
         This used to carry a caution explaining that we would not ask which
         line it is, because "naming the line cold is what a mixed ride is for".
         That is talk about GUESSING THE TYPE of problem — and on a Main Line
         trip the student has spent the whole ride on one line, so raising it at
         the last stop introduces a question nobody asked and points them at a
         different ride at the moment they are finishing this one.

         It belongs to the Grand Tour, which is the ride that actually asks
         "which line is this?" — and there `askLine` is true, so the branch
         below renders the real question instead. Nothing replaces it here: the
         student simply goes on to the problem. */
      (askLine
        ? '<h3>' + stepNo.line + '. Which line is this?</h3>' +
          '<ul class="choices" id="hlines">' + lineOpts + '</ul>' +
          '<div class="feedback" role="status" id="hlfb"></div>'
        : '') +

      (askStrategy
        ? '<div id="hstep2" hidden>' +
            '<h3>' + stepNo.strategy + '. How will you approach it?</h3>' +
            '<p class="hint-text">There isn&rsquo;t one right answer here &mdash; but some approaches suit this problem better than others.</p>' +
            '<ul class="choices" id="hstrat">' + stratOpts + '</ul>' +
            '<div class="feedback" role="status" id="hsfb"></div>' +
          '</div>'
        /* The one thing the section genuinely cannot hand you. Which car is
           missing changes problem to problem within a line, so it stays a real
           judgement even when the schema is known — which is exactly why the
           in-station Ticket Booth asks it instead of the line. */
        : '<div id="hstep2car">' +
            '<h3>' + stepNo.car + '. Which car is missing?</h3>' +
            '<p class="hint-text">Same line, but every problem on it hides a different piece. Which one is this problem not telling you?</p>' +
            '<ul class="choices" id="hcars">' + carOpts + '</ul>' +
            '<div class="feedback" role="status" id="hcfb"></div>' +
          '</div>') +

      '<div id="hstep3" hidden>' +
        '<h3>' + stepNo.solve + '. Solve it</h3>' +
        '<div class="field" style="max-width:320px">' +
          '<label for="hans">Your answer' + (p.arrivals.answer.unit ? ' (' + esc(p.arrivals.answer.unit) + ')' : '') + '</label>' +
          '<input type="text" id="hans" inputmode="decimal">' +
        '</div>' +
        '<div class="feedback" role="status" id="hafb"></div>' +
        '<div class="btn-row"><button class="btn" id="hcheck" type="button">Check my answer</button></div>' +
      '</div>' +

      '<div id="hstep4" hidden>' +
        '<h3>' + stepNo.why + '. How do you know that&rsquo;s reasonable?</h3>' +
        '<div class="field"><label for="hwhy">Say how you&rsquo;d convince someone your answer makes sense.' +
        '<span class="hint-text">Nobody is marking this. Saying it out loud is what makes it stick.</span></label>' +
        '<textarea id="hwhy"></textarea></div>' +
        '<div class="btn-row"><button class="btn" id="hdone" type="button">Finish the trip →</button></div>' +
      '</div>' +
      '</div>');

    var tries = 0;
    if (askLine) node.querySelector('#hlines').addEventListener('click', function (e) {
      var b = e.target.closest('[data-hline]'); if (!b || b.disabled) return;
      tries++;
      var ok = b.getAttribute('data-hline') === p.ticketBooth.correctLine;
      b.setAttribute('data-result', ok ? 'right' : 'wrong');
      b.disabled = true;
      if (ok) {
        metrics.hubSchemaFirstTry = tries === 1;
        var all = node.querySelectorAll('[data-hline]');
        for (var i = 0; i < all.length; i++) all[i].disabled = true;
        node.querySelector('#hlfb').innerHTML = msg('go', '✓', esc(p.ticketBooth.whyCorrect));
        node.querySelector('#hstep2').hidden = false;
      } else {
        var d = (p.ticketBooth.distractors || []).filter(function (x) { return x.line === b.getAttribute('data-hline'); })[0];
        node.querySelector('#hlfb').innerHTML = msg('stop', '→',
          esc(d ? d.whyWrong : 'Look again at what is happening to the amounts.'));
      }
    });

    /* Only one of these two blocks exists on any given ride, so each listener
       is attached only when its markup was rendered. */
    var carTries = 0;
    if (!askStrategy) node.querySelector('#hcars').addEventListener('click', function (e) {
      var b = e.target.closest('[data-hcar]'); if (!b || b.disabled) return;
      carTries++;
      var ok = b.getAttribute('data-hcar') === p.ticketBooth.unknownCarAnswer;
      b.setAttribute('data-result', ok ? 'right' : 'wrong');
      b.disabled = true;
      if (!ok) {
        node.querySelector('#hcfb').innerHTML = msg('stop', '→',
          'Not that one. That piece is either handed to you in the problem, or it is not what the question wants. Read what it is actually asking for.');
        return;
      }
      metrics.hubCarFirstTry = carTries === 1;
      var allc = node.querySelectorAll('[data-hcar]');
      for (var j = 0; j < allc.length; j++) allc[j].disabled = true;
      node.querySelector('#hcfb').innerHTML = msg('go', '✓', esc(p.ticketBooth.unknownCarWhy || ''));
      node.querySelector('#hstep3').hidden = false;
    });

    if (askStrategy) node.querySelector('#hstrat').addEventListener('click', function (e) {
      var b = e.target.closest('[data-strat]'); if (!b) return;
      var all = node.querySelectorAll('[data-strat]');
      for (var i = 0; i < all.length; i++) all[i].disabled = true;
      var chosen = b.getAttribute('data-strat');
      var good = (p.hubGoodStrategies || []).indexOf(chosen) !== -1;
      metrics.hubStrategyOk = good;
      metrics.hubStrategyChosen = chosen;
      b.setAttribute('data-result', good ? 'right' : 'wrong');
      node.querySelector('#hsfb').innerHTML = good
        ? msg('go', '✓', '<strong>Good call.</strong> ' + esc(p.hubStrategyNote || ''))
        : msg('caution', '→', '<strong>That can work, but there&rsquo;s a better fit here.</strong> ' +
            esc(p.hubStrategyNote || ''));
      node.querySelector('#hstep3').hidden = false;
    });

    node.querySelector('#hcheck').addEventListener('click', function () {
      var raw = node.querySelector('#hans').value;
      if (!raw.trim()) { node.querySelector('#hafb').innerHTML = msg('caution', '!', 'Put your answer in first.'); return; }
      var res = MF.checkAnswer(raw, p.arrivals.answer);
      metrics.hubCorrect = res.ok;
      node.querySelector('#hafb').innerHTML = res.ok
        ? msg('go', '✓', '<strong>Correct.</strong>' + (res.note ? ' ' + esc(res.note) : ''))
        : msg('stop', '→', 'Not quite &mdash; the answer is <strong>' + esc(p.arrivals.answer.exact) + ' ' +
            esc(p.arrivals.answer.unit || '') + '</strong>. ' + esc(p.arrivals.connection || ''));
      this.disabled = true;
      node.querySelector('#hstep4').hidden = false;
    });

    node.querySelector('#hdone').addEventListener('click', renderReport);
    setView(node);
    drawRoute();
  }

  /* ---------- Trip report ---------- */

  function renderReport() {
    var m = metrics, lines = [];

    // Strategy selection first. Deliberate: a student who chose well and
    // slipped in arithmetic has learned more than one who guessed right.
    if (m.hubStrategyOk === true) {
      lines.push(['★', 'You picked your own approach, and it was a good fit.',
        'That is the hardest thing on this whole site, and you did it with no help from me.']);
    } else if (m.hubStrategyOk === false) {
      lines.push(['★', 'You committed to an approach without being told one.',
        'It wasn&rsquo;t the best fit this time &mdash; but choosing is the skill. Fit comes with mileage.']);
    } else if (m.hubCarFirstTry !== null) {
      /* A single-section ride does not ask which approach to take — the
         section has already narrowed it. What it asks unaided is which car is
         missing, so that is what the report leads with instead. */
      lines.push(m.hubCarFirstTry
        ? ['★', 'At the hub you found the missing car first go, unaided.',
           'Same line all trip, but every problem on it hides a different piece &mdash; and you spotted which one this time.']
        : ['★', 'At the hub you worked out which car was missing on your own.',
           'It took more than one go, and that is fine. Knowing the line never tells you which piece is absent.']);
    }

    if (m.selfChecks > 0) {
      lines.push(['✓', 'You caught ' + m.selfChecks + ' thing' + (m.selfChecks > 1 ? 's' : '') + ' at the arrivals board.',
        'Checking your own work against your own estimate is what stops small slips becoming wrong answers.']);
    }

    var att = m.schemaAttempts;
    if (att.length) {
      var firsts = m.schemaFirstTry;
      lines.push(['◆', 'You spotted the line first try ' + firsts + ' time' + (firsts === 1 ? '' : 's') +
        ' out of ' + att.length + '.',
        att.length > 1 && att[att.length - 1] <= att[0]
          ? 'It took you fewer goes by the end than at the start.'
          : 'Recognising the situation is the skill everything else sits on.']);
    }
    if (m.hubSchemaFirstTry === true) {
      lines.push(['◆', 'At the hub you named the line straight away, cold.', 'No options narrowed, no hints.']);
    }

    if (m.estimates.length) {
      lines.push(['≈', 'You committed to ' + m.estimates.length + ' estimate' + (m.estimates.length > 1 ? 's' : '') + '.',
        'Estimating first is what gives you something to check against.']);
    }

    var rungs = m.hints.map(function (h) { return h.rung; });
    if (rungs.length) {
      lines.push(['⚑', 'You asked for ' + rungs.length + ' hint' + (rungs.length > 1 ? 's' : '') + '.',
        'Asking for help at the right moment is a strategy, not a cost.']);
    } else if (m.stationsDone > 0) {
      lines.push(['⚑', 'You rode the whole line without asking for a hint.', 'Worth knowing you could.']);
    }

    var tags = {};
    m.misconceptions.forEach(function (t) { tags[t] = (tags[t] || 0) + 1; });
    var repeated = Object.keys(tags).filter(function (t) { return tags[t] >= 2; });

    var hubHtml = '';
    if (m.hubCorrect === true) hubHtml = msg('go', '✓', 'Hub problem: correct.');
    else if (m.hubCorrect === false) hubHtml = msg('info', '→', 'Hub problem: not this time. That&rsquo;s information, not a verdict.');

    var node = html('<div>' +
      MrFraction.aside('pleased', '<p>End of the line. Here&rsquo;s how the trip went.</p>') +
      /* The whole locomotive, once, at the end of a completed trip. It is the
         only place on the site big enough to carry it, and arriving is the one
         moment worth marking with something the student has not seen before. */
      '<figure class="art-band art-band-loco">' + Scenery.art('Mr_Fraction_Train.png', 'art-loco') + '</figure>' +
      '<div class="card">' +
        '<h2>Trip report</h2>' +
        '<p class="hint-text">No score, no percentage. This is about how you travelled.</p>' +
        (lines.length ? lines.map(function (l) {
          return '<div class="report-line"><span class="rl-ico" aria-hidden="true">' + l[0] + '</span>' +
            '<span><strong>' + l[1] + '</strong><small>' + l[2] + '</small></span></div>';
        }).join('') : '<p>You didn&rsquo;t get far enough for me to tell you much. Ride a line and come back.</p>') +
        hubHtml +
        (repeated.length ? msg('caution', '◎',
          '<strong>Worth another trip:</strong> the same slip came up more than once. ' +
          'A stop at a learning hub might sort it in five minutes.') : '') +
      '</div>' +
      '<div class="btn-row">' +
        '<button class="btn" id="again" type="button">Ride another line</button>' +
        '<button class="btn btn-secondary" id="samelocal" type="button">Same line, the Local (more stops)</button>' +
      '</div>' +
      '</div>');

    node.querySelector('#again').addEventListener('click', renderMap);
    node.querySelector('#samelocal').addEventListener('click', function () {
      startTrip(trip.line, 'local');
    });
    /* The trip is over, so the map must stop offering it back. `trip` itself
       stays because "Same line, the Local" above reads `trip.line` from it. */
    tripDone = true;
    setView(node);
    routeNav.hidden = true;
    A11y.announce('Trip report ready.');
  }

  /* ---------- Learning hub ---------- */

  function renderHub(id) {
    var h = MF.hubs[id];
    if (!h) return;

    /* A hub authored as PAGES renders as a journey — see hub.js. A hub with
       only `sections` keeps the long-scroll renderer below. Both shapes have to
       work at once: `fraction-yard` is still on the old one, and migrating both
       in a single change would leave neither testable against the other. */
    if (global.Hub && Hub.applies(h)) {
      var jnode = html('<div>' +
        MrFraction.aside('steady', '<p>' + esc(h.welcome) + '</p>') +
        Hub.html(h) +
        (h.closing ? MrFraction.aside('proud', '<p>' + esc(h.closing) + '</p>') : '') +
        '<div class="btn-row"><button class="btn btn-secondary" id="hback" type="button">← Back to the map</button></div>' +
        '</div>');
      Hub.wire(jnode, h);
      jnode.querySelector('#hback').addEventListener('click', renderMap);
      setView(jnode);
      A11y.announce(h.name + ' hub opened.');
      return;
    }
    var secs = h.sections.map(function (s) {
      return '<h3>' + esc(s.heading) + '</h3>' + s.body;
    }).join('');
    var checks = (h.checks || []).map(function (c, i) {
      return '<div class="field"><label for="hc' + i + '">' + esc(c.q) + '</label>' +
        '<input type="text" id="hc' + i + '" data-ans="' + esc(c.a) + '">' +
        '<div class="feedback" role="status" id="hcf' + i + '"></div></div>';
    }).join('');

    /* Multiple-choice schema identification. This is the ONE place naming the
       line is a real question — the student hasn't chosen a line, so nothing
       gives the answer away. Inside a trip the same question would be a
       formality, which is why the Ticket Booth asks about the missing car. */
    var quiz = '';
    if (h.quiz) {
      var lineBtns = function (qi) {
        return Object.keys(MF.LINES).map(function (k) {
          var L = MF.LINES[k];
          return '<li><button class="choice" type="button" data-q="' + qi + '" data-pick="' + k + '"' +
            ' aria-label="' + esc(L.name) + '">' +
            '<span class="marker" aria-hidden="true" style="color:var(--line-' + k + ')">' + L.marker + '</span>' +
            '<span><strong>' + esc(L.name.replace(/^The /, '')) + '</strong>' +
            '<small>' + esc(L.desc) + '</small></span></button></li>';
        }).join('');
      };
      quiz = '<div class="section-head"><span class="eyebrow">Practice</span>' +
        '<h2>Spot the situation</h2><div class="rule"></div></div>' +
        '<p>' + esc(h.quiz.prompt) + '</p>' +
        h.quiz.items.map(function (it, i) {
          return '<div class="card">' +
            '<div class="problem-well" style="border-left-color:var(--border-strong)"><p>' + esc(it.stem) + '</p></div>' +
            '<ul class="choices">' + lineBtns(i) + '</ul>' +
            '<div class="feedback" role="status" id="qf' + i + '"></div></div>';
        }).join('');
    }

    /* The Shunting Yard — factors and multiples, listed rather than guessed.
       Students were expected to find a common denominator with no way to see
       what 5 and 4 have in common. This shows both lists and highlights the
       overlap, which is the whole idea made visible. */
    /* The Shunting Yard lives in hub.js now — one implementation, used by the
       paged renderer and by this one. It used to be written out twice, and a
       teaching tool with two copies is two things to fix when it is wrong. */
    var tool = (h.tool === 'factors' && global.Hub) ? Hub.tool.html() : '';

    var node = html('<div>' +
      MrFraction.aside('steady', '<p>' + esc(h.welcome) + '</p>') +
      '<div class="card">' +
        '<span class="phase-label">LEARNING HUB</span>' +
        '<h2>' + esc(h.name) + '</h2>' +
        secs +
        (checks ? '<h3>Quick check</h3>' + checks +
          '<div class="btn-row"><button class="btn" id="hcheckbtn" type="button">Check these</button></div>' : '') +
      '</div>' +
      tool +
      quiz +
      (h.closing ? MrFraction.aside('proud', '<p>' + esc(h.closing) + '</p>') : '') +
      '<div class="btn-row"><button class="btn btn-secondary" id="hback" type="button">← Back to the map</button></div>' +
      '</div>');

    if (h.quiz) {
      node.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pick]');
        if (!b || b.disabled) return;
        var qi = +b.getAttribute('data-q'), item = h.quiz.items[qi];
        var ok = b.getAttribute('data-pick') === item.answer;
        b.setAttribute('data-result', ok ? 'right' : 'wrong');
        if (ok) {
          var sib = b.closest('ul').querySelectorAll('[data-pick]');
          for (var i = 0; i < sib.length; i++) sib[i].disabled = true;
          node.querySelector('#qf' + qi).innerHTML = msg('go', '✓', '<strong>Yes.</strong> ' + esc(item.why));
          A11y.announce('Correct.');
        } else {
          b.disabled = true;
          var L = MF.LINES[b.getAttribute('data-pick')];
          node.querySelector('#qf' + qi).innerHTML = msg('stop', '→',
            '<strong>Not ' + esc(L.name) + '.</strong> That would need ' + esc(L.form.toLowerCase()) +
            ' &mdash; read the stem again and ask what is actually happening to the amounts.');
          A11y.announce('Not that one.');
        }
      });
    }

    if (checks) {
      node.querySelector('#hcheckbtn').addEventListener('click', function () {
        var ins = node.querySelectorAll('[data-ans]');
        for (var i = 0; i < ins.length; i++) {
          var fb = node.querySelector('#hcf' + i);
          var res = MF.checkAnswer(ins[i].value, { exact: ins[i].getAttribute('data-ans') });
          fb.innerHTML = ins[i].value.trim()
            ? (res.ok ? msg('go', '✓', 'Yes.') : msg('caution', '→', 'Not yet &mdash; have another look above.'))
            : '';
        }
        A11y.announce('Checked.');
      });
    }
    if (h.tool === 'factors' && global.Hub) Hub.tool.wire(node);

    node.querySelector('#hback').addEventListener('click', renderMap);
    setView(node);
  }

  /* ---------- boot ---------- */

  function init() {
    view = document.getElementById('view');
    routeNav = document.getElementById('route-nav');
    routeMap = document.getElementById('route-map');
    /* The top bar portrait is the painted Conductor now, set in index.html so it
       is there before any script runs. It used to be injected here as inline
       SVG; injecting into it would silently do nothing (an <img> takes no
       children) and leave the impression the line still worked. */

    /* The loading screen removes itself once everything it was covering has
       actually arrived — never on a timer, which would either flash before the
       page is ready or sit there after it is. */
    (function () {
      var ls = document.getElementById('loading-screen');
      if (!ls) return;

      /* A MINIMUM ON SCREEN, and it is not padding for its own sake. Loading
         from `file://` or from a warm cache finishes in a few tens of
         milliseconds, so the loader was appearing and vanishing inside a single
         frame — a flash, which is worse than no loader at all. It now stays for
         at least one full cycle of the train's rock so it reads as a thing that
         happened rather than a glitch.

         It is a MINIMUM, never a fixed wait: a slow load still dismisses the
         moment it finishes, so nobody is ever held up by this. And it starts
         from when the script runs, not from `load`, so time already spent
         waiting counts towards it. */
      /* Long enough to see the lamps run the full sequence — the last one
         lights at 0.72s and its cycle finishes at 2.2s — and then a moment to
         register the train before it clears. Still a MINIMUM, never a fixed
         wait: a slow load dismisses the instant it finishes. */
      var MIN_MS = 2600;
      var startedAt = Date.now();

      /* THE PROGRESS BAR MEASURES THE REAL WAIT, and that constraint is what
         makes it worth having. A bar animated 0-to-100 on a fixed timer is a
         picture of a load rather than a report on one, and it lies in both
         directions: it finishes early on a slow connection and crawls on a
         fast one.

         Dismissal here happens at `max(window.load, MIN_MS)`, so there are two
         real gates and the bar tracks whichever is binding. Before `load` it
         fills against the minimum — genuine progress, because on `file://` or
         a warm cache the minimum IS the thing being waited on. It stops at 92%
         rather than arriving, because the other gate has not been met yet and
         a full bar over an unfinished load is the lie. When `load` fires the
         remaining wait is known exactly, so the last stretch is handed to a
         transition of precisely that duration and the bar reaches 100% as the
         screen clears, never before. */
      var bar = document.getElementById('load-bar');

      /* THREE PHRASES, NOT ONE — the user's call, 2026-08-16. The status line
         said "Getting up steam…" for the whole wait and then the site
         appeared, so the only thing on screen that changed was the lamps.

         THEY ARE DRIVEN BY THE SAME NUMBER THE BAR IS, which is what keeps
         them from being filler. The Factory's loader rotates a line on a timer
         and this project's own reading of it (ROADMAP §5) called that worse
         than a static one, because a line that turns over on its own says
         nothing about how the load is going. Read off the same elapsed
         fraction, they narrate the bar instead: each one lands as the fill
         passes it.

         The wording tracks what is visibly happening rather than inventing
         business — the lamps light one per line, so the middle phrase names
         them. Nothing here claims a step the site is not actually taking.

         THE LOADER IS `aria-hidden`, so all three are visual only; a screen
         reader hears none of them and is not made to sit through a countdown.

         THEY KEEP ADVANCING UNDER REDUCED MOTION, for the same reason the bar
         does: this is status, not decoration, and freezing it would leave a
         reduced-motion user with the one thing the change set out to fix. */
      var sub = document.querySelector('.load-sub');
      var PHRASES = ['Getting up steam…', 'Lighting the signal lamps…', 'Signals clear…'];
      var phraseAt = 0, finishing = false;

      /* One interval for both, and it OUTLIVES `done()`. An earlier version
         cleared it there, which on a warm cache — where `done()` runs within a
         couple of hundred milliseconds — meant the bar was handed its final
         transition and the words never advanced past the first. The common
         path would have shown none of this. */
      var tick = setInterval(function () {
        var pct = ((Date.now() - startedAt) / MIN_MS) * 100;
        if (bar && !finishing) bar.style.width = Math.min(pct, 92) + '%';
        var want = pct >= 72 ? 2 : pct >= 36 ? 1 : 0;
        if (sub && want !== phraseAt) { phraseAt = want; sub.textContent = PHRASES[want]; }
      }, 80);

      var stopTick = function () { if (tick) { clearInterval(tick); tick = null; } };

      var done = function () {
        var wait = Math.max(0, MIN_MS - (Date.now() - startedAt));
        finishing = true;
        if (bar) {
          /* A floor of 120ms so the finish is a movement rather than a jump —
             on a load that already outran the minimum, `wait` is 0. */
          bar.style.transitionDuration = Math.max(120, wait) + 'ms';
          bar.style.width = '100%';
        }
        setTimeout(function () {
          ls.setAttribute('data-done', 'yes');
          setTimeout(function () {
            stopTick();
            if (ls.parentNode) ls.parentNode.removeChild(ls);
          }, 420);
        }, wait);
      };
      if (document.readyState === 'complete') done();
      else global.addEventListener('load', done);
    })();

    document.getElementById('ambient-host').appendChild(Scenery.ambient());
    document.getElementById('ticker-host').innerHTML = Scenery.ticker([
      'All lines running', 'Mr Fraction&rsquo;s Word Problem Express',
      'Mind the gap between the number and the meaning',
      'The Part&ndash;Whole Loop &mdash; now boarding',
      'The Ratio &amp; Rate Rail &mdash; now boarding',
      'Estimate before you calculate', 'No keywords on this railway',
      'Every problem is a train with a missing car'
    ]);
    document.getElementById('btn-map').addEventListener('click', function () {
      A11y.stopSpeaking();
      renderMap();
    });
    renderMap();
  }

  global.App = {
    rerender: function () { if (current && trip) current.renderPhase(); },
    map: renderMap
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
