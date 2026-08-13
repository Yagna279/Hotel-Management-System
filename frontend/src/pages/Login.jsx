import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import "./Login.css";
import logo from "../assets/shnoor-logo.jpeg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // EMAIL / PASSWORD LOGIN
  // =====================================================

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

      console.log("Login Response:", data);
      console.log("Logged in User:", data.user);
      console.log("Role:", data.user?.role);

      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!data.token || !data.user) {
        console.error("Invalid login response:", data);

        alert(
          "Login failed. Server did not return valid authentication information."
        );

        return;
      }

      // =================================================
      // SAVE AUTHENTICATION DATA
      // =================================================

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Optional: remove Google login data
      localStorage.removeItem("googleUser");

      // =================================================
      // GET ROLE
      // =================================================

      const role = String(
        data.user.role || ""
      ).toUpperCase();

      console.log("Authenticated Role:", role);

      // =================================================
      // ROLE BASED REDIRECTION
      // =================================================

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/super-admin-dashboard", {
            replace: true,
          });
          break;

        case "ADMIN":
          navigate("/admin-dashboard", {
            replace: true,
          });
          break;

        case "CUSTOMER":
          navigate("/customer-dashboard", {
            replace: true,
          });
          break;

        default:
          // Invalid role
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert(
            "Unknown user role. Please contact the administrator."
          );
          break;
      }

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      // =================================================
      // CHECK GOOGLE CREDENTIAL
      // =================================================

      if (!credentialResponse?.credential) {
        alert("Google Login Failed.");
        return;
      }

      // =================================================
      // DECODE GOOGLE USER
      // =================================================

      const googleUser = jwtDecode(
        credentialResponse.credential
      );

      console.log(
        "Google User:",
        googleUser
      );

      // =================================================
      // GOOGLE LOGIN IS CUSTOMER LOGIN
      // =================================================

      const customerUser = {
        id: googleUser.sub,
        full_name: googleUser.name || "",
        email: googleUser.email || "",
        role: "CUSTOMER",
        picture: googleUser.picture || "",
      };

      // =================================================
      // IMPORTANT
      // =================================================
      //
      // ProtectedRoute requires BOTH:
      //
      // token
      // user
      //
      // Google provides us with a credential.
      // Store it as the authentication token.
      // =================================================

      localStorage.setItem(
        "token",
        credentialResponse.credential
      );

      localStorage.setItem(
        "user",
        JSON.stringify(customerUser)
      );

      // Keep Google information if needed elsewhere
      localStorage.setItem(
        "googleUser",
        JSON.stringify(googleUser)
      );

      // =================================================
      // REDIRECT CUSTOMER
      // =================================================

      navigate("/customer-dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      alert(
        "Google Login failed. Please try again."
      );
    }
  };

  // =====================================================
  // GOOGLE LOGIN ERROR
  // =====================================================

  const handleGoogleError = () => {
    console.error("Google Login Failed");

    alert(
      "Google Login Failed. Please try again."
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <img
          src={logo}
          alt="Shnoor Logo"
          className="login-logo"
        />

        {/* =================================================
            TITLE
        ================================================= */}

        <h2>
          Welcome Back
        </h2>

        <p className="login-subtitle">
          Sign in to access your Hotel Management Dashboard
        </p>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="input-group">

            <label>
              Email Address
            </label>

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

          {/* PASSWORD */}

          <div className="input-group">

            <label>
              Password
            </label>

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

          {/* FORGOT PASSWORD */}

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

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="divider">

          <span>
            OR
          </span>

        </div>

        {/* =================================================
            GOOGLE LOGIN
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="login-footer">
          © 2026 SHNOOR International LLC
        </p>

      </div>

    </div>
  );
}

export default Login;