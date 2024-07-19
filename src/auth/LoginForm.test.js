import "../setupTests";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "../App";
import LoginForm from "./LoginForm";
import ChatApi from "../api";
import Homepage from "../routes/Homepage";
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
test("Login form renders without crashing", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>
  );
});

// Snapshot test
test("Login matches snapshot", () => {
  const { asFragment, getByText, getAllByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();

  expect(getAllByText(/Login/i).length).toBeGreaterThan(0);
  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/Password/i)).toBeInTheDocument();
});

test("renders the login page, counts the inputs and labels", function () {
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <App router={null} />
      </MemoryRouter>
    </Provider>
  );

  const labels = container.querySelectorAll("label");
  expect(labels).toHaveLength(2);
  const inputs = container.querySelectorAll("input");
  expect(inputs).toHaveLength(2);
});

// Mock the login API call
jest.mock("../api", () => ({
  login: jest.fn(),
}));

test("redirects to homepage after login", async () => {
  ChatApi.login.mockResolvedValueOnce({ token: "fakeToken" });

  const { getByLabelText, getByRole } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(getByLabelText(/Username/i), {
    target: { value: "testuser" },
  });
  fireEvent.change(getByLabelText(/Password/i), {
    target: { value: "password" },
  });
  fireEvent.click(getByRole("button", { name: /Login/i }));

  await waitFor(() => {
    expect(ChatApi.login).toHaveBeenCalledWith({
      username: "testuser",
      password: "password",
    });
    expect(window.location.pathname).toBe("/");
  });
});

test("when logged in user tries to go to the login route, they will be redirected back to the homepage", async () => {
  // Mock getTokenFromLocalStorage to return an object simulating logged in state
  jest
    .spyOn(require("../helpers/localStorage"), "getTokenFromLocalStorage")
    .mockReturnValue({ username: "testuser", token: "fakeToken" });

  const fakeToken = "fakeToken";
  ChatApi.login.mockResolvedValueOnce({ token: fakeToken });
  ChatApi.token = fakeToken;
  store.dispatch({
    type: "LOGIN",
    payload: {
      username: "fakename",
    },
  }); // Update Redux store to reflect login state

  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  // Verify that the user is redirected to the homepage ("/") after login
  await waitFor(() => {
    expect(window.location.pathname).toBe("/");
    expect(getByText(/Favourite/i)).toBeInTheDocument();
    expect(getByText(/Chat App/i)).toBeInTheDocument();
  });
});

test("displays error message on invalid login", async () => {
  ChatApi.login.mockRejectedValueOnce(new Error("Invalid username/password."));

  const { getByLabelText, getByRole, getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(getByLabelText(/Username/i), {
    target: { value: "invaliduser" },
  });
  fireEvent.change(getByLabelText(/Password/i), {
    target: { value: "wrongpassword" },
  });
  fireEvent.click(getByRole("button", { name: /Login/i }));

  await waitFor(() => {
    expect(ChatApi.login).toHaveBeenCalledWith({
      username: "invaliduser",
      password: "wrongpassword",
    });
    expect(getByText(/Invalid username\/password\./i)).toBeInTheDocument();
  });
});
