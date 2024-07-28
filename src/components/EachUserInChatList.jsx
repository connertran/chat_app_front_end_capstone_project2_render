import "./EachUserInChatList.css";
import { useState, useEffect } from "react";
import ChatApi from "../api";
import { getTokenFromLocalStorage } from "../helpers/localStorage";

function EachUserInChatList({ username, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const currentUser = getTokenFromLocalStorage().username;
    async function checkFavoriteStatus() {
      try {
        const favoriteUsers = await ChatApi.getAllFavouriteUsers(currentUser);
        const addUserObj = await ChatApi.getUser(username);
        const addUserId = addUserObj.id;
        const isUserFavorite = favoriteUsers.some(
          (user) => user.receiver === addUserId
        );
        setIsFavorite(isUserFavorite);
      } catch (e) {
        console.error(e);
      }
    }
    checkFavoriteStatus();
  }, [username]);
  return (
    <>
      <div className="EachUserInChatList-div" onClick={onClick}>
        <p
          className={`EachUserInChatList-username ${
            isFavorite ? "EachUserInChatList-username-shining" : ""
          }`}
        >
          {username}
        </p>
      </div>
    </>
  );
}

export default EachUserInChatList;
