/* The Compare Line · LARGER unknown · queues · partial · DRAFTING TABLE
   THE PROBLEM WHERE THE KEYWORD IS ALLOWED TO WIN. The story says "more" and
   the move is addition. A student running "more means add" gets this right,
   and that is the point — the same design as ch-lost-property on the Change
   Line, which lets the rule succeed immediately before cp-bench-count takes it
   away. A rule that fails the first time it is used teaches nothing; a rule
   that works twice and then fails is the one a student remembers losing.

   So this problem must NOT be made harder than it is. No inverted phrasing, no
   trap. The difficulty is deliberately in the next problem.

   WHAT IS MISSING IS THE LARGER AMOUNT, which makes the picture a base bar with
   the difference marked off the end of it — smaller + difference = larger, drawn.
   The identical picture appears on cp-bench-count with the unknown at the other
   end, so the student meets the same structure with the opposite operation.

   FOUR NUMBER SETS. Constraints:
     - the machines queue must EXCEED the difference, so the wrong-way
       subtraction stays positive and is a number a student would actually type;
     - the answer must differ from both givens and from that subtraction, so
       each misconception diagnoses exactly one mistake;
     - queue lengths stay plausible for a ticket hall.

   Verified both ways per set — the addition, and the subtraction that takes it
   back apart:
     18 + 7  = 25  (25 - 7  = 18)   wrong-way 18 - 7  = 11
     23 + 9  = 32  (32 - 9  = 23)   wrong-way 23 - 9  = 14
     16 + 11 = 27  (27 - 11 = 16)   wrong-way 16 - 11 = 5
     29 + 12 = 41  (41 - 12 = 29)   wrong-way 29 - 12 = 17 */
