export const FPS = 30;
export const TOTAL = 1822; // 60.7s
export const W = 1280;
export const H = 720;

export type Mood = 'night' | 'day';

export const PALETTE = {
  night: {
    bg1: '#1B0B2E', // aubergine
    bg2: '#33095B', // electric violet
    deep: '#120A33', // midnight indigo
    a: '#C6FF3A', // lime
    b: '#4FE3F0', // aqua
    c: '#FF2D9B', // hot magenta
    ink: '#0A0620',
  },
  day: {
    bg1: '#FFE9A8', // pale yellow
    bg2: '#F4A261', // warm sand
    deep: '#2EC4B6', // teal
    a: '#B8F2D8', // mint
    b: '#2EC4B6',
    c: '#FF5D8F', // candy pink
    ink: '#3B1F3A',
  },
} as const;

export type Pal = (typeof PALETTE)[Mood];

// darken a hex colour by factor (0..1 => amount removed)
export const shade = (hex: string, f: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - f));
  const g = Math.round(((n >> 8) & 255) * (1 - f));
  const b = Math.round((n & 255) * (1 - f));
  return `rgb(${r},${g},${b})`;
};

export type Motif =
  | 'record' | 'sun' | 'portal' | 'cards' | 'cassette' | 'bolt' | 'puppet'
  | 'burst' | 'planet' | 'chair' | 'pupil' | 'flower' | 'phone' | 'cherry'
  | 'sphere' | 'puppet2' | 'moon' | 'drip' | 'tunnel' | 'ball' | 'wormhole'
  | 'strip' | 'glitch' | 'megaphone' | 'record2';

type Raw = {w: string; d: number};

// 111 words, word boundaries drive every cut
const RAW: Raw[] = [
  {w: 'MAKE', d: .5}, {w: 'SOMETHING', d: .7}, {w: 'LOUD', d: .9},
  {w: 'TURN', d: .45}, {w: 'THE', d: .3}, {w: 'VOLUME', d: .7}, {w: 'UP', d: 1.0},
  {w: 'HIGH', d: .6}, {w: 'NO', d: .45}, {w: 'QUIET', d: .65}, {w: 'HOURS', d: .7},
  {w: 'ONLY', d: .4}, {w: 'FULL', d: .5}, {w: 'SEND', d: .7}, {w: 'NEVER', d: .6}, {w: 'STOP', d: .6},
  {w: 'PIXELS', d: .6}, {w: 'WITH', d: .35}, {w: 'PULSE', d: .85}, {w: 'AND', d: .35}, {w: 'POP', d: .45},
  {w: 'CANDY', d: .6}, {w: 'LIGHTNING', d: .8}, {w: 'STRIKE', d: .55}, {w: 'TWICE', d: .75},
  {w: 'NEON', d: .6}, {w: 'NEVER', d: .5}, {w: 'SLEEPS', d: .9}, {w: 'IT', d: .3}, {w: 'HUMS', d: .6},
  {w: 'CUT', d: .45}, {w: 'ON', d: .3}, {w: 'THE', d: .3}, {w: 'BEAT', d: .85}, {w: 'EVERY', d: .6},
  {w: 'TWENTY', d: .5}, {w: 'FIVE', d: .5}, {w: 'WORLDS', d: .9}, {w: 'ONE', d: .45}, {w: 'CUT', d: .55},
  {w: 'ONE', d: .45}, {w: 'MESSAGE', d: .75}, {w: 'LOUDER', d: .8}, {w: 'EACH', d: .5},
  {w: 'STAY', d: .5}, {w: 'LOUD', d: .95}, {w: 'FOREVER', d: .95},
  {w: 'EVERY', d: .5}, {w: 'FRAME', d: .6}, {w: 'A', d: .25}, {w: 'POSTER', d: .8}, {w: 'PRINT', d: .6},
  {w: 'CHEW', d: .55}, {w: 'THE', d: .3}, {w: 'SCENERY', d: .95}, {w: 'SPIT', d: .6},
  {w: 'SATURATE', d: .9}, {w: 'EVERYTHING', d: 1.0}, {w: 'SINGS', d: .7},
  {w: 'HARD', d: .5}, {w: 'SHADOW', d: .65}, {w: 'ZERO', d: .5}, {w: 'BLUR', d: .85},
  {w: 'TYPE', d: .55}, {w: 'THAT', d: .45}, {w: 'BITES', d: .95}, {w: 'BACK', d: .7},
  {w: 'WHITE', d: .6}, {w: 'ON', d: .3}, {w: 'EVERYTHING', d: 1.0}, {w: 'INVERTS', d: 1.0},
  {w: 'DIFFERENCE', d: 1.0}, {w: 'IS', d: .3}, {w: 'THE', d: .3}, {w: 'DRUG', d: .9},
  {w: 'PUSH', d: .55}, {w: 'IN', d: .35}, {w: 'CLOSER', d: 1.0}, {w: 'UNTIL', d: .6},
  {w: 'DRIFT', d: .55}, {w: 'AND', d: .3}, {w: 'SPIN', d: .7}, {w: 'LOOP', d: .65},
  {w: 'TUNNEL', d: .7}, {w: 'VISION', d: .7}, {w: 'ACTIVATE', d: .8}, {w: 'WHOOSH', d: .6},
  {w: 'TEAR', d: .6}, {w: 'THE', d: .35}, {w: 'STRIP', d: .95}, {w: 'DOWN', d: .5},
  {w: 'GLITCH', d: .6}, {w: 'ON', d: .3}, {w: 'THE', d: .3}, {w: 'ONE', d: .3}, {w: 'BEAT', d: .75}, {w: 'HARD', d: .5},
  {w: 'LOUD', d: .6}, {w: 'IS', d: .3}, {w: 'A', d: .3}, {w: 'LANGUAGE', d: .9}, {w: 'SHOUT', d: .6},
  {w: 'MAKE', d: .55}, {w: 'IT', d: .35}, {w: 'LOUDER', d: .95}, {w: 'AGAIN', d: .6},
];

