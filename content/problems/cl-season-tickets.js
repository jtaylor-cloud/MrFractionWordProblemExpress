/* CROSSOVER ISLAND · problem 2 · COMPARE → PART–WHOLE · the transfer is a WHOLE
   Kelder Sands, the island's second staffed platform. `CHALLENGE-MODE.md` §5.2.

   WHY THIS PAIR SECOND, AND WHY THE TRANSFER IS A DIFFERENT SHAPE.
   On `cl-signal-delay` the transfer is a PART of the second situation — a
   length of time that the rate then scales. Here it is the WHOLE: the smaller
   station's total is what the second half divides into adult and child. A
   student who learned "the crossover number is the thing you scale" would be
   wrong about this problem, which is exactly why it is the second one and not
   the fifth. The transfer is defined by where it sits in the STRUCTURE, not by
   what gets done to it.

   IT IS ALSO THE HARDER READ, for a reason worth stating. Both halves are a
   subtraction. Nothing in the arithmetic changes at the crossover, so the seam
   cannot be found by noticing the operation change — the only thing that marks
   it is the story starting to do a different job. `cl-signal-delay` divides
   after it compares, so a student could find that seam by watching the sums.
   Here they cannot.

   THE SECOND HALF IS PART–WHOLE WITH THE WHOLE UNKNOWN, which is the shape the
   Part–Whole Loop's own `pw-free-throws` runs and the one students find
   hardest: the pieces are named and the total is not. Combined with the
   transfer, that means the whole of the second picture is unstated at Plan
   time — three question marks and no numbers — which is a strong version of
   the "waiting picture" the crossover slot was built for.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 84 − 27 = 57 · 57 − 38 = 19   (19 + 38 = 57 ✓ · 57 + 27 = 84 ✓)
     set 2: 76 − 23 = 53 · 53 − 35 = 18   (18 + 35 = 53 ✓ · 53 + 23 = 76 ✓)
     set 3: 90 − 34 = 56 · 56 − 39 = 17   (17 + 39 = 56 ✓ · 56 + 34 = 90 ✓)
     set 4: 68 − 21 = 47 · 47 − 29 = 18   (18 + 29 = 47 ✓ · 47 + 21 = 68 ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - the smaller station's total must EXCEED the adult count, or the child
       count is negative and the story collapses;
     - the final answer differs from every given, from the transfer, and from
       all three of that step's misconception values;
     - the transfer differs from the final answer in every set, or stopping
       halfway would score — the error this whole mode exists to catch;
     - season ticket counts stay plausible for a branch-line station.

   ONE COLLISION TO KNOW ABOUT: sets 2 and 4 both answer 18. They are never
   materialised together and the leak scan works per materialisation, but it
   means no pre-solve copy in this file may print a bare 18 — nor 17 or 19,
   for the same reason across the other two sets. */
