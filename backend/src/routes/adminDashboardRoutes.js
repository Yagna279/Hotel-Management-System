import express from "express";

import {
  getAdminDashboard,
} from "../controllers/adminDashboardController.js";

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

router.get(
  "/dashboard",
  getAdminDashboard
);

export default router;