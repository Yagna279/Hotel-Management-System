import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaConciergeBell,
  FaReceipt,
  FaTimes,
} from "react-icons/fa";

import "./CustomerBookingDetails.css";

// =====================================================
// CUSTOMER BOOKING DETAILS
// =====================================================

function CustomerBookingDetails() {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  const { bookingId } = useParams();

  // =====================================================
  // STATE
  // =====================================================

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);

  const [cancelMessage, setCancelMessage] = useState("");

  const [refundMessage, setRefundMessage] = useState("");

  // =====================================================
  // GET CUSTOMER ID
  // =====================================================

  const getCustomerId = () => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      throw new Error(
        "Customer login information not found."
      );

    }

    let user;

    try {

      user = JSON.parse(storedUser);

    } catch (error) {

      throw new Error(
        "Invalid customer login information."
      );

    }

    const customerId = user?.id;

    if (!customerId) {

      throw new Error(
        "Customer ID not found."
      );

    }

    return customerId;

  };

  // =====================================================
  // GET BOOKING DETAILS
  // =====================================================

  useEffect(() => {

    const fetchBookingDetails = async () => {

      try {

        setLoading(true);

        setError("");

        setCancelMessage("");

        setRefundMessage("");

        // =============================================
        // CHECK BOOKING ID
        // =============================================

        if (!bookingId) {

          throw new Error(
            "Booking ID not found."
          );

        }

        // =============================================
        // GET CUSTOMER ID
        // =============================================

        const customerId =
          getCustomerId();

        console.log(
          "Customer ID:",
          customerId
        );

        console.log(
          "Booking ID:",
          bookingId
        );

        // =============================================
        // API URL
        // =============================================

        const url =
          `http://localhost:5000/api/customer-bookings/${customerId}/${bookingId}`;

        console.log(
          "Fetching booking details:",
          url
        );

        // =============================================
        // API REQUEST
        // =============================================

        const response =
          await fetch(url);

        // =============================================
        // READ RESPONSE
        // =============================================

        let data;

        try {

          data =
            await response.json();

        } catch (jsonError) {

          throw new Error(
            "Server returned an invalid response."
          );

        }

        console.log(
          "Booking details response:",
          data
        );

        // =============================================
        // API ERROR
        // =============================================

        if (!response.ok) {

          throw new Error(
            data?.message ||
            "Failed to load booking details."
          );

        }

        // =============================================
        // CHECK BOOKING
        // =============================================

        if (!data?.booking) {

          throw new Error(
            "Booking details were not found."
          );

        }

        // =============================================
        // SAVE BOOKING
        // =============================================

        setBooking(
          data.booking
        );

      } catch (error) {

        console.error(
          "Booking details error:",
          error
        );

        setError(
          error.message ||
          "Unable to load booking details."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchBookingDetails();

  }, [bookingId]);

  // =====================================================
  // FORMAT DATE
  // PostgreSQL DATE = YYYY-MM-DD
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }

    // =============================================
    // HANDLE YYYY-MM-DD WITHOUT TIMEZONE SHIFT
    // =============================================

    const dateString =
      String(date).split("T")[0];

    const parts =
      dateString.split("-");

    if (parts.length === 3) {

      const year =
        Number(parts[0]);

      const month =
        Number(parts[1]);

      const day =
        Number(parts[2]);

      const localDate =
        new Date(
          year,
          month - 1,
          day
        );

      if (
        !Number.isNaN(
          localDate.getTime()
        )
      ) {

        return localDate.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      }

    }

    return date;

  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )}`;

  };

  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const getStatus = () => {

    return String(
      booking?.booking_status ||
      "confirmed"
    )
      .trim()
      .toLowerCase();

  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = () => {

    const status =
      getStatus();

    // =============================================
    // CANCELLED
    // =============================================

    if (
      status === "cancelled"
    ) {

      return "Cancelled";

    }

    // =============================================
    // CHECKED IN
    // =============================================

    if (
      status === "checked_in" ||
      status === "checked-in"
    ) {

      return "Checked In";

    }

    // =============================================
    // CHECKED OUT
    // =============================================

    if (
      status === "checked_out" ||
      status === "checked-out"
    ) {

      return "Completed";

    }

    // =============================================
    // CONFIRMED
    // =============================================

    if (
      status === "confirmed"
    ) {

      return "Confirmed";

    }

    return "Confirmed";

  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = () => {

    const status =
      getStatus();

    // =============================================
    // CANCELLED
    // =============================================

    if (
      status === "cancelled"
    ) {

      return "cancelled";

    }

    // =============================================
    // CHECKED IN
    // =============================================

    if (
      status === "checked_in" ||
      status === "checked-in"
    ) {

      return "checked-in";

    }

    // =============================================
    // CHECKED OUT
    // =============================================

    if (
      status === "checked_out" ||
      status === "checked-out"
    ) {

      return "checked-out";

    }

    return "confirmed";

  };

  // =====================================================
  // CALCULATE NIGHTS
  // =====================================================

  const calculateNights = () => {

    if (
      !booking?.check_in ||
      !booking?.check_out
    ) {

      return 0;

    }

    const checkInString =
      String(
        booking.check_in
      ).split("T")[0];

    const checkOutString =
      String(
        booking.check_out
      ).split("T")[0];

    const checkInParts =
      checkInString.split("-");

    const checkOutParts =
      checkOutString.split("-");

    if (
      checkInParts.length !== 3 ||
      checkOutParts.length !== 3
    ) {

      return 0;

    }

    const checkIn =
      new Date(
        Number(checkInParts[0]),
        Number(checkInParts[1]) - 1,
        Number(checkInParts[2])
      );

    const checkOut =
      new Date(
        Number(checkOutParts[0]),
        Number(checkOutParts[1]) - 1,
        Number(checkOutParts[2])
      );

    const difference =
      checkOut.getTime() -
      checkIn.getTime();

    const nights =
      Math.round(
        difference /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

    return nights > 0
      ? nights
      : 0;

  };

  // =====================================================
  // PARSE DATE WITHOUT TIMEZONE PROBLEM
  // =====================================================

  const parseDateOnly = (date) => {

    if (!date) {

      return null;

    }

    const dateString =
      String(date)
        .split("T")[0];

    const parts =
      dateString.split("-");

    if (
      parts.length !== 3
    ) {

      return null;

    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);

    const parsedDate =
      new Date(
        year,
        month - 1,
        day
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return null;

    }

    parsedDate.setHours(
      0,
      0,
      0,
      0
    );

    return parsedDate;

  };

  // =====================================================
  // CHECK WHETHER BOOKING CAN BE CANCELLED
  // =====================================================

  const canCancelBooking = () => {

    if (!booking) {

      return false;

    }

    const status =
      getStatus();

    // =============================================
    // CANCELLED
    // =============================================

    if (
      status === "cancelled"
    ) {

      return false;

    }

    // =============================================
    // CHECKED IN
    // =============================================

    if (
      status === "checked_in" ||
      status === "checked-in"
    ) {

      return false;

    }

    // =============================================
    // CHECKED OUT
    // =============================================

    if (
      status === "checked_out" ||
      status === "checked-out"
    ) {

      return false;

    }

    // =============================================
    // ONLY CONFIRMED CAN BE CANCELLED
    // =============================================

    if (
      status !== "confirmed"
    ) {

      return false;

    }

    // =============================================
    // CHECKOUT REQUIRED
    // =============================================

    if (
      !booking.check_out
    ) {

      return false;

    }

    // =============================================
    // TODAY
    // =============================================

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    // =============================================
    // CHECKOUT DATE
    // =============================================

    const checkoutDate =
      parseDateOnly(
        booking.check_out
      );

    if (!checkoutDate) {

      return false;

    }

    // =============================================
    // CAN CANCEL BEFORE CHECKOUT
    // =============================================

    return (
      today < checkoutDate
    );

  };

  // =====================================================
  // GET CANCELLATION MESSAGE
  // =====================================================

  const getCancellationMessage = () => {

    const status =
      getStatus();

    // =============================================
    // CHECKED IN
    // =============================================

    if (
      status === "checked_in" ||
      status === "checked-in"
    ) {

      return (
        "This reservation has already been checked in. " +
        "Cancellation is no longer available."
      );

    }

    // =============================================
    // CHECKED OUT
    // =============================================

    if (
      status === "checked_out" ||
      status === "checked-out"
    ) {

      return (
        "This reservation has been completed and checked out. " +
        "Cancellation is no longer available."
      );

    }

    // =============================================
    // CANCELLED
    // =============================================

    if (
      status === "cancelled"
    ) {

      return (
        "This reservation has already been cancelled."
      );

    }

    // =============================================
    // CONFIRMED BUT DATE PASSED
    // =============================================

    if (
      status === "confirmed" &&
      !canCancelBooking()
    ) {

      return (
        "This reservation can no longer be cancelled " +
        "because the checkout date has arrived."
      );

    }

    // =============================================
    // DEFAULT
    // =============================================

    return (
      "This reservation can no longer be cancelled."
    );

  };

  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancelBooking = async () => {

    // =============================================
    // SAFETY CHECK
    // =============================================

    if (
      !canCancelBooking()
    ) {

      alert(
        getCancellationMessage()
      );

      return;

    }

    // =============================================
    // CONFIRM
    // =============================================

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this reservation?"
      );

    if (!confirmed) {

      return;

    }

    try {

      setCancelling(true);

      setCancelMessage("");

      setRefundMessage("");

      // =============================================
      // GET CUSTOMER ID
      // =============================================

      const customerId =
        getCustomerId();

      // =============================================
      // API URL
      // =============================================

      const url =
        `http://localhost:5000/api/customer-bookings/${customerId}/${bookingId}/cancel`;

      console.log(
        "Cancelling booking:",
        url
      );

      // =============================================
      // CANCEL REQUEST
      // =============================================

      const response =
        await fetch(
          url,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      // =============================================
      // READ RESPONSE
      // =============================================

      let data;

      try {

        data =
          await response.json();

      } catch (jsonError) {

        throw new Error(
          "Server returned an invalid response."
        );

      }

      console.log(
        "Cancel booking response:",
        data
      );

      // =============================================
      // API ERROR
      // =============================================

      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Failed to cancel booking."
        );

      }

      // =============================================
      // UPDATE BOOKING
      // =============================================

      setBooking(
        (previousBooking) => {

          if (!previousBooking) {

            return previousBooking;

          }

          return {
            ...previousBooking,

            booking_status:
              "cancelled",

            payment_status:
              data?.payment_status ||
              previousBooking.payment_status ||
              "refund_pending",

          };

        }
      );

      // =============================================
      // SUCCESS MESSAGE
      // =============================================

      setCancelMessage(
        data?.message ||
        "Reservation cancelled successfully."
      );

      // =============================================
      // REFUND MESSAGE
      // =============================================

      setRefundMessage(
        data?.refund_message ||
        "Your refund will be processed according to the hotel's refund policy."
      );

    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );

      setCancelMessage(
        error.message ||
        "Unable to cancel the reservation."
      );

      setRefundMessage("");

    } finally {

      setCancelling(false);

    }

  };

  // =====================================================
  // LOADING PAGE
  // =====================================================

  if (loading) {

    return (

      <div
        className="customer-booking-details-layout"
      >

        <CustomerSidebar />

        <div
          className="customer-main"
        >

          <CustomerTopbar />

          <main
            className="customer-booking-details-content"
          >

            <div
              className="customer-message"
            >

              Loading booking details...

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // ERROR PAGE
  // =====================================================

  if (
    error ||
    !booking
  ) {

    return (

      <div
        className="customer-booking-details-layout"
      >

        <CustomerSidebar />

        <div
          className="customer-main"
        >

          <CustomerTopbar />

          <main
            className="customer-booking-details-content"
          >

            <div
              className="customer-details-error"
            >

              <FaTimesCircle />

              <h2>
                Unable to Load Booking
              </h2>

              <p>
                {error ||
                  "Booking details could not be found."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/customer/bookings"
                  )
                }
              >

                <FaArrowLeft />

                Back to Bookings

              </button>

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // VARIABLES
  // =====================================================

  const status =
    getStatus();

  const canCancel =
    canCancelBooking();

  const nights =
    calculateNights();

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div
      className="customer-booking-details-layout"
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
          className="customer-booking-details-content"
        >

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <button
            type="button"
            className="customer-details-back-btn"
            onClick={() =>
              navigate(
                "/customer/bookings"
              )
            }
          >

            <FaArrowLeft />

            Back to My Bookings

          </button>

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="customer-details-header"
          >

            <div>

              <p
                className="customer-details-label"
              >
                Reservation
              </p>

              <h1>
                Booking Details
              </h1>

              <p>
                Booking ID: #{booking.id}
              </p>

            </div>

            {/* STATUS */}

            <div
              className={
                `customer-details-status ${getStatusClass()}`
              }
            >

              {status === "cancelled" && (
                <FaTimesCircle />
              )}

              {(status === "checked_out" ||
                status === "checked-out") && (
                <FaCheckCircle />
              )}

              {(status === "checked_in" ||
                status === "checked-in") && (
                <FaCheckCircle />
              )}

              {status === "confirmed" && (
                <FaClock />
              )}

              {getStatusText()}

            </div>

          </div>

          {/* =================================================
              CANCEL SUCCESS / ERROR MESSAGE
          ================================================= */}

          {cancelMessage && (

            <div
              className={
                status === "cancelled"
                  ? "customer-details-alert success"
                  : "customer-details-alert error"
              }
            >

              {status === "cancelled" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}

              <div>

                <strong>
                  {cancelMessage}
                </strong>

                {refundMessage && (

                  <p>
                    {refundMessage}
                  </p>

                )}

              </div>

            </div>

          )}

          {/* =================================================
              DETAILS GRID
          ================================================= */}

          <div
            className="customer-details-grid"
          >

            {/* =================================================
                ROOM DETAILS
            ================================================= */}

            <div
              className="customer-details-card"
            >

              <div
                className="customer-details-card-header"
              >

                <div
                  className="customer-details-icon blue"
                >

                  <FaBed />

                </div>

                <div>

                  <h2>
                    Room Details
                  </h2>

                  <p>
                    Your reserved room
                  </p>

                </div>

              </div>

              <div
                className="customer-details-info"
              >

                <div>

                  <span>
                    Room Number
                  </span>

                  <strong>
                    {booking.room_number || "-"}
                  </strong>

                </div>

                <div>

                  <span>
                    Room Type
                  </span>

                  <strong>
                    {booking.room_type || "Room"}
                  </strong>

                </div>

                <div>

                  <span>
                    Price Per Night
                  </span>

                  <strong>
                    {formatCurrency(
                      booking.price_per_night
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                STAY DETAILS
            ================================================= */}

            <div
              className="customer-details-card"
            >

              <div
                className="customer-details-card-header"
              >

                <div
                  className="customer-details-icon orange"
                >

                  <FaCalendarAlt />

                </div>

                <div>

                  <h2>
                    Stay Details
                  </h2>

                  <p>
                    Your reservation dates
                  </p>

                </div>

              </div>

              <div
                className="customer-details-info"
              >

                <div>

                  <span>
                    Check In
                  </span>

                  <strong>
                    {formatDate(
                      booking.check_in
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Check Out
                  </span>

                  <strong>
                    {formatDate(
                      booking.check_out
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Number of Nights
                  </span>

                  <strong>

                    {nights}{" "}

                    {nights === 1
                      ? "Night"
                      : "Nights"}

                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                GUEST DETAILS
            ================================================= */}

            <div
              className="customer-details-card"
            >

              <div
                className="customer-details-card-header"
              >

                <div
                  className="customer-details-icon green"
                >

                  <FaUsers />

                </div>

                <div>

                  <h2>
                    Guest Details
                  </h2>

                  <p>
                    Guests staying in the room
                  </p>

                </div>

              </div>

              <div
                className="customer-details-info"
              >

                <div>

                  <span>
                    Adults
                  </span>

                  <strong>
                    {Number(
                      booking.adults
                    ) || 0}
                  </strong>

                </div>

                <div>

                  <span>
                    Children
                  </span>

                  <strong>
                    {Number(
                      booking.children
                    ) || 0}
                  </strong>

                </div>

                <div>

                  <span>
                    Total Guests
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
                    }

                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <div
              className="customer-details-card"
            >

              <div
                className="customer-details-card-header"
              >

                <div
                  className="customer-details-icon purple"
                >

                  <FaUsers />

                </div>

                <div>

                  <h2>
                    Customer Details
                  </h2>

                  <p>
                    Booking customer information
                  </p>

                </div>

              </div>

              <div
                className="customer-details-info"
              >

                <div>

                  <span>
                    Name
                  </span>

                  <strong>
                    {booking.customer_name ||
                      booking.full_name ||
                      "-"}
                  </strong>

                </div>

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {booking.customer_email ||
                      booking.email ||
                      "-"}
                  </strong>

                </div>

                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {booking.customer_phone ||
                      booking.phone ||
                      "-"}
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              PAYMENT DETAILS
          ================================================= */}

          <div
            className="customer-details-card full-width"
          >

            <div
              className="customer-details-card-header"
            >

              <div
                className="customer-details-icon blue"
              >

                <FaCreditCard />

              </div>

              <div>

                <h2>
                  Payment Details
                </h2>

                <p>
                  Payment information for this reservation
                </p>

              </div>

            </div>

            <div
              className="customer-payment-details"
            >

              <div>

                <span>
                  Total Booking Amount
                </span>

                <strong
                  className="customer-total-amount"
                >

                  {formatCurrency(
                    booking.total_amount
                  )}

                </strong>

              </div>

              <div>

                <span>
                  Payment Status
                </span>

                <strong>

                  {booking.payment_status
                    ? String(
                        booking.payment_status
                      )
                        .replace(
                          /_/g,
                          " "
                        )
                        .replace(
                          /^\w/,
                          (character) =>
                            character.toUpperCase()
                        )
                    : "Pending"}

                </strong>

              </div>

              <div>

                <span>
                  Payment Method
                </span>

                <strong>

                  {booking.payment_method ||
                    "Pending"}

                </strong>

              </div>

            </div>

          </div>

          {/* =================================================
              SELECTED SERVICES
          ================================================= */}

          <div
            className="customer-details-card full-width"
          >

            <div
              className="customer-details-card-header"
            >

              <div
                className="customer-details-icon orange"
              >

                <FaConciergeBell />

              </div>

              <div>

                <h2>
                  Selected Services
                </h2>

                <p>
                  Services selected for this booking
                </p>

              </div>

            </div>

            {booking.services &&
            booking.services.length > 0 ? (

              <div
                className="customer-services-list"
              >

                {booking.services.map(
                  (service, index) => {

                    const quantity =
                      Number(
                        service.quantity
                      ) || 1;

                    const price =
                      Number(
                        service.price
                      ) || 0;

                    const serviceTotal =
                      price * quantity;

                    return (

                      <div
                        className="customer-service-item"
                        key={
                          service.id ||
                          service.service_id ||
                          index
                        }
                      >

                        <div>

                          <h3>

                            {service.service_name ||
                              "Service"}

                          </h3>

                          {service.category && (

                            <span>
                              {service.category}
                            </span>

                          )}

                        </div>

                        <div>

                          <span>
                            Quantity: {quantity}
                          </span>

                          <strong>

                            {formatCurrency(
                              serviceTotal
                            )}

                          </strong>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            ) : (

              <div
                className="customer-no-services"
              >

                <FaConciergeBell />

                <p>
                  No additional services were selected for this booking.
                </p>

              </div>

            )}

          </div>

          {/* =================================================
              SPECIAL REQUEST
          ================================================= */}

          <div
            className="customer-details-card full-width"
          >

            <div
              className="customer-details-card-header"
            >

              <div
                className="customer-details-icon green"
              >

                <FaReceipt />

              </div>

              <div>

                <h2>
                  Special Request
                </h2>

                <p>
                  Additional request provided during booking
                </p>

              </div>

            </div>

            <div
              className="customer-special-request"
            >

              {booking.special_request ? (

                <p>
                  {booking.special_request}
                </p>

              ) : (

                <p className="no-request">
                  No special request was added.
                </p>

              )}

            </div>

          </div>

          {/* =================================================
              CANCELLATION SECTION
          ================================================= */}

          <div
            className="customer-cancellation-card"
          >

            <div>

              <h2>
                Reservation Cancellation
              </h2>

              {/* =========================================
                  CONFIRMED + CAN CANCEL
              ========================================= */}

              {status === "confirmed" &&
              canCancel && (

                <p>

                  You can cancel this reservation
                  before the checkout date.

                  Your payment will be processed
                  according to the hotel's refund policy.

                </p>

              )}

              {/* =========================================
                  CHECKED IN
              ========================================= */}

              {(status === "checked_in" ||
                status === "checked-in") && (

                <p>

                  This reservation has already been
                  checked in. Cancellation is no longer
                  available.

                </p>

              )}

              {/* =========================================
                  CHECKED OUT
              ========================================= */}

              {(status === "checked_out" ||
                status === "checked-out") && (

                <p>

                  This reservation has been completed
                  and checked out. Cancellation is no
                  longer available.

                </p>

              )}

              {/* =========================================
                  CANCELLED
              ========================================= */}

              {status === "cancelled" && (

                <p>

                  This reservation has already
                  been cancelled.

                </p>

              )}

              {/* =========================================
                  CONFIRMED + CHECKOUT DATE ARRIVED
              ========================================= */}

              {status === "confirmed" &&
              !canCancel && (

                <p>

                  This reservation can no longer
                  be cancelled because the checkout
                  date has arrived.

                </p>

              )}

            </div>

            {/* =================================================
                CANCEL BUTTON
            ================================================= */}

            <button
              type="button"
              className="customer-cancel-booking-btn"
              disabled={
                !canCancel ||
                cancelling
              }
              onClick={
                handleCancelBooking
              }
            >

              <FaTimes />

              {cancelling

                ? "Cancelling..."

                : canCancel

                ? "Cancel Reservation"

                : status === "checked_in" ||
                  status === "checked-in"

                ? "Checked In"

                : status === "checked_out" ||
                  status === "checked-out"

                ? "Completed"

                : status === "cancelled"

                ? "Reservation Cancelled"

                : "Cannot Cancel"}

            </button>

          </div>

          {/* =================================================
              BOTTOM BACK BUTTON
          ================================================= */}

          <button
            type="button"
            className="customer-details-bottom-back"
            onClick={() =>
              navigate(
                "/customer/bookings"
              )
            }
          >

            <FaArrowLeft />

            Back to My Bookings

          </button>

        </main>

      </div>

    </div>

  );

}

// =====================================================
// EXPORT
// =====================================================

export default CustomerBookingDetails;