// per-scene word counts; each row must match the RAW grouping above, and sum to RAW.length
const COUNTS = [3, 4, 4, 5, 5, 4, 5, 5, 5, 4, 3, 5, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 6, 5, 4];
const MOTIFS: Motif[] = [
  'record', 'sun', 'portal', 'cards', 'cassette', 'bolt', 'puppet', 'burst', 'planet',
  'chair', 'pupil', 'flower', 'phone', 'cherry', 'sphere', 'puppet2', 'moon', 'drip',
  'tunnel', 'ball', 'wormhole', 'strip', 'glitch', 'megaphone', 'record2',
];

// normalise word durations so the film lands exactly on TOTAL frames
const rawFrames = RAW.map((r) => r.d * FPS);
const scale = TOTAL / rawFrames.reduce((a, b) => a + b, 0);
const wordFrames = rawFrames.map((n) => Math.max(10, Math.round(n * scale)));
wordFrames[wordFrames.length - 1] += TOTAL - wordFrames.reduce((a, b) => a + b, 0);

export type Word = {text: string; start: number; end: number; index: number};
export type Scene = {
  index: number; start: number; end: number; motif: Motif; mood: Mood;
  captionX: number; captionY: number;
};

export const WORDS: Word[] = (() => {
  let f = 0;
  return RAW.map((r, i) => {
    const start = f;
    f += wordFrames[i];
    return {text: r.w, start, end: f, index: i};
  });
})();

if (COUNTS.reduce((a, b) => a + b, 0) !== RAW.length) {
  throw new Error(
    `COUNTS sums to ${COUNTS.reduce((a, b) => a + b, 0)} but RAW has ${RAW.length} words`,
  );
}

export const SCENES: Scene[] = (() => {
  const scenes: Scene[] = [];
  let wi = 0;
  COUNTS.forEach((n, i) => {
    const start = WORDS[wi].start;
    wi += n;
    const end = wi < WORDS.length ? WORDS[wi].start : TOTAL;
    const centred = ['record', 'portal', 'cards', 'pupil', 'phone'].includes(MOTIFS[i]);
    scenes.push({
      index: i,
      start,
      end,
      motif: MOTIFS[i],
      mood: i % 2 === 0 ? 'night' : 'day',
      captionX: centred ? 27 : 50,
      captionY: i % 5 === 2 ? 68 : i % 7 === 3 ? 28 : centred ? 30 : 46,
    });
  });
  return scenes;
})();

export const sceneAt = (f: number): Scene =>
  SCENES.find((s) => f >= s.start && f < s.end) ?? SCENES[SCENES.length - 1];

// special transitions (scene indices that open with an effect)
export const IRIS_IN = new Set([10, 20, 24]);
export const FLASH = new Set([8, 17]);
export const WHIP = new Set([4, 9, 14, 19]);
// camera end scale per motif: tunnel/iris shots push much harder
export const CAM_END: Partial<Record<Motif, number>> = {
  tunnel: 1.5, wormhole: 1.6, record: 1.12, record2: 1.12, pupil: 1.2, portal: 1.1,
};
