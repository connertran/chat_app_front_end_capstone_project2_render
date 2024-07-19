import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatApi from "../api";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
import EachUserInChatList from "./EachUserInChatList";
import "./UserFavouriteList.css";

function UserFavouriteList({ setPerson }) {
  const [favouriteList, setFavouriteList] = useState([]);
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!loggedInStatus || !token || !token.username) {
      navigate("/");
      return;
    }
    async function fetchFavouriteUsers(username) {
      try {
        const allFavouriteUsers = await ChatApi.getAllFavouriteUsers(username);
        const favUsers = await Promise.all(
          allFavouriteUsers.map(async (eachFavourite) => {
            const favUser = await ChatApi.getUserById(eachFavourite.receiver);
            return { username: favUser.username };
          })
        );
        setFavouriteList(favUsers);
      } catch (error) {
        console.error("Failed to fetch the favourite list");
      }
    }
    fetchFavouriteUsers(getTokenFromLocalStorage().username);
  }, [loggedInStatus, navigate]);
  function handleClick(username) {
    setPerson((person) => ({
      ...person,
      username: username,
    }));
  }
  return (
    <div className="UserFavouriteList-div">
      <h2>Favourite contacts:</h2>
      {favouriteList.length > 0 ? (
        favouriteList.map((user, index) => (
          <EachUserInChatList
            key={index}
            onClick={() => handleClick(user.username)}
            username={user.username}
          />
        ))
      ) : (
        <p>No contacts found.</p>
      )}
    </div>
  );
}

export default UserFavouriteList;
