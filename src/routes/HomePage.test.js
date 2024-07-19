import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import Homepage from "./Homepage";
import "@testing-library/jest-dom";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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
test("HomePage renders without crashing", () => {
  setupStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    </Provider>
  );
});

// Snapshot test
test("Homepage matches snapshot, when user is logged out", async () => {
  setupStore();
  const { asFragment, getByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    </Provider>
  );
  // Wait for the data to be fetched and component to be updated
  await waitFor(() => getByText(/Welcome to the Chat App!/i));
  await waitFor(() => getByText(/Sign Up/i));
  await waitFor(() => getByText(/Login/i));

  expect(asFragment()).toMatchSnapshot();
});

// Snapshot test
test("Homepage matches snapshot, when user is logged in", async () => {
  setupStore({
    loggedIn: true,
    currentUser: "testuser",
  });
  const { asFragment, getByText, getAllByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    </Provider>
  );
  // Wait for the data to be fetched and component to be updated
  await waitFor(() => getByText(/Chat App/i));
  await waitFor(() => getByText(/Favourite/i));
  await waitFor(() => getAllByText(/Chat/i));

  expect(asFragment()).toMatchSnapshot();
});
