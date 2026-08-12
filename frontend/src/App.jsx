import React from "react";
import { Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import BookDemo from "./pages/BookDemo";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

// =====================================================
// AUTHENTICATION
// =====================================================

import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Reservations from "./pages/Admin/Reservations";
import Rooms from "./pages/Admin/Rooms";
import Payments from "./pages/Admin/Payments";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import AdminServices from "./pages/Admin/AdminServices";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

// =====================================================
// CUSTOMER
// =====================================================

import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerBookings from "./pages/Customer/CustomerBookings";
import CustomerRooms from "./pages/Customer/CustomerRooms";
import CustomerServices from "./pages/Customer/CustomerServices";
import CustomerPayments from "./pages/Customer/CustomerPayments";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import CustomerSettings from "./pages/Customer/CustomerSettings";

// =====================================================
// SUPER ADMIN
// =====================================================

import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminUsers from "./pages/SuperAdmin/SuperAdminUsers";
import SuperAdminManagement from "./pages/SuperAdmin/SuperAdminManagement";
import SuperAdminHotels from "./pages/SuperAdmin/SuperAdminHotels";
import SuperAdminReports from "./pages/SuperAdmin/SuperAdminReports";

// =====================================================
// SUPER ADMIN SETTINGS
// =====================================================

// Main settings page
import SuperAdminSettings from "./pages/SuperAdmin/Settings/SuperAdminSettings";

// Individual settings pages
import HotelSettings from "./pages/SuperAdmin/Settings/HotelSettings";
import NotificationSettings from "./pages/SuperAdmin/Settings/NotificationSettings";
import SecuritySettings from "./pages/SuperAdmin/Settings/SecuritySettings";
import RegionalSettings from "./pages/SuperAdmin/Settings/RegionalSettings";
import DatabaseSettings from "./pages/SuperAdmin/Settings/DatabaseSettings";

// =====================================================
// APP CSS
// =====================================================

import "./App.css";

// =====================================================
// HOME PAGE
// =====================================================

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <BookDemo />
      <Contact />
      <Footer />
    </>
  );
}

// =====================================================
// 404 PAGE
// =====================================================

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fb",
        color: "#1f2937",
        padding: "20px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "72px",
          fontWeight: "800",
        }}
      >
        404
      </h1>

      <h2
        style={{
          margin: 0,
          fontSize: "28px",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          margin: 0,
          color: "#6b7280",
        }}
      >
        The page you are looking for does not exist.
      </p>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC HOME
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* =================================================
          AUTHENTICATION
      ================================================= */}

      <Route
        path="/get-started"
        element={<GetStarted />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* =================================================
          SUPER ADMIN
      ================================================= */}

      {/* SUPER ADMIN DASHBOARD */}

      <Route
        path="/super-admin-dashboard"
        element={<SuperAdminDashboard />}
      />

      {/* SUPER ADMIN USERS */}

      <Route
        path="/super-admin/users"
        element={<SuperAdminUsers />}
      />

      {/* SUPER ADMIN ADMINS */}

      <Route
        path="/super-admin/admins"
        element={<SuperAdminManagement />}
      />

      {/* SUPER ADMIN MANAGEMENT */}

      <Route
        path="/super-admin/management"
        element={<SuperAdminManagement />}
      />

      {/* SUPER ADMIN HOTELS */}

      <Route
        path="/super-admin/hotels"
        element={<SuperAdminHotels />}
      />

      {/* SUPER ADMIN REPORTS */}

      <Route
        path="/super-admin/reports"
        element={<SuperAdminReports />}
      />

      {/* =================================================
          SUPER ADMIN SETTINGS
      ================================================= */}

      {/* MAIN SETTINGS */}

      <Route
        path="/super-admin/settings"
        element={<SuperAdminSettings />}
      />

      {/* HOTEL SETTINGS */}

      <Route
        path="/super-admin/settings/hotel"
        element={<HotelSettings />}
      />

      {/* NOTIFICATION SETTINGS */}

      <Route
        path="/super-admin/settings/notifications"
        element={<NotificationSettings />}
      />

      {/* SECURITY SETTINGS */}

      <Route
        path="/super-admin/settings/security"
        element={<SecuritySettings />}
      />

      {/* REGIONAL SETTINGS */}

      <Route
        path="/super-admin/settings/regional"
        element={<RegionalSettings />}
      />

      {/* DATABASE SETTINGS */}

      <Route
        path="/super-admin/settings/database"
        element={<DatabaseSettings />}
      />

      {/* =================================================
          ADMIN
      ================================================= */}

      {/* ADMIN DASHBOARD */}

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      {/* ADMIN RESERVATIONS */}

      <Route
        path="/admin/reservations"
        element={<Reservations />}
      />

      {/* ADMIN ROOMS */}

      <Route
        path="/admin/rooms"
        element={<Rooms />}
      />

      {/* ADMIN PAYMENTS */}

      <Route
        path="/admin/payments"
        element={<Payments />}
      />

      {/* ADMIN CUSTOMER MANAGEMENT */}

      <Route
        path="/admin/customers"
        element={<CustomerManagement />}
      />

      {/* ADMIN SERVICES */}

      <Route
        path="/admin/adminservices"
        element={<AdminServices />}
      />

      {/* ADMIN REPORTS */}

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      {/* ADMIN SETTINGS */}

      <Route
        path="/admin/settings"
        element={<Settings />}
      />

      {/* =================================================
          CUSTOMER
      ================================================= */}

      {/* CUSTOMER DASHBOARD */}

      <Route
        path="/customer-dashboard"
        element={<CustomerDashboard />}
      />

      {/* CUSTOMER BOOKINGS */}

      <Route
        path="/customer/bookings"
        element={<CustomerBookings />}
      />

      {/* CUSTOMER ROOMS */}

      <Route
        path="/customer/rooms"
        element={<CustomerRooms />}
      />

      {/* CUSTOMER SERVICES */}

      <Route
        path="/customer/services"
        element={<CustomerServices />}
      />

      {/* CUSTOMER PAYMENTS */}

      <Route
        path="/customer/payments"
        element={<CustomerPayments />}
      />

      {/* CUSTOMER PROFILE */}

      <Route
        path="/customer/profile"
        element={<CustomerProfile />}
      />

      {/* CUSTOMER SETTINGS */}

      <Route
        path="/customer/settings"
        element={<CustomerSettings />}
      />

      {/* =================================================
          404 FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;