/* CROSSOVER ISLAND · problem 5 · RATIO → PART–WHOLE · the second unstaffed halt
   Marsh Halt, and the stop that closes the circuit. `CHALLENGE-MODE.md` §5.2.

   THE FADE IS PROBLEM 4'S, INHERITED WHOLE, and settled: at
   `fadeLevel: "independent"` there is no Crossover Read and no Plan picture,
   and the Three Reads, the estimate and the hint ladder all stay. That was
   ruled on 2026-08-16 with `cl-lost-umbrellas` built so the choice could be
   looked at rather than imagined. Do not re-open it here.

   WHAT IS NEW IS THE FIRST HALF. Every island problem so far opens with a
   single move — a subtraction, or a day's worth of arrivals and departures.
   This one opens with a RATE that has to be scaled, which is two moves before
   the crossover is even reached. It is the last stop for that reason: an
   unaided student meeting a scaled rate has to hold the structure in mind
   across more working than anywhere else here.

   THE TRANSFER IS A TOTAL THAT WAS NEVER DELIVERED AS A TOTAL. The story never
   says how many bottles arrived; it says how fast the plant fills them and how
   long the order took. So the whole of the second half is waiting on a number
   that has to be built out of a relationship, not read off a sentence. That is
   the fourth distinct shape of transfer on this island — scaled, divided up,
   left over, and now assembled.

   THE MARKER PAIR ON THE MAP WAS WRONG AND THE MAP WAS CORRECTED. Marsh Halt
   was drawn as ratio + change when the island was sketched, before any problem
   existed. `CHALLENGE-MODE.md` §5.2 assigns `cl-buffet-crates` as Ratio →
   Part–Whole, so scenery.js now says so.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 35 ÷ 5 = 7 lots · 7 × 12 = 84 · 84 − 47 = 37   (37 + 47 = 84 ✓ · 84 ÷ 12 = 7 ✓)
     set 2: 32 ÷ 4 = 8 lots · 8 × 15 = 120 · 120 − 76 = 44 (44 + 76 = 120 ✓ · 120 ÷ 15 = 8 ✓)
     set 3: 42 ÷ 6 = 7 lots · 7 × 18 = 126 · 126 − 79 = 47 (47 + 79 = 126 ✓ · 126 ÷ 18 = 7 ✓)
     set 4: 27 ÷ 3 = 9 lots · 9 × 14 = 126 · 126 − 68 = 58 (58 + 68 = 126 ✓ · 126 ÷ 14 = 9 ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - the order's filling time must divide exactly by the rate's minutes, or
       the scale factor lands on part of a lot;
     - the total must EXCEED the lemonade count, or the water count is negative;
     - the answer may not be 1, 2 or 5 — the island rule from
       `cl-platform-planters`, because the station header says "Two situations,
       joined" on every island screen and "five" is everywhere the checklist is,
       and the leak scan reads spelled-out answers;
     - the scale factor must differ from every given and from both answers. It
       is the most likely wrong answer to step 1 and needs its own diagnosis.

   Values that may not appear in any pre-solve copy here: the totals 84, 120,
   126, 126 and the answers 37, 44, 47, 58. */
