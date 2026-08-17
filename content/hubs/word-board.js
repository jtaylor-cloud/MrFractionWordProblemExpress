/* Learning Hub — The Word Board.
   Split out of `five-situations` on 2026-08-09 at the user's instruction: the
   vocabulary had grown into a section large enough to be its own hub, and
   burying it at the end of another one meant it was read last or not at all.

   THE INSTRUCTION THAT SHAPES EVERY PAGE HERE, in the user's words: make it
   clear that these words help with READING FOR CONTEXT, and that we are not
   looking for keywords to solve problems.

   That is not a disclaimer to add at the end. It is the reason the hub exists,
   so it is page one, it is the tap on page one, and every tier restates it in
   its own terms. A vocabulary hub on THIS site is a hair's breadth from being
   the keyword poster the whole project was built to replace — the difference is
   entirely in the framing, and the framing has to come first.

   The one-line test, from PEDAGOGY.md §2.2:
       A word may set the QUESTION. Only structure sets the OPERATION.

   TIER 3 IS TAGGED `tier: "lies"` AND MUST STAY TAGGED. Its copy quotes keyword
   rules in order to break them, so it trips the keyword greps by design. The
   exemption is the data tag, never a reading of intent — VERIFICATION.md §30.
   Widening the exemption is the failure; tagging the section is the fix. */
