/* The Compare Line · PERCENT · larger unknown · drinks · partial · ESTIMATION TOWER
   THE FIFTH PROBLEM, AND THE ONE THAT DECIDES WHAT "PERCENT" IS DOING HERE.

   PEDAGOGY.md §3.2 says percent lives on this line. It does not say percent
   CHANGE has to, and the difference matters more than it looks:

     "The fare rose from 8 to 10, what percent increase?"  — one thing, two
        moments. The Platform Check keys that to the CHANGE Line, and its own
        `fit` question would have to answer "two lines stacked" — a verdict
        branch that is currently answered in copy rather than taught, and which
        the user deferred. Content whose own check disagrees with the line it
        sits on would be the site arguing with itself.

     "The buffet sold ▮% more hot drinks than cold drinks" — two amounts, both
        there at once, neither of them changing. Steady, separate, one kind.
        Structurally a Compare, and the check says so.

   This problem is the second. Percent change gets a home when the stacked
   verdict is built; see HANDOFF §0.2.

   WHAT THE PERCENT BUYS US, and why it is worth a problem. "Twenty per cent
   more" is meaningless until you say more than WHAT. That is the referent
   question — the crux of this whole line — in its least escapable form, because
   unlike "seven more", a percentage cannot even be counted out until the
   referent is settled. The Test Track's second question is exactly that and
   nothing else: the percentage is of WHICH amount.

   THE PICTURE IS ITS OWN ARGUMENT. compare-model.js draws the extra piece at
   the stated percentage OF THE REFERENT BAR, so it is visibly a fifth of the
   cold drinks and not a fifth of anything else. It looks like the additive gap
   and is not one: an additive difference is given and can be marked off, while
   this one is the thing being worked out. See the `percent` mode.

   THE MISCONCEPTION THIS IS BUILT AROUND is treating the percentage as a count
   — {{n1}} + {{n2}} — which is the percent version of every keyword error on
   this line: taking the number in front of you and doing the obvious thing with
   it. It is diagnosed by name at step two.

   FOUR NUMBER SETS. Constraints:
     - the percentage of the cold drinks must come out whole, or the buffet sold
       part of a drink;
     - the extra, the total, the wrong-way sum and the wrong-way difference must
       all differ from each other and from both givens, so each misconception
       diagnoses exactly one mistake;
     - percentages stay ones a student can find by halving and tenths.

   Verified per set — the extra, the total, and the total taken back apart:
     20% of 40 = 8   40 + 8  = 48   (48 - 8  = 40)   as-a-count 40 + 20 = 60
     25% of 60 = 15  60 + 15 = 75   (75 - 15 = 60)   as-a-count 60 + 25 = 85
     15% of 80 = 12  80 + 12 = 92   (92 - 12 = 80)   as-a-count 80 + 15 = 95
     30% of 50 = 15  50 + 15 = 65   (65 - 15 = 50)   as-a-count 50 + 30 = 80 */