MF.registerProblem({
  id: "cl-buffet-crates",
  schemaVersion: 1,
  status: "published",
  title: "How many of the bottles are water",
  line: "ratio",
  topics: ["two-line", "crossover", "unstaffed", "rate", "part-whole"],
  steps: 2,

  pair: {
    first: "ratio",
    second: "partwhole",
    transfer: "how many bottles were in the order altogether",

    crossoverSentence: 4,
    crossoverWhy: "Everything before it is about how fast the plant works — bottles against minutes, a relationship that would hold for an order of any size. From there the filling is over and the story is only about what is in the crates and how it splits.",
    firstWhy: "Bottles measured against minutes, and the relationship holds at any size — a longer order would fill more bottles in the same proportion. Nothing is being compared and nothing is left over.",
    secondWhy: "Lemonade and water are pieces that add back up to the order. That is a whole cut into parts — and here the whole is the thing nobody states.",
    readWhy: "A single story doing separate jobs: a rate scaled up to the size of the order first, then the order split into what is in it. The earlier part builds the total, and the later part cannot start without it, because that total is the whole being cut."
  },

  unknownCar: "part",
  context: "buffet",

  /* The fade level is the mechanism. See `cl-lost-umbrellas` — `phRead1` reads
     it to skip the Crossover Read, `PairModel` is declined because there is no
     crossover block, and `data.js` refuses this problem if any first-half
     model is left behind for RatioModel to claim. */
  fadeLevel: "independent",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n3", "/", "n2", "=", "lots"],
    ["lots", "*", "n2", "=", "n3"],
    ["lots", "*", "n1", "=", "total"],
    ["total", "/", "n1", "=", "lots"],
    ["total", "-", "n4", "=", "ans"],
    ["ans", "+", "n4", "=", "total"],
    ["n1", "*", "n2", "=", "mMult"],
    ["total", "+", "n4", "=", "mSum"]
  ],

  numberSets: [
    { numbers: { n1: "12", n2: "5", n3: "35", n4: "47", n6: "3" },
      derived: { lots: "7", total: "84", ans: "37", mMult: "60", mSum: "131" },
      estimate: { min: 18, max: 74 } },
    { numbers: { n1: "15", n2: "4", n3: "32", n4: "76", n6: "2" },
      derived: { lots: "8", total: "120", ans: "44", mMult: "60", mSum: "196" },
      estimate: { min: 22, max: 88 } },
    { numbers: { n1: "18", n2: "6", n3: "42", n4: "79", n6: "4" },
      derived: { lots: "7", total: "126", ans: "47", mMult: "108", mSum: "205" },
      estimate: { min: 23, max: 94 } },
    { numbers: { n1: "14", n2: "3", n3: "27", n4: "68", n6: "5" },
      derived: { lots: "9", total: "126", ans: "58", mMult: "42", mSum: "194" },
      estimate: { min: 29, max: 116 } }
  ],

  problem: {
    /* No number words in the prose — the first read is numberless and a word is
       as good as a digit there. "Either lemonade or water" carries the
       part–whole structure without counting anything. */
    text: "The buffet car restocks from the bottling plant along the coast. The plant fills {{n1}} bottles every {{n2}} minutes. The buffet's order took {{n3}} minutes to fill. The driver stops at {{n6}} level crossings on the way back. Every bottle in the order is either lemonade or water. {{n4}} of them are lemonade. How many of the bottles are water?",
    sentences: [
      "The buffet car restocks from the bottling plant along the coast.",
      "The plant fills {{n1}} bottles every {{n2}} minutes.",
      "The buffet's order took {{n3}} minutes to fill.",
      "The driver stops at {{n6}} level crossings on the way back.",
      "Every bottle in the order is either lemonade or water.",
      "{{n4}} of them are lemonade.",
      "How many of the bottles are water?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "12", unit: "bottles",         role: "rate-count", spoken: "12" },
      n2: { value: "5",  unit: "minutes",         role: "rate-time",  spoken: "5" },
      n3: { value: "35", unit: "minutes",         role: "scaled-time", spoken: "35" },
      n4: { value: "47", unit: "lemonade bottles", role: "part",      spoken: "47" },
      n6: { value: "3",  unit: "level crossings", role: "distractor", spoken: "3" }
    },
    context: { setting: "railway buffet car and bottling plant", requiresCulturalKnowledge: false }
  },

  /* Its own art now — this carried `urn` from the Ratio & Rate Rail, which is
     this problem's own first half. The belt runs off both edges so the bottles
     cannot be counted off the picture. */
  scene: {
    mode: "anim", art: "bottling",
    caption: "A filling head over a belt of bottles running past both ends of the frame."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A bottling plant fills bottles at a steady speed, and the buffet's order took a certain time to fill. Then the story turns to what is in the order — every bottle is lemonade or water — and tells us how many are lemonade.",
      platformCheck: {
        sentences: [1, 2, 5],
        why: "The earlier ones are about the plant's speed and how long the order took, which together say how big the order is without ever stating it. The last stops talking about filling and gives a piece of what was filled. Notice what is never stated anywhere: how many bottles arrived, which is the amount that piece is a piece of.",
        kinds: "Bottles against minutes at the plant, and then bottles split into kinds in the crates."
      },

      /* Tailored as carefully as at the staffed platforms, and for the reason
         given on `cl-lost-umbrellas`: at an unstaffed halt this screen is the
         last thing that helps. Everything the student gets about the SHAPE of
         this problem, they get here. */
      questions: {
        fit: {
          ask: "Does a single kind of situation cover this whole story — the plant filling bottles, and the lemonade and water in the crates?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it gives a speed that would hold for an order of any size, and after that it takes what arrived and splits it into kinds. Read it again and find the sentence where it changes." },
            stacked: { yes: "A relationship between bottles and minutes is a kind of situation. Pieces adding back up to a total is a different kind. This story scales the plant's speed up to the size of the order first, and cuts the order up afterwards — and the scaling is what produces the total being cut.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here, and at this stop it is yours." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n3", describe: "how long the buffet's order took to fill", needed: true },
        { token: "n4", describe: "how many of the bottles are lemonade", needed: true },
        { token: "n6", describe: "how many level crossings the driver stops at", needed: false },
        { token: "n1", describe: "how many bottles the plant fills in one go", needed: true },
        { token: "n2", describe: "how many minutes that takes", needed: true }
      ],
      relationship: "The plant's bottles and the plant's minutes belong together and are useless apart — either one alone tells you nothing about the size of the order. The order's filling time is what those two get scaled up to. The lemonade belongs to a different pairing entirely: it is a piece of whatever came out of that scaling. The level crossings belong to nothing.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many of the bottles in the order are water.",
      commonMisreading: "Working out how many bottles were in the order and stopping there, which answers how big the delivery was rather than how much of it is water.",
      options: [
        { text: "How many bottles were in the order altogether",
          why: "You will need that, and nothing states it — but read the last sentence again. It asks how many are WATER, which is one of the pieces rather than the whole delivery." },
        { text: "How many of the bottles are water", correct: true,
          why: "One piece of the order, and the only thing here that nothing gives you and nothing else stands in for." },
        { text: "How many bottles the plant fills in a few minutes",
          why: "Handed to you outright in its own sentence. It is the plant's speed, not a count of what arrived." },
        { text: "How many of the bottles are lemonade",
          why: "Also given. It is the piece you take off, not the piece you are being asked for." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "This story starts on the Ratio & Rate Rail — bottles against minutes, a relationship that would hold whatever size the order was. It does not stay there. Once the order's size is known, lemonade and water are pieces adding back up to it, and that is the Part–Whole Loop. Two lines, in that order, joined at a total the story never states.",
    distractors: [
      { line: "change",    whyWrong: "Nothing ends up different from how it started. The plant fills bottles at a steady speed and the order is sorted into kinds — nothing is done TO an amount to make it another amount." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. Lemonade and water are both in the order, but the story never asks which there is more of or by how much — they are pieces of the same delivery." },
      { line: "groups",    whyWrong: "The closest one to argue for, because the plant does fill the same number of bottles over and over. But Equal Groups counts whole helpings, and this rate holds at any size — a shorter order would fill fewer bottles in the same proportion rather than one fewer helping." },
      { line: "partwhole", whyWrong: "Half right, and worth saying so: the second half of this story really is Part–Whole. But the story does not open there. Before any splitting happens, a speed has to be scaled up to the size of the order, and it is what that produces that gets split." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many of the bottles are water",
      "how many of the bottles are lemonade",
      "how long the order took to fill"
    ],
    unknownCarAnswer: "how many of the bottles are water",
    unknownCarWhy: "The plant's speed is given, the filling time is given and the lemonade is given. The water is not — and neither is the size of the order it is part of, which is why this one takes two moves."
  },

  /* SIGNALBOX CARRIES THE ESTIMATE AND NOTHING ELSE. No crossover block and no
     `ratioTable`: at an unstaffed halt the Plan phase is the estimate alone,
     and `data.js` refuses this problem if either is present — a ratio table
     left here would be claimed by RatioModel and would draw the first half by
     itself while reporting success. */
  signalBox: {
    estimate: {
      prompt: "Before calculating — roughly how many of the bottles do you think are water?",
      reasonableMin: 18,
      reasonableMax: 74,
      modelReasoning: "Work out roughly how many lots of the plant's filling time fit into the order's time, and give each lot its bottles — that is roughly the size of the order. Then take off roughly the lemonade. Rough numbers all the way; you want the right sort of size, not the answer.",
      unit: "bottles"
    }
  },

  /* The fifth disguise, and the one with the most working behind it. The
     halfway number here is the size of the delivery — a real count of real
     bottles, in the same units as the answer, and it took two moves to get to,
     which makes it feel more finished than any of the others. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out how many bottles were in the order and it was right. Why was it not the answer?",
    why: "Because that is the whole delivery, and the question asked how many are water. It took real working to get there, which is exactly what makes it feel like an ending — the more effort a number costs, the more finished it looks. Both numbers are bottles, so the units check tells you nothing. The question is what decides."
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "First, how many bottles were in the buffet's order altogether?",
        answer: { exact: "{{total}}", unit: "bottles", acceptedForms: ["{{total}}", "{{total}} bottles"], preferredForm: "{{total}}" },
        workedExplanation: "The plant fills {{n1}} bottles every {{n2}} minutes, and the order took {{n3}} minutes. So the order is {{n3}} ÷ {{n2}} = {{lots}} lots of that filling time, and each lot is worth {{n1}} bottles: {{lots}} × {{n1}} = {{total}} bottles. Check it backwards — {{total}} ÷ {{n1}} = {{lots}} lots, which is {{lots}} × {{n2}} = {{n3}} minutes, exactly how long the order took.",
        hints: [
          { rung: 1, text: "The plant's speed is bottles against minutes. You know how many minutes the order took. How many lots of the plant's time is that?" },
          { rung: 2, text: "Work out how many lots of {{n2}} minutes fit into {{n3}} minutes, then give each lot its bottles." },
          { rung: 3, text: "{{n3}} ÷ {{n2}} = {{lots}}. Now {{lots}} × {{n1}} = ___" },
          { rung: 4, text: "{{n3}} ÷ {{n2}} = {{lots}}, and {{lots}} × {{n1}} = {{total}}. The order was {{total}} bottles." }
        ],
        misconceptions: [
          { response: "{{lots}}", diagnosis: "That is how many lots of the plant's filling time the order took, which is the right first move — but it is a count of lots, not of bottles. Each lot is worth {{n1}} bottles, so there is one multiplication still to do.", tag: "stopped-at-the-scale-factor" },
          { response: "{{mMult}}", diagnosis: "You multiplied the plant's own two numbers together. Those two describe a single speed — bottles in a stretch of minutes — and multiplying them describes nothing. The order's time is what the speed has to be scaled up to.", tag: "multiplied-the-rate" },
          { response: "{{n3}}", diagnosis: "That is how long the order took, in minutes. The question asks for bottles, and minutes only become bottles once the plant's speed is applied to them.", tag: "gave-back-the-time" }
        ]
      },
      {
        id: "s2",
        prompt: "The order was {{total}} bottles, and {{n4}} of them are lemonade. How many are water?",
        answer: { exact: "{{ans}}", unit: "bottles", acceptedForms: ["{{ans}}", "{{ans}} bottles"], preferredForm: "{{ans}}" },
        workedExplanation: "Every bottle is lemonade or water, so those two pieces add back up to the whole {{total}}. Take the lemonade off and what is left is the water: {{total}} − {{n4}} = {{ans}} bottles. Check it forwards — {{ans}} + {{n4}} = {{total}}, the whole order exactly.",
        hints: [
          { rung: 1, text: "Every bottle in the order is one kind or the other. So what do the lemonade and the water add up to?" },
          { rung: 2, text: "The whole is {{total}}, and you know one of the two pieces. What is the other piece?" },
          { rung: 3, text: "{{total}} − {{n4}} = ___" },
          { rung: 4, text: "{{total}} − {{n4}} = {{ans}}. There are {{ans}} bottles of water." }
        ],
        misconceptions: [
          { response: "{{total}}", diagnosis: "That is the number you just worked out, and it was right — but it is the whole delivery, lemonade and water together. The question asked for one of the pieces. It took real working to get to, which is exactly what makes it feel finished.", tag: "stopped-at-the-transfer" },
          { response: "{{mSum}}", diagnosis: "You added the lemonade to the order. The lemonade is already inside the order — it was counted once when the plant filled it, and adding it again describes a delivery bigger than the one that arrived.", tag: "added-the-part" },
          { response: "{{n4}}", diagnosis: "That is the lemonade, which the story gave you. The water is the rest of the order, not the same number.", tag: "gave-back-the-part" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "bottles", acceptedForms: ["{{ans}}", "{{ans}} bottles"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many bottles are WATER. If your answer is {{total}}, that is the whole order — the middle of this problem rather than the end of it.",
    unitsCheck: "bottles",
    reasonablenessCheck: "{{ans}} bottles of water. Check it backwards: {{ans}} + {{n4}} = {{total}}, the whole order — and {{total}} ÷ {{n1}} = {{lots}} lots of filling time, which is {{n3}} minutes, exactly what the story said. Both halves check out.",
    reasonablenessFailExample: "If you got {{mMult}} at the first step, you would have multiplied the plant's own bottles and minutes together, which describes no quantity in this story at all.",
    connection: "That closes the loop round the island. Five stops, and the number carried across the middle has been a different shape every time — scaled, divided up, left over, compared against, and here assembled out of a relationship. What has never changed is that it was correct, and that it answered a question nobody asked.",
    fadeLevel: "independent"
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story and verified both ways: 35/5=7, 7x12=84, 84-47=37 (37+47=84, 84/12=7, 7x5=35); 32/4=8, 8x15=120, 120-76=44; 42/6=7, 7x18=126, 126-79=47; 27/3=9, 9x14=126, 126-68=58. Every filling time divides exactly by the rate's minutes. The total exceeds the lemonade count in all four. No answer is 1, 2 or 5, per the island rule. The scale factor differs from every given and from both answers in every set - it is the likeliest wrong answer to step 1 and carries its own diagnosis." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Ratio -> Part-Whole, the second unstaffed halt and the last stop on the island. It is last because its FIRST half is the only one on the island that takes two moves - a rate scaled up - so an unaided student has to hold the structure across more working than anywhere else. The transfer is the fourth distinct shape here: a total that was never delivered as a total, assembled out of a relationship rather than read off a sentence. The halfway number is in the same units as the answer AND cost real working, which makes it feel more finished than any previous stop's; only the question separates them. read3's distractor is placed first. The `fit` question is tailored, as at the other halt, because at an unstaffed stop that screen is the last help there is." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. Along with cl-lost-umbrellas this is the stop where the fade is most likely to be a wall rather than a challenge, and no amount of authoring settles that." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Fifth of seven planned island problems and the fifth of five stops, so the circuit is complete. Problems 6 and 7 from CHALLENGE-MODE §5.2 have no stop to sit at yet - see the open note in that document about five stops against seven problems." }
  }
});
