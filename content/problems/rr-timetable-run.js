/* Ratio & Rate Rail · total from a rate · independent · SWITCHYARD
   Chosen for the Switchyard because the operation genuinely forks: the rate
   is given per part of an hour, not per hour, so a student who grabs the two
   numbers and multiplies gets a number that means nothing and never notices.
   Working out WHICH quantity to scale by is the whole lesson.

   FOUR NUMBER SETS. The stretch has to divide an hour exactly, or the whole
   "how many of these fit in an hour" move stops working — so every n2 is a
   factor of 60, and the stretch count k is what the bar is drawn in. Verified
   both ways per set: the count that comes out of the hour, and the unit rate
   that rebuilds the same distance from a different direction.

     60/20 = 3 stretches, 3 x 14 = 42   (14/20 = 0.7 mi/min, 0.7 x 60 = 42)
     60/15 = 4 stretches, 4 x  9 = 36   (9/15  = 0.6 mi/min, 0.6 x 60 = 36)
     60/12 = 5 stretches, 5 x 11 = 55   (11/12 = 0.91666… , x 60 = 55)
     60/10 = 6 stretches, 6 x 13 = 78   (13/10 = 1.3 mi/min, 1.3 x 60 = 78)

   knownTotal is "?" on purpose — the whole bar is the answer and must not sit
   in the picture waiting to be read off. segmentValue is a GIVEN (the miles
   in one stretch), which is allowed and is the point of the model.

   Nothing here says "twenty" in words any more. A spelled-out number survives
   tokenising, shuffling and levelling untouched, and this problem said it
   eleven times. */