MF.registerProblem({
  id: "cp-ticket-queues",
  schemaVersion: 1,
  status: "published",
  title: "How many were queuing at the window",
  line: "compare",
  topics: ["larger-unknown", "addition", "referent"],
  steps: 1,

  unknownCar: "larger",
  context: "queues",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "reading"],
  hubStrategyNote: "The surface words point the right way here, which makes it a fair test of whether a student can also SAY why — drawing the bar shows that the window queue is the machines queue plus the gap, rather than a number that happened to come out of an addition.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-04" },

  numberChecks: [
    ["n1", "+", "n2", "=", "ans"],
    ["ans", "-", "n2", "=", "n1"],
    ["ans", "-", "n1", "=", "n2"],
    ["n1", "-", "n2", "=", "mSub"]
  ],

  numberSets: [
    { numbers: { n1: "18", n2: "7",  n3: "4" },
      derived: { ans: "25", mSub: "11" },
      estimate: { min: 20, max: 34 } },
    { numbers: { n1: "23", n2: "9",  n3: "6" },
      derived: { ans: "32", mSub: "14" },
      estimate: { min: 26, max: 42 } },
    { numbers: { n1: "16", n2: "11", n3: "5" },
      derived: { ans: "27", mSub: "5" },
      estimate: { min: 22, max: 36 } },
    { numbers: { n1: "29", n2: "12", n3: "3" },
      derived: { ans: "41", mSub: "17" },
      estimate: { min: 34, max: 52 } }
  ],

  problem: {
    text: "Thorne Bridge sells tickets from a bright row of machines and from a single wooden window. In the morning rush {{n1}} people stood shuffling and yawning at the machines. The queue at the window had {{n2}} more people than that. The echoing hall has {{n3}} ticket machines. How many people were queuing at the window?",
    sentences: [
      "Thorne Bridge sells tickets from a bright row of machines and from a single wooden window.",
      "In the morning rush {{n1}} people stood shuffling and yawning at the machines.",
      "The queue at the window had {{n2}} more people than that.",
      "The echoing hall has {{n3}} ticket machines.",
      "How many people were queuing at the window?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "18", unit: "people",   role: "smaller",    spoken: "18" },
      n2: { value: "7",  unit: "people",   role: "difference", spoken: "7" },
      n3: { value: "4",  unit: "machines", role: "distractor", spoken: "4" }
    },
    context: { setting: "ticket hall", requiresCulturalKnowledge: false }
  },

  /* THE PEOPLE ARE THE QUANTITY. The queuers overlap each other and run off both
     edges of the frame, so nothing in the picture is countable — a student who
     tallies them gets a lower bound on a queue whose end is outside the picture.
     The caption says the same thing in words, because the caption is all a
     screen-reader user gets. */
  scene: {
    mode: "anim", art: "queues",
    caption: "The ticket hall at its busiest: people waiting at the window, people waiting at the machines, and no end in sight to either queue."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "There are two queues at the same time. We are told how long one of them is, and how much longer the other one is than that, and we want to know how long the second queue is.",
      platformCheck: {
        sentences: [1, 2],
        why: "Between them those sentences give the queue you are told about and how much bigger the other queue is than it. Neither queue turns into the other — they are both standing there at the same moment, which is what makes this a comparison.",
        kinds: "Everything counted here is people standing in a queue."
      },

      questions: {
        kinds: {
          ask: "This story counts people in queues, and it also counts the hall's ticket machines. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The machines are furniture. Everything being compared is people standing in a line.",
                         no:  "That would mean people and machines were pinned to each other, so that another machine put another person in the queue. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the queue grew in proportion to the machines. How many machines the hall has says nothing about how many people turned up." }
          }
        },
        moments: {
          ask: "Does either queue end up a different length from how it started?",
          options: {
            steady:  { yes: "Nobody joins and nobody leaves. Both queues are simply standing there at the same moment, and the story compares them.", no: "" },
            changed: { yes: "", no: "That would mean a queue growing or shrinking between the start of the story and the end of it. Read it again — the morning rush is when you are looking, not something happening to the numbers." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single queue, or separate queues held up against each other?",
          options: {
            separate: { yes: "The window queue and the machine queue, both there at once, with the story measuring the gap between them.", no: "" },
            single:   { yes: "", no: "That would mean only a single line of people was ever in view. Count how many places the story says people are queuing." },
            paired:   { yes: "", no: "That would mean people locked to something else and scaled up or down. Nothing here is being scaled — separate amounts are set beside each other." }
          }
        },
        shape: {
          ask: "Are the people being shared out into parts, or is the same queue repeating, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares and nothing repeats. The story puts separate amounts side by side.", no: "" },
            cut:     { yes: "", no: "That would mean a single crowd divided into shares that add back up to it. The queues are not shares of a total the story ever names." },
            repeat:  { yes: "", no: "That would mean the same queue forming again and again, with the question counting how many. Each queue is there once." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the machine queue, the gap, and the window queue?",
          options: {
            onekind: { yes: "Amounts side by side and the gap between them, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a queue, a gap and another queue, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A queue measured against another queue is squarely the Compare Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many were queuing at the machines", needed: true },
        { token: "n3", describe: "how many ticket machines the hall has", needed: false },
        { token: "n2", describe: "how much longer the window queue was", needed: true }
      ],
      relationship: "One of these is a whole queue and the other is only the GAP between the two queues — it is not a queue on its own. The window queue is the machine queue with that gap added on top. How many machines the hall has does not put anybody in a line.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The length of the window queue — the machine queue plus the gap between them.",
      commonMisreading: "Answering with the gap, which is the number the sentence about the window queue actually contains.",
      options: [
        { text: "How many were queuing at the machines",
          why: "You were handed that. It is the queue the other one is measured against, not the one being asked about." },
        { text: "How many more were at the window",
          why: "That is the gap, and the story gives it to you. It is the difference between the queues, not the size of either." },
        { text: "The number of people at the window", correct: true,
          why: "The window queue is the one the question names, and it is the only amount the story never states outright." },
        { text: "How many people were in the hall altogether",
          why: "Nothing asks for a total, and adding both queues would count the same comparison as if it were a sum." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "Two queues exist at the same moment, neither of them changing, and the story states the gap between them. Measuring one amount against another is the Compare Line.",
    distractors: [
      { line: "change",    whyWrong: "Nothing happens to either queue. Change needs one amount that ends up different from how it started — a queue that grows or shrinks while you watch. Here both queues just stand there and the story compares them." },
      { line: "partwhole", whyWrong: "The two queues are not shares of a named whole. Part–Whole needs one total that the pieces add back up to, and the story never says how many people are in the hall — the window queue is not part of the machine queue." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and these are two queues of different lengths, each there once." },
      { line: "ratio",     whyWrong: "The gap is a fixed number of people, not a fixed relationship. On the Ratio Rail, doubling one amount would double the other; here the window queue is a set number MORE, which stays the same size however long the queues get." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "the window queue",
      "the machine queue",
      "the gap between the queues"
    ],
    unknownCarAnswer: "the window queue",
    unknownCarWhy: "The machine queue is printed in the story and so is the gap. The window queue is the amount nothing states, and it is what the question asks for."
  },

  signalBox: {
    compareBars: {
      title: "Side by side",
      heading: "One queue, and the gap on the end of the other",
      prompt: "One of these queues is being measured against the other. Tap the one it is measured AGAINST.",
      bars: [
        { key: "machines", label: "Machine queue", token: "n1" },
        { key: "window",   label: "Window queue", unknown: true }
      ],
      gapToken: "n2",
      unknownIs: "larger",
      referent: "machines",
      gapLabel: "the window queue",
      why: "The window queue is measured against the machine queue — \"more people THAN that\". So the machine queue is the amount you start from, and the gap sits on the end of it.",
      whyWrong: {
        window: "The window queue is the one being measured — it is the one the question asks about, and it is the one the picture cannot draw yet. Find the words \"than that\": whatever they point back to is the amount you measure against."
      },
      a11yDescription: "Two bars. The machine queue is drawn to its full length. The window queue is drawn as the same length again with the gap marked off on the end of it, and its total is a question mark because the story never states it.",
      settledSay: "Whatever follows the word \"than\" is the amount you measure against — the same rule as every problem on this line."
    },
    /* The Test Track, mirrored: the demo is missing the SMALLER amount and this
       problem is missing the larger, so the student meets the same picture with
       the question mark at the other end. Numbers 8 and 13 appear in no problem
       or set on this line. */
    testTrack: {
      kind: "compare",
      title: "The Test Track",
      heading: "Which end is the question mark on?",
      intro: "Every problem on this line is two amounts and the gap between them. Which way you travel depends on WHICH of the three the story leaves out — never on the words it uses. Watch one.",
      worked: {
        label: "A story missing the SMALLER amount. The bigger one and the gap are both given.",
        button: "Show me",
        known: { label: "Longer shelf", val: "13" },
        unknown: { label: "Shorter shelf" },
        gapText: "5 more",
        unknownIsLarger: false,
        sayCut: "The longer shelf holds 13, and that is 5 more than the shorter one.",
        sayTake: "The gap is marked on the end of the bar you ALREADY have, so what is left underneath it is the one you want. You travel down. The picture stops there — it does not work it out."
      },
      yours: {
        wholeLabel: "Your story. Look at where the question mark is before you decide anything.",
        known: { label: "Machine queue", val: "{{n1}}" },
        unknown: { label: "Window queue" },
        gapText: "{{n2}} more",
        unknownIsLarger: true,
        q1: "Which amount does your story already give you?",
        options1: [
          { text: "The machine queue", correct: true, marks: "known",
            why: "The story counts the machine queue outright. The window queue is only described as so many more than it." },
          { text: "The window queue",
            why: "Read it again — the story says the window queue had a number MORE than the machines. That is the gap, not the queue." },
          { text: "Neither of them, only the gap",
            why: "The gap is given, that part is right. But so is one of the queues — the machines are counted outright in their own sentence." }
        ],
        settled1: "You have the smaller amount, and you have the gap.",
        q2: "So which way do you travel to reach the window queue?",
        options2: [
          { text: "Add the gap on", correct: true, marks: "on",
            why: "The gap sits on the END of the bar you are looking for, so you travel up from the machine queue." },
          { text: "Take the gap off", marks: "off",
            why: "That would make the window queue SHORTER than the machine queue, on a story that says it had more people in it. Watch where the gap sits." },
          { text: "Multiply by the gap", marks: "on",
            why: "The gap is a fixed number of extra people, not a number of times bigger. Multiplying would describe a window queue several times the size of the machine queue, which is not what the story says." }
        ],
        settled2: "Add the gap onto the amount you have, and you reach the one you want."
      },
      law: "Where the question mark sits decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the addition is the next stop.",
      a11yDescription: "A demonstration in two bars. First a worked example: a longer shelf holding thirteen, drawn with a hatched piece marked \"five more\" on its end, and beneath it a shorter shelf drawn as the part left underneath, its total unknown — so you travel down from what you know. Then your own story, which is the other way round: the machine queue is drawn in full and the window queue is the same length again with the hatched gap on its end, carrying the question mark, so you travel up. Nothing is calculated in either picture."
    },

    estimate: {
      prompt: "Before calculating — roughly how many people do you think were queuing at the window?",
      reasonableMin: 20,
      reasonableMax: 34,
      modelReasoning: "The window queue is longer than the machine queue, so the answer has to be more than {{n1}}. And only {{n2}} more people are involved, so it cannot be anywhere near double. Round both to the nearest ten and add them in your head.",
      unit: "people"
    }
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many people were queuing at the window?",
        answer: { exact: "{{ans}}", unit: "people", acceptedForms: ["{{ans}}", "{{ans}} people"], preferredForm: "{{ans}}" },
        workedExplanation: "The window queue is the machine queue with the gap added on the end: {{n1}} + {{n2}} = {{ans}} people. Check it by taking the gap back off — {{ans}} − {{n2}} = {{n1}}, which is the machine queue you started from. Notice the word \"more\" did mean add this time. It will not always.",
        hints: [
          { rung: 1, text: "Find the words \"more people than that\" and ask what \"that\" is pointing back to." },
          { rung: 2, text: "Look at the picture from the Plan screen. The window queue is drawn as the machine queue with an extra piece on the end — so what do you do with the extra piece?" },
          { rung: 3, text: "The window queue is the machine queue plus the gap: {{n1}} + {{n2}} = ___" },
          { rung: 4, text: "{{n1}} + {{n2}} = {{ans}}. There were {{ans}} people queuing at the window." }
        ],
        misconceptions: [
          { response: "{{mSub}}", diagnosis: "You subtracted. That would be right if the window queue were the SHORTER one — if the story had said the window had {{n2}} fewer. It says more, and the picture shows the gap sitting on the end of the machine queue, so the window queue has to come out bigger than {{n1}}.", tag: "subtracted-wrong-direction" },
          { response: "{{n2}}", diagnosis: "That is the gap between the queues, not a queue. It is how many MORE were at the window — the machine queue's {{n1}} still has to go underneath it.", tag: "gave-back-the-difference" },
          { response: "{{n1}}", diagnosis: "That is the machine queue, which the story handed you. It is the amount the window queue is measured against, not the window queue itself.", tag: "gave-back-the-referent" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "people", acceptedForms: ["{{ans}}", "{{ans}} people"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many were at the WINDOW — not how many were at the machines, and not how many more were at the window than the machines.",
    unitsCheck: "people",
    reasonablenessCheck: "{{ans}} people at the window. Take the gap of {{n2}} back off and you land on {{n1}}, the machine queue exactly. A comparison that undoes correctly is one that holds.",
    reasonablenessFailExample: "If you got {{mSub}}, the window queue would be SHORTER than the machine queue — but the story says it had more people in it.",
    connection: "Here the word \"more\" told the truth: it really was an addition. Hold on to how the picture looked, because the next problem on this line says \"more\" too."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-04",
                 notes: "Four sets, each re-derived and checked by the inverse: 18+7=25 (25-7=18); 23+9=32 (32-9=23); 16+11=27 (27-11=16); 29+12=41 (41-12=29). The smaller queue exceeds the difference in every set so the wrong-direction subtraction stays positive and typable: 11, 14, 5, 17. All misconception values distinct from the answer and from each other in all four sets." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-04",
                 notes: "Deliberately the problem where 'more means add' SUCCEEDS, so the rule can be broken on cp-bench-count. Distractor placed mid-list in read2, not last. Option-length and option-position tells not yet measured against chance across the line." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-04",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). Theme and student passes outstanding." }
  }
});
