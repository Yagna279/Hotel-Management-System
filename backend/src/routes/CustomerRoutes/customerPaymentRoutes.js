import express from "express";

import {
  getCustomerPayments,
  createCustomerPayment,
} from "../../controllers/CustomerControllers/customerPaymentController.js";

const router = express.Router();

// TEST ROUTE
router.get(
  "/test",
  (req, res) => {
    res.json({
      success: true,
      message: "Customer payment routes are working",
    });
  }
);

// GET CUSTOMER PAYMENTS
router.get(
  "/:customerId",
  getCustomerPayments
);

// CREATE CUSTOMER PAYMENT
router.post(
  "/",
  createCustomerPayment
);

export default router;