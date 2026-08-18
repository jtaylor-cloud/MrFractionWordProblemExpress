/* Equal Groups Express · GROUPS unknown · sacks · partial · DRAFTING TABLE
   THE FIRST INVERSION. Problem 1 gave you the size of a group and how many
   groups there were, and asked what they came to. This one gives you the size
   of a group and the total, and asks HOW MANY GROUPS — which is a division, on
   a story whose every sentence still says "each".

   THE PICTURE IS THE POINT HERE, and it is why groups-model.js branches on
   which quantity is missing. When the number of groups is the answer, the model
   refuses to tile the total: it draws the total, ONE bag against it, and stops.
   Tiling would let a student count the boxes and never divide anything —
   the model would have done the problem. See that file's header.

   FOUR NUMBER SETS. Constraints:
     - the total must divide exactly by the bag size, or the office is left
       holding a fraction of a mailbag;
     - the answer must differ from both givens, from the distractor, and from
       the wrong-way subtraction, so each misconception diagnoses one mistake;
     - letter counts stay plausible for a night's post at a small station.

   Verified both ways per set — the division, and the multiplication back:
     96 / 12 = 8   (8 x 12 = 96)     subtracted 84
     105 / 15 = 7  (7 x 15 = 105)    subtracted 90
     108 / 12 = 9  (9 x 12 = 108)    subtracted 96
     120 / 20 = 6  (6 x 20 = 120)    subtracted 100 */
