import React from "react";
import "./Hero.css";
import hotelImage from "../assets/Hotel_img.jpg";

function Hero() {

  const scrollToDemo = () => {
    const section = document.getElementById("demo");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section id="home" className="hero">

      <div className="hero-left">

        <span className="hero-tag">
          HOTEL MANAGEMENT PLATFORM
        </span>

        <h1>
          Enabling Smart <br />
          Hotel Access
        </h1>

        <p>
          Welcome your guests and offer a secure experience with our Hotel
          Access Control Platform.
        </p>

        <button
          className="demo-btn"
          onClick={scrollToDemo}
        >
          Book Demo
        </button>

      </div>

      <div className="hero-right">
        <img src={hotelImage} alt="Hotel" />
      </div>

    </section>
  );
}

export default Hero;