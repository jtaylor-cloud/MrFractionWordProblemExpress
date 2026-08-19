/* The Change Line · PERCENT SURFACE · percent increase · RESULT unknown ·
   fares · worked · READING ROOM

   THE GENTLE ONE, AND THE MIRROR OF THE KEYSTONE. `ch-barrier-count` hides the
   START and makes the intuitive move fail; this hides the RESULT, where the
   intuitive move works. That order is the Change Line's own argument repeated
   in per cent: `ch-lost-property` lets "more means add" succeed, `ch-water-tank`
   breaks it, and a rule that works twice and fails the third time is worse than
   no rule. A student needs the easy percent case to trust before the hard one
   can take anything away from them.

   TWO CHANGE PROBLEMS ON THE PERCENT CARD IS DELIBERATE — ROADMAP.md §3 says so
   and gives the reason: with exactly one problem per schema a student could
   answer the Ticket Booth by ELIMINATION, without reading the story. That is
   the "never pick the last one" exploit built into the shape of the card rather
   than into one problem's options.

   THE PICTURE IS THE KEYSTONE'S, WITH THE QUESTION MARK MOVED. Both draw the
   old amount at the hundred per cent and the new amount past it; on this one
   the hundred is known and the far mark is "?", on that one the far mark is
   known and the hundred is "?". Same line, opposite ends, which is exactly the
   pair cp-ticket-queues and cp-bench-count make on the Compare Line with almost
   identical sentences.

   THE TRAP, and it is real even here: the percentage is of the OLD price. A
   student who has met the keystone knows to ask what it is a percentage OF; a
   student meeting this one first has to be given the question. It is diagnosed
   by name at step two, where adding the percentage as though it were pounds
   ({{n1}} + {{n2}}) is the commonest wrong finish.

   THE TEST TRACK IS `drive`, WHICH THIS LINE OWNS, and it is the one place this
   problem differs from the keystone in kind rather than in degree. The keystone
   takes `section`, because there the method is what breaks. Here the method is
   easy and the lesson is structural: three cars, the gap at the END, so you set
   off from the beginning and travel forwards. It also puts the line's OWN
   picture in front of a student who arrived through the percent door, which is
   the whole point of the Ticket Booth question two screens earlier.

   FOUR NUMBER SETS. Constraints:
     - the rise must come out a whole number of pounds, or the railway is
       charging fractions of a penny on a season ticket;
     - the rise, the new price, the percent-as-count value and the wrong-way
       value must all differ from each other and from both givens, so every
       diagnosis lands on exactly one mistake;
     - percentages stay ones a student can build from a tenth and a half.

   Verified per set — the rise, the new price, and the new price taken back
   apart:
     15% of 80  = 12   80 + 12  = 92    (92 - 12  = 80)   as-a-count 80 + 15  = 95
     25% of 140 = 35   140 + 35 = 175   (175 - 35 = 140)  as-a-count 140 + 25 = 165
     20% of 60  = 12   60 + 12  = 72    (72 - 12  = 60)   as-a-count 60 + 20  = 80
     35% of 120 = 42   120 + 42 = 162   (162 - 42 = 120)  as-a-count 120 + 35 = 155 */
