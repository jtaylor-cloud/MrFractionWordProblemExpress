/* CROSSOVER ISLAND · problem 1 · COMPARE → RATE · the transfer is a gap that IS a rate
   The first two-line problem on the site. `CHALLENGE-MODE.md` is the plan; this
   is the content half of its §9, which says to build ONE problem end to end
   before the other six exist, because one that runs proves the engine and seven
   that validate prove nothing.

   WHY THIS PAIR IS FIRST. The user named it, and it is the sharpest case on the
   list: the Compare half produces a DIFFERENCE, and the difference is not the
   answer — it is a rate, which the second half then scales. A student who does
   not see the crossover reads the whole story as one comparison and answers
   with the gap. That is the mode's entire thesis inside one problem, and it is
   why `mStop` below is the primary distractor.

   THE TRANSFER is the gap in minutes. It is an ANSWER on one side of the
   crossover (step 1) and a GIVEN on the other (step 2), which is the property
   the whole island rests on and the reason `tools/sweep.js` needed a new rule
   before this file could be written.

   ▸ PUBLISHED 2026-08-16, WHEN CROSSOVER ISLAND OPENED — and the reason it
     was draft until then is worth keeping, because it is the reason this is
     safe now. `Selector` pools `MF.publishedProblems()`, so a published
     two-line problem carrying `line: "compare"` would be dealt into ordinary
     Compare Line rides, where the station header says Compare and the Platform
     Check answers `stacked`. What changed is not the risk but the pool:
     `buildTrip` now excludes any problem carrying a `pair`, so this reaches a
     student only through the island's own map. That exclusion is the thing to
     check if this problem ever turns up somewhere it should not.

   ▸ `line: "compare"` IS PROVISIONAL AND IS THE FIRST HALF ONLY. A Challenge
     problem has no single line; it has `pair`. But the station header, the
     scene dispatch and the Ticket Booth all read `p.line` today, so it carries
     one to stay renderable. The island routes by `pair`.

   ▸ WHAT IS DELIBERATELY MISSING, so nobody reads it as an oversight:
     - No `testTrack`. The Test Track kinds are `section`/`cross`/`drive`/
       `compare`, all of them single-situation. A Challenge demo has to
       demonstrate the CROSSOVER, which is a new kind and is not written.
     - The Plan phase draws the Compare model only. The two-model plan with the
       transfer slot between them is `CHALLENGE-MODE.md` §6.1 and is the
       largest remaining piece of engine work. What renders today is honest as
       far as it goes: it is the first half's picture.
     - No Crossover Read. The five passes are §3 of that document. This problem
       runs through the ordinary Three Reads until they exist.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
   The express reaches Kelder first and carries on up the line; the question is
   how far past Kelder it has got when the local finally pulls in. So the gap in
   minutes is exactly the time the express spends running on alone.

     set 1: 47 − 32 = 15 min · 15 ÷ 3 = 5 · 5 × 2 = 10 miles   (10 ÷ 2 × 3 = 15 ✓)
     set 2: 53 − 41 = 12 min · 12 ÷ 4 = 3 · 3 × 3 =  9 miles   ( 9 ÷ 3 × 4 = 12 ✓)
     set 3: 58 − 40 = 18 min · 18 ÷ 6 = 3 · 3 × 5 = 15 miles   (15 ÷ 5 × 6 = 18 ✓)
     set 4: 44 − 24 = 20 min · 20 ÷ 5 = 4 · 4 × 4 = 16 miles   (16 ÷ 4 × 5 = 20 ✓)

   CONSTRAINTS THE SETS ARE BUILT TO, all four checked:
     - the gap divides exactly by the rate's minutes, so no step lands on a
       fraction of a mile;
     - the final answer differs from both step answers, from every given, and
       from all three misconception values, so each diagnosis names exactly one
       mistake;
     - the gap differs from the final answer in every set — otherwise stopping
       at the transfer would score, which is the one error this problem exists
       to catch;
     - journey times stay plausible for a branch line, and the rates stay
       between 24 and 48 mph, which they do: 40, 45, 50, 48.

   ONE COLLISION WORTH KNOWING ABOUT, because it looks like a defect and is not:
   set 1's gap is 15 and set 3's ANSWER is 15. They are different sets and are
   never materialised together, and the leak scan works per materialisation —
   but it means no pre-solve copy anywhere in this file may print a bare 15. */
