/* The Ratio & Rate Rail · PERCENT SURFACE · percent as a rate · SIGNAL BOX
   THE LAST OF THE FIVE ON THE PERCENT CARD, and the one that says what per cent
   actually IS: per hundred. A rate.

   WHY THIS IS RATIO AND NOT PART–WHOLE, which is the whole difficulty of
   authoring it. "Twelve per cent of the passengers bought a drink" and "twelve
   per cent of the seats are reserved" are the same arithmetic, and the site now
   carries both — `pw-seats-reserved` is the other. If the two cannot be told
   apart the percent card teaches nothing at its Ticket Booth, so they are
   authored against each other on purpose:

     PART–WHOLE   the percentage cuts a NAMED TOTAL into a part and a rest, and
                  the two add back to it. The reserved seats and the free seats
                  are both seats; together they are the trainful.
     RATIO        the percentage locks TWO DIFFERENT KINDS of thing together and
                  holds at any size. Passengers and cups of tea are not pieces
                  of each other and never add to anything — twelve in every
                  hundred is a rate, and it is as true of a thousand passengers
                  as of a hundred.

   The test that decides it: can you add the two quantities and get something
   the story names? Seats plus seats gives the trainful. Passengers plus cups
   gives nothing. That is in the Ticket Booth's Part–Whole distractor in as many
   words, because it is the discrimination this problem exists to force.

   THE TEST TRACK IS `cross`, WHICH THIS LINE OWNS, and here it earns its place
   twice over: cross-multiplying a proportion is the Ratio Rail's own second
   route, AND the proportion it sets up is literally the definition of per cent.
   The left row is a hundred passengers against the rate. That is not an analogy
   for a percentage — it is what the word means, and seeing it as a ratio row is
   the whole lesson ROADMAP.md §3 assigns to this problem.

   THE TRAP, and it is the commonest percent error of all: multiplying by the
   percentage and forgetting the per hundred. {{n2}} times {{n1}} is a number
   nearly a hundred times too big, and a student who has just been told "per
   cent means per hundred" is exactly the student who will do it. Diagnosed by
   name, and the Signal Failure is built on it.

   FOUR NUMBER SETS. Constraints:
     - the rate must divide the crowd into a whole number of drinks, or the
       barrow sold part of a cup;
     - the crowd stays in the hundreds, which is a real day at a small station,
       and the rate stays in the range a tea barrow could actually take;
     - the answer, the forgot-the-hundred value and the percent-as-count value
       must all differ from each other and from both givens.

   Verified per set — the rate applied, and checked back as a proportion:
     12% of 850  = 102   (102 in 850 is 12 in every hundred)   x-100 = 10200   as-a-count 850 - 12 = 838
      8% of 1200 =  96   (96 in 1200 is 8 in every hundred)    x-100 =  9600   as-a-count 1200 - 8 = 1192
     15% of 720  = 108   (108 in 720 is 15 in every hundred)   x-100 = 10800   as-a-count 720 - 15 = 705
     20% of 450  =  90   (90 in 450 is 20 in every hundred)    x-100 =  9000   as-a-count 450 - 20 = 430 */
