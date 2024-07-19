import "../../setupTests";
import { render, waitFor } from "@testing-library/react";
import EditUserForm from "./EditUserForm";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import rootReducer from "../../../Redux/rootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ChatApi from "../../api";
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
test("Edit user form renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <EditUserForm />
      </Router>
    </Provider>
  );
});

// Test form submission and API call
jest.mock("../../api", () => ({
  getUser: jest.fn(),
}));

// Snapshot test
test("Edit User form matches snapshot", async () => {
  store.dispatch({
    type: "LOGIN",
    payload: {
      username: "testuser",
    },
  });
  ChatApi.getUser.mockResolvedValueOnce({
    username: "testuser",
    firstName: "test",
    lastName: "user",
    gmailAddress: "testuser@gmail.com",
    bio: "I am a test user",
  });
  localStorage.setItem(
    "authToken",
    JSON.stringify({ username: "testuser", token: "fakeToken" })
  );

  let getByText, getByDisplayValue, asFragment;
  await act(async () => {
    ({ asFragment, getByText, getByDisplayValue } = render(
      <Provider store={store}>
        <Router>
          <EditUserForm />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getByText(/Edit Form/i)).toBeInTheDocument();
  });

  expect(getByText(/Username/i)).toBeInTheDocument();
  expect(getByText(/Save Info/i)).toBeInTheDocument();
  expect(getByDisplayValue("I am a test user")).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
