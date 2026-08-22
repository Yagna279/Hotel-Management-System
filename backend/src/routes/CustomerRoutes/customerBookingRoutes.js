import express from "express";

import {
  createCustomerBooking,
  getCustomerBookings,
  getCustomerBookingDetails,
  cancelCustomerBooking,
} from "../../controllers/CustomerControllers/customerBookingController.js";

const router = express.Router();

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

// =====================================================
// GET SINGLE BOOKING DETAILS
// GET /api/customer-bookings/:customerId/:bookingId
// =====================================================

router.get(
  "/:customerId/:bookingId",
  getCustomerBookingDetails
);

// =====================================================
// CANCEL CUSTOMER BOOKING
// PUT /api/customer-bookings/:customerId/:bookingId/cancel
// =====================================================

router.put(
  "/:customerId/:bookingId/cancel",
  cancelCustomerBooking
);

export default router;