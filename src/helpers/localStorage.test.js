// mock localStorage, this is is an object that has a very similar properties like a real localStorage
let localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// ####################################################
// Testing the localStorage.jsx

import {
  getTokenFromLocalStorage,
  saveTokenToLocalStorage,
} from "./localStorage";

describe("localStorage functions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("saveTokenToLocalStorage saves token to local storage correctly", () => {
    const mockToken = { username: "testUser", token: "mockToken123" };

    saveTokenToLocalStorage(mockToken);

    const storedToken = JSON.parse(localStorage.getItem("authToken"));
    expect(storedToken).toEqual(mockToken);
  });

  test("getTokenFromLocalStorage retrieves token correctly", () => {
    const mockToken = { username: "testUser", token: "mockToken123" };

    localStorage.setItem("authToken", JSON.stringify(mockToken));

    const retrievedToken = getTokenFromLocalStorage();

    expect(retrievedToken).toEqual(mockToken);
  });

  test("getTokenFromLocalStorage should return null if token is not set", () => {
    const retrievedToken = getTokenFromLocalStorage();

    expect(retrievedToken).toBeNull();
  });

  test("getTokenFromLocalStorage should handle JSON parse error", () => {
    localStorage.setItem("authToken", "{ invalidJSON }");

    const retrievedToken = getTokenFromLocalStorage();

    expect(retrievedToken).toBeNull();
  });
});
