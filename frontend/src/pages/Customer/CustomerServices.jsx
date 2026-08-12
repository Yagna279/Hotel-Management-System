import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaConciergeBell,
  FaUtensils,
  FaSpa,
  FaCar,
  FaWifi,
  FaDumbbell,
  FaSwimmingPool,
  FaCoffee,
  FaArrowRight,
} from "react-icons/fa";

import "./CustomerServices.css";

function CustomerServices() {
  const services = [
    {
      id: 1,
      icon: <FaUtensils />,
      title: "Restaurant & Dining",
      description:
        "Enjoy delicious meals and beverages prepared by our professional chefs.",
      price: "From ₹500",
      className: "orange",
    },
    {
      id: 2,
      icon: <FaSpa />,
      title: "Spa & Wellness",
      description:
        "Relax and refresh yourself with our premium spa and wellness services.",
      price: "From ₹1,500",
      className: "purple",
    },
    {
      id: 3,
      icon: <FaCar />,
      title: "Airport Transfer",
      description:
        "Comfortable and reliable airport pickup and drop-off services.",
      price: "From ₹800",
      className: "blue",
    },
    {
      id: 4,
      icon: <FaWifi />,
      title: "High-Speed Wi-Fi",
      description:
        "Stay connected with complimentary high-speed internet throughout the hotel.",
      price: "Free",
      className: "green",
    },
    {
      id: 5,
      icon: <FaDumbbell />,
      title: "Fitness Center",
      description:
        "Access our modern fitness center with equipment for your daily workout.",
      price: "From ₹300",
      className: "red",
    },
    {
      id: 6,
      icon: <FaSwimmingPool />,
      title: "Swimming Pool",
      description:
        "Enjoy a refreshing swim in our clean and relaxing swimming pool.",
      price: "From ₹400",
      className: "cyan",
    },
    {
      id: 7,
      icon: <FaCoffee />,
      title: "Breakfast",
      description:
        "Start your day with a fresh and delicious breakfast at our restaurant.",
      price: "From ₹350",
      className: "yellow",
    },
    {
      id: 8,
      icon: <FaConciergeBell />,
      title: "Room Service",
      description:
        "Order food, beverages and other services directly to your room.",
      price: "From ₹200",
      className: "pink",
    },
  ];

  return (
    <>
      {/* ================= SIDEBAR ================= */}

      <CustomerSidebar />

      {/* ================= MAIN AREA ================= */}

      <div className="customer-main">

        {/* ================= TOPBAR ================= */}

        <CustomerTopbar />

        {/* ================= SERVICES CONTENT ================= */}

        <main className="customer-services-page">

          {/* ================= HEADER ================= */}

          <div className="customer-services-header">

            <div>
              <span className="customer-services-label">
                HOTEL SERVICES
              </span>

              <h1>My Services</h1>

              <p>
                Explore and enjoy our premium hotel services during your stay.
              </p>
            </div>

          </div>

          {/* ================= QUICK INFO ================= */}

          <div className="customer-services-info">

            <div className="services-info-icon">
              <FaConciergeBell />
            </div>

            <div>
              <h3>Make your stay more comfortable</h3>

              <p>
                Choose from our range of hotel services and make the most
                of your stay at Shnoor Hotel.
              </p>
            </div>

          </div>

          {/* ================= SERVICES GRID ================= */}

          <section className="customer-services-section">

            <div className="customer-section-title">

              <div>
                <h2>Available Services</h2>

                <p>
                  Services available for our hotel guests
                </p>
              </div>

              <span className="service-count">
                {services.length} Services
              </span>

            </div>

            <div className="customer-services-grid">

              {services.map((service) => (
                <div
                  className="customer-service-card"
                  key={service.id}
                >

                  {/* ICON */}

                  <div
                    className={`customer-service-icon ${service.className}`}
                  >
                    {service.icon}
                  </div>

                  {/* CONTENT */}

                  <div className="customer-service-content">

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <div className="customer-service-footer">

                      <span className="customer-service-price">
                        {service.price}
                      </span>

                      <button
                        type="button"
                        className="customer-service-button"
                      >
                        Request
                        <FaArrowRight />
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>

        </main>
      </div>
    </>
  );
}

export default CustomerServices;