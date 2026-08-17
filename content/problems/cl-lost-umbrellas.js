/* CROSSOVER ISLAND · problem 4 · CHANGE → COMPARE · THE FIRST UNSTAFFED HALT
   Cold Halt. `CHALLENGE-MODE.md` §4 and §5.2.

   THIS IS THE FIRST STOP ON THE ISLAND WITH NOBODY ON THE PLATFORM, and the
   fade is the point of it rather than a property of the story. At
   `fadeLevel: "independent"` the engine gives this problem:

     - NO Crossover Read. `phRead1` sends it straight to the second read, so
       nothing walks the student to the seam. They have just run the checklist
       on the first screen, which is the one aid an unstaffed halt keeps, and
       finding where the story changes is now their own job.
     - NO Plan picture. No crossover slot, no two-model diagram, no first-half
       model — the Plan phase fades to the estimate alone. `data.js` refuses a
       first-half model block here, because leaving one behind would let
       ChangeModel claim the problem and draw half of it while reporting
       success.

   THE THREE READS STAY, AND THAT IS A RULING RATHER THAN AN OVERSIGHT.
   `CHALLENGE-MODE.md` §4 originally said a halt drops "the guided Three Reads,
   the Plan model and the Test Track". It drops the last two. The user ruled on
   2026-08-16, with this problem built so the choice could be looked at instead
   of imagined: `read1` is the checklist and is the aid a halt keeps by
   definition, and `read3` is where the student identifies the question — on an
   island whose entire trap is answering the wrong one, cutting that would
   remove the last thing standing between a student and handing in the
   transfer. Problem 5 inherits this; do not re-open it.

   WHAT DOES NOT FADE, and this is not a style choice either: the ESTIMATE and
   the HINT LADDER. `HANDOFF` §H-2 records that Look Back on a wrong answer is only
   safe because every step's ladder ends by stating that step's answer,
   re-measured across 164 steps. Strip the ladder here and that guarantee
   breaks for the whole site, not just this stop. The estimate stays for the
   same reason, and because it is the only thing that catches an answer of the
   wrong SIZE — which on a two-line problem is the exact shape of stopping
   halfway. An unstaffed halt removes support. It does not remove the floor.

   THE PAIR IS CHOSEN FOR THE FADE. Change → Compare is the most familiar pair
   on the island: both halves are the two lines a student meets first, and both
   are single moves. Making the FIRST unaided stop also the hardest arithmetic
   would confound two things at once — this stop is testing whether they can
   find a seam without help, not whether they can do harder sums.

   THE SEAM IS AT A NEW STATION APPEARING. Everything before sentence 5 happens
   at Cold Halt across a day; sentence 5 brings in Marsh Halt and stops the
   clock. That is a genuinely different job — one place over time, then two
   places at one moment — and it is findable by reading, which is the only way
   left at this stop.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 54 − 17 + 9 = 46 · 46 − 32 = 14   (14 + 32 = 46 · 46 + 17 − 9 = 54 ✓)
     set 2: 61 − 24 + 8 = 45 · 45 − 27 = 18   (18 + 27 = 45 · 45 + 24 − 8 = 61 ✓)
     set 3: 48 − 13 + 11 = 46 · 46 − 29 = 17  (17 + 29 = 46 · 46 + 13 − 11 = 48 ✓)
     set 4: 57 − 18 + 6 = 45 · 45 − 26 = 19   (19 + 26 = 45 · 45 + 18 − 6 = 57 ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - Cold Halt's closing count must EXCEED Marsh Halt's, or "how many more"
       is negative and the story collapses;
     - the answer may not be 1, 2 or 5 — the island rule established on
       `cl-platform-planters`, because "Two situations, joined" is in the
       station header on every island screen and "five" is everywhere the
       checklist is, and the leak scan reads spelled-out answers;
     - the answer differs from every given, from the transfer, and from all
       three of that step's misconception values. Set 4 was rejected once for
       answering 19 while 19 was also the number claimed;
     - umbrella counts stay plausible for a small station's lost property.

   Values that may not appear in any pre-solve copy here: the closing counts
   46, 45, 46, 45 and the answers 14, 18, 17, 19. */
