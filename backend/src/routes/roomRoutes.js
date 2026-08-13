import express from "express";

import {
  getRooms,
  createRoom,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();


// =====================================================
// GET ALL ROOMS
// GET /api/rooms
// =====================================================

router.get(
  "/",
  getRooms
);


// =====================================================
// ADD ROOM
// POST /api/rooms
// =====================================================

router.post(
  "/",
  createRoom
);


// =====================================================
// UPDATE ROOM
// PUT /api/rooms/:id
// =====================================================

router.put(
  "/:id",
  updateRoom
);


export default router;