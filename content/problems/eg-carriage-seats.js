/* Equal Groups Express · SIZE unknown · carriages · independent · SWITCHYARD
   THE SECOND INVERSION, AND THE ONE STUDENTS CONFUSE WITH THE FIRST.

   eg-mail-sacks is a division. So is this. They are NOT the same division, and
   telling them apart is the reason both exist: there, the size of a group was
   given and the number of groups was missing; here, the number of groups is
   given and the size of a group is missing. Both are "total ÷ the one you have",
   and a student who has learned "divide" without learning WHICH divides by what
   will get one of the two backwards every time.

   Placed at the Switchyard because the fork is genuine and comes before any
   arithmetic: which of the two numbers you were handed is the count, and which
   is the size?

   THE PICTURE MAY TILE HERE, and that is not an inconsistency. How many
   carriages there are is a value the story states outright, so drawing that many
   boxes reveals nothing — each one carries "?" because what is INSIDE a carriage
   is the question. Contrast eg-mail-sacks, where the number of groups is the
   answer and the model refuses to tile at all. The branch is in
   groups-model.js and it is the file's whole reason for existing.

   FOUR NUMBER SETS. Constraints:
     - the total must divide exactly by the number of carriages, or a carriage
       has a fraction of a seat;
     - the answer must differ from both givens, from the distractor and from the
       wrong-way subtraction;
     - seats per carriage stay plausible for a real train.

   Verified both ways per set — the division, and the multiplication back:
     84 / 6 = 14   (14 x 6 = 84)     subtracted 78
     96 / 8 = 12   (12 x 8 = 96)     subtracted 88
     105 / 7 = 15  (15 x 7 = 105)    subtracted 98
     99 / 9 = 11   (11 x 9 = 99)     subtracted 90 */
