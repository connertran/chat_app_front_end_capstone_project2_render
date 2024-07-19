import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import "./Homepage.css";
library.add(faCode);
function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInStatus = useSelector((store) => store.loggedIn);

  const handleBtn = (e) => {
    const btnText = e.target.innerText;
    if (btnText === "Favourite") {
      navigate("/favourite");
    } else if (btnText === "Chat") {
      navigate("/chat");
    }
  };
  return (
    <>
      {!loggedInStatus && (
        <>
          <div>
            <h1 className="Homepage-h1">Welcome to the Chat App!</h1>
          </div>
          <Link className="Homepage-signup-link" to="/signup">
            Sign Up
          </Link>
          <Link className="Homepage-login-link" to="/login">
            Login
          </Link>
        </>
      )}
      {loggedInStatus && (
        <>
          <h1 className="Homepage-h1-loged-in">
            {
              <FontAwesomeIcon
                icon={["fas", "code"]}
                style={{ color: "#FFD43B" }}
                className="Homepage-blinker"
              />
            }{" "}
            Chat App
          </h1>
          <button className="Homepage-favourite-btn" onClick={handleBtn}>
            Favourite
          </button>
          <button className="Homepage-chat-btn" onClick={handleBtn}>
            Chat
          </button>
        </>
      )}
    </>
  );
}

export default Homepage;
