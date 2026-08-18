import React, { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaConciergeBell,
  FaPlus,
  FaSpa,
  FaUtensils,
  FaCar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import "./AdminServices.css";


// =====================================================
// ADMIN SERVICES
// =====================================================

function AdminServices() {

  // ===================================================
  // STATE
  // ===================================================

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);


  // ===================================================
  // FORM STATE
  // ===================================================

  const [formData, setFormData] = useState({

    service_name: "",

    price: "",

    description: "",

    category: "",

    availability: "",

    status: "Active",

  });


  // ===================================================
  // LOAD SERVICES
  // ===================================================

  const loadServices = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        "http://localhost:5000/api/admin/services"
      );


      const data = await response.json();


      console.log(
        "Services data:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load services."
        );

      }


      setServices(
        data.services || []
      );

    } catch (error) {

      console.error(
        "Load services error:",
        error
      );


      setError(
        error.message ||
        "Unable to load services."
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // USE EFFECT
  // ===================================================

  useEffect(() => {

    loadServices();

  }, []);


  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleInputChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // ===================================================
  // OPEN ADD FORM
  // ===================================================

  const handleAddClick = () => {

    setEditingId(null);


    setFormData({

      service_name: "",

      price: "",

      description: "",

      category: "",

      availability: "",

      status: "Active",

    });


    setShowForm(true);

  };


  // ===================================================
  // OPEN EDIT FORM
  // ===================================================

  const handleEditClick = (service) => {

    setEditingId(service.id);


    setFormData({

      service_name:
        service.service_name || "",

      price:
        service.price || "",

      description:
        service.description || "",

      category:
        service.category || "",

      availability:
        service.availability || "",

      status:
        service.status || "Active",

    });


    setShowForm(true);

  };


  // ===================================================
  // SAVE SERVICE
  // ADD OR UPDATE
  // ===================================================

  const handleSaveService = async () => {

    try {

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!formData.service_name.trim()) {

        alert(
          "Please enter service name."
        );

        return;

      }


      if (
        formData.price === "" ||
        Number(formData.price) < 0
      ) {

        alert(
          "Please enter a valid price."
        );

        return;

      }


      if (!formData.category) {

        alert(
          "Please select a category."
        );

        return;

      }


      // -----------------------------------------------
      // ADD OR EDIT URL
      // -----------------------------------------------

      const url = editingId

        ? `http://localhost:5000/api/admin/services/${editingId}`

        : "http://localhost:5000/api/admin/services";


      const method = editingId
        ? "PUT"
        : "POST";


      // -----------------------------------------------
      // API REQUEST
      // -----------------------------------------------

      const response = await fetch(
        url,
        {

          method,

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            service_name:
              formData.service_name,

            price:
              Number(formData.price),

            description:
              formData.description,

            category:
              formData.category,

            availability:
              formData.availability,

            status:
              formData.status,

          }),

        }
      );


      const data =
        await response.json();


      console.log(
        "Save service response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save service."
        );

      }


      // -----------------------------------------------
      // SUCCESS
      // -----------------------------------------------

      alert(
        editingId
          ? "Service updated successfully!"
          : "Service added successfully!"
      );


      // -----------------------------------------------
      // CLOSE FORM
      // -----------------------------------------------

      setShowForm(false);

      setEditingId(null);


      setFormData({

        service_name: "",

        price: "",

        description: "",

        category: "",

        availability: "",

        status: "Active",

      });


      // -----------------------------------------------
      // REFRESH SERVICES
      // -----------------------------------------------

      await loadServices();

    } catch (error) {

      console.error(
        "Save service error:",
        error
      );


      alert(
        error.message ||
        "Failed to save service."
      );

    }

  };


  // ===================================================
  // DELETE SERVICE
  // ===================================================

  const handleDeleteClick = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this service?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response =
        await fetch(
          `http://localhost:5000/api/admin/services/${id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete service."
        );

      }


      alert(
        "Service deleted successfully!"
      );


      await loadServices();

    } catch (error) {

      console.error(
        "Delete service error:",
        error
      );


      alert(
        error.message ||
        "Failed to delete service."
      );

    }

  };


  // ===================================================
  // STATISTICS
  // ===================================================

  const totalServices =
    services.length;


  const foodServices =
    services.filter(
      (service) =>
        String(
          service.category || ""
        ).toLowerCase() === "food"
    ).length;


  const wellnessServices =
    services.filter(
      (service) => {

        const category =
          String(
            service.category || ""
          ).toLowerCase();

        return (
          category === "wellness" ||
          category === "spa" ||
          category === "spa & wellness"
        );

      }
    ).length;


  const transportServices =
    services.filter(
      (service) =>
        String(
          service.category || ""
        ).toLowerCase() === "transport"
    ).length;


  // ===================================================
  // CATEGORY ICON
  // ===================================================

  const getCategoryIcon = (category) => {

    const value =
      String(
        category || ""
      ).toLowerCase();


    if (value === "food") {

      return (
        <FaUtensils />
      );

    }


    if (
      value === "wellness" ||
      value === "spa" ||
      value === "spa & wellness"
    ) {

      return (
        <FaSpa />
      );

    }


    if (value === "transport") {

      return (
        <FaCar />
      );

    }


    return (
      <FaConciergeBell />
    );

  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            <div className="services-header">

              <div className="services-title">

                <h1>
                  Hotel Services
                </h1>

                <p>
                  Loading services...
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // ===================================================
  // MAIN
  // ===================================================

  return (

    <div className="admin-container">

      <Sidebar />


      <div className="admin-main">

        <Topbar />


        <div className="admin-content">


          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="services-header">

            <div className="services-title">

              <h1>
                Hotel Services
              </h1>

              <p>
                Manage all hotel services
              </p>

            </div>


            <button
              className="add-service-btn"
              onClick={
                handleAddClick
              }
            >

              <FaPlus />

              Add Service

            </button>

          </div>


          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}


          {/* ==========================================
              STATISTICS
          ========================================== */}

          <div className="service-stats">


            {/* TOTAL */}

            <div className="service-card">

              <FaConciergeBell
                className="service-icon blue"
              />

              <h2>
                {totalServices}
              </h2>

              <p>
                Total Services
              </p>

            </div>


            {/* FOOD */}

            <div className="service-card">

              <FaUtensils
                className="service-icon green"
              />

              <h2>
                {foodServices}
              </h2>

              <p>
                Food Services
              </p>

            </div>


            {/* WELLNESS */}

            <div className="service-card">

              <FaSpa
                className="service-icon orange"
              />

              <h2>
                {wellnessServices}
              </h2>

              <p>
                Spa & Wellness
              </p>

            </div>


            {/* TRANSPORT */}

            <div className="service-card">

              <FaCar
                className="service-icon purple"
              />

              <h2>
                {transportServices}
              </h2>

              <p>
                Transport
              </p>

            </div>

          </div>


          {/* ==========================================
              SERVICES TABLE
          ========================================== */}

          <div className="services-table-card">

            <div className="services-table-header">

              <h2>
                Services
              </h2>

            </div>


            <table>

              <thead>

                <tr>

                  <th>
                    Service
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Availability
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

                {services.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "30px",
                      }}
                    >

                      No services found.

                      <br />

                      Click
                      {" "}
                      <strong>
                        Add Service
                      </strong>
                      {" "}
                      to create one.

                    </td>

                  </tr>

                ) : (

                  services.map(
                    (service) => (

                      <tr
                        key={
                          service.id
                        }
                      >

                        {/* SERVICE */}

                        <td>

                          <div
                            className="service-name-cell"
                          >

                            <span
                              className="service-category-icon"
                            >

                              {
                                getCategoryIcon(
                                  service.category
                                )
                              }

                            </span>


                            <div>

                              <strong>
                                {
                                  service.service_name
                                }
                              </strong>


                              {service.description && (

                                <small>

                                  {
                                    service.description
                                  }

                                </small>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          {
                            service.category ||
                            "-"
                          }

                        </td>


                        {/* PRICE */}

                        <td>

                          ₹
                          {Number(
                            service.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        {/* AVAILABILITY */}

                        <td>

                          {
                            service.availability ||
                            "-"
                          }

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${
                              String(
                                service.status ||
                                ""
                              ).toLowerCase() ===
                              "active"

                                ? "confirmed"

                                : "pending"
                            }`}
                          >

                            {
                              service.status ||
                              "Inactive"
                            }

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          <div
                            className="service-actions"
                          >

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEditClick(
                                  service
                                )
                              }
                            >

                              <FaEdit />

                              Edit

                            </button>


                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteClick(
                                  service.id
                                )
                              }
                            >

                              <FaTrash />

                              Delete

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* ==========================================
              ADD / EDIT MODAL
          ========================================== */}

          {showForm && (

            <div className="service-modal">

              <div className="service-form">

                <h2>

                  {editingId
                    ? "Edit Service"
                    : "Add Service"}

                </h2>


                {/* SERVICE NAME */}

                <div className="form-group">

                  <label>
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="service_name"
                    value={
                      formData.service_name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter service name"
                  />

                </div>


                {/* PRICE */}

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={
                      formData.price
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter price"
                    min="0"
                  />

                </div>


                {/* CATEGORY */}

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Wellness">
                      Wellness
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Room Service">
                      Room Service
                    </option>

                    <option value="Laundry">
                      Laundry
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* AVAILABILITY */}

                <div className="form-group">

                  <label>
                    Availability
                  </label>

                  <input
                    type="text"
                    name="availability"
                    value={
                      formData.availability
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Example: 24/7"
                  />

                </div>


                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                    <option value="Limited">
                      Limited
                    </option>

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter service description"
                    rows="4"
                  />

                </div>


                {/* BUTTONS */}

                <div className="form-buttons">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {

                      setShowForm(
                        false
                      );

                      setEditingId(
                        null
                      );

                    }}
                  >

                    Cancel

                  </button>


                  <button
                    type="button"
                    className="submit-btn"
                    onClick={
                      handleSaveService
                    }
                  >

                    {editingId
                      ? "Update Service"
                      : "Save Service"}

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


export default AdminServices;