MF.registerProblem({
  id: "ch-fare-rise",
  schemaVersion: 1,
  status: "published",
  title: "What the pass costs now",
  line: "change",
  topics: ["percent", "percent-increase", "result-unknown", "two-step"],
  steps: 2,

  surface: "percent",

  unknownCar: "result",
  context: "fares",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: true,
  hubGoodStrategies: ["reading", "drafting"],
  hubStrategyNote: "The arithmetic is not the difficulty here — reading is. Everything turns on noticing that the percentage belongs to the OLD price, which is a sentence to be read carefully rather than a calculation to be done well.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-10" },

  numberChecks: [
    ["n2", "+", "100", "=", "newPct"],
    ["rate", "*", "100", "=", "n2"],
    ["n1", "*", "rate", "=", "rise"],
    ["n1", "+", "rise", "=", "ans"],
    ["ans", "-", "rise", "=", "n1"],
    ["n1", "*", "mult", "=", "ans"],
    ["n1", "+", "n2", "=", "mCount"],
    ["n1", "-", "rise", "=", "mDown"]
  ],

  numberSets: [
    { numbers: { n1: "80", n2: "15", n3: "4" },
      derived: { rate: "0.15", mult: "1.15", newPct: "115", rise: "12", ans: "92",
                 mCount: "95", mDown: "68" },
      estimate: { min: 84, max: 100 } },
    { numbers: { n1: "140", n2: "25", n3: "6" },
      derived: { rate: "0.25", mult: "1.25", newPct: "125", rise: "35", ans: "175",
                 mCount: "165", mDown: "105" },
      estimate: { min: 155, max: 195 } },
    { numbers: { n1: "60", n2: "20", n3: "3" },
      derived: { rate: "0.2", mult: "1.2", newPct: "120", rise: "12", ans: "72",
                 mCount: "80", mDown: "48" },
      estimate: { min: 66, max: 82 } },
    { numbers: { n1: "120", n2: "35", n3: "5" },
      derived: { rate: "0.35", mult: "1.35", newPct: "135", rise: "42", ans: "162",
                 mCount: "155", mDown: "78" },
      estimate: { min: 145, max: 180 } }
  ],

  problem: {
    text: "The fares board at Thorne Bridge is a wooden thing with slats that clatter when somebody changes them. A monthly pass used to cost {{n1}} pounds. In January the railway put every fare up by {{n2}} per cent. The board has {{n3}} rows of slats. What does a monthly pass cost now?",
    sentences: [
      "The fares board at Thorne Bridge is a wooden thing with slats that clatter when somebody changes them.",
      "A monthly pass used to cost {{n1}} pounds.",
      "In January the railway put every fare up by {{n2}} per cent.",
      "The board has {{n3}} rows of slats.",
      "What does a monthly pass cost now?"
    ],
    questionSentenceIndex: 4,
    numbers: {
      n1: { value: "80", unit: "pounds",   role: "start",      spoken: "80" },
      n2: { value: "15", unit: "per cent", role: "percent",    spoken: "15 per cent" },
      n3: { value: "4",  unit: "rows",     role: "distractor", spoken: "4" }
    },
    context: { setting: "station fares board", requiresCulturalKnowledge: false }
  },

  /* A price cannot be counted off a picture, so the uncountability rule is
     satisfied by the subject rather than by construction — the same licence
     `delays` has for drawing minutes. What the scene must still not do is show
     a NUMBER, so every price panel on the board is a blank slat, exactly as the
     water tank's sight gauge carries no markings. */
  scene: {
    mode: "anim", art: "fares",
    caption: "The fares board at Thorne Bridge, with one slat turning over as somebody sets a new price, and an arrow pointing up beside it.",
    authored: "generated"
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A monthly pass cost a certain amount. In January the railway put fares up by a percentage, and we want to know what the pass costs after that.",
      platformCheck: {
        sentences: [1, 2],
        why: "Between them those sentences give what the pass used to cost and the size of the rise. A single amount, at a before and an after, with something in between that moved it.",
        kinds: "Everything counted here is money, in pounds, for the same pass."
      },

      questions: {
        kinds: {
          ask: "This story counts pounds, and it also counts rows of slats on the board. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The board is furniture. Everything the question is about is money &mdash; what the pass cost, and what it costs now.",
                         no:  "That would mean the price and the slats were pinned to each other, so that a dearer fare grew the board another row. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the price scaled with the board. How many rows of slats it has says nothing about what a pass costs." }
          }
        },
        moments: {
          ask: "The pass before January, and the pass since. Does any amount end up different from how it started?",
          options: {
            changed: { yes: "The railway put the fare up, so the price after January is not the price before it. That gap is the whole problem.",
                       no:  "" },
            steady:  { yes: "", no: "That would mean the pass cost the same all along. But the story has a moment where somebody changed it, and after that it costs something else." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just the pass, or the pass and something else being held up against it?",
          options: {
            single:   { yes: "A single pass, priced at different moments. Everything else in the story is about that price.", no: "" },
            separate: { yes: "", no: "That would mean a second ticket, or a rival railway, priced beside it so you could measure the gap. Only a single pass is priced here." },
            paired:   { yes: "", no: "That would mean pounds pinned to something else and dragged along by it. The rise changes the price and nothing else." }
          }
        },
        shape: {
          ask: "Is the money being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            cut:     { yes: "", no: "Worth asking, because a percentage sounds like a slice. But a share is part of a named whole that the pieces add back up to, and nothing here is being divided among anybody." },
            repeat:  { yes: "", no: "That would mean the same charge again and again, with the question counting how many. The fare goes up the once and stays there." },
            neither: { yes: "Nothing is cut into shares and nothing repeats. A price simply ends up higher than it was.", no: "" }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the old price, January, and the price since?",
          options: {
            onekind: { yes: "A starting amount, something happening to it, and a finishing amount. The same kind of situation the whole way through &mdash; the size of the change just happens to be written in per cent.", no: "" },
            stacked: { yes: "", no: "The best wrong answer here, and worth taking seriously: per cent does feel like an extra idea sitting on top. But a percentage is a way of WRITING how big the rise was, not a second situation. Say the same rise in pounds instead and nothing about the shape of the story moves." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This is a price with a before and an after, which sits squarely on the Change Line whatever units the rise is written in." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "what a monthly pass used to cost", needed: true },
        { token: "n3", describe: "how many rows of slats the board has", needed: false },
        { token: "n2", describe: "how much every fare went up, as a percentage", needed: true }
      ],
      relationship: "One of these is an amount of money and the other is not an amount of anything &mdash; it is a percentage, and a percentage is always a percentage OF something. Here it is of the OLD price, because that is what the fare was when the railway put it up. The rows of slats have never charged anybody anything.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "What a monthly pass costs now, after the rise.",
      commonMisreading: "Reading \"up by {{n2}} per cent\" as \"up by {{n2}} pounds\" and adding the percentage on as though it were money.",
      options: [
        { text: "What a monthly pass used to cost",
          why: "You were told that outright. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "What a monthly pass costs now", correct: true,
          why: "The amount at the END, after January. It is the only one of the three the story never states &mdash; and it is bigger than the {{n1}}, not smaller." },
        { text: "How much every fare went up, as a percentage",
          why: "Also given. That is the size of the change written in per cent, not an amount of money." },
        { text: "How many more pounds a pass costs than it used to",
          why: "Closer than it looks, because you have to work that out on the way. But it is a step, not the destination: the question asks for the whole new price." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    whyCorrect: "One pass, priced at two moments, with the railway putting fares up in between. A before, an event, an after &mdash; and here it is the AFTER that is missing, which is the gentlest shape on this line. The change is written in per cent, which changes the arithmetic and not the line.",
    distractors: [
      { line: "compare",   whyWrong: "The strongest case against, because per cent is how you usually compare things. But a compare needs two amounts in existence at the same moment, set side by side. Here there is one price, described before January and after it &mdash; the old fare does not exist any more to be compared with anything." },
      { line: "partwhole", whyWrong: "A percentage sounds like a slice, and Part&ndash;Whole is where slices live. But it needs a named whole that the pieces add back up to, and the new price is not made of parts the story hands you. It is one amount that used to be a different amount." },
      { line: "ratio",     whyWrong: "Tempting, because a percentage holds at any size &mdash; that is what makes it a percentage, and the railway did put EVERY fare up by it. But a ratio pins two different kinds of thing together so that changing one drags the other along, like miles and hours. Everything here is pounds, and one fare is all the story follows." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and there is a single price here that moved once." }
    ],
    unknownCar: "result",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: [
      "what a pass cost before January",
      "what a pass costs now",
      "how much fares went up by"
    ],
    unknownCarAnswer: "what a pass costs now",
    unknownCarWhy: "The old price is stated and so is the size of the rise. What the pass costs after January is the one car nothing in the story gives you &mdash; and it sits at the END of the train, so you reach it by travelling forwards.",
    supportAfter3Attempts: {
      narrowTo: ["change", "compare"],
      discriminator: "Ask whether the two amounts ever existed at the same moment. Two amounts you compare are both there at once. Here the old fare and the new one are the same pass before and after January, which makes it Change."
    }
  },

  signalBox: {
    /* PERCENT INCREASE IS `unknownIs: "part"` WITH THE MARK PAST THE HUNDRED.
       The old price is what the rise is measured from, so it anchors the
       hundred per cent; the new price runs past it to {{newPct}}% and carries
       the question mark. That is the keystone's picture with the "?" at the
       other end, and the pair is the point — same line, opposite unknowns.

       `percentAt` rather than `percentToken`, because the mark sits at
       {{newPct}} and the story says {{n2}}. Authored as a token filled from the
       number set, never as a literal: the rise varies per set. */
    percentLine: {
      title: "Per hundred",
      heading: "Which price is the whole hundred per cent?",
      prompt: "The rise is measured from one of these two prices. Tap the one it is measured FROM.",
      wholeToken: "n1",
      percentAt: "{{newPct}}",
      unknownIs: "part",
      base: "old",
      questionLabel: "what a pass costs after the rise",
      settledLabel: "so the question is",
      choices: [
        { key: "new", label: "What a pass costs now",        said: "?" },
        { key: "old", label: "What a pass cost before January", said: "{{n1}}" }
      ],
      why: "\"Put every fare UP BY {{n2}} per cent\" &mdash; up from what it was, so the old price is what the rise is measured from. That makes it the whole hundred per cent, and the new price runs past it to {{newPct}} per cent.",
      whyWrong: {
        new: "The new price is the amount you are trying to find, so a percentage of it is not something you could work out yet even if the story meant it &mdash; and it does not. A fare goes up from what it was, not from what it becomes."
      },
      a11yDescription: "A double number line. Along the bottom: nought per cent at the left, a hundred per cent part way along, and a mark at {{newPct}} per cent at the right-hand end. Along the top the same three points counted in pounds: nought, {{n1}} pounds at the hundred per cent, and a question mark out at the {{newPct}} per cent mark. The two lines share one axis, so the price you were given sits ON the hundred per cent and the price you want sits past it.",
      settledSay: "Whatever the rise is measured FROM is the whole hundred per cent."
    },

    estimate: {
      prompt: "Before calculating &mdash; roughly what do you think a monthly pass costs now?",
      reasonableMin: 84,
      reasonableMax: 100,
      modelReasoning: "Fares went up, so the answer is above {{n1}} &mdash; but only by {{n2}} per cent, so it is a bit above and nowhere near double. A tenth of {{n1}} is easy to find in your head; build the percentage you need from that.",
      unit: "pounds"
    },

    /* THE TEST TRACK IS THIS LINE'S OWN KIND, and that is deliberate on a
       problem a student may have reached through the percent door. The keystone
       takes `section` because its METHOD is what breaks; here the method is
       easy and what is worth showing is the structure — three cars, and where
       the gap sits decides which way you travel.

       The worked example puts the gap at the FRONT so the engine runs backwards
       and the two shapes contrast. Neither picture carries a value: arriving at
       the missing car with a number is the answer, so the engine stops on it
       and the gap keeps its question mark. */
    testTrack: {
      kind: "drive",
      title: "The Test Track",
      heading: "Which way does the story run?",
      intro: "Every story on this line is three cars: what you started with, what happened, what you ended with. Where the gap sits decides which way you travel to reach it &mdash; and that is true whether the middle car is written in pounds or in per cent. Watch one.",
      worked: {
        label: "A story with the BEGINNING missing.",
        button: "Show me",
        cars: ["what it started with", "what happened", "what it ended with"],
        gap: 0, from: 2,
        sayCut: "The gap is at the front, and the only end of the story you were told is the far one.",
        sayTake: "So the engine sets off from the ending amount and runs BACKWARDS, undoing what happened. Travelling backwards against the story is subtracting."
      },
      yours: {
        wholeLabel: "Your story. Look at where the gap is before you decide anything.",
        cars: ["What a pass cost before January", "The rise", "What a pass costs now"],
        gap: 2,
        q1: "Which car do you have to set off from?",
        options1: [
          { text: "What a pass cost before January", correct: true,
            why: "It is the only end of the story you were told, and the gap is at the far end, so this is where a journey towards it has to start." },
          { text: "What a pass costs now",
            why: "That is the gap itself &mdash; the thing you are trying to reach. You cannot set off from the car you are looking for." },
          { text: "The rise",
            why: "That is the middle car, the event. It tells you the size of the step but it is not a price the pass ever had, so it is not a place to start from." }
        ],
        settled1: "You set off from the old price, because that is the end of the story you know.",
        q2: "So which way do you travel to reach the gap?",
        options2: [
          { text: "Forwards, the way the story runs", correct: true, from: 0,
            why: "The gap is AFTER the rise, so you travel forwards through it. Travelling forwards along the story is adding &mdash; and here the words agree with the shape, which they will not always do." },
          { text: "Backwards, against the story", from: 2,
            why: "Backwards takes you away from the gap, not towards it. You would be undoing a rise that has not been applied yet." },
          { text: "It does not matter which way",
            why: "It decides whether you add or subtract, so it matters more than anything else on this screen. The two directions give two different answers and only one of them is real." }
        ],
        settled2: "Forwards from the old price, the way the story runs, to the gap at the end."
      },
      law: "Where the gap sits decides which way you travel. Forwards is adding, backwards is subtracting &mdash; and it works the same whether the middle car is pounds or per cent.",
      bridge: "The engine has stopped on the gap and left it blank on purpose. What actually goes in it is the Engine Room's question.",
      a11yDescription: "A demonstration about direction of travel, using no arithmetic. First a three-car story with the BEGINNING missing: the only known end is the far one, so the engine sets off from there and runs backwards, which is subtracting. Then your own story, where the gap is the LAST car, what a pass costs now. You know the old price, so the engine sets off from the front and runs forwards through the rise, which is adding. The engine stops on the gap and the gap stays a question mark; what goes in it is the next question, in the Engine Room."
    }
  },

  /* TOP-LEVEL, not inside signalBox. It renders at the Arrivals Board AFTER the
     solve; nested in signalBox it would read as Plan-screen content, which is
     where its text — naming the trap and the value it produces — would hand
     over the thinking the Engine Room is about to ask for. */
  signalFailure: {
    trigger: "per cent",
    prompt: "The story says fares went up by {{n2}} per cent. Why is the answer not {{mCount}}?",
    why: "Because {{n2}} per cent is not {{n2}} pounds. A percentage is a share of something, and until you say what it is a share OF it is not an amount of money at all. Here it is a share of the OLD price, which is the number the fare was when the railway put it up."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "How many pounds did a monthly pass go up by?",
        answer: { exact: "{{rise}}", unit: "pounds", acceptedForms: ["{{rise}}", "{{rise}} pounds", "£{{rise}}"], preferredForm: "{{rise}}" },
        workedExplanation: "The rise is {{n2}} per cent of the OLD price, because that is what the fare was when it went up. {{n2}} per cent of {{n1}} is {{rise}}, so a pass went up by {{rise}} pounds.",
        hints: [
          { rung: 1, type: "whistle",  text: "The percentage is a percentage of something. Which of the two prices was the fare when the railway put it up?" },
          { rung: 2, type: "signal",   text: "So you want {{n2}} per cent of {{n1}}. Start with a tenth of {{n1}}, which is easy to find, and build the percentage you need from it." },
          { rung: 3, type: "coupling", text: "{{n2}}% of {{n1}} = ___ pounds" },
          { rung: 4, type: "route",    text: "{{n2}}% of {{n1}} = {{rise}}. That is how much MORE a pass costs." }
        ],
        misconceptions: [
          { response: "{{n2}}", diagnosis: "You gave back the percentage itself. {{n2}} per cent is not {{n2}} pounds &mdash; it is a share of the old price, and you have to work out how big that share is before it is an amount of money.", tag: "percent-as-count" },
          { response: "{{ans}}", diagnosis: "That is where you are heading, but this step asks for the RISE on its own &mdash; how many pounds dearer the pass got. The new price comes next.", tag: "jumped-to-the-total" }
        ]
      },
      {
        id: "s2",
        prompt: "So what does a monthly pass cost now?",
        answer: { exact: "{{ans}}", unit: "pounds", acceptedForms: ["{{ans}}", "{{ans}} pounds", "£{{ans}}"], preferredForm: "{{ans}}" },
        workedExplanation: "The new price is the old price with the rise on top: {{n1}} + {{rise}} = {{ans}} pounds. Check it backwards &mdash; {{ans}} &minus; {{rise}} = {{n1}}, the old price exactly, and {{rise}} really is {{n2}} per cent of {{n1}}.",
        hints: [
          { rung: 1, type: "whistle",  text: "You know what the pass used to cost, and you have just worked out how much dearer it got. Put them together." },
          { rung: 2, type: "signal",   text: "The new price is the old price plus the rise. Look at the Test Track picture &mdash; the gap is at the END of the train, so you travel forwards." },
          { rung: 3, type: "coupling", text: "{{n1}} + {{rise}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} + {{rise}} = {{ans}}. A monthly pass costs {{ans}} pounds now." }
        ],
        misconceptions: [
          { response: "{{mCount}}", diagnosis: "You added the percentage on as though it were pounds: {{n1}} + {{n2}}. This is the trap this problem is built around. {{n2}} per cent of {{n1}} is {{rise}}, not {{n2}} &mdash; a percentage has to be turned into money before it can be added to money.", tag: "percent-as-count" },
          { response: "{{rise}}", diagnosis: "That is the rise on its own, which you worked out at the last step. The question asks what the pass COSTS now &mdash; the old price with that rise added to it.", tag: "gave-back-the-step" },
          { response: "{{mDown}}", diagnosis: "You took the rise off instead of putting it on. The story says fares went UP, so the new price has to come out above {{n1}}.", tag: "wrong-direction" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "pounds", acceptedForms: ["{{ans}}", "{{ans}} pounds", "£{{ans}}"], preferredForm: "{{ans}} pounds" },
    questionCheck: "The question asked what a pass costs NOW &mdash; not what it used to cost, and not how much the rise was on its own.",
    unitsCheck: "pounds",
    reasonablenessCheck: "{{ans}} pounds. Take the rise of {{rise}} back off and you land on {{n1}}, the old price exactly. And {{rise}} is {{n2}} per cent of {{n1}}, which is what the story said it should be.",
    reasonablenessFailExample: "If you got {{mCount}}, you added {{n2}} pounds rather than {{n2}} per cent of {{n1}} &mdash; and a percentage is not an amount of money until you say what it is a percentage of.",
    connection: "This is the easy end of per cent, and it is worth noticing WHY it is easy: the words and the shape agree. Fares went up, the gap is at the end of the train, and you add. Hold on to the question that got you there anyway &mdash; {{n2}} per cent OF WHAT &mdash; because on the next percent problem the words and the shape will not agree, and that question is the only thing that still works."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-10",
                 notes: "Four sets, each re-derived and checked by replaying the story backwards: 15% of 80 = 12, 80+12 = 92 (92-12 = 80); 25% of 140 = 35, 140+35 = 175 (175-35 = 140); 20% of 60 = 12, 60+12 = 72 (72-12 = 60); 35% of 120 = 42, 120+42 = 162 (162-42 = 120). Every percentage lands on a whole number of pounds. Within each set the rise, the new price, the percent-as-count value and the wrong-direction value are distinct from each other and from both givens and the distractor: (12,92,95,68), (35,175,165,105), (12,72,80,48), (42,162,155,78). Eight numberChecks assert the rate against the stated percentage, the rise, the new price both ways, the multiplier, and both misconception values. Estimate brackets contain their answers: 84-100/92, 155-195/175, 66-82/72, 145-180/162." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-10",
                 notes: "Built as the gentle mirror of ch-barrier-count: same picture, opposite unknown, and the words agree with the shape here so that the keystone can take that agreement away. Test Track is `drive` rather than the keystone's `section`, because on this problem the method is easy and the structure is the lesson — and it puts the Change Line's own picture in front of a student who arrived through the percent door. Two Change problems on the percent card is ROADMAP §3's deliberate anti-elimination measure. Read 3's correct option is placed second of four and is neither longest nor shortest. NOT MEASURED: correct-option position across this problem's choice surfaces against chance." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No persona walk-through, and no real student has used this." },
    oversight: { status: "provisional", date: "2026-08-10",
                 notes: "PROVISIONAL. Author and reviewer are the same agent (VERIFICATION.md §16). The pedagogical bet — that meeting the easy percent case first makes the keystone's failure land harder — is the Change Line's own argument applied to per cent, and it is exactly the kind of claim only a classroom can settle." }
  }
});
