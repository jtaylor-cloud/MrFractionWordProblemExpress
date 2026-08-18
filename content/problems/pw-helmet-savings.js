/* Part–Whole Loop · other part unknown · money · partial fade

   FOUR NUMBER SETS. The fraction is held constant at five eighths and the
   savings vary, so the bar is always eight parts with five marked and the
   scene, the picture and the two-step argument survive unchanged.

   Every total is a multiple of 8, which the fraction needs. One further
   constraint has nothing to do with arithmetic: the weeks she saved over must
   NOT equal the value of one eighth. Set 1 used to read "$48 saved over 6
   weeks" with each eighth worth $6 — the Model Yard printed "each part = 6
   dollars" directly beside "saved over 6 weeks", and a coincidence sitting
   that close reads as meaning. The weeks were moved rather than the money.

   Verified both ways for each set — the fraction taken, and the two parts
   added back to the whole:
     48/8 = 6, 5x6 = 30, 48-30 = 18   (30 + 18 = 48, and 3/8 x 48 = 18)
     40/8 = 5, 5x5 = 25, 40-25 = 15   (25 + 15 = 40, and 3/8 x 40 = 15)
     56/8 = 7, 5x7 = 35, 56-35 = 21   (35 + 21 = 56, and 3/8 x 56 = 21)
     72/8 = 9, 5x9 = 45, 72-45 = 27   (45 + 27 = 72, and 3/8 x 72 = 27) */
