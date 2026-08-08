import React, { useState } from "react";
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

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* Header */}

          <div className="payments-header">

            <div>
              <h1>Payments</h1>
              <p>Manage Hotel Payment Transactions</p>
            </div>

            <div className="payment-buttons">

              <button
                className="add-payment-btn"
                onClick={() => setShowPaymentForm(true)}
              >
                <FaPlus />
                Add Payment
              </button>

              <button className="invoice-btn">
                <FaFileInvoiceDollar />
                Generate Invoice
              </button>

            </div>

          </div>

          {/* Statistics */}

          <div className="payment-stats">

            <div className="payment-card">

              <div className="icon-box blue">
                <FaMoneyBillWave className="payment-icon" />
              </div>

              <div>
                <h2>₹4,58,600</h2>
                <p>Total Revenue</p>
              </div>

            </div>

            <div className="payment-card">

              <div className="icon-box green">
                <FaCheckCircle className="payment-icon" />
              </div>

              <div>
                <h2>₹3,95,400</h2>
                <p>Paid</p>
              </div>

            </div>

            <div className="payment-card">

              <div className="icon-box orange">
                <FaClock className="payment-icon" />
              </div>

              <div>
                <h2>₹48,200</h2>
                <p>Pending</p>
              </div>

            </div>

            <div className="payment-card">

              <div className="icon-box red">
                <FaUndoAlt className="payment-icon" />
              </div>

              <div>
                <h2>₹15,000</h2>
                <p>Refunds</p>
              </div>

            </div>

          </div>

          {/* Recent Payments */}

          <div className="payments-table">

            <h2>Recent Payments</h2>

            <table>

              <thead>

                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>#INV1001</td>
                  <td>Yagna</td>
                  <td>101</td>
                  <td>₹12,500</td>
                  <td>Credit Card</td>
                  <td>
                    <span className="status confirmed">
                      Paid
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#INV1002</td>
                  <td>Dileep</td>
                  <td>204</td>
                  <td>₹8,500</td>
                  <td>UPI</td>
                  <td>
                    <span className="status pending">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#INV1003</td>
                  <td>Mounika</td>
                  <td>308</td>
                  <td>₹15,000</td>
                  <td>Cash</td>
                  <td>
                    <span className="status confirmed">
                      Paid
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#INV1004</td>
                  <td>Siri</td>
                  <td>502</td>
                  <td>₹18,500</td>
                  <td>Net Banking</td>
                  <td>
                    <span className="status checked">
                      Completed
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>
                {/* Add Payment Modal */}

      {showPaymentForm && (

        <div className="payment-modal">

          <div className="payment-form">

            <h2>Add Payment</h2>

            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Payment Type</label>

              <select>

                <option>Select Payment Type</option>

                <option>Cash</option>

                <option>Credit Card</option>

                <option>Debit Card</option>

                <option>UPI</option>

                <option>Net Banking</option>

                <option>Wallet</option>

              </select>

            </div>

            <div className="form-group">
              <label>Paid Amount</label>
              <input
                type="number"
                placeholder="Enter paid amount"
              />
            </div>

            <div className="form-buttons">

              <button
                className="cancel-btn"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancel
              </button>

              <button
                className="submit-btn"
                onClick={() => {
                  alert("Payment Added Successfully!");
                  setShowPaymentForm(false);
                }}
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