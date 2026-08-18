import pool from "../../config/db.js";

// =====================================================
// GET CUSTOMER DASHBOARD
// =====================================================

export const getCustomerDashboard = async (req, res) => {
  try {
    const { customerId } = req.params;

    // =====================================================
    // CHECK CUSTOMER ID
    // =====================================================

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    // =====================================================
    // CUSTOMER DETAILS
    // =====================================================

    const customerResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        phone,
        role,
        status,
        created_at
      FROM customers
      WHERE id = $1
      `,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const customer = customerResult.rows[0];

    // =====================================================
    // BOOKING STATISTICS
    // =====================================================

    const statisticsResult = await pool.query(
      `
      SELECT

        COUNT(*) AS total_bookings,

        COUNT(*) FILTER (
          WHERE check_in >= CURRENT_DATE
          AND LOWER(
            COALESCE(booking_status, '')
          ) != 'cancelled'
        ) AS upcoming,

        COUNT(*) FILTER (
          WHERE LOWER(
            COALESCE(booking_status, '')
          ) = 'completed'
        ) AS completed,

        COUNT(*) FILTER (
          WHERE LOWER(
            COALESCE(booking_status, '')
          ) = 'confirmed'
        ) AS confirmed,

        COUNT(*) FILTER (
          WHERE LOWER(
            COALESCE(booking_status, '')
          ) = 'cancelled'
        ) AS cancelled

      FROM bookings

      WHERE customer_id = $1
      `,
      [customerId]
    );

    const statistics = statisticsResult.rows[0];

    // =====================================================
    // TOTAL SPENT
    // =====================================================

    const paymentResult = await pool.query(
      `
      SELECT
        COALESCE(
          SUM(p.amount),
          0
        ) AS total_spent

      FROM payments p

      INNER JOIN bookings b
        ON p.booking_id = b.id

      WHERE b.customer_id = $1

      AND LOWER(
        COALESCE(
          p.payment_status,
          ''
        )
      ) = 'paid'
      `,
      [customerId]
    );

    const totalSpent =
      Number(
        paymentResult.rows[0].total_spent
      ) || 0;

    // =====================================================
    // RECENT BOOKINGS
    // =====================================================

    const bookingsResult = await pool.query(
      `
      SELECT

        b.id,

        b.check_in,
        b.check_out,

        b.adults,
        b.children,

        b.total_amount,

        b.booking_status,
        b.payment_status,

        r.room_number,
        r.room_type,
        r.price_per_night

      FROM bookings b

      INNER JOIN rooms r
        ON b.room_id = r.id

      WHERE b.customer_id = $1

      ORDER BY
        b.created_at DESC NULLS LAST

      LIMIT 5
      `,
      [customerId]
    );

    // =====================================================
    // SEND RESPONSE
    // =====================================================

    res.status(200).json({

      customer,

      statistics: {

        totalBookings:
          Number(
            statistics.total_bookings
          ) || 0,

        upcoming:
          Number(
            statistics.upcoming
          ) || 0,

        completed:
          Number(
            statistics.completed
          ) || 0,

        confirmed:
          Number(
            statistics.confirmed
          ) || 0,

        cancelled:
          Number(
            statistics.cancelled
          ) || 0,

        totalSpent,

      },

      recentBookings:
        bookingsResult.rows,

    });

  } catch (error) {

    console.error(
      "Customer dashboard error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load customer dashboard",
    });

  }
};