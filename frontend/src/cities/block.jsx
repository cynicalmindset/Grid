import React from "react";
import Building from "./building.jsx";
import { floors, lcoalpos } from "./Math.js";

function Block({ users, position }) {
  const spacing = 4;
  const building = [];
  const posi = [];

  for (let i = 0; i < users.length; i++) {
    const f = floors(users[i].repos);
    const h = f * 0.8;
    const pos = lcoalpos(i, spacing, 3);
    const x = pos[0];
    const z = pos[1];
    const git = users[i].github;
    posi.push([x, 0, z]);
    // console.log(posi)
    let type;
    if (f < 5) {
      type = "b2";
    } else if (f < 15) {
      type = "b1";
    } else if (f < 30) {
      type = "b3";
    } else {
      type = "b4";
    }

    // const centerx = 0;
    // const centerz = 0;
    building.push(
      <Building
        key={i}
        lambai={h}
        address={[x, 0, z]}
        type={type}
        github={git}
      ></Building>,
    );
    //      building.push(
    // <group key="light">

    //   <mesh position={[-4, 1.5, -4]}>
    //     <cylinderGeometry args={[0.08, 0.08, 3]} />
    //     <meshStandardMaterial color="#555" />
    //   </mesh>

    //   <mesh position={[-4, 3, -4]}>
    //     <sphereGeometry args={[0.15]} />
    //     <meshStandardMaterial emissive="#ffd966" emissiveIntensity={2} />
    //   </mesh>

    //   <pointLight
    //     position={[-4, 3, -4]}
    //     intensity={0.6}
    //     distance={6}
    //     color="#ffd966"
    //   />

    // </group>)
  }
  return <group position={position}>{building}</group>;
}

export default Block;
