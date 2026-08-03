import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../assets/shnoor-logo.jpeg";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      alert(data.message);

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
          alt="Logo"
          className="login-logo"
        />

        <h2>Forgot Password</h2>

        <p className="login-subtitle">
          Enter your registered email address.
          We'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <label>Email Address</label>

            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              required

            />

          </div>

          <button
            className="login-button"
            type="submit"
          >
            Send Reset Link
          </button>

        </form>

        <p
          style={{
            marginTop:"20px",
            textAlign:"center",
          }}
        >
          <Link
            to="/login"
            style={{
              textDecoration:"none",
              color:"#17376E",
              fontWeight:"600",
            }}
          >
            Back to Login
          </Link>
        </p>

      </div>

    </div>

  );

}

export default ForgotPassword;