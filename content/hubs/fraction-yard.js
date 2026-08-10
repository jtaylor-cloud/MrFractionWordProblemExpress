/* Learning Hub — a detour, never a demotion (Pedagogy non-negotiable #11) */
MF.registerHub({
  id: "fraction-yard",
  name: "The Fraction Yard",
  blurb: "What the top and bottom numbers actually do. Five minutes.",
  welcome: "Come in. Half the trouble people have with these lines isn't the word problems at all — it's that nobody ever told them plainly what the two numbers in a fraction are for.",

  /* PAGED 2026-08-09, the last hub to move. Same reason as the other two: this
     was six sections, a tool and four self-checks on one scroll, on a site whose
     students are told a dense paragraph is a barrier before any maths begins.

     The Shunting Yard now has a page to itself, and the self-checks have their
     own page at the end — both `kind`s live in hub.js, and the tool moved there
     out of app.js so there is one copy of it rather than one per renderer.

     Every page gained a tap. The taps are not decoration: each one is the
     misconception that page exists to break, asked back. The fifths-and-quarters
     page asks for 3/9, because that is what a student who has not understood it
     will reach for, and answering it wrong is the fastest way to find out. */
  pages: [
    {
      short: "Cut and count",
      eyebrow: "Start here",
      heading: "The bottom number cuts. The top number counts.",
      body:
        "<p>That's it. That's the whole thing.</p>" +
        "<p>In <strong>3/4</strong>, the <strong>4</strong> says <em>cut the whole into 4 equal pieces</em>. " +
        "The <strong>3</strong> says <em>now take 3 of them</em>.</p>" +
        "<p>So to find three quarters of 12 cups, you cut 12 into 4 pieces (that's 3 cups each), " +
        "then take 3 of those pieces: 9 cups.</p>" +
        "<p>Cut, then count. In that order, every time.</p>",
      tap: {
        ask: "In 2/5, what is the 5 telling you to do?",
        options: [
          { text: "Cut the whole into 5 equal pieces", correct: true,
            why: "The bottom number always cuts. Then the 2 on top counts out 2 of those pieces." },
          { text: "Take 5 pieces", correct: false,
            why: "That is the top number's job. The bottom one cuts the whole up; the top one counts how many of the pieces you take." },
          { text: "Multiply by 5", correct: false,
            why: "Not quite — cutting into 5 is a division, not a multiplication. To find 2/5 of 20 you cut 20 into 5 pieces of 4, then take 2 of them." }
        ]
      }
    },
    {
      short: "Bigger bottom",
      eyebrow: "The upside-down bit",
      heading: "Why bigger bottom numbers mean smaller pieces",
      body:
        "<p>Cut a chocolate bar into 4 pieces and each one is decent. Cut the same bar into " +
        "20 pieces and each one is tiny.</p>" +
        "<p>So <strong>1/20 is smaller than 1/4</strong>, even though 20 is a bigger number than 4. " +
        "This trips people up constantly, and it isn't because they're slow — it's because it's " +
        "genuinely the opposite of how numbers usually work.</p>",
      tap: {
        ask: "Which is bigger: 1/8 or 1/3?",
        options: [
          { text: "1/3", correct: true,
            why: "Cutting something into 3 gives bigger pieces than cutting it into 8. The bigger bottom number makes the SMALLER piece." },
          { text: "1/8", correct: false,
            why: "The trap, and a fair one — 8 is a bigger number than 3. But 8 is how many pieces you cut the whole into, and more pieces means each one is smaller." },
          { text: "They're the same", correct: false,
            why: "They would only be the same if the wholes were different sizes. Cut the same bar two ways and thirds are always fatter than eighths." }
        ]
      }
    },
    {
      short: "Matching pieces",
      eyebrow: "The commonest mistake",
      heading: "Why you can't add fifths to quarters",
      body:
        "<p>You can only add pieces that are the same size.</p>" +
        "<p><strong>2/5 + 1/4</strong> can't be done as it stands — fifths and quarters are different-sized " +
        "pieces. Adding the tops and bottoms to get 3/9 is the single most common mistake in this " +
        "whole yard, and it gives you an answer that's simply not the same amount.</p>" +
        "<p>Find a size they both fit into. Fifths and quarters both fit into <strong>twentieths</strong>:</p>" +
        "<p>2/5 = <strong>8/20</strong> &nbsp;·&nbsp; 1/4 = <strong>5/20</strong> &nbsp;·&nbsp; " +
        "8/20 + 5/20 = <strong>13/20</strong></p>" +
        "<p>Same-sized pieces, now you can just count them.</p>",
      tap: {
        ask: "What is 1/5 + 1/4?",
        options: [
          { text: "9/20", correct: true,
            why: "Both fit into twentieths: 1/5 is 4/20 and 1/4 is 5/20, so together they make 9/20. Same-sized pieces, then just count." },
          { text: "2/9", correct: false,
            why: "This is the single most common mistake in the whole yard — adding the tops and the bottoms. Check it against sense: 2/9 is smaller than 1/4 on its own, and adding something cannot make it shrink." },
          { text: "1/9", correct: false,
            why: "That has added the bottoms and kept a top. Fifths and quarters are different-sized pieces, so neither number can be added directly — they have to be rewritten in the same size first." }
        ]
      }
    },
    {
      short: "Backwards",
      eyebrow: "The hard direction",
      heading: "Going backwards: from a part to the whole",
      body:
        "<p>Sometimes you're told a part and asked for the whole. <em>21 shots is three fifths of the total — " +
        "how many altogether?</em></p>" +
        "<p>Run the rule in reverse. Three parts are worth 21, so <strong>one</strong> part is 21 ÷ 3 = 7. " +
        "A whole is five parts, so 5 × 7 = <strong>35</strong>.</p>" +
        "<p>Useful check: when the whole is what's missing, your answer has to come out " +
        "<strong>bigger</strong> than the part you started with. If it comes out smaller, you've gone the " +
        "wrong way — and now you know before anyone marks it.</p>",
      tap: {
        ask: "12 is 3/4 of a number. Before working it out — is the answer bigger or smaller than 12?",
        options: [
          { text: "Bigger", correct: true,
            why: "12 is only part of it, so the whole has to be more. That one thought rules out most wrong answers before you calculate anything — and the answer is 16." },
          { text: "Smaller", correct: false,
            why: "That would mean a part is bigger than the thing it came out of. When the WHOLE is missing, your answer always comes out bigger than the part you were given." },
          { text: "You can't tell until you calculate", correct: false,
            why: "You can, and it is worth doing every time. 12 is a part; the whole is more than any of its parts. Estimating the direction first is how you catch a wrong answer before anyone marks it." }
        ]
      }
    },
    {
      short: "GCF vs LCD",
      eyebrow: "Two jobs, often confused",
      heading: "Two jobs people mix up: GCF and LCD",
      body:
        "<p>Both are about numbers that two fractions have in common, and they get confused constantly " +
        "because they sound alike. They do <strong>opposite</strong> jobs.</p>" +
        "<p><strong>The GCF makes a fraction simpler.</strong> The greatest common factor is the biggest " +
        "number that divides into both top and bottom. In <strong>8/20</strong>, both 8 and 20 divide by 4, " +
        "so 8/20 = <strong>2/5</strong>. Same amount, tidier writing.</p>" +
        "<p><strong>The LCD lets you add.</strong> The lowest common denominator is the smallest number " +
        "both bottoms divide into. To add 2/5 and 1/4 you need a size of piece they both fit: " +
        "<strong>20</strong>. Then 2/5 = 8/20, 1/4 = 5/20, and 8/20 + 5/20 = <strong>13/20</strong>.</p>" +
        "<p>One sentence to keep them apart: <strong>the GCF makes the numbers smaller; the LCD makes " +
        "the pieces match.</strong> You cannot add until the pieces match, and you cannot tidy up until " +
        "you look for a shared factor.</p>",
      tap: {
        ask: "You want to add 3/8 and 1/6. Which do you need?",
        options: [
          { text: "The LCD — a size of piece they both fit into", correct: true,
            why: "Adding needs matching pieces, and that is the LCD's job. Eighths and sixths both fit into twenty-fourths." },
          { text: "The GCF — the biggest number that divides both", correct: false,
            why: "The GCF is for TIDYING a fraction up, not for adding two. It makes the numbers smaller; it does not make the pieces match." },
          { text: "Neither — just add the tops and bottoms", correct: false,
            why: "That gives 4/14, which is not the same amount as either fraction plus the other. Different-sized pieces cannot be counted together until they are rewritten to match." }
        ]
      }
    },
    {
      short: "Finding them",
      eyebrow: "Method",
      heading: "How to find them without guessing",
      body:
        "<p><strong>GCF.</strong> List what divides into each number, and take the biggest one on both lists. " +
        "For 8 and 20: 8 goes 1, 2, 4, 8. 20 goes 1, 2, 4, 5, 10, 20. Both lists have 1, 2 and 4 — " +
        "so the greatest is <strong>4</strong>.</p>" +
        "<p><strong>LCD.</strong> Count up in each number until you hit the same one. " +
        "Fifths: 5, 10, 15, <strong>20</strong>. Quarters: 4, 8, 12, 16, <strong>20</strong>. " +
        "First match is 20.</p>" +
        "<p>A shortcut that always works but is not always smallest: multiply the two bottoms together. " +
        "5 × 4 = 20, which here happens to be the smallest too. For 4 and 6 it gives 24 when 12 would do — " +
        "the answer is still right, just with bigger numbers to tidy up afterwards.</p>" +
        "<p>The next page does the listing for you, so you can see the shared numbers rather than " +
        "hunting for them.</p>",
      tap: {
        ask: "For 4 and 6, multiplying the bottoms gives 24. Is that wrong?",
        options: [
          { text: "No — it works, it's just not the smallest", correct: true,
            why: "24 is a perfectly good common denominator and the answer will be right. 12 would do the same job with smaller numbers to tidy up afterwards." },
          { text: "Yes — only the smallest one works", correct: false,
            why: "A common misunderstanding. Any size both fit into will let you add; the LOWEST one just saves you simplifying at the end." },
          { text: "Yes — you should add them instead", correct: false,
            why: "4 + 6 = 10, and sixths do not fit into tenths. Multiplying always gives a size both fit into; adding does not." }
        ]
      }
    },
    {
      short: "The Yard",
      kind: "tool",
      eyebrow: "Try it",
      heading: "The Shunting Yard",
      body:
        "<p>Put in the two bottom numbers and watch both lists appear. The numbers they " +
        "<strong>share</strong> are highlighted &mdash; that is what you have been hunting for by hand.</p>" +
        "<p>Try <strong>5 and 4</strong> first, then <strong>4 and 6</strong> to see a pair whose lowest " +
        "match is smaller than multiplying them would give.</p>"
    },
    {
      short: "Check yourself",
      kind: "checks",
      eyebrow: "No marks, no record",
      heading: "See what stuck",
      body:
        "<p>Four questions covering the whole yard. Nothing here is scored or saved &mdash; it is a " +
        "mirror, not a test. Leave any of them blank and nothing will be counted against you.</p>"
    }
  ],

  checks: [
    { q: "What is 2/3 of 15?", a: "10" },
    { q: "Which is bigger, 1/8 or 1/3?", a: "1/3" },
    { q: "What is 1/2 + 1/3? (Write it as a fraction.)", a: "5/6" },
    { q: "12 is 3/4 of a number. What is the number?", a: "16" }
  ]
});
