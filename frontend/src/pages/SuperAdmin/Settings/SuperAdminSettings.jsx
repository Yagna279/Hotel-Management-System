import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SuperAdminSidebar from "../SuperAdminSidebar";
import SuperAdminTopbar from "../SuperAdminTopbar";

import {
  FaUserShield,
  FaHotel,
  FaBell,
  FaLock,
  FaGlobe,
  FaDatabase,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";

import GeneralSettings from "./GeneralSettings";
import HotelSettings from "./HotelSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import RegionalSettings from "./RegionalSettings";
import DatabaseSettings from "./DatabaseSettings";

import "./SuperAdminSettings.css";

function SuperAdminSettings() {
  const navigate = useNavigate();

  const [activeSetting, setActiveSetting] = useState("general");

  const settingsMenu = [
    {
      id: "general",
      title: "General",
      description: "System preferences",
      icon: <FaUserShield />,
      color: "blue",
    },
    {
      id: "hotel",
      title: "Hotel Settings",
      description: "Hotel information",
      icon: <FaHotel />,
      color: "green",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Alert preferences",
      icon: <FaBell />,
      color: "orange",
    },
    {
      id: "security",
      title: "Security",
      description: "Security controls",
      icon: <FaLock />,
      color: "purple",
    },
    {
      id: "regional",
      title: "Regional",
      description: "Language and currency",
      icon: <FaGlobe />,
      color: "cyan",
    },
    {
      id: "database",
      title: "Database",
      description: "Database management",
      icon: <FaDatabase />,
      color: "red",
    },
  ];

  const renderActiveSetting = () => {
    switch (activeSetting) {
      case "general":
        return <GeneralSettings />;

      case "hotel":
        return <HotelSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "security":
        return <SecuritySettings />;

      case "regional":
        return <RegionalSettings />;

      case "database":
        return <DatabaseSettings />;

      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="super-admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SuperAdminSidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="super-admin-main">

        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <SuperAdminTopbar />

        {/* =====================================================
            SETTINGS PAGE
        ===================================================== */}

        <main className="super-admin-settings">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="super-settings-header">

            <div>
              <div className="super-settings-breadcrumb">
                Super Admin / Settings
              </div>

              <h1>System Settings</h1>

              <p>
                Manage your hotel management system preferences and controls.
              </p>
            </div>

            <div className="super-settings-header-icon">
              <FaSave />
            </div>

          </div>

          {/* =====================================================
              SETTINGS LAYOUT
          ===================================================== */}

          <div className="super-settings-layout">

            {/* ===================================================
                LEFT SETTINGS MENU
            =================================================== */}

            <aside className="super-settings-menu">

              <div className="super-settings-menu-title">
                <span>Settings</span>
              </div>

              <div className="super-settings-menu-list">

                {settingsMenu.map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    className={`super-settings-menu-item ${
                      activeSetting === item.id ? "active" : ""
                    }`}
                    onClick={() => setActiveSetting(item.id)}
                  >

                    <span
                      className={`settings-menu-icon ${item.color}`}
                    >
                      {item.icon}
                    </span>

                    <span className="settings-menu-text">

                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.description}
                      </small>

                    </span>

                    <FaChevronRight className="settings-menu-arrow" />

                  </button>

                ))}

              </div>

            </aside>

            {/* ===================================================
                RIGHT SETTINGS CONTENT
            =================================================== */}

            <section className="super-settings-content">

              {renderActiveSetting()}

              {/* =================================================
                  BOTTOM ACTIONS
              ================================================= */}

              

              

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}

export default SuperAdminSettings;