/* The Change Line · PERCENT SURFACE · REVERSE PERCENT · start unknown ·
   barriers · partial · SIGNAL BOX

   THE KEYSTONE OF THE PERCENT CARD, and it is the `ch-water-tank` of percent.
   ROADMAP.md §3 names it in as many words: the intuitive move — take the stated
   percentage off the number you were handed — is wrong, and it fails SILENTLY,
   with a plausible-looking answer and no arithmetic slip to notice. Set 1 says
   Saturdays are busier by 20% and last Saturday brought 660 through the gates.
   Taking 20% off 660 gives 528, which looks like an answer. It is not one, and
   nothing about it looks wrong.

   WHY IT IS A CHANGE PROBLEM AND NOT A PERCENT ONE. `surface: "percent"` is not
   a line and does not replace one. Structurally this is a single amount at two
   moments with an event between them — the definition of the Change Line — and
   its Platform Check answers are the Change Line's, untouched. The percentage
   is how the size of the change is WRITTEN, which is a fact about the number
   and not about the story. That is the whole hybrid decision from ROADMAP.md
   §3: percent gets its own picture and its own front door, and the student
   still has to find the structure underneath it.

   THE OPEN ITEM THIS CLOSES, AND WHY IT IS NOW HONEST. HANDOFF §0.2 records
   percent CHANGE as deferred, on the grounds that its `fit` answer would have
   to be "two lines stacked" — a verdict branch that is unbuilt. That objection
   was true of percent change on the COMPARE line, where the station header says
   Compare and the story is a Change. Here the header says Change and the story
   is a Change, so `fit` answers `onekind` honestly and nothing is bent. The
   `stacked` option is still the best wrong answer on that screen and is
   answered at length rather than dismissed.

   TWO PICTURES OF ONE STORY, DELIBERATELY.
     Plan       the double number line — the percent SURFACE. It asks which
                Saturday is the hundred per cent, and shows the amount you were
                given sitting PAST it, which is the whole reason 20% of 660 is
                the wrong piece.
     Test Track the bar, cut into tenths of the quieter Saturday — the METHOD.
                Different question, different representation, and the second
                honest route through that this site exists to offer.
   Neither computes anything. What a piece is worth is the Engine Room's.

   WHY NOT THE `drive` TEST TRACK, WHICH THIS LINE OWNS. `drive` demonstrates
   which DIRECTION you travel, and direction is not where this problem breaks
   people: a student who takes 20% off 660 has the direction right and the
   referent wrong. A Test Track showing the move they already make correctly and
   skipping the one they get wrong would be a screen that teaches nothing
   (VERIFICATION.md §27 — ask what this screen teaches that the last one did
   not, and also whether it teaches what the problem is actually about).

   FOUR NUMBER SETS. Constraints, and three of them are structural rather than
   arithmetic:
     - the rise must be a whole number of tens, so a tenth of the quieter
       Saturday divides both amounts and the bar cuts on a boundary;
     - last Saturday must divide by that many tenths, or a piece is a fraction
       of a person;
     - the rise may not be 10%, because then a tenth of the old Saturday IS the
       rise and two different quantities on the screen carry the same number;
     - the rise may not be 50%, because taking half off leaves half, so the trap
       value and the size-of-the-rise-on-the-wrong-crowd value collide and one
       misconception would diagnose a mistake the student did not make (§23);
     - crowds stay in the hundreds, which is a real Saturday at a small station.

   The trap can never accidentally BE the answer, and that is provable rather
   than lucky: the trap is N(1 − r) and the answer is N/(1 + r), and those are
   equal only when r is nought. Verified per set — the answer, the rise put back
   on, and the trap:
     20% · 660 now · 12 tenths · piece 55 · was 550   (550 + 110 = 660)   trap 528
     40% · 980 now · 14 tenths · piece 70 · was 700   (700 + 280 = 980)   trap 588
     30% · 520 now · 13 tenths · piece 40 · was 400   (400 + 120 = 520)   trap 364
     60% · 800 now · 16 tenths · piece 50 · was 500   (500 + 300 = 800)   trap 320 */
