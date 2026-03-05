"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Tipagem para as propriedades da nossa Onda
interface WaveProps {
  color: string;
  positionY: number;
  speed: number;
  opacity: number;
  frequency: number;
  amplitude: number;
}

const WaveMesh = ({ color, positionY, speed, opacity, frequency, amplitude }: WaveProps) => {
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (!geomRef.current) return;

    const time = state.clock.getElapsedTime() * speed;
    const positionAttribute = geomRef.current.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i); 

      // Matemática da onda
      const z =
        Math.sin(x * frequency + time) * amplitude +
        Math.cos(y * frequency + time * 0.8) * amplitude;

      positionAttribute.setZ(i, z);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, positionY, 0]}>
      <planeGeometry ref={geomRef} args={[40, 40, 70, 70]} />
      <meshBasicMaterial
        color={color}
        wireframe={true}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
};

export default function FinaraWaves() {
  return (
    // Alterado para absolute para se encaixar no container da Home
    // O fundo foi ajustado para #0a0705 para bater com o tema principal da Finara
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none bg-[#0a0705]">      
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>

        {/* Nevoeiro (Fog) atualizado para a cor base do projeto Finara */}
        <fog attach="fog" args={["#0a0705", 5, 15]} />

        {/* Onda 1: Laranja Vibrante (Trazendo o calor e a energia do tema africano) */}
        <WaveMesh
          color="#f97316" // Tailwind orange-500
          positionY={-1.5}
          speed={1.2}
          opacity={0.35}
          frequency={0.3}
          amplitude={0.6}
        />

        {/* Onda 2: Vermelho Terroso / Rosa Escuro (Criando contraste com a onda laranja) */}
        <WaveMesh
          color="#e11d48" // Tailwind rose-600
          positionY={-2.2}
          speed={0.7}
          opacity={0.25}
          frequency={0.2}
          amplitude={1.0}
        />

      </Canvas>
    </div>
  );
}