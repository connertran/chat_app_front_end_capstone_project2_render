import IndividualChat from "../../components/IndividualChat";
import UserFavouriteList from "../../components/UserFavouriteList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenFromLocalStorage } from "../../helpers/localStorage";
import "./FavouriteUsersPage.css";

function FavouriteUsersPage() {
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!loggedInStatus || !token || !token.username) {
      navigate("/");
      return;
    }
  }, [loggedInStatus, navigate]);

  const initialState = {
    username: "",
  };
  const [person, setPerson] = useState(initialState);
  return (
    <>
      <h1 className="FavouriteUserPage-h1">Primary List</h1>
      <div className="FavouriteUserPage-contact-chat-div">
        <UserFavouriteList setPerson={setPerson} />
        {person.username === "" ? (
          <div className="FavouriteUserPage-empty"></div>
        ) : null}
        <IndividualChat username={person.username} />
      </div>
    </>
  );
}
export default FavouriteUsersPage;
