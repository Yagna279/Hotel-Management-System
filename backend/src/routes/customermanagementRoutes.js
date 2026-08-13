import express from "express";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
} from "../controllers/customermanagementController.js";

const router = express.Router();


// GET CUSTOMERS
router.get(
  "/",
  getCustomers
);


// ADD CUSTOMER
router.post(
  "/",
  createCustomer
);


// UPDATE CUSTOMER
router.put(
  "/:id",
  updateCustomer
);


export default router;