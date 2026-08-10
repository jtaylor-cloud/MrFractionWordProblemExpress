/* Part–Whole Loop · fraction unknown · craft · independent · SIGNAL FAILURE

   FOUR NUMBER SETS, and this was the one flagged as not obviously convertible:
   the quantity is a FRACTION, so there is nothing to scale. The values that
   vary are the two given fractions themselves, which drags four other things
   along with them — the unit-grid picture, the bar's marked count, the naive
   add-the-bottoms trap, and the spoken forms of both fractions.

   The denominators are always drawn from {4, 5, 10} with a least common
   denominator of exactly TWENTY in every set. That is not tidiness: the scene
   is a 20-cell grid five across and the bar is 20 parts, and neither can be
   redrawn per set beyond its counts. Fixing the LCD keeps the picture honest
   while the fractions move.

   Two constraints that are not arithmetic:
     - Blue is always the larger colour, because the "you found the difference"
       misconception subtracts red from blue and a negative fraction is not a
       wrong answer anyone types.
     - White is never smaller than three twentieths, or the leftover strip is
       too thin to read in the grid.

   Verified both ways for each set — the sum built on the common denominator,
   and the three colours added back to one whole:
     2/5 + 1/4  =  8/20 +  5/20 = 13/20 → white  7/20   (8+5+7 = 20)
     3/10 + 1/4 =  6/20 +  5/20 = 11/20 → white  9/20   (6+5+9 = 20)
     3/5 + 1/4  = 12/20 +  5/20 = 17/20 → white  3/20   (12+5+3 = 20)
     1/4 + 1/5  =  5/20 +  4/20 =  9/20 → white 11/20   (5+4+11 = 20) */
