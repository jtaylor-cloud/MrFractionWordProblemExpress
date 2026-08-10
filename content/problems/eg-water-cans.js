/* Equal Groups Express · GROUPS unknown · FRACTION DIVISION · cans · independent · SWITCHYARD
   THE KEYSTONE OF THE LINE, AND THE PROBLEM PEDAGOGY.md §3.3 NAMES OUTRIGHT:
   "fraction division lives here and is the hardest case in the middle-school
   curriculum: 'how many 2/3-cup servings in 4 cups?' is groups-unknown, and
   students almost universally multiply instead."

   This is the ch-water-tank of Equal Groups. Everything before it is here so
   that this one can fail honestly:

     eg-crate-bottles   let "each" mean multiply, and it worked.
     eg-mail-sacks      kept "each" and made it a division.
     eg-carriage-seats  made it the OTHER division.
     eg-bunting-ribbon  proved that multiplying by a fraction makes things
                        SMALLER — which is the belief this problem needs already
                        broken, because the answer here is BIGGER than the total
                        you started with, and that feels impossible.

   WHY {{ans}} IS BIGGER THAN {{n1}} AND WHY THAT IS THE WHOLE LESSON. You have
   {{n1}} litres and you are filling cans that hold less than a litre each, so
   you get MORE cans than litres. Every student who answers {{mDen}} or {{n1}}
   has refused that. Dividing by a number below 1 makes things bigger, and it is
   the exact mirror of what eg-bunting-ribbon taught one problem earlier.

   THE PICTURE CARRIES THE ARGUMENT. groups-model.js is in its groups-unknown
   branch here, so it draws the tank, ONE can against it, and stops — and one
   can is visibly a small slice of the tank, which makes "more cans than litres"
   something a student can see before they can justify it. Tiling would have
   handed over the answer; see that file's header.

   FOUR NUMBER SETS. Constraints:
     - the division must come out exact, so no set leaves a part-filled can;
     - the can must hold LESS than a litre in every set, or the lesson inverts;
     - the answer must exceed the number of litres in every set, because that
       surprise is the teaching;
     - the denominator-only error must differ from the answer and both givens.

   Verified per set — the division, and the multiplication back through the
   fraction (ans x num = n1 x den, which is what numberChecks assert):
     4 litres / (2/3) = 6 cans    (6 x 2 = 12 = 4 x 3)
     6 litres / (3/4) = 8 cans    (8 x 3 = 24 = 6 x 4)
     10 litres / (2/5) = 25 cans  (25 x 2 = 50 = 10 x 5)
     9 litres / (3/4) = 12 cans   (12 x 3 = 36 = 9 x 4) */
