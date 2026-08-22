import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaArrowLeft,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import "./CustomerBookRoom.css";


// =====================================================
// CUSTOMER BOOK ROOM
// =====================================================

function CustomerBookRoom() {

  const navigate =
    useNavigate();

  const { roomId } =
    useParams();


  // =====================================================
  // STATE
  // =====================================================

  const [room, setRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] =
    useState({

      check_in: "",

      check_out: "",

      adults: 1,

      children: 0,

      special_request: "",

      payment_method: "Card",

    });


  // =====================================================
  // LOAD ROOM
  // =====================================================

  useEffect(() => {

    const loadRoom =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await fetch(
              "http://localhost:5000/api/customer-rooms"
            );


          const data =
            await response.json();


          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load room."
            );

          }


          const selectedRoom =
            (data.rooms || []).find(
              (item) =>
                String(item.id) ===
                String(roomId)
            );


          if (!selectedRoom) {

            throw new Error(
              "Room not found."
            );

          }


          if (
            String(
              selectedRoom.status || ""
            ).toLowerCase() !==
            "available"
          ) {

            throw new Error(
              "This room is currently not available."
            );

          }


          setRoom(
            selectedRoom
          );

        } catch (error) {

          console.error(
            "Load room error:",
            error
          );


          setError(
            error.message ||
            "Unable to load room."
          );

        } finally {

          setLoading(false);

        }

      };


    loadRoom();

  }, [roomId]);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      setForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );

    };


  // =====================================================
  // TODAY
  // =====================================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // =====================================================
  // CALCULATE NIGHTS
  // =====================================================

  const getNights =
    () => {

      if (
        !form.check_in ||
        !form.check_out
      ) {

        return 0;

      }


      const checkIn =
        new Date(
          `${form.check_in}T00:00:00`
        );


      const checkOut =
        new Date(
          `${form.check_out}T00:00:00`
        );


      const difference =
        checkOut.getTime() -
        checkIn.getTime();


      const nights =
        Math.ceil(
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


  const nights =
    getNights();


  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalAmount =
    room
      ? Number(
          room.price_per_night || 0
        ) * nights
      : 0;


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency =
    (amount) => {

      return `₹${Number(
        amount || 0
      ).toLocaleString(
        "en-IN"
      )}`;

    };


  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      setError("");

      setSuccess("");


      // =================================================
      // CUSTOMER
      // =================================================

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        setError(
          "Please login before booking a room."
        );

        return;

      }


      let user;


      try {

        user =
          JSON.parse(
            storedUser
          );

      } catch {

        setError(
          "Invalid login information."
        );

        return;

      }


      const customerId =
        user?.id;


      if (!customerId) {

        setError(
          "Customer ID not found."
        );

        return;

      }


      // =================================================
      // VALIDATION
      // =================================================

      if (
        !form.check_in ||
        !form.check_out
      ) {

        setError(
          "Please select check-in and check-out dates."
        );

        return;

      }


      if (
        form.check_in < today
      ) {

        setError(
          "Check-in date cannot be before today."
        );

        return;

      }


      if (
        form.check_out <=
        form.check_in
      ) {

        setError(
          "Check-out must be after check-in."
        );

        return;

      }


      if (
        Number(form.adults) < 1
      ) {

        setError(
          "At least one adult is required."
        );

        return;

      }


      if (
        Number(form.children) < 0
      ) {

        setError(
          "Children count cannot be negative."
        );

        return;

      }


      if (!form.payment_method) {

        setError(
          "Please select a payment method."
        );

        return;

      }


      if (nights <= 0) {

        setError(
          "Please select valid booking dates."
        );

        return;

      }


      // =================================================
      // SUBMIT
      // =================================================

      try {

        setSubmitting(true);


        const response =
          await fetch(
            "http://localhost:5000/api/customer-bookings",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                customerId:
                  customerId,

                roomId:
                  roomId,

                checkIn:
                  form.check_in,

                checkOut:
                  form.check_out,

                adults:
                  Number(
                    form.adults
                  ),

                children:
                  Number(
                    form.children
                  ),

                paymentMethod:
                  form.payment_method,

                specialRequest:
                  form.special_request,

                services:
                  [],

              }),

            }
          );


        const data =
          await response.json();


        console.log(
          "Booking response:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to book room."
          );

        }


        // =================================================
        // SUCCESS
        // =================================================

        setSuccess(
          "Booking and payment completed successfully!"
        );


        // =================================================
        // REDIRECT
        // =================================================

        setTimeout(
          () => {

            navigate(
              "/customer/bookings"
            );

          },
          1200
        );


      } catch (error) {

        console.error(
          "Booking error:",
          error
        );


        setError(
          error.message ||
          "Unable to complete booking."
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

      <div className="customer-book-room-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-book-room-content">

            <div className="customer-book-room-loading">

              <div className="customer-loading-spinner"></div>

              <p>
                Loading room details...
              </p>

            </div>

          </main>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR WITHOUT ROOM
  // =====================================================

  if (error && !room) {

    return (

      <div className="customer-book-room-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-book-room-content">

            <div className="customer-book-room-error-page">

              <div className="customer-book-room-error-icon">
                ⚠️
              </div>

              <h2>
                Unable to Load Room
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/customer/rooms"
                  )
                }
              >

                <FaArrowLeft />

                Back to Rooms

              </button>

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

    <div className="customer-book-room-layout">

      <CustomerSidebar />


      <div className="customer-main">

        <CustomerTopbar />


        <main className="customer-book-room-content">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-book-room-header">

            <button
              type="button"
              className="customer-book-room-back"
              onClick={() =>
                navigate(
                  "/customer/rooms"
                )
              }
            >

              <FaArrowLeft />

              <span>
                Back to Rooms
              </span>

            </button>


            <div className="customer-book-room-title">

              <span className="customer-book-room-eyebrow">
                RESERVATION
              </span>

              <h1>
                Book Your Room
              </h1>

              <p>
                Complete your stay details and choose your preferred payment method.
              </p>

            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (

            <div className="customer-book-room-alert error">

              <span className="customer-alert-icon">
                !
              </span>

              <div>

                <strong>
                  Booking Error
                </strong>

                <p>
                  {error}
                </p>

              </div>

            </div>

          )}


          {success && (

            <div className="customer-book-room-alert success">

              <FaCheckCircle />

              <div>

                <strong>
                  Booking Confirmed
                </strong>

                <p>
                  {success}
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              GRID
          ================================================= */}

          <div className="customer-book-room-grid">


            {/* =================================================
                ROOM PREVIEW
            ================================================= */}

            <aside className="customer-room-preview-card">

              <div className="customer-room-preview-image">

                <div className="customer-room-preview-image-overlay"></div>

                <div className="customer-room-preview-image-content">

                  <div className="customer-room-preview-icon">
                    <FaBed />
                  </div>

                  <span>
                    {room.room_type}
                  </span>

                </div>

              </div>


              <div className="customer-room-preview-body">

                <div className="customer-room-preview-top">

                  <div>

                    <span className="customer-room-preview-label">
                      ROOM {room.room_number}
                    </span>

                    <h2>
                      {room.room_type}
                    </h2>

                  </div>


                  <div className="customer-room-available-badge">

                    <span></span>

                    Available

                  </div>

                </div>


                <div className="customer-room-price">

                  <strong>
                    {formatCurrency(
                      room.price_per_night
                    )}
                  </strong>

                  <span>
                    / night
                  </span>

                </div>


                <div className="customer-room-preview-divider"></div>


                <div className="customer-room-preview-info">

                  <div>

                    <FaBed />

                    <div>

                      <span>
                        Room
                      </span>

                      <strong>
                        {room.room_number}
                      </strong>

                    </div>

                  </div>


                  <div>

                    <FaCalendarAlt />

                    <div>

                      <span>
                        Stay
                      </span>

                      <strong>
                        {nights > 0
                          ? `${nights} ${
                              nights === 1
                                ? "Night"
                                : "Nights"
                            }`
                          : "Select dates"}
                      </strong>

                    </div>

                  </div>


                  <div>

                    <FaUsers />

                    <div>

                      <span>
                        Guests
                      </span>

                      <strong>
                        {Number(form.adults) +
                          Number(form.children)}
                      </strong>

                    </div>

                  </div>

                </div>


                <div className="customer-room-preview-note">

                  <span>
                    ✓
                  </span>

                  <p>
                    Payment is completed immediately when you confirm the booking.
                  </p>

                </div>

              </div>

            </aside>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="customer-booking-form"
              onSubmit={handleSubmit}
            >


              {/* =================================================
                  DATES
              ================================================= */}

              <div className="customer-form-section">

                <div className="customer-form-section-title">

                  <div className="customer-form-section-number">
                    01
                  </div>

                  <div>

                    <h3>
                      Stay Dates
                    </h3>

                    <p>
                      When will you be staying with us?
                    </p>

                  </div>

                </div>


                <div className="customer-booking-form-row">

                  <div className="customer-form-group">

                    <label htmlFor="check_in">

                      <FaCalendarAlt />

                      Check In

                    </label>

                    <div className="customer-input-wrapper">

                      <input
                        id="check_in"
                        type="date"
                        name="check_in"
                        value={
                          form.check_in
                        }
                        min={today}
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                  </div>


                  <div className="customer-form-group">

                    <label htmlFor="check_out">

                      <FaCalendarAlt />

                      Check Out

                    </label>

                    <div className="customer-input-wrapper">

                      <input
                        id="check_out"
                        type="date"
                        name="check_out"
                        value={
                          form.check_out
                        }
                        min={
                          form.check_in ||
                          today
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  GUESTS
              ================================================= */}

              <div className="customer-form-section">

                <div className="customer-form-section-title">

                  <div className="customer-form-section-number">
                    02
                  </div>

                  <div>

                    <h3>
                      Guest Information
                    </h3>

                    <p>
                      Tell us who will be staying in the room.
                    </p>

                  </div>

                </div>


                <div className="customer-booking-form-row">

                  <div className="customer-form-group">

                    <label htmlFor="adults">

                      <FaUsers />

                      Adults

                    </label>

                    <input
                      id="adults"
                      type="number"
                      name="adults"
                      min="1"
                      value={
                        form.adults
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  <div className="customer-form-group">

                    <label htmlFor="children">

                      <FaUsers />

                      Children

                    </label>

                    <input
                      id="children"
                      type="number"
                      name="children"
                      min="0"
                      value={
                        form.children
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  SPECIAL REQUEST
              ================================================= */}

              <div className="customer-form-section">

                <div className="customer-form-section-title">

                  <div className="customer-form-section-number">
                    03
                  </div>

                  <div>

                    <h3>
                      Special Request
                    </h3>

                    <p>
                      Let us know if you need anything special.
                    </p>

                  </div>

                </div>


                <div className="customer-form-group">

                  <label htmlFor="special_request">
                    Special Request
                  </label>

                  <textarea
                    id="special_request"
                    name="special_request"
                    value={
                      form.special_request
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Early check-in, extra pillows, airport pickup..."
                    rows="4"
                  />

                </div>

              </div>


              {/* =================================================
                  PAYMENT
              ================================================= */}

              <div className="customer-form-section payment-section">

                <div className="customer-form-section-title">

                  <div className="customer-form-section-number">
                    04
                  </div>

                  <div>

                    <h3>
                      Payment Method
                    </h3>

                    <p>
                      Your payment will be marked completed immediately.
                    </p>

                  </div>

                </div>


                <div className="customer-payment-method-grid">


                  {/* CARD */}

                  <label
                    className={
                      `customer-payment-method-card ${
                        form.payment_method ===
                        "Card"
                          ? "selected"
                          : ""
                      }`
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="Card"
                      checked={
                        form.payment_method ===
                        "Card"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <div className="customer-payment-method-icon card-icon">

                      <FaCreditCard />

                    </div>

                    <div className="customer-payment-method-content">

                      <strong>
                        Card
                      </strong>

                      <span>
                        Credit or Debit Card
                      </span>

                    </div>

                    {form.payment_method ===
                      "Card" && (

                      <div className="customer-payment-selected">
                        <FaCheckCircle />
                      </div>

                    )}

                  </label>


                  {/* UPI */}

                  <label
                    className={
                      `customer-payment-method-card ${
                        form.payment_method ===
                        "UPI"
                          ? "selected"
                          : ""
                      }`
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="UPI"
                      checked={
                        form.payment_method ===
                        "UPI"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <div className="customer-payment-method-icon upi-icon">

                      <FaMobileAlt />

                    </div>

                    <div className="customer-payment-method-content">

                      <strong>
                        UPI
                      </strong>

                      <span>
                        Google Pay, PhonePe, Paytm
                      </span>

                    </div>

                    {form.payment_method ===
                      "UPI" && (

                      <div className="customer-payment-selected">
                        <FaCheckCircle />
                      </div>

                    )}

                  </label>


                  {/* NET BANKING */}

                  <label
                    className={
                      `customer-payment-method-card ${
                        form.payment_method ===
                        "Net Banking"
                          ? "selected"
                          : ""
                      }`
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="Net Banking"
                      checked={
                        form.payment_method ===
                        "Net Banking"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <div className="customer-payment-method-icon bank-icon">

                      <FaUniversity />

                    </div>

                    <div className="customer-payment-method-content">

                      <strong>
                        Net Banking
                      </strong>

                      <span>
                        Pay through your bank
                      </span>

                    </div>

                    {form.payment_method ===
                      "Net Banking" && (

                      <div className="customer-payment-selected">
                        <FaCheckCircle />
                      </div>

                    )}

                  </label>


                  {/* CASH */}

                  <label
                    className={
                      `customer-payment-method-card ${
                        form.payment_method ===
                        "Cash"
                          ? "selected"
                          : ""
                      }`
                    }
                  >

                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash"
                      checked={
                        form.payment_method ===
                        "Cash"
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <div className="customer-payment-method-icon cash-icon">

                      <FaMoneyBillWave />

                    </div>

                    <div className="customer-payment-method-content">

                      <strong>
                        Cash
                      </strong>

                      <span>
                        Pay at the hotel
                      </span>

                    </div>

                    {form.payment_method ===
                      "Cash" && (

                      <div className="customer-payment-selected">
                        <FaCheckCircle />
                      </div>

                    )}

                  </label>

                </div>

              </div>


              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="customer-booking-summary">

                <div className="customer-booking-summary-header">

                  <div>

                    <span>
                      BOOKING SUMMARY
                    </span>

                    <h3>
                      Your Reservation
                    </h3>

                  </div>

                </div>


                <div className="customer-booking-summary-row">

                  <span>
                    Room
                  </span>

                  <strong>
                    {room.room_type}
                  </strong>

                </div>


                <div className="customer-booking-summary-row">

                  <span>
                    Stay
                  </span>

                  <strong>
                    {nights}{" "}
                    {nights === 1
                      ? "Night"
                      : "Nights"}
                  </strong>

                </div>


                <div className="customer-booking-summary-row">

                  <span>
                    Price per night
                  </span>

                  <strong>
                    {formatCurrency(
                      room.price_per_night
                    )}
                  </strong>

                </div>


                <div className="customer-booking-summary-row">

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {form.payment_method}
                  </strong>

                </div>


                <div className="customer-booking-summary-row">

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    Completed
                  </strong>

                </div>


                <div className="customer-booking-summary-divider"></div>


                <div className="customer-booking-total-row">

                  <div>

                    <span>
                      Total Amount
                    </span>

                    <small>
                      Payment completed at booking
                    </small>

                  </div>


                  <strong>
                    {formatCurrency(
                      totalAmount
                    )}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  CONFIRM BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="customer-confirm-booking-btn"
              >

                {submitting ? (

                  <>
                    <span className="customer-button-spinner"></span>

                    Processing Payment...

                  </>

                ) : (

                  <>

                    <FaCheckCircle />

                    Confirm Booking & Pay

                  </>

                )}

              </button>


              <p className="customer-booking-secure-note">

                🔒 Your payment is securely recorded with your reservation.

              </p>

            </form>

          </div>

        </main>

      </div>

    </div>

  );

}


export default CustomerBookRoom;