/* Part–Whole Loop · whole then other part · percent · independent · HUB-READY
   Raises the ceiling: percent rather than a unit fraction, whole unknown,
   two moves, and a distracting quantity. Aimed at the older end of the
   audience.

   FOUR NUMBER SETS. The bar is always twenty parts, so the percent decides how
   many are shaded and must be a multiple of 5. Two further constraints:

     - The percent stays UNDER 50, because every sentence in the problem leans
       on road riders being the SMALLER share — the reasonableness check, the
       estimate reasoning and the fail example all become false above half.
     - The road-rider count must divide by the number of shaded parts, or one
       part is worth a fraction of a person.

   Verified both ways for each set — the whole recovered from the percent, and
   the percent taken back out of it — plus the complement checked as its own
   percentage:
     84/0.35 = 240, 240-84 = 156   (0.35 x 240 = 84,  65% of 240 = 156)
     45/0.25 = 180, 180-45 = 135   (0.25 x 180 = 45,  75% of 180 = 135)
     36/0.20 = 180, 180-36 = 144   (0.20 x 180 = 36,  80% of 180 = 144)
     88/0.40 = 220, 220-88 = 132   (0.40 x 220 = 88,  60% of 220 = 132) */
MF.registerProblem({
  id: "pw-cycling-club",
  schemaVersion: 1,
  status: "published",
  title: "The rest of the club",
  line: "partwhole",
  topics: ["percent-of-a-quantity", "whole-unknown", "complement"],
  steps: 2,

  unknownCar: "whole-then-other-part",
  // NOT "sport" — pw-free-throws already owns that context and is the only
  // problem with the estimation role, so it is on every Local trip. Sharing
  // its context made this problem permanently ineligible for the Hub, which
  // requires a context not already seen. Contexts must be distinct.
  context: "cycling",
  fadeLevel: "independent",
  stationRoles: ["switchyard"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "Two moves hidden in one problem: find the whole club, then take the road riders off it. A bar model holds both at once, which is why drawing beats calculating here.",

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-29" },

  numberChecks: [
    ["n2", "/", "5", "=", "marked"],
    ["marked", "*", "5", "=", "n2"],
    ["n1", "/", "marked", "=", "part"],
    ["marked", "*", "part", "=", "n1"],
    ["part", "*", "20", "=", "whole"],
    ["whole", "-", "n1", "=", "ans"],
    ["n1", "*", "n2", "=", "pctTimes"],
    ["pctTimes", "/", "100", "=", "pctOfPart"],
    ["n1", "+", "n2", "=", "addPct"],
    ["whole", "-", "n2", "=", "subPct"],
    ["100", "-", "n2", "=", "restPct"],
    ["n2", "/", "100", "=", "pctDec"],
    /* The picture, tied to the arithmetic: twenty parts, and the shaded ones
       are exactly the percent the problem states. */
    ["seg1", "*", "part", "=", "whole"],
    ["mark1", "*", "part", "=", "n1"],
    ["mark1", "*", "5", "=", "n2"]
  ],

  numberSets: [
    /* The meetings-per-week distractor is never equal to the value of one part
       or to the number of shaded parts. Both appear in the Model Yard readout,
       and an unrelated number that matches one of them reads as connected. */
    { numbers: { n1: "84", n2: "35", n3: "3" },
      derived: { marked: "7", part: "12", whole: "240", ans: "156", pctTimes: "2940",
                 pctOfPart: "29.4", addPct: "119", subPct: "205", restPct: "65", pctDec: "0.35" },
      estimate: { min: 120, max: 190 }, segments: [20], marked: [7] },
    { numbers: { n1: "45", n2: "25", n3: "2" },
      derived: { marked: "5", part: "9", whole: "180", ans: "135", pctTimes: "1125",
                 pctOfPart: "11.25", addPct: "70", subPct: "155", restPct: "75", pctDec: "0.25" },
      estimate: { min: 100, max: 165 }, segments: [20], marked: [5] },
    { numbers: { n1: "36", n2: "20", n3: "5" },
      derived: { marked: "4", part: "9", whole: "180", ans: "144", pctTimes: "720",
                 pctOfPart: "7.2", addPct: "56", subPct: "160", restPct: "80", pctDec: "0.2" },
      estimate: { min: 105, max: 175 }, segments: [20], marked: [4] },
    { numbers: { n1: "88", n2: "40", n3: "2" },
      derived: { marked: "8", part: "11", whole: "220", ans: "132", pctTimes: "3520",
                 pctOfPart: "35.2", addPct: "128", subPct: "180", restPct: "60", pctDec: "0.4" },
      estimate: { min: 95, max: 165 }, segments: [20], marked: [8] }
  ],

  scene: { icon: "bike", caption: "The club in twentieths — the filled ones ride road bikes.",
           plural: "twentieths of the club", onWord: "ride road bikes", offWord: "ride something else" },

  problem: {
    text: "The cycling club is called the Ridgeway Riders. Some members ride mountain bikes with thick, chunky wheels. At the club, {{n1}} members ride skinny-tyred road bikes. The club meets {{n3}} times a week, rain or shine. That is {{n2}} percent of the whole club. How many members do NOT ride road bikes?",
    sentences: [
      "The cycling club is called the Ridgeway Riders.",
      "Some members ride mountain bikes with thick, chunky wheels.",
      "At the club, {{n1}} members ride skinny-tyred road bikes.",
      "The club meets {{n3}} times a week, rain or shine.",
      "That is {{n2}} percent of the whole club.",
      "How many members do NOT ride road bikes?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "84", unit: "members", role: "part", spoken: "84" },
      n2: { value: "35", unit: "percent", role: "percent", spoken: "35" },
      n3: { value: "3",  unit: "times a week", role: "distractor", spoken: "3" }
    },
    context: { setting: "cycling club", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A cycling club has members. Some of them ride road bikes and the rest ride something else. We want to know how many ride something else.",
      platformCheck: {
        sentences: [2, 4],
        why: "\"percent of the whole club\" ties the road cyclists to the club they belong to. The club is the whole, and a percent is a share of it.",
        kinds: "Everything counted here is members of the same club."
      },

      questions: {
        kinds: {
          ask: "This story counts members of the club, and it also counts how many times a week the club meets. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The meetings are the club's timetable. Everything the question is about is members of the same club.",
                         no:  "That would mean members and meetings were locked at a fixed rate, scaling together. Meeting more often would not sign anybody up." },
            different: { yes: "", no: "That would mean the meetings and the membership moved in proportion. Nothing in the story ties them." }
          }
        },
        moments: {
          ask: "Does the club gain or lose members during this story, or is the story describing how a fixed club splits by what people ride?",
          options: {
            changed: { text: "The club changes size", yes: "",
                       no:  "That would mean members joining or leaving between the start of the story and the end of it. Nobody does &mdash; the club is the club throughout." },
            steady:  { text: "A fixed club splits into groups",
                       yes: "Nobody joins and nobody leaves. A fixed group is being divided by the sort of bike each member rides.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just this club, or this club and a rival club held up beside it?",
          options: {
            single:   { yes: "A single club, divided by the bikes people ride.", no: "" },
            separate: { yes: "", no: "That would mean a rival club set beside this to measure the gap. There are only the Ridgeway Riders here." },
            paired:   { yes: "", no: "That would mean members locked to something else and scaled. The club is a fixed group, not a rate." }
          }
        },
        shape: {
          ask: "Is the club being shared out into parts, or is the same group repeating, or neither?",
          options: {
            cut:     { yes: "Road riders and everyone else are shares of the same club, and between them they account for all of it.", no: "" },
            repeat:  { yes: "", no: "That would mean the same set of members appearing again and again, with the question counting the sets. The club exists once, split by bike." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the road riders are a part of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the road riders, the whole club, and everyone who rides something else?",
          options: {
            onekind: { yes: "A whole cut into shares, all the way through. It takes more than a single step to get there, and every step is the same kind of situation.", no: "" },
            stacked: { yes: "", no: "Worth asking, and it does take more than a single step here &mdash; you go through the whole club to reach the rest. Both steps are the same kind of situation, though. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A club divided by what people ride is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the members who ride road bikes", needed: true },
        { token: "n2", describe: "what share of the whole club that is", needed: true },
        { token: "n3", describe: "how often the club meets", needed: false }
      ],
      relationship: "Road riders and everyone else together make the whole club. You are given the road-rider part and told what percent it is — the club itself is unknown. How often they meet has no bearing on how many there are.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many members do NOT ride road bikes.",
      commonMisreading: "Finding the size of the whole club and stopping there. That is a step on the way, not the answer.",
      options: [
        { text: "The number of members who do not ride road bikes", correct: true,
          why: "The other part. You have to find the whole club first, but the whole club is not what was asked for." },
        { text: "The total number of members in the club",
          why: "A necessary step, and the most common place to stop on this problem. The question says NOT road bikes." },
        { text: "{{n2}} percent of {{n1}}",
          why: "This reverses the problem. The {{n1}} is not the whole — the {{n1}} IS the {{n2}} percent." },
        { text: "How many members turn up at each meeting",
          why: "The meetings are scenery. Nothing in the problem links them to membership." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "One club — one whole — splitting into road riders and everyone else. Two parts making a whole.",
    distractors: [
      { line: "change",  whyWrong: "Nothing changes over time here. Nobody joins or leaves; the club just has two kinds of member at once. Change needs a before and an after." },
      { line: "compare", whyWrong: "It looks like a comparison because you end up subtracting. But road riders and the others are not two separate groups being measured against each other — they are two pieces of one club." },
      { line: "groups",  whyWrong: "Equal Groups needs the same amount repeating. There is no repeating group here — one club is being split into two unequal pieces." },
      { line: "ratio",   whyWrong: "There is only one kind of thing being counted: members. A rate needs two different units locked together, like miles per hour." }
    ],
    unknownCar: "other-part",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the road-bike riders", "the whole club", "everyone who doesn't ride a road bike"],
    unknownCarAnswer: "everyone who doesn't ride a road bike",
    unknownCarWhy: "You are handed the road-bike part. The rest of the club is what is asked for — and you have to go through the whole club to reach it.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "compare"],
      discriminator: "Ask whether the two amounts are pieces of one thing, or two separate things sitting side by side. Road riders are part of the club, not a rival to it."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* knownTotal is "?" and must stay that way: the whole club is step s1's
         answer, and the Model Yard prints knownTotal on the whole-car during
         the PLAN phase — the same screen as the estimate, before the Engine
         Room. Validator rule 10b enforces this one.

         segmentValue SHOWS the value of one part. Cycle 6 blanked it too, on
         the grounds that twenty times it is s1's answer in one move; that was
         reversed on the user's direction, along with the identical case in
         pw-helmet-savings, because a bar model with no numbers in it is not a
         model. model.js reveals a part's value only when the student marks that
         part, so it follows from their own action rather than being handed over
         on arrival. */
      bars: [{ label: "the whole club", segments: 20, segmentValue: "{{part}}", knownTotal: "?", unit: "members",
               marked: 7, markedTotal: "{{n1}} members", markedLabel: "the {{n1}} road-bike riders", restLabel: "everyone else" }],
      a11yDescription: "One bar stands for the whole club. It is split into 20 equal parts. You mark the parts that show the {{n1}} road-bike riders — that is {{marked}} of the twenty, because {{marked}} twentieths is {{n2}} percent. The parts left over show everyone else. They are what the question asks for. Two things are still blank: what one part is worth, and how big the whole club is.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before calculating — roughly how many members do you think do NOT ride road bikes?",
      reasonableMin: 120,
      reasonableMax: 190,
      /* Used to say the club was "somewhere around 240" — which is step one's
         answer, named on the Plan screen. An estimate for the FINAL number is
         what this asks for; handing over the intermediate one is not
         estimating, it is answering. Bounds only now, and both hold for every
         set because the percent is always under half. */
      modelReasoning: "{{n2}} percent is well under half, so the whole club has to be a good deal bigger than the {{n1}} road riders. And since road riders are the smaller share, everyone else must outnumber them — so your estimate should be comfortably above {{n1}}, without reaching the size of the whole club.",
      unit: "members"
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "First: how many members are in the whole club?",
        answer: { exact: "{{whole}}", unit: "members", acceptedForms: ["{{whole}}", "{{whole}} members"] },
        workedExplanation: "{{n1}} is {{n2}} percent of the club. So the club is {{n1}} divided by {{pctDec}}, which is {{whole}}. Check it: {{n2}} percent of {{whole}} is {{n1}}.",
        misconceptions: [
          { response: "{{pctOfPart}}", diagnosis: "You found {{n2}} percent OF {{n1}}. Read it again — the {{n1}} isn't the whole club, the {{n1}} IS the {{n2}} percent. The club must be bigger than {{n1}}, not smaller.", tag: "percent-reversal" },
          { response: "{{addPct}}",    diagnosis: "You added {{n2}} to {{n1}}. The {{n2}} is a percent, not a number of members — you can't add it to a headcount.", tag: "percent-as-count" },
          { response: "{{ans}}",       diagnosis: "That's the final answer, and it's correct — but you've skipped the step. The question here asked for the whole club first.", tag: "skipped-ahead" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "{{n1}} members is only {{n2}} percent of the club. So is the whole club bigger or smaller than {{n1}}?" },
          { rung: 2, type: "signal",   text: "If {{n2}} percent is {{n1}} members, then 1 percent is {{n1}} ÷ {{n2}}. The whole club is 100 of those." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ {{pctDec}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ {{pctDec}} = {{whole}}. There are {{whole}} members in the club." }
        ]
      },
      {
        id: "s2",
        prompt: "Now: how many members do NOT ride road bikes?",
        answer: { exact: "{{ans}}", unit: "members", acceptedForms: ["{{ans}}", "{{ans}} members"] },
        workedExplanation: "The club is {{whole}} and {{n1}} of them ride road bikes. {{whole}} − {{n1}} = {{ans}}. Check it another way: the others are {{restPct}} percent of the club, and {{restPct}} percent of {{whole}} is {{ans}}.",
        misconceptions: [
          { response: "{{whole}}",  diagnosis: "That's the whole club — the step you just finished. The question asks for the part of it that doesn't ride road bikes.", tag: "stopped-at-whole" },
          { response: "{{n1}}",     diagnosis: "That's the road-bike riders, which you were given. A number handed to you can't be the answer.", tag: "returned-given-value" },
          { response: "{{subPct}}", diagnosis: "You subtracted {{n2}} instead of {{n1}}. The {{n2}} is a percent — the actual number of road riders is {{n1}}.", tag: "percent-as-count" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "You know the whole club now, and you know how many ride road bikes. What's left?" },
          { rung: 2, type: "signal",   text: "Take the road-bike riders away from the whole club." },
          { rung: 3, type: "coupling", text: "{{whole}} − {{n1}} = ___" },
          { rung: 4, type: "route",    text: "{{whole}} − {{n1}} = {{ans}}. So {{ans}} members don't ride road bikes." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "members", acceptedForms: ["{{ans}}", "{{ans}} members"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many do NOT ride road bikes — not the size of the club, and not the road riders.",
    unitsCheck: "members",
    reasonablenessCheck: "{{ans}} out of a club of {{whole}}. Road riders were the smaller share at {{n2}} percent, so the bigger number belonging to everyone else looks right.",
    reasonablenessFailExample: "If you got {{pctOfPart}}, that's fewer people than the {{n1}} you started with — impossible, since the non-riders are the larger group.",
    connection: "Same shape as the band problem: you're handed one part and its share, and asked for the other part. Find the whole, then take the known part off it."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved independently and checked by two further routes — the percent taken back out of the recovered whole, and the complement taken as its own percentage: 84/0.35=240, 240-84=156 (0.35 x 240 = 84; 65% of 240 = 156); 45/0.25=180, 135 (0.25 x 180 = 45; 75% of 180 = 135); 36/0.20=180, 144 (80% of 180 = 144); 88/0.40=220, 132 (60% of 220 = 132). Every percent is a multiple of 5, which the twenty-part bar requires, and every percent is under 50, which the reasonableness check, the estimate reasoning and the fail example all depend on. The bar's shaded count is tied to the percent by check (mark1 x 5 = n2) and to the headcount by another (mark1 x part = n1). Estimate brackets contain the final answer: 120-190/156, 100-165/135, 105-175/144, 95-165/132. Every misconception value re-derived per set and checked distinct within its step; pctOfPart is smaller than n1 in every set, which the Arrivals fail-example asserts. Original 2026-07-29 verification stands for set 1." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-29", notes: "Tier-2 vocabulary. a11yDescription present. No grade level named." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "2026-07-29 findings stand (distractors explain structure, hint rungs escalate, distracting quantity declared needed:false). FIXED 2026-08-01: the estimate's modelReasoning put the whole club 'somewhere around 240' — step one's answer, named on the Plan screen before the Engine Room asked for it. An estimate is for the final number; handing over the intermediate one is answering, not estimating. Replaced with bounds that hold for every set." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-29",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (knownTotal was s1 answer) and a11yDescription rewritten to match. The 2026-07-29 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
