# 🚂 Mr Fraction's Word Problem Express

An interactive site that teaches students how to **start** a maths word problem — read it, work out what kind of situation it describes, plan it, solve it, check it. Built around a veteran train conductor whose railway has one line for each way a word problem can be put together.

🔗 **Live site:** **<https://jtaylor-cloud.github.io/MrFractionWordProblemExpress/>**

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

## What it does

Students who struggle with word problems usually are not bad at arithmetic. They are stuck earlier — at understanding what the story says, representing it, and knowing whether their answer makes sense. So the site spends nearly all its effort *before* the arithmetic starts.

A **trip** is a run of stations along one line. Each station teaches a different strategy, and each problem is worked through up to ten screens:

| Screen | What the student does |
|---|---|
| **Read 1** | Says what the story is about — with every number hidden |
| **Platform Check** | Taps the sentences carrying the evidence, then sees where the problem sits on the map |
| **Read 2** | Picks out which quantities matter and which are scenery |
| **Read 3** | Names what the question is actually asking for |
| **Ticket Booth** | Works out which piece of the problem is missing |
| **Plan** | Builds a picture of the relationship — a bar, a ratio table, a train, a tray, a number line |
| **Test Track** | Watches the strategy demonstrated on different numbers, then answers two questions about their own — on 24 of the 37 |
| **Engine Room** | Does the arithmetic, one step at a time, with a hint ladder. A near miss is told apart from a wrong turn: land close and it says the plan is probably right and the working slipped, and points at the calculation rather than back at the plan |
| **Arrivals Board** | Checks the answer against their own estimate, the question, the units and common sense |
| **Critique** | Reads somebody else's wrong answer and works out which mistake produced it — the student diagnosing, instead of being diagnosed |

Every trip ends at a **Terminus Hub**: one fresh problem with no scaffolding at all, where the student chooses their own approach and says why.

