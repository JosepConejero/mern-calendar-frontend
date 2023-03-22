import React from "react";
import ReactDOM from "react-dom/client";
import { CalendarApp } from "./CalendarApp";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode> //deshabilito el modo estricto pq me da warnings en la consola a causa d react-big-calendar q son responsabilidad de quien lo ha programado
  <CalendarApp />
  // </React.StrictMode>
);
