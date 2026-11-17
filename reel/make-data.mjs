import {readFileSync, writeFileSync} from 'node:fs';

const t = JSON.parse(readFileSync('reel/analysis/transcript.json', 'utf8'));

// Split long whisper segments into caption-sized chunks (max 4 words or 0.3s pause).
const phrases = [];
for (const seg of t.segments) {
  let chunk = [];
  const flush = () => {
    if (!chunk.length) return;
    phrases.push({
      start: +chunk[0].s.toFixed(2),
      end: +chunk[chunk.length - 1].e.toFixed(2),
      text: chunk.map((w) => w.w).join(' '),
      words: chunk.map((w) => ({w: w.w, s: +w.s.toFixed(2), e: +w.e.toFixed(2)})),
    });
    chunk = [];
  };
  for (const w of seg.words) {
    if (chunk.length >= 4) flush();
    else if (chunk.length && w.s - chunk[chunk.length - 1].e > 0.3) flush();
    chunk.push(w);
  }
  flush();
}
phrases.forEach((p, i) => (p.i = i));

const body = `// generated from reel/analysis/transcript.json — do not edit by hand
export type Word = {w: string; s: number; e: number};
export type Phrase = {i: number; start: number; end: number; text: string; words: Word[]};

export const PHRASES: Phrase[] = ${JSON.stringify(phrases, null, 1)};
`;
writeFileSync('src/previews/data.ts', body);
console.log(`${phrases.length} phrases -> src/previews/data.ts`);
console.log(phrases.slice(0, 4).map((p) => `${p.start}-${p.end} ${p.text}`).join('\n'));