MF.registerProblem({
  id: "cl-signal-delay",
  schemaVersion: 1,
  status: "published",
  title: "How far past Kelder the express has got",
  line: "compare",
  topics: ["two-line", "crossover", "difference-unknown", "rate", "transfer"],
  steps: 2,

  /* WHAT MAKES THIS A CHALLENGE PROBLEM. `data.js` refuses a pair whose halves
     are the same kind — that would be one situation taking two steps, which is
     what `CHECK.fit`'s reply teaches is NOT the same thing — and refuses one
     with no transfer named. `stations.js` reads it and inverts the Platform
     Check's `fit` question: `stacked` becomes the correct answer here. */
  pair: {
    first: "compare",
    second: "ratio",
    transfer: "the gap in minutes between the two trains",

    /* THE CROSSOVER READ'S ANSWER KEY. `crossoverSentence` is the index of the
       sentence where the story stops doing one kind of thing and starts doing
       another — sentence 4, where it leaves the two journey times behind and
       states a rate. Sentence 3 (the carriages) sits across the seam on
       purpose, so the crossover cannot be found by counting.

       The three `why` strings are the only replies authored here. A WRONG line
       is answered from that line's own `form` and `desc`, which is honest, is
       the same sentence the student has seen on the map, and does not turn
       into seventy thin strings across seven problems. The correct replies
       cannot be derived, because they are about this story. */
    crossoverSentence: 4,
    /* NO NUMBER WORDS IN ANY OF THESE. They render on the Crossover Read,
       which is numberless, and the first draft of all four broke it — "two
       journey times", "Two amounts", "half the minutes", "One story". The
       validator did not catch it until the rule was extended to cover this
       block, which is how they shipped. Watch for "half" especially: "the
       first half hands the second half a number" is the natural sentence here
       and it is refused. */
    crossoverWhy: "Everything before it is the journey times set against each other. From here on the story stops comparing anything and starts telling you how the express keeps going — so many miles for so many minutes. Same train, different kind of question.",
    firstWhy: "Amounts set side by side and the space between them left unsaid. Nothing is changing, nothing repeats, and there is no total either of them is part of.",
    secondWhy: "Miles measured against minutes, and the relationship holds at any size — scale the minutes down and the miles come down with them. That is what makes it a rate rather than the same thing happening over and over.",
    readWhy: "A single story doing separate jobs: amounts side by side first, and a rate after. They are joined at the sentence you found, and the earlier part hands the later part a number. That number is the next thing to look for."
  },

  unknownCar: "difference",
  context: "delays",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible while it is the only two-line problem on the site: a hub that offered it would be offering a mode with no teaching stops behind it.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n1", "-", "n2", "=", "gap"],
    ["gap", "+", "n2", "=", "n1"],
    ["gap", "/", "n3", "=", "units"],
    ["units", "*", "n4", "=", "ans"],
    ["n1", "+", "n2", "=", "mSum"],
    ["gap", "*", "n4", "=", "mScale"]
  ],

  numberSets: [
    { numbers: { n1: "47", n2: "32", n3: "3", n4: "2", n5: "6" },
      derived: { gap: "15", units: "5", ans: "10", mSum: "79", mScale: "30" },
      estimate: { min: 5, max: 20 } },
    { numbers: { n1: "53", n2: "41", n3: "4", n4: "3", n5: "5" },
      derived: { gap: "12", units: "3", ans: "9", mSum: "94", mScale: "36" },
      estimate: { min: 4, max: 18 } },
    { numbers: { n1: "58", n2: "40", n3: "6", n4: "5", n5: "7" },
      derived: { gap: "18", units: "3", ans: "15", mSum: "98", mScale: "90" },
      estimate: { min: 7, max: 30 } },
    { numbers: { n1: "44", n2: "24", n3: "5", n4: "4", n5: "4" },
      derived: { gap: "20", units: "4", ans: "16", mSum: "68", mScale: "80" },
      estimate: { min: 8, max: 32 } }
  ],

  problem: {
    /* THE STORY IS BUILT SO THE CROSSOVER IS FINDABLE BY READING, which is what
       the whole mode is for. Sentences 1 and 2 set two amounts side by side and
       nothing else — a Compare, with the gap unstated. Sentence 4 stops
       comparing and states a relationship that holds at any size, which is a
       Rate. The seam is between them, and sentence 3 sits across it on purpose:
       a distractor there means the seam cannot be found by counting sentences.

       No adjective ranks the trains. "Express" and "local" are the names on the
       timetable and the student meets both across the site; nothing here calls
       one fast or slow, because which is quicker is the story's to say through
       its numbers and not the prose's to give away on a numberless screen. */
    text: "The express and the local both leave Thorne Bridge for Kelder at the same time. The local takes {{n1}} minutes to get there. The express takes {{n2}} minutes. There are {{n5}} carriages on the local, and the buffet is in the last one. Once the express reaches Kelder it does not stop for long, and it carries on up the line covering {{n4}} miles every {{n3}} minutes. How far past Kelder has the express got by the time the local pulls in?",
    sentences: [
      "The express and the local both leave Thorne Bridge for Kelder at the same time.",
      "The local takes {{n1}} minutes to get there.",
      "The express takes {{n2}} minutes.",
      "There are {{n5}} carriages on the local, and the buffet is in the last one.",
      "Once the express reaches Kelder it does not stop for long, and it carries on up the line covering {{n4}} miles every {{n3}} minutes.",
      "How far past Kelder has the express got by the time the local pulls in?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "47", unit: "minutes",   role: "larger",     spoken: "47" },
      n2: { value: "32", unit: "minutes",   role: "smaller",    spoken: "32" },
      n3: { value: "3",  unit: "minutes",   role: "rate-time",  spoken: "3" },
      n4: { value: "2",  unit: "miles",     role: "rate-dist",  spoken: "2" },
      n5: { value: "6",  unit: "carriages", role: "distractor", spoken: "6" }
    },
    context: { setting: "railway branch line", requiresCulturalKnowledge: false }
  },

  /* `delays` draws minutes, and minutes cannot be counted off a picture — which
     is what makes it safe on the two numberless screens. It is the first half's
     scene; the second half has no art, because a picture of the rate would have
     to draw a distance derived from the gap, and that is the answer to step 1
     rendered as geometry. */
  /* Its own art now. This carried `delays`, which is `cp-late-trains`'s picture
     from the Compare Line — this problem's own first-half line — and it renders
     on read1 where the checklist is being run. See `challenge-scenes.js`. */
  scene: {
    mode: "anim", art: "signalbox",
    caption: "Two roads past a signal box, a train on each, one further along than the other."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Two trains leave the same place at the same time and take different amounts of time to reach Kelder. The express gets there first and keeps going at a steady rate. We want to know how far up the line it is when the local arrives.",
      platformCheck: {
        sentences: [1, 2, 4],
        /* NO SPELLED-OUT NUMBERS ANYWHERE IN THIS BLOCK, and it caught me.
           The validator refuses a number word on the Platform Check because
           the screen is numberless, and my first draft of this question was
           full of "two" — the `fit` question on a Challenge problem is ABOUT
           two situations, so the word arrives honestly and the rule cannot
           tell the difference.

           The rule is right and the copy was wrong. Look at the shared
           `CHECK.fit` in stations.js: it says "a single kind of situation"
           and "the same kind all the way through", never "one" and never
           "two". The site already had a vocabulary for this and I had not
           used it. Widening the exemption would have been the easy fix and
           the wrong one — the exemption is a data tag, never a reading of
           intent (VERIFICATION.md §30). */
        why: "The earlier sentences set the trains' journey times side by side, which is a comparison. The last stops comparing and gives a relationship that holds at any size, which is a rate. Both are in this story, in turn, and the sentence about carriages sits between them without belonging to either.",
        kinds: "Minutes on a journey first, and then miles against minutes."
      },

      questions: {
        /* Only `fit` is tailored. The other four are asked in the abstract on
           purpose here: on a paired problem several of them have TWO true
           options — this story genuinely has one moment in one half and a
           fixed relationship in the other — and rewriting them to name this
           story's quantities would force a choice between the halves before
           the student has been asked to find the seam. That is the open copy
           decision recorded on `optionTrue` in stations.js; it should be
           settled before the second island problem, not worked around here. */
        fit: {
          ask: "Does a single kind of situation cover this whole story — the journey times, and the miles the express covers afterwards?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it sets amounts side by side, and after that it gives a relationship that holds at any size. Read it again and find the sentence where it changes." },
            stacked: { yes: "Amounts set side by side is a kind of situation. Miles measured against minutes, holding at any size, is a different kind. This story does the side-by-side part first and the rate afterwards — and the earlier part hands the later part a number.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how long the express takes to reach Kelder", needed: true },
        { token: "n5", describe: "how many carriages the local has", needed: false },
        { token: "n1", describe: "how long the local takes to reach Kelder", needed: true },
        { token: "n3", describe: "the number of minutes in the express's steady rate", needed: true },
        { token: "n4", describe: "the number of miles in that same rate", needed: true }
      ],
      relationship: "The two journey times belong together: both trains left at once, so the space between those times is how long the express is running on its own. The miles and the minutes at the end belong together too, and they are a different kind of pairing — a relationship that stays true whatever size you scale it to. Nothing connects the carriages to either.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many miles past Kelder the express is at the moment the local arrives.",
      commonMisreading: "Working out the gap between the two journey times and stopping there, which answers a question in minutes when the question asked for miles.",
      options: [
        { text: "How many minutes longer the local takes",
          why: "That is worth working out, and you will need it — but read the last sentence again. It asks how FAR, not how long, and the answer comes out in miles." },
        { text: "How far past Kelder the express has got", correct: true,
          why: "The distance up the line, at the moment the local pulls in. That is the only thing the story never states." },
        { text: "How many miles the express covers every few minutes",
          why: "You were handed that outright in the sentence about carrying on up the line. It is the rate, not the distance." },
        { text: "How long the express takes to reach Kelder",
          why: "Also given, in its own sentence near the start." }
      ],
      authored: "generated"
    }
  },

  /* THE BOOTH NAMES BOTH HALVES, AND THAT IS SAFE HERE. It renders after both
     screens of the first read, so the Platform Check has already asked what
     this story is and been answered. `CHALLENGE-MODE.md` §6.3 has the booth
     holding two answers as real engine work; until then `correctLine` is the
     first half and `whyCorrect` tells the truth about the rest. */
  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "This story starts on the Compare Line — two journey times set side by side, with the space between them left unsaid. It does not stay there. Once the gap is found, the miles and minutes at the end are a rate, and that is the Ratio & Rate Rail. Two lines, in that order, joined at the moment the express carries on alone.",
    distractors: [
      { line: "change",    whyWrong: "Nothing ends up different from how it started. Both journey times are simply what they are, and the rate at the end holds steady rather than changing. It is tempting because the express is moving — but a train travelling is not a quantity being changed." },
      { line: "partwhole", whyWrong: "There is no named total that the pieces add up to. The local's time is not made out of the express's time plus something; they are two separate journeys that happen to be measured against each other." },
      { line: "groups",    whyWrong: "The closest one to argue for, because the express does cover its miles over and over. But Equal Groups counts how many whole repeats there are, and this rate holds at any size — half the minutes is half the miles. That is a relationship, not a repeated group." },
      { line: "ratio",     whyWrong: "Half right, and worth saying so: the second half of this story really is a rate. But the story does not open there. Before any of that, two journey times are set side by side and the space between them is what starts everything else off." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how far past Kelder the express has got",
      "how long the express takes to reach Kelder",
      "how many miles the express covers in a few minutes"
    ],
    unknownCarAnswer: "how far past Kelder the express has got",
    unknownCarWhy: "Both journey times are printed, and so is the rate. The distance up the line is the one thing nothing in the story states — and it cannot be reached until the space between the two times has been worked out first."
  },

  signalBox: {
    /* THE FIRST HALF'S PICTURE, and only the first half's. Both journey times
       are given and the gap between them is what is missing, which is the
       gentlest shape on the Compare Line — deliberately, because the hard
       thing here is not the comparison, it is noticing that the comparison is
       only half the problem. `gapToken` is absent: the gap is the unknown, and
       the validator refuses a picture that both marks and states it. */
    compareBars: {
      title: "Side by side",
      heading: "Two journey times, and the space between them",
      prompt: "One of these trains is being measured against the other. Tap the one it is measured AGAINST.",
      bars: [
        { key: "express", label: "Express to Kelder", token: "n2" },
        { key: "local",   label: "Local to Kelder",   token: "n1" }
      ],
      referent: "express",
      gapLabel: "how long the express is running on alone",
      why: "The express arrives first, so everything that happens afterwards is measured from the moment it got there. The space between the two bars is the time the express spends carrying on up the line by itself — and that space is what the second half of this story needs.",
      whyWrong: {
        local: "The local is the one arriving late, so it is the train being measured. The express got there first, and the clock that matters starts at its arrival — everything the question asks about happens after that."
      },
      a11yDescription: "Two bars on the same scale, one for each train's journey time. The express bar is the shorter. The local bar runs further, and the space between the two ends is marked with a question mark rather than a number. Nothing beyond that gap is drawn, because what happens after it is a different picture.",
      settledSay: "The gap between the two bars is not the answer here. It is the number the rest of the story needs."
    },
    /* THE CROSSOVER. `pair-model.js` renders the compare bars above, then this,
       then the second picture — and the second picture is drawn WAITING,
       because neither of its cells can be filled until the Engine Room has run.
       That is the point of the screen rather than a shortcoming of it.

       NOTHING HERE MAY CARRY A NUMBER. The options name quantities, the cell
       label names a quantity, and the transfer's value stays a question mark
       on this phase exactly as the ratio table's unknown does. The three wrong
       options are the three real ways to misread the crossover: taking a given
       instead of a derived value, taking the final answer, and taking the
       rate — which is a pair of numbers rather than the single one that
       crosses. */
    crossover: {
      heading: "What crosses over?",
      prompt: "The first picture is finished, and the story is not. Something from that picture is the number the rest of this problem needs. Which one?",
      cellLabel: "the gap",
      options: [
        { text: "The gap between the two bars", correct: true,
          why: "The space between the bars is how long the express is running on alone, and that is the only thing the first picture produced that the rest of the story can use. You cannot work it out from the second picture — it has to come from the first." },
        { text: "The local's journey time",
          why: "That was given to you in the story, so the first picture did not produce it. What crosses over is something the first picture worked out, not something you were handed." },
        { text: "The miles the express covers every few minutes",
          why: "That belongs to the second half already — it is printed in the story and it is waiting in the table below. The crossover is what the FIRST half hands over." },
        { text: "How far past Kelder the express has got",
          why: "That is the answer to the whole problem, and it is what you are travelling towards. Nothing hands it to you; it is what the second picture is for." }
      ],
      settledSay: "That is the join. The first picture ends where the second one starts, and the gap is the number passed between them.",
      second: {
        title: "The second picture",
        heading: "A rate, waiting for a number",
        givenHeading: "What you were told",
        targetHeading: "What you need",
        rows: [
          { label: "Minutes", key: "transfer", given: "{{n3}}" },
          { label: "Miles",   key: "answer",   given: "{{n4}}" }
        ],
        waiting: "Both cells on this side are question marks, and that is not a mistake. This picture cannot start until the gap is an actual number — which is the next stop. That is what makes this problem different from every one on the five lines: it has a middle, and you have just found it.",
        a11yDescription: "A table of two rows, minutes and miles. The left column holds the rate the story states. The right column is empty on both rows: the minutes cell is labelled as the gap once you have named it, and the miles cell stays a question mark. Nothing in this picture is calculated, because nothing in it can be until the gap is worked out."
      }
    },

    estimate: {
      prompt: "Before calculating — roughly how far past Kelder do you think the express has got, in miles?",
      reasonableMin: 5,
      reasonableMax: 20,
      modelReasoning: "Round both journey times to the nearest ten and take one off the other, and you have roughly how long the express is on its own. Then ask how many lots of {{n3}} minutes fit into that, and give it {{n4}} miles for each one. Rough numbers are enough — you are looking for the right sort of size, not the answer.",
      unit: "miles"
    }
  },

  /* Not a keyword trap, and deliberately a different shape from the Signal
     Failures on the mainland. The failure this problem is built around is
     stopping halfway: a number that is correct, that the student worked out
     themselves, and that answers a question nobody asked. It renders at the
     Arrivals Board, after the answer is on the screen. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out the gap between the two trains and it was right. Why was it not the answer?",
    why: "Because the question is in miles and that number is in minutes. The gap was a real thing and you needed it — but it was the first half handing something to the second, not the finish. That is what makes a problem like this one different from the ones on the five lines: it has a middle, and the middle looks like an ending."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        /* STEP 1 IS THE TRANSFER. Its answer is a given for step 2 — which is
           exactly the value the sweep's transfer rule exists to stop reporting
           as a leak on the second-half screen. */
        id: "s1",
        prompt: "First, how many minutes is the express running on up the line before the local arrives?",
        answer: { exact: "{{gap}}", unit: "minutes", acceptedForms: ["{{gap}}", "{{gap}} minutes"], preferredForm: "{{gap}}" },
        workedExplanation: "Both trains left at the same moment, so their journey times can be set straight against each other. The local takes {{n1}} minutes and the express takes {{n2}}, so the express is on its own for {{n1}} − {{n2}} = {{gap}} minutes. Check it forwards: {{gap}} + {{n2}} = {{n1}}, the local's journey exactly.",
        hints: [
          { rung: 1, text: "Both trains left at the same time. So what does the difference between their journey times tell you about the express?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The gap between the two bars is the time the express spends running alone." },
          { rung: 3, text: "Take the express's time off the local's: {{n1}} − {{n2}} = ___" },
          { rung: 4, text: "{{n1}} − {{n2}} = {{gap}}. The express is running on alone for {{gap}} minutes." }
        ],
        misconceptions: [
          { response: "{{mSum}}", diagnosis: "You added the two journey times. That would be the total time both trains spent travelling between them, which is not something the story is asking about. The space BETWEEN the times is a subtraction.", tag: "added-not-compared" },
          { response: "{{n1}}", diagnosis: "That is the local's whole journey, which the story gave you. The express is only running alone for the part of it after the express had already arrived.", tag: "gave-back-the-larger" },
          { response: "{{n2}}", diagnosis: "That is the express's own journey to Kelder. The question is about what happens AFTER that, while the local is still on its way.", tag: "gave-back-the-smaller" }
        ]
      },
      {
        /* STEP 2 IS THE SECOND SITUATION, and the first thing it does is name
           the number step 1 produced. That sentence is why the leak scan had to
           learn what a transfer is before this file could exist. */
        id: "s2",
        prompt: "The express runs on for {{gap}} minutes, covering {{n4}} miles every {{n3}} minutes. How far past Kelder has it got?",
        answer: { exact: "{{ans}}", unit: "miles", acceptedForms: ["{{ans}}", "{{ans}} miles"], preferredForm: "{{ans}}" },
        workedExplanation: "The rate is {{n4}} miles every {{n3}} minutes, and it holds at any size. {{gap}} minutes is {{gap}} ÷ {{n3}} = {{units}} lots of {{n3}} minutes, and each of those is worth {{n4}} miles: {{units}} × {{n4}} = {{ans}} miles. Check it backwards — {{ans}} miles at {{n4}} miles every {{n3}} minutes takes {{gap}} minutes, which is exactly how long the express had.",
        hints: [
          { rung: 1, text: "You have a length of time and a rate. How many lots of the rate's minutes fit into the time you have?" },
          { rung: 2, text: "Every {{n3}} minutes is worth {{n4}} miles. Work out how many lots of {{n3}} minutes there are in {{gap}}, then give each lot its miles." },
          { rung: 3, text: "{{gap}} ÷ {{n3}} = {{units}}. Now {{units}} × {{n4}} = ___" },
          { rung: 4, text: "{{gap}} ÷ {{n3}} = {{units}}, and {{units}} × {{n4}} = {{ans}}. The express is {{ans}} miles past Kelder." }
        ],
        misconceptions: [
          { response: "{{gap}}", diagnosis: "That is the number you just worked out, and it was right — but it is in minutes, and the question asks how FAR. This is the halfway point of the problem, not the end of it. The minutes still have to be turned into miles.", tag: "stopped-at-the-transfer" },
          { response: "{{mScale}}", diagnosis: "You multiplied the minutes by the miles. That gives every single minute a whole {{n4}} miles, when the story says it takes {{n3}} minutes to cover them. Divide by the minutes first, then multiply by the miles.", tag: "scaled-without-dividing" },
          { response: "{{units}}", diagnosis: "That is how many lots of {{n3}} minutes the express had, which is the right first move. Each of those lots is worth {{n4}} miles, so there is one multiplication still to do.", tag: "stopped-at-the-scale-factor" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "miles", acceptedForms: ["{{ans}}", "{{ans}} miles"], preferredForm: "{{ans}}" },
    /* Names the STEP 1 answer, and that is allowed on this screen and only on
       this screen: the unsure board is reached from the last step, so a student
       reading it has already produced that number themselves. The final answer
       is never printed here. */
    questionCheck: "The question asked how far past Kelder, in miles. If your answer is {{gap}}, that is the gap in minutes — a real number that you needed, but it is the middle of this problem rather than the end of it.",
    unitsCheck: "miles",
    reasonablenessCheck: "{{ans}} miles past Kelder. Check it backwards: at {{n4}} miles every {{n3}} minutes, {{ans}} miles takes {{gap}} minutes — exactly the head start the express had.",
    reasonablenessFailExample: "If you got {{mScale}}, the express would have covered a mile every minute or better on a branch line, which no timetable on this railway claims.",
    connection: "Every problem on the five lines is one situation. This one was two, and the join between them was a number: the gap in minutes was the answer to the first half and a given for the second. Finding that join is what the whole island is for."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story rather than checked against the stated work, and each verified both ways: 47-32=15, 15/3=5, 5x2=10 (10/2x3=15); 53-41=12, 12/4=3, 3x3=9 (9/3x4=12); 58-40=18, 18/6=3, 3x5=15 (15/5x6=18); 44-24=20, 20/5=4, 4x4=16 (16/4x5=20). The gap divides exactly by the rate's minutes in all four. Within every set the final answer differs from both step answers, from all five givens and from all three of that step's misconception values. Implied speeds 40, 45, 50 and 48 mph. Noted for whoever edits the copy: set 1's gap and set 3's answer are both 15, so no pre-solve copy in this file may print a bare 15." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Compare -> Rate, the pair the user named. The Compare half is deliberately the gentlest shape on that line (both amounts given, gap missing) because the difficulty here is meant to be the crossover, not the comparison. Primary distractor on step 2 is the transfer itself, which is a number the student computed correctly and answers a question nobody asked - the mode's central error. read3's distractor is placed first rather than last. The `fit` question is tailored and answers `stacked`; the other four are left abstract because several of them have two true options on a paired problem and choosing between them pre-empts the pass that finds the seam." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. And this one needs it more than most: whether a student can find the crossover by reading is the entire premise of Challenge Mode, and nothing here tests it." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL, and draft rather than published. Author and reviewer are the same (VERIFICATION.md 16). Three surfaces this problem is designed for do not exist yet - the Crossover Read, the two-model Plan phase and Crossover Island itself - so what runs today is this content through the ordinary station, which is a proof that the engine and the checkers hold, not a finished stop." }
  }
});
