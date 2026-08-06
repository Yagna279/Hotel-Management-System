import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaUsers,
  FaUserPlus,
  FaCrown,
  FaSearch,
} from "react-icons/fa";

import "./CustomerManagement.css";

function CustomerManagement() {
  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* Header */}

          <div className="customer-header">

            <div>
              <h1>Customer Management</h1>
              <p>Manage hotel customers</p>
            </div>

            <button className="add-customer-btn">
              <FaUserPlus />
              Add Customer
            </button>

          </div>

          {/* Statistics */}

          <div className="customer-stats">

            <div className="customer-card">

              <div className="icon-box blue">
                <FaUsers className="customer-icon" />
              </div>

              <h2>245</h2>
              <p>Total Customers</p>

            </div>

            <div className="customer-card">

              <div className="icon-box green">
                <FaUsers className="customer-icon" />
              </div>

              <h2>186</h2>
              <p>Active Customers</p>

            </div>

            <div className="customer-card">

              <div className="icon-box orange">
                <FaCrown className="customer-icon" />
              </div>

              <h2>18</h2>
              <p>VIP Customers</p>

            </div>

            <div className="customer-card">

              <div className="icon-box purple">
                <FaUserPlus className="customer-icon" />
              </div>

              <h2>14</h2>
              <p>New This Month</p>

            </div>

          </div>

          {/* Search */}

          <div className="customer-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search customers..."
            />

          </div>

          {/* Customer Table */}

          <div className="customer-table-card">

            <table>

              <thead>

                <tr>

                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Status</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>Yagna</td>
                  <td>yagna@gmail.com</td>
                  <td>9876543210</td>
                  <td>101</td>
                  <td>05 Aug</td>

                  <td>
                    <span className="status confirmed">
                      Checked In
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      View
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Eswar</td>
                  <td>eswar@gmail.com</td>
                  <td>9876543211</td>
                  <td>205</td>
                  <td>08 Aug</td>

                  <td>
                    <span className="status pending">
                      Reserved
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      View
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Mihika</td>
                  <td>mihika@gmail.com</td>
                  <td>9876543212</td>
                  <td>309</td>
                  <td>10 Aug</td>

                  <td>
                    <span className="status checked">
                      Checked Out
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      View
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Rahul</td>
                  <td>rahul@gmail.com</td>
                  <td>9876543213</td>
                  <td>402</td>
                  <td>12 Aug</td>

                  <td>
                    <span className="status confirmed">
                      Checked In
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      View
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Sneha</td>
                  <td>sneha@gmail.com</td>
                  <td>9876543214</td>
                  <td>506</td>
                  <td>15 Aug</td>

                  <td>
                    <span className="status pending">
                      Reserved
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      View
                    </button>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerManagement;