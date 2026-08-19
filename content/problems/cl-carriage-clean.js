/* CROSSOVER ISLAND · problem 7 · RATE → CHANGE (percent) · the last of the seven
   `CHALLENGE-MODE.md` §5.2. Pool content, like `cl-track-sleepers`: published,
   validated and swept, with no stop pointing at it until
   `Selector.buildIslandStop` learns to choose rather than name.

   IT CLOSES THE COVERAGE HOLE. With this and problem 6, every one of the five
   situations appears at least twice across the island and at least once on each
   side of a crossover — the property §5.2 was written to guarantee and which
   did not hold at five problems.

   ▸ `surface: "percent"` IS DELIBERATELY NOT SET, AND THAT IS A REAL DECISION
     RATHER THAN AN OMISSION. A percentage appears in the second half, so the
     flag looks right — but `surface` does two things this problem must not do.
     It pools the problem into the Percent Line's own route, which would put a
     two-line problem on a mainland ride; and it switches on the Ticket Booth's
     hidden-line question through `asksHiddenLine`, which asks "which of the
     five is hiding under the per cent". On the island that question is both
     wrong and confusing: the answer is two of the five, and the Crossover Read
     has already asked it properly. The percentage here is arithmetic inside the
     second half, not a surface the whole problem wears.

   WHY A PERCENTAGE AT ALL, ON THE HARDEST MODE ON THE SITE. Because the
   mainland teaches percent as a change (`ch-fare-rise`, `ch-barrier-count`) and
   the Percent Yard teaches what it is a percentage OF — and this is the one
   place those two meet a transfer. The percentage is taken OF a number the
   story never states, which is the single sharpest version of the Percent
   Yard's own lesson: find what the hundred was made of, and here you have to
   build it first.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 16 ÷ 2 = 8 lots · 8 × 6 = 48 · 48 + 50% = 72   (72 ÷ 1.5 = 48 ✓ · 48 ÷ 6 = 8 lots = 16 h ✓)
     set 2: 12 ÷ 2 = 6 lots · 6 × 14 = 84 · 84 + 25% = 105 (105 ÷ 1.25 = 84 ✓ · 84 ÷ 14 = 6 lots = 12 h ✓)
     set 3: 28 ÷ 4 = 7 lots · 7 × 8 = 56 · 56 + 25% = 70   (70 ÷ 1.25 = 56 ✓ · 56 ÷ 8 = 7 lots = 28 h ✓)
     set 4: 15 ÷ 3 = 5 lots · 5 × 12 = 60 · 60 + 40% = 84  (84 ÷ 1.4 = 60 ✓ · 60 ÷ 12 = 5 lots = 15 h ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - the shift length divides exactly by the rate's hours, so the scale factor
       is whole;
     - the rise lands on a whole number of carriages — the increase is 24, 21,
       14 and 24, all integers;
     - the answer may not be 1, 2 or 5 — the island rule;
     - the increase must differ from the rate's own product. Set 1 first had a
       rise of 12 against a rate product of 12, which would have made two
       different misconceptions share a value and diagnose nothing.

   Values that may not appear in any pre-solve copy: the shift totals 48, 84,
   56, 60 and the answers 72, 105, 70, 84. Note set 2's total and set 4's answer
   are both 84 — different sets, never materialised together. */
