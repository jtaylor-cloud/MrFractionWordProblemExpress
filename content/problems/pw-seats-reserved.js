/* The Part–Whole Loop · PERCENT SURFACE · percent of a whole · the OTHER part
   unknown · seats · partial · DRAFTING TABLE

   THE STRAIGHTFORWARD PERCENT, AND IT IS NOT AS STRAIGHTFORWARD AS IT LOOKS.
   ROADMAP.md §3 lists this one's trap as "—", and taken as "what is 35% of 240"
   that is fair: it is the case percent is easiest in. So the question does not
   ask for the percentage's own share. It asks for the OTHER one.

   That is this line's own crux rather than an extra difficulty bolted on.
   Part–Whole is the only line where naming the part you were GIVEN and naming
   the part you WANT are different acts, and the site already turns on it —
   `pw-free-throws` runs its fraction backwards so the shaded sections are what
   you are given and the whole is the unknown. Here the percentage describes the
   reserved seats and the question wants the empty ones, so a student who
   computes correctly and stops has the wrong answer with the right arithmetic.
   It is diagnosed by name at step two.

   WHY THE PICTURE IS THE NUMBER LINE AND NOT THE UNIT GRID. Every other
   Part–Whole problem draws `scene.mode: "unit"` — one whole cut into its own
   denominator. That grid derives itself from `barModel.bars[0].segments`, and a
   percent problem has no bar model, because `surface: "percent"` hands the Plan
   phase to the double number line. So this problem needed the line's first
   bespoke `anim` scene, and `assets/js/partwhole-scenes.js` is that file.

   THE SCENE HAD TO BE DESIGNED AROUND THE ANSWER. The seats ARE the quantity,
   so the drawing may not be tallyable — and the obvious version, a reservation
   card on some seats, makes the RESERVED count tallyable, which is step one's
   answer sitting on the screen. The slips are in the guard's hand instead. Full
   measurement in that file's header.

   FOUR NUMBER SETS. Constraints:
     - the percentage must be a whole number of twentieths, so the Test Track's
       bar cuts on a boundary and every piece is a whole number of seats;
     - the whole must divide by twenty for the same reason;
     - the reserved seats, the empty seats, the whole, and the percent-as-count
       value must all differ, so each diagnosis lands on exactly one mistake;
     - a carriage's worth of seats stays in the low hundreds, which is a real
       commuter train rather than a stadium.

   Verified per set — the share, the rest, and the two adding back to the whole:
     35% of 240 = 84   240 - 84 = 156   (84 + 156 = 240)   as-a-count 240 - 35 = 205
     40% of 180 = 72   180 - 72 = 108   (72 + 108 = 180)   as-a-count 180 - 40 = 140
     45% of 200 = 90   200 - 90 = 110   (90 + 110 = 200)   as-a-count 200 - 45 = 155
     25% of 160 = 40   160 - 40 = 120   (40 + 120 = 160)   as-a-count 160 - 25 = 135 */
