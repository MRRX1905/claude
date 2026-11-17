import React from 'react';
import {AbsoluteFill, useCurrentFrame, continueRender, delayRender, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {WORDS, W, Word} from './theme';

const family = 'Anton';
const handle = delayRender('Loading Anton');
loadFont({
  family,
  url: staticFile('Anton-Regular.ttf'),
  weight: '400',
}).then(() => continueRender(handle)).catch(() => continueRender(handle));
const fontFamily = `"${family}", "Arial Narrow", sans-serif`;

const BASE = 144; // 0.20 * 720 cap-height reference
const MAXW = 0.62 * W;

// deterministic per-word randomness
const rnd = (seed: number) => {
  let t = seed * 0x6d2b79f5 + 0x9e3779b9;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const sizeFor = (text: string) => {
  const width = text.length * BASE * 0.56;
  return width > MAXW ? (BASE * MAXW) / width : BASE;
};

const typeStyle = (color: string): React.CSSProperties => ({
  fontFamily,
  fontWeight: 400,
  lineHeight: 0.9,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  color,
  userSelect: 'none',
  display: 'inline-block',
});

// slice glitch: full-height copies of the word clipped into bands, each nudged
const Sliced: React.FC<{text: string; seed: number; frame: number; color: string}> = ({
  text, seed, frame, color,
}) => {
  const r = rnd(seed + Math.floor(frame / 2));
  const bands = 10 + Math.floor(r() * 5);
  const step = 100 / bands;
  const base = typeStyle(color);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{...base, opacity: 0}}>{text}</span>
      {Array.from({length: bands}).map((_, i) => {
        const top = i * step;
        return (
          <span
            key={i}
            style={{
              ...base,
              position: 'absolute',
              left: 0,
              top: 0,
              clipPath: `inset(${top}% 0 ${100 - top - step}% 0)`,
              transform: `translateX(${Math.round(r() * 52 - 26)}px) translateY(${Math.round(r() * 6 - 3)}px)`,
              filter: r() < 0.1 ? 'invert(1)' : undefined,
            }}
          >
            {text}
          </span>
        );
      })}
    </span>
  );
};

const WordType: React.FC<{word: Word; frame: number; slicing: boolean; color?: string}> = ({
  word, frame, slicing, color = '#fff',
}) => {
  const probe = rnd(word.index + 1)();
  const glitchable = probe < 0.34; // ~every third word
  const seed = (word.index + 1) * 7919;
  const style = {...typeStyle(color), fontSize: sizeFor(word.text)};
  if (slicing && glitchable) {
    return (
      <span style={{...style, display: 'inline-block'}}>
        <Sliced text={word.text} seed={seed} frame={frame} color={color} />
      </span>
    );
  }
  return <span style={style}>{word.text}</span>;
};

const CaptionWord: React.FC<{word: Word; x: number; y: number}> = ({word, x, y}) => {
  const f = useCurrentFrame();
  const t = f - word.start;
  const left = f - word.end;
  if (left >= 3) return null; // the cut kills the word

  // enter: +18% cap height below at 0.94 scale over 3 frames, ease-out
  const inP = Math.min(1, Math.max(0, t / 3));
  const enterY = (1 - easeOut(inP)) * 0.18 * BASE;
  const scale = 0.94 + 0.06 * easeOut(inP);

  // exit: rises 14% cap height and fades over 3 frames
  const outP = left >= 0 ? Math.min(1, (left + 1) / 3) : 0;
  const exitY = -outP * 0.14 * BASE;
  const opacity = 1 - outP;

  const slicing = t >= 0 && t < 5; // glitch window: ~130ms

  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'difference'}}>
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) translateY(${enterY + exitY}px) scale(${scale})`,
          opacity,
        }}
      >
        {/* two misregistered ghosts under the base copy */}
        <div style={{position: 'absolute', left: 0, top: 0, opacity: 0.9}}>
          <span style={{display: 'inline-block', transform: 'translate(10px, 14px)'}}>
            <WordType word={word} frame={f} slicing={slicing} />
          </span>
        </div>
        <div style={{position: 'absolute', left: 0, top: 0, opacity: 0.75}}>
          <span style={{display: 'inline-block', transform: 'translate(-7px, 4px)'}}>
            <WordType word={word} frame={f} slicing={slicing} color="#7DF9FF" />
          </span>
        </div>
        <div style={{position: 'relative'}}>
          <WordType word={word} frame={f} slicing={slicing} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const active = WORDS.filter((w) => f >= w.start - 1 && f < w.end + 3);
  return (
    <AbsoluteFill>
      {active.map((w) => (
        <CaptionWord key={w.index} word={w} x={x} y={y} />
      ))}
    </AbsoluteFill>
  );
};

export const Credit: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 14}}>
    <span
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: 12,
        color: '#fff',
        opacity: 0.6,
        mixBlendMode: 'difference',
        letterSpacing: '0.08em',
      }}
    >
      KINETIC TYPE — 60.7s
    </span>
  </AbsoluteFill>
);
