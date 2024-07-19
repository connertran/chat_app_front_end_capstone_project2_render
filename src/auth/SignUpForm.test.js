import "../setupTests";
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import "@testing-library/jest-dom";
import {
  BrowserRouter as Router,
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import rootReducer from "../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ChatApi from "../api";
import Homepage from "../routes/Homepage";
import LoginForm from "./LoginForm";

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
test("Sign Up form renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <SignUpForm />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("Sign Up form matches snapshot", () => {
  const { asFragment, getByText, getAllByText } = render(
    <Provider store={store}>
      <Router>
        <SignUpForm />
      </Router>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();

  expect(getAllByText(/Sign Up/i).length).toBeGreaterThan(0);
  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/New Account/i)).toBeInTheDocument();
  expect(getByText(/Password/i)).toBeInTheDocument();
});

// Full render with MemoryRouter
test("mounts without crashing", function () {
  const { getByText, getAllByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    </Provider>
  );
  expect(getAllByText(/Sign Up/i).length).toBeGreaterThan(0);
  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/Password/i)).toBeInTheDocument();
  expect(getByText(/New Account/i)).toBeInTheDocument();
});

// Test form submission and API call
jest.mock("../api", () => ({
  signup: jest.fn(),
}));

test("redirects to homepage after signup", async () => {
  ChatApi.signup.mockResolvedValueOnce({ token: "fakeToken" });

  const { getByLabelText, getByRole } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(getByLabelText(/Username/i), {
    target: { value: "newuser" },
  });
  fireEvent.change(getByLabelText(/Password/i), {
    target: { value: "password" },
  });
  fireEvent.change(getByLabelText(/First Name/i), {
    target: { value: "new" },
  });
  fireEvent.change(getByLabelText(/Last Name/i), {
    target: { value: "user" },
  });
  fireEvent.change(getByLabelText(/Gmail Address/i), {
    target: { value: "newuser@gmail.com" },
  });
  fireEvent.change(getByLabelText(/Bio/i), {
    target: { value: "I am a test user" },
  });
  fireEvent.click(getByRole("button", { name: /Sign Up/i }));

  await waitFor(() => {
    expect(ChatApi.signup).toHaveBeenCalledWith({
      username: "newuser",
      password: "password",
      firstName: "new",
      lastName: "user",
      gmailAddress: "newuser@gmail.com",
      bio: "I am a test user",
    });
    expect(window.location.pathname).toBe("/");
  });
});

test("when logged in user tries to go to the sign up route, they will be redirected back to the homepage", async () => {
  // Mock getTokenFromLocalStorage to return an object simulating logged in state
  jest
    .spyOn(require("../helpers/localStorage"), "getTokenFromLocalStorage")
    .mockReturnValue({ username: "testuser", token: "fakeToken" });
  const fakeToken = "fakeToken";
  ChatApi.signup.mockResolvedValueOnce({ token: fakeToken });
  ChatApi.token = fakeToken;
  store.dispatch({
    type: "LOGIN",
    payload: {
      username: "testuser",
    },
  });
  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUpForm />} />
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

test("displays error message on invalid sign up", async () => {
  ChatApi.signup.mockRejectedValueOnce(new Error("Invalid data!"));

  const { getByLabelText, getByRole, getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(getByLabelText(/Username/i), {
    target: { value: "w" },
  });
  fireEvent.change(getByLabelText(/Password/i), {
    target: { value: "r" },
  });
  fireEvent.change(getByLabelText(/First Name/i), {
    target: { value: "o" },
  });
  fireEvent.change(getByLabelText(/Last Name/i), {
    target: { value: "n" },
  });
  fireEvent.change(getByLabelText(/Gmail Address/i), {
    target: { value: "g" },
  });
  fireEvent.change(getByLabelText(/Bio/i), {
    target: { value: "I" },
  });
  fireEvent.click(getByRole("button", { name: /Sign Up/i }));

  await waitFor(() => {
    expect(ChatApi.signup).toHaveBeenCalledWith({
      username: "w",
      password: "r",
      firstName: "o",
      lastName: "n",
      gmailAddress: "g",
      bio: "I",
    });
    expect(getByText(/Invalid data!/i)).toBeInTheDocument();
    expect(
      getByText(/Make sure the data is in the correct format./i)
    ).toBeInTheDocument();
  });
});
