import { useState, useRef, useEffect, useMemo } from "react";
import NPC from "./NPC.jsx";
import adimage from "../assets/adv.png";
import { RigidBody } from "@react-three/rapier";
import { blockpos, floors, gridS, lcoalpos } from "./Math.js";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  Stats,
  Sky,
  Stars,
  PointerLockControls,
  useTexture,
} from "@react-three/drei";
import Block from "./block.jsx";
import Player from "./player.jsx";
import Pointer from "./Pointer.jsx";
import { supabase } from "../supabase.js";

function City(props) {
  const texture = useMemo(() => {
    return new THREE.TextureLoader().load(adimage);
  }, []);
  const [hovered, sethovered] = useState(null);
  const [playerpos, setplayerpos] = useState({ x: 0, z: 0 });
  const [spawn, setspawn] = useState([0, 3, 0]);
  const [info, setinfo] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [allpos, setAllpos] = useState([]);
  const [gridSize, setGridSize] = useState(1);
  const spacing = 16;

  const objs = useRef();
  const [gitdata, setgitdata] = useState(null);
  const openlink = (url) => {
    if (!url || url.trim() === "") {
      alert("no link found");
      return;
    }
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.target = "_blank";
    link.rel = "noreferrer noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  useEffect(() => {
    if (!hovered) return;
    setinfo(null);
    supabase
      .from("profiles")
      .select("*")
      .eq("github", hovered)
      .single()
      .then(({ data }) => setinfo(data));
  }, [hovered]);

  const linkedin = info?.linkedin;
  const twitter = info?.twitter;
  const insta = info?.insta;
  const portfolio = info?.portfolio;
  const external = info?.external;

  useEffect(() => {
    if (!hovered) return;
    setgitdata(null);
    fetch(`https://api.github.com/users/${hovered}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((data) => setgitdata(data));
  }, [hovered]);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.log(error);
        return;
      }

      const profiles = await Promise.all(
        data.map(async (user) => {
          const res = await fetch(
            `https://api.github.com/users/${user.github}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
              },
            },
          );
          const git = await res.json();
          return { github: user.github, repos: git.public_repos || 0 };
        }),
      );

      const newBlocks = [];
      let temp = [];
      for (let i = 0; i < profiles.length; i++) {
        temp.push(profiles[i]);
        if (temp.length === 9) {
          newBlocks.push(temp);
          temp = [];
        }
      }
      if (temp.length > 0) newBlocks.push(temp);

      const gs = gridS(newBlocks.length);

      const pos = [];
      for (let b = 0; b < newBlocks.length; b++) {
        const blockp = blockpos(b, gs, spacing);
        for (let i = 0; i < newBlocks[b].length; i++) {
          const lp = lcoalpos(i, 4, 3);
          const f = floors(newBlocks[b][i].repos);
          const h = f * 0.8;
          pos.push([
            blockp[0] + lp[0],
            0,
            blockp[2] + lp[1],
            h,
            newBlocks[b][i].github,
          ]);
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const username = data.find((p) => p.id === user.id);
      const mypos = pos.find((p) => p[4] === username?.github);
      if (mypos) {
        await supabase
          .from("profiles")
          .update({ x: mypos[0], z: mypos[2] })
          .eq("id", user.id);
        setTimeout(() => {
          setspawn([mypos[0], 3, mypos[2] + 6]);
        }, 1000);
      }

      setBlocks(newBlocks);
      setGridSize(gs);
      setAllpos(pos);
    };

    fetchUsers();
  }, []);

  return (
    <>
      <button
        onClick={() => props.onDashboard()}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1000,
          padding: "8px 16px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Dashboard
      </button>
      <div
        id="joystick"
        style={{
          position: "fixed",
          left: "40px",
          bottom: "40px",
          width: "140px",
          height: "140px",
          zIndex: 1000,
        }}
      ></div>
      <div
        id="look-joystick"
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          width: "140px",
          height: "140px",
          zIndex: 1000,
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "4px",
          height: "4px",
          background: "white",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      />

      {hovered && (
        <div
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "220px",
            padding: "14px",
            background: "rgba(0,0,0,0.9)",
            borderRadius: "12px",
            color: "white",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            fontFamily: "monospace",
            pointerEvents: "all",
          }}
        >
          {gitdata ? (
            <>
              <p
                style={{ margin: "10px", marginBottom: "10px" }}
                className="flex items-center  text-white font-semibold"
              >
                Citizen details
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={gitdata.avatar_url}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                  }}
                />
                <h3
                  style={{
                    margin: 0,
                    color: "#ff0000",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {hovered}
                </h3>
              </div>
              <p style={{ margin: "0 0 8px", opacity: 0.7, fontSize: "12px" }}>
                {gitdata.bio || "Github Developer"}
              </p>
              <p style={{ margin: "4px 0", fontSize: "13px" }}>
                Repos: {gitdata.public_repos} repos
              </p>
              <p style={{ margin: "4px 0", fontSize: "13px" }}>
                follow: {gitdata.followers} followers
              </p>
              <button
                style={{ marginTop: "10px" }}
                onClick={() => openlink(linkedin)}
                className=" opacity-50 hover:opacity-100 transistion-opacity bg-white rounded text-black w-full font-semibold "
              >
                Linkedin
              </button>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => openlink(portfolio)}
                className=" opacity-50 hover:opacity-100 transistion-opacity bg-white rounded text-black w-full font-semibold "
              >
                Portfolio
              </button>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => openlink(twitter)}
                className=" opacity-50 hover:opacity-100 transistion-opacity  bg-white rounded text-black w-full font-semibold "
              >
                Twitter
              </button>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => openlink(insta)}
                className=" opacity-50 hover:opacity-100 transistion-opacity  bg-white rounded text-black w-full font-semibold "
              >
                Instagram
              </button>

              <button
                style={{ marginTop: "10px" }}
                onClick={() => openlink(external)}
                className=" opacity-50 hover:opacity-100 transistion-opacity  bg-white rounded text-black w-full font-semibold "
              >
                External
              </button>
            </>
          ) : (
            <p style={{ opacity: 0.7, fontSize: "13px" }}>Loading...</p>
          )}
        </div>
      )}
      <Canvas
        style={{ height: "100vh" }}
        camera={{ position: [0, 1.5, 5], fov: 75 }}
        onDoubleClick={() => {
          if (hovered) {
            window.open(`https://github.com/${hovered}`, "_blank");
          }
        }}
      >
        <Physics gravity={[0, -9.8, 0]}>
          <NPC />
          <ambientLight intensity={1} />
          <Sky
            distance={450000}
            sunPosition={[1, 0.05, 0]}
            inclination={5}
            azimuth={0.5}
          />
          <Stars radius={100} depth={50} count={1000} factor={4} fade />
          <directionalLight intensity={0.2} position={[50, 40, -100]} />
          <RigidBody type="fixed" colliders="cuboid">
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[400, 400]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          </RigidBody>
          <group ref={objs}>
            {blocks.map((blockUsers, i) => {
              const pos = blockpos(i, gridSize, spacing);
              const dx = pos[0] - playerpos.x;
              const dz = pos[2] - playerpos.z;
              if (dx * dx + dz * dz > 800) return null;
              return (
                <group key={i}>
                  <Block users={blockUsers} position={pos} />
                </group>
              );
            })}
          </group>

          <Pointer objs={objs} sethovered={sethovered} />

          {/* Horizontal roads */}
          {(() => {
            const roads = [];
            const offset = (gridSize * spacing) / 2;
            for (let i = 0; i < gridSize; i++) {
              const z = i * spacing - offset - spacing / 2;
              roads.push(
                <mesh
                  key={"h" + i}
                  position={[0, 0.02, z]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[gridSize * spacing, 4]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>,
              );
              roads.push(
                <mesh
                  key={"hline" + i}
                  position={[0, 0.03, z]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[gridSize * spacing, 0.15]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.1}
                  />
                </mesh>,
              );
            }
            return roads;
          })()}

          {/* Vertical roads */}
          {(() => {
            const roads = [];
            const offset = (gridSize * spacing) / 2;
            for (let i = 0; i < gridSize; i++) {
              const x = i * spacing - offset - spacing / 2;
              roads.push(
                <mesh
                  key={"v" + i}
                  position={[x, 0.02, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[4, gridSize * spacing]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>,
              );
              roads.push(
                <mesh
                  key={"vline" + i}
                  position={[x, 0.03, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[0.15, gridSize * spacing]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="rgb(250,250,250)"
                    emissiveIntensity={0.1}
                  />
                </mesh>,
              );
            }
            return roads;
          })()}

          {/* Street lights */}
          {(() => {
            const lights = [];
            const offset = (gridSize * spacing) / 2;
            for (let i = 0; i < gridSize; i++) {
              for (let j = 0; j < gridSize; j++) {
                const x = i * spacing - offset - spacing / 2;
                const z = j * spacing - offset - spacing / 2;
                lights.push(
                  <group key={`light-${i}-${j}`} position={[x, 0, z]}>
                    <mesh position={[0, 1.5, 0]}>
                      <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
                      <meshStandardMaterial color="#555" />
                    </mesh>
                    <mesh position={[0, 3, 0]}>
                      <boxGeometry args={[1, 1.2, 0.1]} />
                      <meshStandardMaterial
                        map={texture}
                        side={THREE.DoubleSide}
                      />
                    </mesh>
                    {(() => {
                      const dx = x - playerpos.x;
                      const dz = z - playerpos.z;
                      return dx * dx + dz * dz < 100 ? (
                        <pointLight
                          position={[0, 3, 0]}
                          intensity={20}
                          distance={8}
                          color="white"
                        />
                      ) : null;
                    })()}
                  </group>,
                );
              }
            }
            return lights;
          })()}

          <Player playerpos={setplayerpos} spawn={spawn} />
        </Physics>
      </Canvas>
    </>
  );
}

export default City;
