import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {SCENES, sceneAt, CAM_END, WHIP, FLASH, IRIS_IN, W, H} from './theme';
import {SceneArt} from './Scenes';
import {Captions, Credit} from './Caption';

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// lazy handheld drift, 4-8px, two slow sine bands
const drift = (f: number) => Math.sin(f / 22) * 4 + Math.sin(f / 37 + 1.7) * 3;

const Scene: React.FC<{index: number}> = ({index}) => {
  const f = useCurrentFrame();
  const scene = SCENES[index];
  const len = scene.end - scene.start;
  const t = f - scene.start; // local frame
  const progress = t / Math.max(1, len - 1);
  const endScale = CAM_END[scene.motif] ?? 1.06;

  // slow push-in; tunnel / iris shots push much harder
  const scale = interpolate(progress, [0, 1], [1.0, endScale], {
    easing: ease,
    extrapolateRight: 'clamp',
  });

  // whip-pan out on the last 11 frames of flagged scenes
  let whipX = 0;
  if (WHIP.has(index) && t > len - 12) {
    const wp = (t - (len - 12)) / 11;
    whipX = ease(wp) * (index % 2 === 0 ? 180 : -150);
  }

  const d = drift(f);

  return (
    <AbsoluteFill>
      {/* camera rig: push + drift + whip. Type stays outside this. */}
      <AbsoluteFill
        style={{
          transform: `translate(${d + whipX}px, ${d * 0.6}px) scale(${scale})`,
          filter: whipX !== 0 ? `blur(${Math.abs(whipX) / 9}px)` : undefined,
        }}
      >
        <SceneArt motif={scene.motif} mood={scene.mood} seed={scene.start} drift={d} />
      </AbsoluteFill>
      {/* captions ride above art, unaffected by camera motion */}
      <Captions x={scene.captionX} y={scene.captionY} />
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const scene = sceneAt(f);
  const idx = scene.index;
  const t = f - scene.start;

  // circular iris reveal that opens the flagged scenes
  const iris = IRIS_IN.has(idx)
    ? interpolate(t, [0, 13], [0.08 * H, 1.6 * Math.hypot(W, H)], {
        easing: easeOut,
        extrapolateRight: 'clamp',
      })
    : null;

  // 2-frame white flash on the hardest cuts
  const flash = FLASH.has(idx) && t < 2 ? 0.24 : 0;

  return (
    <AbsoluteFill style={{background: '#0A0620'}}>
      <AbsoluteFill
        style={{
          filter: 'saturate(1.18) contrast(1.08)',
          clipPath: iris !== null ? `circle(${iris}px at 50% 48%)` : undefined,
        }}
      >
        <Scene key={idx} index={idx} />
      </AbsoluteFill>

      {flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
      <Credit />
    </AbsoluteFill>
  );
};