MF.registerProblem({
  id: "rr-drink-rate",
  schemaVersion: 1,
  status: "published",
  title: "How many hot drinks the barrow sold",
  line: "ratio",
  topics: ["percent", "rate", "per-hundred", "proportion"],
  steps: 2,

  surface: "percent",

  unknownCar: "part",
  context: "barrow",
  fadeLevel: "partial",
  stationRoles: ["signalbox"],
  hubEligible: true,
  hubGoodStrategies: ["signalbox", "drafting"],
  hubStrategyNote: "Everything here turns on reading \"per cent\" as \"per hundred\" and noticing that it is a rate rather than a slice of a total. A student who spots that has a ratio table; a student who does not has two numbers and a guess.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-10" },

  numberChecks: [
    ["rate", "*", "100", "=", "n2"],
    ["n1", "*", "rate", "=", "ans"],
    ["ans", "/", "n1", "=", "rate"],
    ["n1", "/", "100", "=", "hundreds"],
    ["hundreds", "*", "n2", "=", "ans"],
    ["n1", "*", "n2", "=", "mTimes"],
    ["n1", "-", "n2", "=", "mCount"]
  ],

  numberSets: [
    { numbers: { n1: "850", n2: "12", n3: "9" },
      derived: { rate: "0.12", hundreds: "8.5", ans: "102", mTimes: "10200", mCount: "838" },
      estimate: { min: 80, max: 130 } },
    { numbers: { n1: "1200", n2: "8", n3: "6" },
      derived: { rate: "0.08", hundreds: "12", ans: "96", mTimes: "9600", mCount: "1192" },
      estimate: { min: 76, max: 120 } },
    { numbers: { n1: "720", n2: "15", n3: "7" },
      derived: { rate: "0.15", hundreds: "7.2", ans: "108", mTimes: "10800", mCount: "705" },
      estimate: { min: 86, max: 135 } },
    { numbers: { n1: "450", n2: "20", n3: "5" },
      derived: { rate: "0.2", hundreds: "4.5", ans: "90", mTimes: "9000", mCount: "430" },
      estimate: { min: 72, max: 112 } }
  ],

  problem: {
    text: "A tea barrow stands at the end of the draughty platform, steaming away under a striped awning. The woman who runs it says {{n2}} in every hundred people who walk past stop and buy something hot. On Saturday {{n1}} people walked past. The barrow has {{n3}} kinds of biscuit. How many hot drinks did she sell?",
    sentences: [
      "A tea barrow stands at the end of the draughty platform, steaming away under a striped awning.",
      "The woman who runs it says {{n2}} in every hundred people who walk past stop and buy something hot.",
      "On Saturday {{n1}} people walked past.",
      "The barrow has {{n3}} kinds of biscuit.",
      "How many hot drinks did she sell?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "850", unit: "people",   role: "total",      spoken: "850" },
      n2: { value: "12",  unit: "per cent", role: "percent",    spoken: "12" },
      n3: { value: "9",   unit: "kinds",    role: "distractor", spoken: "9" }
    },
    context: { setting: "station tea barrow", requiresCulturalKnowledge: false }
  },

  /* BOTH quantities in this problem are counts and both are on the picture, so
     both have to be untallyable: the crowd overlaps at a pitch of eleven and
     runs off both edges, and the cups are a stack clipped by the barrow's front
     board so its base cannot be seen. Nothing runs out — this problem's
     Platform Check answers "steady", and a stack getting shorter would say an
     amount had changed. Measured in `ratio-scenes.js`. */
  scene: {
    mode: "anim", art: "barrow",
    caption: "The tea barrow under its striped awning, steam rising off the urn, with the Saturday crowd streaming past it and away beyond both edges of the picture.",
    authored: "generated"
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A tea barrow sells hot drinks to some of the people who walk past. We are told what share of the people passing stop and buy, and how many walked past on Saturday, and we want to know how many drinks she sold.",
      platformCheck: {
        sentences: [1, 2],
        /* No HTML entities in `why` or `kinds`: phPlatform.finish() puts both
           through esc(), so "&mdash;" would render as literal text on the page.
           Write the character. The `questions` copy below is inserted raw and
           uses entities freely, which is what makes the asymmetry easy to trip
           over — it caught me here. */
        why: "Between them those sentences give the rate the barrow sells at and the size of Saturday's crowd. Notice the first of them does not mention Saturday at all — it is true of any day, and any crowd, which is what makes it a rate.",
        kinds: "Different things are being counted here: people walking past, and hot drinks sold."
      },

      questions: {
        kinds: {
          ask: "This story counts people walking past and hot drinks sold, and it also counts kinds of biscuit. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            different: { yes: "People and hot drinks are not the same thing at all, and the story pins them together: more people past the barrow means more drinks sold, at a fixed rate.",
                         no:  "" },
            same:      { yes: "", no: "It is tempting, because both are counts of something. But a drink is not a person, and the whole story is about how they go together &mdash; which only means anything if they are different kinds." }
          }
        },
        moments: {
          ask: "Does the crowd, or the number of drinks, end up different from how it started?",
          options: {
            steady:  { yes: "The rate the barrow sells at holds all day, and Saturday's crowd is a finished count. Nothing here starts at some amount and finishes somewhere else.", no: "" },
            changed: { yes: "", no: "Worth thinking about, because selling really is something happening. But the story never gives you an amount and then changes it &mdash; it gives you a rate that holds, and a day's crowd." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of, and how are they held together?",
          options: {
            paired:   { yes: "People and drinks, pinned to each other so that changing the crowd drags the drinks along with it. That is what \"in every hundred\" does &mdash; it locks them.", no: "" },
            single:   { yes: "", no: "That would mean only a single kind of thing was ever in view. Count the kinds the story gives you a figure about: the people passing, and the drinks sold." },
            separate: { yes: "", no: "Closer, because there really are separate things being counted. But separate means set SIDE BY SIDE to be measured against each other, and these are locked together instead &mdash; each drags the other along." }
          }
        },
        shape: {
          ask: "Is something being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            neither: { yes: "Nothing is carved up and nothing repeats. There is a relationship that holds at any size, and a crowd to apply it to.", no: "" },
            cut:     { yes: "", no: "The closest call on this screen, and worth taking seriously. A share of the crowd does buy a drink &mdash; but a cut needs the pieces to add back up to a named whole, and drinks and people never add up to anything. The rate would still hold if nobody had walked past at all." },
            repeat:  { yes: "", no: "That would mean the same amount arriving again and again, with the question counting how many. The crowd is counted once, for a single Saturday." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the rate she sells at, and Saturday's crowd?",
          options: {
            onekind: { yes: "A fixed relationship between a pair of quantities, scaled up to the size of the day. The same kind of situation the whole way through &mdash; the relationship just happens to be written in per cent.", no: "" },
            stacked: { yes: "", no: "Worth asking every time, and per cent does feel like an extra idea on top. But it is only how the rate is written. Say the same rate as a fraction instead and nothing about the shape of the story moves." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A fixed rate scaled to a bigger crowd is squarely the Ratio and Rate Rail." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many in every hundred people stop and buy something hot", needed: true },
        { token: "n3", describe: "how many kinds of biscuit the barrow has", needed: false },
        { token: "n1", describe: "how many people walked past on Saturday", needed: true }
      ],
      relationship: "One of these is a count of people on one particular day. The other is not a count of anything on any day &mdash; it is a RATE, a relationship between people and drinks that holds whatever the crowd. Per cent means per hundred, so it is telling you how many drinks go with every hundred people. The biscuits sell themselves and have nothing to do with it.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many hot drinks the barrow sold on Saturday.",
      commonMisreading: "Reading \"{{n2}} in every hundred\" as a number of drinks rather than a rate, and doing something to it directly.",
      options: [
        { text: "How many people walked past on Saturday",
          why: "You were told that outright. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "How many hot drinks she sold on Saturday", correct: true,
          why: "The count of drinks for that particular crowd. It is the only one of the three the story never states." },
        { text: "How many in every hundred people buy something hot",
          why: "Also given, and it is the most useful thing in the problem &mdash; but it is a rate, not a count. It is true of every day, so it cannot be the answer about Saturday." },
        { text: "How many people walked past without buying anything",
          why: "You could work that out, and on a different problem it might be the question. This one asks about the drinks she sold, not the people she missed." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "ratio",
    whyCorrect: "Two different kinds of thing &mdash; people and hot drinks &mdash; pinned together by a relationship that holds whatever the size. \"In every hundred\" is a rate, and scaling a rate up to the day you actually had is the Ratio and Rate Rail. Per cent is just how this rate happens to be written.",
    distractors: [
      { line: "partwhole", whyWrong: "The strongest case against, and the one worth being careful about, because a percentage of a crowd really does sound like a slice of it. Here is the test: a whole cut into parts has pieces that ADD BACK UP to it. Reserved seats plus free seats give you the trainful. But drinks plus people give you nothing at all &mdash; a drink is not a piece of a person, and the rate would still be true if nobody had walked past." },
      { line: "compare",   whyWrong: "You are not being asked how much bigger one amount is than another. The crowd and the drinks are not rivals set side by side to have the gap between them measured; they are locked together, so that changing one changes the other." },
      { line: "change",    whyWrong: "Nothing ends up different from how it started. There is no before and after here &mdash; the rate holds all day and the crowd is a finished count for one Saturday." },
      { line: "groups",    whyWrong: "Closer than it looks, because you could think of the crowd as so many hundreds, each bringing the same few drinkers. But Equal Groups needs the groups to be real separate things the question counts, and hundreds of passengers are a way of measuring one crowd, not a set of parcels." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many people walked past",
      "the rate she sells at",
      "how many drinks she sold"
    ],
    unknownCarAnswer: "how many drinks she sold",
    unknownCarWhy: "The crowd is counted outright and the rate is given as a percentage. The drinks are never counted, and that is what the last sentence asks for."
  },

  signalBox: {
    /* THE PLAINEST SHAPE AGAIN — `unknownIs: "part"`, the same as
       `pw-seats-reserved`, and that is the point rather than a shortcut. Three
       problems on this card draw the same picture and answer the Ticket Booth
       differently, which is exactly what the card is for: the surface looks
       identical and the structure underneath is not.

       The crowd is the hundred per cent because the rate is per hundred PEOPLE.
       What the mark is worth in drinks is the Engine Room's. */
    percentLine: {
      title: "Per hundred",
      heading: "Which amount is the whole hundred per cent?",
      prompt: "The rate is so many in every hundred OF one of these. Tap the one it counts per hundred of.",
      wholeToken: "n1",
      percentToken: "n2",
      unknownIs: "part",
      base: "crowd",
      questionLabel: "how many drinks that {{n2}} in every hundred is worth",
      settledLabel: "so the question is",
      choices: [
        { key: "crowd",  label: "People who walked past", said: "{{n1}}" },
        { key: "drinks", label: "Hot drinks sold",        said: "?" }
      ],
      why: "\"{{n2}} in every hundred PEOPLE who walk past\" &mdash; so it is the crowd that gets counted in hundreds, and the crowd is the whole hundred per cent. The drinks are what those hundreds produce.",
      whyWrong: {
        drinks: "The drinks are what the rate produces, not what it is counted per hundred of &mdash; and you do not know how many there were yet, so a percentage of them could not be worked out anyway. Read the sentence again and see which noun follows \"every hundred\"."
      },
      a11yDescription: "A double number line. Along the bottom: nought per cent at the left, a mark at {{n2}} per cent part way along, and a hundred per cent at the right-hand end. Along the top the same three points counted in people and drinks: nought, a question mark at the {{n2}} per cent mark, and {{n1}} people at the hundred per cent. The two lines share one axis, so the rate and the number of drinks it is worth sit at the same place.",
      settledSay: "Whatever the rate is counted per hundred OF is the whole hundred per cent."
    },

    estimate: {
      prompt: "Before calculating &mdash; roughly how many hot drinks do you think she sold?",
      reasonableMin: 80,
      reasonableMax: 130,
      modelReasoning: "Only a small share of the crowd stops, so the answer is a lot smaller than {{n1}} &mdash; nowhere near half of it. Work out how many hundreds of people went past, and remember each hundred brings the same few drinkers.",
      unit: "hot drinks"
    },

    /* THE TEST TRACK IS `cross`, AND ON THIS PROBLEM IT IS NOT JUST THIS LINE'S
       KIND — IT IS THE DEFINITION. A percentage written as a ratio row is "so
       many per hundred", which is what the word means. Seeing the hundred sit
       in a table as an ordinary quantity is the lesson.

       It stops at the equation, unevaluated, exactly as every `cross` does:
       setting the proportion up cannot leak, and solving it is the Engine
       Room's. The worked example runs on a stall selling papers at a rate
       belonging to no set here, and its own product is never worked out. */
    testTrack: {
      kind: "cross",
      title: "The Test Track",
      heading: "Per cent means per hundred, and per hundred is a ratio",
      intro: "A percentage is not a special kind of number. It is a rate with a hundred underneath it &mdash; so many for every hundred &mdash; which means it fits in a ratio table like any other rate. Watch one go in.",
      worked: {
        label: "A stall selling papers to the people going past.",
        button: "Show me",
        colA: "people past", colB: "papers sold",
        rows: [
          { name: "the rate", a: "100", b: "7" },
          { name: "a morning", a: "300", b: "?" }
        ],
        equation: "100 x ? = 300 x 7",
        sayCut: "The rate goes in the top row exactly as it is said: seven papers for every hundred people. The hundred is not special &mdash; it is just a quantity.",
        sayTake: "Then the morning goes underneath, and the diagonals of a set proportion multiply to the same thing. That is the equation, and it is left as it stands: nothing on this screen is ever multiplied out."
      },
      yours: {
        wholeLabel: "Your story, in the same table.",
        colA: "people past", colB: "hot drinks",
        rows: [
          { name: "the rate", a: "100", b: "{{n2}}" },
          { name: "Saturday", a: "{{n1}}", b: "?" }
        ],
        equation: "100 x ? = {{n1}} x {{n2}}",
        q1: "What goes in the top row of your table?",
        options1: [
          { text: "A hundred people, and the drinks that go with them", correct: true,
            why: "That is what \"{{n2}} in every hundred\" says, read straight off. Per cent means per hundred, so the rate row of a percentage always has a hundred in it." },
          { text: "Saturday's crowd, and the drinks that go with them",
            why: "That is the row you are trying to fill in &mdash; it holds the question mark. The top row has to be the rate, which is the thing you already know." },
          { text: "The kinds of biscuit, and the drinks that go with them",
            why: "The biscuits are scenery. Nothing in the story links them to how much she sells, so they cannot go in a table about people and drinks." }
        ],
        settled1: "The rate row: a hundred people against the drinks they bring.",
        q2: "And what does crossing the diagonals give you?",
        options2: [
          { text: "A hundred times the missing drinks, equal to the crowd times the rate", correct: true,
            why: "The two diagonals of a set proportion multiply to the same thing, which is what makes cross-multiplying work. Notice neither side has been worked out &mdash; that is the Engine Room's job." },
          { text: "The crowd times the missing drinks, equal to a hundred times the rate",
            why: "Those two are the same diagonal, not opposite ones. A diagonal goes from one row's left cell to the other row's right cell &mdash; check which pairs you are joining." },
          { text: "The crowd added to the rate",
            why: "Adding is the classic ratio error and it is the one this line exists to break. A rate is not a number you add on; it is a relationship between two columns." }
        ],
        settled2: "A hundred times the drinks equals the crowd times the rate. Both sides left as they stand."
      },
      law: "Per cent means per hundred. Write the hundred into the table and a percentage is an ordinary rate.",
      bridge: "The proportion is set up and neither side is worked out. Doing the arithmetic is the Engine Room's question.",
      a11yDescription: "A demonstration about writing a percentage as a ratio, using no arithmetic. First a worked example: a stall selling papers at seven for every hundred people going past, with a morning of three hundred people underneath and its papers unknown. The diagonals of the set proportion are lit in turn and the equation is written out, unevaluated. Then your own story in the same shape: the rate row is a hundred people against {{n2}} hot drinks, and Saturday's row is {{n1}} people against a question mark. Crossing the diagonals gives a hundred times the missing drinks equal to {{n1}} times {{n2}}, and neither side is multiplied out here."
    }
  },

  /* Top-level, not inside signalBox: it renders at the Arrivals Board after the
     solve, and it names the trap and the value it produces. */
  signalFailure: {
    trigger: "per hundred",
    prompt: "Why is the answer not {{mTimes}}?",
    why: "Because that is the crowd multiplied by the rate with the PER HUNDRED thrown away. \"{{n2}} in every hundred\" is a pair of numbers, not one: {{n2}} drinks go with each hundred people, so the hundred has to stay in the sum. Drop it and the barrow sold more drinks than there were people on the platform, which is the check that would have caught it."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many hundreds of people walked past on Saturday?",
        answer: { exact: "{{hundreds}}", unit: "hundreds", acceptedForms: ["{{hundreds}}", "{{hundreds}} hundreds"], preferredForm: "{{hundreds}}" },
        workedExplanation: "The rate is given for every hundred people, so the useful question is how many hundreds went past: {{n1}} &divide; 100 = {{hundreds}}. It does not have to be a whole number of hundreds &mdash; a rate holds at any size, which is the point of it.",
        hints: [
          { rung: 1, type: "whistle",  text: "The rate is worded for every hundred people. So how many hundreds is Saturday's crowd?" },
          { rung: 2, type: "signal",   text: "Divide the crowd by a hundred. Do not worry if it does not come out whole &mdash; a rate works at any size." },
          { rung: 3, type: "coupling", text: "{{n1}} &divide; 100 = ___" },
          { rung: 4, type: "route",    text: "{{n1}} &divide; 100 = {{hundreds}}. That is how many hundreds of people went past." }
        ],
        misconceptions: [
          { response: "{{ans}}", diagnosis: "That is where you are heading &mdash; the drinks themselves. This step asks how many HUNDREDS of people went past, which is the thing you multiply the rate by.", tag: "jumped-to-the-answer" },
          { response: "{{n1}}", diagnosis: "That is the whole crowd, not the number of hundreds in it. Divide by a hundred to find out how many hundreds you have got.", tag: "returned-given-value" }
        ]
      },
      {
        id: "s2",
        prompt: "So how many hot drinks did she sell?",
        answer: { exact: "{{ans}}", unit: "hot drinks", acceptedForms: ["{{ans}}", "{{ans}} drinks", "{{ans}} hot drinks"], preferredForm: "{{ans}}" },
        workedExplanation: "Every hundred people bring {{n2}} drinks, and {{hundreds}} hundreds went past, so she sold {{hundreds}} &times; {{n2}} = {{ans}} hot drinks. Check it against the rate: {{ans}} out of {{n1}} really is {{n2}} in every hundred.",
        hints: [
          { rung: 1, type: "whistle",  text: "You know how many hundreds went past, and you know what each hundred is worth in drinks. Put them together." },
          { rung: 2, type: "signal",   text: "Multiply the hundreds by the rate. On the Test Track table, that is the right-hand column scaling with the left." },
          { rung: 3, type: "coupling", text: "{{hundreds}} &times; {{n2}} = ___" },
          { rung: 4, type: "route",    text: "{{hundreds}} &times; {{n2}} = {{ans}}. She sold {{ans}} hot drinks." }
        ],
        misconceptions: [
          { response: "{{mTimes}}", diagnosis: "You multiplied the whole crowd by the rate and lost the per hundred: {{n1}} &times; {{n2}}. This is the trap this problem is built around. \"{{n2}} in every hundred\" is a pair of numbers, and the hundred has to stay in the sum &mdash; otherwise the barrow sold more drinks than there were people on the platform.", tag: "dropped-the-per-hundred" },
          { response: "{{mCount}}", diagnosis: "You took {{n2}} off the crowd, as though the rate were a number of people. It is not a count of anything on its own &mdash; it is how many drinks go with every hundred who walk past.", tag: "percent-as-count" },
          { response: "{{hundreds}}", diagnosis: "That is how many hundreds of people went past, which you worked out at the last step. Each of those hundreds brings {{n2}} drinks, so there is one multiplication still to do.", tag: "gave-back-the-step" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "hot drinks", acceptedForms: ["{{ans}}", "{{ans}} drinks", "{{ans}} hot drinks"], preferredForm: "{{ans}} hot drinks" },
    questionCheck: "The question asked how many DRINKS she sold &mdash; not how many people walked past, and not the rate she sells at.",
    unitsCheck: "hot drinks",
    reasonablenessCheck: "{{ans}} hot drinks. Check it back against the rate: {{ans}} drinks out of a crowd of {{n1}} is {{n2}} in every hundred, which is exactly what she said. And it is comfortably fewer drinks than there were people, which any answer here has to be.",
    reasonablenessFailExample: "If you got {{mTimes}}, you dropped the per hundred &mdash; and the barrow would have sold more drinks than there were people on the platform all day.",
    connection: "This is the one that tells you what per cent actually IS. Not a special kind of number and not a slice of a total &mdash; a rate, with a hundred underneath it. Write the hundred into a ratio table and a percentage behaves like any other rate: it holds at any size, it scales, and it never adds. That is also the difference between this problem and the reserved seats, which looked identical and was not: seats plus seats give you the trainful, and drinks plus people give you nothing."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-10",
                 notes: "Four sets, each re-derived and checked back as a proportion: 12% of 850 = 102 and 102/850 = 0.12; 8% of 1200 = 96 and 96/1200 = 0.08; 15% of 720 = 108 and 108/720 = 0.15; 20% of 450 = 90 and 90/450 = 0.20. Every rate lands on a whole number of drinks. Step one's answer is deliberately allowed to be fractional (8.5, 12, 7.2, 4.5 hundreds) because a rate holds at any size and rounding it would break the second step; the worked explanation says so. Within each set the answer, both step values, both misconception values, both givens and the distractor are distinct: (102,8.5,10200,838,850,12,9), (96,12,9600,1192,1200,8,6), (108,7.2,10800,705,720,15,7), (90,4.5,9000,430,450,20,5). Seven numberChecks assert the rate both ways, the hundreds, the answer by the two-step route, and both misconception values. Estimate brackets contain their answers: 80-130/102, 76-120/96, 86-135/108, 72-112/90." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-10",
                 notes: "Authored deliberately against pw-seats-reserved, which is the same arithmetic on a different structure — the discrimination is 'can you add the two quantities and get something the story names', and it is written into the Part-Whole distractor rather than left implicit. Test Track is `cross` because on this problem the ratio table is not an analogy for a percentage but its definition: the rate row literally has a hundred in it. Step one asks for the number of hundreds rather than for the answer, so the per-hundred survives as a visible quantity — which is what the trap destroys. Read 3's correct option is placed second of four. NOT MEASURED: correct-option position across this problem's choice surfaces against chance." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No persona walk-through, and no real student has used this." },
    oversight: { status: "provisional", date: "2026-08-10",
                 notes: "PROVISIONAL. Author and reviewer are the same agent (VERIFICATION.md §16). The open question a classroom would settle: whether a student can genuinely tell this from pw-seats-reserved at the Ticket Booth, or whether the two read as the same problem with different nouns. The distinction is real and it is argued in both manifests, but arguing it is not the same as a student feeling it." }
  }
});
