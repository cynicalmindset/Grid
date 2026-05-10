//import React from 'react';
import { useState } from "react";
import "../css/register.css";
import { supabase } from "../supabase.js";
import { useNavigate } from "react-router-dom";
// import Register from './Register';
// import { useState } from 'react';

function Login({ onClose }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handellogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      console.log("Login Success");
      navigate("/city");
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  // const [showreg , setshowreg] = useState(false);
  // if(showreg){
  //     <Register onClose={() => setshowreg(false)} />
  return (
    <div className="modal">
      <button onClick={onClose} className="close">
        X
      </button>
      <div className="reg">Login</div>
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
        {/* <input type="text" placeholder='Github username' className='input' /> */}
      </div>
      <div className="info3">
        this porject is completely opensource , so if you ever feel contributing
        then just reach the github
      </div>
      <div className="log">
        <button className="btn" onClick={handellogin}>
          Enter Your Town
        </button>
      </div>
    </div>
  );
}

export default Login;
