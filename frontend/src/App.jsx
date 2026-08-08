import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import BookDemo from "./pages/BookDemo";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Reservations from "./pages/Admin/Reservations";
import Rooms from "./pages/Admin/Rooms";
import Payments from "./pages/Admin/Payments";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import AdminServices from "./pages/Admin/AdminServices";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

import CustomerDashboard from "./pages/Customer/CustomerDashboard";

import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";

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
// APP
// =====================================================

function App() {
  return (
    <Routes>

      {/* =================================================
          HOME
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

      <Route
        path="/super-admin-dashboard"
        element={<SuperAdminDashboard />}
      />


      {/* =================================================
          ADMIN
      ================================================= */}

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/reservations"
        element={<Reservations />}
      />

      <Route
        path="/admin/rooms"
        element={<Rooms />}
      />

      <Route
        path="/admin/payments"
        element={<Payments />}
      />

      <Route
        path="/admin/customers"
        element={<CustomerManagement />}
      />

      <Route
        path="/admin/adminservices"
        element={<AdminServices />}
      />

      <Route
        path="/admin/reports"
        element={<Reports />}
      />

      <Route
        path="/admin/settings"
        element={<Settings />}
      />


      {/* =================================================
          CUSTOMER
      ================================================= */}

      <Route
        path="/customer-dashboard"
        element={<CustomerDashboard />}
      />

    </Routes>
  );
}

export default App;