MF.registerProblem({
  id: "cl-lost-umbrellas",
  schemaVersion: 1,
  status: "published",
  title: "How many more umbrellas Cold Halt has than Marsh Halt",
  line: "change",
  topics: ["two-line", "crossover", "unstaffed", "change", "difference-unknown"],
  steps: 2,

  pair: {
    first: "change",
    second: "compare",
    transfer: "how many umbrellas Cold Halt has at closing time",

    crossoverSentence: 5,
    crossoverWhy: "Everything before it happens at Cold Halt as the day goes on — umbrellas leaving, umbrellas arriving. From there the day stops mattering and a second station appears, and the story is about the gap between them at a single moment.",
    firstWhy: "An amount that starts somewhere, has things happen to it, and ends up different. Nothing is being measured against anything yet — no other office has appeared.",
    secondWhy: "Amounts at separate stations set against each other, with the space between them the thing wanted. Nothing changes here; both counts simply are what they are at closing time.",
    readWhy: "A single story doing separate jobs: a day at Cold Halt first, then Cold Halt against Marsh Halt at the end of it. The earlier part works out what Cold Halt closes with, and the later part cannot start without it, because that is the amount being measured against Marsh Halt."
  },

  unknownCar: "difference",
  context: "lostproperty",

  /* THE FADE LEVEL IS THE MECHANISM, NOT A LABEL. `phRead1` reads it to skip
     the Crossover Read, `PairModel` is declined because there is no crossover
     block, and `data.js` enforces that no first-half model is left behind.
     Changing this string changes what the student is given. */
  fadeLevel: "independent",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n1", "-", "n2", "=", "afterClaims"],
    ["afterClaims", "+", "n3", "=", "closing"],
    ["closing", "-", "n3", "=", "afterClaims"],
    ["closing", "-", "n4", "=", "ans"],
    ["ans", "+", "n4", "=", "closing"],
    ["closing", "+", "n4", "=", "mSum"]
  ],

  numberSets: [
    { numbers: { n1: "54", n2: "17", n3: "9",  n4: "32", n5: "7" },
      derived: { afterClaims: "37", closing: "46", ans: "14", mSum: "78" },
      estimate: { min: 7, max: 28 } },
    { numbers: { n1: "61", n2: "24", n3: "8",  n4: "27", n5: "5" },
      derived: { afterClaims: "37", closing: "45", ans: "18", mSum: "72" },
      estimate: { min: 9, max: 36 } },
    { numbers: { n1: "48", n2: "13", n3: "11", n4: "29", n5: "4" },
      derived: { afterClaims: "35", closing: "46", ans: "17", mSum: "75" },
      estimate: { min: 8, max: 34 } },
    { numbers: { n1: "57", n2: "18", n3: "6",  n4: "26", n5: "8" },
      derived: { afterClaims: "39", closing: "45", ans: "19", mSum: "71" },
      estimate: { min: 9, max: 38 } }
  ],

  problem: {
    text: "The lost property office at Cold Halt keeps every umbrella that turns up. It starts the morning with {{n1}} umbrellas on the shelf. During the day {{n2}} of them are claimed by their owners. Another {{n3}} are handed in off the trains. The office also keeps {{n5}} walking sticks in a bin by the door. At closing time the office along the coast at Marsh Halt has {{n4}} umbrellas. How many more umbrellas does Cold Halt have than Marsh Halt?",
    sentences: [
      "The lost property office at Cold Halt keeps every umbrella that turns up.",
      "It starts the morning with {{n1}} umbrellas on the shelf.",
      "During the day {{n2}} of them are claimed by their owners.",
      "Another {{n3}} are handed in off the trains.",
      "The office also keeps {{n5}} walking sticks in a bin by the door.",
      "At closing time the office along the coast at Marsh Halt has {{n4}} umbrellas.",
      "How many more umbrellas does Cold Halt have than Marsh Halt?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "54", unit: "umbrellas",     role: "start",      spoken: "54" },
      n2: { value: "17", unit: "umbrellas",     role: "decrease",   spoken: "17" },
      n3: { value: "9",  unit: "umbrellas",     role: "increase",   spoken: "9" },
      n4: { value: "32", unit: "umbrellas",     role: "other",      spoken: "32" },
      n5: { value: "7",  unit: "walking sticks", role: "distractor", spoken: "7" }
    },
    context: { setting: "railway lost property office", requiresCulturalKnowledge: false }
  },

  /* Its own art now — this carried `lostproperty` from the Change Line, which
     is this problem's own first half. Umbrellas ARE the counted quantity, so
     the rail runs off both edges and they overlap at different heights. */
  scene: {
    mode: "anim", art: "umbrellas",
    caption: "A lost property rail with umbrellas hanging from it, running past both ends of the shelf."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "One lost property office starts the day with some umbrellas, loses some to their owners and gains some off the trains. Then a second office at another station is mentioned, and we are asked how much bigger the first one's pile is.",
      platformCheck: {
        sentences: [1, 2, 3, 5],
        why: "The earlier ones follow a single shelf through a day — what it started with, what left, what arrived. The last brings in another station entirely and stops the clock. Notice what is never stated: what Cold Halt has at closing time, which is the amount Marsh Halt is being measured against.",
        kinds: "Umbrellas throughout, first on a shelf across a day and then at separate stations at a single moment."
      },

      /* THE CHECKLIST IS THE ONE AID THIS STOP KEEPS, so the `fit` question is
         tailored here as carefully as on the staffed platforms — arguably more
         so, because nothing after this screen will help. Everything the student
         gets about the SHAPE of this problem, they get here. */
      questions: {
        fit: {
          ask: "Does a single kind of situation cover this whole story — the day at Cold Halt, and the offices at closing time?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it follows a shelf through a day, and after that it sets the stations against each other at a single moment. Read it again and find the sentence where it changes." },
            stacked: { yes: "An amount ending up different from how it started is a kind of situation. Amounts at separate places set against each other is a different kind. This story runs the day first and compares afterwards — and the day is what produces the amount being compared.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here, and at this stop it is yours." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many umbrellas are claimed during the day", needed: true },
        { token: "n4", describe: "how many umbrellas Marsh Halt has at closing time", needed: true },
        { token: "n5", describe: "how many walking sticks the office keeps", needed: false },
        { token: "n1", describe: "how many umbrellas Cold Halt starts the morning with", needed: true },
        { token: "n3", describe: "how many umbrellas are handed in off the trains", needed: true }
      ],
      relationship: "Three of these belong to one shelf on one day: what it started with, what left it and what arrived. Marsh Halt's count belongs to nothing that happens during that day — it turns up only at the end, to be measured against whatever Cold Halt has by then. The walking sticks belong to nothing at all.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many more umbrellas Cold Halt has than Marsh Halt at closing time.",
      commonMisreading: "Working out Cold Halt's closing count and stopping there, which answers what one office has rather than how much bigger it is than the other.",
      options: [
        { text: "How many umbrellas Cold Halt has at closing time",
          why: "You will need that, and nothing states it — but read the last sentence again. It asks how many MORE than Marsh Halt, which is the space between the two offices rather than the size of one." },
        { text: "How many more umbrellas Cold Halt has than Marsh Halt", correct: true,
          why: "The gap between the offices at the end of the day. That is the only thing here nothing gives you and nothing else stands in for." },
        { text: "How many umbrellas Marsh Halt has",
          why: "Handed to you outright in its own sentence, and it is the amount Cold Halt is being measured against." },
        { text: "How many umbrellas were handed in during the day",
          why: "Also given. It is one of the things that happened to Cold Halt's shelf, not a comparison between stations." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    whyCorrect: "This story starts on the Change Line — one shelf, followed through a day, ending up different from how it started. It does not stay there. Once Cold Halt's closing count is known, the story sets it against Marsh Halt's, and measuring one amount against another is the Compare Line. Two lines, in that order, joined at a closing count neither of them states.",
    distractors: [
      { line: "compare",   whyWrong: "Half right, and worth saying so: the second half of this story really is a comparison. But the story does not open there. Before Marsh Halt is even mentioned, a whole day happens to one shelf, and it is where that day ENDS that gets compared." },
      { line: "partwhole", whyWrong: "There is no named total that the pieces add up to. The umbrellas claimed and the umbrellas handed in are not parts of anything — one lot leaves and the other arrives, which is an event rather than a share." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and every number here happens once." },
      { line: "ratio",     whyWrong: "Nothing holds at any size. The umbrellas claimed and handed in are fixed counts on one particular day, not a relationship that would scale if the shelf were bigger." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how much bigger Cold Halt's pile is than Marsh Halt's",
      "how many umbrellas Marsh Halt has",
      "how many umbrellas were claimed during the day"
    ],
    unknownCarAnswer: "how much bigger Cold Halt's pile is than Marsh Halt's",
    unknownCarWhy: "Everything that happened during the day is counted, and Marsh Halt is counted. Neither the gap between the offices nor Cold Halt's own closing count is — which is why this one takes two moves rather than one."
  },

  /* SIGNALBOX CARRIES THE ESTIMATE AND NOTHING ELSE, and that is the fade
     rather than an omission. No crossover block and no first-half model: at an
     unstaffed halt the Plan phase is the estimate alone, and `data.js` refuses
     this problem if either is present. The estimate itself never fades — see
     the header. */
  signalBox: {
    estimate: {
      prompt: "Before calculating — roughly how many more umbrellas do you think Cold Halt has than Marsh Halt?",
      reasonableMin: 7,
      reasonableMax: 28,
      modelReasoning: "Round everything to the nearest ten. Take the claimed umbrellas off Cold Halt's morning count and put the handed-in ones back on, and you have roughly what it closes with. Then see roughly how far above Marsh Halt that is. Two rough moves, and you are after the right sort of size rather than the answer.",
      unit: "umbrellas"
    }
  },

  /* The fourth disguise, and the first at a stop where nothing on the screen
     will point it out. On the staffed platforms the halfway number was caught
     by units, then by scope, then by the word "each". Here the student has the
     Signal Failure at the Arrivals Board and their own estimate, and nothing
     else. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out what Cold Halt closes with and it was right. Why was it not the answer?",
    why: "Because the question asked how many MORE than Marsh Halt, and that number is Cold Halt on its own. It is a real count of umbrellas at the right station at the right moment — everything about it looks finished except that nobody asked for it. Nothing on this stop was going to tell you that. The question is the only thing that decides, and it is worth re-reading before you hand anything in."
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "First, how many umbrellas does Cold Halt have at closing time?",
        answer: { exact: "{{closing}}", unit: "umbrellas", acceptedForms: ["{{closing}}", "{{closing}} umbrellas"], preferredForm: "{{closing}}" },
        workedExplanation: "The shelf starts with {{n1}}. During the day {{n2}} leave, which takes it to {{afterClaims}}, and then {{n3}} arrive, which brings it to {{closing}}. So {{n1}} − {{n2}} + {{n3}} = {{closing}} umbrellas. Check it backwards — {{closing}} + {{n2}} − {{n3}} = {{n1}}, the morning shelf exactly.",
        hints: [
          { rung: 1, text: "One shelf, one day. Some umbrellas leave it and some arrive. Which of those makes the pile smaller, and which makes it bigger?" },
          { rung: 2, text: "Start at the morning count. Take off the ones that were claimed, then put on the ones handed in." },
          { rung: 3, text: "{{n1}} − {{n2}} = {{afterClaims}}, and then {{afterClaims}} + {{n3}} = ___" },
          { rung: 4, text: "{{n1}} − {{n2}} + {{n3}} = {{closing}}. Cold Halt closes with {{closing}} umbrellas." }
        ],
        misconceptions: [
          { response: "{{afterClaims}}", diagnosis: "You took the claimed umbrellas off and stopped. Two things happened to this shelf during the day, not one — the umbrellas handed in off the trains have to go back on before you have the closing count.", tag: "half-the-change" },
          { response: "{{n1}}", diagnosis: "That is the morning count, which the story handed you. Things happened to the shelf during the day, so what it closes with has to be different from what it opened with.", tag: "gave-back-the-start" },
          { response: "{{mSum}}", diagnosis: "That looks like Cold Halt's closing count added to Marsh Halt's. Marsh Halt has nothing to do with this step — it does not appear until the day at Cold Halt is over.", tag: "brought-in-the-other-station" }
        ]
      },
      {
        id: "s2",
        prompt: "Cold Halt closes with {{closing}} umbrellas and Marsh Halt has {{n4}}. How many more does Cold Halt have?",
        answer: { exact: "{{ans}}", unit: "umbrellas", acceptedForms: ["{{ans}}", "{{ans}} umbrellas"], preferredForm: "{{ans}}" },
        workedExplanation: "Both counts stand side by side at closing time, and the question wants the space between them: {{closing}} − {{n4}} = {{ans}} umbrellas. Check it forwards — {{ans}} + {{n4}} = {{closing}}, Cold Halt exactly.",
        hints: [
          { rung: 1, text: "Two offices, two counts, at the same moment. What does \"how many more\" ask you to find about them?" },
          { rung: 2, text: "The gap runs from Marsh Halt's count up to Cold Halt's. How do you get the size of a gap when you have both ends?" },
          { rung: 3, text: "{{closing}} − {{n4}} = ___" },
          { rung: 4, text: "{{closing}} − {{n4}} = {{ans}}. Cold Halt has {{ans}} more umbrellas than Marsh Halt." }
        ],
        misconceptions: [
          { response: "{{closing}}", diagnosis: "That is the number you just worked out, and it was right — but it is Cold Halt on its own, and the question asked how many MORE than Marsh Halt. It is a real count at the right station at the right moment, which is exactly why it is easy to hand in.", tag: "stopped-at-the-transfer" },
          { response: "{{mSum}}", diagnosis: "You added the two offices together. That is every umbrella on the coast, which is not something the story asks about. The space BETWEEN two amounts is a subtraction.", tag: "added-not-compared" },
          { response: "{{n4}}", diagnosis: "That is Marsh Halt's count, which the story gave you. It is the amount being measured against, not the gap.", tag: "gave-back-the-other" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "umbrellas", acceptedForms: ["{{ans}}", "{{ans}} umbrellas"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many MORE than Marsh Halt. If your answer is {{closing}}, that is Cold Halt's own closing count — the middle of this problem rather than the end of it.",
    unitsCheck: "umbrellas",
    reasonablenessCheck: "{{ans}} more umbrellas at Cold Halt. Check it backwards: {{ans}} + {{n4}} = {{closing}}, which is what Cold Halt closes with — and taking the day back off, {{closing}} + {{n2}} − {{n3}} = {{n1}}, the morning shelf exactly. Both halves check out.",
    reasonablenessFailExample: "If you got {{mSum}}, you would have added the two offices together, which is every umbrella at both stations rather than the gap between them.",
    connection: "This was the first stop on the island with nobody on the platform — no screen walked you to the seam and the Plan phase gave you an estimate and nothing else. The shape of it was the same as everywhere here: one story, two situations, and a number carried between them that answers a question nobody asked."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story and verified both ways: 54-17+9=46, 46-32=14 (14+32=46, 46+17-9=54); 61-24+8=45, 45-27=18; 48-13+11=46, 46-29=17; 57-18+6=45, 45-26=19. Cold Halt's closing count exceeds Marsh Halt's in all four, so the difference stays positive. No answer is 1, 2 or 5 - the island rule from cl-platform-planters. One set was rejected for answering 19 while 19 was also the number claimed during the day." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Change -> Compare, and the first UNSTAFFED halt. The pair is deliberately the most familiar on the island and both halves are single moves: making the first unaided stop also the hardest arithmetic would test two things at once, and this stop is testing whether a student can find a seam without help. The `fit` question is tailored more carefully than on the staffed platforms, not less, because it is the last help this problem gives - everything the student learns about the shape of it, they learn on that screen. The halfway number here is a real count at the right station at the right moment, and nothing on the stop points that out; only the Arrivals Board does, afterwards." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED - and this is the stop that most needs it. Whether the fade is a challenge or a wall is exactly the thing no amount of authoring can settle." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Fourth of seven island problems and the first at fadeLevel independent, so it is the first test of the fade machinery as well as of the content." }
  }
});
