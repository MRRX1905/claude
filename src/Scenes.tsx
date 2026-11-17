import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PALETTE, Pal, Motif, Mood, shade, W, H} from './theme';

const rnd = (seed: number) => {
  let t = seed * 0x6d2b79f5 + 0x9e3779b9;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

type Ctx = {p: Pal; f: number; seed: number};

const Shadow: React.FC<{x: number; y: number; w: number; h: number; rx?: number; color: string}> = ({
  x, y, w, h, rx = 0, color,
}) => <rect x={x + 10} y={y + 12} width={w} height={h} rx={rx} fill={color} />;

const CircleShadow: React.FC<{cx: number; cy: number; r: number; color: string}> = ({cx, cy, r, color}) => (
  <circle cx={cx + 10} cy={cy + 12} r={r} fill={color} />
);

const Glow: React.FC<{cx: number; cy: number; r: number; color: string}> = ({cx, cy, r, color}) => (
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill={color}
    opacity={0.22}
    style={{filter: `blur(${r * 0.45}px)`, mixBlendMode: 'screen'}}
  />
);

// ── motifs ────────────────────────────────────────────────────────────────
const record: React.FC<Ctx> = ({p, f}) => {
  const rot = f * 2.4;
  return (
    <>
      <Glow cx={960} cy={330} r={300} color={p.c} />
      <g transform={`translate(960 330) rotate(${rot})`}>
        <CircleShadow cx={0} cy={0} r={190} color={shade(p.bg1, 0.4)} />
        <circle r={190} fill={p.ink} />
        <circle r={150} fill={shade(p.bg2, 0.15)} />
        {[130, 112, 94, 76].map((r) => (
          <circle key={r} r={r} fill="none" stroke={shade(p.bg2, 0.35)} strokeWidth={2} />
        ))}
        <circle r={52} fill={p.a} />
        <circle r={9} fill={p.ink} />
      </g>
      <g transform="translate(300 470)">
        <CircleShadow cx={0} cy={0} r={110} color={shade(p.bg1, 0.4)} />
        <circle r={110} fill={p.c} />
        <circle cx={-34} cy={-40} r={26} fill={shade(p.c, 0.18)} />
        <circle cx={40} cy={50} r={18} fill={shade(p.c, 0.18)} />
      </g>
    </>
  );
};

const sun: React.FC<Ctx> = ({p, f}) => {
  const bob = Math.sin(f / 18) * 10;
  return (
    <>
      <Glow cx={640} cy={330 + bob} r={340} color={p.bg2} />
      <g transform={`translate(640 ${330 + bob})`}>
        <CircleShadow cx={0} cy={0} r={168} color={shade(p.bg1, 0.3)} />
        <circle r={168} fill={p.bg2} />
        {Array.from({length: 8}).map((_, i) => (
          <polygon
            key={i}
            points="-22,-168 22,-168 0,-232"
            fill={p.bg2}
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle cy={10} r={120} fill={p.b} />
        <circle cx={-38} cy={-14} r={9} fill={p.ink} />
        <circle cx={38} cy={-14} r={9} fill={p.ink} />
        <path d="M-38 40 Q0 70 38 40" stroke={p.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
    </>
  );
};

const portal: React.FC<Ctx> = ({p, f}) => {
  const inner = p.bg1 === PALETTE.night.bg1 ? p.a : p.deep;
  return (
    <>
      <Glow cx={640} cy={340} r={320} color={p.b} />
      <g transform="translate(640 340)">
        <CircleShadow cx={0} cy={0} r={210} color={shade(p.bg1, 0.35)} />
        <circle r={210} fill={p.c} />
        {[170, 132, 96].map((r, i) => (
          <circle key={r} r={r} fill={i % 2 === 0 ? inner : shade(inner, 0.12)} />
        ))}
        <circle r={58 + Math.sin(f / 6) * 8} fill={p.ink} />
      </g>
    </>
  );
};

const cards: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={640} cy={360} r={360} color={p.b} />
    {[
      {x: 330, y: 140, s: 0.9, c: p.a},
      {x: 520, y: 250, s: 1.08, c: p.c},
      {x: 760, y: 180, s: 1.0, c: p.b},
    ].map((c, i) => {
      const y = c.y + Math.sin(f / 22 + i) * 8;
      const w = 250 * c.s;
      const h = 300 * c.s;
      return (
        <g key={i} transform={`translate(${c.x} ${y}) rotate(${i * 4 - 4})`}>
          <Shadow x={0} y={0} w={w} h={h} rx={24} color={shade(p.bg1, 0.4)} />
          <rect width={w} height={h} rx={24} fill="#fff" />
          <rect x={18} y={18} width={w - 36} height={h * 0.48} rx={14} fill={c.c} opacity={0.7} />
          <rect x={18} y={h * 0.56} width={w * 0.62} height={14} rx={7} fill={p.ink} opacity={0.7} />
          <rect x={18} y={h * 0.62} width={w * 0.44} height={10} rx={5} fill={p.ink} opacity={0.35} />
          <rect x={18} y={h * 0.72} width={w * 0.7} height={30} rx={15} fill={p.a} opacity={0.9} />
        </g>
      );
    })}
  </>
);

const cassette: React.FC<Ctx> = ({p, f}) => {
  const rot = Math.sin(f / 14) * 12;
  return (
    <>
      <Glow cx={640} cy={360} r={300} color={p.a} />
      <g transform={`translate(640 360) rotate(${rot})`}>
        <Shadow x={-260} y={-160} w={520} h={320} rx={26} color={shade(p.bg1, 0.4)} />
        <rect x={-260} y={-160} width={520} height={320} rx={26} fill={p.c} />
        <rect x={-200} y={-90} width={400} height={170} rx={14} fill={p.ink} opacity={0.85} />
        {[-110, 110].map((x) => (
          <g key={x} transform={`translate(${x} 0) rotate(${f * 5})`}>
            <circle r={54} fill={p.a} />
            <circle r={34} fill={p.ink} opacity={0.7} />
          </g>
        ))}
        <rect x={-150} y={105} width={300} height={22} rx={11} fill={p.a} opacity={0.9} />
      </g>
    </>
  );
};

const bolt: React.FC<Ctx> = ({p, f}) => {
  const pulse = 1 + Math.sin(f / 7) * 0.04;
  return (
    <>
      <Glow cx={640} cy={340} r={320} color={p.b} />
      <g transform={`translate(640 340) scale(${pulse})`}>
        <polygon
          points="40,-250 -190,30 -30,30 -70,260 200,-40 30,-40"
          fill={shade(p.bg1, 0.4)}
          transform="translate(12 14)"
        />
        <polygon points="40,-250 -190,30 -30,30 -70,260 200,-40 30,-40" fill={p.b} />
        <polygon points="40,-250 -20,30 -60,30 -30,260 120,-40 -10,-40" fill={p.a} opacity={0.55} />
      </g>
    </>
  );
};

const puppet: React.FC<Ctx> = ({p, f}) => {
  const wave = Math.sin(f / 9) * 18;
  return (
    <>
      <Glow cx={640} cy={380} r={340} color={p.c} />
      <g transform="translate(640 400)">
        <CircleShadow cx={0} cy={0} r={190} color={shade(p.bg1, 0.4)} />
        <circle r={190} fill={p.a} />
        {/* torso */}
        <g>
          <rect x={-78} y={10} width={156} height={150} rx={40} fill={p.c} />
          <rect x={-78} y={10} width={60} height={150} rx={30} fill={shade(p.c, 0.18)} />
          <circle cx={0} cy={-70} r={62} fill="#FFD3A5" />
          <circle cx={-22} cy={-78} r={7} fill={p.ink} />
          <circle cx={22} cy={-78} r={7} fill={p.ink} />
          <path d="M-18 -48 Q0 -34 18 -48" stroke={p.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M-62 -88 Q-40 -118 -10 -116" stroke={p.ink} strokeWidth={10} fill="none" />
          <path d="M62 -88 Q40 -118 10 -116" stroke={p.ink} strokeWidth={10} fill="none" />
          <rect x={-96} y={18} width={30} height={120} rx={15} fill="#FFD3A5" transform={`rotate(${wave} -80 30)`} />
          <rect x={66} y={18} width={30} height={120} rx={15} fill="#FFD3A5" transform={`rotate(${-wave} 80 30)`} />
        </g>
      </g>
    </>
  );
};

const burst: React.FC<Ctx> = ({p, f}) => {
  const n = 16;
  const r = rnd(7);
  return (
    <>
      <Glow cx={640} cy={340} r={340} color={p.a} />
      <g transform={`translate(640 340) rotate(${f * 1.2})`}>
        {Array.from({length: n}).map((_, i) => {
          const a = (i / n) * Math.PI * 2;
          const len = 210 + r() * 90;
          const x1 = Math.cos(a) * 80;
          const y1 = Math.sin(a) * 80;
          return (
            <polygon
              key={i}
              points={`${x1},${y1} ${Math.cos(a - 0.16) * len},${Math.sin(a - 0.16) * len} ${Math.cos(a + 0.16) * len},${Math.sin(a + 0.16) * len}`}
              fill={i % 2 === 0 ? p.c : p.b}
            />
          );
        })}
        <circle r={100} fill={p.bg1 === PALETTE.night.bg1 ? p.a : '#fff'} />
      </g>
    </>
  );
};

const planet: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={900} cy={330} r={300} color={p.c} />
    <g transform="translate(900 330)">
      <CircleShadow cx={0} cy={0} r={150} color={shade(p.bg1, 0.4)} />
      <circle r={150} fill={p.b} />
      <circle cx={-45} cy={-40} r={34} fill={shade(p.b, 0.18)} />
      <circle cx={50} cy={50} r={26} fill={shade(p.b, 0.18)} />
      <circle cx={40} cy={-70} r={18} fill={shade(p.b, 0.18)} />
    </g>
    <g transform="translate(640 420)">
      <rect x={-260} y={-26} width={520} height={52} rx={26} fill={p.c} opacity={0.9} transform="rotate(-14)" />
    </g>
    <g transform="translate(300 480) rotate(-18)">
      <polygon points="-150,0 150,-40 170,40 0,70 -160,50" fill={p.a} />
    </g>
  </>
);

const chair: React.FC<Ctx> = ({p, f}) => {
  const sway = Math.sin(f / 20) * 2;
  return (
    <>
      <Glow cx={640} cy={360} r={300} color={p.b} />
      <g transform={`translate(640 370) rotate(${sway})`}>
        <Shadow x={-140} y={-200} w={280} h={330} rx={30} color={shade(p.bg1, 0.4)} />
        <rect x={-140} y={-200} width={280} height={330} rx={30} fill={p.a} />
        <rect x={-110} y={-170} width={220} height={160} rx={20} fill={shade(p.a, 0.16)} />
        <rect x={-200} y={-120} width={70} height={240} rx={30} fill={p.a} />
        <rect x={130} y={-120} width={70} height={240} rx={30} fill={p.a} />
        <rect x={-190} y={-150} width={50} height={180} rx={22} fill={p.b} />
      </g>
    </>
  );
};

const pupil: React.FC<Ctx> = ({p, f}) => {
  const open = 1 + Math.sin(f / 16) * 0.08;
  return (
    <>
      <Glow cx={640} cy={350} r={360} color={p.b} />
      <g transform={`translate(640 350) scale(1 ${open})`}>
        <CircleShadow cx={0} cy={0} r={240} color={shade(p.bg1, 0.4)} />
        <ellipse rx={300} ry={190} fill="#fff" />
        <circle cx={0} cy={0} r={112} fill={p.b} />
        <circle cx={0} cy={0} r={54 + Math.sin(f / 5) * 6} fill={p.ink} />
        <circle cx={-40} cy={-40} r={16} fill="#fff" />
      </g>
    </>
  );
};

const flower: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={440} cy={340} r={300} color={p.c} />
    <g transform="translate(440 340)">
      <g transform={`rotate(${f * 0.8})`}>
        {Array.from({length: 8}).map((_, i) => (
          <ellipse key={i} cx={0} cy={-140} rx={56} ry={92} fill={i % 2 ? p.c : p.a} transform={`rotate(${i * 45})`} />
        ))}
        <circle r={70} fill={p.b} />
        <circle r={34} fill={p.bg1 === PALETTE.night.bg1 ? p.ink : '#fff'} />
      </g>
    </g>
    <g transform="translate(900 460)">
      <CircleShadow cx={0} cy={0} r={90} color={shade(p.bg1, 0.4)} />
      <circle r={90} fill={p.b} />
    </g>
  </>
);

const phone: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={800} cy={360} r={340} color={p.a} />
    <g transform={`translate(800 360) rotate(${Math.sin(f / 24) * 4 - 8})`}>
      <Shadow x={-150} y={-280} w={300} h={560} rx={44} color={shade(p.bg1, 0.4)} />
      <rect x={-150} y={-280} width={300} height={560} rx={44} fill={p.ink} />
      <rect x={-134} y={-252} width={268} height={504} rx={30} fill={p.bg2} />
      <rect x={-100} y={-190} width={200} height={96} rx={18} fill={p.a} opacity={0.7} />
      <rect x={-100} y={-70} width={150} height={16} rx={8} fill="#fff" opacity={0.8} />
      <rect x={-100} y={-40} width={110} height={12} rx={6} fill="#fff" opacity={0.45} />
      <rect x={-100} y={20} width={200} height={70} rx={16} fill={p.c} />
      <rect x={-100} y={110} width={200} height={70} rx={16} fill={p.b} opacity={0.85} />
    </g>
    <g transform="translate(340 460)">
      <CircleShadow cx={0} cy={0} r={100} color={shade(p.bg1, 0.4)} />
      <circle r={100} fill={p.c} />
    </g>
  </>
);

const cherry: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={640} cy={400} r={300} color={p.c} />
    <g transform="translate(640 400)">
      <path d="M-90 10 Q-40 -140 20 -200" stroke={p.a} strokeWidth={12} fill="none" />
      <path d="M110 10 Q80 -120 20 -200" stroke={p.a} strokeWidth={12} fill="none" />
      <circle cx={-90} cy={40} r={86} fill={p.c} />
      <circle cx={110} cy={40} r={86} fill={p.c} />
      <circle cx={-118} cy={12} r={20} fill={shade(p.c, 0.2)} />
      <circle cx={82} cy={12} r={20} fill={shade(p.c, 0.2)} />
    </g>
  </>
);

const sphere: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={640} cy={340} r={340} color={p.b} />
    <g transform={`translate(640 340) scale(${1 + Math.sin(f / 20) * 0.03})`}>
      <CircleShadow cx={0} cy={0} r={180} color={shade(p.bg1, 0.4)} />
      <circle r={180} fill={p.a} />
      <path d="M-180 0 A180 180 0 0 1 180 0" fill={shade(p.a, 0.16)} />
      <circle cx={-60} cy={-70} r={34} fill="#fff" opacity={0.5} />
      <ellipse rx={250} ry={60} fill="none" stroke={p.c} strokeWidth={14} transform="rotate(-16)" opacity={0.9} />
    </g>
  </>
);

