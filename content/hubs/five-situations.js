/* Learning Hub — The Five Situations.
   This is where choosing between the five lines is an HONEST question: you are
   not riding any of them, so nothing gives the answer away. Inside a themed trip
   the Ticket Booth asks which car is missing instead.

   REBUILT 2026-08-09 AS A JOURNEY. It was one long scroll — every section
   concatenated, then a quiz — which made the page we point students at to learn
   how to read the single densest wall of text on the site. On the user's
   instruction: a section per page, a rail showing the whole shape, a diagram and
   something to DO on every topic, the checklist visible as one object, and a
   vocabulary section. Renderer is `assets/js/hub.js`.

   NOTHING WAS DROPPED IN THE MOVE. All seven old quiz stems are still here —
   they are now the per-topic taps on the line pages, which is a better home for
   them: each one lands on the page that just taught the thing it tests.

   THE TIER-3 SECTION IS TAGGED `tier: "lies"` AND MUST STAY TAGGED. Its copy
   quotes keyword rules in order to break them, so it trips the keyword greps by
   design. The exemption is the data tag, never a reading of intent —
   VERIFICATION.md §30, the one rule written before its failure rather than
   after, and therefore the one most likely to be argued away. Widening the
   exemption is the failure; tagging or rewriting the copy is the fix. */
