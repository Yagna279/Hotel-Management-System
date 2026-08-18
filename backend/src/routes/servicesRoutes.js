import express from "express";

import {
  getAdminServices,
  addAdminService,
  updateAdminService,
  deleteAdminService,
} from "../controllers/servicesController.js";


const router = express.Router();


/* =====================================================
   GET ALL SERVICES
===================================================== */

router.get(
  "/services",
  getAdminServices
);


/* =====================================================
   ADD SERVICE
===================================================== */

router.post(
  "/services",
  addAdminService
);


/* =====================================================
   UPDATE SERVICE
===================================================== */

router.put(
  "/services/:id",
  updateAdminService
);


/* =====================================================
   DELETE SERVICE
===================================================== */

router.delete(
  "/services/:id",
  deleteAdminService
);


export default router;