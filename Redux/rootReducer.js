import { getTokenFromLocalStorage } from "../src/helpers/localStorage";

const fromLocal = getTokenFromLocalStorage();
let currentStateLoggedIn = false;
let userUsername = "";
if (fromLocal !== null && fromLocal.username) {
  // console.log(fromLocal);
  currentStateLoggedIn = true;
  userUsername = fromLocal.username;
}
const INITIAL_STATE = {
  loggedIn: currentStateLoggedIn,
  currentUser: userUsername,
};

function rootReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      if (!action.payload || !action.payload.username) {
        console.error("Invalid action payload for LOGIN");
        return state;
      }
      return {
        ...state,
        loggedIn: true,
        currentUser: action.payload.username,
      };
    case "LOGOUT":
      return {
        ...state,
        loggedIn: false,
        currentUser: "",
      };
    default:
      return state;
  }
}

export default rootReducer;
