import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import "./CustomerBookings.css";

function CustomerBookings() {
  return (
    <div className="customer-bookings-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <CustomerSidebar />


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="customer-main">

        {/* TOPBAR */}

        <CustomerTopbar />


        {/* =====================================================
            BOOKINGS CONTENT
        ===================================================== */}

        <main className="customer-bookings-content">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-bookings-header">

            <div>
              <h1>My Bookings</h1>

              <p>
                View and manage all your hotel reservations
              </p>
            </div>

            <button className="customer-new-booking-btn">
              <FaBed />
              Book a Room
            </button>

          </div>


          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <div className="customer-booking-summary">

            {/* Total */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon blue">
                <FaCalendarAlt />
              </div>

              <div>
                <span>Total Bookings</span>
                <strong>5</strong>
              </div>

            </div>


            {/* Upcoming */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon orange">
                <FaClock />
              </div>

              <div>
                <span>Upcoming</span>
                <strong>2</strong>
              </div>

            </div>


            {/* Completed */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>Completed</span>
                <strong>2</strong>
              </div>

            </div>


            {/* Cancelled */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon red">
                <FaTimes />
              </div>

              <div>
                <span>Cancelled</span>
                <strong>1</strong>
              </div>

            </div>

          </div>


          {/* =================================================
              BOOKINGS CARD
          ================================================= */}

          <div className="customer-bookings-card">

            {/* Card Header */}

            <div className="customer-bookings-card-header">

              <div>
                <h2>All Reservations</h2>

                <p>
                  Your recent and previous hotel bookings
                </p>
              </div>


              {/* Filter */}

              <select className="customer-booking-filter">

                <option value="all">
                  All Bookings
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>


            {/* =================================================
                BOOKING LIST
            ================================================= */}

            <div className="customer-booking-list">


              {/* =================================================
                  BOOKING 1
              ================================================= */}

              <div className="customer-booking-item">

                {/* Room */}

                <div className="customer-booking-room">

                  <div className="customer-booking-room-icon">
                    <FaBed />
                  </div>

                  <div>

                    <h3>
                      Deluxe Room
                    </h3>

                    <span>
                      Room 101
                    </span>

                  </div>

                </div>


                {/* Dates */}

                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check In
                  </span>

                  <strong>
                    06 Aug 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check Out
                  </span>

                  <strong>
                    08 Aug 2026
                  </strong>

                </div>


                {/* Guests */}

                <div className="customer-booking-info">

                  <span>
                    <FaUsers />
                    Guests
                  </span>

                  <strong>
                    2 Guests
                  </strong>

                </div>


                {/* Price */}

                <div className="customer-booking-price">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹8,500
                  </strong>

                </div>


                {/* Status */}

                <div>

                  <span className="customer-booking-status confirmed">
                    Confirmed
                  </span>

                </div>


                {/* Action */}

                <button className="customer-booking-action">
                  <FaEye />
                  View
                </button>

              </div>


              {/* =================================================
                  BOOKING 2
              ================================================= */}

              <div className="customer-booking-item">

                <div className="customer-booking-room">

                  <div className="customer-booking-room-icon">
                    <FaBed />
                  </div>

                  <div>

                    <h3>
                      Premium Room
                    </h3>

                    <span>
                      Room 205
                    </span>

                  </div>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check In
                  </span>

                  <strong>
                    15 Aug 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check Out
                  </span>

                  <strong>
                    18 Aug 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaUsers />
                    Guests
                  </span>

                  <strong>
                    2 Guests
                  </strong>

                </div>


                <div className="customer-booking-price">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹12,500
                  </strong>

                </div>


                <div>

                  <span className="customer-booking-status upcoming">
                    Upcoming
                  </span>

                </div>


                <button className="customer-booking-action">
                  <FaEye />
                  View
                </button>

              </div>


              {/* =================================================
                  BOOKING 3
              ================================================= */}

              <div className="customer-booking-item">

                <div className="customer-booking-room">

                  <div className="customer-booking-room-icon">
                    <FaBed />
                  </div>

                  <div>

                    <h3>
                      Suite Room
                    </h3>

                    <span>
                      Room 309
                    </span>

                  </div>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check In
                  </span>

                  <strong>
                    22 Jul 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check Out
                  </span>

                  <strong>
                    25 Jul 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaUsers />
                    Guests
                  </span>

                  <strong>
                    3 Guests
                  </strong>

                </div>


                <div className="customer-booking-price">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹14,500
                  </strong>

                </div>


                <div>

                  <span className="customer-booking-status completed">
                    Completed
                  </span>

                </div>


                <button className="customer-booking-action">
                  <FaEye />
                  View
                </button>

              </div>


              {/* =================================================
                  BOOKING 4
              ================================================= */}

              <div className="customer-booking-item">

                <div className="customer-booking-room">

                  <div className="customer-booking-room-icon">
                    <FaBed />
                  </div>

                  <div>

                    <h3>
                      Standard Room
                    </h3>

                    <span>
                      Room 112
                    </span>

                  </div>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check In
                  </span>

                  <strong>
                    10 Jun 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaCalendarAlt />
                    Check Out
                  </span>

                  <strong>
                    12 Jun 2026
                  </strong>

                </div>


                <div className="customer-booking-info">

                  <span>
                    <FaUsers />
                    Guests
                  </span>

                  <strong>
                    2 Guests
                  </strong>

                </div>


                <div className="customer-booking-price">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹5,500
                  </strong>

                </div>


                <div>

                  <span className="customer-booking-status cancelled">
                    Cancelled
                  </span>

                </div>


                <button className="customer-booking-action">
                  <FaEye />
                  View
                </button>

              </div>


            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default CustomerBookings;