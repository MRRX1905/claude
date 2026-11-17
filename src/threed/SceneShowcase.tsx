import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, AbsoluteFill, Audio, staticFile} from 'remotion';
import * as THREE from 'three';
import {Bird, CameraRig, Cloud, Dust, phraseAt, signTex, Steam, Subtitle, windowTex} from './kit';

type Look = 'storybook' | 'heritage' | 'cinema';
const looks: Record<Look, {
  sky: string; sun: string; light: string; wood: string; roof: string;
  awning: [string, string]; sign: string; signInk: string; street: string;
  foliage: string; accent: string; camera: [number, number, number];
}> = {
  storybook: {
    sky: '#9dcbd1', sun: '#ffe4a0', light: '#fff0cf', wood: '#a85e39', roof: '#384b49',
    awning: ['#e8dcc0', '#b74735'], sign: '#264e4a', signInk: '#f2d7a0', street: '#77766b',
    foliage: '#3d7060', accent: '#ffc16e', camera: [0.4, 7.3, 17.5],
  },
  heritage: {
    sky: '#b8c9c0', sun: '#efd5a0', light: '#fff0cf', wood: '#82513b', roof: '#343d39',
    awning: ['#d8cba7', '#86513e'], sign: '#253d3b', signInk: '#e4cd93', street: '#696b65',
    foliage: '#456452', accent: '#dda869', camera: [-0.7, 7.6, 18.2],
  },
  cinema: {
    sky: '#607e88', sun: '#f7bf72', light: '#ffe2ad', wood: '#73422f', roof: '#172d31',
    awning: ['#dfd1b2', '#a04a36'], sign: '#183c40', signInk: '#f2c777', street: '#373f40',
    foliage: '#234c43', accent: '#ffba67', camera: [1.1, 7.1, 16.8],
  },
};

const Box: React.FC<{
  pos: [number, number, number]; size: [number, number, number]; color: string;
  rot?: [number, number, number]; rough?: number; metal?: number; emissive?: string;
}> = ({pos, size, color, rot = [0, 0, 0], rough = 0.82, metal = 0, emissive = '#000000'}) => (
  <mesh position={pos} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive} />
  </mesh>
);

const Orb: React.FC<{
  pos: [number, number, number]; size: number; color: string; emissive?: string; rough?: number;
}> = ({pos, size, color, emissive = '#000000', rough = 0.75}) => (
  <mesh position={pos} castShadow>
    <sphereGeometry args={[size, 18, 14]} />
    <meshStandardMaterial color={color} emissive={emissive} roughness={rough} />
  </mesh>
);

const Mug: React.FC<{frame: number; color: string}> = ({frame, color}) => (
  <group position={[-1.75, 0.96, 3.9]} rotation={[0, -0.18, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.22, 0.18, 0.42, 20]} />
      <meshStandardMaterial color={color} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.215, 0]}>
      <cylinderGeometry args={[0.185, 0.185, 0.015, 20]} />
      <meshStandardMaterial color="#30221b" roughness={0.2} />
    </mesh>
    <mesh position={[0.245, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.105, 0.035, 8, 20]} />
      <meshStandardMaterial color={color} roughness={0.35} />
    </mesh>
    <Steam x={0} y={0.32} z={0} frame={frame} count={7} height={1.25} size={0.13} color="#fff6e5" opacity={0.3} speed={0.45} />
  </group>
);

