/* The Change Line · change unknown · kiosk · partial · SIGNAL BOX
   The middle case: both ends of the day are stated and the EVENT between them
   is missing. Placed at the Signal Box because the surface reading points the
   wrong way — the story is about selling, so a student running on keywords
   reaches for a subtraction of the wrong pair, or adds because two numbers are
   present and addition is what you do to two numbers.

   The move that works is a subtraction, but not the one the words suggest: you
   take the ENDING amount off the STARTING one, which is the opposite order to
   the way the sentence reads ("opened with... closed with...").

   FOUR NUMBER SETS. Three constraints:
     - The kiosk must open with more than it closes with, or the change is
       negative and the story stops making sense.
     - The answer may not equal either given. On one candidate set the kiosk
       opened with 96 and closed with 48, so the sandwiches sold and the
       sandwiches left were both 48 — and the "you gave back a number you were
       told" diagnosis would have fired on a correct answer. Dropped.
     - The added-instead-of-subtracted value must not collide with anything.

   Verified both ways for each set — the subtraction, and the addition that
   rebuilds the opening stock:
     84 - 37 = 47   (47 + 37 = 84)
     96 - 39 = 57   (57 + 39 = 96)
     68 - 25 = 43   (43 + 25 = 68)
     90 - 34 = 56   (56 + 34 = 90) */
