/* Ratio & Rate Rail · total from one share · independent · HUB-READY
   The Terminus Hub problem for this line. Two moves hidden in one
   question: the given amount is a SHARE of the mixture, not the mixture,
   so the student has to find what one part is worth before anything else
   is reachable. Stopping at the syrup is the near-miss to expect.

   `stationRoles` is deliberately EMPTY. selector.js treats an empty roles
   list as an authorial opt-out and will never place the problem at a
   station, which is what keeps a fresh problem in reserve for the Hub.
   MF.validate() warns about it; the warning is expected here and only here.

   FOUR NUMBER SETS. Three things have to hold in every one of them, and none
   of them is automatic:
     - the water share divides exactly, so a part is a whole number of litres;
     - water is the BIGGER share (n2 > n1), which the estimate reasoning and
       the "you doubled the water" misconception both depend on;
     - n2 x n2 must not land on n3, or the "x n2" distractor becomes true.

   Verified both ways for each set — the division that gives a part, and the
   rebuild that puts the recipe back:
     12/3 = 4,  (2+3) x 4 = 20   syrup 8,  8+12 = 20,  8:12 = 2:3
     20/4 = 5,  (3+4) x 5 = 35   syrup 15, 15+20 = 35, 15:20 = 3:4
     15/5 = 3,  (2+5) x 3 = 21   syrup 6,  6+15 = 21,  6:15 = 2:5
     30/5 = 6,  (4+5) x 6 = 54   syrup 24, 24+30 = 54, 24:30 = 4:5

   Both segmentValue and knownTotal are "?" because the part and the total are
   the two things being worked out; the picture shows the structure and
   nothing else. */
