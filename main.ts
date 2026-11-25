// Make the AI Judge Laugh: Office Jokes — @hayunkarimun
// Scores candidate one-line office jokes against the judge brief, in the
// brief's own order, and writes the winner to /output/entry.txt.
// Criteria (weights follow the brief's order): real joke, unexpected turn,
// rings true about the office, tight wording, fresh take.

import { mkdirSync, writeFileSync } from "node:fs";

const OUT = process.env.MAKEFUN_OUTPUT_DIR || "/output";

type Candidate = { text: string; scores: number[] }; // scores: [real, turn, true, tight, fresh] each 0-5
const WEIGHTS = [5, 4, 3, 2, 1];

const CANDIDATES: Candidate[] = [
  {
    text: "HR said our open-plan office encourages collaboration. It mostly encourages headphones.",
    // Real joke, turn lands on the last word, true for anyone in an open plan, tight, fresh angle.
    scores: [5, 5, 5, 5, 4],
  },
  {
    text: "My boss called a meeting to discuss why we have too many meetings. It ran over, so we booked a follow-up.",
    // True and meta, but the meeting-about-meetings bit is a well-worn take.
    scores: [5, 4, 5, 3, 2],
  },
  {
    text: "I asked IT for a second monitor. They sent me a second ticket, and now I watch my request escalate in real time.",
    // Specific and true, but the turn is soft and it runs long.
    scores: [4, 3, 4, 3, 3],
  },
  {
    text: "The office plants are the only ones thriving here, and even they got put on a performance improvement plan.",
    // Good turn (plants on a PIP); the em dash in v1 broke the ASCII gate,
    // so it is a comma now. Still slower than the winner's setup.
    scores: [5, 4, 4, 4, 4],
  },
  {
    text: "I put 'per my last email' in my out-of-office reply so the emails know exactly how I feel.",
    // Punchy and true, but the turn is a shrug rather than a surprise.
    scores: [4, 3, 5, 5, 3],
  },
  {
    text: "My calendar invited me to a meeting about meetings, and the meeting about meetings got rescheduled.",
    // Rings true, but it is a premise with no real punchline.
    scores: [3, 2, 5, 4, 2],
  },
];

// Rejected drafts, kept for the record:
// - "This meeting could have been an email, so I emailed the meeting notes to the meeting." —
//   no turn, just a restatement of a tired complaint.
// - "Our synergy is so strong the printer jammed in solidarity." —
//   "synergy" as a punchline is a corporate cliché, not fresh.
// - "I work from home now, so my commute is the walk from my bed to my desk and I am still late." —
//   true, but the late-to-my-own-desk bit has been told a thousand times.

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function gate(text: string): void {
  if (!/^[\x00-\x7F]*$/.test(text)) throw new Error("entry must be plain ASCII");
  if (text.length < 1 || text.length > 199)
    throw new Error(`entry must be 1-199 chars, got ${text.length}`);
  if (text.trim().length === 0) throw new Error("entry must not be only whitespace");
  if (text.includes("\n")) throw new Error("entry must be a single line");
}

const ranked = [...CANDIDATES].sort((a, b) => total(b) - total(a));
for (const c of ranked) {
  console.log(`${total(c)}  (${c.text.length} chars)  ${c.text}`);
}
const winner = ranked[0];
gate(winner.text);
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/entry.txt`, winner.text);
console.log(`winner: ${winner.text.length} chars`);
