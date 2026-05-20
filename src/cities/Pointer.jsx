import { useFrame, useThree } from "@react-three/fiber";
import { Raycaster } from "three";
import { useRef } from "react";

function Pointer({ objs, sethovered }) {
  const { camera } = useThree();
  const lastcheck = useRef(0);
  const raycaster = useRef(new Raycaster());
  const lastHit = useRef(null);

  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    if (now - lastcheck.current < 0.1) return; // check every 100ms
    lastcheck.current = now;
    if (!objs.current) return;

    raycaster.current.setFromCamera({ x: 0, y: 0 }, camera);

    const intersects = raycaster.current.intersectObjects(
      objs.current.children,
      true,
    );

    if (intersects.length > 0) {
      const current = intersects[0].object;
      const base = current.parent.getObjectByName("base");
      if (base) {
        base.material.color.set("#00ff00");
        base.material.emissive.set("#00ff00");
        base.material.emissiveIntensity = 0.5; // highlight base
        setTimeout(() => {
          base.material.color.set("#000000"); // reset after 200ms
          base.material.emissive.set("#000000");
          base.material.emissiveIntensity = 0;
        }, 20000);
      }

      // only log when object changes
      if (lastHit.current !== current) {
        sethovered(current.name);
        lastHit.current = current;
      }
    } else {
      sethovered(null);
      lastHit.current = null;
    }
  });

  return null;
}

export default Pointer;
