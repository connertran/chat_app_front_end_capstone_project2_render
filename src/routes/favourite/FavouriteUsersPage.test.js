import "../../setupTests";
import { render, waitFor } from "@testing-library/react";
import FavouriteUsersPage from "./FavouriteUsersPage";
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
test("Favourite users page renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <FavouriteUsersPage />
      </Router>
    </Provider>
  );
});

// Test form submission and API call
jest.mock("../../api", () => ({
  getUser: jest.fn(),
}));

// Snapshot test
test("Favourite users matches snapshot", async () => {
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

  let getByText, asFragment;
  await act(async () => {
    ({ asFragment, getByText } = render(
      <Provider store={store}>
        <Router>
          <FavouriteUsersPage />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getByText(/Primary List/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
