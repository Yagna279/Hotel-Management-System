import React, { useMemo, useState } from "react";

import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";

import {
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaChevronDown,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./SuperAdminUsers.css";

function SuperAdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");

  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul.k@email.com",
      phone: "+91 98765 43210",
      role: "Customer",
      status: "Active",
      joined: "10 Aug 2026",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.s@email.com",
      phone: "+91 98765 12345",
      role: "Customer",
      status: "Active",
      joined: "08 Aug 2026",
    },
    {
      id: 3,
      name: "Arjun Reddy",
      email: "arjun.r@email.com",
      phone: "+91 99887 66554",
      role: "Customer",
      status: "Active",
      joined: "05 Aug 2026",
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@shnoorhotel.com",
      phone: "+91 90000 11111",
      role: "Admin",
      status: "Active",
      joined: "01 Aug 2026",
    },
    {
      id: 5,
      name: "Hotel Manager",
      email: "manager@shnoorhotel.com",
      phone: "+91 90000 22222",
      role: "Admin",
      status: "Active",
      joined: "28 Jul 2026",
    },
    {
      id: 6,
      name: "Kiran Patel",
      email: "kiran.p@email.com",
      phone: "+91 91234 56789",
      role: "Customer",
      status: "Inactive",
      joined: "22 Jul 2026",
    },
    {
      id: 7,
      name: "Super Administrator",
      email: "superadmin@shnoorhotel.com",
      phone: "+91 91111 22222",
      role: "Super Admin",
      status: "Active",
      joined: "15 Jul 2026",
    },
  ]);

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const totalCustomers = users.filter(
    (user) => user.role === "Customer"
  ).length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  /* =========================================================
     OPEN ADD MODAL
  ========================================================= */

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalType("add");
    setShowModal(true);
  };

  /* =========================================================
     OPEN VIEW MODAL
  ========================================================= */

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType("view");
    setShowModal(true);
  };

  /* =========================================================
     OPEN EDIT MODAL
  ========================================================= */

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType("edit");
    setShowModal(true);
  };

  /* =========================================================
     DELETE USER
  ========================================================= */

  const handleDeleteUser = (id) => {
    const user = users.find((item) => item.id === id);

    if (!user) return;

    const confirmDelete = window.confirm(
      `Delete ${user.name}?`
    );

    if (!confirmDelete) return;

    setUsers((currentUsers) =>
      currentUsers.filter((item) => item.id !== id)
    );
  };

  /* =========================================================
     ADD / EDIT USER
  ========================================================= */

  const handleSubmitUser = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const role = formData.get("role");
    const status = formData.get("status");

    if (!name || !email || !phone || !role || !status) {
      return;
    }

    if (modalType === "edit" && selectedUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name,
                email,
                phone,
                role,
                status,
              }
            : user
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        role,
        status,
        joined: "Today",
      };

      setUsers((currentUsers) => [
        newUser,
        ...currentUsers,
      ]);
    }

    setShowModal(false);
    setSelectedUser(null);
  };

  /* =========================================================
     AVATAR LETTERS
  ========================================================= */

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* =========================================================
     ROLE ICON
  ========================================================= */

  const getRoleIcon = (role) => {
    if (role === "Super Admin") {
      return <FaShieldAlt />;
    }

    if (role === "Admin") {
      return <FaUserShield />;
    }

    return <FaUser />;
  };

  return (
    <div className="super-admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SuperAdminSidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="super-admin-main">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <SuperAdminTopbar />

        {/* ===================================================
            USERS PAGE
        =================================================== */}

        <main className="super-admin-users-page">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="users-page-header">

            <div className="users-page-title">

              <div className="users-title-icon">
                <FaUsers />
              </div>

              <div>
                <h1>User Management</h1>

                <p>
                  Manage customers, administrators and system users
                </p>
              </div>

            </div>

            <button
              className="add-user-btn"
              onClick={handleAddUser}
            >
              <FaPlus />
              Add User
            </button>

          </section>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="users-stats-grid">

            <div className="users-stat-card">

              <div className="users-stat-icon blue">
                <FaUsers />
              </div>

              <div>
                <span>Total Users</span>
                <strong>{totalUsers}</strong>
                <small>All registered users</small>
              </div>

            </div>

            <div className="users-stat-card">

              <div className="users-stat-icon green">
                <FaUserCheck />
              </div>

              <div>
                <span>Active Users</span>
                <strong>{activeUsers}</strong>
                <small>Currently active</small>
              </div>

            </div>

            <div className="users-stat-card">

              <div className="users-stat-icon purple">
                <FaUserTie />
              </div>

              <div>
                <span>Administrators</span>
                <strong>{totalAdmins}</strong>
                <small>System administrators</small>
              </div>

            </div>

            <div className="users-stat-card">

              <div className="users-stat-icon orange">
                <FaUser />
              </div>

              <div>
                <span>Customers</span>
                <strong>{totalCustomers}</strong>
                <small>Registered customers</small>
              </div>

            </div>

          </section>

          {/* =================================================
              USERS CARD
          ================================================= */}

          <section className="users-management-card">

            {/* ===============================================
                TOOLBAR
            =============================================== */}

            <div className="users-toolbar">

              <div className="users-toolbar-title">

                <h2>All Users</h2>

                <span>
                  {filteredUsers.length} users
                </span>

              </div>

              <div className="users-toolbar-controls">

                {/* SEARCH */}

                <div className="users-search">

                  <FaSearch />

                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                  />

                </div>

                {/* ROLE FILTER */}

                <div className="users-filter">

                  <FaFilter />

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value)
                    }
                  >
                    <option>All Roles</option>
                    <option>Customer</option>
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>

                  <FaChevronDown />

                </div>

                {/* STATUS FILTER */}

                <div className="users-filter">

                  <FaUserCheck />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>

                  <FaChevronDown />

                </div>

              </div>

            </div>

            {/* ===============================================
                TABLE
            =============================================== */}

            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (

                      <tr key={user.id}>

                        {/* USER */}

                        <td>

                          <div className="user-table-profile">

                            <div className="user-avatar">
                              {getInitials(user.name)}
                            </div>

                            <div className="user-profile-info">

                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                ID #{user.id}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CONTACT */}

                        <td>

                          <div className="user-contact">

                            <div>
                              <FaEnvelope />
                              {user.email}
                            </div>

                            <div>
                              <FaPhone />
                              {user.phone}
                            </div>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td>

                          <span
                            className={`user-role ${user.role
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`user-status ${user.status.toLowerCase()}`}
                          >

                            {user.status === "Active" ? (
                              <FaCheckCircle />
                            ) : (
                              <FaTimesCircle />
                            )}

                            {user.status}

                          </span>

                        </td>

                        {/* JOINED */}

                        <td>

                          <span className="joined-date">
                            {user.joined}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="user-actions">

                            <button
                              className="user-action view"
                              title="View User"
                              onClick={() =>
                                handleViewUser(user)
                              }
                            >
                              <FaEye />
                            </button>

                            <button
                              className="user-action edit"
                              title="Edit User"
                              onClick={() =>
                                handleEditUser(user)
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="user-action delete"
                              title="Delete User"
                              onClick={() =>
                                handleDeleteUser(user.id)
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
                        colSpan="6"
                        className="users-empty"
                      >

                        <div className="users-empty-icon">
                          <FaUsers />
                        </div>

                        <strong>
                          No users found
                        </strong>

                        <span>
                          Try changing your search or filters.
                        </span>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </main>

      </div>

      {/* =====================================================
          USER MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="user-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="user-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="user-modal-header">

              <div>

                <h2>
                  {modalType === "add"
                    ? "Add New User"
                    : modalType === "edit"
                    ? "Edit User"
                    : "User Details"}
                </h2>

                <p>
                  {modalType === "view"
                    ? "View user information"
                    : "Enter user information below"}
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>

            </div>

            {/* VIEW */}

            {modalType === "view" && selectedUser ? (

              <div className="user-view-content">

                <div className="user-view-avatar">
                  {getInitials(selectedUser.name)}
                </div>

                <h3>
                  {selectedUser.name}
                </h3>

                <span className="user-view-role">
                  {getRoleIcon(selectedUser.role)}
                  {selectedUser.role}
                </span>

                <div className="user-details-list">

                  <div>
                    <FaEnvelope />
                    <span>{selectedUser.email}</span>
                  </div>

                  <div>
                    <FaPhone />
                    <span>{selectedUser.phone}</span>
                  </div>

                  <div>
                    <FaUserCheck />
                    <span>{selectedUser.status}</span>
                  </div>

                  <div>
                    <FaUser />
                    <span>Joined {selectedUser.joined}</span>
                  </div>

                </div>

              </div>

            ) : (

              /* ADD / EDIT */

              <form
                className="user-form"
                onSubmit={handleSubmitUser}
              >

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Full Name
                    </label>

                    <div className="form-input">

                      <FaUser />

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        defaultValue={
                          selectedUser?.name || ""
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <div className="form-input">

                      <FaEnvelope />

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        defaultValue={
                          selectedUser?.email || ""
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <div className="form-input">

                      <FaPhone />

                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        defaultValue={
                          selectedUser?.phone || ""
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Role
                    </label>

                    <div className="form-input select-input">

                      <FaShieldAlt />

                      <select
                        name="role"
                        defaultValue={
                          selectedUser?.role ||
                          "Customer"
                        }
                      >
                        <option>
                          Customer
                        </option>

                        <option>
                          Admin
                        </option>

                        <option>
                          Super Admin
                        </option>
                      </select>

                    </div>

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Account Status
                  </label>

                  <div className="form-input select-input">

                    <FaUserCheck />

                    <select
                      name="status"
                      defaultValue={
                        selectedUser?.status ||
                        "Active"
                      }
                    >
                      <option>
                        Active
                      </option>

                      <option>
                        Inactive
                      </option>
                    </select>

                  </div>

                </div>

                <div className="user-form-actions">

                  <button
                    type="button"
                    className="cancel-user-btn"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-user-btn"
                  >
                    <FaCheckCircle />

                    {modalType === "edit"
                      ? "Update User"
                      : "Create User"}
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

export default SuperAdminUsers;