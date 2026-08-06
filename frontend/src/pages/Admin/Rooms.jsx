import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Rooms.css";

import {
  FaBed,
  FaPlus,
  FaDoorOpen,
  FaTools,
} from "react-icons/fa";

function Rooms() {
  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          <div className="rooms-header">

            <div>
              <h1>Rooms Management</h1>
              <p>Manage Hotel Rooms Efficiently</p>
            </div>

            <button className="add-room-btn">
              <FaPlus />
              Add Room
            </button>

          </div>

          <div className="room-stats">

  <div className="room-card">

    <div className="icon-box blue">
      <FaBed className="room-icon" />
    </div>

    <div>
      <h2>150</h2>
      <p>Total Rooms</p>
    </div>

  </div>

  <div className="room-card">

    <div className="icon-box green">
      <FaDoorOpen className="room-icon" />
    </div>

    <div>
      <h2>120</h2>
      <p>Available</p>
    </div>

  </div>

  <div className="room-card">

    <div className="icon-box orange">
      <FaBed className="room-icon" />
    </div>

    <div>
      <h2>25</h2>
      <p>Occupied</p>
    </div>

  </div>

  <div className="room-card">

    <div className="icon-box red">
      <FaTools className="room-icon" />
    </div>

    <div>
      <h2>5</h2>
      <p>Maintenance</p>
    </div>

  </div>

</div>

          <div className="rooms-table-card">

            <table>

              <thead>

                <tr>
                  <th>Room No</th>
                  <th>Type</th>
                  <th>Floor</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>101</td>
                  <td>Deluxe</td>
                  <td>1</td>
                  <td>₹3,500</td>

                  <td>
                    <span className="status available">
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
                  <td>102</td>
                  <td>Suite</td>
                  <td>1</td>
                  <td>₹6,500</td>

                  <td>
                    <span className="status occupied">
                      Occupied
                    </span>
                  </td>

                  <td>
                    <button className="edit-btn">
                      Edit
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>205</td>
                  <td>Standard</td>
                  <td>2</td>
                  <td>₹2,500</td>

                  <td>
                    <span className="status maintenance">
                      Maintenance
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

        </div>

      </div>

    </div>
  );
}

export default Rooms;