const puppet2: React.FC<Ctx> = ({p, f}) => {
  const hop = Math.abs(Math.sin(f / 10)) * 18;
  return (
    <>
      <Glow cx={560} cy={360} r={320} color={p.a} />
      <g transform={`translate(560 ${400 - hop})`}>
        <CircleShadow cx={0} cy={120} r={140} color={shade(p.bg1, 0.4)} />
        <rect x={-70} y={-10} width={140} height={130} rx={34} fill={p.b} />
        <circle cx={0} cy={-80} r={58} fill={p.a} />
        <circle cx={-20} cy={-86} r={7} fill={p.ink} />
        <circle cx={20} cy={-86} r={7} fill={p.ink} />
        <path d="M-16 -58 Q0 -46 16 -58" stroke={p.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        <rect x={-90} y={0} width={26} height={110} rx={13} fill={p.a} transform={`rotate(${Math.sin(f / 8) * 14} -76 4)`} />
        <rect x={64} y={0} width={26} height={110} rx={13} fill={p.a} transform={`rotate(${-Math.sin(f / 8) * 14} 76 4)`} />
      </g>
      <g transform="translate(940 440) rotate(12)">
        <Shadow x={-100} y={-100} w={200} h={200} rx={20} color={shade(p.bg1, 0.4)} />
        <rect x={-100} y={-100} width={200} height={200} rx={20} fill={p.c} />
        <path d="M-40 0 L10 -50 L10 -10 L44 -10 L-6 44 L-6 4 Z" fill="#fff" />
      </g>
    </>
  );
};

const moon: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={900} cy={300} r={300} color={p.a} />
    <g transform="translate(900 300)">
      <CircleShadow cx={0} cy={0} r={130} color={shade(p.bg1, 0.4)} />
      <circle r={130} fill={p.a} />
      <circle cx={-40} cy={-30} r={22} fill={shade(p.a, 0.2)} />
      <circle cx={46} cy={40} r={16} fill={shade(p.a, 0.2)} />
      <circle cx={20} cy={-60} r={12} fill={shade(p.a, 0.2)} />
    </g>
    <g transform="translate(340 480)">
      <polygon points="-180,80 -120,-60 -40,20 40,-90 120,10 190,80" fill={p.c} />
      <polygon points="-180,80 190,80 190,120 -180,120" fill={shade(p.c, 0.25)} />
    </g>
  </>
);

