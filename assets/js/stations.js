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
        /* `all` — "a SINGLE kind", i.e. everything in the story. One of the four
           universal claims; see the quantifier note above `optionTrue`. */
        { id: 'same', text: 'A single kind of thing', lines: ['change', 'compare', 'groups', 'partwhole'], all: true,
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
        /* `all` — "the amounts", every one of them. A negative universal: false
           of the story if EITHER half changes an amount. */
        { id: 'steady', text: 'No &mdash; the amounts stay as they are, even if something is moving', lines: ['compare', 'groups', 'partwhole', 'ratio'], all: true,
          yes: 'Things can be busy without any amount changing. A train can run all day and still be running at the same rate.',
          no: 'That would mean every amount is still what it was at the start. Look again for something being added or taken away.' }
      ]
    },
    {
      id: 'things', label: 'Things',
      ask: 'How many separate things is the story keeping track of?',
      options: [
        /* `all` — "JUST a single thing" is a claim about the whole story, and a
           paired story that compares two things anywhere is not keeping one. */
        { id: 'single', text: 'Just a single thing', lines: ['change', 'groups', 'partwhole'], all: true,
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
        /* `all` — "NOTHING is being carved up or repeated". The clearest of the
           four, and the one that shipped P and not-P on the same screen. */
        { id: 'neither', text: 'Neither &mdash; nothing is being carved up or repeated', lines: ['change', 'compare', 'ratio'], all: true,
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
        /* `pairs` is the answer key for THIS question and it inverts the whole
           thing on a Challenge problem. See `optionTrue`. `false` is stated
           rather than left off: an option here that is silent about pairing is
           an option nobody decided about, and `optionTrue` would fall through
           to the either-half rule and quietly call it correct. */
        /* EACH OF THESE FOUR STRINGS HAS EXACTLY ONE AUDIENCE, which is why
           none of them has to hedge. `onekind` is true on all five lines and
           false on every paired problem, so its `yes` is only ever read on the
           mainland and its `no` is only ever read on the island — and the
           reverse for `stacked`. Check that before editing either: the moment
           an option is true in both places, both replies acquire a second
           reader and stop being able to say anything definite. */
        { id: 'onekind', text: 'Yes &mdash; the same kind of situation all the way through', lines: ['change', 'compare', 'groups', 'partwhole', 'ratio'], pairs: false,
          yes: 'Everything the question needs is the same kind of situation &mdash; even where it takes more than a single move to get there.',
          /* WRITTEN 2026-08-16, and the hard part is not the correction.
             A student who says "one kind" here has read carefully and applied
             a rule that is right nearly everywhere on this site. Telling them
             flatly that they are wrong teaches them to distrust the reading,
             which is the one thing that must survive. So it opens by agreeing
             with the reasoning and then says where the reasoning runs out.

             THREE THINGS IT DELIBERATELY DOES NOT DO:
             - It does not name the two situations. This screen is numberless
               and comes BEFORE the passes that ask which two — naming them
               here would answer the next three questions (VERIFICATION.md §3).
             - It does not claim anything about what the student has ridden.
               The island is open: they may have arrived here first, so "on
               every trip you have taken" would be a lie to some readers.
             - It gives no word to look for. It points at STRUCTURE — the
               place the story changes — because a word here would be a tier-3
               keyword rule arriving on the one screen built to refute them
               (PEDAGOGY.md §2.2).

             And it ends by handing over the next move rather than the answer:
             the pass that follows this one is "find the crossover". */
          /* THE RENDERER SUPPLIES THE NEGATION. Every one of these strings is
             printed after a bold "Not this time." — so a reply that also opens
             by saying no says it twice. The first draft read "Not this time.
             Good reading … Not here." — three negations in two lines, and it
             was only visible on the rendered screen. Look at `stacked.no`: it
             opens by AGREEING, and the prefix does the disagreeing. */
          /* NO NUMBER WORDS. This renders on read1, which is numberless, and
             "one", "two" and "half" are all refused there — a spelled-out
             number leaks structure exactly as a digit does. The first draft
             said "one kind of thing" and "the second half cannot start until
             the first half is finished" and would have been refused on all
             three. The site already had the vocabulary: `ask` says "a single
             kind", `onekind` says "the same kind all the way through". */
          no: 'Good reading, and nearly everywhere else it would be the right answer. Here, though, the story stops being a single kind of thing partway through and starts being another &mdash; and the later part cannot start until the earlier part is finished. Read it again and find the place where it changes.' },
        /* "one after another" and "This one does" — both pre-existing, both
           refused the moment the shared table came under the numberless scan
           (2026-08-16), and both are the word "one" doing a pronoun's job
           rather than counting anything. The regex cannot tell the difference
           and must not be taught to: the exemption on this rule is a data tag,
           never a reading of intent. So the copy moves instead, which costs a
           word and keeps the rule blunt enough to trust. */
        { id: 'stacked', text: 'No &mdash; it stacks different kinds of situation, in turn', lines: [], pairs: true,
          /* The only reply on this question a student reads as a correct
             answer on the island. It confirms, names the structure without
             naming the two situations, and states the payoff — which is the
             whole argument for Challenge Mode: two lines together is not a
             harder kind of problem, it is two problems you can already do. */
          /* Does not open with "Yes" — the renderer already printed one, and
             the first draft rendered as "Yes. Yes — and that is what makes…".
             None of the other replies here opens with the verdict; they all
             start straight into the reason. */
          yes: 'That is what makes this a challenge. A kind of situation, and then a different kind, joined at the point where the story changes. Find that point and a hard problem turns into problems you already know how to do.',
          no: 'Worth asking every time, and often the right answer &mdash; plenty of problems do stack different kinds of situation. This story stays inside a single kind the whole way, even where the working takes more than a single step. Steps and situations are not the same thing.' },
        { id: 'nofit', text: 'None of them really fits', lines: [], pairs: false,
          yes: '',
          no: 'That is a real answer and you should keep it in your pocket &mdash; not every problem you meet fits these lines. This story does, though. Look at the shape you just described.' }
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
        /* `pairs` is copied for the same reason `lines` is: this function
           REBUILDS the option rather than extending it, so a field it does not
           name is silently dropped on any problem that carries an override.
           That is not hypothetical — it is the shape of the defect in
           `data.js` that let `signalFailure` reach a student as four literal
           braces. Adding a key to a CHECK option means adding it here. */
        return { id: o.id, lines: o.lines, pairs: o.pairs,
                 text: ov.text || o.text, yes: ov.yes || o.yes, no: ov.no || o.no };
      })
    };
  }

  /* ---------- THE ANSWER KEY, IN ONE PLACE ----------

     `o.lines.indexOf(p.line) >= 0` was the whole key, written in two places,
     and it cannot express a problem that is two situations. A Challenge
     problem has no single `line` — it has `pair.first` and `pair.second` — so
     the key has to be asked a different question about it.

     TWO SHAPES, AND WHICH ONE APPLIES IS DECIDED BY THE PROBLEM:

     - An option that declares `pairs` is answering the question ABOUT pairing
       (`fit`: does this stay one kind of situation, or stack two?). On a
       paired problem its own declaration is the answer and `lines` is not
       consulted — which is what INVERTS `stacked` from never-correct to
       correct, and `onekind` from correct to distractor.
     - Every other option on a paired problem is true if it is true of EITHER
       HALF. Both halves are in the story, so both halves' answers are honest
       readings of it.

     THE SECOND RULE MEANS A QUESTION CAN HAVE TWO TRUE ANSWERS — SETTLED
     2026-08-16, and it needed no new copy at all. Measured on
     `cl-signal-delay`: `kinds` accepts both "same" and "different" and
     `things` accepts both "separate" and "paired", each reply correct about
     one half of the story. That was written up here as an open decision across
     five questions and it was the wrong frame. A story that answers this
     checklist two ways IS a story made of two situations, which is what the
     fifth question on the same screen goes on to ask — so `phRead1` names the
     other true answer and says why both hold, and the apparent inconsistency
     becomes the reason for the next question.

     Declared as data on the option, never as `if (challenge)` at the call
     site: a renderer branch is an exemption, and this project has seven files
     of what hand-kept exemptions do. */
