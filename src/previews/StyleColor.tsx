import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PHRASES} from './data';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const colors = ['#D5FF3F', '#FF5DA2', '#36D6D0', '#FEA837'];
const activePhrase = (f: number) => {
  const s = f / 30;
  return PHRASES.find((p) => s >= p.start - 0.05 && s < p.end + 0.2) ?? null;
};

export const StyleColor: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const p = activePhrase(f);
  const local = p ? f - p.start * 30 : 0;
  const intro = interpolate(local, [0, 12], [78, 0], {...clamp, easing: ease});
  const scale = interpolate(local, [0, 8, 16], [0.82, 1.04, 1], {...clamp, easing: ease});
  const accent = colors[(p?.i ?? Math.floor(sec)) % colors.length];
  const rot = Math.sin(f * 0.025) * 7;

  return (
    <AbsoluteFill style={{background: '#17163B', color: '#fff', overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} endAt={300} />
      {/* vivid soft glow */}
      <div style={{
        position: 'absolute', width: 900, height: 900, borderRadius: '50%',
        left: '50%', top: '36%', transform: 'translate(-50%,-50%)',
        background: `radial-gradient(circle, ${accent}55 0%, ${accent}12 38%, transparent 70%)`,
        filter: 'blur(18px)',
      }} />
      {/* frame-within-frame cards */}
      <div style={{
        position: 'absolute', left: 88, right: 88, top: 340, height: 880,
        borderRadius: 32, border: `2px solid ${accent}88`,
        transform: `rotate(${rot}deg)`, opacity: 0.72,
      }} />
      <div style={{
        position: 'absolute', left: 122, right: 122, top: 374, height: 812,
        borderRadius: 24, background: 'linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.015))',
        transform: `rotate(${-rot * 0.55}deg)`,
      }} />
      {/* floating graphic primitives */}
      <div style={{
        position: 'absolute', width: 130, height: 130, borderRadius: 28,
        right: 118, top: 210, background: colors[1], transform: `rotate(${f * 1.3}deg)`,
        boxShadow: `0 18px 75px ${colors[1]}88`,
      }} />
      <div style={{
        position: 'absolute', width: 94, height: 94, borderRadius: '50%', left: 96, top: 1440,
        background: colors[2], transform: `translateY(${Math.sin(f / 14) * 34}px)`,
        boxShadow: `0 12px 60px ${colors[2]}88`,
      }} />
      <div style={{
        position: 'absolute', width: 150, height: 18, left: 110, top: 290,
        borderRadius: 12, background: colors[3], transform: `rotate(${-15 + Math.sin(f / 18) * 5}deg)`,
      }} />
      {/* title */}
      <div style={{
        position: 'absolute', left: 76, right: 76, top: 76, display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace',
        fontSize: 18, letterSpacing: 3, color: '#E9E5FF',
      }}>
        <span>RAFI UMRI <span style={{color: accent}}>●</span></span><span>BUILT IN MOTION</span>
      </div>
      {/* active spoken phrase */}
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 110px'}}>
        {p ? (
          <div key={p.i} style={{
            transform: `translateY(${intro}px) scale(${scale})`,
            opacity: interpolate(local, [0, 3, 28, 34], [0, 1, 1, 0], clamp),
            fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 900,
            fontSize: 106, lineHeight: 0.98, letterSpacing: '-0.055em',
            textTransform: 'uppercase', color: '#FAF8FF',
            textShadow: `5px 6px 0 ${accent}, 12px 14px 0 rgba(0,0,0,.27)`,
            maxWidth: 860,
          }}>{p.text}</div>
        ) : null}
      </AbsoluteFill>
      <div style={{
        position: 'absolute', left: 86, right: 86, bottom: 136,
        display: 'flex', justifyContent: 'space-between', alignItems: 'end',
        fontFamily: 'monospace', letterSpacing: 2,
      }}>
        <span style={{fontSize: 18, color: accent}}>DESAIN · KODE · AI · MOTION</span>
        <span style={{fontSize: 16, color: '#ABA7CA'}}>{sec.toFixed(1)}s</span>
      </div>
      <div style={{position: 'absolute', left: 86, right: 86, bottom: 78, height: 7, borderRadius: 4, background: '#403D65'}}>
        <div style={{height: '100%', width: `${sec * 10}%`, borderRadius: 4, background: accent, boxShadow: `0 0 18px ${accent}`}} />
      </div>
    </AbsoluteFill>
  );
};