const drip: React.FC<Ctx> = ({p, f}) => {
  const d = (f * 9) % 260;
  return (
    <>
      <Glow cx={640} cy={300} r={320} color={p.c} />
      <g transform="translate(640 220)">
        <Shadow x={-220} y={-60} w={440} h={120} rx={60} color={shade(p.bg1, 0.4)} />
        <rect x={-220} y={-60} width={440} height={120} rx={60} fill={p.c} />
        <rect x={-180} y={-40} width={180} height={34} rx={17} fill="#fff" opacity={0.35} />
      </g>
      <g transform="translate(640 300)">
        <path d={`M-30 0 Q-40 ${60 + d} 0 ${90 + d} Q40 ${60 + d} 30 0 Z`} fill={p.c} opacity={0.9} />
        <circle cy={110 + d} r={20} fill={p.c} />
      </g>
      <g transform="translate(320 470)">
        <CircleShadow cx={0} cy={0} r={90} color={shade(p.bg1, 0.4)} />
        <circle r={90} fill={p.a} />
      </g>
    </>
  );
};

const tunnel: React.FC<Ctx> = ({p, f}) => {
  const rings = Array.from({length: 12}, (_, i) => {
    const z = 200 + i * 190;
    const speed = 260;
    const zz = ((z - f * speed) % 2400 + 2400) % 2400 + 200;
    const s = 900 / (900 + zz);
    return {s, i, zz};
  }).sort((a, b) => b.zz - a.zz);
  return (
    <>
      <Glow cx={640} cy={360} r={380} color={p.b} />
      {rings.map(({s, i, zz}) => (
        <ellipse
          key={i}
          cx={640}
          cy={360}
          rx={220 * s}
          ry={220 * s}
          fill="none"
          stroke={i % 2 ? p.a : p.c}
          strokeWidth={Math.max(2, 40 * s)}
          opacity={Math.min(1, 0.25 + s * 1.5)}
          style={{filter: zz < 700 ? 'blur(2px)' : undefined}}
        />
      ))}
      <circle cx={640} cy={360} r={60} fill={p.a} />
    </>
  );
};

