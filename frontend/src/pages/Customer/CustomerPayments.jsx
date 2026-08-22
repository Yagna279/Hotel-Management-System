import React, {
  useEffect,
  useState,
} from "react";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaFileInvoice,
  FaDownload,
  FaArrowUp,
  FaExclamationCircle,
  FaTimes,
  FaShieldAlt,
  FaCalendarAlt,
  FaBed,
  FaMoneyBillWave,
} from "react-icons/fa";

import "./CustomerPayments.css";


// =====================================================
// CUSTOMER PAYMENTS
// =====================================================

function CustomerPayments() {

  // =====================================================
  // STATE
  // =====================================================

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("All Payments");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("Card");

  const [processingPayment, setProcessingPayment] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [paymentSuccess, setPaymentSuccess] =
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
  // FETCH PAYMENTS
  // =====================================================

  const fetchPayments = async () => {

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
          `http://localhost:5000/api/customer-payments/${customerId}`
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

    } catch (error) {

      console.error(
        "Customer payments error:",
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


  useEffect(() => {

    fetchPayments();

  }, []);


  // =====================================================
  // CURRENCY
  // =====================================================

  const formatCurrency =
    (amount) => {

      return `₹${(
        Number(amount) || 0
      ).toLocaleString(
        "en-IN"
      )}`;

    };


  // =====================================================
  // DATE
  // =====================================================

  const formatDate =
    (date) => {

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
  // STATUS
  // =====================================================

  const getPaymentStatus =
    (payment) => {

      return String(
        payment.payment_status ||
        ""
      )
        .toLowerCase()
        .trim();

    };


  // =====================================================
  // AMOUNT
  // =====================================================

  const getPaymentAmount =
    (payment) => {

      return (
        Number(payment.amount) ||
        Number(payment.total_amount) ||
        0
      );

    };


  // =====================================================
  // METHOD
  // =====================================================

  const getPaymentMethod =
    (payment) => {

      return (
        payment.payment_method ||
        "Not specified"
      );

    };


  // =====================================================
  // STATUS UI
  // =====================================================

  const getStatusDisplay =
    (payment) => {

      const status =
        getPaymentStatus(
          payment
        );

      if (
        [
          "completed",
          "paid",
          "success",
          "successful",
        ].includes(status)
      ) {

        return {
          className: "completed",
          icon: <FaCheckCircle />,
          label: "Completed",
        };

      }

      if (
        [
          "pending",
          "unpaid",
          "processing",
        ].includes(status)
      ) {

        return {
          className: "pending",
          icon: <FaClock />,
          label: "Pending",
        };

      }

      if (
        [
          "refunded",
          "refund",
        ].includes(status)
      ) {

        return {
          className: "refunded",
          icon: <FaArrowUp />,
          label: "Refunded",
        };

      }

      if (
        [
          "failed",
          "cancelled",
          "canceled",
        ].includes(status)
      ) {

        return {
          className: "failed",
          icon: <FaTimesCircle />,
          label:
            status === "failed"
              ? "Failed"
              : "Cancelled",
        };

      }

      return {
        className: "pending",
        icon: <FaExclamationCircle />,
        label: "Unknown",
      };

    };


  // =====================================================
  // BOOKING TITLE
  // =====================================================

  const getBookingTitle =
    (payment) => {

      if (
        payment.room_number &&
        payment.room_type
      ) {

        return `${payment.room_number} • ${payment.room_type}`;

      }

      if (payment.booking_id) {

        return `Booking #${payment.booking_id}`;

      }

      return "Hotel Booking";

    };


  // =====================================================
  // SUMMARY
  // =====================================================

  const totalSpent =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          [
            "refunded",
            "refund",
          ].includes(status)
        ) {

          return total;

        }

        return (
          total +
          getPaymentAmount(
            payment
          )
        );

      },
      0
    );


  const completedAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          [
            "completed",
            "paid",
            "success",
            "successful",
          ].includes(status)
        ) {

          return (
            total +
            getPaymentAmount(
              payment
            )
          );

        }

        return total;

      },
      0
    );


  const pendingAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          [
            "pending",
            "unpaid",
            "processing",
          ].includes(status)
        ) {

          return (
            total +
            getPaymentAmount(
              payment
            )
          );

        }

        return total;

      },
      0
    );


  const refundAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          [
            "refunded",
            "refund",
          ].includes(status)
        ) {

          return (
            total +
            getPaymentAmount(
              payment
            )
          );

        }

        return total;

      },
      0
    );


  // =====================================================
  // FILTER
  // =====================================================

  const filteredPayments =
    payments.filter(
      (payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          filter === "All Payments"
        ) {
          return true;
        }

        if (
          filter === "Completed"
        ) {

          return [
            "completed",
            "paid",
            "success",
            "successful",
          ].includes(status);

        }

        if (
          filter === "Pending"
        ) {

          return [
            "pending",
            "unpaid",
            "processing",
          ].includes(status);

        }

        if (
          filter === "Refunded"
        ) {

          return [
            "refunded",
            "refund",
          ].includes(status);

        }

        return true;

      }
    );


  // =====================================================
  // VIEW INVOICE
  // =====================================================

  const handleViewPayment =
    (payment) => {

      setSelectedPayment(
        payment
      );

    };


  // =====================================================
  // CLOSE INVOICE
  // =====================================================

  const closeInvoice =
    () => {

      setSelectedPayment(
        null
      );

    };


  // =====================================================
  // OPEN PAYMENT MODAL
  // =====================================================

  const handlePayNow =
    (payment) => {

      setSelectedPayment(
        payment
      );

      setPaymentMethod(
        "Card"
      );

      setPaymentError("");

      setPaymentSuccess("");

      setShowPaymentModal(
        true
      );

    };


  // =====================================================
  // CLOSE PAYMENT MODAL
  // =====================================================

  const closePaymentModal =
    () => {

      if (
        processingPayment
      ) {
        return;
      }

      setShowPaymentModal(
        false
      );

      setPaymentError("");

      setPaymentSuccess("");

    };


  // =====================================================
  // CONFIRM PAYMENT
  // =====================================================

  const handleConfirmPayment =
    async () => {

      if (
        !selectedPayment
      ) {
        return;
      }

      try {

        setProcessingPayment(
          true
        );

        setPaymentError("");

        setPaymentSuccess("");

        const customerId =
          getCustomerId();

        if (!customerId) {

          throw new Error(
            "Customer information not found."
          );

        }

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
                  selectedPayment.booking_id,

                amount:
                  getPaymentAmount(
                    selectedPayment
                  ),

                payment_method:
                  paymentMethod,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Payment failed."
          );

        }

        setPaymentSuccess(
          "Payment completed successfully."
        );

        // Refresh payments
        await fetchPayments();

        // Keep invoice available
        if (
          data.payment
        ) {

          setSelectedPayment(
            (previous) => ({
              ...previous,
              ...data.payment,
              payment_status:
                "completed",
            })
          );

        }

        setTimeout(() => {

          setShowPaymentModal(
            false
          );

          setPaymentSuccess("");

        }, 1400);

      } catch (error) {

        console.error(
          "Payment error:",
          error
        );

        setPaymentError(
          error.message ||
          "Payment failed."
        );

      } finally {

        setProcessingPayment(
          false
        );

      }

    };


  // =====================================================
  // PRINT / DOWNLOAD INVOICE
  // =====================================================

  const handleDownloadReceipt =
    (payment) => {

      const invoice =
        payment.invoice_number ||
        `INV${String(
          payment.id
        ).padStart(4, "0")}`;

      const content = `
HOTEL MANAGEMENT SYSTEM
PAYMENT INVOICE
================================

Invoice Number: ${invoice}
Booking ID: #${payment.booking_id || "-"}
Payment Date: ${formatDate(
        payment.paid_at
      )}

Customer:
${payment.customer_name || "Hotel Guest"}

Room:
${getBookingTitle(payment)}

Check-in:
${formatDate(payment.check_in)}

Check-out:
${formatDate(payment.check_out)}

Payment Method:
${getPaymentMethod(payment)}

Payment Status:
Completed

Amount:
${formatCurrency(
        getPaymentAmount(payment)
      )}

================================
Thank you for staying with us.
      `;

      const blob =
        new Blob(
          [content],
          {
            type: "text/plain",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `${invoice}.txt`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="customer-payments-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-payments-page">

            <div className="customer-payments-loading">

              <div className="payment-loader"></div>

              <p>
                Loading your payments...
              </p>

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

      <div className="customer-payments-layout">

        <CustomerSidebar />

        <div className="customer-main">

          <CustomerTopbar />

          <main className="customer-payments-page">

            <div className="customer-payments-error">

              <FaExclamationCircle />

              <h2>
                Unable to load payments
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  fetchPayments
                }
              >
                Try Again
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

    <div className="customer-payments-layout">

      <CustomerSidebar />

      <div className="customer-main">

        <CustomerTopbar />

        <main className="customer-payments-page">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="customer-payments-hero">

            <div>

              <span className="customer-payments-eyebrow">
                FINANCIAL OVERVIEW
              </span>

              <h1>
                Payments & Invoices
              </h1>

              <p>
                Manage your hotel payments,
                invoices and transaction history
                in one place.
              </p>

            </div>

            <div className="customer-payments-hero-icon">
              <FaFileInvoice />
            </div>

          </section>


          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="customer-payment-summary">

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon blue">
                <FaMoneyBillWave />
              </div>

              <div>
                <span>Total Spent</span>

                <strong>
                  {formatCurrency(
                    totalSpent
                  )}
                </strong>

                <small>
                  All transactions
                </small>
              </div>

            </div>


            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>Completed</span>

                <strong>
                  {formatCurrency(
                    completedAmount
                  )}
                </strong>

                <small>
                  Successful payments
                </small>
              </div>

            </div>


            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon orange">
                <FaClock />
              </div>

              <div>
                <span>Pending</span>

                <strong>
                  {formatCurrency(
                    pendingAmount
                  )}
                </strong>

                <small>
                  Awaiting payment
                </small>
              </div>

            </div>


            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon purple">
                <FaArrowUp />
              </div>

              <div>
                <span>Refunds</span>

                <strong>
                  {formatCurrency(
                    refundAmount
                  )}
                </strong>

                <small>
                  Returned payments
                </small>
              </div>

            </div>

          </section>


          {/* =================================================
              HISTORY
          ================================================= */}

          <section className="customer-payments-card">

            <div className="customer-payments-card-header">

              <div>

                <div className="payment-card-title">

                  <div className="payment-title-icon">
                    <FaCreditCard />
                  </div>

                  <div>

                    <h2>
                      Payment History
                    </h2>

                    <p>
                      View your transactions and invoices
                    </p>

                  </div>

                </div>

              </div>

              <select
                className="customer-payment-filter"
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
              >

                <option>
                  All Payments
                </option>

                <option>
                  Completed
                </option>

                <option>
                  Pending
                </option>

                <option>
                  Refunded
                </option>

              </select>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="customer-payment-table-wrapper">

              <table className="customer-payment-table">

                <thead>

                  <tr>

                    <th>Invoice</th>

                    <th>Booking</th>

                    <th>Date</th>

                    <th>Amount</th>

                    <th>Payment Type</th>

                    <th>Status</th>

                    

                  </tr>

                </thead>

                <tbody>

                  {filteredPayments.map(
                    (payment) => {

                      const status =
                        getStatusDisplay(
                          payment
                        );

                      const invoice =
                        payment.invoice_number ||
                        `INV${String(
                          payment.id
                        ).padStart(4, "0")}`;

                      const isPending =
                        status.className ===
                        "pending";

                      return (

                        <tr
                          key={
                            payment.id
                          }
                        >

                          {/* INVOICE */}

                          <td>

                            <div className="payment-invoice-cell">

                              <div className="invoice-icon">
                                <FaFileInvoice />
                              </div>

                              <div>

                                <strong>
                                  {invoice}
                                </strong>

                                <span>
                                  Payment #
                                  {payment.id}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* BOOKING */}

                          <td>

                            <div className="customer-booking-cell">

                              <strong>
                                {getBookingTitle(
                                  payment
                                )}
                              </strong>

                              <span>
                                Booking #
                                {payment.booking_id}
                              </span>

                            </div>

                          </td>


                          {/* DATE */}

                          <td>

                            <div className="payment-date-cell">

                              <FaCalendarAlt />

                              <span>
                                {formatDate(
                                  payment.paid_at ||
                                  payment.created_at
                                )}
                              </span>

                            </div>

                          </td>


                          {/* AMOUNT */}

                          <td>

                            <strong className="payment-amount">

                              {formatCurrency(
                                getPaymentAmount(
                                  payment
                                )
                              )}

                            </strong>

                          </td>


                          {/* METHOD */}

                          <td>

                            <span className="payment-method">

                              <FaCreditCard />

                              {getPaymentMethod(
                                payment
                              )}

                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`payment-status ${status.className}`}
                            >

                              {status.icon}

                              {status.label}

                            </span>

                          


                          

                            

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>


              {filteredPayments.length === 0 && (

                <div className="customer-no-payments">

                  <div className="empty-payment-icon">
                    <FaCreditCard />
                  </div>

                  <h2>
                    No Payments Found
                  </h2>

                  <p>
                    There are no transactions
                    matching this filter.
                  </p>

                </div>

              )}

            </div>

          </section>

        </main>

      </div>


      {/* =====================================================
          INVOICE MODAL
      ===================================================== */}

      {selectedPayment &&
        !showPaymentModal && (

        <div
          className="payment-modal-overlay"
          onClick={
            closeInvoice
          }
        >

          <div
            className="invoice-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="invoice-close"
              onClick={
                closeInvoice
              }
            >
              <FaTimes />
            </button>


            <div className="invoice-header">

              <div>

                <span>
                  HOTEL MANAGEMENT SYSTEM
                </span>

                <h2>
                  Payment Invoice
                </h2>

              </div>

              <div className="invoice-logo">
                <FaFileInvoice />
              </div>

            </div>


            <div className="invoice-number">

              <span>
                Invoice Number
              </span>

              <strong>
                {selectedPayment.invoice_number ||
                  `INV${String(
                    selectedPayment.id
                  ).padStart(4, "0")}`}
              </strong>

            </div>


            <div className="invoice-grid">

              <div>

                <span>Booking</span>

                <strong>
                  #{selectedPayment.booking_id}
                </strong>

              </div>

              <div>

                <span>Payment Date</span>

                <strong>
                  {formatDate(
                    selectedPayment.paid_at
                  )}
                </strong>

              </div>

              <div>

                <span>Room</span>

                <strong>
                  {getBookingTitle(
                    selectedPayment
                  )}
                </strong>

              </div>

              <div>

                <span>Payment Type</span>

                <strong>
                  {getPaymentMethod(
                    selectedPayment
                  )}
                </strong>

              </div>

            </div>


            <div className="invoice-total">

              <div>

                <span>
                  Amount Paid
                </span>

                <strong>
                  {formatCurrency(
                    getPaymentAmount(
                      selectedPayment
                    )
                  )}
                </strong>

              </div>

              <span className="invoice-completed">
                <FaCheckCircle />
                Completed
              </span>

            </div>


            <div className="invoice-footer">

              <FaShieldAlt />

              <span>
                This payment has been securely
                recorded in our system.
              </span>

            </div>


            <button
              type="button"
              className="invoice-download-btn"
              onClick={() =>
                handleDownloadReceipt(
                  selectedPayment
                )
              }
            >

              <FaDownload />

              Download Invoice

            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal &&
        selectedPayment && (

        <div
          className="payment-modal-overlay"
          onClick={
            closePaymentModal
          }
        >

          <div
            className="payment-form-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="invoice-close"
              onClick={
                closePaymentModal
              }
            >
              <FaTimes />
            </button>


            <div className="payment-form-header">

              <div className="payment-form-icon">
                <FaCreditCard />
              </div>

              <div>

                <h2>
                  Complete Payment
                </h2>

                <p>
                  Secure payment for Booking #
                  {selectedPayment.booking_id}
                </p>

              </div>

            </div>


            {/* AMOUNT */}

            <div className="payment-amount-box">

              <span>
                Amount to Pay
              </span>

              <strong>
                {formatCurrency(
                  getPaymentAmount(
                    selectedPayment
                  )
                )}
              </strong>

            </div>


            {/* PAYMENT TYPE */}

            <div className="payment-form-group">

              <label>
                Payment Type
              </label>

              <div className="payment-method-options">

                {[
                  {
                    name: "Card",
                    icon: <FaCreditCard />,
                  },
                  {
                    name: "UPI",
                    icon: <FaMoneyBillWave />,
                  },
                  {
                    name: "Net Banking",
                    icon: <FaCreditCard />,
                  },
                  {
                    name: "Cash",
                    icon: <FaMoneyBillWave />,
                  },
                ].map(
                  (method) => (

                    <button
                      type="button"
                      key={
                        method.name
                      }
                      className={
                        paymentMethod ===
                        method.name
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setPaymentMethod(
                          method.name
                        )
                      }
                    >

                      {method.icon}

                      <span>
                        {method.name}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {paymentError && (

              <div className="payment-form-error">

                <FaExclamationCircle />

                {paymentError}

              </div>

            )}


            {paymentSuccess && (

              <div className="payment-form-success">

                <FaCheckCircle />

                {paymentSuccess}

              </div>

            )}


            <div className="payment-security">

              <FaShieldAlt />

              <div>

                <strong>
                  Secure Payment
                </strong>

                <span>
                  Your payment information is
                  securely processed.
                </span>

              </div>

            </div>


            <button
              type="button"
              className="confirm-payment-btn"
              disabled={
                processingPayment
              }
              onClick={
                handleConfirmPayment
              }
            >

              {processingPayment
                ? "Processing Payment..."
                : `Confirm Payment • ${formatCurrency(
                    getPaymentAmount(
                      selectedPayment
                    )
                  )}`}

            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default CustomerPayments;