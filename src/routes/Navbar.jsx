import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Logout from "./Logout";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.css";

const Navbar = () => {
  const loggedInStatus = useSelector((store) => store.loggedIn);
  const currentUser = useSelector((store) => store.currentUser);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setUsername(currentUser);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="Navbar-div">
      <Link className="Navbar-home" to="/">
        Home
      </Link>
      {!loggedInStatus && (
        <div>
          <Link className="Navbar-login" to="/login">
            Login
          </Link>
          <Link className="Navbar-signup" to="/signup">
            Signup
          </Link>
        </div>
      )}

      {loggedInStatus && (
        <div>
          <Logout dispatch={dispatch} />
          <Link className="Navbar-profile" to={`users/${username}`}>
            My Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
