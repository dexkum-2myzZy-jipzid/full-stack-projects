import { useState } from "react";
import "../styles/LoginForm.css";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");

  function onChange(e) {
    setUsername(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (username) {
      onLogin(username);
    }
  }

  return (
    <div className="login-container">
      <div className="login-logo">Y</div>
      <form className="login-form" action="#/login" onSubmit={onSubmit}>
        <label className="username-label">
          <span className="username-span">Username</span>
          <input
            className="username-input"
            value={username}
            onChange={onChange}
          />
        </label>
        <button className="login-submit-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
