/* Part–Whole Loop · whole unknown from a percent · work · independent

   FOUR NUMBER SETS. Here the PERCENT varies as well as the part, which the
   fraction problems on this line deliberately avoid — and it is affordable
   only because the bar is always ten parts. The percent decides how many of
   those parts are shaded, so it has to be a multiple of 10 or the picture
   cannot draw itself.

   Two further constraints, neither of them arithmetic:
     - The percent stays UNDER 50. The estimate reasoning argues from "if the
       morning were exactly half", and at 60% that argument runs backwards.
     - The percent is never 10. At 10% the first step asks "if 10% is n1, what
       is 10%?" and hands back the number it was given.

   Verified both ways for each set — down to one tenth, and the percent taken
   of the answer to rebuild the part:
     40% of the day is 68  → 68/4 = 17,  10x17 = 170   (0.40 x 170 = 68)
     30% of the day is 54  → 54/3 = 18,  10x18 = 180   (0.30 x 180 = 54)
     20% of the day is 46  → 46/2 = 23,  10x23 = 230   (0.20 x 230 = 46)
     40% of the day is 96  → 96/4 = 24,  10x24 = 240   (0.40 x 240 = 96) */
MF.registerProblem({
  id: "pw-orders-day",
  schemaVersion: 1,
  status: "published",
  title: "Back to the whole day",
  line: "partwhole",
  topics: ["percent-of-a-quantity", "whole-unknown"],
  steps: 1,

  unknownCar: "whole-from-percent",
  context: "work",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["switchyard", "estimation"],
  hubStrategyNote: "The percent is smaller than 100, so the whole day has to be bigger than the morning. Working out which direction to go is the whole job here.",

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* k is how many ten-percent chunks the given percent holds — the divisor of
     step one, the number of shaded parts on the bar, and the thing that makes
     a set work or not. Checked in both directions. */
  numberChecks: [
    ["n2", "/", "10", "=", "k"],
    ["k", "*", "10", "=", "n2"],
    ["n1", "/", "k", "=", "tenth"],
    ["k", "*", "tenth", "=", "n1"],
    ["tenth", "*", "10", "=", "whole"],
    ["whole", "/", "10", "=", "tenth"],
    ["n1", "/", "10", "=", "mTenthOfPart"],
    ["mTenthOfPart", "*", "k", "=", "mPctOfPart"],
    ["whole", "-", "n1", "=", "afternoon"],
    ["n1", "+", "n2", "=", "mAddPct"],
    ["100", "-", "n2", "=", "restPct"],
    ["n1", "*", "2", "=", "twice"],
    ["seg1", "*", "tenth", "=", "whole"],
    ["mark1", "*", "tenth", "=", "n1"]
  ],

  numberSets: [
    { numbers: { n1: "68", n2: "40", n3: "12" },
      derived: { k: "4", tenth: "17", whole: "170", mTenthOfPart: "6.8", mPctOfPart: "27.2",
                 afternoon: "102", mAddPct: "108", restPct: "60", twice: "136" },
      estimate: { min: 120, max: 230 }, segments: [10], marked: [4] },
    { numbers: { n1: "54", n2: "30", n3: "8" },
      derived: { k: "3", tenth: "18", whole: "180", mTenthOfPart: "5.4", mPctOfPart: "16.2",
                 afternoon: "126", mAddPct: "84", restPct: "70", twice: "108" },
      estimate: { min: 130, max: 240 }, segments: [10], marked: [3] },
    { numbers: { n1: "46", n2: "20", n3: "9" },
      derived: { k: "2", tenth: "23", whole: "230", mTenthOfPart: "4.6", mPctOfPart: "9.2",
                 afternoon: "184", mAddPct: "66", restPct: "80", twice: "92" },
      estimate: { min: 160, max: 320 }, segments: [10], marked: [2] },
    { numbers: { n1: "96", n2: "40", n3: "14" },
      derived: { k: "4", tenth: "24", whole: "240", mTenthOfPart: "9.6", mPctOfPart: "38.4",
                 afternoon: "144", mAddPct: "136", restPct: "60", twice: "192" },
      estimate: { min: 170, max: 330 }, segments: [10], marked: [4] }
  ],

  scene: { icon: "box", caption: "The day in tenths — the filled ones were packed before lunch.",
           plural: "tenths of the day", onWord: "packed", offWord: "still to do" },

  problem: {
    text: "The warehouse packs garden tools for a company called Thistle and Fern. Every box goes out with a green sticker on the lid. A worker packed {{n1}} orders before lunch, taping each lid down flat. The warehouse has {{n3}} echoing loading bays. That was {{n2}} percent of all the orders for the day. How many orders were there for the whole day?",
    sentences: [
      "The warehouse packs garden tools for a company called Thistle and Fern.",
      "Every box goes out with a green sticker on the lid.",
      "A worker packed {{n1}} orders before lunch, taping each lid down flat.",
      "The warehouse has {{n3}} echoing loading bays.",
      "That was {{n2}} percent of all the orders for the day.",
      "How many orders were there for the whole day?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "68", unit: "orders",  role: "part", spoken: "68" },
      n2: { value: "40", unit: "percent", role: "percent", spoken: "40" },
      n3: { value: "12", unit: "loading bays", role: "distractor", spoken: "12" }
    },
    context: { setting: "warehouse shift", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Someone is packing orders at work. They get part of the job done in the morning, and we want to know how big the whole job is.",
      platformCheck: {
        sentences: [2, 4],
        why: "\"percent of all the orders for the day\" ties the morning's work to the day's whole job. The day is the whole, and the morning is a share of it.",
        kinds: "Everything counted here is orders packed in the same warehouse."
      },

      questions: {
        kinds: {
          ask: "This story counts orders, and it also counts the warehouse's loading bays. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The bays are part of the building. Everything the question is about is orders packed on the same day.",
                         no:  "That would mean orders and bays were pinned to each other, so that packing more built another bay. Nothing in the story links them." },
            different: { yes: "", no: "That would mean orders were locked to bays at a fixed rate, so many orders for every bay. The bays are scenery." }
          }
        },
        moments: {
          ask: "The worker packs orders before lunch. Does the question follow a pile growing through the day, or does it ask how the day's whole job divides up?",
          options: {
            changed: { text: "It follows a pile growing", yes: "",
                       no:  "A fair reading &mdash; the pile does grow through the morning. But you are not asked what the pile was at any moment. You are asked how big the whole day's job is, given that the morning was a share of it." },
            steady:  { text: "It asks how the day's job divides",
                       yes: "The day's work is a fixed amount, and the morning is a share of it. You are dividing a total, not following it through the day.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just this day's orders, or this day and another day held up beside it?",
          options: {
            single:   { yes: "A single day's work, split into the morning and the rest.", no: "" },
            separate: { yes: "", no: "That would mean another day's orders set beside this to measure the gap. There is only the day the story describes." },
            paired:   { yes: "", no: "That would mean orders locked to something else and scaled up or down. The morning is a share of a fixed day, not a rate." }
          }
        },
        shape: {
          ask: "Is the day's work being shared out into parts, or is the same batch packed over and over, or neither?",
          options: {
            cut:     { yes: "The morning is a share of the day, and the afternoon is the rest of it. Together they account for all of the day's orders.", no: "" },
            repeat:  { yes: "", no: "That would mean identical batches packed again and again, with the question counting how many batches. The morning is a share of the day, not a repeated batch." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the morning's work is a part of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the morning's work, and the day it came out of?",
          options: {
            onekind: { yes: "A whole cut into shares, all the way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a day's work being divided and nothing else &mdash; no second kind of situation on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A morning that is a share of a day is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the orders done before lunch", needed: true },
        { token: "n2", describe: "what share of the whole day that morning's work was", needed: true },
        { token: "n3", describe: "how many loading bays the warehouse has", needed: false }
      ],
      relationship: "The morning is a part. The percent tells you how big a slice of the day that part is. The day itself is unknown. The loading bays are just where the work happens.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The total number of orders for the entire day, morning and afternoon together.",
      commonMisreading: "Reading it as 'find {{n2}}% of {{n1}}'. The {{n1}} isn't the whole — it IS the {{n2}}%.",
      options: [
        { text: "The total orders for the whole day", correct: true,
          why: "Morning and afternoon together — the whole. So the answer must be bigger than {{n1}}." },
        { text: "{{n2}} percent of {{n1}}",
          why: "This is the classic trap here. The {{n1}} is not the whole — the {{n1}} IS the {{n2}} percent." },
        { text: "The orders left to pack after lunch",
          why: "You could get there, but only after finding the whole day. Not what was asked." },
        { text: "How many orders each loading bay handled",
          why: "The bays are scenery. Nothing connects them to the number of orders." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "The day's orders are one whole, and the morning is a slice of it. A percent is just another way of naming a part of a whole — so this rides the Part–Whole Loop.",
    distractors: [
      { line: "compare", whyWrong: "Percent problems often ARE comparisons, so this is a fair guess. But nothing here is being measured against something else — the morning is part of the day, not a rival to it. Percent CHANGE would be Compare; percent OF would be Part–Whole." },
      { line: "change",  whyWrong: "There's no starting amount moving up or down. The day's total was always what it was; we just haven't been told it." },
      { line: "groups",  whyWrong: "The orders aren't arranged into repeated equal groups. There's one day's work, split into morning and afternoon." },
      { line: "ratio",   whyWrong: "Only one unit is being counted — orders. No fixed relationship between two different kinds of quantity being scaled." }
    ],
    unknownCar: "whole",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the part", "the whole", "the percent"],
    unknownCarAnswer: "the whole",
    unknownCarWhy: "You've been given the part ({{n1}}) and the percent ({{n2}}%). The whole day is the missing car — so your answer must be bigger than {{n1}}.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "compare"],
      discriminator: "Ask what the percent is doing. 'Percent OF something' names a part of a whole. 'Percent MORE than' or 'percent increase' compares two things. This one says 'percent of all the orders'."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue is REVEALED BY MARKING, not pre-printed. One tenth of the
         day is step s1's answer, so Cycle 6 blanked it — leaving a bar model
         with no numbers, which is not a model. model.js hides the value until
         the student marks the part. knownTotal stays "?": the whole day is s2,
         and rule 10b would catch it if it were not. */
      bars: [{ label: "the whole day", segments: 10, segmentValue: "{{tenth}}", knownTotal: "?", unit: "orders",
               marked: 4, markedTotal: "{{n1}} orders", markedLabel: "the {{n1}} orders packed before lunch", restLabel: "the afternoon's work" }],
      a11yDescription: "One bar stands for the whole day's orders. It is split into 10 equal parts. You mark the parts that show the {{n1}} orders packed before lunch — that is {{k}} of the ten. The parts left over show the afternoon's work. Two things are still blank: what one part is worth, and how big the whole bar is. You work out both.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly how many orders do you think there were for the whole day?",
      reasonableMin: 120,
      reasonableMax: 230,
      modelReasoning: "{{n2}}% is less than half. If {{n1}} were exactly half, the day would be {{twice}}. Since {{n1}} is less than half the day, the day must be more than {{twice}}.",
      unit: "orders"
    },

    /* THE TEST TRACK — the percent-to-whole link, which is the thing this
       problem actually turns on and the thing the first version of this screen
       never taught.

       The point being made: 100% IS the whole. Cut it into ten and each
       section is 10%. Then {{n2}}% is however many of those tens you hold.
       That is why the bar has the number of parts it has — a fact the Model
       Yard hands over pre-drawn and this screen makes the student derive.

       NOTHING IS CALCULATED HERE. No value for a section, no total. The only
       numbers on screen are 10 and {{k}}, both of which follow straight from
       the percent the problem already states. The arithmetic is the Engine
       Room's job, and keeping it there is what makes this safe.

       The worked bar uses 70% so that the HELD count differs from the
       student's in every set (4, 3, 2, 4) — otherwise the answer is sitting on
       screen to be copied. It still cuts into ten, because "percent means think
       in tens" is precisely the invariant being taught. */
    testTrack: {
      kind: "section",
      title: "The Test Track",
      heading: "What the percent tells you about the whole",
      intro: "A percent is not a separate number sitting beside the problem. It is an instruction for cutting up the whole. Watch one first.",
      worked: {
        label: "Any whole at all — and 100% means ALL of it.",
        button: "Show me 70%",
        parts: 10, take: 7,
        sayCut: "Cut the whole into 10 equal sections and each one is 10%, because ten lots of 10% make 100%.",
        sayTake: "So 70% is seven of those sections. The percent never changed the whole — it told me how to cut it and how many to take."
      },
      yours: {
        wholeLabel: "The whole day's orders — every order, morning and afternoon. That is 100%.",
        q1: "So: how many equal sections should the whole day be cut into?",
        options1: [
          { text: "10", correct: true,
            why: "Ten sections, each one 10% of the day. Ten lots of 10% make the whole 100%, and {{n2}}% is a whole number of those tens." },
          { text: "100",
            why: "You could — each section would be 1%, and that is perfectly true. But a hundred sections is a lot to draw and to count, and {{n2}} divides by ten exactly, so tens are the sensible cut here." },
          { text: "{{n2}}",
            why: "That is the percent itself, not a number of sections. {{n2}}% describes how much of the day you were given; it does not say the whole splits into {{n2}} pieces." },
          { text: "{{k}}",
            why: "That is how many sections you HOLD, which is the next question. The whole is bigger than the part you were given." }
        ],
        settled1: "Ten sections. Each one is 10% of the whole day.",
        q2: "And how many of those sections did the morning's work fill?",
        options2: [
          { text: "{{k}}", correct: true,
            why: "{{n2}}% is {{k}} lots of 10%, so the morning fills {{k}} of the ten sections. The rest of the day is the sections still empty." },
          { text: "{{n2}}",
            why: "That is the percent, not a count of sections. There are only ten sections in the whole day, so you cannot hold {{n2}} of them." },
          { text: "10",
            why: "That is the whole day. If the morning filled all ten sections there would be nothing left to do after lunch, and the problem says there is." },
          { text: "1",
            why: "One section is 10%. The morning was {{n2}}%, which is more than one of them." }
        ],
        settled2: "{{k}} sections filled, ten in the whole day."
      },
      law: "The percent cuts the whole up and tells you how many pieces you are holding. It never changes what the whole is.",
      bridge: "You now know the shape of it: {{k}} sections in hand, ten in the day. What one section is worth is the Engine Room's question.",
      a11yDescription: "A demonstration about how a percent cuts up a whole, using no arithmetic. First a plain bar stands for any whole at all, which is 100 percent. It is cut into ten equal sections, so each section is 10 percent, and seven are shaded to show 70 percent. Then the same is done to the whole day's orders: the day is cut into ten sections of 10 percent each, and {{k}} of them are shaded because the morning was {{n2}} percent. No value is worked out here — how much one section is worth is the next question, in the Engine Room."
    }
  },

  /* ONE step, not two. The old s1 asked what 10% of the day was worth — which
     is exactly what the Model Yard prints ("each part = N orders") once a
     student marks a part on the previous screen. The ten-percent chunk still
     does all the work; it is now reached through the hint ladder rather than
     asked for after being shown. */
  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many orders were there for the whole day?",
        answer: { exact: "{{whole}}", unit: "orders", acceptedForms: ["{{whole}}", "{{whole}} orders"] },
        workedExplanation: "{{n2}}% is {{k}} lots of 10%, so {{n1}} ÷ {{k}} = {{tenth}} orders in every 10%. The whole day is 100%, which is ten of those: 10 × {{tenth}} = {{whole}} orders.",
        misconceptions: [
          { response: "{{tenth}}",        diagnosis: "That's 10% of the day. A whole day is ten of those.", tag: "one-part-only" },
          { response: "{{n1}}",           diagnosis: "That's the morning only. The question asks for the whole day.", tag: "answered-given" },
          { response: "{{afternoon}}",    diagnosis: "That's the afternoon — the other {{restPct}}%. Add the morning back on to get the full day.", tag: "answered-intermediate" },
          { response: "{{mPctOfPart}}",   diagnosis: "You found {{n2}}% of {{n1}}. The {{n1}} already IS the {{n2}}% — you don't need to take {{n2}}% of it again, and the whole day must be BIGGER than the morning.", tag: "percent-of-wrong-whole" },
          { response: "{{mTenthOfPart}}", diagnosis: "You found 10% of {{n1}}. But {{n1}} isn't the whole day — it's the {{n2}}% slice. You're taking a percent of the wrong thing.", tag: "percent-of-wrong-whole" },
          { response: "{{mAddPct}}",      diagnosis: "You added {{n1}} and {{n2}}. Those are different kinds of thing — one is orders, the other is a percent. You can't add them.", tag: "unit-confusion" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The morning is only part of the day, so the answer is bigger than {{n1}}. How many 10% chunks fit inside {{n2}}%, and how many make a whole day?" },
          { rung: 2, type: "signal",   text: "{{n2}}% is {{k}} lots of 10%, so split the {{n1}} between those chunks to get one. A whole day is ten of them." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ {{k}} = ___, then 10 × ___ = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ {{k}} = {{tenth}}, and 10 × {{tenth}} = {{whole}}. There were {{whole}} orders for the whole day." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{whole}}", unit: "orders", acceptedForms: ["{{whole}}", "{{whole}} orders"], preferredForm: "{{whole}}" },
    questionCheck: "The question asked for the WHOLE day. If you answered {{afternoon}} you found the afternoon; if you answered {{n1}} you gave back the morning.",
    unitsCheck: "orders",
    reasonablenessCheck: "{{n1}} out of {{whole}} — is that about {{n2}}%? It should be less than half.",
    reasonablenessFailExample: "If you got {{mPctOfPart}}, the morning would be bigger than the whole day, which can't happen.",
    connection: "Finding 10% first is worth remembering. Once you know one tenth, you can build any percent you like out of it."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and cross-checked by taking the percent of the answer: 68/4=17, 10x17=170 (0.40 x 170 = 68); 54/3=18, 180 (0.30 x 180 = 54); 46/2=23, 230 (0.20 x 230 = 46); 96/4=24, 240 (0.40 x 240 = 96). Every percent is a multiple of 10, which the ten-part bar requires; every percent is under 50, which the estimate's if-it-were-half argument requires; and no percent is 10, which would make step one hand back its own given. Shaded parts per set (4,3,2,4) are asserted against the arithmetic through mark1. Estimate brackets contain the final answer: 120-230/170, 130-240/180, 160-320/230, 170-330/240. Every misconception value re-derived per set and checked distinct from that step's answer and from each other; mPctOfPart is smaller than n1 in every set, which the Arrivals fail-example asserts (27.2, 16.2, 9.2, 38.4 against 68, 54, 46, 96). Original 2026-07-28 verification stands for set 1." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "Workplace context is age-appropriate for the older end of the audience without excluding the younger." },
    teacher:   { status: "pass", agent: "teacher",        date: "2026-07-28", notes: "The two percent-of-wrong-whole misconceptions are the highest-value feedback in this problem." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (segmentValue 17 was s1 answer) and a11yDescription rewritten to match. The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
