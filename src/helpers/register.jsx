import ChatApi from "../api";
import { saveTokenToLocalStorage } from "./localStorage";
async function register(
  username,
  password,
  firstName,
  lastName,
  gmailAddress,
  bio,
  dispatch
) {
  try {
    const resToken = await ChatApi.signup({
      username,
      password,
      firstName,
      lastName,
      gmailAddress,
      bio,
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

export default register;