MF.registerProblem({
  id: "pw-helmet-savings",
  schemaVersion: 1,
  status: "published",
  title: "Money left over",
  line: "partwhole",
  topics: ["fraction-of-a-quantity", "complement"],
  steps: 2,

  unknownCar: "other-part",
  context: "money",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "There are two steps hiding in here — what she spends, and then what's left. A bar model shows both pieces at once, which is why drawing it first pays off.",

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* The 8, 5 and 3 are the fraction's denominator, numerator and complement —
     constants of the problem. The last two checks tie the drawn bar to the
     arithmetic: eight parts, five of them the helmet. */
  numberChecks: [
    ["n1", "/", "8", "=", "eighth"],
    ["eighth", "*", "8", "=", "n1"],
    ["eighth", "*", "5", "=", "spent"],
    ["eighth", "*", "3", "=", "ans"],
    ["spent", "+", "ans", "=", "n1"],
    ["n1", "-", "spent", "=", "ans"],
    ["n1", "*", "5", "=", "mNumOnly"],
    ["n1", "/", "5", "=", "mSwap"],
    ["n1", "+", "spent", "=", "addWrong"],
    ["n1", "/", "2", "=", "half"],
    ["seg1", "*", "eighth", "=", "n1"],
    ["mark1", "*", "eighth", "=", "spent"]
  ],

  numberSets: [
    { numbers: { n1: "48", n2: "5/8", n3: "10" }, spoken: { n2: "five eighths" },
      derived: { eighth: "6", spent: "30", ans: "18", mNumOnly: "240", mSwap: "9.6", addWrong: "78", half: "24" },
      estimate: { min: 10, max: 26 }, segments: [8], marked: [5] },
    { numbers: { n1: "40", n2: "5/8", n3: "6" }, spoken: { n2: "five eighths" },
      derived: { eighth: "5", spent: "25", ans: "15", mNumOnly: "200", mSwap: "8", addWrong: "65", half: "20" },
      estimate: { min: 8, max: 22 }, segments: [8], marked: [5] },
    { numbers: { n1: "56", n2: "5/8", n3: "10" }, spoken: { n2: "five eighths" },
      derived: { eighth: "7", spent: "35", ans: "21", mNumOnly: "280", mSwap: "11.2", addWrong: "91", half: "28" },
      estimate: { min: 12, max: 30 }, segments: [8], marked: [5] },
    { numbers: { n1: "72", n2: "5/8", n3: "12" }, spoken: { n2: "five eighths" },
      derived: { eighth: "9", spent: "45", ans: "27", mNumOnly: "360", mSwap: "14.4", addWrong: "117", half: "36" },
      estimate: { min: 15, max: 38 }, segments: [8], marked: [5] }
  ],

  scene: { icon: "coin", caption: "Her savings in eighths — the filled ones went on the helmet.",
           plural: "eighths of her savings", onWord: "spent", offWord: "left" },

  problem: {
    text: "Maya keeps her savings in a chipped jam jar on the windowsill. She wants a matte black bike helmet with a lightning bolt on the side. Maya has saved {{n1}} dollars over {{n3}} long weeks. She spends {{n2}} of her savings on it the day she finds it. How much money does she have left?",
    sentences: [
      "Maya keeps her savings in a chipped jam jar on the windowsill.",
      "She wants a matte black bike helmet with a lightning bolt on the side.",
      "Maya has saved {{n1}} dollars over {{n3}} long weeks.",
      "She spends {{n2}} of her savings on it the day she finds it.",
      "How much money does she have left?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "48",  unit: "dollars", role: "whole", spoken: "48" },
      n2: { value: "5/8", unit: "",        role: "fraction", spoken: "five eighths" },
      n3: { value: "10",  unit: "weeks",   role: "distractor", spoken: "10" }
    },
    context: { setting: "personal savings", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Someone has saved up some money, spends part of it on something, and has some left over.",
      platformCheck: {
        sentences: [2, 3],
        why: "\"of her savings\" ties what she spends to the jar it comes out of. The savings are the whole, and the helmet takes a share of them.",
        kinds: "Everything counted here is dollars from the same jar."
      },

      questions: {
        kinds: {
          ask: "This story counts dollars, and it also counts the weeks Maya spent saving them. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The weeks tell you how long it took, not how much there is. Everything the question is about is dollars in the same jar.",
                         no:  "That would mean dollars and weeks were locked at a fixed rate &mdash; the same amount saved every week, so that more weeks always meant proportionally more money. The story never fixes a rate like that." },
            different: { yes: "", no: "That would mean the weeks and the dollars scaled together. You are told a total, not a weekly rate." }
          }
        },
        moments: {
          ask: "Maya spends part of her savings. Does the question follow the jar's amount as it changes, or does it ask how the savings split between the helmet and what is left?",
          options: {
            changed: { text: "It follows the amount changing", yes: "",
                       no:  "A fair reading &mdash; money really does leave the jar. But you are handed a share of the savings and asked for the rest of that same amount, which is a split rather than a journey through time." },
            steady:  { text: "It asks how the savings split",
                       yes: "The savings are a fixed amount. The helmet takes a share, and what is left is the other share of the same jar.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just Maya's savings, or her savings and someone else's held up beside them?",
          options: {
            single:   { yes: "A single jar, cut into what was spent and what is left.", no: "" },
            separate: { yes: "", no: "That would mean somebody else's savings set beside Maya's so you could measure the gap. There is only her jar." },
            paired:   { yes: "", no: "That would mean dollars pinned to something else and scaled. Nothing here scales &mdash; a fixed amount is being divided." }
          }
        },
        shape: {
          ask: "Are the savings being shared out into parts, or is the same purchase made over and over, or neither?",
          options: {
            cut:     { yes: "The helmet takes a share and the rest stays in the jar. The shares account for all of it.", no: "" },
            repeat:  { yes: "", no: "That would mean the same purchase made again and again, with the question counting how many. She buys the helmet once." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the helmet is being paid for out of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the savings, the helmet, and the money left over?",
          options: {
            onekind: { yes: "A whole cut into shares, the whole way through. Reaching the answer takes more than a single step, and each of those steps is still the same kind of situation.", no: "" },
            stacked: { yes: "", no: "Worth asking, and you are right that it takes more than a single step here &mdash; you work out what was spent before you can find what is left. But both steps are the same kind of situation: a whole being cut into shares. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A jar divided into what went and what stayed is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "everything she had saved", needed: true },
        { token: "n2", describe: "the share of her savings the helmet cost", needed: true },
        { token: "n3", describe: "how long she took to save it", needed: false }
      ],
      relationship: "Her savings split into two parts: the part she spent and the part she kept. Together they make the whole. How long she took to save has no effect on either part.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How much money she still has — the part she did NOT spend.",
      commonMisreading: "Working out what the helmet cost and stopping there. That's a step on the way, not the answer.",
      options: [
        { text: "The money she has left after buying the helmet", correct: true,
          why: "The part she kept. You will have to find what she spent first, but that is not the answer." },
        { text: "How much the helmet cost",
          why: "You do need this on the way — but it is a step, not the answer. Stopping here is the most common mistake on this problem." },
        { text: "How much she saved each week",
          why: "You could work that out, but nobody asked. The weeks are there to make it a story." },
        { text: "What fraction of her savings she has left",
          why: "Close — but the question asks how much MONEY, in dollars, not a fraction." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "Her savings are one whole, and they split into two parts — spent and left. Find one part, and the other is whatever remains. That's the Part–Whole Loop.",
    distractors: [
      { line: "change",  whyWrong: "This is the closest call on the board, and your thinking isn't wrong — money does go down. But the Change Line is for a running total moving up and down over time. Here we're cutting one fixed amount into two pieces at once, which is Part–Whole." },
      { line: "compare", whyWrong: "We're not putting two amounts side by side to see which is bigger. The spent money and the leftover money aren't being compared — they're being added together to make her savings." },
      { line: "groups",  whyWrong: "Nothing is being repeated here. There's one helmet and one pot of savings, not several equal groups." },
      { line: "ratio",   whyWrong: "There's only one unit in play — dollars. A ratio needs a fixed relationship between two different kinds of quantity." }
    ],
    unknownCar: "other-part",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the part spent", "the part left", "the whole"],
    unknownCarAnswer: "the part left",
    unknownCarWhy: "You're given the whole and the fraction spent. The part left over is the missing car — and you have to go through the spent part to reach it.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "change"],
      discriminator: "Ask: is this a total going up and down over time, or one fixed amount being split into pieces? Her ${{n1}} never changes — it just gets divided."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue SHOWS the value of one eighth, and that is deliberate.
         Cycle 6 blanked it to "?" along with four genuine answer leaks, on the
         grounds that it was "one multiplication from s1" — a standard no rule
         states, and one that left the Model Yard with no numbers on it at all.
         It was reversed on the user's direction: the steps ask what the helmet
         cost and what is left, and one eighth is neither. model.js reveals a
         part's value only when the student marks that part, so it arrives as a
         consequence of their own action rather than being handed over.
         knownTotal stays visible too — the savings figure is given in the
         problem text, and a given is what the whole-car is for.

         The rule that survives from that episode: the picture may show any
         quantity the problem text STATES; it may not show one the student has
         to DERIVE as a step answer. */
      bars: [{ label: "her savings", segments: 8, segmentValue: "{{eighth}}", knownTotal: "${{n1}}", unit: "dollars",
               marked: 5, markedLabel: "what the helmet cost", restLabel: "money she has left" }],
      a11yDescription: "One bar stands for Maya's savings of {{n1}} dollars. It is split into 8 equal parts, one for each eighth. You mark the parts that show what the helmet cost. The parts left over show the money she still has. That leftover is what the question asks for. What one part is worth is left blank until you mark a part: work that out first.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly how much do you think she has left?",
      reasonableMin: 10,
      reasonableMax: 26,
      modelReasoning: "Five eighths is a bit more than half. So she spends a bit more than ${{half}} and keeps a bit less than ${{half}}.",
      unit: "dollars"
    }
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How much did the helmet cost?",
        answer: { exact: "{{spent}}", unit: "dollars", acceptedForms: ["{{spent}}", "${{spent}}", "{{spent}} dollars"] },
        workedExplanation: "One eighth is {{n1}} ÷ 8 = {{eighth}} dollars. Five eighths is 5 × {{eighth}} = {{spent}} dollars.",
        misconceptions: [
          { response: "{{eighth}}",   diagnosis: "That's one eighth. The top number says how many eighths the helmet cost — five of them.", tag: "one-part-only" },
          { response: "{{mNumOnly}}", diagnosis: "You multiplied {{n1}} by 5 and stopped. You also need to divide by 8 — otherwise the helmet costs five times her entire savings.", tag: "numerator-only" },
          { response: "{{ans}}",      diagnosis: "That's what she has LEFT, which is where we're going — but this step asks what she spent.", tag: "skipped-ahead" },
          { response: "{{mSwap}}",    diagnosis: "You divided {{n1}} by 5. The 5 is how many parts you want; the 8 is how many parts to cut into.", tag: "numerator-denominator-swap" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Which number in the fraction tells you how many pieces to cut her savings into?" },
          { rung: 2, type: "signal",   text: "Divide by the bottom number to find one eighth, then take as many eighths as the top number asks for." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ 8 = {{eighth}}, so one eighth is ${{eighth}}. Now: 5 × {{eighth}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ 8 = {{eighth}}, and 5 × {{eighth}} = {{spent}}. The helmet cost ${{spent}}." }
        ]
      },
      {
        id: "s2",
        prompt: "So how much does she have left?",
        answer: { exact: "{{ans}}", unit: "dollars", acceptedForms: ["{{ans}}", "${{ans}}", "{{ans}} dollars"] },
        workedExplanation: "She started with ${{n1}} and spent ${{spent}}. {{n1}} − {{spent}} = {{ans}} dollars left.",
        misconceptions: [
          { response: "{{spent}}",    diagnosis: "That's what she spent. The question asks what's left — this is the classic trap of solving step one and stopping.", tag: "answered-intermediate" },
          { response: "{{addWrong}}", diagnosis: "You added instead of subtracting. She spent that money, so it comes off her savings.", tag: "operation-inversion" },
          { response: "3",            diagnosis: "That's how many eighths are left, not how many dollars. Each eighth is worth ${{eighth}}.", tag: "parts-not-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Look at your bar. Five parts are gone. What's still there?" },
          { rung: 2, type: "signal",   text: "Take what she spent away from what she started with." },
          { rung: 3, type: "coupling", text: "{{n1}} − {{spent}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} − {{spent}} = {{ans}}. She has ${{ans}} left." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "dollars", acceptedForms: ["{{ans}}", "${{ans}}", "{{ans}} dollars"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked what she has LEFT. If your answer is {{spent}}, you found the helmet — that's step one, not the finish.",
    unitsCheck: "dollars",
    reasonablenessCheck: "She spent a bit more than half, so she should have a bit less than half left. Does ${{ans}} out of ${{n1}} fit that?",
    reasonablenessFailExample: "If you got ${{addWrong}} she'd have more money after shopping than before, which would be a good trick.",
    connection: "When a problem gives you one part and asks for the other, you almost always have to find the first part before you can get the second."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and checked by two routes — the parts adding back to the whole, and the complement fraction taken directly: 48/8=6, 5x6=30, 48-30=18 (30+18=48; 3/8 x 48 = 18); 40/8=5, 25, 15 (25+15=40; 3/8 x 40 = 15); 56/8=7, 35, 21 (35+21=56; 3/8 x 56 = 21); 72/8=9, 45, 27 (45+27=72; 3/8 x 72 = 27). Estimate brackets contain the final answer: 10-26/18, 8-22/15, 12-30/21, 15-38/27. All four s1 and three s2 misconception values per set re-derived and checked distinct from that step's answer and from each other; the swap value n1/5 terminates in every set (9.6, 8, 11.2, 14.4) so the diagnosis can actually fire. NON-ARITHMETIC constraint enforced per set: the weeks distractor never equals the value of one eighth — set 1 previously read '$48 over 6 weeks' with each eighth worth $6, and the Model Yard printed the two side by side. Original 2026-07-28 verification stands for the arithmetic of set 1." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "Money context accessible. No cultural knowledge assumed." },
    teacher:   { status: "pass", agent: "teacher",        date: "2026-07-28", notes: "The answered-intermediate misconception on s2 is the key teaching moment here." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard segmentValue blanking was later reversed on user direction — see the comment on barModel. The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
