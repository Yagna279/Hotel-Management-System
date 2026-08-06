import React from "react";
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

import {
  FaCalendarAlt,
  FaBed,
  FaUsers,
  FaClipboardCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Reservations.css";

const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/* ============================
   EVENTS
============================ */

const events = [
  {
    title: "2",
    start: new Date(2026, 7, 5),
    end: new Date(2026, 7, 5),
    status: "confirmed",
  },
  {
    title: "1",
    start: new Date(2026, 7, 8),
    end: new Date(2026, 7, 8),
    status: "checked",
  },
  {
    title: "3",
    start: new Date(2026, 7, 15),
    end: new Date(2026, 7, 15),
    status: "pending",
  },
  {
    title: "12",
    start: new Date(2026, 7, 20),
    end: new Date(2026, 7, 20),
    status: "confirmed",
  },
];

/* ============================
   SMALL NUMBER BADGE
============================ */

const EventComponent = ({ event }) => (
  <div className={`booking-badge ${event.status}`}>
    {event.title}
  </div>
);

/* ============================
   EVENT COLORS
============================ */

const eventStyleGetter = () => ({
  style: {
    background: "transparent",
    border: "none",
    boxShadow: "none",
    padding: 0,
  },
});

/* ============================
   CUSTOM TOOLBAR
============================ */

const CustomToolbar = ({ label, onNavigate, onView }) => (
  <div className="calendar-toolbar">

    <div className="toolbar-left">

      <button onClick={() => onNavigate("PREV")}>
        <FaChevronLeft />
      </button>

      <button onClick={() => onNavigate("TODAY")}>
        Today
      </button>

      <button onClick={() => onNavigate("NEXT")}>
        <FaChevronRight />
      </button>

    </div>

    <h2>{label}</h2>

    <div className="toolbar-right">

      <button onClick={() => onView(Views.MONTH)}>
        Month
      </button>

      <button onClick={() => onView(Views.WEEK)}>
        Week
      </button>

      <button onClick={() => onView(Views.DAY)}>
        Day
      </button>

    </div>

  </div>
);
function Reservations() {

  const reservations = [
    {
      name: "Yagna",
      room: "Room 101 • Deluxe Room",
      status: "Confirmed",
      className: "confirmed",
    },
    {
      name: "Dhoni",
      room: "Room 205 • Suite Room",
      status: "Pending",
      className: "pending",
    },
    {
      name: "Teja",
      room: "Room 304 • Standard Room",
      status: "Checked In",
      className: "checked",
    },
    {
      name: "Dileep",
      room: "Room 410 • Executive Room",
      status: "Confirmed",
      className: "confirmed",
    },
  ];

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* Header */}

          <div className="reservation-header">

            <div>
              <h1>Reservations</h1>
              <p>Manage Hotel Bookings Efficiently</p>
            </div>

          </div>

          {/* Calendar + Stats */}

          <div className="reservation-layout">

            <div className="calendar-section">

              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={Views.MONTH}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                popup
                selectable
                toolbar
                style={{ height: 470 }}
                components={{
                  toolbar: CustomToolbar,
                  event: EventComponent,
                }}
                eventPropGetter={eventStyleGetter}
              />

            </div>

            {/* Right Side Cards */}

            <div className="reservation-sidebar">

              <div className="reservation-card">

                <div className="icon-box blue">
                  <FaCalendarAlt className="reservation-icon" />
                </div>

                <h2>24</h2>

                <p>Today's Bookings</p>

              </div>

              <div className="reservation-card">

                <div className="icon-box green">
                  <FaBed className="reservation-icon" />
                </div>

                <h2>120</h2>

                <p>Available Rooms</p>

              </div>

              <div className="reservation-card">

                <div className="icon-box orange">
                  <FaUsers className="reservation-icon" />
                </div>

                <h2>15</h2>

                <p>Check-ins Today</p>

              </div>

              <div className="reservation-card">

                <div className="icon-box purple">
                  <FaClipboardCheck className="reservation-icon" />
                </div>

                <h2>8</h2>

                <p>Pending Approval</p>

              </div>

            </div>

          </div>

          {/* Today's Reservations */}

          <div className="reservation-list">

            <h2>Today's Reservations</h2>

            {reservations.map((reservation, index) => (

              <div
                className="reservation-item"
                key={index}
              >

                <div>

                  <h4>{reservation.name}</h4>

                  <p>{reservation.room}</p>

                </div>

                <span className={`status ${reservation.className}`}>
                  {reservation.status}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );

}

export default Reservations;