MF.registerProblem({
  id: "rr-cordial-mix",
  schemaVersion: 1,
  status: "published",
  title: "How much drink altogether",
  line: "ratio",
  topics: ["ratio-parts", "total-from-a-share", "scale-factor"],
  steps: 1,

  unknownCar: "total-from-share",
  context: "catering",
  fadeLevel: "independent",
  stationRoles: [],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "The number you are given belongs to the water's share of the recipe — not to a single part, and not to the whole mixture. A drawing makes that immediately visible; reasoning in words about it usually ends with the student multiplying the wrong thing. Drawing first is what pays here.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-07-30" },

  numberChecks: [
    ["n3", "/", "n2", "=", "perPart"],
    ["n2", "*", "perPart", "=", "n3"],
    ["n1", "+", "n2", "=", "totalParts"],
    ["totalParts", "*", "perPart", "=", "ans"],
    ["n1", "*", "perPart", "=", "syrup"],
    ["syrup", "+", "n3", "=", "ans"],
    ["n3", "*", "2", "=", "double"],
    ["n3", "+", "perPart", "=", "wrongParts"],
    ["n3", "-", "n2", "=", "addDiff"],
    ["n1", "+", "addDiff", "=", "addSyrup"],
    ["n2", "*", "n2", "=", "n2sq"],
    /* The bar is drawn in as many parts as the recipe has, with the water's
       share shaded. Both are stated as checks, so a picture that disagrees
       with its own set cannot pass — mark1 x perPart is the water you were
       given, and that is exactly what the shading claims. */
    ["n1", "+", "n2", "=", "seg1"],
    ["seg1", "*", "perPart", "=", "ans"],
    ["mark1", "*", "perPart", "=", "n3"]
  ],

  numberSets: [
    { numbers: { n1: "2", n2: "3", n3: "12", n4: "42" },
      derived: { perPart: "4", totalParts: "5", ans: "20", syrup: "8", double: "24",
                 wrongParts: "16", addDiff: "9", addSyrup: "11", n2sq: "9" },
      estimate: { min: 14, max: 30 }, segments: [5], marked: [3] },
    { numbers: { n1: "3", n2: "4", n3: "20", n4: "36" },
      derived: { perPart: "5", totalParts: "7", ans: "35", syrup: "15", double: "40",
                 wrongParts: "25", addDiff: "16", addSyrup: "19", n2sq: "16" },
      estimate: { min: 25, max: 50 }, segments: [7], marked: [4] },
    { numbers: { n1: "2", n2: "5", n3: "15", n4: "48" },
      derived: { perPart: "3", totalParts: "7", ans: "21", syrup: "6", double: "30",
                 wrongParts: "18", addDiff: "10", addSyrup: "12", n2sq: "25" },
      estimate: { min: 16, max: 32 }, segments: [7], marked: [5] },
    { numbers: { n1: "4", n2: "5", n3: "30", n4: "64" },
      derived: { perPart: "6", totalParts: "9", ans: "54", syrup: "24", double: "60",
                 wrongParts: "36", addDiff: "25", addSyrup: "29", n2sq: "25" },
      estimate: { min: 40, max: 75 }, segments: [9], marked: [5] }
  ],

  scene: {
    mode: "anim", art: "urn",
    caption: "Syrup and water pouring into the urn together, and the level climbing as both go in."
  },

  problem: {
    text: "The station cafe mixes its own lemon cordial in a big urn for the summer fair. The recipe never changes: for every {{n1}} litres of cordial syrup they add {{n2}} litres of water. This time they used {{n3}} litres of water. The cafe has {{n4}} tall glasses ready on the counter. How many litres of drink did they make altogether?",
    sentences: [
      "The station cafe mixes its own lemon cordial in a big urn for the summer fair.",
      "The recipe never changes: for every {{n1}} litres of cordial syrup they add {{n2}} litres of water.",
      "This time they used {{n3}} litres of water.",
      "The cafe has {{n4}} tall glasses ready on the counter.",
      "How many litres of drink did they make altogether?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "2",  unit: "litres of syrup", role: "ratio-term",  spoken: "2" },
      n2: { value: "3",  unit: "litres of water", role: "ratio-term",  spoken: "3" },
      n3: { value: "12", unit: "litres of water", role: "scaled-term", spoken: "12" },
      n4: { value: "42", unit: "glasses",         role: "distractor",  spoken: "42" }
    },
    context: { setting: "station cafe", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A cafe mixes syrup and water in a fixed recipe to make a drink. We are told how much water went in this time, and we want to know how much drink came out in total.",
      /* The line that makes "different kinds" honest: syrup and water are both
         in litres. Kinds, not units, is the test — which is why the checklist
         noun is "Kinds". Said plainly here rather than glossed over. */
      platformCheck: {
        sentences: [1, 2],
        why: "\"The recipe never changes\", and then \"for every\" — that is the lock. Syrup and water keep their pairing however big the urn gets.",
        kinds: "Syrup and water — different things, even though both are measured in litres. It is the kinds that matter, not the units."
      },

      /* The one problem on the site where a ratio has MATCHING units, so its
         `kinds` question is the place to teach that a ratio needs different
         KINDS, not different units. `same.no` validates the reading first,
         because reading "both are litres" is careful, not careless. */
      questions: {
        kinds: {
          ask: "This story measures syrup in litres and water in litres, and it also counts the glasses waiting on the counter. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "Both are litres, but syrup and water are different things, and the recipe pins them to each other. It is the KINDS that matter here, not the units they happen to be measured in.", no: "" },
            same:      { yes: "", no: "A careful reading, and the units really are the same &mdash; litres of each. But syrup and water are still different things, and the recipe fixes how much of each goes with the other. A ratio needs different kinds, not different units." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started, or does the recipe hold the same relationship however big the urn is?",
          options: {
            steady:  { yes: "Nothing is added to or taken from an amount you already had. The recipe holds the same pairing whatever size batch the cafe mixes.", no: "" },
            changed: { yes: "", no: "That would mean an amount ending up different from how it started. Mixing a bigger batch is not a before-and-after &mdash; it is the same recipe at a larger size." }
          }
        },
        things: {
          ask: "Is the story keeping track of a single amount, of separate amounts being measured against each other, or of syrup and water going together?",
          options: {
            paired:   { yes: "Not really separate things at all. Syrup and water go together in a pairing the recipe never changes.", no: "" },
            single:   { yes: "", no: "Both are litres, which makes this tempting. But there are different liquids here and the recipe needs both of them." },
            separate: { yes: "", no: "That would mean syrup and water compared to see which there is more of. The recipe locks them together instead." }
          }
        },
        shape: {
          ask: "Is the drink being shared out into parts, or is the same measure repeated over and over, or neither?",
          options: {
            neither: { yes: "The question asks what goes with what, not how a whole splits or how many identical measures there are.", no: "" },
            repeat:  { yes: "", no: "Close &mdash; a big urn is the recipe taken over and over. But Equal Groups would be counting how many recipes went in. Here the pairing itself is the situation." },
            cut:     { yes: "", no: "Tempting, because the finished drink IS made of syrup and water together. But you are not given the finished amount and asked for a share of it &mdash; you are given a fixed pairing and asked to scale it." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the recipe, the water they used this time, and the drink that came out?",
          options: {
            onekind: { yes: "A fixed relationship being scaled, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a fixed recipe being scaled and nothing else stacked on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Syrup that goes with water is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the syrup in the recipe", needed: true },
        { token: "n2", describe: "the water that goes with it", needed: true },
        { token: "n3", describe: "the water they actually used", needed: true },
        { token: "n4", describe: "how many glasses are on the counter", needed: false }
      ],
      relationship: "The recipe fixes syrup against water, so the mixture always splits the same way: {{n1}} parts syrup for every {{n2}} parts water, {{totalParts}} parts in all. The water they used is the water's share, not the whole mixture — which means it can tell you what one part is worth, and from there what all the parts come to. The glasses have nothing to do with how much was mixed.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The total number of litres of drink — syrup and water together.",
      commonMisreading: "Working out the syrup and answering with that. It is the harder half of the problem, which makes stopping there feel like finishing.",
      options: [
        { text: "The total litres of syrup and water together", correct: true,
          why: "The whole mixture. Everything that went into the urn, which is every part of the recipe, not just the ones you were told about." },
        { text: "The litres of cordial syrup they poured into the urn",
          why: "A real step and the most likely place to stop, because it takes the most work to reach. The question asks for the whole drink, not the syrup." },
        { text: "How many litres one part is worth",
          why: "The first step. It unlocks the rest, but on its own it is a much smaller number than any amount actually in the urn." },
        { text: "How much drink goes in each glass",
          why: "The glasses are scenery. Nothing in the problem says the drink was shared out between them." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Syrup and water are locked in a fixed relationship that holds however much you mix. Being told one of them fixes the other and fixes the total, which is exactly how a ratio behaves.",
    distractors: [
      { line: "partwhole", whyWrong: "The closest call here, because syrup and water really are two parts of one urn. What makes it Ratio is that you are given neither the whole nor a plain fraction of it — you are given a fixed relationship between the two parts, and the whole has to be rebuilt from it." },
      { line: "change",    whyWrong: "Nothing happens over time. The recipe is the same before and after; there is no starting amount that becomes a different amount." },
      { line: "compare",   whyWrong: "You are not asked how much more water there is than syrup. The two are tied together, not being measured against one another." },
      { line: "groups",    whyWrong: "There is no group repeating a fixed number of times. Two different liquids are held in a fixed relationship, which is a ratio rather than the same amount counted over and over." }
    ],
    unknownCar: "total-from-share",
    unknownCarPrompt: "Which car is missing?",
    /* Levelled for length — the answer ran 28 characters against 20 and 20,
       so the wordiest option was the right one without reading it. */
    unknownCarOptions: ["the water poured into the urn", "the syrup poured into the urn", "the whole mixture in the urn"],
    unknownCarAnswer: "the whole mixture in the urn",
    unknownCarWhy: "The water is stated and the syrup can be worked out from the recipe. The total is the one car nothing gives you directly — and reaching it means going through both of the others.",
    supportAfter3Attempts: {
      narrowTo: ["ratio", "partwhole"],
      discriminator: "Ask what you were actually handed. Part-Whole gives you the whole, or a fraction of it. Here you were given one part measured against another part, with the whole never mentioned — that is a ratio."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      bars: [{ label: "everything in the urn", segments: 5, segmentValue: "?", knownTotal: "?", unit: "parts",
               marked: 3, markedLabel: "water", restLabel: "cordial syrup" }],
      a11yDescription: "One bar for everything in the urn, split into {{totalParts}} equal parts, because the recipe uses {{n1}} parts syrup to {{n2}} parts water and that makes {{totalParts}} parts in all. {{n2}} of the parts are marked as water, and those together are the {{n3}} litres you were told about. Neither the size of a part nor the total is filled in: those are the two things you are working out.",
      authored: "generated"
    },
    /* The recipe is given in PARTS, so the table's first column is parts and
       its second is litres. That is the step students skip: they see the two
       recipe numbers and start multiplying litres by them. Naming the first
       column as parts makes the two columns different kinds of thing, on
       purpose. */
    ratioTable: {
      prompt: "The recipe is written in parts, not litres. Put the parts next to what actually went in the urn.",
      givenHeading: "The recipe, in parts",
      targetHeading: "In the urn, in litres",
      rows: [
        { label: "cordial syrup", given: "{{n1}}", target: "?" },
        { label: "water",         given: "{{n2}}", target: "{{n3}}" }
      ],
      question: "What takes the water from {{n2}} parts to {{n3}} litres?",
      options: [
        { text: "× {{perPart}}", correct: true,
          why: "That is what each part is worth in litres. The same multiplication then runs along the syrup row — and the two rows together are what fills the urn." },
        { text: "+ {{addDiff}}",
          why: "It reaches {{n3}}, but adding breaks the recipe. The same addition on the syrup would give {{addSyrup}} litres against {{n3}} of water — far closer to equal than the recipe allows." },
        { text: "× {{n2}}",
          why: "{{n2}} lots of {{n2}} is {{n2sq}}, not {{n3}}. Check the multiplier against the row you can see before carrying it across." },
        { text: "+ {{perPart}}",
          why: "Right number, wrong operation. That is what one part is WORTH, so it multiplies; it is not added on." }
      ],
      settledSay: "One operation, both rows. Now every part in the urn is worth the same amount.",
      law: "Whatever you do to one row, you do to the other.",
      pending: "The syrup cell stays a question mark on purpose — and remember the question asks for everything in the urn, not just one row of it.",
      a11yDescription: "A table with two rows, cordial syrup and water, and two columns. The first column is the recipe in parts: {{n1}} parts syrup to {{n2}} parts water. The second column is what went in the urn in litres, where the water reads {{n3}} litres and the syrup is unknown. Getting from {{n2}} parts to {{n3}} litres means multiplying by {{perPart}}, so each part is worth {{perPart}} litres, and that same multiplication runs along the syrup row."
    },
    estimate: {
      prompt: "Before calculating — roughly how many litres of drink do you think they made?",
      reasonableMin: 14,
      reasonableMax: 30,
      /* The old version said the total was "somewhere around 20" on a problem
         whose answer is 20. Rounding a number to itself is not a bracket. This
         version gives a floor and a ceiling and leaves the arithmetic alone —
         and both bounds hold for every set, because water is always the bigger
         share, so the total is always more than the water and always less than
         double it. */
      modelReasoning: "The water alone is {{n3}} litres, and water is the bigger share but still only {{n2}} parts out of {{totalParts}}. So the total has to be noticeably more than {{n3}} — and it cannot be as much as double {{n3}}, because that would mean syrup and water were equal, and the recipe says they are not.",
      unit: "litres"
    },
    /* THE TEST TRACK, replacing the Junction. This problem's rows are the
       recipe in PARTS against what went in the urn in LITRES, which is the
       step students skip — they see two numbers and start multiplying litres
       by them. So the demonstration insists on which row the move was read
       from, and that the same move crosses to the other. */
    testTrack: {
      kind: "cross",
      title: "The Test Track",
      heading: "A second way through: cross-multiplying",
      intro: "The ratio table found what one part was worth and built up from there. Cross-multiplying gets at the syrup directly instead. Once a ratio is SET, the two diagonals of the table multiply to the same thing.",
      worked: {
        label: "A proportion that is already known to be true: 4 to 5 is the same as 8 to 10.",
        button: "Show me the diagonals",
        colA: "first", colB: "second",
        rows: [ { name: "top", a: "4", b: "8" }, { name: "bottom", a: "5", b: "10" } ],
        equation: "4 × 10  =  5 × 8   (both come to 40)",
        sayCut: "Take one diagonal: the 4 and the 10.",
        sayTake: "Now the other: the 5 and the 8. Both come to 40. That match is what a set ratio guarantees — and it holds however big or small the two columns are."
      },
      yours: {
        wholeLabel: "Your table: the recipe in parts on the left, what actually went in the urn on the right.",
        colA: "the recipe, in parts", colB: "in the urn, in litres",
        rows: [ { name: "syrup", a: "{{n1}}", b: "?" }, { name: "water", a: "{{n2}}", b: "{{n3}}" } ],
        equation: "{{n1}} × {{n3}}  =  {{n2}} × ?",
        q1: "Cross-multiplying means multiplying each pair sitting diagonally opposite. Which two are one diagonal?",
        options1: [
          { text: "{{n1}} and {{n3}}", correct: true,
            why: "Diagonally opposite corners: the syrup parts in the recipe and the litres of water actually poured. Both are known, so this side of the equation can be worked out." },
          { text: "{{n1}} and {{n2}}",
            why: "Those two sit in the same COLUMN — they are the recipe itself, {{n1}} parts syrup to {{n2}} parts water. A column is the ratio, not a diagonal." },
          { text: "{{n1}} and ?",
            why: "Same row — both are syrup, once in parts and once in litres. Cross-multiplying goes corner to opposite corner." },
          { text: "{{n2}} and {{n3}}",
            why: "Same row — both are water. A row is one ingredient measured two ways, which is not a diagonal." }
        ],
        settled1: "One diagonal: {{n1}} and {{n3}}.",
        q2: "And the other diagonal?",
        options2: [
          { text: "{{n2}} and ?", correct: true,
            why: "The other pair of opposite corners — the water parts in the recipe and the unknown litres of syrup. This side carries the question mark, which is the point of writing the equation at all." },
          { text: "{{n3}} and ?",
            why: "Same column — that is what went in the urn, the pair you are completing. It is not a diagonal." },
          { text: "{{n1}} and ?",
            why: "Same row, both syrup, and the {{n1}} is already spoken for on the first diagonal. Each corner belongs to exactly one." },
          { text: "{{n2}} and {{n1}}",
            why: "Same column — the recipe. Multiplying the recipe's two parts together describes nothing in the urn." }
        ],
        settled2: "The other diagonal: {{n2}} and the question mark."
      },
      law: "Once a ratio is set, its two diagonals multiply to the same thing — so a proportion with one unknown corner always turns into an equation you can solve.",
      bridge: "You have the equation, and it gives you the syrup. Remember the question asks for everything in the urn, so there is a step after that one — both belong to the Engine Room.",
      a11yDescription: "A demonstration of cross-multiplying, which produces an equation but does not solve it. First a proportion already known to be true, 4 to 5 being the same as 8 to 10: one diagonal is 4 times 10 and the other is 5 times 8, both coming to 40. Then the same on your own table: one diagonal is the recipe's syrup parts times the litres of water poured, the other is the recipe's water parts times the unknown litres of syrup. That gives the equation with a question mark still in it. Working it out, and then remembering the question asks for the whole urn, are the next steps in the Engine Room."
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many litres of drink did they make altogether?",
        answer: { exact: "{{ans}}", unit: "litres", acceptedForms: ["{{ans}}", "{{ans}} litres", "{{ans}} l"] },
        workedExplanation: "The whole mixture is {{totalParts}} parts — {{n1}} of syrup and {{n2}} of water — and each part is {{perPart}} litres. {{totalParts}} x {{perPart}} = {{ans}} litres. Check the recipe still holds: the syrup is {{n1}} x {{perPart}} = {{syrup}} litres, the water is {{n3}}, and {{syrup}} to {{n3}} reduces to {{n1}} to {{n2}}, exactly the recipe.",
        misconceptions: [
          { response: "{{syrup}}",     diagnosis: "That's the syrup on its own — the hardest part of this problem, and the easiest place to stop. The question asks for everything in the urn, so the water has to go back in too.", tag: "stopped-at-other-part" },
          { response: "{{n3}}",        diagnosis: "That's the water, which you were given. The urn also holds the syrup, so the total has to be more than this.", tag: "returned-given-value" },
          { response: "{{double}}",    diagnosis: "You doubled the water. The syrup is not the same size as the water — it is {{n1}} parts against water's {{n2}}, so it is smaller.", tag: "assumed-equal-shares" },
          { response: "{{wrongParts}}", diagnosis: "You added one part to the water instead of the syrup's {{n1}} parts. Syrup is {{n1}} parts, so it comes to {{syrup}} litres, not {{perPart}}.", tag: "wrong-number-of-parts" },
          { response: "{{perPart}}",   diagnosis: "That is what ONE part is worth, which the ratio table gave you. Every part is that size, and the urn holds {{totalParts}} of them.", tag: "stopped-at-one-part" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "How many parts are in the urn altogether — syrup and water together? And you know what one part is worth now." },
          { rung: 2, type: "signal",   text: "The recipe is {{n1}} parts syrup and {{n2}} parts water, so {{totalParts}} parts in all. Each is {{perPart}} litres." },
          { rung: 3, type: "coupling", text: "{{totalParts}} × {{perPart}} = ___" },
          { rung: 4, type: "route",    text: "{{totalParts}} × {{perPart}} = {{ans}}. They made {{ans}} litres of drink." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "litres", acceptedForms: ["{{ans}}", "{{ans}} litres", "{{ans}} l"], preferredForm: "{{ans}} litres" },
    questionCheck: "The question asked for the whole mixture — not the syrup you worked out, and not the water you were handed.",
    unitsCheck: "litres",
    reasonablenessCheck: "{{ans}} litres in total, made of {{syrup}} litres of syrup and {{n3}} of water. Those add back to {{ans}}, and {{syrup}} to {{n3}} reduces to {{n1}} to {{n2}} — the recipe, unchanged.",
    reasonablenessFailExample: "If you got {{syrup}}, the urn would hold less drink than the water you already know went into it. Any total smaller than one of its own parts is impossible.",
    connection: "The move that unlocks nearly every ratio problem is finding what a single part is worth. Once you have that, any share and the whole are one multiplication away."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved from the story and rebuilt in the opposite direction: 12/3=4, 5x4=20, syrup 2x4=8, 8+12=20, 8:12 reduces to 2:3; 20/4=5, 7x5=35, syrup 15, 15+20=35, 15:20 = 3:4; 15/5=3, 7x3=21, syrup 6, 6+15=21, 6:15 = 2:5; 30/5=6, 9x6=54, syrup 24, 24+30=54, 24:30 = 4:5. Three set-level constraints checked by hand and then asserted in numberChecks: the water share divides exactly; water is the bigger share in every set, which the estimate bracket and the doubled-water misconception both rely on; and n2 x n2 never lands on n3, which would have made the 'x n2' distractor true. Bar segments and marked parts are now checked arithmetically (seg1, mark1). Estimate brackets contain their answers: 14-30/20, 25-50/35, 16-32/21, 40-75/54. All five misconception values per set are distinct from that set's answer and from each other." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Problem text FK grade 2.2-4.8, 9-12 words per sentence. Ratio Table prose FK 3.3, Junction FK 2.3. No grade level named. Animated scene carries a caption; ratio table carries an a11yDescription. Contrast on the new tokens measured earlier at 5.04:1 (arrows, unknown cell) and 5.33:1 (selected option)." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "Cycle 7b findings stand. FIXED 2026-08-01: the estimate's modelReasoning said the total was 'somewhere around 20' on a problem whose answer is 20 — rounding a number to itself is not a bracket. Replaced with a floor and a ceiling that hold for every set. Spelled-out recipe numbers ('two parts syrup for every three parts water, five parts in all') tokenised; a written-out number survives tokenising and shuffling untouched, which is how four leaks shipped in Cycle 6." },
    student:   { status: "partial", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Full Ratio Local trip driven in a real browser through rr-market-stall: Read 1 empty input blocked; Read 2 rejects a distractor-only selection with a diagnosis; Read 3 and Ticket Booth graded; both ratio tables settle and leave their unknown cells blank; inverted-rate misconception (0.4) caught with the right diagnosis; both steps solved; Arrivals Board reached. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-07-30", notes: "Cycle 7b. Maths independently re-derived from the problem story rather than checked against the stated answer; every number set re-solved. Approved for the mechanical, mathematical and pedagogical properties measured. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16 and REVIEW-LOG.md Cycle 7b." }
  }
});
