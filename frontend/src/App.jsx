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

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Reset Password */}
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/customer-dashboard"
        element={<CustomerDashboard />}
      />
    </Routes>
  );
}

export default App;