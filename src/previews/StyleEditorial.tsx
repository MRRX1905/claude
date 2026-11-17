import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PHRASES} from './data';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const activePhrase = (f: number) => {
  const s = f / 30;
  return PHRASES.find((p) => s >= p.start - 0.05 && s < p.end + 0.2) ?? null;
};

export const StyleEditorial: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const p = activePhrase(f);
  const local = p ? f - p.start * 30 : 0;
  const enter = interpolate(local, [0, 24], [48, 0], {...clamp, easing: ease});
  const opacity = interpolate(local, [0, 10, 30], [0, 1, 1], clamp);
  const orbit = f * 0.36;
  const arcOpacity = interpolate(sec, [0, 1.5, 9.6, 10], [0, 0.7, 0.7, 0], clamp);

  return (
    <AbsoluteFill style={{background: '#E9E3D7', color: '#162C3C', overflow: 'hidden'}}>
      <Audio src={staticFile('voice.mp3')} endAt={300} />
      {/* subtle stock-paper grain built from fine rules */}
      <AbsoluteFill style={{
        opacity: 0.28,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 5px,rgba(47,54,57,.035) 6px),repeating-linear-gradient(90deg,transparent 0 7px,rgba(47,54,57,.025) 8px)',
      }} />
      {/* quiet cinematic light field */}
      <div style={{
        position: 'absolute', width: 900, height: 900, borderRadius: '50%',
        left: '50%', top: '39%', transform: `translate(-50%,-50%) rotate(${orbit}deg)`,
        background: 'radial-gradient(circle, rgba(197,105,70,.12), rgba(197,105,70,0) 68%)',
      }} />
      {/* single elegant orbit */}
      <div style={{
        position: 'absolute', width: 620, height: 620, border: '1px solid rgba(22,44,60,.17)',
        borderRadius: '50%', left: '50%', top: '40%', transform: `translate(-50%,-50%) rotate(${orbit}deg)`,
        opacity: arcOpacity,
      }} />
      <div style={{
        position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: '#C56946',
        left: 'calc(50% + 310px)', top: 'calc(40% - 8px)',
        transform: `rotate(${orbit}deg) translateX(-310px)`, opacity: arcOpacity,
      }} />
      {/* editorial grid */}
      <div style={{position: 'absolute', left: 74, right: 74, top: 120, height: 1, background: '#162C3C', opacity: 0.35}} />
      <div style={{position: 'absolute', left: 74, right: 74, bottom: 190, height: 1, background: '#162C3C', opacity: 0.35}} />
      <div style={{
        position: 'absolute', left: 74, right: 74, top: 68, display: 'flex', justifyContent: 'space-between',
        color: '#52616A', fontFamily: 'monospace', fontSize: 17, letterSpacing: 3,
      }}>
        <span>RAFI UMRI</span><span>CREATIVE TECHNOLOGIST</span>
      </div>
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 86px'}}>
        {p ? (
          <div key={p.i} style={{
            transform: `translateY(${enter}px)`, opacity,
            fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 86,
            lineHeight: 1.08, letterSpacing: '-0.045em', fontWeight: 400,
            color: '#162C3C', maxWidth: 910,
          }}>
            {p.text}
          </div>
        ) : null}
      </AbsoluteFill>
      <div style={{
        position: 'absolute', left: 74, right: 74, bottom: 112, display: 'flex',
        justifyContent: 'space-between', alignItems: 'end',
      }}>
        <div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: '#C56946'}}>
          Ide → Sistem → Pengalaman
        </div>
        <div style={{fontFamily: 'monospace', fontSize: 16, letterSpacing: 2, color: '#52616A'}}>
          {sec.toFixed(1)} / 10.0
        </div>
      </div>
      <div style={{position: 'absolute', left: 74, right: 74, bottom: 58, height: 3, background: 'rgba(22,44,60,.14)'}}>
        <div style={{height: '100%', width: `${sec * 10}%`, background: '#C56946'}} />
      </div>
    </AbsoluteFill>
  );
};
