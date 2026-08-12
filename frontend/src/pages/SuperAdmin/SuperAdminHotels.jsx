import React, { useState } from "react";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

import {
  FaHotel,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaUsers,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaEllipsisV,
} from "react-icons/fa";

import "./SuperAdminHotels.css";

function SuperAdminHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const hotels = [
    {
      id: 1,
      name: "Shnoor Grand Hotel",
      location: "Hyderabad, Telangana",
      rooms: 85,
      admins: 4,
      status: "Active",
      contact: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Shnoor Palace",
      location: "Bengaluru, Karnataka",
      rooms: 62,
      admins: 3,
      status: "Active",
      contact: "+91 98765 12345",
    },
    {
      id: 3,
      name: "Shnoor Residency",
      location: "Chennai, Tamil Nadu",
      rooms: 48,
      admins: 2,
      status: "Active",
      contact: "+91 91234 56789",
    },
    {
      id: 4,
      name: "Shnoor Suites",
      location: "Mumbai, Maharashtra",
      rooms: 36,
      admins: 2,
      status: "Inactive",
      contact: "+91 99887 66554",
    },
    {
      id: 5,
      name: "Shnoor Elite",
      location: "Pune, Maharashtra",
      rooms: 55,
      admins: 3,
      status: "Active",
      contact: "+91 90123 45678",
    },
  ];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || hotel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="super-admin-layout">

      {/* SIDEBAR */}
      <SuperAdminSidebar />

      {/* MAIN AREA */}
      <div className="super-admin-main">

        {/* TOPBAR */}
        <SuperAdminTopbar />

        {/* PAGE CONTENT */}
        <main className="super-admin-hotels-page">

          {/* PAGE HEADER */}
          <section className="hotels-page-header">

            <div className="hotels-title-section">

              <div className="hotels-title-icon">
                <FaHotel />
              </div>

              <div>
                <h1>Hotel Management</h1>
                <p>
                  Manage all hotels connected to your hotel management system.
                </p>
              </div>

            </div>

            <button className="add-hotel-btn">
              <FaPlus />
              Add Hotel
            </button>

          </section>

          {/* STATISTICS */}
          <section className="hotel-stat-grid">

            <div className="hotel-stat-card blue">

              <div className="hotel-stat-icon">
                <FaHotel />
              </div>

              <div>
                <span>Total Hotels</span>
                <strong>{hotels.length}</strong>
                <small>Registered hotels</small>
              </div>

            </div>

            <div className="hotel-stat-card green">

              <div className="hotel-stat-icon">
                <FaCheckCircle />
              </div>

              <div>
                <span>Active Hotels</span>
                <strong>
                  {hotels.filter((hotel) => hotel.status === "Active").length}
                </strong>
                <small>Currently operational</small>
              </div>

            </div>

            <div className="hotel-stat-card orange">

              <div className="hotel-stat-icon">
                <FaBed />
              </div>

              <div>
                <span>Total Rooms</span>
                <strong>
                  {hotels.reduce((total, hotel) => total + hotel.rooms, 0)}
                </strong>
                <small>Across all hotels</small>
              </div>

            </div>

            <div className="hotel-stat-card purple">

              <div className="hotel-stat-icon">
                <FaUsers />
              </div>

              <div>
                <span>Administrators</span>
                <strong>
                  {hotels.reduce((total, hotel) => total + hotel.admins, 0)}
                </strong>
                <small>Hotel administrators</small>
              </div>

            </div>

          </section>

          {/* MAIN CARD */}
          <section className="hotels-management-card">

            {/* CARD HEADER */}
            <div className="hotels-card-header">

              <div>
                <h2>All Hotels</h2>
                <p>
                  View and manage registered hotels
                </p>
              </div>

              <div className="hotels-header-actions">

                {/* SEARCH */}
                <div className="hotel-search">

                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search hotels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                </div>

                {/* FILTER */}
                <select
                  className="hotel-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

              </div>

            </div>

            {/* TABLE */}
            <div className="hotels-table-wrapper">

              <table className="hotels-table">

                <thead>

                  <tr>
                    <th>Hotel</th>
                    <th>Location</th>
                    <th>Rooms</th>
                    <th>Administrators</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredHotels.length > 0 ? (
                    filteredHotels.map((hotel) => (

                      <tr key={hotel.id}>

                        {/* HOTEL */}
                        <td>

                          <div className="hotel-name-cell">

                            <div className="hotel-avatar">
                              <FaHotel />
                            </div>

                            <div>
                              <strong>{hotel.name}</strong>
                              <span>
                                Hotel ID #{hotel.id}
                              </span>
                            </div>

                          </div>

                        </td>

                        {/* LOCATION */}
                        <td>

                          <div className="hotel-location">

                            <FaMapMarkerAlt />

                            <span>
                              {hotel.location}
                            </span>

                          </div>

                        </td>

                        {/* ROOMS */}
                        <td>

                          <div className="hotel-room-count">

                            <FaBed />

                            <span>
                              {hotel.rooms}
                            </span>

                          </div>

                        </td>

                        {/* ADMINS */}
                        <td>

                          <div className="hotel-admin-count">

                            <FaUsers />

                            <span>
                              {hotel.admins}
                            </span>

                          </div>

                        </td>

                        {/* CONTACT */}
                        <td>

                          <span className="hotel-contact">
                            {hotel.contact}
                          </span>

                        </td>

                        {/* STATUS */}
                        <td>

                          <span
                            className={`hotel-status ${
                              hotel.status === "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            {hotel.status === "Active" ? (
                              <FaCheckCircle />
                            ) : (
                              <FaTimesCircle />
                            )}

                            {hotel.status}

                          </span>

                        </td>

                        {/* ACTIONS */}
                        <td>

                          <div className="hotel-actions">

                            <button
                              className="hotel-action view"
                              title="View Hotel"
                            >
                              <FaEye />
                            </button>

                            <button
                              className="hotel-action edit"
                              title="Edit Hotel"
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="hotel-action delete"
                              title="Delete Hotel"
                            >
                              <FaTrash />
                            </button>

                            <button
                              className="hotel-action more"
                              title="More"
                            >
                              <FaEllipsisV />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))
                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="no-hotels"
                      >

                        <FaHotel />

                        <strong>
                          No hotels found
                        </strong>

                        <span>
                          Try changing your search or filter.
                        </span>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}
            <div className="hotels-card-footer">

              <span>
                Showing{" "}
                <strong>{filteredHotels.length}</strong>{" "}
                of{" "}
                <strong>{hotels.length}</strong>{" "}
                hotels
              </span>

              <div className="hotel-pagination">

                <button disabled>
                  Previous
                </button>

                <button className="active">
                  1
                </button>

                <button>
                  2
                </button>

                <button>
                  Next
                </button>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default SuperAdminHotels;