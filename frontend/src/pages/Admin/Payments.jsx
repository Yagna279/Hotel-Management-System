import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaUndoAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaReceipt,
  FaUndo,
} from "react-icons/fa";

import "./Payments.css";


function Payments() {

  /* ===================================================
     STATE
  =================================================== */

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [payments, setPayments] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [statistics, setStatistics] =
    useState({
      totalRevenue: 0,
      paid: 0,
      pending: 0,
      refunds: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [tableSearch, setTableSearch] =
    useState("");

  const [bookingSearch, setBookingSearch] =
    useState("");

  const [selectedBookingId, setSelectedBookingId] =
    useState("");

  const [paymentDetails, setPaymentDetails] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [refundLoading, setRefundLoading] =
    useState(false);


  /* ===================================================
     FORM
  =================================================== */

  const [formData, setFormData] =
    useState({

      booking_id: "",

      amount: "",

      discount: "0",

      payment_method: "",

      payment_status: "completed",

    });


  /* ===================================================
     LOAD PAYMENTS
  =================================================== */

  const loadPayments = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          "http://localhost:5000/api/admin/payments"
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load payments."
        );

      }


      setPayments(
        data.payments || []
      );


      setBookings(
        data.bookings || []
      );


      setStatistics(
        data.statistics || {
          totalRevenue: 0,
          paid: 0,
          pending: 0,
          refunds: 0,
        }
      );

    } catch (error) {

      console.error(
        "Payments error:",
        error
      );


      setError(
        error.message ||
        "Unable to load payments."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {

    loadPayments();

  }, []);


  /* ===================================================
     CURRENCY
  =================================================== */

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;

  };


  /* ===================================================
     SELECTED BOOKING
  =================================================== */

  const selectedBooking =
    useMemo(() => {

      return bookings.find(
        (booking) =>
          String(
            booking.booking_id
          ) ===
          String(
            selectedBookingId
          )
      );

    }, [
      bookings,
      selectedBookingId,
    ]);


  /* ===================================================
     FILTER BOOKINGS
  =================================================== */

  const filteredBookings =
    useMemo(() => {

      const search =
        bookingSearch
          .toLowerCase()
          .trim();


      if (!search) {

        return bookings.filter(
          (booking) =>
            Number(
              booking.outstanding_service_amount || 0
            ) > 0
        );

      }


      return bookings.filter(
        (booking) => {

          const bookingId =
            String(
              booking.booking_id || ""
            ).toLowerCase();

          const customerName =
            String(
              booking.customer_name || ""
            ).toLowerCase();

          const roomNumber =
            String(
              booking.room_number || ""
            ).toLowerCase();


          const hasOutstanding =
            Number(
              booking.outstanding_service_amount || 0
            ) > 0;


          return (
            hasOutstanding &&
            (
              bookingId.includes(search) ||
              customerName.includes(search) ||
              roomNumber.includes(search)
            )
          );

        }
      );

    }, [
      bookings,
      bookingSearch,
    ]);


  /* ===================================================
     TABLE SEARCH
  =================================================== */

  const filteredPayments =
    useMemo(() => {

      const search =
        tableSearch
          .toLowerCase()
          .trim();


      if (!search) {

        return payments;

      }


      return payments.filter(
        (payment) => {

          const bookingId =
            String(
              payment.booking_id || ""
            ).toLowerCase();

          const customerName =
            String(
              payment.customer_name || ""
            ).toLowerCase();

          const invoice =
            String(
              payment.invoice_number || ""
            ).toLowerCase();


          return (
            bookingId.includes(search) ||
            customerName.includes(search) ||
            invoice.includes(search)
          );

        }
      );

    }, [
      payments,
      tableSearch,
    ]);


  /* ===================================================
     DISCOUNT
  =================================================== */

  const discountAmount =
    Math.max(
      Number(
        formData.discount || 0
      ),
      0
    );


  /* ===================================================
     OUTSTANDING SERVICE
  =================================================== */

  const outstandingServiceAmount =
    Number(
      selectedBooking?.outstanding_service_amount ||
      0
    );


  /* ===================================================
     FINAL PAYMENT
  =================================================== */

  const finalPaymentAmount =
    Math.max(
      outstandingServiceAmount -
      discountAmount,
      0
    );


  /* ===================================================
     INPUT
  =================================================== */

  const handleInputChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  /* ===================================================
     SELECT BOOKING
  =================================================== */

  const handleBookingSelect = (
    event
  ) => {

    const bookingId =
      event.target.value;


    setSelectedBookingId(
      bookingId
    );


    setFormData(
      (previous) => ({

        ...previous,

        booking_id:
          bookingId,

        amount: "",

        discount: "0",

      })
    );

  };


  /* ===================================================
     OPEN ADD PAYMENT
  =================================================== */

  const openPaymentForm = () => {

    setBookingSearch("");

    setSelectedBookingId("");

    setFormData({

      booking_id: "",

      amount: "",

      discount: "0",

      payment_method: "",

      payment_status: "completed",

    });

    setShowPaymentForm(true);

  };


  /* ===================================================
     CLOSE PAYMENT FORM
  =================================================== */

  const closePaymentForm = () => {

    setShowPaymentForm(false);

    setBookingSearch("");

    setSelectedBookingId("");

  };


  /* ===================================================
     ADD PAYMENT
  =================================================== */

  const handleAddPayment = async () => {

    try {

      if (!selectedBookingId) {

        alert(
          "Please select a booking."
        );

        return;

      }


      if (
        outstandingServiceAmount <= 0
      ) {

        alert(
          "There are no outstanding service charges for this booking."
        );

        return;

      }


      if (
        discountAmount >
        outstandingServiceAmount
      ) {

        alert(
          "Discount cannot be greater than the outstanding service amount."
        );

        return;

      }


      if (!formData.payment_method) {

        alert(
          "Please select a payment method."
        );

        return;

      }


      const finalAmount =
        Number(
          (
            outstandingServiceAmount -
            discountAmount
          ).toFixed(2)
        );


      if (finalAmount <= 0) {

        alert(
          "Payment amount must be greater than zero."
        );

        return;

      }


      const response =
        await fetch(
          "http://localhost:5000/api/admin/payments",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              booking_id:
                selectedBookingId,

              amount:
                finalAmount,

              discount:
                discountAmount,

              payment_method:
                formData.payment_method,

              payment_status:
                formData.payment_status,

            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add payment."
        );

      }


      alert(
        "Service payment added successfully!"
      );


      closePaymentForm();


      await loadPayments();

    } catch (error) {

      console.error(
        "Add payment error:",
        error
      );


      alert(
        error.message ||
        "Failed to add payment."
      );

    }

  };


  /* ===================================================
     OPEN PAYMENT DETAILS
  =================================================== */

  const openPaymentDetails =
    async (paymentId) => {

      try {

        setDetailsLoading(true);

        setShowDetails(true);

        setPaymentDetails(null);


        const response =
          await fetch(
            `http://localhost:5000/api/admin/payments/${paymentId}`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load payment details."
          );

        }


        setPaymentDetails(
          data.payment
        );

      } catch (error) {

        console.error(
          "Payment details error:",
          error
        );


        alert(
          error.message ||
          "Failed to load payment details."
        );


        setShowDetails(false);

      } finally {

        setDetailsLoading(false);

      }

    };


  /* ===================================================
     REFUND
  =================================================== */

  const handleRefund =
    async () => {

      if (!paymentDetails) {
        return;
      }


      const confirmed =
        window.confirm(
          `Refund ${formatCurrency(
            paymentDetails.amount
          )} for ${paymentDetails.invoice_number}?`
        );


      if (!confirmed) {
        return;
      }


      try {

        setRefundLoading(true);


        const response =
          await fetch(
            `http://localhost:5000/api/admin/payments/${paymentDetails.id}/refund`,
            {

              method: "POST",

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to refund payment."
          );

        }


        alert(
          "Payment refunded successfully."
        );


        setShowDetails(false);

        setPaymentDetails(null);


        await loadPayments();

      } catch (error) {

        console.error(
          "Refund error:",
          error
        );


        alert(
          error.message ||
          "Failed to refund payment."
        );

      } finally {

        setRefundLoading(false);

      }

    };


  /* ===================================================
     STATUS CLASS
  =================================================== */

  const getStatusClass =
    (status) => {

      const normalized =
        String(
          status || ""
        ).toLowerCase();


      if (
        normalized === "pending"
      ) {

        return "pending";

      }


      if (
        normalized === "refunded"
      ) {

        return "refunded";

      }


      return "confirmed";

    };


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            <div className="payments-header">

              <div>

                <h1>
                  Payments
                </h1>

                <p>
                  Loading payment data...
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /* ===================================================
     MAIN
  =================================================== */

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="payments-header">

            <div>

              <h1>
                Payments
              </h1>

              <p>
                Manage hotel booking and service payments
              </p>

            </div>


            <div className="payment-buttons">

              <button
                className="add-payment-btn"
                onClick={
                  openPaymentForm
                }
              >

                <FaPlus />

                Add Payment

              </button>

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


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="payment-stats">


            {/* TOTAL REVENUE */}

            <div className="payment-card">

              <div className="icon-box blue">

                <FaMoneyBillWave
                  className="payment-icon"
                />

              </div>

              <div>

                <h2>
                  {formatCurrency(
                    statistics.totalRevenue
                  )}
                </h2>

                <p>
                  Total Revenue
                </p>

              </div>

            </div>


            {/* PAID */}

            <div className="payment-card">

              <div className="icon-box green">

                <FaCheckCircle
                  className="payment-icon"
                />

              </div>

              <div>

                <h2>
                  {formatCurrency(
                    statistics.paid
                  )}
                </h2>

                <p>
                  Paid
                </p>

              </div>

            </div>


            {/* PENDING SERVICES */}

            <div className="payment-card">

              <div className="icon-box orange">

                <FaClock
                  className="payment-icon"
                />

              </div>

              <div>

                <h2>
                  {formatCurrency(
                    statistics.pending
                  )}
                </h2>

                <p>
                  Pending Services
                </p>

              </div>

            </div>


            {/* REFUNDS */}

            <div className="payment-card">

              <div className="icon-box red">

                <FaUndoAlt
                  className="payment-icon"
                />

              </div>

              <div>

                <h2>
                  {formatCurrency(
                    statistics.refunds
                  )}
                </h2>

                <p>
                  Refunds
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RECENT PAYMENTS
          ================================================= */}

          <div className="payments-table">

            <div className="payments-table-header">

              <div>

                <h2>
                  Recent Payments
                </h2>

                <p>
                  Search booking ID, customer name or invoice
                </p>

              </div>


              <div className="payment-search">

                <FaSearch />

                <input
                  type="text"
                  value={
                    tableSearch
                  }
                  onChange={(event) =>
                    setTableSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search booking ID or customer name..."
                />

              </div>

            </div>


            <div className="payments-table-scroll">

              <table>

                <thead>

                  <tr>

                    <th>
                      Invoice
                    </th>

                    <th>
                      Booking
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Room
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredPayments.length === 0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "30px",
                        }}
                      >

                        No payments found.

                      </td>

                    </tr>

                  ) : (

                    filteredPayments.map(
                      (payment) => (

                        <tr
                          key={
                            payment.id
                          }

                          className="payment-row"

                          onClick={() =>
                            openPaymentDetails(
                              payment.id
                            )
                          }
                        >

                          <td>

                            <button
                              type="button"
                              className="invoice-link"
                              onClick={(event) => {

                                event.stopPropagation();

                                openPaymentDetails(
                                  payment.id
                                );

                              }}
                            >

                              <FaReceipt />

                              #
                              {
                                payment.invoice_number
                              }

                            </button>

                          </td>


                          <td>

                            #
                            {
                              payment.booking_id
                            }

                          </td>


                          <td>

                            {
                              payment.customer_name ||
                              "Unknown"
                            }

                          </td>


                          <td>

                            {
                              payment.room_number ||
                              "-"
                            }

                          </td>


                          <td>

                            <span
                              className={`payment-type ${
                                String(
                                  payment.payment_type ||
                                  "booking"
                                ).toLowerCase()
                              }`}
                            >

                              {
                                String(
                                  payment.payment_type ||
                                  "booking"
                                )
                                  .toLowerCase() ===
                                "service"
                                  ? "Service"
                                  : "Booking"
                              }

                            </span>

                          </td>


                          <td>

                            {formatCurrency(
                              payment.amount
                            )}

                          </td>


                          <td>

                            {
                              payment.payment_method ||
                              "-"
                            }

                          </td>


                          <td>

                            <span
                              className={`status ${getStatusClass(
                                payment.payment_status
                              )}`}
                            >

                              {
                                payment.payment_status ||
                                "Pending"
                              }

                            </span>

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
              ADD PAYMENT MODAL
          ================================================= */}

          {showPaymentForm && (

            <div
              className="payment-modal"
              onClick={
                closePaymentForm
              }
            >

              <div
                className="payment-form payment-form-large"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div className="modal-header">

                  <div>

                    <h2>
                      Add Service Payment
                    </h2>

                    <p>
                      Collect payment for services requested after booking
                    </p>

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={
                      closePaymentForm
                    }
                  >

                    <FaTimes />

                  </button>

                </div>


                {/* =================================================
                    SEARCH BOOKING
                ================================================= */}

                <div className="form-group">

                  <label>
                    Search Booking
                  </label>


                  <div className="booking-search">

                    <FaSearch />

                    <input
                      type="text"
                      value={
                        bookingSearch
                      }
                      onChange={(event) =>
                        setBookingSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search by customer name, booking ID or room number..."
                    />

                  </div>

                </div>


                {/* =================================================
                    BOOKING
                ================================================= */}

                <div className="form-group">

                  <label>
                    Booking
                  </label>


                  <select
                    value={
                      selectedBookingId
                    }
                    onChange={
                      handleBookingSelect
                    }
                  >

                    <option value="">
                      Select Booking
                    </option>


                    {filteredBookings.map(
                      (booking) => (

                        <option
                          key={
                            booking.booking_id
                          }
                          value={
                            booking.booking_id
                          }
                        >

                          Booking #
                          {
                            booking.booking_id
                          }

                          {" - "}

                          {
                            booking.customer_name ||
                            "Unknown"
                          }

                          {" - Room "}

                          {
                            booking.room_number ||
                            "-"
                          }

                          {" - Services "}

                          {
                            formatCurrency(
                              booking.outstanding_service_amount
                            )
                          }

                        </option>

                      )
                    )}

                  </select>


                  {filteredBookings.length === 0 && (

                    <small className="form-help">

                      No bookings with outstanding service charges found.

                    </small>

                  )}

                </div>


                {selectedBooking && (

                  <>

                    {/* =================================================
                        CUSTOMER + ROOM
                    ================================================= */}

                    <div className="payment-details-grid">

                      <div className="form-group">

                        <label>
                          Customer
                        </label>

                        <input
                          type="text"
                          value={
                            selectedBooking.customer_name ||
                            ""
                          }
                          readOnly
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          Room
                        </label>

                        <input
                          type="text"
                          value={

                            selectedBooking.room_number
                              ? `${selectedBooking.room_number} - ${
                                  selectedBooking.room_type ||
                                  ""
                                }`
                              : ""

                          }
                          readOnly
                        />

                      </div>

                    </div>


                    {/* =================================================
                        SERVICES
                    ================================================= */}

                    <div className="selected-services">

                      <h3>
                        Services Requested
                      </h3>


                      {selectedBooking.services?.length > 0 ? (

                        <div className="service-payment-list">

                          {selectedBooking.services.map(
                            (service) => (

                              <div
                                className="service-payment-item"
                                key={
                                  service.service_id
                                }
                              >

                                <span>

                                  {
                                    service.service_name
                                  }

                                </span>


                                <strong>

                                  {formatCurrency(
                                    service.price
                                  )}

                                </strong>

                              </div>

                            )
                          )}

                        </div>

                      ) : (

                        <p>
                          No services selected.
                        </p>

                      )}

                    </div>


                    {/* =================================================
                        PAYMENT CALCULATION
                    ================================================= */}

                    <div className="payment-calculation">

                      <div>

                        <span>
                          Service Total
                        </span>

                        <strong>
                          {formatCurrency(
                            selectedBooking.service_total
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Already Paid for Services
                        </span>

                        <strong>
                          {formatCurrency(
                            selectedBooking.paid_service_amount
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Outstanding
                        </span>

                        <strong>
                          {formatCurrency(
                            outstandingServiceAmount
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* =================================================
                        DISCOUNT
                    ================================================= */}

                    <div className="form-group">

                      <label>
                        Discount
                      </label>


                      <input
                        type="number"
                        min="0"
                        max={
                          outstandingServiceAmount
                        }
                        step="0.01"
                        name="discount"
                        value={
                          formData.discount
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Enter discount"
                      />

                    </div>


                    {/* =================================================
                        FINAL AMOUNT
                    ================================================= */}

                    <div className="final-payment-box">

                      <span>
                        Amount to Pay
                      </span>

                      <strong>
                        {formatCurrency(
                          finalPaymentAmount
                        )}
                      </strong>

                    </div>


                    {/* =================================================
                        METHOD
                    ================================================= */}

                    <div className="form-group">

                      <label>
                        Payment Method
                      </label>


                      <select
                        name="payment_method"
                        value={
                          formData.payment_method
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="">
                          Select Payment Method
                        </option>

                        <option value="Cash">
                          Cash
                        </option>

                        <option value="Credit Card">
                          Credit Card
                        </option>

                        <option value="Debit Card">
                          Debit Card
                        </option>

                        <option value="UPI">
                          UPI
                        </option>

                        <option value="Net Banking">
                          Net Banking
                        </option>

                        <option value="Wallet">
                          Wallet
                        </option>

                      </select>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="form-group">

                      <label>
                        Payment Status
                      </label>


                      <select
                        name="payment_status"
                        value={
                          formData.payment_status
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="completed">
                          Completed
                        </option>

                        <option value="pending">
                          Pending
                        </option>

                      </select>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="form-buttons">

                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={
                          closePaymentForm
                        }
                      >

                        Cancel

                      </button>


                      <button
                        type="button"
                        className="submit-btn"
                        onClick={
                          handleAddPayment
                        }
                      >

                        Save Payment

                      </button>

                    </div>

                  </>

                )}

              </div>

            </div>

          )}


          {/* =================================================
              PAYMENT DETAILS MODAL
          ================================================= */}

          {showDetails && (

            <div
              className="payment-modal"
              onClick={() => {

                setShowDetails(false);

                setPaymentDetails(null);

              }}
            >

              <div
                className="payment-form payment-form-large"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div className="modal-header">

                  <div>

                    <h2>
                      Payment Details
                    </h2>

                    {paymentDetails && (

                      <p>
                        {
                          paymentDetails.invoice_number
                        }
                      </p>

                    )}

                  </div>


                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => {

                      setShowDetails(false);

                      setPaymentDetails(null);

                    }}
                  >

                    <FaTimes />

                  </button>

                </div>


                {detailsLoading ? (

                  <div className="details-loading">

                    Loading payment details...

                  </div>

                ) : paymentDetails ? (

                  <>

                    {/* =================================================
                        BASIC DETAILS
                    ================================================= */}

                    <div className="invoice-info-grid">

                      <div>

                        <span>
                          Invoice
                        </span>

                        <strong>
                          {
                            paymentDetails.invoice_number
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Booking
                        </span>

                        <strong>
                          #
                          {
                            paymentDetails.booking_id
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Customer
                        </span>

                        <strong>
                          {
                            paymentDetails.customer_name ||
                            "Unknown"
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Room
                        </span>

                        <strong>

                          {
                            paymentDetails.room_number ||
                            "-"
                          }

                          {" - "}

                          {
                            paymentDetails.room_type ||
                            ""
                          }

                        </strong>

                      </div>


                      <div>

                        <span>
                          Payment Type
                        </span>

                        <strong>

                          {
                            String(
                              paymentDetails.payment_type ||
                              "booking"
                            ).toLowerCase() ===
                            "service"
                              ? "Service Payment"
                              : "Booking Payment"
                          }

                        </strong>

                      </div>


                      <div>

                        <span>
                          Payment Method
                        </span>

                        <strong>
                          {
                            paymentDetails.payment_method ||
                            "-"
                          }
                        </strong>

                      </div>

                    </div>


                    {/* =================================================
                        SERVICES
                    ================================================= */}

                    {paymentDetails.services?.length > 0 && (

                      <div className="invoice-services">

                        <h3>
                          Services
                        </h3>


                        {paymentDetails.services.map(
                          (service) => (

                            <div
                              className="invoice-service-row"
                              key={
                                service.service_id
                              }
                            >

                              <span>
                                {
                                  service.service_name
                                }
                              </span>

                              <strong>
                                {formatCurrency(
                                  service.price
                                )}
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                    )}


                    {/* =================================================
                        AMOUNTS
                    ================================================= */}

                    <div className="invoice-total-box">

                      {paymentDetails.payment_type === "service" && (

                        <div>

                          <span>
                            Discount
                          </span>

                          <strong>
                            {formatCurrency(
                              paymentDetails.discount
                            )}
                          </strong>

                        </div>

                      )}


                      <div>

                        <span>
                          Paid Amount
                        </span>

                        <strong>
                          {formatCurrency(
                            paymentDetails.amount
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Status
                        </span>

                        <span
                          className={`status ${getStatusClass(
                            paymentDetails.payment_status
                          )}`}
                        >

                          {
                            paymentDetails.payment_status
                          }

                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        REFUND
                    ================================================= */}

                    {paymentDetails.booking_status &&
                      [
                        "cancelled",
                        "rejected",
                      ].includes(
                        String(
                          paymentDetails.booking_status
                        ).toLowerCase()
                      ) &&

                      [
                        "completed",
                        "paid",
                      ].includes(
                        String(
                          paymentDetails.payment_status
                        ).toLowerCase()
                      ) && (

                        <div className="refund-section">

                          <p>

                            This booking has been
                            cancelled or rejected.

                          </p>


                          <button
                            type="button"
                            className="refund-btn"
                            disabled={
                              refundLoading
                            }
                            onClick={
                              handleRefund
                            }
                          >

                            <FaUndo />

                            {refundLoading
                              ? "Refunding..."
                              : "Refund Payment"
                            }

                          </button>

                        </div>

                      )}

                  </>

                ) : null}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default Payments;