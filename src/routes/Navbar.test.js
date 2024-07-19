import React from "react";
import { render, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import ChatApi from "../api";

let store;
const setupStore = (initialState) => {
  store = createStore(rootReducer, initialState);
};

beforeEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

afterEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

// Smoke test
test("Navbar renders without crashing", () => {
  setupStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );
});

// Snapshot test
test("Navbar matches snapshot, when use is logged out", async () => {
  setupStore();
  const { asFragment, getByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );
  // Wait for the data to be fetched and component to be updated
  await waitFor(() => getByText(/Home/i));
  await waitFor(() => getByText(/Login/i));
  await waitFor(() => getByText(/Signup/i));

  expect(asFragment()).toMatchSnapshot();
});

// Snapshot test
test("Navbar matches snapshot when logged in", async () => {
  setupStore({
    loggedIn: true,
    currentUser: "testuser",
  });
  const { asFragment, getByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );

  // Wait for the data to be fetched and component to be updated
  await waitFor(() => getByText(/Home/i));
  await waitFor(() => getByText(/Logout/i));
  await waitFor(() => getByText(/My Profile/i));
  expect(asFragment()).toMatchSnapshot();
});
