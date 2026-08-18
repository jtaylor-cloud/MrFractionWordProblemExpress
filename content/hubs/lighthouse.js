/* Learning Hub — The Lighthouse.
   Crossover Island's hub, built 2026-08-16 on the user's instruction: focus on
   the crossover, and teach the checklist and the five situations in more depth
   than anywhere else on the site.

   WHY IT IS A HUB AND NOT AN ISLAND STOP. Hubs are never gated and never
   framed as remedial — a locked decision — and that decides where this belongs.
   The Crossover Read teaches the move inside a problem, under time pressure,
   with a question waiting at the end of it. This teaches the same move with
   nothing at stake, reachable from the map by anyone at any point, including
   somebody who has never been to the island and is only curious what the
   lighthouse is.

   ITS RELATIONSHIP TO THE ISLAND is the one the Word Board has to Five
   Situations, and the Percent Yard has to the Ticket Booth: READ IT HERE,
   DECIDE IT THERE. This hub teaches what a crossover is, how the checklist
   behaves when a story has two halves, and what it means for a number to be
   carried from one to the other. Finding the crossover in a particular story
   happens on the island, at a station, where it is the student's job.

   THE THING IT MUST NOT DO is hand over an island problem's answer. So no
   example here is one of the seven island stories, the diagrams never name
   which two situations are joined, and every worked example is set on the
   island's own furniture — the ferry, the harbour, the lamp — rather than on
   the trains the problems use.

   AND IT MUST NOT TEACH A KEYWORD. The temptation on a page about "where does
   it change" is enormous and it is the exact tier-3 lie this site exists to
   break (PEDAGOGY §2.2): there is no word that marks a crossover, and page
   four says so outright rather than leaving it to be assumed. What marks one is
   the story starting to do a different job, which is a structural reading and
   not a lexical one.

   NOTHING HERE IS GATED AND NOTHING IS SCORED. Locked decision. */