/* ---- THE QUANTIFIER, and why `all` exists (Cycle 30, a math CRITICAL) ----

     The rule below used to be a bare disjunction: true of either half, true of
     the story. That is SOUND FOR AN EXISTENTIAL CLAIM and UNSOUND FOR A
     UNIVERSAL OR NEGATIVE ONE, and four of the eleven options are the latter.

     "A whole thing, cut into shares" is existential — if either half cuts
     something up, the story cuts something up, and either-half is right.
     "Neither — nothing is being carved up or repeated" is a claim about the
     WHOLE STORY. It is true only if it holds of BOTH halves. Applied
     disjunctively it was confirmed by whichever half happened to satisfy it,
     while the other half sat on screen doing the opposite.

     What that shipped: on cl-season-tickets (compare + partwhole) the site
     marked "nothing is being carved up" CORRECT while the second half cut 57
     into 38 and 19 — and marked "A whole thing, cut into shares" correct on the
     same screen, so the rider rendered P and not-P together, both ticked. 13
     such cells across 6 of the 7 island problems. Random tapping scored 57.1%
     on the island checklist against 40% on the mainland.

     It was worst exactly where the student had least help. `unaided` suppresses
     the rider at an unstaffed halt, so on cl-lost-umbrellas and cl-buffet-crates
     the false confirmation arrived ALONE and unqualified, on the only aided
     screen those stops have. On cl-buffet-crates a student reading the story as
     an ordinary Part-Whole problem collected four green ticks out of four.

     No checker could see it: tools/sweep.js asks `optionTrue` the same question
     the screen asks, so instrument and subject agreed by construction.

     THE QUANTIFIER IS DECLARED ON THE OPTION, never as `if (challenge)` at the
     call site — same reason as the note above. A renderer branch would be an
     exemption, and a fix keyed to the six known problems would be a hand-kept
     list, which is the defect class this project already has seven files of.
     Tag the claim, and every problem that ever pairs those lines is covered. */
  function optionTrue(o, p) {
    if (!p || !p.pair) return o.lines.indexOf(p && p.line) >= 0;
    if (typeof o.pairs === 'boolean') return o.pairs;
    var inFirst  = o.lines.indexOf(p.pair.first)  >= 0;
    var inSecond = o.lines.indexOf(p.pair.second) >= 0;
    // `all`: the option claims something about the whole story, so both halves
    // must satisfy it. Absent: an ordinary existential claim, either half does.
    return o.all ? (inFirst && inSecond) : (inFirst || inSecond);
  }

  /* ============================================================
     THE FADE LADDER — the one place the phase chain is written.

     WHY THIS EXISTS AS A FUNCTION AND NOT AS PROSE. This chain was written
     twice: `phRead1` forked one way and `tools/sweep.js` rebuilt the same fork
     in its own list. They agreed only as long as somebody remembered to change
     both, and on 2026-08-16 they did not — the halt's route changed, the sweep
     kept scanning three screens no student could reach, and it took a second
     pass to notice. Two copies of a rule is one copy and one guess.

     So the chain is DERIVED here and both consumers read it. A stop's
     scaffolding is now a fact about the problem rather than a fact about
     whichever file you happen to be reading, and `CHALLENGE-MODE.md` §4 states
     the same table in words with this named as the implementation. If they ever
     disagree, this one is right and the document is stale.

     WHAT EACH RUNG MEANS, and the whole ladder is `fadeLevel` — the mechanism
     the site already had, not a flag invented for the island:

       mainland      read1 · platform · read2 · read3 · ticket · plan
       staffed pair  read1 · crossover · read2 · read3 · ticket · plan
       unstaffed     read1

     The unstaffed halt runs the checklist and then goes to the Engine Room.
     No Crossover Read, no second or third read, no Ticket Booth, AND NO
     ESTIMATE — user, 2026-08-16: "a student who wants to go straight to hard
     and get the bare minimum." The problem is presented plainly, the way the
     last problem of an ordinary line is.

     `solve` and `check` are appended by the caller rather than listed here,
     because every route ends in them and a chain that could omit them would be
     a chain that could strand a student. */
  function phaseChain(p) {
    if (!p || !p.pair) return ['read1', 'platform', 'read2', 'read3', 'ticket', 'plan'];
    if (p.fadeLevel === 'independent') return ['read1'];
    return ['read1', 'crossover', 'read2', 'read3', 'ticket', 'plan'];
  }

  /** The phase that follows `from`, or 'solve' when the chain runs out. */
  function phaseAfter(p, from) {
    var chain = phaseChain(p), i = chain.indexOf(from);
    return (i >= 0 && chain[i + 1]) ? chain[i + 1] : 'solve';
  }

  /* ---------- THE SCREENS AFTER THE ENGINE ROOM ----------

     `phaseChain` above is the pre-solve ladder and stops at the Engine Room.
     What came after it was written as a literal `['solve', 'check']` in
     `tools/sweep.js` and as a bare `go('check')` in three places here — which is
     the same two-copies-of-one-rule shape that the fade ladder had before
     `phaseChain` existed, and it meant a new post-solve screen would be
     invisible to the sweep while looking perfectly fine on screen.

     So the post-solve sequence is DERIVED here and both consumers read it. */
  function postSolve(p) {
    return critiqueOf(p) ? ['check', 'critique'] : ['check'];
  }

  /* ---------- CRITIQUE: the half of MP3 this site never had ----------

     The Common Core practice standard is "construct viable arguments AND
     CRITIQUE THE REASONING OF OTHERS." This site did the first — the student
     commits to a schema, an estimate and a method, and defends none of them to
     anybody. The second half had no home at all, and it was the one practice
     with no counterpart anywhere in the philosophy (see
     MR-FRACTION-PHILOSOPHY.md §6c.1b).

     WHY IT MATTERS MORE HERE THAN THE GAP SUGGESTS. This site exists to refute
     keyword strategies, and until now it did that by TELLING the student they
     fail — the Signal Failure is delivered as information. Handing them somebody
     else's wrong answer and asking what happened turns the founding argument
     from a claim the site makes into an exercise the student performs.

     NO NEW CONTENT IS AUTHORED, AND THAT IS THE DESIGN. Every step already
     carries misconceptions with a wrong `response` and a written `diagnosis`.
     Normally the site uses them to diagnose the student; here the student
     diagnoses somebody else. The machinery runs backwards, which is why this
     covers all 37 problems on the day it ships rather than the handful anyone
     would have got round to authoring. Measured before building: all 148
     materialisations carry at least three misconceptions on their last step, so
     there is always a subject and at least two distractors, and no problem needs
     an exemption.

     IT RUNS AFTER THE ENGINE ROOM, WHICH IS NOT AN AESTHETIC CHOICE. Showing a
     wrong answer to a student who has not yet solved would narrow the field for
     them — CLAUDE.md rule 3, no answer reaching a student before it is asked.
     After the Arrivals Board the answer is already theirs and nothing leaks. */
  function critiqueOf(p) {
    var steps = (p && p.engineRoom && p.engineRoom.steps) || [];
    if (!steps.length) return null;
    var last = steps[steps.length - 1];
    var mis = (last.misconceptions || []).filter(function (m) {
      return m && m.diagnosis && m.response !== undefined && m.response !== null;
    });
    // one to be the subject, and at least two to make the choice real
    if (mis.length < 3) return null;
    var salt = '|' + p.id + '|' + (p.numberSetIndex || 0);
    /* Picked with one seed and DISPLAYED with another. Shuffling once and
       taking [0] as the subject would have put the correct option first on
       every problem on the site — which is this project's most-repeated
       defect, shipped once on all six ratio tables after being written down
       twice. Two salts, and the position is measured after the fact. */
    var subject = shuffled(mis, seedFrom('critique-pick' + salt))[0];
    var order   = balancedOrder(mis, subject, p, 'critique');
    return { subject: subject, order: order, unit: (last.answer && last.answer.unit) || '' };
  }

  /* Turn authored feedback into a description of somebody else.

     76.9% of the 520 last-step diagnoses are written in the second person —
     "You divided 12 by 3" — because they were written to be said TO the
     student. Read back as options about another passenger they would accuse
     the reader instead.

     THE TRANSFORM IS SAFE FOR A REASON WORTH KNOWING, not by luck: English
     second-person and third-person-plural take the same verb form. You divide /
     they divide, you have / they have, and even you ARE / they ARE. So `you` ->
     `they` never leaves a verb disagreeing. The possessives and contractions go
     first because "your" contains "you". */
  function thirdPerson(s) {
    var out = String(s);
    [[/\byourselves\b/g, 'themselves'], [/\bYourselves\b/g, 'Themselves'],
     [/\byourself\b/g, 'themselves'],   [/\bYourself\b/g, 'Themselves'],
     [/\byours\b/g, 'theirs'],          [/\bYours\b/g, 'Theirs'],
     [/\byou(['’])re\b/g, 'they$1re'],  [/\bYou(['’])re\b/g, 'They$1re'],
     [/\byou(['’])ve\b/g, 'they$1ve'],  [/\bYou(['’])ve\b/g, 'They$1ve'],
     [/\byou(['’])ll\b/g, 'they$1ll'],  [/\bYou(['’])ll\b/g, 'They$1ll'],
     [/\byou(['’])d\b/g, 'they$1d'],    [/\bYou(['’])d\b/g, 'They$1d'],
     [/\byour\b/g, 'their'],            [/\bYour\b/g, 'Their'],
     [/\byou\b/g, 'they'],              [/\bYou\b/g, 'They']
    ].forEach(function (r) { out = out.replace(r[0], r[1]); });
    return out;
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
    /* Every screen of the first read is numberless — the Platform Check and the
       Crossover Read are both about the shape of the story, and a visible
       number invites arithmetic. On the island that matters more, not less: a
       student who can see the numbers will find the seam by spotting where the
       arithmetic changes, which is the one route to the answer that teaches
       nothing about reading. */
    return this.phase === 'read1' || this.phase === 'platform' || this.phase === 'crossover';
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

  /* AN ISLAND STOP IS A PLACE, AND THE HEADER USED TO NAME A DIFFERENT ONE.
     `MF.STATIONS` is keyed by mainland ROLE, and every island stop fell through
     to `reading` — so Cold Halt, Marsh Halt and Kelder Sands all sat under the
     eyebrow "The Reading Room" and the heading "Read it three times, each with
     a different job." For the whole stop: through the Crossover Read, both later
     reads, the Ticket Booth, the Plan, the estimate and the arithmetic.

     On the mainland that is coherent — the journey panel proves "The Reading
     Room" is the NAME OF STOP 1 and it becomes "The Drafting Table" at stop 2.
     On the island the stop is Cold Halt, the map says so, the story says so, and
     the header named somewhere else.

     Worst at an unstaffed halt, where the heading PROMISED THREE READS THAT
     NEVER COME. Cycle 30 found the drop into bare arithmetic reads as trust
     only by one sentence buried in a feedback panel, under a heading still
     advertising the scaffolding that had just been withdrawn. So the staffing
     goes in the heading, where it is unmissable and where the map's own words
     for it — "Assistance Available" / "No Assistance" — are finally repeated on
     the screen they describe. `Scenery.islandStops()` is the single source; the
     stop is found by id rather than listed, so a stop gaining a problem needs
     nothing here. */
  function islandHead(p) {
    if (!p || !p.pair || !(window.Scenery && Scenery.islandStops)) return null;
    var stops = Scenery.islandStops(), s = null;
    for (var i = 0; i < stops.length; i++) {
      if ((stops[i].ids || []).indexOf(p.id) >= 0) { s = stops[i]; break; }
    }
    if (!s) return null;
    return {
      name: s.name,
      /* Plain punctuation, no entities: `render()` passes this through `esc()`,
         so an `&mdash;` would reach the student as five literal characters. The
         mainland strategies are plain text for the same reason. */
      strategy: s.kind === 'halt'
        ? 'Two situations, joined. Nobody on the platform, so this one is yours.'
        : 'Two situations, joined. There is help on this platform if you want it.'
    };
  }

  Station.prototype.render = function () {
    var st = islandHead(this.p) || MF.STATIONS[this.role];

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
    /* AND IT HAPPENED AGAIN ON THE ISLAND, exactly as described above, which is
       why that paragraph is worth its length.

       A Crossover Island problem carries `line: "compare"` so that the scene
       library, the Ticket Booth and this header have something to render — and
       this header duly printed "The Compare Line · Larger − Smaller =
       Difference" above a Platform Check whose `fit` question now answers
       STACKED. The header was not merely leaking the first half; it was
       CONTRADICTING the answer the student was two screens from giving.

       Found by riding the island, not by reading the file. Every file involved
       was correct on its own — §13 again, and the second time this precise
       surface has done it.

       A paired problem therefore names its ROUTE too. Same treatment as the
       percent ride and for the same reason: honest (they are on the Challenge
       Line), silent about the answer, and the colour goes with it so the tint
       cannot say what the words no longer do. Ink rather than a line colour,
       because the island's track is neutral for the reason set out in
       scenery.js — a single colour would claim it is one of the five.

       The LEG MAP keeps `p.line` here for the same reason it does on a percent
       ride: `STOPS` is keyed by schema and has no `challenge` entry, so passing
       the route key there throws and kills the station. */
    var onPercentRoute = this.asksHiddenLine();
    var paired = !!this.p.pair;
    var route = paired ? MF.rideInfo(MF.CHALLENGE)
              : onPercentRoute ? MF.rideInfo(MF.PERCENT) : MF.LINES[this.p.line];
    var colour = paired ? 'var(--ink)'
               : onPercentRoute ? 'var(--line-percent)' : 'var(--line-' + this.p.line + ')';
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
            /* A PAIRED RIDE IS ON A DIFFERENT ISLAND, SO IT GETS A DIFFERENT
               MAP. This used to hand `p.line` to `legMap` and tint it neutral,
               which put a student standing on Crossover Island in front of a
               zoomed fragment of the MAINLAND Compare Line. The tint hid the
               colour; it could not hide the coastline, and the note here
               admitted as much — "the residual tell is the geometry, and it is
               real but weak". On the island there is no reason to carry it at
               all: `islandLeg` frames the actual stop, so the panel shows where
               the student actually is and the tell goes with it. */
            (paired
              ? Scenery.islandLeg(this.p.id, this.legProgress || 0, this.legIndex)
              : Scenery.legMap(Selector.availableLines(), this.p.line, this.legIndex,
                               this.legProgress || 0, this.legIndex,
                               onPercentRoute ? 'var(--line-percent)' : null)) +
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
      /* The paired stand-in for `platform`. A phase missing from THIS map
         renders nothing and raises nothing — the station simply goes blank —
         which is the same silent-omission failure `model.js` records across
         its three dispatches. */
      crossover: this.phCrossover,
      read2: this.phRead2, read3: this.phRead3,
      ticket: this.phTicket, plan: this.phPlan, demo: this.phDemo,
      solve: this.phSolve, check: this.phCheck,
      critique: this.phCritique
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
    /* `var line = p.line` used to live here and both call sites keyed off it.
       Deleted rather than left unused: a problem's line is no longer the whole
       answer key (see `optionTrue`), and a local called `line` sitting beside
       a key that no longer consults it is the next person's wrong turn. */

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
      var ok = optionTrue(o, self.p);

      /* TWO TRUE ANSWERS IS NOT A BUG HERE, IT IS THE EVIDENCE.

         On a paired problem `optionTrue` accepts an option that is true of
         EITHER half, so a question can have two right answers. Measured on
         `cl-signal-delay`: `kinds` accepts both "same" and "different", and
         `things` accepts both "separate" and "paired". Both replies are
         correct — "everything is measured in the same stuff" is true of the
         compare half, "change either and the other follows" is true of the
         rate half. Neither is wrong; each describes one end of the story.

         This was recorded as an open copy decision across five questions, on
         the assumption it would need five rewritten replies per problem. It
         does not. A story that answers this checklist two ways IS a story made
         of two situations, and the fifth question on this very screen asks
         exactly that. So the screen says so, and the note turns an apparent
         inconsistency into the reason for the next question.

         Derived from the option set, never authored: it fires wherever a
         question genuinely has more than one true answer, so a new pair whose
         halves collide on `shape` gets the same treatment with nothing added.
         It cannot fire on the mainland — all 30 problems there were measured
         at exactly one true option per question. */
      /* AN UNSTAFFED HALT CONFIRMS; IT DOES NOT EXPLAIN. User-found,
         2026-08-16: riding Marsh Halt "with No Assistance" produced a full
         rundown of the read and the reasoning, which is the one thing
         `CHALLENGE-MODE.md` §4 says a halt does not do — nobody walks the
         student to the seam.

         The Crossover Read was correctly skipped. Its TEACHING was arriving
         anyway, through three strings on `read1`, none of which consulted
         `fadeLevel`:

           1. the `fit` question's authored `yes` — which names both halves, in
              order, and what produces what. On `cl-buffet-crates` that is
              "the scaling is what produces the total being cut": the seam AND
              the transfer, handed over before the student has looked for
              either;
           2. the note below, which says in as many words that one answer fits
              the first part and one fits the rest;
           3. Mr Fraction's retelling at the end of the five.

         So a halt keeps the checklist — it is the aid a halt keeps, and it
         still marks right and wrong — and loses the prose that does the
         finding for them. The other four questions keep their replies: those
         are about the checklist itself, not about where this story turns. */
      var unaided = !!(self.p.pair && self.p.fadeLevel === 'independent');

      var alsoTrue = self.p.pair
        ? q.options.filter(function (x) { return x !== o && optionTrue(x, self.p); })
        : [];
      var both = (!unaided && ok && alsoTrue.length)
        ? '<br><br><strong>And so is &ldquo;' + alsoTrue[0].text + '&rdquo;.</strong> ' +
          'Both are true, because this story is doing two different things &mdash; one of them fits ' +
          'the first part and one fits the rest. That is worth holding on to: the last question ' +
          'down there asks about exactly that.'
        : '';

      /* The fifth question is the one that gives the seam away, so at a halt it
         is confirmed rather than explained. It still marks correct — the
         student is told they are right, and left to say why themselves. */
      var yesText = (unaided && q.id === 'fit')
        ? 'Two situations, joined. Finding where &mdash; and what crosses &mdash; is yours from here.'
        : o.yes;

      b.setAttribute('data-result', ok ? 'right' : 'wrong');
      b.querySelector('.marker').innerHTML = '&#9724;';
      host.querySelector('#cf' + qi).innerHTML = ok
        ? msg('go', '&#10003;', '<strong>Yes.</strong> ' + yesText + both)
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
           confirms the content.

           NOT AT AN UNSTAFFED HALT. `modelAnswer` is a retelling that names
           where the story turns — on `cl-lost-umbrellas`, "Then a second office
           at another station is mentioned". Read out at a halt it does the
           second read's work and the crossover's, on a screen the student
           reached by choosing to be unaided. */
        host.querySelector('#r1fb').innerHTML = unaided
          ? msg('info', '&rarr;',
              'All five done. Now read it again for yourself &mdash; where does this story stop ' +
              'doing one thing and start doing another?')
          : msg('info', '&rarr;',
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
      /* THREE DESTINATIONS, AND THE THIRD IS AN UNSTAFFED HALT.

         A paired problem goes to the Crossover Read and everything else to the
         Platform Check — the Crossover Read is the Platform Check's
         replacement, not an extra stop after it, so the two can never both run.

         And a paired problem at `fadeLevel: "independent"` goes to NEITHER.
         That is Crossover Island's unstaffed halt (`CHALLENGE-MODE.md` §4): no
         one on the platform, so nobody walks the student to the seam. They
         have just run the checklist on this screen — which is the one aid an
         unstaffed halt keeps — and finding where the story changes is now
         their own job.

         `fadeLevel` is the mechanism rather than a new flag because it is the
         mechanism this site already has for exactly this, and `ROADMAP` §6
         said so before any of it was built: the teaching stops and the unaided
         ones differ by how much scaffolding they give, not by whether they are
         unlocked. Nothing here is gated. */
      /* AN UNSTAFFED HALT NOW GOES STRAIGHT FROM THE CHECKLIST TO THE
         CALCULATION — user, 2026-08-16: "they should be able to go to an
         unstaffed station, receive the checklist, and then be asked to
         calculate without any guidance."

         THIS REVERSES A RULING RECORDED IN `CHALLENGE-MODE.md` §4, and the
         reversal is deliberate rather than a drift, so the old reasoning is
         kept here where anyone changing it back will read it. That section
         settled that the Three Reads STAY at a halt, because read3 is where a
         student names the question and this island's whole trap is answering
         the wrong one — stopping at the transfer, which is a correct number
         for a question nobody asked. Cutting read3 removes the last screen
         standing between a student and exactly that.

         The counter-argument, which is the one the user has taken: a halt that
         still walks you through two reads and the Ticket Booth is not an
         unaided stop, it is a staffed one with less commentary. If "no
         assistance" is to mean anything, this is where it has to mean it.

         THE ESTIMATE GOES TOO — second ruling, same day, after riding it. The
         first version of this kept `plan` because the estimate is a gate and
         Look Back compares against it. The user's answer: that is still
         scaffolding, and this stop is for "a student who wants to go straight
         to hard and get the bare minimum".

         What that costs, so nobody has to rediscover it: the Arrivals Board
         drops its first question rather than asking about a dash, and the
         "take it to the arrivals board" route out of the Engine Room cannot
         appear, because it exists to compare a wrong answer against an
         estimate that no longer exists. The hint ladder still ends every step
         by stating that step's answer, so nobody is stranded — that guarantee
         never depended on the estimate.

         The destination is not written here. `phaseAfter` owns the ladder, so
         this fork and the sweep's cannot drift again. */
      self.go(phaseAfter(self.p, 'read1'));
    });

    if (this.expandAll) {
      /* Test scaffolding: land every correct option so the sweep sees the
         revealed state. See phPlatform and VERIFICATION.md §2. */
      CHECKS.forEach(function (q, qi) {
        var oi = 0;
        q.options.forEach(function (o, i) { if (optionTrue(o, self.p)) oi = i; });
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
  /* ---------- THE CROSSOVER READ ----------
     `CHALLENGE-MODE.md` §3, and the user's own amendment to the plan: a new
     reading protocol that runs the EXISTING five-situations checklist twice,
     once on each half of the story.

     IT REPLACES THE PLATFORM CHECK RATHER THAN FOLLOWING IT, and that is the
     whole design decision in this file.

     The Platform Check's job is "prove from the text which line this is". On a
     two-line problem that job is not harder, it is DIFFERENT — the answer is
     two lines and an order, and the screen that asks for one would be asking a
     question with no true answer. Worse, it already had a leak waiting: its
     closing line reads "That is why this problem is on {the line}", built from
     `p.line`, which on a paired problem says "The Compare Line" — naming half
     the answer on the screen before the student has been asked for either
     half. So this stands in its place.

     It also keeps the screen COUNT the same as the mainland's. Five passes were
     specified; three of them live here, pass 1 is `read1` as it already was,
     and pass 5 — name the transfer without computing it — is the crossover
     slot in the Plan phase, which was built with the two-model picture. Adding
     two more screens would have made the island longer than every other line,
     on a phone, for a student who is already doing the hardest problem here.

     THREE STAGES, IN THIS ORDER, AND THE ORDER IS THE LESSON:
       1. WHERE does the story stop being one kind of thing? Tap that sentence.
       2. What kind is the part BEFORE it?
       3. What kind is the part AFTER it?

     Stage 1 first because it is a reading move, not a classifying one: you
     cannot run the checklist on a half until you know where the halves are.
     Stages 2 and 3 are the SAME five options asked twice, deliberately
     identical in wording, because the point a student has to leave with is
     that the checklist did not change — the stretch of story it was pointed at
     did. That is the reframing §3 asks for: the checklist classifies a stretch
     of text, not a problem.

     NUMBERLESS THROUGHOUT. `masked()` includes this phase for the same reason
     it includes read1 and platform — a student looking at numbers will find
     the seam by arithmetic and learn nothing about reading. */
  Station.prototype.phCrossover = function () {
    var self = this, p = this.p, pr = p.pair;
    if (!pr) { this.go('read2'); return; }

    /* The five, in a stable shuffled order, built from `MF.LINES` so a sixth
       schema would appear here automatically — and so the Challenge route,
       which is deliberately not in that object, cannot appear as an answer to
       itself. Salt measured below. */
    /* THE SALT WAS MEASURED, AND THE FIRST ONE WAS DEGENERATE ACROSS THE TWO
       HALVES. `|xo-half-N|` put the correct option at position 3 of 5 on BOTH
       questions — "tap the middle one, twice" scoring 100% against 4% by
       chance, on the sixth choice surface this project has built and the sixth
       time this defect has been in the first draft of one.

       Six salts measured, as [half 1, half 2]: |xo-half-N| [3,3],
       |half-N| [3,2], |side-N| [1,2], |part-N| [4,5], |xr-N| [3,1],
       |read-N| [4,2]. `|read-N|` is used: the two differ, and neither sits
       first or last.

       ▸ THAT IS ALL THAT CAN HONESTLY BE CLAIMED FROM ONE PROBLEM. Two data
         points cannot show a spread, and "never first, never last" is the same
         tell inverted (VERIFICATION.md §21) if it is ever applied as a rule
         rather than as this problem's measurement. RE-MEASURE ACROSS ALL SEVEN
         ISLAND PROBLEMS once they exist; the target is a flat-ish spread over
         five positions, not two comfortable numbers. */
    function lineOpts(stage) {
      return MF.seededShuffle(Object.keys(MF.LINES), p.id + '|read-' + stage + '|')
        .map(function (k) {
          var L = MF.LINES[k];
          return '<li><button class="choice" type="button" data-k="' + esc(k) + '"' +
            ' aria-label="' + esc(L.name + '. ' + L.form) + '">' +
            '<span class="marker" aria-hidden="true">' + L.marker + '</span>' +
            '<span><strong>' + esc(L.name) + '</strong><small>' + esc(L.form) + '</small></span>' +
            '</button></li>';
        }).join('');
    }

    this.host().innerHTML =
      MrFraction.aside('steady',
        '<p><strong>Still the first read, and this story needs a different one.</strong> ' +
        'On the five lines you read a problem once and asked what kind it is. This one is not a single ' +
        'kind, so asking that gets you two answers and neither of them is wrong.</p>' +
        '<p>So read it in two goes. First find the place it changes &mdash; then ask the same five ' +
        'questions on each side of that place.</p>') +
      '<div id="xr-story">' + this.problemHTML(false, true) + '</div>' +

      '<div class="section-head"><span class="eyebrow">The Crossover Read &middot; where it changes</span>' +
        '<h3>Tap the sentence where the story stops doing one thing and starts doing another.</h3>' +
        '<div class="rule"></div></div>' +
      '<p class="hint-text">Not where the numbers are. Where the <em>kind of thing happening</em> changes.</p>' +
      '<div class="feedback" role="status" id="xr-fb1"></div>' +

      '<div id="xr-half1" hidden>' +
        '<div class="section-head"><span class="eyebrow">The Crossover Read &middot; before the crossover</span>' +
          '<h3>Run the checklist on the FIRST part. What kind of situation is it?</h3>' +
          '<div class="rule"></div></div>' +
        '<ul class="choices" id="xr-opts1">' + lineOpts(1) + '</ul>' +
        '<div class="feedback" role="status" id="xr-fb2"></div>' +
      '</div>' +

      '<div id="xr-half2" hidden>' +
        '<div class="section-head"><span class="eyebrow">The Crossover Read &middot; after the crossover</span>' +
          '<h3>Now the same five questions, on the SECOND part.</h3>' +
          '<div class="rule"></div></div>' +
        '<p class="hint-text">The same checklist. A different stretch of the story.</p>' +
        '<ul class="choices" id="xr-opts2">' + lineOpts(2) + '</ul>' +
        '<div class="feedback" role="status" id="xr-fb3"></div>' +
      '</div>' +

      '<div id="xr-done" hidden>' +
        '<div class="msg msg-go"><span class="ico" aria-hidden="true">&#10003;</span><p>' +
        '<strong>That is the shape of it.</strong> ' + esc(pr.readWhy || '') + '</p></div>' +
        '<div class="btn-row"><button class="btn" id="xr-go" type="button">Second read &rarr;</button></div>' +
      '</div>';

    var host = this.host(), stage = 1;

    /* Which sentences belong to which half, decided by the crossover index and
       used to dim the half that is not being asked about. Derived, never
       authored twice: the manifest gives the index and everything else follows
       from it, so a story that gains a sentence cannot leave the highlight
       pointing at the wrong stretch. */
    function spotlight(from, to) {
      [].forEach.call(host.querySelectorAll('#xr-story [data-sent]'), function (b) {
        var i = +b.getAttribute('data-sent');
        b.setAttribute('data-half', (i >= from && i < to) ? 'on' : 'off');
      });
    }

    function pickSentence(b) {
      if (!b || stage !== 1) return;
      var i = +b.getAttribute('data-sent');
      var fb = host.querySelector('#xr-fb1');
      if (i !== pr.crossoverSentence) {
        b.setAttribute('data-result', 'wrong');
        fb.innerHTML = msg('caution', '&rarr;',
          '<strong>Not that one.</strong> Read it again and look for the sentence that stops describing ' +
          'the same kind of thing as the ones before it. Everything up to the crossover is doing one job; ' +
          'everything after it is doing another.');
        A11y.announce('Not that one.');
        return;
      }
      stage = 2;
      b.setAttribute('data-picked', 'yes');
      b.setAttribute('data-result', 'right');
      [].forEach.call(host.querySelectorAll('#xr-story [data-sent]'), function (x) {
        x.setAttribute('aria-disabled', 'true');
        x.removeAttribute('tabindex'); x.removeAttribute('role'); x.removeAttribute('aria-pressed');
      });
      fb.innerHTML = msg('go', '&#10003;', '<strong>That is the crossover.</strong> ' + esc(pr.crossoverWhy || ''));
      spotlight(0, pr.crossoverSentence);
      host.querySelector('#xr-half1').hidden = false;
      focusFeedback(host.querySelector('#xr-half1 h3'));
      A11y.announce('That is the crossover. Now the first part.');
    }

    host.querySelector('#xr-story').addEventListener('click', function (e) {
      pickSentence(e.target.closest('[data-sent]'));
    });
    host.querySelector('#xr-story').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      var b = e.target.closest('[data-sent]');
      if (!b) return;
      e.preventDefault();
      pickSentence(b);
    });

    /* A WRONG LINE IS ANSWERED WITH THAT LINE'S OWN SHAPE, not with a shrug.
       Authoring ten bespoke replies — five options across two halves, per
       problem — is what would actually happen: seven problems is seventy
       strings, and strings nobody wants to write get written thin. The line's
       own `form` is the honest thing to say back, and it is the same sentence
       the student saw on the map and at the Ticket Booth, so it teaches the
       schema rather than the problem. The CORRECT reply is authored per half,
       because that one is about this story and cannot be derived. */
    function wireHalf(n, want, why, next) {
      var wrap = host.querySelector('#xr-opts' + n);
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('[data-k]');
        if (!b || b.disabled) return;
        var k = b.getAttribute('data-k'), fb = host.querySelector('#xr-fb' + (n + 1));
        if (k !== want) {
          b.setAttribute('data-result', 'wrong');
          fb.innerHTML = msg('caution', '&rarr;', '<strong>Not that one.</strong> ' +
            esc(MF.LINES[k].name) + ' is ' + esc(MF.LINES[k].form) + ' &mdash; ' +
            esc(MF.LINES[k].desc.charAt(0).toLowerCase() + MF.LINES[k].desc.slice(1)) +
            ' Read that part of the story again and ask whether that is what it is doing.');
          A11y.announce('Not that one.');
          return;
        }
        [].forEach.call(wrap.querySelectorAll('[data-k]'), function (x) { x.disabled = true; });
        b.setAttribute('data-result', 'right');
        fb.innerHTML = msg('go', '&#10003;', '<strong>Yes.</strong> ' + esc(why || ''));
        next();
      });
    }

    wireHalf(1, pr.first, pr.firstWhy, function () {
      stage = 3;
      spotlight(pr.crossoverSentence, p.problem.sentences.length);
      host.querySelector('#xr-half2').hidden = false;
      focusFeedback(host.querySelector('#xr-half2 h3'));
      A11y.announce('Now the second part.');
    });
    wireHalf(2, pr.second, pr.secondWhy, function () {
      spotlight(0, p.problem.sentences.length);
      host.querySelector('#xr-done').hidden = false;
      host.querySelector('#xr-go').addEventListener('click', function () { self.go('read2'); });
      focusFeedback(host.querySelector('#xr-done .msg'));
    });
  };

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

  /* ============================================================
     WHERE THE CORRECT OPTION SITS — DESIGNED, NOT DRAWN

     The user, riding the site: "are these correct answers randomized? It
     always seemed to be the middle option."

     The shuffle was checked first and exonerated: over 12,000 seeds all six
     permutations of a three-item list fall between 16.0% and 17.2% against an
     expected 16.7%. The generator is uniform. But the site does not take 12,000
     draws — it takes about 148 per surface, once, and then that is what every
     student sees forever. Three independent surfaces all came out middle-heavy
     by 5 to 7 points, which is inside sampling noise individually and is
     exactly what a student would perceive as a pattern.

     A fair coin does not owe you a flat sample. So the position is no longer
     sampled at all: it is ASSIGNED, cycling through the slots so the site's
     actual distribution is flat by construction, and only the distractors are
     shuffled around it. This is the same move the project already made for
     number sets — design the distribution rather than hoping for it.

     WHY IT IS NOT LEARNABLE. The slot comes from a dense ordinal over
     (problem, number set), offset per surface so read 3, the Ticket Booth and
     the critique never move in step. A student cannot see their problem's
     ordinal or their set index, and the same problem gives a different slot in
     a different set. What they can see — "it was the middle last time" — is
     precisely what this removes.

     `VERIFICATION.md` rule 1: measured after, not asserted. ============ */

  var ORDINALS = null;
  function ordinalOf(p) {
    if (!ORDINALS) {
      ORDINALS = {};
      Object.keys(MF.problems).sort().forEach(function (id, i) { ORDINALS[id] = i; });
    }
    var sets = MF.setCount ? (MF.setCount(MF.problems[p.id]) || 4) : 4;
    return (ORDINALS[p.id] || 0) * sets + (p.numberSetIndex || 0);
  }

  function surfaceOffset(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) >>> 0; }
    return h;
  }

  /** Correct option placed at a balanced slot; the rest shuffled around it. */
  function balancedOrder(items, correct, p, surface) {
    var n = (items || []).length;
    if (n < 2 || correct == null) return (items || []).slice();
    var rest = items.filter(function (x) { return x !== correct; });
    var slot = (ordinalOf(p) + surfaceOffset(surface)) % n;
    var mix = shuffled(rest, seedFrom(surface + '|' + p.id + '|' + (p.numberSetIndex || 0)));
    var out = [], k = 0;
    for (var i = 0; i < n; i++) out.push(i === slot ? correct : mix[k++]);
    return out;
  }

  Station.prototype.phRead3 = function () {
    var self = this, r3 = this.p.threeReads.read3;
    /* SALTED WITH THE NUMBER SET, and it was not before.
       `seedFrom(p.id + '|read3')` froze this list: one arrangement per problem,
       identical on every ride, in every number set, for every student, forever.
       The shuffle itself is fair — 12,000 seeds put all six permutations of a
       three-item list between 16.0% and 17.2% against an expected 16.7% — but a
       fair draw taken ONCE and then frozen is not the same as a fair draw. Any
       accidental clustering in those 148 draws became permanent and shared, and
       measured across the site it ran middle-heavy: the correct option sat in
       position 2 on 32% of read 3 screens against a 25% baseline.
       That is inside sampling noise for n=148 and it was still worth fixing,
       because a student meets three of these in a trip and a frozen arrangement
       is the one kind of noise they can learn. Found by the user, from riding
       the site, which is where every pattern defect on this project has come
       from. */
    var r3opts = r3.options || [];
    var order = balancedOrder(r3opts, r3opts.filter(function (o) { return o.correct; })[0], this.p, 'read3');
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
    // Balanced by construction, same as read 3 — see `balancedOrder`.
    var carOpts = tb.unknownCarOptions || [];
    var choices = balancedOrder(carOpts, tb.unknownCarAnswer, this.p, 'car');
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
      /* THE BOOTH AND TICKET ART USED TO SIT HERE AND WAS REMOVED ON THE
         USER'S CALL (2026-08-16). The argument for it was that this phase IS
         the Ticket Booth, so the art named the place rather than decorating
         it. What that argument left out is where the art SAT: between Mr
         Fraction's aside and the problem text, so every ride pushed the story
         — and the question about it — down behind 200px of picture on a
         screen the student has already met at the route window, where the same
         booth is drawn beside the choice it illustrates.

         Whether it looked right was never mine to decide; that the screen now
         starts on the story is the point of removing it.

         WHAT REMAINS ON THIS SCREEN, measured rather than assumed, because
         emptying a surface by deleting what was on it is this project's most
         repeated way of "fixing" something. First element is the problem text
         itself — Mr Fraction is a floating companion and was never a child of
         this host — then the line box naming the line and its form, the "which
         car is missing" question, its three options and the feedback panel.
         On the percent route the hidden-line question comes first with all of
         that behind it, eight options across the two. Checked on an ordinary
         problem, a percent ride and an island problem: no art band on any of
         them and every other part still present. Nothing depended on the
         figure, and no rule, gate or announcement referred to it. */
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
      /* THE GATE IS A BAND ON A LINE NOW, with a typed field beside it and a
         scratch pad that nothing reads. `ROADMAP` §8 and `docs/ESTIMATE-INPUT.md`.
         Everything downstream is unchanged: `this.estimate` is still the parsed
         number and `this.estimateRaw` is still what the student saw. */
      Estimate.html(this.p) +
      '<div class="feedback" role="status" id="pfb"></div>' +
      '<div class="btn-row"><button class="btn" id="pgo" type="button">Lock it in →</button></div>';

    if (bar) Model.wire(this.host(), this.p);
    Estimate.wire(this.host(), this.p);

    var locked = false;
    this.host().querySelector('#pgo').addEventListener('click', function () {
      if (locked) { self.go(self.nextAfterPlan()); return; }
      /* THE GATE READS THE CONTROL, NOT THE MARKUP. It used to reach for
         `#estv`.value directly, which coupled the one gate every problem passes
         through to an element id — and the day that id moved, the gate would
         have refused every estimate on the site. `Estimate.value()` is the same
         door the pointer, the keyboard, a typed entry and the sweep all use. */
      var v = Estimate.value();
      var raw = Estimate.raw();
      if (v === null || !isFinite(v)) {
        self.host().querySelector('#pfb').innerHTML = msg('caution', '!',
          'Sweep a stretch on the line, or type a number &mdash; anything you think is in the right area.');
        var t = self.host().querySelector('#est-track');
        if (t) t.focus();
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
      /* NO "ONE WAY TO THINK ABOUT IT" AT AN UNSTAFFED HALT. It is guidance on
         how to arrive at the estimate, which is precisely what a student who
         came here for no assistance did not ask for — and on a paired problem
         it tends to describe the route through both halves. The estimate is
         still required; only the coaching goes. */
      var unaided = !!(self.p.pair && self.p.fadeLevel === 'independent');
      var reasoning = (!unaided && est && est.modelReasoning)
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
      /* SOMEWHERE TO WORK IT OUT, BESIDE THE PLACE YOU TYPE IT (user,
         2026-08-16). The same pad as the estimate, from the same code, WITHOUT
         a number line — there is nothing to sweep when you are calculating, and
         the whole point of §8 was that the two acts should not look alike. This
         is a step's working, so it clears with every step, as scratch paper
         does. Never parsed, never graded, never required. */
      /* PAD LEFT, FIELD RIGHT — the same swap as the estimate screen and for
         the same reason: Mr Fraction floats at the viewport's bottom-right, the
         pad is the tall element that reaches him, and moving it costs nothing
         where shrinking it cost a third of its width. */
      '<div class="solve-wrap">' +
        /* No custom label: both pads carry the same one, so a student meets the
           same surface described the same way on both screens. */
        Scratch.html('solve-pad') +
        '<div class="field">' +
          '<label for="ans">Your answer' + (step.answer.unit ? ' (' + esc(step.answer.unit) + ')' : '') + '</label>' +
          '<input type="text" id="ans" inputmode="decimal">' +
        '</div>' +
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

    Scratch.wire(this.host(), 'solve-pad');

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
        /* EVERY BRANCH BELOW SETS ITS OWN ANNOUNCEMENT, and that is a fix as
           well as a convenience. There used to be a single
           `A11y.announce('Not correct. Feedback shown.')` after the chain, which
           meant a screen-reader user who mistyped was told their MATHS was wrong
           when it was their TYPING (Cycle 30, finding C-6) — and it would have
           silently overridden the near-miss message below. What is announced now
           matches what is on screen in every case. */
        var say = 'Not correct. Feedback shown.';
        var mis = MF.matchMisconception(raw, step.misconceptions);
        if (mis) {
          self.m.misconceptions.push(mis.tag);
          fb.innerHTML = msg('stop', '→', esc(mis.diagnosis));
        } else if (res.reason === 'scale') {
          fb.innerHTML = msg('caution', '→',
            'You&rsquo;ve got the right digits but the wrong scale &mdash; check whether you want a percent or a decimal.');
          say = 'Right digits, wrong scale.';
        } else if (res.reason === 'near') {
          /* THE ONE MESSAGE ON THIS SCREEN THAT SENDS A STUDENT SOMEWHERE OTHER
             THAN BACK TO THE PLAN. See `checkAnswer` for why the reason exists.

             The wording is careful on purpose and should stay careful. It does
             NOT say "your structure was right" — nothing here knows that, and a
             false reassurance is worse for this audience than the neutral
             message this replaced. It says the number is close, that this
             USUALLY means the arithmetic rather than the plan, and it names
             which of the two to go back over. That last part is the whole value:
             every other branch points at the plan, and this one points at the
             calculation. `caution` rather than `stop` for the same reason. */
          fb.innerHTML = msg('caution', '→',
            '<strong>That&rsquo;s close.</strong> Near enough that the plan is probably right and ' +
            'something slipped in the working. Go back over the calculation rather than the ' +
            'plan &mdash; and there&rsquo;s a hint if you want one.');
          say = 'Close. Check the calculation rather than the plan.';
        } else if (res.reason === 'unparsed') {
          fb.innerHTML = msg('caution', '!', 'I couldn&rsquo;t read that as a number. Try something like 12, 3/4, 0.75 or 75%.');
          say = 'I could not read that as a number.';
        } else {
          fb.innerHTML = msg('stop', '→',
            'Not this time. Look back at what this step is asking for &mdash; and there&rsquo;s a hint if you want one.');
        }
        wrongTries++;
        offerBoard();
        A11y.announce(say);
      }
    });
  };

  /* ---------- Phase 5: Critique — somebody else's working ---------- */

  Station.prototype.phCritique = function () {
    var self = this, c = critiqueOf(this.p);
    if (!c) { this.onComplete(); return; }          // never strand the ride

    var unit = c.unit ? ' ' + c.unit : '';
    var opts = c.order.map(function (m, i) {
      var text = thirdPerson(m.diagnosis);
      return '<li><button class="choice" type="button" data-cq="' + i + '" aria-label="' + esc(text) + '">' +
        '<span class="marker" aria-hidden="true">&#9723;</span>' +
        '<span>' + esc(text) + '</span></button></li>';
    }).join('');

    this.host().innerHTML =
      MrFraction.aside('thinking',
        '<p><strong>One last thing before you go.</strong> Reading somebody else&rsquo;s working is the ' +
        'same skill as checking your own &mdash; it is just easier to see from the outside.</p>') +
      this.problemHTML(false) +
      '<h3>Another passenger answered ' + esc(String(c.subject.response)) + esc(unit) + '</h3>' +
      '<p class="hint-text">They were working on this same question. Every one of these is a real mistake ' +
      'somebody makes here &mdash; which one would land them on that number?</p>' +
      '<ul class="choices" id="cqopts">' + opts + '</ul>' +
      '<div class="feedback" role="status" id="cqfb"></div>';

    /* Counted here rather than in the handler's closure-free scope so a second
       click cannot restart the count. Guarded on read because `tools/sweep.js`
       drives stations with `{}` for metrics — an unguarded `.push` throws
       INSIDE the listener, where it looks exactly like a phase that renders
       nothing. That is a recorded trap on this project, not a hypothetical. */
    var cqTries = 0;

    this.host().querySelector('#cqopts').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cq]'); if (!b || b.disabled) return;
      var m = c.order[+b.getAttribute('data-cq')];
      var fb = self.host().querySelector('#cqfb');
      cqTries++;

      if (m === c.subject) {
        if (self.m && self.m.critiqueAttempts) {
          self.m.critiqueAttempts.push(cqTries);
          if (cqTries === 1) self.m.critiqueFirstTry++;
        }
        b.setAttribute('data-result', 'right');
        var all = self.host().querySelectorAll('[data-cq]');
        for (var i = 0; i < all.length; i++) all[i].disabled = true;
        fb.innerHTML = msg('go', '✓',
          '<strong>That&rsquo;s the one.</strong> Working out what somebody else did wrong is the ' +
          'same move as checking your own answer &mdash; you are asking what a number would have to ' +
          'mean for that working to be right.') +
          '<div class="btn-row"><button class="btn" id="cqgo" type="button">Finish this stop →</button></div>';
        self.host().querySelector('#cqgo').addEventListener('click', function () {
          self.m.stationsDone++;
          self.onComplete();
        });
        A11y.announce('That is the one.');
      } else {
        /* The wrong-answer reply names the number THAT explanation produces.
           It is true, it is already on the manifest, and it means an
           elimination guess still teaches something on the way past. */
        b.setAttribute('data-result', 'wrong');
        b.disabled = true;
        fb.innerHTML = msg('stop', '→',
          '<strong>Not that one.</strong> That mistake is real, but it would have landed them on ' +
          esc(String(m.response)) + esc(unit) + ' instead.');
        A11y.announce('Not that one.');
      }
      focusFeedback(fb);
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

    /* An unstaffed halt never sets an estimate, so this screen has one fewer
       check and the headings renumber. `n()` keeps the numbering derived rather
       than authored twice — the version of this that hardcoded 1..5 and then
       1..4 in a second branch is exactly how a screen ends up with two "3"s. */
    var hasEst = est !== null && est !== undefined;
    function n(i) { return hasEst ? i + 1 : i; }

    this.host().innerHTML =
      MrFraction.aside('steady', '<p><strong>Arrivals board.</strong> ' +
        'This is the stop everyone skips. It&rsquo;s also the one that catches mistakes.</p>') +
      /* The caboose is the last car on the train, which is exactly what this
         phase is — the end of the trip, looking back down it. */
      '<figure class="art-band art-band-end">' +
        Scenery.art('Mr_Fraction_Caboose.png', 'art-caboose') +
      '</figure>' +
      /* NO ESTIMATE, NO ESTIMATE QUESTION. An unstaffed halt never sets one
         (see the ladder in `phaseChain`), and this screen used to render "You
         estimated —" above two buttons asking whether that matched, then hide
         the other three checks behind answering it. A question about a value
         that does not exist is not a check; it is a dead end with a dash in it.

         So the board opens on "did you answer the question that was asked?"
         instead, the rest is visible from the start, and the numbering closes
         up. Everything else on the screen is identical — the estimate check is
         the only part of Look Back that needed one. */
      (hasEst
        ? '<h3>1. Does it match your estimate?</h3>' +
          '<p>You estimated <strong>' + esc(this.estimateRaw || est) + '</strong>. ' +
            'The answer is <strong>' + esc(a.answer.exact) + ' ' + esc(a.answer.unit || '') + '</strong>.</p>' +
          '<ul class="choices" id="estck">' +
            '<li><button class="choice" type="button" data-v="yes" aria-label="Yes, my estimate was in the right area">' +
              '<span><strong>Yes &mdash; my estimate was in the right area</strong></span></button></li>' +
            '<li><button class="choice" type="button" data-v="no" aria-label="No, they do not match">' +
              '<span><strong>No &mdash; they don&rsquo;t match</strong></span></button></li>' +
          '</ul>' +
          '<div class="feedback" role="status" id="ckfb"></div>'
        : '<p>The answer is <strong>' + esc(a.answer.exact) + ' ' + esc(a.answer.unit || '') + '</strong>.</p>') +
      '<div id="rest"' + (hasEst ? ' hidden' : '') + '>' +
        '<h3>' + n(1) + '. Did you answer the question that was asked?</h3>' +
        '<p>' + esc(a.questionCheck) + '</p>' +
        '<h3>' + n(2) + '. Units</h3>' +
        '<p>The answer is in <strong>' + esc(a.unitsCheck) + '</strong>. Did yours have that label?</p>' +
        '<h3>' + n(3) + '. Is it reasonable?</h3>' +
        '<p>' + esc(a.reasonablenessCheck) + '</p>' +
        (a.reasonablenessFailExample ? '<p class="hint-text">' + esc(a.reasonablenessFailExample) + '</p>' : '') +
        /* The `why` stays behind a click on purpose. The prompt is a real
           question, and a student who reads the explanation off the same
           screen has not been asked anything — the same reason the Test
           Track's worked example hides behind "Show me". */
        (sf ? '<h3>' + n(4) + '. The signal that failed</h3>' +
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

    /* DONE IS BOUND WHERE IT IS ALWAYS REACHABLE. It used to be bound inside
       the estimate-check handler, which was safe only while every route
       through this screen had an estimate to check. Without one there is no
       `#estck` to click, and the button that leaves the station would never
       have acquired a listener — a dead end at the end of the ride, on the
       stop built for the student least likely to ask for help. */
    this.host().querySelector('#donebtn').addEventListener('click', function () {
      /* The Arrivals Board is no longer always the last screen. Where there is
         material for it, the critique runs after Look Back and owns the exit —
         including `stationsDone`, which must be incremented exactly once and is
         therefore incremented in whichever screen actually finishes the stop.
         `postSolve` is the one place that decides which that is. */
      if (postSolve(self.p).indexOf('critique') >= 0) { self.go('critique'); return; }
      self.m.stationsDone++;
      self.onComplete();
    });

    /* ONE MISJUDGEMENT USED TO END THIS SCREEN FOR GOOD. Both buttons were
       disabled on any click, and the wrong branch then said "Look at the two
       numbers again side by side. Are they in the same ballpark or not?" — a
       question the student had just been made unable to answer. Cycle 30.

       That mattered more here than the same bug would anywhere else. The Engine
       Room never lets a wrong answer through, so THIS is the only place on the
       site where a student can catch their own error, and `m.selfChecks` — the
       trip report's headline "You caught N things at the arrivals board" — has
       only two increment sites, of which this is one.

       So a wrong self-assessment now disables only the button that was pressed.
       The other stays live, the question stays answerable, and the student can
       record what they actually see. The METRIC still only counts a first-try
       catch: getting there on the second go is worth doing and worth saying so,
       but it is not the same as having spotted it, and a headline number that
       counts both would be flattering rather than true. */
    var selfChecked = false;
    if (hasEst) this.host().querySelector('#estck').addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var said = b.getAttribute('data-v') === 'yes';
      var truth = inRange === null ? said : inRange;
      var correct = said === truth;
      var firstTry = !selfChecked;
      selfChecked = true;
      if (correct && firstTry) self.m.selfChecks++;

      if (correct) {
        var all = self.host().querySelectorAll('#estck [data-v]');
        for (var i = 0; i < all.length; i++) all[i].disabled = true;
      } else {
        b.disabled = true;   // not this one again; the other is still open
      }
      b.setAttribute('data-result', correct ? 'right' : 'wrong');

      var text = correct
        ? (truth ? '<strong>Right &mdash; and that&rsquo;s worth noticing.</strong> Your estimate and your answer agree, which is good evidence you didn&rsquo;t slip somewhere.'
                 : '<strong>Good catch.</strong> Spotting that your estimate and answer disagree is exactly the skill this station is for. It means you&rsquo;d have known to check.')
        : 'Look at the two numbers again side by side. Are they in the same ballpark or not?';
      self.host().querySelector('#ckfb').innerHTML = msg(correct ? 'go' : 'caution', correct ? '✓' : '→', text);
      self.host().querySelector('#rest').hidden = false;
      A11y.announce(correct ? 'Checked.' : 'Have another look.');
      focusFeedback(self.host().querySelector('#ckfb'));
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

  /* CHECK and optionTrue are exported for the CHECKERS, not for the app —
     `data.js` gates a paired problem on the `fit` replies being written, and
     the sweep needs to ask the same answer-key question the student's screen
     asks. A checker that reimplements the key is a checker that can disagree
     with the thing it is checking (VERIFICATION.md §33). */
  global.Stations = { Station: Station, msg: msg, esc: esc, el: el,
                      CHECK: CHECK, optionTrue: optionTrue,
                      /* Exported so `tools/sweep.js` renders the phases a
                         student can actually reach rather than keeping its own
                         copy of the fork. See `phaseChain`. */
                      phaseChain: phaseChain, phaseAfter: phaseAfter,
                      /* Exported so `tools/sweep.js` reads the post-solve
                         sequence rather than keeping its own copy of it. */
                      postSolve: postSolve, critiqueOf: critiqueOf,
                      thirdPerson: thirdPerson };
})(window);
