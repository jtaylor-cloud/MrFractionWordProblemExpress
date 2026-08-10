/* Ratio & Rate Rail · missing term in a ratio · partial · DRAFTING TABLE
   The canonical proportional-reasoning problem, chosen for the Drafting
   Table because the additive error (add the same amount to both sides)
   survives every verbal explanation and dies instantly against a picture.

   UNITS: water is measured in LITRES, not grams. It was in grams, which is
   how baker's percentages are written but not how anyone actually pours
   water. Moving to litres meant moving the recipe to bakery scale so the
   litres stay whole numbers — 5 kg : 3 L rather than 500 g : 0.3 L — and a
   struggling student never meets a decimal. The ratio, the scale factor and
   the additive trap all survive the change untouched.

   FOUR NUMBER SETS, and this is the awkward one on the line: the ratio itself
   varies, not just its scale, so four separate things have to stay true at
   once and none of them is free.

     - Hydration (water ÷ flour) has to stay in the 55–75% band a real loaf
       lives in. A generated set would happily propose 5 kg of flour to 4 L of
       water — the arithmetic is fine and the bread is soup.
     - Flour + water is the bar's segment count, so it has to stay small
       enough to draw. Ten parts is the ceiling here.
     - The scale factor must be whole, or the recipe stops being scalable in
       the way this station teaches.
     - No two misconception values may collide. On one candidate set the
       recipe water and the scale factor were both 4, so a student who stopped
       at the multiplier would have been told they had handed back a given
       value. That set was dropped rather than patched.

   Verified both ways per set — the multiplier out of the flour row, and the
   reduction that puts the recipe back:
     20/5 = 4, 3x4 = 12   20:12 reduces to 5:3   hydration 60%
     20/4 = 5, 3x5 = 15   20:15 reduces to 4:3   hydration 75%
     30/6 = 5, 4x5 = 20   30:20 reduces to 6:4   hydration 67%
     21/3 = 7, 2x7 = 14   21:14 reduces to 3:2   hydration 67% */
