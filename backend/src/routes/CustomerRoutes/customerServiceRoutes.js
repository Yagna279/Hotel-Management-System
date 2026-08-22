import express from "express";

import {
  getCustomerServices,
  requestCustomerService,
  getCustomerActiveBookings,
  getCustomerBookingServices,
} from "../../controllers/customercontrollers/customerServiceController.js";


const router = express.Router();


// =====================================================
// GET ALL ACTIVE CUSTOMER SERVICES
//
// GET /api/customer-services
// =====================================================

router.get(
  "/",
  getCustomerServices
);


// =====================================================
// GET REQUESTED SERVICES FOR BOOKING
//
// GET /api/customer-services/booking/:customerId/:bookingId
// =====================================================

router.get(
  "/booking/:customerId/:bookingId",
  getCustomerBookingServices
);


// =====================================================
// GET CHECKED-IN BOOKINGS
//
// GET /api/customer-services/:customerId/bookings
// =====================================================

router.get(
  "/:customerId/bookings",
  getCustomerActiveBookings
);


// =====================================================
// REQUEST CUSTOMER SERVICE
//
// POST /api/customer-services/request
// =====================================================

router.post(
  "/request",
  requestCustomerService
);


export default router;