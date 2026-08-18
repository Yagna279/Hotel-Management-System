import express from "express";

import {
  getCustomerDashboard,
} from "../../controllers/CustomerControllers/customerDashboardController.js";

const router = express.Router();

// Customer Dashboard
router.get(
  "/:customerId",
  getCustomerDashboard
);

export default router;