MF.registerProblem({
  id: "eg-mail-sacks",
  schemaVersion: 1,
  status: "published",
  title: "How many mailbags the letters fill",
  line: "groups",
  topics: ["groups-unknown", "division", "equal-groups", "inverse-operations"],
  steps: 1,

  unknownCar: "groups",
  context: "sacks",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "Every sentence says each, and the move is a division. Drawing the bag against the pile is what makes it obvious which amount repeats and which one it is being taken out of.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  numberChecks: [
    ["n1", "/", "n2", "=", "ans"],
    ["ans", "*", "n2", "=", "n1"],
    ["n1", "/", "ans", "=", "n2"],
    ["n1", "-", "n2", "=", "mSub"]
  ],

  numberSets: [
    { numbers: { n1: "96",  n2: "12", n3: "4" },
      derived: { ans: "8", mSub: "84" },
      estimate: { min: 5, max: 13 } },
    { numbers: { n1: "105", n2: "15", n3: "3" },
      derived: { ans: "7", mSub: "90" },
      estimate: { min: 4, max: 12 } },
    { numbers: { n1: "108", n2: "12", n3: "5" },
      derived: { ans: "9", mSub: "96" },
      estimate: { min: 6, max: 14 } },
    { numbers: { n1: "120", n2: "20", n3: "6" },
      derived: { ans: "6", mSub: "100" },
      estimate: { min: 4, max: 10 } }
  ],

  problem: {
    text: "The sorting office at Thorne Bridge is warm and yellow-lit, and the evening post goes into stiff canvas mailbags. Each bag swallows exactly {{n2}} letters. {{n3}} scarred wooden benches run down the middle of the room. Tonight there are {{n1}} letters stacked in leaning piles, waiting. How many mailbags will the letters fill?",
    sentences: [
      "The sorting office at Thorne Bridge is warm and yellow-lit, and the evening post goes into stiff canvas mailbags.",
      "Each bag swallows exactly {{n2}} letters.",
      "{{n3}} scarred wooden benches run down the middle of the room.",
      "Tonight there are {{n1}} letters stacked in leaning piles, waiting.",
      "How many mailbags will the letters fill?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n2: { value: "12", unit: "letters", role: "size",       spoken: "12" },
      n3: { value: "4",  unit: "benches", role: "distractor", spoken: "4" },
      n1: { value: "96", unit: "letters", role: "total",      spoken: "96" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  scene: {
    mode: "anim", art: "sacks",
    caption: "Mailbags along the sorting bench, running away past both ends of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "The evening post is being packed into mailbags. Every bag holds the same number of letters, and we are told how many letters there are, so we can work out how many bags they fill.",
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give the size of a mailbag and the size of the pile of letters. Notice what is missing: nothing states how many bags that fills, and that is what the question wants.",
        kinds: "Everything counted here is letters, packed into bags."
      },

      questions: {
        kinds: {
          ask: "This story counts letters and mailbags, and it also counts the sorting benches. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Bags are just how the letters are held. Everything being counted is letters.",
                         no:  "That would mean letters and benches were pinned to each other, so that posting a letter built a bench. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the letters scaled with the benches. How many benches the office has says nothing about how full a bag is." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "The letters are being packed away, but no letter is added or destroyed. Putting something into a bag does not change how much of it there is.", no: "" },
            changed: { yes: "", no: "Tempting, because the pile of letters goes down as the bags fill. But the story is not asking about a pile before and after — it gives you the whole post in a single amount and asks how many bags it fills." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single thing, or separate things held up against each other?",
          options: {
            single:   { yes: "A single evening's post, packed into bags that are all the same.", no: "" },
            separate: { yes: "", no: "That would mean amounts set side by side and measured against each other, with the story interested in the gap between them. Nothing here is being compared to anything." },
            paired:   { yes: "", no: "That would mean a fixed pairing you could scale to any size. The story gives a set pile of letters, not a rule about post in general." }
          }
        },
        shape: {
          ask: "Is anything being cut up, or repeated?",
          options: {
            repeat:  { yes: "The same bagful, over and over, until the letters run out. You could act it out: fill a bag, then another the same, then another.", no: "" },
            cut:     { yes: "", no: "The closest call on this problem, because the pile of letters does get divided up. But Part–Whole cuts a whole into shares that are DIFFERENT named pieces — here every piece is the same size, and that sameness is the whole structure." },
            neither: { yes: "", no: "Look again at the bags. They all hold the same amount, and the story fills them in a row — that is something repeating." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the bags, what they hold, and the pile of letters?",
          options: {
            onekind: { yes: "The same amount repeated, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a repeated amount and a question about how many times it goes in, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Equal bags filled in a row is squarely Equal Groups." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many letters fit in a mailbag", needed: true },
        { token: "n1", describe: "how many letters there are to send", needed: true },
        { token: "n3", describe: "how many sorting benches the office has", needed: false }
      ],
      relationship: "One of these is the size of a single bag and the other is the whole pile. The bags are that same amount taken out of the pile again and again, until there is nothing left. The benches are furniture and hold no letters in this story.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many mailbags the letters fill.",
      commonMisreading: "Reading \"each\" and multiplying, which describes a night with far more post than the story gives.",
      options: [
        { text: "How many letters fit in a bag",
          why: "You were handed that. It is the size of a single bag, not how many bags there are." },
        { text: "How many bags the letters fill", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many letters there are tonight",
          why: "Also given. It is the whole pile — the amount the bags are taken out of." },
        { text: "How many letters are left over",
          why: "Nothing asks for a remainder, and in this story the letters fill the bags exactly." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "The same amount — a bagful — taken out of the pile over and over, with the question asking how many times that goes. That is Equal Groups with the number of groups missing, and it is a division.",
    distractors: [
      { line: "partwhole", whyWrong: "The strongest case against, because the pile really does get divided. But Part–Whole cuts a whole into DIFFERENT named shares — a part and another part that make the total. Here every share is identical, and their being identical is the only reason you can divide at all." },
      { line: "change",    whyWrong: "Nothing is added or taken away from the post. The letters move into bags, but no amount ends up different from how it started — the same letters are there at the end, just held differently." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. Compare needs two amounts side by side with the story interested in the gap between them; here there is a pile and a bag size, and the bag is not being compared to the pile — it is being taken out of it." },
      { line: "ratio",     whyWrong: "Tempting, because \"{{n2}} letters in every bag\" sounds like a fixed pairing. But a ratio pins two DIFFERENT kinds of thing together so scaling one scales the other. Here everything counted is letters, and the story asks about a single fixed pile." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many mailbags the letters fill",
      "how many letters fit in a bag",
      "how many letters there are tonight"
    ],
    unknownCarAnswer: "how many mailbags the letters fill",
    unknownCarWhy: "The story counts a bag and it counts the letters. What it never states is how many bags those letters come to, and that is exactly what the question asks for."
  },

  signalBox: {
    /* GROUPS UNKNOWN, so the model draws the total, ONE bag against it, and
       stops. It must not tile: how many bags fit IS the answer, and a tiled
       tray would let a student count instead of divide. This is the branch
       groups-model.js exists to protect. */
    groupsModel: {
      title: "The same amount, again",
      heading: "One bagful, taken out of the pile over and over",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      sizeToken: "n2",
      totalToken: "n1",
      unknownIs: "groups",
      repeater: "size",
      restLabel: "how many more bagfuls?",
      totalLabel: "letters to send",
      questionLabel: "how many bagfuls that is",
      settledLabel: "so the question is",
      choices: [
        { key: "size",  label: "Letters in a mailbag", said: "{{n2}}" },
        { key: "total", label: "Letters to send",      said: "{{n1}}" }
      ],
      why: "Every bag holds the same {{n2}} letters, so that is the amount being taken out again and again. The {{n1}} letters are the pile it comes out of — and how many times it comes out is what you are being asked.",
      whyWrong: {
        total: "That is the pile the bagfuls come OUT of, not the amount being repeated. Ask which number stays the same every time you fill a bag: it is what fits inside a single bag."
      },
      a11yDescription: "A bar standing for all {{n1}} letters, with a single bagful of {{n2}} drawn against its left end and the rest of the bar left open and hatched. How many more of that bagful fit into the rest is what the question asks, so the picture does not fill them in.",
      settledSay: "The amount that repeats is what fits in a single group. How many times it goes is the question."
    },
    estimate: {
      prompt: "Before calculating — roughly how many mailbags do you think that fills?",
      reasonableMin: 5,
      reasonableMax: 13,
      modelReasoning: "A bag takes {{n2}} letters and there are {{n1}} altogether. Ask yourself roughly how many {{n2}}s fit into {{n1}} — round both to something easy and the answer will be near it. It has to be a small number, because each bag swallows a lot of letters.",
      unit: "mailbags"
    },

    /* The demo runs on 10 and 3, which belong to no problem or set on this line
       (§26), and is the OPPOSITE shape to this problem — it is missing the
       total, so the demonstration builds up while the student's own picture
       shares out. Nothing is calculated in either. */
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
        groupsUnknown: true,
        sizeLabel: "{{n2}} letters",
        unitPct: 22,
        totalLabel: "letters to send",
        totalVal: "{{n1}}",
        restLabel: "how many more bagfuls?",
        q1: "Which amounts does your story already give you?",
        options1: [
          { text: "A bagful, and the whole pile", correct: true, marks: "total",
            why: "The story counts what fits in a bag and it counts the letters. What it never states is how many bags that makes." },
          { text: "A bagful, and how many bags",
            why: "Read it again — how many bags is what the question asks for. If you had it, there would be nothing to work out." },
          { text: "Only the whole pile",
            why: "The pile is given, that part is right. But so is the size of a bag — that is the sentence with \"each\" in it." }
        ],
        settled1: "You have a group, and you have the total it comes out of.",
        q2: "So which way do you travel?",
        options2: [
          { text: "Share the pile out into bagfuls", correct: true, marks: "share",
            why: "You have the total and the size of a group, so you find how many of that group fit inside it. That is a division." },
          { text: "Build the total up from the bags", marks: "build",
            why: "You already have the total — it is the pile of letters. Building up is what you do when the total is the thing missing." },
          { text: "Take a bagful away from the pile", marks: "share",
            why: "That empties a single bag out and tells you what is still waiting. It does not tell you how many bags there are altogether." }
        ],
        settled2: "See how many times the group fits inside the total, and that is how many groups there are."
      },
      law: "Which of the three is missing decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the division is the next stop.",
      a11yDescription: "A demonstration in two trays. First a worked example missing the total: three boxes of ten tins with a bracket underneath carrying a question mark, so you build up. Then your own story, which is the other way round: a bar standing for the whole pile of letters with a single bagful drawn against its end and the rest left open, so you share out. Nothing is counted in either picture."
    }
  },

  /* The Signal Failure this problem carries. "Each" was allowed to succeed on
     eg-crate-bottles and it is still in every sentence here, but the move has
     inverted. Not foreshadowed anywhere before the Engine Room — naming the
     trap early disarms it, which is the ch-water-tank lesson.

     Top-level, because it renders at the Arrivals Board (Phase 4b), where the
     answer is already shown and "why is the answer smaller than the number you
     were given" costs nothing. */
  signalFailure: {
    trigger: "each",
    prompt: "The story says EACH bag holds {{n2}} letters, exactly like the crates did. Why is the answer smaller than the number you were given this time?",
    why: "Because what is missing has moved. Last time you knew how many groups there were and had to build the total; here you are GIVEN the total and asked how many groups it makes. The word \"each\" tells you the groups are equal. It does not tell you which of the three amounts is missing, and that is the thing that decides the operation."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many mailbags will the letters fill?",
        answer: { exact: "{{ans}}", unit: "mailbags", acceptedForms: ["{{ans}}", "{{ans}} mailbags", "{{ans}} bags"], preferredForm: "{{ans}}" },
        workedExplanation: "Each bag takes {{n2}} letters, and there are {{n1}} letters to pack. So the question is how many {{n2}}s fit into {{n1}}: {{n1}} ÷ {{n2}} = {{ans}} mailbags. Check it forwards — {{ans}} bags with {{n2}} letters in each is {{ans}} × {{n2}} = {{n1}}, the whole pile exactly.",
        hints: [
          { rung: 1, text: "Look at the picture from the Plan screen. One bagful is drawn against the whole pile. How many more of it would fit in the rest?" },
          { rung: 2, text: "You know the size of a group and you know the total. What is missing is how many groups — and that is a division." },
          { rung: 3, text: "{{n1}} letters ÷ {{n2}} letters in each bag = ___" },
          { rung: 4, text: "{{n1}} ÷ {{n2}} = {{ans}}. The letters fill {{ans}} mailbags." }
        ],
        misconceptions: [
          { response: "{{mSub}}", diagnosis: "You subtracted. Taking {{n2}} away from {{n1}} empties a single bag out of the pile and tells you the letters still waiting — not how many bags there are altogether. You need to know how many times a bagful goes in, which is a division.", tag: "subtracted-instead-of-divided" },
          { response: "{{n1}}", diagnosis: "That is the whole pile of letters, which the story gives you. Each bag swallows {{n2}} of them, so the number of BAGS has to be far smaller.", tag: "gave-back-the-total" },
          { response: "{{n2}}", diagnosis: "That is what fits in a single bag, not how many bags there are. It is the amount that repeats — the question asks how many times it repeats.", tag: "gave-back-the-group-size" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "mailbags", acceptedForms: ["{{ans}}", "{{ans}} mailbags", "{{ans}} bags"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for BAGS — how many of them the post fills. Not the letters, and not what a bag holds.",
    unitsCheck: "mailbags",
    reasonablenessCheck: "{{ans}} mailbags. Put {{n2}} letters in each of them and you get {{ans}} × {{n2}} = {{n1}}, the whole evening's post exactly. And the answer is far smaller than {{n1}}, which it has to be, because every bag holds a great many letters.",
    reasonablenessFailExample: "If you got {{mSub}}, that would be almost as many bags as there are letters — on a story where a single bag holds {{n2}} of them.",
    connection: "Same shape as the crates, with a different piece missing. There you knew how many groups and built the total; here you were given the total and had to find how many groups. The word \"each\" was in both, and it did not decide either one."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived and checked both ways: 96/12=8 (8x12=96); 105/15=7 (7x15=105); 108/12=9 (9x12=108); 120/20=6 (6x20=120). Every total divides exactly, so no set leaves a partial bag. The subtracted-instead-of-divided value (84, 90, 96, 100) is distinct from the answer, both givens and the distractor in every set." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "First inversion on the line: same 'each' wording as eg-crate-bottles, opposite operation, which is the ch-lost-property/ch-water-tank arc. Signal Failure attached and NOT foreshadowed before the Engine Room. The Plan model is in its groups-unknown branch, which deliberately refuses to tile the total — tiling would let the student count the answer instead of dividing for it. Read 3 distractor placed mid-list." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). No Test Track: this problem inverts an operation and is exactly the kind that has earned one elsewhere on the site. Recorded as a known gap rather than claimed as a decision." }
  }
});