const Talkers: React.FC<{frame: number; skin: string; shirtA: string; shirtB: string}> = ({frame, skin, shirtA, shirtB}) => {
  const nodA = Math.sin(frame * 0.08) * 0.07;
  const nodB = Math.sin(frame * 0.075 + 1.4) * 0.06;
  const gesture = Math.sin(frame * 0.09) * 0.24;
  return (
    <group position={[2.2, 0, 1.35]} scale={0.82}>
      {[{x: -0.58, shirt: shirtA, nod: nodA}, {x: 0.58, shirt: shirtB, nod: nodB}].map((p, i) => (
        <group key={i} position={[p.x, 0, 0]}>
          <mesh position={[0, 1.1, 0]} rotation={[0, 0, p.nod]} castShadow>
            <capsuleGeometry args={[0.17, 0.62, 5, 10]} />
            <meshStandardMaterial color={p.shirt} roughness={0.92} />
          </mesh>
          {[-0.1, 0.1].map((lx) => <group key={lx}>
            <mesh position={[lx, 0.56, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.075, 0.3, 4, 8]} /><meshStandardMaterial color="#33393a" /></mesh>
            <mesh position={[lx, 0.28, 0.38]} castShadow><capsuleGeometry args={[0.055, 0.3, 4, 8]} /><meshStandardMaterial color="#33393a" /></mesh>
          </group>)}
          <Orb pos={[0, 1.64, 0]} size={0.2} color={skin} />
          <Orb pos={[-0.12, 1.71, -0.025]} size={0.1} color="#26211d" />
          <mesh position={[i === 0 ? 0.27 : -0.27, 1.16, 0.02]} rotation={[0, 0, (i ? -1 : 1) * (0.3 + gesture)]} castShadow>
            <capsuleGeometry args={[0.07, 0.47, 4, 8]} />
            <meshStandardMaterial color={p.shirt} />
          </mesh>
          <Box pos={[0, 0.67, -0.02]} size={[0.48, 0.12, 0.42]} color="#604734" />
          {[-0.17, 0.17].map((sx) => [-0.14, 0.14].map((sz) => <Box key={`${sx}:${sz}`} pos={[sx, 0.32, sz - 0.02]} size={[0.07, 0.58, 0.07]} color="#604734" />))}
        </group>
      ))}
    </group>
  );
};

