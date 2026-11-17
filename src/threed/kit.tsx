import * as THREE from 'three';
import React from 'react';
import {useThree} from '@react-three/fiber';
import {PHRASES} from '../previews/data';

export const texCache = new Map<string, THREE.CanvasTexture>();

export const canvasTexture = (
  key: string,
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) => {
  const hit = texCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  texCache.set(key, tex);
  return tex;
};

export const signTex = (text: string, bg: string, fg: string) =>
  canvasTexture(`sign:${text}:${bg}:${fg}`, 512, 192, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 8;
    ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.fillStyle = fg;
    let size = 96;
    do {
      ctx.font = `bold ${size}px Georgia, serif`;
      size -= 4;
    } while (ctx.measureText(text).width > w - 70 && size > 24);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 6);
  });

export const windowTex = (cols: number, rows: number, base: string, lit: string, seed: number) =>
  canvasTexture(`win:${cols}:${rows}:${base}:${lit}:${seed}`, cols * 64, rows * 64, (ctx, w, h) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280), s / 233280);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const on = rnd() > 0.45;
        ctx.fillStyle = on ? lit : '#0b0d0f';
        ctx.globalAlpha = on ? 0.55 + rnd() * 0.45 : 0.9;
        ctx.fillRect(x * 64 + 12, y * 64 + 14, 40, 36);
      }
    }
    ctx.globalAlpha = 1;
  });

// deterministic rng
export const rng = (seed: number) => {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647), (s - 1) / 2147483646);
};

export const CameraRig: React.FC<{
  pos: [number, number, number];
  look: [number, number, number];
  fov?: number;
}> = ({pos, look, fov = 32}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...pos);
  camera.lookAt(...look);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

export const Steam: React.FC<{
  x: number;
  y: number;
  z: number;
  frame: number;
  count?: number;
  color?: string;
  height?: number;
  size?: number;
  speed?: number;
  opacity?: number;
}> = ({x, y, z, frame, count = 9, color = '#ffffff', height = 1.6, size = 0.16, speed = 0.55, opacity = 0.3}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const t = ((frame * 0.01 * speed + i / count) % 1 + 1) % 1;
      const sway = Math.sin(frame * 0.05 + i * 1.7) * 0.16 * t;
      const s = size * (0.35 + t * 1.3);
      return (
        <mesh key={i} position={[x + sway, y + t * height, z + Math.cos(frame * 0.04 + i) * 0.07 * t]}>
          <sphereGeometry args={[s, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={(1 - t) * opacity} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);

export const Rain: React.FC<{frame: number; count?: number; span?: number; color?: string; speed?: number}> = ({
  frame,
  count = 220,
  span = 16,
  color = '#b8ccda',
  speed = 0.55,
}) => {
  const rand = rng(7);
  const drops = React.useMemo(
    () => Array.from({length: count}, () => ({x: (rand() - 0.5) * span, z: (rand() - 0.5) * 16, o: rand(), sp: 0.7 + rand() * 0.6})),
    [count, span],
  );
  return (
    <>
      {drops.map((d, i) => {
        const y = 11 - (((frame * speed * d.sp + d.o * 11) % 11) + 11) % 11;
        return (
          <mesh key={i} position={[d.x, y, d.z]} rotation={[0.06, 0, 0.02]}>
            <boxGeometry args={[0.014, 0.42, 0.014]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

export const Dust: React.FC<{frame: number; count?: number; color?: string; span?: number; height?: number}> = ({
  frame,
  count = 80,
  color = '#ffd9a0',
  span = 14,
  height = 7,
}) => {
  const rand = rng(21);
  const motes = React.useMemo(() => Array.from({length: count}, () => ({x: (rand() - 0.5) * span, y: rand() * height, z: (rand() - 0.5) * span, o: rand()})), [count, span, height]);
  return (
    <>
      {motes.map((m, i) => {
        const y = (m.y + frame * 0.006 * (1 + m.o)) % height;
        const x = m.x + Math.sin(frame * 0.01 + i) * 0.5;
        return (
          <mesh key={i} position={[x, y, m.z]}>
            <sphereGeometry args={[0.022 + m.o * 0.02, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.5 * (0.4 + m.o * 0.6)} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

export const Bird: React.FC<{x: number; y: number; z: number; frame: number; phase?: number; scale?: number; color?: string}> = ({
  x,
  y,
  z,
  frame,
  phase = 0,
  scale = 0.14,
  color = '#2c2a26',
}) => {
  const flap = Math.sin(frame * 0.5 + phase) * 0.7;
  return (
    <group position={[x, y, z]} rotation={[0, 0, 0]}>
      <mesh rotation={[0, 0, flap]} position={[-scale * 0.6, 0, 0]}>
        <boxGeometry args={[scale, scale * 0.08, scale * 0.35]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh rotation={[0, 0, -flap]} position={[scale * 0.6, 0, 0]}>
        <boxGeometry args={[scale, scale * 0.08, scale * 0.35]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <boxGeometry args={[scale * 0.5, scale * 0.2, scale * 0.28]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export const Cloud: React.FC<{x: number; y: number; z: number; scale?: number; color?: string; opacity?: number}> = ({
  x,
  y,
  z,
  scale = 1,
  color = '#ffffff',
  opacity = 0.5,
}) => (
  <group position={[x, y, z]}>
    {[[0, 0, 0, 1], [0.7, 0.12, 0.1, 0.72], [-0.7, 0.06, -0.06, 0.66], [0.25, 0.3, -0.1, 0.55]].map(([dx, dy, dz, s], i) => (
      <mesh key={i} position={[dx * scale, dy * scale, dz * scale]}>
        <sphereGeometry args={[0.6 * scale * s, 14, 12]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    ))}
  </group>
);

// pull the spoken phrase for a given frame; subtitle + scene accents can share it
export const phraseAt = (frame: number, fps = 30) => {
  const s = frame / fps;
  return PHRASES.find((p) => s >= p.start - 0.05 && s < p.end + 0.25) ?? null;
};

export const Subtitle: React.FC<{frame: number; tone?: 'dark' | 'light'; accent?: string}> = ({
  frame,
  tone = 'light',
  accent = '#ffcf8a',
}) => {
  const p = phraseAt(frame);
  if (!p) return null;
  const local = frame - p.start * 30;
  const opacity = Math.min(1, Math.max(0, local / 6));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 128,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 820,
          padding: '14px 30px',
          borderRadius: 4,
          background: tone === 'dark' ? 'rgba(10,10,12,.55)' : 'rgba(20,16,10,.46)',
          backdropFilter: 'blur(6px)',
          color: tone === 'dark' ? '#f4f1ea' : '#fdf6e9',
          fontFamily: 'Georgia, serif',
          fontSize: 34,
          lineHeight: 1.25,
          textAlign: 'center',
          borderLeft: `3px solid ${accent}`,
        }}
      >
        {p.text}
      </div>
    </div>
  );
};
