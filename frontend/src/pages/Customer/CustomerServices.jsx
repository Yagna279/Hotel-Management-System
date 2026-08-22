import React, { useEffect, useState } from "react";

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
  FaTimes,
  FaCalendarAlt,
  FaBed,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import "./CustomerServices.css";


// =====================================================
// CUSTOMER SERVICES
// =====================================================

function CustomerServices() {

  // =====================================================
  // STATE
  // =====================================================

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // SERVICE REQUEST MODAL
  // =====================================================

  const [selectedService, setSelectedService] =
    useState(null);

  const [showRequestModal, setShowRequestModal] =
    useState(false);


  // =====================================================
  // CHECKED-IN BOOKINGS
  // =====================================================

  const [activeBookings, setActiveBookings] =
    useState([]);

  const [loadingBookings, setLoadingBookings] =
    useState(false);


  // =====================================================
  // SELECTED BOOKING
  // =====================================================

  const [selectedBooking, setSelectedBooking] =
    useState("");


  // =====================================================
  // QUANTITY
  // =====================================================

  const [quantity, setQuantity] =
    useState(1);


  // =====================================================
  // REQUEST STATE
  // =====================================================

  const [requesting, setRequesting] =
    useState(false);

  const [requestError, setRequestError] =
    useState("");

  const [requestSuccess, setRequestSuccess] =
    useState("");


  // =====================================================
  // GET CUSTOMER ID
  // =====================================================

  const getCustomerId = () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (user?.id) {
        return user.id;
      }


      const customer =
        JSON.parse(
          localStorage.getItem("customer")
        );

      if (customer?.id) {
        return customer.id;
      }


      const loggedInUser =
        JSON.parse(
          localStorage.getItem("loggedInUser")
        );

      if (loggedInUser?.id) {
        return loggedInUser.id;
      }


      return (
        localStorage.getItem(
          "customer_id"
        ) || null
      );

    } catch (error) {

      console.error(
        "Customer ID error:",
        error
      );

      return null;

    }

  };


  // =====================================================
  // GET SERVICE ICON
  // =====================================================

  const getServiceIcon = (service) => {

    const category =
      String(
        service.category || ""
      )
        .toLowerCase()
        .trim();


    const name =
      String(
        service.service_name || ""
      )
        .toLowerCase()
        .trim();


    if (
      category.includes("food") ||
      category.includes("restaurant") ||
      category.includes("dining") ||
      name.includes("dinner") ||
      name.includes("breakfast") ||
      name.includes("food")
    ) {
      return <FaUtensils />;
    }


    if (
      category.includes("wellness") ||
      category.includes("spa") ||
      name.includes("spa") ||
      name.includes("massage")
    ) {
      return <FaSpa />;
    }


    if (
      category.includes("transport") ||
      category.includes("transfer") ||
      name.includes("airport") ||
      name.includes("pickup") ||
      name.includes("drop")
    ) {
      return <FaCar />;
    }


    if (
      category.includes("recreation") ||
      name.includes("pool") ||
      name.includes("swimming")
    ) {
      return <FaSwimmingPool />;
    }


    if (
      category.includes("fitness") ||
      name.includes("gym")
    ) {
      return <FaDumbbell />;
    }


    if (
      name.includes("wifi") ||
      name.includes("internet")
    ) {
      return <FaWifi />;
    }


    if (
      name.includes("coffee") ||
      name.includes("beverage")
    ) {
      return <FaCoffee />;
    }


    return <FaConciergeBell />;

  };


  // =====================================================
  // GET SERVICE COLOR
  // =====================================================

  const getServiceColor = (service) => {

    const category =
      String(
        service.category || ""
      )
        .toLowerCase()
        .trim();


    if (
      category.includes("food") ||
      category.includes("restaurant")
    ) {
      return "orange";
    }


    if (
      category.includes("wellness") ||
      category.includes("spa")
    ) {
      return "purple";
    }


    if (
      category.includes("transport")
    ) {
      return "blue";
    }


    if (
      category.includes("fitness")
    ) {
      return "red";
    }


    if (
      category.includes("recreation")
    ) {
      return "cyan";
    }


    return "green";

  };


  // =====================================================
  // FETCH SERVICES
  // =====================================================

  const fetchServices = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          "http://localhost:5000/api/customer-services"
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load services."
        );

      }


      setServices(
        data.services || []
      );

    } catch (error) {

      console.error(
        "Customer services error:",
        error
      );

      setError(
        error.message ||
        "Unable to load services."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD SERVICES
  // =====================================================

  useEffect(() => {

    fetchServices();

  }, []);


  // =====================================================
  // FETCH CHECKED-IN BOOKINGS
  // =====================================================

  const fetchActiveBookings = async () => {

    try {

      setLoadingBookings(true);

      setRequestError("");


      const customerId =
        getCustomerId();


      if (!customerId) {

        throw new Error(
          "Customer information not found. Please login again."
        );

      }


      const response =
        await fetch(
          `http://localhost:5000/api/customer-services/${customerId}/bookings`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load active bookings."
        );

      }


      setActiveBookings(
        data.bookings || []
      );


    } catch (error) {

      console.error(
        "Active bookings error:",
        error
      );

      setRequestError(
        error.message ||
        "Unable to load active bookings."
      );

    } finally {

      setLoadingBookings(false);

    }

  };


  // =====================================================
  // OPEN REQUEST MODAL
  // =====================================================

  const handleRequestService = async (
    service
  ) => {

    setSelectedService(service);

    setSelectedBooking("");

    setQuantity(1);

    setRequestError("");

    setRequestSuccess("");

    setShowRequestModal(true);

    await fetchActiveBookings();

  };


  // =====================================================
  // CLOSE REQUEST MODAL
  // =====================================================

  const closeRequestModal = () => {

    if (requesting) {
      return;
    }

    setShowRequestModal(false);

    setSelectedService(null);

    setSelectedBooking("");

    setQuantity(1);

    setRequestError("");

    setRequestSuccess("");

  };


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${(
      Number(amount) || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {

    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // =====================================================
  // SUBMIT SERVICE REQUEST
  // =====================================================

  const handleSubmitRequest = async () => {

    try {

      setRequestError("");

      setRequestSuccess("");


      if (!selectedService) {

        setRequestError(
          "Service information is missing."
        );

        return;

      }


      if (!selectedBooking) {

        setRequestError(
          "Please select a checked-in booking."
        );

        return;

      }


      const selectedQuantity =
        Number(quantity);


      if (
        !selectedQuantity ||
        selectedQuantity <= 0
      ) {

        setRequestError(
          "Quantity must be at least 1."
        );

        return;

      }


      const customerId =
        getCustomerId();


      if (!customerId) {

        setRequestError(
          "Customer information not found. Please login again."
        );

        return;

      }


      setRequesting(true);


      const response =
        await fetch(
          "http://localhost:5000/api/customer-services/request",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              customerId:

                customerId,

              bookingId:

                Number(
                  selectedBooking
                ),

              serviceId:

                selectedService.id,

              quantity:

                selectedQuantity,

            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to request service."
        );

      }


      setRequestSuccess(
        "Service requested successfully."
      );


      // =================================================
      // CLOSE AFTER SUCCESS
      // =================================================

      setTimeout(() => {

        setShowRequestModal(false);

        setSelectedService(null);

        setSelectedBooking("");

        setQuantity(1);

        setRequestSuccess("");

      }, 1200);


    } catch (error) {

      console.error(
        "Request service error:",
        error
      );

      setRequestError(
        error.message ||
        "Failed to request service."
      );

    } finally {

      setRequesting(false);

    }

  };


  // =====================================================
  // LOADING PAGE
  // =====================================================

  if (loading) {

    return (

      <>

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-services-page">

            <div className="customer-services-loading">

              <div className="services-loader"></div>

              <p>
                Loading hotel services...
              </p>

            </div>

          </main>

        </div>

      </>

    );

  }


  // =====================================================
  // ERROR PAGE
  // =====================================================

  if (error) {

    return (

      <>

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-services-page">

            <div className="customer-services-error">

              <FaExclamationCircle />

              <h2>
                Unable to load services
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={fetchServices}
              >
                Try Again
              </button>

            </div>

          </main>

        </div>

      </>

    );

  }


  // =====================================================
  // MAIN JSX
  // =====================================================

  return (

    <>

      {/* ================= SIDEBAR ================= */}

      <CustomerSidebar />


      {/* ================= MAIN AREA ================= */}

      <div className="customer-main">

        {/* ================= TOPBAR ================= */}

        <CustomerTopbar />


        {/* ================= CONTENT ================= */}

        <main className="customer-services-page">


          {/* ================= HEADER ================= */}

          <div className="customer-services-header">

            <div>

              <span className="customer-services-label">
                HOTEL SERVICES
              </span>

              <h1>
                My Services
              </h1>

              <p>
                Explore our available services
                and request them during your stay.
              </p>

            </div>

          </div>


          {/* ================= INFO ================= */}

          <div className="customer-services-info">

            <div className="services-info-icon">

              <FaConciergeBell />

            </div>


            <div>

              <h3>
                Services available during your stay
              </h3>

              <p>
                You can request a service only
                after you have checked in.
              </p>

            </div>

          </div>


          {/* ================= SERVICES ================= */}

          <section className="customer-services-section">

            <div className="customer-section-title">

              <div>

                <h2>
                  Available Services
                </h2>

                <p>
                  Services currently offered by the hotel
                </p>

              </div>


              <span className="service-count">

                {services.length}

                {" "}

                {services.length === 1
                  ? "Service"
                  : "Services"}

              </span>

            </div>


            <div className="customer-services-grid">

              {services.map(
                (service) => {

                  const icon =
                    getServiceIcon(
                      service
                    );


                  const color =
                    getServiceColor(
                      service
                    );


                  return (

                    <div
                      className="customer-service-card"
                      key={service.id}
                    >


                      {/* ICON */}

                      <div
                        className={`customer-service-icon ${color}`}
                      >

                        {icon}

                      </div>


                      {/* CONTENT */}

                      <div className="customer-service-content">

                        <div className="customer-service-title-row">

                          <h3>
                            {service.service_name}
                          </h3>

                          {service.category && (

                            <span className="customer-service-category">

                              {service.category}

                            </span>

                          )}

                        </div>


                        <p>

                          {service.description ||
                            "Hotel service available for guests."}

                        </p>


                        {service.availability && (

                          <div className="customer-service-availability">

                            <FaClock />

                            <span>
                              {service.availability}
                            </span>

                          </div>

                        )}


                        <div className="customer-service-footer">

                          <span className="customer-service-price">

                            {formatCurrency(
                              service.price
                            )}

                          </span>


                          <button
                            type="button"
                            className="customer-service-button"
                            onClick={() =>
                              handleRequestService(
                                service
                              )
                            }
                          >

                            Request

                            <FaArrowRight />

                          </button>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            {/* ================= NO SERVICES ================= */}

            {services.length === 0 && (

              <div className="customer-services-empty">

                <FaConciergeBell />

                <h2>
                  No Services Available
                </h2>

                <p>
                  There are currently no active
                  hotel services available.
                </p>

              </div>

            )}

          </section>


        </main>

      </div>


      {/* =====================================================
          SERVICE REQUEST MODAL
      ===================================================== */}

      {showRequestModal &&
        selectedService && (

        <div
          className="service-request-overlay"
          onClick={closeRequestModal}
        >

          <div
            className="service-request-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* ================= CLOSE ================= */}

            <button
              type="button"
              className="service-request-close"
              onClick={closeRequestModal}
              disabled={requesting}
            >

              <FaTimes />

            </button>


            {/* ================= HEADER ================= */}

            <div className="service-request-header">

              <div
                className={`service-request-icon ${getServiceColor(
                  selectedService
                )}`}
              >

                {getServiceIcon(
                  selectedService
                )}

              </div>


              <div>

                <h2>
                  Request Service
                </h2>

                <p>
                  {selectedService.service_name}
                </p>

              </div>

            </div>


            {/* ================= SERVICE INFO ================= */}

            <div className="service-request-info">

              <strong>
                {selectedService.service_name}
              </strong>

              <span>

                {selectedService.description ||
                  "Hotel service"}

              </span>

              <span>

                Price:

                {" "}

                {formatCurrency(
                  selectedService.price
                )}

                {" "}per unit

              </span>

            </div>


            {/* ================= ERROR ================= */}

            {requestError && (

              <div className="service-request-error">

                <FaExclamationCircle />

                <span>
                  {requestError}
                </span>

              </div>

            )}


            {/* ================= SUCCESS ================= */}

            {requestSuccess && (

              <div className="service-request-success">

                <FaCheckCircle />

                <span>
                  {requestSuccess}
                </span>

              </div>

            )}


            {/* ================= BOOKINGS ================= */}

            <div className="service-request-group">

              <label>

                <FaBed />

                Select Checked-In Booking

              </label>


              {loadingBookings ? (

                <div className="service-request-loading">

                  Loading your checked-in bookings...

                </div>

              ) : activeBookings.length === 0 ? (

                <div className="service-request-no-booking">

                  <FaExclamationCircle />

                  <div>

                    <strong>
                      No checked-in booking found
                    </strong>

                    <span>
                      You can request this service
                      only after the hotel checks you
                      into a booking.
                    </span>

                  </div>

                </div>

              ) : (

                <select
                  value={selectedBooking}
                  onChange={(event) =>
                    setSelectedBooking(
                      event.target.value
                    )
                  }
                  disabled={requesting}
                >

                  <option value="">
                    Select your booking
                  </option>


                  {activeBookings.map(
                    (booking) => (

                      <option
                        key={booking.id}
                        value={booking.id}
                      >

                        Booking #
                        {booking.id}

                        {" — Room "}

                        {booking.room_number}

                        {" — "}

                        {booking.room_type}

                      </option>

                    )
                  )}

                </select>

              )}

            </div>


            {/* ================= QUANTITY ================= */}

            {activeBookings.length > 0 && (

              <div className="service-request-group">

                <label>

                  Quantity

                </label>


                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                  disabled={requesting}
                />

              </div>

            )}


            {/* ================= SELECTED BOOKING INFO ================= */}

            {selectedBooking && (

              <div className="service-request-selected-booking">

                {(() => {

                  const booking =
                    activeBookings.find(
                      (item) =>
                        String(
                          item.id
                        ) ===
                        String(
                          selectedBooking
                        )
                    );


                  if (!booking) {
                    return null;
                  }


                  return (

                    <>

                      <div>

                        <FaCalendarAlt />

                        <span>

                          Check-in:

                          {" "}

                          {formatDate(
                            booking.check_in
                          )}

                        </span>

                      </div>


                      <div>

                        <FaCalendarAlt />

                        <span>

                          Check-out:

                          {" "}

                          {formatDate(
                            booking.check_out
                          )}

                        </span>

                      </div>


                      <div>

                        <FaBed />

                        <span>

                          Room:

                          {" "}

                          {booking.room_number}

                        </span>

                      </div>

                    </>

                  );

                })()}

              </div>

            )}


            {/* ================= ACTIONS ================= */}

            <div className="service-request-actions">

              <button
                type="button"
                className="service-request-cancel"
                onClick={closeRequestModal}
                disabled={requesting}
              >

                Cancel

              </button>


              <button
                type="button"
                className="service-request-submit"
                onClick={handleSubmitRequest}
                disabled={
                  requesting ||
                  loadingBookings ||
                  activeBookings.length === 0 ||
                  !selectedBooking
                }
              >

                {requesting
                  ? "Requesting..."
                  : "Request Service"}

              </button>

            </div>


          </div>

        </div>

      )}

    </>

  );

}

export default CustomerServices;