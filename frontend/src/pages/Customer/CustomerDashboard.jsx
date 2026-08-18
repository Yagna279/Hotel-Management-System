import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [user, setUser] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // BOOK ROOM
  // =====================================================

  const handleBookRoom = () => {
    navigate("/customer/rooms");
  };

  // =====================================================
  // LOAD CUSTOMER DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        // =================================================
        // GET LOGGED-IN USER
        // =================================================

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {

          setError(
            "Customer login information not found."
          );

          setLoading(false);

          return;
        }

        // =================================================
        // PARSE USER
        // =================================================

        let loggedInUser;

        try {

          loggedInUser =
            JSON.parse(storedUser);

        } catch (parseError) {

          console.error(
            "Invalid user data:",
            parseError
          );

          setError(
            "Invalid customer login information."
          );

          setLoading(false);

          return;
        }

        console.log(
          "Logged-in user:",
          loggedInUser
        );

        // =================================================
        // CUSTOMER ID
        // =================================================

        const customerId =
          loggedInUser?.id;

        if (!customerId) {

          console.error(
            "Customer ID missing:",
            loggedInUser
          );

          setError(
            "Customer ID not found."
          );

          setLoading(false);

          return;
        }

        // =================================================
        // SAVE USER
        // =================================================

        setUser(loggedInUser);

        // =================================================
        // FETCH DASHBOARD FROM DATABASE
        // =================================================

        const response = await fetch(
          `http://localhost:5000/api/customer-dashboard/${customerId}`
        );

        const data =
          await response.json();

        console.log(
          "Customer Dashboard API:",
          data
        );

        // =================================================
        // API ERROR
        // =================================================

        if (!response.ok) {

          setError(
            data.message ||
            "Failed to load customer dashboard."
          );

          setLoading(false);

          return;
        }

        // =================================================
        // SAVE DATABASE DATA
        // =================================================

        setDashboardData(data);

        setLoading(false);

      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          "Unable to connect to the server."
        );

        setLoading(false);
      }
    };

    loadDashboard();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="customer-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-dashboard">

            <div className="customer-message">

              Loading your dashboard...

            </div>

          </main>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="customer-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-dashboard">

            <div className="customer-message error">

              {error}

            </div>

          </main>

        </div>

      </div>
    );
  }

  // =====================================================
  // DATABASE CUSTOMER
  // =====================================================

  const customer =
    dashboardData?.customer || user;

  // =====================================================
  // DATABASE STATISTICS
  // =====================================================

  const statistics =
    dashboardData?.statistics || {};

  // =====================================================
  // DATABASE BOOKINGS
  // =====================================================

  const recentBookings =
    dashboardData?.recentBookings || [];

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  const customerName =
    customer?.full_name || "Guest";

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (amount) => {

    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;

  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const formattedDate =
      new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {

      return date;

    }

    return formattedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  // =====================================================
  // TOTAL GUESTS
  // =====================================================

  const getGuestCount = (booking) => {

    const adults =
      Number(booking?.adults || 0);

    const children =
      Number(booking?.children || 0);

    const total =
      adults + children;

    return total > 0
      ? `${total} Guests`
      : "Guests";
  };

  // =====================================================
  // VIEW ALL BOOKINGS
  // =====================================================

  const handleViewAllBookings = () => {

    navigate("/customer/bookings");

  };

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="customer-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="customer-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <CustomerTopbar />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <main className="customer-dashboard">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="customer-dashboard-header">

            <div>

              <h1>
                Dashboard
              </h1>

              <p>
                Welcome back, {customerName}
              </p>

            </div>


            {/* =================================================
                BOOK ROOM BUTTON
            ================================================= */}

            <button
              type="button"
              className="book-room-btn"
              onClick={handleBookRoom}
            >

              <FaBed />

              Book a Room

            </button>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="customer-stats-grid">


            {/* =================================================
                TOTAL BOOKINGS
            ================================================= */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon blue">

                <FaCalendarCheck />

              </div>

              <div className="customer-stat-info">

                <span>
                  Total Bookings
                </span>

                <strong>
                  {statistics.totalBookings || 0}
                </strong>

                <small>
                  All reservations
                </small>

              </div>

            </div>


            {/* =================================================
                UPCOMING
            ================================================= */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon orange">

                <FaClock />

              </div>

              <div className="customer-stat-info">

                <span>
                  Upcoming
                </span>

                <strong>
                  {statistics.upcoming || 0}
                </strong>

                <small>
                  Reservations
                </small>

              </div>

            </div>


            {/* =================================================
                COMPLETED
            ================================================= */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon green">

                <FaCheckCircle />

              </div>

              <div className="customer-stat-info">

                <span>
                  Completed
                </span>

                <strong>
                  {statistics.completed || 0}
                </strong>

                <small>
                  Completed stays
                </small>

              </div>

            </div>


            {/* =================================================
                TOTAL SPENT
            ================================================= */}

            <div className="customer-stat-card">

              <div className="customer-stat-icon purple">

                <FaMoneyBillWave />

              </div>

              <div className="customer-stat-info">

                <span>
                  Total Spent
                </span>

                <strong>
                  {formatMoney(
                    statistics.totalSpent
                  )}
                </strong>

                <small>
                  Overall payments
                </small>

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM AREA
          ================================================= */}

          <div className="customer-dashboard-grid">


            {/* =================================================
                RECENT BOOKINGS
            ================================================= */}

            <div className="customer-dashboard-card">


              {/* =================================================
                  CARD HEADER
              ================================================= */}

              <div className="customer-card-header">

                <div>

                  <h2>
                    My Recent Bookings
                  </h2>

                  <p>
                    Your latest hotel reservations
                  </p>

                </div>


                {/* =================================================
                    VIEW ALL
                ================================================= */}

                <button
                  type="button"
                  className="view-all-btn"
                  onClick={
                    handleViewAllBookings
                  }
                >

                  View All

                  <FaArrowRight />

                </button>

              </div>


              {/* =================================================
                  BOOKING TABLE
              ================================================= */}

              <div className="booking-table-wrapper">

                <table className="customer-booking-table">


                  {/* =================================================
                      TABLE HEADER
                  ================================================= */}

                  <thead>

                    <tr>

                      <th>
                        Room
                      </th>

                      <th>
                        Check In
                      </th>

                      <th>
                        Check Out
                      </th>

                    </tr>

                  </thead>


                  {/* =================================================
                      TABLE BODY
                  ================================================= */}

                  <tbody>

                    {recentBookings.length === 0 ? (

                      <tr>

                        <td
                          colSpan="3"
                          className="no-bookings"
                        >

                          No bookings found.

                        </td>

                      </tr>

                    ) : (

                      recentBookings.map(
                        (booking) => (

                          <tr
                            key={booking.id}
                          >

                            {/* ROOM */}

                            <td>

                              <div className="room-cell">

                                <div className="room-small-icon">

                                  <FaBed />

                                </div>


                                <div>

                                  <strong>

                                    {booking.room_number}
                                    {" - "}
                                    {booking.room_type}

                                  </strong>

                                  <span>

                                    {getGuestCount(
                                      booking
                                    )}

                                  </span>

                                </div>

                              </div>

                            </td>


                            {/* CHECK IN */}

                            <td>

                              {formatDate(
                                booking.check_in
                              )}

                            </td>


                            {/* CHECK OUT */}

                            <td>

                              {formatDate(
                                booking.check_out
                              )}

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                BOOKING STATUS
            ================================================= */}

            <div className="customer-dashboard-card booking-status-card">


              {/* =================================================
                  STATUS HEADER
              ================================================= */}

              <div className="customer-card-header">

                <div>

                  <h2>
                    Booking Status
                  </h2>

                  <p>
                    Overview of your reservations
                  </p>

                </div>

              </div>


              {/* =================================================
                  STATUS LIST
              ================================================= */}

              <div className="booking-status-list">


                {/* =================================================
                    UPCOMING
                ================================================= */}

                <div className="booking-status-item">

                  <div className="booking-status-icon upcoming">

                    <FaClock />

                  </div>


                  <div className="booking-status-info">

                    <strong>
                      {statistics.upcoming || 0}
                    </strong>

                    <span>
                      Upcoming
                    </span>

                  </div>


                  <FaArrowRight
                    className="status-arrow"
                  />

                </div>


                {/* =================================================
                    CONFIRMED
                ================================================= */}

                <div className="booking-status-item">

                  <div className="booking-status-icon confirmed">

                    <FaCheckCircle />

                  </div>


                  <div className="booking-status-info">

                    <strong>
                      {statistics.confirmed || 0}
                    </strong>

                    <span>
                      Confirmed
                    </span>

                  </div>


                  <FaArrowRight
                    className="status-arrow"
                  />

                </div>


                {/* =================================================
                    CANCELLED
                ================================================= */}

                <div className="booking-status-item">

                  <div className="booking-status-icon cancelled">

                    <FaCheckCircle />

                  </div>


                  <div className="booking-status-info">

                    <strong>
                      {statistics.cancelled || 0}
                    </strong>

                    <span>
                      Cancelled
                    </span>

                  </div>


                  <FaArrowRight
                    className="status-arrow"
                  />

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