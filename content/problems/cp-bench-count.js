/* The Compare Line · SMALLER unknown · platforms · independent · SWITCHYARD
   THE PROBLEM THIS LINE EXISTS FOR, and the twin of ch-water-tank.

   The story says "more" and the move is a SUBTRACTION. Every keyword strategy a
   struggling student has been taught fails here, and it fails silently: "the
   express has {{n2}} more benches" reads as add, the addition works cleanly,
   and the number it produces is wrong. There is no arithmetic slip to notice.

   It is deliberately third. cp-ticket-queues has just let "more means add"
   succeed, on a story with almost identical wording — "the queue at the window
   had {{n2}} more people than that" against "the express has {{n2}} more
   benches than the local". A rule that fails the first time it is used teaches
   nothing. A rule that works and is then taken away is the one that gets
   replaced, and what replaces it is the question the Plan phase asks: which
   amount is being measured AGAINST which.

   THE STRUCTURAL DIFFERENCE, which is the whole lesson: in problem 2 the
   unknown was the LARGER amount, so the gap was added on the end. Here the
   unknown is the SMALLER one, so the gap comes off. The picture is the same
   picture — a base bar with the difference marked off the end of the longer —
   and only the position of the "?" moves. The words are no help; the position
   of the unknown is everything.

   Placed at the Switchyard because the decision genuinely forks before any
   arithmetic starts: do you travel up from the known amount or down from it?

   FOUR NUMBER SETS. Constraints:
     - the express count must EXCEED the difference, or the local platform has a
       negative number of benches and the story collapses;
     - the answer must differ from both givens and from the wrong-way addition,
       so each of the three misconceptions diagnoses exactly one mistake;
     - bench counts stay plausible for a platform.

   Verified both ways per set — the subtraction that recovers the local count,
   and the addition that rebuilds the express one:
     31 - 12 = 19  (19 + 12 = 31)   wrong-way 31 + 12 = 43
     27 - 8  = 19  (19 + 8  = 27)   wrong-way 27 + 8  = 35
     34 - 15 = 19  (19 + 15 = 34)   wrong-way 34 + 15 = 49
     26 - 9  = 17  (17 + 9  = 26)   wrong-way 26 + 9  = 35 */
