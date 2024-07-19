import ChatApi from "../api";
import { saveTokenToLocalStorage } from "./localStorage";

async function login(username, password, dispatch) {
  try {
    const resToken = await ChatApi.login({
      username,
      password,
    });
    // pass the token to the browser request header
    ChatApi.token = resToken.token;

    saveTokenToLocalStorage({ username, token: resToken.token });
    dispatch({
      type: "LOGIN",
      payload: {
        username: username,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default login;
