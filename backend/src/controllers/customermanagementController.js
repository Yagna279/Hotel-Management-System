import bcrypt from "bcryptjs";
import pool from "../config/db.js";

// =====================================================
// GET ALL CUSTOMERS
// =====================================================

export const getCustomers = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at
      FROM public.customers
      ORDER BY id DESC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(
      "Error fetching customers:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });

  }
};


// =====================================================
// ADD CUSTOMER
// =====================================================

export const createCustomer = async (req, res) => {
  try {

    const {
      full_name,
      email,
      phone,
      password,
      role,
      status,
    } = req.body;


    // ================================================
    // REQUIRED FIELDS
    // ================================================

    if (
      !full_name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Full name, email and password are required",
      });

    }


    // ================================================
    // CHECK EMAIL
    // ================================================

    const existingCustomer =
      await pool.query(
        `
        SELECT id
        FROM customers
        WHERE email = $1
        `,
        [email]
      );


    if (existingCustomer.rows.length > 0) {

      return res.status(409).json({
        success: false,
        message:
          "Customer with this email already exists",
      });

    }


    // ================================================
    // HASH PASSWORD
    // ================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ================================================
    // NULL VALUES
    // ================================================

    const customerPhone =
      phone && phone.trim() !== ""
        ? phone.trim()
        : null;


    const customerRole =
      role && role.trim() !== ""
        ? role
        : null;


    const customerStatus =
      status && status.trim() !== ""
        ? status
        : null;


    // ================================================
    // INSERT
    // ================================================

    const result =
      await pool.query(
        `
        INSERT INTO customers
        (
          full_name,
          email,
          password,
          phone,
          role,
          status
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
        )
        RETURNING
          id,
          full_name,
          email,
          phone,
          role,
          status,
          created_at
        `,
        [
          full_name,
          email,
          hashedPassword,
          customerPhone,
          customerRole,
          customerStatus,
        ]
      );


    res.status(201).json({

      success: true,

      message:
        "Customer added successfully",

      customer:
        result.rows[0],

    });


  } catch (error) {

    console.error(
      "Error adding customer:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to add customer",

      error:
        error.message,

    });

  }
};


// =====================================================
// UPDATE CUSTOMER
// =====================================================

export const updateCustomer = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      full_name,
      email,
      phone,
      role,
      status,
    } = req.body;


    if (
      !full_name ||
      !email
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Full name and email are required",
      });

    }


    const customerPhone =
      phone && phone.trim() !== ""
        ? phone.trim()
        : null;


    const customerRole =
      role && role.trim() !== ""
        ? role
        : null;


    const customerStatus =
      status && status.trim() !== ""
        ? status
        : null;


    const result =
      await pool.query(
        `
        UPDATE customers

        SET
          full_name = $1,
          email = $2,
          phone = $3,
          role = $4,
          status = $5

        WHERE id = $6

        RETURNING
          id,
          full_name,
          email,
          phone,
          role,
          status,
          created_at
        `,
        [
          full_name,
          email,
          customerPhone,
          customerRole,
          customerStatus,
          id,
        ]
      );


    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          "Customer not found",
      });

    }


    res.status(200).json({

      success: true,

      message:
        "Customer updated successfully",

      customer:
        result.rows[0],

    });


  } catch (error) {

    console.error(
      "Error updating customer:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to update customer",

      error:
        error.message,

    });

  }
};