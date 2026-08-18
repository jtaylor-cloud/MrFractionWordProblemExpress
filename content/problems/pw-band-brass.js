/* Part–Whole Loop · whole then other part · music · independent · HUB-READY

   FOUR NUMBER SETS. The fraction stays two ninths, so the bar is always nine
   parts with two marked and the scene's "ninths of the band" survives; only
   the brass headcount varies. Every count is even, which is what the first
   step needs, and every whole band lands between 36 and 90 students — a school
   band, not a stadium.

   ONE MISCONCEPTION WAS REPLACED, not just retokenised. Two of the three on
   step one divided the brass players by NINE (the wrong divisor, and two
   ninths of the wrong whole). Both need the headcount to be a multiple of 9 as
   well as of 2, and the only band size satisfying that is the original 18 —
   every other set would have rendered a response of 1.333… as a "common
   error", and the diagnosis could never have fired. They were replaced by
   multiplying by nine (treating the given as ONE ninth) and by jumping to the
   whole band, both of which are real errors and both of which stay whole in
   every set.

   Verified three ways for each set — down to one part, up to the whole, and
   the complement taken directly:
     8/2 = 4,  9x4 = 36,  36-8 = 28   (7/9 of 36 = 28,  2/9 of 36 = 8)
     12/2 = 6, 9x6 = 54,  54-12 = 42  (7/9 of 54 = 42,  2/9 of 54 = 12)
     16/2 = 8, 9x8 = 72,  72-16 = 56  (7/9 of 72 = 56,  2/9 of 72 = 16)
     20/2 = 10, 9x10 = 90, 90-20 = 70 (7/9 of 90 = 70,  2/9 of 90 = 20) */