MF.registerProblem({
  id: "rr-bread-dough",
  schemaVersion: 1,
  status: "published",
  title: "Scaling up the dough",
  line: "ratio",
  topics: ["equivalent-ratios", "scale-factor", "missing-term"],
  steps: 1,

  unknownCar: "missing-term",
  context: "baking",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "The additive trap here is strong enough that reasoning in words often loses to it. Drawing the ratio as parts makes the multiplicative structure visible, which is why the picture is the strategy that pays.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-07-30" },

  numberChecks: [
    ["n4", "/", "n1", "=", "scale"],
    ["n1", "*", "scale", "=", "n4"],
    ["n2", "*", "scale", "=", "ans"],
    ["ans", "/", "scale", "=", "n2"],
    ["n4", "-", "n1", "=", "diff"],
    ["n2", "+", "diff", "=", "addWater"],
    ["n2", "*", "2", "=", "double"],
    ["n1", "+", "n2", "=", "totalParts"],
    ["n2", "*", "totalParts", "=", "mulParts"],
    ["n1", "*", "2", "=", "n1double"],
    /* The bar counts the recipe's parts with the flour shaded, so its segment
       count is the two recipe terms added and its marked count is the flour.
       Both stated as checks: a bar drawn 5-and-3 while the set reads 6-and-4
       is a picture contradicting its own problem, and nothing else would
       notice. */
    ["n1", "+", "n2", "=", "seg1"],
    ["mark1", "+", "n2", "=", "seg1"]
  ],

  numberSets: [
    { numbers: { n1: "5", n2: "3", n3: "220", n4: "20" },
      derived: { scale: "4", ans: "12", diff: "15", addWater: "18", double: "6",
                 totalParts: "8", mulParts: "24", n1double: "10" },
      estimate: { min: 9, max: 16 }, segments: [8], marked: [5] },
    { numbers: { n1: "4", n2: "3", n3: "200", n4: "20" },
      derived: { scale: "5", ans: "15", diff: "16", addWater: "19", double: "6",
                 totalParts: "7", mulParts: "21", n1double: "8" },
      estimate: { min: 11, max: 20 }, segments: [7], marked: [4] },
    { numbers: { n1: "6", n2: "4", n3: "210", n4: "30" },
      derived: { scale: "5", ans: "20", diff: "24", addWater: "28", double: "8",
                 totalParts: "10", mulParts: "40", n1double: "12" },
      estimate: { min: 15, max: 26 }, segments: [10], marked: [6] },
    { numbers: { n1: "3", n2: "2", n3: "230", n4: "21" },
      derived: { scale: "7", ans: "14", diff: "18", addWater: "20", double: "4",
                 totalParts: "5", mulParts: "10", n1double: "6" },
      estimate: { min: 10, max: 18 }, segments: [5], marked: [3] }
  ],

  scene: {
    mode: "anim", art: "mixer",
    caption: "Flour and water falling into the same bowl, always in step — speed one up and the recipe breaks."
  },

  problem: {
    text: "The station bakery makes a rye loaf that regulars queue for. The recipe fixes how much water goes with the flour, and the baker never changes it. For every {{n1}} kilograms of flour she uses {{n2}} litres of water. The blackened oven is set to {{n3}} degrees. How much water does she need for {{n4}} kilograms of flour?",
    sentences: [
      "The station bakery makes a rye loaf that regulars queue for.",
      "The recipe fixes how much water goes with the flour, and the baker never changes it.",
      "For every {{n1}} kilograms of flour she uses {{n2}} litres of water.",
      "The blackened oven is set to {{n3}} degrees.",
      "How much water does she need for {{n4}} kilograms of flour?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "5",   unit: "kilograms of flour", role: "ratio-term",  spoken: "5" },
      n2: { value: "3",   unit: "litres of water",    role: "ratio-term",  spoken: "3" },
      n3: { value: "220", unit: "degrees",            role: "distractor",  spoken: "220" },
      n4: { value: "20",  unit: "kilograms of flour", role: "scaled-term", spoken: "20" }
    },
    context: { setting: "bakery", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A baker follows a recipe where the flour and the water always stay in the same relationship. She wants to make a bigger batch, so she needs to know how much water goes with the larger amount of flour.",
      platformCheck: {
        /* The question sentence is IN the answer here, and only here plus
           rr-van-hours: "for {{n4}} kilograms of flour" is a given you need,
           not just a statement of what to find.
           Sentence 1 was in this set and came OUT, user-found: "For every…"
           already IS the fixed pairing, so demanding the plainer restatement
           as well marked a correct reading wrong. It is worth noticing, so it
           is said below rather than required. */
        sentences: [2, 4],
        why: "\"For every\" is the lock: it fixes flour against water, so the pairing holds at any batch size, and the question hands you the batch you are scaling to. Worth noticing too — the line before says the same thing in plainer words, which is a good sign you have read it right.",
        kinds: "Flour and water — different things, tied together by the recipe."
      },

      questions: {
        kinds: {
          ask: "This story counts kilograms of flour and litres of water, and it also mentions the temperature the oven is set to. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "Flour and water are different things, and the recipe pins them to each other. Use more flour and the water goes up in proportion.", no: "" },
            same:      { yes: "", no: "That would mean everything was measured in the same stuff. Flour is weighed and water is poured, and the recipe is precisely a statement about how they go together. The oven temperature is the only real scenery here." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started, or does the recipe hold the same relationship however much the baker makes?",
          options: {
            steady:  { yes: "Nothing is added to or taken from an existing amount. The recipe holds the same pairing whether she makes a small batch or a large batch.", no: "" },
            changed: { yes: "", no: "That would mean an amount ending up different from how it started &mdash; a bowl being added to or emptied. Making a bigger batch is not the same as changing an amount you already had; it is the same recipe at a different size." }
          }
        },
        things: {
          ask: "Is the story keeping track of a single amount, of separate amounts being measured against each other, or of flour and water going together?",
          options: {
            paired:   { yes: "Not really separate things at all. Flour and water go together in a fixed pairing, and the question stretches that pairing to a bigger batch.", no: "" },
            single:   { yes: "", no: "That would mean everything counted was the same stuff. There is flour here and there is water, and the recipe needs both." },
            separate: { yes: "", no: "That would mean flour and water being compared to see which is greater. The recipe does not compare them &mdash; it locks them together." }
          }
        },
        shape: {
          ask: "Is the dough being shared out into parts, or is the same measure repeated over and over, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares, and no identical batch is being counted. The question asks what amount of water belongs with a given amount of flour.", no: "" },
            repeat:  { yes: "", no: "Close, and the arithmetic overlaps &mdash; a bigger batch is the recipe taken several times over. But Equal Groups would be counting the batches. Here the pairing of flour with water is the situation, and the batch size is just how far you stretch it." },
            cut:     { yes: "", no: "That would mean a fixed amount of dough divided into shares that add back up to it. Nothing is being divided into parts of a whole." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the recipe as written, and the bigger batch she wants to make?",
          options: {
            onekind: { yes: "A fixed relationship being scaled up, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a fixed recipe and nothing else &mdash; no second kind of situation stacked on top." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Water that goes with flour is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the flour in the recipe as written", needed: true },
        { token: "n2", describe: "the water that goes with it", needed: true },
        { token: "n3", describe: "how hot the oven is", needed: false },
        { token: "n4", describe: "the flour she actually wants to use", needed: true }
      ],
      relationship: "The flour and water are locked together — whatever you do to one, you do the same to the other. The new amount of flour is a multiple of the recipe amount, and the water has to grow by that same multiple. Notice they are measured differently, in kilograms and in litres; that does not stop them scaling in step. The oven temperature is not part of the relationship at all.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The amount of water that goes with the larger amount of flour.",
      commonMisreading: "Working out how many times bigger the new batch is and stopping there. That number is the tool, not the answer.",
      options: [
        { text: "The litres of water needed for the larger amount of flour", correct: true,
          why: "The missing term. Three of the four quantities in the relationship are given, and this is the one that is not." },
        { text: "How many times bigger the new batch is",
          why: "A real step on the way, and the easiest place to stop. It is a multiplier, not an amount of water." },
        { text: "How much the flour and the water come to when added together",
          why: "You cannot add them anyway — one is a weight and the other a volume. The question asks only for the water." },
        { text: "How much extra flour she is using",
          why: "The difference between the two flour amounts. The question is about water, and this is the number that leads straight into the additive trap." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Two quantities are locked in a fixed relationship. Flour and water are not independent — set one and the other is decided. Scaling one means scaling the other by the same factor, which is exactly what a ratio is.",
    distractors: [
      { line: "change",    whyWrong: "Nothing happens over time. The recipe does not start at one amount and end at another; both batch sizes are simply two versions of the same fixed relationship." },
      { line: "compare",   whyWrong: "This is the most dangerous wrong answer here, because comparing the two flour amounts gives you a difference of {{diff}} kilograms — and adding that difference to the water is the classic error. The flour and water are tied together, not being measured against each other." },
      { line: "groups",    whyWrong: "There is no repeated group of the same thing. Flour and water are different substances held in a fixed relationship, not a group counted over and over." },
      { line: "partwhole", whyWrong: "Flour and water do combine into dough, so a whole exists — but no total is given and none is asked for, and a weight and a volume will not add into one anyway. The problem is about how the two track each other." }
    ],
    unknownCar: "missing-term",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the flour in the recipe", "the water in the recipe", "the water for the bigger batch", "the flour for the bigger batch"],
    unknownCarAnswer: "the water for the bigger batch",
    unknownCarWhy: "Three of the four amounts are stated: recipe flour, recipe water, and the new flour. The fourth corner of the relationship is the only one missing, and it is what you are asked for.",
    supportAfter3Attempts: {
      narrowTo: ["ratio", "compare"],
      discriminator: "Ask whether the two amounts move together or sit still. If doubling one forces the other to double, they are locked in a ratio. If they just sit there and you measure the gap between them, that is Compare."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* Unitless PARTS. It used to read "8 equal parts of 100 grams" — which
         worked only while both ingredients were weighed. Kilograms and litres
         cannot be poured into one bar of equal parts, so the bar now counts
         the recipe's parts and nothing else. Both value fields stay "?" so
         nothing is stated that the student has to work out. */
      bars: [{ label: "one batch, counted in parts", segments: 8, segmentValue: "?", knownTotal: "?", unit: "parts",
               marked: 5, markedLabel: "flour", restLabel: "water" }],
      a11yDescription: "One bar stands for a single batch of dough, split into {{totalParts}} equal parts. {{n1}} of them are flour and {{n2}} are water, which is what the recipe fixes. A bigger batch does not change how the bar is divided — it only makes every part bigger by the same number of times, and finding that number is your first move.",
      authored: "generated"
    },
    /* THE problem this whole model was built for. The additive option is on the
       button row deliberately: it is the single most common error in ratio
       work, it cannot be argued away in words, and seeing it applied to both
       rows at once is what kills it. */
    ratioTable: {
      prompt: "Flour and water travel together. Put the recipe next to the batch she actually wants.",
      givenHeading: "The recipe",
      targetHeading: "Her bigger batch",
      rows: [
        { label: "flour", unit: "kilograms", given: "{{n1}}", target: "{{n4}}" },
        { label: "water", unit: "litres",    given: "{{n2}}", target: "?" }
      ],
      question: "What takes the flour from {{n1}} to {{n4}}?",
      options: [
        { text: "× {{scale}}", correct: true,
          why: "That many lots of the recipe. Now the same multiplication has to run along the water row — that is what keeps the dough tasting the same." },
        { text: "+ {{diff}}",
          why: "This is the trap, and it is the most common mistake in all of ratio work. It does reach {{n4}} — but apply the same addition to the water and you get {{addWater}} litres against {{n4}} kilograms of flour, a dough that is nearly half water. A ratio scales by multiplying, never by adding the same amount to both." },
        { text: "× 2",
          why: "Doubling {{n1}} gives {{n1double}}, not {{n4}}. Check the multiplier against the row you can see before you carry it across." },
        { text: "+ {{scale}}",
          why: "That is the right number attached to the wrong operation. It is how many TIMES bigger, not how much is added." }
      ],
      settledSay: "One operation, both rows. The recipe survives the scaling.",
      law: "Whatever you do to one row, you do to the other — and for a ratio that means multiply, not add.",
      pending: "The water cell stays a question mark on purpose — running that same multiplication along the row is the next stop.",
      a11yDescription: "A table with two rows, flour in kilograms and water in litres, and two columns. The first column is the recipe: {{n1}} kilograms of flour to {{n2}} litres of water. The second column is the bigger batch, where the flour reads {{n4}} kilograms and the water is unknown. Getting from {{n1}} to {{n4}} means multiplying by {{scale}}, and that same multiplication has to run along the water row."
    },
    estimate: {
      prompt: "Before calculating — roughly how much water do you think the bigger batch needs?",
      reasonableMin: 9,
      reasonableMax: 16,
      /* Brackets the answer without naming it or the scale factor. Both were
         being stated here, on the Plan screen, before the Engine Room asked.
         The floor and the ceiling hold for every set: the answer is always
         more than the recipe's water and always less than the flour, because
         this dough is always under 100% hydration. */
      modelReasoning: "The new flour amount is a good few times the recipe amount, and the water has to grow by that same multiple — whatever it turns out to be. So expect comfortably more than the {{n2}} litres the recipe calls for, and still a smaller number than the {{n4}} kilograms of flour, because this dough always takes less water than flour.",
      unit: "litres of water"
    },
    /* THE TEST TRACK, replacing the Junction. On the Drafting Table — the
       problem the additive error was built to break — the thing worth
       demonstrating is that both rows move by the same MULTIPLE, and that
       adding to both is what pulls them apart. */
    testTrack: {
      kind: "cross",
      title: "The Test Track",
      heading: "A second way through: cross-multiplying",
      intro: "The ratio table scaled the flour row and carried the move across. Here is a different route, and it is the one that saves you when the multiplier is not a tidy whole number. Once a ratio is SET, the two diagonals of the table multiply to the same thing.",
      worked: {
        /* 4, 9, 8, 18 with the product 72, and the added pairs 22 and 17. None
           of those is an answer in any set (12, 15, 20, 14). The first draft
           used 3 to 4 as 9 to 12 and remarked that adding would give "15 and
           13" — 12 is set 1's answer and 15 is set 2's, so the worked example
           printed two of the four answers outright. */
        label: "A proportion that is already known to be true: 4 to 9 is the same as 8 to 18.",
        button: "Show me the diagonals",
        colA: "first", colB: "second",
        rows: [ { name: "top", a: "4", b: "8" }, { name: "bottom", a: "9", b: "18" } ],
        equation: "4 × 18  =  9 × 8   (both come to 72)",
        sayCut: "Take one diagonal: the 4 and the 18.",
        sayTake: "Now the other: the 9 and the 8. Both come to 72. Matching cross products are what a true proportion IS — and notice adding those same pairs would give 22 and 17, which do not match at all."
      },
      yours: {
        wholeLabel: "Your table, with the ratio already set by a recipe the baker never changes.",
        colA: "the recipe", colB: "her bigger batch",
        rows: [ { name: "flour", a: "{{n1}}", b: "{{n4}}" }, { name: "water", a: "{{n2}}", b: "?" } ],
        equation: "{{n1}} × ?  =  {{n2}} × {{n4}}",
        q1: "Cross-multiplying means multiplying each pair sitting diagonally opposite. Which two are one diagonal?",
        options1: [
          { text: "{{n1}} and ?", correct: true,
            why: "Diagonally opposite corners: the recipe's flour and the unknown water for the big batch. This is the side that carries the question mark, which is why the equation is worth having." },
          { text: "{{n1}} and {{n2}}",
            why: "Those two sit in the same COLUMN — they are the recipe itself, flour over water. A column is the ratio, not a diagonal." },
          { text: "{{n1}} and {{n4}}",
            why: "Those two sit in the same ROW — both are flour, at two different batch sizes. Cross-multiplying goes corner to opposite corner." },
          { text: "{{n2}} and ?",
            why: "Same row again — both are water. The diagonals use each corner exactly once, and this pair is a row." }
        ],
        settled1: "One diagonal: {{n1}} and the question mark.",
        q2: "And the other diagonal?",
        options2: [
          { text: "{{n2}} and {{n4}}", correct: true,
            why: "The other pair of opposite corners — the recipe's water and the flour she is actually using. Both known, so this side can be worked out." },
          { text: "{{n2}} and {{n1}}",
            why: "Same column — that is the recipe. You have already used both of these on the first diagonal or in the column; neither is a crossing pair." },
          { text: "{{n4}} and ?",
            why: "Same column — that is her bigger batch, the pair you are trying to complete. It is not a diagonal." },
          { text: "{{n4}} and {{n1}}",
            why: "Same row, both flour. The two diagonals between them use all four corners once each, and this is not one of them." }
        ],
        settled2: "The other diagonal: {{n2}} and {{n4}}."
      },
      law: "Once a ratio is set, its two diagonals multiply to the same thing. Adding the pairs does not — which is the whole reason the additive shortcut fails.",
      bridge: "You have the equation. Both sides are still written as products on purpose — working them out, and getting the question mark on its own, is the Engine Room's job.",
      a11yDescription: "A demonstration of cross-multiplying, which produces an equation but does not solve it. First a proportion already known to be true, 4 to 9 being the same as 8 to 18: one diagonal is 4 times 18 and the other is 9 times 8, both coming to 72, whereas adding the same pairs gives 22 and 17, which do not match. Then the same on your own table: one diagonal is the recipe's flour times the unknown water, the other is the recipe's water times the flour she is using. That gives the equation with a question mark still in it. Working it out is the next step, in the Engine Room."
    }
  },

  /* ONE step, not two. The old s1 asked "how many times bigger is the new
     amount of flour?" — which is now exactly what the Ratio Table establishes
     on the PREVIOUS screen. Asking it again after the table has taught it is
     not scaffolding, it is a spoiler followed by a quiz.
     The multiplier survives where it belongs: in the table, in the hint ladder,
     and as a misconception for stopping there. */
  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How much water does she need?",
        answer: { exact: "{{ans}}", unit: "litres of water", acceptedForms: ["{{ans}}", "{{ans}} l", "{{ans}} litres"] },
        workedExplanation: "Everything in the recipe grows by the same multiple, so the water is multiplied by {{scale}} as well. {{n2}} x {{scale}} = {{ans}} litres. Check the relationship still holds: {{n4}} kilograms of flour to {{ans}} litres of water reduces to {{n1}} to {{n2}}, the recipe as written.",
        misconceptions: [
          { response: "{{addWater}}", diagnosis: "You added {{diff}} to the water, because the flour went up by {{diff}}. This is the single most common error in ratio work. Adding the same amount to both sides breaks the relationship: {{n4}} to {{addWater}} is nearly one-to-one, nothing like {{n1}} to {{n2}}. Ratios scale by multiplying.", tag: "additive-reasoning" },
          { response: "{{n2}}",       diagnosis: "That is the water in the original recipe, which you were given. She is making several times as much dough, so she needs more water than the recipe states, not the same.", tag: "returned-given-value" },
          { response: "{{double}}",   diagnosis: "You doubled the water. Check what actually happened to the flour row — the water has to grow by that same multiple, and it is not two.", tag: "wrong-scale-factor" },
          { response: "{{mulParts}}", diagnosis: "You multiplied the water by the number of parts in the recipe instead of by the multiplier. Check the multiplier against the flour first: {{n4}} is {{scale}} lots of {{n1}}.", tag: "wrong-scale-factor" },
          { response: "{{scale}}",    diagnosis: "That is the multiplier — how many times bigger the batch is, which the ratio table gave you. It is the tool, not the answer. Run it along the water row to finish.", tag: "stopped-at-the-multiplier" },
          { response: "{{diff}}",     diagnosis: "That is how much EXTRA flour there is, not an amount of water. A difference between two flour weights cannot be an answer in litres.", tag: "additive-instead-of-multiplicative" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The flour ran from {{n1}} kilograms to {{n4}}. Whatever that did to the flour row has to happen to the water row too." },
          { rung: 2, type: "signal",   text: "The flour got {{scale}} times bigger, so multiply the recipe's water by that same {{scale}}." },
          { rung: 3, type: "coupling", text: "{{n2}} × {{scale}} = ___" },
          { rung: 4, type: "route",    text: "{{n2}} × {{scale}} = {{ans}}. She needs {{ans}} litres of water." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "litres of water", acceptedForms: ["{{ans}}", "{{ans}} l", "{{ans}} litres"], preferredForm: "{{ans}} litres" },
    questionCheck: "The question asked for the water, not the scale factor and not the flour.",
    unitsCheck: "litres of water",
    reasonablenessCheck: "{{n4}} kilograms of flour to {{ans}} litres of water. Divide both by {{scale}} and you get {{n1}} to {{n2}} — the recipe you started with, unchanged. That is the real check on any ratio answer.",
    reasonablenessFailExample: "If you got {{addWater}}, set it next to the {{n4}} kilograms of flour: almost equal amounts. The recipe is {{n1}} to {{n2}}, nothing like it, so the relationship has been broken somewhere.",
    connection: "The same four-cornered shape appears in every scaling problem: two amounts locked together, three of the four known. Find the multiplier that links the pair you can see, then apply it to the pair you cannot. It works just as well when the two amounts are measured in different units."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved from the story and then reduced back to the recipe: 20/5=4, 3x4=12, 20:12 = 5:3; 20/4=5, 3x5=15, 20:15 = 4:3; 30/6=5, 4x5=20, 30:20 = 6:4; 21/3=7, 2x7=14, 21:14 = 3:2. Hydration (water/flour) checked per set at 60%, 75%, 67%, 67% — all inside the band a real loaf occupies, which a generated set does not respect. Bar parts per set (8,7,10,5) and shaded flour parts (5,4,6,3) are asserted arithmetically via seg1 and mark1. Estimate brackets contain their answers: 9-16/12, 11-20/15, 15-26/20, 10-18/14. All six misconception values re-derived per set and checked pairwise distinct — one candidate set was DROPPED, not patched, because its recipe water and its scale factor were both 4, which would have handed a student who stopped at the multiplier a diagnosis about returning a given value." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Problem text FK grade 2.2-4.8, 9-12 words per sentence. Ratio Table prose FK 3.3, Junction FK 2.3. No grade level named. Animated scene carries a caption; ratio table carries an a11yDescription. Contrast on the new tokens measured earlier at 5.04:1 (arrows, unknown cell) and 5.33:1 (selected option)." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "Cycle 7b findings stand. The additive distractor is still the first thing the Drafting Table shows, which is the whole reason this problem sits there. 2026-08-01: spelled-out recipe counts in the bar's a11yDescription ('Five of them are flour and three are water') tokenised — a screen-reader user was the only one getting a set-independent number, and it would have been wrong for three sets in four." },
    student:   { status: "partial", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Full Ratio Local trip driven in a real browser through rr-market-stall: Read 1 empty input blocked; Read 2 rejects a distractor-only selection with a diagnosis; Read 3 and Ticket Booth graded; both ratio tables settle and leave their unknown cells blank; inverted-rate misconception (0.4) caught with the right diagnosis; both steps solved; Arrivals Board reached. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-07-30", notes: "Cycle 7b. Maths independently re-derived from the problem story rather than checked against the stated answer; every number set re-solved. Approved for the mechanical, mathematical and pedagogical properties measured. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16 and REVIEW-LOG.md Cycle 7b." }
  }
});
