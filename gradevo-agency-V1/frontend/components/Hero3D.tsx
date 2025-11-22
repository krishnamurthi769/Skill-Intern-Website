
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Environment,
  MeshDistortMaterial,
  ContactShadows,
  TorusKnot,
  Octahedron,
  Box,
  Stars,
  PerspectiveCamera,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
import { BRAND_COLORS } from '../constants';

// Augment JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      icosahedronGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

const CreativitySymbol = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Organic complex rotation simulating a thinking mind or evolving idea
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      meshRef.current.rotation.y += 0.005;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Main Abstract Form: A Distorted Torus Knot representing fluid creativity */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <TorusKnot args={[1, 0.35, 128, 32]} ref={meshRef}>
          <MeshDistortMaterial
            color={BRAND_COLORS.blue}
            speed={2}
            distort={0.4} // High distortion for 'hyper creative' feel
            radius={1}
            roughness={0.1}
            metalness={0.8}
            emissive={BRAND_COLORS.navy}
            emissiveIntensity={0.2}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </TorusKnot>
      </Float>

      {/* Outer Ring: representing the 'Global/Web' or 'Circle of completion' */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0}>
        <group rotation={[1.5, 0, 0]}>
          <Torus args={[2.2, 0.02, 16, 100]} ref={ringRef}>
            <meshStandardMaterial
              color={BRAND_COLORS.white}
              emissive={BRAND_COLORS.white}
              emissiveIntensity={0.5}
              transparent
              opacity={0.5}
            />
          </Torus>
        </group>
      </Float>

      {/* The Spark/Idea: Red Accent Particle */}
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <Octahedron args={[0.2]} position={[1.5, 0.8, 0.5]}>
          <meshStandardMaterial
            color={BRAND_COLORS.red}
            emissive={BRAND_COLORS.red}
            emissiveIntensity={4}
            toneMapped={false}
          />
        </Octahedron>
      </Float>

      {/* Structure/Logic: Floating Tech Cube */}
      <Float speed={4} rotationIntensity={2} floatIntensity={1.5}>
        <Box args={[0.15, 0.15, 0.15]} position={[-1.4, -0.6, 0.8]}>
          <meshStandardMaterial
            color={BRAND_COLORS.white}
            emissive={BRAND_COLORS.white}
            emissiveIntensity={1}
          />
        </Box>
      </Float>

      {/* Innovation Particle */}
      <Float speed={6} rotationIntensity={1.5} floatIntensity={1}>
        <Box args={[0.1, 0.1, 0.1]} position={[-0.5, 1.8, -0.5]}>
          <meshStandardMaterial
            color={BRAND_COLORS.red}
            emissive={BRAND_COLORS.red}
            emissiveIntensity={4}
            toneMapped={false}
          />
        </Box>
      </Float>
    </group>
  );
};

const Hero3D: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, window.innerWidth < 768 ? 1.5 : 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.4} color={BRAND_COLORS.navy} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={10} color="#ffffff" castShadow={window.innerWidth > 768} />
        <pointLight position={[-10, -5, -5]} intensity={5} color={BRAND_COLORS.blue} />
        <pointLight position={[5, 5, 5]} intensity={2} color={BRAND_COLORS.red} />

        {/* Background Environment */}
        <Stars radius={100} depth={50} count={window.innerWidth < 768 ? 2000 : 5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" blur={0.6} />

        {/* Main Assembly */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <group rotation={[0, -0.2, 0]} position={[2.5, 0, 0]}>
            <CreativitySymbol />
          </group>
        </Float>

        <ContactShadows resolution={512} scale={40} blur={2.5} opacity={0.3} far={10} color="#000000" frames={1} />
      </Canvas>
    </div>
  );
};

export default Hero3D;
