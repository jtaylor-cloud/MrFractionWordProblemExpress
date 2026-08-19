/* Part–Whole Loop · part unknown · cooking · worked example

   FOUR NUMBER SETS. The FRACTION is held constant at three quarters and only
   the pot size varies — the same decision as pw-free-throws, and for the same
   reason: the bar is always four parts with three marked, so the picture, the
   unit-grid scene and the whole "one quarter then three quarters" argument
   survive unchanged.

   Every pot is a multiple of TWELVE, not just of four. Four is what the
   fraction needs; the extra factor of three is what the misconceptions need.
   The numerator/denominator swap answers n1 ÷ 3, and on a 20-cup pot that is
   6.666…, which is not a wrong answer any student would type — so the
   diagnosis would never fire and the commonest error on this problem would go
   uncaught.

   Verified both ways for each set:
     12/4 = 3  and 3 x 3  = 9    cross-check 12 x 0.75 = 9
     24/4 = 6  and 3 x 6  = 18   cross-check 24 x 0.75 = 18
     36/4 = 9  and 3 x 9  = 27   cross-check 36 x 0.75 = 27
     48/4 = 12 and 3 x 12 = 36   cross-check 48 x 0.75 = 36 */
MF.registerProblem({
  id: "pw-soup-serving",
  schemaVersion: 1,
  status: "published",
  title: "The lunch counter",
  line: "partwhole",
  topics: ["fraction-of-a-quantity"],
  steps: 1,

  unknownCar: "part",
  context: "cooking",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* The 3 and the 4 are the fraction's numerator and denominator — constants
     of the problem, not per-set values. seg1 and mark1 are the bar as
     materialised, so the picture is checked against the arithmetic too. */
  numberChecks: [
    ["n1", "/", "4", "=", "quarter"],
    ["quarter", "*", "4", "=", "n1"],
    ["quarter", "*", "3", "=", "ans"],
    ["ans", "/", "3", "=", "quarter"],
    ["n1", "/", "3", "=", "mSwap"],
    ["mSwap", "*", "4", "=", "divBy"],
    ["n1", "*", "3", "=", "mMul3"],
    ["seg1", "*", "quarter", "=", "n1"],
    ["mark1", "*", "quarter", "=", "ans"]
  ],

  numberSets: [
    { numbers: { n1: "12", n2: "3/4", n3: "14" }, spoken: { n2: "three quarters" },
      derived: { quarter: "3",  ans: "9",  mSwap: "4",  divBy: "16", mMul3: "36" },
      estimate: { min: 6,  max: 11 }, segments: [4], marked: [3] },
    { numbers: { n1: "24", n2: "3/4", n3: "11" }, spoken: { n2: "three quarters" },
      derived: { quarter: "6",  ans: "18", mSwap: "8",  divBy: "32", mMul3: "72" },
      estimate: { min: 13, max: 22 }, segments: [4], marked: [3] },
    { numbers: { n1: "36", n2: "3/4", n3: "15" }, spoken: { n2: "three quarters" },
      derived: { quarter: "9",  ans: "27", mSwap: "12", divBy: "48", mMul3: "108" },
      estimate: { min: 20, max: 33 }, segments: [4], marked: [3] },
    { numbers: { n1: "48", n2: "3/4", n3: "13" }, spoken: { n2: "three quarters" },
      derived: { quarter: "12", ans: "36", mSwap: "16", divBy: "64", mMul3: "144" },
      estimate: { min: 26, max: 44 }, segments: [4], marked: [3] }
  ],

  // Counts come from barModel (4 parts, 3 marked) so the picture cannot
  // drift out of step with the maths. Both are constant across the sets.
  scene: { icon: "bowl", caption: "The pot in quarters — the served ones are steaming.",
           plural: "quarters of the pot", onWord: "served", offWord: "still in the pot" },

  problem: {
    // The opening sentences carry NO numbers, so the numberless first read
    // still masks cleanly and the colour costs the reader nothing.
    text: "The Signal Box Cafe is the last place to get a hot lunch before the express leaves. Today the soup is tomato and basil, and you can smell it from the ticket hall. The cafe makes a deep steel pot of soup that holds {{n1}} cups. The cafe has {{n3}} wobbly tables. By the end of a busy lunch they have served {{n2}} of the pot. How many cups of soup did they serve?",
    sentences: [
      "The Signal Box Cafe is the last place to get a hot lunch before the express leaves.",
      "Today the soup is tomato and basil, and you can smell it from the ticket hall.",
      "The cafe makes a deep steel pot of soup that holds {{n1}} cups.",
      "The cafe has {{n3}} wobbly tables.",
      "By the end of a busy lunch they have served {{n2}} of the pot.",
      "How many cups of soup did they serve?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "12",  unit: "cups", role: "whole", spoken: "12" },
      n2: { value: "3/4", unit: "",     role: "fraction", spoken: "three quarters" },
      // Deliberately irrelevant. A gentle one, since this is the worked example.
      n3: { value: "14",  unit: "tables", role: "distractor", spoken: "14" }
    },
    context: { setting: "station cafe", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A cafe has a pot of soup. They serve some of it at lunch, and we want to know how much they served.",
      /* Soup and servings is the classic Equal Groups mix-up, so the `why` has
         to close that door explicitly — nobody refills the pot. Pedagogy §2.2's
         "the two that get mixed up most" made concrete on the one problem where
         a student is most likely to make it. */
      platformCheck: {
        sentences: [2, 4],
        why: "\"of the pot\" ties what they served to the pot it came out of. The pot is the whole, and lunch takes a share of it — nobody is filling it back up and starting again.",
        kinds: "Everything counted here is soup from the same pot."
      },

      /* Per-problem questions. NOTE the `moments` option TEXT is overridden, not
         just the copy around it: soup does leave the pot, so "the amounts stay
         as they are" reads as false on this story. The real distinction is
         whether the question follows a level through time or divides a fixed
         amount — say that, and the keyed answer stops being a lie. */
      questions: {
        kinds: {
          ask: "This story counts cups of soup, and it also counts the cafe's wobbly tables. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The tables are furniture. Everything the question is about is soup, measured in cups, out of the same pot.",
                         no:  "That would mean the soup and the tables were pinned to each other, so that serving more soup changed the furniture. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean cups of soup were locked to tables at a fixed rate. The tables are scenery; nothing scales with them." }
          }
        },
        moments: {
          ask: "Lunch happens and soup leaves the pot. Does the question follow the pot's level as it changes, or does it ask how a single potful divides up?",
          options: {
            changed: { text: "It follows the level changing", yes: "",
                       no:  "Fair reading &mdash; soup really does leave the pot. But the question does not want the level afterwards. It wants the size of the share that went out, which is a slice of the potful." },
            steady:  { text: "It asks how a potful divides up",
                       yes: "The potful is fixed, and lunch takes a share of it. You are cutting an amount up, not tracking it through time.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just this pot of soup, or this pot and a second pot held up beside it?",
          options: {
            single:   { yes: "A single pot, divided into what was served and what was not.", no: "" },
            separate: { yes: "", no: "That would mean a second pot set beside this to measure the gap between them. The cafe makes the same pot the story started with." },
            paired:   { yes: "", no: "That would mean cups locked to something else and scaled up or down. Nothing here scales &mdash; a fixed potful is being shared out." }
          }
        },
        shape: {
          ask: "Is the soup being shared out into parts, or is the same helping served over and over, or neither?",
          options: {
            cut:     { yes: "Lunch takes a share of the potful, and what stays behind is the rest of it. Between them the shares account for the whole pot.", no: "" },
            repeat:  { yes: "", no: "Genuinely close, and this is where soup problems get mixed up. Identical helpings repeating would be Equal Groups, and the question would be counting how many. This question wants a share OF the pot, not a count of servings." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what lunch takes it out of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the full pot, the lunch service, and the cups that went out?",
          options: {
            onekind: { yes: "A whole cut into shares, all the way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a potful being divided and nothing else &mdash; no second kind of situation stacked on top." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A share taken out of a fixed whole is squarely the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how much the whole pot holds", needed: true },
        { token: "n2", describe: "the share of the pot they served", needed: true },
        { token: "n3", describe: "how many tables the cafe has", needed: false }
      ],
      relationship: "One of these is the whole thing. The other is a fraction telling you how much of that whole was used. The tables have nothing to do with the soup.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many cups they served — a number of cups, not a fraction.",
      commonMisreading: "Answering with the fraction, or with how much was left over instead of how much was served.",
      options: [
        { text: "The number of cups served at lunch", correct: true,
          why: "A number of cups — the part of the pot that went out." },
        { text: "The number of cups still left in the pot",
          why: "That is a real number you could work out, but it is the opposite of what was asked. They want what was SERVED." },
        { text: "What fraction of the pot was served",
          why: "You were handed that — it is three quarters. The question wants cups, not a fraction." },
        { text: "How many tables the cafe has",
          why: "That number is in the problem, but nothing asks for it. Some numbers are just part of the story." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "There's one whole thing — the pot — and we're taking a piece of it. Whole, and a part of that whole. That's the Part–Whole Loop.",
    distractors: [
      { line: "change",  whyWrong: "It looks like a change, because the soup goes down. But nothing is being added to or taken from a starting amount step by step — we're taking a fraction OF a fixed whole. The pot is a whole to be divided, not a running total." },
      { line: "compare", whyWrong: "Nothing is being set beside anything else. There's one pot here, not two amounts being measured against each other." },
      { line: "groups",  whyWrong: "Close thinking — you do end up dividing. But Equal Groups is about repeating the same group over and over. Here there's a single whole being cut into parts, which is Part–Whole." },
      { line: "ratio",   whyWrong: "There's no fixed relationship between two different units being scaled up. Cups and cups — one kind of thing." }
    ],
    unknownCar: "part",
    unknownCarPrompt: "Which car is missing from this train?",
    unknownCarOptions: ["part", "whole", "fraction"],
    unknownCarAnswer: "part",
    unknownCarWhy: "You know the whole pot and you know the fraction. The part is what's missing.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "groups"],
      discriminator: "Both involve dividing. Ask yourself: am I repeating the same group again and again, or am I cutting one single thing into pieces?"
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue is REVEALED BY MARKING, not pre-printed. It is this
         problem's step-1 answer, so Cycle 6 blanked it — which left the Model
         Yard with no numbers in it at all, and a bar model with empty boxes is
         not a model. model.js now hides the value until the student marks the
         part, so it appears as a consequence of their own action rather than
         being handed over on arrival. knownTotal stays visible: the pot size is
         given in the problem text, and a given is what the whole-car is for. */
      bars: [{ label: "the pot", segments: 4, segmentValue: "{{quarter}}", knownTotal: "{{n1}} cups", unit: "cups",
               marked: 3, markedLabel: "served at lunch", restLabel: "still in the pot" }],
      a11yDescription: "One bar stands for the whole pot of {{n1}} cups. It is split into 4 equal parts, one for each quarter. You mark the parts that were served at lunch. The rest stayed in the pot. What one part is worth is left blank for now: work that out first.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly how many cups do you think they served?",
      reasonableMin: 6,
      reasonableMax: 11,
      modelReasoning: "Three quarters is most of the pot, but not all of it. All of it would be {{n1}}, so the answer should be a fair bit less than {{n1}} but well over half.",
      unit: "cups"
    },

    /* THE TEST TRACK — where the two numbers in a fraction come from and what
       each of them does to the whole. Nothing is calculated: the only counts on
       screen are the 4 and the 3 of "three quarters", which the problem text
       already states outright. What one quarter is worth is the Engine Room's
       question and is never shown here.

       The worked bar uses TWO THIRDS so neither its section count nor its held
       count matches the student's — the answers cannot be read off the example
       above them. */
    testTrack: {
      kind: "section",
      title: "The Test Track",
      heading: "What the two numbers in a fraction actually do",
      intro: "A fraction is a pair of instructions about one whole thing: the bottom says how to cut it, the top says how many pieces to take. Watch one first.",
      worked: {
        label: "Any whole at all — a cake, a jar, a journey.",
        button: "Show me two thirds",
        parts: 3, take: 2,
        sayCut: "The bottom number is 3, so cut the whole into 3 equal sections.",
        sayTake: "The top number is 2, so take 2 of them. Two thirds. The whole never changed — the fraction only said how to cut it and how much to keep."
      },
      yours: {
        wholeLabel: "The whole pot of soup — everything the cafe made.",
        q1: "So: how many equal sections should the pot be cut into?",
        options1: [
          { text: "4", correct: true,
            why: "The bottom number of three quarters is 4, and the bottom number always says how many equal sections the whole is cut into." },
          { text: "3",
            why: "That is the top number. It says how many sections to take, not how many to cut. Cutting into 3 would make thirds, and the problem says quarters." },
          { text: "7",
            why: "That adds the two numbers together. A fraction is not an addition — the two numbers do different jobs, and neither of them is a total." },
          { text: "1",
            why: "One section is the whole pot uncut. A fraction of something only means anything once the whole has been divided." }
        ],
        settled1: "Four sections. Each one is a quarter of the pot.",
        q2: "And how many of those quarters did the cafe serve?",
        options2: [
          { text: "3", correct: true,
            why: "The top number of three quarters is 3, so three of the four sections went out at lunch. The fourth is what stayed in the pot." },
          { text: "4",
            why: "That is every section — the whole pot. If they had served all four quarters there would be none left, and the story says there is." },
          { text: "1",
            why: "One quarter is what a single section is. The cafe served three of them, not one." },
          { text: "7",
            why: "There are only four sections in the pot, so you cannot take seven of them. The 7 came from adding the fraction's two numbers together." }
        ],
        settled2: "Three of the four sections served, one still in the pot."
      },
      law: "The bottom number cuts the whole. The top number says how many of those pieces you want.",
      bridge: "You now know the shape of it: three sections out of four. What one section is worth in cups is the Engine Room's question.",
      a11yDescription: "A demonstration about what the two numbers in a fraction do to a whole, using no arithmetic. First a plain bar stands for any whole. Its bottom number 3 cuts it into three equal sections and its top number 2 shades two of them, showing two thirds. Then the same is done to the pot of soup: three quarters means cut the pot into four equal sections and shade three of them. No value is worked out here — how many cups one section holds is the next question, in the Engine Room."
    }
  },

  /* ONE step, not two. It used to open with "how many cups is ONE quarter of
     the pot?" — and the Model Yard on the PREVIOUS screen prints "each part =
     N cups" the moment a student marks a part. The student who used the model
     properly was then asked to copy a number back; the student who ignored it
     did real work. That is backwards, and it punishes exactly the engagement
     the model exists to produce.

     Same resolution as the Ratio line took for rr-timetable-run and
     rr-bread-dough: the intermediate does not disappear, it moves to where it
     is asked for rather than handed over. It is hint rungs 2 and 3, which are
     request-only and escalating, and it stays as the `one-part-only`
     misconception for a student who stops there. */
  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "How many cups of soup did they serve?",
        answer: { exact: "{{ans}}", unit: "cups", acceptedForms: ["{{ans}}", "{{ans}} cups"] },
        workedExplanation: "The bottom number of 3/4 says how many equal parts to cut into — four. So {{n1}} ÷ 4 = {{quarter}} cups in each quarter. The top number says how many of those to take: 3 × {{quarter}} = {{ans}} cups.",
        misconceptions: [
          { response: "{{quarter}}", diagnosis: "That's one quarter of the pot. The top number of the fraction says how many quarters they served — three of them, not one.", tag: "one-part-only" },
          { response: "{{mSwap}}",   diagnosis: "You divided {{n1}} by 3. The bottom number of the fraction tells you how many parts to cut into — that's the 4, not the 3.", tag: "numerator-denominator-swap" },
          { response: "{{divBy}}",   diagnosis: "You divided by 3/4 instead of multiplying by it. Dividing would make the answer bigger than the pot, and you can't serve more soup than you have.", tag: "operation-inversion" },
          { response: "{{mMul3}}",   diagnosis: "You multiplied {{n1}} by 3. That takes 3 lots of the WHOLE pot. The dividing has to happen first — 3 lots of one quarter.", tag: "wrong-quantity" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Look at the two numbers in the fraction. One of them says how many pieces to cut the pot into, and the other says how many of those pieces to take." },
          { rung: 2, type: "signal",   text: "The bottom number says how many equal parts. Split the {{n1}} cups into that many pieces, then take as many as the top number asks for." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ 4 = ___, then 3 × ___ = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ 4 = {{quarter}}, and 3 × {{quarter}} = {{ans}}. They served {{ans}} cups of soup." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "cups", acceptedForms: ["{{ans}}", "{{ans}} cups"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many cups were SERVED. Not how many are left, and not the fraction.",
    unitsCheck: "cups",
    reasonablenessCheck: "{{ans}} cups out of a {{n1}}-cup pot. Does that look like three quarters of it?",
    reasonablenessFailExample: "If you got {{divBy}}, that's more soup than the pot holds — a sure sign something went the wrong way.",
    connection: "Every problem on this line works the same way: the bottom number cuts the whole up, the top number tells you how many pieces to take."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and cross-checked against the decimal: 12/4=3, 3x3=9 (12 x 0.75 = 9); 24/4=6, 3x6=18 (x0.75 = 18); 36/4=9, 3x9=27 (x0.75 = 27); 48/4=12, 3x12=36 (x0.75 = 36). Every pot is a multiple of 12 rather than of 4, which the misconceptions require: the numerator/denominator swap answers n1/3, and on a 20-cup pot that is 6.666… — a value no student would type, so the commonest error on this problem would go undiagnosed. Estimate brackets contain their answers: 6-11/9, 13-22/18, 20-33/27, 26-44/36. All misconception values per set checked distinct from that step's answer and from each other. divBy (n1 divided by three quarters) exceeds n1 in every set, which the Arrivals fail-example asserts: 16>12, 32>24, 48>36, 64>48. Original 2026-07-28 single-set verification stands for set 1." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "Tier-2 vocabulary only. a11yDescription present. No grade level." },
    teacher:   { status: "pass", agent: "teacher",        date: "2026-07-28", notes: "Distractors explain structure. Hint rungs escalate one increment each." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (segmentValue 3 was s1 answer) and a11yDescription rewritten to match. The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
