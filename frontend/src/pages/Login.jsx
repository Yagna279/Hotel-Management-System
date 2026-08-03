import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import "./Login.css";
import logo from "../assets/shnoor-logo.jpeg";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= EMAIL LOGIN =================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/customer-dashboard";
      }

    } catch (error) {

      console.error(error);

      alert("Server Error");

    }

  };

  // ================= GOOGLE LOGIN =================

  const handleGoogleSuccess = (credentialResponse) => {

    const user = jwtDecode(
      credentialResponse.credential
    );

    console.log(user);

    alert(`Welcome ${user.name}`);

    localStorage.setItem(
      "googleUser",
      JSON.stringify(user)
    );

    window.location.href = "/customer-dashboard";

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <img
          src={logo}
          alt="Shnoor Logo"
          className="login-logo"
        />

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to access your Hotel Management Dashboard
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}

          <div className="input-group">

            <label>Email Address</label>

            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              required

            />

          </div>

          {/* Password */}

          <div className="input-group">

            <label>Password</label>

            <input

              type="password"

              placeholder="Enter your password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              required

            />

          </div>

          {/* Forgot Password */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-8px",
              marginBottom: "20px",
            }}
          >

            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#17376E",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login */}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* Divider */}

        <div className="divider">

          <span>OR</span>

        </div>

        {/* Google */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >

          <GoogleLogin

            onSuccess={handleGoogleSuccess}

            onError={() => {

              alert("Google Login Failed");

            }}

          />

        </div>

        {/* Footer */}

        <p className="login-footer">

          © 2026 SHNOOR International LLC

        </p>

      </div>

    </div>

  );

}

export default Login;