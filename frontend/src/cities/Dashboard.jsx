import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Dotenv from "dotenv";
import "./Dashboard.css";
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
        loading...
      </p>
    );

  const pfp = Github.avatar_url;
  const nae = Github.name || profile.github;
  const bio = Github.bio;
  const repos = Github.public_repos;
  const username = profile.github || Github.login;

  return (
    <div className="dashmain">
      <div className="dash-nav">
        <h1 className="text-white text-[24px] font-semibold">Grid.</h1>
        <div className="dash-btngrp">
          <button className="dash-btn" onClick={() => props.onCity()}>
            Enter City
          </button>
          <button onClick={save} className="dash-btn">
            Save
          </button>
        </div>
      </div>
      <div className="dash-first">
        <div className="h-64 w-64">
          {" "}
          <img src={pfp} className="h-full w-full object-cover rounded-2xl" />
        </div>
        <div>
          <h2 className="text-white text-[30px] font-semibold">name : {nae}</h2>
          <h3 className="text-white text-[25px] font-semibold">
            Total Repos : {repos}
          </h3>
          <h3 className="text-white text-[25px] font-semibold">
            username : {username}
          </h3>
          <h2 className="text-white text-[20px]">Bio : {bio}</h2>
        </div>
      </div>
      <div className="dash-second">
        <input
          placeholder="linkedin"
          className="dash-input"
          value={form.linkedin}
          onChange={(e) => setform({ ...form, linkedin: e.target.value })}
        />
        <input
          placeholder="twitter"
          className="dash-input"
          value={form.twitter}
          onChange={(e) => setform({ ...form, twitter: e.target.value })}
        />
        <input
          placeholder="instagram"
          className="dash-input"
          value={form.insta}
          onChange={(e) => setform({ ...form, insta: e.target.value })}
        />
        <input
          placeholder="portfolio"
          className="dash-input"
          value={form.portfolio}
          onChange={(e) => setform({ ...form, portfolio: e.target.value })}
        />
        <input
          placeholder="external"
          className="dash-input"
          value={form.external}
          onChange={(e) => setform({ ...form, external: e.target.value })}
        />
        <h1 className="text-white text-[20px] mt-[80px] ">
          this project is completely opensource and if you think its not upto
          the mark , feel free to contribute
        </h1>
      </div>
    </div>
  );
}