MF.registerProblem({
  id: "eg-carriage-seats",
  schemaVersion: 1,
  status: "published",
  title: "How many seats are in each carriage",
  line: "groups",
  topics: ["size-unknown", "division", "equal-groups", "inverse-operations"],
  steps: 1,

  unknownCar: "size",
  context: "carriages",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "drafting"],
  hubStrategyNote: "Two problems on this line divide, and they divide by different things. Nothing but working out which number is the count and which is the size will get a student to the right one, which makes this the sharpest test of strategy selection on the line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  numberChecks: [
    ["n2", "/", "n1", "=", "ans"],
    ["ans", "*", "n1", "=", "n2"],
    ["n2", "/", "ans", "=", "n1"],
    ["n2", "-", "n1", "=", "mSub"]
  ],

  numberSets: [
    { numbers: { n1: "6", n2: "84",  n3: "3" },
      derived: { ans: "14", mSub: "78" },
      estimate: { min: 9, max: 20 } },
    { numbers: { n1: "8", n2: "96",  n3: "5" },
      derived: { ans: "12", mSub: "88" },
      estimate: { min: 8, max: 18 } },
    { numbers: { n1: "7", n2: "105", n3: "4" },
      derived: { ans: "15", mSub: "98" },
      estimate: { min: 10, max: 22 } },
    { numbers: { n1: "9", n2: "99",  n3: "6" },
      derived: { ans: "11", mSub: "90" },
      estimate: { min: 7, max: 16 } }
  ],

  problem: {
    text: "The early train out of Thorne Bridge is {{n1}} green carriages long, and every carriage is fitted out the same, seat for seat. The station has {{n3}} draughty platforms. Packed full on a wet Monday, the train carries {{n2}} seated passengers. How many seats are in each carriage?",
    sentences: [
      "The early train out of Thorne Bridge is {{n1}} green carriages long, and every carriage is fitted out the same, seat for seat.",
      "The station has {{n3}} draughty platforms.",
      "Packed full on a wet Monday, the train carries {{n2}} seated passengers.",
      "How many seats are in each carriage?"
    ],
    questionSentenceIndex: 3,
    numbers: {
      n1: { value: "6",  unit: "carriages",  role: "groups",     spoken: "6" },
      n3: { value: "3",  unit: "platforms",  role: "distractor", spoken: "3" },
      n2: { value: "84", unit: "passengers", role: "total",      spoken: "84" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  scene: {
    mode: "anim", art: "carriages",
    caption: "The morning train along the platform, its carriages running on past both ends of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A train is made up of carriages that all have the same number of seats. We are told how many carriages there are and how many people the whole train seats, so we can work out how many seats are in a carriage.",
      platformCheck: {
        sentences: [0, 2],
        why: "Between them those sentences give how many carriages there are and how many the whole train seats. Notice what is missing: nothing states how many seats a carriage has, and that is what the question wants.",
        kinds: "Everything counted here is seats, grouped into carriages."
      },

      questions: {
        kinds: {
          ask: "This story counts seats and carriages, and it also counts the station's platforms. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Carriages are just how the seats are grouped. Everything being counted is seats.",
                         no:  "That would mean seats and platforms were pinned to each other, so that adding a seat built a platform. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the seats scaled with the platforms. How many platforms the station has says nothing about how big a carriage is." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "The train is described as it is. No seat is fitted or removed while the story runs.", no: "" },
            changed: { yes: "", no: "Tempting, because a train that fills up sounds like something happening. But look for an AMOUNT that ends up different — the number of seats is fixed, and the story is telling you what the train holds, not watching it fill." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single thing, or separate things held up against each other?",
          options: {
            single:   { yes: "A single train, made of carriages that are all the same.", no: "" },
            separate: { yes: "", no: "That would mean amounts set side by side and measured against each other, with the story interested in the gap between them. No carriage is being compared to another — they are all identical." },
            paired:   { yes: "", no: "That would mean a fixed pairing you could scale to any size. The story describes a particular train, not a rule about trains in general." }
          }
        },
        shape: {
          ask: "Is anything being cut up, or repeated?",
          options: {
            repeat:  { yes: "The same carriage-load of seats, over and over, all the way along the train.", no: "" },
            cut:     { yes: "", no: "The closest call, because the train's seats do split between the carriages. But Part–Whole cuts a whole into DIFFERENT named shares. Here every carriage is identical, and that sameness is what lets you divide at all." },
            neither: { yes: "", no: "Look again at the carriages. The story says every carriage has the same number of seats — that is an amount repeating." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the carriages, the seats, and what the train holds?",
          options: {
            onekind: { yes: "The same amount repeated, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a repeated amount and a question about how big it is, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Identical carriages along a train is squarely Equal Groups." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many carriages the train has", needed: true },
        { token: "n3", describe: "how many platforms the station has", needed: false },
        { token: "n2", describe: "how many seated passengers the whole train carries", needed: true }
      ],
      relationship: "One of these is how many groups there are and the other is what all the groups come to together. Read them carefully: both are counts of things on a train, and only one of them is a number of PEOPLE. What is missing is the size of a single carriage. The platforms are part of the station and carry no seats in this story.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many seats are in a single carriage.",
      commonMisreading: "Answering with the whole train's seats, which the story already gives you.",
      options: [
        { text: "How many carriages the train has",
          why: "You were handed that. It is how many groups there are, not how big a group is." },
        { text: "The seats in a single carriage", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many passengers the train seats",
          why: "Also given. It is what all the carriages come to together, not what one of them holds." },
        { text: "How many passengers are standing",
          why: "The story says nothing about anyone standing. Every number in it is about seats." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "The same amount — a carriage-load of seats — repeated all along the train, with the question asking how big that repeated amount is. That is Equal Groups with the group SIZE missing.",
    distractors: [
      { line: "partwhole", whyWrong: "The strongest case against, because the train's seats really do divide between the carriages. But Part–Whole needs a whole cut into DIFFERENT named shares that add back up to it. Here every share is identical, and their being identical is the only reason a single division answers the question." },
      { line: "compare",   whyWrong: "No carriage is measured against another. Compare needs two amounts side by side with the story interested in the gap between them, and the whole point here is that the carriages are all the same." },
      { line: "change",    whyWrong: "Nothing is added to or taken from the train. No amount ends up different from how it started — the story describes a train, it does not change one." },
      { line: "ratio",     whyWrong: "Tempting, because seats-per-carriage sounds like a rate. But a ratio pins two DIFFERENT kinds of thing together so scaling one scales the other, and here everything counted is seats. The story asks about one particular train, not a rule you could apply to a train of any length." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many seats are in a carriage",
      "how many carriages the train has",
      "how many passengers the train seats"
    ],
    unknownCarAnswer: "how many seats are in a carriage",
    unknownCarWhy: "The story counts the carriages and it counts the whole train's passengers. What it never states is how those seats are shared out between the carriages, and that is exactly what the question asks for."
  },

  signalBox: {
    /* SIZE UNKNOWN, so the model MAY tile: how many carriages there are is
       stated in the story, and drawing that many boxes reveals nothing. Each box
       carries "?" because what is inside it is the question. This is the branch
       that contrasts with eg-mail-sacks, where the count is the answer and
       tiling would hand it over. */
    groupsModel: {
      title: "The same amount, again",
      heading: "The train's seats, shared equally between the carriages",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      groupsToken: "n1",
      totalToken: "n2",
      unknownIs: "size",
      repeater: "size",
      totalLabel: "seats on the train",
      questionLabel: "how many seats are in a carriage",
      settledLabel: "so the question is",
      choices: [
        { key: "size",   label: "Seats in a carriage",   said: "?" },
        { key: "groups", label: "Carriages on the train", said: "{{n1}}" }
      ],
      why: "Every carriage holds the same number of seats, so THAT is the amount being repeated — even though it is the amount you do not know yet. The {{n1}} carriages are how many times it repeats.",
      whyWrong: {
        groups: "That is how many times the amount repeats, not the amount itself. The thing being laid down again and again is a carriage-load of seats, and the story never tells you how big it is — which is why it is the question."
      },
      a11yDescription: "A tray of {{n1}} identical boxes, one for each carriage, each outlined rather than filled and carrying a question mark. A bracket underneath spans all of them and is labelled {{n2}} seats, so the picture shows the whole train shared into equal carriages without saying how many seats that gives each one.",
      settledSay: "The amount that repeats can be the amount you are looking for. What makes it the repeater is that every group has the same one."
    },
    estimate: {
      prompt: "Before calculating — roughly how many seats do you think are in each carriage?",
      reasonableMin: 9,
      reasonableMax: 20,
      modelReasoning: "{{n2}} seats shared between {{n1}} carriages. Round {{n2}} to something that divides easily by {{n1}} and you will land close. It has to be far smaller than {{n2}}, because the seats are spread over every carriage.",
      unit: "seats"
    },

    /* Demo on 10 and 3 (§26 — neither belongs to any set on this line), and it
       is missing the TOTAL while this problem is missing the group SIZE. So the
       demonstration builds up and the student's own picture shares out — and
       the sharing here splits a total between a KNOWN number of groups, which
       is the distinction from eg-mail-sacks that this problem exists to teach. */
    testTrack: {
      kind: "groups",
      title: "The Test Track",
      heading: "Build it up, or share it out?",
      intro: "Every problem on this line is groups, the size of a group, and what they come to. Which way you travel depends on WHICH of the three the story leaves out — never on the words it uses. Watch one.",
      worked: {
        label: "A story missing the TOTAL. The size of a group and the number of groups are both given.",
        button: "Show me",
        groups: 3,
        sizeLabel: "10 tins",
        totalLabel: "in the crate",
        totalVal: "?",
        sayCut: "A box holds 10 tins, and there are 3 boxes.",
        sayTake: "You have a box and you know how many boxes, so you BUILD THE TOTAL UP. Notice the picture stops there — it does not work it out for you."
      },
      yours: {
        wholeLabel: "Your story. Look at which box is empty before you decide anything.",
        groups: "{{n1}}",
        sizeUnknown: true,
        totalLabel: "seats on the train",
        totalVal: "{{n2}}",
        q1: "Which amounts does your story already give you?",
        options1: [
          { text: "How many carriages, and the whole train", correct: true, marks: "total",
            why: "The story counts the carriages and it counts the passengers the train seats. What it never states is how those seats split between the carriages." },
          { text: "How many carriages, and the seats in one",
            why: "Read it again — the seats in a carriage is what the question asks for. If you had it, there would be nothing to work out." },
          { text: "Only the whole train",
            why: "The train's seats are given, that part is right. But so is the number of carriages, in the very first sentence." }
        ],
        settled1: "You have the total, and you know how many groups it splits into.",
        q2: "So which way do you travel?",
        options2: [
          { text: "Share the train's seats out between the carriages", correct: true, marks: "share",
            why: "You have the total and the number of groups, so the total splits between them and what comes out is the size of a group." },
          { text: "Build the total up from the carriages", marks: "build",
            why: "You already have the total — it is the number the train seats. Building up is what you do when the total is the thing missing." },
          { text: "Take the carriages away from the passengers", marks: "share",
            why: "Those count different things — carriages and people — so taking one from the other describes nothing in the story." }
        ],
        settled2: "Split the total between the groups, and what comes out is the size of a group."
      },
      law: "Which of the three is missing decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the division is the next stop.",
      a11yDescription: "A demonstration in two trays. First a worked example missing the total: three boxes of ten tins with a bracket underneath carrying a question mark, so you build up. Then your own story, which is the other way round: a tray with a box for every carriage, each one outlined and carrying a question mark, and a bracket underneath labelled with the whole train's seats — so you share out. Nothing is counted in either picture."
    }
  },

  /* The Signal Failure. This problem's trap is not a keyword — it is the
     OTHER division. A student who has just done eg-mail-sacks may divide the
     total by the group size out of habit, except here the number they hold is
     the group COUNT. Nothing before the Engine Room hints at it.

     Top-level, because it renders at the Arrivals Board (Phase 4b). This one
     is the strongest reason the placement matters: its `why` walks through
     which number to divide by, which is the entirety of step 1's thinking. */
  signalFailure: {
    trigger: "divide",
    prompt: "You divided, and dividing is right. How do you know which of the two numbers to divide BY?",
    why: "Look at what each number counts. {{n1}} counts carriages — that is how many groups there are. {{n2}} counts passengers — that is everything, added up. You always divide the total by the one you have: here you have the number of groups, so the total splits between them and what comes out is the size of a group. On the mailbags it was the other way round, and the words were nearly identical."
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many seats are in each carriage?",
        answer: { exact: "{{ans}}", unit: "seats", acceptedForms: ["{{ans}}", "{{ans}} seats"], preferredForm: "{{ans}}" },
        workedExplanation: "The train seats {{n2}} passengers and it has {{n1}} carriages, all the same. So the seats share out equally between the carriages: {{n2}} ÷ {{n1}} = {{ans}} seats in each. Check it forwards — {{n1}} carriages with {{ans}} seats each is {{n1}} × {{ans}} = {{n2}}, the whole train exactly.",
        hints: [
          { rung: 1, text: "Look at the picture from the Plan screen. There is a box for every carriage, the bracket underneath is the whole train, and each box carries a question mark." },
          { rung: 2, text: "You know the total and you know how many groups. What is missing is how big a group is — so the total splits between the groups." },
          { rung: 3, text: "{{n2}} seats ÷ {{n1}} carriages = ___" },
          { rung: 4, text: "{{n2}} ÷ {{n1}} = {{ans}}. Each carriage has {{ans}} seats." }
        ],
        misconceptions: [
          { response: "{{mSub}}", diagnosis: "You subtracted. Taking {{n1}} away from {{n2}} removes a number of CARRIAGES from a number of PASSENGERS, which is not a quantity of anything. The seats have to be shared out between the carriages, and sharing is a division.", tag: "subtracted-instead-of-divided" },
          { response: "{{n2}}", diagnosis: "That is the whole train's seats, which the story gives you. A single carriage holds only a share of them, so the answer has to be far smaller.", tag: "gave-back-the-total" },
          { response: "{{n1}}", diagnosis: "That is how many carriages there are, not how many seats are inside one of them. It is the number of groups — the question asks for the size of a group.", tag: "gave-back-the-group-count" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "seats", acceptedForms: ["{{ans}}", "{{ans}} seats"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked about a SINGLE carriage — how many seats are inside it. Not the whole train, and not how many carriages there are.",
    unitsCheck: "seats",
    reasonablenessCheck: "{{ans}} seats in each carriage. Put {{ans}} into every one of the {{n1}} carriages and you get {{n1}} × {{ans}} = {{n2}}, the whole train exactly. And the answer is far smaller than {{n2}}, which it has to be, because the seats are spread along the train.",
    reasonablenessFailExample: "If you got {{mSub}}, a single carriage would hold nearly everyone on the train — on a story that says there are {{n1}} carriages, all the same.",
    connection: "This is the third piece of the same structure. The crates gave you the size and the count; the mailbags gave you the size and the total; this gives you the count and the total. Same picture every time — what changes is which box is empty."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived and checked both ways: 84/6=14 (14x6=84); 96/8=12 (12x8=96); 105/7=15 (15x7=105); 99/9=11 (11x9=99). Every total divides exactly, so no set gives a carriage a fraction of a seat. The subtracted value (78, 88, 98, 90) is distinct from the answer, both givens and the distractor in every set." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "The second division on the line and deliberately the twin of eg-mail-sacks: same operation, different divisor, and telling them apart is the lesson. Placed at the Switchyard because the fork precedes any arithmetic. Its Signal Failure is unusual in that it fires on a CORRECT operation and asks how the student knew which number to divide by — the trap here is not a keyword but the other division. The Plan model tiles here and refuses to tile on eg-mail-sacks; that contrast is the point of both." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). No Test Track, and this problem is a strong candidate for one — the two divisions on this line are the confusion a demonstration would address directly." }
  }
});
