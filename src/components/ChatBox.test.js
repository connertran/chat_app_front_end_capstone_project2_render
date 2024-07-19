import "../setupTests";
import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import ChatBox from "./ChatBox";
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

// Test form submission and API call
jest.mock("../api", () => ({
  getUser: jest.fn(),
  sendMessages: jest.fn(),
}));

// Mock the scrollIntoView function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Smoke test
test("Chat box renders without crashing", () => {
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
  render(
    <Provider store={store}>
      <Router>
        <ChatBox
          username="testuser"
          currentUserId={1}
          conversation={{ conversation: [] }}
          chatInProfilePage={false}
        />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("Chat box matches snapshot", async () => {
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
  let asFragment;
  await act(async () => {
    ({ asFragment } = render(
      <Provider store={store}>
        <Router>
          <ChatBox
            username="testuser"
            currentUserId={1}
            conversation={{ conversation: [] }}
            chatInProfilePage={false}
          />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(asFragment()).toMatchSnapshot();
  });
});
