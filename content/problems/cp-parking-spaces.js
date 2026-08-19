/* The Compare Line · MULTIPLICATIVE · referent unknown · spaces · partial · DRAFTING TABLE
   THE FOURTH PROBLEM, AND THE FIRST WITH A DIFFERENT STRUCTURE UNDER IT.

   Problems 1–3 are additive: two amounts and a fixed gap between them. This one
   is multiplicative — `Larger = Factor × Smaller`, PEDAGOGY.md §3.2 — and it is
   a different picture, not a variation. There is no difference to mark off the
   end of a bar, because the story never states one. What it states is how many
   TIMES bigger, so the honest picture is the referent drawn once and the other
   amount drawn as that many copies of it. See the `times` mode in
   compare-model.js; letting this ride the additive shape would have drawn a gap
   the story does not mention, at a width derived from nothing.

   WHY THE REFERENT IS THE UNKNOWN, which is the hard version on purpose.
   "Four times as many as WHAT" is the #1 error on this line, and it bites
   hardest when the answer to "what" is the thing you have not got. The story
   says "times as many" and the move is a DIVISION — the multiplicative twin of
   cp-bench-count, where the story says "more" and the move is a subtraction.

   THE OBJECTION TO THAT, AND THE ANSWER TO IT. This line's own principle is
   that a rule which fails the first time it is used teaches nothing:
   cp-ticket-queues lets "more means add" succeed before cp-bench-count takes it
   away. On the multiplicative side there is only one problem, so the same arc is
   compressed INTO it — the Test Track demonstrates a story missing the larger
   amount, where "times as many" does mean multiply and works cleanly, and only
   then does the student's own picture turn out to be the other way round. The
   rule is allowed to win once before it is broken, on the same screen.

   THE OTHER LINE IT COULD BE MISTAKEN FOR IS EQUAL GROUPS, and for the first
   time on this site that confusion is genuinely reasonable: the car park really
   is four copies of the bike rack. The distinction is in the Platform Check's
   own wording — "no fixed amount is being REPEATED TO BUILD A TOTAL". There are
   exactly two things here, a rack and a car park, and "four times" describes
   their relative size. Equal Groups would be four separate car parks and a
   question asking what they come to. Both the `shape` question and the `groups`
   distractor are authored to say this out loud rather than assert it.

   FOUR NUMBER SETS. Constraints:
     - n2 must divide exactly by n1, or the bike rack has a fraction of a space;
     - the factor stays between 3 and 6 — below that "times as many" is barely a
       multiplication, above it the copies stop being distinguishable in the
       picture at the width a station gives it;
     - the answer must differ from both givens, from the distractor, and from the
       wrong-way multiplication, so each misconception diagnoses one mistake;
     - space counts stay plausible for a small station.

   Verified both ways per set — the division that recovers the rack, and the
   multiplication that rebuilds the car park:
     52 / 4 = 13  (13 x 4 = 52)   wrong-way 52 x 4 = 208
     51 / 3 = 17  (17 x 3 = 51)   wrong-way 51 x 3 = 153
     65 / 5 = 13  (13 x 5 = 65)   wrong-way 65 x 5 = 325
     48 / 6 = 8   (8  x 6 = 48)   wrong-way 48 x 6 = 288 */
