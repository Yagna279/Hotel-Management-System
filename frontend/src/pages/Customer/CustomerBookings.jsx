import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import "./CustomerBookings.css";

function CustomerBookings() {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [customer, setCustomer] = useState(null);

  const [bookings, setBookings] = useState([]);

  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");

  // =====================================================
  // GET LOGGED-IN CUSTOMER AND BOOKINGS
  // =====================================================

  useEffect(() => {

    const fetchCustomerBookings = async () => {

      try {

        // ===============================================
        // GET USER FROM LOCAL STORAGE
        // ===============================================

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {

          setError(
            "Customer login information not found."
          );

          setLoading(false);

          return;
        }

        let user;

        try {

          user = JSON.parse(storedUser);

        } catch (parseError) {

          console.error(
            "Invalid customer data:",
            parseError
          );

          setError(
            "Invalid customer login information."
          );

          setLoading(false);

          return;
        }

        console.log(
          "Logged-in customer:",
          user
        );

        // ===============================================
        // GET CUSTOMER ID
        // ===============================================

        const customerId = user?.id;

        if (!customerId) {

          setError(
            "Customer ID not found."
          );

          setLoading(false);

          return;
        }

        console.log(
          "Customer ID:",
          customerId
        );

        // ===============================================
        // API REQUEST
        // ===============================================

        const response = await fetch(
          `http://localhost:5000/api/customer-bookings/${customerId}`
        );

        const data =
          await response.json();

        console.log(
          "Customer bookings response:",
          data
        );

        // ===============================================
        // API ERROR
        // ===============================================

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load bookings."
          );

        }

        // ===============================================
        // SAVE DATABASE DATA
        // ===============================================

        setCustomer(
          data.customer
        );

        setBookings(
          data.bookings || []
        );

        setStatistics(
          data.statistics || {
            totalBookings: 0,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
          }
        );

      } catch (error) {

        console.error(
          "Customer bookings error:",
          error
        );

        setError(
          error.message ||
          "Unable to load bookings."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCustomerBookings();

  }, []);

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings =
    bookings.filter((booking) => {

      const status =
        String(
          booking.booking_status || ""
        ).toLowerCase();

      // ===============================================
      // ALL
      // ===============================================

      if (filter === "all") {

        return true;

      }

      // ===============================================
      // UPCOMING
      // ===============================================

      if (filter === "upcoming") {

        return (
          booking.check_in &&
          new Date(booking.check_in) >=
            new Date() &&
          status !== "cancelled"
        );

      }

      // ===============================================
      // COMPLETED
      // ===============================================

      if (filter === "completed") {

        return status === "completed";

      }

      // ===============================================
      // CANCELLED
      // ===============================================

      if (filter === "cancelled") {

        return status === "cancelled";

      }

      return true;

    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };

  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    const normalizedStatus =
      String(
        status || ""
      ).toLowerCase();

    if (
      normalizedStatus ===
      "cancelled"
    ) {

      return "cancelled";

    }

    if (
      normalizedStatus ===
      "completed"
    ) {

      return "completed";

    }

    if (
      normalizedStatus ===
      "upcoming"
    ) {

      return "upcoming";

    }

    return "confirmed";

  };

  // =====================================================
  // GET DISPLAY STATUS
  // =====================================================

  const getDisplayStatus = (booking) => {

    const status =
      String(
        booking.booking_status || ""
      ).toLowerCase();

    if (status) {

      return (
        status.charAt(0).toUpperCase() +
        status.slice(1)
      );

    }

    return "Confirmed";

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="customer-bookings-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-bookings-content">

            <div className="customer-message">

              Loading your bookings...

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // MAIN JSX
  // =====================================================

  return (

    <div className="customer-bookings-layout">

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
            CONTENT
        ================================================= */}

        <main className="customer-bookings-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="customer-bookings-header">

            <div>

              <h1>
                My Bookings
              </h1>

              <p>

                {customer?.full_name

                  ? `View and manage your hotel reservations, ${customer.full_name}`

                  : "View and manage all your hotel reservations"}

              </p>

            </div>


            {/* =================================================
                BOOK A ROOM BUTTON
            ================================================= */}

            <button
              className="customer-new-booking-btn"
              type="button"
              onClick={() =>
                navigate("/customer/rooms")
              }
            >

              <FaBed />

              Book a Room

            </button>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}


          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <div className="customer-booking-summary">

            {/* =================================================
                TOTAL BOOKINGS
            ================================================= */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon blue">

                <FaCalendarAlt />

              </div>

              <div>

                <span>
                  Total Bookings
                </span>

                <strong>
                  {statistics.totalBookings || 0}
                </strong>

              </div>

            </div>


            {/* =================================================
                UPCOMING
            ================================================= */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon orange">

                <FaClock />

              </div>

              <div>

                <span>
                  Upcoming
                </span>

                <strong>
                  {statistics.upcoming || 0}
                </strong>

              </div>

            </div>


            {/* =================================================
                COMPLETED
            ================================================= */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon green">

                <FaCheckCircle />

              </div>

              <div>

                <span>
                  Completed
                </span>

                <strong>
                  {statistics.completed || 0}
                </strong>

              </div>

            </div>


            {/* =================================================
                CANCELLED
            ================================================= */}

            <div className="customer-booking-summary-card">

              <div className="customer-booking-summary-icon red">

                <FaTimes />

              </div>

              <div>

                <span>
                  Cancelled
                </span>

                <strong>
                  {statistics.cancelled || 0}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              BOOKINGS CARD
          ================================================= */}

          <div className="customer-bookings-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="customer-bookings-card-header">

              <div>

                <h2>
                  All Reservations
                </h2>

                <p>
                  Your recent and previous hotel bookings
                </p>

              </div>


              {/* =================================================
                  FILTER
              ================================================= */}

              <select
                className="customer-booking-filter"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
              >

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
                  NO BOOKINGS
              ================================================= */}

              {filteredBookings.length === 0 && (

                <div className="customer-message">

                  <FaBed
                    style={{
                      fontSize: "40px",
                      marginBottom: "15px",
                    }}
                  />

                  <p>

                    {bookings.length === 0

                      ? "You don't have any bookings yet."

                      : "No bookings found for this filter."}

                  </p>

                </div>

              )}


              {/* =================================================
                  BOOKINGS
              ================================================= */}

              {filteredBookings.map(
                (booking) => (

                  <div
                    className="customer-booking-item"
                    key={booking.id}
                  >

                    {/* =================================================
                        ROOM
                    ================================================= */}

                    <div className="customer-booking-room">

                      <div className="customer-booking-room-icon">

                        <FaBed />

                      </div>

                      <div>

                        <h3>

                          {booking.room_type ||
                            "Room"}

                        </h3>

                        <span>

                          Room{" "}

                          {booking.room_number ||
                            "-"}

                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        CHECK IN
                    ================================================= */}

                    <div className="customer-booking-info">

                      <span>

                        <FaCalendarAlt />

                        Check In

                      </span>

                      <strong>

                        {formatDate(
                          booking.check_in
                        )}

                      </strong>

                    </div>


                    {/* =================================================
                        CHECK OUT
                    ================================================= */}

                    <div className="customer-booking-info">

                      <span>

                        <FaCalendarAlt />

                        Check Out

                      </span>

                      <strong>

                        {formatDate(
                          booking.check_out
                        )}

                      </strong>

                    </div>


                    {/* =================================================
                        GUESTS
                    ================================================= */}

                    <div className="customer-booking-info">

                      <span>

                        <FaUsers />

                        Guests

                      </span>

                      <strong>

                        {(
                          Number(
                            booking.adults
                          ) || 0
                        ) +
                          (
                            Number(
                              booking.children
                            ) || 0
                          )}{" "}

                        Guests

                      </strong>

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <div className="customer-booking-price">

                      <span>
                        Total
                      </span>

                      <strong>

                        {formatCurrency(
                          booking.total_amount
                        )}

                      </strong>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div>

                      <span
                        className={`customer-booking-status ${getStatusClass(
                          booking.booking_status
                        )}`}
                      >

                        {getDisplayStatus(
                          booking
                        )}

                      </span>

                    </div>


                    {/* =================================================
                        VIEW
                    ================================================= */}

                    <button
  type="button"
  className="customer-booking-action"
  onClick={() =>
    navigate(
      `/customer/confirm-payment/${booking.id}`
    )
  }
>
  <FaEye />
  View
</button>

                  </div>

                )
              )}

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default CustomerBookings;