import { useEffect, useState } from "react";
import "../css/landing.css";
import img from "../assets/building.png";
import Register from "./Register.jsx";
import { supabase } from "../supabase.js";

function Landing() {
  const [email, setEmail] = useState("");
  const [countt, setcount] = useState(0);

  useEffect(() => {
    const fetchcount = async () => {
      const { count, error } = await supabase.from("profiles").select("*", {
        count: "exact",
        head: true,
      });
      if (!error) {
        setcount(count);
      }
    };
    fetchcount();
  }, []);

  const handleClick = () => {
    if (!email.trim()) {
      setShowRegister(true);
    } else {
      console.log("Sending email:", email);
      alert(
        "sorry this service is unavab at the moment , wait for next update ot connect",
      );
    }
  };

  const url = "https://github.com/cynicalmindset/Grid";

  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="container-main">
      <div className="navbar">
        <div className="logo">Grid.</div>

        <div className="btns">
          <button className="login-btn" onClick={() => setShowRegister(true)}>
            Register
          </button>

          <button
            className="git-btn"
            onClick={() => window.open(url, "_blank")}
          >
            Github
          </button>
        </div>
      </div>
      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      <div className="info">
        <div className="open">{countt}+ citizen</div>

        <div className="title">
          Code build <br /> Cities.
        </div>

        <div className="gyan">
          every commit you push becomes a part of a growing city that reflects
          <br />
          your skills, consistency, and creativity.
        </div>

        <div className="email-box">
          <input
            type="email"
            placeholder="gitcitysupport@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleClick}>
            {email.trim() ? "Send" : "Join now"}
          </button>
        </div>

        <div className="image">
          <img src={img} alt="building" className="imgg" />
        </div>
      </div>
    </div>
  );
}

export default Landing;
