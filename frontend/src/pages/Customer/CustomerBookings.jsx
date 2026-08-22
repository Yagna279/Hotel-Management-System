import React, {
  useEffect,
  useState,
} from "react";

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

  const [customer, setCustomer] =
    useState(null);


  const [bookings, setBookings] =
    useState([]);


  const [statistics, setStatistics] =
    useState({

      totalBookings: 0,

      upcoming: 0,

      checkedOut: 0,

      cancelled: 0,

    });


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [filter, setFilter] =
    useState("all");


  // =====================================================
  // GET CUSTOMER BOOKINGS
  // =====================================================

  useEffect(() => {

    const fetchCustomerBookings =
      async () => {

        try {

          // =============================================
          // GET USER FROM LOCAL STORAGE
          // =============================================

          const storedUser =
            localStorage.getItem("user");


          if (!storedUser) {

            setError(
              "Customer login information not found."
            );

            setLoading(false);

            return;

          }


          // =============================================
          // PARSE USER
          // =============================================

          let user;


          try {

            user =
              JSON.parse(
                storedUser
              );

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


          // =============================================
          // GET CUSTOMER ID
          // =============================================

          const customerId =
            user?.id;


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


          // =============================================
          // API REQUEST
          // =============================================

          const response =
            await fetch(
              `http://localhost:5000/api/customer-bookings/${customerId}`
            );


          const data =
            await response.json();


          console.log(
            "Customer bookings response:",
            data
          );


          // =============================================
          // CHECK API RESPONSE
          // =============================================

          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load bookings."
            );

          }


          // =============================================
          // SAVE CUSTOMER
          // =============================================

          setCustomer(
            data.customer
          );


          // =============================================
          // SAVE BOOKINGS
          // =============================================

          setBookings(
            data.bookings || []
          );


          // =============================================
          // SAVE STATISTICS
          // =============================================

          setStatistics(
            data.statistics || {

              totalBookings: 0,

              upcoming: 0,

              checkedOut: 0,

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
  // CHECK WHETHER BOOKING CAN BE CANCELLED
  // =====================================================

  const canCancelBooking = (
    booking
  ) => {

    // ===============================================
    // GET STATUS
    // ===============================================

    const status =
      String(
        booking.booking_status || ""
      ).trim().toLowerCase();


    // ===============================================
    // ALREADY CANCELLED
    // ===============================================

    if (
      status === "cancelled"
    ) {

      return false;

    }


    // ===============================================
    // ALREADY CHECKED OUT
    // ===============================================

    if (
      status === "checked_out"
    ) {

      return false;

    }


    // ===============================================
    // CHECKOUT DATE REQUIRED
    // ===============================================

    if (
      !booking.check_out
    ) {

      return false;

    }


    // ===============================================
    // TODAY
    // ===============================================

    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    // ===============================================
    // CHECKOUT DATE
    // ===============================================

    const checkoutDate =
      new Date(
        booking.check_out
      );


    checkoutDate.setHours(
      0,
      0,
      0,
      0
    );


    // ===============================================
    // CUSTOMER CAN CANCEL ONLY
    // BEFORE CHECKOUT DATE
    // ===============================================

    return (
      today < checkoutDate
    );

  };


  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings =
    bookings.filter(
      (booking) => {

        const status =
          String(
            booking.booking_status || ""
          ).trim().toLowerCase();


        // =============================================
        // ALL BOOKINGS
        // =============================================

        if (
          filter === "all"
        ) {

          return true;

        }


        // =============================================
        // UPCOMING
        // =============================================

        if (
          filter === "upcoming"
        ) {

          // Cancelled cannot be upcoming

          if (
            status === "cancelled"
          ) {

            return false;

          }


          // Checked out cannot be upcoming

          if (
            status === "checked_out"
          ) {

            return false;

          }


          if (
            !booking.check_in
          ) {

            return false;

          }


          const checkInDate =
            new Date(
              booking.check_in
            );


          const today =
            new Date();


          today.setHours(
            0,
            0,
            0,
            0
          );


          checkInDate.setHours(
            0,
            0,
            0,
            0
          );


          return (
            checkInDate >= today
          );

        }


        // =============================================
        // CHECKED OUT
        // =============================================

        if (
          filter === "checked_out"
        ) {

          return (
            status === "checked_out"
          );

        }


        // =============================================
        // CANCELLED
        // =============================================

        if (
          filter === "cancelled"
        ) {

          return (
            status === "cancelled"
          );

        }


        return true;

      }
    );


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

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

  const formatCurrency = (
    amount
  ) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )}`;

  };


  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    const normalizedStatus =
      String(
        status || ""
      ).trim().toLowerCase();


    // ===============================================
    // CANCELLED
    // ===============================================

    if (
      normalizedStatus ===
      "cancelled"
    ) {

      return "cancelled";

    }


    // ===============================================
    // CHECKED OUT
    // ===============================================

    if (
      normalizedStatus ===
      "checked_out"
    ) {

      return "completed";

    }


    // ===============================================
    // CONFIRMED
    // ===============================================

    if (
      normalizedStatus ===
      "confirmed"
    ) {

      return "upcoming";

    }


    return "confirmed";

  };


  // =====================================================
  // GET DISPLAY STATUS
  // =====================================================

  const getDisplayStatus = (
    booking
  ) => {

    const status =
      String(
        booking.booking_status || ""
      ).trim().toLowerCase();


    // ===============================================
    // CHECKED OUT
    // ===============================================

    if (
      status ===
      "checked_out"
    ) {

      return "Checked Out";

    }


    // ===============================================
    // CANCELLED
    // ===============================================

    if (
      status ===
      "cancelled"
    ) {

      return "Cancelled";

    }


    // ===============================================
    // CONFIRMED
    // ===============================================

    if (
      status ===
      "confirmed"
    ) {

      return "Confirmed";

    }


    return "Confirmed";

  };


  // =====================================================
  // OPEN BOOKING DETAILS
  // =====================================================

  const handleViewBooking = (
    booking
  ) => {

    navigate(
      `/customer/bookings/${booking.id}`
    );

  };


  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancelBooking = (
    booking
  ) => {

    // ===============================================
    // SAFETY CHECK
    // ===============================================

    if (
      !canCancelBooking(
        booking
      )
    ) {

      alert(
        "This reservation can no longer be cancelled."
      );

      return;

    }


    // ===============================================
    // OPEN DETAILS PAGE
    //
    // The actual cancellation and refund will
    // happen from CustomerBookingDetails.jsx
    // ===============================================

    navigate(
      `/customer/bookings/${booking.id}?cancel=true`
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="customer-bookings-layout"
      >

        <CustomerSidebar />


        <div
          className="customer-main"
        >

          <CustomerTopbar />


          <main
            className="customer-bookings-content"
          >

            <div
              className="customer-message"
            >

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

    <div
      className="customer-bookings-layout"
    >


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <div
        className="customer-main"
      >


        {/* =================================================
            TOPBAR
        ================================================= */}

        <CustomerTopbar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main
          className="customer-bookings-content"
        >


          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="customer-bookings-header"
          >


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
                BOOK A ROOM
            ================================================= */}

            <button
              className="customer-new-booking-btn"
              type="button"
              onClick={() =>
                navigate(
                  "/customer/rooms"
                )
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

            <div
              className="customer-message error"
            >

              {error}

            </div>

          )}


          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <div
            className="customer-booking-summary"
          >


            {/* =================================================
                TOTAL BOOKINGS
            ================================================= */}

            <div
              className="customer-booking-summary-card"
            >

              <div
                className="customer-booking-summary-icon blue"
              >

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

            <div
              className="customer-booking-summary-card"
            >

              <div
                className="customer-booking-summary-icon orange"
              >

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
                CHECKED OUT
            ================================================= */}

            <div
              className="customer-booking-summary-card"
            >

              <div
                className="customer-booking-summary-icon green"
              >

                <FaCheckCircle />

              </div>


              <div>

                <span>
                  Checked Out
                </span>


                <strong>

                  {
                    bookings.filter(
                      (booking) =>
                        String(
                          booking.booking_status ||
                          ""
                        ).trim().toLowerCase() ===
                        "checked_out"
                    ).length
                  }

                </strong>

              </div>

            </div>


            {/* =================================================
                CANCELLED
            ================================================= */}

            <div
              className="customer-booking-summary-card"
            >

              <div
                className="customer-booking-summary-icon red"
              >

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

          <div
            className="customer-bookings-card"
          >


            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="customer-bookings-card-header"
            >


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
                  setFilter(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Bookings
                </option>


                <option value="upcoming">
                  Upcoming
                </option>


                <option value="checked_out">
                  Checked Out
                </option>


                <option value="cancelled">
                  Cancelled
                </option>

              </select>


            </div>


            {/* =================================================
                BOOKING LIST
            ================================================= */}

            <div
              className="customer-booking-list"
            >


              {/* =================================================
                  NO BOOKINGS
              ================================================= */}

              {filteredBookings.length === 0 && (

                <div
                  className="customer-message"
                >

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
                (booking) => {

                  const canCancel =
                    canCancelBooking(
                      booking
                    );


                  return (

                    <div
                      className="customer-booking-item"
                      key={
                        booking.id
                      }
                    >


                      {/* =================================================
                          ROOM
                      ================================================= */}

                      <div
                        className="customer-booking-room"
                      >

                        <div
                          className="customer-booking-room-icon"
                        >

                          <FaBed />

                        </div>


                        <div>

                          <h3>

                            {
                              booking.room_type ||
                              "Room"
                            }

                          </h3>


                          <span>

                            Room{" "}

                            {
                              booking.room_number ||
                              "-"
                            }

                          </span>

                        </div>

                      </div>


                      {/* =================================================
                          CHECK IN
                      ================================================= */}

                      <div
                        className="customer-booking-info"
                      >

                        <span>

                          <FaCalendarAlt />

                          Check In

                        </span>


                        <strong>

                          {
                            formatDate(
                              booking.check_in
                            )
                          }

                        </strong>

                      </div>


                      {/* =================================================
                          CHECK OUT
                      ================================================= */}

                      <div
                        className="customer-booking-info"
                      >

                        <span>

                          <FaCalendarAlt />

                          Check Out

                        </span>


                        <strong>

                          {
                            formatDate(
                              booking.check_out
                            )
                          }

                        </strong>

                      </div>


                      {/* =================================================
                          GUESTS
                      ================================================= */}

                      <div
                        className="customer-booking-info"
                      >

                        <span>

                          <FaUsers />

                          Guests

                        </span>


                        <strong>

                          {
                            (
                              Number(
                                booking.adults
                              ) || 0
                            ) +
                            (
                              Number(
                                booking.children
                              ) || 0
                            )
                          }{" "}

                          Guests

                        </strong>

                      </div>


                      {/* =================================================
                          PRICE
                      ================================================= */}

                      <div
                        className="customer-booking-price"
                      >

                        <span>
                          Total
                        </span>


                        <strong>

                          {
                            formatCurrency(
                              booking.total_amount
                            )
                          }

                        </strong>

                      </div>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <div>

                        <span
                          className={
                            `customer-booking-status ${getStatusClass(
                              booking.booking_status
                            )}`
                          }
                        >

                          {
                            getDisplayStatus(
                              booking
                            )
                          }

                        </span>

                      </div>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <div
                        className="customer-booking-actions"
                      >


                        {/* =================================================
                            VIEW
                        ================================================= */}

                        <button
                          type="button"
                          className="customer-booking-action"
                          onClick={() =>
                            handleViewBooking(
                              booking
                            )
                          }
                        >

                          <FaEye />

                          View

                        </button>


                        {/* =================================================
                            CANCEL
                        ================================================= */}

                        </div>


                    </div>

                  );

                }
              )}


            </div>


          </div>


        </main>


      </div>


    </div>

  );

}


export default CustomerBookings;