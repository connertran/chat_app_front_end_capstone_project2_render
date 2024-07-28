import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import ProfileDetails from "./ProfileDetails";
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
test("Profile details renders without crashing", () => {
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
        <ProfileDetails />
      </Router>
    </Provider>
  );
});

// Snapshot test
test("Profile details matches snapshot", async () => {
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
    ({ asFragment, getByText, getAllByText } = render(
      <Provider store={store}>
        <Router>
          <ProfileDetails
            firstName={"Test"}
            lastName={"User"}
            username={"testuser"}
            gmailAddress={"testuser@gmail.com"}
            bio={"I am a test user."}
            role={"Admin"}
          />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getAllByText(/testuser/i).length).toBeGreaterThan(0);
    expect(getByText(/Gmail Address/i)).toBeInTheDocument();
    expect(getByText(/testuser@gmail.com/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