MF.registerProblem({
  id: "pw-quilt-colors",
  schemaVersion: 1,
  status: "published",
  title: "What's left over",
  line: "partwhole",
  topics: ["adding-fractions", "complement", "unlike-denominators"],
  steps: 2,

  unknownCar: "fraction",
  context: "craft",
  fadeLevel: "independent",
  stationRoles: ["signalbox"],
  hubEligible: false,

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* n1 and n2 are FRACTIONS, and parseFloat("2/5") is 2 — so neither may be
     named in a check. Everything arithmetic goes through the twentieths
     instead, which is also the form the picture is drawn in. */
  numberChecks: [
    ["blueN", "+", "redN", "=", "sumN"],
    ["20", "-", "sumN", "=", "whiteN"],
    ["sumN", "+", "whiteN", "=", "20"],
    ["blueN", "-", "redN", "=", "diffN"],
    ["whiteN", "-", "1", "=", "slipN"],
    ["whiteN", "/", "20", "=", "ansDec"],
    ["sumN", "/", "20", "=", "sumDec"],
    /* The bar: twenty parts, the coloured ones marked, the rest white. */
    ["seg1", "-", "mark1", "=", "whiteN"],
    ["mark1", "+", "whiteN", "=", "seg1"],
    ["mark1", "*", "1", "=", "sumN"]
  ],

  numberSets: [
    { numbers: { n1: "2/5", n2: "1/4", n3: "9" },
      spoken: { n1: "two fifths", n2: "one quarter" },
      derived: { blueN: "8", redN: "5", whiteN: "7", sumN: "13", diffN: "3", slipN: "6",
                 ansDec: "0.35", ansPct: "35", sumDec: "0.65", sumPct: "65",
                 ansFrac: "7/20", sumFrac: "13/20", diffFrac: "3/20", slipFrac: "6/20",
                 trapFrac: "3/9", blueWord: "two fifths", redWord: "one quarter" },
      estimate: { min: 0.2, max: 0.5 }, segments: [20], marked: [13], sceneGroups: [8, 5, 7] },
    { numbers: { n1: "3/10", n2: "1/4", n3: "7" },
      spoken: { n1: "three tenths", n2: "one quarter" },
      derived: { blueN: "6", redN: "5", whiteN: "9", sumN: "11", diffN: "1", slipN: "8",
                 ansDec: "0.45", ansPct: "45", sumDec: "0.55", sumPct: "55",
                 ansFrac: "9/20", sumFrac: "11/20", diffFrac: "1/20", slipFrac: "8/20",
                 trapFrac: "4/14", blueWord: "three tenths", redWord: "one quarter" },
      estimate: { min: 0.3, max: 0.6 }, segments: [20], marked: [11], sceneGroups: [6, 5, 9] },
    { numbers: { n1: "3/5", n2: "1/4", n3: "6" },
      spoken: { n1: "three fifths", n2: "one quarter" },
      derived: { blueN: "12", redN: "5", whiteN: "3", sumN: "17", diffN: "7", slipN: "2",
                 ansDec: "0.15", ansPct: "15", sumDec: "0.85", sumPct: "85",
                 ansFrac: "3/20", sumFrac: "17/20", diffFrac: "7/20", slipFrac: "2/20",
                 trapFrac: "4/9", blueWord: "three fifths", redWord: "one quarter" },
      estimate: { min: 0.05, max: 0.3 }, segments: [20], marked: [17], sceneGroups: [12, 5, 3] },
    { numbers: { n1: "1/4", n2: "1/5", n3: "8" },
      spoken: { n1: "one quarter", n2: "one fifth" },
      derived: { blueN: "5", redN: "4", whiteN: "11", sumN: "9", diffN: "1", slipN: "10",
                 ansDec: "0.55", ansPct: "55", sumDec: "0.45", sumPct: "45",
                 ansFrac: "11/20", sumFrac: "9/20", diffFrac: "1/20", slipFrac: "10/20",
                 trapFrac: "2/9", blueWord: "one quarter", redWord: "one fifth" },
      estimate: { min: 0.4, max: 0.7 }, segments: [20], marked: [9], sceneGroups: [5, 4, 11] }
  ],

  // ONE quilt, cut into twentieths — not twenty quilts. Blue and red are what
  // the problem GIVES you; the white is what it asks for, so it stays a "?".
  // Adding the two given fractions is the whole first step, and the picture
  // must not do it for the student. The three counts come from the set's
  // sceneGroups, in this order, and rule 6f re-checks that they total 20.
  scene: {
    mode: "unit", cols: 5,
    caption: "One quilt in twentieths. Blue and red are given — the white is what you're asked for.",
    groups: [
      { key: "blue",    n: 8, label: "blue",  as: "{{n1}}" },
      { key: "red",     n: 5, label: "red",   as: "{{n2}}" },
      { key: "unknown", n: 7, label: "white", as: "?"   }
    ]
  },

  problem: {
    text: "The quilt is for a raffle at the community hall. The blue squares came from an old pair of curtains, and the red ones from a summer dress. The quilt takes {{n3}} patient hours to sew. It is {{n1}} blue. Another {{n2}} of it is red. The rest of it is plain cotton white. What fraction of the quilt is white?",
    sentences: [
      "The quilt is for a raffle at the community hall.",
      "The blue squares came from an old pair of curtains, and the red ones from a summer dress.",
      "The quilt takes {{n3}} patient hours to sew.",
      "It is {{n1}} blue.",
      "Another {{n2}} of it is red.",
      "The rest of it is plain cotton white.",
      "What fraction of the quilt is white?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "2/5", unit: "", role: "part", spoken: "two fifths" },
      n2: { value: "1/4", unit: "", role: "part", spoken: "one quarter" },
      // Was "60 squares", which contradicted the model: the bar and the
      // picture both cut this quilt into TWENTIETHS, so a stated count of 60
      // squares put the text and the illustration at odds. Hours are
      // distracting without competing with the partition.
      n3: { value: "9",  unit: "hours", role: "distractor", spoken: "9" }
    },
    context: { setting: "quilting", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A quilt is made of three colours. We know how much of it is two of those colours, and we want to know how much is the third.",
      /* "The rest of it" is the sharpest Part-Whole signal in English — it is
         meaningless unless something is being used up. Worth more than the
         sentence that names the shares, which is why the tell is sentence 4. */
      platformCheck: {
        sentences: [3, 4],
        why: "Between them those sentences name the coloured shares, and both are shares of the same quilt. Worth noticing too — \"the rest of it is white\" is what tells you the colours have to account for the whole quilt between them, though it hands you no number of its own.",
        kinds: "Everything counted here is fabric in the same quilt."
      },

      questions: {
        kinds: {
          ask: "This story counts the coloured fabric that makes up the quilt, and it also counts the hours the quilt takes to sew. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The sewing time is how long it takes to make, not what it is made of. Everything the question is about is fabric in the same quilt.",
                         no:  "That would mean the fabric and the hours were locked at a fixed rate, scaling together. The story never pairs them off." },
            different: { yes: "", no: "That would mean a bigger quilt took proportionally longer in a fixed way. The hours are background here." }
          }
        },
        moments: {
          ask: "Does the quilt change during this story, or is the story describing what a finished quilt is made of?",
          options: {
            changed: { text: "The quilt changes", yes: "",
                       no:  "That would mean fabric being added or taken away between a before and an after. The quilt is finished and sitting there; you are being told what it is made of." },
            steady:  { text: "It describes what the quilt is made of",
                       yes: "Nothing is happening to the quilt. The story is describing the colours it is already made from.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just this quilt, or this quilt and a second quilt held up beside it?",
          options: {
            single:   { yes: "A single quilt, divided by colour.", no: "" },
            separate: { yes: "", no: "That would mean a second quilt set beside this to measure the gap between them. There is only the raffle quilt." },
            paired:   { yes: "", no: "That would mean fabric locked to something else and scaled up or down. A finished quilt is a fixed whole, not a rate." }
          }
        },
        shape: {
          ask: "Is the quilt being shared out into parts, or is the same patch repeated over and over, or neither?",
          options: {
            cut:     { yes: "Blue, red and white are shares of the same quilt, and between them they have to account for all of it. That is what \"the rest\" means.", no: "" },
            repeat:  { yes: "", no: "That would mean an identical patch appearing again and again, with the question counting the patches. The colours are shares of the quilt, not repeats of a unit." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the blue and the red are parts of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the blue, the red, and the white that is left?",
          options: {
            onekind: { yes: "A whole cut into shares, all the way through. Getting to the white takes more than a single step, and every step is the same kind of situation.", no: "" },
            stacked: { yes: "", no: "Worth asking, and it does take more than a single step &mdash; you put the coloured shares together before you can find what is left. Both steps are the same kind of situation. Steps and situations are not the same thing." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. A quilt divided by colour is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the share of the quilt that is blue", needed: true },
        { token: "n2", describe: "the share of the quilt that is red", needed: true },
        { token: "n3", describe: "how long the quilt took to sew", needed: false }
      ],
      relationship: "Blue, red and white are three parts of one whole quilt. All three together must make exactly one. How long it took to sew has nothing to do with how much of it is each colour.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "What fraction of the quilt is white — the part that's left after blue and red.",
      commonMisreading: "Working out how much is coloured and stopping there. That's the opposite of what was asked.",
      options: [
        { text: "The fraction of the quilt that is white", correct: true,
          why: "A fraction — the piece left once blue and red are accounted for." },
        { text: "The fraction that is blue and red together",
          why: "You DO need this — it is {{n1}} + {{n2}} — but it is the step before the answer, not the answer. The question asks what is left after it." },
        { text: "How long the quilt took to sew",
          why: "That number is in the problem, but nothing asks for it. Some numbers are just part of the story." },
        { text: "Which colour covers the most of the quilt",
          why: "You could work that out, but nobody asked. The question wants a fraction, not a comparison." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "Three colours, one quilt. The parts have to add up to the whole thing, and you're missing one of them. Straight down the Part–Whole Loop.",
    distractors: [
      { line: "compare", whyWrong: "Fair guess — there are two fractions here, and two of anything looks like a comparison. But we're not asking which colour there's more of. We're adding them together and seeing what's left, which is Part–Whole." },
      { line: "change",  whyWrong: "The quilt doesn't start one way and become another. It's one finished object being described." },
      { line: "groups",  whyWrong: "No repeated equal groups. Three different-sized pieces making one whole." },
      { line: "ratio",   whyWrong: "There aren't two different units in a fixed relationship. Everything here is measured as a fraction of the same quilt." }
    ],
    unknownCar: "part",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["a part", "the whole", "the number of parts"],
    unknownCarAnswer: "a part",
    unknownCarWhy: "The whole quilt is 1. You've got two of the three parts, and the third is missing.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "compare"],
      discriminator: "Ask what happens to the two fractions. Are they being measured against each other, or added together? Here they're added, and the answer is whatever's left of the whole."
    }
  },

  /* The Signal Failure. This was the last problem still carrying the old
     four-field shape (trapWord/trapReading/whyItFails/studentPrompt) — the one
     PROBLEM-SCHEMA.md documented while all eight other problems used
     trigger/prompt/why. One shape now, and the schema follows the code.

     Re-voiced in the move. The old studentPrompt ended "before you do any
     working", which is the opposite of where this renders: the Arrivals Board
     (Phase 4b), after the answer. It was the only Signal Failure on the site
     written for a pre-solve slot, and asking a student to explain a trap they
     have already walked through needs the past tense to make any sense.

     No leak either way: {{trapFrac}} is s1's misconception value and already
     appears in arrivals.reasonablenessFailExample on the same screen; the
     answers ({{sumFrac}}, {{ansFrac}}) are named nowhere here. */
  signalFailure: {
    trigger: "and",
    prompt: "The story says {{blueWord}} and {{redWord}} — and \"and\" does mean add. You added. So why is the answer not {{trapFrac}}?",
    why: "Because adding the tops and adding the bottoms is not adding the fractions. The two colours are cut into different-sized pieces, and adding those bottom numbers is like adding 2 apples and 1 orange and calling the answer 3 apple-oranges. The word \"and\" was telling the truth about the operation. What it never said was that the pieces have to be made the same size first — and no word in the story was ever going to tell you that."
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      bars: [{ label: "the quilt", segments: 20, segmentValue: "", knownTotal: "1 whole", unit: "",
               marked: 13, markedLabel: "already coloured (blue or red)", restLabel: "white" }],
      /* This description used to read "Eight of those parts are blue... Five of
         them are red... The remaining seven parts are white." Every one of those
         counts is a thing the staged marking exists to make the student DERIVE
         (model.js header: "Prompts name the FRACTION, never the count"), and
         "seven parts" out of 20 is s2's answer and the final answer, stated
         verbatim on the same screen as the estimate field. The illustration was
         fixed for this problem; the prose narrating it was not. It names the
         fractions now, and no counts — which is also what lets it survive four
         different pairs of fractions unchanged. */
      a11yDescription: "One bar stands for the whole quilt. It is split into 20 equal parts. {{blueWord}} of those parts are blue. {{redWord}} of them are red. Work out how many parts that comes to for each colour, then mark them. Whatever is left over is white, and the question asks what fraction that comes to.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly what fraction of the quilt do you think is white? (A decimal is fine.)",
      reasonableMin: 0.2,
      reasonableMax: 0.5,
      /* Said "white is somewhere around a third" on a problem whose answer is
         0.35. Naming the answer to one significant figure is not a bracket, and
         it was only ever true of the first set. This gives the student the move
         instead of the number, and it holds whichever pair of fractions they
         drew. */
      modelReasoning: "Blue covers {{blueWord}} of the quilt and red covers {{redWord}}. Put those two together roughly in your head — then white is whatever is left of one whole. If the two colours between them cover more than half the quilt, your estimate belongs under a half; if they cover less, it belongs over.",
      unit: ""
    }
  },

  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "What fraction of the quilt is coloured — blue and red together?",
        answer: { exact: "{{sumFrac}}", unit: "", acceptedForms: ["{{sumFrac}}", "{{sumDec}}", "{{sumPct}}%"], preferredForm: "{{sumFrac}}" },
        workedExplanation: "Both fractions fit into twentieths. {{n1}} = {{blueN}}/20 and {{n2}} = {{redN}}/20. Add them: {{blueN}}/20 + {{redN}}/20 = {{sumFrac}}.",
        misconceptions: [
          { response: "{{trapFrac}}", diagnosis: "You added the tops and the bottoms. That's the trap — the two fractions are cut into different-sized pieces, so they have to be rewritten in the same size before they can be added.", tag: "add-denominators" },
          { response: "{{ansFrac}}",  diagnosis: "That's the white part, which is where we're going — but this step asks for the coloured part first.", tag: "skipped-ahead" },
          { response: "{{diffFrac}}", diagnosis: "You found the difference between them rather than the total. The question asks for both colours together.", tag: "operation-inversion" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "You can't add these two as they stand — the pieces are different sizes. What has to be true about two fractions before you can add them?" },
          { rung: 2, type: "signal",   text: "Find a bottom number that both of them fit into, then rewrite each fraction with it." },
          { rung: 3, type: "coupling", text: "Twenty works for both. {{n1}} = {{blueN}}/20 and {{n2}} = {{redN}}/20. Now add: {{blueN}}/20 + {{redN}}/20 = ___" },
          { rung: 4, type: "route",    text: "{{blueN}}/20 + {{redN}}/20 = {{sumFrac}}. That much of the quilt is coloured." }
        ]
      },
      {
        id: "s2",
        prompt: "So what fraction is white?",
        answer: { exact: "{{ansFrac}}", unit: "", acceptedForms: ["{{ansFrac}}", "{{ansDec}}", "{{ansPct}}%"], preferredForm: "{{ansFrac}}" },
        workedExplanation: "The whole quilt is 20/20. Take away the coloured part: 20/20 − {{sumFrac}} = {{ansFrac}}.",
        misconceptions: [
          { response: "{{sumFrac}}",  diagnosis: "That's the coloured part. The question asks for the white part — what's left over.", tag: "answered-intermediate" },
          { response: "{{slipFrac}}", diagnosis: "Close, but check your subtraction. 20 − {{sumN}} isn't {{slipN}}.", tag: "arithmetic-slip" },
          { response: "{{whiteN}}",   diagnosis: "You've got the right number of parts, but the answer needs to be a fraction of the quilt — that many parts out of how many?", tag: "parts-not-fraction" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "How would you write 'one whole quilt' using twentieths?" },
          { rung: 2, type: "signal",   text: "The whole is 20/20. Take the coloured part away from it." },
          { rung: 3, type: "coupling", text: "20/20 − {{sumFrac}} = ___" },
          { rung: 4, type: "route",    text: "20/20 − {{sumFrac}} = {{ansFrac}}. That fraction of the quilt is white." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ansFrac}}", unit: "", acceptedForms: ["{{ansFrac}}", "{{ansDec}}", "{{ansPct}}%"], preferredForm: "{{ansFrac}}" },
    questionCheck: "The question asked for the WHITE fraction, not the coloured one.",
    unitsCheck: "a fraction of the whole quilt",
    reasonablenessCheck: "{{ansFrac}} of the quilt is white and {{sumFrac}} is coloured. Add those two back together and you should get one whole quilt — that is the check.",
    /* The old version asserted the trap "happens to land near the right answer
       here", which was true of the first set and of no other. What IS always
       true is where the trap lands: adding tops and bottoms gives the mediant,
       and the mediant always sits between the two fractions you started with. */
    reasonablenessFailExample: "If you got {{trapFrac}}, that came from adding the tops and adding the bottoms. That move always lands somewhere between the two fractions you were handed — so it is telling you about the size of one of the colours, not about what is left over. It can come out near the right answer by luck, which is exactly what makes it worth killing now.",
    connection: "When the parts must add to one whole, the last part is always 'the whole minus everything else'."
  },

  review: {
    math:      { status: "pass", agent: "claude-session",  date: "2026-08-01",
                 notes: "Four number sets, each re-solved on the common denominator and checked by adding all three colours back to one whole: 2/5+1/4 = 8/20+5/20 = 13/20, white 7/20 (8+5+7 = 20); 3/10+1/4 = 6/20+5/20 = 11/20, white 9/20 (6+5+9 = 20); 3/5+1/4 = 12/20+5/20 = 17/20, white 3/20 (12+5+3 = 20); 1/4+1/5 = 5/20+4/20 = 9/20, white 11/20 (5+4+11 = 20). Every denominator pair has a least common denominator of exactly 20, which the 20-cell scene and the 20-part bar both require. Every acceptedForm re-checked as numerically equal to its exact per set, in all three notations (fraction, decimal, percent). Estimate brackets contain the final answer: 0.2-0.5/0.35, 0.3-0.6/0.45, 0.05-0.3/0.15, 0.4-0.7/0.55. Blue is the larger colour in every set, which the difference misconception needs to stay positive. The 2026-07-28 note stands for set 1 and now generalises: the add-the-bottoms trap is the mediant, which always lies between the two given fractions — near the answer in set 1 (0.333 against 0.35) and nowhere near it in the others. The Arrivals fail-example was rewritten to state that property rather than the coincidence." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "Quilting context requires no prior knowledge. Colour words are incidental, not load-bearing for colourblind students." },
    teacher:   { status: "pass", agent: "claude-session", date: "2026-08-01", notes: "2026-07-28 findings stand: genuine keyword trap, not manufactured. FIXED 2026-08-01: the estimate's modelReasoning said white was 'somewhere around a third' on a problem whose answer is 0.35 — naming the answer to one significant figure is not a bracket, and it was true of one set in four. Replaced with the estimating move itself. The spelled-out answers in both hint ladders ('Thirteen twentieths', 'Seven twentieths') were removed for the same reason they were removed across the Ratio line." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (bar fields confirmed clean, a11yDescription aligned). The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
