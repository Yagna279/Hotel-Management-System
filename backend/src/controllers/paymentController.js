import pool from "../config/db.js";

/* =====================================================
   GET PAYMENTS DASHBOARD
   GET /api/admin/payments
===================================================== */

export const getAdminPayments = async (req, res) => {
  try {

    /* ===================================================
       TOTAL REVENUE / PAID / REFUNDS

       These values come from actual payment records.
    =================================================== */

    const revenueResult = await pool.query(`
      SELECT

        /* TOTAL REVENUE */
        COALESCE(
          SUM(
            CASE
              WHEN LOWER(COALESCE(payment_status, '')) IN
                ('completed', 'paid')
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_revenue,


        /* PAID */
        COALESCE(
          SUM(
            CASE
              WHEN LOWER(COALESCE(payment_status, '')) IN
                ('completed', 'paid')
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS paid_amount,


        /* REFUNDS */
        COALESCE(
          SUM(
            CASE
              WHEN LOWER(COALESCE(payment_status, '')) = 'refunded'
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS refund_amount

      FROM payments
    `);


    /* ===================================================
       PENDING BOOKINGS

       Pending is calculated from BOOKINGS because a
       customer who has not paid may not have a record
       in the payments table yet.
    =================================================== */

    const pendingResult = await pool.query(`
      SELECT

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(COALESCE(payment_status, '')) = 'pending'
              THEN total_amount
              ELSE 0
            END
          ),
          0
        ) AS pending_amount

      FROM bookings
    `);


    /* ===================================================
       PAYMENT STATISTICS
    =================================================== */

    const paymentStatistics = {

      totalRevenue: Number(
        revenueResult.rows[0]?.total_revenue || 0
      ),

      paid: Number(
        revenueResult.rows[0]?.paid_amount || 0
      ),

      pending: Number(
        pendingResult.rows[0]?.pending_amount || 0
      ),

      refunds: Number(
        revenueResult.rows[0]?.refund_amount || 0
      ),

    };


    /* ===================================================
       RECENT PAYMENTS
    =================================================== */

    const paymentsResult = await pool.query(`
      SELECT

        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.paid_at,

        c.id AS customer_id,
        c.full_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,

        r.id AS room_id,
        r.room_number,
        r.room_type

      FROM payments p

      LEFT JOIN bookings b
        ON b.id = p.booking_id

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      ORDER BY p.id DESC

      LIMIT 10
    `);


    /* ===================================================
       FORMAT PAYMENT DATA
    =================================================== */

    const payments = paymentsResult.rows.map(
      (payment) => ({

        ...payment,

        invoice_number:
          `INV${String(payment.id).padStart(4, "0")}`,

        amount:
          Number(payment.amount || 0),

      })
    );


    /* ===================================================
       BOOKINGS FOR ADD PAYMENT

       Includes pending bookings so they can be selected
       from the Add Payment form.
    =================================================== */

    const bookingsResult = await pool.query(`
      SELECT

        b.id AS booking_id,

        c.id AS customer_id,
        c.full_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,

        r.room_number,
        r.room_type,

        b.total_amount,
        b.booking_status,
        b.payment_status

      FROM bookings b

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      ORDER BY b.id DESC
    `);


    /* ===================================================
       SEND RESPONSE
    =================================================== */

    res.status(200).json({

      success: true,

      statistics:
        paymentStatistics,

      payments,

      bookings:
        bookingsResult.rows,

    });

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "ADMIN PAYMENTS ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to load payment data.",

      error:
        error.message,

    });

  }
};


/* =====================================================
   ADD PAYMENT
   POST /api/admin/payments
===================================================== */

export const addAdminPayment = async (req, res) => {

  try {

    const {
      booking_id,
      amount,
      payment_method,
      payment_status,
    } = req.body;


    /* ===================================================
       VALIDATION
    =================================================== */

    if (!booking_id) {

      return res.status(400).json({

        success: false,

        message:
          "Booking is required.",

      });

    }


    if (
      amount === undefined ||
      amount === null ||
      Number(amount) <= 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Valid payment amount is required.",

      });

    }


    if (!payment_method) {

      return res.status(400).json({

        success: false,

        message:
          "Payment method is required.",

      });

    }


    /* ===================================================
       CHECK BOOKING
    =================================================== */

    const bookingResult = await pool.query(
      `
      SELECT
        id,
        total_amount,
        payment_status
      FROM bookings
      WHERE id = $1
      `,
      [booking_id]
    );


    if (bookingResult.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "Booking not found.",

      });

    }


    /* ===================================================
       INSERT PAYMENT
    =================================================== */

    const result = await pool.query(
      `
      INSERT INTO payments
      (
        booking_id,
        amount,
        payment_method,
        payment_status,
        paid_at
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,

        CASE
          WHEN LOWER($4) IN
            ('paid', 'completed')
          THEN NOW()
          ELSE NULL
        END
      )

      RETURNING *
      `,
      [
        booking_id,
        Number(amount),
        payment_method,
        payment_status || "pending",
      ]
    );


    /* ===================================================
       UPDATE BOOKING PAYMENT STATUS

       If payment is completed, automatically mark
       the booking as paid.

       If payment is pending, keep booking pending.
    =================================================== */

    if (
      String(
        payment_status || "pending"
      ).toLowerCase() === "completed" ||
      String(
        payment_status || "pending"
      ).toLowerCase() === "paid"
    ) {

      await pool.query(
        `
        UPDATE bookings

        SET
          payment_status = 'paid'

        WHERE id = $1
        `,
        [booking_id]
      );

    } else {

      await pool.query(
        `
        UPDATE bookings

        SET
          payment_status = 'pending'

        WHERE id = $1
        `,
        [booking_id]
      );

    }


    /* ===================================================
       RESPONSE
    =================================================== */

    res.status(201).json({

      success: true,

      message:
        "Payment added successfully.",

      payment:
        result.rows[0],

    });

  } catch (error) {

    console.error(
      "ADD PAYMENT ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to add payment.",

      error:
        error.message,

    });

  }

};