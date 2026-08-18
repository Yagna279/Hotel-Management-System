import express from "express";

import {
  createBooking,
  getCustomerBookings,
} from "../../controllers/CustomerControllers/bookingController.js";

const router = express.Router();


// =====================================================
// CREATE BOOKING
// =====================================================

router.post(
  "/",
  createBooking
);


// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================

router.get(
  "/customer/:customerId",
  getCustomerBookings
);


export default router;