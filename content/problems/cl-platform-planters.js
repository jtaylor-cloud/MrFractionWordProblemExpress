/* CROSSOVER ISLAND · problem 3 · PART–WHOLE → EQUAL GROUPS · the transfer is a REMAINDER
   Fell Crossing, the island's third staffed platform. `CHALLENGE-MODE.md` §5.2.

   THE THIRD SHAPE OF TRANSFER IN THREE PROBLEMS, and that is the sequence
   doing its job. On `cl-signal-delay` the transfer is a PART of what follows —
   a length of time the rate scales. On `cl-season-tickets` it is the WHOLE that
   gets divided. Here it is neither: it is what is LEFT once the named parts are
   taken out, and then that leftover becomes the thing shared. A student who has
   ridden all three has met a crossover number that was scaled, divided up, and
   left over, which is three different jobs for the same structural idea.

   IT IS ALSO THE FIRST ISLAND PROBLEM WHOSE FIRST HALF IS NOT A COMPARISON, and
   that is why it was built third rather than later: it is the one that tests
   whether the machinery is really general. The Plan phase's first picture here
   is the MODEL YARD, not one of the four schema models — which is exactly the
   case `pair-model.js` was quietly unable to draw until this problem forced it
   out. See the note on `firstView` there; the fix is in the engine, and this
   content is what found it.

   THE ARITHMETIC, RE-DERIVED PER SET AND CHECKED BOTH WAYS.
     set 1: 90 − 27 − 15 = 48 · 48 ÷ 6 = 8   (8 × 6 = 48 · 48 + 27 + 15 = 90 ✓)
     set 2: 84 − 30 − 19 = 35 · 35 ÷ 7 = 5   (5 × 7 = 35 · 35 + 30 + 19 = 84 ✓)
     set 3: 96 − 34 − 18 = 44 · 44 ÷ 4 = 11  (11 × 4 = 44 · 44 + 34 + 18 = 96 ✓)
     set 4: 76 − 19 − 21 = 36 · 36 ÷ 4 = 9   (9 × 4 = 36 · 36 + 19 + 21 = 76 ✓)

   CONSTRAINTS ALL FOUR SETS ARE BUILT TO:
     - the leftover must divide exactly by the number of platforms, or the
       sharing lands on part of a planter;
     - the leftover must NOT equal the two named parts added together. That
       happens whenever the delivery is exactly twice the parts, and it would
       make the "you added the parts instead of taking them off" misconception
       collide with the correct step-1 answer. It caught two of my first four
       sets — 84 with parts summing to 42, and 96 with parts summing to 48;
     - the final answer differs from every given, from the leftover, and from
       the number of platforms;
     - planter counts stay plausible for a station forecourt.

   ▸ AN ISLAND ANSWER MAY NOT BE 1, 2 OR 5, AND THIS PROBLEM IS WHY THE RULE
     EXISTS. Set 2 first answered 5, and the sweep reported a leak: the
     Crossover Read's own standing copy says "on the five lines you read a
     problem once", and the leak scan catches spelled-out answers as readily as
     digits. It is right to. The alternative was a cleared exemption on a hit
     that will recur on every island problem that ever answers 5 — and worse, an
     exemption sitting over a screen whose whole job is to be numberless.

     So the CONTENT moved: set 2 shares between 5 platforms instead of 7, and
     answers 7. The words that appear in standing island copy and are therefore
     unusable as answers here: "one" and "two" (the station header reads "Two
     situations, joined" on every screen of every island ride) and "five" (the
     Crossover Read, the checklist, the map). Problems 4 to 7 must obey this
     too — it is not about this story.

   Values that may not appear in any pre-solve copy here, across the four sets:
   the leftovers 48, 35, 44, 36 and the answers 8, 7, 11, 9. */
