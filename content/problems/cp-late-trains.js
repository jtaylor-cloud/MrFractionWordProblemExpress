/* The Compare Line · difference unknown · delays · worked · READING ROOM
   THE FIRST PROBLEM ON A NEW LINE, and deliberately the gentlest case: both
   amounts are given, nothing changes, and the only question is the size of the
   gap between them.

   WHY THE QUESTION AVOIDS "MORE". The line's whole arc is that a keyword is
   allowed to succeed before it is broken — the way ch-lost-property lets "more
   means add" work and ch-water-tank then kills it. On a difference-unknown
   compare, "how much MORE" always needs subtraction, so putting "more" here
   would break the rule on the very first problem and leave nothing to build.
   The question says "how much later" instead, which engages no keyword at all,
   and the fight is saved for problems 2 and 3.

   THE REFERENT IS THE POINT. "Later than the morning train" makes the morning
   train the thing being measured against. That is the one decision the Compare
   model asks for, and misreading it is the #1 error on this line (Pedagogy
   §3.2). Note the referent is mentioned FIRST in the story and SECOND in the
   question, so its position gives nothing away.

   TIME PASSES IN THIS STORY AND NOTHING CHANGES. Morning and evening are two
   separate measurements, not one amount before and after. That is exactly the
   Change/Compare discrimination, and the Platform Check's Moments question is
   authored to say so out loud rather than leaving the student to guess.

   FOUR NUMBER SETS. Constraints:
     - the evening delay must exceed the morning one, or the difference is
       negative and no student would ever type the misconception value;
     - the difference must differ from BOTH givens and from their sum, so each
       of the three misconceptions diagnoses exactly one mistake;
     - delays stay in a range a real timetable produces.

   Verified both ways per set — the subtraction that finds the gap, and the
   addition that rebuilds the evening delay from it:
     23 - 9  = 14   (9 + 14 = 23)     sum 32
     31 - 12 = 19   (12 + 19 = 31)    sum 43
     25 - 7  = 18   (7 + 18 = 25)     sum 32
     34 - 15 = 19   (15 + 19 = 34)    sum 49 */
