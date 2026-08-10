# 🚂 Mr Fraction's Word Problem Express

An interactive site that teaches students how to **start** a maths word problem — read it, work out what kind of situation it describes, plan it, solve it, check it. Built around a veteran train conductor whose railway has one line for each way a word problem can be put together.

🔗 **Live site:** _add your GitHub Pages URL here once published_

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## What it does

Students who struggle with word problems usually are not bad at arithmetic. They are stuck earlier — at understanding what the story says, representing it, and knowing whether their answer makes sense. So the site spends nearly all its effort *before* the arithmetic starts.

A **trip** is a run of stations along one line. Each station teaches a different strategy, and each problem is worked through nine screens:

| Screen | What the student does |
|---|---|
| **Read 1** | Says what the story is about — with every number hidden |
| **Platform Check** | Taps the sentences carrying the evidence, then sees where the problem sits on the map |
| **Read 2** | Picks out which quantities matter and which are scenery |
| **Read 3** | Names what the question is actually asking for |
| **Ticket Booth** | Works out which piece of the problem is missing |
| **Plan** | Builds a picture of the relationship — a bar, a ratio table, a train, a tray, a number line |
| **Test Track** | Watches the strategy demonstrated on different numbers, then answers two questions about their own |
| **Engine Room** | Does the arithmetic, one step at a time, with a hint ladder |
| **Arrivals Board** | Checks the answer against their own estimate, the question, the units and common sense |

Every trip ends at a **Terminus Hub**: one fresh problem with no scaffolding at all, where the student chooses their own approach and says why.

## The five lines

Nearly every word problem in grades 6–12 is one of five structures. Recognising which one you are looking at is the highest-leverage skill on the site.

| Line | Structure | Covers |
|---|---|---|
| ■ **Compare** | `Larger − Smaller = Difference` | Comparison, multiplicative comparison, percent comparison |
| ▲ **Equal Groups** | `Groups × Size = Total` | Multiplication, division, fraction division |
| ◆ **Ratio & Rate** | `Rate × Time = Distance` | Proportions, unit rates, speed, percent as a rate |
| ● **Change** | `Start ± Change = Result` | Join and separate, running totals, percent increase, reverse percent |
| ⬢ **Part–Whole** | `Part + Part = Whole` | Fractions of a quantity, percent of a whole |

**30 problems, four number sets each**, so meeting the same problem twice gives different numbers.

The unifying metaphor: **a word problem is a train with a missing car.** Same line, same structure — but *which* car is missing is what makes it easy or hard. That is how the site scales from grade 6 to grade 12 without changing framework, and how algebra can arrive later as "the missing car finally gets a name" rather than as a new subject.

## Special lines

Ways of travelling *across* the five, rather than situations of their own.

| | |
|---|---|
| ✳ **The Grand Tour** | A mixed ride drawing from every line. You are not told which situation is coming. |
| % **The Percent Line** | Five problems spread over four lines, with its own colour, marker and picture. |
| ✦ **The Challenge Line** | Problems needing two strategies at once. Shown on the map, under construction. |

### Why percent is a route and not a sixth line

A percentage is a way of *writing* a number, like a fraction or a decimal — so it can sit on top of any of the five situations. Making it a sixth line would put a notation beside four structures, and would teach students that a `%` sign tells you where to go.

So the Percent Line gets everything a line has — a card, a colour, its own Plan model (a double number line), its own Learning Hub — and its Ticket Booth then asks **which of the five is hiding under the per cent.** Arriving there is the start of the question rather than the end of it.

## Learning Hubs

Four of them, open from the first screen, never gated and never scored. Each is a paged journey: one topic per screen, a rail across the top to jump anywhere, a diagram and something to do on every page.

| Hub | What it teaches |
|---|---|
| **Five Situations** | How to tell the five apart, and the two that get mixed up most |
| **The Word Board** | The vocabulary of word problems, in three tiers — words that name an operation, words that ask a question, and rules that lie |
| **The Fraction Yard** | Fractions, factors and common denominators, with a tool that lists them |
| **The Percent Yard** | Per hundred, percent *of what*, the three sub-types, and reverse percent |

Visiting one is ordinary navigation, never an admission — which matters for students who have been tracked into remedial classes and can spot the framing instantly.

## Design priorities

- **Numbers are hidden on the first read.** You cannot see them until you have said what the story is about. This is meant to feel slightly annoying; it kills the grab-the-numbers-and-compute reflex.
- **No word is ever enough to choose an operation.** *Sum, product, quotient, per* **name** an operation — that is vocabulary. *More than, left, each, of* name the **situation** and hand you a question. The line: **a word may set the question; only structure sets the operation.**
- **Every picture stops before the arithmetic.** A bar, a table or a number line shows the relationship and leaves the answer as a question mark.
- **Wrong answers are diagnosed, not just marked.** Common mistakes are recognised by value and answered by name, so a student is told what they did rather than that they failed.
- **The trip report grades judgement, not correctness.** A student who chose well and slipped in arithmetic has learned more than one who guessed and got lucky, and the report says so in that order.

## Accessibility notes

- **Dyslexia provisions** are first-class: Atkinson Hyperlegible throughout, adjustable text size, line spacing and sentence chunking, all from a panel in the top bar.
- **Read-aloud** on every problem, including a masked reading that says "some number" rather than the value, so a student listening gets the same lesson as one reading.
- **Every animation has a reduced-motion pose.** Under `prefers-reduced-motion` the site freezes and each illustration still reads as a finished drawing.
- **Colour is never the only signal.** Current steps and answered states carry weight, shape and text as well.
- **WCAG 2.1 AA contrast**, verified by script across the palette.

## Mobile

Single column below 1000px, with the line cards regaining their full detail at phone width. Verified at 320px and 375px across every screen: no horizontal scrolling, and no touch target below 44px.

## Tech

Zero dependencies, no build step, no framework, no network requests. HTML, CSS and vanilla JavaScript. Fonts and every illustration are in the repository, so the site works offline and on a locked-down school network.

> **Why the problem files are `.js` and not `.json`:** browsers block `fetch()` on `file://` URLs, so a site that must also run by double-clicking cannot load JSON at runtime. Each problem file is one `MF.registerProblem({ … })` call wrapping exactly the documented schema object.

## Running it

**Open `index.html` in any modern browser.** That is the whole install — no server, no port, no build.

To publish, upload the repository and set **Settings → Pages → Source** to the **repository root**.

> Do not choose the `/docs` folder option. `docs/` here holds the design and pedagogy specs, not the website. Selecting it publishes the specs and no site.

### Image files required in `assets/art/`

All ten are referenced by the site and must be present, with **exactly this capitalisation** — GitHub Pages serves from Linux, which is case-sensitive, so a mis-typed capital works locally and 404s once live.

```
Conductor_Mr_Fraction_(Front).png
Conductor_Mr_Fraction_(Back).png
Conductor_Mr_Fraction_(Left_Side).png
Conductor_Mr_Fraction_(Right_Side).png
Conductor_Mr_Fraction_GIF.gif
Mr_Fraction_Train.png
Mr_Fraction_Train_Station.png
Mr_Fraction_Train_Ticket.png
Mr_Fraction_Ticket_Booth.png
Mr_Fraction_Caboose.png
```

> **After deploying, hard-refresh** (`Ctrl`/`Cmd` + `Shift` + `R`). Browsers and GitHub Pages both cache CSS and JavaScript aggressively, and a normal reload will happily show you the previous build.

## License

[Creative Commons Attribution–NonCommercial–ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — free to use and adapt for teaching, with attribution, non-commercially.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
