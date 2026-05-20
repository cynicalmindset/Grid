import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

function NPC() {
  const group = useRef();
  const { scene, animations } = useGLTF("/girl.glb");
  const body = useRef();
  const { actions } = useAnimations(animations, group);
  const sitting = useRef(false);
  const dir = useRef({ x: 1, z: 1 });
  const cd = () => {
    dir.current = {
      x: -dir.current.x + (Math.random() - 0.5),
      z: -dir.current.z + (Math.random() - 0.5),
    };
  };
  const sit = () => {
    if (sitting.current) return;
    sitting.current = true;
    actions["Walking"]?.stop();
    actions["Sitting"]?.play();
    setTimeout(() => {
      sitting.current = false;
      actions["Sitting"]?.stop();
      actions["Walking"]?.play();
    }, 3000);
  };
  useEffect(() => {
    if (!actions) return;
    actions["Walking"]?.play();
  }, [actions]);
  if (!scene) return null;
  useFrame(() => {
    if (!body.current || !group.current) return;
    if (sitting.current) {
      body.current.setLinvel({ x: 0, y: -1, z: 0 }, true);
      return;
    }
    const pos = body.current.translation();
    if (pos.x > 20 || pos.x < -20 || pos.z > 20 || pos.z < -20) {
      dir.current = {
        x: -dir.current.x,
        z: -dir.current.z,
      };
    }
    // group.current.position.x += dir.current.x * 0.01;
    // group.current.position.z += dir.current.z * 0.01;
    const vel = { x: dir.current.x * 2, y: -1, z: dir.current.z * 2 };
    body.current.setLinvel(vel, true);
    group.current.rotation.y = Math.atan2(dir.current.x, dir.current.z);
  });
  return (
    <RigidBody
      colliders="ball"
      ref={body}
      position={[-5, 0, -8]}
      lockRotations
      onCollisionEnter={cd}
      onClick={sit}
    >
      <primitive ref={group} object={scene} scale={0.8} />
    </RigidBody>
  );
}

export default NPC;
