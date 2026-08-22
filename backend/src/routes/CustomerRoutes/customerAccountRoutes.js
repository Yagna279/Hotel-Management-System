import express from "express";

import {
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerSettings,
  changePassword,
} from "../../controllers/CustomerControllers/customerAccountController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();


// =====================================================
// CUSTOMER PROFILE
// =====================================================

// GET /api/customer/account/profile
router.get(
  "/profile",
  authMiddleware,
  getCustomerProfile
);


// PUT /api/customer/account/profile
router.put(
  "/profile",
  authMiddleware,
  updateCustomerProfile
);


// =====================================================
// CUSTOMER SETTINGS
// =====================================================

// PUT /api/customer/account/settings
router.put(
  "/settings",
  authMiddleware,
  updateCustomerSettings
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

// PUT /api/customer/account/change-password
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


export default router;