import React, { useState, useEffect } from "react";
import ChatApi from "../api";
import "./FavouriteBtn.css";

function FavouriteBtn({ currentUser, addUser, communicated }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const favoriteUsers = await ChatApi.getAllFavouriteUsers(currentUser);
        const addUserObj = await ChatApi.getUser(addUser);
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
  }, [currentUser, addUser]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await ChatApi.removeUserFromFavouriteList(currentUser, addUser);
      } else {
        await ChatApi.addUserToFavouriteList(currentUser, addUser);
      }
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {communicated && (
        <button className="FavouriteBtn-btn" onClick={handleToggleFavorite}>
          {isFavorite ? <span>&#128153;</span> : <span>&#9825;</span>}
        </button>
      )}
    </>
  );
}

export default FavouriteBtn;