MF.registerProblem({
  id: "ch-barrier-count",
  schemaVersion: 1,
  status: "published",
  title: "How busy a Saturday used to be",
  line: "change",
  topics: ["percent", "reverse-percent", "start-unknown", "two-step"],
  steps: 2,

  /* The flag, not a line. `model.js` asks PercentModel FIRST, so this problem
     draws the double number line instead of the Change Train. The Platform
     Check, the Ticket Booth and the map all still see a Change problem. */
  surface: "percent",

  unknownCar: "start",
  context: "barriers",
  fadeLevel: "partial",
  stationRoles: ["signalbox"],
  hubEligible: true,
  hubGoodStrategies: ["signalbox", "drafting"],
  hubStrategyNote: "The story hands you a percentage and a crowd, and the obvious thing to do with them is the wrong thing. Nothing but stopping to ask what the percentage is a percentage OF will get a student to the right move, which makes this the sharpest signal-spotting problem on the site.",

  provenance: { source: "seed", author: "claude-session", addedOn: "2026-08-09" },

  numberChecks: [
    ["n1", "+", "100", "=", "newPct"],
    ["newPct", "/", "10", "=", "sections"],
    ["n2", "/", "sections", "=", "piece"],
    ["piece", "*", "10", "=", "ans"],
    ["rate", "*", "100", "=", "n1"],
    ["ans", "*", "rate", "=", "trueRise"],
    ["ans", "+", "trueRise", "=", "n2"],
    ["ans", "*", "mult", "=", "n2"],
    ["n2", "*", "rate", "=", "riseOnNew"],
    ["n2", "-", "riseOnNew", "=", "mOff"],
    ["n2", "+", "riseOnNew", "=", "mAdd"],
    ["n2", "-", "n1", "=", "mCount"],
    ["n2", "/", "10", "=", "mTenths"],
    ["n1", "/", "10", "=", "riseTenths"]
  ],

  numberSets: [
    { numbers: { n1: "20", n2: "660", n3: "8" },
      derived: { rate: "0.2", mult: "1.2", newPct: "120", sections: "12", riseTenths: "2",
                 piece: "55", ans: "550", trueRise: "110", riseOnNew: "132",
                 mOff: "528", mAdd: "792", mCount: "640", mTenths: "66" },
      estimate: { min: 480, max: 620 } },
    { numbers: { n1: "40", n2: "980", n3: "6" },
      derived: { rate: "0.4", mult: "1.4", newPct: "140", sections: "14", riseTenths: "4",
                 piece: "70", ans: "700", trueRise: "280", riseOnNew: "392",
                 mOff: "588", mAdd: "1372", mCount: "940", mTenths: "98" },
      estimate: { min: 620, max: 800 } },
    { numbers: { n1: "30", n2: "520", n3: "9" },
      derived: { rate: "0.3", mult: "1.3", newPct: "130", sections: "13", riseTenths: "3",
                 piece: "40", ans: "400", trueRise: "120", riseOnNew: "156",
                 mOff: "364", mAdd: "676", mCount: "490", mTenths: "52" },
      estimate: { min: 340, max: 470 } },
    { numbers: { n1: "60", n2: "800", n3: "7" },
      derived: { rate: "0.6", mult: "1.6", newPct: "160", sections: "16", riseTenths: "6",
                 piece: "50", ans: "500", trueRise: "300", riseOnNew: "480",
                 mOff: "320", mAdd: "1280", mCount: "740", mTenths: "80" },
      estimate: { min: 420, max: 580 } }
  ],

  problem: {
    text: "The ticket barriers at Thorne Bridge clack and sigh from first light to last, and a bored inspector in a damp overcoat watches everybody shove through. Saturdays used to be quiet enough that he could read his paper between trains. Since the new footbridge opened, Saturdays are busier by {{n1}}%. Last Saturday {{n2}} passengers came through the barriers. The station has {{n3}} draughty platforms. How many passengers came through on a Saturday before the footbridge opened?",
    sentences: [
      "The ticket barriers at Thorne Bridge clack and sigh from first light to last, and a bored inspector in a damp overcoat watches everybody shove through.",
      "Saturdays used to be quiet enough that he could read his paper between trains.",
      "Since the new footbridge opened, Saturdays are busier by {{n1}}%.",
      "Last Saturday {{n2}} passengers came through the barriers.",
      "The station has {{n3}} draughty platforms.",
      "How many passengers came through on a Saturday before the footbridge opened?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "20",  unit: "per cent",  role: "percent",    spoken: "20 per cent" },
      n2: { value: "660", unit: "passengers", role: "result",    spoken: "660" },
      n3: { value: "8",   unit: "platforms",  role: "distractor", spoken: "8" }
    },
    context: { setting: "station ticket barriers", requiresCulturalKnowledge: false }
  },

  /* THE PICTURE MAY NOT LET YOU COUNT PEOPLE, and on this problem the people
     ARE the quantity. `change-scenes.js` measures the overlap rather than
     asserting it: figures at a pitch of twelve with coats twenty wide and heads
     fourteen wide, running off both edges of the frame, so there is no first
     passenger and no last one and nothing separate to tally.

     And nothing on it is a scale. A gauge, a bar or a marked platform edge
     would be a picture of how much busier this Saturday is, which is the thing
     the Engine Room asks for. What is drawn is the DIRECTION of the change,
     which the story states outright, and nothing about its size. */
  scene: {
    mode: "anim", art: "barriers",
    caption: "The gateline at Thorne Bridge on a Saturday: paddles clacking open and shut, and a crowd pressing through them and away past both edges of the picture.",
    authored: "generated"
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "A station's Saturdays used to be quieter. A new footbridge opened, and since then Saturdays are busier by a certain percentage. We are told how many came through last Saturday, and we want to know how many came through on a Saturday before the footbridge.",
      /* The `why` deliberately does NOT name the missing amount. ch-water-tank
         shipped a Platform Check that said "nothing says what the tank held to
         start with, which is exactly what you are being asked for" — verbatim
         the Ticket Booth's gated answer, two screens early. Say the SHAPE. */
      platformCheck: {
        sentences: [2, 3],
        why: "Between them those sentences give the size of the rise and what the gateline came to last Saturday. A single amount, at a before and an after, with something in between that moved it — that is the shape of it.",
        kinds: "Everything counted here is a passenger through the barriers."
      },

      /* Per-problem Platform Check questions. The shared ones ask in the
         abstract, so their answers are constant along a line and a student can
         take them off the station header without reading; these name this
         story's own quantities. `kinds` uses the DISTRACTOR — the platforms —
         as the thing to rule out, which turns an irrelevant number into the
         teaching. No digits and no number words: this screen is numberless. */
      questions: {
        kinds: {
          ask: "This story counts passengers through the barriers, and it also counts the station's platforms. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The platforms are scenery. Everything the question is about is passengers, counted at the same gateline.",
                         no:  "That would mean the passengers and the platforms were pinned to each other &mdash; that a busier Saturday grew the station another platform. Nothing in the story ties them." },
            different: { yes: "", no: "That would mean the crowd scaled with the platforms. How many platforms the station has says nothing about how many people shove through the gates." }
          }
        },
        moments: {
          ask: "The Saturdays before the footbridge opened, and the Saturdays since. Does any amount end up different from how it started?",
          options: {
            changed: { yes: "The footbridge opened and Saturdays got busier. The gateline before it and the gateline after it are not the same amount, and that gap is the whole problem.",
                       no:  "" },
            steady:  { yes: "", no: "That would mean the same crowd every Saturday, before the footbridge and since. But the story says Saturdays are busier now than they used to be, which is an amount ending up different from how it started." }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just the Saturday crowd, or the crowd and something else being held up against it?",
          options: {
            single:   { yes: "A single crowd at a single gateline, described at different moments. Everything else in the story is about that crowd.", no: "" },
            separate: { yes: "", no: "The closest call on this screen, because a percentage does sound like a comparison. It is comparing &mdash; but it is comparing the crowd with ITSELF, earlier. Separate things would be a second gateline, or a rival station, standing alongside it and counted at the same time." },
            paired:   { yes: "", no: "That would mean passengers pinned to something else, so that changing either dragged the other along. The footbridge changed the crowd and nothing else." }
          }
        },
        shape: {
          ask: "Is the crowd being shared out into parts, or is the same amount arriving over and over, or neither?",
          options: {
            cut:     { yes: "", no: "Worth asking, because a percentage sounds like a slice of something. But a share is part of a named whole that the pieces add back up to, and nothing here is being carved up or handed out." },
            repeat:  { yes: "", no: "That would mean the same amount arriving again and again, with the question counting how many. Each Saturday is counted through the gates and that is that." },
            neither: { yes: "Nothing is cut into shares and nothing repeats. A crowd came through the gates, and now a bigger crowd does.", no: "" }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the quiet Saturdays, the footbridge, and the crowds since?",
          options: {
            onekind: { yes: "A starting amount, something happening to it, and a finishing amount. The same kind of situation the whole way through &mdash; the size of the change just happens to be given in per cent.", no: "" },
            stacked: { yes: "", no: "The best wrong answer on this screen, and worth taking seriously: per cent does feel like a whole extra idea sitting on top of the change. But a percentage is a way of WRITING how big the change was, not a second situation. Say the same rise in passengers instead and nothing about the shape of the story moves." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. This is a crowd with a before and an after, which sits squarely on the Change Line whatever units the change is written in." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      /* The distractor sits MID-LIST. Read 2 does not shuffle, and "never pick
         the last one" scored without reading on fourteen of the sixteen older
         problems (HANDOFF §0.2). */
      quantities: [
        { token: "n1", describe: "how much busier Saturdays are, written as a percentage", needed: true },
        { token: "n3", describe: "how many platforms the station has", needed: false },
        { token: "n2", describe: "how many passengers came through last Saturday", needed: true }
      ],
      relationship: "One of these is a count of people and the other is not a count of anything — it is a percentage, and a percentage is always a percentage OF something. Here it is of the Saturdays the station used to have, because that is what \"busier\" is busier than. The platforms are scenery and let nobody through by themselves.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "How many passengers came through on a Saturday before the footbridge opened.",
      commonMisreading: "Reading \"busier by {{n1}}%\" and taking {{n1}} per cent straight off the {{n2}} — as though the percentage were measured against last Saturday rather than against the Saturdays before it.",
      options: [
        { text: "How many passengers came through the barriers last Saturday",
          why: "You were told that outright. A number the story hands you cannot be the thing it is asking you to find." },
        { text: "How much busier Saturdays are now, as a percentage",
          why: "Also given. That is the size of the change, not an amount of people." },
        { text: "How many came through on a Saturday before the footbridge", correct: true,
          why: "The amount at the START, before the footbridge changed anything. It is the only one of the three the story never states — and it is smaller than the {{n2}}, not bigger." },
        { text: "How many more passengers come through now than used to before it opened",
          why: "Closer than it looks, because you could get to the answer through it. But it is the size of the rise, and the question names the quieter Saturday itself." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "change",
    /* The Ticket Booth grades WHICH CAR IS MISSING; this line of copy is where
       the surface-versus-structure lesson lands, because it is rendered above
       the question with the line's own name and form beside it. ROADMAP §3
       wants the booth to ask which line is hiding under the percent as a
       QUESTION; that question is not built (see the review notes). */
    whyCorrect: "A single gateline at two moments, with a footbridge opening in between. A before, an event, an after — and here it is the BEFORE that is missing, which is the hardest shape on this line. The change is written in per cent, which changes the arithmetic and not the line.",
    distractors: [
      { line: "compare",   whyWrong: "The strongest case against, because per cent is how you usually compare things and \"busier\" sounds like a comparison. It is one — but the crowd is being compared with ITSELF at an earlier moment, and that is a before and an after, not two amounts sitting side by side. A compare needs both quantities in existence at once." },
      { line: "partwhole", whyWrong: "A percentage sounds like a slice, and Part–Whole is where slices live. But it needs a named whole that the pieces add back up to, and last Saturday's crowd is not made of parts the story hands you. It is one amount that used to be a different amount." },
      { line: "ratio",     whyWrong: "Tempting, because a percentage does hold at any size — that is what makes it a percentage. But a ratio pins two DIFFERENT kinds of thing together so that changing one drags the other along, like miles and hours. Everything here is passengers, and nothing is being scaled." },
      { line: "groups",    whyWrong: "Nothing repeats. Equal Groups needs the same amount over and over with the question counting how many, and there is a single Saturday's crowd here, described before and after." }
    ],
    unknownCar: "start",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: [
      "how much busier Saturdays are now",
      "what a Saturday came to before the footbridge",
      "what the gateline came to last Saturday"
    ],
    unknownCarAnswer: "what a Saturday came to before the footbridge",
    unknownCarWhy: "The rise is stated and so is last Saturday. What a Saturday used to come to is the car nothing in the story gives you — and it is the car the rise is measured from, which is what makes this one awkward.",
    supportAfter3Attempts: {
      narrowTo: ["change", "compare"],
      discriminator: "Ask whether the two amounts ever existed at the same moment. Two amounts you compare are both there at once. Here the quieter Saturday and the busier one are the same gateline before and after a footbridge, which makes it Change."
    }
  },

  signalBox: {
    /* THE PERCENT PICTURE. Drawn instead of the Change Train, because
       `surface: "percent"` makes model.js reach PercentModel first.

       REVERSE PERCENT IS `unknownIs: "whole"`, and this is the shape the model
       was built for. The quieter Saturday is the hundred per cent — it is what
       "busier" is busier THAN — so it anchors the middle of the line and
       carries the question mark, while the amount you were handed sits PAST it
       at {{newPct}} per cent. That is the whole argument of this problem, drawn:
       the number you were given is not the hundred, so a percentage of it is a
       percentage of the wrong thing.

       `percentAt` rather than `percentToken`, because the mark is at {{newPct}}
       and the story says {{n1}}. See the note in percent-model.js — a mark at
       {{n1}} would draw a picture saying the crowd shrank. It is authored as a
       token filled from the number set, never as a literal, because the rise
       varies per set (VERIFICATION.md §33).

       Nothing on this screen is worked out. What the mark is worth in
       passengers is stated; what the hundred per cent is worth is the Engine
       Room's, and the model refuses to compute it. */
    percentLine: {
      title: "Per hundred",
      heading: "Which Saturday is the whole hundred per cent?",
      prompt: "The rise is measured from one of these two Saturdays. Tap the one it is measured FROM.",
      partToken: "n2",
      percentAt: "{{newPct}}",
      unknownIs: "whole",
      base: "before",
      questionLabel: "how many came through on a Saturday before the footbridge",
      settledLabel: "so the question is",
      choices: [
        { key: "now",    label: "Last Saturday, since the footbridge", said: "{{n2}}" },
        { key: "before", label: "A Saturday before the footbridge",    said: "?" }
      ],
      why: "\"Saturdays are busier by {{n1}}%\" — busier than they USED to be, so the quieter Saturday is what the rise is measured from. That makes it the whole hundred per cent, and last Saturday runs past it to {{newPct}} per cent. Look at the line: the {{n2}} you were given is not sitting at the hundred.",
      whyWrong: {
        now: "Last Saturday is the amount being measured, not the amount measured FROM. It is the busier of the two — the rise is already inside it — so it lands past the hundred per cent rather than on it. Ask what the story says Saturdays are busier than."
      },
      a11yDescription: "A double number line. Along the bottom: nought per cent at the left, a hundred per cent part way along, and a mark at {{newPct}} per cent at the right-hand end. Along the top the same three points counted in passengers: nought, a question mark at the hundred per cent, and {{n2}} passengers out at the {{newPct}} per cent mark. The two lines share one axis, so the amount you were given sits PAST the hundred per cent, and the hundred per cent — a Saturday before the footbridge — is the point with no number on it.",
      settledSay: "Whatever the rise is measured FROM is the whole hundred per cent."
    },

    estimate: {
      prompt: "Before calculating — roughly how many passengers do you think came through on a Saturday before the footbridge?",
      reasonableMin: 480,
      reasonableMax: 620,
      modelReasoning: "Saturdays are busier now, so the quieter one must be LESS than the {{n2}} you were given. That is the whole trap on this problem: the story sounds like adding and the answer is smaller than the number in front of you. Then ask how much smaller — a rise of {{n1}} per cent is a decent chunk but nowhere near the whole crowd.",
      unit: "passengers"
    },

    /* THE TEST TRACK, and it is a `section` rather than the `drive` this line
       usually takes. The reason is in the header: `drive` teaches direction,
       and a student who takes {{n1}}% off {{n2}} has the direction right. The
       method is what breaks here, so the method is what gets demonstrated.

       The move: cut last Saturday's crowd into pieces each worth a tenth of the
       quieter Saturday. Ten of those pieces are the hundred per cent, and the
       rest are the rise. It computes nothing — the counts on screen are how
       many pieces and how many of them, which is exactly what the percentages
       already say, and what a piece is WORTH is never asked here.

       The worked example is a plain storyless bar cut differently from the
       student's ({{sections}} against six, ten held against four), so the two
       questions underneath cannot be answered by copying what is on screen —
       and neither of its numbers is an answer in any set (VERIFICATION.md §26). */
    testTrack: {
      kind: "section",
      title: "The Test Track",
      heading: "Cutting a whole that is worth more than a hundred per cent",
      intro: "A rise measures itself against where the story STARTED, never against where it finished. So when the start is the thing you are missing, the amount you were handed is worth more than a full hundred per cent — and the way in is to cut it into pieces small enough that both amounts land on a boundary. Watch one first.",
      worked: {
        label: "Any whole at all — a bar, a bag, a busy Saturday.",
        button: "Show me",
        parts: 6, take: 4,
        sayCut: "Cut the whole into equal pieces. Six of them here, chosen so that both amounts in the story land on a boundary rather than halfway across a piece.",
        sayTake: "Then hold the pieces that make up the amount you are after — four of the six. Nothing has been calculated. The bar has been cut and part of it marked, and that is everything this screen ever does."
      },
      yours: {
        wholeLabel: "Your whole: last Saturday's crowd. It is worth more than a full hundred per cent, because the rise is measured from the quieter Saturday and not from this one.",
        q1: "Each piece is going to be a tenth of a quieter Saturday, and last Saturday is {{newPct}} per cent of one. So how many equal pieces does your bar cut into?",
        options1: [
          { text: "{{sections}}", correct: true,
            why: "A tenth of the quieter Saturday is ten per cent, and last Saturday is {{newPct}} per cent of it — so it takes {{sections}} of those tenths to make last Saturday. The bar runs past a hundred per cent because the crowd grew." },
          { text: "10",
            why: "Ten pieces would be the QUIETER Saturday, the full hundred per cent. Your bar is last Saturday, which is bigger than that, so it needs more pieces than ten." },
          { text: "{{n1}}",
            why: "That is the size of the rise, not a count of pieces. It tells you how much was added and it still has to be turned into a number of tenths before it counts anything at all." }
        ],
        settled1: "{{sections}} equal pieces. Each one is a tenth of the Saturday you are looking for.",
        q2: "So how many of those pieces make up a Saturday BEFORE the footbridge — the hundred per cent?",
        options2: [
          { text: "10", correct: true,
            why: "A hundred per cent is ten tenths, always, whatever the rise happened to be. The pieces past the tenth one are the rise, sitting on the end." },
          { text: "{{sections}}",
            why: "That is the whole bar, which is last Saturday — the amount you were already given. The Saturday you want is shorter than it, or the footbridge changed nothing." },
          { text: "{{riseTenths}}",
            why: "That is the RISE counted in tenths, the piece on the end of the bar. The hundred per cent is everything that is left when you take that part off." }
        ],
        settled2: "Ten of the {{sections}} pieces are a Saturday before the footbridge. The rest of the bar is the rise."
      },
      law: "A rise is measured from where the story started. So the finish is worth more than a hundred per cent, and the hundred per cent is the thing you are looking for.",
      bridge: "The bar is cut and the hundred per cent is marked out. What a single piece is worth in passengers is the Engine Room's question.",
      a11yDescription: "A demonstration about cutting a whole into equal pieces, using no arithmetic. First a plain bar stands for any whole at all. It is cut into six equal pieces and four of them are shaded, showing the part of it that was wanted. Then the same is done to your own story: last Saturday's crowd is {{newPct}} per cent of a Saturday before the footbridge, so the bar cuts into {{sections}} equal pieces, each piece a tenth of that quieter Saturday, and ten of the {{sections}} are shaded — the hundred per cent you are looking for. The pieces past the tenth are the rise. Nothing is worked out here; what a single piece is worth in passengers is the next question, in the Engine Room."
    }
  },

  /* The Signal Failure. Written to teach without stating either step answer or
     the final one, because at the time nothing rendered this field and whichever
     screen eventually did might have sat before the Engine Room.

     That question is now settled: it renders at the Arrivals Board (Phase 4b),
     after the answer. Of the nine authored Signal Failures this was the only
     one that would have been safe on the Plan screen — every other one gives
     away the operation, the direction or a digit. Keep the property anyway. It
     costs nothing here: {{mOff}} and {{riseOnNew}} are both misconception
     values, never the answer ({{ans}}) and never the step ({{piece}}). */
  signalFailure: {
    trigger: "per cent",
    prompt: "Saturdays are busier by {{n1}}%. Why is the answer not {{mOff}}?",
    why: "Because {{n1}} per cent means {{n1}} per cent of the QUIETER Saturday — the story says Saturdays are busier THAN they used to be. Taking {{n1}} per cent off last Saturday takes a share of the wrong crowd: last Saturday is the bigger of the two, so {{n1}} per cent of it comes to {{riseOnNew}}, and the rise was never that big."
  },

  engineRoom: {
    fadeLevel: "partial",
    steps: [
      {
        id: "s1",
        prompt: "Last Saturday's crowd cuts into {{sections}} equal pieces, each piece a tenth of a Saturday before the footbridge. How many passengers is one piece?",
        answer: { exact: "{{piece}}", unit: "passengers", acceptedForms: ["{{piece}}", "{{piece}} passengers"], preferredForm: "{{piece}}" },
        workedExplanation: "There are {{n2}} passengers spread across {{sections}} equal pieces, so each piece is {{n2}} ÷ {{sections}} = {{piece}} passengers. That is what a tenth of the quieter Saturday comes to.",
        hints: [
          { rung: 1, type: "whistle",  text: "The bar is already cut for you. What do you do to an amount to share it out into equal pieces?" },
          { rung: 2, type: "signal",   text: "Divide. The whole crowd is {{n2}}, and the Test Track cut it into {{sections}} pieces." },
          { rung: 3, type: "coupling", text: "{{n2}} ÷ {{sections}} = ___" },
          { rung: 4, type: "route",    text: "{{n2}} ÷ {{sections}} = {{piece}}. One piece is {{piece}} passengers, and one piece is a tenth of the Saturday you are looking for." }
        ],
        misconceptions: [
          { response: "{{mTenths}}", diagnosis: "You divided by ten. Ten pieces is the Saturday BEFORE the footbridge — the hundred per cent — and last Saturday is bigger than that, so it takes more pieces than ten. Count the pieces in the picture.", tag: "cut-the-wrong-whole" },
          { response: "{{ans}}", diagnosis: "That is where you are heading, and you need this step to get there honestly. This one asks what a SINGLE piece is worth.", tag: "jumped-to-the-answer" }
        ]
      },
      {
        id: "s2",
        prompt: "So how many passengers came through on a Saturday before the footbridge opened?",
        answer: { exact: "{{ans}}", unit: "passengers", acceptedForms: ["{{ans}}", "{{ans}} passengers"], preferredForm: "{{ans}}" },
        workedExplanation: "A Saturday before the footbridge is ten of those pieces, because a hundred per cent is ten tenths: {{piece}} × 10 = {{ans}} passengers. Check it forwards, the way the story runs — {{n1}} per cent of {{ans}} is {{trueRise}}, and {{ans}} + {{trueRise}} = {{n2}}, exactly what came through last Saturday.",
        hints: [
          { rung: 1, type: "whistle",  text: "You know what a single piece is worth. How many of those pieces is the hundred per cent?" },
          { rung: 2, type: "signal",   text: "A hundred per cent is ten tenths, so it is ten pieces — not all {{sections}} of them. The extra pieces are the rise." },
          { rung: 3, type: "coupling", text: "{{piece}} × 10 = ___" },
          { rung: 4, type: "route",    text: "{{piece}} × 10 = {{ans}}. {{ans}} passengers came through on a Saturday before the footbridge." }
        ],
        misconceptions: [
          { response: "{{mOff}}", diagnosis: "You took {{n1}} per cent off last Saturday's {{n2}}. This is the trap the whole problem is built around, and it is the hardest one on this site to notice, because the answer it gives looks perfectly reasonable. {{n1}} per cent is {{n1}} per cent OF THE QUIETER SATURDAY, not of last Saturday — and last Saturday is the bigger crowd, so {{n1}} per cent of it is {{riseOnNew}}, which is more than was ever added.", tag: "percent-of-the-wrong-amount" },
          { response: "{{mCount}}", diagnosis: "You took {{n1}} passengers off. {{n1}} per cent is not {{n1}} people — it is a share, and a share is not a number of anybody until you have said what it is a share OF.", tag: "percent-as-count" },
          { response: "{{piece}}", diagnosis: "That is a single piece, which you worked out at the last step. A Saturday before the footbridge is ten of them.", tag: "gave-back-the-step" },
          { response: "{{mAdd}}", diagnosis: "You put the rise ON instead of undoing it. Saturdays got busier, so a Saturday before the footbridge has to come out BELOW {{n2}}, not above it.", tag: "wrong-direction" }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{ans}}", unit: "passengers", acceptedForms: ["{{ans}}", "{{ans}} passengers"], preferredForm: "{{ans}} passengers" },
    questionCheck: "The question asked for a Saturday BEFORE the footbridge — not last Saturday, and not the size of the rise.",
    unitsCheck: "passengers",
    reasonablenessCheck: "{{ans}} passengers. Put the rise back on and see where it lands: {{n1}} per cent of {{ans}} is {{trueRise}}, and {{ans}} + {{trueRise}} = {{n2}}, exactly the crowd that came through last Saturday. Replaying the story forwards is the real check on a backwards answer.",
    reasonablenessFailExample: "If you got {{mOff}}, put the rise back on it and you land short of {{n2}} — on a Saturday nobody ever counted. That is the tell: taking a percentage off the finish never undoes putting the same percentage on the start, because the finish is the bigger amount.",
    connection: "This is the one to remember, and it is the same lesson the water tank teaches in a different currency. Every percentage is a percentage OF something, and on a change it is always of where you STARTED. So a rise can never be undone by taking the same percentage off the finish — the finish is bigger, so the same percentage of it is a bigger piece. It is undone by asking what the finish is worth per hundred, and taking a hundred of those."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-08-09",
                 notes: "Four sets, each re-derived independently and checked by replaying the story forwards: 550+20% = 550+110 = 660 (660/12 = 55, 55x10 = 550); 700+40% = 700+280 = 980 (980/14 = 70); 400+30% = 400+120 = 520 (520/13 = 40); 500+60% = 500+300 = 800 (800/16 = 50). Every rise is a whole number of tens, so a tenth of the quieter Saturday divides both amounts and the bar cuts on a boundary; every piece is a whole number of people. Two rises are excluded structurally rather than by taste: 10%, because then a tenth of the old Saturday IS the rise and two different quantities carry the same number; and 50%, because N-0.5N = 0.5N makes the trap value equal the rise-on-the-wrong-crowd value and one misconception would diagnose a mistake nobody made. The trap can never coincide with the answer at any rate: N(1-r) = N/(1+r) only when r is zero. Within every set the answer, the piece, both givens, the distractor and all six misconception values are distinct: (660,20,8,55,550,528,640,792,66,132,110), (980,40,6,70,700,588,940,1372,98,392,280), (520,30,9,40,400,364,490,676,52,156,120), (800,60,7,50,500,320,740,1280,80,480,300). Fourteen numberChecks assert the rise both ways, the per-hundred split, both steps and every misconception value. Estimate brackets contain their answers: 480-620/550, 620-800/700, 340-470/400, 420-580/500." },
    theme:     { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. --line-change contrast is measured; the percent surface has no colour of its own yet and rides the line's." },
    teacher:   { status: "partial", agent: "claude-session", date: "2026-08-09",
                 notes: "The Test Track is deliberately `section` and not the `drive` this line owns: drive demonstrates direction, and a student who takes 20% off 660 has the direction right and the referent wrong, so drive would show the move they already make and skip the one they get wrong. The Plan phase and the Test Track are two different representations of the same story on purpose — the number line is the percent SURFACE, the cut bar is the METHOD — and neither computes anything. Platform Check answers as a Change problem throughout, which is what makes `fit: onekind` honest here where it would not have been on the Compare Line; `stacked` is answered at length rather than dismissed. Read 3's correct option is placed mid-list and is neither the longest nor the shortest (59/49/57/70 characters). NOT MEASURED: the position of the correct option across the two Test Track questions and the Plan model's picks, against chance." },
    student:   { status: "unreviewed", agent: null, date: null, notes: "NOT REVIEWED. No persona walk-through, and no real student has used this." },
    oversight: { status: "provisional", date: "2026-08-09",
                 notes: "PROVISIONAL. Author and reviewer are the same agent (VERIFICATION.md §16). Two things a measurement cannot settle: whether a student reads the double number line and the cut bar as two views of one story or as two unrelated screens, and whether reverse percent is reachable at all at this fade level. Both need a classroom." }
  }
});
