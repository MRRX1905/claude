import React from 'react';
import {
  AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import {ANTON} from './fonts';
import {PHRASES, Word} from './data';

const LIME = '#C7FF00';
const INK = '#F5F4EF';
const BG = '#080808';
const FPS = 30;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const activePhrase = (f: number) => {
  const sec = f / FPS;
  return PHRASES.find((p) => sec >= p.start - 0.05 && sec < p.end + 0.2) ?? null;
};

const SlamWord: React.FC<{word: Word; f: number}> = ({word, f}) => {
  const local = f - word.s * FPS;
  const t = Math.min(1, Math.max(0, local / 5));
  if (local < -1) return <span style={{visibility: 'hidden'}}>{word.w} </span>;
  const y = (1 - ease(t)) * 46;
  const scale = interpolate(t, [0, 0.6, 1], [1.5, 0.96, 1], clamp);
  const skew = interpolate(t, [0, 1], [14, 0], clamp);
  const opacity = Math.min(1, Math.max(0, local / 2));
  return (
    <span
      style={{
        display: 'inline-block',
        transform: `translateY(${y}px) scale(${scale}) skewX(${skew}deg)`,
        opacity,
        marginRight: '0.22em',
      }}
    >
      {word.w}
    </span>
  );
};

const Particles: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 70}).map((_, i) => {
      const r = ((i * 0.6180339887) % 1 + 1) % 1;
      const x = (r * 1080 + Math.sin(f * 0.05 + i) * 80 + 1080) % 1080;
      const y = ((r * 2300 - f * (2 + (i % 7))) % 2100 + 2100) % 2100;
      const s = 2 + (i % 4) * 2;
      return (
        <div key={i} style={{
          position: 'absolute', left: x, top: y, width: s, height: s,
          background: i % 5 === 0 ? LIME : INK,
          opacity: 0.16 + (i % 5) * 0.1,
          boxShadow: i % 5 === 0 ? `0 0 12px ${LIME}` : 'none',
        }} />
      );
    })}
  </>
);

export const StyleBrutal: React.FC = () => {
  const f = useCurrentFrame();
  const phrase = activePhrase(f);
  const tStart = phrase ? phrase.start * FPS : 0;
  const local = f - tStart;
  const flash = phrase && local >= 0 && local < 2 ? 0.75 : 0;
  const shake = phrase && local >= 0 && local < 5 ? Math.sin(f * 33) * 12 * (1 - local / 5) : 0;
  const sec = f / FPS;

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} endAt={300} />
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at 50% 42%, #1d201c 0%, #0a0b09 48%, #020202 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: -140, opacity: 0.13,
        transform: `translate(${(f * 6) % 90}px, ${(-f * 6) % 90}px)`,
        backgroundImage:
          'linear-gradient(rgba(245,244,239,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(245,244,239,.45) 1px,transparent 1px)',
        backgroundSize: '84px 84px',
      }} />
      <Particles f={f} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(118deg, transparent 22%, rgba(199,255,0,${0.05 + Math.abs(Math.sin(f * 0.09)) * 0.12}) 50%, transparent 64%)`,
      }} />

      {/* HUD */}
      <div style={{
        position: 'absolute', left: 44, right: 44, top: 56, display: 'flex',
        justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 20,
        letterSpacing: 3, color: LIME,
      }}>
        <span>RU//VOICE_{String(Math.floor(f / 9)).padStart(3, '0')}</span>
        <span>STYLE 01 — BRUTAL</span>
      </div>

      {/* phrase */}
      <AbsoluteFill style={{
        justifyContent: 'center', padding: '0 64px',
        transform: `translate(${shake}px, ${-shake * 0.4}px)`,
      }}>
        {phrase ? (
          <div key={phrase.i} style={{
            fontFamily: ANTON, fontSize: 128, lineHeight: 0.98, color: INK,
            textTransform: 'uppercase', letterSpacing: '-0.015em',
            textShadow: `6px 6px 0 ${LIME}, 12px 12px 0 #232323`,
            opacity: interpolate(local, [0, 3, 26, 30], [0, 1, 1, 0], clamp),
          }}>
            {phrase.words.map((w, i) => <SlamWord key={i} word={w} f={f} />)}
          </div>
        ) : null}
      </AbsoluteFill>

      {/* bottom bar */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: '#20221f'}}>
        <div style={{
          height: '100%', width: `${(sec / 10) * 100}%`, background: LIME,
          boxShadow: `0 0 18px ${LIME}`,
        }} />
      </div>
      <div style={{
        position: 'absolute', left: 44, bottom: 40, fontFamily: 'monospace',
        fontSize: 17, color: '#8b8d88', letterSpacing: 2,
      }}>
        9:16 — 1080×1920 — {sec.toFixed(2)}s
      </div>

      <AbsoluteFill style={{
        pointerEvents: 'none', opacity: 0.16,
        background: 'repeating-linear-gradient(to bottom,transparent 0 4px,rgba(0,0,0,.85) 5px,rgba(0,0,0,.85) 6px)',
      }} />
      {flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
    </AbsoluteFill>
  );
};
