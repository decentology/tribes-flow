import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AllTribes from "./all-tribes";
import MyTribe from "./my-tribe";
import Setup from "./setup"
import EthereumProvider from "./context";

ReactDOM.render(
  <React.StrictMode>
    <EthereumProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/setup" element= {<Setup/>} />
          <Route path="/all-tribes" element={<AllTribes />} />
          <Route path="/my-tribe" element={<MyTribe />} />
        </Routes>
      </BrowserRouter>
    </EthereumProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
