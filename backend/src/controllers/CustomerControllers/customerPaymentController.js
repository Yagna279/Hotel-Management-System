import pool from "../../config/db.js";

// =====================================================
// GET CUSTOMER PAYMENTS
// =====================================================

export const getCustomerPayments = async (req, res) => {

  try {

    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    const customerResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone
      FROM customers
      WHERE id = $1
      `,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const paymentsResult = await pool.query(
      `
      SELECT
        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.paid_at,

        b.room_id,
        b.check_in,
        b.check_out,
        b.booking_status,

        r.room_number,
        r.room_type

      FROM payments p

      INNER JOIN bookings b
        ON p.booking_id = b.id

      LEFT JOIN rooms r
        ON b.room_id = r.id

      WHERE b.customer_id = $1

      ORDER BY
        COALESCE(p.paid_at, b.created_at) DESC
      `,
      [customerId]
    );

    const payments = paymentsResult.rows;

    let totalSpent = 0;
    let completed = 0;
    let pending = 0;
    let refunds = 0;

    payments.forEach((payment) => {

      const amount = Number(payment.amount) || 0;

      const status = String(
        payment.payment_status || ""
      ).toLowerCase();

      if (
        status === "completed" ||
        status === "paid" ||
        status === "success"
      ) {
        completed += amount;
      }

      if (status === "pending") {
        pending += amount;
      }

      if (
        status === "refunded" ||
        status === "refund"
      ) {
        refunds += amount;
      }

      if (
        status !== "refunded" &&
        status !== "refund"
      ) {
        totalSpent += amount;
      }

    });

    return res.status(200).json({

      success: true,

      customer: customerResult.rows[0],

      payments,

      statistics: {
        totalSpent,
        completed,
        pending,
        refunds,
      },

    });

  } catch (error) {

    console.error(
      "Get customer payments error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to load customer payments.",

      error: error.message,

    });

  }

};


// =====================================================
// CREATE CUSTOMER PAYMENT
// =====================================================

export const createCustomerPayment = async (req, res) => {

  const client = await pool.connect();

  try {

    const {
      customer_id,
      booking_id,
      amount,
      payment_method,
    } = req.body;

    if (
      !customer_id ||
      !booking_id ||
      !amount ||
      !payment_method
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Customer ID, booking ID, amount and payment method are required.",

      });

    }

    await client.query("BEGIN");

    // =================================================
    // CHECK BOOKING
    // =================================================

    const bookingResult = await client.query(
      `
      SELECT
        id,
        customer_id,
        total_amount,
        booking_status,
        payment_status
      FROM bookings
      WHERE id = $1
      `,
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({

        success: false,

        message: "Booking not found.",

      });

    }

    const booking = bookingResult.rows[0];

    // =================================================
    // CHECK CUSTOMER
    // =================================================

    if (
      String(booking.customer_id) !==
      String(customer_id)
    ) {

      await client.query("ROLLBACK");

      return res.status(403).json({

        success: false,

        message:
          "This booking does not belong to this customer.",

      });

    }

    // =================================================
    // CHECK ALREADY PAID
    // =================================================

    if (
      String(
        booking.payment_status || ""
      ).toLowerCase() === "paid"
    ) {

      await client.query("ROLLBACK");

      return res.status(400).json({

        success: false,

        message:
          "This booking has already been paid.",

      });

    }

    // =================================================
    // CREATE PAYMENT
    // =================================================

    const paymentResult = await client.query(
      `
      INSERT INTO payments (
        booking_id,
        amount,
        payment_method,
        payment_status,
        paid_at
      )
      VALUES (
        $1,
        $2,
        $3,
        'completed',
        NOW()
      )
      RETURNING
        id,
        booking_id,
        amount,
        payment_method,
        payment_status,
        paid_at
      `,
      [
        booking_id,
        amount,
        payment_method,
      ]
    );

    // =================================================
    // UPDATE BOOKING
    // =================================================

    await client.query(
      `
      UPDATE bookings
      SET payment_status = 'paid'
      WHERE id = $1
      `,
      [booking_id]
    );

    await client.query("COMMIT");

    return res.status(201).json({

      success: true,

      message:
        "Payment completed successfully.",

      payment:
        paymentResult.rows[0],

    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Create customer payment error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to create payment.",

      error: error.message,

    });

  } finally {

    client.release();

  }

};