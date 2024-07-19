import ChatApi from "../../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTokenFromLocalStorage } from "../../helpers/localStorage";
import "./EditUserForm.css";
function EditUserForm() {
  const navigate = useNavigate();
  const loggedInStatus = useSelector((store) => store.loggedIn);
  const username = useSelector((store) => store.currentUser);

  const initialState = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    gmailAddress: "",
    bio: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const token = getTokenFromLocalStorage();

  useEffect(() => {
    if (!loggedInStatus || !token || !token.username) {
      navigate("/");
      return;
    }

    async function fetchData(userUsername) {
      try {
        const userObj = await ChatApi.getUser(userUsername);
        const { username, firstName, lastName, gmailAddress, bio } = userObj;
        setFormData({
          ...formData,
          username,
          firstName,
          lastName,
          gmailAddress,
          bio,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData(username);
  }, [username]);

  const validateForm = () => {
    let formErrors = {};
    if (!formData.password) formErrors.password = "Password is required.";
    if (!formData.firstName) formErrors.firstName = "First name is required.";
    if (!formData.lastName) formErrors.lastName = "Last name is required.";
    if (!formData.gmailAddress)
      formErrors.gmailAddress = "Gmail address is required.";
    if (!formData.bio) formErrors.bio = "Bio is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await ChatApi.updateUser(formData);
      navigate(`/users/${formData.username}`);
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Check your password again!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
    setErrors((errors) => ({
      ...errors,
      [name]: "", // Clear error message when user starts typing
    }));
  };

  const handleClickUsername = () => {
    alert("You can't change your username!");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="EditUserForm-h1">Edit Form</h1>
      <form className="EditUserForm-form-container" onSubmit={handleSubmit}>
        <label
          className="EditUserForm-form-label"
          onClick={handleClickUsername}
          htmlFor="username"
        >
          Username:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          onClick={handleClickUsername}
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          readOnly
        />
        <label className="EditUserForm-form-label" htmlFor="password">
          Password:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <label className="EditUserForm-form-label" htmlFor="first-name">
          First Name:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          id="first-name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
        <label className="EditUserForm-form-label" htmlFor="last-name">
          Last Name:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          id="last-name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && (
          <p className="EditUserForm-error" style={{ color: "red" }}>
            {errors.lastName}
          </p>
        )}
        <label className="EditUserForm-form-label" htmlFor="gmail-address">
          Gmail Address:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          id="gmail-address"
          type="email"
          name="gmailAddress"
          value={formData.gmailAddress}
          onChange={handleChange}
          required
        />
        {errors.gmailAddress && (
          <p style={{ color: "red" }}>{errors.gmailAddress}</p>
        )}
        <label className="EditUserForm-form-label" htmlFor="bio">
          Bio:{" "}
        </label>
        <input
          className="EditUserForm-form-input"
          id="bio"
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
        />
        {errors.bio && <p style={{ color: "red" }}>{errors.bio}</p>}
        <button className="EditUserForm-submit-btn" type="submit">
          Save Info
        </button>
      </form>
    </>
  );
}

export default EditUserForm;
