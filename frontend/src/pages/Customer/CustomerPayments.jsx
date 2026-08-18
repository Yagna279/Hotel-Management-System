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
  FaDownload,
  FaEye,
  FaArrowUp,
  FaExclamationCircle,
} from "react-icons/fa";

import "./CustomerPayments.css";


// =====================================================
// CUSTOMER PAYMENTS
// =====================================================

function CustomerPayments() {

  // =====================================================
  // STATE
  // =====================================================

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All Payments");


  // =====================================================
  // GET LOGGED-IN CUSTOMER
  // =====================================================

  const getCustomerId = () => {

    try {

      // -----------------------------------------------
      // Try "user"
      // -----------------------------------------------

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (user?.id) {
        return user.id;
      }

      // -----------------------------------------------
      // Try "customer"
      // -----------------------------------------------

      const customer =
        JSON.parse(
          localStorage.getItem("customer")
        );

      if (customer?.id) {
        return customer.id;
      }

      // -----------------------------------------------
      // Try "loggedInUser"
      // -----------------------------------------------

      const loggedInUser =
        JSON.parse(
          localStorage.getItem("loggedInUser")
        );

      if (loggedInUser?.id) {
        return loggedInUser.id;
      }

      // -----------------------------------------------
      // Try direct customer ID
      // -----------------------------------------------

      const customerId =
        localStorage.getItem("customer_id");

      if (customerId) {
        return customerId;
      }

      // -----------------------------------------------
      // No customer found
      // -----------------------------------------------

      return null;

    } catch (error) {

      console.error(
        "Error reading customer from localStorage:",
        error
      );

      return null;

    }

  };


  // =====================================================
  // FETCH CUSTOMER PAYMENTS
  // =====================================================

  useEffect(() => {

    const fetchCustomerPayments =
      async () => {

        try {

          setLoading(true);

          setError("");

          // ---------------------------------------------
          // GET CUSTOMER ID
          // ---------------------------------------------

          const customerId =
            getCustomerId();

          if (!customerId) {

            throw new Error(
              "Customer information not found. Please login again."
            );

          }

          // ---------------------------------------------
          // API REQUEST
          // ---------------------------------------------

          const response =
            await fetch(
              `http://localhost:5000/api/customer-payments/${customerId}`
            );

          // ---------------------------------------------
          // RESPONSE
          // ---------------------------------------------

          const data =
            await response.json();

          console.log(
            "Customer payments:",
            data
          );

          // ---------------------------------------------
          // API ERROR
          // ---------------------------------------------

          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load payments."
            );

          }

          // ---------------------------------------------
          // STORE PAYMENTS
          // ---------------------------------------------

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

    fetchCustomerPayments();

  }, []);


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency =
    (amount) => {

      const value =
        Number(amount) || 0;

      return `₹${value.toLocaleString(
        "en-IN"
      )}`;

    };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate =
    (date) => {

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
  // NORMALIZE PAYMENT STATUS
  // =====================================================

  const getPaymentStatus =
    (payment) => {

      return String(
        payment.payment_status ||
        payment.status ||
        ""
      )
        .toLowerCase()
        .trim();

    };


  // =====================================================
  // NORMALIZE PAYMENT AMOUNT
  // =====================================================

  const getPaymentAmount =
    (payment) => {

      return (
        Number(
          payment.amount
        ) ||
        Number(
          payment.payment_amount
        ) ||
        Number(
          payment.total_amount
        ) ||
        0
      );

    };


  // =====================================================
  // NORMALIZE PAYMENT METHOD
  // =====================================================

  const getPaymentMethod =
    (payment) => {

      return (
        payment.payment_method ||
        payment.method ||
        payment.payment_type ||
        "Not specified"
      );

    };


  // =====================================================
  // PAYMENT TYPE
  // =====================================================

  const getPaymentType =
    (payment) => {

      if (
        payment.payment_type
      ) {

        return payment.payment_type;

      }

      if (
        payment.service_id ||
        payment.service_name
      ) {

        return "Additional service";

      }

      return "Room booking";

    };


  // =====================================================
  // BOOKING INFORMATION
  // =====================================================

  const getBookingTitle =
    (payment) => {

      // -----------------------------------------------
      // Room information
      // -----------------------------------------------

      if (
        payment.room_number &&
        payment.room_type
      ) {

        return `${payment.room_number} - ${payment.room_type}`;

      }

      // -----------------------------------------------
      // Service information
      // -----------------------------------------------

      if (
        payment.service_name
      ) {

        return payment.service_name;

      }

      // -----------------------------------------------
      // Booking ID
      // -----------------------------------------------

      if (
        payment.booking_id
      ) {

        return `Booking #${payment.booking_id}`;

      }

      return "Hotel Payment";

    };


  // =====================================================
  // PAYMENT DATE
  // =====================================================

  const getPaymentDate =
    (payment) => {

      return (
        payment.payment_date ||
        payment.paid_at ||
        payment.created_at
      );

    };


  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================

  const totalSpent =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        const amount =
          getPaymentAmount(
            payment
          );

        // ---------------------------------------------
        // Refunds are not counted as spending
        // ---------------------------------------------

        if (
          status === "refunded" ||
          status === "refund"
        ) {

          return total;

        }

        return total + amount;

      },
      0
    );


  // =====================================================
  // COMPLETED PAYMENTS
  // =====================================================

  const completedAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          status === "completed" ||
          status === "paid" ||
          status === "success" ||
          status === "successful"
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
  // PENDING PAYMENTS
  // =====================================================

  const pendingAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          status === "pending" ||
          status === "unpaid" ||
          status === "processing"
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
  // REFUNDS
  // =====================================================

  const refundAmount =
    payments.reduce(
      (total, payment) => {

        const status =
          getPaymentStatus(
            payment
          );

        if (
          status === "refunded" ||
          status === "refund"
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
  // FILTER PAYMENTS
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

          return (
            status === "completed" ||
            status === "paid" ||
            status === "success" ||
            status === "successful"
          );

        }

        if (
          filter === "Pending"
        ) {

          return (
            status === "pending" ||
            status === "unpaid" ||
            status === "processing"
          );

        }

        if (
          filter === "Refunded"
        ) {

          return (
            status === "refunded" ||
            status === "refund"
          );

        }

        return true;

      }
    );


  // =====================================================
  // PAYMENT STATUS UI
  // =====================================================

  const getStatusDisplay =
    (payment) => {

      const status =
        getPaymentStatus(
          payment
        );

      // -----------------------------------------------
      // COMPLETED
      // -----------------------------------------------

      if (
        status === "completed" ||
        status === "paid" ||
        status === "success" ||
        status === "successful"
      ) {

        return {

          className:
            "completed",

          icon:
            <FaCheckCircle />,

          label:
            "Completed",

        };

      }

      // -----------------------------------------------
      // PENDING
      // -----------------------------------------------

      if (
        status === "pending" ||
        status === "unpaid" ||
        status === "processing"
      ) {

        return {

          className:
            "pending",

          icon:
            <FaClock />,

          label:
            "Pending",

        };

      }

      // -----------------------------------------------
      // REFUNDED
      // -----------------------------------------------

      if (
        status === "refunded" ||
        status === "refund"
      ) {

        return {

          className:
            "refunded",

          icon:
            <FaCheckCircle />,

          label:
            "Refunded",

        };

      }

      // -----------------------------------------------
      // FAILED / CANCELLED
      // -----------------------------------------------

      if (
        status === "failed" ||
        status === "cancelled" ||
        status === "canceled"
      ) {

        return {

          className:
            "failed",

          icon:
            <FaTimesCircle />,

          label:
            status === "failed"
              ? "Failed"
              : "Cancelled",

        };

      }

      // -----------------------------------------------
      // DEFAULT
      // -----------------------------------------------

      return {

        className:
          "pending",

        icon:
          <FaExclamationCircle />,

        label:
          payment.payment_status ||
          payment.status ||
          "Unknown",

      };

    };


  // =====================================================
  // VIEW PAYMENT
  // =====================================================

  const handleViewPayment =
    (payment) => {

      console.log(
        "View payment:",
        payment
      );

      // -------------------------------------------------
      // You can later navigate to a payment details page
      // -------------------------------------------------

    };


  // =====================================================
  // DOWNLOAD RECEIPT
  // =====================================================

  const handleDownloadReceipt =
    (payment) => {

      console.log(
        "Download receipt:",
        payment
      );

      // -------------------------------------------------
      // Receipt download can be connected to your
      // backend later.
      // -------------------------------------------------

    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="customer-main">

        <CustomerSidebar />

        <CustomerTopbar />

        <main className="customer-payments-page">

          <div className="customer-message">

            Loading payments...

          </div>

        </main>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="customer-main">

        <CustomerSidebar />

        <CustomerTopbar />

        <main className="customer-payments-page">

          <div className="customer-message error">

            {error}

          </div>

        </main>

      </div>

    );

  }


  // =====================================================
  // JSX
  // =====================================================

  return (

    <>

      {/* =================================================
          CUSTOMER SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          CUSTOMER MAIN
      ================================================= */}

      <div className="customer-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <CustomerTopbar />


        {/* =================================================
            PAYMENTS PAGE
        ================================================= */}

        <main className="customer-payments-page">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-payments-header">

            <div>

              <span className="customer-payments-label">
                PAYMENT MANAGEMENT
              </span>

              <h1>
                My Payments
              </h1>

              <p>
                View and manage your hotel payment history.
              </p>

            </div>

          </div>


          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <div className="customer-payment-summary">


            {/* =================================================
                TOTAL SPENT
            ================================================= */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon blue">

                <FaCreditCard />

              </div>

              <div>

                <span>
                  Total Spent
                </span>

                <strong>
                  {formatCurrency(
                    totalSpent
                  )}
                </strong>

                <small>
                  All payments
                </small>

              </div>

            </div>


            {/* =================================================
                COMPLETED
            ================================================= */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon green">

                <FaCheckCircle />

              </div>

              <div>

                <span>
                  Completed
                </span>

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


            {/* =================================================
                PENDING
            ================================================= */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon orange">

                <FaClock />

              </div>

              <div>

                <span>
                  Pending
                </span>

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


            {/* =================================================
                REFUNDS
            ================================================= */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon purple">

                <FaArrowUp />

              </div>

              <div>

                <span>
                  Refunds
                </span>

                <strong>
                  {formatCurrency(
                    refundAmount
                  )}
                </strong>

                <small>
                  Total refunds
                </small>

              </div>

            </div>

          </div>


          {/* =================================================
              PAYMENT HISTORY
          ================================================= */}

          <div className="customer-payments-card">


            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="customer-payments-card-header">

              <div>

                <h2>
                  Payment History
                </h2>

                <p>
                  Your recent transactions
                </p>

              </div>


              {/* =================================================
                  FILTER
              ================================================= */}

              <select
                className="customer-payment-filter"
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value
                  )
                }
              >

                <option value="All Payments">
                  All Payments
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Refunded">
                  Refunded
                </option>

              </select>

            </div>


            {/* =================================================
                PAYMENT TABLE
            ================================================= */}

            <div className="customer-payment-table-wrapper">

              <table className="customer-payment-table">

                <thead>

                  <tr>

                    <th>
                      Transaction
                    </th>

                    <th>
                      Booking
                    </th>

                    <th>
                      Date
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

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {/* =================================================
                      PAYMENT DATA FROM DATABASE
                  ================================================= */}

                  {filteredPayments.map(
                    (payment, index) => {

                      const status =
                        getStatusDisplay(
                          payment
                        );

                      const amount =
                        getPaymentAmount(
                          payment
                        );

                      const paymentDate =
                        getPaymentDate(
                          payment
                        );

                      const paymentMethod =
                        getPaymentMethod(
                          payment
                        );

                      const paymentType =
                        getPaymentType(
                          payment
                        );

                      const bookingTitle =
                        getBookingTitle(
                          payment
                        );


                      return (

                        <tr
                          key={
                            payment.id ||
                            payment.payment_id ||
                            index
                          }
                        >


                          {/* =================================================
                              TRANSACTION
                          ================================================= */}

                          <td>

                            <div className="customer-transaction-cell">

                              <div
                                className={`customer-transaction-icon ${
                                  status.className ===
                                  "refunded"
                                    ? "refund"
                                    : ""
                                }`}
                              >

                                {status.className ===
                                "refunded"
                                  ? (
                                    <FaArrowUp />
                                  )
                                  : (
                                    <FaCreditCard />
                                  )}

                              </div>


                              <div>

                                <strong>

                                  {payment.transaction_id ||
                                    payment.transaction_reference ||
                                    payment.payment_number ||
                                    payment.id
                                      ? `#${payment.transaction_id ||
                                          payment.transaction_reference ||
                                          payment.payment_number ||
                                          payment.id}`
                                      : "#PAYMENT"}

                                </strong>

                                <span>
                                  {paymentType}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* =================================================
                              BOOKING
                          ================================================= */}

                          <td>

                            <div className="customer-booking-cell">

                              <strong>
                                {bookingTitle}
                              </strong>

                              <span>

                                {payment.booking_id
                                  ? `Booking #${payment.booking_id}`
                                  : payment.check_in
                                    ? `Check-in ${formatDate(
                                        payment.check_in
                                      )}`
                                    : "Hotel booking"}

                              </span>

                            </div>

                          </td>


                          {/* =================================================
                              DATE
                          ================================================= */}

                          <td>

                            {formatDate(
                              paymentDate
                            )}

                          </td>


                          {/* =================================================
                              AMOUNT
                          ================================================= */}

                          <td>

                            <strong
                              className={`payment-amount ${
                                status.className ===
                                "refunded"
                                  ? "refund-amount"
                                  : ""
                              }`}
                            >

                              {status.className ===
                              "refunded"
                                ? `+ ${formatCurrency(
                                    amount
                                  )}`
                                : formatCurrency(
                                    amount
                                  )}

                            </strong>

                          </td>


                          {/* =================================================
                              METHOD
                          ================================================= */}

                          <td>

                            <span className="payment-method">

                              {paymentMethod}

                            </span>

                          </td>


                          {/* =================================================
                              STATUS
                          ================================================= */}

                          <td>

                            <span
                              className={`payment-status ${status.className}`}
                            >

                              {status.icon}

                              {status.label}

                            </span>

                          </td>


                          {/* =================================================
                              ACTION
                          ================================================= */}

                          <td>

                            <div className="payment-actions">


                              {/* VIEW */}

                              <button
                                type="button"
                                title="View Payment"
                                onClick={() =>
                                  handleViewPayment(
                                    payment
                                  )
                                }
                              >

                                <FaEye />

                              </button>


                              {/* DOWNLOAD */}

                              <button
                                type="button"
                                title="Download Receipt"
                                onClick={() =>
                                  handleDownloadReceipt(
                                    payment
                                  )
                                }
                              >

                                <FaDownload />

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}


                </tbody>

              </table>


              {/* =================================================
                  NO PAYMENTS
              ================================================= */}

              {filteredPayments.length === 0 && (

                <div className="customer-no-payments">

                  <FaCreditCard />

                  <h2>
                    No Payments Found
                  </h2>

                  <p>

                    {filter === "All Payments"
                      ? "You do not have any payment transactions yet."
                      : `You do not have any ${filter.toLowerCase()} transactions.`}

                  </p>

                </div>

              )}

            </div>

          </div>

        </main>

      </div>

    </>

  );

}

export default CustomerPayments;