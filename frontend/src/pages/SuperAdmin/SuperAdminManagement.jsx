import React, { useState } from "react";

import {
  FaUsersCog,
  FaUserShield,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaChevronDown,
} from "react-icons/fa";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

import "./SuperAdminManagement.css";


// =====================================================
// INITIAL ADMIN DATA
// =====================================================

const initialAdmins = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul.kumar@shnoorhotel.com",
    phone: "+91 98765 43210",
    hotel: "Shnoor Grand Hotel",
    role: "Hotel Administrator",
    status: "Active",
    joined: "12 Jan 2026",
    avatar: "RK",
  },

  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@shnoorhotel.com",
    phone: "+91 98765 12345",
    hotel: "Shnoor Palace",
    role: "Hotel Administrator",
    status: "Active",
    joined: "25 Feb 2026",
    avatar: "PS",
  },

  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun.reddy@shnoorhotel.com",
    phone: "+91 99887 66554",
    hotel: "Shnoor Residency",
    role: "Hotel Administrator",
    status: "Inactive",
    joined: "18 Mar 2026",
    avatar: "AR",
  },

  {
    id: 4,
    name: "Sneha Rao",
    email: "sneha.rao@shnoorhotel.com",
    phone: "+91 91234 56789",
    hotel: "Shnoor Grand Hotel",
    role: "Hotel Administrator",
    status: "Active",
    joined: "06 Apr 2026",
    avatar: "SR",
  },

  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@shnoorhotel.com",
    phone: "+91 93456 78901",
    hotel: "Shnoor Palace",
    role: "Hotel Administrator",
    status: "Pending",
    joined: "21 May 2026",
    avatar: "VS",
  },

  {
    id: 6,
    name: "Ananya Reddy",
    email: "ananya.reddy@shnoorhotel.com",
    phone: "+91 94567 89012",
    hotel: "Shnoor Residency",
    role: "Hotel Administrator",
    status: "Active",
    joined: "02 Jun 2026",
    avatar: "AR",
  },
];


// =====================================================
// SUPER ADMIN MANAGEMENT
// =====================================================