MF.registerHub({
  id: "lighthouse",
  name: "The Lighthouse",
  blurb: "Problems with a middle: how one story can be two situations, how the same five questions answer twice, and what gets carried between the halves.",
  welcome: "Most problems are one situation all the way through. Some are two, joined — and the join is a number that one half works out and the other half needs. This is where that gets taught properly.",

  pages: [
    {
      short: "Two at once",
      art: "crossover",
      eyebrow: "Start here",
      heading: "Some problems have a middle",
      body:
        "<p>Everything on the five lines is <strong>one situation</strong>. Something changes, or two amounts " +
        "sit side by side, or a relationship scales, or an amount repeats, or pieces make a total. One shape, " +
        "from the first word to the last.</p>" +
        "<p>A problem with a <strong>crossover</strong> is not harder than that. It is two of them, one after " +
        "the other &mdash; and you already know both.</p>" +
        "<p class=\"hub-key\"><strong>The first part works something out. The second part needs it.</strong></p>" +
        "<p>Look at the picture. Two boxes, and an arrow between them carrying a question mark. The question " +
        "mark is the whole idea: there is a number in the middle of the problem that nobody gives you. The " +
        "first half produces it, and the second half cannot start without it.</p>" +
        "<p>That number has a name here. It is the <strong>transfer</strong>, and page five is about nothing " +
        "else.</p>",
      tap: {
        ask: "What makes a problem a crossover problem?",
        options: [
          { text: "It is two kinds of situation, one after the other", correct: true,
            why: "That is the definition, and notice what it is not about: not how many calculations there are, not how big the numbers are, not how long the story is." },
          { text: "It takes more than one calculation", correct: false,
            why: "Plenty of problems on the five lines take two or three moves and never leave their own situation. Steps and situations are not the same thing — that distinction is page three." },
          { text: "The numbers are harder", correct: false,
            why: "The numbers on the island are the same sort of numbers as everywhere else. What is different is the shape of the story, not the arithmetic." }
        ]
      }
    },

    {
      short: "The five questions",
      art: "checkfive",
      eyebrow: "The checklist, properly",
      heading: "What each question is actually asking",
      body:
        "<p>You have met these five at every station. They go past quickly there, so here they are slowly &mdash; " +
        "because on a crossover problem you are going to run them <strong>twice</strong>, and a tool you use " +
        "twice is worth understanding once.</p>" +
        "<p><strong>Kinds &mdash; is everything counted in the same stuff?</strong> Benches against benches is " +
        "one kind. Miles against minutes is two kinds locked together. This question separates amounts you " +
        "could add from relationships you could not.</p>" +
        "<p><strong>Moments &mdash; does any amount end up different from how it started?</strong> Not whether " +
        "the story is busy. A ferry can run all day without a single quantity in the problem changing. " +
        "Something has to <em>become</em> a different amount.</p>" +
        "<p><strong>Things &mdash; how many separate amounts is the story keeping track of?</strong> One thing " +
        "at different times, or two things held up against each other, or a pair that moves together.</p>" +
        "<p><strong>Shape &mdash; is anything being cut into shares, or repeated?</strong> Cut into parts that " +
        "add back to a named total, or the same amount laid down again and again &mdash; or neither.</p>" +
        "<p><strong>Question &mdash; does one kind of situation cover the whole story?</strong> This is the " +
        "one the island is built on, and until now the answer was always yes.</p>",
      tap: {
        ask: "\"The lamp is lit for 9 hours on Monday and 14 hours on Tuesday.\" What does the Moments question say?",
        options: [
          { text: "Nothing changed — those are two amounts, not one amount before and after", correct: true,
            why: "The lamp being on is not a quantity changing. Monday's hours and Tuesday's hours are two separate amounts that both simply are what they are, which is why this reads as a comparison rather than a change." },
          { text: "It changed, because Tuesday is more than Monday", correct: false,
            why: "This is the commonest slip on this question. One amount being bigger than another is a comparison. A change needs a single amount that ends up different from how it started — the same lamp-hours, before and after something happened to them." },
          { text: "It changed, because the lamp went on and off", correct: false,
            why: "Things happening in a story are not the same as quantities changing. Ask what the problem is counting, and then ask whether that count ends up different." }
        ]
      }
    },

    {
      short: "A stretch, not a problem",
      art: "checktwice",
      eyebrow: "The idea that unlocks the rest",
      heading: "The checklist classifies a stretch of story",
      body:
        "<p>Here is the thing worth carrying away from this whole hub, and it is not obvious.</p>" +
        "<p class=\"hub-key\"><strong>The checklist does not classify a PROBLEM. It classifies a stretch of " +
        "story.</strong></p>" +
        "<p>You have been running it on whole problems, and that has worked perfectly &mdash; because until " +
        "now, whole problems were one situation. So the stretch and the problem were the same thing and " +
        "nothing made you notice the difference.</p>" +
        "<p>On a crossover problem they come apart. Run the checklist on the first half and you get one of the " +
        "five. Run the same five questions, unchanged, on the second half, and you get a different one. The " +
        "questions did not change. What you pointed them at did.</p>" +
        "<p>That is also why <strong>steps and situations are not the same thing</strong>. A Part&ndash;Whole " +
        "problem can take four moves and still be Part&ndash;Whole the whole way. A crossover problem changes " +
        "what kind of thing is happening, which is a different sort of difference altogether.</p>",
      tap: {
        ask: "You run the checklist on a story and get a clear answer. Then you read it again and get a different clear answer. What is most likely?",
        options: [
          { text: "It is two situations, and you ran the checklist on a different stretch each time", correct: true,
            why: "Two confident answers to the same checklist is not you being inconsistent. It is the story telling you it has a middle — and the next thing to find is where." },
          { text: "You made a mistake one of those times", correct: false,
            why: "That is worth ruling out, but do not start there. On a crossover problem both readings are genuinely right about the part you were looking at, and treating one as an error throws away the evidence." },
          { text: "The checklist does not work on that problem", correct: false,
            why: "It worked exactly as it should — twice. What it cannot do is give one answer to a story that is doing two things, and nothing should." }
        ]
      }
    },

    {
      short: "Where it changes",
      art: "seam",
      eyebrow: "Finding the join",
      heading: "The seam, and how to find it",
      body:
        "<p>If a story has two halves, there is a place it stops doing one thing and starts doing another. " +
        "Finding it is a <strong>reading</strong> job, and it comes before any arithmetic.</p>" +
        /* This paragraph refutes a tier-3 rule, so it was always going to sit
           near the teacher grep. The first draft said "there is no signal word
           for a crossover", which tripped it — correctly, because the grep
           cannot tell a refutation from an instruction and must not be taught
           to try. `tier: "lies"` would have been the sanctioned way to keep the
           phrase, and it is not used here for a simpler reason: the paragraph
           makes the whole point without it. An exemption you do not need is an
           exemption available to shelter something you should not have
           written. */
        "<p><strong>There is no word that marks it.</strong> None. Nothing you can look up tells you " +
        "where a story changes, the same way nothing tells you which of the five you are on &mdash; every " +
        "rule of the form <em>see this, do that</em> breaks the moment somebody writes the sentence the " +
        "other way round.</p>" +
        "<p>What you are looking for is the story starting a <strong>different job</strong>. Up to the seam it " +
        "is doing one thing &mdash; setting amounts against each other, say. After it, it is doing something " +
        "else &mdash; giving a relationship that holds at any size, or describing something happening to an " +
        "amount.</p>" +
        "<p>Two things that help. Sentences that are only scenery sit anywhere and belong to neither half, so " +
        "do not count sentences and take the middle one. And the question at the end almost never is the seam " +
        "&mdash; it is what the whole story has been building towards.</p>",
      tap: {
        ask: "A story about the ferry: (1) it leaves the harbour, (2) it carries this many on Monday, (3) this many on Tuesday, (4) the café on board seats twelve, (5) every crossing burns fuel at a steady rate per mile, (6) the question. Where is the seam most likely?",
        options: [
          { text: "At sentence 5, where it starts giving a rate", correct: true,
            why: "Up to there the story is setting two days' numbers against each other. Sentence 5 stops doing that and starts describing a relationship that holds at any size, which is a different kind of job." },
          { text: "At sentence 4, because it is in the middle", correct: false,
            why: "Sentence 4 is scenery — a detail that belongs to neither half and is doing no work at all. Counting to the middle is exactly the habit that makes a story with a stray sentence in it unreadable." },
          { text: "At sentence 6, the question", correct: false,
            why: "The question is what the whole story has been building towards, so it belongs to the end rather than to a join. A seam has story on both sides of it." }
        ]
      }
    },

    {
      short: "The transfer",
      art: "transfer",
      eyebrow: "What crosses",
      heading: "One number, carried",
      body:
        "<p>The two halves are joined by a number, and that number is the reason the problem has to be done " +
        "in an order.</p>" +
        "<p class=\"hub-key\"><strong>The transfer is an ANSWER on one side of the seam and a GIVEN on the " +
        "other.</strong></p>" +
        "<p>That is what makes it different from every other number in a problem. The numbers you are handed " +
        "are printed in the story. The answer is what you hand back at the end. The transfer is neither: " +
        "nobody gives it to you, and nobody asks you for it.</p>" +
        "<p>It is also why you cannot start at the second half. The second half is waiting for a number that " +
        "does not exist yet &mdash; and if you try, you find yourself looking for something to multiply and " +
        "nothing to multiply it by.</p>" +
        "<p><strong>And it is where the marks go missing.</strong> Working out the transfer correctly and " +
        "stopping there is the commonest way to lose one of these, because the number is right, you worked it " +
        "out yourself, and it feels finished. It answers a question nobody asked. Check the units against the " +
        "question: if the question wants miles and your number is minutes, you are standing in the middle of " +
        "the problem.</p>",
      tap: {
        ask: "You work out the first half and get a number. How do you know whether it is the answer or the transfer?",
        options: [
          { text: "Read the question again and check what it asked for, units and all", correct: true,
            why: "The question is the only thing that decides. A number in the wrong units is the loudest possible signal that you are halfway — and it costs about four seconds to check." },
          { text: "If it took a calculation, it is the answer", correct: false,
            why: "The transfer always takes a calculation. That is what makes it a transfer rather than a given, so this test would call every one of them finished." },
          { text: "If the number looks sensible, it is the answer", correct: false,
            why: "It will look sensible. It is a correct number about a real thing in the story — that is exactly why stopping there is so easy to do." }
        ]
      }
    },

    {
      short: "When it answers twice",
      art: "twotrue",
      eyebrow: "Reading the signal",
      heading: "Two right answers means something",
      body:
        "<p>On a crossover problem the checklist will sometimes accept two different answers to the same " +
        "question, and both of them will be correct.</p>" +
        "<p>Ask <em>are these the same kind of thing?</em> about a story whose first half compares two times " +
        "and whose second half sets miles against minutes, and the honest answer is <strong>both</strong>. " +
        "The first half is one kind of stuff. The second half is two kinds locked together. Neither reading " +
        "is a mistake; each is right about its own end of the story.</p>" +
        "<p class=\"hub-key\"><strong>Two true answers is not confusion. It is the story telling you it has a " +
        "middle.</strong></p>" +
        "<p>So when it happens, do not pick the one that feels safer and move on. Notice it, and let it send " +
        "you looking for the seam &mdash; because a story that answers the checklist two ways is a story made " +
        "of two situations, which is the last question on the list anyway.</p>",
      tap: {
        ask: "Which of these is the strongest sign you are looking at a crossover problem?",
        options: [
          { text: "The checklist gives you two answers you can both defend", correct: true,
            why: "It is the strongest sign because it comes from the structure rather than from the surface. You cannot get it from how the story is worded, only from what the story is doing." },
          { text: "The problem is long", correct: false,
            why: "Length is about how much scenery there is. Plenty of long problems are one situation with a lot of description, and a crossover can be five short sentences." },
          { text: "There are lots of numbers in it", correct: false,
            why: "Some of the numbers in any problem are there to be ignored. How many there are says nothing about how many situations the story is made of." }
        ]
      }
    },

    {
      short: "Check yourself",
      kind: "checks",
      eyebrow: "No marks, no score",
      heading: "See what stuck",
      body:
        "<p>Nothing here is scored and nothing is recorded. Skip any of them, or leave the whole page " +
        "blank &mdash; the point is to find out what you would want to look at again.</p>",
      tap: {
        ask: "Last one. What is the first thing to do with a problem you think has a crossover in it?",
        options: [
          { text: "Find where the story changes what it is doing", correct: true,
            why: "Before naming either half and long before calculating anything. You cannot run the checklist on a half until you know where the halves are — which is why the island asks for the seam first too." },
          { text: "Work out the first number you can", correct: false,
            why: "That often gets you the transfer, which is genuinely useful — but done before you know the shape, you have no way of telling whether the number you have is the middle or the end." },
          { text: "Decide which of the five it is", correct: false,
            why: "That is the question with no single answer on a problem like this, and asking it first is what makes these feel impossible. Ask it twice instead, once on each side of the seam." }
        ]
      }
    }
  ],

  /* Free-text and unscored, checked with `MF.checkAnswer` so anything
     numerically equivalent passes. All three are ordinary single-situation
     arithmetic ON PURPOSE: the transfer is only ever the answer to a first
     half, and a two-line problem in a text box would be asking for the thing
     the island exists to ask for. */
  checks: [
    { q: "The early ferry takes 55 minutes and the late one takes 38. How many minutes apart are they?", a: "17" },
    { q: "The lamp burns 4 litres of oil every 3 hours. How many litres in 12 hours?", a: "16" },
    { q: "A crossing is 9 miles. The boat does 3 miles every 10 minutes. How many minutes for the crossing?", a: "30" }
  ],

  closing: "A crossover problem is two situations you already know, joined by one number that nobody gives you. Find where the story changes, run the same five questions on each side of it, and work out what gets carried across — then it is two ordinary problems, in an order."
});
