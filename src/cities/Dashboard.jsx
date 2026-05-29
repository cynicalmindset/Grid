import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Dotenv from "dotenv";
export default function Dashboard(props) {
  const [profile, setprofile] = useState(null);
  const [form, setform] = useState({
    linkedin: "",
    twitter: "",
    portfolio: "",
    external: "",
    insta: "",
  });
  const [Github, setGithub] = useState(null);

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("profiles").update(form).eq("id", user.id);
  };

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setprofile(data);
      setform({
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        portfolio: data.portfolio || "",
        external: data.external || "",
        insta: data.insta || "",
      });
      const res = await fetch(`https://api.github.com/users/${data.github}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      });
      const git = await res.json();
      setGithub(git);
    };
    load();
  }, []);

  if (!profile || !Github)
    return (
      <p className="flex items-center  bg-[#1D1D1D] h-screen w-screen  text-[50px] text-center text-white ">
        loading..
      </p>
    );

  const pfp = Github.avatar_url;
  const nae = Github.name || profile.github;
  const bio = Github.bio;
  const repos = Github.public_repos;
  const username = profile.github || Github.login;

  function Nav() {
    return (
      <nav
        className="h-[52px] px-5 flex items-center justify-center gap-10 bg-[#161922] border-b border-[#2e3448]"
        style={{
          paddingLeft: "50px",
          paddingRight: "50px",
          justifyContent: "space-between",
        }}
      >
        <div className="font-mono text-sm font-bold">Dashboard</div>
        <p className="font-bold font-sans text-l text-white">hello {nae}</p>
      </nav>
    );
  }
  function Leftcol() {
    return (
      <div className="flex flex-col gap-3 ">
        <Profilecard />
        <Linkscard />
      </div>
    );
  }
  function Profilecard() {
    return (
      <div
        className="bg-[#161922] border border-[#2e3448] rounded-2xl p-6 flex flex-col items-center gap-3 text-center min-w-[220px] max-w-[320px]"
        style={{
          padding: "24px",
          marginTop: "20px",
        }}
      >
        {/*avatar imagae wala foto samjhe lawde*/}
        <div className="w-20 h-20 rounded-1xl">
          <img src={pfp} className=" realtive h-full w-full rounded-2xl" />
        </div>

        <p className="font-mono font-bold text-xl">{nae}</p>
        <p className="font-mono text-sm text-[#8b92a8]">Github - @{username}</p>

        <span
          className="text-l font-bold font-mono rounded-full border border-[#d4a017]/25 bg-[#d4a017]/10 text-[#d4a017]"
          style={{ padding: "10px" }}
        >
          RANK - #98
        </span>

        <p className=" text-l leading-relaxed text-[#8b92a8]">{bio}</p>
        <p className="text-xl text-white font-mon font-bold">
          Total Projects - {repos}
        </p>
        <p className="text-xl text-white font-mon font-bold">
          Leetcode - 196 Problems
        </p>
      </div>
    );
  }

  function Linkscard() {
    return (
      <div
        className="bg-[#161922] border border-[#2e3448] rounded-2xl flex flex-col items-center gap-3 "
        style={{ padding: "24px" }}
      >
        <input
          placeholder="linkedin"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="twitter"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="Portfolio"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="instagram"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="leetcode"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="external"
          style={{
            padding: "10px",
          }}
          className="border border-[#2e3448] rounded-l min-h-[50px] min-w-[240px] p-4"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
      </div>
    );
  }

  function Centercol() {
    return (
      <div className="flex flex-col gap-3">
        <Actionbar />
      </div>
    );
  }
  function Actionbar() {
    return (
      <div
        className=" bg-[#161922] border border-[#2e3448] rounded-xl flex items-center justify-between"
        style={{
          minWidth: "500px",
          justifyContent: "space-between",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "10px ",
          paddingBottom: "10px",
        }}
      >
        <p className="font-mono font-bold text-white text-xl">Profile</p>
        <div className="flex flex-row gap-3">
          <button
            className="text-white text-l rounded-l bg-[#1e2230] border border-[#2e3448] hover:bg-[#252a3a]
            "
            style={{
              paddingBottom: "4px",
              paddingTop: "4px",
              paddingLeft: "6px",
              paddingRight: "6px",
            }}
            onClick={() => props.onCity()}
          >
            Enter City
          </button>
          <button
            className="text-white text-l rounded-l bg-[#1e2230] border border-[#2e3448] hover:bg-[#252a3a]"
            style={{
              paddingBottom: "4px",
              paddingTop: "4px",
              paddingLeft: "6px",
              paddingRight: "6px",
            }}
            onClick={save}
          >
            Save
          </button>
          <button
            className="text-white text-l rounded-l bg-[#1e2230] border border-[#2e3448] hover:bg-[#252a3a]"
            style={{
              paddingBottom: "4px",
              paddingTop: "4px",
              paddingLeft: "6px",
              paddingRight: "6px",
            }}
          >
            logout
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0d0f14] font-sans text-[#e8eaf0]">
      <Nav />
      <main className="flex-row flex gap-8" style={{ padding: "20px" }}>
        <Leftcol />
        <Centercol />
        <Leftcol />
      </main>
    </div>
  );
}
