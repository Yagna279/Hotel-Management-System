import express from "express";

import {
  getAdminReports,
} from "../controllers/adminReportsController.js";

const router = express.Router();


// =====================================================
// GET ADMIN REPORTS
// GET /api/admin/reports
// =====================================================

router.get(
  "/reports",
  getAdminReports
);


export default router;