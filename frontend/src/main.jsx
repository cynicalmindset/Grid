import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Landing from "./www/Landing.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
);
