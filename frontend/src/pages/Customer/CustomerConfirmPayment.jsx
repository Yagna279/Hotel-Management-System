import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaArrowLeft,
  FaBed,
  FaCalendarAlt,
  FaCreditCard,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

import "./CustomerConfirmPayment.css";

function CustomerConfirmPayment() {

  const navigate = useNavigate();

  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("UPI");


  // =====================================================
  // GET CUSTOMER ID
  // =====================================================

  const getCustomerId = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user =
        JSON.parse(storedUser);

      return user?.id || null;

    } catch (error) {

      console.error(
        "Customer information error:",
        error
      );

      return null;

    }

  };


  // =====================================================
  // LOAD BOOKING
  // =====================================================

  useEffect(() => {

    const loadBooking = async () => {

      try {

        setLoading(true);

        setError("");

        const customerId =
          getCustomerId();

        if (!customerId) {

          throw new Error(
            "Customer information not found. Please login again."
          );

        }

        const response =
          await fetch(
            `http://localhost:5000/api/customer-bookings/${customerId}`
          );

        const data =
          await response.json();

        console.log(
          "Booking data:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load booking."
          );

        }

        const selectedBooking =
          (data.bookings || []).find(
            (item) =>
              String(item.id) ===
              String(bookingId)
          );

        if (!selectedBooking) {

          throw new Error(
            "Booking not found."
          );

        }

        // -----------------------------------------------
        // CHECK PAYMENT STATUS
        // -----------------------------------------------

        const paymentStatus =
          String(
            selectedBooking.payment_status || ""
          ).toLowerCase();

        if (
          paymentStatus === "paid"
        ) {

          throw new Error(
            "This booking has already been paid."
          );

        }

        setBooking(
          selectedBooking
        );

      } catch (error) {

        console.error(
          "Load booking error:",
          error
        );

        setError(
          error.message ||
          "Unable to load booking."
        );

      } finally {

        setLoading(false);

      }

    };

    loadBooking();

  }, [bookingId]);


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

      return "-";

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
  // CONFIRM PAYMENT
  // =====================================================

  const handleConfirmPayment =
    async (e) => {

      e.preventDefault();

      setError("");

      const customerId =
        getCustomerId();

      if (!customerId) {

        setError(
          "Customer information not found. Please login again."
        );

        return;

      }

      if (!booking) {

        setError(
          "Booking information not available."
        );

        return;

      }

      try {

        setSubmitting(true);

        const amount =
          Number(
            booking.total_amount
          ) || 0;

        if (amount <= 0) {

          throw new Error(
            "Invalid booking amount."
          );

        }

        // =============================================
        // CREATE PAYMENT
        // =============================================

        const response =
          await fetch(
            "http://localhost:5000/api/customer-payments",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                customer_id:
                  customerId,

                booking_id:
                  booking.id,

                amount:
                  amount,

                payment_method:
                  paymentMethod,

              }),

            }
          );

        const data =
          await response.json();

        console.log(
          "Payment response:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Payment failed."
          );

        }

        // =============================================
        // SUCCESS
        // =============================================

        alert(
          "Payment completed successfully!"
        );

        navigate(
          "/customer/payments"
        );

      } catch (error) {

        console.error(
          "Payment error:",
          error
        );

        setError(
          error.message ||
          "Unable to complete payment."
        );

      } finally {

        setSubmitting(false);

      }

    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="customer-confirm-payment-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-confirm-payment-content">

            <div className="customer-message">

              Loading payment details...

            </div>

          </main>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !booking) {

    return (

      <div className="customer-confirm-payment-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-confirm-payment-content">

            <div className="customer-message error">

              {error}

            </div>

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

          </main>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN JSX
  // =====================================================

  return (

    <div className="customer-confirm-payment-layout">

      <CustomerSidebar />

      <div className="customer-main">

        <CustomerTopbar />

        <main className="customer-confirm-payment-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="customer-confirm-payment-header">

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

            <div>

              <span>
                PAYMENT
              </span>

              <h1>
                Confirm Payment
              </h1>

              <p>
                Review your booking and complete your payment.
              </p>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}


          <div className="customer-confirm-payment-grid">

            {/* =================================================
                BOOKING DETAILS
            ================================================= */}

            <div className="customer-payment-booking-card">

              <div className="customer-payment-booking-icon">

                <FaBed />

              </div>

              <h2>
                {booking.room_type || "Room"}
              </h2>

              <p>
                Room {booking.room_number || "-"}
              </p>

              <div className="customer-payment-detail">

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

              <div className="customer-payment-detail">

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

              <div className="customer-payment-detail">

                <span>

                  <FaUsers />

                  Guests

                </span>

                <strong>

                  {Number(
                    booking.adults || 0
                  ) +
                    Number(
                      booking.children || 0
                    )}

                </strong>

              </div>

              <div className="customer-payment-booking-id">

                Booking #{booking.id}

              </div>

            </div>


            {/* =================================================
                PAYMENT FORM
            ================================================= */}

            <form
              className="customer-confirm-payment-card"
              onSubmit={
                handleConfirmPayment
              }
            >

              <h2>
                Payment Details
              </h2>

              <p>
                Choose your payment method.
              </p>


              {/* =================================================
                  AMOUNT
              ================================================= */}

              <div className="customer-payment-amount-box">

                <span>
                  Amount to Pay
                </span>

                <strong>
                  {formatCurrency(
                    booking.total_amount
                  )}
                </strong>

              </div>


              {/* =================================================
                  PAYMENT METHOD
              ================================================= */}

              <div className="customer-payment-method-section">

                <label>
                  Payment Method
                </label>

                <div className="customer-payment-methods">

                  <label
                    className={
                      paymentMethod === "UPI"
                        ? "selected"
                        : ""
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="UPI"
                      checked={
                        paymentMethod === "UPI"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <FaCreditCard />

                    <span>
                      UPI
                    </span>

                  </label>


                  <label
                    className={
                      paymentMethod ===
                      "Card"
                        ? "selected"
                        : ""
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="Card"
                      checked={
                        paymentMethod ===
                        "Card"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <FaCreditCard />

                    <span>
                      Card
                    </span>

                  </label>


                  <label
                    className={
                      paymentMethod ===
                      "Cash"
                        ? "selected"
                        : ""
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash"
                      checked={
                        paymentMethod ===
                        "Cash"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                    />

                    <FaCreditCard />

                    <span>
                      Cash
                    </span>

                  </label>

                </div>

              </div>


              {/* =================================================
                  PAYMENT SUMMARY
              ================================================= */}

              <div className="customer-payment-summary-box">

                <div>

                  <span>
                    Booking
                  </span>

                  <strong>
                    #{booking.id}
                  </strong>

                </div>

                <div>

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {paymentMethod}
                  </strong>

                </div>

                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatCurrency(
                      booking.total_amount
                    )}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  CONFIRM BUTTON
              ================================================= */}

              <button
                type="submit"
                className="customer-confirm-payment-btn"
                disabled={submitting}
              >

                <FaCheckCircle />

                {submitting
                  ? "Processing Payment..."
                  : "Confirm Payment"}

              </button>

            </form>

          </div>

        </main>

      </div>

    </div>

  );

}

export default CustomerConfirmPayment;