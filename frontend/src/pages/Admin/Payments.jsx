import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaUndoAlt,
  FaFileInvoiceDollar,
  FaPlus,
} from "react-icons/fa";

import "./Payments.css";


function Payments() {

  /* ===================================================
     STATE
  =================================================== */

  const [showPaymentForm, setShowPaymentForm] =
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


  /* ===================================================
     FORM STATE
  =================================================== */

  const [formData, setFormData] =
    useState({

      booking_id: "",

      amount: "",

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


      console.log(
        "Payments data:",
        data
      );


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
     USE EFFECT
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
    ).toLocaleString("en-IN")}`;

  };


  /* ===================================================
     FORM INPUT
  =================================================== */

  const handleInputChange = (event) => {

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
     ADD PAYMENT
  =================================================== */

  const handleAddPayment = async () => {

    try {

      if (!formData.booking_id) {

        alert(
          "Please select a booking."
        );

        return;

      }


      if (!formData.amount) {

        alert(
          "Please enter the payment amount."
        );

        return;

      }


      if (!formData.payment_method) {

        alert(
          "Please select a payment method."
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

            body: JSON.stringify(
              formData
            ),

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
        "Payment added successfully!"
      );


      /* ===============================================
         RESET FORM
      =============================================== */

      setFormData({

        booking_id: "",

        amount: "",

        payment_method: "",

        payment_status: "completed",

      });


      setShowPaymentForm(false);


      /* ===============================================
         REFRESH DATABASE DATA
      =============================================== */

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


          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="payments-header">

            <div>

              <h1>
                Payments
              </h1>

              <p>
                Manage Hotel Payment Transactions
              </p>

            </div>


            <div className="payment-buttons">

              <button
                className="add-payment-btn"

                onClick={() =>
                  setShowPaymentForm(true)
                }
              >

                <FaPlus />

                Add Payment

              </button>


              <button
                className="invoice-btn"
                type="button"
              >

                <FaFileInvoiceDollar />

                Generate Invoice

              </button>

            </div>

          </div>


          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}


          {/* ==========================================
              STATISTICS
          ========================================== */}

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


            {/* PENDING */}

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
                  Pending
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


          {/* ==========================================
              RECENT PAYMENTS
          ========================================== */}

          <div className="payments-table">

            <h2>
              Recent Payments
            </h2>


            <table>

              <thead>

                <tr>

                  <th>
                    Invoice
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Room
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

                {payments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "25px",
                      }}
                    >

                      No payments found.

                    </td>

                  </tr>

                ) : (

                  payments.map(
                    (payment) => (

                      <tr
                        key={
                          payment.id
                        }
                      >

                        {/* INVOICE */}

                        <td>

                          #
                          {
                            payment.invoice_number
                          }

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          {
                            payment.customer_name ||
                            "Unknown"
                          }

                        </td>


                        {/* ROOM */}

                        <td>

                          {
                            payment.room_number ||
                            "-"
                          }

                        </td>


                        {/* AMOUNT */}

                        <td>

                          {formatCurrency(
                            payment.amount
                          )}

                        </td>


                        {/* METHOD */}

                        <td>

                          {
                            payment.payment_method ||
                            "-"
                          }

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${
                              String(
                                payment.payment_status ||
                                ""
                              ).toLowerCase() ===
                              "pending"

                                ? "pending"

                                : "confirmed"
                            }`}
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


          {/* ==========================================
              ADD PAYMENT MODAL
          ========================================== */}

          {showPaymentForm && (

            <div className="payment-modal">

              <div className="payment-form">

                <h2>
                  Add Payment
                </h2>


                {/* BOOKING */}

                <div className="form-group">

                  <label>
                    Booking
                  </label>


                  <select
                    name="booking_id"
                    value={
                      formData.booking_id
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="">
                      Select Booking
                    </option>


                    {bookings.map(
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

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* CUSTOMER */}

                <div className="form-group">

                  <label>
                    Customer
                  </label>


                  <input
                    type="text"
                    value={
                      bookings.find(
                        (booking) =>
                          String(
                            booking.booking_id
                          ) ===
                          String(
                            formData.booking_id
                          )
                      )?.customer_name || ""
                    }
                    placeholder="Customer name"
                    readOnly
                  />

                </div>


                {/* ROOM */}

                <div className="form-group">

                  <label>
                    Room
                  </label>


                  <input
                    type="text"
                    value={
                      bookings.find(
                        (booking) =>
                          String(
                            booking.booking_id
                          ) ===
                          String(
                            formData.booking_id
                          )
                      )?.room_number || ""
                    }
                    placeholder="Room number"
                    readOnly
                  />

                </div>


                {/* AMOUNT */}

                <div className="form-group">

                  <label>
                    Paid Amount
                  </label>


                  <input
                    type="number"
                    name="amount"
                    value={
                      formData.amount
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter paid amount"
                  />

                </div>


                {/* PAYMENT METHOD */}

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


                {/* STATUS */}

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

                    <option value="refunded">
                      Refunded
                    </option>

                  </select>

                </div>


                {/* BUTTONS */}

                <div className="form-buttons">

                  <button
                    className="cancel-btn"

                    onClick={() => {

                      setShowPaymentForm(
                        false
                      );

                    }}
                  >

                    Cancel

                  </button>


                  <button
                    className="submit-btn"

                    onClick={
                      handleAddPayment
                    }
                  >

                    Save Payment

                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default Payments;