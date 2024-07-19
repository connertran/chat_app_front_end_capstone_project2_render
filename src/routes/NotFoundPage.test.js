import "../setupTests";
import { render, waitFor } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";
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

// Smoke test
test("Not found page renders without crashing", () => {
  render(
    <Provider store={store}>
      <Router>
        <NotFoundPage />
      </Router>
    </Provider>
  );
});

// Test form submission and API call
jest.mock("../api", () => ({
  getUser: jest.fn(),
}));

// Snapshot test
test("Not found page matches snapshot", async () => {
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
          <NotFoundPage />
        </Router>
      </Provider>
    ));
  });

  await waitFor(() => {
    expect(getByText(/404/i)).toBeInTheDocument();
    expect(getByText(/Not Found/i)).toBeInTheDocument();
    expect(
      getByText(/The resource requested could not be found on this server!/i)
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
