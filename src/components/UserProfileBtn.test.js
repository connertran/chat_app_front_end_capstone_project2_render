import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import UserProfileBtn from "./UserProfileBtn";
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
test("User Profile button renders without crashing", () => {
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
        <UserProfileBtn />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("User profile button matches snapshot", async () => {
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
          <UserProfileBtn
            title={"Edit"}
            className={"UserPage-edit-btn"}
            onClickFunction={console.log("The button is clicked.")}
          />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getByText(/Edit/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
