import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="main_wrapper">
        <ToastContainer position="top-right" autoClose={3000} />
        <App />
      </div>
    </Provider>
  </StrictMode>
);
