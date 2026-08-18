/* Ratio & Rate Rail · time unknown · independent · ESTIMATION TOWER
   Rate x Time = Distance with the TIME missing, which is the case students
   guess at most and estimate worst. Placed at the Estimation Tower for
   exactly that reason: a sane bracket kills the multiply-everything reflex
   before the arithmetic starts.

   FOUR NUMBER SETS. Two divisions have to land whole in every one of them:
   the short run must give a plausible road speed, and that speed must go into
   the long distance a whole number of times. Verified both ways per set —
   the division that produces the value, and the multiplication that rebuilds
   what it came from:

     90 / 2  = 45  (2 x 45 = 90)    315 / 45 = 7  (45 x 7 = 315)
     120 / 2 = 60  (2 x 60 = 120)   300 / 60 = 5  (60 x 5 = 300)
     150 / 3 = 50  (3 x 50 = 150)   400 / 50 = 8  (50 x 8 = 400)
     160 / 4 = 40  (4 x 40 = 160)   240 / 40 = 6  (40 x 6 = 240)

   The bar draws only the KNOWN short run, so the final answer is nowhere in
   the picture, and segmentValue stays "?" because the size of one part IS
   step one's answer.

   FIXED with this conversion: the Ticket Booth used to say the long trip was
   "a number of 45-mile hours". The Ticket Booth runs BEFORE Plan and before
   the Engine Room (stations.js: read1, read2, read3, ticket, plan, route,
   solve, check), so that printed step one's answer two screens before it was
   asked. Tokenising it would only have made the leak follow the numbers
   around; the figure is gone instead, and the sentence says the same thing
   without it. */
