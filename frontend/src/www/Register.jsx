//import React from 'react';
import { useNavigate } from "react-router-dom";
import Alert from "../components/alert.jsx";
import { supabase } from "../supabase.js";
import "../css/register.css";
import Login from "../www/Login.jsx";
import { use, useState } from "react";
function Register({ onClose }) {
  const [showlogin, setshowlogin] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [github, setgit] = useState("");
  const navigate = useNavigate();

  const handelregister = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        github: github,
      });

      if (profileError) {
        alert(profileError.message);
        return;
      }
      alert("Welcome to Grid");
      navigate("/city");
    } catch (err) {
      console.log(err.message);
    }
  };

  if (showlogin) {
    return <Login onClose={() => setshowlogin(false)} />;
  }
  return (
    <div className="modal">
      <button onClick={onClose} className="close">
        X
      </button>
      <div className="reg">Register</div>
      <div className="conti">
        <input
          type="text"
          placeholder="charmander@gmail.com"
          className="input"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="input"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Github username"
          className="input"
          value={github}
          onChange={(e) => setgit(e.target.value)}
        />
      </div>
      <div className="info3">
        this porject is completely opensource , so if you ever feel contributing
        then just reach the github
      </div>
      <div className="log">
        <button className="btn" onClick={handelregister}>
          Book Your Plot
        </button>
        <button onClick={() => setshowlogin(true)} className="login">
          Already have an Building? login
        </button>
        {/* <button className="login">
          Preregister Now for getting special building
        </button> */}
      </div>
    </div>
  );
}

export default Register;
