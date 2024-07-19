import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import rootReducer from "../Redux/rootReducer.js";
import { Provider } from "react-redux";
import { createStore } from "redux";

// Smoke test
test("App renders without crashing", () => {
  const store = createStore(rootReducer);
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

// Snapshot test
test("App matches snapshot", async () => {
  const store = createStore(rootReducer);
  const { asFragment, getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // Wait for the data to be fetched and component to be updated
  await waitFor(() => getByText(/Welcome to the Chat App!/i));

  expect(asFragment()).toMatchSnapshot();
});
