import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
// import { max } from "three/tsl";
import walksound from "../assets/Sounds/foots.wav";
import breath from "../assets/Sounds/running-breath.wav";

export default function Player({ playerpos }) {
  const speed = useRef(0);
  const head = useRef(0);
  const bobTime = useRef(0);
  const sway = useRef(0);
  const move = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const walkRef = useRef(null);
  const breathRef = useRef(null);

  useEffect(() => {
    walkRef.current = new Audio(walksound);
    walkRef.current.loop = true;
    walkRef.current.volume = 0.6;
    breathRef.current = new Audio(breath);
    breathRef.current.loop = true;
    // breathRef.current.volume += 1;
  }, []);

  useEffect(() => {
    const unlock = () => {
      walkRef.current?.play().then(() => {
        walkRef.current.pause();
        walkRef.current.currentTime = 0;
      });
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  useEffect(() => {
    const unlock2 = () => {
      breathRef.current?.play().then(() => {
        breathRef.current.pause();
        breathRef.current.currentTime = 0;
      });
      window.removeEventListener("click", unlock2);
    };

    window.addEventListener("click", unlock2);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "KeyW") move.current.forward = true;
      if (e.code === "KeyS") move.current.backward = true;
      if (e.code === "KeyA") move.current.left = true;
      if (e.code === "KeyD") move.current.right = true;
    };

    const handleKeyUp = (e) => {
      if (e.code === "KeyW") move.current.forward = false;
      if (e.code === "KeyS") move.current.backward = false;
      if (e.code === "KeyA") move.current.left = false;
      if (e.code === "KeyD") move.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const isMoving =
      move.current.forward ||
      move.current.backward ||
      move.current.left ||
      move.current.right;
    const camera = state.camera;
    const maxsped = 0.2;
    const acc = 0.003;
    const fri = 0.88;
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const walk = walkRef.current;
    const breath = breathRef.current;

    if (walk) {
      if (isMoving) {
        if (walk.paused && breath.paused) walk.play();
        breath.play();
        walk.playbackRate = 0.9 + speed.current * 4;
      } else {
        if (!walk.paused && !breath.paused) {
          walk.pause();
          breath.pause();
          walk.currentTime = 0;
          breath.currentTime = 0;
        }
      }
    }

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    if (move.current.forward) direction.add(forward);
    if (move.current.backward) direction.sub(forward);
    if (move.current.left) direction.sub(right);
    if (move.current.right) direction.add(right);

    if (isMoving) {
      speed.current = Math.min(speed.current + acc * delta * 60, maxsped);
    } else {
      speed.current *= Math.pow(fri, delta * 60);
      // camera.rotation.x = -1
    }

    if (direction.length() > 0) direction.normalize();
    camera.position.add(direction.multiplyScalar(speed.current));

    if (isMoving && speed.current > 0.1) {
      bobTime.current += delta * 14; // bob frequency
      const bobY = Math.sin(bobTime.current) * 0.04; // bob height
      const bobX = Math.cos(bobTime.current / 2) * 0.01; // slight side sway
      camera.position.y = 1 + bobY;
      sway.current = bobX * 0.001;
      camera.position.x += sway.current;
      // camera.rotation.x -= 0.0002
    } else {
      camera.position.y += (1 - camera.position.y) * 0.1;
      bobTime.current = 0;
      sway.current = 0;
    }

    playerpos({
      x: camera.position.x,
      z: camera.position.z,
    });
  });

  return null;
}
