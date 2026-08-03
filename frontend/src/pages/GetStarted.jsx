import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Login.css";
import logo from "../assets/shnoor-logo.jpeg";

function GetStarted() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
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

      alert("Account Created Successfully!");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <img
          src={logo}
          alt="Shnoor Logo"
          className="login-logo"
        />

        <h2>Create Account</h2>

        <p className="login-subtitle">
          Create your Hotel Management Account
        </p>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>

            <div className="password-box">

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Create Account
          </button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const user = jwtDecode(
                credentialResponse.credential
              );

              console.log(user);

              setFullName(user.name || "");
              setEmail(user.email || "");

              setPassword("");
              setConfirmPassword("");

              alert("Google details loaded successfully!");
            }}
            onError={() => {
              alert("Google Login Failed");
            }}
          />
        </div>

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#17376E",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default GetStarted;