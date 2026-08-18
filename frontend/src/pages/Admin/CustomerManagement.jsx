import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./CustomerManagement.css";

import {
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function CustomerManagement() {

  // =========================
  // CUSTOMER DATA
  // =========================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================
  // SEARCH
  // =========================

  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // ADD CUSTOMER MODAL
  // =========================

  const [showAddModal, setShowAddModal] = useState(false);

  const [addingCustomer, setAddingCustomer] = useState(false);

  const [addError, setAddError] = useState("");

  // =========================
  // ADD CUSTOMER FORM
  // =========================

  const [customerForm, setCustomerForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  // =========================
  // EDIT CUSTOMER
  // =========================

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
  });

  const [savingEdit, setSavingEdit] = useState(false);

  const [editError, setEditError] = useState("");

  // ============================================================
  // FETCH CUSTOMERS
  // ============================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/customers"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      /*
        Backend may return:

        [
          {...},
          {...}
        ]

        OR

        {
          customers: [...]
        }
      */

      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }

    } catch (error) {

      console.error(
        "Error fetching customers:",
        error
      );

      setError(
        "Unable to load customers from database."
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================================================
  // ADD CUSTOMER BUTTON
  // ============================================================

  const handleOpenAddCustomer = () => {

    setCustomerForm({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
    });

    setAddError("");

    setShowAddModal(true);
  };

  // ============================================================
  // CLOSE ADD CUSTOMER MODAL
  // ============================================================

  const handleCloseAddCustomer = () => {

    if (addingCustomer) {
      return;
    }

    setShowAddModal(false);

    setAddError("");

    setCustomerForm({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
    });
  };

  // ============================================================
  // ADD CUSTOMER FORM CHANGE
  // ============================================================

  const handleCustomerFormChange = (e) => {

    const { name, value } = e.target;

    setCustomerForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // ADD CUSTOMER
  // ============================================================

  const handleAddCustomer = async (e) => {

    e.preventDefault();

    setAddError("");

    // Basic validation

    if (!customerForm.full_name.trim()) {
      setAddError("Full name is required.");
      return;
    }

    if (!customerForm.email.trim()) {
      setAddError("Email is required.");
      return;
    }

    if (!customerForm.phone.trim()) {
      setAddError("Phone number is required.");
      return;
    }

    if (!customerForm.password) {
      setAddError("Password is required.");
      return;
    }

    if (customerForm.password.length < 6) {
      setAddError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {

      setAddingCustomer(true);

      const response = await fetch(
        "http://localhost:5000/api/customers",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            full_name: customerForm.full_name.trim(),
            email: customerForm.email.trim(),
            phone: customerForm.phone.trim(),
            password: customerForm.password,
            role: customerForm.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add customer."
        );
      }

      // Close modal

      setShowAddModal(false);

      // Clear form

      setCustomerForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "customer",
      });

      // Refresh customers from database

      await fetchCustomers();

    } catch (error) {

      console.error(
        "Error adding customer:",
        error
      );

      setAddError(
        error.message ||
        "Failed to add customer."
      );

    } finally {

      setAddingCustomer(false);

    }
  };

  // ============================================================
  // EDIT CUSTOMER
  // ============================================================

  const handleEdit = (customer) => {

    setSelectedCustomer(customer);

    setEditForm({
      full_name: customer.full_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      role: customer.role || "customer",
      status: customer.status || "active",
    });

    setEditError("");

    setShowEditModal(true);
  };

  // ============================================================
  // CLOSE EDIT MODAL
  // ============================================================

  const handleCloseEdit = () => {

    if (savingEdit) {
      return;
    }

    setShowEditModal(false);

    setSelectedCustomer(null);

    setEditError("");

  };

  // ============================================================
  // EDIT FORM CHANGE
  // ============================================================

  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // ============================================================
  // SAVE CUSTOMER EDIT
  // ============================================================

  const handleSaveEdit = async (e) => {

    e.preventDefault();

    if (!selectedCustomer) {
      return;
    }

    setEditError("");

    try {

      setSavingEdit(true);

      const response = await fetch(
        `http://localhost:5000/api/customers/${selectedCustomer.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            full_name: editForm.full_name,
            email: editForm.email,
            phone: editForm.phone,
            role: editForm.role,
            status: editForm.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update customer."
        );
      }

      // Close modal

      handleCloseEdit();

      // Refresh from database

      await fetchCustomers();

    } catch (error) {

      console.error(
        "Error updating customer:",
        error
      );

      setEditError(
        error.message ||
        "Failed to update customer."
      );

    } finally {

      setSavingEdit(false);

    }
  };

  // ============================================================
  // SEARCH CUSTOMERS
  // ============================================================

  const filteredCustomers = customers.filter(
    (customer) => {

      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      return (
        customer.full_name
          ?.toLowerCase()
          .includes(search) ||

        customer.email
          ?.toLowerCase()
          .includes(search) ||

        customer.phone
          ?.toLowerCase()
          .includes(search) ||

        customer.role
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      customer.status?.toLowerCase() === "active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) =>
      customer.status?.toLowerCase() === "inactive"
  ).length;

  const vipCustomers = customers.filter(
    (customer) =>
      customer.role?.toLowerCase() === "vip"
  ).length;

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {

    switch (status?.toLowerCase()) {

      case "active":
        return "active";

      case "inactive":
        return "inactive";

      default:
        return "";
    }

  };

  // ============================================================
  // ROLE CLASS
  // ============================================================

  const getRoleClass = (role) => {

    switch (role?.toLowerCase()) {

      case "vip":
        return "vip";

      case "customer":
        return "customer";

      default:
        return "";
    }

  };

  // ============================================================
  // DISPLAY ROLE
  // ============================================================

  const formatRole = (role) => {

    if (!role) {
      return "Customer";
    }

    return (
      role.charAt(0).toUpperCase() +
      role.slice(1)
    );

  };

  // ============================================================
  // DISPLAY STATUS
  // ============================================================

  const formatStatus = (status) => {

    if (!status) {
      return "Active";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );

  };

  // ============================================================
  // RETURN
  // ============================================================

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="customer-header">

            <div>

              <h1>
                Customer Management
              </h1>

              <p>
                Manage hotel customers efficiently
              </p>

            </div>

            <button
              className="add-customer-btn"
              onClick={handleOpenAddCustomer}
            >

              <FaUserPlus />

              Add Customer

            </button>

          </div>


          {/* =====================================================
              SEARCH
          ====================================================== */}

          <div className="customer-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search customers by name, email, phone or role..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>


          {/* =====================================================
              STATISTICS
          ====================================================== */}

          <div className="customer-stats">

            {/* TOTAL */}

            <div className="customer-card">

              <div className="customer-icon blue">

                <FaUsers />

              </div>

              <div>

                <h2>
                  {totalCustomers}
                </h2>

                <p>
                  Total Customers
                </p>

              </div>

            </div>


            {/* ACTIVE */}

            <div className="customer-card">

              <div className="customer-icon green">

                <FaUserCheck />

              </div>

              <div>

                <h2>
                  {activeCustomers}
                </h2>

                <p>
                  Active Customers
                </p>

              </div>

            </div>


            {/* INACTIVE */}

            <div className="customer-card">

              <div className="customer-icon orange">

                <FaUserClock />

              </div>

              <div>

                <h2>
                  {inactiveCustomers}
                </h2>

                <p>
                  Inactive Customers
                </p>

              </div>

            </div>


            {/* VIP */}

            <div className="customer-card">

              <div className="customer-icon purple">

                <FaUserCheck />

              </div>

              <div>

                <h2>
                  {vipCustomers}
                </h2>

                <p>
                  VIP Customers
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              CUSTOMER TABLE
          ====================================================== */}

          <div className="customer-table-card">

            {loading && (

              <div className="customer-message">

                Loading customers...

              </div>

            )}


            {error && (

              <div className="customer-message error">

                {error}

              </div>

            )}


            {!loading && !error && (

              <table>

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Full Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Role
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

                  {filteredCustomers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >

                        No customers found

                      </td>

                    </tr>

                  ) : (

                    filteredCustomers.map(
                      (customer) => (

                        <tr
                          key={customer.id}
                        >

                          <td>
                            {customer.id}
                          </td>

                          <td>
                            {customer.full_name}
                          </td>

                          <td>
                            {customer.email}
                          </td>

                          <td>
                            {customer.phone || "-"}
                          </td>

                          <td>

                            <span
                              className={`customer-role ${getRoleClass(
                                customer.role
                              )}`}
                            >

                              {formatRole(
                                customer.role
                              )}

                            </span>

                          </td>

                          <td>

                            <span
                              className={`customer-status ${getStatusClass(
                                customer.status
                              )}`}
                            >

                              {formatStatus(
                                customer.status
                              )}

                            </span>

                          </td>

                          <td>

                            <button
                              className="customer-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  customer
                                )
                              }
                            >

                              Edit

                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>


      {/* ==========================================================
          ADD CUSTOMER MODAL
      =========================================================== */}

      {showAddModal && (

        <div className="customer-modal-overlay">

          <div className="customer-modal">

            {/* MODAL HEADER */}

            <div className="customer-modal-header">

              <div>

                <h2>
                  Add Customer
                </h2>

                <p>
                  Create a new customer account
                </p>

              </div>

              <button
                type="button"
                className="customer-close-btn"
                onClick={handleCloseAddCustomer}
                disabled={addingCustomer}
              >

                <FaTimes />

              </button>

            </div>


            {/* ADD FORM */}

            <form
              onSubmit={handleAddCustomer}
              className="customer-form"
            >

              {/* ERROR */}

              {addError && (

                <div className="customer-form-error">

                  {addError}

                </div>

              )}


              {/* FULL NAME */}

              <div className="customer-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter full name"
                  value={customerForm.full_name}
                  onChange={
                    handleCustomerFormChange
                  }
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="customer-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={customerForm.email}
                  onChange={
                    handleCustomerFormChange
                  }
                  required
                />

              </div>


              {/* PHONE */}

              <div className="customer-form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={customerForm.phone}
                  onChange={
                    handleCustomerFormChange
                  }
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="customer-form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter login password"
                  value={customerForm.password}
                  onChange={
                    handleCustomerFormChange
                  }
                  minLength="6"
                  required
                />

                <small>
                  This password will be used by the
                  customer to login.
                </small>

              </div>


              {/* ROLE */}

              <div className="customer-form-group">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={customerForm.role}
                  onChange={
                    handleCustomerFormChange
                  }
                >

                  <option value="customer">
                    Customer
                  </option>

                  <option value="vip">
                    VIP
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="customer-cancel-btn"
                  onClick={
                    handleCloseAddCustomer
                  }
                  disabled={addingCustomer}
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  className="customer-save-btn"
                  disabled={addingCustomer}
                >

                  {addingCustomer
                    ? "Adding..."
                    : "Add Customer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==========================================================
          EDIT CUSTOMER MODAL
      =========================================================== */}

      {showEditModal && selectedCustomer && (

        <div className="customer-modal-overlay">

          <div className="customer-modal">

            {/* HEADER */}

            <div className="customer-modal-header">

              <div>

                <h2>
                  Edit Customer
                </h2>

                <p>
                  Update customer details
                </p>

              </div>

              <button
                type="button"
                className="customer-close-btn"
                onClick={handleCloseEdit}
                disabled={savingEdit}
              >

                <FaTimes />

              </button>

            </div>


            {/* EDIT FORM */}

            <form
              onSubmit={handleSaveEdit}
              className="customer-form"
            >

              {editError && (

                <div className="customer-form-error">

                  {editError}

                </div>

              )}


              {/* FULL NAME */}

              <div className="customer-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={editForm.full_name}
                  onChange={handleEditChange}
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="customer-form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />

              </div>


              {/* PHONE */}

              <div className="customer-form-group">

                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  required
                />

              </div>


              {/* ROLE */}

              <div className="customer-form-group">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                >

                  <option value="customer">
                    Customer
                  </option>

                  <option value="vip">
                    VIP
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div className="customer-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="customer-modal-actions">

                <button
                  type="button"
                  className="customer-cancel-btn"
                  onClick={handleCloseEdit}
                  disabled={savingEdit}
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  className="customer-save-btn"
                  disabled={savingEdit}
                >

                  {savingEdit
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}

export default CustomerManagement;