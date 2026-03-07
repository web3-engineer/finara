"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface WaveProps {
  color: string;
  positionY: number;
  speed: number;
  opacity: number;
  frequency: number;
  amplitude: number;
  flowDirection?: [number, number];
}

const WaveMesh = ({ color, positionY, speed, opacity, frequency, amplitude, flowDirection = [1, 1] }: WaveProps) => {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const [offset] = useState(() => Math.random() * 100);

  // IMPORTANT: Geometry is built imperatively to avoid <bufferAttribute> JSX type errors in R3F v9.
  // Do NOT replace this with useMemo + <bufferAttribute> JSX — it will break TypeScript.
  useEffect(() => {
    const geo = geomRef.current;
    if (!geo) return;
    const width = 60, depth = 60, widthSegments = 100, depthSegments = 100;
    const v: number[] = [], idx: number[] = [];
    for (let y = 0; y <= depthSegments; y++) {
      for (let x = 0; x <= widthSegments; x++) {
        v.push((x / widthSegments - 0.5) * width, (y / depthSegments - 0.5) * depth, 0);
        const i = y * (widthSegments + 1) + x;
        if (x < widthSegments) idx.push(i, i + 1);
        if (y < depthSegments) idx.push(i, i + (widthSegments + 1));
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(v), 3));
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1));
  }, []);

  useFrame((state) => {
    if (!geomRef.current) return;
    const time = state.clock.getElapsedTime() * speed + offset;
    const positions = geomRef.current.attributes.position;
    const [flowX, flowY] = flowDirection;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      let z = Math.sin(x * frequency * 0.4 * flowX + time * 0.5) * Math.cos(y * frequency * 0.3 * flowY + time * 0.6) * amplitude;
      z += Math.sin((x * 0.7 + y * 0.3) * frequency + time * 1.1) * (amplitude * 0.4);
      z += Math.cos((x * 1.2 - y * 0.8) * frequency * 2.0 + time * 1.8) * (amplitude * 0.15);
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
  });

  return (
    <lineSegments rotation={[-Math.PI / 2.1, 0, 0]} position={[0, positionY, 0]}>
      <bufferGeometry ref={geomRef} />
      <lineBasicMaterial color={color} transparent={true} opacity={opacity} depthTest={true} depthWrite={false} />
    </lineSegments>
  );
};

export default function FinaraWaves() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const lightFog = "#f8fafc";
  const lightWave1 = "#0d9488";
  const lightWave2 = "#34d399";

  const darkFog = "#0a0705";
  const darkWave1 = "#2563eb";
  const darkWave2 = "#ea580c";

  const fogColor = isDark ? darkFog : lightFog;
  const waveColor1 = isDark ? darkWave1 : lightWave1;
  const waveColor2 = isDark ? darkWave2 : lightWave2;

  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none transition-colors duration-500" style={{ backgroundColor: fogColor }}>
      <Canvas camera={{ position: [0, 1.5, 7.5], fov: 65 }}>
        <fog attach="fog" args={[fogColor, 2, 20]} />
        <WaveMesh color={waveColor1} positionY={-1.0} speed={0.4} opacity={0.35} frequency={0.2} amplitude={1.2} flowDirection={[0.8, 1.2]} />
        <WaveMesh color={waveColor2} positionY={-0.6} speed={0.7} opacity={0.25} frequency={0.35} amplitude={0.6} flowDirection={[1.2, 0.6]} />
      </Canvas>
    </div>
  );
}
