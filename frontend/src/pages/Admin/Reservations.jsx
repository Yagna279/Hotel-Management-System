import React, { useState } from "react";
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
   CALENDAR EVENTS
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
   EVENT BADGE
============================ */

const EventComponent = ({ event }) => (
  <div className={`booking-badge ${event.status}`}>
    {event.title}
  </div>
);

/* ============================
   EVENT STYLE
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

  const [reservations, setReservations] = useState([
    {
      name: "Yagna",
      room: "101 - Deluxe Room",
      date: "07 Aug 2026",
      status: "Confirmed",
      remarks:
        "Guest requested an early check-in at 10:00 AM and a high-floor room with a city view.",
    },
    {
      name: "Dhoni",
      room: "205 - Suite Room",
      date: "07 Aug 2026",
      status: "Pending",
      remarks:
        "Waiting for advance payment confirmation before assigning the room officially.",
    },
    {
      name: "Teja",
      room: "304 - Standard Room",
      date: "07 Aug 2026",
      status: "Checked In",
      remarks:
        "Guest has successfully checked in and requested an extra blanket and breakfast.",
    },
    {
      name: "Dileep",
      room: "410 - Executive Room",
      date: "07 Aug 2026",
      status: "Checked Out",
      remarks:
        "Guest completed checkout successfully. Room is ready for housekeeping inspection.",
    },
    {
      name: "Rahul",
      room: "118 - Deluxe Room",
      date: "07 Aug 2026",
      status: "Rejected",
      remarks:
        "Reservation was cancelled because payment was not completed before the deadline.",
    },
  ]);

  const handleStatusChange = (index, value) => {
    const updated = [...reservations];
    updated[index].status = value;
    setReservations(updated);
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          <div className="reservation-header">

            <div>

              <h1>Reservations</h1>

              <p>Manage Hotel Bookings Efficiently</p>

            </div>

          </div>

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

            {/* Right Side Cards continue in Part 2 */}
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

          {/* Today's Reservations Table */}

          <div className="reservation-table">

            <div className="table-header">

              <h2>Today's Reservations</h2>

            </div>

            <table>

              <thead>

                <tr>

                  <th>Name</th>

                  <th>Room</th>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Remarks</th>

                </tr>

              </thead>

              <tbody>

                {reservations.map((reservation, index) => (

                  <tr key={index}>

                    <td>

                      <strong>{reservation.name}</strong>

                    </td>

                    <td>{reservation.room}</td>

                    <td>{reservation.date}</td>

                    <td>

                      <select
                        className="status-select"
                        value={reservation.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                      >

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Checked In">
                          Checked In
                        </option>

                        <option value="Checked Out">
                          Checked Out
                        </option>

                      </select>

                    </td>

                    <td className="remarks">

                      {reservation.remarks}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
                  </div>

      </div>

    </div>

  );

}

export default Reservations;