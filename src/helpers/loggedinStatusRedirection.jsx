import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoggedInStatusRedirection() {
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);

  useEffect(() => {
    if (loggedInStatus) {
      navigate("/");
    }
  }, [loggedInStatus, navigate]);

  return null;
}

export default LoggedInStatusRedirection;
