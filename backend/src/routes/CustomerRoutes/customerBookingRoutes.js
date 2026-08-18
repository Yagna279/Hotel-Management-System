import express from "express";

import {
  createCustomerBooking,
  getCustomerBookings,
} from "../../controllers/CustomerControllers/customerBookingController.js";

const router =
  express.Router();

// =====================================================
// CREATE BOOKING
// POST /api/customer-bookings
// =====================================================

router.post(
  "/",
  createCustomerBooking
);

// =====================================================
// GET CUSTOMER BOOKINGS
// GET /api/customer-bookings/:customerId
// =====================================================

router.get(
  "/:customerId",
  getCustomerBookings
);

export default router;