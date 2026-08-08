import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ================= EMAIL TRANSPORTER =================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= REGISTER =================

export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Check if email already exists
    const existingCustomer = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (existingCustomer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert Customer
    const result = await pool.query(
      `INSERT INTO customers
      (full_name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        full_name,
        email,
        hashedPassword,
        phone || null,
        "customer",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Customer Registered Successfully",
      customer: {
        id: result.rows[0].id,
        full_name: result.rows[0].full_name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let result;

    // First check Admin/Staff Users table
    result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // If not found, check Customers table
    if (result.rows.length === 0) {
      result = await pool.query(
        "SELECT * FROM customers WHERE email = $1",
        [email]
      );
    }

    // If not found in either table
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const customer = result.rows[0];

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      customer.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: customer.id,
        role: customer.role,
      },
      process.env.JWT_SECRET || "your_secret_key",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find Customer
    const result = await pool.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const customer = result.rows[0];

    // Generate Reset Token
    const token = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const expiry = new Date(Date.now() + 1000 * 60 * 15);

    // Save Token
    await pool.query(
      `UPDATE customers
       SET reset_token = $1,
           reset_token_expiry = $2
       WHERE id = $3`,
      [token, expiry, customer.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2 style="color:#17376E;">Password Reset Request</h2>

          <p>Hello <strong>${customer.full_name}</strong>,</p>

          <p>
            We received a request to reset your password for your Hotel
            Management System account.
          </p>

          <p>
            Click the button below to reset your password. This link will
            expire in <strong>15 minutes</strong>.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              background:#17376E;
              color:#ffffff;
              padding:12px 22px;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:25px;">
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <hr />

          <p style="font-size:13px;color:#777;">
            Hotel Management System
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify Token
    const result = await pool.query(
      `SELECT *
       FROM customers
       WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const customer = result.rows[0];

    // Hash New Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update Password
    await pool.query(
      `UPDATE customers
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashedPassword, customer.id]
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};