import { useState } from "react";
import "./Login.css";
import logo from "../assets/shnoor-logo.jpeg";

function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@shnoor.com") {
      alert("Admin Login");
    } else {
      alert("Customer Login");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <img src={logo} alt="Shnoor Logo" className="login-logo" />

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to access your Hotel Management Dashboard
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="login-footer">
          © 2026 SHNOOR International LLC
        </p>

      </div>

    </div>
  );
}

export default Login;