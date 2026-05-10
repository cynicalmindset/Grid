import { Routes, Route } from "react-router-dom";
import City from "./cities/city.jsx";
// import Login from "./Pages/Login";
import Landing from "./www/Landing.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/city" element={<City />} />
    </Routes>
  );
}

export default App;
