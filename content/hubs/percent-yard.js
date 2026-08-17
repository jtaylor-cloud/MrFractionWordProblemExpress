/* Learning Hub — The Percent Yard.
   ROADMAP.md §3b, built 2026-08-10 once the percent card was complete.

   THE ONE THING THIS HUB MUST NOT DO IS TEACH PERCENT AS A SIXTH SITUATION.
   That is the risk §3 spent a page on and called the serious one: a student who
   learns "percent problems go on the Percent Line" has been handed a rule of
   the form SEE THIS SYMBOL, GO HERE — a keyword strategy with extra steps, and
   worse than an ordinary keyword because it is always true and so never gets
   falsified. This whole site exists to break rules of that shape.

   So the hub is built to say the opposite, structurally rather than in a
   disclaimer:

     - the three SUB-TYPE pages reuse the `change`, `compare` and `partwhole`
       diagrams from the Five Situations hub, unchanged. The argument is made in
       pictures before it is made in words: these are the same five shapes with
       a per cent sign laid over them.
     - the last teaching page is the thesis, not an afterthought.
     - every page that names a sub-type ends by pointing at the structure
       underneath it rather than at the percentage on top.

   ITS RELATIONSHIP TO THE REST OF THE SITE is the one the Word Board has to
   Five Situations: READ IT HERE, DECIDE IT THERE. This hub teaches what a
   percentage is and what it is a percentage OF. Deciding which of the five a
   percent problem actually is happens at the Ticket Booth, which asks exactly
   that on the percent route and on the Grand Tour.

   THE ORDER IS FROM §3b AND IT MATTERS. A number in disguise (per hundred)
   first, because nothing else makes sense until per cent means per hundred.
   Then PERCENT OF WHAT, which is this surface's crux and the thing every one of
   the five percent problems turns on. Only then the three sub-types, and last
   the one that breaks people.

   NOTHING HERE IS GATED AND NOTHING IS SCORED. Locked decision. */