const ball: React.FC<Ctx> = ({p, f}) => {
  const b = (f * 6) % 600;
  return (
    <>
      <Glow cx={640} cy={300} r={300} color={p.a} />
      <g transform="translate(640 620)">
        <Shadow x={-420} y={-40} w={840} h={80} rx={40} color={shade(p.bg1, 0.4)} />
        <rect x={-420} y={-40} width={840} height={80} rx={40} fill={p.b} />
      </g>
      <g transform={`translate(${380 + b * 0.8} ${620 - Math.abs(Math.sin(b / 90)) * 260})`}>
        <CircleShadow cx={0} cy={0} r={80} color={shade(p.bg1, 0.4)} />
        <circle r={80} fill={p.c} />
        <path d="M-80 0 A80 80 0 0 1 80 0" fill={shade(p.c, 0.2)} />
      </g>
      <g transform="translate(1000 300)">
        <CircleShadow cx={0} cy={0} r={120} color={shade(p.bg1, 0.4)} />
        <circle r={120} fill={p.a} />
      </g>
    </>
  );
};

const wormhole: React.FC<Ctx> = ({p, f}) => (
  <>
    <Glow cx={640} cy={360} r={380} color={p.c} />
    {Array.from({length: 10}).map((_, i) => {
      const r = 60 + i * 34 + Math.sin(f / 6 + i) * 8;
      return (
        <circle
          key={i}
          cx={640}
          cy={360}
          r={r}
          fill="none"
          stroke={i % 2 ? p.a : p.b}
          strokeWidth={10 - i * 0.6}
          opacity={1 - i * 0.075}
        />
      );
    })}
    <circle cx={640} cy={360} r={26} fill={p.c} />
  </>
);