MF.registerProblem({
  id: "cl-carriage-clean",
  schemaVersion: 1,
  status: "published",
  title: "How many carriages the shift will clean next month",
  line: "ratio",
  topics: ["two-line", "crossover", "rate", "percent-increase", "transfer"],
  steps: 2,

  pair: {
    first: "ratio",
    second: "change",
    transfer: "how many carriages the shift cleans in a night now",

    crossoverSentence: 4,
    crossoverWhy: "Everything before it describes how the shed works now — carriages against hours, a speed that would hold for a shift of any length. From there the story stops describing the present and does something to it: next month is a different amount from this month.",
    firstWhy: "Carriages measured against hours, and the relationship holds at any size — a longer shift would clean more in the same proportion. Nothing is being changed and nothing is being compared.",
    secondWhy: "An amount that ends up different from how it started. The shed's output this month is what next month's is worked out from, and the rise is described as a share of it.",
    readWhy: "A single story doing separate jobs: a speed scaled up to the length of the shift first, then a rise applied to what that produced. The earlier part builds this month's figure, and the later part cannot start without it — the rise is a share OF that number."
  },

  unknownCar: "increase",
  context: "cleaning",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n3", "/", "n2", "=", "lots"],
    ["lots", "*", "n2", "=", "n3"],
    ["lots", "*", "n1", "=", "cleaned"],
    ["cleaned", "/", "n1", "=", "lots"],
    ["cleaned", "+", "rise", "=", "ans"],
    ["ans", "-", "rise", "=", "cleaned"],
    ["n1", "*", "n2", "=", "mMult"],
    ["n3", "-", "n2", "=", "addGap"]
  ],

  numberSets: [
    { numbers: { n1: "6",  n2: "2", n3: "16", n4: "50", n5: "4" },
      derived: { lots: "8", cleaned: "48", rise: "24", ans: "72", mMult: "12", addGap: "14" },
      estimate: { min: 36, max: 144 } },
    { numbers: { n1: "14", n2: "2", n3: "12", n4: "25", n5: "3" },
      derived: { lots: "6", cleaned: "84", rise: "21", ans: "105", mMult: "28", addGap: "10" },
      estimate: { min: 52, max: 210 } },
    { numbers: { n1: "8",  n2: "4", n3: "28", n4: "25", n5: "5" },
      derived: { lots: "7", cleaned: "56", rise: "14", ans: "70", mMult: "32", addGap: "24" },
      estimate: { min: 35, max: 140 } },
    { numbers: { n1: "12", n2: "3", n3: "15", n4: "40", n5: "6" },
      derived: { lots: "5", cleaned: "60", rise: "24", ans: "84", mMult: "36", addGap: "12" },
      estimate: { min: 42, max: 168 } }
  ],

  problem: {
    text: "The carriage cleaning shed works right through the night. The night shift gets through {{n1}} carriages every {{n2}} hours. The shift runs for {{n3}} hours. There are {{n5}} hoses on the wash rack. From next month the depot takes on more staff, and the shift will get through {{n4}} per cent more carriages than it does now. How many carriages will the night shift clean next month?",
    sentences: [
      "The carriage cleaning shed works right through the night.",
      "The night shift gets through {{n1}} carriages every {{n2}} hours.",
      "The shift runs for {{n3}} hours.",
      "There are {{n5}} hoses on the wash rack.",
      "From next month the depot takes on more staff, and the shift will get through {{n4}} per cent more carriages than it does now.",
      "How many carriages will the night shift clean next month?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "6",  unit: "carriages", role: "rate-count", spoken: "6" },
      n2: { value: "2",  unit: "hours",     role: "rate-time",  spoken: "2" },
      n3: { value: "16", unit: "hours",     role: "scaled-time", spoken: "16" },
      n4: { value: "50", unit: "per cent",  role: "increase",   spoken: "50" },
      n5: { value: "4",  unit: "hoses",     role: "distractor", spoken: "4" }
    },
    context: { setting: "railway carriage cleaning shed", requiresCulturalKnowledge: false }
  },

  /* The island's own library. The counted quantity here is carriages PER HOUR,
     which is a rate rather than a heap — so the carriage may be drawn whole,
     except that it is deliberately cut by the shed at both ends. There is no
     complete carriage to count and no queue implied; what moves is the
     machinery, which is what a speed looks like. */
  scene: {
    mode: "anim", art: "washshed",
    caption: "A carriage part way through a wash shed, brushes turning against its side and water falling."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A cleaning shed works at a steady speed and the night shift runs for a certain number of hours. Then the story says that from next month the shift will get through a bigger number of carriages, described as a percentage more than now, and asks what that comes to.",
      platformCheck: {
        sentences: [1, 2, 4],
        why: "The earlier ones give the shed's speed and how long the shift runs, which together say how much it gets through without ever stating it. The last stops describing the present and applies a rise to it. Notice what is never stated: how many carriages the shift cleans now, which is the amount the rise is a share of.",
        kinds: "Carriages against hours in the shed, and then carriages before and after a rise."
      },

      questions: {
        fit: {
          ask: "Does a single kind of situation cover this whole story — the shed's speed, and next month's rise?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it gives a speed that would hold for a shift of any length, and after that it takes what the shift gets through and makes it bigger. Read it again and find the sentence where it changes." },
            stacked: { yes: "A relationship between carriages and hours is a kind of situation. An amount ending up different from how it started is a different kind. This story scales the shed's speed up to the shift first and raises the result afterwards — and the rise is a share of the very number the scaling produced.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n3", describe: "how long the night shift runs", needed: true },
        { token: "n4", describe: "the percentage more the shift will get through next month", needed: true },
        { token: "n5", describe: "how many hoses are on the wash rack", needed: false },
        { token: "n1", describe: "how many carriages the shed gets through in one go", needed: true },
        { token: "n2", describe: "how many hours that takes", needed: true }
      ],
      relationship: "The shed's carriages and the shed's hours belong together and are useless apart — either alone says nothing about a night's work. The shift's length is what those two get scaled up to. The percentage belongs to a different pairing entirely: it is a share of whatever that scaling produced, and until you have that number the percentage has nothing to be a percentage of. The hoses belong to nothing.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many carriages the night shift will clean in a night next month.",
      commonMisreading: "Working out what the shift gets through now and stopping there, which answers this month rather than next.",
      options: [
        { text: "How many carriages the shift gets through now",
          why: "You will need that, and nothing states it — but read the last sentence again. It asks about NEXT month, which is after the rise has been applied." },
        { text: "How many carriages the shift will clean next month", correct: true,
          why: "The figure after the rise. That is the only thing here nothing gives you and nothing else stands in for." },
        { text: "How many more carriages the shift will get through",
          why: "That is the size of the rise on its own. It is worth working out on the way, but the question asks for the new total rather than the extra." },
        { text: "How many carriages the shed gets through in a few hours",
          why: "Handed to you outright in its own sentence. It is the shed's speed, not a night's work." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "This story starts on the Ratio & Rate Rail — carriages against hours, a speed that would hold whatever length the shift was. It does not stay there. Once tonight's figure is known, next month's is that figure made bigger, and an amount ending up different from how it started is the Change Line. Two lines, in that order, joined at a nightly figure the story never states.",
    distractors: [
      { line: "change",    whyWrong: "Half right, and worth saying so: the second half of this story really is a Change. But the story does not open there. Before anything rises, a speed has to be scaled up to the length of the shift, and it is what that produces that gets raised." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. This month and next month are the same shift at different times, which is one amount changing rather than two amounts side by side." },
      { line: "partwhole", whyWrong: "There is no named total that the pieces add up to. The rise is not a part of the shift's work; it is an increase applied to all of it." },
      { line: "groups",    whyWrong: "The closest one to argue for, because the shed does get through the same number of carriages over and over. But Equal Groups counts whole helpings, and this rate holds at any size — a shorter shift would clean fewer carriages in the same proportion rather than one fewer helping." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many carriages the shift will clean next month",
      "how long the shift runs",
      "how many carriages the shed gets through in a few hours"
    ],
    unknownCarAnswer: "how many carriages the shift will clean next month",
    unknownCarWhy: "The shed's speed is given, the shift's length is given and the size of the rise is given as a percentage. Next month's figure is not — and neither is this month's, which is the number the percentage is a share of."
  },

  signalBox: {
    /* The first half's picture: the ratio table, scaling the shed's speed up to
       the length of the shift. It never fills the unknown cell — that is the
       Engine Room's — and the operation options are built from derived tokens
       so they materialise per number set. */
    ratioTable: {
      title: "The Ratio Table",
      heading: "The shed's speed, and a whole shift",
      prompt: "The shed works at the same speed all night. Set what it gets through in a short stretch against what it gets through in the whole shift.",
      givenHeading: "In one stretch",
      targetHeading: "In the whole shift",
      rows: [
        { label: "Hours",     given: "{{n2}}", target: "{{n3}}" },
        { label: "Carriages", given: "{{n1}}", target: "?", unit: "carriages" }
      ],
      question: "Which operation carries the hours across to the whole shift?",
      options: [
        { text: "× {{lots}}", correct: true,
          why: "{{n2}} hours becomes {{n3}} hours by multiplying, and the same operation has to carry the carriages across with it. That is what makes it a rate: whatever you do to one row, you do to the other." },
        { text: "+ {{addGap}}",
          why: "That does get the hours across — but adding is not what a rate does. Add the same to the carriages and a slower shed would catch up with a faster one just by working longer, which is not how speed works. Watch the picture: both rows have to scale together." },
        { text: "× {{n2}}",
          why: "That multiplies by the shed's own hours rather than by how many of them fit into the shift. Ask how many stretches of {{n2}} hours the shift is, and that is the number." }
      ],
      law: "Whatever you do to one row, you do to the other.",
      pending: "The carriages cell stays a question mark on purpose — working it out is the next stop, and it is the number the rest of this story needs.",
      settledSay: "The same operation carries both rows across, and what lands in the carriages cell is what the shift gets through tonight.",
      a11yDescription: "A table of two rows, hours and carriages. The left column holds the shed's speed as the story states it; the right column holds the shift's hours and an empty cell for the carriages. Nothing is calculated: the empty cell carries a question mark."
    },

    crossover: {
      heading: "What crosses over?",
      prompt: "The first picture is finished, and the story is not. Something from that picture is the number the rest of this problem needs. Which one?",
      cellLabel: "tonight's carriages",
      options: [
        { text: "What lands in the empty cell", correct: true,
          why: "The carriages the shift gets through in a whole night is the only thing the first picture produced, and the rise next month is a share of exactly that. A percentage is always a percentage OF something, and this is the something." },
        { text: "The carriages the shed gets through in one stretch",
          why: "Given to you in the story, so the first picture did not produce it. It is one end of the speed, not a night's work — and the rise is not a share of it." },
        { text: "The hours the shift runs",
          why: "Also given, and it is in hours. The rise is a percentage of carriages, so an amount of time cannot be what it is taken of." },
        { text: "The percentage the shift goes up by",
          why: "That belongs to the second half already — printed in the story and waiting below. The crossover is what the FIRST half hands over." }
      ],
      settledSay: "That is the join. The first picture ends with tonight's carriages, and the second picture starts by making that number bigger.",
      second: {
        title: "The second picture",
        heading: "A rise, with nothing yet to rise from",
        givenHeading: "What you were told",
        targetHeading: "What you need",
        rows: [
          { label: "Goes up by",   key: "pc",       given: "{{n4}} per cent" },
          { label: "Next month",   key: "answer",   given: "not stated" },
          { label: "Tonight",      key: "transfer", given: "not stated" }
        ],
        waiting: "Only the size of the rise is known, and a percentage on its own is not an amount of anything. It has to be a percentage OF something, and that something is the number the first picture worked out — so until you have it, there is nothing here to raise.",
        a11yDescription: "A table of three rows: the percentage the shift goes up by, next month's figure, and tonight's. Only the percentage is stated. The right column is empty on every row, and the bottom cell is labelled as tonight's carriages once you have named it. Nothing in this picture is calculated."
      }
    },

    estimate: {
      prompt: "Before calculating — roughly how many carriages do you think the shift will clean next month?",
      reasonableMin: 36,
      reasonableMax: 144,
      modelReasoning: "Work out roughly how many stretches of the shed's time fit into the shift and give each one its carriages — that is roughly tonight's figure. Then raise it by roughly the percentage: a rise of about a quarter adds about a quarter again. Rough all the way.",
      unit: "carriages"
    }
  },

  /* The seventh disguise, and the one the Percent Yard warns about directly:
     the halfway number is what the percentage is a percentage OF. A student who
     stops there has found the referent and then not used it — which is the
     opposite failure from the usual percent error of taking the percentage of
     the wrong thing. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out what the shift gets through tonight and it was right. Why was it not the answer?",
    why: "Because that is this month, and the question asked about next month. It is also the number the percentage is a percentage OF — so having it is not a detour, it is the thing that makes the rise possible. Finding the referent and then not using it is a particular way of stopping halfway, and it looks more finished than most, because the hard part really is behind you."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "First, how many carriages does the night shift get through now?",
        answer: { exact: "{{cleaned}}", unit: "carriages", acceptedForms: ["{{cleaned}}", "{{cleaned}} carriages"], preferredForm: "{{cleaned}}" },
        workedExplanation: "The shed gets through {{n1}} carriages every {{n2}} hours, and the shift runs {{n3}} hours. That is {{n3}} ÷ {{n2}} = {{lots}} stretches of the shed's time, each worth {{n1}} carriages: {{lots}} × {{n1}} = {{cleaned}} carriages. Check it backwards — {{cleaned}} ÷ {{n1}} = {{lots}} stretches, which is {{lots}} × {{n2}} = {{n3}} hours, exactly the shift.",
        hints: [
          { rung: 1, text: "The shed's speed is carriages against hours. How many stretches of the shed's hours fit into the whole shift?" },
          { rung: 2, text: "Work out how many lots of {{n2}} hours make {{n3}} hours, then give each lot its carriages." },
          { rung: 3, text: "{{n3}} ÷ {{n2}} = {{lots}}. Now {{lots}} × {{n1}} = ___" },
          { rung: 4, text: "{{n3}} ÷ {{n2}} = {{lots}}, and {{lots}} × {{n1}} = {{cleaned}}. The shift gets through {{cleaned}} carriages." }
        ],
        misconceptions: [
          { response: "{{lots}}", diagnosis: "That is how many stretches of the shed's time the shift is, which is the right first move — but it is a count of stretches, not of carriages. Each one is worth {{n1}} carriages, so there is one multiplication still to do.", tag: "stopped-at-the-scale-factor" },
          { response: "{{mMult}}", diagnosis: "You multiplied the shed's own two numbers together. Those two describe a single speed — carriages in a stretch of hours — and multiplying them describes nothing. The shift's length is what the speed gets scaled up to.", tag: "multiplied-the-rate" },
          { response: "{{n3}}", diagnosis: "That is how long the shift runs, in hours. The question asks for carriages, and hours only become carriages once the shed's speed is applied to them.", tag: "gave-back-the-time" }
        ]
      },
      {
        id: "s2",
        prompt: "The shift gets through {{cleaned}} carriages now, and next month it will get through {{n4}} per cent more. How many will it clean next month?",
        answer: { exact: "{{ans}}", unit: "carriages", acceptedForms: ["{{ans}}", "{{ans}} carriages"], preferredForm: "{{ans}}" },
        workedExplanation: "The rise is {{n4}} per cent OF tonight's figure, so it is {{n4}} per cent of {{cleaned}}, which is {{rise}} carriages. Next month is tonight plus that rise: {{cleaned}} + {{rise}} = {{ans}} carriages. Check it backwards — {{ans}} − {{rise}} = {{cleaned}}, tonight exactly.",
        hints: [
          { rung: 1, text: "A percentage is always a percentage OF something. What is this one a percentage of?" },
          { rung: 2, text: "Work out {{n4}} per cent of {{cleaned}} first — that is how many MORE carriages there will be." },
          { rung: 3, text: "{{n4}} per cent of {{cleaned}} is {{rise}}. Now {{cleaned}} + {{rise}} = ___" },
          { rung: 4, text: "{{cleaned}} + {{rise}} = {{ans}}. The shift will clean {{ans}} carriages next month." }
        ],
        misconceptions: [
          { response: "{{cleaned}}", diagnosis: "That is the number you just worked out, and it was right — but it is THIS month. The question asks about next month, after the rise. It is also the number the percentage is a percentage of, so having it is the hard part done; there is one move left.", tag: "stopped-at-the-transfer" },
          { response: "{{rise}}", diagnosis: "That is the rise on its own — how many MORE carriages there will be. The question asks how many the shift will clean altogether, which is tonight's figure with the rise added on.", tag: "gave-the-increase-only" },
          { response: "{{n4}}", diagnosis: "That is the percentage, which the story gave you. A percentage is not a count of anything until you say what it is a percentage of — and here it is a share of tonight's carriages.", tag: "percent-as-a-count" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "carriages", acceptedForms: ["{{ans}}", "{{ans}} carriages"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked about NEXT month. If your answer is {{cleaned}}, that is what the shift gets through now — the middle of this problem rather than the end of it.",
    unitsCheck: "carriages",
    reasonablenessCheck: "{{ans}} carriages next month. Check it backwards: {{ans}} − {{rise}} = {{cleaned}}, tonight's figure — and {{cleaned}} ÷ {{n1}} = {{lots}} stretches, which is {{n3}} hours, exactly the shift. Both halves check out.",
    reasonablenessFailExample: "If you got {{rise}}, you would have handed in the extra carriages rather than the new total — a shift that cleaned only the increase would be doing less work next month than it does now.",
    connection: "That is the last of the seven. The percentage here was a share of a number the story never printed, which is the Percent Yard's own lesson at its sharpest: find what the hundred was made of. On this island you have to build it first.",
    fadeLevel: "worked"
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story and verified both ways: 16/2=8, 8x6=48, +50% = 72 (72-24=48, 48/6=8 lots = 16h); 12/2=6, 6x14=84, +25% = 105; 28/4=7, 7x8=56, +25% = 70; 15/3=5, 5x12=60, +40% = 84. Every shift length divides exactly by the rate's hours and every rise lands on a whole carriage (24, 21, 14, 24). No answer is 1, 2 or 5. Set 1 was rejected once for a rise of 12 against a rate product of 12, which would have made two misconceptions share a value." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No scene art yet - the island's own library is a later pass." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Rate -> Change with a percentage, and the seventh and last island problem. `surface: percent` is deliberately NOT set: it would pool this into the Percent Line's mainland route and switch on the Ticket Booth's hidden-line question, which asks which of the five is under the per cent - a question that is wrong here (the answer is two of them) and that the Crossover Read has already asked properly. The percentage is arithmetic inside the second half rather than a surface the problem wears. Pedagogically this is the sharpest version of the Percent Yard's lesson: the percentage is a share of a number the story never prints, so the referent has to be BUILT before it can be found. The halfway number is the referent itself, which makes stopping there feel more finished than usual - the hard part really is behind you." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Seventh of seven. With this and cl-track-sleepers every one of the five situations appears at least twice across the island and on both sides of a crossover, which is the property CHALLENGE-MODE §5.2 was written to guarantee and which did not hold at five problems. Unreachable until pooling lands." }
  }
});
