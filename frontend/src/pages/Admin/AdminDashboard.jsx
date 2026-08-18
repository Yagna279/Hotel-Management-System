import React, {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./Admin.css";

import {
  FaCalendarCheck,
  FaUsers,
  FaMoneyBillWave,
  FaDoorOpen,
  FaTools,
} from "react-icons/fa";

import { MdHotel } from "react-icons/md";


function AdminDashboard() {

  // =====================================================
  // STATE
  // =====================================================

  const [statistics, setStatistics] = useState({

    totalRooms: 0,

    reservations: 0,

    customers: 0,

    totalRevenue: 0,

  });


  const [roomStatus, setRoomStatus] = useState({

    available: 0,

    occupied: 0,

    maintenance: 0,

  });


  const [recentReservations, setRecentReservations] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await fetch(
            "http://localhost:5000/api/admin/dashboard"
          );


        const data =
          await response.json();


        console.log(
          "Admin dashboard data:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load dashboard."
          );

        }


        // =================================================
        // STATISTICS
        // =================================================

        setStatistics(

          data.statistics || {

            totalRooms: 0,

            reservations: 0,

            customers: 0,

            totalRevenue: 0,

          }

        );


        // =================================================
        // ROOM STATUS
        // =================================================

        setRoomStatus(

          data.roomStatus || {

            available: 0,

            occupied: 0,

            maintenance: 0,

          }

        );


        // =================================================
        // RECENT RESERVATIONS
        // =================================================

        setRecentReservations(

          data.recentReservations || []

        );


      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );


        setError(

          error.message ||
          "Unable to load dashboard."

        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "-";

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "-";

    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (status) => {

    const normalizedStatus =
      String(
        status || ""
      ).toLowerCase();


    if (
      normalizedStatus ===
      "confirmed"
    ) {

      return "confirmed";

    }


    if (
      normalizedStatus ===
      "pending"
    ) {

      return "pending";

    }


    if (
      normalizedStatus ===
      "checked in"
    ) {

      return "checked";

    }


    if (
      normalizedStatus ===
      "checked_in"
    ) {

      return "checked";

    }


    if (
      normalizedStatus ===
      "completed"
    ) {

      return "confirmed";

    }


    if (
      normalizedStatus ===
      "cancelled"
    ) {

      return "pending";

    }


    return "pending";

  };


  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  const getDisplayStatus = (status) => {

    if (!status) {

      return "Pending";

    }


    const normalizedStatus =
      String(status)
        .toLowerCase();


    if (
      normalizedStatus ===
      "checked_in"
    ) {

      return "Checked In";

    }


    return (

      String(status)
        .charAt(0)
        .toUpperCase() +

      String(status)
        .slice(1)

    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            <div className="dashboard-header">

              <h1>
                Dashboard
              </h1>

              <p>
                Loading dashboard data...
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN
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

          <div className="dashboard-header">

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, Admin
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="customer-message error">

              {error}

            </div>

          )}


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">


            {/* =================================================
                TOTAL ROOMS
            ================================================= */}

            <div className="stat-card">

              <div className="icon-box blue">

                <MdHotel
                  className="stat-icon"
                />

              </div>


              <div>

                <h3>

                  {statistics.totalRooms}

                </h3>

                <p>
                  Total Rooms
                </p>

              </div>

            </div>


            {/* =================================================
                RESERVATIONS
            ================================================= */}

            <div className="stat-card">

              <div className="icon-box green">

                <FaCalendarCheck
                  className="stat-icon"
                />

              </div>


              <div>

                <h3>

                  {statistics.reservations}

                </h3>

                <p>
                  Reservations
                </p>

              </div>

            </div>


            {/* =================================================
                CUSTOMERS
            ================================================= */}

            <div className="stat-card">

              <div className="icon-box orange">

                <FaUsers
                  className="stat-icon"
                />

              </div>


              <div>

                <h3>

                  {statistics.customers}

                </h3>

                <p>
                  Customers
                </p>

              </div>

            </div>


            {/* =================================================
                REVENUE
            ================================================= */}

            <div className="stat-card">

              <div className="icon-box purple">

                <FaMoneyBillWave
                  className="stat-icon"
                />

              </div>


              <div>

                <h3>

                  {formatCurrency(
                    statistics.totalRevenue
                  )}

                </h3>

                <p>
                  Total Revenue
                </p>

              </div>

            </div>


          </div>


          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="dashboard-bottom">


            {/* =================================================
                RECENT RESERVATIONS
            ================================================= */}

            <div className="dashboard-box">

              <h2>
                Recent Reservations
              </h2>


              <table>

                <thead>

                  <tr>

                    <th>
                      Guest
                    </th>

                    <th>
                      Room
                    </th>

                    <th>
                      Check In Date
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {recentReservations.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "25px",
                        }}
                      >

                        No reservations found.

                      </td>

                    </tr>

                  ) : (

                    recentReservations.map(
                      (reservation) => (

                        <tr
                          key={
                            reservation.id
                          }
                        >

                          <td>

                            {reservation.guest_name ||
                              "Unknown"}

                          </td>


                          <td>

                            {reservation.room_number ||
                              "-"}

                          </td>


                          <td>

                            {formatDate(
                              reservation.check_in
                            )}

                          </td>


                          <td>

                            <span
                              className={`status ${getStatusClass(
                                reservation.booking_status
                              )}`}
                            >

                              {getDisplayStatus(
                                reservation.booking_status
                              )}

                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                ROOM STATUS
            ================================================= */}

            <div className="dashboard-box">

              <h2>
                Room Status
              </h2>


              <div className="room-status">


                {/* =================================================
                    AVAILABLE
                ================================================= */}

                <div className="status-card">

                  <div className="status-icon-box green">

                    <FaDoorOpen
                      className="status-icon"
                    />

                  </div>


                  <div className="status-info">

                    <h3>

                      {roomStatus.available}

                    </h3>

                    <p>
                      Available
                    </p>

                  </div>

                </div>


                {/* =================================================
                    OCCUPIED
                ================================================= */}

                <div className="status-card">

                  <div className="status-icon-box orange">

                    <MdHotel
                      className="status-icon"
                    />

                  </div>


                  <div className="status-info">

                    <h3>

                      {roomStatus.occupied}

                    </h3>

                    <p>
                      Occupied
                    </p>

                  </div>

                </div>


                {/* =================================================
                    MAINTENANCE
                ================================================= */}

                <div className="status-card">

                  <div className="status-icon-box red">

                    <FaTools
                      className="status-icon"
                    />

                  </div>


                  <div className="status-info">

                    <h3>

                      {roomStatus.maintenance}

                    </h3>

                    <p>
                      Maintenance
                    </p>

                  </div>

                </div>


              </div>

            </div>


          </div>

        </div>

      </div>

    </div>

  );

}


export default AdminDashboard;