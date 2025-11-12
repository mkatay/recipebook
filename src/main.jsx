import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { MyUserProvider } from "./context/MyUserContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MyUserProvider>
      <App />
    </MyUserProvider>
  </BrowserRouter>
);
