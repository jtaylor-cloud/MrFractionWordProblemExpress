/* Ratio & Rate Rail · comparing two rates · independent · SIGNAL BOX
   Built for the Signal Box because the surface words all point the wrong
   way: the better-value stall has the BIGGER total price and the MORE
   bags, and it is the one with the bigger sign. Nothing but working out
   both unit prices settles it.

   This had NO scene for a while: the unit grid could only draw one bar's
   worth of cells, and a grid of one stall in a two-stall comparison would
   have quietly asserted that stall was the subject. An illustration has no
   such limit — it draws both stalls and takes no side, since neither price
   tag shows a number. The Model Yard still has the single-bar limit, so its
   bar is labelled with which stall it is.

   FOUR NUMBER SETS, and this one has the tightest constraints on the line
   because both stalls have to stay honest at the same time:

     - The second stall must be CHEAPER per bag while charging MORE in total
       and selling MORE bags. If any of those three flips, every word about
       the surface signals pointing the wrong way becomes false.
     - Both unit prices must be clean, and so must both RECIPROCALS. The
       inverted-rate misconception is the one this problem exists to catch,
       and its response is bags-per-dollar: 4 bags for 14 dollars gives
       0.28571428…, which is not a wrong answer any student would ever type.
       That is what rules out most otherwise-fine sets — a price of 3.50 has
       no usable inverse, 2.50 and 4 and 5 and 8 do.
     - The prices must stay close enough that the comparison is real work.
       Sets where one stall is half the other were dropped.

   Verified two ways per set: each stall's own division, and a matched-quantity
   purchase at the least common multiple of the two lot sizes, which must
   agree about who is cheaper.

     15/6 = 2.50 vs 20/10 = 2.00   30 bags: 5x15 = 75  vs 3x20 = 60
     15/3 = 5.00 vs 28/7  = 4.00   21 bags: 7x15 = 105 vs 3x28 = 84
     20/5 = 4.00 vs 30/12 = 2.50   60 bags: 12x20 = 240 vs 5x30 = 150
     24/3 = 8.00 vs 35/7  = 5.00   21 bags: 7x24 = 168 vs 3x35 = 105 */
