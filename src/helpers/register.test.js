import ChatApi from "../api";
import { saveTokenToLocalStorage } from "./localStorage";
import register from "./register";

jest.mock("../api");
jest.mock("./localStorage");

describe("register", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("signup should call ChatApi.signup; save token to the local storage and work with Redux dispatch", async () => {
    const username = "testUser";
    const password = "testPassword";
    const firstName = "Test";
    const lastName = "User";
    const gmailAddress = "testuser@gmail.com";
    const bio = "This is a test user";
    const token = "testToken";
    ChatApi.signup.mockResolvedValue({ token });

    await register(
      username,
      password,
      firstName,
      lastName,
      gmailAddress,
      bio,
      dispatchMock
    );

    expect(ChatApi.signup).toHaveBeenCalledWith({
      username,
      password,
      firstName,
      lastName,
      gmailAddress,
      bio,
    });
    expect(saveTokenToLocalStorage).toHaveBeenCalledWith({ username, token });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "LOGIN",
      payload: { username },
    });
  });
});
