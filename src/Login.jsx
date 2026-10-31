
import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    onLogin(email);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🛡️ SHIELD</div>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to your security dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <p className="register-text">
          Don't have an account?
          <button onClick={onRegister}>Create Account</button>
        </p>

        <div className="login-footer">
          Protected by SHIELD Security
        </div>
      </div>
    </div>
  );
}

export default Login;