MF.registerProblem({
  id: "pw-band-brass",
  schemaVersion: 1,
  status: "published",
  title: "The rest of the band",
  line: "partwhole",
  topics: ["fraction-of-a-quantity", "whole-unknown", "complement"],
  steps: 2,

  unknownCar: "whole-then-other-part",
  context: "music",
  fadeLevel: "independent",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "There are two moves hidden in this one — find the whole band first, then take the brass players off it. A bar model shows both at once, which is why drawing it beats diving straight into arithmetic.",

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* The 2, 9 and 7 are the fraction's numerator, denominator and complement.
     The complement is checked directly as well as by subtraction, because the
     two routes agreeing is the whole reasonableness argument at the end. */
  numberChecks: [
    ["n1", "/", "2", "=", "ninth"],
    ["ninth", "*", "2", "=", "n1"],
    ["ninth", "*", "9", "=", "whole"],
    ["whole", "/", "9", "=", "ninth"],
    ["whole", "-", "n1", "=", "ans"],
    ["ninth", "*", "7", "=", "ans"],
    ["n1", "*", "9", "=", "mMul9"],
    ["ninth", "*", "3", "=", "mThree"],
    ["whole", "+", "n1", "=", "mAdd"],
    ["seg1", "*", "ninth", "=", "whole"],
    ["mark1", "*", "ninth", "=", "n1"]
  ],

  numberSets: [
    /* The concerts distractor is never equal to the value of one ninth. On the
       Plan screen the Model Yard prints "each part = N students" a line away
       from "plays N concerts a year", and two unrelated numbers sitting that
       close read as connected. Same trap as the savings-and-weeks one on
       pw-helmet-savings. */
    { numbers: { n1: "8",  n2: "2/9", n3: "5" }, spoken: { n2: "two ninths" },
      derived: { ninth: "4",  whole: "36", ans: "28", mMul9: "72",
                 mThree: "12", mAdd: "44" },
      estimate: { min: 18, max: 40 }, segments: [9], marked: [2] },
    { numbers: { n1: "12", n2: "2/9", n3: "4" }, spoken: { n2: "two ninths" },
      derived: { ninth: "6",  whole: "54", ans: "42", mMul9: "108",
                 mThree: "18", mAdd: "66" },
      estimate: { min: 28, max: 58 }, segments: [9], marked: [2] },
    { numbers: { n1: "16", n2: "2/9", n3: "6" }, spoken: { n2: "two ninths" },
      derived: { ninth: "8",  whole: "72", ans: "56", mMul9: "144",
                 mThree: "24", mAdd: "88" },
      estimate: { min: 38, max: 78 }, segments: [9], marked: [2] },
    { numbers: { n1: "20", n2: "2/9", n3: "3" }, spoken: { n2: "two ninths" },
      derived: { ninth: "10", whole: "90", ans: "70", mMul9: "180",
                 mThree: "30", mAdd: "110" },
      estimate: { min: 48, max: 95 }, segments: [9], marked: [2] }
  ],

  scene: { icon: "horn", caption: "The band in ninths — the filled ones are the brass players.",
           plural: "ninths of the band", onWord: "play brass", offWord: "play something else" },

  problem: {
    text: "The school band is called the Northgate Wind Ensemble. Their trumpets are old and dented, but they are loud. In the band, {{n1}} students play a battered brass instrument. The band plays {{n3}} concerts a year in a draughty hall. That is {{n2}} of the whole band. How many students in the band do NOT play brass?",
    sentences: [
      "The school band is called the Northgate Wind Ensemble.",
      "Their trumpets are old and dented, but they are loud.",
      "In the band, {{n1}} students play a battered brass instrument.",
      "The band plays {{n3}} concerts a year in a draughty hall.",
      "That is {{n2}} of the whole band.",
      "How many students in the band do NOT play brass?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "8",   unit: "students", role: "part", spoken: "8" },
      n2: { value: "2/9", unit: "",         role: "fraction", spoken: "two ninths" },
      n3: { value: "5",   unit: "concerts", role: "distractor", spoken: "5" }
    },
    context: { setting: "school band", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "There's a school band. Some of the students play brass instruments and the rest play something else. We want to know how many play something else.",
      platformCheck: {
        sentences: [2, 4],
        why: "\"of the whole band\" ties the brass players to the band they came out of. That makes the band the whole, and the brass players a share of it.",
        kinds: "Everything counted here is students in the same band."
      },

      questions: {
        kinds: {
          ask: "This story counts students in the band, and it also counts the concerts the band plays each year. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The concerts are the band's diary. Everything the question is about is students in the same band.",
                         no:  "That would mean students and concerts were locked at a fixed rate &mdash; so many players for every concert, scaling together. Nothing in the story pairs them off." },
            different: { yes: "", no: "That would mean adding a concert added players in proportion. The concerts tell you nothing about who plays what." }
          }
        },
        moments: {
          ask: "Does the band get bigger or smaller during this story, or is the story describing how a fixed band splits by what people play?",
          options: {
            changed: { text: "The band changes size", yes: "",
                       no:  "That would mean players joining or leaving between the start and the end of the story. Nobody arrives and nobody goes &mdash; the band is the band throughout." },
            steady:  { text: "A fixed band splits into groups",
                       yes: "Nobody joins and nobody leaves. A fixed group is being divided by the instrument each person plays.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just this band, or this band and a rival held up beside it?",
          options: {
            single:   { yes: "A single band, divided by instrument.", no: "" },
            separate: { yes: "", no: "That would mean a second band set beside this to measure the gap between them. There is only the Northgate Wind Ensemble here." },
            paired:   { yes: "", no: "That would mean players locked to something else and scaled up or down. The band is a fixed group, not a rate." }
          }
        },
        shape: {
          ask: "Is the band being shared out into parts, or is the same group repeating, or neither?",
          options: {
            cut:     { yes: "Brass players and everyone else are shares of the same band, and between them they account for all of it.", no: "" },
            repeat:  { yes: "", no: "That would mean the same group of players appearing again and again, with the question counting how many groups. The band exists once, split by instrument." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the brass players are a part of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the brass players, the whole band, and everyone who is not brass?",
          options: {
            onekind: { yes: "A whole cut into shares, the whole way through. Reaching the answer takes more than a single step, and each of those steps is the same kind of situation.", no: "" },
            stacked: { yes: "", no: "Worth asking, and you are right that it takes more than a single step &mdash; you go through the whole band to reach the players who are not brass. But both steps are the same kind of situation. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A band divided by instrument is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the students who play brass", needed: true },
        { token: "n2", describe: "what share of the whole band that is", needed: true },
        { token: "n3", describe: "how many concerts the band plays", needed: false }
      ],
      relationship: "Brass players and everyone else together make the whole band. You're given the brass part and told what fraction it is — but the band itself is unknown. Concerts have nothing to do with headcount.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many band members do NOT play brass.",
      commonMisreading: "Finding the size of the whole band and stopping. That's a step on the way, and it's the answer to a question nobody asked.",
      options: [
        { text: "The number of students who do not play brass", correct: true,
          why: "The other part. You must find the whole band first, but the whole band is not the answer." },
        { text: "The total number of students in the band",
          why: "A step on the way, and the single most common place to stop on this problem. Read the question again — it says NOT brass." },
        { text: "The number of students who play brass",
          why: "You were handed that. A number you are given cannot be the thing you are asked to find." },
        { text: "How many students perform at each concert",
          why: "The concerts are scenery. Nothing links them to who plays what." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "The band is one whole. Brass players are a part of it, and everyone else is the rest. Parts adding to a whole — that's the Part–Whole Loop.",
    distractors: [
      { line: "compare", whyWrong: "Brass versus everyone else does sound like a comparison, and that's reasonable thinking. But nothing is asking which group is bigger or by how much — the two groups are being added together to make the band. That's Part–Whole." },
      { line: "change",  whyWrong: "Nobody joins or leaves. The band is a fixed group being described, not a total that moves." },
      { line: "groups",  whyWrong: "There aren't repeated equal groups. There's one band divided into two unequal pieces." },
      { line: "ratio",   whyWrong: "Everything is counted in students — one unit. A ratio needs two different kinds of quantity in a fixed relationship." }
    ],
    unknownCar: "other-part",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the brass players", "the whole band", "everyone who isn't brass"],
    unknownCarAnswer: "everyone who isn't brass",
    unknownCarWhy: "You're given the brass part. The non-brass part is what's asked for — but you have to go through the whole band to get there.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "compare"],
      discriminator: "Ask whether the two groups are being measured against each other or added together. Brass plus everyone else equals the band — they're building a whole, not competing."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue is REVEALED BY MARKING, not pre-printed. One ninth is
         step s1's answer, so Cycle 6 blanked it — leaving a bar model with no
         numbers, which is not a model. model.js hides the value until the
         student marks the part. knownTotal stays "?": the whole band is s2. */
      bars: [{ label: "the whole band", segments: 9, segmentValue: "{{ninth}}", knownTotal: "?", unit: "students",
               marked: 2, markedTotal: "{{n1}} students", markedLabel: "the {{n1}} brass players", restLabel: "everyone else" }],
      a11yDescription: "One bar stands for the whole band. It is split into 9 equal parts, one for each ninth. You mark the parts that show the {{n1}} brass players — two of the nine. The parts left over show everyone else. That leftover group is what the question asks for. Two things are still blank: what one part is worth, and how big the whole band is.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly how many band members do you think don't play brass?",
      reasonableMin: 18,
      reasonableMax: 40,
      modelReasoning: "Two ninths is a small slice — about a fifth. So the whole band is maybe four or five times the {{n1}} brass players, and nearly all of them aren't brass.",
      unit: "students"
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      /* TWO steps, not three. The old s1 asked for a single ninth — the value
         the Model Yard prints on the previous screen as soon as a part is
         marked. It has been folded into the whole-band step, which is where
         the reasoning was going anyway; a student who stops at one part is
         still caught by the `one-part-only` misconception below. */
      {
        id: "s1",
        prompt: "How many students are in the whole band?",
        answer: { exact: "{{whole}}", unit: "students", acceptedForms: ["{{whole}}", "{{whole}} students"] },
        workedExplanation: "The {{n1}} brass players fill 2 equal parts, so {{n1}} ÷ 2 = {{ninth}} students in each ninth. A whole is nine ninths, so 9 × {{ninth}} = {{whole}} students.",
        misconceptions: [
          { response: "{{ninth}}",  diagnosis: "That's one ninth of the band. The whole band is nine of those.", tag: "one-part-only" },
          { response: "{{ans}}",    diagnosis: "That's everyone who isn't brass — the final answer, but you've skipped a step. Find the whole band first.", tag: "skipped-ahead" },
          { response: "{{n1}}",     diagnosis: "That's the brass players only. The whole band is much bigger.", tag: "answered-given" },
          { response: "{{mMul9}}",  diagnosis: "You multiplied by 9, as if the {{n1}} were ONE ninth. It is two ninths, so halve it before you take nine of them.", tag: "treated-part-as-one-part" },
          { response: "{{mThree}}", diagnosis: "You used three ninths. A whole is nine of them.", tag: "wrong-part-count" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The {{n1}} brass players fill two of the nine parts. What is one part worth, and how many parts is the whole band?" },
          { rung: 2, type: "signal",   text: "Two parts add up to {{n1}}, so split the {{n1}} between them. Then take nine of those." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ 2 = ___, then 9 × ___ = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ 2 = {{ninth}}, and 9 × {{ninth}} = {{whole}}. There are {{whole}} students in the band." }
        ]
      },
      {
        id: "s2",
        prompt: "So how many band members do NOT play brass?",
        answer: { exact: "{{ans}}", unit: "students", acceptedForms: ["{{ans}}", "{{ans}} students"] },
        workedExplanation: "The band is {{whole}} and {{n1}} of them play brass. {{whole}} − {{n1}} = {{ans}} students who don't.",
        misconceptions: [
          { response: "{{whole}}", diagnosis: "That's the whole band, brass included. The question asks only for the ones who don't play brass.", tag: "answered-intermediate" },
          { response: "{{mAdd}}",  diagnosis: "You added instead of subtracting. The brass players are inside the band, not extra to it.", tag: "operation-inversion" },
          { response: "7",         diagnosis: "That's how many parts are left, not how many students. Each part is {{ninth}} students.", tag: "parts-not-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Look at your bar. Two parts are brass. What's left?" },
          { rung: 2, type: "signal",   text: "Take the brass players away from the whole band. Or count the seven remaining parts." },
          { rung: 3, type: "coupling", text: "{{whole}} − {{n1}} = ___" },
          { rung: 4, type: "route",    text: "{{whole}} − {{n1}} = {{ans}}. That many band members don't play brass." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "students", acceptedForms: ["{{ans}}", "{{ans}} students"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for the students who do NOT play brass. If you answered {{whole}}, that's the whole band — a step on the way, not the destination.",
    unitsCheck: "students",
    reasonablenessCheck: "{{n1}} brass out of {{whole}} total. Is {{n1}} about two ninths of {{whole}}?",
    reasonablenessFailExample: "If you got a number smaller than {{n1}}, the non-brass group would be smaller than the brass group — but brass is only two ninths of the band, so that can't be right.",
    connection: "Two-step part-whole problems nearly always run the same way: find the whole first, then take off the piece you already know."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and checked by two further routes — the complement fraction taken directly, and the given fraction taken of the answer: 8/2=4, 9x4=36, 36-8=28 (7/9 of 36 = 28; 2/9 of 36 = 8); 12/2=6, 54, 42 (7/9 of 54 = 42; 2/9 of 54 = 12); 16/2=8, 72, 56; 20/2=10, 90, 70. Every band lands between 36 and 90 students. Estimate brackets contain the final answer: 18-40/28, 28-58/42, 38-78/56, 48-95/70. All misconception values re-derived per set, checked distinct within their step. TWO s1 MISCONCEPTIONS WERE REPLACED rather than tokenised: both divided by 9, which requires the brass count to be a multiple of 9 as well as of 2 — satisfiable only by the original 18 — so in every other set they would have rendered 1.333… as a common error and could never have matched a typed answer. Replaced with multiplying by nine and with jumping to the whole band. The concerts distractor is never equal to one ninth in any set, so the Model Yard cannot print two unrelated equal numbers side by side. Original 2026-07-28 verification covered the retired 18/81/63 set." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "School band context accessible. 'Brass instrument' explained sufficiently by context." },
    teacher:   { status: "pass", agent: "teacher",        date: "2026-07-28", notes: "Good hub problem: two-step, whole-unknown then complement, and the skipped-ahead misconception on s2 rewards rather than punishes a student who jumped correctly. 2026-08-01: the spelled-out 'Sixty-three' in the s3 hint ladder was removed — a written-out answer survives tokenising untouched, which is the exact shape of the four leaks found in Cycle 6." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (segmentValue was s1 answer) and a11yDescription rewritten to match. The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
