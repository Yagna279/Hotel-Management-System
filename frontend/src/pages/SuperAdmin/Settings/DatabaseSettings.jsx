import React, { useState } from "react";

import {
  FaDatabase,
  FaServer,
  FaCheckCircle,
  FaSave,
  FaInfoCircle,
} from "react-icons/fa";

import "./DatabaseSettings.css";


function DatabaseSettings() {
  const [message, setMessage] = useState("");


  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    setMessage("Database settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    setMessage("");
  };


  return (
    <div className="database-settings-container">


      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="database-settings-heading">

        <div className="database-heading-icon">
          <FaDatabase />
        </div>

        <div>

          <h2>
            Database Settings
          </h2>

          <p>
            View and manage your hotel management system database
            information.
          </p>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div className="database-settings-success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>
      )}


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="database-settings-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="database-card-header">

          <div className="database-card-icon">
            <FaDatabase />
          </div>

          <div>

            <h3>
              Database Information
            </h3>

            <p>
              Current PostgreSQL database connection information.
            </p>

          </div>

        </div>


        {/* =================================================
            CONNECTION STATUS
        ================================================= */}

        <div className="database-status-card">

          <div className="database-server-icon">
            <FaServer />
          </div>

          <div className="database-status-info">

            <strong>
              PostgreSQL Database
            </strong>

            <span>
              Hotel Management System Database
            </span>

          </div>

          <div className="database-connected">

            <FaCheckCircle />

            <span>
              Connected
            </span>

          </div>

        </div>


        {/* =================================================
            DATABASE INFORMATION
        ================================================= */}

        <div className="database-info-section">

          <h4>
            Connection Details
          </h4>


          <div className="database-info-grid">


            {/* DATABASE */}

            <div className="database-info-item">

              <span>
                Database
              </span>

              <strong>
                hotel_management
              </strong>

            </div>


            {/* HOST */}

            <div className="database-info-item">

              <span>
                Host
              </span>

              <strong>
                localhost
              </strong>

            </div>


            {/* PORT */}

            <div className="database-info-item">

              <span>
                Port
              </span>

              <strong>
                5432
              </strong>

            </div>


            {/* TYPE */}

            <div className="database-info-item">

              <span>
                Database Type
              </span>

              <strong>
                PostgreSQL
              </strong>

            </div>


          </div>

        </div>


        {/* =================================================
            DATABASE MANAGEMENT INFORMATION
        ================================================= */}

        <div className="database-information-box">

          <div className="database-information-icon">
            <FaInfoCircle />
          </div>

          <div>

            <strong>
              Database Management
            </strong>

            <p>
              Database credentials and connection settings should
              be managed through your backend environment
              configuration.
            </p>

          </div>

        </div>


        {/* =================================================
            DATABASE STATUS
        ================================================= */}

        <div className="database-health-section">

          <div className="database-health-header">

            <div>

              <h4>
                Database Status
              </h4>

              <p>
                Current database connection health.
              </p>

            </div>

            <span className="database-health-badge">
              Healthy
            </span>

          </div>


          <div className="database-health-items">


            <div className="database-health-item">

              <span className="database-status-dot"></span>

              <div>

                <strong>
                  Connection
                </strong>

                <small>
                  Active
                </small>

              </div>

            </div>


            <div className="database-health-item">

              <span className="database-status-dot"></span>

              <div>

                <strong>
                  PostgreSQL Server
                </strong>

                <small>
                  Running
                </small>

              </div>

            </div>


            <div className="database-health-item">

              <span className="database-status-dot"></span>

              <div>

                <strong>
                  Database Access
                </strong>

                <small>
                  Available
                </small>

              </div>

            </div>


          </div>

        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="database-settings-actions">


          <button
            type="button"
            className="database-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>


          <button
            type="button"
            className="database-save-btn"
            onClick={handleSave}
          >

            <FaSave />

            Save Changes

          </button>


        </div>


      </div>

    </div>
  );
}


export default DatabaseSettings;