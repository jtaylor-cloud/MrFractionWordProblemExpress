/* Equal Groups Express · TOTAL unknown · FRACTION x WHOLE · bunting · partial · DRAFTING TABLE
   FRACTIONS ENTER WHERE THE OPERATION IS ALREADY SAFE.

   This is eg-crate-bottles again — groups and size given, total missing, and a
   multiplication — with one thing changed: the size of a group is now a
   fraction. That is deliberate sequencing. A student meeting "multiply by 3/4"
   for the first time should not also be deciding which operation to use, and a
   student who has ridden this line already knows this picture.

   THE THING IT TEACHES, and it is the one that makes the last problem
   survivable: MULTIPLYING BY A FRACTION LESS THAN ONE MAKES THE ANSWER SMALLER
   THAN THE COUNT YOU STARTED WITH. {{n1}} flags need fewer than {{n1}} metres.
   Every misconception below is a student refusing to believe that.

   FOUR NUMBER SETS. Constraints:
     - the product must come out a whole number of metres, so the answer is
       something a student can check against the picture;
     - the number of flags stays at or below 12, because groups-model.js draws
       one box per group and stops being legible past that — the model's own
       limit, not an arbitrary one;
     - the numerator-only error must differ from the answer, both givens and the
       distractor in every set.

   Verified per set — the product, and the multiplication back through the
   denominator (ans x den = n1 x num, which is what numberChecks assert):
     12 x 3/4 = 9   (9 x 4 = 36 = 12 x 3)
     10 x 2/5 = 4   (4 x 5 = 20 = 10 x 2)
     12 x 2/3 = 8   (8 x 3 = 24 = 12 x 2)
     8  x 3/4 = 6   (6 x 4 = 24 = 8 x 3) */
