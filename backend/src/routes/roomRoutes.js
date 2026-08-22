import express from "express";

import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();


// =====================================================
// GET ALL ROOMS
// =====================================================

router.get(
  "/",
  getRooms
);


// =====================================================
// ADD NEW ROOM
// =====================================================

router.post(
  "/",
  createRoom
);


// =====================================================
// UPDATE ROOM
// =====================================================

router.put(
  "/:id",
  updateRoom
);


// =====================================================
// DELETE ROOM
// =====================================================

router.delete(
  "/:id",
  deleteRoom
);


export default router;