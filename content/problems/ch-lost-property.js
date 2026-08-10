/* The Change Line · result unknown · lost property · worked · READING ROOM
   The gentlest entry to the line, and deliberately the one where the keywords
   tell the truth: something is handed in, more arrive, the total goes up. A
   student who reasons "more, so add" gets this right — which is exactly why it
   comes first. The line then spends two more problems taking that rule away
   from them (see ch-water-tank, where "more went in" is solved by subtracting).
   Teaching the reliable idea means first letting the unreliable one succeed,
   then breaking it on a case it cannot handle.

   FOUR NUMBER SETS. Two constraints, neither of them about the addition:
     - The starting count must EXCEED the number handed in, so the wrong-way
       subtraction stays positive. A misconception response of -7 is not a
       wrong answer any student types, and the diagnosis would never fire.
     - No set may let the answer collide with either given or with the
       subtraction slip.

   Verified both ways for each set — the addition, and the subtraction that
   takes it back apart:
     46 + 28 = 74   (74 - 28 = 46)
     63 + 19 = 82   (82 - 19 = 63)
     58 + 35 = 93   (93 - 35 = 58)
     71 + 24 = 95   (95 - 24 = 71) */
MF.registerProblem({
  id: "ch-lost-property",
  schemaVersion: 1,
  status: "published",
  title: "What the office ended up with",
  line: "change",
  topics: ["result-unknown", "addition"],
  steps: 1,

  unknownCar: "result",
  context: "lost property",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-01" },

  numberChecks: [
    ["n1", "+", "n2", "=", "ans"],
    ["ans", "-", "n2", "=", "n1"],
    ["ans", "-", "n1", "=", "n2"],
    ["n1", "-", "n2", "=", "sub"],
    ["n1", "*", "n2", "=", "mul"]
  ],

  numberSets: [
    { numbers: { n1: "46", n2: "28", n3: "6" },
      derived: { ans: "74", sub: "18", mul: "1288" },
      estimate: { min: 55, max: 95 } },
    { numbers: { n1: "63", n2: "19", n3: "8" },
      derived: { ans: "82", sub: "44", mul: "1197" },
      estimate: { min: 65, max: 105 } },
    { numbers: { n1: "58", n2: "35", n3: "5" },
      derived: { ans: "93", sub: "23", mul: "2030" },
      estimate: { min: 70, max: 120 } },
    { numbers: { n1: "71", n2: "24", n3: "9" },
      derived: { ans: "95", sub: "47", mul: "1704" },
      estimate: { min: 75, max: 125 } }
  ],

  scene: {
    mode: "anim", art: "lostproperty",
    /* "onto the END of the row" until the rack was redrawn to run off both
       edges of the frame. A caption is also the scene's aria-label, so a
       sentence describing an end the picture no longer has is the sighted
       reader's inaccuracy and the screen-reader user's whole description. */
    caption: "Umbrellas packed along the rack behind the counter, and another one coming down onto the rail."
  },

  problem: {
    text: "The lost property office is behind the ticket hall, and it smells of old rain. Almost everything on the rack is an umbrella nobody came back for. The office started the week with {{n1}} umbrellas. During the week another {{n2}} were handed in. The office has {{n3}} sagging wooden shelves. How many umbrellas does the office have now?",
    sentences: [
      "The lost property office is behind the ticket hall, and it smells of old rain.",
      "Almost everything on the rack is an umbrella nobody came back for.",
      "The office started the week with {{n1}} umbrellas.",
      "During the week another {{n2}} were handed in.",
      "The office has {{n3}} sagging wooden shelves.",
      "How many umbrellas does the office have now?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "46", unit: "umbrellas", role: "start",      spoken: "46" },
      n2: { value: "28", unit: "umbrellas", role: "change",     spoken: "28" },
      n3: { value: "6",  unit: "shelves",   role: "distractor", spoken: "6" }
    },
    context: { setting: "lost property office", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A lost property office has a pile of umbrellas. More get handed in over the week, so the pile gets bigger, and we want to know how big it ends up.",
      platformCheck: {
        sentences: [2, 3],
        why: "Between them those sentences give the before and the event. The office starts the week holding an amount, and then \"during the week\" more arrive — so the pile stops being the size it started at.",
        kinds: "Everything counted here is umbrellas."
      },

      // Per-problem questions — see ch-water-tank for why these exist.
      questions: {
        kinds: {
          ask: "This story counts umbrellas, and it also counts the shelves in the office. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The shelves are furniture. Everything the question is about is umbrellas.",
                         no:  "That would mean umbrellas and shelves were pinned to each other &mdash; that handing in another umbrella built another shelf. The story never says anything like that." },
            different: { yes: "", no: "That would mean the shelves grew as the umbrellas did. They are just what the office keeps them on." }
          }
        },
        moments: {
          /* Was "The rail at the start of the week, and the rail now." — user-found.
             "Rail" appears once in the stem as scene-setting, every other string in
             this problem says "the pile", and on a site with a Ratio & Rate RAIL the
             word means a train line. Never name a story object with a word the map
             already uses for a schema. */
          ask: "The umbrellas at the start of the week, and the umbrellas now. Does any amount end up different from how it started?",
          options: {
            changed: { yes: "Umbrellas were handed in during the week, so the pile now is not the pile then.", no: "" },
            steady:  { yes: "", no: "That would mean the office had the same number of umbrellas all week. But more were handed in partway through, and the pile grew." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just the pile of umbrellas, or the pile and something else measured against it?",
          options: {
            single:   { yes: "A single pile, at different moments in the week.", no: "" },
            separate: { yes: "", no: "That would mean a second pile set beside it so you could measure the gap. There is only the office's own umbrellas here." },
            paired:   { yes: "", no: "That would mean umbrellas locked to something else, so changing either moved the other. Nothing scales here; things are simply handed in." }
          }
        },
        shape: {
          ask: "Are the umbrellas being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            cut:     { yes: "", no: "That would mean the pile divided into shares that add back up to it. Nothing is being divided &mdash; things are being added." },
            repeat:  { yes: "", no: "That would mean an identical batch arriving again and again, with the question counting the batches. The story tells you the whole week's arrivals in a lump." },
            neither: { yes: "Nothing is cut into shares and nothing repeats. The pile just gets bigger.", no: "" }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; from the start of the week, through the handing-in, to what the office has now?",
          options: {
            onekind: { yes: "A starting pile, things arriving, a finishing pile. The same kind of situation throughout.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here it is a pile growing and nothing else &mdash; no second kind of situation on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This is a pile with a before and an after, which is the Change Line." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "how many umbrellas there were at the start of the week", needed: true },
        { token: "n2", describe: "how many were handed in during the week", needed: true },
        { token: "n3", describe: "how many shelves the office has", needed: false }
      ],
      relationship: "One amount is where the week started. The other is what happened to it. They are the same kind of thing — umbrellas — which is what lets them combine into a single ending amount. How many shelves the office has does not change how many umbrellas are on the rack.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many umbrellas the office has at the end of the week.",
      commonMisreading: "Answering with the number handed in, which is the number the story talks about last.",
      /* Lengths levelled. The correct option ran 51 characters against 33, 42
         and 36 — "pick the wordiest" beat reading, which is the Cycle 7b
         defect reproduced on brand-new content by the agent that had just
         written the rule down. Shuffling does not touch length. */
      options: [
        { text: "How many umbrellas the office has now", correct: true,
          why: "The amount after the change has happened. It is the one number in this story you were not told." },
        { text: "How many umbrellas were handed in",
          why: "You were given that. A number the story states cannot be the thing it is asking you to find." },
        { text: "How many umbrellas there were at the start",
          why: "Also given. That is where the week began, not where it ended." },
        { text: "How many umbrellas fit on each shelf",
          why: "The shelves are scenery. Nothing in the problem connects them to the umbrellas." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    whyCorrect: "One amount, at two different moments, with an event in between. The office had a number of umbrellas, something happened to that number, and it ended up somewhere else. Start, change, result — that is this line.",
    distractors: [
      { line: "partwhole", whyWrong: "The closest call, because the umbrellas do end up as one pile made of two groups. What makes it Change is TIME: there is a before and an after. Part–Whole describes one fixed collection split into pieces that all exist at once." },
      { line: "compare",   whyWrong: "Nothing is being measured against anything else. You are not asked how many more were handed in than were already there — the two amounts are being combined, not compared." },
      { line: "groups",    whyWrong: "There is no group repeating. Two different amounts arrive once each; nothing is counted over and over." },
      { line: "ratio",     whyWrong: "Everything here is counted in umbrellas — one unit. A rate needs two different kinds of quantity locked together, like umbrellas per shelf, and nothing in the question asks for that." }
    ],
    unknownCar: "result",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["what the office started with", "how many were handed in", "what the office ended with"],
    unknownCarAnswer: "what the office ended with",
    unknownCarWhy: "The story tells you where the week began and what happened during it. Where it finished is the only car nothing states.",
    supportAfter3Attempts: {
      narrowTo: ["change", "partwhole"],
      discriminator: "Ask whether time passes. If the story has a before and an after — it WAS this, then something happened, now it IS that — the situation is Change. If everything exists at the same moment and is being split up, it is Part–Whole."
    }
  },

  signalBox: {
    /* The Change Train, not the Model Yard: nothing here is being cut into
       equal parts. Three cars, one missing, and the student picks the move
       that reaches it. */
    changeTrain: {
      title: "The Change Train",
      heading: "Three cars, and one of them is missing",
      prompt: "Every problem on this line has the same three cars. Find the one the story never tells you.",
      cars: [
        { label: "What the office started with", value: "{{n1}}", unit: "umbrellas" },
        { label: "What happened during the week", value: "+ {{n2}}", unit: "umbrellas" },
        { label: "What the office ended with", value: "?", unit: "umbrellas" }
      ],
      question: "Which move reaches the missing car?",
      options: [
        { text: "{{n1}} + {{n2}}", correct: true,
          why: "You have the start and you have the change, so you can travel forwards to the end. Umbrellas were added to the rack, so the ending amount is bigger than the starting one." },
        { text: "{{n1}} − {{n2}}",
          why: "That travels the wrong way. Subtracting would describe umbrellas being taken OFF the rack, but the story says they were handed in — the pile grew." },
        { text: "{{n2}} − {{n1}}",
          why: "This subtracts the bigger amount from the smaller one, which on this story would leave you with less than nothing. Check which number is the starting pile before choosing an order." }
      ],
      settledSay: "Start, plus what happened, gives the end. That is the whole line in one move.",
      law: "Which move you make depends on WHICH car is missing, not on the words in the story.",
      pending: "The last car stays a question mark on purpose — actually doing the addition is the next stop.",
      a11yDescription: "A train of three cars. The first is what the office started the week with, {{n1}} umbrellas. The second is what happened during the week: {{n2}} more were handed in. The third car, what the office ended with, is unknown. Because the change adds to the pile, the missing car is reached by adding the first two."
    },
    estimate: {
      prompt: "Before calculating — roughly how many umbrellas do you think the office ends up with?",
      reasonableMin: 55,
      reasonableMax: 95,
      /* Shown only AFTER the estimate is locked in. Gives the direction and a
         floor, never the sum. */
      modelReasoning: "The pile only ever gets bigger here, so the answer has to be more than the {{n1}} the office started with — and only {{n2}} were added, so it cannot be anywhere near double. Round both to the nearest ten and add those in your head.",
      unit: "umbrellas"
    },
    /* THE TEST TRACK, replacing the Junction. This is the gentlest case on the
       line — the gap is at the far end and the journey runs forwards — and it
       is deliberately where the direction idea gets introduced, so that when
       ch-water-tank runs the other way the student has something to compare it
       against. The worked example uses a MIDDLE gap so it is neither this
       problem nor a copy of it. */
    testTrack: {
      kind: "drive",
      title: "The Test Track",
      heading: "Which way does the story run?",
      intro: "Every story on this line is three cars: what you started with, what happened, what you ended with. Where the gap sits decides which way you travel to reach it. Watch one.",
      worked: {
        label: "A story with the MIDDLE missing — both ends known.",
        button: "Show me",
        cars: ["what it started with", "what happened", "what it ended with"],
        gap: 1, from: 0,
        sayCut: "Here both ends are known and it is the event in the middle that is missing.",
        sayTake: "The engine sets off from the start and runs forwards until it reaches the gap. Notice it stops there — it does not fill the gap in. That comes later."
      },
      yours: {
        wholeLabel: "Your story. Look at where the gap is before you decide anything.",
        cars: ["What the office started with", "What happened during the week", "What the office ended with"],
        gap: 2,
        q1: "Which car do you have to set off from?",
        options1: [
          { text: "What the office started with", correct: true,
            why: "The gap is at the far end, and the beginning is a known amount, so that is where the journey starts. You travel from what you know towards what you do not." },
          { text: "What the office ended with",
            why: "That is the gap itself — the thing you are trying to reach. You cannot set off from the car you are looking for." },
          { text: "What happened during the week",
            why: "That is the middle car, the event. It is the size of the step you take, not a number of umbrellas the office ever had on the rack." }
        ],
        settled1: "You set off from what the office started with — the end of the story you know.",
        q2: "So which way do you travel to reach the gap?",
        options2: [
          { text: "Forwards, the way the story runs", correct: true, from: 0,
            why: "The gap is AFTER the event, so you travel forwards through it. Travelling forwards along the story is adding — and here the words happen to agree, which will not always be true on this line." },
          { text: "Backwards, against the story", from: 2,
            why: "Backwards takes you away from the gap, back towards the beginning you already know. There is nothing to find there." },
          { text: "It does not matter which way",
            why: "It decides whether you add or subtract, so it matters more than anything else on this screen. The two directions give two different answers." }
        ],
        settled2: "Forwards from the start, through the week, to the gap at the end."
      },
      law: "Where the gap sits decides which way you travel. Forwards is adding, backwards is subtracting.",
      bridge: "The engine has stopped on the gap and left it blank on purpose. What actually goes in it is the Engine Room's question.",
      a11yDescription: "A demonstration about direction of travel, using no arithmetic. First a three-car story with the MIDDLE missing: both ends are known, and the engine runs forwards from the start until it reaches the gap, where it stops without filling it in. Then your own story, where the gap is the LAST car — what the office ended with. The journey sets off from what the office started with and runs forwards through the week, which is adding. The engine stops on the gap and the gap stays a question mark; what goes in it is the next question, in the Engine Room."
    }
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "How many umbrellas does the office have at the end of the week?",
        answer: { exact: "{{ans}}", unit: "umbrellas", acceptedForms: ["{{ans}}", "{{ans}} umbrellas"] },
        workedExplanation: "The office began with {{n1}} umbrellas and {{n2}} more were handed in, so the pile grew. {{n1}} + {{n2}} = {{ans}} umbrellas. Check it by going backwards: take the {{n2}} handed in off the {{ans}}, and you are back to the {{n1}} it started with.",
        misconceptions: [
          { response: "{{sub}}", diagnosis: "You subtracted instead of adding. Umbrellas were handed IN, so the office finished with more than it started with — the answer has to be bigger than {{n1}}, not smaller.", tag: "wrong-direction" },
          { response: "{{mul}}", diagnosis: "You multiplied the two amounts. Multiplying would mean the {{n2}} happened {{n1}} times over. They are two single amounts that join together once.", tag: "wrong-operation" },
          { response: "{{n1}}",  diagnosis: "That is what the office started with, which you were given. The week added more to it, so the ending amount cannot be the same number.", tag: "returned-given-value" },
          { response: "{{n2}}",  diagnosis: "That is how many were handed in during the week — the change, not the result. It is the amount the pile GREW BY, not the size of the pile.", tag: "answered-the-change" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "The office started with a pile and then got more. Is the ending pile bigger or smaller than the one it started with?" },
          { rung: 2, type: "signal",   text: "More umbrellas were handed in, so the pile grew. Join the {{n1}} it started with and the {{n2}} that arrived." },
          { rung: 3, type: "coupling", text: "{{n1}} + {{n2}} = ___" },
          { rung: 4, type: "route",    text: "{{n1}} + {{n2}} = {{ans}}. The office has {{ans}} umbrellas at the end of the week." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "umbrellas", acceptedForms: ["{{ans}}", "{{ans}} umbrellas"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked how many the office has NOW — not how many arrived during the week, and not how many it started with.",
    unitsCheck: "umbrellas",
    reasonablenessCheck: "{{ans}} umbrellas at the end. Take the {{n2}} that were handed in back off it and you land on {{n1}}, exactly where the week started. An answer that undoes correctly is an answer that holds.",
    reasonablenessFailExample: "If you got {{sub}}, the office would have fewer umbrellas after people handed some in — which would mean the week made umbrellas disappear.",
    connection: "Every problem on this line is the same three cars: what you started with, what happened, what you ended with. Here the missing car was the last one, which is the easy case. It will not always be."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Four number sets, each re-solved and checked by the inverse operation: 46+28=74 (74-28=46); 63+19=82 (82-19=63); 58+35=93 (93-35=58); 71+24=95 (95-24=71). The start exceeds the change in every set, which the wrong-direction misconception requires to stay positive — a response of -7 is not an answer any student types and the diagnosis could never fire. All four misconception values per set checked distinct from the answer and from each other. Estimate brackets contain their answers: 55-95/74, 65-105/82, 70-120/93, 75-125/95." },
    theme:     { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "Problem text Flesch-Kincaid grade 5.0 at 8.8 words per sentence — the top of the site's band (2.2-5.0) but within it. Change Train prose FK 2.5, comparable to the Ratio Table's 3.3. No grade level named anywhere student-visible. Every scene carries a caption and every Change Train an a11yDescription, in all four sets. --line-change measured on cream at 4.77:1 (AA body text); the move annotation renders 23.75px bold, past the 18.66px large-text threshold, so it clears AA on the darker cell too." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01",
                 notes: "FIXED this pass: the correct read3 option was the LONGEST on 8 of 12 materialisations against 25% chance — 'pick the wordiest' beat reading. This is the Cycle 7b defect reproduced on brand-new content by the agent that had just written the rule down, exactly as VERIFICATION.md 16 predicts. Correct option shortened from 51 characters to 37. Re-measured over 3000 trials: always-longest 33.3%, always-first 24.7%, avoid-longest 22.6% against chance 25.1%. 33.3% is the minimum a three-problem line can reach without hitting 0%, which Cycle 7b showed is the same tell inverted. Hint rungs verified across all sets: rung 3 never states the answer, rung 4 always does. Irrelevant quantity present and declared needed:false. All four rival lines explained at the Ticket Booth." },
    student:   { status: "partial", agent: "claude-session", date: "2026-08-01",
                 notes: "Full station driven in a real browser on set 3 (58 umbrellas + 35 handed in): Read 1 blocks an empty box; Read 2 rejects a distractor-only pick; Read 3 graded; the Ticket Booth teaches on a wrong car before accepting the right one; the Change Train answers a wrong move and then reads '? = 58 + 35' without evaluating it; the answer 93 never appears on the Plan screen; the estimate gate blocks an empty field; all three misconceptions diagnose correctly and 93 is accepted with a materialised explanation; the Arrivals Board compares against the typed estimate. No console errors. NOT a persona walk-through and no real student has used it." },
    oversight: { status: "approved", date: "2026-08-01",
                 notes: "Approved for the mechanical, mathematical, theme and teacher properties measured, with student recorded as partial. One real defect (the option-length tell) was found and fixed by this pass. LIMITATION, and it is the material one: reviewed by the agent that authored it — see VERIFICATION.md 16." }
  }
});