MF.registerProblem({
  id: "cp-bench-count",
  schemaVersion: 1,
  status: "published",
  title: "How many benches the local platform has",
  line: "compare",
  topics: ["smaller-unknown", "subtraction", "referent", "inverse-operations"],
  steps: 1,

  unknownCar: "smaller",
  context: "platforms",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "drafting"],
  hubStrategyNote: "The story says more and the answer comes from taking away. Nothing but working out which amount is being measured against which will get a student to the right operation, which makes this the sharpest test of strategy selection on the line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-04" },

  numberChecks: [
    ["n2", "-", "n1", "=", "ans"],
    ["ans", "+", "n1", "=", "n2"],
    ["n2", "-", "ans", "=", "n1"],
    ["n2", "+", "n1", "=", "mAdd"]
  ],

  numberSets: [
    { numbers: { n1: "12", n2: "31", n3: "5" },
      derived: { ans: "19", mAdd: "43" },
      estimate: { min: 12, max: 28 } },
    { numbers: { n1: "8",  n2: "27", n3: "7" },
      derived: { ans: "19", mAdd: "35" },
      estimate: { min: 13, max: 26 } },
    { numbers: { n1: "15", n2: "34", n3: "4" },
      derived: { ans: "19", mAdd: "49" },
      estimate: { min: 12, max: 28 } },
    { numbers: { n1: "9",  n2: "26", n3: "6" },
      derived: { ans: "17", mAdd: "35" },
      estimate: { min: 11, max: 24 } }
  ],

  problem: {
    /* THE ADJECTIVES HERE ARE CHOSEN NOT TO CUE THE ANSWER. "Busy" and "quiet"
       describe how crowded the platforms are, which the story never counts;
       "long" and "short" would have been a physical hint at which has more
       benches, on the problem whose whole trap is that the wording points the
       wrong way. Description may add colour to a story. It may not answer it. */
    text: "Thorne Bridge has a busy express platform and a quiet local one across the tracks. The express platform has {{n1}} more green iron benches than the local one. There are {{n3}} waiting rooms on the station, all of them cold. The express platform has {{n2}} benches in all. How many benches does the local platform have?",
    sentences: [
      "Thorne Bridge has a busy express platform and a quiet local one across the tracks.",
      "The express platform has {{n1}} more green iron benches than the local one.",
      "There are {{n3}} waiting rooms on the station, all of them cold.",
      "The express platform has {{n2}} benches in all.",
      "How many benches does the local platform have?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "12", unit: "benches",      role: "difference", spoken: "12" },
      n2: { value: "31", unit: "benches",      role: "larger",     spoken: "31" },
      n3: { value: "5",  unit: "waiting rooms", role: "distractor", spoken: "5" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  /* THE BENCHES ARE THE ANSWER, so neither row has a first bench or a last one:
     both run off both edges of the frame, and the two rows sit half a pitch out
     of step so they never pair up into something countable across. The canopy is
     the only thing telling the platforms apart, and it tells them apart without
     ranking them by size — which of them has more benches is the story's to say
     and the picture's to stay out of. */
  scene: {
    mode: "anim", art: "platforms",
    caption: "The express platform under its canopy and the local platform below it, benches running away along both."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Two platforms both have benches. We are told how many more the express platform has, and how many it has altogether, and we want to know how many the local platform has.",
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give the gap between the platforms and the size of the bigger platform. Notice what is missing: nothing states the local platform's benches, and that is what the question wants.",
        kinds: "Everything counted here is benches on a platform."
      },

      questions: {
        kinds: {
          ask: "This story counts benches, and it also counts the station's waiting rooms. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The waiting rooms are elsewhere on the station. Everything being compared is benches.",
                         no:  "That would mean benches and waiting rooms were pinned to each other, so that adding a bench built a room. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the benches scaled with the waiting rooms. How many rooms the station has says nothing about how many benches a platform has." }
          }
        },
        moments: {
          ask: "Does either platform end up with a different number of benches from how it started?",
          options: {
            steady:  { yes: "No bench is added or taken away. Both platforms simply have what they have, and the story compares them.", no: "" },
            changed: { yes: "", no: "That would mean benches arriving or being removed partway through. Read it again — nothing is done to either platform, they are just described." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single platform, or separate platforms held up against each other?",
          options: {
            separate: { yes: "The express platform and the local platform, both standing there, with the story measuring the gap between them.", no: "" },
            single:   { yes: "", no: "That would mean only a single platform was ever in view. Count how many the story gives you bench numbers about." },
            paired:   { yes: "", no: "That would mean benches locked to something else and scaled. The gap here is a fixed number of benches, not a relationship that grows." }
          }
        },
        shape: {
          ask: "Are the benches being shared out into parts, or is the same number repeating, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares and nothing repeats. Separate amounts are set side by side.", no: "" },
            cut:     { yes: "", no: "Tempting, because the express benches do split into \"as many as the local has\" and \"the extra\". But the story never names a whole that both platforms are parts of — the express platform is not made up of the local platform." },
            repeat:  { yes: "", no: "That would mean the same run of benches over and over, with the question counting how many. Each platform has its benches once." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the gap, the express platform, and the local platform?",
          options: {
            onekind: { yes: "Amounts side by side and a gap between them, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a gap and the amounts it sits between, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A platform measured against another platform is squarely the Compare Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many more benches the express platform has", needed: true },
        { token: "n3", describe: "how many waiting rooms the station has", needed: false },
        { token: "n2", describe: "how many benches the express platform has", needed: true }
      ],
      relationship: "One of these is a whole platform's benches and the other is only the GAP between the platforms — read them carefully, because both sentences are about the express platform and only one of them is a count of its benches. The local platform is the express platform's count with the gap taken off. The waiting rooms are elsewhere and have no benches in this story.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many benches are on the local platform.",
      commonMisreading: "Reading \"more\" and reaching for the total of the two numbers, which describes nothing in the story.",
      options: [
        { text: "How many more benches the express platform has",
          why: "You were handed that. It is the gap between the platforms, not a count of benches on either." },
        { text: "The benches on the local platform", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many benches the express platform has",
          why: "Also given. It is the amount the local platform is being measured against." },
        { text: "The benches on both platforms together",
          why: "Nothing asks for a total. Adding them would be adding a count of benches to a gap, which describes nothing that exists." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "Two platforms exist at once, neither of them changing, and the story states the gap between them. Measuring one amount against another is the Compare Line — even when the missing amount is the smaller one.",
    distractors: [
      { line: "change",    whyWrong: "Nothing happens to either platform. Change needs one amount that ends up different from how it started, and no bench moves in this story. It is tempting because taking away feels like something happening — but the subtraction is how you MEASURE the gap, not something the station did." },
      { line: "partwhole", whyWrong: "The closest one to argue for, because the express benches do divide into \"as many as the local\" and \"the extra\". But Part–Whole needs a named whole that the pieces belong to, and the local platform is not a part of the express platform — they are separate places that happen to be compared." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and these are two platforms with different bench counts, each described once." },
      { line: "ratio",     whyWrong: "The gap is a fixed number of benches, not a fixed relationship. On the Ratio Rail, doubling one platform would double the other; here the express platform has a set number MORE, which stays the same size whatever the counts are." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "the local platform's benches",
      "the express platform's benches",
      "the gap between the platforms"
    ],
    unknownCarAnswer: "the local platform's benches",
    unknownCarWhy: "Both sentences with numbers in them are about the express platform — one gives its bench count and the other gives the gap. The local platform is never counted, and that is what the question asks for."
  },

  signalBox: {
    compareBars: {
      title: "Side by side",
      heading: "The bigger platform, and the gap on the end of it",
      prompt: "One of these platforms is being measured against the other. Tap the one it is measured AGAINST.",
      bars: [
        { key: "local",   label: "Local platform",   unknown: true },
        { key: "express", label: "Express platform", token: "n2" }
      ],
      gapToken: "n1",
      unknownIs: "smaller",
      referent: "local",
      gapLabel: "the local platform's benches",
      why: "The express platform is measured against the LOCAL one — \"more benches than the local one\". So the local platform is what you measure against, even though it is the amount you do not know yet. The gap sits on the end of the express bar, and what is left underneath it is the answer.",
      whyWrong: {
        express: "The express platform is the one being measured — the story says it has more benches THAN something else. Find what follows \"than\": that is the amount being measured against, and here it happens to be the one you have to work out."
      },
      a11yDescription: "Two bars. The express platform is drawn to its full length, with the gap marked off on the end of it. The local platform is drawn as the part left underneath, outlined rather than filled, with a question mark for its total because the story never states it.",
      settledSay: "Whatever follows the word \"than\" is the amount you measure against — even when that is the amount you are looking for."
    },
    estimate: {
      prompt: "Before calculating — roughly how many benches do you think the local platform has?",
      reasonableMin: 12,
      reasonableMax: 28,
      modelReasoning: "The local platform has FEWER benches than the express one, so the answer has to be less than {{n2}}. And only {{n1}} benches separate them, so it is not far below. Round both to the nearest ten and take one off the other in your head.",
      unit: "benches"
    },

    /* THE TEST TRACK. Between the estimate and the Engine Room, as on every
       other line — the Compare Line shipped without one and went straight from
       estimating to calculating, which is the gap Cycle 11 exists to close.

       The worked pair runs on 8 and 13, which belong to no problem or set on
       this line, so nothing here can hand over an answer (VERIFICATION.md §26).
       And it is deliberately the OPPOSITE shape to this problem's — the demo is
       missing the larger amount, this problem is missing the smaller — so the
       student sees the same picture with the "?" at the other end and has to
       notice that the sentence sounds identical either way. */
    testTrack: {
      kind: "compare",
      title: "The Test Track",
      heading: "Which end is the question mark on?",
      intro: "Every problem on this line is two amounts and the gap between them. Which way you travel depends on WHICH of the three the story leaves out — never on the words it uses. Watch one.",
      worked: {
        label: "A story missing the BIGGER amount. The smaller one and the gap are both given.",
        button: "Show me",
        known: { label: "Shorter shelf", val: "8" },
        unknown: { label: "Longer shelf" },
        gapText: "5 more",
        unknownIsLarger: true,
        sayCut: "The shorter shelf holds 8, and the longer one holds 5 more than that.",
        sayTake: "The gap sits on the END of the bar you are looking for, so you travel up from what you know. Notice the picture stops there — it does not work the total out."
      },
      yours: {
        wholeLabel: "Your story. Look at where the question mark is before you decide anything.",
        known: { label: "Express platform", val: "{{n2}}" },
        unknown: { label: "Local platform" },
        gapText: "{{n1}} more",
        unknownIsLarger: false,
        q1: "Which amount does your story already give you?",
        options1: [
          { text: "The express platform", correct: true, marks: "known",
            why: "The story counts the express platform's benches outright. The local platform is never counted." },
          { text: "The local platform",
            why: "Read it again — both sentences with numbers in them are about the express platform. One gives its bench count and the other gives the gap. The local platform is never counted." },
          { text: "Neither of them, only the gap",
            why: "The gap is given, that part is right. But so is the express platform — its benches are counted outright in the last sentence before the question." }
        ],
        settled1: "You have the bigger amount, and you have the gap.",
        q2: "So which way do you travel to reach the local platform?",
        options2: [
          { text: "Take the gap off", correct: true, marks: "off",
            why: "The gap is marked on the END of the express bar. What is left underneath it is the local platform, so the gap comes off." },
          { text: "Add the gap on", marks: "on",
            why: "That would make the local platform BIGGER than the express one — on a story that says the express platform has more. Watch where the gap sits: it is on the end of the bar you already have, not on the end of the one you want." },
          { text: "Multiply by the gap", marks: "off",
            why: "The gap is a fixed number of extra benches, not a number of times bigger. Multiplying would describe an express platform several times the size of the local one, which the story never says." }
        ],
        settled2: "Take the gap off the amount you have, and what is left is the one you want."
      },
      law: "Where the question mark sits decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the subtraction is the next stop.",
      a11yDescription: "A demonstration in two bars. First a worked example: a shorter shelf holding eight, and a longer shelf drawn as the same length again with a hatched piece marked \"five more\" on its end, its total unknown — so you travel up from what you know. Then your own story, which is the other way round: the express platform is drawn in full with the hatched gap on its end, and the local platform is the part left underneath, carrying the question mark, so you travel down. Nothing is calculated in either picture."
    }
  },

  /* The Signal Failure this line is built around. The trap has to be walked
     into, not pointed at, so nothing before the Engine Room says a word about
     it — see ch-water-tank, where naming it early disarmed it.

     Top-level, NOT inside signalBox, and that placement is load-bearing: this
     renders at the Arrivals Board (Phase 4b), after the answer is already on
     the screen. Sitting inside signalBox is what would tempt the next author
     to put it on the Plan screen, where "why is the answer smaller than the
     number you were given" hands over the whole of step 1. */
  signalFailure: {
    trigger: "more",
    prompt: "The story says the express platform has MORE benches. Why is the answer smaller than the number you were given?",
    why: "Because the sentence is telling you about the express platform, not the local one. \"More benches than the local one\" says the express platform is the bigger of the two — so the local platform, the one you are being asked for, has to come out below it. The word tells you which is bigger. It does not tell you what to do."
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many benches does the local platform have?",
        answer: { exact: "{{ans}}", unit: "benches", acceptedForms: ["{{ans}}", "{{ans}} benches"], preferredForm: "{{ans}}" },
        workedExplanation: "The express platform has {{n2}} benches, and {{n1}} of those are the gap between it and the local platform. Take the gap off and what is left is the local platform: {{n2}} − {{n1}} = {{ans}} benches. Check it forwards — {{ans}} + {{n1}} = {{n2}}, the express platform exactly. And notice what just happened: the story said \"more\" and the move was a subtraction.",
        hints: [
          { rung: 1, text: "Read the sentence with \"more\" in it again. Which platform is it telling you about — the one you know, or the one you are looking for?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The gap is marked off the END of the express bar. What is left underneath it?" },
          { rung: 3, text: "The local platform is the express platform with the gap taken off: {{n2}} − {{n1}} = ___" },
          { rung: 4, text: "{{n2}} − {{n1}} = {{ans}}. The local platform has {{ans}} benches." }
        ],
        misconceptions: [
          { response: "{{mAdd}}", diagnosis: "You added, because the story says \"more\". This is the trap this problem is built around. The word \"more\" is telling you the EXPRESS platform is the bigger one — and you were already given the express platform's count. Adding makes the local platform bigger than the platform it is supposed to have fewer benches than.", tag: "keyword-addition" },
          { response: "{{n2}}", diagnosis: "That is the express platform's count, which the story handed you. The local platform is the one with fewer benches, so its number has to come out below {{n2}}.", tag: "gave-back-the-larger" },
          { response: "{{n1}}", diagnosis: "That is the gap between the platforms, not a count of benches on either of them. It is how many MORE the express platform has.", tag: "gave-back-the-difference" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "benches", acceptedForms: ["{{ans}}", "{{ans}} benches"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked about the LOCAL platform — the one the story never counts. Not the express platform, and not the gap between them.",
    unitsCheck: "benches",
    reasonablenessCheck: "{{ans}} benches on the local platform. Add the gap of {{n1}} back on and you land on {{n2}}, the express platform exactly. And the answer is smaller than {{n2}}, which it has to be, because the express platform is the one with more.",
    reasonablenessFailExample: "If you got {{mAdd}}, the local platform would have MORE benches than the express one — on a story that says in so many words that the express platform has more.",
    connection: "Two problems ago \"more\" meant add. Here it means take away, and nothing in the wording tells you which. What told you was where the missing amount sat: last time it was the bigger one, this time the smaller. That is what the picture is for."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-04",
                 notes: "Four sets, each re-derived and checked both ways: 31-12=19 (19+12=31); 27-8=19 (19+8=27); 34-15=19 (19+15=34); 26-9=17 (17+9=26). The express count exceeds the gap in every set, so the local platform stays positive. The keyword-addition value is positive and typable in all four: 43, 35, 49, 35. All misconception values distinct from the answer and from each other within each set." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-04",
                 notes: "The keystone of the line: 'more' means subtract, deliberately placed after cp-ticket-queues where it meant add, with near-identical wording so the words cannot be what distinguishes them. Signal Failure attached and NOT foreshadowed anywhere before the Engine Room — naming the trap early disarms it, which is the ch-water-tank lesson. Distractor placed mid-list in read2. Both number-carrying sentences are about the express platform, which is the reading difficulty and is intended." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-04",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). This is the problem on the line most likely to need a student pass before it can be trusted, because its whole value is whether the trap actually springs." }
  }
});