MF.registerProblem({
  id: "cp-parking-spaces",
  schemaVersion: 1,
  status: "published",
  title: "How many spaces the bike rack has",
  line: "compare",
  topics: ["multiplicative-compare", "referent", "division", "inverse-operations"],
  steps: 1,

  unknownCar: "referent",
  context: "spaces",
  fadeLevel: "partial",
  stationRoles: ["drafting"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "switchyard"],
  hubStrategyNote: "The story says times as many and the answer comes from dividing. Drawing the copies is what makes it obvious which amount is being copied — and the amount being copied is the one the question asks for.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-08" },

  numberChecks: [
    ["n2", "/", "n1", "=", "ans"],
    ["ans", "*", "n1", "=", "n2"],
    ["n2", "/", "ans", "=", "n1"],
    ["n2", "*", "n1", "=", "mMul"]
  ],

  numberSets: [
    { numbers: { n1: "4", n2: "52", n3: "3" },
      derived: { ans: "13", mMul: "208" },
      estimate: { min: 8, max: 20 } },
    { numbers: { n1: "3", n2: "51", n3: "5" },
      derived: { ans: "17", mMul: "153" },
      estimate: { min: 11, max: 24 } },
    { numbers: { n1: "5", n2: "65", n3: "4" },
      derived: { ans: "13", mMul: "325" },
      estimate: { min: 8, max: 20 } },
    { numbers: { n1: "6", n2: "48", n3: "3" },
      derived: { ans: "8", mMul: "288" },
      estimate: { min: 5, max: 14 } }
  ],

  problem: {
    text: "Outside Thorne Bridge there is a rusting bike rack, and beyond it a gravel car park. The car park has {{n1}} times as many spaces as the bike rack. The station has {{n3}} entrances, each with a stiff wooden door. The car park has {{n2}} marked spaces. How many spaces does the bike rack have?",
    sentences: [
      "Outside Thorne Bridge there is a rusting bike rack, and beyond it a gravel car park.",
      "The car park has {{n1}} times as many spaces as the bike rack.",
      "The station has {{n3}} entrances, each with a stiff wooden door.",
      "The car park has {{n2}} marked spaces.",
      "How many spaces does the bike rack have?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "4",  unit: "times",     role: "factor",     spoken: "4" },
      n2: { value: "52", unit: "spaces",    role: "larger",     spoken: "52" },
      n3: { value: "3",  unit: "entrances", role: "distractor", spoken: "3" }
    },
    context: { setting: "railway station", requiresCulturalKnowledge: false }
  },

  /* THE MOTION IN THIS SCENE MAY NOT IMPLY ARRIVAL OR DEPARTURE. A car driving
     into the picture would change how many spaces are taken, and the Platform
     Check on this very problem asks whether any amount ends up different from
     how it started. The scene answers "no" by construction: hazard lights blink,
     a sign swings, nothing moves in or out. Spaces are the quantity, so both
     rows run off both edges of the frame — see compare-scenes.js. */
  scene: {
    mode: "anim", art: "spaces",
    caption: "The car park beside the station and the bike rack outside it, both running away past the edge of the picture."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "There is a bike rack and there is a car park. We are told how many times bigger the car park is, and how many spaces it has, and we want to know how many spaces are on the bike rack.",
      platformCheck: {
        sentences: [1, 3],
        why: "Between them those sentences give how many times bigger the car park is, and the size of the car park. Notice what is missing: nothing states the bike rack's spaces, and that is what the question wants.",
        kinds: "Everything counted here is a space to leave something in."
      },

      questions: {
        kinds: {
          ask: "This story counts parking spaces and bike rack spaces, and it also counts the station's entrances. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "A space for a bike and a space for a car are both spaces. The entrances are somewhere else entirely.",
                         no:  "That would mean spaces and entrances were pinned to each other, so that adding a space built a doorway. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the spaces scaled with the entrances. How many ways into the station there are says nothing about how many vehicles fit outside it." }
          }
        },
        moments: {
          ask: "Does the bike rack or the car park end up with a different number of spaces from how it started?",
          options: {
            steady:  { yes: "Nothing is built and nothing is closed off. Both simply have the spaces they have, and the story sets them side by side.", no: "" },
            changed: { yes: "", no: "That would mean spaces being added or taken away partway through. A car park can be busy all day without the number of spaces in it changing." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of — a single place to park, or separate places held up against each other?",
          options: {
            separate: { yes: "The bike rack and the car park, both there at once, with the story measuring how their sizes compare.", no: "" },
            single:   { yes: "", no: "That would mean only a single place was ever in view. Count how many places the story gives you space numbers about." },
            paired:   { yes: "", no: "That would mean spaces locked to something else and scaling with it. The relationship here is between fixed places outside the station, not a rate you could apply to any size of station." }
          }
        },
        shape: {
          /* The genuinely hard question on this problem, and the first place on
             the site where "the same amount over and over" is a fair reading.
             It is answered on the Check's own criterion — repeated TO BUILD A
             TOTAL — not by asserting that the student is wrong. */
          /* The token came out of this question. `{{n1}}` renders as a digit,
             and read1 is a numberless screen — the validator caught it, which is
             the rule working exactly as the memory of this project says it must.
             "A number of times" says the same thing and states nothing. */
          ask: "The car park is a number of times the size of the bike rack. Is that the same amount being repeated to build a total, or neither?",
          options: {
            neither: { yes: "Nothing is cut into shares, and nothing is being repeated to build a total. There are separate places, and the story measures how their sizes compare.", no: "" },
            repeat:  { yes: "", no: "The closest call on this line, because the car park really is that many rack-loads. But repeating builds a TOTAL out of separate groups — that would be several car parks, with the question asking what they come to. Here there is a rack and a car park, and \"times as many\" is how their sizes compare." },
            cut:     { yes: "", no: "That would mean a single whole divided into shares that add back up to it. The bike rack is not a piece of the car park — they are separate places outside the station." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story — the bike rack, the car park, and how many times bigger the car park is?",
          options: {
            onekind: { yes: "Amounts side by side, and a relationship between their sizes, the whole way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there are amounts side by side and a relationship between their sizes, and nothing stacked on top of that." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A car park measured against a bike rack is squarely the Compare Line — the measuring is just done in times rather than in spaces." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many spaces the car park has", needed: true },
        { token: "n1", describe: "how many times bigger the car park is than the bike rack", needed: true },
        { token: "n3", describe: "how many entrances the station has", needed: false }
      ],
      relationship: "One of these is a count of spaces and the other is not a count of anything — it is how many TIMES one place goes into the other. The car park is the bike rack over again, that many times. The entrances are a way into the station and have no spaces in this story.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many spaces are on the bike rack.",
      commonMisreading: "Reading \"times as many\" and multiplying the number you were given, which describes a car park several times bigger than the one in the story.",
      options: [
        { text: "How many times bigger the car park is",
          why: "You were handed that. It is the relationship between the two places, not a count of spaces at either of them." },
        { text: "The spaces on the bike rack", correct: true,
          why: "It is the only amount the story never states, and it is the one the last sentence names." },
        { text: "How many spaces the car park has",
          why: "Also given. It is the amount the bike rack is being measured against — or rather, the amount built out of it." },
        { text: "The spaces at both places together",
          why: "Nothing asks for a total. Adding them would be adding a count of spaces to a count of spaces you have not worked out yet." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "Two places exist at once, neither of them changing, and the story states how one compares in size to the other. Measuring one amount against another is the Compare Line — the measuring here is done in times rather than in spaces, and that changes the operation, not the line.",
    distractors: [
      { line: "groups",    whyWrong: "The strongest case against this problem being Compare, and worth taking seriously: the car park really is {{n1}} rack-loads. But Equal Groups repeats an amount to BUILD a total out of separate groups — {{n1}} car parks, and what do they come to. Here there are exactly two places outside one station, and \"times as many\" describes how their sizes compare. The giveaway is that nothing in the story is a group of anything." },
      { line: "change",    whyWrong: "Nothing happens to either place. Change needs one amount that ends up different from how it started, and no space is built or closed in this story. It is tempting because dividing feels like something being broken up — but the division is how you MEASURE one place against the other, not something the station did." },
      { line: "partwhole", whyWrong: "Part–Whole needs a named whole that the pieces belong to. The bike rack is not a part of the car park — they are separate places that happen to be compared. Nobody could park a car in the bike rack and reduce the car park." },
      { line: "ratio",     whyWrong: "The closest of the four, because \"{{n1}} times as many\" does hold at any size. But a ratio pins two DIFFERENT kinds of thing together so that changing one drags the other along. Here both amounts are spaces, and neither one moves; the story is comparing two fixed places, not stating a rate you could scale." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "the bike rack's spaces",
      "the car park's spaces",
      "how many times bigger the car park is"
    ],
    unknownCarAnswer: "the bike rack's spaces",
    unknownCarWhy: "The story counts the car park outright and tells you how many times bigger it is. The bike rack is never counted, and that is what the question asks for."
  },

  signalBox: {
    /* MULTIPLICATIVE: no gapToken. The `times` mode draws the referent once and
       the car park as {{n1}} copies of it, seamed. The seams carry no numbers —
       {{n1}} blank copies beside a total of {{n2}} is the relationship the story
       states; the same copies labelled would be the division, done, on the
       screen before the Engine Room asks for it. */
    compareBars: {
      title: "Side by side",
      heading: "One bike rack, and a car park built out of copies of it",
      prompt: "The car park is measured against one of these. Tap the one it is measured AGAINST.",
      bars: [
        { key: "rack",    label: "Bike rack", unknown: true },
        { key: "carpark", label: "Car park",  token: "n2" }
      ],
      factorToken: "n1",
      referent: "rack",
      gapLabel: "the bike rack's spaces",
      why: "The car park is measured against the BIKE RACK — \"{{n1}} times as many spaces as the bike rack\". So the rack is the amount being copied, even though it is the one you do not know yet. The car park is that copy repeated, and one copy of it is the answer.",
      whyWrong: {
        carpark: "The car park is the one being measured — the story says it has {{n1}} times as many spaces THAN something else. Find what follows \"as\": that is the amount being measured against, and here it happens to be the one you have to work out."
      },
      a11yDescription: "Two bars. The bike rack is drawn as a single copy, outlined rather than filled, with a question mark for its total because the story never states it. The car park is drawn as {{n1}} of those copies laid end to end, seamed between each one, carrying its {{n2}} spaces. No copy is labelled — how big one copy is is exactly what the question asks.",
      settledSay: "Whatever follows the words \"times as many as\" is the amount you measure against — even when that is the amount you are looking for."
    },
    estimate: {
      prompt: "Before calculating — roughly how many spaces do you think the bike rack has?",
      reasonableMin: 8,
      reasonableMax: 20,
      modelReasoning: "The bike rack is the SMALL one — the car park is {{n1}} times its size — so the answer has to be a good deal less than {{n2}}. Ask yourself what number, {{n1}} of them, would come to about {{n2}}.",
      unit: "spaces"
    },

    /* THE TEST TRACK, and it carries the arc this problem cannot carry across
       problems: the worked pair is missing the LARGER amount, where "times as
       many" does mean multiply and works cleanly. Only then does the student's
       own picture turn out to be the other way round. The rule wins once, on the
       same screen, before it is broken.

       The worked pair runs on 20 and a factor of 2, which belong to no problem
       or set on this line (VERIFICATION.md §26), and its own answer — 40 — is
       never shown, because nothing here is calculated. */
    testTrack: {
      kind: "compare",
      title: "The Test Track",
      heading: "Which one is being copied?",
      intro: "A compare can measure in TIMES instead of in ones. When it does, one amount is the other one over and over — and which of them is being copied decides everything. Watch one.",
      worked: {
        label: "A story missing the BIGGER amount. The small one and the number of times are both given.",
        button: "Show me",
        factor: 2,
        unit: { label: "Blue tub", val: "20" },
        mult: { label: "Red tub" },
        unitUnknown: false,
        sayCut: "The blue tub holds 20, and the red tub holds 2 times as many as that.",
        sayTake: "The tub being COPIED is the blue one, and you have it. So you build up from what you know. Notice the picture stops there — it does not work the total out."
      },
      yours: {
        wholeLabel: "Your story. Look at which bar is drawn as copies before you decide anything.",
        factor: "{{n1}}",
        unit: { label: "Bike rack" },
        mult: { label: "Car park", val: "{{n2}}" },
        unitUnknown: true,
        q1: "Which amount does your story already give you?",
        options1: [
          { text: "The car park", correct: true, marks: "known",
            why: "The story counts the car park's spaces outright. The bike rack is never counted." },
          { text: "The bike rack",
            why: "Read it again — the bike rack is what the car park is measured against, but the story never says how many spaces it has. That is the question." },
          { text: "Neither of them, only the number of times",
            why: "The number of times is given, that part is right. But so is the car park — its spaces are counted outright in the last sentence before the question." }
        ],
        settled1: "You have the big amount, and you know how many copies it is made of.",
        q2: "So which way do you travel to reach the bike rack?",
        options2: [
          { text: "Split the car park into equal copies", correct: true, marks: "off",
            why: "The car park is drawn as that many copies of the rack. One of those copies IS the rack, so splitting the car park into them is how you get there." },
          { text: "Multiply the car park by the number of times", marks: "on",
            why: "That would make the bike rack BIGGER than the car park — on a story that says the car park is the bigger of the two. Multiplying is how you would go the other way, from the rack to the car park." },
          { text: "Take the number of times off the car park", marks: "off",
            why: "The number of times is not a count of spaces, so it cannot be taken off one. It says how many rack-loads the car park is, not how many spaces more it has." }
        ],
        settled2: "Split the amount you have into that many equal copies, and one copy is the one you want."
      },
      law: "Which bar is drawn as copies decides the direction. The words never do.",
      bridge: "The picture stops at the direction on purpose — actually doing the division is the next stop.",
      a11yDescription: "A demonstration in two bars. First a worked example: a blue tub holding twenty, and a red tub drawn as that same bar twice over, seamed down the middle, its total unknown — so you build up from what you know. Then your own story, which is the other way round: the car park is drawn as several copies of the bike rack and carries its own count, while the bike rack is a single outlined copy carrying the question mark, so you travel the other way. No copy is labelled and nothing is calculated in either picture."
    }
  },

  /* The Signal Failure. Walked into, never pointed at — nothing before the
     Engine Room says a word about it, which is the ch-water-tank lesson.
     Top-level because it renders at the Arrivals Board (Phase 4b), after the
     answer is shown; on the Plan screen "why is the answer smaller than the
     number you were given" would settle the direction step 1 exists to ask. */
  signalFailure: {
    trigger: "times",
    prompt: "The story says the car park has {{n1}} TIMES as many spaces. Why is the answer smaller than the number you were given?",
    why: "Because the sentence is telling you about the car park, not the bike rack. \"{{n1}} times as many as the bike rack\" says the car park is the bigger of the two — so the rack, the one you are being asked for, has to come out below it. The words tell you which is bigger. They do not tell you what to do."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many spaces does the bike rack have?",
        answer: { exact: "{{ans}}", unit: "spaces", acceptedForms: ["{{ans}}", "{{ans}} spaces"], preferredForm: "{{ans}}" },
        workedExplanation: "The car park is the bike rack {{n1}} times over, and it has {{n2}} spaces. So {{n2}} splits into {{n1}} equal copies, and one copy is the rack: {{n2}} ÷ {{n1}} = {{ans}} spaces. Check it forwards — {{ans}} × {{n1}} = {{n2}}, the car park exactly. And notice what just happened: the story said \"times as many\" and the move was a division.",
        hints: [
          { rung: 1, text: "Read the sentence with \"times as many\" in it again. Which place is it telling you about — the one you know, or the one you are looking for?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The car park is drawn as {{n1}} copies of the bike rack. What is one of those copies worth?" },
          { rung: 3, text: "The bike rack is the car park split into {{n1}} equal copies: {{n2}} ÷ {{n1}} = ___" },
          { rung: 4, text: "{{n2}} ÷ {{n1}} = {{ans}}. The bike rack has {{ans}} spaces." }
        ],
        misconceptions: [
          { response: "{{mMul}}", diagnosis: "You multiplied, because the story says \"times as many\". This is the trap this problem is built around. Those words are telling you the CAR PARK is the bigger one — and you were already given the car park's count. Multiplying makes the bike rack bigger than the car park it is supposed to fit inside {{n1}} times over.", tag: "keyword-multiplication" },
          { response: "{{n2}}", diagnosis: "That is the car park's count, which the story handed you. The bike rack is the smaller of the two, so its number has to come out below {{n2}}.", tag: "gave-back-the-larger" },
          { response: "{{n1}}", diagnosis: "That is how many times bigger the car park is, not a count of spaces at either place. It is a number of copies, not a number of spaces.", tag: "gave-back-the-factor" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "spaces", acceptedForms: ["{{ans}}", "{{ans}} spaces"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked about the BIKE RACK — the one the story never counts. Not the car park, and not how many times bigger it is.",
    unitsCheck: "spaces",
    reasonablenessCheck: "{{ans}} spaces on the bike rack. Lay {{n1}} of those end to end and you land on {{n2}}, the car park exactly. And the answer is smaller than {{n2}}, which it has to be, because the car park is the bigger of the two.",
    reasonablenessFailExample: "If you got {{mMul}}, the bike rack would hold more than the car park — on a story that says in so many words that the car park is {{n1}} times the size.",
    connection: "Two problems ago \"more\" meant add and then it meant take away. Here \"times as many\" means divide, and again nothing in the wording tells you which. What told you was which bar the picture drew as copies — the one being copied is the one the story measures against."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-08",
                 notes: "Four sets, each re-derived and checked both ways: 52/4=13 (13x4=52); 51/3=17 (17x3=51); 65/5=13 (13x5=65); 48/6=8 (8x6=48). Every n2 divides exactly by its n1, so no set produces a fractional space. The keyword-multiplication value is large but typable in all four: 208, 153, 325, 288. All misconception values distinct from the answer, from each other and from the distractor within each set. numberChecks assert the division, the multiplication back, the factor recovered, and the wrong-way product." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-08",
                 notes: "First multiplicative compare on the site, and the first problem where the Equal Groups reading is genuinely defensible — both the shape question and the groups distractor argue it out on the Platform Check's own criterion (repeated TO BUILD A TOTAL) rather than asserting the student is wrong. The keyword arc that runs across problems 2 and 3 is compressed into the Test Track here, because there is only one multiplicative problem on the line: the demo lets 'times as many means multiply' succeed before the student's own picture takes it away. Signal Failure attached and NOT foreshadowed before the Engine Room. Read 3's distractor placed mid-list." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-08",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md §16). The Equal Groups discrimination is the part most in need of a real student: it is argued carefully in the copy, and whether that argument lands is not something the author can judge." }
  }
});
