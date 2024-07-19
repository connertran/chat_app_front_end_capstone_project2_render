import ChatApi from "../api";
import { saveTokenToLocalStorage } from "./localStorage";
import login from "./login";

jest.mock("../api");
jest.mock("./localStorage");

describe("login", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("login should call ChatApi.login; save token to the local storage and work with Redux dispatch", async () => {
    const username = "testUser";
    const password = "testPassword";
    const token = "testToken";
    ChatApi.login.mockResolvedValue({ token });

    await login(username, password, dispatchMock);

    expect(ChatApi.login).toHaveBeenCalledWith({ username, password });
    expect(saveTokenToLocalStorage).toHaveBeenCalledWith({ username, token });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "LOGIN",
      payload: { username },
    });
  });
});
