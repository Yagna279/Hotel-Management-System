import express from "express";

import {
  getAdminPayments,
  addAdminPayment,
} from "../controllers/paymentController.js";

const router = express.Router();


/* =====================================================
   GET PAYMENT DATA
===================================================== */

router.get(
  "/",
  getAdminPayments
);


/* =====================================================
   ADD PAYMENT
===================================================== */

router.post(
  "/",
  addAdminPayment
);


export default router;