MF.registerProblem({
  id: "cl-season-tickets",
  schemaVersion: 1,
  status: "published",
  title: "How many of Harbour Halt's season tickets are child tickets",
  line: "compare",
  topics: ["two-line", "crossover", "smaller-unknown", "part-whole", "transfer"],
  steps: 2,

  pair: {
    first: "compare",
    second: "partwhole",
    transfer: "how many season tickets Harbour Halt sells altogether",

    /* Sentence 4 is where the story stops setting two stations against each
       other and starts describing one station's tickets as pieces of a total.
       Note that BOTH halves are subtractions — see the header. The seam is
       readable and it is not calculable. */
    crossoverSentence: 4,
    /* No number words — these render on the numberless Crossover Read. See the
       same note on `cl-signal-delay`; "half" is the one that keeps trying to
       get in, because "the first half hands the second half a number" is the
       obvious way to say it. */
    crossoverWhy: "Everything before it is the stations measured against each other. From there on Kelder is finished with, and the story is only about Harbour Halt's own tickets and what they divide into.",
    firstWhy: "Amounts set side by side, with the gap between them stated and the smaller of them left out. Nothing changes and nothing repeats.",
    secondWhy: "Adult tickets and child tickets are pieces that add back up to a named total. That is a whole cut into parts — and here it is the total that is missing rather than a piece.",
    readWhy: "A single story doing separate jobs: the stations compared first, then a station's tickets split into pieces. The earlier part works out Harbour Halt's total, and the later part cannot start without it, because that total is the whole thing being divided."
  },

  unknownCar: "part",
  context: "queues",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n1", "-", "n2", "=", "smaller"],
    ["smaller", "+", "n2", "=", "n1"],
    ["smaller", "-", "n3", "=", "ans"],
    ["ans", "+", "n3", "=", "smaller"],
    ["n1", "+", "n2", "=", "mSum"],
    ["n1", "-", "n3", "=", "mWrong"]
  ],

  numberSets: [
    { numbers: { n1: "84", n2: "27", n3: "38", n4: "6" },
      derived: { smaller: "57", ans: "19", mSum: "111", mWrong: "46" },
      estimate: { min: 9, max: 38 } },
    { numbers: { n1: "76", n2: "23", n3: "35", n4: "4" },
      derived: { smaller: "53", ans: "18", mSum: "99", mWrong: "41" },
      estimate: { min: 9, max: 36 } },
    { numbers: { n1: "90", n2: "34", n3: "39", n4: "5" },
      derived: { smaller: "56", ans: "17", mSum: "124", mWrong: "51" },
      estimate: { min: 8, max: 34 } },
    { numbers: { n1: "68", n2: "21", n3: "29", n4: "7" },
      derived: { smaller: "47", ans: "18", mSum: "89", mWrong: "39" },
      estimate: { min: 9, max: 36 } }
  ],

  problem: {
    /* NO SPELLED-OUT NUMBERS IN THE PROSE EITHER. The first draft of sentence 3
       read "and the far two are closed", which passes the validator — its rule
       is about digits outside a {{token}} — and would have put a number word on
       a numberless screen, which `HANDOFF` §H-2 records as unchecked site-wide.
       Writing round it costs one word.

       The adjectives rank nothing. Which station sells more is the story's to
       say through its numbers, and "the big station" would answer the first
       half on a screen where the numbers are covered up. */
    text: "Kelder and Harbour Halt both sell season tickets for the year. Kelder sells {{n1}} of them. That is {{n2}} more than Harbour Halt sells. There are {{n4}} ticket windows at Kelder and the far one is closed for painting. Every season ticket Harbour Halt sells is either an adult ticket or a child ticket. {{n3}} of them are adult tickets. How many of Harbour Halt's season tickets are child tickets?",
    sentences: [
      "Kelder and Harbour Halt both sell season tickets for the year.",
      "Kelder sells {{n1}} of them.",
      "That is {{n2}} more than Harbour Halt sells.",
      "There are {{n4}} ticket windows at Kelder and the far one is closed for painting.",
      "Every season ticket Harbour Halt sells is either an adult ticket or a child ticket.",
      "{{n3}} of them are adult tickets.",
      "How many of Harbour Halt's season tickets are child tickets?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "84", unit: "season tickets", role: "larger",     spoken: "84" },
      n2: { value: "27", unit: "season tickets", role: "difference", spoken: "27" },
      n3: { value: "38", unit: "adult tickets",  role: "part",       spoken: "38" },
      n4: { value: "6",  unit: "ticket windows", role: "distractor", spoken: "6" }
    },
    context: { setting: "railway station booking office", requiresCulturalKnowledge: false }
  },

  /* `queues` draws people waiting, which cannot be counted off the frame — the
     rule this line's art obeys, because the objects ARE the quantities. The
     second half has no art for the same reason `cl-signal-delay`'s does not: a
     picture of the parts would have to draw a whole derived from step 1. */
  /* Its own art now — this carried `queues` from the Compare Line, which is
     this problem's own first half. The wallets run off both edges because
     season tickets ARE the counted quantity here. */
  scene: {
    mode: "anim", art: "seasonrack",
    caption: "A booking office window with a rack of season ticket wallets behind it, and a stamp coming down."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Two stations sell season tickets. We are told how many Kelder sells and how many more that is than Harbour Halt. Then the story turns to Harbour Halt's own tickets, which are all either adult or child, and tells us how many are adult.",
      platformCheck: {
        /* [1,2,5] AND NOT [2,4,5], AND THE VALIDATOR WAS RIGHT. I picked the
           sentences that carry the SIGNAL — including sentence 4, which says
           the tickets are all adult or child and carries no quantity at all.
           The rule is that this list is the sentences carrying quantities the
           solution needs, and it is stricter on purpose: a student tapping the
           evidence has to end up with exactly what the problem is solved from,
           not with the sentences an author found interesting. */
        sentences: [1, 2, 5],
        /* No number words: this renders on a numberless screen and "one
           station against the other" was refused. Say the shape. */
        why: "The first of those counts Kelder's season tickets and the next measures it against Harbour Halt. The last stops comparing anything and gives a piece of Harbour Halt's own total. Notice what is never stated anywhere: how many Harbour Halt sells altogether, which is the amount that piece is a piece of.",
        kinds: "Season tickets throughout — counted at the stations first, then split into kinds at Harbour Halt."
      },

      questions: {
        /* Only `fit` is tailored, as on `cl-signal-delay`, and for the same
           reason: several of the other four have two true answers on a paired
           problem and `phRead1` now says so itself. */
        fit: {
          ask: "Does a single kind of situation cover this whole story — the stations, and the adult and child tickets?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it measures the stations against each other, and after that it takes a single station's tickets and splits them into kinds. Read it again and find the sentence where it changes." },
            stacked: { yes: "Amounts set side by side is a kind of situation. Pieces adding back up to a total is a different kind. This story compares first and divides afterwards — and the comparison works out the very total the division needs.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many more season tickets Kelder sells than Harbour Halt", needed: true },
        { token: "n1", describe: "how many season tickets Kelder sells", needed: true },
        { token: "n4", describe: "how many ticket windows Kelder has", needed: false },
        { token: "n3", describe: "how many of Harbour Halt's tickets are adult tickets", needed: true }
      ],
      relationship: "The first two belong together and both are about Kelder — one counts its tickets, the other is only the gap between it and Harbour Halt. The adult tickets belong to a different pairing altogether: they are part of Harbour Halt's own total, which the story never states. The ticket windows are furniture.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many of Harbour Halt's season tickets are child tickets.",
      commonMisreading: "Working out Harbour Halt's total and stopping there, which answers a question about the whole station when the question asked about one kind of ticket.",
      options: [
        { text: "How many season tickets Harbour Halt sells altogether",
          why: "You will need that, and it is not stated anywhere — but read the last sentence again. It asks for one KIND of ticket, not the whole station's count." },
        { text: "How many of Harbour Halt's tickets are child tickets", correct: true,
          why: "One part of one station's total, and the only thing in the story that nothing gives you and nothing else stands in for." },
        { text: "How many more tickets Kelder sells", correct: false,
          why: "Handed to you outright in the third sentence. It is the gap between the stations, not a count of tickets at either." },
        { text: "How many of Kelder's tickets are child tickets",
          why: "The story never splits Kelder's tickets into kinds at all. Only Harbour Halt's are described that way." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "compare",
    whyCorrect: "This story starts on the Compare Line — two stations side by side, with the gap stated and one of the amounts missing. It does not stay there. Once Harbour Halt's total is known, adult and child tickets are pieces adding back up to it, and that is the Part–Whole Loop. Two lines, in that order, joined at the total neither of them states.",
    distractors: [
      { line: "change",    whyWrong: "Nothing ends up different from how it started. Both stations simply sell what they sell, and the tickets are sorted into kinds rather than changed into them. Sorting is not an event happening to an amount." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many — and adult and child tickets are two different-sized pieces of one total, not two helpings of the same size." },
      { line: "ratio",     whyWrong: "The gap between the stations is a fixed number of tickets, not a fixed relationship. On the Ratio Rail doubling Kelder would double Harbour Halt; here Kelder sells a set number MORE, which stays the same size whatever the counts are." },
      { line: "partwhole", whyWrong: "Half right, and worth saying so: the second half of this story really is Part–Whole. But the story does not open there. Before any of it, two stations are set against each other, and that comparison is what produces the total the pieces are pieces OF." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many child tickets Harbour Halt sells",
      "how many adult tickets Harbour Halt sells",
      "how many more tickets Kelder sells"
    ],
    unknownCarAnswer: "how many child tickets Harbour Halt sells",
    unknownCarWhy: "The adult tickets are counted and the gap between the stations is counted. The child tickets are not — and neither is the total they are part of, which is why this one takes two moves rather than one."
  },

  signalBox: {
    /* The first half's picture. Smaller unknown, gap stated — the same shape as
       `cp-bench-count`, deliberately, because the difficulty here is meant to
       be the crossover rather than the comparison. `gapToken` IS set on this
       one: the gap is given in the story, unlike `cl-signal-delay` where it was
       the thing to work out. */
    compareBars: {
      title: "Side by side",
      heading: "The bigger station, and the gap on the end of it",
      prompt: "One of these stations is being measured against the other. Tap the one it is measured AGAINST.",
      bars: [
        { key: "harbour", label: "Harbour Halt", unknown: true },
        { key: "kelder",  label: "Kelder",       token: "n1" }
      ],
      gapToken: "n2",
      unknownIs: "smaller",
      referent: "harbour",
      gapLabel: "Harbour Halt's season tickets",
      why: "Kelder is measured against HARBOUR HALT — \"more than Harbour Halt sells\". So Harbour Halt is what you measure against, even though it is the amount you have to work out. The gap sits on the end of Kelder's bar, and what is left underneath it is Harbour Halt's total.",
      whyWrong: {
        kelder: "Kelder is the one being measured — the story says it sells more THAN something else. Find what follows \"than\": that is the amount being measured against, and here it happens to be the one you are looking for."
      },
      a11yDescription: "Two bars. Kelder is drawn to its full length with the gap marked off the end of it. Harbour Halt is the part left underneath, outlined rather than filled, with a question mark for its total because the story never states it.",
      settledSay: "Whatever follows the word \"than\" is what you measure against — even when that is the amount you are looking for. And here it is not the answer either; it is what the rest of the story needs."
    },

    /* THE CROSSOVER. The second picture is a Part–Whole table with the WHOLE
       missing as well as the part — three unstated cells and no numbers at all
       on the right-hand side, which is the strongest form of the waiting
       picture the slot was built for. Nothing here carries a number: the
       options name quantities and the cell takes a name, never a value. */
    crossover: {
      heading: "What crosses over?",
      prompt: "The first picture is finished, and the story is not. Something from that picture is the number the rest of this problem needs. Which one?",
      cellLabel: "Harbour Halt's total",
      options: [
        { text: "Harbour Halt's total, from under the gap", correct: true,
          why: "The part left underneath the gap is Harbour Halt's whole count, and that is the only thing the first picture produced. The second half divides it into adult and child — so it is the whole those pieces are pieces of, and nothing can be split until it is known." },
        { text: "The gap between the two stations",
          why: "That was given to you in the story, so the first picture did not produce it. It was what let you find Harbour Halt's total — it has done its job by the time you cross over." },
        { text: "Kelder's season tickets",
          why: "Given as well, in its own sentence. And the second half of the story never mentions Kelder again: once the crossover is passed, Kelder is finished with." },
        { text: "The adult tickets",
          why: "Those belong to the second half already — printed in the story and waiting in the table below. The crossover is what the FIRST half hands over." }
      ],
      settledSay: "That is the join. The first picture ends with Harbour Halt's total, and the second picture starts by cutting it in two.",
      second: {
        title: "The second picture",
        heading: "A whole, waiting to be known",
        givenHeading: "What you were told",
        targetHeading: "What you need",
        rows: [
          { label: "Adult tickets", key: "adult",    given: "{{n3}}" },
          { label: "Child tickets", key: "answer",   given: "not stated" },
          { label: "Both together", key: "transfer", given: "not stated" }
        ],
        waiting: "Look at the right-hand column: nothing in this picture is known yet, not even the total. That is what makes this one different from a Part–Whole problem on the mainland, where the whole is printed in the story. Here the whole is the number the first half worked out — so until you have it, there is nothing to cut.",
        a11yDescription: "A table of three rows: adult tickets, child tickets, and both together. The left column holds only the adult count the story states; the other two are not stated. The right column is empty on every row, and the bottom cell is labelled as Harbour Halt's total once you have named it. Nothing in this picture is calculated."
      }
    },

    estimate: {
      prompt: "Before calculating — roughly how many child season tickets do you think Harbour Halt sells?",
      reasonableMin: 9,
      reasonableMax: 38,
      modelReasoning: "Round both of Kelder's numbers to the nearest ten and take one off the other, and you have roughly what Harbour Halt sells altogether. Then take off roughly the adult tickets. Two rough subtractions — you are after the right sort of size, not the answer.",
      unit: "child tickets"
    }
  },

  /* The same failure as the first island problem and a different disguise. On
     `cl-signal-delay` the halfway number is in the wrong UNITS, which is a
     check the student can run. Here it is in the same units as the answer —
     both are season tickets — so the units check cannot catch it and only
     re-reading the question can. Deliberate, and the reason this problem is
     second: the easy tell is removed. */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out Harbour Halt's total and it was right. Why was it not the answer?",
    why: "Because the question asked for the CHILD tickets, and that number is all of Harbour Halt's tickets — adult and child together. It is in the same units as the answer, so nothing about it looks wrong. That is what makes this halfway point harder to spot than the last one: the only thing that catches it is reading the question again."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "First, how many season tickets does Harbour Halt sell altogether?",
        answer: { exact: "{{smaller}}", unit: "season tickets", acceptedForms: ["{{smaller}}", "{{smaller}} season tickets", "{{smaller}} tickets"], preferredForm: "{{smaller}}" },
        workedExplanation: "Kelder sells {{n1}}, and {{n2}} of those are the gap between it and Harbour Halt. Take the gap off and what is left is Harbour Halt: {{n1}} − {{n2}} = {{smaller}} season tickets. Check it forwards — {{smaller}} + {{n2}} = {{n1}}, Kelder exactly.",
        hints: [
          { rung: 1, text: "Read the sentence with \"more than\" in it again. Which station is it telling you about, and which one is it measuring against?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The gap is marked off the END of Kelder's bar. What is left underneath it?" },
          { rung: 3, text: "Harbour Halt is Kelder with the gap taken off: {{n1}} − {{n2}} = ___" },
          { rung: 4, text: "{{n1}} − {{n2}} = {{smaller}}. Harbour Halt sells {{smaller}} season tickets altogether." }
        ],
        misconceptions: [
          { response: "{{mSum}}", diagnosis: "You added, because the story says \"more\". The word tells you Kelder is the bigger of the two — and Kelder's count was already given to you. Adding makes Harbour Halt bigger than the station it is supposed to sell fewer than.", tag: "keyword-addition" },
          { response: "{{n1}}", diagnosis: "That is Kelder's count, which the story handed you. Harbour Halt sells fewer, so its number has to come out below {{n1}}.", tag: "gave-back-the-larger" },
          { response: "{{n2}}", diagnosis: "That is the gap between the stations, not a count of tickets at either of them. It is how many MORE Kelder sells.", tag: "gave-back-the-difference" }
        ]
      },
      {
        /* Step 2 opens by naming step 1's answer, which is the sentence the
           sweep's transfer rule exists for. */
        id: "s2",
        prompt: "Harbour Halt sells {{smaller}} season tickets, and {{n3}} of them are adult tickets. How many are child tickets?",
        answer: { exact: "{{ans}}", unit: "child tickets", acceptedForms: ["{{ans}}", "{{ans}} child tickets", "{{ans}} tickets"], preferredForm: "{{ans}}" },
        workedExplanation: "Every one of Harbour Halt's tickets is adult or child, so those two pieces add back up to the whole {{smaller}}. Take the adult tickets off the total and what is left is the child tickets: {{smaller}} − {{n3}} = {{ans}}. Check it forwards — {{ans}} + {{n3}} = {{smaller}}, the whole station exactly.",
        hints: [
          { rung: 1, text: "Every ticket is one kind or the other. So what do the adult tickets and the child tickets add up to?" },
          { rung: 2, text: "The whole is {{smaller}}, and you know one of the two pieces. What is the other piece?" },
          { rung: 3, text: "{{smaller}} − {{n3}} = ___" },
          { rung: 4, text: "{{smaller}} − {{n3}} = {{ans}}. Harbour Halt sells {{ans}} child season tickets." }
        ],
        misconceptions: [
          { response: "{{smaller}}", diagnosis: "That is the number you just worked out, and it was right — but it is ALL of Harbour Halt's tickets, adult and child together. The question asked for one of the two pieces. This is the halfway point of the problem, and it is in the same units as the answer, which is exactly why it is easy to hand in.", tag: "stopped-at-the-transfer" },
          { response: "{{mWrong}}", diagnosis: "You took the adult tickets off KELDER's count instead of Harbour Halt's. The adult tickets belong to Harbour Halt — the story only splits that station's tickets into kinds, and Kelder is finished with by then.", tag: "wrong-whole" },
          { response: "{{n3}}", diagnosis: "That is the adult tickets, which the story gave you. The child tickets are the rest of the total, not the same number.", tag: "gave-back-the-part" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "child tickets", acceptedForms: ["{{ans}}", "{{ans}} child tickets", "{{ans}} tickets"], preferredForm: "{{ans}}" },
    /* Names step 1's answer, which is allowed on this screen and only here: the
       unsure board is reached from the last step, so a student reading it has
       already produced that number themselves. */
    questionCheck: "The question asked for the CHILD tickets at Harbour Halt. If your answer is {{smaller}}, that is the whole station — adult and child together — and it is the middle of this problem rather than the end of it.",
    unitsCheck: "child tickets",
    reasonablenessCheck: "{{ans}} child tickets. Check it backwards: {{ans}} + {{n3}} = {{smaller}}, which is Harbour Halt's whole count, and adding the gap of {{n2}} back on lands you at {{n1}}, Kelder exactly. Both halves check out.",
    reasonablenessFailExample: "If you got {{mWrong}}, you would have taken Harbour Halt's adult tickets off Kelder's total — a number that describes no station in this story.",
    connection: "On the last island stop the halfway number was in the wrong units, so checking the units caught it. Here both numbers are season tickets and that check tells you nothing. What caught it was the question: one kind of ticket, not the whole station."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story rather than checked against the stated work, and each verified both ways: 84-27=57, 57-38=19 (19+38=57, 57+27=84); 76-23=53, 53-35=18; 90-34=56, 56-39=17; 68-21=47, 47-29=18. The transfer exceeds the adult count in all four, so the child count stays positive. Within every set the final answer differs from all four givens, from the transfer, and from all three of that step's misconception values. Noted for whoever edits the copy: sets 2 and 4 both answer 18, so no pre-solve copy here may print a bare 17, 18 or 19." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Compare -> Part-Whole, island problem 2. Two deliberate escalations from problem 1: the transfer is the WHOLE of the second situation rather than a part of it, so 'the crossover number is the thing you scale' fails here; and both halves are subtractions, so the seam cannot be found by watching the operation change. The halfway number is also in the SAME units as the answer, which removes the units check that caught it last time and leaves only re-reading the question. read3's distractor is placed first. The `fit` question is tailored and answers stacked; the other four are left abstract, as on cl-signal-delay." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Second of seven island problems; the Crossover Read, the crossover slot and the island map all existed before this was written, so unlike cl-signal-delay this one tests the content rather than the engine." }
  }
});
