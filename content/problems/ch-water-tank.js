/* The Change Line · START unknown · water · independent · SWITCHYARD
   THE PROBLEM THIS LINE EXISTS FOR.

   The story says more went in. The move is a subtraction. Every keyword
   strategy a struggling student has ever been taught fails here, and it fails
   silently — "another 180 litres were pumped in" reads as add, the addition
   works cleanly, and the answer it produces is wrong. There is no arithmetic
   slip to notice.

   That is why the unknown sits at the FRONT. The line's three problems put the
   missing car in all three positions on purpose: ch-lost-property (result
   missing) lets "more means add" succeed, ch-kiosk-sandwiches (change missing)
   makes it ambiguous, and this one breaks it. A rule that works twice and
   fails the third time is worse than no rule, and the only way to show that is
   to let a student meet all three.

   Placed at the Switchyard because the decision genuinely forks before any
   calculating starts: which direction do you travel along the train?

   FOUR NUMBER SETS. Constraints:
     - The tank must end holding MORE than was pumped in, or the starting
       amount is negative and the story collapses.
     - The starting amount must differ from both givens and from the trap
       value, so every diagnosis lands on exactly one mistake.
     - Volumes stay in hundreds of litres, which is a real station water tank
       rather than a bath or a reservoir.

   Verified both ways for each set — the subtraction that recovers the start,
   and the addition that replays the morning:
     460 - 180 = 280   (280 + 180 = 460)
     610 - 240 = 370   (370 + 240 = 610)
     395 - 150 = 245   (245 + 150 = 395)
     700 - 320 = 380   (380 + 320 = 700) */
