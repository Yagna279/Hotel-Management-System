import { Routes, Route } from "react-router-dom";
import Rooms from "./pages/Admin/Rooms";
import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import BookDemo from "./pages/BookDemo";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import Payments from "./pages/Admin/Payments";
import CustomerManagement from "./pages/Admin/CustomerManagement";
import AdminServices from "./pages/Admin/AdminServices";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Reservations from "./pages/Admin/Reservations";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";

import "./App.css";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/get-started" element={<GetStarted />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/reservations"
        element={<Reservations />}
      />

      <Route
        path="/customer-dashboard"
        element={<CustomerDashboard />}
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
path="/admin/AdminServices"
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
    </Routes>
  );
}

export default App;