MF.registerProblem({
  id: "cp-late-trains",
  schemaVersion: 1,
  status: "published",
  title: "How much later the evening train was",
  line: "compare",
  topics: ["difference-unknown", "subtraction", "referent"],
  steps: 1,

  unknownCar: "difference",
  context: "delays",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-04" },

  numberChecks: [
    ["n2", "-", "n1", "=", "ans"],
    ["ans", "+", "n1", "=", "n2"],
    ["n2", "-", "ans", "=", "n1"],
    ["n1", "+", "n2", "=", "mAdd"]
  ],

  numberSets: [
    { numbers: { n1: "9",  n2: "23", n3: "6" },
      derived: { ans: "14", mAdd: "32" },
      estimate: { min: 8, max: 22 } },
    { numbers: { n1: "12", n2: "31", n3: "8" },
      derived: { ans: "19", mAdd: "43" },
      estimate: { min: 12, max: 28 } },
    { numbers: { n1: "7",  n2: "25", n3: "5" },
      derived: { ans: "18", mAdd: "32" },
      estimate: { min: 10, max: 26 } },
    { numbers: { n1: "15", n2: "34", n3: "4" },
      derived: { ans: "19", mAdd: "49" },
      estimate: { min: 12, max: 28 } }
  ],

  problem: {
    text: "The departure board at Thorne Bridge clatters through its letters all day, keeping a record of every late train. On a grey Monday the morning train crept in {{n1}} minutes late. The station has {{n3}} windswept platforms. That evening the last train was {{n2}} minutes late, its windows fogged and full. How much later was the evening train than the morning train?",
    sentences: [
      "The departure board at Thorne Bridge clatters through its letters all day, keeping a record of every late train.",
      "On a grey Monday the morning train crept in {{n1}} minutes late.",
      "The station has {{n3}} windswept platforms.",
      "That evening the last train was {{n2}} minutes late, its windows fogged and full.",
      "How much later was the evening train than the morning train?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "9",  unit: "minutes",   role: "smaller",    spoken: "9" },
      n2: { value: "23", unit: "minutes",   role: "larger",     spoken: "23" },
      n3: { value: "6",  unit: "platforms", role: "distractor", spoken: "6" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  /* The quantity on this problem is TIME, which is why this is the one scene on
     the line that draws both of its subjects whole — no arrangement of two
     locomotives says how many minutes late either was. The space between them
     carries no bracket and no marker; measuring the gap is compare-model.js's
     job on the Plan phase, where the bars are derived from the live number set.
     See the header of compare-scenes.js. */
  scene: {
    mode: "anim", art: "delays",
    caption: "Two trains at Thorne Bridge, both late on the same day, one further down the line than the other."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Two different trains were both late on the same day. We are told how late each one was, and we want to know how much later the evening one was than the morning one.",
      /* The distractor sentence carries the platforms and is correctly outside
         the answer. Both needed quantities sit in their own sentences, so the
         answer is a pair — no single-tap problems on this line. */
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give the delays the question compares. Notice that neither of them changes into the other — they are separate measurements of separate trains, which is what makes this a comparison rather than a story about something happening.",
        kinds: "Everything counted here is minutes of lateness."
      },

      questions: {
        kinds: {
          ask: "This story counts minutes of lateness, and it also counts the station's platforms. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The platforms are part of the station, not part of the question. Everything being compared is minutes.",
                         no:  "That would mean minutes and platforms were pinned to each other, so that running later somehow built another platform. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the platforms and the delays scaled together. How many platforms the station has says nothing about how late a train is." }
          }
        },
        moments: {
          /* The Change/Compare discrimination, on the problem where it is most
             tempting to get wrong: the story really does run from morning to
             evening. Time passing is not an amount changing. */
          ask: "The story runs from the morning through to the evening. Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "Time passes, but neither delay ever changes. The morning train's lateness does not turn into the evening train's lateness — they are separate measurements that both just sit there.", no: "" },
            changed: { yes: "", no: "The most tempting answer here, because the story really does travel from morning to evening. But look for an AMOUNT that ends up different from how it started. The morning delay is still the morning delay at the end of the day; a second delay has simply appeared beside it." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single train, or separate trains held up against each other?",
          options: {
            separate: { yes: "Both trains were late, neither of them changing, and the question is about the gap between them.", no: "" },
            single:   { yes: "", no: "That would mean only a single amount was ever in view. Read it again and count how many trains the story gives you a delay for." },
            paired:   { yes: "", no: "That would mean minutes locked to something else and scaled up or down. Nothing is being scaled here — separate amounts are being set beside each other." }
          }
        },
        shape: {
          ask: "Are the minutes being shared out into parts, or is the same delay repeating, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares and nothing repeats. The story simply puts separate amounts side by side.", no: "" },
            cut:     { yes: "", no: "That would mean a single total divided into shares that add back up to it. There is no total here to divide — the delays belong to different trains." },
            repeat:  { yes: "", no: "That would mean the same delay happening again and again, with the question counting how many. Each train was late once, by its own amount." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — both delays, and the gap the question asks for?",
          options: {
            onekind: { yes: "Amounts side by side and a gap between them, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there are the delays and the space between them, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Amounts measured against each other is squarely the Compare Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      /* The distractor sits in the MIDDLE. On fourteen of the sixteen existing
         problems it is last, which makes "never pick the last one" score
         without reading; new content does not add to that. */
      quantities: [
        { token: "n1", describe: "how late the morning train was", needed: true },
        { token: "n3", describe: "how many platforms the station has", needed: false },
        { token: "n2", describe: "how late the evening train was", needed: true }
      ],
      relationship: "Both numbers are delays, measured the same way, for two different trains. Neither one caused the other and neither one turned into the other — they are simply both true at once, and the question is about the distance between them. How many platforms the station has has nothing to do with how late anything ran.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The gap between the two delays — how many minutes later the evening train was than the morning one.",
      commonMisreading: "Answering with one of the two delays you were handed, instead of the space between them.",
      options: [
        { text: "How many minutes late the evening train was",
          why: "You were given that. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "The gap between the two delays", correct: true,
          why: "The question compares them — later THAN the morning train — so what is missing is the distance between the two amounts." },
        { text: "How many minutes late the morning train was",
          why: "Also given. It is the amount the evening train is being measured against, not the answer." },
        { text: "How long the two trains were late altogether",
          why: "Adding them would describe a total waiting time across the day. The question asks how much later one was than the other, which is a gap, not a total." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "Two amounts exist at the same time and neither one changes. The question is about the space between them, which is what the Compare Line is for.",
    distractors: [
      { line: "change",    whyWrong: "I can see why — the story travels from morning to evening, so it feels like time doing something. But Change needs one amount that ENDS UP different from how it started. Here the morning delay is still the morning delay at the end of the day; a second delay simply appears beside it." },
      { line: "partwhole", whyWrong: "There is no whole here to cut up. Part–Whole needs one total that the pieces add back up to, and two separate trains' delays are not shares of anything — neither of them is part of the other." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and these are two different delays that each happened once." },
      { line: "ratio",     whyWrong: "Nothing is locked together and scaled. A rate would mean the delay grew in proportion to something else, so that changing one dragged the other with it. Here the two delays are independent — either could have been anything." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "the difference between the two delays",
      "how late the evening train was",
      "how late the morning train was"
    ],
    unknownCarAnswer: "the difference between the two delays",
    unknownCarWhy: "Both delays are printed in the story. The only thing missing is the space between them, and that is what the question asks for."
  },

  signalBox: {
    /* The Compare model, not the Model Yard: there is no whole here to cut into
       equal parts. Two bars on a shared track, and the student names the amount
       the other is being measured against. See compare-model.js. */
    compareBars: {
      title: "Side by side",
      heading: "Two delays, and the gap between them",
      prompt: "One of these trains is being measured against the other. Tap the one it is measured AGAINST.",
      bars: [
        { key: "morning", label: "Morning train", token: "n1" },
        { key: "evening", label: "Evening train", token: "n2" }
      ],
      referent: "morning",
      gapLabel: "how much later the evening train was",
      why: "The question asks how much later the EVENING train was — later than the morning train. So the morning train's delay is the amount you measure against, and the gap starts where it ends.",
      whyWrong: {
        evening: "The evening train is the one being measured — it is the one the question is asking about. Read the question again and find the words \"than the morning train\": whatever follows \"than\" is what you measure against."
      },
      a11yDescription: "Two bars on the same scale, one for each train's delay. The morning train's bar is the shorter. The evening train's bar runs further, and the gap between the two ends is the amount the question asks for. The gap is marked with a question mark, not a number.",
      settledSay: "Whatever follows the word \"than\" is the amount you are measuring against. That holds on every problem on this line."
    },
    /* The Test Track. This is the gentlest case — both amounts given, the gap
       missing — so the demo shows a story missing the BIGGER amount instead,
       which is a shape the student meets for real on the next problem. Numbers
       8 and 13 belong to no problem or set on this line. */
    testTrack: {
      kind: "compare",
      title: "The Test Track",
      heading: "Which end is the question mark on?",
      intro: "Every problem on this line is two amounts and the gap between them, and the story always leaves exactly one of the three out. Which one it leaves out decides what you do. Watch one.",
      worked: {
        label: "A story missing the BIGGER amount. The smaller one and the gap are both given.",
        button: "Show me",
        known: { label: "Shorter shelf", val: "8" },
        unknown: { label: "Longer shelf" },
        gapText: "5 more",
        unknownIsLarger: true,
        sayCut: "The shorter shelf holds 8, and the longer one holds 5 more than that.",
        sayTake: "The gap sits on the END of the bar you are looking for, so you travel up from what you know. The picture stops there — it does not work the total out."
      },
      yours: {
        wholeLabel: "Your story is the other way round. Look at what is missing.",
        gapUnknown: true,
        short: { label: "Morning train", val: "{{n1}}" },
        long:  { label: "Evening train", val: "{{n2}}" },
        gapText: "?",
        q1: "Which of the three pieces is your story leaving out?",
        options1: [
          { text: "The gap between them", correct: true, marks: "known",
            why: "Both delays are printed in the story. It is the space between them that nothing states." },
          { text: "The evening train's delay",
            why: "That one is given — it is in the sentence about the last train." },
          { text: "The morning train's delay",
            why: "That one is given too. Both delays are there; look at what sits between them." }
        ],
        settled1: "Both amounts are given, and it is the gap that is missing.",
        q2: "So what do you do with the two amounts you have?",
        options2: [
          { text: "Take one from the other", correct: true, marks: "off",
            why: "The gap runs from the end of the shorter bar to the end of the longer one, so it is the difference between them." },
          { text: "Add them together", marks: "on",
            why: "That would give the two delays added up, which is a total waiting time across the day. The question wants the space between them, not both of them at once." },
          { text: "Divide one by the other", marks: "off",
            why: "That would tell you how many TIMES later one train was than the other, which is a different kind of comparison. This question asks for the gap in minutes, which is a subtraction." }
        ],
        settled2: "With both amounts in hand, the gap is one taken from the other."
      },
      law: "Where the question mark sits decides what you do. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the subtraction is the next stop.",
      a11yDescription: "A demonstration in two bars. First a worked example: a shorter shelf holding eight, and a longer shelf drawn as the same length again with a hatched piece marked \"five more\" on its end, its total unknown — so you travel up from what you know. Then your own story, where both delays are given and it is the hatched piece between their ends that carries the question mark, so the two amounts are taken one from the other. Nothing is calculated in either picture."
    },

    estimate: {
      prompt: "Before calculating — roughly how many minutes later do you think the evening train was?",
      reasonableMin: 8,
      reasonableMax: 22,
      modelReasoning: "The evening train was clearly the later of the two, so the gap has to be smaller than its own delay of {{n2}} minutes — you cannot be further behind than you were late. And the morning train was already {{n1}} minutes down, so the gap is smaller than that difference again. Round both to the nearest ten and take one from the other in your head.",
      unit: "minutes"
    }
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "How much later was the evening train than the morning train?",
        answer: { exact: "{{ans}}", unit: "minutes", acceptedForms: ["{{ans}}", "{{ans}} minutes"], preferredForm: "{{ans}}" },
        workedExplanation: "Line the two delays up from the same start. The morning train reaches {{n1}} minutes and the evening train runs on to {{n2}}. The gap between the ends is {{n2}} − {{n1}} = {{ans}} minutes. Check it the other way round: {{n1}} + {{ans}} = {{n2}}, which is exactly where the evening train ended up.",
        hints: [
          { rung: 1, text: "Read the question again and find the word \"than\". Whatever comes after it is the amount you are measuring against." },
          { rung: 2, text: "Picture the two bars from the Plan screen, lined up at the same start. You are being asked for the length of the piece that sticks out past the shorter one." },
          { rung: 3, text: "The gap is the bigger delay take away the smaller one: {{n2}} − {{n1}} = ___" },
          { rung: 4, text: "{{n2}} − {{n1}} = {{ans}}. The evening train was {{ans}} minutes later than the morning train." }
        ],
        misconceptions: [
          { response: "{{mAdd}}", diagnosis: "You added the two delays. That would answer a different question — how many minutes of lateness the station had across the whole day. This question asks how much later one train was THAN the other, and a gap between two amounts is always found by taking one from the other.", tag: "added-instead-of-compared" },
          { response: "{{n2}}", diagnosis: "That is the evening train's own delay, which the story handed you. The question is not how late it was, but how much later it was than the morning train — so the morning train's {{n1}} minutes still have to come off.", tag: "gave-back-the-larger" },
          { response: "{{n1}}", diagnosis: "That is the morning train's delay. It is the amount you measure against, not the answer — the gap runs from there up to the evening train's {{n2}} minutes.", tag: "gave-back-the-referent" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "minutes", acceptedForms: ["{{ans}}", "{{ans}} minutes"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how much LATER the evening train was than the morning one — not how late either of them was on its own, and not both delays added together.",
    unitsCheck: "minutes",
    reasonablenessCheck: "{{ans}} minutes of gap. Add it back onto the morning train's {{n1}} and you land on {{n2}}, exactly where the evening train was. A gap that rebuilds the bigger amount is a gap that holds.",
    reasonablenessFailExample: "If you got {{mAdd}}, the gap between them would be larger than either delay on its own — which would mean the evening train was further behind the morning train than it was behind the timetable.",
    connection: "Every problem on this line is two amounts standing side by side. Here both of them were given and the gap was missing, which is the easy case. It will not always be — sometimes the gap is the thing you are told."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-04",
                 notes: "Four sets, each re-derived and checked by the inverse: 23-9=14 (9+14=23); 31-12=19 (12+19=31); 25-7=18 (7+18=25); 34-15=19 (15+19=34). The evening delay exceeds the morning one in every set, which the difference requires in order to stay positive. All three misconception values checked distinct from the answer and from each other in all four sets: (14,32,23,9), (19,43,31,12), (18,32,25,7), (19,49,34,15). Estimate brackets contain their answers: 8-22/14, 12-28/19, 10-26/18, 12-28/19." },
    theme:     { status: "unreviewed", agent: null, date: null,
                 notes: "NOT REVIEWED. No reading-level measurement, no contrast measurement on --line-compare, which this is the first content to use at all." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-04",
                 notes: "Authored to the line's arc: the question avoids \"more\" so that no keyword is engaged here, leaving ch-lost-property's succeed-then-fail pattern available for problems 2 and 3. Referent is mentioned first in the story and second in the question, so position gives it away. Distractor placed in the MIDDLE of read2's quantities rather than last, which is where fourteen of the sixteen existing problems put it. Option-length and option-position tells NOT yet measured against chance — that measurement needs the rest of the line to exist." },
    student:   { status: "unreviewed", agent: null, date: null,
                 notes: "NOT REVIEWED. Nobody has ridden this problem." },
    oversight: { status: "provisional", date: "2026-08-04",
                 notes: "PROVISIONAL, not approved. This is the first content on a new line and the first user of compare-model.js; VERIFICATION.md §24 says to expect the engine to break on it. Author and reviewer are the same, which VERIFICATION.md §16 says makes this sign-off worth less than it looks. Theme and student passes are outstanding and are the two that most need doing before this is called finished." }
  }
});
