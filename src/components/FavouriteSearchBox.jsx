import { useState, useEffect } from "react";
import ChatApi from "../api";
import "./SearchBox.css";
import { getTokenFromLocalStorage } from "../helpers/localStorage";
function FavouriteSearchBox({ setPerson }) {
  const initialState = {
    searchUsername: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  useEffect(() => {
    setCurrentUser(getTokenFromLocalStorage().username);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const favoriteUsers = await ChatApi.getAllFavouriteUsers(currentUser);
      const favUserSearchObj = await ChatApi.getUser(formData.searchUsername);
      const favUserId = favUserSearchObj.id;
      const isUserFavorite = favoriteUsers.some(
        (user) => user.receiver === favUserId
      );
      if (isUserFavorite) {
        setError(null);
        setPerson((person) => ({
          ...person,
          username: formData.searchUsername,
        }));
      } else {
        setError("This user isn't in your favourite list.");
      }
    } catch (e) {
      setError("This username doesn't exist");
    }
  };
  return (
    <>
      {error && (
        <>
          <p className="SearchBox-error">{error}</p>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <input
          className="SearchBox-form-input"
          id="searchUsername"
          type="text"
          name="searchUsername"
          placeholder="Search User"
          value={formData.searchUsername}
          onChange={handleChange}
          required
        />
      </form>
    </>
  );
}

export default FavouriteSearchBox;
