import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  // =====================================================
  // GET AUTHENTICATION DATA
  // =====================================================

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // READ USER DATA
  // =====================================================

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("googleUser");

    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // CHECK USER DATA
  // =====================================================

  if (!user || !user.role) {
    console.error("User role is missing.");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("googleUser");

    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // GET USER ROLE
  // =====================================================

  const userRole = String(user.role).toUpperCase();

  console.log("Protected Route User Role:", userRole);

  // =====================================================
  // NORMALIZE ALLOWED ROLES
  // =====================================================

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).toUpperCase()
  );

  // =====================================================
  // CHECK PERMISSION
  // =====================================================

  const hasPermission =
    normalizedAllowedRoles.length === 0 ||
    normalizedAllowedRoles.includes(userRole);

  // =====================================================
  // USER DOES NOT HAVE PERMISSION
  // =====================================================

  if (!hasPermission) {
    console.warn(
      `Unauthorized access attempt: ${userRole} -> ${location.pathname}`
    );

    // Send user to their correct dashboard
    switch (userRole) {
      // =================================================
      // SUPER ADMIN
      // =================================================

      case "SUPER_ADMIN":
        return (
          <Navigate
            to="/super-admin-dashboard"
            replace
          />
        );

      // =================================================
      // ADMIN
      // =================================================

      case "ADMIN":
        return (
          <Navigate
            to="/admin-dashboard"
            replace
          />
        );

      // =================================================
      // CUSTOMER
      // =================================================

      case "CUSTOMER":
        return (
          <Navigate
            to="/customer-dashboard"
            replace
          />
        );

      // =================================================
      // VIP CUSTOMER
      // =================================================

      case "VIP":
        return (
          <Navigate
            to="/customer-dashboard"
            replace
          />
        );

      // =================================================
      // UNKNOWN ROLE
      // =================================================

      default:
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("googleUser");

        return (
          <Navigate
            to="/login"
            replace
          />
        );
    }
  }

  // =====================================================
  // AUTHORIZED
  // =====================================================

  return children;
}

export default ProtectedRoute;