MF.registerProblem({
  id: "rr-timetable-run",
  schemaVersion: 1,
  status: "published",
  title: "How far in an hour",
  line: "ratio",
  topics: ["rate-time-distance", "scaling-a-rate", "unit-conversion"],
  steps: 1,

  unknownCar: "total-from-rate",
  context: "travel",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "estimation"],
  hubStrategyNote: "The rate arrives in the wrong unit of time, so the first decision is what to scale by rather than how to calculate. That makes it a genuine test of choosing the operation instead of performing one.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-07-30" },

  /* k is the number of stretches in an hour and it is load-bearing: it is the
     bar's segment count, the correct multiplier, and a misconception in its own
     right (stopping at the count). Stated as a check in both directions so a
     set cannot quietly carry a stretch that does not divide the hour. */
  numberChecks: [
    ["60", "/", "n2", "=", "k"],
    ["k", "*", "n2", "=", "60"],
    ["n1", "*", "k", "=", "ans"],
    ["ans", "/", "k", "=", "n1"],
    ["n1", "*", "n2", "=", "mMulGiven"],
    ["n1", "+", "k", "=", "mAddK"],
    ["n1", "+", "n2", "=", "mAddN2"],
    ["n1", "*", "60", "=", "mMul60"],
    ["60", "-", "n2", "=", "sixtyLessN2"],
    ["n1", "+", "sixtyLessN2", "=", "addResult"],
    /* The bar has to be drawn in the number of stretches the hour actually
       holds. seg1 is bars[0].segments for this set; without these two a set
       could draw the hour in 3 parts while its own stretch divides it into 4,
       and nothing would say so. */
    ["seg1", "*", "n2", "=", "60"],
    ["seg1", "*", "n1", "=", "ans"]
  ],

  numberSets: [
    { numbers: { n1: "14", n2: "20", n3: "5" },
      derived: { k: "3", ans: "42", mMulGiven: "280", mAddK: "17", mAddN2: "34",
                 mMul60: "840", sixtyLessN2: "40", addResult: "54" },
      estimate: { min: 30, max: 55 }, segments: [3], marked: [1] },
    { numbers: { n1: "9", n2: "15", n3: "6" },
      derived: { k: "4", ans: "36", mMulGiven: "135", mAddK: "13", mAddN2: "24",
                 mMul60: "540", sixtyLessN2: "45", addResult: "54" },
      estimate: { min: 25, max: 50 }, segments: [4], marked: [1] },
    { numbers: { n1: "11", n2: "12", n3: "7" },
      derived: { k: "5", ans: "55", mMulGiven: "132", mAddK: "16", mAddN2: "23",
                 mMul60: "660", sixtyLessN2: "48", addResult: "59" },
      estimate: { min: 40, max: 75 }, segments: [5], marked: [1] },
    { numbers: { n1: "13", n2: "10", n3: "8" },
      derived: { k: "6", ans: "78", mMulGiven: "130", mAddK: "19", mAddN2: "23",
                 mMul60: "780", sixtyLessN2: "50", addResult: "63" },
      estimate: { min: 55, max: 100 }, segments: [6], marked: [1] }
  ],

  scene: {
    mode: "anim", art: "train",
    caption: "Same speed the whole way along the coast: track going by, and the clock going round with it."
  },

  problem: {
    /* Split so the pairing takes two sentences to gather — see rr-poster-run.
       "Every" stays, because it is what locks the miles to the minutes and the
       whole lesson of this problem is that the rate arrives per PART of an hour
       rather than per hour. */
    text: "The local train runs along the coast and keeps the same speed the whole way. The timetable splits the route into stretches of {{n2}} minutes each. The train covers {{n1}} miles in every stretch. The train has {{n3}} salt-streaked carriages. At that speed, how far does it travel in one hour?",
    sentences: [
      "The local train runs along the coast and keeps the same speed the whole way.",
      "The timetable splits the route into stretches of {{n2}} minutes each.",
      "The train covers {{n1}} miles in every stretch.",
      "The train has {{n3}} salt-streaked carriages.",
      "At that speed, how far does it travel in one hour?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "14", unit: "miles",     role: "distance",   spoken: "14" },
      n2: { value: "20", unit: "minutes",   role: "time",       spoken: "20" },
      n3: { value: "5",  unit: "carriages", role: "distractor", spoken: "5" }
    },
    context: { setting: "coastal railway", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A train travels at a steady speed. We are told how far it gets in a short stretch of time, and we want to know how far it gets in a longer one.",
      platformCheck: {
        sentences: [1, 2],
        why: "\"Every\" is the lock, and between them those sentences give both halves of it — how long a stretch lasts, and how far the train gets across it. Worth noticing too, the opening line says the speed never changes, which is what lets you stretch the pairing all the way to an hour.",
        kinds: "Miles and minutes — different kinds of thing, held together by a steady speed."
      },

      /* This is the problem the user rode when they found the Moments defect —
         "something IS happening as the train is moving". So `moments` here says
         out loud that a moving train is not a changing amount. */
      questions: {
        kinds: {
          ask: "This story counts miles and it counts minutes, and it also counts the train's carriages. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "Miles and minutes are different sorts of thing, pinned to each other by a steady speed. Travel for longer and the distance grows in proportion.", no: "" },
            same:      { yes: "", no: "That would mean everything was measured in the same stuff. Miles are not minutes, and the whole question is about how they go together. The carriages are the only thing here that is scenery." }
          }
        },
        moments: {
          ask: "The train is moving the whole time. Does any amount end up different from how it started, or does the train hold the same relationship all the way along the coast?",
          options: {
            steady:  { yes: "The train moves, but no amount turns into a different amount. The miles and the minutes keep exactly the same relationship from the first moment to the last &mdash; that is what \"the same speed the whole way\" means. Motion is not the same thing as change.", no: "" },
            changed: { yes: "", no: "The most understandable answer on this screen, because the train is plainly moving. But look for an amount that ENDS UP different from how it started &mdash; something added or taken away. The train covers ground at a rate that never varies, so there is no before-and-after amount, only a pairing." }
          }
        },
        things: {
          ask: "Is the story keeping track of a single amount, of separate amounts being measured against each other, or of miles and minutes travelling together?",
          options: {
            paired:   { yes: "Not really separate things at all. Miles and minutes travel together, and the question asks you to stretch that pairing to a longer stretch of time.", no: "" },
            single:   { yes: "", no: "That would mean the story only ever counted the same stuff. There are miles here and there are minutes, and you need both." },
            separate: { yes: "", no: "That would mean miles and minutes being compared to see which is bigger. They are not rivals &mdash; they are locked together." }
          }
        },
        shape: {
          ask: "Is the journey being shared out into parts, or is the same stretch repeated over and over, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares, and the question is not counting identical stretches for their own sake. It asks what distance goes with a given time.", no: "" },
            repeat:  { yes: "", no: "Close, and worth thinking about &mdash; an hour does hold a whole number of these stretches, and you will use that. But Equal Groups would be counting the stretches as the answer. Here the stretches are the way in, and the pairing of miles with minutes is the situation." },
            cut:     { yes: "", no: "That would mean a fixed distance divided into shares that add back up to it. The distance is what you are working out, not what you are cutting." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the short stretch you are given, and the hour you are asked about?",
          options: {
            onekind: { yes: "A fixed relationship being scaled up, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a steady speed and nothing else &mdash; no second kind of situation on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Miles that go with minutes is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how far the train goes in one stretch", needed: true },
        { token: "n2", describe: "how long that stretch lasts", needed: true },
        { token: "n3", describe: "how many carriages the train has", needed: false }
      ],
      relationship: "The miles and the minutes are tied together by a steady speed, so the pair repeats: every {{n2}} minutes brings another {{n1}} miles. An hour is a number of those stretches, and the distance grows by the same number of times. The carriages have no bearing on how far the train gets.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many miles the train covers in one hour.",
      commonMisreading: "Reading the {{n1}} miles as if it were already the distance for an hour, and answering with a number that was simply handed to you.",
      options: [
        /* Deliberately the longest option on this problem. Levelling the line
           for length drove "always pick the longest" to 0%, which is just the
           same tell inverted — a student who learns the wordiest option is
           always wrong has still learned something other than reading. The
           correct option should be longest about as often as chance would have
           it, so on one of the six it is. */
        { text: "The number of miles the train covers in a full hour", correct: true,
          why: "A distance for a longer stretch of time than the one you were given. The rate has to be scaled up before it answers the question." },
        { text: "The number of {{n2}}-minute stretches in an hour",
          why: "A real step on the way, and a small number. It tells you how much to scale by; it is not a distance." },
        { text: "How fast the train is going in miles per hour",
          why: "This is a fair description of the same number, and the arithmetic is identical. But read the question: it asks how FAR it travels, so the answer is a distance." },
        { text: "How far each carriage travels",
          why: "The carriages are scenery, and every carriage travels exactly as far as the train does anyway." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Miles and minutes are locked together at a fixed speed. The relationship holds for any stretch of time, which is what lets you take a figure for part of an hour and stretch it to the whole one.",
    distractors: [
      { line: "change",    whyWrong: "A train moving down a track looks like something changing, but no quantity here starts at one value and ends at another. The speed is the same at the beginning and the end; only the clock moves on." },
      { line: "compare",   whyWrong: "Nothing is set against anything else. The short stretch and the hour are two lengths of the same journey, not two rivals whose difference you are asked for." },
      /* Names no multiplier. The count of stretches is the thing this station
         is about working out, and the Ticket Booth is three screens early. */
      { line: "groups",    whyWrong: "This is the closest call on the whole line, because you do end up multiplying. The difference is what sits inside a group: here each group is a stretch of TIME holding a distance, two different units locked together, which makes it a rate." },
      { line: "partwhole", whyWrong: "The stretch you were given is genuinely part of an hour, so the words fit — but you are not splitting a known total into pieces. The total distance is exactly what is missing, and you are building it up from a repeated rate instead." }
    ],
    unknownCar: "total-from-rate",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the miles in one short stretch", "the length of the stretch", "the miles covered in one hour"],
    unknownCarAnswer: "the miles covered in one hour",
    unknownCarWhy: "You are handed a distance and the time it belongs to. The distance for the longer stretch of time is the car nothing in the problem states.",
    supportAfter3Attempts: {
      narrowTo: ["ratio", "groups"],
      discriminator: "Ask what one group holds. A group of the same thing you are counting is Equal Groups. A stretch of time holding a distance is two units tied together, and that is a rate."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      bars: [{ label: "one hour of travel", segments: 3, segmentValue: "{{n1}} miles", knownTotal: "?", unit: "stretches",
               marked: 1, markedLabel: "the stretch you were given", restLabel: "the rest of the hour" }],
      a11yDescription: "One bar for a single hour of travel, split into {{k}} equal parts because {{k}} stretches of {{n2}} minutes make an hour. Each part holds the same {{n1}} miles, since the speed never changes. Only one of those parts was given to you in the problem; the whole bar is what you are asked to find, so it is left unlabelled.",
      authored: "generated"
    },
    /* The Switchyard problem, so the table has to make the FORK visible: the
       rate arrives per part of an hour and the question asks per hour, and the
       "× {{n2}}" option is there because multiplying the two given numbers is
       the exact wrong turn this station exists to teach. */
    ratioTable: {
      prompt: "Miles and minutes travel together at a steady speed. Put the stretch you were given next to the hour you were asked about.",
      givenHeading: "One stretch",
      targetHeading: "One hour",
      rows: [
        { label: "miles",   given: "{{n1}}", target: "?" },
        { label: "minutes", given: "{{n2}}", target: "60" }
      ],
      question: "What takes the minutes from {{n2}} up to 60?",
      options: [
        { text: "× {{k}}", correct: true,
          why: "That many stretches of {{n2}} minutes make an hour. The same multiplication then runs along the miles row — and notice what you multiply by: the count of stretches, not the {{n2}}." },
        { text: "+ {{sixtyLessN2}}",
          why: "It reaches 60, but adding does not scale a rate. Apply the same addition to the miles and you would claim {{addResult}} miles an hour out of a train that manages {{n1}} in {{n2}} minutes." },
        { text: "× {{n2}}",
          why: "This is the wrong turn this problem is built around. {{n2}} is a length of time, not a count of anything — multiplying the two numbers you were handed gives {{mMulGiven}} and means nothing." },
        { text: "+ {{k}}",
          why: "Right number, wrong operation. That is how many stretches fit in the hour, so it multiplies; it is not something you add on." }
      ],
      settledSay: "One operation, both rows. That many stretches of track, that many lots of the distance.",
      law: "Whatever you do to one row, you do to the other.",
      pending: "The miles cell stays a question mark on purpose — running the same multiplication along that row is the next stop.",
      a11yDescription: "A table with two rows, miles and minutes, and two columns. The first column is one stretch: {{n1}} miles in {{n2}} minutes. The second column is a full hour, so the minutes cell reads 60 and the miles cell is unknown. Getting from {{n2}} minutes to 60 means multiplying by {{k}}, and that same multiplication runs along the miles row."
    },
    estimate: {
      prompt: "Before calculating — roughly how far do you think the train gets in an hour?",
      reasonableMin: 30,
      reasonableMax: 55,
      /* Shown only AFTER the estimate is locked in (stations.js phPlan), so it
         is feedback on estimating, not a prompt. It still stops short of the
         arithmetic: a size and a floor, not a product. */
      modelReasoning: "An hour holds a whole number of those stretches — work out how many, and the distance goes up by that many times. It has to be well above the {{n1}} miles of a single stretch, because an hour is longer than {{n2}} minutes, and nowhere near a hundred times it.",
      unit: "miles"
    },
    /* THE TEST TRACK, replacing the Junction. This is the Switchyard problem,
       where the wrong turn is multiplying the two numbers you were handed. So
       the demonstration is about WHICH row the move comes from — because the
       {{n2}} is a length of time sitting on the minutes row, not a multiplier. */
    testTrack: {
      kind: "cross",
      title: "The Test Track",
      heading: "A second way through: cross-multiplying",
      intro: "This is the Switchyard, where choosing the operation is the whole skill — so here is a second operation you can choose. Once a ratio is SET, the two diagonals of the table multiply to the same thing, and setting that up decides for you which numbers pair with which.",
      worked: {
        label: "A proportion that is already known to be true: 5 to 2 is the same as 15 to 6.",
        button: "Show me the diagonals",
        colA: "first", colB: "second",
        rows: [ { name: "top", a: "5", b: "15" }, { name: "bottom", a: "2", b: "6" } ],
        equation: "5 × 6  =  2 × 15   (both come to 30)",
        sayCut: "Take one diagonal: the 5 and the 6.",
        sayTake: "Now the other: the 2 and the 15. Both come to 30. Notice the diagonals decide the pairing for you — you never have to guess which number multiplies which."
      },
      yours: {
        wholeLabel: "Your table, with the ratio already set by the train holding one steady speed.",
        colA: "one stretch", colB: "one hour",
        rows: [ { name: "miles", a: "{{n1}}", b: "?" }, { name: "minutes", a: "{{n2}}", b: "60" } ],
        equation: "{{n1}} × 60  =  {{n2}} × ?",
        q1: "Cross-multiplying means multiplying each pair sitting diagonally opposite. Which two are one diagonal?",
        options1: [
          { text: "{{n1}} and 60", correct: true,
            why: "Diagonally opposite corners: the miles in one stretch and the sixty minutes of the hour. Both are known, so this side of the equation can be worked out." },
          { text: "{{n1}} and {{n2}}",
            why: "Those two sit in the same COLUMN — they are one stretch, miles over minutes. That column IS the rate; multiplying it together is the exact wrong turn this station exists to catch." },
          { text: "{{n1}} and ?",
            why: "Same row — both are miles. Cross-multiplying goes corner to opposite corner, never straight across a row." },
          { text: "{{n2}} and 60",
            why: "Same row — both are minutes. A row is one quantity at two different lengths of time, not a diagonal." }
        ],
        settled1: "One diagonal: {{n1}} and 60.",
        q2: "And the other diagonal?",
        options2: [
          { text: "{{n2}} and ?", correct: true,
            why: "The other pair of opposite corners — the minutes of one stretch and the unknown miles in an hour. This side carries the question mark, which is what makes the equation useful." },
          { text: "{{n1}} and ?",
            why: "Same row, both miles, and you have already used the {{n1}} on the first diagonal. Each corner belongs to exactly one diagonal." },
          { text: "60 and ?",
            why: "Same column — that is the hour, the pair you are trying to complete. It is not a diagonal." },
          { text: "{{n2}} and {{n1}}",
            why: "Same column again — one stretch. Multiplying the two numbers you were handed is the error this problem is built around." }
        ],
        settled2: "The other diagonal: {{n2}} and the question mark."
      },
      law: "Once a ratio is set, its two diagonals multiply to the same thing. The diagonals also decide which numbers pair up — so you never have to guess.",
      bridge: "You have the equation. Both sides are still written as products on purpose — working them out, and getting the question mark on its own, is the Engine Room's job.",
      a11yDescription: "A demonstration of cross-multiplying, which produces an equation but does not solve it. First a proportion already known to be true, 5 to 2 being the same as 15 to 6: one diagonal is 5 times 6 and the other is 2 times 15, both coming to 30. Then the same on your own table: one diagonal is the miles in one stretch times the sixty minutes of an hour, the other is the minutes of one stretch times the unknown miles per hour. That gives the equation with a question mark still in it. Working it out is the next step, in the Engine Room."
    }
  },

  /* ONE step, not two. It used to open with "how many stretches are there in
     one hour?" — while the Model Yard on the PREVIOUS screen draws the hour as
     exactly that many segments. The picture answered the question before it was
     asked, and unlike the segmentValue leaks this one could not be fixed by
     blanking a field: the partition IS the model, and hiding it would gut the
     representation and leave screen-reader users with less than sighted ones.
     So the scaffold moved into the hint ladder, which is request-only and
     escalating. A student who needs the stretch count still gets it, one rung
     at a time; a student who does not is no longer walked through it. Stopping
     at the count is now carried as a misconception, which is where it
     belonged. */
  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many miles does the train cover in one hour?",
        answer: { exact: "{{ans}}", unit: "miles", acceptedForms: ["{{ans}}", "{{ans}} miles"] },
        workedExplanation: "An hour is 60 minutes and each stretch is {{n2}}, so an hour holds 60 ÷ {{n2}} = {{k}} stretches. The train covers {{n1}} miles in each one, so {{k}} x {{n1}} = {{ans}} miles. Check it a different way: {{n1}} miles in {{n2}} minutes scaled up to the full 60 minutes gives the same {{ans}}.",
        misconceptions: [
          { response: "{{mMulGiven}}", diagnosis: "You multiplied {{n1}} by {{n2}} — the two numbers the problem handed you. But {{n2}} is a length of time, not a count of anything. What you need to multiply by is how many stretches of {{n2}} minutes fit in an hour.", tag: "multiplied-the-given-numbers" },
          { response: "{{k}}",         diagnosis: "That's how many stretches fit into an hour — a real step, and the bar model shows it. But it counts stretches, not miles. Each of those stretches carries the train some distance.", tag: "stopped-at-the-count" },
          { response: "{{n1}}",        diagnosis: "That's the distance for one short stretch, which you were given. An hour holds several of them, so the answer has to be several times as big.", tag: "returned-given-value" },
          { response: "{{mAddK}}",     diagnosis: "You added the stretch count to {{n1}}. One counts stretches and the other counts miles — adding them mixes two different units. The count tells you how many times to take the {{n1}}.", tag: "added-unlike-units" },
          { response: "{{mAddN2}}",    diagnosis: "You added {{n2}} to {{n1}}. Minutes and miles cannot be added; the minutes are only there to tell you how long a stretch lasts.", tag: "added-unlike-units" },
          { response: "{{mMul60}}",    diagnosis: "You multiplied {{n1}} by 60. That treats every minute as carrying a full {{n1}} miles, but {{n1}} miles covers a whole {{n2}}-minute stretch, not a single minute.", tag: "wrong-time-unit" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The problem gives you a distance for {{n2}} minutes, but asks about a whole hour. How much longer is an hour than {{n2}} minutes?" },
          { rung: 2, type: "signal",   text: "An hour is sixty minutes, so it holds {{k}} stretches of {{n2}} minutes — and the train covers {{n1}} miles in each one." },
          { rung: 3, type: "coupling", text: "{{k}} × {{n1}} = ___" },
          { rung: 4, type: "route",    text: "{{k}} × {{n1}} = {{ans}}. The train covers {{ans}} miles in an hour." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "miles", acceptedForms: ["{{ans}}", "{{ans}} miles"], preferredForm: "{{ans}} miles" },
    questionCheck: "The question asked how FAR the train goes in an hour — a distance, not the number of stretches you found on the way.",
    unitsCheck: "miles",
    reasonablenessCheck: "{{ans}} miles in an hour, from {{n1}} miles every {{n2}} minutes. Split {{ans}} into {{k}} equal stretches and you get {{n1}} back, which is exactly what you were told.",
    reasonablenessFailExample: "If you got {{mMulGiven}}, that is {{n2}} times the distance the train manages in {{n2}} minutes — the train would have to cover it in {{n2}} hours, not one.",
    connection: "The trap here is that the rate arrived per part of an hour rather than per hour. Whenever a rate is given in one unit of time and the question asks about another, that conversion is the first move, before any multiplying."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently from the story and cross-checked by a second route (unit rate x 60): 60/20=3, 3x14=42 (0.7 x 60 = 42); 60/15=4, 4x9=36 (0.6 x 60 = 36); 60/12=5, 5x11=55 (11/12 x 60 = 55); 60/10=6, 6x13=78 (1.3 x 60 = 78). Every n2 divides 60 exactly, which the whole 'how many fit in an hour' move depends on, and numberChecks assert it in both directions. Bar segments track k per set (3,4,5,6). Estimate brackets contain their own answers: 30-55/42, 25-50/36, 40-75/55, 55-100/78. All six misconception responses per set re-derived and checked distinct from that set's answer and from each other. 2026-07-30 revision retained: collapsed from 2 steps to 1 because s1's answer was drawn in the Model Yard on the preceding screen." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Problem text FK grade 2.2-4.8, 9-12 words per sentence. Ratio Table prose FK 3.3, Junction FK 2.3. No grade level named. Animated scene carries a caption; ratio table carries an a11yDescription. Contrast on the new tokens measured earlier at 5.04:1 (arrows, unknown cell) and 5.33:1 (selected option)." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "Cycle 7b findings stand. 2026-08-01: eleven spelled-out 'twenty's removed while converting to number sets — a written-out number survives tokenising, shuffling and levelling untouched, and Cycle 6 shipped four answer leaks in exactly that form. The read3 correct option is still deliberately the longest on this problem, which is the one of six that keeps 'always pick the longest' near chance rather than at zero." },
    student:   { status: "partial", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Full Ratio Local trip driven in a real browser through rr-market-stall: Read 1 empty input blocked; Read 2 rejects a distractor-only selection with a diagnosis; Read 3 and Ticket Booth graded; both ratio tables settle and leave their unknown cells blank; inverted-rate misconception (0.4) caught with the right diagnosis; both steps solved; Arrivals Board reached. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-07-30", notes: "Cycle 7b. Maths independently re-derived from the problem story rather than checked against the stated answer; every number set re-solved. Approved for the mechanical, mathematical and pedagogical properties measured. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16 and REVIEW-LOG.md Cycle 7b." }
  }
});