MF.registerHub({
  id: "percent-yard",
  name: "The Percent Yard",
  blurb: "What a percentage actually is, what it is always a percentage OF, and why per cent is never a kind of problem on its own.",
  welcome: "Per cent means per hundred. That is the whole of it — and almost everything people get wrong about percentages comes from forgetting to ask what the hundred was made of.",

  pages: [
    {
      short: "Per hundred",
      art: "percenthundred",
      eyebrow: "Start here",
      heading: "A percentage is a number in disguise",
      body:
        "<p>Take the sign off and there is nothing frightening underneath. <strong>Per cent</strong> is two " +
        "old words stuck together, and they mean <strong>per hundred</strong> &mdash; for every hundred.</p>" +
        "<p>So <em>25%</em> is not a new kind of number. It is <strong>25 out of every 100</strong>, which " +
        "you could just as well write as a fraction or as a decimal. Same amount, three coats of paint.</p>" +
        "<p class=\"hub-key\"><strong>25% = 25 in every 100 = 25/100 = 0.25</strong></p>" +
        "<p>The picture above is a hundred cells with twenty-five of them shaded. That is all a percentage " +
        "ever is: a count out of a hundred. And because a hundred is easy to think about, percentages are " +
        "how people compare things that are not the same size &mdash; a hundred is a size everybody shares.</p>",
      tap: {
        ask: "A stall says 40% of the people who walk past stop to look. What does that tell you?",
        options: [
          { text: "Forty out of every hundred who walk past stop", correct: true,
            why: "Per cent means per hundred, read straight off. It is a rate — it says nothing yet about how many people actually walked past today, which is the other half of any question about it." },
          { text: "Forty people stopped", correct: false,
            why: "This is the commonest percentage error there is, and it will come back on nearly every page here. A percentage is not a count of anything until you say what it is a percentage OF." },
          { text: "The stall is forty times busier than usual", correct: false,
            why: "Nothing in it is about times as many, and nothing is about usual. Per cent means per hundred and only that." }
        ]
      }
    },

    {
      short: "Of what?",
      art: "percentline",
      eyebrow: "The question that runs through everything",
      heading: "Per cent of WHAT?",
      body:
        "<p>Here is the question this whole yard is built around, and if you take only one thing away, " +
        "take this.</p>" +
        "<p class=\"hub-key\"><strong>A percentage is always a percentage OF something. Find that " +
        "something before you do anything else.</strong></p>" +
        "<p>On its own, <em>35%</em> is not an amount. It is not seats, or pounds, or people. It only " +
        "becomes an amount once you have said <strong>35% of what</strong> &mdash; and the story always " +
        "tells you, usually in the word right after it.</p>" +
        "<p>The picture above is the tool for it, and you will meet it again at the Drafting Table. " +
        "<strong>Amounts along the top, percentages along the bottom, sharing one line.</strong> Whatever " +
        "the percentage is taken of goes at <strong>100%</strong>, because it is the whole hundred. Then " +
        "the mark tells you where you are, in both languages at once.</p>" +
        "<p>Almost every mistake anybody makes with percentages is this one: taking the percentage of the " +
        "wrong thing. Not the arithmetic. The referent.</p>",
      tap: {
        ask: "\"The buffet sold 20% more hot drinks than cold drinks.\" The 20% is 20% of what?",
        options: [
          { text: "The cold drinks", correct: true,
            why: "Whatever follows the word \"than\" is what the comparison is measured against, so the cold drinks are the whole hundred per cent. Notice you can answer this without knowing a single number." },
          { text: "The hot drinks", correct: false,
            why: "The hot drinks are the amount being measured, not the amount measured against — and they are the thing you would be trying to find, so a percentage of them would be no use even if the sentence meant it." },
          { text: "The two added together", correct: false,
            why: "Nothing in the sentence adds them. In a comparison the percentage is always of one of the two amounts, and the sentence tells you which by what follows \"than\"." }
        ]
      }
    },

    {
      short: "Of a whole",
      art: "partwhole",
      eyebrow: "Sub-type one",
      heading: "A percentage of a whole",
      body:
        "<p>The gentlest kind. There is a whole thing, and the percentage is a <strong>share of it</strong> " +
        "&mdash; so the whole is the hundred per cent, and what is left over is the rest of it.</p>" +
        "<p><em>\"The train has 240 seats. 35% of them are reserved.\"</em> The trainful is the hundred per " +
        "cent, the reserved seats are the share, and the seats anybody can sit in are what is left.</p>" +
        "<p>Look at the picture. That is the <strong>Part&ndash;Whole</strong> diagram, unchanged from the " +
        "Five Situations hub &mdash; because that is what this is. A whole cut into parts that add back up " +
        "to it. The per cent sign only tells you how the cut was described.</p>" +
        "<p>The trap on this kind is not the arithmetic, which is easy. It is finishing the wrong half: the " +
        "story describes one part and the question often asks for the other.</p>",
      tap: {
        ask: "35% of the 240 seats are reserved. You work out 84. What should you check before handing that in?",
        options: [
          { text: "Whether the question asked for the reserved seats or the rest", correct: true,
            why: "Right arithmetic, wrong half, is the commonest way to lose this kind of problem. 84 is the reserved seats; if the question asked how many anybody can sit in, the answer is 240 − 84 = 156." },
          { text: "Whether 35% of 240 is really 84", correct: false,
            why: "Worth checking, and it is correct. But checking your arithmetic will never catch answering the wrong question, and that is what actually goes wrong on this kind." },
          { text: "Nothing — 84 is the answer", correct: false,
            why: "It might be. It depends entirely on what was asked, which is exactly the point: on this kind you have to finish by naming which part you were asked for." }
        ]
      }
    },

    {
      short: "A change",
      art: "change",
      eyebrow: "Sub-type two",
      heading: "A percentage change",
      body:
        "<p>Now one amount at <strong>two moments</strong>, with the change between them described in per " +
        "cent. <em>\"A monthly pass cost 80 pounds. Fares went up by 15%.\"</em></p>" +
        "<p>That picture is the <strong>Change</strong> diagram, unchanged. Start, something happens, " +
        "result. Percent only describes the middle car.</p>" +
        "<p class=\"hub-key\"><strong>A rise or a fall is always measured from where the story STARTED.</strong></p>" +
        "<p>That sentence is the whole of this sub-type, and it is the referent question again wearing " +
        "different clothes. The 15% is 15% of the OLD price &mdash; not of the new one, and not of the two " +
        "of them together. The old price is the hundred per cent, and the new price runs past it.</p>" +
        "<p>Which means something worth noticing: after a 15% rise, the new price is <strong>115%</strong> " +
        "of the old one. The hundred per cent has not gone anywhere. You have just gone past it.</p>",
      tap: {
        ask: "A pass cost 80 pounds and fares went up 15%. Which is the whole hundred per cent?",
        options: [
          { text: "The 80 pounds — what it cost before", correct: true,
            why: "A rise is measured from where you started, so the old price is the hundred per cent and the new price sits past it at 115%. Get this the wrong way round and every percent change goes wrong." },
          { text: "What it costs now", correct: false,
            why: "That is the amount you are looking for, and it is bigger than the hundred per cent rather than equal to it. Fares go up FROM what they were, not from what they become." },
          { text: "The 15%", correct: false,
            why: "The 15% is the size of the change, not an amount for anything to be a percentage of. It is the mark on the line, not the end of it." }
        ]
      }
    },

    {
      short: "A comparison",
      art: "compare",
      eyebrow: "Sub-type three",
      heading: "A percentage comparison",
      body:
        "<p>Two different things, both there at the same time, and the gap between them measured in per " +
        "cent instead of in ones. <em>\"The buffet sold 20% more hot drinks than cold drinks.\"</em></p>" +
        "<p>That is the <strong>Compare</strong> diagram, unchanged. Two amounts side by side and the gap " +
        "between them &mdash; the only difference is that the gap is described as a share of one of them " +
        "rather than counted out.</p>" +
        "<p>And that is exactly why this kind makes the referent question unavoidable. <em>\"Seven more\"</em> " +
        "you could count off without thinking. <em>\"20% more\"</em> is not a number of anything at all " +
        "until you have said <strong>more than what</strong> &mdash; so the sentence forces you to find the " +
        "referent before you can even start.</p>" +
        "<p>Notice how this differs from a change, because they look alike and are not. In a change there " +
        "is <strong>one</strong> amount at two moments. In a comparison there are <strong>two</strong> " +
        "amounts at one moment, and neither of them ever turns into the other.</p>",
      tap: {
        ask: "What tells you a story is a comparison rather than a change?",
        options: [
          { text: "Both amounts exist at the same time", correct: true,
            why: "That is the test, and it is about the story rather than the wording. Hot drinks and cold drinks both got sold on the same day. In a change, the old price does not exist any more — it turned into the new one." },
          { text: "It uses the word \"more\"", correct: false,
            why: "Both kinds use it constantly. \"20% more hot drinks than cold\" is a comparison and \"fares went up, so it costs more\" is a change — the word is the same and the situations are not." },
          { text: "The percentage is bigger", correct: false,
            why: "Nothing about the size of the percentage tells you what kind of story it is. A 5% comparison and a 50% change are both perfectly ordinary." }
        ]
      }
    },

    {
      short: "Backwards",
      art: "percentreverse",
      eyebrow: "The hard one",
      heading: "Reverse percent, and why it catches everybody",
      body:
        "<p>This is the one that breaks people, and it is worth slowing down for.</p>" +
        "<p><em>\"Saturdays are 20% busier since the footbridge opened. Last Saturday 660 people came " +
        "through. How many came through before?\"</em></p>" +
        "<p>The tempting move is to take 20% off the 660. It gives 528, which looks like a perfectly " +
        "reasonable answer. <strong>It is wrong, and nothing about it looks wrong</strong> &mdash; there is " +
        "no arithmetic slip to spot and no absurd number to catch it.</p>" +
        "<p>Look at the picture and you can see why. The 20% was measured from the <strong>quieter</strong> " +
        "Saturday, so the quieter Saturday is the hundred per cent &mdash; and it is the thing you do not " +
        "know. The 660 you were handed is not sitting at the hundred. It is out at 120%.</p>" +
        "<p class=\"hub-key\"><strong>Taking 20% off the finish does not undo adding 20% to the start, " +
        "because the finish is the bigger amount.</strong></p>" +
        "<p>The way through is the same question as always. Which amount is the hundred per cent? Put that " +
        "at 100 on the line, put what you were given where it actually belongs, and the picture stops " +
        "lying to you.</p>",
      tap: {
        ask: "After a 20% rise, a fare is 60 pounds. Someone takes 20% off 60 and gets 48. What is wrong with it?",
        options: [
          { text: "The 20% was of the old fare, and 60 is not the old fare", correct: true,
            why: "Exactly. 20% of 60 is a bigger piece than 20% of the smaller amount it was actually measured from — so too much comes off. The old fare was 50: add 20% of 50, which is 10, and you land on 60." },
          { text: "You should have taken 20% off twice", correct: false,
            why: "There is nothing in the story about doing it twice. The problem is not how many times — it is which amount the percentage belongs to." },
          { text: "Nothing — 48 is right", correct: false,
            why: "It is not, and this is why the mistake survives: 48 looks entirely plausible. Check it forwards — add 20% to 48 and you get 57.60, not 60. Replaying the story forwards is what catches this every time." }
        ]
      }
    },

    {
      short: "Not a situation",
      art: "percentover",
      eyebrow: "The point of the whole yard",
      heading: "Per cent is not a kind of problem",
      body:
        "<p>Look back at the last four pages and notice what the pictures were doing.</p>" +
        "<p>The whole page, the change, the comparison &mdash; those diagrams were not new. They are the " +
        "<strong>same five situations</strong> from the Five Situations hub, borrowed unchanged. Per cent " +
        "did not replace any of them. It sat on top.</p>" +
        "<p class=\"hub-key\"><strong>Per cent is a way of WRITING a number, like a fraction or a decimal. " +
        "It is not a thing that happens in a story.</strong></p>" +
        "<p>Fractions do not get their own line, and neither does this. Every percent problem is really one " +
        "of the five wearing a per cent sign &mdash; so the question <em>\"what kind of problem is this?\"</em> " +
        "has the same five answers it always had, and the percentage is not one of them.</p>" +
        "<p>This is why the Percent Line on the map is a <strong>route</strong> and not a sixth line, and " +
        "why arriving at it is the <em>start</em> of a question rather than the end of one. At the ticket " +
        "booth on any percent problem you will be asked which of the five is hiding underneath &mdash; and " +
        "the per cent sign will not help you answer it. Reading the story will.</p>" +
        "<p><strong>Read it here. Decide it there.</strong></p>",
      tap: {
        ask: "A problem has a per cent sign in it. What does that tell you about which of the five situations it is?",
        options: [
          { text: "Nothing at all — you still have to read the story", correct: true,
            why: "That is the honest answer and it is the whole point of this hub. Per cent describes how a number is written. What is happening to the amounts is a completely separate question, and only the story answers it." },
          { text: "That it goes on the Percent Line", correct: false,
            why: "This is the trap this hub was built to head off. The Percent Line is a route across the other five, not a situation — so \"it goes there\" tells you nothing about what to DO, which is the thing you needed." },
          { text: "That it is probably a Part–Whole problem", correct: false,
            why: "Often true, and that is what makes it dangerous. Percent sits on Change, Compare and Ratio just as happily — the five percent problems on this site are spread across four different lines on purpose." }
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
        ask: "One last one. What is the first thing to do with any percentage, on any problem?",
        options: [
          { text: "Work out what it is a percentage OF", correct: true,
            why: "Every page in this yard came back to it. The referent first, the arithmetic afterwards — and if you only remember one thing from here, remember that this question comes first." },
          { text: "Turn it into a decimal", correct: false,
            why: "Useful, and often the next thing you do. But a decimal of the wrong amount is just as wrong as a percentage of it — converting does not tell you what to convert it against." },
          { text: "Divide it by a hundred", correct: false,
            why: "That is the same move as turning it into a decimal, and it has the same problem: it is a step you take AFTER you know what the hundred was made of." }
        ]
      }
    }
  ],

  /* Free-text, unscored. Answers are checked with `MF.checkAnswer`, so anything
     numerically equivalent passes — a student who writes 0.25 where we expected
     25% has not got it wrong. */
  checks: [
    { q: "25% of 80 seats. How many seats?", a: "20" },
    { q: "A fare of 40 pounds goes up by 10%. What does it cost now?", a: "44" },
    { q: "After a 25% rise, a fare is 50 pounds. What was it before?", a: "40" }
  ],

  closing: "Per cent means per hundred, and a percentage is always a percentage OF something — find that something first, every time. What KIND of problem you are looking at is a different question, and the per cent sign will never answer it for you."
});
