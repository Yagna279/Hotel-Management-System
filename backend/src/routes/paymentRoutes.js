import express from "express";

import {
  getAdminPayments,
  addAdminPayment,
  getAdminPaymentDetails,
  refundAdminPayment,
} from "../controllers/paymentController.js";

const router = express.Router();


/* =====================================================
   GET PAYMENT DATA
   GET /api/admin/payments
===================================================== */

router.get(
  "/",
  getAdminPayments
);


/* =====================================================
   ADD PAYMENT
   POST /api/admin/payments
===================================================== */

router.post(
  "/",
  addAdminPayment
);


/* =====================================================
   PAYMENT / INVOICE DETAILS
   GET /api/admin/payments/:id
===================================================== */

router.get(
  "/:id",
  getAdminPaymentDetails
);


/* =====================================================
   REFUND PAYMENT
   POST /api/admin/payments/:paymentId/refund
===================================================== */

router.post(
  "/:paymentId/refund",
  refundAdminPayment
);


export default router;