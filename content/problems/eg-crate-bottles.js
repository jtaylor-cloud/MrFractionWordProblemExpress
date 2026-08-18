/* Equal Groups Express · TOTAL unknown · crates · worked · READING ROOM
   THE FIRST PROBLEM ON THE LINE, and deliberately the gentlest case: the number
   of groups and the size of a group are both given, and the total is what is
   missing. Multiplication works, nothing is inverted, and no keyword is broken.

   WHY THE LINE OPENS HERE. Equal Groups has three quantities and any of them
   can be the unknown, so the line's arc is: build the structure while it is
   safe (this problem), then take each of the other two away in turn, then break
   it with fractions. `PEDAGOGY.md` §3.3 puts fraction division at the end and
   calls it the hardest case in the middle-school curriculum. A student meets it
   here with the picture already familiar.

   THE WORD "EACH" IS ALLOWED TO WORK HERE, and that is on purpose. It is the
   tier-2 word this line runs on — it names the situation and hands you a
   question ("each crate holds the same, so how many crates?"), and on this
   problem following it lands you right. The line takes it away at
   eg-water-cans, where "each" is still true and the operation is a division.
   Same design as ch-lost-property → ch-water-tank and cp-ticket-queues →
   cp-bench-count. A rule that fails the first time it is used teaches nothing.

   THE NEIGHBOUR THIS MUST NOT BE CONFUSED WITH is multiplicative compare
   (cp-parking-spaces), which also lays one amount down several times. The
   difference is what the repeated thing IS: here the crates are separate real
   things and they build a total. There, exactly two things exist and one is
   measured against the other. The Platform Check keys `shape: repeat` to this
   line alone, and cp-parking-spaces argues in the opposite direction — both
   arguments have to stay true, so the `repeat` copy below is written against it.

   FOUR NUMBER SETS. Constraints:
     - both factors stay in the range a student can hold without a written
       method, because the difficulty here is the STRUCTURE, not the arithmetic;
     - the sum of the factors must differ from the product and from both givens,
       so the "added instead of multiplied" misconception diagnoses one mistake;
     - crate counts stay plausible for one porter and one trolley load.

   Verified both ways per set — the multiplication, and both divisions back:
     6 x 12 = 72   (72/6 = 12, 72/12 = 6)    added 18
     8 x 15 = 120  (120/8 = 15, 120/15 = 8)  added 23
     7 x 14 = 98   (98/7 = 14, 98/14 = 7)    added 21
     9 x 11 = 99   (99/9 = 11, 99/11 = 9)    added 20 */
