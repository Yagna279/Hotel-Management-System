import express from "express";

import {
  getCustomerRooms,
} from "../../controllers/CustomerControllers/customerRoomsController.js";

const router = express.Router();

// =====================================================
// GET ALL ROOMS
// =====================================================

router.get(
  "/",
  getCustomerRooms
);

export default router;