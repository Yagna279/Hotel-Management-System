import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  Calendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addMonths from "date-fns/addMonths";
import subMonths from "date-fns/subMonths";

import {
  FaCalendarAlt,
  FaBed,
  FaUsers,
  FaClipboardCheck,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Reservations.css";


/* =====================================================
   DATE LOCALIZER
===================================================== */

const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


/* =====================================================
   CALENDAR EVENT
===================================================== */

const EventComponent = ({ event }) => {
  return (
    <div className="reservation-calendar-event">
      <div className="booking-count-circle">
        {event.count}
      </div>
    </div>
  );
};


/* =====================================================
   CALENDAR EVENT STYLE
===================================================== */

const eventStyleGetter = () => {
  return {
    style: {
      background: "transparent",
      border: "none",
      padding: 0,
      margin: 0,
      boxShadow: "none",
      overflow: "visible",
      width: "100%",
    },
  };
};


/* =====================================================
   CUSTOM CALENDAR TOOLBAR
===================================================== */

const CustomToolbar = ({
  label,
  onPrevious,
  onNext,
  onToday,
  onView,
  view,
}) => {
  return (
    <div className="calendar-toolbar">

      <div className="calendar-toolbar-left">

        <button
          type="button"
          className="calendar-arrow"
          onClick={onPrevious}
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          className="calendar-today"
          onClick={onToday}
        >
          Today
        </button>

        <button
          type="button"
          className="calendar-arrow"
          onClick={onNext}
        >
          <FaChevronRight />
        </button>

      </div>

      <h2 className="calendar-month-title">
        {label}
      </h2>

      <div className="calendar-view-buttons">

        <button
          type="button"
          className={
            view === Views.MONTH
              ? "calendar-view active"
              : "calendar-view"
          }
          onClick={() => onView(Views.MONTH)}
        >
          Month
        </button>

        <button
          type="button"
          className={
            view === Views.WEEK
              ? "calendar-view active"
              : "calendar-view"
          }
          onClick={() => onView(Views.WEEK)}
        >
          Week
        </button>

        <button
          type="button"
          className={
            view === Views.DAY
              ? "calendar-view active"
              : "calendar-view"
          }
          onClick={() => onView(Views.DAY)}
        >
          Day
        </button>

      </div>

    </div>
  );
};


/* =====================================================
   MAIN COMPONENT
===================================================== */

function Reservations() {

  /* ===================================================
     STATE
  =================================================== */

  const [reservations, setReservations] = useState([]);

  const [events, setEvents] = useState([]);

  const [statistics, setStatistics] = useState({
    todaysBookings: 0,
    availableRooms: 0,
    checkInsToday: 0,
    pendingApproval: 0,
  });

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [calendarDate, setCalendarDate] = useState(
    new Date()
  );

  const [calendarView, setCalendarView] = useState(
    Views.MONTH
  );

  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [showCancelConfirm, setShowCancelConfirm] =
    useState(false);

  const [editForm, setEditForm] = useState({
    room_id: "",
    check_in: "",
    check_out: "",
    booking_status: "pending",
    remarks: "",
  });


  /* ===================================================
     FORMAT ROOM
  =================================================== */

  const formatRoom = (reservation) => {

    if (
      reservation.room_number &&
      reservation.room_type
    ) {
      return `${reservation.room_number} - ${reservation.room_type}`;
    }

    if (reservation.room_number) {
      return String(reservation.room_number);
    }

    return "Room not assigned";
  };


  /* ===================================================
     FORMAT DATE
  =================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  /* ===================================================
     FORMAT DATE FOR INPUT
  =================================================== */

  const formatDateForInput = (date) => {

    if (!date) {
      return "";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    const year = parsed.getFullYear();

    const month = String(
      parsed.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      parsed.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  /* ===================================================
     CREATE CALENDAR EVENTS
  =================================================== */

  const createCalendarEvents = (dbReservations) => {

    const bookingCountByDate = {};

    dbReservations.forEach((reservation) => {

      if (!reservation.check_in) {
        return;
      }

      const date = new Date(
        reservation.check_in
      );

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const dateKey =
        `${date.getFullYear()}-` +
        `${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
          date.getDate()
        ).padStart(2, "0")}`;

      if (!bookingCountByDate[dateKey]) {

        bookingCountByDate[dateKey] = {
          count: 0,
        };

      }

      const status = String(
        reservation.booking_status || ""
      ).toLowerCase();

      if (
        status !== "cancelled" &&
        status !== "rejected"
      ) {
        bookingCountByDate[dateKey].count += 1;
      }

    });

    return Object.entries(bookingCountByDate)

      .filter(([, info]) => info.count > 0)

      .map(([dateKey, info]) => {

        const [
          year,
          month,
          day,
        ] = dateKey
          .split("-")
          .map(Number);

        const date = new Date(
          year,
          month - 1,
          day
        );

        return {
          id: `booking-${dateKey}`,
          title: String(info.count),
          count: info.count,
          start: date,
          end: date,
          allDay: true,
        };

      });
  };


  /* ===================================================
     LOAD RESERVATIONS
  =================================================== */

  const loadReservations = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/reservations"
      );

      if (!response.ok) {

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        throw new Error(
          data.message ||
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      const dbReservations =
        data.reservations || [];

      setReservations(dbReservations);

      setStatistics(
        data.statistics || {
          todaysBookings: 0,
          availableRooms: 0,
          checkInsToday: 0,
          pendingApproval: 0,
        }
      );

      setEvents(
        createCalendarEvents(
          dbReservations
        )
      );

    } catch (err) {

      console.error(
        "Reservations error:",
        err
      );

      setError(
        err.message ||
        "Unable to load reservations."
      );

    } finally {

      setLoading(false);

    }
  };


  /* ===================================================
     LOAD AVAILABLE ROOMS
  =================================================== */

  const loadRooms = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/admin/reservations/rooms/available"
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setRooms(
        data.rooms || []
      );

    } catch (err) {

      console.error(
        "Rooms loading error:",
        err
      );

    }
  };


  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {

    loadReservations();
    loadRooms();

  }, []);


  /* ===================================================
     FILTER
  =================================================== */

  const filteredReservations = useMemo(() => {

    const search =
      searchTerm
        .trim()
        .toLowerCase();

    if (!search) {
      return reservations;
    }

    return reservations.filter(
      (reservation) => {

        const values = [

          reservation.guest_name,

          reservation.customer_name,

          reservation.guest_email,

          reservation.guest_phone,

          reservation.room_number,

          reservation.room_type,

          reservation.booking_status,

          reservation.remarks,

          formatDate(
            reservation.check_in
          ),

          formatDate(
            reservation.check_out
          ),

        ];

        return values.some(
          (value) =>
            String(value || "")
              .toLowerCase()
              .includes(search)
        );

      }
    );

  }, [
    reservations,
    searchTerm,
  ]);


  /* ===================================================
     CALENDAR NAVIGATION
  =================================================== */

  const handlePreviousMonth = () => {

    setCalendarDate(
      (current) =>
        subMonths(current, 1)
    );

  };


  const handleNextMonth = () => {

    setCalendarDate(
      (current) =>
        addMonths(current, 1)
    );

  };


  const handleToday = () => {

    setCalendarDate(
      new Date()
    );

  };


  const handleCalendarNavigate = (newDate) => {

    setCalendarDate(newDate);

  };


  const handleCalendarViewChange = (newView) => {

    setCalendarView(newView);

  };


  /* ===================================================
     OPEN EDIT FORM
  =================================================== */

  const handleOpenEdit = (reservation) => {

    setSelectedReservation(
      reservation
    );

    setEditForm({

      room_id:
        reservation.room_id
          ? String(
              reservation.room_id
            )
          : "",

      check_in:
        formatDateForInput(
          reservation.check_in
        ),

      check_out:
        formatDateForInput(
          reservation.check_out
        ),

      booking_status:
        reservation.booking_status ||
        "pending",

      remarks:
        reservation.remarks ||
        "",

    });

    setShowCancelConfirm(false);

  };


  /* ===================================================
     CLOSE EDIT FORM
  =================================================== */

  const handleCloseEdit = () => {

    if (saving) {
      return;
    }

    setSelectedReservation(null);

    setShowCancelConfirm(false);

  };


  /* ===================================================
     FORM CHANGE
  =================================================== */

  const handleEditChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  /* ===================================================
     SAVE RESERVATION
  =================================================== */

  const handleSaveReservation = async () => {

    if (!selectedReservation) {
      return;
    }

    if (!editForm.room_id) {

      alert(
        "Please select a room."
      );

      return;
    }

    if (!editForm.check_in) {

      alert(
        "Please select check-in date."
      );

      return;
    }

    if (!editForm.check_out) {

      alert(
        "Please select check-out date."
      );

      return;
    }

    if (
      editForm.check_out <
      editForm.check_in
    ) {

      alert(
        "Check-out date cannot be before check-in date."
      );

      return;
    }

    try {

      setSaving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/admin/reservations/${selectedReservation.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            room_id:
              Number(
                editForm.room_id
              ),

            check_in:
              editForm.check_in,

            check_out:
              editForm.check_out,

            booking_status:
              editForm.booking_status,

            remarks:
              editForm.remarks,

          }),
        }
      );

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};

      }

      if (!response.ok) {

        throw new Error(
          data.message ||
          `Failed to update reservation. Server returned ${response.status}.`
        );

      }

      setSelectedReservation(null);

      setShowCancelConfirm(false);

      await loadReservations();

      await loadRooms();

      alert(
        "Reservation updated successfully."
      );

    } catch (err) {

      console.error(
        "Save reservation error:",
        err
      );

      alert(
        err.message ||
        "Failed to update reservation."
      );

    } finally {

      setSaving(false);

    }
  };


  /* ===================================================
     CANCEL RESERVATION
  =================================================== */

  const handleCancelReservation = async () => {

    if (!selectedReservation) {
      return;
    }

    try {

      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/reservations/${selectedReservation.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            room_id:
              selectedReservation.room_id,

            check_in:
              formatDateForInput(
                selectedReservation.check_in
              ),

            check_out:
              formatDateForInput(
                selectedReservation.check_out
              ),

            booking_status:
              "cancelled",

            remarks:
              editForm.remarks,

          }),
        }
      );

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};

      }

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to cancel reservation."
        );

      }

      setShowCancelConfirm(false);

      setSelectedReservation(null);

      await loadReservations();

      await loadRooms();

      alert(
        "Reservation cancelled successfully."
      );

    } catch (err) {

      console.error(
        "Cancel reservation error:",
        err
      );

      alert(
        err.message ||
        "Failed to cancel reservation."
      );

    } finally {

      setSaving(false);

    }
  };


  /* ===================================================
     STATUS LABEL
  =================================================== */

  const getStatusLabel = (status) => {

    const value = String(
      status || "pending"
    ).toLowerCase();

    const labels = {

      pending:
        "Pending",

      confirmed:
        "Confirmed",

      rejected:
        "Rejected",

      checked_in:
        "Checked In",

      checked_out:
        "Checked Out",

      completed:
        "Completed",

      cancelled:
        "Cancelled",

    };

    return (
      labels[value] ||
      value
    );
  };


  /* ===================================================
     STATUS CLASS
  =================================================== */

  const getStatusClass = (status) => {

    const value = String(
      status || "pending"
    ).toLowerCase();

    return `status-badge status-${value}`;
  };


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <div className="reservation-page">

        <div className="admin-container">

          <Sidebar />

          <div className="admin-main">

            <Topbar />

            <div className="admin-content">

              <div className="reservation-loading">

                <div className="loading-spinner"></div>

                <h2>
                  Loading Reservations
                </h2>

                <p>
                  Please wait while reservation
                  details are loaded.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /* ===================================================
     MAIN UI
  =================================================== */

  return (

    <div className="reservation-page">

      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="reservation-header">

              <div>

                <span className="page-eyebrow">
                  HOTEL MANAGEMENT
                </span>

                <h1>
                  Reservations
                </h1>

                <p>
                  Manage guest reservations,
                  rooms and booking details.
                </p>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="reservation-error">

                <FaExclamationTriangle />

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* =================================================
                CALENDAR + STATISTICS
            ================================================= */}

            <div className="reservation-layout">

              {/* CALENDAR */}

              <div className="calendar-card">

                <Calendar

                  localizer={localizer}

                  events={events}

                  startAccessor="start"

                  endAccessor="end"

                  date={calendarDate}

                  view={calendarView}

                  onNavigate={
                    handleCalendarNavigate
                  }

                  onView={
                    handleCalendarViewChange
                  }

                  views={[
                    Views.MONTH,
                    Views.WEEK,
                    Views.DAY,
                  ]}

                  components={{

                    toolbar:
                      (toolbarProps) => (

                        <CustomToolbar
                          {...toolbarProps}

                          onPrevious={
                            handlePreviousMonth
                          }

                          onNext={
                            handleNextMonth
                          }

                          onToday={
                            handleToday
                          }

                          onView={
                            handleCalendarViewChange
                          }
                        />

                      ),

                    event:
                      EventComponent,

                  }}

                  eventPropGetter={
                    eventStyleGetter
                  }

                  popup

                  toolbar

                  style={{
                    height: 520,
                  }}

                />

              </div>


              {/* STATISTICS */}

              <div className="reservation-statistics">

                <div className="reservation-stat-card stat-card-purple">

                  <div className="stat-icon">
                    <FaCalendarAlt />
                  </div>

                  <div className="stat-content">

                    <strong>
                      {
                        statistics.todaysBookings
                      }
                    </strong>

                    <span>
                      Today's Bookings
                    </span>

                  </div>

                </div>


                <div className="reservation-stat-card stat-card-blue">

                  <div className="stat-icon">
                    <FaBed />
                  </div>

                  <div className="stat-content">

                    <strong>
                      {
                        statistics.availableRooms
                      }
                    </strong>

                    <span>
                      Available Rooms
                    </span>

                  </div>

                </div>


                <div className="reservation-stat-card stat-card-green">

                  <div className="stat-icon">
                    <FaUsers />
                  </div>

                  <div className="stat-content">

                    <strong>
                      {
                        statistics.checkInsToday
                      }
                    </strong>

                    <span>
                      Check-ins Today
                    </span>

                  </div>

                </div>


                <div className="reservation-stat-card stat-card-orange">

                  <div className="stat-icon">
                    <FaClipboardCheck />
                  </div>

                  <div className="stat-content">

                    <strong>
                      {
                        statistics.pendingApproval
                      }
                    </strong>

                    <span>
                      Pending Approval
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                RESERVATIONS TABLE
            ================================================= */}

            <div className="reservation-table-card">

              <div className="reservation-table-header">

                <div>

                  <h2>
                    Reservations
                  </h2>

                  <p>
                    Click the guest name to view or
                    edit the reservation.
                  </p>

                </div>


                <div className="reservation-search">

                  <FaSearch />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search guest, room, status..."
                  />

                  {searchTerm && (

                    <button
                      type="button"
                      className="clear-search"
                      onClick={() =>
                        setSearchTerm("")
                      }
                    >
                      <FaTimes />
                    </button>

                  )}

                </div>

              </div>


              {/* RESULT COUNT */}

              <div className="reservation-result-count">

                Showing{" "}

                <strong>
                  {
                    filteredReservations.length
                  }
                </strong>

                {" "}of{" "}

                <strong>
                  {
                    reservations.length
                  }
                </strong>

                {" "}reservations

              </div>


              {/* TABLE */}

              <div className="reservation-table-wrapper">

                <table className="reservation-data-table">

                  <thead>

                    <tr>

                      <th>
                        Guest
                      </th>

                      <th>
                        Room
                      </th>

                      <th>
                        Check-in
                      </th>

                      <th>
                        Check-out
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Remarks
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredReservations.length === 0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="empty-reservations"
                        >

                          <FaSearch />

                          <h3>
                            No reservations found
                          </h3>

                          <p>
                            Try changing your search.
                          </p>

                        </td>

                      </tr>

                    ) : (

                      filteredReservations.map(
                        (reservation) => (

                          <tr
                            key={
                              reservation.id
                            }
                          >

                            {/* GUEST */}

                            <td>

                              <button
                                type="button"
                                className="guest-name-button"
                                onClick={() =>
                                  handleOpenEdit(
                                    reservation
                                  )
                                }
                              >

                                {
                                  reservation.guest_name ||
                                  reservation.customer_name ||
                                  "Unknown Guest"
                                }

                              </button>

                            </td>


                            {/* ROOM */}

                            <td>

                              <span className="room-value">

                                {
                                  formatRoom(
                                    reservation
                                  )
                                }

                              </span>

                            </td>


                            {/* CHECK-IN */}

                            <td>

                              {
                                formatDate(
                                  reservation.check_in
                                )
                              }

                            </td>


                            {/* CHECK-OUT */}

                            <td>

                              {
                                formatDate(
                                  reservation.check_out
                                )
                              }

                            </td>


                            {/* STATUS */}

                            <td>

                              <span
                                className={
                                  getStatusClass(
                                    reservation.booking_status
                                  )
                                }
                              >

                                {
                                  getStatusLabel(
                                    reservation.booking_status
                                  )
                                }

                              </span>

                            </td>


                            {/* REMARKS */}

                            <td>

                              <span className="remarks-value">

                                {
                                  reservation.remarks ||
                                  "No remarks"
                                }

                              </span>

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {selectedReservation && (

        <div
          className="reservation-modal-overlay"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              handleCloseEdit();

            }

          }}
        >

          <div className="reservation-modal">

            {/* MODAL HEADER */}

            <div className="reservation-modal-header">

              <div>

                <span className="modal-eyebrow">
                  RESERVATION DETAILS
                </span>

                <h2>
                  Edit Reservation
                </h2>

                <p>
                  All details below are loaded
                  from the database.
                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  handleCloseEdit
                }
                disabled={
                  saving
                }
              >

                <FaTimes />

              </button>

            </div>


            {/* GUEST INFORMATION */}

            <div className="guest-information">

              <div className="guest-avatar">

                {
                  (
                    selectedReservation.guest_name ||
                    "G"
                  )
                    .charAt(0)
                    .toUpperCase()
                }

              </div>


              <div>

                <h3>

                  {
                    selectedReservation.guest_name ||
                    selectedReservation.customer_name ||
                    "Unknown Guest"
                  }

                </h3>


                <p>

                  {
                    selectedReservation.guest_email ||
                    "Email not available"
                  }

                </p>


                <span>

                  {
                    selectedReservation.guest_phone ||
                    "Phone not available"
                  }

                </span>

              </div>

            </div>


            {/* EDIT FORM */}

            <div className="reservation-edit-form">

              {/* ROOM */}

              <div className="form-group">

                <label htmlFor="room_id">
                  Room
                </label>

                <select
                  id="room_id"
                  name="room_id"
                  value={
                    editForm.room_id
                  }
                  onChange={
                    handleEditChange
                  }
                >

                  <option value="">
                    Select Room
                  </option>


                  {rooms.map(
                    (room) => (

                      <option
                        key={
                          room.id
                        }
                        value={
                          room.id
                        }
                      >

                        {room.room_number}
                        {" - "}
                        {room.room_type}

                        {room.status
                          ? ` (${room.status})`
                          : ""}

                      </option>

                    )
                  )}


                  {selectedReservation.room_id &&
                    !rooms.some(
                      (room) =>
                        Number(
                          room.id
                        ) ===
                        Number(
                          selectedReservation.room_id
                        )
                    ) && (

                      <option
                        value={
                          selectedReservation.room_id
                        }
                      >

                        {
                          formatRoom(
                            selectedReservation
                          )
                        }

                        {
                          selectedReservation.room_status
                            ? ` (${selectedReservation.room_status})`
                            : ""
                        }

                      </option>

                    )}

                </select>

              </div>


              {/* CHECK-IN */}

              <div className="form-group">

                <label htmlFor="check_in">
                  Check-in
                </label>

                <input
                  id="check_in"
                  type="date"
                  name="check_in"
                  value={
                    editForm.check_in
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* CHECK-OUT */}

              <div className="form-group">

                <label htmlFor="check_out">
                  Check-out
                </label>

                <input
                  id="check_out"
                  type="date"
                  name="check_out"
                  value={
                    editForm.check_out
                  }
                  onChange={
                    handleEditChange
                  }
                />

              </div>


              {/* STATUS */}

              <div className="form-group">

                <label htmlFor="booking_status">
                  Reservation Status
                </label>

                <select
                  id="booking_status"
                  name="booking_status"
                  value={
                    editForm.booking_status
                  }
                  onChange={
                    handleEditChange
                  }
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="checked_in">
                    Checked In
                  </option>

                  <option value="checked_out">
                    Checked Out
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>


              {/* REMARKS */}

              <div className="form-group form-group-full">

                <label htmlFor="remarks">
                  Remarks
                </label>

                <textarea
                  id="remarks"
                  name="remarks"
                  rows="4"
                  value={
                    editForm.remarks
                  }
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter reservation remarks..."
                />

              </div>

            </div>


            {/* CANCEL CONFIRMATION */}

            {showCancelConfirm && (

              <div className="cancel-confirmation">

                <div className="cancel-warning-icon">

                  <FaExclamationTriangle />

                </div>


                <div className="cancel-warning-content">

                  <h4>
                    Cancel this reservation?
                  </h4>

                  <p>
                    The reservation will be marked
                    as cancelled and its room will
                    become available.
                  </p>

                </div>


                <div className="cancel-confirm-buttons">

                  <button
                    type="button"
                    className="cancel-no-btn"
                    onClick={() =>
                      setShowCancelConfirm(
                        false
                      )
                    }
                    disabled={
                      saving
                    }
                  >
                    Keep Reservation
                  </button>


                  <button
                    type="button"
                    className="cancel-yes-btn"
                    onClick={
                      handleCancelReservation
                    }
                    disabled={
                      saving
                    }
                  >
                    Yes, Cancel
                  </button>

                </div>

              </div>

            )}


            {/* MODAL FOOTER */}

            <div className="reservation-modal-footer">

              <button
                type="button"
                className="reservation-cancel-button"
                onClick={() =>
                  setShowCancelConfirm(
                    true
                  )
                }
                disabled={
                  saving ||
                  editForm.booking_status ===
                    "cancelled"
                }
              >

                Cancel Reservation

              </button>


              <div className="modal-footer-right">

                <button
                  type="button"
                  className="modal-secondary-button"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={
                    saving
                  }
                >
                  Close
                </button>


                <button
                  type="button"
                  className="modal-save-button"
                  onClick={
                    handleSaveReservation
                  }
                  disabled={
                    saving
                  }
                >

                  {saving ? (

                    <>
                      Saving...
                    </>

                  ) : (

                    <>
                      <FaSave />
                      Save Changes
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default Reservations;