import { useState, useEffect } from "react";
import ChatApi from "../api";
import "./SearchBox.css";
function SearchBox({ setPerson }) {
  const initialState = {
    searchUsername: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
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
      const res = await ChatApi.getUser(formData.searchUsername);
      console.log(res);
      setError(null);
      setPerson((person) => ({
        ...person,
        username: res.username,
      }));
    } catch (e) {
      setError("User doesn't exist");
    }
  };
  return (
    <>
      {error && (
        <>
          <p className="SearchBox-error">Invalid username/password.</p>
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

export default SearchBox;
