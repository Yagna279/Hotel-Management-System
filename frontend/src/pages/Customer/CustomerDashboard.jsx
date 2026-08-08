import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaBed,
  FaArrowRight,
} from "react-icons/fa";

import "./Customer.css";

function CustomerDashboard() {
  return (
    <div className="customer-layout">

      {/* ================= SIDEBAR ================= */}

      <CustomerSidebar />

      {/* ================= MAIN ================= */}

      <div className="customer-main">

        {/* TOPBAR */}
        <CustomerTopbar />

        {/* DASHBOARD CONTENT */}

        <main className="customer-dashboard">

          {/* HEADER */}

          <div className="customer-dashboard-header">

            <div>
              <h1>Dashboard</h1>
              <p>Welcome back, Guest</p>
            </div>

            <button className="book-room-btn">
              <FaBed />
              Book a Room
            </button>

          </div>


          {/* ================= STATISTICS ================= */}

          <div className="customer-stats-grid">

            {/* Total Bookings */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon blue">
                <FaCalendarCheck />
              </div>

              <div className="customer-stat-info">
                <span>Total Bookings</span>
                <strong>5</strong>
                <small>All reservations</small>
              </div>

            </div>


            {/* Upcoming */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon orange">
                <FaClock />
              </div>

              <div className="customer-stat-info">
                <span>Upcoming</span>
                <strong>2</strong>
                <small>Reservations</small>
              </div>

            </div>


            {/* Completed */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon green">
                <FaCheckCircle />
              </div>

              <div className="customer-stat-info">
                <span>Completed</span>
                <strong>2</strong>
                <small>Completed stays</small>
              </div>

            </div>


            {/* Total Spent */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon purple">
                <FaMoneyBillWave />
              </div>

              <div className="customer-stat-info">
                <span>Total Spent</span>
                <strong>₹35,500</strong>
                <small>Overall payments</small>
              </div>

            </div>

          </div>


          {/* ================= BOTTOM AREA ================= */}

          <div className="customer-dashboard-grid">

            {/* ================= RECENT BOOKINGS ================= */}

            <div className="customer-dashboard-card">

              <div className="customer-card-header">

                <div>
                  <h2>My Recent Bookings</h2>
                  <p>Your latest hotel reservations</p>
                </div>

                <button className="view-all-btn">
                  View All
                  <FaArrowRight />
                </button>

              </div>


              <div className="booking-table-wrapper">

                <table className="customer-booking-table">

                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr>

                      <td>
                        <div className="room-cell">

                          <div className="room-small-icon">
                            <FaBed />
                          </div>

                          <div>
                            <strong>101 - Deluxe Room</strong>
                            <span>2 Guests</span>
                          </div>

                        </div>
                      </td>

                      <td>06 Aug 2026</td>

                      <td>08 Aug 2026</td>

                    </tr>


                    <tr>

                      <td>
                        <div className="room-cell">

                          <div className="room-small-icon">
                            <FaBed />
                          </div>

                          <div>
                            <strong>205 - Premium Room</strong>
                            <span>2 Guests</span>
                          </div>

                        </div>
                      </td>

                      <td>15 Aug 2026</td>

                      <td>18 Aug 2026</td>

                    </tr>


                    <tr>

                      <td>
                        <div className="room-cell">

                          <div className="room-small-icon">
                            <FaBed />
                          </div>

                          <div>
                            <strong>309 - Suite Room</strong>
                            <span>3 Guests</span>
                          </div>

                        </div>
                      </td>

                      <td>22 Jul 2026</td>

                      <td>25 Jul 2026</td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>


            {/* ================= BOOKING STATUS ================= */}

            <div className="customer-dashboard-card booking-status-card">

              <div className="customer-card-header">

                <div>
                  <h2>Booking Status</h2>
                  <p>Overview of your reservations</p>
                </div>

              </div>


              <div className="booking-status-list">

                {/* Upcoming */}

                <div className="booking-status-item">

                  <div className="booking-status-icon upcoming">
                    <FaClock />
                  </div>

                  <div className="booking-status-info">
                    <strong>2</strong>
                    <span>Upcoming</span>
                  </div>

                  <FaArrowRight className="status-arrow" />

                </div>


                {/* Confirmed */}

                <div className="booking-status-item">

                  <div className="booking-status-icon confirmed">
                    <FaCheckCircle />
                  </div>

                  <div className="booking-status-info">
                    <strong>2</strong>
                    <span>Confirmed</span>
                  </div>

                  <FaArrowRight className="status-arrow" />

                </div>


                {/* Cancelled */}

                <div className="booking-status-item">

                  <div className="booking-status-icon cancelled">
                    <FaCheckCircle />
                  </div>

                  <div className="booking-status-info">
                    <strong>1</strong>
                    <span>Cancelled</span>
                  </div>

                  <FaArrowRight className="status-arrow" />

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default CustomerDashboard;