MF.registerProblem({
  id: "eg-bunting-ribbon",
  schemaVersion: 1,
  status: "published",
  title: "How much ribbon the bunting needs",
  line: "groups",
  topics: ["total-unknown", "fraction-multiplication", "equal-groups"],
  steps: 1,

  unknownCar: "total",
  context: "bunting",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting"],
  hubStrategyNote: "The structure is the safe one and the fraction is the new part, so it is a good problem for a student who can pick the operation but does not yet trust what multiplying by a fraction does.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  /* The fraction cannot be checked directly: parseFloat("3/4") is 3, so a check
     naming n2 would silently test the numerator. These assert the product using
     integers only — ans x den and n1 x num must be the same number. */
  numberChecks: [
    ["n1", "*", "num", "=", "mNum"],
    ["ans", "*", "den", "=", "mNum"],
    ["n1", "*", "den", "=", "mDen"]
  ],

  numberSets: [
    { numbers: { n1: "12", n2: "3/4", n3: "5" },
      derived: { ans: "9", num: "3", den: "4", mNum: "36", mDen: "48" },
      estimate: { min: 6, max: 13 } },
    { numbers: { n1: "10", n2: "2/5", n3: "3" },
      derived: { ans: "4", num: "2", den: "5", mNum: "20", mDen: "50" },
      estimate: { min: 2, max: 7 } },
    { numbers: { n1: "12", n2: "2/3", n3: "6" },
      derived: { ans: "8", num: "2", den: "3", mNum: "24", mDen: "36" },
      estimate: { min: 5, max: 12 } },
    { numbers: { n1: "8",  n2: "3/4", n3: "4" },
      derived: { ans: "6", num: "3", den: "4", mNum: "24", mDen: "32" },
      estimate: { min: 4, max: 9 } }
  ],

  problem: {
    text: "Thorne Bridge is being dressed up for the summer fair, and bunting is going along the whole platform. Every bright triangular flag takes {{n2}} of a metre of red ribbon. {{n3}} iron lamp posts stand in a row by the platform edge. The porter is cutting and stitching {{n1}} flags. How many metres of ribbon does the porter need?",
    sentences: [
      "Thorne Bridge is being dressed up for the summer fair, and bunting is going along the whole platform.",
      "Every bright triangular flag takes {{n2}} of a metre of red ribbon.",
      "{{n3}} iron lamp posts stand in a row by the platform edge.",
      "The porter is cutting and stitching {{n1}} flags.",
      "How many metres of ribbon does the porter need?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n2: { value: "3/4", unit: "of a metre", role: "size",       spoken: "three quarters" },
      n3: { value: "5",   unit: "lamp posts", role: "distractor", spoken: "5" },
      n1: { value: "12",  unit: "flags",      role: "groups",     spoken: "12" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  scene: {
    mode: "anim", art: "bunting",
    caption: "Bunting strung along the platform, the flags running on past both ends of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A porter is making flags for the fair. Every flag takes the same amount of ribbon, and we are told how many flags there are, so we can work out how much ribbon is needed.",
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give the ribbon a single flag takes and how many flags are being made. Notice what is missing: nothing states how much ribbon that comes to, and that is what the question wants.",
        kinds: "Everything measured here is ribbon, in metres."
      },

      questions: {
        kinds: {
          ask: "This story measures ribbon and counts flags, and it also counts the lamp posts. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "Flags are just what the ribbon is being made into. Everything being measured is ribbon.",
                         no:  "That would mean ribbon and lamp posts were pinned to each other, so that cutting ribbon put up a lamp. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the ribbon scaled with the lamp posts. How many lamps are on the platform says nothing about how much ribbon a flag takes." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started?",
          options: {
            steady:  { yes: "Every flag takes the same amount of ribbon, and that amount does not change as the porter works.", no: "" },
            changed: { yes: "", no: "Tempting, because ribbon gets used up as the flags are made. But the story is not asking what is left on the roll — it asks how much is needed altogether, and the amount a flag takes is fixed." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single thing, or separate things held up against each other?",
          options: {
            single:   { yes: "A single run of bunting, made of flags that are all the same.", no: "" },
            separate: { yes: "", no: "That would mean amounts set side by side and measured against each other. No flag is being compared to another — they are all identical." },
            paired:   { yes: "", no: "That would mean a fixed pairing you could scale to any size. The story gives a set number of flags, not a rule about bunting in general." }
          }
        },
        shape: {
          ask: "Is anything being cut up, or repeated?",
          options: {
            repeat:  { yes: "The same length of ribbon, over and over, once for every flag.", no: "" },
            cut:     { yes: "", no: "The trickiest call on this problem, because a fraction of a metre really is a cut piece. But look at what the STORY is doing: it is not dividing a roll into named shares, it is laying the same small length down again and again. The fraction describes how big the repeated piece is, not a share of a whole." },
            neither: { yes: "", no: "Look again at the flags. They all take the same length of ribbon, and the porter makes them in a row — that is something repeating." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the flags, the ribbon each takes, and what the porter needs?",
          options: {
            onekind: { yes: "The same amount repeated, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a repeated length and a question about what it comes to, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Identical flags made in a row is squarely Equal Groups — a fraction does not change the shape of the story." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how much ribbon a single flag takes", needed: true },
        { token: "n3", describe: "how many lamp posts are along the platform", needed: false },
        { token: "n1", describe: "how many flags the porter is making", needed: true }
      ],
      relationship: "One of these is a length and the other is a count. The ribbon needed is that one length, laid down once for every flag. Notice that the length is less than a whole metre — so the answer will be FEWER metres than there are flags, which is the thing worth expecting before you calculate.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many metres of ribbon the porter needs altogether.",
      commonMisreading: "Answering with the number of flags, or ignoring the fraction and treating each flag as a whole metre.",
      options: [
        { text: "How much ribbon a single flag takes",
          why: "You were handed that. It is the length that repeats, not the whole amount." },
        { text: "The ribbon the porter needs", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many flags the porter is making",
          why: "Also given. It is how many times the length repeats, not how much ribbon that is." },
        { text: "How much ribbon is left on the roll",
          why: "The story never says how much ribbon the porter started with, so there is no way to know what is left." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "The same length — the ribbon for a single flag — repeated once for every flag, with the question asking what they come to. That is Equal Groups. The repeated amount happening to be a fraction changes the arithmetic, not the structure.",
    distractors: [
      { line: "partwhole", whyWrong: "The most tempting one here, because {{n2}} of a metre sounds like a share of a whole. But ask what the whole would BE. The story never names a length that the flags are cut out of — it builds a total by repeating a small piece, which is the opposite direction." },
      { line: "change",    whyWrong: "Nothing ends up different from how it started. Ribbon gets used, but the story asks how much is NEEDED, and the length a flag takes is the same at the end as at the beginning." },
      { line: "compare",   whyWrong: "No two amounts are set side by side. Compare needs the story to be interested in the gap between two quantities, and here every flag is identical." },
      { line: "ratio",     whyWrong: "Closer than usual, because \"{{n2}} of a metre for every flag\" does hold at any number of flags. But a ratio pins two DIFFERENT kinds of thing together and asks you to scale between them. Here the story fixes the number of flags and asks for a single total — you are not scaling a relationship, you are repeating an amount a stated number of times." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how much ribbon the porter needs",
      "how much ribbon a flag takes",
      "how many flags the porter is making"
    ],
    unknownCarAnswer: "how much ribbon the porter needs",
    unknownCarWhy: "The story gives the length of a flag's ribbon and the number of flags. What it never states is what those come to together, and that is exactly what the question asks for."
  },

  signalBox: {
    groupsModel: {
      title: "The same amount, again",
      heading: "One flag's ribbon, laid down over and over",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      groupsToken: "n1",
      sizeToken: "n2",
      unknownIs: "total",
      repeater: "size",
      totalLabel: "metres of ribbon",
      questionLabel: "how much ribbon that comes to",
      settledLabel: "so the question is",
      choices: [
        { key: "size",   label: "Ribbon for a flag", said: "{{n2}} of a metre" },
        { key: "groups", label: "Flags to make",     said: "{{n1}}" }
      ],
      why: "Every flag takes the same {{n2}} of a metre, so that is the amount being laid down again and again. The {{n1}} flags are how MANY times you lay it down.",
      whyWrong: {
        groups: "That is how many times the amount repeats, not the amount itself. Ask which number stays the same for every flag: it is the length of ribbon each one takes."
      },
      a11yDescription: "A tray of {{n1}} identical boxes, each labelled {{n2}} of a metre, with a bracket underneath spanning all of them. The bracket carries a question mark, because what they come to is what the question asks. Each box is a fraction of a metre, so the whole row is worth fewer metres than there are boxes.",
      settledSay: "A repeated amount can be a fraction. It repeats the same way a whole number does."
    },
    estimate: {
      prompt: "Before calculating — roughly how many metres of ribbon do you think the porter needs?",
      reasonableMin: 6,
      reasonableMax: 13,
      modelReasoning: "Every flag takes less than a whole metre, so {{n1}} flags must need FEWER than {{n1}} metres. That one thought rules out most wrong answers before you calculate anything.",
      unit: "metres"
    },

    /* Demo on 10 and 30 (§26), missing the number of GROUPS while this problem
       is missing the total — so the demonstration shares out and the student's
       own picture builds up. The demo deliberately uses WHOLE tins rather than
       fractions: the direction is the thing being taught here, and putting a
       fraction in the demonstration too would teach two things at once. */
    testTrack: {
      kind: "groups",
      title: "The Test Track",
      heading: "Build it up, or share it out?",
      intro: "A fraction does not change the shape of the story. It is still groups, the size of a group, and what they come to — and which of the three is missing still decides the direction. Watch one.",
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
        sizeLabel: "{{n2}} m",
        totalLabel: "metres of ribbon",
        totalVal: "?",
        q1: "Which amounts does your story already give you?",
        options1: [
          { text: "A flag's ribbon, and how many flags", correct: true, marks: "group",
            why: "The story gives the ribbon a flag takes and it gives the number of flags. What it never states is what they come to." },
          { text: "The whole length, and how many flags",
            why: "Read it again — the whole length is what the question asks for. If you had it, there would be nothing to work out." },
          { text: "Only how many flags there are",
            why: "The flags are given, that part is right. But so is the ribbon each one takes — that is the sentence with \"every\" in it." }
        ],
        settled1: "You have a group, and you know how many of them.",
        q2: "So which way do you travel?",
        options2: [
          { text: "Build the total up from the flags", correct: true, marks: "build",
            why: "You have a group and a count of groups, so you lay the group down that many times. That is a multiplication — and it is still a multiplication when the group is a fraction." },
          { text: "Share the total out into flags", marks: "share",
            why: "You would need the total to share it, and the total is the thing you are looking for." },
          { text: "Take the flags away from the ribbon", marks: "build",
            why: "Those count different things — flags and metres — so taking one from the other describes nothing in the story." }
        ],
        settled2: "Lay the group down as many times as the story says. A group smaller than a metre still repeats the same way."
      },
      law: "Which of the three is missing decides the direction. A fraction changes the arithmetic, not the direction.",
      bridge: "The picture stops at the direction on purpose — actually doing the multiplication is the next stop.",
      a11yDescription: "A demonstration in two trays. First a worked example missing the number of groups: a box of ten tins drawn against a crate of thirty with the rest left open, so you share out. Then your own story, which is the other way round: a tray with a box for every flag, each labelled with the fraction of a metre it takes, and a bracket underneath carrying a question mark — so you build up. Nothing is counted in either picture."
    }
  },

  /* The Signal Failure fires on the size of the answer rather than on a word.
     "Multiplying makes things bigger" is the belief this problem exists to
     break, and it is the belief the last problem on the line depends on
     having been broken. Not foreshadowed before the Engine Room.

     Top-level, because it renders at the Arrivals Board (Phase 4b). Its first
     six words — "You multiplied, and multiplying is right" — hand over the
     operation outright, which is harmless once the answer is on the screen and
     fatal anywhere before it. */
  signalFailure: {
    trigger: "smaller",
    prompt: "You multiplied, and multiplying is right. So why is the answer SMALLER than the number of flags?",
    why: "Because each flag takes less than a whole metre. Multiplying by a number bigger than 1 makes things bigger; multiplying by a fraction less than 1 makes them smaller. {{n1}} flags at {{n2}} of a metre each cannot need {{n1}} whole metres — you would have ribbon left over from every single flag."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many metres of ribbon does the porter need?",
        answer: { exact: "{{ans}}", unit: "metres", acceptedForms: ["{{ans}}", "{{ans}} metres", "{{ans}}m"], preferredForm: "{{ans}}" },
        workedExplanation: "Every flag takes {{n2}} of a metre and there are {{n1}} flags, so the ribbon needed is {{n2}} laid down {{n1}} times: {{n1}} × {{n2}} = {{ans}} metres. Check it against the picture — {{n1}} pieces, each less than a metre, coming to {{ans}} metres, which is less than {{n1}}. That is what multiplying by a fraction below 1 does.",
        hints: [
          { rung: 1, text: "Look at the picture from the Plan screen. There is a box for every flag and each one is worth {{n2}} of a metre." },
          { rung: 2, text: "The same length, {{n1}} times over — that is a multiplication, exactly like the crates. The only new thing is that the length is a fraction." },
          { rung: 3, text: "{{n1}} × {{n2}} of a metre. Multiply {{n1}} by the top number, then share the result by the bottom one: ({{n1}} × {{num}}) ÷ {{den}} = ___" },
          { rung: 4, text: "({{n1}} × {{num}}) ÷ {{den}} = {{mNum}} ÷ {{den}} = {{ans}}. The porter needs {{ans}} metres." }
        ],
        misconceptions: [
          { response: "{{mNum}}", diagnosis: "You multiplied by the top number and stopped. {{n1}} × {{num}} = {{mNum}} counts the QUARTERS, or thirds, or fifths — not the metres. You still have to share that by {{den}} to turn those pieces back into whole metres.", tag: "numerator-only" },
          { response: "{{mDen}}", diagnosis: "You multiplied by the bottom number. That makes each flag take {{den}} metres instead of a fraction of one, and the answer comes out bigger than the number of flags — on a story where every flag takes less than a metre.", tag: "denominator-only" },
          { response: "{{n1}}", diagnosis: "That is the number of flags, not a length. It would be the answer only if every flag took exactly one whole metre, and the story says each one takes {{n2}} of a metre.", tag: "ignored-the-fraction" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "metres", acceptedForms: ["{{ans}}", "{{ans}} metres", "{{ans}}m"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for METRES of ribbon — the whole amount needed. Not the number of flags, and not what a single flag takes.",
    unitsCheck: "metres",
    reasonablenessCheck: "{{ans}} metres for {{n1}} flags. That is fewer metres than there are flags, which it has to be, because each flag takes less than a whole metre. Share {{ans}} metres between {{n1}} flags and each gets {{n2}} of a metre, exactly as the story says.",
    reasonablenessFailExample: "If you got {{mNum}}, the porter would need more ribbon than a metre per flag — on a story where each flag takes less than one.",
    connection: "Same structure as the crates, with a fraction in place of a whole number. The picture did not change and the operation did not change. What changed is the direction the answer moved: repeating something smaller than a metre gives you fewer metres than repeats."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived: 12x3/4=9; 10x2/5=4; 12x2/3=8; 8x3/4=6. Every product is a whole number of metres. numberChecks avoid the fraction token entirely — parseFloat('3/4') is 3, so a check naming n2 would silently test the numerator; instead ans x den and n1 x num are asserted equal, which pins the product using integers only. The numerator-only and denominator-only values are distinct from the answer, both givens and the distractor in every set. Group counts are all at or below 12, which is groups-model.js's own legibility limit." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "Fractions enter on the SAFE structure — same shape and operation as eg-crate-bottles, so the only new thing is the fraction. Its Signal Failure fires on the size of the answer rather than on a word, because 'multiplying makes things bigger' is the belief this problem exists to break and the belief eg-water-cans depends on having been broken. The shape question's `cut` response is the most carefully written on the line: a fraction genuinely looks like a cut share, and the answer distinguishes what the STORY does from what the number looks like." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). No Test Track. The fraction hint ladder at rung 3 and 4 is the most procedural copy on this line and would benefit most from a real student reading it." }
  }
});
