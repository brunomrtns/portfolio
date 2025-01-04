import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./redux";
import "./i18n";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