const Pedicab: React.FC<{frame: number; trim: string; body: string; canopy: string}> = ({frame, trim, body, canopy}) => {
  const x = -4.1 + ((frame * 0.045) % 8.2);
  const wheelSpin = -frame * 0.13;
  return (
    <group position={[x, 0, 2.25]} rotation={[0, 0, 0]}>
      <Box pos={[0, 1.05, 0]} size={[1.15, 0.56, 0.95]} color={body} />
      <Box pos={[0, 1.4, -0.06]} size={[1.3, 0.12, 1.12]} color={trim} />
      <Box pos={[0, 1.81, 0.05]} size={[1.52, 0.13, 1.33]} color={canopy} rot={[0.04, 0, 0.015]} />
      <Box pos={[-0.68, 1.62, 0.05]} size={[0.1, 0.47, 1.05]} color={trim} />
      <Box pos={[0.68, 1.62, 0.05]} size={[0.1, 0.47, 1.05]} color={trim} />
      <Box pos={[0, 1.05, 0.49]} size={[0.77, 0.42, 0.08]} color="#332e28" />
      <group position={[0.93, 0.41, 0.03]} rotation={[0, 0, wheelSpin]}>
        <mesh>
          <torusGeometry args={[0.34, 0.07, 8, 20]} />
          <meshStandardMaterial color="#262726" roughness={0.9} />
        </mesh>
        <Orb pos={[0, 0, 0]} size={0.105} color="#c0b6a1" />
        {Array.from({length: 8}, (_, i) => <Box key={i} pos={[0, 0, 0]} size={[0.025, 0.59, 0.025]} color="#bcb5a4" rot={[0, 0, i * Math.PI / 4]} />)}
      </group>
      <group position={[-0.91, 0.41, 0.03]} rotation={[0, 0, wheelSpin]}>
        <mesh>
          <torusGeometry args={[0.34, 0.07, 8, 20]} />
          <meshStandardMaterial color="#262726" roughness={0.9} />
        </mesh>
        <Orb pos={[0, 0, 0]} size={0.105} color="#c0b6a1" />
        {Array.from({length: 8}, (_, i) => <Box key={i} pos={[0, 0, 0]} size={[0.025, 0.59, 0.025]} color="#bcb5a4" rot={[0, 0, i * Math.PI / 4]} />)}
      </group>
      <Box pos={[1.4, 0.73, 0]} size={[0.52, 0.12, 0.12]} color="#3b3932" rot={[0, 0, -0.08]} />
      <Box pos={[1.59, 0.95, 0]} size={[0.09, 0.55, 0.09]} color="#4a453a" rot={[0, 0, -0.12]} />
      <Orb pos={[1.59, 1.33, 0]} size={0.19} color="#8c6047" />
      <Box pos={[1.59, 1.07, 0]} size={[0.43, 0.48, 0.34]} color="#d6bd91" />
      <mesh position={[0.78, 1.17, 0.53]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#ffc56e" emissive="#ffa22b" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const Shop: React.FC<{frame: number; c: typeof looks[Look]}> = ({frame, c}) => {
  const sign = signTex('KOPI MEDAN', c.sign, c.signInk);
  const windows = windowTex(5, 3, '#18272a', '#db9d50', 71);
  const awning = Array.from({length: 15}, (_, i) => (
    <Box key={i} pos={[-3.5 + i * 0.5, 4.03, -2.53]} size={[0.5, 0.38, 1.22]} color={i % 2 === 0 ? c.awning[0] : c.awning[1]} rot={[0.1, 0, 0]} />
  ));
  return (
    <group>
      <Box pos={[0, 2.65, -4.0]} size={[7.6, 5.3, 0.52]} color={c.wood} />
      {Array.from({length: 16}, (_, i) => <Box key={i} pos={[-3.56 + i * 0.47, 2.52, -3.72]} size={[0.045, 4.65, 0.025]} color={i % 3 ? '#c48156' : '#6f432f'} />)}
      <Box pos={[0, 5.22, -4.0]} size={[8.1, 0.3, 0.72]} color={c.roof} />
      {Array.from({length: 10}, (_, i) => <Box key={i} pos={[-3.7 + i * 0.82, 5.4, -3.98]} size={[0.8, 0.16, 0.76]} color={i % 2 ? '#59493c' : '#76614a'} rot={[0, 0, -0.04]} />)}
      <Box pos={[0, 4.54, -3.64]} size={[2.3, 0.52, 0.22]} color="#3c2e25" />
      <mesh position={[0, 4.54, -3.49]}>
        <planeGeometry args={[2.18, 0.42]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      <Box pos={[-2.15, 2.75, -3.61]} size={[2.6, 2.12, 0.17]} color="#31271f" />
      <mesh position={[-2.15, 2.75, -3.49]}>
        <planeGeometry args={[2.42, 1.93]} />
        <meshStandardMaterial map={windows} roughness={0.28} metalness={0.18} emissive="#a56128" emissiveIntensity={0.12} />
      </mesh>
      {[-3.42, -2.15, -0.88].map((x) => <Box key={x} pos={[x, 2.75, -3.38]} size={[0.09, 2.25, 0.14]} color="#d1a16c" />)}
      <Box pos={[-2.15, 2.75, -3.36]} size={[2.65, 0.09, 0.14]} color="#d1a16c" />
      <Box pos={[-2.15, 2.0, -3.36]} size={[2.65, 0.08, 0.14]} color="#d1a16c" />
      <Box pos={[1.43, 2.22, -3.57]} size={[1.75, 3.1, 0.22]} color="#33251d" />
      <Box pos={[1.43, 2.22, -3.43]} size={[1.52, 2.86, 0.14]} color="#18383a" emissive="#18383a" />
      <Box pos={[0.42, 2.7, -3.36]} size={[0.1, 2.35, 0.18]} color="#daa46d" />
      <Box pos={[2.47, 2.7, -3.36]} size={[0.1, 2.35, 0.18]} color="#daa46d" />
      <Box pos={[1.44, 3.1, -3.31]} size={[1.9, 0.08, 0.2]} color="#d7aa73" />
      {awning}
      <Box pos={[-3.4, 0.48, -1.85]} size={[0.16, 0.95, 0.16]} color="#50372a" />
      <Box pos={[3.4, 0.48, -1.85]} size={[0.16, 0.95, 0.16]} color="#50372a" />
      <Box pos={[0, 0.16, -1.73]} size={[7.3, 0.22, 0.62]} color="#6c4633" />
      {[-2.5, -1.2, 0.1, 1.4, 2.7].map((x, i) => (
        <group key={i} position={[x, 4.83, -2.72]}>
          <Box pos={[0, 0.32, 0]} size={[0.035, 0.53, 0.035]} color="#5b4936" />
          <mesh position={[0, 0.01, 0]}>
            <sphereGeometry args={[0.12, 12, 10]} />
            <meshStandardMaterial color={c.light} emissive={c.accent} emissiveIntensity={2.3 + Math.sin(frame * 0.08 + i) * 0.3} />
          </mesh>
          <pointLight position={[0, -0.05, 0.1]} color={c.accent} intensity={0.7} distance={2.8} />
        </group>
      ))}
    </group>
  );
};

const Tree: React.FC<{x: number; z: number; size: number; color: string; frame: number}> = ({x, z, size, color, frame}) => (
  <group position={[x, 0, z]} rotation={[0, 0, Math.sin(frame * 0.025 + x) * 0.025]}>
    <mesh position={[0, size, 0]} castShadow>
      <cylinderGeometry args={[0.16 * size, 0.25 * size, size * 2, 7]} />
      <meshStandardMaterial color="#584434" />
    </mesh>
    {[[0, 2.25, 0, 1], [-0.42, 1.94, 0.12, 0.78], [0.43, 1.9, -0.08, 0.82], [0.1, 2.66, -0.12, 0.73]].map(([dx, dy, dz, s], i) => (
      <mesh key={i} position={[dx * size, dy * size, dz * size]} scale={size} castShadow>
        <icosahedronGeometry args={[0.54 * s, 1]} />
        <meshStandardMaterial color={i % 2 ? color : new THREE.Color(color).multiplyScalar(0.82)} roughness={1} />
      </mesh>
    ))}
  </group>
);

const World: React.FC<{look: Look; frame: number}> = ({look, frame}) => {
  const c = looks[look];
  const sunY = 7.1 + Math.sin(frame / 300 * Math.PI) * 0.2;
  const cloudX = -3 + (frame / 300) * 5.5;
  const p = phraseAt(frame);
  const cameraSway = Math.sin(frame / 36) * 0.22;
  return (
    <>
      <color attach="background" args={[c.sky]} />
      <fog attach="fog" args={[c.sky, 19, 42]} />
      <CameraRig pos={[c.camera[0] + cameraSway, c.camera[1] + Math.sin(frame / 60) * 0.07, c.camera[2]]} look={[0, 2.28, 0]} fov={36} />
      <ambientLight intensity={look === 'cinema' ? 1.15 : 1.35} color="#ffe8c8" />
      <directionalLight position={[-6, 10, 6]} intensity={look === 'cinema' ? 3.1 : 2.4} color={c.sun} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[0, 3.4, 0]} intensity={1.2} distance={8} color={c.accent} />
      <mesh position={[0, sunY, -13]}>
        <sphereGeometry args={[1.05, 24, 16]} />
        <meshBasicMaterial color={c.sun} toneMapped={false} />
      </mesh>
      <Cloud x={-4.3 + cloudX * 0.45} y={7.2} z={-11} scale={1.25} color="#f5e3c7" opacity={0.5} />
      <Cloud x={4.2 - cloudX * 0.28} y={6.45} z={-12} scale={0.8} color="#e7e3d4" opacity={0.48} />
      <group rotation={[0, Math.sin(frame / 82) * 0.018, 0]}>
        <Shop frame={frame} c={c} />
        <Tree x={-4.55} z={-2.3} size={1.42} color={c.foliage} frame={frame} />
        <Tree x={4.65} z={-2.6} size={1.35} color={c.foliage} frame={frame} />
        <Talkers frame={frame} skin="#8c5b43" shirtA="#526f62" shirtB="#ba8050" />
        <Pedicab frame={frame} trim={c.roof} body="#bf6f3d" canopy={c.awning[1]} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[18, 26]} />
        <meshStandardMaterial color={c.street} roughness={0.93} />
      </mesh>
      <Box pos={[0, 0.015, 1.3]} size={[18, 0.035, 0.1]} color="#d3b97d" />
      <Box pos={[0, 0.016, 5.1]} size={[18, 0.04, 0.18]} color="#474943" />
      {[-0.8, 1.2, 3.2].map((z) => <Box key={z} pos={[0, 0.01, z]} size={[0.5, 0.02, 0.08]} color="#d2c197" />)}
      <group position={[-1.75, 0.76, 3.9]}>
        <Box pos={[0, 0, 0]} size={[1.5, 0.12, 0.95]} color="#81563b" />
        <Box pos={[-0.62, -0.35, -0.37]} size={[0.1, 0.75, 0.1]} color="#644632" />
        <Box pos={[0.62, -0.35, -0.37]} size={[0.1, 0.75, 0.1]} color="#644632" />
        <Box pos={[-0.62, -0.35, 0.37]} size={[0.1, 0.75, 0.1]} color="#644632" />
        <Box pos={[0.62, -0.35, 0.37]} size={[0.1, 0.75, 0.1]} color="#644632" />
      </group>
      <Mug frame={frame} color="#e4d2aa" />
      <Dust frame={frame} count={52} color={c.sun} span={12} height={7} />
      {[[-2.8, 8.4, -7], [0.1, 8.9, -7.4], [3.1, 8.15, -7.8]].map(([x, y, z], i) => <Bird key={i} x={x} y={y + Math.sin(frame * 0.09 + i) * 0.12} z={z} frame={frame} phase={i * 1.7} scale={0.17} color="#374541" />)}
      {p && <pointLight position={[0, 2, 0]} intensity={0.18 + Math.sin(frame * 0.2) * 0.08} color={c.accent} />}
    </>
  );
};

export const SceneShowcase: React.FC<{look: Look}> = ({look}) => {
  const frame = useCurrentFrame();
  const c = looks[look];
  return (
    <AbsoluteFill style={{background: c.sky, overflow: 'hidden'}}>
      <ThreeCanvas width={1080} height={1920} camera={{position: c.camera, fov: 36}} shadows>
        <World look={look} frame={frame} />
      </ThreeCanvas>
      <div style={{position: 'absolute', left: 46, top: 72, color: '#fff6df', fontFamily: 'Georgia, serif', fontSize: 22, textShadow: '0 2px 14px rgba(0,0,0,.55)'}}>
        Medan, pagi hari
      </div>
      <Subtitle frame={frame} accent={c.accent} />
      <div style={{position: 'absolute', bottom: 36, left: 44, right: 44, height: 3, background: 'rgba(255,245,220,.25)'}}>
        <div style={{height: '100%', width: `${Math.min(100, frame / 299 * 100)}%`, background: c.accent}} />
      </div>
      <Audio src={staticFile('voice.mp3')} endAt={300} />
    </AbsoluteFill>
  );
};

export const SceneStorybook: React.FC = () => <SceneShowcase look="storybook" />;
export const SceneHeritage: React.FC = () => <SceneShowcase look="heritage" />;
export const SceneCinema: React.FC = () => <SceneShowcase look="cinema" />;