const strip: React.FC<Ctx> = ({p, f}) => {
  const y = (f * 26) % 260;
  return (
    <>
      <Glow cx={640} cy={360} r={360} color={p.b} />
      <g transform={`translate(640 ${360 - y})`}>
        {Array.from({length: 8}).map((_, i) => (
          <g key={i}>
            <rect x={-220} y={i * 260 - 500} width={440} height={240} fill={i % 2 ? p.c : p.a} />
            <rect x={-220} y={i * 260 - 500} width={440} height={240} fill={p.b} opacity={0.18} />
          </g>
        ))}
      </g>
      <rect x={420} y={0} width={440} height={720} fill="none" stroke={p.b} strokeWidth={6} opacity={0.9} />
      <rect x={420} y={0} width={440} height={720} fill="none" stroke={p.b} strokeWidth={24} opacity={0.25} style={{filter: 'blur(8px)'}} />
    </>
  );
};

const glitch: React.FC<Ctx> = ({p, f}) => {
  const r = rnd(Math.floor(f / 3));
  return (
    <>
      <Glow cx={640} cy={360} r={360} color={p.c} />
      <g transform="translate(640 360)">
        <Shadow x={-260} y={-170} w={520} h={340} rx={20} color={shade(p.bg1, 0.4)} />
        <rect x={-260} y={-170} width={520} height={340} rx={20} fill={p.a} />
        {Array.from({length: 12}).map((_, i) => (
          <rect
            key={i}
            x={-260}
            y={-170 + i * 28}
            width={520}
            height={14}
            fill={r() < 0.5 ? p.c : p.b}
            opacity={0.7}
            transform={`translate(${(r() - 0.5) * 40} 0)`}
          />
        ))}
      </g>
    </>
  );
};

