import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/Layout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
    <Toaster
      toastOptions={{
        style: {
          background: "var(--color-white)",
          color: "var(--color-heading)",
          border: "solid 1px var(--color-gray)",
        },
      }}
    />
  </StrictMode>
);
