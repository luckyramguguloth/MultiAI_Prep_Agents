"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";

interface Agent3DNodeProps {
  id: string;
  name: string;
  status: "IDLE" | "WORKING" | "ERROR";
  message: string;
  position: [number, number, number];
}

export default function Agent3DNode({ id, name, status, message, position }: Agent3DNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const isWorking = status === "WORKING";
  const color = isWorking ? "#10b981" : status === "ERROR" ? "#ef4444" : "#3b82f6";

  useFrame((state, delta) => {
    if (meshRef.current && isWorking) {
      // Simulate typing/working animation by subtle rapid shaking/bouncing
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 20) * 0.05;
      meshRef.current.rotation.y += delta * 0.5;
    } else if (meshRef.current) {
      // Idle breathing animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Reset rotation slowly
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Voxel Character Representation */}
      <mesh ref={meshRef} castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 3D Text Label */}
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>

      {/* Desk/Tree Prop simulation (A simple base) */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color={isWorking ? "#334155" : "#1e293b"} />
      </mesh>

      {/* HTML Overlay for detailed real-time logs */}
      <Html position={[0, -1, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="w-64 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white shadow-2xl pointer-events-none transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isWorking ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase opacity-70">
              {status}
            </span>
          </div>
          <p className="text-xs font-mono text-emerald-300 leading-relaxed">
            {message || "Awaiting instructions..."}
          </p>
        </div>
      </Html>
    </group>
  );
}