MF.registerProblem({
  id: "rr-van-hours",
  schemaVersion: 1,
  status: "published",
  title: "How long the drive takes",
  line: "ratio",
  topics: ["rate-time-distance", "unit-rate", "time-unknown"],
  steps: 2,

  unknownCar: "time-from-rate",
  context: "delivery",
  fadeLevel: "independent",
  stationRoles: ["estimation"],
  hubEligible: true,
  hubGoodStrategies: ["estimation", "switchyard"],
  hubStrategyNote: "Two divisions in a row, and the second one is easy to invert. An estimate made before either division tells you immediately whether the answer should be a handful of hours or a few hundred, which is the whole defence against multiplying by mistake.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-07-30" },

  /* The arithmetic every set must satisfy. Stated in both directions for each
     division, because a set whose answer is simply wrong passes every other
     check in the validator — those only compare a set against itself. */
  numberChecks: [
    ["n1", "/", "n2", "=", "rate"],
    ["n2", "*", "rate", "=", "n1"],
    ["n4", "/", "rate", "=", "ans"],
    ["rate", "*", "ans", "=", "n4"],
    ["n1", "*", "n2", "=", "mMul1"],
    ["n1", "+", "n2", "=", "mAdd1"],
    ["n1", "-", "n2", "=", "mSub1"],
    ["n4", "*", "rate", "=", "mMul2"],
    ["n4", "+", "rate", "=", "mAdd2"],
    ["n4", "-", "rate", "=", "mSub2"],
    ["n2", "-", "1", "=", "n2less1"],
    ["n1", "-", "n2less1", "=", "subResult"],
    ["n2", "*", "n2", "=", "n2sq"],
    /* The bar draws the short run as one part per hour, so its segment count
       is n2 and each part is worth the speed. seg1 is bars[0].segments for
       this set — a picture split into the wrong number of hours would
       otherwise validate clean. */
    ["seg1", "*", "rate", "=", "n1"],
    ["n1", "/", "seg1", "=", "rate"]
  ],

  numberSets: [
    { numbers: { n1: "90", n2: "2", n3: "125", n4: "315" },
      derived: { rate: "45", ans: "7", mMul1: "180", mAdd1: "92", mSub1: "88",
                 mMul2: "14175", mAdd2: "360", mSub2: "270",
                 n2less1: "1", subResult: "89", n2sq: "4" },
      estimate: { min: 5, max: 10 }, segments: [2], marked: [1] },
    { numbers: { n1: "120", n2: "2", n3: "140", n4: "300" },
      derived: { rate: "60", ans: "5", mMul1: "240", mAdd1: "122", mSub1: "118",
                 mMul2: "18000", mAdd2: "360", mSub2: "240",
                 n2less1: "1", subResult: "119", n2sq: "4" },
      estimate: { min: 3, max: 8 }, segments: [2], marked: [1] },
    { numbers: { n1: "150", n2: "3", n3: "90", n4: "400" },
      derived: { rate: "50", ans: "8", mMul1: "450", mAdd1: "153", mSub1: "147",
                 mMul2: "20000", mAdd2: "450", mSub2: "350",
                 n2less1: "2", subResult: "148", n2sq: "9" },
      estimate: { min: 6, max: 12 }, segments: [3], marked: [1] },
    { numbers: { n1: "160", n2: "4", n3: "95", n4: "240" },
      derived: { rate: "40", ans: "6", mMul1: "640", mAdd1: "164", mSub1: "156",
                 mMul2: "9600", mAdd2: "280", mSub2: "200",
                 n2less1: "3", subResult: "157", n2sq: "16" },
      estimate: { min: 4, max: 9 }, segments: [4], marked: [1] }
  ],

  scene: {
    mode: "anim", art: "van",
    caption: "The van holds one steady speed, so every hour of driving eats the same stretch of road."
  },

  problem: {
    text: "A delivery van runs between two depots along the same flat road every day. The driver holds a steady speed the whole way. On the short run the van covers {{n1}} miles in {{n2}} hours. The rattling van can hold {{n3}} parcels. At that same speed, how many hours would it take to cover {{n4}} miles?",
    sentences: [
      "A delivery van runs between two depots along the same flat road every day.",
      "The driver holds a steady speed the whole way.",
      "On the short run the van covers {{n1}} miles in {{n2}} hours.",
      "The rattling van can hold {{n3}} parcels.",
      "At that same speed, how many hours would it take to cover {{n4}} miles?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "90",  unit: "miles",   role: "distance",   spoken: "90" },
      n2: { value: "2",   unit: "hours",   role: "time",       spoken: "2" },
      n3: { value: "125", unit: "parcels", role: "distractor", spoken: "125" },
      n4: { value: "315", unit: "miles",   role: "distance",   spoken: "315" }
    },
    context: { setting: "delivery route", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A van drives at the same speed every day. We know how far it goes on a short trip and how long that takes, and we want to know how long a much longer trip would take at that same speed.",
      platformCheck: {
        sentences: [2, 4],
        why: "That sentence pairs miles with hours on the short run, and the question gives you the distance you are stretching it to. Worth noticing too — the line about holding a steady speed is what makes the pairing travel to a longer trip at all, even though it hands you no number.",
        kinds: "Miles and hours — different kinds of thing, tied together by a steady speed."
      },

      questions: {
        kinds: {
          ask: "This story counts miles and it counts hours, and it also counts the parcels the van can hold. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "Miles and hours are different sorts of thing, tied to each other by a speed the driver holds. Drive for longer and the distance grows in proportion.", no: "" },
            same:      { yes: "", no: "That would mean everything was measured in the same stuff. Miles are not hours, and the question is about how they go together. The parcels are the scenery here." }
          }
        },
        moments: {
          ask: "The van drives between the depots. Does any amount end up different from how it started, or does the van hold the same relationship the whole way?",
          options: {
            steady:  { yes: "The van moves, but no amount turns into a different amount. Miles and hours keep the same relationship for the whole drive, which is what a steady speed means.", no: "" },
            changed: { yes: "", no: "Understandable, because the van is plainly moving. But look for an amount that ENDS UP different from how it started. Nothing is added or taken away here &mdash; the van simply covers ground at a rate that never varies." }
          }
        },
        things: {
          ask: "Is the story keeping track of a single amount, of separate amounts being measured against each other, or of miles and hours travelling together?",
          options: {
            paired:   { yes: "Not really separate things at all. Miles and hours travel together, and the question stretches that pairing to a much longer trip.", no: "" },
            single:   { yes: "", no: "That would mean the story only ever counted the same stuff. There are miles here and there are hours, and you need both." },
            separate: { yes: "", no: "That would mean the short run and the long run being compared to see which is bigger. They are the same relationship at different sizes, not rivals." }
          }
        },
        shape: {
          ask: "Is the drive being shared out into parts, or is the same stretch repeated over and over, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares, and the question is not counting identical stretches for their own sake. It asks what time goes with a given distance.", no: "" },
            repeat:  { yes: "", no: "Close, and the arithmetic does overlap &mdash; you can picture the long trip as a run of equal hours. But Equal Groups would make the identical group the point. Here the point is that miles and hours are paired at a fixed rate." },
            cut:     { yes: "", no: "That would mean a fixed distance divided into shares adding back up to it. Nothing is being divided into parts of a whole." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the short run you are given, and the long run you are asked about?",
          options: {
            onekind: { yes: "A fixed relationship being scaled, the whole way through. Reaching the answer takes more than a single step, and every step is the same kind of situation.", no: "" },
            stacked: { yes: "", no: "Worth asking, and you are right that it takes more than a single step &mdash; you find the speed before you can find the time. Both steps are the same kind of situation, though: a fixed rate being used. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Miles that go with hours is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how far the van goes on the short run", needed: true },
        { token: "n2", describe: "how long the short run takes", needed: true },
        { token: "n3", describe: "how many parcels fit in the van", needed: false },
        { token: "n4", describe: "the longer distance we are asked about", needed: true }
      ],
      relationship: "The first two numbers together give the speed — the miles that belong to one hour. Because the speed never changes, that same speed applies to the long trip, and it tells you how many hours the longer distance needs. How many parcels the van holds has no effect on how fast it travels.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The number of hours the longer drive would take.",
      commonMisreading: "Finding the speed and stopping. The speed is the tool that gets you to the answer, not the answer.",
      options: [
        { text: "The number of hours needed to cover the longer distance", correct: true,
          why: "The time is the missing car. You are given a distance and can work out a speed, so time is the only piece of the relationship left." },
        { text: "The speed the van travels at",
          why: "A genuine step, and the most common place to stop on this problem. You need it, but the question asks for hours, not miles per hour." },
        { text: "How much further the long run is than the short one",
          why: "That is a difference between two distances. Nothing in the question asks you to compare the two trips." },
        { text: "How many parcels the van delivers along the longer route",
          why: "The parcels are scenery. Nothing in the problem links how full the van is to how long it drives." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Miles and hours are locked together by a steady speed. That fixed relationship carries from the short trip to the long one unchanged, which is what lets you use one to answer the other.",
    distractors: [
      { line: "change",    whyWrong: "The van is moving, so it feels like change over time — but nothing is growing or shrinking. The speed is constant, and a constant relationship between two units is a rate, not a change." },
      { line: "compare",   whyWrong: "Two trips are mentioned, which invites comparison. But you are not asked how the trips differ; you are asked to carry one trip's speed across to the other." },
      /* This sentence used to name the speed. The Ticket Booth is two screens
         before the Engine Room asks for it. Say the shape, not the figure. */
      { line: "groups",    whyWrong: "Close, and the arithmetic overlaps — you can picture the long trip as a run of equal one-hour stretches. What makes it a rate rather than Equal Groups is that each 'group' is an hour holding miles: two different units tied together." },
      { line: "partwhole", whyWrong: "The short trip is not a part of the long trip. They are two separate journeys that happen to share a speed, and no total is being split into pieces here." }
    ],
    unknownCar: "time-from-rate",
    unknownCarPrompt: "Which car is missing?",
    /* Levelled for length, as across the line. */
    unknownCarOptions: ["the speed the van travels at", "the distance of the long run", "the hours the long run takes"],
    unknownCarAnswer: "the hours the long run takes",
    unknownCarWhy: "The long distance is given and the speed can be worked out from the short run. That leaves time as the one car nothing in the problem states.",
    supportAfter3Attempts: {
      narrowTo: ["ratio", "compare"],
      discriminator: "Ask what the two trips are doing for you. If you are measuring the gap between them, that is Compare. If one trip is being used to find a speed you then apply to the other, that is a rate."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue is "?" for the same reason as rr-poster-run: the size of
         one part is step one's answer, and the Model Yard prints it on
         every car during the PLAN phase, before any step has been solved.
         restLabel carries no count — "the second hour" is only true for the
         two-hour sets, and "the other 1 hours" is what tokenising it produces. */
      bars: [{ label: "the short run we were told about", segments: 2, segmentValue: "?", knownTotal: "{{n1}} miles", unit: "hours",
               marked: 1, markedLabel: "one hour of driving", restLabel: "the rest of the short run" }],
      a11yDescription: "One bar for the short run of {{n1}} miles, split into {{n2}} equal parts because it took {{n2}} hours at a steady speed. Each part is one hour of driving, and how many miles that holds is left blank — working it out is the first step. That figure is the speed, and it is what you then carry over to the long trip of {{n4}} miles, which is not drawn here.",
      authored: "generated"
    },
    /* Scales down to ONE hour rather than straight across to the long distance.
       Going directly needs an awkward multiplier that changes with every number
       set; getting to a single hour first is both cleaner and the move that
       generalises to every rate problem on this line. */
    ratioTable: {
      prompt: "Miles and hours travel together at a steady speed. Start by getting down to a single hour.",
      givenHeading: "The short run",
      targetHeading: "One hour",
      rows: [
        { label: "miles", given: "{{n1}}", target: "?" },
        { label: "hours", given: "{{n2}}", target: "1" }
      ],
      question: "What takes the hours from {{n2}} down to 1?",
      options: [
        { text: "÷ {{n2}}", correct: true,
          why: "The hours shared into single hours. Once you know what one hour is worth, the long trip is just a question of how many of those hours fit into it." },
        { text: "− {{n2less1}}",
          why: "It reaches 1, but subtracting is not sharing out. Do the same to the miles and you would claim the van covers {{subResult}} miles in an hour, almost the whole short run in one go." },
        { text: "× {{n2}}",
          why: "That goes the wrong way — it takes you to {{n2sq}} hours, further from a single hour, not closer." },
        { text: "÷ {{n1}}",
          why: "That divides by the miles rather than the hours. The row you are moving is the hours row: {{n2}} down to 1." }
      ],
      settledSay: "One operation, both rows. That gives you the speed.",
      law: "Whatever you do to one row, you do to the other.",
      pending: "The miles cell stays a question mark on purpose — actually sharing {{n1}} across the {{n2}} hours, and then using the result on {{n4}} miles, is the next stop.",
      a11yDescription: "A table with two rows, miles and hours, and two columns. The first column is the short run: {{n1}} miles in {{n2}} hours. The second column is a single hour, so the hours cell reads 1 and the miles cell is unknown. Getting from {{n2}} hours to 1 hour means dividing by {{n2}}, and the same division applies to the miles row. The long {{n4}}-mile trip is not in this table; it comes after the speed is known."
    },
    estimate: {
      prompt: "Before calculating — roughly how many hours do you think the long drive takes?",
      reasonableMin: 5,
      reasonableMax: 10,
      /* Brackets without naming. The old version said the long trip was "around
         three and a half times the short trip" and that the short trip "took two
         hours" — two figures a student can multiply to land on the exact answer,
         on the Plan screen, before the Engine Room. A leak does not have to
         print the number to hand it over. This version gives a size, not a sum,
         and every set's answer sits in the same handful-of-hours band. */
      modelReasoning: "The van covers {{n1}} miles in {{n2}} hours, so one hour of driving is worth tens of miles, not hundreds. The long trip is {{n4}} miles. Picture how many hour-sized chunks of road that would take — you should land on a handful of hours, not minutes and not days.",
      unit: "hours"
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "First: how many miles does the van cover in one hour?",
        answer: { exact: "{{rate}}", unit: "miles per hour", acceptedForms: ["{{rate}}", "{{rate}} mph", "{{rate}} miles per hour"] },
        workedExplanation: "The van covered {{n1}} miles in {{n2}} hours at a steady speed, so each hour got the same share. {{n1}} divided by {{n2}} is {{rate}} miles per hour. Check it: {{n2}} hours at {{rate}} miles each is {{n1}} miles.",
        misconceptions: [
          { response: "{{mMul1}}", diagnosis: "You multiplied {{n1}} by {{n2}}. That would be the distance for {{n2}} whole trips, not the distance for one hour. One hour has to be less than the {{n1}} miles, not more.", tag: "multiplied-instead-of-divided" },
          { response: "{{mAdd1}}", diagnosis: "You added the miles and the hours. Those count different things, so the total isn't a distance or a time — it isn't anything.", tag: "added-unlike-units" },
          { response: "{{mSub1}}", diagnosis: "You subtracted the hours from the miles. Taking {{n2}} hours away from {{n1}} miles doesn't leave a speed; the two units have to be divided to link them.", tag: "subtracted-unlike-units" },
          { response: "{{n1}}",    diagnosis: "That's the whole short run, which you were given. One hour of it must be smaller than the whole thing.", tag: "returned-given-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The van drove for {{n2}} hours at the same speed and covered {{n1}} miles. How much of that belongs to a single hour?" },
          { rung: 2, type: "signal",   text: "Share the {{n1}} miles equally between the {{n2}} hours." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ {{n2}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ {{n2}} = {{rate}}. The van travels {{rate}} miles every hour." }
        ]
      },
      {
        id: "s2",
        prompt: "Now: how many hours does the long run take?",
        answer: { exact: "{{ans}}", unit: "hours", acceptedForms: ["{{ans}}", "{{ans}} hours"] },
        workedExplanation: "Every hour the van covers {{rate}} miles, so the question is how many {{rate}}s fit into {{n4}}. {{n4}} divided by {{rate}} is {{ans}}. Check it the other way round: {{rate}} x {{ans}} = {{n4}}.",
        misconceptions: [
          { response: "{{mMul2}}", diagnosis: "You multiplied {{n4}} by {{rate}}. That treats the whole {{n4}} miles as if it happened in every one of {{rate}} hours. The answer has to be a number of hours, and it must be smaller than the distance.", tag: "multiplied-instead-of-divided" },
          { response: "{{mAdd2}}", diagnosis: "You added the distance and the speed. Miles and miles-per-hour are different units — adding them gives a number that measures nothing.", tag: "added-unlike-units" },
          { response: "{{mSub2}}", diagnosis: "You subtracted {{rate}} from {{n4}}. That leaves miles, not hours. To turn a distance into a time you have to divide by the speed.", tag: "subtracted-unlike-units" },
          { response: "{{rate}}",  diagnosis: "That's the speed you just worked out — the tool, not the answer. The question asks how many hours, and hours are what you get by dividing the distance by that speed.", tag: "stopped-at-rate" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Each hour of driving uses up {{rate}} miles of the journey. How many times does that have to happen to use up {{n4}}?" },
          { rung: 2, type: "signal",   text: "Divide the long distance by the miles covered in one hour." },
          { rung: 3, type: "coupling", text: "{{n4}} ÷ {{rate}} = ___" },
          { rung: 4, type: "route",    text: "{{n4}} ÷ {{rate}} = {{ans}}. The long run takes {{ans}} hours." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "hours", acceptedForms: ["{{ans}}", "{{ans}} hours"], preferredForm: "{{ans}} hours" },
    questionCheck: "The question asked for hours. The speed in miles per hour was a step on the way, not the thing being asked for.",
    unitsCheck: "hours",
    reasonablenessCheck: "{{ans}} hours at {{rate}} miles an hour is {{n4}} miles — the distance you were given. The answer rebuilds the question, which is the sign it holds.",
    reasonablenessFailExample: "If you got {{mMul2}}, that is more hours than there are in a year, for a drive of {{n4}} miles. Any time answer bigger than the distance in miles is worth a second look.",
    connection: "Same relationship as the print shop, run backwards. There you had a total and a time and wanted the rate; here you have a rate and a total and want the time. Rate, time and distance are three cars of one train — name two and the third is fixed."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and cross-checked by multiplication in both directions: 90/2=45 (2x45=90) then 315/45=7 (45x7=315); 120/2=60, 300/60=5; 150/3=50, 400/50=8; 160/4=40, 240/40=6. Every speed lands in a plausible road range (40-60 mph) and every long trip divides whole into 5-8 hours. Bar segments track n2 per set (2,2,3,4). Estimate brackets contain their own answers: 5-10/7, 3-8/5, 6-12/8, 4-9/6. Misconception responses per set verified distinct from that step's answer and from each other. numberChecks state all six arithmetic facts plus the three ratio-table derivations, so a wrong answer in a set cannot validate clean. Every mMul2 (14175, 18000, 20000, 9600) exceeds the 8760 hours in a year, which the reasonableness-fail line asserts." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Problem text FK grade 2.2-4.8, 9-12 words per sentence. Ratio Table prose FK 3.3, Junction FK 2.3. No grade level named. Animated scene carries a caption; ratio table carries an a11yDescription. Contrast on the new tokens measured earlier at 5.04:1 (arrows, unknown cell) and 5.33:1 (selected option)." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "Cycle 7b findings stand (option lengths levelled; hint rungs escalate; all four rival lines explained; irrelevant quantity present). FIXED 2026-08-01: the Ticket Booth named the speed ('a number of 45-mile hours') and the estimate's modelReasoning gave the long trip as 'around three and a half times' a short trip stated as two hours — one printed step one's answer and the other let a student multiply their way to the final answer, both before the Engine Room. Ticket Booth now describes the shape without the figure; modelReasoning gives a size band, not a sum." },
    student:   { status: "partial", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Full Ratio Local trip driven in a real browser through rr-market-stall: Read 1 empty input blocked; Read 2 rejects a distractor-only selection with a diagnosis; Read 3 and Ticket Booth graded; both ratio tables settle and leave their unknown cells blank; inverted-rate misconception (0.4) caught with the right diagnosis; both steps solved; Arrivals Board reached. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-07-30", notes: "Cycle 7b. Maths independently re-derived from the problem story rather than checked against the stated answer; every number set re-solved. Approved for the mechanical, mathematical and pedagogical properties measured. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16 and REVIEW-LOG.md Cycle 7b." }
  }
});