MF.registerHub({
  id: "word-board",
  name: "The Word Board",
  blurb: "The words that turn up in word problems, what each one actually tells you — and why none of them solves the problem for you.",
  welcome: "A word problem is a story before it is a sum. These are the words that story is likely to use. Knowing them helps you READ it — none of them tells you what to do about it.",

  vocab: {
    tiers: [
      {
        tier: "names", badge: "names the operation",
        title: "Words that NAME the operation",
        note: "<p>These are pure vocabulary. The word <em>is</em> the operation or its result, and you can " +
          "define it with no problem in front of you at all &mdash; that is the test.</p>" +
          "<p>Not knowing one of these blocks you in <strong>English</strong>, not in maths. A student who " +
          "can divide perfectly well but has never been told what \"quotient\" means is not bad at maths; " +
          "they are missing a word. So learn these, and that is genuinely the end of it.</p>",
        words: [
          { word: "sum", means: "The result of adding. \"The sum of 3 and 4\" is 7.",
            examples: ["<em>The sum of the two shares</em> &mdash; add them together."] },
          { word: "difference", means: "The result of subtracting — the gap between two amounts.",
            examples: ["<em>The difference between the platforms</em> &mdash; take the smaller from the larger."] },
          { word: "product", means: "The result of multiplying. \"The product of 6 and 4\" is 24.",
            examples: ["<em>The product of the two numbers</em> &mdash; multiply them."] },
          { word: "quotient", means: "The result of dividing.",
            examples: ["<em>The quotient of 96 and 12</em> &mdash; divide 96 by 12."] },
          { word: "per", means: "For each one. It pairs two different units together.",
            examples: ["<em>40 miles per hour</em> &mdash; miles and hours, locked together."] },
          { word: "twice", means: "Two times as much.",
            examples: ["<em>Twice as many</em> &mdash; multiply by 2."] },
          { word: "remainder", means: "What is left over after dividing as far as you can into whole groups.",
            examples: ["<em>7 divided by 2 is 3, remainder 1.</em>"] }
        ]
      },
      {
        tier: "asks", badge: "asks a question",
        title: "Words that ASK a question",
        note: "<p>These are the useful ones and the dangerous ones, and they are the reason this hub is " +
          "not a keyword poster.</p>" +
          "<p>Each one names a <strong>situation</strong> and hands you a <strong>question</strong>. It " +
          "never hands you an operation. <em>\"More than\"</em> means a comparison is happening &mdash; " +
          "now go and find out which amount is bigger and which one you were told.</p>" +
          "<p>Every word below comes with two examples that need <strong>different operations</strong>. " +
          "That is deliberate. One example would be a keyword rule wearing a disguise.</p>",
        words: [
          { word: "more than", means: "A comparison is happening. Ask: which amount is bigger, and which one were you actually told?",
            examples: ["<em>The queue had 7 more people than the machines had.</em> You were told the small one &rarr; <strong>add</strong>.",
                       "<em>The express has 12 more benches than the local. The express has 31.</em> You were told the big one &rarr; <strong>subtract</strong>."] },
          { word: "left", means: "Something has been taken away. Ask: away from what, and do you know what it started as?",
            examples: ["<em>Had 90, used 35, how many left?</em> &rarr; <strong>subtract</strong>.",
                       "<em>35 are left after using 55. How many at the start?</em> &rarr; <strong>add</strong>."] },
          { word: "each", means: "Equal groups are involved. Ask: which of the three is missing — how many groups, how big a group, or the total?",
            examples: ["<em>6 crates, 12 bottles each.</em> The total is missing &rarr; <strong>multiply</strong>.",
                       "<em>96 letters, 12 in each bag.</em> The number of groups is missing &rarr; <strong>divide</strong>."] },
          { word: "altogether", means: "Something is being brought together. Ask: parts of one whole, or a repeated group?",
            examples: ["<em>2/5 blue and 1/4 red, how much altogether?</em> &rarr; <strong>add</strong>.",
                       "<em>12 flags, 3/4 of a metre each, how much ribbon altogether?</em> &rarr; <strong>multiply</strong>."] },
          { word: "of", means: "A share is being taken out of one whole thing. Ask: what is the whole?",
            examples: ["<em>3/4 of a pot of soup</em> &rarr; <strong>multiply</strong> by the fraction.",
                       "<em>14 is 2/5 of the shots she took.</em> The whole is missing &rarr; <strong>divide</strong>."] },
          { word: "times as many", means: "A comparison by size rather than by adding. Ask: as many as WHAT?",
            examples: ["<em>The rack has 13; the car park has 4 times as many.</em> &rarr; <strong>multiply</strong>.",
                       "<em>The car park has 52, which is 4 times the rack.</em> &rarr; <strong>divide</strong>."] },
          { word: "shared", means: "Something is being split up. Ask: split into equal parts, or into named different parts?",
            examples: ["<em>84 seats shared equally between 6 carriages.</em> &rarr; <strong>divide</strong>.",
                       "<em>The land is shared between wheat, barley and fallow.</em> &rarr; the parts <strong>add</strong> back to the whole."] }
        ]
      },
      {
        /* TIER 3 — hazard copy. Every entry is a rule a student may have been
           taught, shown FAILING on a real problem from this site, so the failure
           is something they can go and meet rather than a claim they have to
           take on trust. */
        tier: "lies", badge: "does not work",
        title: "Words that LIE to you",
        note: "<p>You may have been taught rules like these. They work on easy problems and then quietly " +
          "fail on hard ones &mdash; which is exactly when you needed them.</p>" +
          "<p>They are here so you can <strong>watch them fail</strong>. Every example below is a real " +
          "problem from this site, and you can go and ride it.</p>",
        words: [
          { word: "\"more means add\"", means: "It does not. \"More\" tells you which amount is bigger. It does not tell you what to do.",
            examples: ["<em>The express platform has 12 more benches than the local one. The express has 31.</em>",
                       "The word is <strong>more</strong>. The move is <strong>31 &minus; 12</strong>. Adding gives a local platform with MORE benches than the express &mdash; on a story that says the opposite in so many words."] },
          { word: "\"altogether means add\"", means: "Not when the thing being brought together is a repeated group.",
            examples: ["<em>12 flags, 3/4 of a metre of ribbon each. How much ribbon altogether?</em>",
                       "The word is <strong>altogether</strong>. The move is <strong>multiply</strong>."] },
          { word: "\"each means multiply\"", means: "Only when the TOTAL is the missing one. About half the time it means divide.",
            examples: ["<em>Each bag holds 12 letters. There are 96 letters to send.</em>",
                       "The word is <strong>each</strong>. The move is <strong>96 &divide; 12</strong>. Multiplying gives 1,152 letters &mdash; more post than the office has."] },
          { word: "\"the answer is always bigger when you multiply\"", means: "Only when you multiply by something bigger than 1.",
            examples: ["<em>12 flags at 3/4 of a metre each.</em>",
                       "The answer is <strong>9 metres</strong> &mdash; fewer metres than there are flags."] },
          { word: "\"dividing makes things smaller\"", means: "Only when you divide by something bigger than 1.",
            examples: ["<em>How many 2/3-litre cans can you fill from a 4-litre tank?</em>",
                       "The answer is <strong>6</strong> &mdash; bigger than the number you started with."] }
        ]
      }
    ]
  },

  pages: [
    {
      short: "What they're for",
      eyebrow: "Read this first",
      heading: "These words help you READ. They don't tell you what to do.",
      body:
        "<p>A word problem is a <strong>story</strong> before it is a sum. Before you can decide what is " +
        "happening to the amounts, you have to understand the sentence in front of you &mdash; and " +
        "sometimes what is stopping you is simply a word you have not been taught.</p>" +
        "<p>That is what this hub is for. It is a <strong>reading</strong> tool.</p>" +
        "<p class=\"hub-key\"><strong>A word may set the question. Only the structure sets the operation.</strong></p>" +
        "<p>Here is the difference, and it matters more than anything else on this page. Somebody may have " +
        "told you that <em>\"altogether\"</em> means add, or <em>\"each\"</em> means multiply. Those are " +
        "rules for <strong>solving</strong>, and they break. What we are doing instead is using words to " +
        "<strong>understand the story</strong> &mdash; and then working out the situation, which is what " +
        "actually decides the operation.</p>" +
        "<p>Think of it like a station. The signs tell you where you are and what to look at. They do not " +
        "drive the train.</p>",
      tap: {
        ask: "So what is a word in a word problem good for?",
        options: [
          { text: "Understanding what the story is describing", correct: true,
            why: "That is exactly it. The words tell you what is going on; the structure of what is going on tells you what to do. Two different jobs, and this hub only does the first." },
          { text: "Telling you which operation to use", correct: false,
            why: "This is the habit that breaks. No word decides an operation on its own — you will see \"each\" mean multiply on one page here and divide on the next, in almost identical sentences." },
          { text: "Nothing — you should ignore the words and look at the numbers", correct: false,
            why: "Too far the other way. The words are how you find out what is happening at all; a problem with the numbers removed can still be understood, but a problem with the words removed cannot. They just are not instructions." }
        ]
      }
    },

    {
      short: "Naming words",
      kind: "vocab", tier: "names",
      eyebrow: "Tier one",
      heading: "Words that name the operation",
      body:
        "<p>Start with the easy kind. These words simply <em>are</em> a piece of maths vocabulary, and " +
        "there is nothing to work out &mdash; you either know them or you do not.</p>" +
        "<p>Tap any word to see what it means.</p>",
      tap: {
        ask: "\"Find the product of 6 and 4.\" What is that asking?",
        options: [
          { text: "Multiply them", correct: true,
            why: "\"Product\" is the result of multiplying. Nothing to interpret — it is just the word for it." },
          { text: "Add them", correct: false,
            why: "That is the sum. Product is multiplication — these two get swapped more than any other pair on the list, so it is worth learning them together." },
          { text: "It depends on the situation", correct: false,
            why: "Good instinct, and it is right for the NEXT tier — but not here. These words name an operation outright, which is exactly what makes them the safe ones." }
        ]
      }
    },

    {
      short: "Asking words",
      kind: "vocab", tier: "asks",
      eyebrow: "Tier two",
      heading: "Words that ask you a question",
      body:
        "<p>Now the interesting ones. Each of these tells you what <strong>kind of situation</strong> you " +
        "are in &mdash; and then hands you a question to answer.</p>" +
        "<p>Every word here has two examples that need <strong>different operations</strong>. Read both. " +
        "The point is not to learn what the word means; it is to see that the same word points two ways " +
        "depending on what the story is missing.</p>",
      tap: {
        ask: "\"Each bag holds 12 letters. There are 96 letters.\" What does \"each\" tell you?",
        options: [
          { text: "That the groups are all equal — but not which operation", correct: true,
            why: "Exactly. \"Each\" tells you every bag is the same size, which is what makes a single multiplication or division possible at all. Which of the three amounts is MISSING decides which one — and here the total is given, so it is 96 ÷ 12." },
          { text: "That you should multiply", correct: false,
            why: "This is the trap. 96 letters at 12 per bag is 96 ÷ 12 = 8 bags. Multiplying gives 1,152 letters, which is more post than the office has." },
          { text: "Nothing useful", correct: false,
            why: "Too harsh — \"each\" is genuinely informative. It tells you the groups are equal. It just is not an instruction." }
        ]
      }
    },

    {
      short: "Lying words",
      kind: "vocab", tier: "lies",
      eyebrow: "Tier three",
      heading: "Rules that lie to you",
      body:
        "<p>These are not words so much as <strong>rules somebody may have taught you</strong>. Every one " +
        "of them works often enough to feel true, and then fails on exactly the problems you needed help " +
        "with.</p>" +
        "<p>They are listed so you can see them break. Each example is a real problem from this site.</p>",
      tap: {
        ask: "Why is \"more means add\" worth knowing about, if it's wrong?",
        options: [
          { text: "So you recognise it when it's about to fail you", correct: true,
            why: "That is the whole reason it is on this page. A rule you have never questioned is one you will keep using; a rule you have watched break is one you will check." },
          { text: "Because it works most of the time", correct: false,
            why: "It does work often — which is precisely what makes it dangerous. It survives the easy problems and then fails on the hard ones, so it feels reliable right up until it costs you." },
          { text: "Because there's a better keyword to use instead", correct: false,
            why: "There is no better keyword. The replacement is not another word — it is asking what is happening in the story, which is what the Five Situations hub is for." }
        ]
      }
    },

    {
      short: "Putting it together",
      eyebrow: "The point",
      heading: "Reading the story, then deciding",
      body:
        "<p>So here is the order, and it is always this order.</p>" +
        "<p><strong>First, read.</strong> Use these words to understand what the story is telling you. " +
        "What is there? What is happening to it? What is being asked?</p>" +
        "<p><strong>Then decide.</strong> Work out which of the five situations you are in &mdash; and " +
        "<em>that</em> tells you the operation.</p>" +
        "<p>The words got you to the starting line. They did not run the race. If you ever find yourself " +
        "scanning a problem for a word instead of reading it for a story, you have slipped back into the " +
        "habit this hub exists to break.</p>" +
        "<p><strong>Next stop:</strong> the Five Situations hub, which is where deciding actually happens.</p>",
      tap: {
        ask: "\"The express has 12 more benches than the local. The express has 31.\" What do you do FIRST?",
        options: [
          { text: "Work out which platform is bigger and which one you were told", correct: true,
            why: "Reading first. \"More\" tells you the express is the bigger one — and you were given the bigger one, so the answer must come out below 31. Only now is it obvious that this is a subtraction." },
          { text: "Add, because it says \"more\"", correct: false,
            why: "This is the exact problem that rule fails on. Adding gives a local platform with more benches than the express — on a story that says the express has more." },
          { text: "Subtract, because these problems usually are", correct: false,
            why: "You would get the right answer here and the wrong one next time. Guessing the operation from habit is the same mistake as guessing it from a keyword — it just fails less predictably." }
        ]
      }
    }
  ],

  closing: "The words are how you get into the story. What to DO about the story is a different question, and it is the one the Five Situations hub answers. Read first, decide second — in that order, every time."
});
