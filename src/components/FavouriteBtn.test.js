import React from "react";
import { render, waitFor } from "@testing-library/react";
import rootReducer from "../../Redux/rootReducer.js";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "@testing-library/jest-dom";
import FavouriteBtn from "./FavouriteBtn.jsx";

const store = createStore(rootReducer);
// Smoke test
test("App renders without crashing", () => {
  render(
    <Provider store={store}>
      <FavouriteBtn />
    </Provider>
  );
});

// Snapshot test
test("App matches snapshot", async () => {
  const { asFragment, getByRole } = render(
    <Provider store={store}>
      <FavouriteBtn
        currentUser={"fake1"}
        addUser={"fake2"}
        communicated={true}
      />
    </Provider>
  );
  // Wait for the data to be fetched and component to be updated
  await waitFor(() => {
    expect(
      getByRole("button", { className: /FavouriteBtn-btn/i })
    ).toBeInTheDocument();
  });

  expect(asFragment()).toMatchSnapshot();
});
