import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();


/* =====================================================
   GET SETTINGS
===================================================== */

router.get(
  "/",
  getSettings
);


/* =====================================================
   UPDATE SETTINGS
===================================================== */

router.put(
  "/",
  updateSettings
);


export default router;