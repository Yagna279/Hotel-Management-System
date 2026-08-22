import bcrypt from "bcryptjs";
import pool from "../../config/db.js";

// =====================================================
// GET CUSTOMER PROFILE
// =====================================================

export const getCustomerProfile = async (req, res) => {
  try {
    console.log("====================================");
    console.log("GET CUSTOMER PROFILE");
    console.log("REQ.USER:", req.user);
    console.log("====================================");

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customerId = req.user.id;

    // ---------------------------------------------------
    // Get customer + settings
    // ---------------------------------------------------

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.full_name,
        c.email,
        c.phone,
        c.role,
        c.status,
        c.created_at,

        COALESCE(cs.address, '') AS address,

        COALESCE(
          c.email_notifications,
          TRUE
        ) AS email_notifications,

        COALESCE(
          c.booking_notifications,
          TRUE
        ) AS booking_notifications,

        COALESCE(
          c.promotional_emails,
          FALSE
        ) AS promotional_emails

      FROM customers c

      LEFT JOIN customer_settings cs
        ON cs.customer_id = c.id

      WHERE c.id = $1
      `,
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = result.rows[0];

    console.log("CUSTOMER PROFILE:", customer);

    return res.status(200).json({
      success: true,
      customer,
    });

  } catch (error) {
    console.error("====================================");
    console.error("GET CUSTOMER PROFILE ERROR");
    console.error("====================================");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer profile",
    });
  }
};


// =====================================================
// UPDATE CUSTOMER PROFILE
// =====================================================

export const updateCustomerProfile = async (req, res) => {
  try {
    console.log("====================================");
    console.log("UPDATE CUSTOMER PROFILE");
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);
    console.log("====================================");

    // ---------------------------------------------------
    // CHECK AUTHENTICATION
    // ---------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customerId = req.user.id;

    // ---------------------------------------------------
    // GET DATA
    // ---------------------------------------------------

    const {
      full_name,
      email,
      phone,
      address,
    } = req.body;

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ---------------------------------------------------
    // CHECK CUSTOMER EXISTS
    // ---------------------------------------------------

    const customerCheck = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE id = $1
      `,
      [customerId]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // ---------------------------------------------------
    // CHECK EMAIL USED BY ANOTHER CUSTOMER
    // ---------------------------------------------------

    const emailCheck = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE LOWER(email) = LOWER($1)
      AND id <> $2
      `,
      [
        email.trim(),
        customerId,
      ]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already used by another customer",
      });
    }

    // ===================================================
    // START TRANSACTION
    // ===================================================

    await pool.query("BEGIN");

    try {

      // -------------------------------------------------
      // UPDATE CUSTOMERS TABLE
      // -------------------------------------------------

      await pool.query(
        `
        UPDATE customers
        SET
          full_name = $1,
          email = $2,
          phone = $3
        WHERE id = $4
        `,
        [
          full_name.trim(),
          email.trim(),
          phone && phone.trim()
            ? phone.trim()
            : null,
          customerId,
        ]
      );

      // -------------------------------------------------
      // INSERT / UPDATE CUSTOMER SETTINGS
      // -------------------------------------------------

      await pool.query(
        `
        INSERT INTO customer_settings
        (
          customer_id,
          address
        )
        VALUES
        (
          $1,
          $2
        )
        ON CONFLICT (customer_id)
        DO UPDATE SET
          address = EXCLUDED.address,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          customerId,
          address
            ? address.trim()
            : "",
        ]
      );

      // -------------------------------------------------
      // COMMIT
      // -------------------------------------------------

      await pool.query("COMMIT");

    } catch (error) {

      await pool.query("ROLLBACK");

      throw error;
    }

    // ===================================================
    // GET UPDATED CUSTOMER
    // ===================================================

    const updatedResult = await pool.query(
      `
      SELECT
        c.id,
        c.full_name,
        c.email,
        c.phone,
        c.role,
        c.status,
        c.created_at,

        COALESCE(cs.address, '') AS address,

        COALESCE(
          c.email_notifications,
          TRUE
        ) AS email_notifications,

        COALESCE(
          c.booking_notifications,
          TRUE
        ) AS booking_notifications,

        COALESCE(
          c.promotional_emails,
          FALSE
        ) AS promotional_emails

      FROM customers c

      LEFT JOIN customer_settings cs
        ON cs.customer_id = c.id

      WHERE c.id = $1
      `,
      [customerId]
    );

    const updatedCustomer =
      updatedResult.rows[0];

    console.log("UPDATED CUSTOMER:", updatedCustomer);

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer: updatedCustomer,
    });

  } catch (error) {

    console.error("====================================");
    console.error("UPDATE CUSTOMER PROFILE ERROR");
    console.error("====================================");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer profile",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE CUSTOMER SETTINGS
// =====================================================

export const updateCustomerSettings = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customerId = req.user.id;

    const {
      address,
      email_notifications,
      booking_notifications,
      promotional_emails,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO customer_settings
      (
        customer_id,
        address,
        email_notifications,
        booking_notifications,
        promotional_emails,
        updated_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        CURRENT_TIMESTAMP
      )

      ON CONFLICT (customer_id)
      DO UPDATE SET

        address =
          EXCLUDED.address,

        email_notifications =
          EXCLUDED.email_notifications,

        booking_notifications =
          EXCLUDED.booking_notifications,

        promotional_emails =
          EXCLUDED.promotional_emails,

        updated_at =
          CURRENT_TIMESTAMP

      RETURNING *
      `,
      [
        customerId,

        address || "",

        email_notifications !== undefined
          ? email_notifications
          : true,

        booking_notifications !== undefined
          ? booking_notifications
          : true,

        promotional_emails !== undefined
          ? promotional_emails
          : false,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: result.rows[0],
    });

  } catch (error) {

    console.error(
      "UPDATE CUSTOMER SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

export const changePassword = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const customerId = req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // ---------------------------------------------------
    // GET CUSTOMER
    // ---------------------------------------------------

    const result = await pool.query(
      `
      SELECT id, password
      FROM customers
      WHERE id = $1
      `,
      [customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = result.rows[0];

    // ---------------------------------------------------
    // CHECK CURRENT PASSWORD
    // ---------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        customer.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ---------------------------------------------------
    // HASH NEW PASSWORD
    // ---------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // ---------------------------------------------------
    // UPDATE PASSWORD
    // ---------------------------------------------------

    await pool.query(
      `
      UPDATE customers
      SET password = $1
      WHERE id = $2
      `,
      [
        hashedPassword,
        customerId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};