const megaphone: React.FC<Ctx> = ({p, f}) => {
  const pulse = 1 + Math.sin(f / 8) * 0.05;
  return (
    <>
      <Glow cx={700} cy={340} r={340} color={p.c} />
      <g transform="translate(660 360) rotate(-12)">
        <Shadow x={-60} y={-60} w={320} h={120} rx={30} color={shade(p.bg1, 0.4)} />
        <polygon points="-60,-60 260,-160 260,160 -60,60" fill={p.c} />
        <polygon points="-60,-60 260,-160 260,0 -60,0" fill={shade(p.c, 0.16)} />
        <rect x={-140} y={-50} width={90} height={100} rx={28} fill={p.a} />
        <path d="M-100 50 L-70 130 L-20 130 L-50 50 Z" fill={p.a} />
      </g>
      <g transform={`translate(1040 220) scale(${pulse})`} opacity={0.85}>
        <path d="M0 0 Q40 40 0 80" stroke={p.a} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M30 -20 Q90 40 30 100" stroke={p.a} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.7} />
      </g>
      <g transform="translate(300 500)">
        <CircleShadow cx={0} cy={0} r={90} color={shade(p.bg1, 0.4)} />
        <circle r={90} fill={p.b} />
      </g>
    </>
  );
};

const MOTIF: Record<Motif, React.FC<Ctx>> = {
  record, sun, portal, cards, cassette, bolt, puppet, burst, planet, chair, pupil,
  flower, phone, cherry, sphere, puppet2, moon, drip, tunnel, ball, wormhole, strip,
  glitch, megaphone, record2: record,
};

// ── scene wrapper: backplate + far blur plate + parallax midground ──────────
export const SceneArt: React.FC<{motif: Motif; mood: Mood; seed: number; drift: number}> = ({
  motif, mood, seed, drift,
}) => {
  const {id} = useVideoConfig();
  const f = useCurrentFrame() + seed;
  const p = PALETTE[mood];
  const Art = MOTIF[motif];
  const uid = `${id}-${seed}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display: 'block'}}>
      <defs>
        <linearGradient id={`bg${uid}`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.deep} />
        </linearGradient>
        <filter id={`blur${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={12} />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#bg${uid})`} />
      {/* far plate: blurred, scaled, low contrast, parallax 0.4x */}
      <g transform={`translate(${-drift * 0.4} 0) scale(1.12 1.12) translate(-70 -45)`} filter={`url(#blur${uid})`} opacity={0.55}>
        <Art p={p} f={f * 0.5} seed={seed} />
      </g>
      {/* midground */}
      <g transform={`translate(${-drift} 0)`}>
        <Art p={p} f={f} seed={seed} />
      </g>
    </svg>
  );
};