MF.registerProblem({
  id: "cp-hot-drinks",
  schemaVersion: 1,
  status: "published",
  title: "How many hot drinks the buffet sold",
  line: "compare",
  topics: ["percent", "larger-unknown", "referent", "two-step"],
  steps: 2,

  /* THE FIRST PROBLEM TO CARRY THE PERCENT SURFACE.
     `surface` is not a line and does not replace one: this problem is still
     structurally Compare — two things at once, neither changing, one measured
     against the other — and its Platform Check answers are untouched. What the
     flag changes is the PICTURE: `model.js` asks PercentModel first, so the
     Plan phase draws the double number line instead of the compare bars.

     That is the whole hybrid decision from ROADMAP.md §3 made real. Percent
     gets its own representation without becoming a sixth situation. */
  surface: "percent",

  unknownCar: "larger",
  context: "drinks",
  fadeLevel: "partial",
  stationRoles: ["estimation"],
  hubEligible: true,
  hubGoodStrategies: ["estimation", "drafting"],
  hubStrategyNote: "A percentage cannot be counted out until you have settled what it is a percentage OF, which makes estimating first unusually powerful here — a student who expects a bit more than the cold drinks will catch the commonest error before doing any arithmetic.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  numberChecks: [
    ["n1", "*", "rate", "=", "more"],
    ["rate", "*", "100", "=", "n2"],
    ["n1", "+", "more", "=", "ans"],
    ["ans", "-", "more", "=", "n1"],
    ["n1", "+", "n2", "=", "mAddPct"],
    ["n1", "-", "more", "=", "mSub"]
  ],

  numberSets: [
    { numbers: { n1: "40", n2: "20", n3: "6" },
      derived: { rate: "0.2",  more: "8",  ans: "48", mAddPct: "60", mSub: "32" },
      estimate: { min: 42, max: 56 } },
    { numbers: { n1: "60", n2: "25", n3: "8" },
      derived: { rate: "0.25", more: "15", ans: "75", mAddPct: "85", mSub: "45" },
      estimate: { min: 66, max: 86 } },
    { numbers: { n1: "80", n2: "15", n3: "7" },
      derived: { rate: "0.15", more: "12", ans: "92", mAddPct: "95", mSub: "68" },
      estimate: { min: 84, max: 102 } },
    { numbers: { n1: "50", n2: "30", n3: "9" },
      derived: { rate: "0.3",  more: "15", ans: "65", mAddPct: "80", mSub: "35" },
      estimate: { min: 58, max: 74 } }
  ],

  problem: {
    text: "The buffet at Thorne Bridge steams up its windows selling hot drinks and cold ones. On a rainy Saturday it sold {{n1}} cold drinks. It sold {{n2}}% more hot drinks than cold drinks. The buffet has {{n3}} sticky little tables. How many hot drinks did it sell?",
    sentences: [
      "The buffet at Thorne Bridge steams up its windows selling hot drinks and cold ones.",
      "On a rainy Saturday it sold {{n1}} cold drinks.",
      "It sold {{n2}}% more hot drinks than cold drinks.",
      "The buffet has {{n3}} sticky little tables.",
      "How many hot drinks did it sell?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "40", unit: "cold drinks", role: "smaller",    spoken: "40" },
      n2: { value: "20", unit: "per cent",    role: "percent",    spoken: "20 per cent" },
      n3: { value: "6",  unit: "tables",      role: "distractor", spoken: "6" }
    },
    context: { setting: "station buffet", requiresCulturalKnowledge: false }
  },

  /* Neither row may have an end inside the frame, and here that is sharper than
     on the other scenes: which row is LONGER is the answer to this problem. Both
     run off both edges, so the picture states no count and no comparison of
     length. Motion is ambient — nothing may look like it is being sold, because
     a drink leaving the counter would change one of the two amounts, and this
     problem's Platform Check is keyed to "no amount ends up different". */
  scene: {
    mode: "anim", art: "buffet",
    caption: "The buffet counter at Thorne Bridge: hot drinks along the shelf, cold ones below, both running away past the edge of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "The buffet sold hot drinks and it sold cold drinks on the same day. We are told how many cold drinks it sold, and that the hot drinks came to a percentage more than that, and we want to know how many hot drinks it sold.",
      platformCheck: {
        sentences: [1, 2],
        why: "Between them those sentences give the cold drinks and the percentage the hot drinks run above them. Notice what is missing: nothing states the hot drinks, and that is what the question wants.",
        kinds: "Everything counted here is a drink sold at the buffet."
      },

      questions: {
        kinds: {
          ask: "This story counts hot drinks and cold drinks, and it also counts the buffet's tables. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "A hot drink and a cold drink are both drinks sold at the buffet. The tables are furniture.",
                         no:  "That would mean drinks and tables were pinned to each other, so that selling a drink built a table. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the drinks scaled with the tables. How many tables the buffet has says nothing about how much it sells." }
          }
        },
        moments: {
          ask: "Does the number of hot drinks sold, or the number of cold ones, end up different from how it started?",
          options: {
            steady:  { yes: "Both are counts of what was sold that day. The story never changes either of them — it sets them side by side.", no: "" },
            changed: { yes: "", no: "Worth thinking about, because selling really is something happening. But the story does not give you a count and then change it. It gives you a finished day's sales for each." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single kind of drink, or separate kinds held up against each other?",
          options: {
            separate: { yes: "The hot drinks and the cold drinks, both counted for the same day, with the story measuring how they stand against each other.", no: "" },
            single:   { yes: "", no: "That would mean only a single kind of drink was ever in view. Count how many kinds the story gives you a figure about." },
            paired:   { yes: "", no: "Tempting, because a percentage does hold whatever the size. But a pairing would mean the drinks locked to something else and dragged along by it. These are separate counts from a finished day." }
          }
        },
        shape: {
          ask: "Is anything being cut into shares here, or repeated to build a total, or neither?",
          options: {
            neither: { yes: "Nothing is carved up and nothing repeats. There is a count, and another count measured against it.", no: "" },
            cut:     { yes: "", no: "The closest call on this problem, because a percentage sounds like a slice of something. But a share is part of a named whole that the pieces add back up to, and the hot drinks are not a piece of the cold drinks — they are a separate count that runs above them." },
            repeat:  { yes: "", no: "That would mean an identical amount repeating, with the question counting how many of them. Each kind of drink is counted once, for the same day." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the cold drinks, the hot drinks, and the percentage between them?",
          options: {
            onekind: { yes: "Amounts side by side and a relationship between them, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time, and a fair question here — a percentage feels like a second idea on top. But it is only how the gap is described. There is still just a pair of amounts and the relationship between them." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Drinks measured against drinks is squarely the Compare Line — the measuring is done in per cent rather than in drinks." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many cold drinks the buffet sold", needed: true },
        { token: "n3", describe: "how many tables the buffet has", needed: false },
        { token: "n2", describe: "the percentage by which the hot drinks beat the cold ones", needed: true }
      ],
      relationship: "One of these is a count of drinks and the other is not a count of anything — it is a percentage, and a percentage is always a percentage OF something. Here it is of the cold drinks, because that is what the sentence measures the hot drinks against. The tables are furniture and sold nothing.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many hot drinks the buffet sold.",
      commonMisreading: "Reading \"{{n2}}% more\" as \"{{n2}} more\" and adding the percentage on as though it were a number of drinks.",
      options: [
        { text: "The percentage the hot drinks ran above the cold ones",
          why: "You were handed that. It is how the two counts compare, not a count of drinks." },
        { text: "The hot drinks sold", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many more hot drinks than cold ones",
          why: "Closer than it looks — you do have to work this out on the way. But it is a step, not the destination: the question asks for the hot drinks themselves." },
        { text: "The cold drinks sold",
          why: "Given outright. It is the amount the hot drinks are being measured against." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "Two counts from the same day, neither of them changing, and the story states how one stands against the other. Measuring one amount against another is the Compare Line — the measuring here is done in per cent rather than in drinks, and that changes the arithmetic, not the line.",
    distractors: [
      { line: "ratio",     whyWrong: "The strongest case against, because a percentage does hold at any size — that is what makes it a percentage. But a ratio pins two DIFFERENT kinds of thing together so that changing one drags the other along, like miles and hours. Here both amounts are drinks sold on one finished day; nothing is being scaled, and nothing would follow if it were." },
      { line: "change",    whyWrong: "The other tempting one, because selling is something happening and \"per cent more\" sounds like an increase. But an increase needs one amount that ends up different from how it started, and neither count here ever changes — the hot drinks were never equal to the cold drinks and then grew. They are two separate totals for the same day." },
      { line: "partwhole", whyWrong: "A percentage sounds like a slice, and Part–Whole is where slices live. But it needs a named whole that the pieces add back up to, and the hot drinks are not a part of the cold drinks. Nothing here is being carved up — one count is being measured against another." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and these are two counts of drinks, each stated once for one day." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "the hot drinks sold",
      "the cold drinks sold",
      "the percentage between them"
    ],
    unknownCarAnswer: "the hot drinks sold",
    unknownCarWhy: "The story counts the cold drinks outright and gives you the percentage. The hot drinks are never counted, and that is what the question asks for."
  },

  signalBox: {
    /* PERCENT: no gapToken and no factorToken. The extra piece takes its width
       from the percentage OF THE REFERENT BAR, so it is visibly a fifth of the
       cold drinks and not a fifth of anything else — which is the answer to
       "per cent of what", drawn. It carries the percentage as its label, never
       a count: the count is what the Engine Room asks for. */
    /* THE PERCENT PICTURE. Drawn instead of the compare bars below, because
       `surface: "percent"` makes model.js reach PercentModel first.

       The cold drinks are 100% — they are what "20% more" is more THAN — so
       they anchor the right-hand end of the line and the mark sits at 20% of
       the way along. What the mark is worth in drinks is the question, so it
       carries "?" and the model refuses to work it out.

       `compareBars` stays below, unused but not deleted: this problem is still
       a Compare problem, and if the percent surface were ever removed the
       structural picture is the one it should fall back to. */
    percentLine: {
      title: "Per hundred",
      heading: "The cold drinks are the whole hundred per cent",
      prompt: "One of these amounts is the one the percentage is taken OF. Tap it.",
      wholeToken: "n1",
      percentToken: "n2",
      unknownIs: "part",
      base: "cold",
      questionLabel: "how many drinks that {{n2}}% is worth",
      settledLabel: "so the question is",
      choices: [
        { key: "cold", label: "Cold drinks sold", said: "{{n1}}" },
        { key: "hot",  label: "Hot drinks sold",  said: "?" }
      ],
      why: "\"{{n2}}% more hot drinks THAN cold drinks\" — so the cold drinks are what the percentage is taken of. They are the whole hundred per cent, and the hot drinks run past them by {{n2}}% of that.",
      whyWrong: {
        hot: "The hot drinks are the amount being measured, not the amount measured against — and you do not know them yet, so a percentage of them could not be worked out anyway. Find what follows the word \"than\"."
      },
      a11yDescription: "A double number line. Along the bottom: 0%, a mark at {{n2}}%, and 100% at the right. Along the top the same three points in drinks: 0, a mark carrying a question mark, and {{n1}} drinks at the hundred per cent. The two lines share one axis, so the {{n2}}% mark and the unknown number of drinks sit at the same place.",
      settledSay: "Whatever follows \"than\" is the whole hundred per cent."
    },

    compareBars: {
      title: "Side by side",
      heading: "The cold drinks, and the bit the hot drinks run above them",
      prompt: "The hot drinks are measured against one of these. Tap the one they are measured AGAINST.",
      bars: [
        { key: "cold", label: "Cold drinks", token: "n1" },
        { key: "hot",  label: "Hot drinks",  unknown: true }
      ],
      percentToken: "n2",
      referent: "cold",
      gapLabel: "the hot drinks sold",
      why: "The hot drinks are measured against the COLD ones — \"{{n2}}% more hot drinks than cold drinks\". So the percentage is a percentage of the cold drinks, and nothing else. Look at the picture: the extra piece is {{n2}}% of the cold bar, not of the hot one and not of the two together.",
      whyWrong: {
        hot: "The hot drinks are the ones being measured — the story says there were {{n2}}% more of them THAN something else. Find what follows \"than\": that is what the percentage is a percentage of, and it is the amount you were given."
      },
      a11yDescription: "Two bars. The cold drinks are drawn as a full bar carrying their count. The hot drinks are drawn as that same bar again with a hatched piece marked \"{{n2}}% more\" on the end of it, and the whole bar outlined rather than filled, with a question mark for its total because the story never states it. The hatched piece is {{n2}} per cent of the cold bar, which is what the percentage is measured against.",
      settledSay: "Whatever follows the word \"than\" is what the percentage is a percentage of."
    },
    estimate: {
      prompt: "Before calculating — roughly how many hot drinks do you think the buffet sold?",
      reasonableMin: 42,
      reasonableMax: 56,
      modelReasoning: "The hot drinks beat the cold ones, so the answer is above {{n1}} — but only by {{n2}} per cent, so it is a bit above, not miles. A tenth of {{n1}} is easy to find in your head; work from there.",
      unit: "hot drinks"
    },

    /* THE TEST TRACK, and its second question is the whole reason this problem
       is on this line: the percentage is a percentage of WHICH amount. Direction
       is not in doubt here — "more" plainly means add — so asking about
       direction would be asking a question the student has already answered
       twice on this line. The referent is the live question.

       The worked pair runs on 24 with "50% more", neither of which is an answer
       to any problem or set on this line (VERIFICATION.md §26), and its own
       total is never shown, because nothing here is calculated. */
    testTrack: {
      kind: "compare",
      title: "The Test Track",
      heading: "Per cent of what?",
      intro: "A compare can measure the gap in per cent instead of in ones. When it does, the percentage is always a percentage OF one of the two amounts — and picking the wrong one is the mistake this line is built around. Watch one.",
      worked: {
        label: "A stall sold buns, and it sold more rolls than buns — measured in per cent.",
        button: "Show me",
        known: { label: "Buns", val: "24" },
        unknown: { label: "Rolls" },
        gapText: "50% more",
        unknownIsLarger: true,
        sayCut: "The stall sold 24 buns, and it sold 50% more rolls than buns.",
        sayTake: "The extra piece is measured against the BUNS bar — half of it, because the buns are what the sentence says \"than\". Notice the picture stops there; it does not work the rolls out."
      },
      yours: {
        wholeLabel: "Your story. Look at which bar the extra piece is measured against.",
        known: { label: "Cold drinks", val: "{{n1}}" },
        unknown: { label: "Hot drinks" },
        gapText: "{{n2}}% more",
        unknownIsLarger: true,
        q1: "Which amount does your story already give you?",
        options1: [
          { text: "The cold drinks", correct: true, marks: "known",
            why: "The story counts the cold drinks outright. The hot drinks are never counted." },
          { text: "The hot drinks",
            why: "Read it again — the hot drinks are what the story is measuring, but it never says how many there were. That is the question." },
          { text: "Neither of them, only the percentage",
            why: "The percentage is given, that part is right. But so are the cold drinks — they are counted outright in the sentence before the percentage." }
        ],
        settled1: "You have the cold drinks, and you have the percentage.",
        q2: "The extra is {{n2}} per cent — but {{n2}} per cent OF what?",
        options2: [
          { text: "Of the cold drinks", correct: true, marks: "on",
            why: "Of whatever follows the word \"than\", and the sentence says \"than cold drinks\". That is why the extra piece in the picture is measured against the cold bar." },
          { text: "Of the hot drinks", marks: "on",
            why: "That would make the percentage a percentage of the amount you are trying to find, which you cannot use — and it is not what the sentence says. The hot drinks are the ones being measured, not the ones measured against." },
          { text: "Of the two added together", marks: "on",
            why: "Nothing in the story adds them. A percentage in a compare is always of one of the two amounts, and the sentence tells you which by what follows \"than\"." }
        ],
        settled2: "The percentage is of the amount that follows \"than\" — the one you were given."
      },
      law: "A percentage is always a percentage of something. The sentence says which.",
      bridge: "The picture stops at what the percentage is measured against — actually working the extra out is the next stop.",
      a11yDescription: "A demonstration in two bars. First a worked example: a stall's buns drawn as a full bar holding twenty-four, and its rolls drawn as that same bar with a hatched piece marked \"50% more\" on the end, total unknown — the hatched piece is half the buns bar, because the buns are what the sentence measures against. Then your own story in the same shape: the cold drinks drawn in full with their count, and the hot drinks drawn as that bar plus a hatched piece carrying the percentage, outlined and marked with a question mark. Nothing is calculated in either picture."
    }
  },

  /* The Signal Failure. Not foreshadowed anywhere before the Engine Room.

     READ THIS BEFORE MOVING IT. Of the nine Signal Failures on the site, this
     is the only one whose `why` states a STEP ANSWER outright: "{{n2}}% of
     {{n1}} cold drinks is {{more}} drinks", and {{more}} is s1's exact answer.
     That is safe at the Arrivals Board (Phase 4b) and only there — arrivals
     .reasonablenessCheck already prints {{more}} on the same screen, so this
     adds nothing a student cannot already see. On the Plan screen it would
     hand over step 1 complete, three phases early.

     The text is deliberately NOT defanged, because the sentence is doing the
     teaching: naming the extra is what separates "{{n2}} per cent" from
     "{{n2}} drinks", which is the whole trap. If this field ever renders
     anywhere before the Engine Room, rewrite this string — do not just move
     it. Validator rule 17 catches the likeliest form of that mistake (putting
     signalFailure back inside signalBox); it cannot catch a renderer that
     chooses to draw a top-level field on an earlier phase. That one is on you. */
  signalFailure: {
    trigger: "per cent",
    prompt: "The story says {{n2}}% more. Why is the answer not {{mAddPct}}?",
    why: "Because {{n2}}% is not {{n2}} drinks. A percentage is a share of something, and until you say what it is a share OF, it is not a number of anything at all. {{n2}}% of {{n1}} cold drinks is {{more}} drinks — that is the extra, and it is what goes on top."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many more hot drinks than cold drinks did the buffet sell?",
        answer: { exact: "{{more}}", unit: "drinks", acceptedForms: ["{{more}}", "{{more}} drinks"], preferredForm: "{{more}}" },
        workedExplanation: "The extra is {{n2}}% of the cold drinks — of the cold drinks, because that is what the sentence measures against. {{n2}}% of {{n1}} is {{more}}, so the buffet sold {{more}} more hot drinks than cold ones.",
        hints: [
          { rung: 1, text: "The percentage is a percentage of something. Read the sentence again and find what follows the word \"than\"." },
          { rung: 2, text: "So you need {{n2}}% of the cold drinks. Start with a tenth of {{n1}} — that is easy to find — and build the percentage you need from it." },
          { rung: 3, text: "{{n2}}% of {{n1}} = ___ drinks." },
          { rung: 4, text: "{{n2}}% of {{n1}} = {{more}}. That is how many MORE hot drinks there were." }
        ],
        misconceptions: [
          { response: "{{n2}}", diagnosis: "You gave back the percentage itself. {{n2}}% is not {{n2}} drinks — it is a share of the cold drinks, and you have to work out how big that share is before it is a number of anything.", tag: "percent-as-count" },
          { response: "{{ans}}", diagnosis: "That is where you are heading, but this step asks for the EXTRA on its own — how many more hot drinks than cold ones. The total comes next.", tag: "jumped-to-the-total" }
        ]
      },
      {
        id: "s2",
        prompt: "So how many hot drinks did the buffet sell?",
        answer: { exact: "{{ans}}", unit: "hot drinks", acceptedForms: ["{{ans}}", "{{ans}} hot drinks", "{{ans}} drinks"], preferredForm: "{{ans}}" },
        workedExplanation: "The hot drinks are the cold drinks with the extra on top: {{n1}} + {{more}} = {{ans}}. Check it backwards — {{ans}} − {{more}} = {{n1}}, the cold drinks exactly, and {{more}} really is {{n2}}% of {{n1}}.",
        hints: [
          { rung: 1, text: "You know how many cold drinks there were, and you have just worked out how many more hot ones there were. Put them together." },
          { rung: 2, text: "The hot drinks are the cold drinks plus the extra. Look at the picture from the Plan screen — the hatched piece sits on the END of the cold bar." },
          { rung: 3, text: "{{n1}} + {{more}} = ___" },
          { rung: 4, text: "{{n1}} + {{more}} = {{ans}}. The buffet sold {{ans}} hot drinks." }
        ],
        misconceptions: [
          { response: "{{mAddPct}}", diagnosis: "You added the percentage on as though it were a count of drinks: {{n1}} + {{n2}}. This is the trap this problem is built around. {{n2}}% of {{n1}} is {{more}}, not {{n2}} — the percentage has to be turned into drinks before it can be added to drinks.", tag: "percent-as-count" },
          { response: "{{more}}", diagnosis: "That is the extra on its own, which you worked out at the last step. The question asks for all the hot drinks — the cold drinks' worth plus that extra.", tag: "gave-back-the-step" },
          { response: "{{mSub}}", diagnosis: "You took the extra off instead of putting it on. The story says there were MORE hot drinks than cold ones, so the hot drinks have to come out above {{n1}}.", tag: "wrong-direction" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "hot drinks", acceptedForms: ["{{ans}}", "{{ans}} hot drinks", "{{ans}} drinks"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked for the HOT drinks — the count the story never gives. Not the cold drinks, not the percentage, and not the extra on its own.",
    unitsCheck: "hot drinks",
    reasonablenessCheck: "{{ans}} hot drinks. Take the extra {{more}} back off and you land on {{n1}}, the cold drinks exactly. And {{more}} is {{n2}}% of {{n1}}, which is what the story said it should be.",
    reasonablenessFailExample: "If you got {{mAddPct}}, you would have added {{n2}} drinks rather than {{n2}} per cent of {{n1}} — and a percentage is not a count until you say what it is a percentage of.",
    connection: "Every problem on this line has come down to the same question: measured against WHAT. In per cent it is the least escapable version of it, because {{n2}}% is not a number of anything until you have answered it."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived: 20% of 40=8, 40+8=48 (48-8=40); 25% of 60=15, 60+15=75 (75-15=60); 15% of 80=12, 80+12=92 (92-12=80); 30% of 50=15, 50+15=65 (65-15=50). Every percentage lands on a whole number of drinks. Within each set the extra, the total, the percent-as-count value and the wrong-direction value are all distinct from each other and from both givens and the distractor: (8,48,60,32), (15,75,85,45), (12,92,95,68), (15,65,80,35). numberChecks assert the percentage via a derived rate, the rate against the stated percentage, the total both ways, and both misconception values." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "Deliberately percent COMPARISON rather than percent CHANGE — see the header. Percent change would answer the Platform Check's moments question 'changed' and its fit question 'stacked', on a station whose header says Compare, and the stacked verdict branch is unbuilt and deferred. The Test Track's second question is the referent and nothing else, because direction is not in doubt on this problem and has been asked twice already on this line. Two steps, with a Test Track, which the six older two-step problems still lack. Read 3's distractor placed mid-list." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). The framing decision — comparison rather than change — was the user's, taken on 2026-08-08. Whether a student reads 'per cent of what' as the same question they have been answering all line is the part that needs a real student." }
  }
});
