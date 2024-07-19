import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import login from "../helpers/login";
import "./LoginForm.css";
import LoggedInStatusRedirection from "../helpers/loggedinStatusRedirection";
function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialState = {
    username: "",
    password: "",
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
      const { username, password } = formData;
      await login(username, password, dispatch);
      navigate("/");
    } catch (e) {
      setError("Invalid username or password"); //Set error message to state
      console.error(e);
    }
  };
  return (
    <>
      {/* Authorization check */}
      <LoggedInStatusRedirection />

      <h1 className="LoginForm-h1">Login</h1>
      <form className="LoginForm-form-container" onSubmit={handleSubmit}>
        {error && (
          <>
            <p className="LoginForm-error">Invalid username/password.</p>
          </>
        )}
        <label className="LoginForm-form-label" htmlFor="username">
          Username:{" "}
        </label>
        <input
          id="username"
          className="LoginForm-form-input"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label className="LoginForm-form-label" htmlFor="password">
          Password:{" "}
        </label>
        <input
          id="password"
          className="LoginForm-form-input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="LoginForm-submit-btn" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default LoginForm;