MF.registerProblem({
  id: "eg-crate-bottles",
  schemaVersion: 1,
  status: "published",
  title: "How many bottles are in the crates",
  line: "groups",
  topics: ["total-unknown", "multiplication", "equal-groups"],
  steps: 1,

  unknownCar: "total",
  context: "crates",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  numberChecks: [
    ["n1", "*", "n2", "=", "ans"],
    ["ans", "/", "n1", "=", "n2"],
    ["ans", "/", "n2", "=", "n1"],
    ["n1", "+", "n2", "=", "mAdd"]
  ],

  numberSets: [
    { numbers: { n1: "6", n2: "12", n3: "4" },
      derived: { ans: "72", mAdd: "18" },
      estimate: { min: 50, max: 95 } },
    { numbers: { n1: "8", n2: "15", n3: "3" },
      derived: { ans: "120", mAdd: "23" },
      estimate: { min: 90, max: 150 } },
    { numbers: { n1: "7", n2: "14", n3: "5" },
      derived: { ans: "98", mAdd: "21" },
      estimate: { min: 70, max: 125 } },
    { numbers: { n1: "9", n2: "11", n3: "6" },
      derived: { ans: "99", mAdd: "20" },
      estimate: { min: 70, max: 125 } }
  ],

  problem: {
    /* RICHER WORDS, NOT MORE OF THEM. The story text is deliberately concrete
       and sensory — THEME §3.1.5 exempts problem text from the reading-level
       cap that binds our scaffolding — but AUTHORING.md sets the real limit:
       if the vocabulary is the obstacle, you are testing reading and not
       reasoning. So the adjectives are everyday and picturable (battered,
       rattling, rolled-up), never literary, and the word count is held near
       where it was, because "less reading" is a standing instruction too.

       THE SENTENCE COUNT MAY NOT CHANGE. `platformCheck.sentences` indexes into
       this array, and so does questionSentenceIndex — add or remove a sentence
       and the Platform Check silently marks the wrong evidence. */
    text: "The goods platform at Thorne Bridge smells of engine oil and wet rope, and the bottled water leaves in wooden crates. Each battered crate holds exactly {{n2}} bottles. {{n3}} empty trolleys rattle in the draught by the wall. A porter in rolled-up shirtsleeves heaves {{n1}} crates onto the waiting train. How many bottles does the porter load?",
    sentences: [
      "The goods platform at Thorne Bridge smells of engine oil and wet rope, and the bottled water leaves in wooden crates.",
      "Each battered crate holds exactly {{n2}} bottles.",
      "{{n3}} empty trolleys rattle in the draught by the wall.",
      "A porter in rolled-up shirtsleeves heaves {{n1}} crates onto the waiting train.",
      "How many bottles does the porter load?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n2: { value: "12", unit: "bottles", role: "size",       spoken: "12" },
      n3: { value: "4",  unit: "trolleys", role: "distractor", spoken: "4" },
      n1: { value: "6",  unit: "crates",  role: "groups",     spoken: "6" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  /* THREE quantities can be the answer on this line, so the scene keeps all
     three off the screen: the crates run off both edges of the frame, and what
     is inside one is drawn as a mass rather than as bottles. Resolve the
     contents into countable items and the group size is on the page. */
  scene: {
    mode: "anim", art: "crates",
    caption: "Crates of bottled water along the goods platform, running away past both ends of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A porter is loading crates onto a train. Every crate has the same number of bottles in it, and we are told how many crates go on, so we can work out how many bottles that is.",
      platformCheck: {
        sentences: [1, 3],
        /* NOTE FOR THE REST OF THIS LINE: the word "one" is a number word, and
           the Platform Check screens ban those — but this schema is *about* one
           group, so "one crate", "one after another" and "every one of them"
           all want to appear and all fail the validator. Say "a crate", "in a
           row", "they all". Six of these were caught on this problem alone. */
        why: "Between them those sentences give the size of a crate and how many crates go on the train. Notice what is missing: nothing states how many bottles that comes to, and that is what the question wants.",
        kinds: "Everything counted here is bottles, held in crates."
      },

      questions: {
        kinds: {
          ask: "This story counts bottles and crates, and it also counts the trolleys on the platform. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Crates are just how the bottles are held. Everything being counted is bottles.",
                         no:  "That would mean bottles and trolleys were pinned to each other, so that loading a bottle produced a trolley. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the bottles scaled with the trolleys. How many trolleys are waiting says nothing about how full a crate is." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "The crates are being moved, but no crate gains or loses a bottle. Moving something is not changing it.", no: "" },
            changed: { yes: "", no: "Tempting, because the crates are going onto a train and that feels like something happening. But look for an AMOUNT that ends up different — no crate is filled or emptied, and the number of bottles in each stays exactly what it was." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single thing, or separate things held up against each other?",
          options: {
            single:   { yes: "A single load of crates, all alike, and the story is asking what it comes to.", no: "" },
            separate: { yes: "", no: "That would mean amounts set side by side and measured against each other, with the story interested in the gap between them. Nothing here is being compared to anything." },
            paired:   { yes: "", no: "That would mean a fixed pairing you could scale to any size. The story gives a set number of crates, not a rule about crates in general." }
          }
        },
        shape: {
          /* Keyed `repeat`, and this is the FIRST content on the site where
             that is the right answer. Its `no` copy for `cut` has to hold
             against Part–Whole, and the whole option has to stay arguable in
             the opposite direction from cp-parking-spaces. */
          ask: "Is anything being cut up, or repeated?",
          options: {
            repeat:  { yes: "The same crate-load, over and over. You could act it out: load a crate, then another the same, then another.", no: "" },
            cut:     { yes: "", no: "That would mean a whole thing divided into shares that add back up to it. Nothing here starts as a whole and gets carved — the load is BUILT by putting equal crates together." },
            neither: { yes: "", no: "Look again at the crates. They all hold the same amount, and the story lays them down in a row — that is something repeating." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the crates, what is in them, and what the porter loads?",
          options: {
            onekind: { yes: "The same amount repeated, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a repeated amount and a question about what it comes to, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Equal crates loaded in a row is squarely Equal Groups." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many bottles are in one crate", needed: true },
        { token: "n3", describe: "how many trolleys are waiting on the platform", needed: false },
        { token: "n1", describe: "how many crates the porter loads", needed: true }
      ],
      relationship: "One of these is the size of a single crate and the other is how many of those crates go on the train. The load is that one crate-load, laid down again and again. The trolleys are standing on the platform and hold nothing in this story.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many bottles the porter loads altogether.",
      commonMisreading: "Answering with the number of crates, which the story already gives you.",
      options: [
        { text: "How many bottles are in one crate",
          why: "You were handed that. It is the size of a single crate, not the whole load." },
        { text: "The bottles the porter loads", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many crates go on the train",
          why: "Also given. It is how many crate-loads there are, not how many bottles that comes to." },
        { text: "How many trolleys are on the platform",
          why: "Given, and nothing to do with the question. The trolleys hold no bottles in this story." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "The same amount — one crate-load — laid down over and over, with the question asking what they come to. That is Equal Groups, and it is the line where the total is BUILT out of equal pieces rather than cut into them.",
    distractors: [
      { line: "partwhole", whyWrong: "The closest one to argue for, because the load does divide into crates. But Part–Whole starts with a named whole and cuts it into shares — here the whole is what you are being ASKED for, and it gets built by putting equal crates together. The direction is the opposite one." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. Compare needs two amounts side by side with the story interested in the gap between them, and here there is one load of identical crates." },
      { line: "change",    whyWrong: "Nothing is added to or taken from any crate. The crates move onto a train, but moving something does not change how much of it there is — no amount in this story ends up different from how it started." },
      { line: "ratio",     whyWrong: "Tempting, because \"{{n2}} bottles in every crate\" does sound like a fixed pairing. But a ratio pins two DIFFERENT kinds of thing together so that scaling one scales the other. Here crates are only the container — everything counted is bottles, and the story asks for a single fixed total, not a rule you could apply to any number of crates." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many bottles the porter loads",
      "how many bottles are in one crate",
      "how many crates go on the train"
    ],
    unknownCarAnswer: "how many bottles the porter loads",
    unknownCarWhy: "The story counts one crate and it counts the crates. What it never states is what those two come to together, and that is exactly what the question asks for."
  },

  signalBox: {
    /* TOTAL UNKNOWN, so the tray may show all the crates: how many there are is
       a value the story states outright. What it must not do is total them —
       the bracket carries "?" and the multiplication is the Engine Room's.
       Contrast eg-water-cans, where the number of groups IS the answer and the
       model refuses to tile at all. */
    groupsModel: {
      title: "The same amount, again",
      heading: "One crate-load, laid down over and over",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      groupsToken: "n1",
      sizeToken: "n2",
      unknownIs: "total",
      repeater: "size",
      totalLabel: "on the train",
      questionLabel: "how many bottles that comes to",
      settledLabel: "so the question is",
      choices: [
        { key: "size",   label: "Bottles in one crate", said: "{{n2}}" },
        { key: "groups", label: "Crates on the train",  said: "{{n1}}" }
      ],
      why: "Every crate holds the same {{n2}} bottles, so that is the amount being laid down again and again. The {{n1}} crates are how MANY times you lay it down — they are the count, not the amount.",
      whyWrong: {
        groups: "That is how many times the amount repeats, not the amount itself. Ask which number you could load onto the train over and over without it changing: it is what is inside one crate."
      },
      a11yDescription: "A tray of {{n1}} identical boxes, each one labelled {{n2}} bottles, with a bracket underneath spanning all of them. The bracket carries a question mark, because what they come to is what the question asks.",
      settledSay: "The amount that repeats is what is inside one group. How many groups there are is the other number."
    },
    estimate: {
      prompt: "Before calculating — roughly how many bottles do you think that is?",
      reasonableMin: 50,
      reasonableMax: 95,
      modelReasoning: "There are {{n1}} crates and each holds {{n2}}. Round {{n2}} to the nearest ten and multiply in your head — that gets you close enough to know whether an answer is sensible.",
      unit: "bottles"
    },

    /* THE TEST TRACK. This problem shipped without one, on the reasoning that
       the Plan phase had already drawn the crates so a demonstration would be
       the same picture twice. A user rode it and went from the estimate straight
       to the arithmetic with nothing interactive in between — which is exactly
       the gap the handoff already lists on six other problems. The argument was
       restraint dressed up as judgement.

       The demo runs on 10 and 30, which belong to no problem or number set on
       this line (VERIFICATION.md §26), and it is deliberately the OPPOSITE shape
       to this problem: it is missing the number of GROUPS, so the demonstration
       shares out while the student's own picture builds up. Nothing is
       calculated in either. */
    testTrack: {
      kind: "groups",
      title: "The Test Track",
      heading: "Build it up, or share it out?",
      intro: "Every problem on this line is groups, the size of a group, and what they come to. Which way you travel depends on WHICH of the three the story leaves out — never on the words it uses. Watch one.",
      worked: {
        label: "A story missing the NUMBER OF GROUPS. The size of a group and the total are both given.",
        button: "Show me",
        groupsUnknown: true,
        sizeLabel: "10 tins",
        unitPct: 33,
        totalLabel: "in the crate",
        totalVal: "30 tins",
        restLabel: "how many more boxes of 10?",
        sayCut: "A box holds 10 tins, and the crate holds 30 altogether.",
        sayTake: "The total is the thing you already have, so you SHARE IT OUT into boxes. Notice the picture stops there — it does not count them for you."
      },
      yours: {
        wholeLabel: "Your story. Look at which box is empty before you decide anything.",
        groups: "{{n1}}",
        sizeLabel: "{{n2}} bottles",
        totalLabel: "on the train",
        totalVal: "?",
        q1: "Which amounts does your story already give you?",
        options1: [
          { text: "A crate-load, and how many crates", correct: true, marks: "group",
            why: "The story counts what is in a crate and it counts the crates. What it never states is what they come to." },
          { text: "The whole load, and how many crates",
            why: "Read it again — the whole load is what the question asks for. If you had it, there would be nothing to work out." },
          { text: "Only how many crates there are",
            why: "The crates are given, that part is right. But so is what one holds — that is the sentence with \"each\" in it." }
        ],
        settled1: "You have a group, and you know how many of them.",
        q2: "So which way do you travel?",
        options2: [
          { text: "Build the total up from the crates", correct: true, marks: "build",
            why: "You have a group and a count of groups, so you lay the group down that many times. That is a multiplication." },
          { text: "Share the total out into crates", marks: "share",
            why: "You would need the total to share it, and the total is the thing you are looking for. Sharing out is what you do on the problems where the total is given." },
          { text: "Take the crates away from the bottles", marks: "build",
            why: "Those count different things — crates and bottles — so taking one from the other describes nothing in the story." }
        ],
        settled2: "Lay the group down as many times as the story says, and that is the total."
      },
      law: "Which of the three is missing decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the multiplication is the next stop.",
      a11yDescription: "A demonstration in two trays. First a worked example missing the number of groups: a box of ten tins drawn against a crate of thirty, with the rest of the crate left open, so you share the total out. Then your own story, which is the other way round: a tray with a box for every crate, each labelled with what a crate holds, and a bracket underneath carrying a question mark — so you build the total up. Nothing is counted in either picture."
    }
  },

  /* Deliberately null, and it has to stay that way: this is the problem where
     "each" is allowed to SUCCEED. eg-mail-sacks then inverts the move with the
     same word in every sentence, and its own Signal Failure only lands because
     nothing here warned the student that "each" was worth distrusting.
     Top-level, matching every other problem — see cp-bench-count's note. */
  signalFailure: null,

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "How many bottles does the porter load?",
        answer: { exact: "{{ans}}", unit: "bottles", acceptedForms: ["{{ans}}", "{{ans}} bottles"], preferredForm: "{{ans}}" },
        workedExplanation: "Each crate holds {{n2}} bottles and there are {{n1}} crates, so the load is {{n2}} laid down {{n1}} times: {{n1}} × {{n2}} = {{ans}} bottles. Check it backwards — split {{ans}} into {{n1}} equal crates and each one holds {{n2}}, exactly as the story says.",
        hints: [
          { rung: 1, text: "Look at the picture from the Plan screen. How many boxes are there, and what is written inside each one?" },
          { rung: 2, text: "The same amount, {{n1}} times over. That is a multiplication, not an addition — adding would give you one crate plus a count of crates, which is not a number of anything." },
          { rung: 3, text: "{{n1}} crates × {{n2}} bottles in each = ___" },
          { rung: 4, text: "{{n1}} × {{n2}} = {{ans}}. The porter loads {{ans}} bottles." }
        ],
        misconceptions: [
          { response: "{{mAdd}}", diagnosis: "You added the two numbers. But {{n1}} is a count of CRATES and {{n2}} is a count of BOTTLES — adding them gives a number that is not a quantity of anything in the story. What you want is {{n2}} bottles, {{n1}} separate times.", tag: "added-instead-of-multiplied" },
          { response: "{{n2}}", diagnosis: "That is what ONE crate holds, which the story gives you. The porter loads {{n1}} of them, so the answer has to be {{n1}} times that big.", tag: "gave-back-the-group-size" },
          { response: "{{n1}}", diagnosis: "That is how many crates go on the train, not how many bottles. Each of those crates has {{n2}} bottles inside it.", tag: "gave-back-the-group-count" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "bottles", acceptedForms: ["{{ans}}", "{{ans}} bottles"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for BOTTLES — the whole load. Not the crates, and not what one crate holds.",
    unitsCheck: "bottles",
    reasonablenessCheck: "{{ans}} bottles. Split that into {{n1}} equal crates and each holds {{n2}}, which is exactly what the story says a crate holds. And it is much bigger than {{n2}}, which it has to be, because there are {{n1}} crates and not one.",
    reasonablenessFailExample: "If you got {{mAdd}}, that would be barely more than a single crate — on a story where {{n1}} crates go onto the train.",
    connection: "This is the shape the whole line is built on: one amount, laid down again and again. Here you were told both how big the amount was and how many times it repeated, so you could build the total. The next problems take one of those two away."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived and checked all three ways: 6x12=72 (72/6=12, 72/12=6); 8x15=120 (120/8=15, 120/15=8); 7x14=98 (98/7=14, 98/14=7); 9x11=99 (99/9=11, 99/11=9). The added-instead-of-multiplied value (18, 23, 21, 20) is distinct from the product, from both factors and from the distractor in every set. numberChecks assert the product and both divisions back, so a set cannot drift from its own picture." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "Opens the line on the safe case: both factors given, multiplication works, no keyword broken. 'Each' is allowed to succeed here and is taken away at the fraction-division problem, matching the ch-lost-property/ch-water-tank and cp-ticket-queues/cp-bench-count arcs. The shape question is the first content on the site where `repeat` is the correct Platform Check answer, and its copy is written to stay arguable in the opposite direction from cp-parking-spaces, which argues that multiplicative compare is NOT a repeat. Read 3 distractor placed mid-list. No Test Track, deliberately — reasoning recorded in the manifest beside the estimate." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). First problem on a new line, so it is also the first test of groups-model.js and groups-scenes.js against real content — expect it to shake out engine defects, which is VERIFICATION.md §24 and has held for every line so far." }
  }
});
