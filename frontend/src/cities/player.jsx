import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import nipplejs from "nipplejs";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Player({ playerpos }) {
  const bodyRef = useRef();
  const yaw = useRef(0);
  const pitch = useRef(0);
  useEffect(() => {
    const mouse = (e) => {
      const sensi = 0.01;
      yaw.current -= e.movementX * sensi;
      pitch.current -= e.movementY * sensi;

      pitch.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, pitch.current),
      );
    };
    document.addEventListener("mousemove", mouse);
    return () => {
      document.removeEventListener("mousemove", mouse);
    };
  }, []);

  const move = useRef({
    front: false,
    back: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const down = (e) => {
      if (e.code === "KeyW") move.current.front = true;
      if (e.code === "KeyS") move.current.back = true;
      if (e.code === "KeyA") move.current.left = true;
      if (e.code === "KeyD") move.current.right = true;
    };

    const up = (e) => {
      if (e.code === "KeyW") move.current.front = false;
      if (e.code === "KeyS") move.current.back = false;
      if (e.code === "KeyA") move.current.left = false;
      if (e.code === "KeyD") move.current.right = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((state) => {
    const body = bodyRef.current;
    if (!body) return;
    const direction = new THREE.Vector3();
    const camera = state.camera;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    if (move.current.front) direction.add(forward);
    if (move.current.back) direction.sub(forward);
    if (move.current.left) direction.sub(right);
    if (move.current.right) direction.add(right);

    if (direction.lengthSq() > 0) {
      direction.normalize();
    }

    const speed = 8;

    const vel = body.linvel();

    body.setLinvel(
      {
        x: direction.x * speed,
        y: vel.y,
        z: direction.z * speed,
      },
      true,
    );
    const pos = body.translation();
    camera.rotation.order = "YXZ";
    camera.position.x = pos.x;
    camera.position.z = pos.z;
    camera.position.y = pos.y;
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    playerpos({
      x: pos.x,
      z: pos.z,
    });
  });

  useEffect(() => {
    const zone = document.getElementById("joystick");
    if (!zone) return;
    const nipple = nipplejs.create({
      zone,
      mode: "static",
      position: {
        left: "70px",
        top: "70px",
      },
      color: "white",
      size: 120,
    });
    nipple.on("move", (_, data) => {
      if (!data) return;
      const x = data.vector.x;
      const y = data.vector.y;
      move.current.front = y > 0.3;
      move.current.back = y < -0.3;
      move.current.right = x > 0.3;
      move.current.left = x < -0.3;
    });
    nipple.on("end", () => {
      move.current.front = false;
      move.current.back = false;
      move.current.right = false;
      move.current.left = false;
    });
    return () => {
      nipple.destroy();
    };
  }, []);

  return (
    <RigidBody
      ref={bodyRef}
      mass={1}
      position={[0, 3, 0]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.5, 0.5]} />

      <mesh>
        <capsuleGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
