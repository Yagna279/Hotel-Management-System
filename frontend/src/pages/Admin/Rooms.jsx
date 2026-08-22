import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./Rooms.css";

import {
  FaBed,
  FaPlus,
  FaDoorOpen,
  FaTools,
  FaTimes,
  FaTrash,
} from "react-icons/fa";


function Rooms() {

  // =====================================================
  // ROOMS
  // =====================================================

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // EDIT ROOM
  // =====================================================

  const [selectedRoom, setSelectedRoom] =
    useState(null);


  const [editForm, setEditForm] =
    useState({

      room_number: "",

      room_type: "",

      price_per_night: "",

      status: "",

    });


  const [saving, setSaving] =
    useState(false);


  // =====================================================
  // DELETE ROOM
  // =====================================================

  const [deleting, setDeleting] =
    useState(false);


  // =====================================================
  // ADD ROOM
  // =====================================================

  const [showAddModal, setShowAddModal] =
    useState(false);


  const [addForm, setAddForm] =
    useState({

      room_number: "",

      room_type: "",

      price_per_night: "",

      status: "available",

    });


  const [adding, setAdding] =
    useState(false);


  // =====================================================
  // FETCH ROOMS
  // =====================================================

  useEffect(() => {

    fetchRooms();

  }, []);


  const fetchRooms = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          "http://localhost:5000/api/rooms"
        );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch rooms"
        );

      }


      const data =
        await response.json();


      setRooms(data);


    } catch (error) {

      console.error(
        "ERROR FETCHING ROOMS:",
        error
      );


      setError(
        "Unable to load rooms from database."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // EDIT ROOM
  // =====================================================

  const handleEdit = (room) => {

    setSelectedRoom(room);


    setEditForm({

      room_number:
        room.room_number,

      room_type:
        room.room_type,

      price_per_night:
        room.price_per_night,

      status:
        room.status,

    });

  };


  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const handleCloseEdit = () => {

    setSelectedRoom(null);


    setEditForm({

      room_number: "",

      room_type: "",

      price_per_night: "",

      status: "",

    });

  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

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
  // SAVE EDIT
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();


    if (!selectedRoom) {

      return;

    }


    try {

      setSaving(true);


      const response =
        await fetch(
          `http://localhost:5000/api/rooms/${selectedRoom.id}`,
          {

            method: "PUT",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                room_number:
                  editForm.room_number,

                room_type:
                  editForm.room_type,

                price_per_night:
                  editForm.price_per_night,

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
          "Failed to update room"
        );

      }


      alert(
        "Room updated successfully!"
      );


      handleCloseEdit();


      await fetchRooms();


    } catch (error) {

      console.error(
        "ERROR UPDATING ROOM:",
        error
      );


      alert(
        error.message ||
        "Failed to update room"
      );


    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE ROOM
  // =====================================================

  const handleDeleteRoom = async () => {

    if (!selectedRoom) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete Room ${selectedRoom.room_number}?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeleting(true);


      const response =
        await fetch(
          `http://localhost:5000/api/rooms/${selectedRoom.id}`,
          {

            method: "DELETE",

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete room"
        );

      }


      alert(
        "Room deleted successfully!"
      );


      handleCloseEdit();


      await fetchRooms();


    } catch (error) {

      console.error(
        "ERROR DELETING ROOM:",
        error
      );


      alert(
        error.message ||
        "Failed to delete room"
      );


    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleOpenAdd = () => {

    setAddForm({

      room_number: "",

      room_type: "",

      price_per_night: "",

      status: "available",

    });


    setShowAddModal(true);

  };


  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

  const handleCloseAdd = () => {

    setShowAddModal(false);


    setAddForm({

      room_number: "",

      room_type: "",

      price_per_night: "",

      status: "available",

    });

  };


  // =====================================================
  // ADD FORM CHANGE
  // =====================================================

  const handleAddChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setAddForm(
      (previous) => ({

        ...previous,

        [name]: value,

      })
    );

  };


  // =====================================================
  // ADD ROOM
  // =====================================================

  const handleAddRoom = async (e) => {

    e.preventDefault();


    try {

      setAdding(true);


      console.log(
        "SENDING ROOM:",
        addForm
      );


      const response =
        await fetch(
          "http://localhost:5000/api/rooms",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                room_number:
                  addForm.room_number,

                room_type:
                  addForm.room_type,

                price_per_night:
                  addForm.price_per_night,

                status:
                  addForm.status,

              }),

          }
        );


      const data =
        await response.json();


      console.log(
        "SERVER RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add room"
        );

      }


      alert(
        "Room added successfully!"
      );


      handleCloseAdd();


      await fetchRooms();


    } catch (error) {

      console.error(
        "ERROR ADDING ROOM:",
        error
      );


      alert(
        error.message ||
        "Failed to add room"
      );


    } finally {

      setAdding(false);

    }

  };


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalRooms =
    rooms.length;


  const availableRooms =
    rooms.filter(

      (room) =>
        room.status?.toLowerCase() ===
        "available"

    ).length;


  const occupiedRooms =
    rooms.filter(

      (room) =>
        room.status?.toLowerCase() ===
        "occupied"

    ).length;


  const maintenanceRooms =
    rooms.filter(

      (room) =>
        room.status?.toLowerCase() ===
        "maintenance"

    ).length;


  // =====================================================
  // FLOOR
  // =====================================================

  const getFloor = (
    roomNumber
  ) => {

    return Math.floor(
      Number(roomNumber) / 100
    );

  };


  // =====================================================
  // PRICE
  // =====================================================

  const formatPrice = (
    price
  ) => {

    return `₹${Number(
      price
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case "available":

        return "available";


      case "occupied":

        return "occupied";


      case "maintenance":

        return "maintenance";


      default:

        return "";

    }

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="admin-container">


      <Sidebar />


      <div className="admin-main">


        <Topbar />


        <div className="admin-content">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="rooms-header">


            <div>

              <h1>
                Rooms Management
              </h1>


              <p>
                Manage Hotel Rooms Efficiently
              </p>

            </div>


            {/* ADD ROOM BUTTON */}

            <button
              className="add-room-btn"
              onClick={handleOpenAdd}
              type="button"
            >

              <FaPlus />

              Add Room

            </button>


          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="room-stats">


            {/* TOTAL */}

            <div className="room-card">

              <div className="icon-box blue">

                <FaBed
                  className="room-icon"
                />

              </div>


              <div>

                <h2>
                  {totalRooms}
                </h2>

                <p>
                  Total Rooms
                </p>

              </div>

            </div>


            {/* AVAILABLE */}

            <div className="room-card">

              <div className="icon-box green">

                <FaDoorOpen
                  className="room-icon"
                />

              </div>


              <div>

                <h2>
                  {availableRooms}
                </h2>

                <p>
                  Available
                </p>

              </div>

            </div>


            {/* OCCUPIED */}

            <div className="room-card">

              <div className="icon-box orange">

                <FaBed
                  className="room-icon"
                />

              </div>


              <div>

                <h2>
                  {occupiedRooms}
                </h2>

                <p>
                  Occupied
                </p>

              </div>

            </div>


            {/* MAINTENANCE */}

            <div className="room-card">

              <div className="icon-box red">

                <FaTools
                  className="room-icon"
                />

              </div>


              <div>

                <h2>
                  {maintenanceRooms}
                </h2>

                <p>
                  Maintenance
                </p>

              </div>

            </div>


          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          <div className="rooms-table-card">


            {loading && (

              <div className="rooms-message">

                Loading rooms...

              </div>

            )}


            {error && (

              <div className="rooms-message error">

                {error}

              </div>

            )}


            {!loading &&
              !error && (

                <table>


                  <thead>

                    <tr>

                      <th>
                        Room No
                      </th>

                      <th>
                        Type
                      </th>

                      <th>
                        Floor
                      </th>

                      <th>
                        Price
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


                    {rooms.length === 0 ? (

                      <tr>

                        <td colSpan="6">

                          No rooms found

                        </td>

                      </tr>

                    ) : (

                      rooms.map(
                        (room) => (

                          <tr
                            key={
                              room.id
                            }
                          >


                            <td>
                              {
                                room.room_number
                              }
                            </td>


                            <td>
                              {
                                room.room_type
                              }
                            </td>


                            <td>
                              {
                                getFloor(
                                  room.room_number
                                )
                              }
                            </td>


                            <td>
                              {
                                formatPrice(
                                  room.price_per_night
                                )
                              }
                            </td>


                            <td>

                              <span
                                className={
                                  `status ${getStatusClass(
                                    room.status
                                  )}`
                                }
                              >

                                {
                                  room.status
                                    ?.charAt(0)
                                    .toUpperCase()
                                    +
                                  room.status
                                    ?.slice(1)
                                }

                              </span>

                            </td>


                            <td>

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    room
                                  )
                                }
                                type="button"
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


      {/* =====================================================
          EDIT ROOM MODAL
      ===================================================== */}

      {selectedRoom && (

        <div className="room-modal-overlay">


          <div className="room-modal">


            <div className="room-modal-header">


              <div>

                <h2>
                  Edit Room
                </h2>


                <p>
                  Update room details
                </p>

              </div>


              <button
                className="close-modal-btn"
                onClick={
                  handleCloseEdit
                }
                type="button"
                disabled={saving || deleting}
              >

                <FaTimes />

              </button>


            </div>


            <form
              onSubmit={handleSave}
              className="room-edit-form"
            >


              {/* ROOM NUMBER */}

              <div className="form-group">

                <label>
                  Room Number
                </label>


                <input
                  type="text"
                  name="room_number"
                  value={
                    editForm.room_number
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={deleting}
                />

              </div>


              {/* ROOM TYPE */}

              <div className="form-group">

                <label>
                  Room Type
                </label>


                <input
                  type="text"
                  name="room_type"
                  value={
                    editForm.room_type
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={deleting}
                />

              </div>


              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price Per Night
                </label>


                <input
                  type="number"
                  name="price_per_night"
                  value={
                    editForm.price_per_night
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  required
                  disabled={deleting}
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
                    editForm.status
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={deleting}
                >

                  <option value="available">
                    Available
                  </option>


                  <option value="occupied">
                    Occupied
                  </option>


                  <option value="maintenance">
                    Maintenance
                  </option>

                </select>

              </div>


              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="room-modal-actions">


                {/* DELETE */}

                <button
                  type="button"
                  className="delete-room-btn"
                  onClick={
                    handleDeleteRoom
                  }
                  disabled={
                    saving ||
                    deleting
                  }
                >

                  <FaTrash />

                  {
                    deleting
                      ? "Deleting..."
                      : "Delete Room"
                  }

                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={
                    saving ||
                    deleting
                  }
                >

                  Cancel

                </button>


                {/* SAVE */}

                <button
                  type="submit"
                  className="save-room-btn"
                  disabled={
                    saving ||
                    deleting
                  }
                >

                  {
                    saving
                      ? "Saving..."
                      : "Save Changes"
                  }

                </button>


              </div>


            </form>


          </div>


        </div>

      )}


      {/* =====================================================
          ADD ROOM MODAL
      ===================================================== */}

      {showAddModal && (

        <div className="room-modal-overlay">


          <div className="room-modal">


            <div className="room-modal-header">


              <div>

                <h2>
                  Add New Room
                </h2>


                <p>
                  Enter the new room details
                </p>

              </div>


              <button
                className="close-modal-btn"
                onClick={
                  handleCloseAdd
                }
                type="button"
                disabled={adding}
              >

                <FaTimes />

              </button>


            </div>


            <form
              onSubmit={
                handleAddRoom
              }
              className="room-edit-form"
            >


              {/* ROOM NUMBER */}

              <div className="form-group">

                <label>
                  Room Number
                </label>


                <input
                  type="text"
                  name="room_number"
                  value={
                    addForm.room_number
                  }
                  onChange={
                    handleAddChange
                  }
                  placeholder="Example: 602"
                  required
                />

              </div>


              {/* ROOM TYPE */}

              <div className="form-group">

                <label>
                  Room Type
                </label>


                <input
                  type="text"
                  name="room_type"
                  value={
                    addForm.room_type
                  }
                  onChange={
                    handleAddChange
                  }
                  placeholder="Example: Deluxe Room"
                  required
                />

              </div>


              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price Per Night
                </label>


                <input
                  type="number"
                  name="price_per_night"
                  value={
                    addForm.price_per_night
                  }
                  onChange={
                    handleAddChange
                  }
                  placeholder="Example: 4500"
                  min="0"
                  required
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
                    addForm.status
                  }
                  onChange={
                    handleAddChange
                  }
                  required
                >

                  <option value="available">
                    Available
                  </option>


                  <option value="occupied">
                    Occupied
                  </option>


                  <option value="maintenance">
                    Maintenance
                  </option>

                </select>

              </div>


              {/* ACTIONS */}

              <div className="room-modal-actions">


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCloseAdd
                  }
                  disabled={adding}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-room-btn"
                  disabled={adding}
                >

                  {
                    adding
                      ? "Adding..."
                      : "Add Room"
                  }

                </button>


              </div>


            </form>


          </div>


        </div>

      )}


    </div>

  );

}


export default Rooms;