MF.registerProblem({
  id: "rr-market-stall",
  schemaVersion: 1,
  status: "published",
  title: "Which stall is better value",
  line: "ratio",
  topics: ["unit-rate", "comparing-rates", "best-buy"],
  steps: 2,

  unknownCar: "compare-rates",
  context: "shopping",
  fadeLevel: "independent",
  stationRoles: ["signalbox"],
  hubEligible: true,
  hubGoodStrategies: ["signalbox", "switchyard"],
  hubStrategyNote: "Every surface signal in this problem points at the wrong stall. It rewards the student who distrusts the wording and builds both unit prices before deciding anything.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-07-30" },

  numberChecks: [
    ["n2", "/", "n1", "=", "p1"],
    ["n1", "*", "p1", "=", "n2"],
    ["n4", "/", "n3", "=", "p2"],
    ["n3", "*", "p2", "=", "n4"],
    /* The inverted rate, both stalls. Named as checks so a set whose
       bags-per-dollar is a recurring decimal cannot slip through: the
       misconception response would render as 0.2857142857142857 on the page. */
    ["n1", "/", "n2", "=", "inv1"],
    ["n3", "/", "n4", "=", "inv2"],
    ["n2", "*", "n1", "=", "mul1"],
    ["n2", "-", "n1", "=", "sub1"],
    ["n4", "*", "n3", "=", "mul2"],
    ["n1", "-", "1", "=", "n1less1"],
    ["n2", "-", "n1less1", "=", "sub1Result"],
    ["n1", "*", "n1", "=", "n1sq"],
    ["n3", "-", "1", "=", "n3less1"],
    ["n4", "-", "n3less1", "=", "sub2Result"],
    ["n3", "*", "n3", "=", "n3sq"],
    /* The matched-quantity cross-check, stated rather than trusted. Buying the
       same number of bags at both stalls has to agree with the per-bag prices
       about which stall is cheaper; if it did not, one of them would be wrong. */
    ["lcm", "/", "n1", "=", "lots1"],
    ["lots1", "*", "n2", "=", "cost1"],
    ["lcm", "/", "n3", "=", "lots2"],
    ["lots2", "*", "n4", "=", "cost2"],
    ["inv2", "*", "n3", "=", "invTotal"],
    // The bar is the first stall's lot, one part per bag.
    ["seg1", "*", "p1", "=", "n2"]
  ],

  numberSets: [
    { numbers: { n1: "6", n2: "15", n3: "10", n4: "20", n5: "28" },
      derived: { p1: "2.5", p2: "2", p1dec: "2.50", p2dec: "2.00",
                 inv1: "0.4", inv2: "0.5", mul1: "90", sub1: "9", mul2: "200",
                 n1less1: "5", sub1Result: "10", n1sq: "36",
                 n3less1: "9", sub2Result: "11", n3sq: "100",
                 lcm: "30", lots1: "5", cost1: "75", lots2: "3", cost2: "60", invTotal: "5" },
      estimate: { min: 1, max: 3 }, segments: [6], marked: [1] },
    { numbers: { n1: "3", n2: "15", n3: "7", n4: "28", n5: "32" },
      derived: { p1: "5", p2: "4", p1dec: "5.00", p2dec: "4.00",
                 inv1: "0.2", inv2: "0.25", mul1: "45", sub1: "12", mul2: "196",
                 n1less1: "2", sub1Result: "13", n1sq: "9",
                 n3less1: "6", sub2Result: "22", n3sq: "49",
                 lcm: "21", lots1: "7", cost1: "105", lots2: "3", cost2: "84", invTotal: "1.75" },
      estimate: { min: 2.5, max: 6 }, segments: [3], marked: [1] },
    /* Was 5 bags for 20 dollars. The subtractive distractor on the first table
       is "− (n1 − 1)", which came out as "− 4" — and 4 was this set's first-stall
       price, so step one's answer sat on the Plan screen as an option label.
       Nothing in the manifest was wrong; it only existed once the screen was
       rendered, and the render sweep is what found it. Re-picked to 6 bags for
       24, which keeps p1 = 4 and moves the distractor to 5. */
    { numbers: { n1: "6", n2: "24", n3: "10", n4: "25", n5: "24" },
      derived: { p1: "4", p2: "2.5", p1dec: "4.00", p2dec: "2.50",
                 inv1: "0.25", inv2: "0.4", mul1: "144", sub1: "18", mul2: "250",
                 n1less1: "5", sub1Result: "19", n1sq: "36",
                 n3less1: "9", sub2Result: "16", n3sq: "100",
                 lcm: "30", lots1: "5", cost1: "120", lots2: "3", cost2: "75", invTotal: "4" },
      estimate: { min: 1.5, max: 4 }, segments: [6], marked: [1] },
    { numbers: { n1: "3", n2: "24", n3: "7", n4: "35", n5: "36" },
      derived: { p1: "8", p2: "5", p1dec: "8.00", p2dec: "5.00",
                 inv1: "0.125", inv2: "0.2", mul1: "72", sub1: "21", mul2: "245",
                 n1less1: "2", sub1Result: "22", n1sq: "9",
                 n3less1: "6", sub2Result: "29", n3sq: "49",
                 lcm: "21", lots1: "7", cost1: "168", lots2: "3", cost2: "105", invTotal: "1.4" },
      estimate: { min: 3, max: 9 }, segments: [3], marked: [1] }
  ],

  scene: {
    mode: "anim", art: "stall",
    caption: "Two stalls, two swinging price tags, the same rice. Neither tag tells you which is the better buy."
  },

  problem: {
    text: "Two stalls at the market sell exactly the same bags of rice. The noisy market has {{n5}} stalls in all. The first stall, under a faded awning, sells {{n1}} bags for {{n2}} dollars. The second stall sells {{n3}} bags for {{n4}} dollars. The second stall has a much bigger sign. What does one bag cost at the stall that gives better value?",
    sentences: [
      "Two stalls at the market sell exactly the same bags of rice.",
      "The noisy market has {{n5}} stalls in all.",
      "The first stall, under a faded awning, sells {{n1}} bags for {{n2}} dollars.",
      "The second stall sells {{n3}} bags for {{n4}} dollars.",
      "The second stall has a much bigger sign.",
      "What does one bag cost at the stall that gives better value?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "6",  unit: "bags",    role: "quantity",   spoken: "6" },
      n2: { value: "15", unit: "dollars", role: "total",      spoken: "15" },
      n3: { value: "10", unit: "bags",    role: "quantity",   spoken: "10" },
      n4: { value: "20", unit: "dollars", role: "total",      spoken: "20" },
      n5: { value: "28", unit: "stalls",  role: "distractor", spoken: "28" }
    },
    context: { setting: "market", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Two stalls sell the same thing but in different sized lots and at different prices. We want to know which one is actually better value, and what a single bag costs there.",
      platformCheck: {
        sentences: [2, 3],
        // Was "Scaling each stall down to a single bag is the only way to
        // compare them fairly" — that is the PLAN, handed over before the Plan
        // phase, and it names the Ticket Booth's gated answer besides.
        why: "Each of those pairs bags with dollars, and there is a pairing per stall. Neither stall's price is stated in a form you can set beside the other's — the sign above the stall is not evidence of anything.",
        kinds: "Bags and dollars — different kinds of thing, and the price is what ties them together."
      },

      /* `things.separate.no` is the important one. The generic copy used to say
         "that is not what is going on here", which is FALSE on this problem —
         two stalls ARE set side by side and compared, and this manifest's own
         compare distractor says "a comparison genuinely happens at the end".
         Flagged by the math agent. The reply now agrees with the student and
         then draws the real distinction: what gets compared is two rates, and
         a rate has to be found before it can be compared. */
      questions: {
        kinds: {
          ask: "This story counts bags of rice and it counts dollars, and it also counts how many stalls the market has. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "Bags and dollars are different sorts of thing, and each stall's price ties them together. Buy more bags at that stall and you pay in proportion.", no: "" },
            same:      { yes: "", no: "That would mean everything was counted in the same stuff. Bags are not dollars, and the question is about what a bag costs &mdash; which is exactly those paired." }
          }
        },
        moments: {
          ask: "Does any amount end up different from how it started, or do both stalls hold their prices while you work out which is better value?",
          options: {
            steady:  { yes: "Nothing is added or taken away. Both stalls stand there with fixed prices, and you are working out what each stall really charges.", no: "" },
            changed: { yes: "", no: "That would mean a price rising or an amount being spent, with a before and an after. Nothing moves here &mdash; the stalls simply are what they are." }
          }
        },
        things: {
          ask: "Is the story keeping track of a single amount, of separate things being measured against each other, or of bags and dollars going together?",
          options: {
            paired:   { yes: "Each stall pairs bags with dollars, and that pairing is what you have to find before anything can be compared.", no: "" },
            separate: { yes: "", no: "You are right that a comparison happens &mdash; the question asks which stall is better value, so they do get held up against each other at the end. But you cannot compare them yet: each stall states its price in a different sized lot. What gets compared is a RATE from each stall, and a rate is a pairing of bags with dollars. Find those first." },
            single:   { yes: "", no: "That would mean the story counted only the same stuff throughout. There are bags here and there are dollars, and the price needs both." }
          }
        },
        shape: {
          ask: "Are the bags being shared out into parts, or is the same lot sold over and over, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares, and the question is not counting identical lots. It asks what a single bag costs.", no: "" },
            repeat:  { yes: "", no: "Bags do come in lots, which sounds like groups. But Equal Groups would count how many lots there are. Here the question is the price attached to each bag &mdash; a pairing, not a count." },
            cut:     { yes: "", no: "That would mean a fixed amount of rice or money divided into shares. Nothing is being divided into parts of a whole." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; both stalls, and the price of a single bag at whichever stall is better?",
          options: {
            onekind: { yes: "A fixed relationship being scaled, at each stall, the whole way through. It takes more than a single step, and every step is the same kind of situation.", no: "" },
            stacked: { yes: "", no: "The best case on the site for this answer, and worth arguing for &mdash; you find a rate, then you compare. But finding each stall's rate and setting them side by side are the same kind of situation seen at each stall, not different kinds stacked. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A price per bag is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many bags the first stall sells in a lot", needed: true },
        { token: "n2", describe: "what that lot costs at the first stall", needed: true },
        { token: "n3", describe: "how many bags the second stall sells in a lot", needed: true },
        { token: "n4", describe: "what that lot costs at the second stall", needed: true },
        { token: "n5", describe: "how many stalls the market has altogether", needed: false }
      ],
      relationship: "Each stall ties a number of bags to a price, so each one has its own rate: dollars per bag. The two totals cannot be compared directly because they buy different numbers of bags. Only once both are reduced to the price of a single bag do they sit on the same footing. How many stalls the market has is irrelevant to either price.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The price of one single bag, at whichever stall turns out to be better value.",
      commonMisreading: "Deciding which stall is cheaper by looking at the two totals, and answering with one of them.",
      options: [
        { text: "The cost of one bag at the better-value stall", correct: true,
          why: "A price for a single bag. That means both stalls have to be reduced to a per-bag price first, and then the smaller one is the answer." },
        { text: "The cheaper of the two totals",
          why: "The most tempting wrong answer. {{n2}} dollars is less than {{n4}}, but it buys fewer bags — the totals are not comparable as they stand." },
        { text: "How much money you save by choosing the better stall",
          why: "A difference between two prices. Real enough, but it is not what the question asks for." },
        { text: "How many bags you get for a dollar",
          why: "This is the same relationship turned upside down. It is a valid way to compare, but the question asks for a cost per bag, not bags per dollar." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Each stall locks bags to dollars at a fixed rate. Answering means building each stall's rate and setting them side by side — and a rate is what has to be built before anything can be compared at all.",
    distractors: [
      { line: "compare",   whyWrong: "The hardest one to rule out, because a comparison genuinely happens at the end. But you cannot compare anything until each stall has been turned into a price per bag, and building those rates is the actual work. Compare deals with two amounts you already have in the same units." },
      { line: "change",    whyWrong: "Nothing changes over time here. Both stalls have their prices at the same moment; nobody starts at one price and moves to another." },
      { line: "groups",    whyWrong: "Bags do come in lots, which sounds like groups. But the question is about the price attached to each bag — two different units locked together — rather than counting up how many bags a number of lots contains." },
      { line: "partwhole", whyWrong: "The two stalls are not parts of one whole. They are separate sellers, and nothing here is being split into pieces that add back up to a total." }
    ],
    unknownCar: "compare-rates",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the price of a lot of bags", "the number of bags in a lot", "the price of one single bag"],
    unknownCarAnswer: "the price of one single bag",
    unknownCarWhy: "Every stall tells you what a whole lot costs. Neither one tells you what a single bag costs — and that is the only figure on which the two stalls can honestly be compared.",
    supportAfter3Attempts: {
      narrowTo: ["ratio", "compare"],
      discriminator: "Ask whether the two numbers are already in the same units. {{n2}} dollars for {{n1}} bags and {{n4}} dollars for {{n3}} are not comparable as they stand, so a rate has to be built first. That building step is what makes it Ratio and Rate rather than Compare."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* ONE bar, not two. The Model Yard reads bars[0] and nothing else
         (model.js:38), so a second entry here would be authored content that
         never reaches a student. The bar drawn is the first stall; the label
         and the description both say out loud that the same split has to be
         done again for the second stall, so the picture cannot be mistaken for
         the whole problem. Checked in the browser — not assumed from the schema. */
      bars: [
        { label: "a lot from the FIRST stall — the second one needs the same treatment", segments: 6,
          segmentValue: "?", knownTotal: "${{n2}}", unit: "bags",
          marked: 1, markedLabel: "one bag", restLabel: "the other {{n1less1}} bags" }
      ],
      a11yDescription: "One bar, for the first stall only: {{n2}} dollars split into {{n1}} equal bags, with a single bag marked because the price of one bag is what you are looking for. The per-bag price is left blank — working it out is the task. The second stall needs exactly this same picture drawn again with {{n4}} dollars across {{n3}} bags, and only once both per-bag prices exist can the two stalls be compared.",
      authored: "generated"
    },
    /* TWO tables, one per stall. There was only the first, on the reasoning
       that doing the second was the Engine Room's job — but that made the two
       stalls look like different kinds of task, when the entire lesson is that
       you perform the IDENTICAL move on both and only then compare. Seeing the
       two tables side by side, each reduced to a single bag, is what makes the
       comparison honest. Neither table computes its price; both leave the
       dollars cell a question mark, so the Engine Room still has its work. */
    ratioTables: [
      {
        title: "The first stall",
        heading: "Reduce the first stall to one bag",
        prompt: "Each stall ties bags to dollars. Reduce this one to a single bag — that is the only footing on which two stalls can be compared.",
        givenHeading: "A lot at the first stall",
        targetHeading: "One bag",
        rows: [
          { label: "bags",    given: "{{n1}}", target: "1" },
          { label: "dollars", given: "{{n2}}", target: "?" }
        ],
        question: "What takes the first stall's bags from {{n1}} down to 1?",
        options: [
          { text: "÷ {{n1}}", correct: true,
            why: "One bag out of the lot, so that same share of the price. Do it to the bags and you must do it to the dollars — that is what turns a lot into a price per bag." },
          { text: "− {{n1less1}}",
            why: "It reaches 1, but subtracting is not sharing out. The same subtraction on the dollars would say a single bag costs {{sub1Result}} dollars, out of a lot of {{n1}} that costs {{n2}}." },
          { text: "× {{n1}}",
            why: "That goes the wrong way, to {{n1sq}} bags. You are trying to get down to a single one." },
          { text: "÷ {{n2}}",
            why: "That divides by the dollars rather than the bags. It would give you bags per dollar — a fair way to compare, but not the cost of a bag." }
        ],
        settledSay: "One operation, both rows. That is the first stall priced per bag.",
        law: "Whatever you do to one row, you do to the other.",
        pending: "The dollars cell stays a question mark on purpose. Now do the same to the other stall — the two only mean something side by side.",
        a11yDescription: "The first of two tables, one per stall. Two rows, bags and dollars, and two columns. The first column is a lot at the first stall: {{n1}} bags for {{n2}} dollars. The second column is a single bag, so the bags cell reads 1 and the dollars cell is unknown. Getting from {{n1}} bags to 1 means dividing by {{n1}}, and the same division applies to the dollars row."
      },
      {
        title: "The second stall",
        heading: "Now do exactly the same to the second",
        prompt: "Same move, different numbers. Whatever you did to the first stall, do to this one — otherwise the two prices are not comparable.",
        givenHeading: "A lot at the second stall",
        targetHeading: "One bag",
        rows: [
          { label: "bags",    given: "{{n3}}", target: "1" },
          { label: "dollars", given: "{{n4}}", target: "?" }
        ],
        question: "What takes the second stall's bags from {{n3}} down to 1?",
        options: [
          { text: "÷ {{n3}}", correct: true,
            why: "A single bag is that share of the lot, so the price is that share too. Notice it is not the same number as the first stall — it is the same MOVE, which is what matters." },
          { text: "− {{n3less1}}",
            why: "It reaches 1, but subtracting is not sharing out. The same subtraction on the dollars would price a bag at {{sub2Result}} dollars, when {{n3}} of them together only cost {{n4}}." },
          /* Deliberate: the first stall's divisor, offered on the second table.
             It is the exact error of copying a number across instead of
             copying the move, which is what this pair of tables teaches. */
          { text: "÷ {{n1}}",
            why: "That is the first stall's divisor. The move is the same but the number is not — this stall sells its rice in different sized lots." },
          { text: "× {{n3}}",
            why: "That goes the wrong way, to {{n3sq}} bags. You are trying to get down to a single one." }
        ],
        settledSay: "The same move on both stalls. Now, and only now, the two prices can be set against each other.",
        law: "Both stalls get the identical treatment — that is what makes the comparison fair.",
        pending: "Both dollars cells stay question marks on purpose. Work them out in the Engine Room, then the smaller one wins.",
        a11yDescription: "The second of two tables. Two rows, bags and dollars, and two columns. The first column is a lot at the second stall: {{n3}} bags for {{n4}} dollars. The second column is a single bag, so the bags cell reads 1 and the dollars cell is unknown. Getting from {{n3}} bags to 1 means dividing by {{n3}} — the same move as the first stall, with a different number."
      }
    ],
    estimate: {
      prompt: "Before calculating — roughly what do you think one bag costs at the better stall?",
      reasonableMin: 1,
      reasonableMax: 3,
      /* Said "Ten bags for twenty is two dollars each exactly" — the final
         answer, stated outright on the Plan screen, with "exactly" removing
         even the doubt. Estimating a price per bag is fine; doing the division
         for the student is not. This version names neither division. */
      modelReasoning: "Neither total is a price for one bag, but you can feel the size of it: {{n2}} dollars spread across {{n1}} bags, and {{n4}} across {{n3}}. Both land in single figures of dollars a bag — not tens of dollars, and not cents. Which of the two is actually lower is the thing you still have to settle.",
      unit: "dollars per bag"
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "First: what does one bag cost at the first stall?",
        answer: { exact: "{{p1}}", unit: "dollars per bag", acceptedForms: ["{{p1}}", "{{p1dec}}", "${{p1dec}}", "${{p1}}"] },
        workedExplanation: "The first stall charges {{n2}} dollars for {{n1}} bags, and every bag costs the same. {{n2}} divided by {{n1}} is {{p1dec}}. Check it: {{n1}} bags at {{p1dec}} each is {{n2}} dollars.",
        misconceptions: [
          { response: "{{inv1}}", diagnosis: "You divided {{n1}} by {{n2}} instead of {{n2}} by {{n1}}. That gives bags per dollar, not dollars per bag. Check the units against the question: it asks what a bag COSTS, so the answer should be an amount of money.", tag: "inverted-rate" },
          { response: "{{mul1}}", diagnosis: "You multiplied {{n2}} by {{n1}}. That would be the cost of {{n1}} lots, not one bag. One bag has to cost less than the whole lot.", tag: "multiplied-instead-of-divided" },
          { response: "{{sub1}}", diagnosis: "You subtracted {{n1}} from {{n2}}. Taking bags away from dollars doesn't leave a price per bag; the two have to be divided to link them.", tag: "subtracted-unlike-units" },
          { response: "{{n2}}",   diagnosis: "That's the price of the whole lot, which you were given. A single bag must be a smaller number.", tag: "returned-given-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "{{n2}} dollars buys {{n1}} bags, and every bag costs the same. How is that {{n2}} dollars shared out?" },
          { rung: 2, type: "signal",   text: "Split the price across the bags: divide the dollars by the number of bags." },
          { rung: 3, type: "coupling", text: "{{n2}} ÷ {{n1}} = ___" },
          { rung: 4, type: "route",    text: "{{n2}} ÷ {{n1}} = {{p1dec}}. One bag costs ${{p1dec}} at the first stall." }
        ]
      },
      {
        id: "s2",
        prompt: "Now: what does one bag cost at the second stall — and which stall is better value?",
        answer: { exact: "{{p2}}", unit: "dollars per bag", acceptedForms: ["{{p2}}", "{{p2dec}}", "${{p2}}", "${{p2dec}}"] },
        workedExplanation: "The second stall charges {{n4}} dollars for {{n3}} bags, so one bag is {{n4}} divided by {{n3}}, which is {{p2dec}} dollars. That is less than the {{p1dec}} at the first stall, so the second stall is better value even though its total price is higher. Check it a different way: to buy {{lcm}} bags you would pay {{lots1}} lots of {{n2}}, which is {{cost1}} dollars, at the first stall, but only {{lots2}} lots of {{n4}}, which is {{cost2}} dollars, at the second.",
        misconceptions: [
          { response: "{{inv2}}", diagnosis: "You divided {{n3}} by {{n4}} instead of {{n4}} by {{n3}}. That is bags per dollar. It is a fair way to compare, but the question asks for the cost of a bag, so the answer needs to be in dollars.", tag: "inverted-rate" },
          { response: "{{p1}}",   diagnosis: "That's the first stall's price per bag, which you worked out in the last step. The second stall works out cheaper — compare the two before you answer.", tag: "picked-wrong-stall" },
          { response: "{{mul2}}", diagnosis: "You multiplied {{n4}} by {{n3}}. One bag has to cost less than the whole lot, not many times more.", tag: "multiplied-instead-of-divided" },
          { response: "{{n4}}",   diagnosis: "That's the price of the whole lot at the second stall, which you were given. The question asks for one bag.", tag: "returned-given-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Do the same thing you did for the first stall: {{n4}} dollars, {{n3}} bags, all the same price." },
          { rung: 2, type: "signal",   text: "Divide the second stall's price by its number of bags, then put the two per-bag prices side by side." },
          { rung: 3, type: "coupling", text: "{{n4}} ÷ {{n3}} = ___, and compare it with {{p1dec}}" },
          { rung: 4, type: "route",    text: "{{n4}} ÷ {{n3}} = {{p2dec}}. One bag costs ${{p2dec}} at the second stall, which is cheaper than ${{p1dec}} — so the second stall is better value." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{p2}}", unit: "dollars per bag", acceptedForms: ["{{p2}}", "{{p2dec}}", "${{p2}}", "${{p2dec}}"], preferredForm: "${{p2dec}}" },
    questionCheck: "The question asked what ONE bag costs at the better stall — not what a lot costs, and not which stall it is.",
    unitsCheck: "dollars per bag",
    reasonablenessCheck: "${{p2dec}} a bag at the second stall against ${{p1dec}} at the first. {{n3}} bags at ${{p2dec}} is the ${{n4}} you were told, so the rate rebuilds the price you started from.",
    reasonablenessFailExample: "If you got {{inv2}}, that is well under a dollar a bag — but {{n3}} bags cost {{n4}} dollars, so a price that small would only come to {{invTotal}}. Whenever a rate looks too small, try rebuilding the total with it.",
    connection: "Every signal in this problem pointed the wrong way: the better stall charged more in total, sold more bags, and had the bigger sign. None of that is evidence. Two prices can only be compared once they describe the same amount of stuff."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved from the story and cross-checked at a matched quantity (the least common multiple of the two lot sizes), which has to agree about who is cheaper: 15/6=2.50 vs 20/10=2.00, and at 30 bags 75 vs 60; 15/3=5 vs 28/7=4, and at 21 bags 105 vs 84; 20/5=4 vs 30/12=2.50, and at 60 bags 240 vs 150; 24/3=8 vs 35/7=5, and at 21 bags 168 vs 105. Three story-level constraints verified by hand in every set and checked again in the browser: the second stall is cheaper per bag, charges MORE in total, and sells MORE bags — if any flipped, every sentence about the surface signals pointing the wrong way would be false. Both reciprocals are terminating decimals in every set (0.4/0.5, 0.2/0.25, 0.25/0.4, 0.125/0.2), which is the constraint that rules out most candidate sets: the inverted-rate misconception is the one this problem exists to catch, and 4 bags for 14 dollars would have made its response 0.2857142857. Estimate brackets contain the final answer: 1-3/2, 2.5-6/4, 1.5-4/2.5, 3-9/5. All acceptedForms re-checked as numerically equal to exact per set." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Problem text FK grade 2.2-4.8, 9-12 words per sentence. Ratio Table prose FK 3.3, Junction FK 2.3. No grade level named. Animated scene carries a caption; ratio table carries an a11yDescription. Contrast on the new tokens measured earlier at 5.04:1 (arrows, unknown cell) and 5.33:1 (selected option)." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "Cycle 7b findings stand, including the deliberate 'first stall's divisor' distractor on the second table — copying a number across instead of copying the move is the error this pair of tables exists to teach. 2026-08-01: spelled-out givens ('Fifteen dollars for six bags and twenty dollars for ten') tokenised in the Ticket Booth discriminator, the read3 explanation and both hint ladders; they would have contradicted three sets in four." },
    student:   { status: "partial", agent: "claude-session", date: "2026-07-30", notes: "Cycle 7b. Full Ratio Local trip driven in a real browser through rr-market-stall: Read 1 empty input blocked; Read 2 rejects a distractor-only selection with a diagnosis; Read 3 and Ticket Booth graded; both ratio tables settle and leave their unknown cells blank; inverted-rate misconception (0.4) caught with the right diagnosis; both steps solved; Arrivals Board reached. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-07-30", notes: "Cycle 7b. Maths independently re-derived from the problem story rather than checked against the stated answer; every number set re-solved. Approved for the mechanical, mathematical and pedagogical properties measured. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16 and REVIEW-LOG.md Cycle 7b." }
  }
});