MF.registerProblem({
  id: "eg-water-cans",
  schemaVersion: 1,
  status: "published",
  title: "How many watering cans the tank fills",
  line: "groups",
  topics: ["groups-unknown", "fraction-division", "equal-groups", "inverse-operations"],
  steps: 1,

  unknownCar: "groups",
  context: "cans",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "drafting"],
  hubStrategyNote: "The hardest problem on the line and the one worth reaching last. The answer comes out bigger than the amount you started with, and nothing but understanding what dividing by a fraction does will make a student believe it.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  /* As on eg-bunting-ribbon, the fraction token cannot be checked directly —
     parseFloat("2/3") is 2. These pin the division using integers only. */
  numberChecks: [
    ["n1", "*", "den", "=", "mDen"],
    ["ans", "*", "num", "=", "mDen"]
  ],

  numberSets: [
    { numbers: { n1: "4",  n2: "2/3", n3: "5" },
      derived: { ans: "6",  num: "2", den: "3", mDen: "12" },
      estimate: { min: 4, max: 9 } },
    { numbers: { n1: "6",  n2: "3/4", n3: "3" },
      derived: { ans: "8",  num: "3", den: "4", mDen: "24" },
      estimate: { min: 6, max: 12 } },
    { numbers: { n1: "10", n2: "2/5", n3: "4" },
      derived: { ans: "25", num: "2", den: "5", mDen: "50" },
      estimate: { min: 18, max: 34 } },
    { numbers: { n1: "9",  n2: "3/4", n3: "6" },
      derived: { ans: "12", num: "3", den: "4", mDen: "36" },
      estimate: { min: 9, max: 17 } }
  ],

  problem: {
    text: "The old water tower at Thorne Bridge feeds the station garden, and the gardener fills battered tin cans from its dripping tap. Each dented can holds {{n2}} of a litre. {{n3}} flower beds run the length of the sunny platform. This morning the tank holds {{n1}} litres. How many watering cans can be filled from the tank?",
    sentences: [
      "The old water tower at Thorne Bridge feeds the station garden, and the gardener fills battered tin cans from its dripping tap.",
      "Each dented can holds {{n2}} of a litre.",
      "{{n3}} flower beds run the length of the sunny platform.",
      "This morning the tank holds {{n1}} litres.",
      "How many watering cans can be filled from the tank?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n2: { value: "2/3", unit: "of a litre", role: "size",       spoken: "two thirds" },
      n3: { value: "5",   unit: "flower beds", role: "distractor", spoken: "5" },
      n1: { value: "4",   unit: "litres",     role: "total",      spoken: "4" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  scene: {
    mode: "anim", art: "cans",
    caption: "The water tower above the station garden, with watering cans lined up past both ends of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Watering cans are being filled from a tank. Every can holds the same amount, and we are told how much water is in the tank, so we can work out how many cans it fills.",
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give the size of a watering can and the amount of water in the tank. Notice what is missing: nothing states how many cans that fills, and that is what the question wants.",
        kinds: "Everything measured here is water, in litres."
      },

      questions: {
        kinds: {
          ask: "This story measures water and counts cans, and it also counts the flower beds. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Cans are just what the water is being put into. Everything being measured is water.",
                         no:  "That would mean water and flower beds were pinned to each other, so that filling a can dug a bed. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the water scaled with the flower beds. How many beds are along the platform says nothing about how big a can is." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "The story gives you a tank and a can size and asks how they fit together. Neither amount is changed while it does.", no: "" },
            changed: { yes: "", no: "The most tempting choice on this problem, because a tank being emptied into cans really does sound like something happening. But the question is not what is LEFT in the tank — it is how many cans the water makes, and both the tank and the can size are fixed amounts the story hands you." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single thing, or separate things held up against each other?",
          options: {
            single:   { yes: "A single tank of water, poured into cans that are all the same.", no: "" },
            separate: { yes: "", no: "That would mean amounts set side by side and measured against each other, with the story interested in the gap between them. The can is not being compared to the tank — it is being taken out of it, over and over." },
            paired:   { yes: "", no: "That would mean a fixed pairing you could scale to any size. The story gives a set amount of water, not a rule about tanks in general." }
          }
        },
        shape: {
          ask: "Is anything being cut up, or repeated?",
          options: {
            repeat:  { yes: "The same canful, over and over, until the tank runs dry.", no: "" },
            cut:     { yes: "", no: "The hardest call on this line, and it is worth sitting with. The tank does get divided up — but Part–Whole cuts a whole into DIFFERENT named shares, like the water for the roses and the water for the beans. Here every share is identical, and that sameness is the only reason a single division answers the question." },
            neither: { yes: "", no: "Look again at the cans. They all hold the same amount, and the story fills them in a row — that is something repeating." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the tank, the cans, and how much each holds?",
          options: {
            onekind: { yes: "The same amount repeated, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a repeated amount and a question about how many times it goes in, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Equal cans filled in a row is squarely Equal Groups, even though the arithmetic is the hardest on the site." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how much water a single can holds", needed: true },
        { token: "n1", describe: "how much water is in the tank", needed: true },
        { token: "n3", describe: "how many flower beds are along the platform", needed: false }
      ],
      relationship: "Both of these are amounts of water, and that is what makes the problem hard to read: one is the size of a single can and the other is the whole tank. The cans are that same amount taken out of the tank again and again. Notice that a can holds LESS than a litre — so the tank will fill more cans than it holds litres.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many watering cans can be filled from the tank.",
      commonMisreading: "Reading two amounts of water and multiplying them, which describes no amount of anything in the story.",
      options: [
        { text: "How much water a can holds",
          why: "You were handed that. It is the size of a single can, not how many cans there are." },
        { text: "How many cans the tank fills", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How much water is in the tank",
          why: "Also given. It is the whole amount the cans are filled from." },
        { text: "How much water is left in the tank",
          why: "Nothing asks what is left, and in this story the water fills the cans exactly." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "The same amount — a canful — taken out of the tank over and over, with the question asking how many times that goes. That is Equal Groups with the number of groups missing. The amounts being fractions makes the arithmetic hard; it does not change the structure.",
    distractors: [
      { line: "partwhole", whyWrong: "The strongest case against, and the one worth arguing properly: the tank really does get divided up. But Part–Whole needs a whole cut into DIFFERENT named shares that add back to it. Here every share is the same canful, and their being identical is exactly what lets a single division answer the question." },
      { line: "change",    whyWrong: "The other tempting one, because emptying a tank into cans sounds like something happening over time. But no amount in this story ends up different from how it started — you are given a fixed tank and a fixed can size and asked how they fit together, not what the tank holds afterwards." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. Both numbers are amounts of water, which makes them look comparable, but the story is not interested in how much bigger the tank is than a can — it is asking how many cans come out of it." },
      { line: "ratio",     whyWrong: "Tempting, because \"{{n2}} of a litre in every can\" sounds like a fixed pairing. But a ratio pins two DIFFERENT kinds of thing together so scaling one scales the other. Here everything measured is water, and the story asks about a single fixed tank." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many cans the tank fills",
      "how much water a can holds",
      "how much water is in the tank"
    ],
    unknownCarAnswer: "how many cans the tank fills",
    unknownCarWhy: "The story measures a can and it measures the tank. What it never states is how many cans that tank comes to, and that is exactly what the question asks for."
  },

  signalBox: {
    /* GROUPS UNKNOWN and this is the branch that matters most on the site: the
       model draws the tank, ONE can against it, and stops. One can is visibly a
       small slice of the tank, which is what makes "more cans than litres"
       seeable before it is justifiable. Tiling would count the answer out. */
    groupsModel: {
      title: "The same amount, again",
      heading: "One canful, taken out of the tank over and over",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      sizeToken: "n2",
      totalToken: "n1",
      unknownIs: "groups",
      repeater: "size",
      restLabel: "how many more cansful?",
      totalLabel: "litres in the tank",
      questionLabel: "how many cansful that is",
      settledLabel: "so the question is",
      choices: [
        { key: "size",  label: "Water in a can",   said: "{{n2}} of a litre" },
        { key: "total", label: "Water in the tank", said: "{{n1}} litres" }
      ],
      why: "Every can holds the same {{n2}} of a litre, so that is the amount being taken out again and again. The {{n1}} litres are the tank it comes out of — and how many times it comes out is what you are being asked.",
      whyWrong: {
        total: "That is the tank the cansful come OUT of, not the amount being repeated. Both numbers measure water, which is what makes this one hard to read — ask which amount stays the same every time you fill a can."
      },
      a11yDescription: "A bar standing for the {{n1}} litres in the tank, with a single canful of {{n2}} of a litre drawn against its left end and the rest of the bar left open and hatched. The canful is a small slice of the bar, so it is clear that many more of them fit — how many is exactly what the question asks, so the picture does not fill them in.",
      settledSay: "The amount that repeats is what fits in a single group, even when that amount is smaller than one."
    },
    estimate: {
      prompt: "Before calculating — roughly how many watering cans do you think the tank fills?",
      reasonableMin: 4,
      reasonableMax: 9,
      modelReasoning: "Each can holds less than a litre, so every litre in the tank fills MORE than one can. That means the answer has to be bigger than {{n1}} — which is the opposite of what dividing usually feels like, and it is the thing to expect before you calculate.",
      unit: "cans"
    },

    /* Demo on 10 and 3 (§26), missing the TOTAL while this problem is missing
       the number of groups — so the demonstration builds up and the student's
       own picture shares out. Whole tins in the demo on purpose: the direction
       is what is being taught, and a fraction in the demonstration as well would
       teach two things at once on the hardest problem on the site. */
    testTrack: {
      kind: "groups",
      title: "The Test Track",
      heading: "Build it up, or share it out?",
      intro: "A fraction does not change the shape of the story. It is still groups, the size of a group, and what they come to — and which of the three is missing still decides the direction. Watch one.",
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
        wholeLabel: "Your story. Look at how much of the tank a single can takes.",
        groupsUnknown: true,
        sizeLabel: "{{n2}} l",
        unitPct: 17,
        totalLabel: "litres in the tank",
        totalVal: "{{n1}}",
        restLabel: "how many more cansful?",
        q1: "Which amounts does your story already give you?",
        options1: [
          { text: "A canful, and the whole tank", correct: true, marks: "total",
            why: "The story measures what a can holds and it measures the tank. What it never states is how many cans that tank fills." },
          { text: "A canful, and how many cans",
            why: "Read it again — how many cans is what the question asks for. If you had it, there would be nothing to work out." },
          { text: "Only the whole tank",
            why: "The tank is given, that part is right. But so is the size of a can — that is the sentence with \"each\" in it." }
        ],
        settled1: "You have a group, and you have the total it comes out of.",
        q2: "So which way do you travel?",
        options2: [
          { text: "Share the tank out into cansful", correct: true, marks: "share",
            why: "You have the total and the size of a group, so you find how many of that group fit inside it. That is a division — and look at the picture: a can is a small slice of the tank, so a lot of them fit." },
          { text: "Build the total up from the cans", marks: "build",
            why: "You already have the total — it is the water in the tank. Building up is what you do when the total is the thing missing." },
          { text: "Take a canful away from the tank", marks: "share",
            why: "That empties a single can out and tells you what is still in the tank. It does not tell you how many cans it fills." }
        ],
        settled2: "See how many times the group fits inside the total. When the group is smaller than a litre, a lot of them fit."
      },
      law: "Which of the three is missing decides the direction. A fraction changes the arithmetic, not the direction.",
      bridge: "The picture stops at the direction on purpose — actually doing the division is the next stop.",
      a11yDescription: "A demonstration in two trays. First a worked example missing the total: three boxes of ten tins with a bracket underneath carrying a question mark, so you build up. Then your own story, which is the other way round: a bar standing for the tank with a single canful drawn against its end, taking up only a small part of it, and the rest left open — so you share out, and the picture already suggests that many cans will fit. Nothing is counted in either."
    }
  },

  /* THE SIGNAL FAILURE THIS ENTIRE LINE IS BUILT AROUND. Walked into, never
     pointed at: nothing before the Engine Room says a word about it, which is
     the ch-water-tank lesson. The trap is not a word — it is the belief that
     dividing makes things smaller.

     Top-level, because it renders at the Arrivals Board (Phase 4b). It names
     the operation in its first four words, so it can only ever run after the
     student has committed to one. */
  signalFailure: {
    trigger: "bigger",
    prompt: "You divided, and dividing is right. So why is the answer BIGGER than the number of litres you started with?",
    why: "Because each can holds less than a litre. If a can took a whole litre you would get {{n1}} cans; because it takes only {{n2}} of one, every litre stretches to more than a single can. Dividing by a number below 1 makes things bigger — the exact mirror of the bunting, where multiplying by a fraction made things smaller. It still feels wrong, and it is still right."
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many watering cans can be filled from the tank?",
        answer: { exact: "{{ans}}", unit: "cans", acceptedForms: ["{{ans}}", "{{ans}} cans", "{{ans}} watering cans"], preferredForm: "{{ans}}" },
        workedExplanation: "Each can holds {{n2}} of a litre and the tank holds {{n1}} litres. So the question is how many {{n2}}s fit into {{n1}}: {{n1}} ÷ {{n2}} = {{ans}} cans. Check it forwards — {{ans}} cans with {{n2}} of a litre in each comes to exactly {{n1}} litres. And notice what happened: the answer is BIGGER than the number of litres, because every can takes less than a litre.",
        hints: [
          { rung: 1, text: "Look at the picture from the Plan screen. One canful is drawn against the whole tank, and it is a small slice of it. Does the tank fill more cans than it holds litres, or fewer?" },
          { rung: 2, text: "You know the size of a group and you know the total. What is missing is how many groups — a division, the same as the mailbags." },
          { rung: 3, text: "How many {{n2}}s fit into a single litre? {{den}} of them fit into {{num}} litres, so each litre holds more than one canful. Now do that for all {{n1}} litres." },
          { rung: 4, text: "{{n1}} ÷ {{n2}} = ({{n1}} × {{den}}) ÷ {{num}} = {{mDen}} ÷ {{num}} = {{ans}}. The tank fills {{ans}} cans." }
        ],
        misconceptions: [
          { response: "{{mDen}}", diagnosis: "You multiplied by the bottom number and stopped. {{n1}} × {{den}} = {{mDen}} counts how many THIRDS, or quarters, or fifths are in the tank — not how many cans. Each can holds {{num}} of those pieces, so you still have to share {{mDen}} by {{num}}.", tag: "denominator-only" },
          { response: "{{n1}}", diagnosis: "That is the number of litres in the tank, not the number of cans. It would be the answer only if each can held exactly one litre — and each one holds {{n2}} of a litre, so the tank stretches further than that.", tag: "gave-back-the-total" },
          { response: "{{num}}", diagnosis: "That is the top number of the fraction on its own. It is part of the size of a can, not a count of cans.", tag: "gave-back-the-numerator" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "cans", acceptedForms: ["{{ans}}", "{{ans}} cans", "{{ans}} watering cans"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for CANS — how many of them the tank fills. Not the litres, and not what a can holds.",
    unitsCheck: "cans",
    reasonablenessCheck: "{{ans}} cans. Each one takes {{n2}} of a litre, and {{ans}} of them come to exactly {{n1}} litres. And the answer is bigger than {{n1}}, which it has to be, because every can holds less than a litre.",
    reasonablenessFailExample: "If you got {{n1}}, you would be saying each can holds a whole litre — on a story that says each one holds {{n2}} of a litre.",
    connection: "This is the hardest problem on the line and it is the same picture as the very first one. The crates built a total out of equal groups; this takes a total apart into them. What made it hard was not the structure — it was that dividing by a fraction gives you MORE than you started with, exactly as multiplying by one gave you less."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived: 4/(2/3)=6; 6/(3/4)=8; 10/(2/5)=25; 9/(3/4)=12. Every division is exact, so no set leaves a part-filled can. Every can holds less than a litre and every answer exceeds its litre count, which the whole problem depends on. numberChecks avoid the fraction token — parseFloat('2/3') is 2 — and assert n1 x den = ans x num using integers only. The denominator-only value (12, 24, 50, 36) is distinct from the answer and both givens in every set." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "The keystone PEDAGOGY.md §3.3 names, and the ch-water-tank of this line. Deliberately last: it depends on eg-bunting-ribbon having already broken 'multiplying makes things bigger', because this is that belief's mirror. Signal Failure fires on the SIZE of the answer rather than a word, and is not foreshadowed anywhere before the Engine Room. The moments and shape questions carry the most careful copy on the line — a tank emptying into cans is the most legitimate 'this is Change' and 'this is Part-Whole' reading anywhere in this content, and both are argued rather than dismissed." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). THIS IS THE PROBLEM ON THE LINE MOST IN NEED OF A REAL STUDENT: its entire value is whether the surprise lands as a lesson rather than as a reason to distrust the answer. No Test Track, and of the five problems on this line this is the one that most deserves one." }
  }
});
