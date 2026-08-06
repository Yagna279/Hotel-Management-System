import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaConciergeBell,
  FaPlus,
  FaSpa,
  FaUtensils,
  FaCar,
  FaWifi,
} from "react-icons/fa";

import "./AdminServices.css";

function Services() {
  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          <div className="services-header">

            <div>
              <h1>Hotel Services</h1>
              <p>Manage all hotel services</p>
            </div>

            <button className="add-service-btn">
              <FaPlus />
              Add Service
            </button>

          </div>

          {/* Statistics */}

          <div className="service-stats">

            <div className="service-card">

              <FaConciergeBell className="service-icon blue"/>

              <h2>18</h2>

              <p>Total Services</p>

            </div>

            <div className="service-card">

              <FaUtensils className="service-icon green"/>

              <h2>8</h2>

              <p>Food Services</p>

            </div>

            <div className="service-card">

              <FaSpa className="service-icon orange"/>

              <h2>5</h2>

              <p>Spa & Wellness</p>

            </div>

            <div className="service-card">

              <FaCar className="service-icon purple"/>

              <h2>5</h2>

              <p>Transport</p>

            </div>

          </div>

          {/* Services Table */}

          <div className="services-table-card">

            <table>

              <thead>

                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>Breakfast Buffet</td>
                  <td>Food</td>
                  <td>₹500</td>
                  <td>24/7</td>

                  <td>
                    <span className="status confirmed">
                      Active
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Spa Treatment</td>
                  <td>Wellness</td>
                  <td>₹2,500</td>
                  <td>09:00 - 20:00</td>

                  <td>
                    <span className="status confirmed">
                      Active
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Airport Pickup</td>
                  <td>Transport</td>
                  <td>₹1,200</td>
                  <td>On Request</td>

                  <td>
                    <span className="status pending">
                      Limited
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>High Speed Wi-Fi</td>
                  <td>Internet</td>
                  <td>Free</td>
                  <td>24/7</td>

                  <td>
                    <span className="status checked">
                      Available
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>

                </tr>

                <tr>

                  <td>Room Cleaning</td>
                  <td>Housekeeping</td>
                  <td>Free</td>
                  <td>24/7</td>

                  <td>
                    <span className="status confirmed">
                      Active
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          {/* Service Cards */}

          <div className="service-grid">

            <div className="service-box">
              <FaUtensils className="grid-icon"/>
              <h3>Restaurant</h3>
              <p>Premium food & beverages</p>
            </div>

            <div className="service-box">
              <FaSpa className="grid-icon"/>
              <h3>Spa</h3>
              <p>Relaxation & wellness</p>
            </div>

            <div className="service-box">
              <FaCar className="grid-icon"/>
              <h3>Transport</h3>
              <p>Airport pickup & drop</p>
            </div>

            <div className="service-box">
              <FaWifi className="grid-icon"/>
              <h3>Wi-Fi</h3>
              <p>Unlimited internet access</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Services;