On [Crossover Island](#crossover-island) the Platform Check is replaced by the **Crossover Read**, which runs the same five questions twice — once on each half of a two-situation problem.

## The five lines

Nearly every word problem in grades 6–12 is one of five structures. Recognising which one you are looking at is the highest-leverage skill on the site.

| Line | Structure | Covers |
|---|---|---|
| ■ **Compare** | `Larger − Smaller = Difference` | Comparison, multiplicative comparison, percent comparison |
| ▲ **Equal Groups** | `Groups × Size = Total` | Multiplication, division, fraction division |
| ◆ **Ratio & Rate** | `Rate × Time = Distance` | Proportions, unit rates, speed, percent as a rate |
| ● **Change** | `Start ± Change = Result` | Join and separate, running totals, percent increase, reverse percent |
| ⬢ **Part–Whole** | `Part + Part = Whole` | Fractions of a quantity, percent of a whole |

**37 problems, four number sets each** — 148 materialisations in all, so meeting the same problem twice gives different numbers.

The unifying metaphor: **a word problem is a train with a missing car.** Same line, same structure — but *which* car is missing is what makes it easy or hard. That is how the site scales from grade 6 to grade 12 without changing framework, and how algebra can arrive later as "the missing car finally gets a name" rather than as a new subject.

## Special lines

Ways of travelling *across* the five, rather than situations of their own.

| | |
|---|---|
| ✳ **The Grand Tour** | A mixed ride drawing from every line. You are not told which situation is coming. |
| % **The Percent Line** | Five problems spread over four lines, with its own colour, marker and picture. |
| ✦ **The Challenge Line** | Seven problems that each join two situations. Crosses to its own island map. |

### Why percent is a route and not a sixth line

A percentage is a way of *writing* a number, like a fraction or a decimal — so it can sit on top of any of the five situations. Making it a sixth line would put a notation beside four structures, and would teach students that a `%` sign tells you where to go.

So the Percent Line gets everything a line has — a card, a colour, its own Plan model (a double number line), its own Learning Hub — and its Ticket Booth then asks **which of the five is hiding under the per cent.** Arriving there is the start of the question rather than the end of it.

## Crossover Island

Pressing the Challenge Line does not start a trip. It **crosses to a second map** — an island with a coast, three rivers, a lake, one circuit of track and a lighthouse — carrying seven problems that each join two of the five situations end to end.

The idea the whole island turns on has a name:

> **The transfer** — the one value the first situation hands to the second. It is an *answer* on one side of the problem and a *given* on the other.

That is also where the marks go missing. Working the first half out correctly and stopping there is the commonest way to lose one of these: the number is right, the student found it themselves, and it feels finished. It answers a question nobody asked.

| | |
|---|---|
| **The Crossover Read** | Replaces the Platform Check. Find the seam where the story changes what it is doing, then run **the same five questions on each half** and get two different answers |
| **A two-picture Plan phase** | The first model, a slot naming what crosses, then the second model drawn *waiting* — because until the transfer exists, nothing in it can be known |
| **Five stops, all open** | Three staffed platforms and two unstaffed halts. Nothing is locked and nothing is scored; the halts differ only in how much scaffolding they give |
| **Pooling** | Two stops hold two problems each and draw at random, so a second visit differs by problem and not only by numbers |

The lesson meant to outlast the island is on the third page of its hub: **the checklist does not classify a *problem*, it classifies a *stretch of story*.** It has always worked on whole problems because, until here, whole problems were one situation.

## Learning Hubs

Five of them, open from the first screen, never gated and never scored. Each is a paged journey: one topic per screen, a rail across the top to jump anywhere, a diagram and something to do on every page.

| Hub | What it teaches |
|---|---|
| **Five Situations** | How to tell the five apart, and the two that get mixed up most |
| **The Word Board** | The vocabulary of word problems, in three tiers — words that name an operation, words that ask a question, and rules that lie |
| **The Fraction Yard** | Fractions, factors and common denominators, with a tool that lists them |
| **The Percent Yard** | Per hundred, percent *of what*, the three sub-types, and reverse percent |
| **The Lighthouse** | Problems with a middle: where a story stops doing one thing and starts another, and what gets carried across |

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

The map reflows twice rather than once. Above 900px the five lines sit **three then two, centred**, on a 920px column shared by the line cards, the special lines, the hubs and the closing strip, so every block on the page lines up. Between 620 and 900 it goes two abreast, with any odd card centred rather than left stranded at the end of a row. Below 620 it is a single column.

Verified at 320px and 375px across every screen: no horizontal scrolling, and no touch target below 44px.

## Tech

Zero dependencies, no build step, no framework, no network requests. HTML, CSS and vanilla JavaScript. Fonts and every illustration are in the repository, so the site works offline and on a locked-down school network.

> **Why the problem files are `.js` and not `.json`:** browsers block `fetch()` on `file://` URLs, so a site that must also run by double-clicking cannot load JSON at runtime. Each problem file is one `MF.registerProblem({ … })` call wrapping exactly the documented schema object.

## Running it

**Open `index.html` in any modern browser.** That is the whole install — no server, no port, no build.

To publish, upload the repository and set **Settings → Pages → Source** to the **repository root**.

> Choose the repository root, not the `/docs` folder option GitHub offers alongside it. `index.html` lives at the root; pointing Pages anywhere else publishes no site.

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

This covers the site, its word problems, its illustrations and the Mr Fraction character.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

### Typefaces

The three bundled typefaces are licensed separately by their own authors and are **not** covered by the licence above. All three are under the [SIL Open Font License 1.1](https://openfontlicense.org/), and all three are in `assets/fonts/` rather than fetched from a font service — which is what lets the site run offline, on `file://`, and on a locked-down school network.

| Typeface | Used for | Licence |
|---|---|---|
| **Atkinson Hyperlegible** — Braille Institute of America | Body text, everywhere | SIL OFL 1.1 |
| **Black Han Sans** | Display: station names, line cards, headings | SIL OFL 1.1 |
| **Libre Baskerville** | Mr Fraction's asides | SIL OFL 1.1 |

Atkinson Hyperlegible is the body face for a reason rather than for looks: it was drawn for low-vision readers, so the pairs that usually collapse into each other — `l`/`I`/`1`, `O`/`0`, `b`/`d` — stay distinguishable.
