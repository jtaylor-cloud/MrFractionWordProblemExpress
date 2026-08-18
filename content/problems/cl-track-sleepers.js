/* CROSSOVER ISLAND · problem 6 · EQUAL GROUPS → CHANGE · the transfer is a BUILT TOTAL
   `CHALLENGE-MODE.md` §5.2. One of the two problems that close the island's
   coverage hole: as built at five stops, change and equal groups each appeared
   once and on one side of a crossover only. This problem puts equal groups on
   the FIRST side and change on the second; `cl-carriage-clean` does change
   second again from a rate.

   NO STOP OF ITS OWN. This is pool content — it shares a stop with an existing
   problem so a second visit to the island differs by problem rather than only
   by number set. Until `Selector.buildIslandStop` learns to choose rather than
   name, it is published, validated and swept but unreachable. That is
   deliberate and it is the order the plan sets: content, then pooling, then one
   art pass over all seven.

   WHY THE FIRST HALF IS THE EASIER ONE, DELIBERATELY. Equal Groups is the
   gentlest opening on the island: one multiplication, no direction to choose.
   The work here is in the second half, which applies TWO changes to the total —
   sleepers out, sleepers in — so a student who finds the seam still has to
   notice the change is not a single event. Problems 1 to 5 all have a
   single-move second half; this is the first that does not.

   THE TRANSFER IS BUILT RATHER THAN FOUND. The section's sleeper count is
   never stated: it is manufactured by repeating one number. That makes it the
   fifth distinct shape on the island — scaled, divided up, left over, compared
   against, assembled from a rate, and now multiplied into existence.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 12 × 15 = 180 · 180 − 38 = 142 · 142 + 26 = 168  (168 − 26 + 38 = 180 ✓ · 180 ÷ 12 = 15 ✓)
     set 2: 14 × 12 = 168 · 168 − 45 = 123 · 123 + 31 = 154  (154 − 31 + 45 = 168 ✓ · 168 ÷ 14 = 12 ✓)
     set 3: 16 × 13 = 208 · 208 − 52 = 156 · 156 + 37 = 193  (193 − 37 + 52 = 208 ✓ · 208 ÷ 16 = 13 ✓)
     set 4: 11 × 16 = 176 · 176 − 41 = 135 · 135 + 29 = 164  (164 − 29 + 41 = 176 ✓ · 176 ÷ 11 = 16 ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - more sleepers are lifted than put back, so the section ends smaller than
       it started and the change is not a wash;
     - the lifted count must not exceed the section's total;
     - the answer may not be 1, 2 or 5 — the island rule from
       `cl-platform-planters`;
     - the answer, the transfer, both intermediate values and all four givens
       are distinct inside every set, so each misconception diagnoses one
       mistake and one only.

   Values that may not appear in any pre-solve copy here: the totals 180, 168,
   208, 176 and the answers 168, 154, 193, 164. Note that set 2's total and set
   1's answer are both 168 — different sets, never materialised together, and
   the leak scan works per materialisation. */