MF.registerProblem({
  id: "pw-seats-reserved",
  schemaVersion: 1,
  status: "published",
  title: "How many seats anyone can sit in",
  line: "partwhole",
  topics: ["percent", "percent-of-a-whole", "part-unknown", "two-step"],
  steps: 2,

  surface: "percent",

  unknownCar: "part",
  context: "seats",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "reading"],
  hubStrategyNote: "The arithmetic is a single percentage and then a single subtraction. What decides whether a student gets it right is drawing the whole and seeing that the percentage describes one part while the question asks for the other — which is a picture problem, not a calculation problem.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-10" },

  numberChecks: [
    ["rate", "*", "100", "=", "n2"],
    ["n1", "*", "rate", "=", "reserved"],
    ["n1", "-", "reserved", "=", "free"],
    ["reserved", "+", "free", "=", "n1"],
    ["n1", "-", "n2", "=", "mCount"],
    ["n2", "/", "5", "=", "taken"],
    ["taken", "*", "5", "=", "n2"]
  ],

  numberSets: [
    { numbers: { n1: "240", n2: "35", n3: "4" },
      derived: { rate: "0.35", reserved: "84", free: "156", mCount: "205", taken: "7" },
      estimate: { min: 130, max: 180 } },
    { numbers: { n1: "180", n2: "40", n3: "6" },
      derived: { rate: "0.4", reserved: "72", free: "108", mCount: "140", taken: "8" },
      estimate: { min: 90, max: 130 } },
    { numbers: { n1: "200", n2: "45", n3: "5" },
      derived: { rate: "0.45", reserved: "90", free: "110", mCount: "155", taken: "9" },
      estimate: { min: 92, max: 132 } },
    { numbers: { n1: "160", n2: "25", n3: "7" },
      derived: { rate: "0.25", reserved: "40", free: "120", mCount: "135", taken: "5" },
      estimate: { min: 100, max: 140 } }
  ],

  problem: {
    /* NO NUMBER WORDS IN THE STORY EITHER. This train was "the Marsden train",
       which is a time and could not be mistaken for a count of seats — but the
       first read is numberless and the discipline is not to argue the edge
       cases. It cost nothing to rename it. */
    text: "The Marsden train is a tired old thing with worn velvet seats and a guard who knows everybody. It has {{n1}} seats altogether. On a Friday {{n2}} per cent of them are reserved before it even leaves. The train is made up of {{n3}} carriages. How many seats are there that anybody can sit in?",
    sentences: [
      "The Marsden train is a tired old thing with worn velvet seats and a guard who knows everybody.",
      "It has {{n1}} seats altogether.",
      "On a Friday {{n2}} per cent of them are reserved before it even leaves.",
      "The train is made up of {{n3}} carriages.",
      "How many seats are there that anybody can sit in?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "240", unit: "seats",     role: "whole",      spoken: "240" },
      n2: { value: "35",  unit: "per cent",  role: "percent",    spoken: "35 per cent" },
      n3: { value: "4",   unit: "carriages", role: "distractor", spoken: "4" }
    },
    context: { setting: "commuter train", requiresCulturalKnowledge: false }
  },

  /* The seats ARE the quantity, so the drawing may not be tallyable — and the
     reserved ones may not be markable, because that is step one's answer. Seat
     backs overlap by ten at a pitch of twenty-four and run off both edges; the
     reservation slips are in the guard's hand rather than on any seat. Measured
     in `partwhole-scenes.js`. */
  scene: {
    mode: "anim", art: "seats",
    caption: "The eight-fifteen before it leaves: a row of worn seat backs running away past both edges of the picture, straps swinging overhead, and the guard in the aisle with a fan of reservation slips.",
    authored: "generated"
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A train has a certain number of seats. A percentage of those seats is reserved, and the rest are not. We want to know how many are not reserved.",
      platformCheck: {
        sentences: [1, 2],
        why: "Between them those sentences give the whole trainful of seats and the share of it that is spoken for. The seats divide into a part and a rest, and those pieces together are the trainful.",
        kinds: "Everything counted here is a seat on the same train."
      },

      questions: {
        kinds: {
          ask: "This story counts seats, and it also counts carriages. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Everything the question is about is seats on the same train &mdash; the reserved ones and the rest.",
                         no:  "That would mean the seats and the carriages were pinned to each other, so that reserving a seat added a carriage. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the seats scaled with the carriages. How the train is made up says nothing about how much of it is spoken for." }
          }
        },
        moments: {
          ask: "Does the number of seats, or the number reserved, end up different from how it started?",
          options: {
            steady:  { yes: "The train has the seats it has, and a share of them is already spoken for. The story never changes either &mdash; it describes them at a single moment, before the train leaves.", no: "" },
            changed: { yes: "", no: "Worth thinking about, because reserving really is something happening. But the story does not show it happening: it hands you a train with a share already reserved and asks about the rest." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; a single trainful, or separate things held up against each other?",
          options: {
            single:   { yes: "A single trainful of seats, described as a share and the rest of itself. Both parts are the same seats.", no: "" },
            separate: { yes: "", no: "That would mean a second train, counted alongside so you could measure the gap between them. The reserved seats are not a separate thing from the trainful &mdash; they are some of it." },
            paired:   { yes: "", no: "That would mean seats pinned to something else and dragged along by it. Nothing here moves with anything." }
          }
        },
        shape: {
          ask: "Is the trainful being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            cut:     { yes: "The seats divide into the reserved ones and the rest, and those pieces add back up to the whole trainful. That is a whole being cut into parts.", no: "" },
            repeat:  { yes: "", no: "That would mean the same amount of seats again and again, with the question counting how many. There is a single trainful here, divided up." },
            neither: { yes: "", no: "The closest call on this screen, because nothing is physically being cut. But a share and its rest that add back to a named total is exactly what cutting into parts means here." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the trainful, the share reserved, and the rest?",
          options: {
            onekind: { yes: "A whole, a part of it, and what is left. The same kind of situation the whole way through &mdash; the part just happens to be described in per cent.", no: "" },
            stacked: { yes: "", no: "Worth asking every time, and per cent does feel like a second idea on top. But it is only how the share is written. Say the same share in seats instead and nothing about the shape of the story moves." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A trainful divided into a reserved share and a rest is squarely the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many seats the train has altogether", needed: true },
        { token: "n3", describe: "how many carriages the train is made up of", needed: false },
        { token: "n2", describe: "the share of the seats that is reserved, as a percentage", needed: true }
      ],
      relationship: "One of these is a count of seats and the other is not a count of anything &mdash; it is a percentage, and a percentage is always a percentage OF something. Here it is of the whole trainful, which is the amount the word \"them\" points back to. The carriages seat nobody by themselves.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many seats are not reserved.",
      commonMisreading: "Working out the reserved seats correctly and handing that number in &mdash; the arithmetic is right and it answers the other half of the question.",
      options: [
        { text: "How many seats the train has altogether",
          why: "You were told that outright. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "How many seats anybody can sit in", correct: true,
          why: "The seats that are NOT reserved. The story describes the reserved share; the question asks for the rest of the trainful." },
        { text: "The share of the seats that is reserved, as a percentage",
          why: "Also given. That is how big the reserved part is, written in per cent, not a count of seats." },
        { text: "How many of the seats are reserved before the train leaves",
          why: "The closest wrong answer on this problem, and worth being careful about. You do have to work it out on the way &mdash; but it is the part the story DESCRIBES, and the question asks for the other one." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "A whole trainful of seats, split into the reserved ones and the rest, and those two add back up to the trainful. A named whole cut into parts is the Part&ndash;Whole Loop &mdash; the cut here is described in per cent, which changes the arithmetic and not the line.",
    distractors: [
      { line: "ratio",     whyWrong: "The strongest case against, because a percentage does hold at any size &mdash; that is what makes it a percentage, and a bigger train would have proportionally more reserved. But a ratio pins two DIFFERENT kinds of thing together, like miles and hours. Here both parts are seats on one train, and nothing is being scaled to anything." },
      { line: "compare",   whyWrong: "You are not being asked how much bigger one thing is than another. The reserved seats and the free seats are not rivals set side by side &mdash; they are two pieces of the same trainful, and adding them gives you the train back." },
      { line: "change",    whyWrong: "Nothing ends up different from how it started. Reserving sounds like something happening, but the story does not show it happening: it hands you a train with a share already spoken for and asks about the rest, at one moment." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and this is a single trainful divided once." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many seats are free",
      "how many seats the train has",
      "the share that is reserved"
    ],
    unknownCarAnswer: "how many seats are free",
    unknownCarWhy: "The trainful is counted outright and the reserved share is given as a percentage. The seats anybody can sit in are never stated, and that is what the last sentence asks for."
  },

  signalBox: {
    /* PERCENT OF A WHOLE IS THE MODEL'S PLAINEST SHAPE: `unknownIs: "part"`
       with the mark INSIDE the hundred. The trainful is the whole hundred per
       cent and the reserved share is a mark part way along, carrying "?"
       because what that share comes to in seats is the Engine Room's.

       Note what the picture deliberately does NOT show: the REST. The question
       asks for the other part, and drawing it would be the answer. The line
       stops where the given stops, which is the same rule every model here
       follows. */
    percentLine: {
      title: "Per hundred",
      heading: "Which amount is the whole hundred per cent?",
      prompt: "The percentage is a percentage OF one of these. Tap the one it is taken from.",
      wholeToken: "n1",
      percentToken: "n2",
      unknownIs: "part",
      base: "train",
      questionLabel: "how many seats that {{n2}}% is worth",
      settledLabel: "so the question is",
      choices: [
        { key: "train", label: "Every seat on the train", said: "{{n1}}" },
        { key: "free",  label: "The seats nobody has reserved", said: "?" }
      ],
      why: "\"{{n2}} per cent of THEM\" &mdash; and \"them\" is the {{n1}} seats the train has. So the trainful is the whole hundred per cent, and the reserved share is a mark part way along it.",
      whyWrong: {
        free: "The free seats are what you are trying to find, so a percentage of them is not something you could work out yet &mdash; and it is not what the sentence says. Follow the word \"them\" back and see which amount it points at."
      },
      a11yDescription: "A double number line. Along the bottom: nought per cent at the left, a mark at {{n2}} per cent part way along, and a hundred per cent at the right-hand end. Along the top the same three points counted in seats: nought, a question mark at the {{n2}} per cent mark, and {{n1}} seats at the hundred per cent. The two lines share one axis, so the reserved share and the number of seats it is worth sit at the same place. The seats that are left over are deliberately not drawn &mdash; they are what the question asks for.",
      settledSay: "Whatever the percentage is taken OF is the whole hundred per cent."
    },

    estimate: {
      prompt: "Before calculating &mdash; roughly how many seats do you think anybody can sit in?",
      reasonableMin: 130,
      reasonableMax: 180,
      modelReasoning: "Rather less than half the train is reserved, so rather more than half of it is free &mdash; that already puts the answer above {{n1}} halved. Find a tenth of {{n1}} in your head and count up from there.",
      unit: "seats"
    },

    /* THE TEST TRACK IS `section`, WHICH THIS LINE OWNS, and it is doing the
       job it was built for: cutting a whole by its own percentage and stopping.
       Nothing is calculated — the two counts on screen are how many pieces the
       whole cuts into and how many of them the story describes, and both of
       those are read straight off the percentage.

       TWENTY PIECES, NOT TEN. A tenth cannot hold thirty-five per cent, and
       choosing the piece size so that both amounts land on a boundary IS the
       move this screen teaches. The worked example cuts differently again, so
       the two questions underneath cannot be answered by copying it. */
    testTrack: {
      kind: "section",
      title: "The Test Track",
      heading: "Cutting a whole by a percentage",
      intro: "A percentage tells you how to cut a whole and how much of it to take &mdash; but only once you have chosen pieces small enough that the percentage lands on a boundary. Watch one first.",
      worked: {
        label: "Any whole at all &mdash; a field, a jar, a trainful.",
        button: "Show me",
        parts: 6, take: 4,
        sayCut: "Cut the whole into equal pieces. Six of them here, chosen so the share in the story lands on a boundary rather than halfway across a piece.",
        sayTake: "Then hold the pieces the story describes &mdash; four of the six. Nothing has been calculated. The bar has been cut and part of it marked, and that is everything this screen ever does."
      },
      yours: {
        wholeLabel: "Your whole: every seat on the Marsden train.",
        q1: "Your share is {{n2}} per cent. How many equal pieces does the trainful need to cut into, so that share lands on a boundary?",
        options1: [
          { text: "20", correct: true,
            why: "Twenty pieces makes each one five per cent, and every share in this problem is a whole number of fives &mdash; so {{n2}} per cent lands exactly on a boundary." },
          { text: "10",
            why: "Ten pieces makes each one ten per cent, and {{n2}} per cent does not land on a boundary of those &mdash; you would be holding part of a piece, which is not something you can point at." },
          { text: "100",
            why: "It would work, and it is literally what per cent means &mdash; a hundred pieces, one for each per cent. But a hundred pieces is not a picture you can use. Twenty is the biggest piece that still lands on a boundary." }
        ],
        settled1: "Twenty pieces. Each one is five per cent of the trainful.",
        q2: "So how many of those twenty pieces are the reserved seats?",
        options2: [
          { text: "{{taken}}", correct: true,
            why: "Each piece is five per cent, and {{n2}} per cent is that many fives. Those are the reserved seats; the pieces left over are the ones anybody can sit in." },
          { text: "20",
            why: "That is the whole trainful. If every piece were reserved there would be nothing left to sit in, and the question would have no answer." },
          { text: "10",
            why: "Ten pieces would be half the train, and {{n2}} per cent is not half. Count the fives in {{n2}} instead of guessing at the middle." }
        ],
        settled2: "Those pieces are the reserved seats. What the question wants is the ones left over."
      },
      law: "A percentage says how to cut the whole and how much of it to take. Choose pieces small enough that the share lands on a boundary.",
      bridge: "The bar is cut and the reserved share is marked. What one piece is worth in seats &mdash; and what the pieces left over come to &mdash; is the Engine Room's question.",
      a11yDescription: "A demonstration about cutting a whole by a percentage, using no arithmetic. First a plain bar stands for any whole at all: it is cut into six equal pieces and four of them are shaded. Then the same is done to your own story. The trainful cuts into twenty equal pieces, each one five per cent, because every share in this problem is a whole number of fives. The pieces standing for {{n2}} per cent are shaded &mdash; those are the reserved seats &mdash; and the ones left unshaded are what the question is asking for. Nothing is worked out here; what a piece is worth in seats is the next question, in the Engine Room."
    }
  },

  /* Top-level, not inside signalBox: it renders at the Arrivals Board after the
     solve, and its text names the trap outright. */
  signalFailure: {
    trigger: "of them",
    prompt: "You worked out the reserved seats correctly. Why is that not the answer?",
    why: "Because the story describes one part and the question asks for the other. \"{{n2}} per cent of them are reserved\" tells you about the seats you cannot have; \"how many can anybody sit in\" asks about the rest of the train. On this line the arithmetic being right is only half of it &mdash; you have to finish by naming which part you were asked for."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many of the seats are reserved?",
        answer: { exact: "{{reserved}}", unit: "seats", acceptedForms: ["{{reserved}}", "{{reserved}} seats"], preferredForm: "{{reserved}}" },
        workedExplanation: "The reserved share is {{n2}} per cent of the whole trainful, because that is what \"them\" points back to. {{n2}} per cent of {{n1}} is {{reserved}}, so {{reserved}} seats are spoken for.",
        hints: [
          { rung: 1, type: "whistle",  text: "The percentage is a percentage of something. Read the sentence again and find what the word \"them\" is pointing at." },
          { rung: 2, type: "signal",   text: "So you want {{n2}} per cent of {{n1}}. A tenth of {{n1}} is easy to find; build the percentage you need from tenths and halves of tenths." },
          { rung: 3, type: "coupling", text: "{{n2}}% of {{n1}} = ___ seats" },
          { rung: 4, type: "route",    text: "{{n2}}% of {{n1}} = {{reserved}}. That is how many seats are reserved." }
        ],
        misconceptions: [
          { response: "{{n2}}", diagnosis: "You gave back the percentage itself. {{n2}} per cent is not {{n2}} seats &mdash; it is a share of the trainful, and you have to work out how big that share is before it is a number of seats.", tag: "percent-as-count" },
          { response: "{{free}}", diagnosis: "That is where you are heading, and it is the answer to the whole problem &mdash; but this step asks for the RESERVED seats, which is the part you have to find first.", tag: "jumped-to-the-answer" }
        ]
      },
      {
        id: "s2",
        prompt: "So how many seats are there that anybody can sit in?",
        answer: { exact: "{{free}}", unit: "seats", acceptedForms: ["{{free}}", "{{free}} seats"], preferredForm: "{{free}}" },
        workedExplanation: "The free seats are the whole trainful with the reserved ones taken out: {{n1}} &minus; {{reserved}} = {{free}}. Check it by adding the two parts back together &mdash; {{reserved}} + {{free}} = {{n1}}, the trainful exactly.",
        hints: [
          { rung: 1, type: "whistle",  text: "You know the whole trainful, and you have just worked out the part that is spoken for. What is left?" },
          { rung: 2, type: "signal",   text: "Take the reserved seats out of the trainful. On the Test Track picture, it is the pieces you did NOT shade." },
          { rung: 3, type: "coupling", text: "{{n1}} &minus; {{reserved}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} &minus; {{reserved}} = {{free}}. There are {{free}} seats anybody can sit in." }
        ],
        misconceptions: [
          { response: "{{reserved}}", diagnosis: "That is the reserved seats, which you worked out at the last step &mdash; and the arithmetic was right. This is the trap this problem is built around: the story describes one part and the question asks for the other. Take these out of the trainful to get the ones anybody can sit in.", tag: "answered-the-wrong-part" },
          { response: "{{mCount}}", diagnosis: "You took {{n2}} seats off the trainful. {{n2}} per cent is not {{n2}} seats &mdash; it is a share, and a share is not a number of anything until you say what it is a share OF.", tag: "percent-as-count" },
          { response: "{{n1}}", diagnosis: "That is the whole trainful, reserved seats and all. Some of them are spoken for, so the answer has to come out below {{n1}}.", tag: "returned-given-value" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{free}}", unit: "seats", acceptedForms: ["{{free}}", "{{free}} seats"], preferredForm: "{{free}} seats" },
    questionCheck: "The question asked for the seats anybody can sit in &mdash; the ones that are NOT reserved. If you answered {{reserved}}, you found the reserved seats, which is the part the story describes rather than the part it asks for.",
    unitsCheck: "seats",
    reasonablenessCheck: "{{free}} seats. Add the two parts back together and see where they land: {{reserved}} reserved plus {{free}} free is {{n1}}, the whole trainful exactly. Two parts that add back to the whole is the check this line always gives you.",
    reasonablenessFailExample: "If you got {{mCount}}, you took {{n2}} seats off rather than {{n2}} per cent of {{n1}} &mdash; and a percentage is not a count of anything until you say what it is a percentage of.",
    connection: "Two things worth taking away, and the second one is the one that catches people. A percentage is always a percentage OF something, and here it was of the whole trainful. And on this line, getting the arithmetic right is only half the job: the story described the reserved seats and the question asked for the rest, so the last thing to do before handing an answer in is to check WHICH part you were asked for."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-10",
                 notes: "Four sets, each re-derived and checked by adding the parts back to the whole: 35% of 240 = 84, 240-84 = 156 (84+156 = 240); 40% of 180 = 72, 180-72 = 108 (72+108 = 180); 45% of 200 = 90, 200-90 = 110 (90+110 = 200); 25% of 160 = 40, 160-40 = 120 (40+120 = 160). Every percentage is a whole number of fives and every whole divides by twenty, so the Test Track's bar cuts on a boundary and every piece is a whole number of seats — asserted by the pair of numberChecks on `taken`. Within each set the reserved, the free, the whole, the percent-as-count value and the distractor are all distinct: (84,156,240,205,4), (72,108,180,140,6), (90,110,200,155,5), (40,120,160,135,7). Estimate brackets contain their answers: 130-180/156, 90-130/108, 92-132/110, 100-140/120." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-10",
                 notes: "ROADMAP lists this sub-type's trap as none, and as 'what is 35% of 240' that is true — so the question asks for the OTHER part instead. That is this line's own crux rather than an added difficulty: pw-free-throws already runs its fraction backwards for the same reason. The commonest wrong answer is therefore right arithmetic finishing one step early, and it is diagnosed by name. Test Track cuts into twenty rather than ten because a tenth cannot hold thirty-five per cent, and choosing the piece size is the move being taught. Read 3's correct option is placed second of four. NOT MEASURED: correct-option position across this problem's choice surfaces against chance." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No persona walk-through, and no real student has used this." },
    oversight: { status: "provisional", date: "2026-08-10",
                 notes: "PROVISIONAL. Author and reviewer are the same agent (VERIFICATION.md §16). The judgement that needs a classroom: whether asking for the complement makes this problem teach the Part-Whole crux, or merely makes an easy percent question into a trick. It is defensible either way from here." }
  }
});
