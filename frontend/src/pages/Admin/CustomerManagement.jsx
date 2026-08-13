import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaUsers,
  FaUserPlus,
  FaCrown,
  FaSearch,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

import "./CustomerManagement.css";


// =====================================================
// API
// =====================================================

const API_URL = "http://localhost:5000/api/customers";


// =====================================================
// CUSTOMER MANAGEMENT
// =====================================================

function CustomerManagement() {

  const navigate = useNavigate();


  // =====================================================
  // CUSTOMERS
  // =====================================================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");


  // =====================================================
  // EDIT CUSTOMER
  // =====================================================

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);


  // =====================================================
  // SAVING
  // =====================================================

  const [saving, setSaving] = useState(false);


  // =====================================================
  // EDIT FORM
  // =====================================================

  const [editForm, setEditForm] = useState({

    full_name: "",

    email: "",

    phone: "",

    role: "customer",

    status: "active",

  });


  // =====================================================
  // FETCH CUSTOMERS
  // =====================================================

  useEffect(() => {

    fetchCustomers();

  }, []);


  const fetchCustomers = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          "Failed to fetch customers"
        );

      }


      const data = await response.json();


      /*
        Your backend may return either:

        1. An array directly

        [
          {...},
          {...}
        ]

        OR

        2. An object

        {
          success: true,
          customers: [...]
        }

        This handles both.
      */

      if (Array.isArray(data)) {

        setCustomers(data);

      } else if (
        Array.isArray(data.customers)
      ) {

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


  // =====================================================
  // SEARCH CUSTOMERS
  // =====================================================

  const filteredCustomers =
    customers.filter((customer) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();


      if (!search) {

        return true;

      }


      return (

        customer.full_name
          ?.toLowerCase()
          .includes(search)

        ||

        customer.email
          ?.toLowerCase()
          .includes(search)

        ||

        customer.phone
          ?.toLowerCase()
          .includes(search)

        ||

        customer.role
          ?.toLowerCase()
          .includes(search)

        ||

        customer.status
          ?.toLowerCase()
          .includes(search)

      );

    });


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalCustomers =
    customers.length;


  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status
          ?.toLowerCase() === "active"
    ).length;


  const vipCustomers =
    customers.filter(
      (customer) => {

        const role =
          customer.role
            ?.toLowerCase();

        return (
          role === "vip" ||
          role === "vip customer"
        );

      }
    ).length;


  const newCustomers =
    customers.filter(
      (customer) => {

        if (!customer.created_at) {

          return false;

        }


        const createdDate =
          new Date(
            customer.created_at
          );


        const now =
          new Date();


        return (

          createdDate.getMonth() ===
            now.getMonth()

          &&

          createdDate.getFullYear() ===
            now.getFullYear()

        );

      }
    ).length;


  // =====================================================
  // ADD CUSTOMER
  // =====================================================

  const handleAddCustomer = () => {

    /*
      Admin clicks Add Customer.

      This sends the admin to the existing
      Get Started page.

      The Get Started page will create
      the customer in the customers table.
    */

    navigate("/get-started");

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (customer) => {

    setSelectedCustomer(customer);


    setEditForm({

      full_name:
        customer.full_name || "",

      email:
        customer.email || "",

      phone:
        customer.phone || "",

      role:
        customer.role || "customer",

      status:
        customer.status || "active",

    });


    setShowEditModal(true);

  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setEditForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {

    if (saving) {

      return;

    }


    setShowEditModal(false);

    setSelectedCustomer(null);


    setEditForm({

      full_name: "",

      email: "",

      phone: "",

      role: "customer",

      status: "active",

    });

  };


  // =====================================================
  // UPDATE CUSTOMER
  // =====================================================

  const handleUpdateCustomer =
    async (e) => {

      e.preventDefault();


      if (!selectedCustomer) {

        return;

      }


      try {

        setSaving(true);


        const response =
          await fetch(
            `${API_URL}/${selectedCustomer.id}`,
            {

              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                full_name:
                  editForm.full_name,

                email:
                  editForm.email,

                phone:
                  editForm.phone,

                role:
                  editForm.role,

                status:
                  editForm.status,

              }),

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to update customer"
          );

        }


        alert(
          "Customer updated successfully"
        );


        closeEditModal();


        /*
          Fetch again from PostgreSQL.

          This guarantees that the table
          displays the latest database values.
        */

        await fetchCustomers();

      } catch (error) {

        console.error(
          "Error updating customer:",
          error
        );


        alert(
          error.message ||
          "Failed to update customer"
        );

      } finally {

        setSaving(false);

      }

    };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (
      status?.toLowerCase()
    ) {

      case "active":

        return "active";


      case "checked_in":

        return "checked-in";


      case "checked-out":

      case "checked_out":

        return "checked-out";


      default:

        return "customer";

    }

  };


  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {

    switch (
      status?.toLowerCase()
    ) {

      case "active":

        return "Active";


      case "checked_in":

        return "Checked In";


      case "checked-out":

      case "checked_out":

        return "Checked Out";


      default:

        return status || "Not Set";

    }

  };


  // =====================================================
  // ROLE TEXT
  // =====================================================

  const getRoleText = (role) => {

    const currentRole =
      role?.toLowerCase();


    if (
      currentRole === "vip" ||
      currentRole === "vip customer"
    ) {

      return "VIP";

    }


    if (
      currentRole === "customer"
    ) {

      return "Customer";

    }


    return role || "Not Set";

  };


  // =====================================================
  // ROLE CLASS
  // =====================================================

  const getRoleClass = (role) => {

    const currentRole =
      role?.toLowerCase();


    if (
      currentRole === "vip" ||
      currentRole === "vip customer"
    ) {

      return "vip";

    }


    return "customer";

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-container">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      <div className="admin-main">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <Topbar />


        <div className="admin-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="customer-header">


            <div>

              <h1>
                Customer Management
              </h1>

              <p>
                Manage hotel customers
              </p>

            </div>


            {/* =================================================
                ADD CUSTOMER
            ================================================= */}

            <button
              type="button"
              className="add-customer-btn"
              onClick={handleAddCustomer}
            >

              <FaUserPlus />

              Add Customer

            </button>


          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="customer-stats">


            {/* TOTAL CUSTOMERS */}

            <div className="customer-card">

              <div className="icon-box blue">

                <FaUsers
                  className="customer-icon"
                />

              </div>


              <h2>
                {totalCustomers}
              </h2>


              <p>
                Total Customers
              </p>

            </div>


            {/* ACTIVE CUSTOMERS */}

            <div className="customer-card">

              <div className="icon-box green">

                <FaUsers
                  className="customer-icon"
                />

              </div>


              <h2>
                {activeCustomers}
              </h2>


              <p>
                Active Customers
              </p>

            </div>


            {/* VIP CUSTOMERS */}

            <div className="customer-card">

              <div className="icon-box orange">

                <FaCrown
                  className="customer-icon"
                />

              </div>


              <h2>
                {vipCustomers}
              </h2>


              <p>
                VIP Customers
              </p>

            </div>


            {/* NEW CUSTOMERS */}

            <div className="customer-card">

              <div className="icon-box purple">

                <FaUserPlus
                  className="customer-icon"
                />

              </div>


              <h2>
                {newCustomers}
              </h2>


              <p>
                New This Month
              </p>

            </div>


          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="customer-search">

            <FaSearch />


            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              CUSTOMER TABLE
          ================================================= */}

          <div className="customer-table-card">


            {/* LOADING */}

            {loading && (

              <div className="customer-message">

                Loading customers...

              </div>

            )}


            {/* ERROR */}

            {error && !loading && (

              <div className="customer-message error">

                {error}


                <br />


                <button
                  type="button"
                  className="edit-btn"
                  onClick={fetchCustomers}
                  style={{
                    marginTop: "15px",
                  }}
                >

                  Retry

                </button>

              </div>

            )}


            {/* TABLE */}

            {!loading &&
              !error && (

                <table>


                  <thead>

                    <tr>

                      <th>
                        Name
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


                    {/* NO CUSTOMERS */}

                    {filteredCustomers.length ===
                    0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="no-customers"
                        >

                          {searchTerm
                            ? "No customers found for your search."
                            : "No customers found."}

                        </td>

                      </tr>

                    ) : (


                      /* CUSTOMER ROWS */

                      filteredCustomers.map(
                        (customer) => (

                          <tr
                            key={
                              customer.id
                            }
                          >


                            {/* NAME */}

                            <td>

                              {customer.full_name ||
                                "Not provided"}

                            </td>


                            {/* EMAIL */}

                            <td>

                              {customer.email ||
                                "Not provided"}

                            </td>


                            {/* PHONE */}

                            <td>

                              {customer.phone ||
                                "Not provided"}

                            </td>


                            {/* ROLE */}

                            <td>

                              <span
                                className={`status ${getRoleClass(
                                  customer.role
                                )}`}
                              >

                                {getRoleText(
                                  customer.role
                                )}

                              </span>

                            </td>


                            {/* STATUS */}

                            <td>

                              <span
                                className={`status ${getStatusClass(
                                  customer.status
                                )}`}
                              >

                                {getStatusText(
                                  customer.status
                                )}

                              </span>

                            </td>


                            {/* EDIT */}

                            <td>

                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    customer
                                  )
                                }
                              >

                                <FaEdit
                                  style={{
                                    marginRight:
                                      "6px",
                                  }}
                                />

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


      {/* =====================================================
          EDIT CUSTOMER MODAL
      ===================================================== */}

      {showEditModal &&
        selectedCustomer && (

          <div
            className="customer-modal-overlay"
            onClick={closeEditModal}
          >


            <div
              className="customer-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              {/* =================================================
                  MODAL HEADER
              ================================================= */}

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
                  className="close-customer-btn"
                  onClick={
                    closeEditModal
                  }
                  disabled={saving}
                >

                  <FaTimes />

                </button>


              </div>


              {/* =================================================
                  EDIT FORM
              ================================================= */}

              <form
                className="customer-form"
                onSubmit={
                  handleUpdateCustomer
                }
              >


                {/* FULL NAME */}

                <div className="customer-form-group">

                  <label>
                    Full Name
                  </label>


                  <input
                    type="text"
                    name="full_name"
                    value={
                      editForm.full_name
                    }
                    onChange={
                      handleEditChange
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
                    value={
                      editForm.email
                    }
                    onChange={
                      handleEditChange
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
                    value={
                      editForm.phone
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter phone number"
                  />

                </div>


                {/* ROLE */}

                <div className="customer-form-group">

                  <label>
                    Role
                  </label>


                  <select
                    name="role"
                    value={
                      editForm.role
                    }
                    onChange={
                      handleEditChange
                    }
                  >

                    <option value="customer">
                      Customer
                    </option>


                    <option value="vip">
                      VIP Customer
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
                    value={
                      editForm.status
                    }
                    onChange={
                      handleEditChange
                    }
                  >

                    <option value="active">
                      Active
                    </option>


                    <option value="checked_in">
                      Checked In
                    </option>


                    <option value="checked_out">
                      Checked Out
                    </option>

                  </select>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="customer-modal-actions">


                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      closeEditModal
                    }
                    disabled={saving}
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    className="save-customer-btn"
                    disabled={saving}
                  >

                    {saving
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