MF.registerProblem({
  id: "cl-track-sleepers",
  schemaVersion: 1,
  status: "published",
  title: "How many sleepers are on the section when the work is finished",
  line: "groups",
  topics: ["two-line", "crossover", "equal-groups", "change", "transfer"],
  steps: 2,

  pair: {
    first: "groups",
    second: "change",
    transfer: "how many sleepers are on the whole section to start with",

    crossoverSentence: 4,
    crossoverWhy: "Everything before it builds the section out of the same thing over and over — a length, and a length, and a length. From there nothing is being built up any more; the section already exists and things start happening to it.",
    firstWhy: "The same amount laid down again and again, with the question being what it comes to. Nothing is compared, nothing is left over, and no piece is cut off anything.",
    secondWhy: "An amount that ends up different from how it started. Sleepers come out and sleepers go in, and it is the same section before and after.",
    readWhy: "A single story doing separate jobs: a section built out of repeated lengths first, then a winter's work done to it. The earlier part builds the total, and the later part cannot start without it, because that total is what the winter happens to."
  },

  unknownCar: "result",
  context: "sleepers",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n1", "*", "n2", "=", "total"],
    ["total", "/", "n1", "=", "n2"],
    ["total", "-", "n3", "=", "afterLift"],
    ["afterLift", "+", "n4", "=", "ans"],
    ["ans", "-", "n4", "=", "afterLift"],
    ["n1", "+", "n2", "=", "mSum"],
    ["afterLift", "-", "n4", "=", "mBothOff"]
  ],

  numberSets: [
    { numbers: { n1: "12", n2: "15", n3: "38", n4: "26", n5: "7" },
      derived: { total: "180", afterLift: "142", ans: "168", mSum: "27", mBothOff: "116" },
      estimate: { min: 84, max: 336 } },
    { numbers: { n1: "14", n2: "12", n3: "45", n4: "31", n5: "9" },
      derived: { total: "168", afterLift: "123", ans: "154", mSum: "26", mBothOff: "92" },
      estimate: { min: 77, max: 308 } },
    { numbers: { n1: "16", n2: "13", n3: "52", n4: "37", n5: "6" },
      derived: { total: "208", afterLift: "156", ans: "193", mSum: "29", mBothOff: "119" },
      estimate: { min: 96, max: 386 } },
    { numbers: { n1: "11", n2: "16", n3: "41", n4: "29", n5: "8" },
      derived: { total: "176", afterLift: "135", ans: "164", mSum: "27", mBothOff: "106" },
      estimate: { min: 82, max: 328 } }
  ],

  problem: {
    text: "The permanent way gang is working along the coast section of the line. The section is made of {{n1}} rail lengths. Every length sits on {{n2}} sleepers. The gang keeps {{n5}} shovels in the van. Over the winter {{n3}} of the section's sleepers are lifted out and burned. {{n4}} new concrete sleepers are put in. How many sleepers are on the section when the work is finished?",
    sentences: [
      "The permanent way gang is working along the coast section of the line.",
      "The section is made of {{n1}} rail lengths.",
      "Every length sits on {{n2}} sleepers.",
      "The gang keeps {{n5}} shovels in the van.",
      "Over the winter {{n3}} of the section's sleepers are lifted out and burned.",
      "{{n4}} new concrete sleepers are put in.",
      "How many sleepers are on the section when the work is finished?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "12", unit: "rail lengths", role: "groups",     spoken: "12" },
      n2: { value: "15", unit: "sleepers",     role: "size",       spoken: "15" },
      n3: { value: "38", unit: "sleepers",     role: "decrease",   spoken: "38" },
      n4: { value: "26", unit: "sleepers",     role: "increase",   spoken: "26" },
      n5: { value: "7",  unit: "shovels",      role: "distractor", spoken: "7" }
    },
    context: { setting: "railway permanent way", requiresCulturalKnowledge: false }
  },

  /* The island's own library exists now. Sleepers ARE the counted quantity, so
     they are drawn in perspective running off both edges and overlapping toward
     the horizon — uncountable by construction rather than by luck. The only
     motion is one sleeper swinging on the crane: a thing happening, never a
     total accumulating. */
  scene: {
    mode: "anim", art: "sleepers",
    caption: "Track running away past both ends of the frame on its sleepers, with a gang hut and a crane beside the line."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A stretch of track is made of rail lengths, and every length has the same number of sleepers under it. Then over the winter some sleepers are taken out and some new ones are put in, and we want to know what the section ends up with.",
      platformCheck: {
        sentences: [1, 2, 4, 5],
        why: "The earlier ones build the section: how many lengths there are, and what sits under each. The later ones stop building anything and describe a winter's work done to the section that is already there. Notice what is never stated: how many sleepers the section has to begin with, which is the amount the winter happens to.",
        kinds: "Sleepers throughout, first as the same helping under every length and then as an amount being changed."
      },

      questions: {
        fit: {
          ask: "Does a single kind of situation cover this whole story — the lengths and their sleepers, and the winter's work?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it builds a section out of the same amount over and over, and after that it takes sleepers out of the section and puts others in. Read it again and find the sentence where it changes." },
            stacked: { yes: "The same amount laid down again and again is a kind of situation. An amount ending up different from how it started is a different kind. This story builds the section first and works on it afterwards — and what it builds is the very thing the winter changes.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many sleepers sit under one rail length", needed: true },
        { token: "n3", describe: "how many sleepers are lifted out over the winter", needed: true },
        { token: "n5", describe: "how many shovels the gang keeps in the van", needed: false },
        { token: "n1", describe: "how many rail lengths the section is made of", needed: true },
        { token: "n4", describe: "how many new sleepers are put in", needed: true }
      ],
      relationship: "The lengths and the sleepers-per-length belong together and build something neither states on its own. The lifted sleepers and the new ones belong to a different pairing entirely: they are things done to the section once it exists, one making it smaller and the other making it bigger. The shovels belong to nothing.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many sleepers are on the section after the winter's work.",
      commonMisreading: "Working out how many sleepers the section started with and stopping there, which answers what was under the track before any work happened.",
      options: [
        { text: "How many sleepers the section started with",
          why: "You will need that, and nothing states it — but read the last sentence again. It asks what is there when the work is FINISHED, which is after both lots of sleepers have moved." },
        { text: "How many sleepers are on the section at the end", correct: true,
          why: "The section after the winter. That is the only thing here nothing gives you and nothing else stands in for." },
        { text: "How many sleepers were taken out",
          why: "Handed to you outright in its own sentence. It is one of the things that happened, not the count you are asked for." },
        { text: "How many sleepers sit under one rail length",
          why: "Also given, and it is the amount that repeats to build the section rather than anything about the winter." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "groups",
    whyCorrect: "This story starts on Equal Groups Express — the same helping of sleepers under every length, repeated to make a section. It does not stay there. Once the section's count is known, sleepers coming out and going in leave it different from how it started, and that is the Change Line. Two lines, in that order, joined at a total the story never states.",
    distractors: [
      { line: "change",    whyWrong: "Half right, and worth saying so: the second half of this story really is a Change. But the story does not open there. Before anything is lifted or laid, a section has to be built out of repeated lengths, and it is what that builds that the winter changes." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. Sleepers leave and sleepers arrive, but the story never sets two amounts side by side or asks which is bigger — it asks what one amount ends up as." },
      { line: "partwhole", whyWrong: "There is no named total that the pieces add up to. The lifted sleepers and the new ones are not parts of the section; they are things that happen to it, one going out and one coming in." },
      { line: "ratio",     whyWrong: "Nothing holds at any size. The sleepers per length are the same helping repeated, not a relationship between two different quantities — and the winter's counts are fixed numbers of sleepers, not a proportion of anything." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many sleepers the section ends up with",
      "how many sleepers are lifted out",
      "how many sleepers sit under one length"
    ],
    unknownCarAnswer: "how many sleepers the section ends up with",
    unknownCarWhy: "Every number in the story is given: the lengths, the sleepers under one, and both lots that move over the winter. What the section comes to at the end is not — and neither is what it started with, which is why this one takes two moves."
  },

  signalBox: {
    /* The first half's picture: the tray of identical lengths with a bracket
       underneath carrying a question mark. `unknownIs: "total"` because how
       many lengths there are is stated outright, so the model may show them
       all — what it must not do is total them, which is the Engine Room's. */
    groupsModel: {
      title: "The same amount, again",
      heading: "One length's sleepers, laid down over and over",
      prompt: "One of these amounts is the one that repeats. Tap it.",
      groupsToken: "n1",
      sizeToken: "n2",
      unknownIs: "total",
      repeater: "size",
      totalLabel: "on the section",
      questionLabel: "how many sleepers that comes to",
      settledLabel: "so the question is",
      choices: [
        { key: "size",   label: "Sleepers under one length", said: "{{n2}}" },
        { key: "groups", label: "Rail lengths in the section", said: "{{n1}}" }
      ],
      why: "Every length sits on the same {{n2}} sleepers, so that is the amount being laid down again and again. The {{n1}} lengths are how MANY times you lay it down — they are the count, not the amount.",
      whyWrong: {
        groups: "That is how many times the amount repeats, not the amount itself. Ask which number you could lay along the track over and over without it changing: it is what sits under one length."
      },
      a11yDescription: "A run of {{n1}} identical lengths, each labelled {{n2}} sleepers, with a bracket underneath spanning all of them. The bracket carries a question mark, because what they come to is the thing nobody states.",
      settledSay: "The amount that repeats is what is under one length. How many lengths there are is the other number — and what they come to is what the rest of this story happens to."
    },

    crossover: {
      heading: "What crosses over?",
      prompt: "The first picture is finished, and the story is not. Something from that picture is the number the rest of this problem needs. Which one?",
      cellLabel: "the section's sleepers",
      options: [
        { text: "What the bracket comes to", correct: true,
          why: "The bracket spans every length, so what it comes to is the whole section's sleepers — and that is the only thing the first picture produced. The winter happens to exactly that, so nothing can be lifted or laid until it is known." },
        { text: "The sleepers under one length",
          why: "Given to you in the story, so the first picture did not produce it. It is the amount that repeats — the ingredient rather than the result." },
        { text: "The number of rail lengths",
          why: "Also given, and it is a count of lengths rather than of sleepers. The winter takes sleepers out, not lengths." },
        { text: "The sleepers lifted out over the winter",
          why: "That belongs to the second half already — printed in the story and waiting below. The crossover is what the FIRST half hands over." }
      ],
      settledSay: "That is the join. The first picture ends with the whole section's sleepers, and the second picture starts by taking some away.",
      second: {
        title: "The second picture",
        heading: "A section, waiting to be counted",
        givenHeading: "What you were told",
        targetHeading: "What you need",
        rows: [
          { label: "Lifted out",     key: "out",      given: "{{n3}}" },
          { label: "Put back in",    key: "in",       given: "{{n4}}" },
          { label: "On the section", key: "transfer", given: "not stated" }
        ],
        waiting: "Both of the winter's numbers are known and the thing they happen to is not. That is what makes this different from a Change problem on the mainland, where the story tells you what you started with. Here the starting amount is the number the first picture worked out — so until you have it, nothing can be taken away from anything.",
        a11yDescription: "A table of three rows: sleepers lifted out, sleepers put back in, and the section itself. The left column holds the two winter counts the story states; the section is not stated. The right column is empty on every row, and the bottom cell is labelled as the section's sleepers once you have named it. Nothing in this picture is calculated."
      }
    },

    estimate: {
      prompt: "Before calculating — roughly how many sleepers do you think the section ends up with?",
      reasonableMin: 84,
      reasonableMax: 336,
      modelReasoning: "Round the lengths and the sleepers under one to the nearest ten and multiply — that is roughly the section. Then take off roughly what was lifted and put back roughly what was laid. Rough all the way; you are after the right sort of size, not the answer.",
      unit: "sleepers"
    }
  },

  /* The sixth disguise. Here the halfway number is the section BEFORE the
     winter — a real count of real sleepers on the right stretch of track, in
     the same units as the answer, differing from it only by what happened. It
     is the closest an island transfer has come to looking like the answer. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out what the section started with and it was right. Why was it not the answer?",
    why: "Because that is the section before the winter, and the question asked what is there when the work is finished. Same track, same units, same kind of number — the only difference is that a winter happened in between. Nothing about it looks unfinished, which is exactly the trouble with it."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "First, how many sleepers are on the whole section before the winter's work?",
        answer: { exact: "{{total}}", unit: "sleepers", acceptedForms: ["{{total}}", "{{total}} sleepers"], preferredForm: "{{total}}" },
        workedExplanation: "There are {{n1}} rail lengths and every one of them sits on {{n2}} sleepers, so the same amount is laid down {{n1}} times: {{n1}} × {{n2}} = {{total}} sleepers. Check it backwards — {{total}} ÷ {{n1}} = {{n2}}, the sleepers under one length exactly.",
        hints: [
          { rung: 1, text: "Every length has the same number of sleepers under it. So the section is that amount, over and over. How many times?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The bracket spans every length, and what it comes to is what you want." },
          { rung: 3, text: "{{n1}} lengths, each on {{n2}} sleepers: {{n1}} × {{n2}} = ___" },
          { rung: 4, text: "{{n1}} × {{n2}} = {{total}}. The section starts with {{total}} sleepers." }
        ],
        misconceptions: [
          { response: "{{mSum}}", diagnosis: "You added the lengths to the sleepers-under-one. Those two count different things — one is how many times, the other is how much each time — and adding them describes nothing on the track. The same amount repeated is a multiplication.", tag: "added-not-multiplied" },
          { response: "{{n2}}", diagnosis: "That is what sits under a single length, which the story gave you. The section is made of {{n1}} of those.", tag: "gave-back-the-size" },
          { response: "{{n1}}", diagnosis: "That is how many rail lengths there are, which the story gave you. The question is about sleepers, and each length brings {{n2}} of them.", tag: "gave-back-the-groups" }
        ]
      },
      {
        id: "s2",
        prompt: "The section starts with {{total}} sleepers. Over the winter {{n3}} are lifted out and {{n4}} are put in. How many are on it when the work is finished?",
        answer: { exact: "{{ans}}", unit: "sleepers", acceptedForms: ["{{ans}}", "{{ans}} sleepers"], preferredForm: "{{ans}}" },
        workedExplanation: "Start at {{total}}. Lifting {{n3}} out takes it to {{afterLift}}, and putting {{n4}} in brings it to {{ans}}: {{total}} − {{n3}} + {{n4}} = {{ans}} sleepers. Check it backwards — {{ans}} − {{n4}} + {{n3}} = {{total}}, the section before the winter exactly.",
        hints: [
          { rung: 1, text: "Two things happen to the section over the winter. Which one makes it smaller, and which makes it bigger?" },
          { rung: 2, text: "Start from what the section had, take off the ones that were lifted, then add the ones that were laid." },
          { rung: 3, text: "{{total}} − {{n3}} = {{afterLift}}, and then {{afterLift}} + {{n4}} = ___" },
          { rung: 4, text: "{{total}} − {{n3}} + {{n4}} = {{ans}}. The section finishes with {{ans}} sleepers." }
        ],
        misconceptions: [
          { response: "{{total}}", diagnosis: "That is the number you just worked out, and it was right — but it is the section BEFORE the winter. The question asks what is there when the work is finished. Same track and same units, so nothing about it looks unfinished; the only difference is that a winter happened.", tag: "stopped-at-the-transfer" },
          { response: "{{afterLift}}", diagnosis: "You lifted the old sleepers out and stopped. Two things happened over the winter, not one — the new concrete sleepers have to go back in before the section is finished.", tag: "half-the-change" },
          { response: "{{mBothOff}}", diagnosis: "You took both numbers off. The new sleepers were PUT IN, so they make the section bigger rather than smaller. Only the lifted ones come off.", tag: "both-changes-subtracted" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "sleepers", acceptedForms: ["{{ans}}", "{{ans}} sleepers"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked what is on the section when the work is FINISHED. If your answer is {{total}}, that is what it started with — the middle of this problem rather than the end of it.",
    unitsCheck: "sleepers",
    reasonablenessCheck: "{{ans}} sleepers at the end. Check it backwards: {{ans}} − {{n4}} + {{n3}} = {{total}}, the section before the winter — and {{total}} ÷ {{n1}} = {{n2}}, the sleepers under one length exactly. Both halves check out.",
    reasonablenessFailExample: "If you got {{mBothOff}}, you would have taken the new sleepers off as well as the old ones, leaving a stretch of track with fewer sleepers than anybody removed from it.",
    connection: "The number carried across the middle here was built rather than found — nothing in the story states the section's sleepers, you made them by repeating one number. It is still the same shape as every stop on this island: correct, necessary, and an answer to a question nobody asked."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story and verified both ways: 12x15=180, 180-38=142, 142+26=168 (168-26+38=180, 180/12=15); 14x12=168, -45=123, +31=154; 16x13=208, -52=156, +37=193; 11x16=176, -41=135, +29=164. More is lifted than laid in every set, so the section ends smaller than it started. No answer is 1, 2 or 5. Within every set the answer, the transfer, both intermediates and all four givens are distinct." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No scene art yet - the island's own library is a later pass." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Equal Groups -> Change, and pool content rather than a stop of its own. The first half is deliberately the gentlest opening on the island - one multiplication, no direction to choose - because the work is in the second half, which applies TWO changes where problems 1 to 5 all have a single-move second half. The transfer is BUILT rather than found: nothing states the section's sleepers, they are manufactured by repeating one number, which is the fifth distinct shape of transfer here. The halfway number is the closest yet to looking like the answer - same track, same units, differing only by what happened in between." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Sixth of seven island problems. Unreachable until Selector.buildIslandStop learns to choose from a pool - published and swept but with no stop pointing at it, which is the plan's order: content, pooling, then one art pass." }
  }
});
