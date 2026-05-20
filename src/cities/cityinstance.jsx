import { useRef, useEffect } from "react";
import * as THREE from "three";

// import { all } from 'three/tsl'

export default function Cityinstance({ allpos }) {
  const bodyRef = useRef();
  const baseRef = useRef();

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (!baseRef.current || !bodyRef.current) return; // add this
    if (!baseRef.current.setMatrixAt) return;

    for (let i = 0; i < allpos.length; i++) {
      const h = allpos[i][3];

      // base
      dummy.position.set(allpos[i][0], 0.25, allpos[i][2]);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      baseRef.current.setMatrixAt(i, dummy.matrix);

      // body
      dummy.position.set(allpos[i][0], h / 2 + 0.5, allpos[i][2]);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);
    }

    baseRef.current.instanceMatrix.needsUpdate = true;
    bodyRef.current.instanceMatrix.needsUpdate = true;
    bodyRef.current.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(allpos.length * 3),
      3,
    );

    // console.log("type sample:", allpos[0][4], allpos[1][4], allpos[2][4])
  }, [allpos]);

  return (
    <group>
      <instancedMesh
        frustumCulled={false}
        ref={baseRef}
        args={[null, null, allpos.length]}
      >
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#000000" />
      </instancedMesh>

      <instancedMesh
        frustumCulled={false}
        ref={bodyRef}
        args={[null, null, allpos.length]}
      >
        <boxGeometry args={[2.5, 1, 2.5]} />
        <meshBasicMaterial vertexColors />
      </instancedMesh>
    </group>
  );
}
