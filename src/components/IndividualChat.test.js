import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import IndividualChat from "./IndividualChat";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ChatApi from "../api";
import { act } from "react";

let store;

const setupStore = () => {
  store = createStore(rootReducer);
};

beforeEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
  setupStore();
});

afterEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

// Smoke test
test("Individual chat renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <IndividualChat />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("Individual chat matches snapshot", async () => {
  let asFragment;
  await act(async () => {
    ({ asFragment } = render(
      <Provider store={store}>
        <Router>
          <IndividualChat />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(asFragment()).toMatchSnapshot();
  });
});
