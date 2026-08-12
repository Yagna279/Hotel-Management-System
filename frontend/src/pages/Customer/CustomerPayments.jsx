import React from "react";
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
} from "react-icons/fa";

import "./CustomerPayments.css";

function CustomerPayments() {
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

              <h1>My Payments</h1>

              <p>
                View and manage your hotel payment history.
              </p>
            </div>

          </div>

          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

          <div className="customer-payment-summary">

            {/* Total Spent */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon blue">
                <FaCreditCard />
              </div>

              <div>
                <span>Total Spent</span>
                <strong>₹35,500</strong>
                <small>All payments</small>
              </div>

            </div>

            {/* Completed */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <span>Completed</span>
                <strong>₹28,500</strong>
                <small>Successful payments</small>
              </div>

            </div>

            {/* Pending */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon orange">
                <FaClock />
              </div>

              <div>
                <span>Pending</span>
                <strong>₹7,000</strong>
                <small>Awaiting payment</small>
              </div>

            </div>

            {/* Refunds */}

            <div className="customer-payment-summary-card">

              <div className="customer-payment-summary-icon purple">
                <FaArrowUp />
              </div>

              <div>
                <span>Refunds</span>
                <strong>₹2,500</strong>
                <small>Total refunds</small>
              </div>

            </div>

          </div>

          {/* =================================================
              PAYMENT HISTORY
          ================================================= */}

          <div className="customer-payments-card">

            {/* Card Header */}

            <div className="customer-payments-card-header">

              <div>
                <h2>Payment History</h2>

                <p>
                  Your recent transactions
                </p>
              </div>

              <button
                type="button"
                className="customer-payment-filter"
              >
                All Payments
              </button>

            </div>

            {/* =================================================
                PAYMENT TABLE
            ================================================= */}

            <div className="customer-payment-table-wrapper">

              <table className="customer-payment-table">

                <thead>

                  <tr>
                    <th>Transaction</th>
                    <th>Booking</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {/* =================================================
                      PAYMENT 1
                  ================================================= */}

                  <tr>

                    <td>
                      <div className="customer-transaction-cell">

                        <div className="customer-transaction-icon">
                          <FaCreditCard />
                        </div>

                        <div>
                          <strong>#PAY-1001</strong>
                          <span>Room booking</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="customer-booking-cell">
                        <strong>101 - Deluxe Room</strong>
                        <span>06 Aug 2026</span>
                      </div>
                    </td>

                    <td>
                      06 Aug 2026
                    </td>

                    <td>
                      <strong className="payment-amount">
                        ₹12,500
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        Card
                      </span>
                    </td>

                    <td>
                      <span className="payment-status completed">
                        <FaCheckCircle />
                        Completed
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">

                        <button
                          type="button"
                          title="View Payment"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>

                      </div>
                    </td>

                  </tr>

                  {/* =================================================
                      PAYMENT 2
                  ================================================= */}

                  <tr>

                    <td>
                      <div className="customer-transaction-cell">

                        <div className="customer-transaction-icon">
                          <FaCreditCard />
                        </div>

                        <div>
                          <strong>#PAY-1002</strong>
                          <span>Room booking</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="customer-booking-cell">
                        <strong>205 - Premium Room</strong>
                        <span>15 Aug 2026</span>
                      </div>
                    </td>

                    <td>
                      05 Aug 2026
                    </td>

                    <td>
                      <strong className="payment-amount">
                        ₹10,000
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        UPI
                      </span>
                    </td>

                    <td>
                      <span className="payment-status completed">
                        <FaCheckCircle />
                        Completed
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">

                        <button
                          type="button"
                          title="View Payment"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>

                      </div>
                    </td>

                  </tr>

                  {/* =================================================
                      PAYMENT 3
                  ================================================= */}

                  <tr>

                    <td>
                      <div className="customer-transaction-cell">

                        <div className="customer-transaction-icon">
                          <FaCreditCard />
                        </div>

                        <div>
                          <strong>#PAY-1003</strong>
                          <span>Room booking</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="customer-booking-cell">
                        <strong>309 - Suite Room</strong>
                        <span>22 Jul 2026</span>
                      </div>
                    </td>

                    <td>
                      20 Jul 2026
                    </td>

                    <td>
                      <strong className="payment-amount">
                        ₹8,000
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        Card
                      </span>
                    </td>

                    <td>
                      <span className="payment-status completed">
                        <FaCheckCircle />
                        Completed
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">

                        <button
                          type="button"
                          title="View Payment"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>

                      </div>
                    </td>

                  </tr>

                  {/* =================================================
                      PAYMENT 4
                  ================================================= */}

                  <tr>

                    <td>
                      <div className="customer-transaction-cell">

                        <div className="customer-transaction-icon">
                          <FaCreditCard />
                        </div>

                        <div>
                          <strong>#PAY-1004</strong>
                          <span>Additional service</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="customer-booking-cell">
                        <strong>Airport Transfer</strong>
                        <span>Service payment</span>
                      </div>
                    </td>

                    <td>
                      08 Aug 2026
                    </td>

                    <td>
                      <strong className="payment-amount">
                        ₹2,500
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        UPI
                      </span>
                    </td>

                    <td>
                      <span className="payment-status pending">
                        <FaClock />
                        Pending
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">

                        <button
                          type="button"
                          title="View Payment"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>

                      </div>
                    </td>

                  </tr>

                  {/* =================================================
                      PAYMENT 5
                  ================================================= */}

                  <tr>

                    <td>
                      <div className="customer-transaction-cell">

                        <div className="customer-transaction-icon refund">
                          <FaArrowUp />
                        </div>

                        <div>
                          <strong>#REF-1001</strong>
                          <span>Booking refund</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="customer-booking-cell">
                        <strong>Booking #BK-1003</strong>
                        <span>Refund processed</span>
                      </div>
                    </td>

                    <td>
                      02 Aug 2026
                    </td>

                    <td>
                      <strong className="payment-amount refund-amount">
                        + ₹2,500
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        Card
                      </span>
                    </td>

                    <td>
                      <span className="payment-status refunded">
                        <FaCheckCircle />
                        Refunded
                      </span>
                    </td>

                    <td>
                      <div className="payment-actions">

                        <button
                          type="button"
                          title="View Payment"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Download Receipt"
                        >
                          <FaDownload />
                        </button>

                      </div>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </main>

      </div>
    </>
  );
}

export default CustomerPayments;