function SuperAdminManagement() {

  const [admins, setAdmins] = useState(initialAdmins);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [modalType, setModalType] = useState("add");

  const [selectedAdmin, setSelectedAdmin] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    role: "Hotel Administrator",
    status: "Active",
  });


  // ===================================================
  // FILTER ADMINS
  // ===================================================

  const filteredAdmins = admins.filter((admin) => {

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      admin.name.toLowerCase().includes(search) ||
      admin.email.toLowerCase().includes(search) ||
      admin.hotel.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      admin.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  // ===================================================
  // OPEN ADD MODAL
  // ===================================================

  const handleAddAdmin = () => {

    setModalType("add");

    setSelectedAdmin(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      hotel: "",
      role: "Hotel Administrator",
      status: "Active",
    });

    setShowModal(true);
  };


  // ===================================================
  // OPEN EDIT MODAL
  // ===================================================

  const handleEditAdmin = (admin) => {

    setModalType("edit");

    setSelectedAdmin(admin);

    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      hotel: admin.hotel,
      role: admin.role,
      status: admin.status,
    });

    setShowModal(true);
  };


  // ===================================================
  // VIEW ADMIN
  // ===================================================

  const handleViewAdmin = (admin) => {

    setModalType("view");

    setSelectedAdmin(admin);

    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      hotel: admin.hotel,
      role: admin.role,
      status: admin.status,
    });

    setShowModal(true);
  };


  // ===================================================
  // DELETE ADMIN
  // ===================================================

  const handleDeleteAdmin = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this administrator?"
    );

    if (!confirmed) {
      return;
    }

    setAdmins((currentAdmins) =>
      currentAdmins.filter((admin) => admin.id !== id)
    );
  };


  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleInputChange = (event) => {

    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };


  // ===================================================
  // SAVE ADMIN
  // ===================================================

  const handleSaveAdmin = (event) => {

    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.hotel
    ) {
      window.alert("Please fill in all required fields.");
      return;
    }


    if (modalType === "add") {

      const newAdmin = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        hotel: formData.hotel,
        role: formData.role,
        status: formData.status,
        joined: "11 Aug 2026",
        avatar: formData.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
      };

      setAdmins((currentAdmins) => [
        newAdmin,
        ...currentAdmins,
      ]);

    } else {

      setAdmins((currentAdmins) =>
        currentAdmins.map((admin) =>
          admin.id === selectedAdmin.id
            ? {
                ...admin,
                ...formData,
              }
            : admin
        )
      );
    }

    setShowModal(false);
  };


  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal = () => {
    setShowModal(false);
    setSelectedAdmin(null);
  };


  // ===================================================
  // STATISTICS
  // ===================================================

  const totalAdmins = admins.length;

  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active"
  ).length;

  const inactiveAdmins = admins.filter(
    (admin) => admin.status === "Inactive"
  ).length;

  const pendingAdmins = admins.filter(
    (admin) => admin.status === "Pending"
  ).length;


  // ===================================================
  // JSX
  // ===================================================

  return (
    <div className="super-admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <SuperAdminSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="super-admin-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <SuperAdminTopbar />


        {/* =================================================
            PAGE
        ================================================= */}

        <main className="super-admin-management">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="management-header">

            <div className="management-header-left">

              <div className="management-header-icon">
                <FaUsersCog />
              </div>

              <div>
                <h1>Admin Management</h1>

                <p>
                  Manage hotel administrators and their access
                </p>
              </div>

            </div>


            <button
              className="add-admin-button"
              onClick={handleAddAdmin}
            >
              <FaUserPlus />
              Add Administrator
            </button>

          </section>


          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="management-stats">


            <div className="management-stat-card total">

              <div className="management-stat-icon">
                <FaUsersCog />
              </div>

              <div>
                <span>Total Administrators</span>
                <strong>{totalAdmins}</strong>
                <small>Registered administrators</small>
              </div>

            </div>


            <div className="management-stat-card active">

              <div className="management-stat-icon">
                <FaCheckCircle />
              </div>

              <div>
                <span>Active</span>
                <strong>{activeAdmins}</strong>
                <small>Currently active</small>
              </div>

            </div>


            <div className="management-stat-card pending">

              <div className="management-stat-icon">
                <FaUserShield />
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingAdmins}</strong>
                <small>Awaiting activation</small>
              </div>

            </div>


            <div className="management-stat-card inactive">

              <div className="management-stat-icon">
                <FaTimesCircle />
              </div>

              <div>
                <span>Inactive</span>
                <strong>{inactiveAdmins}</strong>
                <small>Currently inactive</small>
              </div>

            </div>


          </section>


          {/* =================================================
              ADMIN TABLE CARD
          ================================================= */}

          <section className="admin-management-card">


            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="admin-management-toolbar">

              <div>

                <h2>Administrators</h2>

                <p>
                  View and manage all hotel administrators
                </p>

              </div>


              <div className="admin-toolbar-actions">


                {/* SEARCH */}

                <div className="admin-search">

                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search administrators..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                  />

                </div>


                {/* FILTER */}

                <div className="admin-filter">

                  <FaFilter />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >

                    <option value="All">
                      All Status
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                  <FaChevronDown />

                </div>

              </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="admin-table-wrapper">

              <table className="admin-management-table">

                <thead>

                  <tr>

                    <th>Administrator</th>

                    <th>Contact</th>

                    <th>Hotel</th>

                    <th>Role</th>

                    <th>Status</th>

                    <th>Joined</th>

                    <th>Actions</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAdmins.length > 0 ? (

                    filteredAdmins.map((admin) => (

                      <tr key={admin.id}>


                        {/* ADMIN */}

                        <td>

                          <div className="admin-user-cell">

                            <div className="admin-avatar">
                              {admin.avatar}
                            </div>

                            <div>

                              <strong>
                                {admin.name}
                              </strong>

                              <span>
                                Administrator ID: #{admin.id}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CONTACT */}

                        <td>

                          <div className="contact-cell">

                            <span>
                              <FaEnvelope />
                              {admin.email}
                            </span>

                            <span>
                              <FaPhone />
                              {admin.phone}
                            </span>

                          </div>

                        </td>


                        {/* HOTEL */}

                        <td>

                          <div className="hotel-cell">

                            <div className="hotel-icon">
                              <FaBuilding />
                            </div>

                            <span>
                              {admin.hotel}
                            </span>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td>

                          <span className="role-badge">
                            <FaUserShield />
                            {admin.role}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`admin-status ${admin.status.toLowerCase()}`}
                          >

                            {admin.status === "Active" && (
                              <FaCheckCircle />
                            )}

                            {admin.status === "Inactive" && (
                              <FaTimesCircle />
                            )}

                            {admin.status === "Pending" && (
                              <FaUserShield />
                            )}

                            {admin.status}

                          </span>

                        </td>


                        {/* JOINED */}

                        <td>

                          <div className="joined-cell">

                            <FaCalendarAlt />

                            <span>
                              {admin.joined}
                            </span>

                          </div>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="admin-actions">


                            <button
                              className="action-button view"
                              title="View Administrator"
                              onClick={() =>
                                handleViewAdmin(admin)
                              }
                            >
                              <FaEye />
                            </button>


                            <button
                              className="action-button edit"
                              title="Edit Administrator"
                              onClick={() =>
                                handleEditAdmin(admin)
                              }
                            >
                              <FaEdit />
                            </button>


                            <button
                              className="action-button delete"
                              title="Delete Administrator"
                              onClick={() =>
                                handleDeleteAdmin(admin.id)
                              }
                            >
                              <FaTrash />
                            </button>


                          </div>

                        </td>


                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="no-admins"
                      >

                        <FaUsersCog />

                        <strong>
                          No administrators found
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


            {/* =================================================
                TABLE FOOTER
            ================================================= */}

            <div className="admin-table-footer">

              <span>
                Showing {filteredAdmins.length} of {admins.length} administrators
              </span>

              <span>
                Administrator management
              </span>

            </div>


          </section>


        </main>

      </div>


      {/* =====================================================
          ADD / EDIT / VIEW MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <div className="admin-modal-title-icon">
                  {modalType === "view" ? (
                    <FaEye />
                  ) : modalType === "edit" ? (
                    <FaEdit />
                  ) : (
                    <FaUserPlus />
                  )}
                </div>

                <div>

                  <h2>
                    {modalType === "view"
                      ? "Administrator Details"
                      : modalType === "edit"
                      ? "Edit Administrator"
                      : "Add Administrator"}
                  </h2>

                  <p>
                    {modalType === "view"
                      ? "View administrator information"
                      : modalType === "edit"
                      ? "Update administrator information"
                      : "Create a new hotel administrator"}
                  </p>

                </div>

              </div>


              <button
                className="modal-close"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

            </div>


            {/* MODAL BODY */}

            {modalType === "view" ? (

              <div className="admin-details">


                <div className="details-profile">

                  <div className="details-avatar">
                    {selectedAdmin?.avatar}
                  </div>

                  <div>

                    <h3>
                      {selectedAdmin?.name}
                    </h3>

                    <span>
                      {selectedAdmin?.role}
                    </span>

                  </div>

                </div>


                <div className="details-grid">


                  <div className="details-item">
                    <FaEnvelope />
                    <div>
                      <span>Email</span>
                      <strong>
                        {selectedAdmin?.email}
                      </strong>
                    </div>
                  </div>


                  <div className="details-item">
                    <FaPhone />
                    <div>
                      <span>Phone</span>
                      <strong>
                        {selectedAdmin?.phone}
                      </strong>
                    </div>
                  </div>


                  <div className="details-item">
                    <FaBuilding />
                    <div>
                      <span>Hotel</span>
                      <strong>
                        {selectedAdmin?.hotel}
                      </strong>
                    </div>
                  </div>


                  <div className="details-item">
                    <FaCalendarAlt />
                    <div>
                      <span>Joined</span>
                      <strong>
                        {selectedAdmin?.joined}
                      </strong>
                    </div>
                  </div>


                </div>


                <div className="details-status">

                  <span>
                    Account Status
                  </span>

                  <strong
                    className={`admin-status ${selectedAdmin?.status.toLowerCase()}`}
                  >

                    {selectedAdmin?.status === "Active" && (
                      <FaCheckCircle />
                    )}

                    {selectedAdmin?.status === "Inactive" && (
                      <FaTimesCircle />
                    )}

                    {selectedAdmin?.status === "Pending" && (
                      <FaUserShield />
                    )}

                    {selectedAdmin?.status}

                  </strong>

                </div>


              </div>

            ) : (

              <form
                className="admin-form"
                onSubmit={handleSaveAdmin}
              >


                <div className="form-grid">


                  <div className="form-group">

                    <label>
                      Full Name
                    </label>

                    <div className="input-with-icon">

                      <FaUsersCog />

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <div className="input-with-icon">

                      <FaEnvelope />

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <div className="input-with-icon">

                      <FaPhone />

                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Hotel
                    </label>

                    <div className="input-with-icon">

                      <FaBuilding />

                      <input
                        type="text"
                        name="hotel"
                        placeholder="Enter hotel name"
                        value={formData.hotel}
                        onChange={handleInputChange}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Role
                    </label>

                    <div className="select-with-icon">

                      <FaUserShield />

                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >

                        <option>
                          Hotel Administrator
                        </option>

                        <option>
                          Senior Administrator
                        </option>

                        <option>
                          Operations Manager
                        </option>

                      </select>

                      <FaChevronDown />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <div className="select-with-icon">

                      <FaCheckCircle />

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >

                        <option value="Active">
                          Active
                        </option>

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>

                      </select>

                      <FaChevronDown />

                    </div>

                  </div>


                </div>


                {/* FORM BUTTONS */}

                <div className="admin-form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                  >
                    <FaTimes />
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="save-button"
                  >
                    <FaSave />

                    {modalType === "edit"
                      ? "Save Changes"
                      : "Create Administrator"}
                  </button>

                </div>


              </form>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


export default SuperAdminManagement;