MF.registerHub({
  id: "five-situations",
  name: "The Five Situations",
  blurb: "What each line means, how to tell them apart, and the words that trip people up. Work through it a page at a time.",
  welcome: "Every word problem you meet is describing something happening to a set of amounts. There are only five somethings. Learn to hear which one you're being told, and you're most of the way to solving it.",

  /* The checklist, as one object. This is the process we point students at, so
     it has to be readable in one go rather than remembered from five pages. The
     questions are the same five the Platform Check asks on every trip — if these
     ever drift apart, the hub is teaching a process the site does not run. */
  checklist: {
    note: "<strong>You will not always get a clean answer to all five, and that is fine.</strong> " +
      "Two or three of them are usually enough to settle it. The point is to ask <em>something</em> about " +
      "the structure before you reach for a number.",
    questions: [
      { label: "Kinds",
        ask: "What is being counted — one kind of thing, or different kinds locked together?",
        tells: "Different kinds that drag each other along means Ratio & Rate. Everything else counts a single kind of thing." },
      { label: "Moments",
        ask: "Does any amount end up different from how it started?",
        tells: "Yes means the Change Line. Careful: things can be busy without any amount changing — a train can run all day at the same speed." },
      { label: "Things",
        ask: "How many separate things is the story keeping track of?",
        tells: "Separate things held up against each other means Compare. A single thing means Change, Equal Groups or Part–Whole." },
      { label: "Shape",
        ask: "Is anything being cut up, or repeated?",
        tells: "Cut into shares that add back up means Part–Whole. The same amount repeated to build a total means Equal Groups." },
      { label: "Fit",
        ask: "Does one kind of situation cover the whole story?",
        tells: "Sometimes two are stacked, and sometimes none of the five fits. Both are real answers, and noticing is better than forcing it." }
    ]
  },

  /* THE VOCABULARY LIVED HERE AND NOW LIVES IN `word-board`.
     Moved 2026-08-09. Nothing is left behind on purpose: a second copy of the
     word list would drift from the real one, and a hub carrying data no page
     renders is the dead-content shape this project already has a rule about.
     The signpost page at the end of `pages` explains the relationship, which is
     the part that actually matters — the words are for READING, and this hub is
     where you decide what to do. */
  vocabMovedTo: "word-board",

  pages: [
    {
      short: "Why five",
      eyebrow: "Start here",
      heading: "Why five, and not five hundred",
      body:
        "<p>Word problems feel endless because the <em>stories</em> are endless &mdash; soup, quilts, free " +
        "throws, delivery vans. The stories are just wrapping.</p>" +
        "<p>Underneath, the same five situations come round again and again. Once you can name the " +
        "situation, you already know what shape the answer takes and roughly what to do.</p>" +
        "<p><strong>Nobody expects you to memorise these.</strong> You'll start recognising them the way " +
        "you recognise a song from the first two notes &mdash; by hearing them often, not by revising.</p>",
      tap: {
        ask: "Before we start: what is the FIRST thing to work out about a word problem?",
        options: [
          { text: "What is happening to the amounts", correct: true,
            why: "That is the whole method. Name the situation first, and the operation follows from it." },
          { text: "Which numbers are in it", correct: false,
            why: "The numbers are the last thing you need. A problem with the numbers blanked out can still be sorted into one of the five — that is exactly what the first read on a trip asks you to do." },
          { text: "Which key words it contains", correct: false,
            why: "That is the habit this whole hub exists to replace. There is a page on it later, with the words that fail and the problems they fail on." }
        ]
      }
    },

    {
      short: "Change",
      eyebrow: "● The Change Line",
      heading: "Something starts, something happens, something ends",
      art: "change",
      body:
        "<p><strong>Start &plusmn; Change = Result</strong></p>" +
        "<p>There's a running amount, and it goes up or down over time. Three moments: what you had, " +
        "what happened, what you ended with.</p>" +
        "<p><strong>How to spot it:</strong> you can tell it as a sequence. First this, then that, so now this.</p>" +
        "<p><strong>The hard version</strong> is when the <em>start</em> is missing &mdash; you're told what " +
        "happened and what's left, and asked what you began with. The story runs forwards but the arithmetic " +
        "runs backwards. That's not you being slow; that's genuinely the hard case.</p>",
      tap: {
        ask: "Which of these is a Change story?",
        options: [
          { text: "A bucket held 5/8 of a gallon. Some leaked out. Now it holds 1/4 of a gallon.", correct: true,
            why: "A running amount, changing over time. Started here, something happened, ended there." },
          { text: "Maya's rope is 7/8 of a metre. Sam's is 1/2 a metre.", correct: false,
            why: "Two ropes, both sitting there, neither changing. Nothing happens to either one — that is Compare." },
          { text: "A recipe uses 3/4 cup of oats per batch.", correct: false,
            why: "Nothing changes over time. The same amount repeats, once per batch — that is Equal Groups." }
        ]
      }
    },

    {
      short: "Compare",
      eyebrow: "■ The Compare Line",
      heading: "Two amounts, side by side",
      art: "compare",
      body:
        "<p><strong>Larger &minus; Smaller = Difference</strong>, or <strong>Larger = Factor &times; Smaller</strong></p>" +
        "<p>Two things exist at once and neither of them changes. The story is interested in how they " +
        "measure up against each other &mdash; the gap between them, or how many times bigger one is.</p>" +
        "<p><strong>The one question that matters here:</strong> measured against <em>what</em>? " +
        "\"Three times as many as&hellip;\" &mdash; as what? Whatever follows the word <strong>than</strong> " +
        "or <strong>as</strong> is the amount everything else is measured against, and getting that " +
        "backwards is the commonest mistake on this line.</p>",
      tap: {
        ask: "Which of these is a Compare story?",
        options: [
          { text: "Maya's rope is 7/8 of a metre. Sam's is 1/2 a metre. How much longer is Maya's?", correct: true,
            why: "Two ropes existing side by side, neither changing. You're measuring the gap." },
          { text: "A jug holds 6 cups. You pour out 2/3 of it.", correct: false,
            why: "One jug, and you're taking a share OF it. That is one whole being cut up — Part–Whole." },
          { text: "A bucket held 5/8 of a gallon. Some leaked out.", correct: false,
            why: "One bucket, before and after. An amount ends up different from how it started — that is Change." }
        ]
      }
    },

    {
      short: "Equal Groups",
      eyebrow: "▲ Equal Groups Express",
      heading: "The same amount, repeated",
      art: "groups",
      body:
        "<p><strong>Groups &times; Size of group = Total</strong></p>" +
        "<p>One amount, laid down again and again, building up a total. You could act it out: make a " +
        "group, then another the same, then another.</p>" +
        "<p><strong>Any of the three can be the missing one.</strong> How many groups, how big each group " +
        "is, or what they come to. Two of those are divisions and they are not the same division, which " +
        "is why this line takes practice.</p>" +
        "<p><strong>The hardest problem on this whole site lives here</strong> &mdash; \"how many 2/3-cup " +
        "servings in 4 cups?\" &mdash; because the answer comes out <em>bigger</em> than the amount you " +
        "started with. That still feels wrong to most adults. It is still right.</p>",
      tap: {
        ask: "Which of these is an Equal Groups story?",
        options: [
          { text: "How many 3/4-cup scoops can you get out of 9 cups?", correct: true,
            why: "The scoop repeats. How many identical groups fit? Equal Groups — and it's a division." },
          { text: "A field is 2/5 wheat and 1/3 barley. The rest is fallow.", correct: false,
            why: "One field, split into shares that are all DIFFERENT. That is Part–Whole — the shares here are not identical, so nothing repeats." },
          { text: "A printer produces 2/3 of a page every second.", correct: false,
            why: "Two different units locked together — pages and seconds. That is a rate, on the Ratio & Rate Rail." }
        ]
      }
    },

    {
      short: "Ratio & Rate",
      eyebrow: "◆ The Ratio & Rate Rail",
      heading: "A fixed relationship, scaled up or down",
      art: "ratio",
      body:
        "<p><strong>Rate &times; Amount = Amount</strong></p>" +
        "<p>Two <em>different</em> kinds of thing, pinned to each other. Change one and the other follows. " +
        "Miles and hours. Flour and water. Pages and seconds.</p>" +
        "<p><strong>How to spot it:</strong> the relationship holds at any size. If the recipe works for one " +
        "batch it works for ten, in the same proportion. Nothing in the story fixes how big the situation " +
        "is &mdash; you are given a rule and asked to scale it.</p>",
      tap: {
        ask: "Which of these is a Ratio or Rate story?",
        options: [
          { text: "A printer produces 2/3 of a page every second.", correct: true,
            why: "Two different units locked together: pages and seconds. That's a rate." },
          { text: "6 crates, each holding 12 bottles.", correct: false,
            why: "Everything counted here is bottles, and the story fixes how many crates there are. Nothing scales — that is Equal Groups." },
          { text: "The express platform has 12 more benches than the local one.", correct: false,
            why: "A fixed gap of 12 benches, not a relationship that scales. Double the platforms and the gap stays 12 — that is Compare." }
        ]
      }
    },

    {
      short: "Part–Whole",
      eyebrow: "⬢ The Part–Whole Loop",
      heading: "Pieces that make up a total",
      art: "partwhole",
      body:
        "<p><strong>Part + Part = Whole</strong></p>" +
        "<p>One thing, cut into shares. The shares belong to it, and between them they account for all " +
        "of it. Nothing is repeated and nothing changes &mdash; it is a single whole, divided.</p>" +
        "<p><strong>How to spot it:</strong> you can name the whole. The quilt. The pot. The band. If you " +
        "cannot point at the one thing everything is a piece of, it probably is not this line.</p>",
      tap: {
        ask: "Which of these is a Part–Whole story?",
        options: [
          { text: "A jug holds 6 cups. You pour out 2/3 of it.", correct: true,
            why: "One jug, and you're taking a share OF it. Cutting one thing — not repeating a group." },
          { text: "How many 3/4-cup scoops can you get out of 9 cups?", correct: false,
            why: "Close, and worth the confusion. But the scoops are all identical and they REPEAT — that is Equal Groups. Part–Whole cuts one thing into different named shares." },
          { text: "A bucket held 5/8 of a gallon. Some leaked out.", correct: false,
            why: "An amount that ends up different from how it started. That is Change." }
        ]
      }
    },

    {
      short: "Mix-ups",
      eyebrow: "The tricky pairs",
      heading: "The ones that get mixed up",
      body:
        "<p><strong>Equal Groups and Part&ndash;Whole both involve dividing</strong>, and that is why they " +
        "get confused. The question that separates them:</p>" +
        "<p class=\"hub-key\"><strong>Am I repeating the same group again and again, or cutting one single " +
        "thing into pieces?</strong></p>" +
        "<p>Servings from a pot &mdash; repeating a group &mdash; is Equal Groups. Three quarters <em>of</em> " +
        "the pot &mdash; cutting one thing &mdash; is Part&ndash;Whole.</p>" +
        "<p><strong>Change and Compare</strong> get mixed up too. Ask whether time passes. If something " +
        "happens and then the amount is different, that is Change. If both amounts just sit there being " +
        "different sizes, that is Compare.</p>" +
        /* THE PAIR THIS SITE'S OWN CONTENT MADE URGENT. cp-parking-spaces draws
           a car park as four copies of a bike rack, and eg-crate-bottles draws
           six crates in a row — the same arithmetic and nearly the same picture.
           The Platform Check already separates them on the THINGS question, but
           a student torn on SHAPE gets a bare "no" without being told where to
           look. This is where they are told. */
        "<p><strong>And the newest one: Equal Groups and a Compare that multiplies.</strong> " +
        "\"Four times as many\" repeats something, so it feels like Equal Groups. Here is the test:</p>" +
        "<p class=\"hub-key\"><strong>In Equal Groups the multiplier counts things you could point at " +
        "&mdash; crates, bags, carriages. In Compare it counts nothing: \"four times\" is not four " +
        "<em>of</em> anything.</strong></p>" +
        "<p>Six crates is six things in the room. Four times as many spaces is not four car parks &mdash; " +
        "it is one car park, measured against one bike rack. If you are stuck, count how many separate " +
        "things the story is keeping track of. Groups of one thing, building a total? Equal Groups. Two " +
        "named things, one sized against the other? Compare.</p>",
      tap: {
        ask: "\"The car park has 4 times as many spaces as the bike rack.\" Which line is that?",
        options: [
          { text: "Compare — two things, one measured against the other", correct: true,
            why: "There are exactly two things, a rack and a car park, and neither is a group of anything. The \"4 times\" measures one against the other — it does not count four of something." },
          { text: "Equal Groups — the same amount, four times over", correct: false,
            why: "The closest wrong answer on the site, and worth sitting with. Ask what the 4 counts. In Equal Groups it counts things you could point at — four crates, four bags. Here there are not four of anything; there is one car park and one rack." },
          { text: "Ratio & Rate — it holds at any size", correct: false,
            why: "Fair try, because a multiplier does scale. But a ratio pins two DIFFERENT kinds of thing together — miles and hours. Here both amounts are spaces, and the story fixes both places." }
        ]
      }
    },

    {
      short: "The checklist",
      kind: "checklist",
      eyebrow: "The process",
      heading: "The five questions, all in one place",
      body:
        "<p>This is the whole method. On a trip you will be asked these five one at a time &mdash; here " +
        "they are together, so you can see the shape of what you are doing.</p>" +
        "<p><strong>Ask them about the story, not about the numbers.</strong> Every one of them can be " +
        "answered with the numbers blanked out, which is exactly how the first read works.</p>",
      tap: {
        ask: "Which question would settle \"Maya's rope is 7/8 m, Sam's is 1/2 m\" fastest?",
        options: [
          { text: "Things — how many separate things is the story tracking?", correct: true,
            why: "Two ropes, held up against each other. That answer alone puts you on Compare, and it took no arithmetic at all." },
          { text: "Shape — is anything cut up or repeated?", correct: false,
            why: "It would help — nothing is cut and nothing repeats — but that rules out only Part–Whole and Equal Groups. Things gets you there in one." },
          { text: "Moments — does any amount end up different?", correct: false,
            why: "Also useful: nothing changes, so it is not the Change Line. But it still leaves you choosing between three lines." }
        ]
      }
    },

    {
      /* The vocabulary moved out to its own hub (`word-board`) on 2026-08-09 —
         it had grown big enough that living at the end of this hub meant it was
         read last or not at all. This page is the signpost, not a summary: the
         one thing worth saying here is the RELATIONSHIP between the two hubs,
         because a student who meets the words without that framing has been
         handed a keyword list. */
      short: "The words",
      eyebrow: "Where next",
      heading: "The words are a different job",
      body:
        "<p>You will meet words in these problems that you have not been taught &mdash; " +
        "<em>quotient</em>, <em>per</em>, <em>remainder</em> &mdash; and words that have been explained " +
        "to you badly, like <em>\"altogether means add\"</em>.</p>" +
        "<p>Those live in their own hub now: <strong>The Word Board</strong>. It is worth working through, " +
        "with one thing held firmly in mind.</p>" +
        "<p class=\"hub-key\"><strong>Those words help you READ the story. This hub is where you decide " +
        "what to do about it.</strong></p>" +
        "<p>A word may set the question. Only the structure &mdash; which of the five situations you are " +
        "in &mdash; sets the operation. Read first, decide second, and never let a single word do the " +
        "second job.</p>",
      tap: {
        ask: "You spot the word \"altogether\" in a problem. What has it told you?",
        options: [
          { text: "That something is being brought together — now go and find out how", correct: true,
            why: "That is the honest reading. Parts of one whole get added; a repeated group gets multiplied. The word narrowed it down and then handed the question straight back to you." },
          { text: "That you should add", correct: false,
            why: "The rule that breaks. \"12 flags, 3/4 of a metre of ribbon each — how much altogether?\" contains altogether and needs a multiplication." },
          { text: "That it is a Part–Whole problem", correct: false,
            why: "Tempting, because it often is. But the same word turns up on Equal Groups problems constantly — the word suggests, and then the structure decides." }
        ]
      }
    }
  ],

  closing: "That's the whole framework. Five situations, and the rest is wrapping. When a problem won't sit still, come back to the mix-ups page — nine times out of ten that's what's going on."
});
