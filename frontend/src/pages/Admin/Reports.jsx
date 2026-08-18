import React, { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  FaMoneyBillWave,
  FaBed,
  FaUsers,
  FaCalendarCheck,
  FaDownload,
} from "react-icons/fa";

import "./Reports.css";

function Reports() {

  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    bookings: 0,
    occupancy: 0,
    customers: 0,
  });

  const [revenueOverview, setRevenueOverview] = useState([]);
  const [roomTypeAnalysis, setRoomTypeAnalysis] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD REPORTS
  ===================================================== */

  const loadReports = async () => {
    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/reports"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reports."
        );
      }

      setStatistics(
        data.statistics || {
          totalRevenue: 0,
          bookings: 0,
          occupancy: 0,
          customers: 0,
        }
      );

      setRevenueOverview(
        data.revenueOverview || []
      );

      setRoomTypeAnalysis(
        data.roomTypeAnalysis || []
      );

      setMonthlyRevenue(
        data.monthlyRevenue || []
      );

    } catch (error) {

      console.error("Reports error:", error);

      setError(
        error.message || "Unable to load reports."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadReports();
  }, []);

  /* =====================================================
     CURRENCY
  ===================================================== */

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  /* =====================================================
     REVENUE BAR COLORS
  ===================================================== */

  const getRevenueColor = (index) => {

    const colors = [
      "blue",
      "green",
      "orange",
      "purple",
      "red",
      "teal",
    ];

    return colors[index % colors.length];

  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="admin-container">

        <Sidebar />

        <div className="admin-main">

          <Topbar />

          <div className="admin-content">

            <div className="reports-header">

              <div>

                <h1>
                  Reports & Analysis
                </h1>

                <p>
                  Loading hotel performance data...
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <div className="admin-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="reports-header">

            <div>

              <h1>
                Reports & Analysis
              </h1>

              <p>
                Hotel performance overview
              </p>

            </div>

            <button
              className="download-btn"
              type="button"
            >

              <FaDownload />

              Export Report

            </button>

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

          <div className="reports-stats">

            <div className="report-card">

              <div className="icon-box blue">

                <FaMoneyBillWave
                  className="report-icon"
                />

              </div>

              <div>

                <h2>
                  {formatCurrency(
                    statistics.totalRevenue
                  )}
                </h2>

                <p>
                  Total Revenue
                </p>

              </div>

            </div>


            <div className="report-card">

              <div className="icon-box green">

                <FaCalendarCheck
                  className="report-icon"
                />

              </div>

              <div>

                <h2>
                  {statistics.bookings}
                </h2>

                <p>
                  Bookings
                </p>

              </div>

            </div>


            <div className="report-card">

              <div className="icon-box orange">

                <FaBed
                  className="report-icon"
                />

              </div>

              <div>

                <h2>
                  {statistics.occupancy}%
                </h2>

                <p>
                  Occupancy
                </p>

              </div>

            </div>


            <div className="report-card">

              <div className="icon-box purple">

                <FaUsers
                  className="report-icon"
                />

              </div>

              <div>

                <h2>
                  {statistics.customers}
                </h2>

                <p>
                  Customers
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ANALYSIS GRID
          ================================================= */}

          <div className="analysis-grid">

            {/* =================================================
                REVENUE OVERVIEW
            ================================================= */}

            <div className="analysis-card revenue-card">

              <h2>
                Revenue Overview
              </h2>

              {revenueOverview.length === 0 ? (

                <p className="no-data">
                  No revenue data available.
                </p>

              ) : (

                revenueOverview.map(
                  (item, index) => (

                    <div
                      className="progress-group"
                      key={item.name || index}
                    >

                      <div className="progress-label">

                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {formatCurrency(
                            item.amount
                          )}
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <div
                          className={`progress revenue-${getRevenueColor(index)}`}
                          style={{
                            width: `${Math.min(
                              Number(item.percentage) || 0,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      <div className="percentage-text">

                        {Number(
                          item.percentage || 0
                        ).toFixed(1)}%

                      </div>

                    </div>

                  )
                )

              )}

            </div>


            {/* =================================================
                ROOM TYPE ANALYSIS
            ================================================= */}

            <div className="analysis-card room-analysis-card">

              <h2>
                Room Type Analysis
              </h2>

              {roomTypeAnalysis.length === 0 ? (

                <p className="no-data">
                  No room booking data available.
                </p>

              ) : (

                <table>

                  <thead>

                    <tr>

                      <th>
                        Room Type
                      </th>

                      <th>
                        Percentage
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {roomTypeAnalysis.map(
                      (item, index) => (

                        <tr
                          key={
                            item.room_type || index
                          }
                        >

                          <td>
                            {item.room_type}
                          </td>

                          <td>

                            <div className="room-percentage">

                              <span>
                                {Number(
                                  item.percentage || 0
                                ).toFixed(1)}%
                              </span>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </div>


          {/* =================================================
              MONTHLY REVENUE
          ================================================= */}

          <div className="report-table">

            <h2>
              Monthly Revenue
            </h2>

            <div className="monthly-table-wrapper">

              <table>

                <thead>

                  <tr>

                    <th>
                      Month
                    </th>

                    <th>
                      Bookings
                    </th>

                    <th>
                      Revenue
                    </th>

                    <th>
                      Occupancy
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {monthlyRevenue.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        className="empty-table"
                      >
                        No monthly revenue data available.
                      </td>

                    </tr>

                  ) : (

                    monthlyRevenue.map(
                      (item, index) => (

                        <tr
                          key={
                            item.month_number || index
                          }
                        >

                          <td>
                            {item.month}
                          </td>

                          <td>
                            {item.bookings}
                          </td>

                          <td>
                            {formatCurrency(
                              item.revenue
                            )}
                          </td>

                          <td>
                            {item.occupancy}%
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
  );
}

export default Reports;