MF.registerProblem({
  id: "ch-water-tank",
  schemaVersion: 1,
  status: "published",
  title: "What was there to begin with",
  line: "change",
  topics: ["start-unknown", "subtraction", "inverse-operations"],
  steps: 1,

  unknownCar: "start",
  context: "water",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "drafting"],
  hubStrategyNote: "The story says more went in and the answer comes from taking away. Nothing but working out which car is missing will get a student to the right operation, which makes this the sharpest test of strategy selection on the site.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-01" },

  numberChecks: [
    ["n2", "-", "n1", "=", "ans"],
    ["ans", "+", "n1", "=", "n2"],
    ["n2", "-", "ans", "=", "n1"],
    ["n2", "+", "n1", "=", "add"]
  ],

  numberSets: [
    { numbers: { n1: "180", n2: "460", n3: "6" },
      derived: { ans: "280", add: "640" },
      estimate: { min: 200, max: 350 } },
    { numbers: { n1: "240", n2: "610", n3: "8" },
      derived: { ans: "370", add: "850" },
      estimate: { min: 260, max: 460 } },
    { numbers: { n1: "150", n2: "395", n3: "5" },
      derived: { ans: "245", add: "545" },
      estimate: { min: 170, max: 300 } },
    { numbers: { n1: "320", n2: "700", n3: "9" },
      derived: { ans: "380", add: "1020" },
      estimate: { min: 270, max: 470 } }
  ],

  scene: {
    mode: "anim", art: "tank",
    caption: "Water running down the pipe into the station tank, with the level climbing behind the glass.",
    /* The gauge beside the tank deliberately carries NO markings. A scale with
       numbers on it would be the answer, drawn, on the screen before the
       Engine Room asks for it — and the level shown is the AFTER level, which
       is a given. What was in there to begin with is not drawn at all. */
    authored: "generated"
  },

  problem: {
    text: "The station keeps a water tank behind the signal box for the platform taps. Nobody looks at it until something goes wrong. On Monday morning a tanker pumped another {{n1}} litres into it. After that the tank held {{n2}} litres. The platform has {{n3}} stiff brass taps. How many litres were in the tank before the tanker came?",
    sentences: [
      "The station keeps a water tank behind the signal box for the platform taps.",
      "Nobody looks at it until something goes wrong.",
      "On Monday morning a tanker pumped another {{n1}} litres into it.",
      "After that the tank held {{n2}} litres.",
      "The platform has {{n3}} stiff brass taps.",
      "How many litres were in the tank before the tanker came?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "180", unit: "litres", role: "change",     spoken: "180" },
      n2: { value: "460", unit: "litres", role: "result",     spoken: "460" },
      n3: { value: "6",   unit: "taps",   role: "distractor", spoken: "6" }
    },
    context: { setting: "station water tank", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A tank already had some water in it. A tanker put more in, and we are told how much was in there afterwards. We want to know how much was in it before the tanker arrived.",
      /* Platform Check §3.7. The tell is the tanker arriving — and the `why`
         carries this problem's whole reason for existing: the story says water
         went IN, which is not the same as saying what to do about it. */
      platformCheck: {
        sentences: [2, 3],
        /* Two leaks removed 2026-08-04, both mine, both found by math.
           The old copy ended "nothing says what the tank held to start with,
           which is exactly what you are being asked for" — that is verbatim
           the Ticket Booth's gated `unknownCarAnswer`, two screens early.
           It also said "the story says water went IN — which is not the same
           thing as telling you what to do with it", which DISARMS the Signal
           Failure this whole problem exists to spring. This problem is named
           in PEDAGOGY §2.2 as the one that makes "more means add" fail; the
           trap has to be walked into, not pointed at. */
        why: "Between them those sentences give the event and what it left behind. The tanker arrives, and afterwards the tank holds something different. A single amount, at a before and an after — that is the shape of it.",
        kinds: "Everything counted here is litres of water."
      },

      /* PER-PROBLEM PLATFORM CHECK QUESTIONS — first of three, Change Line.
         The shared questions ask in the abstract, so their answers are the same
         for every problem on a line and a student can take them off the station
         header without reading. These name this story's own quantities, so they
         cannot be. Note `kinds` uses the DISTRACTOR — the taps — as the thing
         to rule out, which turns an irrelevant number into the teaching.
         No digits and no number words: this screen is numberless. */
      questions: {
        kinds: {
          ask: "This story counts litres of water, and it also counts taps on the platform. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The taps are scenery. Everything the question is about is water, measured in litres, in the same tank.",
                         no:  "That would mean the litres and the taps were pinned to each other &mdash; that filling the tank changed how many taps the platform has. Nothing in the story ties them together." },
            different: { yes: "", no: "That would mean pumping water in changed the number of taps. The taps sit there whatever the tank is doing." }
          }
        },
        moments: {
          ask: "The tank on Monday morning, and the tank after the tanker had been. Does any amount end up different from how it started?",
          options: {
            changed: { yes: "The tanker put water in, so the tank afterwards is not the tank before. That gap is the whole problem.",
                       no:  "" },
            steady:  { yes: "", no: "That would mean the tank held the same amount all through. But a tanker arrives partway, and after it the tank holds something else." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just the tank, or the tank and something else being measured against it?",
          options: {
            single:   { yes: "A single tank, at different moments. Everything else in the story is about that tank.", no: "" },
            separate: { yes: "", no: "That would mean a second tank, or a second amount, set beside it so you could measure the gap between them. There is only the tank here." },
            paired:   { yes: "", no: "That would mean litres pinned to something else, so that changing either moved the other. The tanker changes the water and nothing else." }
          }
        },
        shape: {
          ask: "Is the water being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            cut:     { yes: "", no: "That would mean the tank's water divided into shares that add back up to the tankful. Nothing here is being divided." },
            repeat:  { yes: "", no: "That would mean the same delivery arriving again and again, with the question counting how many. The tanker comes and goes, and that is that." },
            neither: { yes: "Nothing is cut into shares and nothing repeats. The water simply ends up at a different level.", no: "" }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; from Monday morning, through the tanker, to what the tank held after?",
          options: {
            onekind: { yes: "A starting amount, something happening to it, and a finishing amount. The same kind of situation the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a tank changing amount and nothing else &mdash; no second kind of situation stacked on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This is a tank with a before and an after, which sits squarely on the Change Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how much the tanker pumped in", needed: true },
        { token: "n2", describe: "how much the tank held afterwards", needed: true },
        { token: "n3", describe: "how many taps the platform has", needed: false }
      ],
      relationship: "One of these is the amount that arrived, and the other is the tank AFTER it arrived. The tank already had water in it before any of that happened, and that starting amount is the thing nobody states. The taps have nothing to do with how much water was in the tank on Monday morning.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How much water was in the tank before the tanker came.",
      commonMisreading: "Reading 'another {{n1}} litres were pumped in' and adding, because the story sounds like something is being gained. It is — but what is gained is already counted in the {{n2}}.",
      options: [
        { text: "How much water was in the tank before the tanker came", correct: true,
          why: "The amount at the START, before anything happened. It is the only one of the three the story never tells you — and it is smaller than the {{n2}}, not bigger." },
        { text: "How much the tanker pumped in",
          why: "You were told that. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "How much the tank held after the delivery",
          why: "Also given. That is where the story finished, not where it started." },
        { text: "How much water each tap uses",
          why: "The taps are scenery. Nothing in the problem links them to what was in the tank." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    whyCorrect: "One tank of water at two moments, with a delivery in between. A before, an event, an after — and here it is the BEFORE that is missing, which is what makes it the hardest shape on this line.",
    distractors: [
      { line: "partwhole", whyWrong: "Genuinely close: the final tankful is made of what was already there plus what arrived, so it does look like two parts making a whole. What decides it is time — the two amounts were never both sitting there at once. One replaced the other." },
      { line: "compare",   whyWrong: "You are not being asked how much more one thing is than another. There is one tank here, described twice, not two rival quantities set side by side." },
      { line: "groups",    whyWrong: "Nothing repeats. One delivery happened once; there is no equal group counted over and over." },
      { line: "ratio",     whyWrong: "Everything is measured in litres — a single unit. A rate would need two different quantities locked together, like litres per minute, and the problem never says how long the pumping took." }
    ],
    unknownCar: "start",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["what the tank held before", "how much was pumped in", "what the tank held after"],
    unknownCarAnswer: "what the tank held before",
    unknownCarWhy: "The delivery is stated and so is the tank afterwards. What was in there to begin with is the one car nothing in the story gives you — and finding it means travelling backwards along the train.",
    supportAfter3Attempts: {
      narrowTo: ["change", "partwhole"],
      discriminator: "Ask whether the two amounts ever existed at the same moment. Parts of a whole all sit there together. Here the water that was already in the tank and the water that arrived are the same tank before and after, which makes it Change."
    }
  },

  signalBox: {
    changeTrain: {
      title: "The Change Train",
      heading: "Three cars, and the missing one is at the front",
      prompt: "The story runs forwards, but the car you need is behind you. Work out which way to travel.",
      cars: [
        { label: "What the tank held before", value: "?", unit: "litres" },
        { label: "What the tanker put in", value: "+ {{n1}}", unit: "litres" },
        { label: "What the tank held after", value: "{{n2}}", unit: "litres" }
      ],
      question: "Which move reaches the missing car?",
      options: [
        { text: "{{n2}} − {{n1}}", correct: true,
          why: "You know where the story ENDED and what happened along the way, so you travel backwards. Undo the delivery: take the water that arrived back out of the tank, and what is left is what was already in there." },
        /* THE POINT OF THIS PROBLEM. The story says "another ... pumped in",
           every keyword rule says add, and this option is what that rule
           produces. It has to be on the button row or the rule is never tested. */
        { text: "{{n2}} + {{n1}}",
          why: "This is the trap, and it is the most important wrong answer on this line. The story says water was ADDED, so adding feels right — but the {{n2}} is already the amount AFTER the delivery. Adding the delivery a second time counts it twice, and gives a tank fuller than it ever was. Which move you make depends on which car is missing, not on the words in the story." },
        { text: "{{n1}} − {{n2}}",
          why: "Right idea, wrong way round. This takes the whole tankful off the delivery, which asks how much bigger the delivery was than the tank — and it was not. Check which number is the ending amount before choosing an order." }
      ],
      settledSay: "Backwards along the train. Undoing the change is how you get to a missing start.",
      law: "Which move you make depends on WHICH car is missing, not on the words in the story.",
      pending: "The front car stays a question mark on purpose — actually doing the subtraction is the next stop.",
      /* This used to end "...you reach it by travelling backwards: take the
         {{n1}} litres that arrived off the {{n2}} litres" — which is the answer
         to the question printed directly above it on the same screen ("Which
         move reaches the missing car?"), and `change-model.js:114` renders this
         string in a VISIBLE "In words:" paragraph, not only to a screen reader.
         Cycle 30. It now stops where the picture stops, which is what the Test
         Track descriptions in this same file already do. */
      a11yDescription: "A train of three cars. The first car, what the tank held before the tanker came, is unknown. The second is what the tanker put in, {{n1}} litres. The third is what the tank held afterwards, {{n2}} litres. The missing car is at the FRONT of the train, and the change added water — which way you travel to reach it is the question below."
    },
    estimate: {
      prompt: "Before calculating — roughly how many litres do you think were in the tank before the tanker came?",
      reasonableMin: 200,
      reasonableMax: 350,
      modelReasoning: "The tank ended with {{n2}} litres and some of that arrived on Monday morning, so what was already in there must be LESS than {{n2}}. That is the whole trap on this problem: the story sounds like adding, and the answer is smaller than the number you were given. Round both to the nearest hundred and find the gap.",
      unit: "litres"
    },
    /* THE TEST TRACK, replacing the Junction. This is the problem the whole
       line exists for, and the demonstration is about DIRECTION — which is
       exactly what the words get wrong here. The story says water was added;
       the journey runs backwards.

       The engine stops ON the gap and the gap keeps its question mark. Arriving
       there with a number would be the answer, so it never arrives with one. */
    testTrack: {
      kind: "drive",
      title: "The Test Track",
      heading: "Which way does the story run?",
      intro: "Every story on this line is three cars: what you started with, what happened, what you ended with. Where the gap sits decides which way you travel to reach it — and the words in the story do not get a vote. Watch one.",
      worked: {
        label: "A story with the END missing.",
        button: "Show me",
        cars: ["what it started with", "what happened", "what it ended with"],
        gap: 2, from: 0,
        sayCut: "The gap is at the far end, and both of the other cars are known.",
        sayTake: "So the engine starts at the beginning and runs FORWARDS through what happened. Travelling forwards along the story is adding."
      },
      yours: {
        wholeLabel: "Your story. Look at where the gap is before you decide anything.",
        cars: ["What the tank held before", "What the tanker put in", "What the tank held after"],
        gap: 0,
        q1: "Which car do you have to set off from?",
        options1: [
          { text: "What the tank held after", correct: true,
            why: "It is the only end of the story you were told. The gap is at the beginning, so the ending amount is where a journey towards it has to start." },
          { text: "What the tank held before",
            why: "That is the gap itself — the thing you are trying to reach. You cannot set off from the car you are looking for." },
          { text: "What the tanker put in",
            why: "That is the middle car, the event. It tells you the size of the step but it is not an amount the tank ever held, so it is not a place to start from." }
        ],
        settled1: "You set off from the ending amount, because that is the end of the story you know.",
        q2: "So which way do you travel to reach the gap?",
        options2: [
          { text: "Backwards, against the story", correct: true, from: 2,
            why: "The gap is BEFORE the delivery, so you have to undo it. Travelling backwards against the story is subtracting — even though the story says water was added. Where the gap sits decides this, not the words." },
          { text: "Forwards, the way the story runs", from: 0,
            why: "Forwards takes you further from the gap, not towards it. You would be adding the delivery a second time, to a tank that already had it." },
          { text: "It does not matter which way",
            why: "It decides whether you add or subtract, so it matters more than anything else on this screen. The two directions give two different answers and only one of them is real." }
        ],
        settled2: "Backwards from the ending amount, against the story, to the gap at the start."
      },
      law: "Where the gap sits decides which way you travel. Forwards is adding, backwards is subtracting — and the words in the story never decide it.",
      bridge: "The engine has stopped on the gap and left it blank on purpose. What actually goes in it is the Engine Room's question.",
      a11yDescription: "A demonstration about direction of travel, using no arithmetic. First a three-car story with the end missing: both other cars are known, so the engine starts at the beginning and runs forwards, which is adding. Then your own story, where the gap is the FIRST car — what the tank held before. The only end you know is the ending amount, so the engine sets off from there and runs backwards against the story, which is subtracting, even though the story says water was put in. The engine stops on the gap and the gap stays a question mark; what goes in it is the next question, in the Engine Room."
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many litres were in the tank before the tanker came?",
        answer: { exact: "{{ans}}", unit: "litres", acceptedForms: ["{{ans}}", "{{ans}} litres", "{{ans}} l"] },
        workedExplanation: "The tank finished with {{n2}} litres, and {{n1}} of those had just been pumped in. So the rest of it was already there: {{n2}} − {{n1}} = {{ans}} litres. Check it forwards, the way the story runs: {{ans}} litres in the tank plus the {{n1}} delivered is {{n2}} litres, exactly what the tank held afterwards.",
        misconceptions: [
          { response: "{{add}}", diagnosis: "You added, because the story says water was pumped in. This is the trap this problem is built around. The {{n2}} litres is the amount AFTER the delivery — the water the tanker brought is already inside that number. Adding it again counts it twice, and gives a tank holding more than it ever did.", tag: "keyword-addition" },
          { response: "{{n2}}",  diagnosis: "That is what the tank held AFTER the tanker had been. The question asks what was in there before it arrived, which has to be less.", tag: "returned-given-value" },
          { response: "{{n1}}",  diagnosis: "That is what the tanker pumped in — the change, not the starting amount. It is what the tank gained, not what it already had.", tag: "answered-the-change" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The {{n2}} litres includes the water the tanker just delivered. So is the amount that was already in the tank bigger or smaller than {{n2}}?" },
          { rung: 2, type: "signal",   text: "Run the story backwards. Take the {{n1}} litres the tanker brought back out of the {{n2}} litres the tank ended up with." },
          { rung: 3, type: "coupling", text: "{{n2}} − {{n1}} = ___" },
          { rung: 4, type: "route",    text: "{{n2}} − {{n1}} = {{ans}}. There were {{ans}} litres in the tank before the tanker came." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "litres", acceptedForms: ["{{ans}}", "{{ans}} litres", "{{ans}} l"], preferredForm: "{{ans}} litres" },
    questionCheck: "The question asked what was in the tank BEFORE the delivery — not what arrived, and not what was in there afterwards.",
    unitsCheck: "litres",
    reasonablenessCheck: "{{ans}} litres to start with, plus the {{n1}} the tanker brought, comes to {{n2}} litres — exactly what the tank held afterwards. Replaying the story forwards is the real check on a backwards answer.",
    reasonablenessFailExample: "If you got {{add}}, the tank would have held more before the delivery than it did after it — a tanker that empties a tank by filling it.",
    /* The keyword lesson lives HERE, in `connection`, because `connection` is
       rendered. It was briefly split into a `keywordWarning` field of its own —
       which no code reads, making it exactly the dead authored content this
       project already has thirty-odd strings of in `signalBox.plan[]`. Writing
       a new one while that decision is still open would have been careless.
       Merged back into the field the Arrivals Board actually shows. */
    connection: "This is the one to remember. The story said water was added and the answer came from taking away, because the missing car was at the FRONT of the train. Any rule of the form 'more means add' passes the first two problems on this line and fails this one — which is exactly what makes it worth losing. Words tell you what happened; the shape of the train tells you what to do about it."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved and checked by replaying the story forwards: 460-180=280 (280+180=460); 610-240=370 (370+240=610); 395-150=245 (245+150=395); 700-320=380 (380+320=700). The ending volume exceeds the delivery in every set, so the starting amount stays positive. The answer differs from both givens and from the keyword-addition trap in every set, so each of the three diagnoses lands on exactly one mistake. Volumes stay in the hundreds of litres, which is a plausible station tank. Estimate brackets contain their answers: 200-350/280, 260-460/370, 170-300/245, 270-470/380." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Problem text Flesch-Kincaid grade 4.3 at 8.8 words per sentence, inside the site's band. No grade level named. Scene caption and Change Train a11yDescription present in all four sets, and the tank's sight gauge is deliberately drawn with no markings — a numbered scale would be the answer, drawn, on the Plan screen." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "This problem keeps its read3 correct option as the longest DELIBERATELY (53 characters against 29/41/28). With three problems on the line, one longest gives 33.3% against 25% chance — the closest reachable to chance from above, and Cycle 7b showed that levelling every problem drives 'always pick the longest' to 0%, which is the identical tell inverted. Keyword-strategy regex returned 5 hits, all on this problem, all read in context and all structural: they describe the trap and refute it ('the story says water was ADDED, so adding feels right — but...'), or are tag names and review notes not visible to students. FIXED this pass: an invented arrivals.keywordWarning field was read by no code — dead authored content of exactly the kind this project already has 36 strings of in signalBox.plan[]. Merged into `connection`, which the Arrivals Board actually renders." },
    student:   { status: "partial", agent: "claude-session", date: "2026-08-01",
                 notes: "The keyword trap was driven directly in all four number sets: the 'more means add' answer (n2 + n1) is matched and diagnosed as keyword-addition every time, never grades as correct, and the trap option is present on the Change Train's button row in all four sets — it has to be offered or the rule is never tested. The answer never appears on any of the four Plan screens. The line's shared interaction surfaces were driven live on ch-lost-property. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-08-01",
                 notes: "Approved for the mechanical, mathematical, theme and teacher properties measured, with student recorded as partial. TWO LIMITATIONS, stated plainly. Reviewed by the agent that authored it (VERIFICATION.md 16). And this problem carries the line's central claim — that keyword strategies fail — which is a pedagogical judgement that measurement cannot confirm and that only classroom use will settle." }
  }
});
