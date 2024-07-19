import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import UserPage from "./UserPage";
import "@testing-library/jest-dom";
import rootReducer from "../../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ChatApi from "../../api";
import Homepage from "../Homepage";
import mockAxios from "jest-mock-axios";
import LoginForm from "../../auth/LoginForm";
let store;

const setupStore = (initialState) => {
  store = createStore(rootReducer, initialState);
};

beforeEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
  // jest.clearAllMocks();
});

afterEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

// Smoke test
test("UserPage renders without crashing", () => {
  setupStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <UserPage />
      </MemoryRouter>
    </Provider>
  );
});

// Snapshot test
test("Other people's User Page matches snapshot", () => {
  setupStore({
    loggedIn: true,
    currentUser: "testuser",
  });
  const { asFragment, getByText, getAllByText, getByRole } = render(
    <Provider store={store}>
      <MemoryRouter>
        <UserPage />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();

  expect(getAllByText(/Name/i).length).toBeGreaterThan(0);
  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/Gmail Address/i)).toBeInTheDocument();
  expect(getByText(/Bio/i)).toBeInTheDocument();
  expect(getByText(/User's role/i)).toBeInTheDocument();
  expect(getByRole("button", { name: /Chat/i })).toBeInTheDocument();
});

test("Showing edit and delete button, when the page is current user's User Profile", () => {
  localStorage.setItem(
    "authToken",
    JSON.stringify({ username: "testuser", token: "fakeToken" })
  );
  setupStore({
    loggedIn: true,
    currentUser: "testuser",
  });
  ChatApi.token = "fakeToken";
  const { getByText, getAllByText, getByRole } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/users/testuser"]}>
        <Routes>
          <Route path="/users/:username" element={<UserPage />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  expect(getAllByText(/Name/i).length).toBeGreaterThan(0);
  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/Gmail Address/i)).toBeInTheDocument();
  expect(getByText(/Bio/i)).toBeInTheDocument();
  expect(getByText(/User's role/i)).toBeInTheDocument();
  expect(getByRole("button", { name: /Edit/i })).toBeInTheDocument();
  expect(getByRole("button", { name: /Delete Profile/i })).toBeInTheDocument();
});
