import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import LoggedInStatusRedirection from "./loggedinStatusRedirection";
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
});

afterEach(() => {
  ChatApi.token = undefined;
  localStorage.removeItem("authToken");
});

// Test form submission and API call
jest.mock("../api", () => ({
  getUser: jest.fn(),
}));

// Smock test

test("loggedinStatusRedirection renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <LoggedInStatusRedirection />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("loggedinStatusRedirection component matches snapshot", async () => {
  await act(async () => {
    ({ asFragment } = render(
      <Provider store={store}>
        <Router>
          <LoggedInStatusRedirection />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(asFragment()).toMatchSnapshot();
  });
});
