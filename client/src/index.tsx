import React from "react";
import ReactDOM from "react-dom";
import App  from "./components/App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./components/reducers";
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