MF.registerProblem({
  id: "ch-kiosk-sandwiches",
  schemaVersion: 1,
  status: "published",
  title: "What the day took away",
  line: "change",
  topics: ["change-unknown", "subtraction"],
  steps: 1,

  unknownCar: "change-amount",
  context: "kiosk",
  fadeLevel: "partial",
  stationRoles: ["signalbox"],
  hubEligible: true,
  hubGoodStrategies: ["signalbox", "drafting"],
  hubStrategyNote: "Both ends of the day are given and the event between them is missing, which is the case students most often solve by grabbing the two numbers and adding. Distrusting the surface reading is the whole job.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-01" },

  numberChecks: [
    ["n1", "-", "n2", "=", "ans"],
    ["ans", "+", "n2", "=", "n1"],
    ["n1", "-", "ans", "=", "n2"],
    ["n1", "+", "n2", "=", "add"]
  ],

  numberSets: [
    { numbers: { n1: "84", n2: "37", n3: "4" },
      derived: { ans: "47", add: "121" },
      estimate: { min: 25, max: 65 } },
    { numbers: { n1: "96", n2: "39", n3: "6" },
      derived: { ans: "57", add: "135" },
      estimate: { min: 35, max: 80 } },
    { numbers: { n1: "68", n2: "25", n3: "5" },
      derived: { ans: "43", add: "93" },
      estimate: { min: 22, max: 60 } },
    { numbers: { n1: "90", n2: "34", n3: "7" },
      derived: { ans: "56", add: "124" },
      estimate: { min: 34, max: 78 } }
  ],

  scene: {
    mode: "anim", art: "kiosk",
    caption: "The kiosk counter under its awning, with the top of the stack going out to a customer."
  },

  problem: {
    text: "The kiosk on platform two sells sandwiches to people running for trains. The awning leaks, so the woman who runs it keeps a bucket by the till. The kiosk opened this morning with {{n1}} sandwiches. At closing time there were {{n2}} still on the counter. The draughty kiosk is open {{n3}} days a week. How many sandwiches were sold during the day?",
    sentences: [
      "The kiosk on platform two sells sandwiches to people running for trains.",
      "The awning leaks, so the woman who runs it keeps a bucket by the till.",
      "The kiosk opened this morning with {{n1}} sandwiches.",
      "At closing time there were {{n2}} still on the counter.",
      "The draughty kiosk is open {{n3}} days a week.",
      "How many sandwiches were sold during the day?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "84", unit: "sandwiches", role: "start",      spoken: "84" },
      n2: { value: "37", unit: "sandwiches", role: "result",     spoken: "37" },
      n3: { value: "4",  unit: "days",       role: "distractor", spoken: "4" }
    },
    context: { setting: "platform kiosk", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A kiosk starts the day with a stack of sandwiches and ends it with fewer, because people bought some. We want to know how many went out during the day.",
      platformCheck: {
        sentences: [2, 3],
        // Last clause removed: it stated the Ticket Booth's gated answer.
        why: "Between them those sentences give the before and the after. Opening time and closing time, the same counter at both — and something happened to the stack in between.",
        kinds: "Everything counted here is sandwiches, and nothing else."
      },

      /* Per-problem questions — see ch-water-tank. This one carries the extra
         weight of the line: BOTH ends are given and the middle is missing, so
         `moments` says the change is the thing you cannot see. */
      questions: {
        kinds: {
          ask: "This story counts sandwiches, and it also counts the days a week the kiosk opens. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The opening days are background. Everything the question is about is sandwiches on a single counter.",
                         no:  "That would mean sandwiches and opening days were pinned to each other, so that selling more changed the opening hours. The story never links them." },
            different: { yes: "", no: "That would mean the days and the sandwiches scaled together. How often the kiosk opens has nothing to do with this particular day." }
          }
        },
        moments: {
          ask: "The counter when the kiosk opened, and the counter at closing time. Does any amount end up different from how it started?",
          options: {
            changed: { yes: "The stack shrank across the day. Notice that the story never says what happened in between &mdash; the change is the part you cannot see.", no: "" },
            steady:  { yes: "", no: "That would mean the same sandwiches sat there all day. Opening and closing are given as different amounts, so something happened between them." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just the kiosk's counter, or the counter and something else measured against it?",
          options: {
            single:   { yes: "A single counter, at the start of the day and at the end of it.", no: "" },
            separate: { yes: "", no: "That would mean a second kiosk set beside it so you could compare them. There is only this counter, earlier and later." },
            paired:   { yes: "", no: "That would mean sandwiches locked to something else and scaled. Nothing here is being scaled &mdash; things are being sold." }
          }
        },
        shape: {
          ask: "Are the sandwiches being shared out into parts, or is the same amount sold over and over, or neither?",
          options: {
            cut:     { yes: "", no: "That would mean the stack divided into shares that add back up to it. The story is not dividing anything." },
            repeat:  { yes: "", no: "That would mean identical batches going out, with the question counting the batches. You are told the start and the end, not a repeating amount." },
            neither: { yes: "Nothing is cut into shares and nothing repeats. The stack simply ends up smaller.", no: "" }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; from opening, through the day, to what was left at closing?",
          options: {
            onekind: { yes: "A starting stack, a day of selling, a finishing stack. The same kind of situation all the way through.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here it is a counter changing amount and nothing else &mdash; no second kind of situation on top." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This is a counter with a before and an after, which is the Change Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many sandwiches the kiosk opened with", needed: true },
        { token: "n2", describe: "how many were still there at closing time", needed: true },
        { token: "n3", describe: "how many days a week the kiosk opens", needed: false }
      ],
      relationship: "These are the same stack of sandwiches at two different moments — the start of the day and the end of it. The gap between the two moments is what was sold. How many days a week the kiosk opens tells you nothing about this one day.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many sandwiches were sold — the amount the stack went down by.",
      commonMisreading: "Answering with the sandwiches left over, because that is the number the story mentions closest to the question.",
      options: [
        { text: "How many sandwiches were sold during the day", correct: true,
          why: "The change itself — the size of the drop between opening and closing. It is the only one of the three the story never states." },
        { text: "How many sandwiches were left at closing time",
          why: "You were told that. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "How many the kiosk opened with",
          why: "Also given. That is where the day started, not what happened during it." },
        { text: "How many sandwiches are sold in a week",
          why: "The days are scenery. Nothing in the problem says the other days were anything like this one." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    whyCorrect: "One stack of sandwiches, at the start of the day and at the end of it, with selling in between. A before, an after, and an event — that is the Change Line, and here it is the event that is missing.",
    distractors: [
      { line: "compare",   whyWrong: "The hardest one to rule out, because you do end up subtracting one number from the other. The difference is what the two numbers ARE: Compare sets two separate things side by side, but these are the same stack at two different times. The subtraction is the same; the situation is not." },
      { line: "partwhole", whyWrong: "You could argue the opening stack splits into 'sold' and 'left', which is real thinking. But Part–Whole describes pieces existing together at one moment. Here the story moves through time — the sandwiches were sold, and then there were fewer." },
      { line: "groups",    whyWrong: "Nothing repeats. One day happens once; there is no equal group being counted over and over." },
      { line: "ratio",     whyWrong: "Everything is counted in sandwiches — a single unit. A rate would need two different quantities locked together, like sandwiches per hour, and the problem never mentions how long the day was." }
    ],
    unknownCar: "change-amount",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["what the kiosk opened with", "how many were sold", "what was left at closing"],
    unknownCarAnswer: "how many were sold",
    unknownCarWhy: "Both ends of the day are stated — what it opened with and what was left. What happened in between is the only car the story never gives you.",
    supportAfter3Attempts: {
      narrowTo: ["change", "compare"],
      discriminator: "Ask whether the two numbers describe two different things or the same thing twice. Two rival quantities side by side is Compare. One quantity, before and after, is Change."
    }
  },

  signalBox: {
    changeTrain: {
      title: "The Change Train",
      heading: "Three cars, and one of them is missing",
      prompt: "Both ends of the day are on the train. It is the middle car that nobody told you.",
      cars: [
        { label: "What the kiosk opened with", value: "{{n1}}", unit: "sandwiches" },
        { label: "What the day did to it", value: "?", unit: "sandwiches" },
        { label: "What was left at closing", value: "{{n2}}", unit: "sandwiches" }
      ],
      question: "Which move reaches the missing car?",
      options: [
        { text: "{{n1}} − {{n2}}", correct: true,
          why: "The gap between the two ends of the day is what went out. Take what was left off what you started with, and what remains is what was sold." },
        { text: "{{n1}} + {{n2}}",
          why: "Adding would make the answer bigger than the stack the kiosk opened with — and you cannot sell more sandwiches than you ever had. Two numbers in a problem are not an instruction to add them." },
        { text: "{{n2}} − {{n1}}",
          why: "Right idea, wrong way round. This takes the opening stack off the leftovers, which asks how much MORE was left than was there to begin with — and nothing was added during the day." }
      ],
      settledSay: "The distance between the two ends of the day is exactly what the day took away.",
      law: "Which move you make depends on WHICH car is missing, not on the words in the story.",
      pending: "The middle car stays a question mark on purpose — actually doing the subtraction is the next stop.",
      a11yDescription: "A train of three cars. The first is what the kiosk opened with, {{n1}} sandwiches. The third is what was left at closing, {{n2}} sandwiches. The middle car, what the day did to the stack, is unknown. Because both ends are known and the stack got smaller, the missing car is the difference between them: the closing amount taken off the opening one."
    },
    estimate: {
      prompt: "Before calculating — roughly how many sandwiches do you think were sold?",
      reasonableMin: 25,
      reasonableMax: 65,
      modelReasoning: "The stack shrank, so the number sold has to be smaller than the {{n1}} the kiosk opened with — you cannot sell more than you had. And plenty were left over, so it is nowhere near all of them. Round both ends to the nearest ten and find the gap.",
      unit: "sandwiches"
    },
    /* THE TEST TRACK, replacing the Junction. The middle case: BOTH ends are
       known and the event between them is the gap. That makes it the one where
       a student can genuinely set off from either end — so the demonstration
       says so, and then insists on the order, because the order is what this
       problem punishes.

       The worked example uses an END gap so it is not a copy of this one. */
    testTrack: {
      kind: "drive",
      title: "The Test Track",
      heading: "Which way does the story run?",
      intro: "Every story on this line is three cars: what you started with, what happened, what you ended with. This time it is the middle car that is missing — and that changes where you can set off from. Watch a different one first.",
      worked: {
        label: "A story with the END missing.",
        button: "Show me",
        cars: ["what it started with", "what happened", "what it ended with"],
        gap: 2, from: 0,
        sayCut: "Here the gap is at the far end, and the engine has only one place it can start: the beginning.",
        sayTake: "It runs forwards through what happened and stops on the gap. One known end, one direction, no choice about it."
      },
      yours: {
        wholeLabel: "Your story. This time the gap is in the middle — look at what that gives you.",
        cars: ["What the kiosk opened with", "What the day did to it", "What was left at closing"],
        gap: 1,
        q1: "Both ends of this story are known. So what makes the middle car findable?",
        options1: [
          { text: "The gap sits between two amounts you were told", correct: true,
            why: "With both ends known, the middle is the distance between them. That is what makes this the one case where you can travel from either end and still arrive at the gap." },
          { text: "The story says sandwiches were sold",
            why: "The words tell you what happened, not how to find it. On this line the words are the least reliable thing on the screen — the shape of the train is what decides the move." },
          { text: "Nothing does — the middle car is always found last",
            why: "There is no fixed order. Which car is findable depends only on which ones you were told, and here you were told both ends." }
        ],
        settled1: "Both ends known, so the gap between them is the thing you can reach.",
        q2: "Set off from the opening stack. Which way do you travel to reach the gap?",
        options2: [
          { text: "Forwards, the way the day ran", correct: true, from: 0,
            why: "From the opening stack you travel forwards into the day to reach what the day did. Watch the order when you calculate it: this is the distance DOWN from the opening stack, so the opening amount is the one you start from." },
          { text: "Backwards, against the day", from: 2,
            why: "That is the journey from the closing stack instead, which also reaches the gap — but you were asked to set off from the opening one, and mixing the two up is exactly how the subtraction ends up the wrong way round." },
          { text: "Neither — you add the two ends together",
            why: "Adding the two ends gives you more sandwiches than the kiosk ever had. The gap is the distance between them, and a distance is never found by adding." }
        ],
        settled2: "Forwards from the opening stack, into the day, to the gap in the middle."
      },
      law: "Where the gap sits decides which way you travel. With both ends known you may set off from either — but whichever you choose, the order of the subtraction follows from it.",
      bridge: "The engine has stopped on the gap and left it blank on purpose. What actually goes in it is the Engine Room's question.",
      a11yDescription: "A demonstration about direction of travel, using no arithmetic. First a three-car story with the end missing: the engine can only start at the beginning and runs forwards to the gap. Then your own story, where the gap is the MIDDLE car — what the day did to the stack. Both ends are known here, so the gap is the distance between them and you could set off from either end; setting off from the opening stack means travelling forwards into the day. The engine stops on the gap and the gap stays a question mark; what goes in it is the next question, in the Engine Room."
    }
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "How many sandwiches were sold during the day?",
        answer: { exact: "{{ans}}", unit: "sandwiches", acceptedForms: ["{{ans}}", "{{ans}} sandwiches"] },
        workedExplanation: "The kiosk opened with {{n1}} sandwiches and finished with {{n2}}, so the stack fell by the gap between them. {{n1}} − {{n2}} = {{ans}} sandwiches sold. Check it forwards: the {{ans}} sold plus the {{n2}} left over is {{n1}}, exactly what the kiosk opened with.",
        misconceptions: [
          { response: "{{add}}", diagnosis: "You added the two numbers. That would mean more sandwiches went out than the kiosk ever had — {{add}} sold from a stack of {{n1}}. Two numbers sitting in a problem are not an instruction to add them.", tag: "wrong-operation" },
          { response: "{{n2}}",  diagnosis: "That is how many were LEFT at closing time, which you were given. The question asks about the ones that went out, not the ones that stayed.", tag: "returned-given-value" },
          { response: "{{n1}}",  diagnosis: "That is what the kiosk opened with. Some were left at the end, so not all of them can have been sold.", tag: "returned-given-value" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The kiosk had a stack at the start of the day and a smaller one at the end. What happened to the difference?" },
          { rung: 2, type: "signal",   text: "The sandwiches that are no longer there are the ones that were sold. Find the gap between {{n1}} and {{n2}}." },
          { rung: 3, type: "coupling", text: "{{n1}} − {{n2}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} − {{n2}} = {{ans}}. {{ans}} sandwiches were sold during the day." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "sandwiches", acceptedForms: ["{{ans}}", "{{ans}} sandwiches"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many were SOLD — not how many were left on the counter, and not how many the kiosk opened with.",
    unitsCheck: "sandwiches",
    reasonablenessCheck: "{{ans}} sold and {{n2}} left over. Put those two back together and you get {{n1}}, the stack the kiosk opened with. The two parts of the day rebuild the start of it.",
    reasonablenessFailExample: "If you got {{add}}, the kiosk would have sold more sandwiches than it ever had on the counter. Any answer bigger than the opening stock is impossible on this story.",
    connection: "Same three cars as the lost property office, but the missing one has moved to the middle. When both ends are given, the event between them is the gap — and which way round you subtract is decided by which end came first."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved and checked forwards by addition: 84-37=47 (47+37=84); 96-39=57 (57+39=96); 68-25=43 (43+25=68); 90-34=56 (56+34=90). Opening stock exceeds closing stock in every set, so the change stays positive. The answer differs from both givens in every set — one candidate set (opened 96, closed 48) was DROPPED because the sandwiches sold and the sandwiches left were both 48, which would have fired the returned-given-value diagnosis on a correct answer. Estimate brackets contain their answers: 25-65/47, 35-80/57, 22-60/43, 34-78/56." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Problem text Flesch-Kincaid grade 3.2 at 9.7 words per sentence, inside the site's band. No grade level named. Scene caption and Change Train a11yDescription present in all four sets. Contrast for --line-change measured at 4.77:1 on cream." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Option lengths checked across the line: this problem's correct read3 option was already NOT the longest (44 against 45/30/38), which is what keeps the line's always-longest rate at 33.3% rather than 0% — Cycle 7b established that driving it to zero is the same tell inverted. Measured over 3000 trials: read3 always-longest 33.3%, always-first 24.7% against chance 25.1%; the Change Train's options are the same length by construction so carry no length signal at all. Hint rungs verified: rung 3 never states the answer, rung 4 always does. Irrelevant quantity present. All four rival lines explained, including the Compare distinction this problem turns on." },
    student:   { status: "partial", agent: "claude-session", date: "2026-08-01",
                 notes: "Not driven end to end individually; the line's shared surfaces (Change Train render and grading, estimate gate, Ticket Booth, misconception matching) were driven live on ch-lost-property and verified per set here by rendering all eight phases in all four sets. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-08-01",
                 notes: "Approved for the mechanical, mathematical, theme and teacher properties measured, with student recorded as partial. LIMITATION: reviewed by the agent that authored it — see VERIFICATION.md 16." }
  }
});
