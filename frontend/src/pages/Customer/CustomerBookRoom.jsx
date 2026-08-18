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
} from "react-icons/fa";

import "./CustomerBookRoom.css";

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

  const [form, setForm] =
    useState({

      check_in: "",

      check_out: "",

      adults: 1,

      children: 0,

      special_request: "",

    });

  // =====================================================
  // LOAD ROOM
  // =====================================================

  useEffect(() => {

    const loadRoom =
      async () => {

        try {

          setLoading(true);

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
          form.check_in
        );

      const checkOut =
        new Date(
          form.check_out
        );

      const difference =
        checkOut -
        checkIn;

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

  const totalAmount =
    room
      ? Number(
          room.price_per_night
        ) * nights
      : 0;

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      // ================================================
      // CUSTOMER
      // ================================================

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

      // ================================================
      // VALIDATION
      // ================================================

      if (
        !form.check_in ||
        !form.check_out
      ) {

        setError(
          "Please select check-in and check-out dates."
        );

        return;

      }

      if (nights <= 0) {

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

      // ================================================
      // SUBMIT
      // ================================================

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

                customer_id:
                  customerId,

                room_id:
                  roomId,

                check_in:
                  form.check_in,

                check_out:
                  form.check_out,

                adults:
                  Number(
                    form.adults
                  ),

                children:
                  Number(
                    form.children
                  ),

                special_request:
                  form.special_request,

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

        setSuccess(
          "Room booked successfully!"
        );

        // ============================================
        // GO TO BOOKINGS PAGE
        // ============================================

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

            <div className="customer-message">

              Loading room...

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !room) {

    return (

      <div className="customer-book-room-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-book-room-content">

            <div className="customer-message error">

              {error}

            </div>

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

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="customer-book-room-layout">

      <CustomerSidebar />

      <div className="customer-main">

        <CustomerTopbar />

        <main className="customer-book-room-content">

          {/* HEADER */}

          <div className="customer-book-room-header">

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

            <div>

              <h1>
                Book Your Room
              </h1>

              <p>
                Complete your reservation details.
              </p>

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}

          {/* SUCCESS */}

          {success && (

            <div className="customer-message success">

              {success}

            </div>

          )}

          <div className="customer-book-room-grid">

            {/* ROOM */}

            <div className="customer-book-room-card">

              <div className="customer-book-room-icon">

                <FaBed />

              </div>

              <h2>
                {room.room_type}
              </h2>

              <p>
                Room {room.room_number}
              </p>

              <strong>
                ₹
                {Number(
                  room.price_per_night
                ).toLocaleString(
                  "en-IN"
                )}
                {" "}
                / night
              </strong>

            </div>

            {/* FORM */}

            <form
              className="customer-booking-form"
              onSubmit={handleSubmit}
            >

              <h2>
                Reservation Details
              </h2>

              {/* DATES */}

              <div className="customer-booking-form-row">

                <div className="customer-form-group">

                  <label>
                    <FaCalendarAlt />
                    Check In
                  </label>

                  <input
                    type="date"
                    name="check_in"
                    value={
                      form.check_in
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                <div className="customer-form-group">

                  <label>
                    <FaCalendarAlt />
                    Check Out
                  </label>

                  <input
                    type="date"
                    name="check_out"
                    value={
                      form.check_out
                    }
                    min={
                      form.check_in ||
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              {/* GUESTS */}

              <div className="customer-booking-form-row">

                <div className="customer-form-group">

                  <label>
                    <FaUsers />
                    Adults
                  </label>

                  <input
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

                  <label>
                    <FaUsers />
                    Children
                  </label>

                  <input
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

              {/* SPECIAL REQUEST */}

              <div className="customer-form-group">

                <label>
                  Special Request
                </label>

                <textarea
                  name="special_request"
                  value={
                    form.special_request
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Any special requests?"
                  rows="4"
                />

              </div>

              {/* SUMMARY */}

              <div className="customer-booking-total">

                <div>

                  <span>
                    Nights
                  </span>

                  <strong>
                    {nights}
                  </strong>

                </div>

                <div>

                  <span>
                    Price per night
                  </span>

                  <strong>
                    ₹
                    {Number(
                      room.price_per_night
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="customer-confirm-booking-btn"
              >

                {submitting
                  ? "Booking..."
                  : "Confirm Booking"}

              </button>

            </form>

          </div>

        </main>

      </div>

    </div>

  );

}

export default CustomerBookRoom;