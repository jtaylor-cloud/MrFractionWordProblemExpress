/* Part–Whole Loop · whole unknown · sport · independent

   FOUR NUMBER SETS. The FRACTION is held constant at three fifths and only
   the made-shot count varies, which is what keeps every set sane: the bar is
   always five parts with three marked, so the picture, the scene and the
   whole "one fifth then five fifths" argument survive unchanged. Every set
   divides exactly by 3, so one fifth is always a whole number of shots — a
   basketball player cannot make 6.7 shots.

   Verified both ways for each set:
     21 / 3 = 7  and 5 x 7  = 35, cross-check 3/5 of 35 = 21
     27 / 3 = 9  and 5 x 9  = 45, cross-check 3/5 of 45 = 27
     18 / 3 = 6  and 5 x 6  = 30, cross-check 3/5 of 30 = 18
     24 / 3 = 8  and 5 x 8  = 40, cross-check 3/5 of 40 = 24 */
MF.registerProblem({
  id: "pw-free-throws",
  schemaVersion: 1,
  status: "published",
  title: "Working backwards from a part",
  line: "partwhole",
  topics: ["fraction-of-a-quantity", "whole-unknown"],
  steps: 1,

  unknownCar: "whole",
  context: "sport",
  fadeLevel: "independent",
  stationRoles: ["estimation"],
  hubEligible: true,
  hubGoodStrategies: ["drafting", "estimation"],
  hubStrategyNote: "The whole is missing here, so the answer has to end up BIGGER than the number you were given. Estimating first catches you if you accidentally go the wrong way.",

  provenance: { source: "seed", author: "teacher-agent", addedOn: "2026-07-28" },

  /* The arithmetic every set must satisfy. The 3 and the 5 are the fraction's
     numerator and denominator — constants of the problem, not per-set values. */
  numberChecks: [
    ["n1", "/", "3", "=", "part"],
    ["part", "*", "5", "=", "total"],
    ["total", "-", "n1", "=", "missed"],
    ["n1", "/", "5", "=", "mDiv5"],
    ["n1", "*", "0.6", "=", "mFrac"],
    ["n1", "*", "2", "=", "twice"],
    /* The fraction is constant here, so the bar is always five parts — but
       "always" is an assumption until something checks it. seg1 is
       bars[0].segments as materialised for this set. */
    ["seg1", "*", "part", "=", "total"]
  ],

  numberSets: [
    { numbers: { n1: "21", n2: "3/5", n3: "90" }, spoken: { n2: "three fifths" },
      derived: { part: "7", total: "35", missed: "14", mDiv5: "4.2", mFrac: "12.6", twice: "42" },
      estimate: { min: 26, max: 48 } },
    { numbers: { n1: "27", n2: "3/5", n3: "75" }, spoken: { n2: "three fifths" },
      derived: { part: "9", total: "45", missed: "18", mDiv5: "5.4", mFrac: "16.2", twice: "54" },
      estimate: { min: 34, max: 60 } },
    { numbers: { n1: "18", n2: "3/5", n3: "60" }, spoken: { n2: "three fifths" },
      derived: { part: "6", total: "30", missed: "12", mDiv5: "3.6", mFrac: "10.8", twice: "36" },
      estimate: { min: 22, max: 40 } },
    { numbers: { n1: "24", n2: "3/5", n3: "80" }, spoken: { n2: "three fifths" },
      derived: { part: "8", total: "40", missed: "16", mDiv5: "4.8", mFrac: "14.4", twice: "48" },
      estimate: { min: 30, max: 52 } }
  ],

  scene: { icon: "ball", caption: "Her shots in fifths — the filled ones went in.",
           plural: "fifths of her shots", onWord: "made", offWord: "missed" },

  problem: {
    text: "Nia plays for the Eastside Comets. Their gym smells of floor polish, and the hoop at the far end has a bent rim. In a long Tuesday practice, Nia made {{n1}} free throws. Practice lasted {{n3}} sweaty minutes. That was {{n2}} of all the shots she took. How many shots did she take altogether?",
    sentences: [
      "Nia plays for the Eastside Comets.",
      "Their gym smells of floor polish, and the hoop at the far end has a bent rim.",
      "In a long Tuesday practice, Nia made {{n1}} free throws.",
      "Practice lasted {{n3}} sweaty minutes.",
      "That was {{n2}} of all the shots she took.",
      "How many shots did she take altogether?"
    ],
    questionSentenceIndex: 5,
    numbers: {
      n1: { value: "21",  unit: "shots",   role: "part", spoken: "21" },
      n2: { value: "3/5", unit: "",        role: "fraction", spoken: "three fifths" },
      n3: { value: "90",  unit: "minutes", role: "distractor", spoken: "90" }
    },
    context: { setting: "basketball practice", requiresCulturalKnowledge: false }
  },

  threeReads: {
    read1: {
      prompt: "What's the story? Who or what is involved, and what's happening?",
      modelAnswer: "Someone is taking shots at practice. Some go in and some don't, and we want to know how many she took in total.",
      /* This problem runs its fraction backwards — the shares are given and the
         whole is missing — so the `why` says that out loud rather than leaving
         the student to notice the whole is the thing being asked for. */
      platformCheck: {
        // Widened 2026-08-04: the task is "what do you need to solve it", so the
        // sentence holding the shots she made belongs in the answer too. It used
        // to be [4] alone, and a student who tapped both was told "Not quite".
        sentences: [2, 4],
        // "the whole is the very thing missing" WAS the Ticket Booth answer,
        // verbatim, on a gated question two screens later.
        why: "\"of all the shots she took\" ties the shots she made to the total she attempted. Every shot in the story belongs to that same set of attempts — the made ones are a share of it.",
        kinds: "Everything counted here is shots at the same hoop."
      },

      questions: {
        kinds: {
          ask: "This story counts shots at the hoop, and it also counts the minutes practice lasted. Is the question about a single kind of thing, or about different kinds locked together?",
          options: {
            same:      { yes: "The minutes tell you how long Nia was there, not how many shots she took. Everything the question is about is shots at the same hoop.",
                         no:  "That would mean shots and minutes were locked at a fixed rate &mdash; so many shots every minute, holding steady the whole session. The story never says she shot at a steady rate." },
            different: { yes: "", no: "That would mean stretching the practice would stretch the shots with it, in fixed proportion. Nothing in the story pairs them off like that." }
          }
        },
        moments: {
          ask: "Nia takes shots and some go in. Does the question follow an amount changing over time, or does it ask how her shots split between the ones that went in and the ones that did not?",
          options: {
            changed: { text: "It follows an amount changing", yes: "",
                       no:  "A fair reading &mdash; shots do pile up as practice goes on. But the question is not about any moment during practice. Every shot she took is already counted, and you are dividing them." },
            steady:  { text: "It asks how the shots split",
                       yes: "Every shot she took is already in the story. The question splits them into the ones that went in and the ones that did not.", no: "" }
          }
        },
        things: {
          ask: "How many separate things is the story keeping track of &mdash; just Nia's shots, or Nia's shots and a teammate's held up beside them?",
          options: {
            single:   { yes: "A single set of attempts, divided by what happened to each shot.", no: "" },
            separate: { yes: "", no: "That would mean another player's shots set beside Nia's to measure the gap. There is only her practice here." },
            paired:   { yes: "", no: "That would mean shots locked to something else and scaled. Nothing scales &mdash; a fixed set of attempts is being divided." }
          }
        },
        shape: {
          ask: "Are the shots being shared out into parts, or is the same set of shots repeated over and over, or neither?",
          options: {
            cut:     { yes: "Every shot she took is the whole, and the ones that went in are a share of it. Watch this problem carefully though &mdash; the whole is not the number you were handed.", no: "" },
            repeat:  { yes: "", no: "That would mean an identical set of shots taken again and again, with the question counting the sets. Practice happened once." },
            neither: { yes: "", no: "Something here is being divided &mdash; look at what the shots she made are a part of." }
          }
        },
        fit: {
          ask: "Does a single kind of situation cover the whole story &mdash; the shots she made, and all the shots she took?",
          options: {
            onekind: { yes: "A whole cut into shares the whole way through &mdash; even though this problem runs the division backwards.", no: "" },
            stacked: { yes: "", no: "Worth asking every time. Here there is a set of attempts being divided and nothing else stacked on top of it." },
            nofit:   { yes: "", no: "Keep that answer in your pocket, because some problems really do fit none of these. Shots that went in, out of all the shots taken, is the Part&ndash;Whole Loop." }
          }
        }
      },
      authored: "generated"
    },
    read2: {
      prompt: "What quantities do you have, and how are they connected?",
      quantities: [
        { token: "n1", describe: "the shots she actually made", needed: true },
        { token: "n2", describe: "what share of her total shots that was", needed: true },
        { token: "n3", describe: "how long practice lasted", needed: false }
      ],
      relationship: "This time you're given a PART and told what fraction of the whole it is. The whole is what's missing. The length of practice tells you nothing about how many shots there were.",
      authored: "generated"
    },
    read3: {
      prompt: "Which one is the question asking for?",
      modelAnswer: "The total number of shots she took, made and missed together.",
      commonMisreading: "Thinking {{n1}} is the total. It isn't — it's only the ones that went in.",
      options: [
        { text: "The total number of shots she took", correct: true,
          why: "Made and missed together — the whole. Which means your answer has to be bigger than {{n1}}." },
        { text: "The number of shots she missed",
          why: "You could find that, but only after finding the total. It is not what was asked." },
        { text: "How many shots she made",
          why: "You were handed that — {{n1}}. If a number is already given to you, it cannot be the answer." },
        { text: "How many shots she took per minute",
          why: "The minutes are there as scenery. Nothing in the question asks about rate." }
      ],
      authored: "generated"
    }
  },

  ticketBooth: {
    correctLine: "partwhole",
    whyCorrect: "Made shots and missed shots together make one whole — all her attempts. You've got a part and you want the whole. That's the Part–Whole Loop, running backwards.",
    distractors: [
      { line: "compare", whyWrong: "Reasonable thought — made versus missed does sound like a comparison. But nobody's asking which is bigger or by how much. They're being added together to make a total, which makes it Part–Whole." },
      { line: "change",  whyWrong: "Nothing starts at one amount and moves to another. All the shots happen in one practice; there's no before and after." },
      { line: "groups",  whyWrong: "There aren't repeated equal groups here. There's one set of shots split into the ones she made and the ones she didn't." },
      { line: "ratio",   whyWrong: "Only one kind of thing is being counted — shots. A ratio problem needs two different units in a fixed relationship, like miles and hours." }
    ],
    unknownCar: "whole",
    unknownCarPrompt: "Which car is missing?",
    unknownCarOptions: ["the part", "the whole", "the fraction"],
    unknownCarAnswer: "the whole",
    unknownCarWhy: "You know the part ({{n1}} made) and the fraction (three fifths). The whole is missing — which means your answer must be bigger than {{n1}}.",
    supportAfter3Attempts: {
      narrowTo: ["partwhole", "compare"],
      discriminator: "Ask: are the two amounts being measured against each other, or added together to make a total? Made plus missed equals all her shots — that's a whole being built, not a comparison."
    }
  },

  signalBox: {
    barModel: {
      type: "partitioned",
      /* segmentValue is REVEALED BY MARKING, not pre-printed, and it is
         tokenised so it tracks the number set. One fifth is step s1's answer,
         so Cycle 6 blanked it — leaving a bar model with no numbers, which is
         not a model. model.js hides the value until the student marks the
         part. knownTotal stays "?" because the whole IS s2; markedTotal is the
         GIVEN amount across the marked parts, so it shows from the start. */
      bars: [{ label: "all her shots", segments: 5, segmentValue: "{{part}}", knownTotal: "?", unit: "shots",
               marked: 3, markedTotal: "{{n1}} shots", markedLabel: "the {{n1}} shots she made", restLabel: "the shots she missed" }],
      a11yDescription: "One bar stands for all of Nia's shots. It is split into 5 equal parts, one for each fifth. You mark the parts that show the {{n1}} shots she made. The parts left over show the shots she missed. Two things are still blank: what one part is worth, and how big the whole bar is. You work out both.",
      authored: "generated"
    },
    estimate: {
      prompt: "Before you calculate — roughly how many shots do you think she took in total?",
      reasonableMin: 26,
      reasonableMax: 48,
      modelReasoning: "She made three fifths, which is a bit more than half. If {{n1}} were exactly half, the total would be {{twice}}. She made slightly more than half, so the total is somewhat under {{twice}} — but definitely more than {{n1}}.",
      unit: "shots"
    },

    /* THE TEST TRACK — and this problem runs the fraction BACKWARDS, which is
       what makes it hard. The whole is the unknown, so the shaded sections are
       what the student was GIVEN and the bar is the thing being reconstructed
       around them. Getting a student to see that {{n1}} fills only three of the
       five sections — that it is not the whole — is most of the battle here.

       Nothing is calculated. The counts on screen are the 5 and the 3 of "three
       fifths", both stated in the problem. What one section is worth, and the
       total, are the Engine Room's.

       The worked bar uses one half so neither count can be copied downward. */
    testTrack: {
      kind: "section",
      title: "The Test Track",
      heading: "When the whole is the missing piece",
      intro: "Same two instructions as always — the bottom number cuts, the top number takes. The twist here is that you are given the pieces and asked for the whole. Watch one first.",
      worked: {
        label: "Any whole at all. This time I will show you the pieces, not the whole.",
        button: "Show me one half",
        parts: 2, take: 1,
        sayCut: "The bottom number is 2, so the whole is cut into 2 equal sections.",
        sayTake: "The top number is 1, so one section is shaded. Notice what that means: if I only tell you the shaded piece, the whole is still there — it is just the part I have not told you about yet."
      },
      yours: {
        wholeLabel: "All the shots Nia took — made and missed together. This is what you are looking for.",
        q1: "So: how many equal sections should all her shots be cut into?",
        options1: [
          { text: "5", correct: true,
            why: "The bottom number of three fifths is 5. It always says how many equal sections the whole is cut into — even when the whole is the thing you are hunting for." },
          { text: "3",
            why: "That is the top number. It says how many sections she made, not how many the whole splits into. Cutting into 3 would make thirds, and the problem says fifths." },
          { text: "8",
            why: "That adds the two numbers together. The two numbers in a fraction do different jobs and neither of them is a total." },
          { text: "2",
            why: "Two is how many sections she MISSED — five sections with three made leaves two. That is a real number here, but it is not how the whole is cut." }
        ],
        settled1: "Five sections. Each one is a fifth of all her shots.",
        q2: "And how many of those fifths are the shots she actually made?",
        options2: [
          { text: "3", correct: true,
            why: "The top number of three fifths is 3, so the shots she made fill three of the five sections. The two sections left empty are the ones she missed." },
          { text: "5",
            why: "That is every section — all the shots she took. The problem says three fifths went in, so two sections have to be left over for the misses." },
          { text: "2",
            why: "Two is how many she missed, not how many she made. Read the fraction again: three fifths went IN." },
          { text: "8",
            why: "There are only five sections, so eight of them cannot exist. The 8 came from adding the fraction's two numbers together." }
        ],
        settled2: "Three of the five sections made, two missed — and all five together are what the question is asking for."
      },
      law: "The bottom number cuts the whole, even when the whole is what you are looking for. The shaded pieces are what you were handed, not the answer.",
      bridge: "You now know the shape of it: the {{n1}} shots she made fill three of five sections. What all five come to is the Engine Room's question.",
      a11yDescription: "A demonstration about reading a fraction when the whole is unknown, using no arithmetic. First a plain bar stands for any whole: its bottom number 2 cuts it into two sections and its top number 1 shades one of them, one half. Then the same is done to Nia's shots: three fifths means the whole splits into five equal sections and three of them are shaded, because those are the shots she made. The two unshaded sections are the ones she missed. No value is worked out here — how many shots one section holds, and how many she took altogether, are the next questions in the Engine Room."
    }
  },

  /* ONE step, not two. The old s1 asked for a single fifth — which is exactly
     what the Model Yard prints ("each part = N shots") as soon as a student
     marks a part on the previous screen. Answering it was copying, and only
     the student who had ignored the model was doing any work.
     The per-part value now lives in hint rungs 2 and 3, which are request-only,
     and as the `one-part-only` misconception. Same move the Ratio line made. */
  engineRoom: {
    fadeLevel: "independent",
    steps: [
      {
        id: "s1",
        prompt: "How many shots did she take altogether?",
        answer: { exact: "{{total}}", unit: "shots", acceptedForms: ["{{total}}", "{{total}} shots"] },
        workedExplanation: "The {{n1}} made shots are spread across 3 equal parts, so {{n1}} ÷ 3 = {{part}} shots in each fifth. A whole is five fifths, so 5 × {{part}} = {{total}} shots.",
        misconceptions: [
          { response: "{{part}}",   diagnosis: "That's one fifth of her shots. You need all five fifths to make the whole.", tag: "one-part-only" },
          { response: "{{n1}}",     diagnosis: "That's the shots she MADE. The question asks for every shot she took, including the misses.", tag: "answered-given" },
          { response: "{{missed}}", diagnosis: "That's the two parts she missed. Add those to the ones she made to get the total.", tag: "answered-intermediate" },
          { response: "{{mDiv5}}",  diagnosis: "You divided {{n1}} by 5. Only THREE of the five parts add up to {{n1}} — the other two are the shots she missed.", tag: "wrong-divisor" },
          { response: "{{mFrac}}",  diagnosis: "You took three fifths OF {{n1}}. But {{n1}} already IS three fifths — you don't need to take a fraction of it again.", tag: "fraction-of-wrong-whole" }
        ],
        hints: [
          { rung: 1, type: "whistle",  text: "Look at your bar. The {{n1}} shots she made fill some of the parts, but not all of them. How many parts is the whole bar?" },
          { rung: 2, type: "signal",   text: "Three equal parts add up to {{n1}}, so split the {{n1}} between them to get one part. Then take all five." },
          { rung: 3, type: "coupling", text: "{{n1}} ÷ 3 = ___, then 5 × ___ = ___" },
          { rung: 4, type: "route",    text: "{{n1}} ÷ 3 = {{part}}, and 5 × {{part}} = {{total}}. She took {{total}} shots altogether." }
        ]
      }
    ]
  },

  arrivals: {
    answer: { exact: "{{total}}", unit: "shots", acceptedForms: ["{{total}}", "{{total}} shots"], preferredForm: "{{total}}" },
    questionCheck: "The question asked for ALL her shots, not just the ones that went in.",
    unitsCheck: "shots",
    reasonablenessCheck: "She made {{n1}} out of {{total}}. Is {{n1}} out of {{total}} about three fifths?",
    reasonablenessFailExample: "If your answer came out smaller than the {{n1}} she made, she'd have made more shots than she took — impossible, and a clear sign the operation went the wrong way.",
    connection: "When the WHOLE is the missing car, your answer has to come out bigger than the part you were given. If it comes out smaller, you've gone backwards."
  },

  review: {
    math:      { status: "pass", agent: "claude-session", date: "2026-07-30",
                 notes: "All four number sets re-solved and cross-checked. 21/3=7, 5x7=35, 3/5 of 35=21. 27/3=9, 5x9=45, 3/5 of 45=27. 18/3=6, 5x6=30, 3/5 of 30=18. 24/3=8, 5x8=40, 3/5 of 40=24. Fraction held at 3/5 so segments 5 / marked 3 and the scene stay valid across all sets. Every made-count divides by 3, so one fifth is always a whole number of shots. Estimate brackets contain their own totals: 26-48/35, 34-60/45, 22-40/30, 30-52/40. Misconception values per set verified reachable and distinct from that set's answers." },
    theme:     { status: "pass", agent: "theme-reviewer", date: "2026-07-28", notes: "Basketball context widely accessible; free throw explained by context. No grade level." },
    teacher:   { status: "pass", agent: "teacher",        date: "2026-07-28", notes: "Whole-unknown is the hard direction. The 'answer must be bigger' check in arrivals is the key takeaway." },
    student:   { status: "untested" },
    oversight: { status: "approved", date: "2026-07-30", firstApproved: "2026-07-28",
                 notes: "Cycle 6 re-approval. Model Yard answer leak fixed (segmentValue 7 was s1 answer) and a11yDescription rewritten to match. Number sets added 2026-07-30 and re-validated per set. The 2026-07-28 approval stands for everything else. See docs/REVIEW-LOG.md Cycle 6." }
  }
});
