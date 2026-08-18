import express from "express";

import {
  getAdminReservations,
  getAvailableRooms,
  updateReservation,
} from "../controllers/adminReservationsController.js";


const router = express.Router();


// =====================================================
// GET ALL RESERVATIONS
// GET /api/admin/reservations
// =====================================================

router.get(
  "/",
  getAdminReservations
);


// =====================================================
// GET AVAILABLE ROOMS
// GET /api/admin/reservations/rooms/available
// =====================================================

router.get(
  "/rooms/available",
  getAvailableRooms
);


// =====================================================
// UPDATE COMPLETE RESERVATION
//
// PUT /api/admin/reservations/:id
//
// Updates:
// - room
// - check-in
// - check-out
// - status
// - remarks
//
// =====================================================

router.put(
  "/:id",
  updateReservation
);


export default router;