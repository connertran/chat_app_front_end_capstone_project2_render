import "./SignUpForm.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatApi from "../api";
import register from "../helpers/register";
import { formatError } from "../helpers/errors";
import { useDispatch } from "react-redux";
import LoggedInStatusRedirection from "../helpers/loggedinStatusRedirection";
function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialState = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    gmailAddress: "",
    bio: "",
  };
  const [formData, setFormData] = useState(initialState);
  // State to track error, when the user doesn't enter the correct format to the signup form
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
      const { username, password, firstName, lastName, gmailAddress, bio } =
        formData;
      await register(
        username,
        password,
        firstName,
        lastName,
        gmailAddress,
        bio,
        dispatch
      );
      navigate("/");
    } catch (e) {
      const errorMessage =
        e && e[0] ? formatError(e[0]) : "An unknown error occurred.";
      setError(errorMessage);
      console.log(error);
      console.error(e);
    }
  };

  return (
    <div>
      {/* Authorization check */}
      <LoggedInStatusRedirection />
      <h1 className="SignUpForm-h1">New Account</h1>
      {error && (
        <>
          <p>Invalid data!</p>
          <p>Make sure the data is in the correct format.</p>
          <p>{error}</p>
        </>
      )}
      <form className="SignUpForm-form-container" onSubmit={handleSubmit}>
        <label className="SignUpForm-form-label" htmlFor="username">
          Username:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label className="SignUpForm-form-label" htmlFor="password">
          Password:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label className="SignUpForm-form-label" htmlFor="first-name">
          First Name:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="first-name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label className="SignUpForm-form-label" htmlFor="last-name">
          Last Name:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="last-name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label className="SignUpForm-form-label" htmlFor="gmail-address">
          Gmail Address:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="gmail-address"
          type="text"
          name="gmailAddress"
          value={formData.gmailAddress}
          onChange={handleChange}
          required
        />
        <label className="SignUpForm-form-label" htmlFor="bio">
          Bio:{" "}
        </label>
        <input
          className="SignUpForm-form-input"
          id="bio"
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
        />
        <button className="SignUpForm-submit-btn" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
