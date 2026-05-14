import { Routes, Route } from "react-router-dom";
import City from "./cities/city.jsx";
// import Login from "./Pages/Login";
import Landing from "./www/Landing.jsx";
import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

function App() {
  const [loading, setloding] = useState(true);
  const [user, setuser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setuser(data.session?.user ?? null);
      setloding(false);
    });
  }, []);
  if (loading) return null;
  if (user) return <City />;
  return <Landing />;
}
export default App;
