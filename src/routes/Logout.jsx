import ChatApi from "../api";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
const Logout = ({ dispatch }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove the token from the browser request header
    ChatApi.token = "";
    localStorage.removeItem("authToken");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  return (
    <a className="Logout-link" onClick={handleLogout}>
      Logout
    </a>
  );
};

export default Logout;
