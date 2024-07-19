import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import TextBubble from "./TextBubble";
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
}));

// Smoke test
test("Text bubble renders without crashing", () => {
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
        <TextBubble />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("Text bubble matches snapshot", async () => {
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

  await act(async () => {
    ({ asFragment, getByText } = render(
      <Provider store={store}>
        <Router>
          <TextBubble
            text={"hello"}
            sender={"u1"}
            seenByReceiver={true}
            time={"23:59 12/31/23"}
          />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getByText(/hello/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