MF.registerProblem({
  id: "cl-platform-planters",
  schemaVersion: 1,
  status: "published",
  title: "How many planters each platform gets",
  line: "partwhole",
  topics: ["two-line", "crossover", "remainder", "equal-groups", "transfer"],
  steps: 2,

  pair: {
    first: "partwhole",
    second: "groups",
    transfer: "how many planters are left after the footbridge and the booking hall",

    /* Sentence 5 is where the story stops accounting for pieces of the
       delivery and starts sharing something equally. The watering cans sit
       just before it and belong to neither part. */
    crossoverSentence: 5,
    crossoverWhy: "Everything before it is the delivery being accounted for — this many here, that many there, and the rest unspoken for. From there on the story stops dividing the delivery up by destination and starts sharing what is left into equal helpings.",
    firstWhy: "Named pieces coming out of a stated total, with the leftover never counted. That is a whole cut into parts, and here it is the last part that is missing.",
    secondWhy: "The same amount going to every platform, with the question asking how big each helping is. Nothing is being compared and nothing is left over.",
    readWhy: "A single story doing separate jobs: a delivery divided by destination first, then whatever survives that shared out equally. The earlier part works out the leftover, and the later part shares it — so nothing can be shared until the leftover is known."
  },

  unknownCar: "size",
  context: "planters",
  fadeLevel: "worked",
  stationRoles: ["reading"],
  hubEligible: false,
  hubGoodStrategies: [],
  hubStrategyNote: "Not hub-eligible: a hub offers a problem from a line the student has chosen, and Crossover Island is reached from its own map rather than from a line.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-16" },

  numberChecks: [
    ["n1", "-", "n2", "=", "afterBridge"],
    ["afterBridge", "-", "n3", "=", "rest"],
    ["rest", "+", "n3", "=", "afterBridge"],
    ["rest", "/", "n4", "=", "ans"],
    ["ans", "*", "n4", "=", "rest"],
    ["n2", "+", "n3", "=", "mSum"],
    ["rest", "*", "n4", "=", "mTimes"]
  ],

  numberSets: [
    { numbers: { n1: "90", n2: "27", n3: "15", n4: "6", n5: "5" },
      derived: { afterBridge: "63", rest: "48", ans: "8", mSum: "42", mTimes: "288" },
      estimate: { min: 4, max: 16 } },
    { numbers: { n1: "84", n2: "30", n3: "19", n4: "5", n5: "3" },
      derived: { afterBridge: "54", rest: "35", ans: "7", mSum: "49", mTimes: "175" },
      estimate: { min: 3, max: 14 } },
    { numbers: { n1: "96", n2: "34", n3: "18", n4: "4", n5: "5" },
      derived: { afterBridge: "62", rest: "44", ans: "11", mSum: "52", mTimes: "176" },
      estimate: { min: 5, max: 22 } },
    { numbers: { n1: "76", n2: "19", n3: "21", n4: "4", n5: "6" },
      derived: { afterBridge: "57", rest: "36", ans: "9", mSum: "40", mTimes: "144" },
      estimate: { min: 4, max: 18 } }
  ],

  problem: {
    /* No spelled-out numbers in the prose: the leaking screens are numberless
       and a number word is as good as a digit there. "One of them leaks" was
       the first draft of the watering cans sentence. */
    text: "The station has been given a delivery of flower planters for the spring. There are {{n1}} planters in the delivery. {{n2}} of them go along the footbridge. {{n3}} go in front of the booking hall. The gardener has {{n5}} watering cans and the smallest of them leaks. Whatever is left over is shared equally between the station's {{n4}} platforms. How many planters does each platform get?",
    sentences: [
      "The station has been given a delivery of flower planters for the spring.",
      "There are {{n1}} planters in the delivery.",
      "{{n2}} of them go along the footbridge.",
      "{{n3}} go in front of the booking hall.",
      "The gardener has {{n5}} watering cans and the smallest of them leaks.",
      "Whatever is left over is shared equally between the station's {{n4}} platforms.",
      "How many planters does each platform get?"
    ],
    questionSentenceIndex: 6,
    numbers: {
      n1: { value: "90", unit: "planters",      role: "whole",      spoken: "90" },
      n2: { value: "27", unit: "planters",      role: "part",       spoken: "27" },
      n3: { value: "15", unit: "planters",      role: "part",       spoken: "15" },
      n4: { value: "6",  unit: "platforms",     role: "groups",     spoken: "6" },
      n5: { value: "5",  unit: "watering cans", role: "distractor", spoken: "5" }
    },
    context: { setting: "railway station forecourt", requiresCulturalKnowledge: false }
  },

  /* This shipped with NO picture, because `partwhole-scenes.js` claims exactly
     one art — `seats` — and a planter delivery is not a trainful of seats. The
     island has its own library now. The planters run past both edges of the
     frame and overlap, which is the constraint the note here predicted: they
     ARE the counted quantity, so they must not be countable off the picture. */
  scene: {
    mode: "anim", art: "planters",
    caption: "Planters along a platform edge, running away past both ends, their flowers moving in the wind."
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A delivery of planters arrives. Some go to the footbridge and some to the booking hall, and whatever is left is shared out equally between the platforms. We want to know how many each platform ends up with.",
      platformCheck: {
        sentences: [1, 2, 3, 5],
        /* "The first three account for..." was the draft, and "three" is
           refused on a numberless screen exactly as a digit would be. */
        why: "The earlier ones account for the delivery — the total, and the pieces that go to named places. The last stops accounting for anything and shares what survives into equal helpings. Notice what is never stated: how many planters are left over, which is the amount being shared.",
        kinds: "Planters throughout, first as pieces of a delivery and then as equal helpings for the platforms."
      },

      questions: {
        fit: {
          ask: "Does a single kind of situation cover this whole story — the delivery being split up, and the sharing between platforms?",
          options: {
            onekind: { yes: "", no: "Good reading, and on every other line on this map it would be the right answer. Here the story does something and then does something different: it takes named pieces out of a total, and after that it shares what is left into equal helpings. Read it again and find the sentence where it changes." },
            stacked: { yes: "Pieces coming out of a stated total is a kind of situation. The same amount going to every platform is a different kind. This story accounts for the delivery first and shares afterwards — and what is left over from the accounting is the very thing that gets shared.", no: "" },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This story fits more than a single line, which is a different thing — and finding both parts is the whole job here." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n2", describe: "how many planters go along the footbridge", needed: true },
        { token: "n5", describe: "how many watering cans the gardener has", needed: false },
        { token: "n1", describe: "how many planters are in the delivery altogether", needed: true },
        { token: "n4", describe: "how many platforms the station has", needed: true },
        { token: "n3", describe: "how many planters go in front of the booking hall", needed: true }
      ],
      relationship: "The delivery is the whole, and the footbridge and booking hall planters are pieces coming out of it — so those three belong together and what is left is the piece nobody states. The platforms belong to a different pairing entirely: they are how many equal helpings that leftover has to make. The watering cans belong to nothing.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many planters each single platform gets.",
      commonMisreading: "Working out how many planters are left over and stopping there, which answers how many are to be shared rather than how many each platform receives.",
      options: [
        { text: "How many planters are left after the footbridge and the booking hall",
          why: "You will need that, and nothing in the story states it — but read the last sentence again. It asks what EACH platform gets, which is a helping rather than the pile being shared." },
        { text: "How many planters each platform gets", correct: true,
          why: "The size of one helping, once the leftover has been shared out. That is the only thing here that nothing states and nothing else stands in for." },
        { text: "How many planters go along the footbridge",
          why: "Handed to you outright in its own sentence. It is one of the pieces coming out of the delivery, not anything to do with the platforms." },
        { text: "How many platforms the station has",
          why: "Also given. It is how many helpings the leftover must make, not the size of a helping." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "This story starts on the Part–Whole Loop — a stated delivery with named pieces coming out of it and the last piece left unspoken for. It does not stay there. Once the leftover is known, sharing it equally between the platforms is the same amount repeated, and that is Equal Groups Express. Two lines, in that order, joined at the leftover that neither of them states.",
    distractors: [
      { line: "change",    whyWrong: "Nothing ends up different from how it started. Planters are allocated to places rather than changed into anything — moving an amount to a destination is not an event happening to it." },
      { line: "compare",   whyWrong: "Nothing is measured against anything. The footbridge and the booking hall both get planters, but the story never asks which gets more or by how much — they are pieces of the same delivery, not amounts held up against each other." },
      { line: "ratio",     whyWrong: "Nothing here holds at any size. The pieces are fixed counts of planters, not a relationship — doubling the delivery would not double what the footbridge gets, because the story states that figure outright." },
      { line: "groups",    whyWrong: "Half right, and worth saying so: the second half of this story really is Equal Groups. But the story does not open there. Before any sharing happens, a delivery is accounted for piece by piece, and it is what survives that accounting that gets shared." }
    ],
    unknownCarPrompt: "Which piece is this problem not telling you?",
    unknownCarOptions: [
      "how many planters each platform gets",
      "how many planters are in the delivery",
      "how many platforms the station has"
    ],
    unknownCarAnswer: "how many planters each platform gets",
    unknownCarWhy: "The delivery is counted, both named destinations are counted, and the platforms are counted. The size of one platform's helping is not — and neither is the leftover it is shared from, which is why this one takes two moves."
  },

  signalBox: {
    /* THE FIRST HALF'S PICTURE IS THE MODEL YARD, which is what made this
       problem worth building third: every island problem so far has had a
       schema model for its first half, and this one has the fallback. It is
       drawn from `barModel` exactly as any Part–Whole problem on the mainland
       is, through `pair-model.js`'s proxy.

       `segmentValue` is deliberately absent. The yard hides a per-part value
       that the problem does not GIVE — the rule `math-reviewer` holds it to —
       and here every part is a different size, so there is no per-part value to
       show in the first place. What the yard shows instead is the whole, which
       is printed in the story. */
    barModel: {
      title: "The Model Yard",
      heading: "One delivery, cut into pieces",
      bars: [
        {
          label: "The whole delivery",
          knownTotal: "{{n1}} planters",
          unit: "planters",
          segments: 6,
          marked: 2,
          markedLabel: "the planters that go to named places",
          restLabel: "what is left over"
        }
      ],
      a11yDescription: "A single bar standing for the whole delivery, split into equal pieces. Two of them are marked for the planters that go to named places, and the rest of the bar is what is left over — which the story never counts."
    },

    /* THE CROSSOVER. The second picture is an Equal Groups table with the
       helping unknown and the pile unknown too, since the pile IS the transfer.
       Only the number of platforms is stated. */
    crossover: {
      heading: "What crosses over?",
      prompt: "The first picture is finished, and the story is not. Something from that picture is the number the rest of this problem needs. Which one?",
      cellLabel: "the planters left over",
      options: [
        { text: "The part of the bar nobody counted", correct: true,
          why: "The stretch of bar left after the named pieces is the leftover, and it is the only thing the first picture produced. The second half shares it out — so it is the pile being shared, and there is nothing to share until it is known." },
        { text: "The whole delivery",
          why: "Given to you in the story, so the first picture did not produce it. And it is not what gets shared: the named pieces have already gone to the footbridge and the booking hall before any sharing starts." },
        { text: "The planters that go to the footbridge",
          why: "Also given, in its own sentence. It is one of the pieces coming out of the delivery — it is part of what has to be taken OFF before the leftover appears." },
        { text: "The number of platforms",
          why: "That belongs to the second half already — printed in the story and waiting in the table below. The crossover is what the FIRST half hands over." }
      ],
      settledSay: "That is the join. The first picture ends with the part nobody counted, and the second picture starts by sharing exactly that.",
      second: {
        title: "The second picture",
        heading: "A pile, waiting to be known",
        givenHeading: "What you were told",
        targetHeading: "What you need",
        rows: [
          { label: "Platforms",         key: "groups",   given: "{{n4}}" },
          { label: "Each platform gets", key: "answer",  given: "not stated" },
          { label: "The pile shared",   key: "transfer", given: "not stated" }
        ],
        waiting: "Only the number of platforms is known here. The pile is the leftover the first picture found, and the helping is what you are being asked for — so two of these three cells stay question marks until the first half is done. Sharing cannot start before there is something to share.",
        a11yDescription: "A table of three rows: platforms, what each platform gets, and the pile being shared. Only the platform count is stated. The right column is empty on every row, and the bottom cell is labelled as the leftover once you have named it. Nothing in this picture is calculated."
      }
    },

    estimate: {
      prompt: "Before calculating — roughly how many planters do you think each platform gets?",
      reasonableMin: 4,
      reasonableMax: 16,
      modelReasoning: "Round the delivery and the two named pieces to the nearest ten, take the pieces off, and you have roughly what is left. Then share that between the platforms. Rough numbers are enough — you want the right sort of size, not the answer.",
      unit: "planters"
    }
  },

  /* The third disguise for the same failure. On `cl-signal-delay` the halfway
     number is in the wrong units; on `cl-season-tickets` it is in the right
     units and the wrong scope. Here it is in the right units AND about the
     right things — the leftover really is a count of planters at this station —
     and the only thing separating it from the answer is the word "each". */
  signalFailure: {
    trigger: "halfway",
    prompt: "You worked out how many planters were left over and it was right. Why was it not the answer?",
    why: "Because that is the whole pile waiting to be shared, and the question asked what EACH platform gets. Both numbers are planters, and both are about this station, so nothing looks wrong about it — the only thing that separates them is one word in the question. This is the third stop on this island where the halfway number is a real, correct number that answers a question nobody asked."
  },

  engineRoom: {
    fadeLevel: "worked",
    steps: [
      {
        id: "s1",
        prompt: "First, how many planters are left over once the footbridge and the booking hall have taken theirs?",
        answer: { exact: "{{rest}}", unit: "planters", acceptedForms: ["{{rest}}", "{{rest}} planters"], preferredForm: "{{rest}}" },
        workedExplanation: "The delivery is {{n1}} planters, and two named pieces come out of it: {{n2}} to the footbridge and {{n3}} to the booking hall. Take both off and what remains is the leftover: {{n1}} − {{n2}} − {{n3}} = {{rest}} planters. Check it forwards — {{rest}} + {{n2}} + {{n3}} = {{n1}}, the delivery exactly.",
        hints: [
          { rung: 1, text: "The delivery is the whole. Two pieces of it go to named places. What is the name for the rest of a whole once you have taken the named pieces out?" },
          { rung: 2, text: "Look at the picture from the Plan screen. The marked pieces are the ones with destinations. The leftover is the part of the bar nobody has claimed." },
          { rung: 3, text: "Take both named pieces off the delivery: {{n1}} − {{n2}} − {{n3}} = ___" },
          { rung: 4, text: "{{n1}} − {{n2}} − {{n3}} = {{rest}}. There are {{rest}} planters left to share." }
        ],
        misconceptions: [
          { response: "{{mSum}}", diagnosis: "You added the two named pieces together. That is how many planters have destinations already — a useful number, and the opposite of the one you want. The leftover is what is NOT in that pile, so those pieces come OFF the delivery rather than being added up.", tag: "added-the-parts" },
          { response: "{{afterBridge}}", diagnosis: "You took the footbridge planters off and stopped. There are two named pieces coming out of this delivery, not one — the booking hall's have to come off as well before what is left is really left over.", tag: "took-off-one-part" },
          { response: "{{n1}}", diagnosis: "That is the whole delivery, which the story handed you. Some of it has already gone to the footbridge and the booking hall, so the leftover has to come out smaller than {{n1}}.", tag: "gave-back-the-whole" }
        ]
      },
      {
        id: "s2",
        prompt: "There are {{rest}} planters left over, and they are shared equally between the station's {{n4}} platforms. How many does each platform get?",
        answer: { exact: "{{ans}}", unit: "planters", acceptedForms: ["{{ans}}", "{{ans}} planters"], preferredForm: "{{ans}}" },
        workedExplanation: "{{rest}} planters make {{n4}} equal helpings, so each helping is {{rest}} ÷ {{n4}} = {{ans}} planters. Check it forwards — {{ans}} × {{n4}} = {{rest}}, the whole leftover pile shared out with none over.",
        hints: [
          { rung: 1, text: "Every platform gets the same number. So the leftover pile has to make that many equal helpings." },
          { rung: 2, text: "You know the size of the pile and how many helpings it has to make. Which of those two do you divide by?" },
          { rung: 3, text: "{{rest}} ÷ {{n4}} = ___" },
          { rung: 4, text: "{{rest}} ÷ {{n4}} = {{ans}}. Each platform gets {{ans}} planters." }
        ],
        misconceptions: [
          { response: "{{rest}}", diagnosis: "That is the number you just worked out, and it was right — but it is the whole pile waiting to be shared, not one platform's share. The question asked what EACH platform gets. Both numbers are planters at this station, so the only thing separating them is that one word.", tag: "stopped-at-the-transfer" },
          { response: "{{mTimes}}", diagnosis: "You multiplied the pile by the platforms. That would be the number of planters you would need if every platform got the whole leftover pile to itself — far more than ever arrived at the station. Sharing makes each helping smaller than the pile, so this is a division.", tag: "multiplied-not-shared" },
          { response: "{{n4}}", diagnosis: "That is how many platforms there are, which the story gave you. It is the number of helpings, not the size of one.", tag: "gave-back-the-groups" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "planters", acceptedForms: ["{{ans}}", "{{ans}} planters"], preferredForm: "{{ans}}" },
    questionCheck: "The question asked what EACH platform gets. If your answer is {{rest}}, that is the whole pile that was left to share — the middle of this problem rather than the end of it.",
    unitsCheck: "planters",
    reasonablenessCheck: "{{ans}} planters on each platform. Check it backwards: {{ans}} × {{n4}} = {{rest}}, the whole leftover shared out with none over — and {{rest}} + {{n2}} + {{n3}} = {{n1}}, the delivery exactly. Both halves check out.",
    reasonablenessFailExample: "If you had shared the WHOLE delivery between the platforms instead of the leftover, every platform would get more planters than the station actually had spare — the footbridge and booking hall planters would have to be counted twice.",
    connection: "Three stops on this island now, and the halfway number has been a different shape each time: something to scale, a whole to divide up, and now a leftover to share. What has not changed is that it was correct, and that it answered a question nobody asked.",
    fadeLevel: "worked"
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-16",
                 notes: "Four sets, each re-derived from the story and verified both ways: 90-27-15=48, 48/6=8 (8x6=48, 48+27+15=90); 84-30-19=35, 35/7=5; 96-34-18=44, 44/4=11; 76-19-21=36, 36/4=9. Every leftover divides exactly by the platform count. Two of my first four sets were rejected because the leftover equalled the two named parts added together, which would have made the added-the-parts misconception collide with the correct step-1 answer - that happens whenever the delivery is exactly twice the parts. Within every set the final answer differs from all five givens, from the leftover, and from all three of that step's misconception values." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No scene art either - see the note where `scene` would be." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-16",
                 notes: "Part-Whole -> Equal Groups, island problem 3, and the third distinct shape of transfer in three problems: scaled, divided, now left over. Deliberately the first island problem whose first half is not a comparison, which is what made it the one to build third - it is the case that tests whether the crossover machinery is general, and it found a real gap in pair-model.js (the Model Yard was not reachable as a first picture). The halfway number is now in the right units AND about the right things, so only the word 'each' separates it from the answer. read3's distractor is placed first. The `fit` question is tailored; the other four are left abstract." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED." },
    oversight: { status: "provisional", date: "2026-08-16",
                 notes: "PROVISIONAL. Author and reviewer are the same (VERIFICATION.md 16). Third of seven island problems. This one changed the engine, so unlike cl-season-tickets it is not purely a content addition - the pair-model fix it forced should be re-checked against problems 1 and 2, both of which still use a schema model for their first half." }
  }
});
