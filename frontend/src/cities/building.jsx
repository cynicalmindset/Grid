import React from "react";
import { CanvasTexture } from "three";
import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Text } from "@react-three/drei";
function makeFacadeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 64, 128);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 3; col++) {
      const lit = Math.random() > 0.3;
      ctx.fillStyle = lit ? "#ffffaa" : "#222233";
      ctx.fillRect(col * 20 + 4, row * 15 + 4, 12, 8);
    }
  }
  return canvas;
}

function makeEmissiveTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 64, 128);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 3; col++) {
      const lit = Math.random() > 0.3;
      if (lit) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(col * 20 + 4, row * 15 + 4, 12, 8);
      }
    }
  }
  return canvas;
}

const facadeTexture = new CanvasTexture(makeFacadeTexture());
const emissiveTexture = new CanvasTexture(makeEmissiveTexture());

function Building({ lambai, address, type, github }) {
  const meshRef = useRef();
  const timer = useRef(0);
  useFrame((state, delta) => {
    timer.current += delta;
    const mesh = meshRef.current;
    const canvas = mesh?.material?.emissiveMap?.image;
    if (!canvas) return;
    if (timer.current > 2) {
      timer.current = 0;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 64, 128);
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 3; col++) {
          if (Math.random() > 0.3) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(col * 20 + 4, row * 15 + 4, 12, 8);
          }
        }
      }
      mesh.material.emissiveMap.needsUpdate = true;
    }
  });

  const texture = useMemo(() => {
    const t = facadeTexture.clone();
    t.needsUpdate = true;
    t.repeat.set(1, Math.max(1, Math.floor(lambai / 3)));
    t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [lambai]);

  const emissive = useMemo(() => {
    const t = emissiveTexture.clone();
    t.needsUpdate = true;
    t.repeat.set(1, Math.max(1, Math.floor(lambai / 3)));
    t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [lambai]);

  let c2;
  if (type === "b3") {
    c2 = "#ff4a1c";
  } else if (type === "b4") {
    c2 = "#c402f5";
  } else if (type === "b1") {
    c2 = "#00ff88";
  } else {
    c2 = "#fdff6f";
  }

  return (
    <group position={address}>
      <mesh name="base" position={[0, 0.25, 0]}>
        <boxGeometry args={[3.5, 0.5, 3.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* <mesh position={[0,0.40,1.8]}>
        <boxGeometry args={[2.6,0.45,0.08]}></boxGeometry>
        <meshStandardMaterial color="#050505" emissive={c2} emissiveIntensity={0.4}></meshStandardMaterial>
      </mesh> */}

      <mesh name={github} ref={meshRef} position={[0, lambai / 2 + 0.5, 0]}>
        <boxGeometry args={[3, lambai, 3]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={emissive}
          emissive={c2}
          emissiveIntensity={0.5}
          color="white"
        />
      </mesh>

      <mesh position={[0, lambai + 0.75, 0]}>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

export default Building;
