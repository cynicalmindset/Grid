import City from "./cities/city.jsx";
import Landing from "./www/Landing.jsx";
import Dashboard from "./cities/Dashboard.jsx";
import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

function App() {
  const [loading, setloding] = useState(true);
  const [user, setuser] = useState(null);
  const [page, setPage] = useState("city");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setuser(data.session?.user ?? null);
      setloding(false);
    });
  }, []);

  if (loading) return null;
  if (!user) return <Landing />;
  if (page === "dashboard") return <Dashboard onCity={() => setPage("city")} />;
  return <City onDashboard={() => setPage("dashboard")} />;
}

export default App;
