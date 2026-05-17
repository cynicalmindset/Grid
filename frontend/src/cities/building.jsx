import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

function maketexture(floor) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 64, 128);
  const cols = 3;
  const rows = Math.max(2, floor);
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = c * 20 + 6;
      const y = r * (128 / rows) + 40;
      ctx.fillStyle = "gray";
      ctx.fillRect(x, y, 10, 10);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

function Building({ lambai, address, github }) {
  const texture = useMemo(() => {
    const t = maketexture(Math.floor(lambai));
    t.repeat.set(1, lambai);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return t;
  }, [lambai]);
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={address}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[4, 0.5, 4]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
      <group position={address}>
        <mesh position={[0, 0.25, 0]} name="base">
          <boxGeometry args={[4.08, 0.58, 4.08]} />
          <meshStandardMaterial color="black" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, lambai / 2 + 0.5, 0]} name={github}>
          <boxGeometry args={[3, lambai, 3]} />
          <meshStandardMaterial color="white" map={texture} />
        </mesh>
        <mesh position={[0, lambai / 2 + 0.5, 0]}>
          <boxGeometry args={[3.08, lambai + 0.08, 3.08]} />
          <meshStandardMaterial color="black" side={THREE.BackSide} />
        </mesh>
      </group>
    </RigidBody>
  );
}
export default Building;
