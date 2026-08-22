import pool from "../config/db.js";


/* =====================================================
   HELPER
===================================================== */

const normalizeStatus = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim();
};


/* =====================================================
   GET ADMIN PAYMENTS DASHBOARD
   GET /api/admin/payments
===================================================== */

export const getAdminPayments = async (req, res) => {

  try {

    /* ===================================================
       REVENUE / PAID / REFUNDS
    =================================================== */

    const revenueResult = await pool.query(`
      SELECT

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(
                COALESCE(payment_status, '')
              ) IN ('completed', 'paid')
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_revenue,

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(
                COALESCE(payment_status, '')
              ) IN ('completed', 'paid')
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS paid_amount,

        COALESCE(
          SUM(
            CASE
              WHEN LOWER(
                COALESCE(payment_status, '')
              ) = 'refunded'
              THEN amount
              ELSE 0
            END
          ),
          0
        ) AS refund_amount

      FROM payments
    `);


    /* ===================================================
       PENDING SERVICE AMOUNT

       Requested services
       -
       Already paid services
       =
       Pending service amount
    =================================================== */

    const pendingResult = await pool.query(`
      WITH service_totals AS (

        SELECT

          bs.booking_id,

          COALESCE(
            SUM(s.price),
            0
          ) AS service_total

        FROM booking_services bs

        INNER JOIN services s
          ON s.id = bs.service_id

        GROUP BY bs.booking_id

      ),

      paid_services AS (

        SELECT

          booking_id,

          COALESCE(
            SUM(amount),
            0
          ) AS paid_service_amount

        FROM payments

        WHERE LOWER(
          COALESCE(payment_type, '')
        ) = 'service'

        AND LOWER(
          COALESCE(payment_status, '')
        ) IN ('completed', 'paid')

        GROUP BY booking_id

      )

      SELECT

        COALESCE(
          SUM(
            GREATEST(
              service_totals.service_total
              -
              COALESCE(
                paid_services.paid_service_amount,
                0
              ),
              0
            )
          ),
          0
        ) AS pending_amount

      FROM service_totals

      LEFT JOIN paid_services
        ON paid_services.booking_id =
           service_totals.booking_id

      INNER JOIN bookings b
        ON b.id = service_totals.booking_id

      WHERE LOWER(
        COALESCE(
          b.booking_status,
          ''
        )
      ) NOT IN (
        'cancelled',
        'rejected'
      )
    `);


    /* ===================================================
       STATISTICS
    =================================================== */

    const statistics = {

      totalRevenue:
        Number(
          revenueResult.rows[0]?.total_revenue || 0
        ),

      paid:
        Number(
          revenueResult.rows[0]?.paid_amount || 0
        ),

      pending:
        Number(
          pendingResult.rows[0]?.pending_amount || 0
        ),

      refunds:
        Number(
          revenueResult.rows[0]?.refund_amount || 0
        ),

    };


    /* ===================================================
       GET PAYMENT RECORDS
    =================================================== */

    const paymentsResult = await pool.query(`
      SELECT

        p.id,
        p.booking_id,
        p.amount,
        p.discount,
        p.payment_method,
        p.payment_status,
        p.payment_type,
        p.paid_at,

        c.id AS customer_id,
        c.full_name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,

        r.id AS room_id,
        r.room_number,
        r.room_type,

        b.booking_status,
        b.total_amount AS booking_total

      FROM payments p

      LEFT JOIN bookings b
        ON b.id = p.booking_id

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      ORDER BY p.id DESC

      LIMIT 50
    `);


    /* ===================================================
       FORMAT PAYMENTS
    =================================================== */

    const payments =
      paymentsResult.rows.map(
        (payment) => ({

          ...payment,

          invoice_number:
            `INV${String(
              payment.id
            ).padStart(4, "0")}`,

          amount:
            Number(
              payment.amount || 0
            ),

          discount:
            Number(
              payment.discount || 0
            ),

          booking_total:
            Number(
              payment.booking_total || 0
            ),

        })
      );


    /* ===================================================
       BOOKINGS FOR ADD PAYMENT
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
        b.payment_status,

        COALESCE(
          service_data.service_total,
          0
        ) AS service_total,

        COALESCE(
          service_data.service_count,
          0
        ) AS service_count,

        COALESCE(
          paid_data.paid_service_amount,
          0
        ) AS paid_service_amount,

        GREATEST(

          COALESCE(
            service_data.service_total,
            0
          )

          -

          COALESCE(
            paid_data.paid_service_amount,
            0
          ),

          0

        ) AS outstanding_service_amount,

        COALESCE(
          service_data.services,
          '[]'::json
        ) AS services

      FROM bookings b

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id


      /* =================================================
         SERVICES
      ================================================= */

      LEFT JOIN LATERAL (

        SELECT

          COALESCE(
            SUM(s.price),
            0
          ) AS service_total,

          COUNT(*) AS service_count,

          COALESCE(

            JSON_AGG(

              JSON_BUILD_OBJECT(

                'service_id',
                s.id,

                'service_name',
                s.service_name,

                'price',
                s.price

              )

              ORDER BY s.service_name

            ),

            '[]'::json

          ) AS services

        FROM booking_services bs

        INNER JOIN services s
          ON s.id = bs.service_id

        WHERE bs.booking_id = b.id

      ) service_data
        ON TRUE


      /* =================================================
         PAID SERVICE PAYMENTS
      ================================================= */

      LEFT JOIN LATERAL (

        SELECT

          COALESCE(
            SUM(p.amount),
            0
          ) AS paid_service_amount

        FROM payments p

        WHERE p.booking_id = b.id

        AND LOWER(
          COALESCE(
            p.payment_type,
            ''
          )
        ) = 'service'

        AND LOWER(
          COALESCE(
            p.payment_status,
            ''
          )
        ) IN (
          'completed',
          'paid'
        )

      ) paid_data
        ON TRUE


      ORDER BY b.id DESC
    `);


    /* ===================================================
       FORMAT BOOKINGS
    =================================================== */

    const bookings =
      bookingsResult.rows.map(
        (booking) => ({

          ...booking,

          total_amount:
            Number(
              booking.total_amount || 0
            ),

          service_total:
            Number(
              booking.service_total || 0
            ),

          paid_service_amount:
            Number(
              booking.paid_service_amount || 0
            ),

          outstanding_service_amount:
            Number(
              booking.outstanding_service_amount || 0
            ),

          service_count:
            Number(
              booking.service_count || 0
            ),

          services:
            booking.services || [],

        })
      );


    /* ===================================================
       RESPONSE
    =================================================== */

    return res.status(200).json({

      success: true,

      statistics,

      payments,

      bookings,

    });


  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "ADMIN PAYMENTS ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load payment data.",

      error:
        error.message,

    });

  }

};


/* =====================================================
   ADD SERVICE PAYMENT
   POST /api/admin/payments
===================================================== */

export const addAdminPayment = async (
  req,
  res
) => {

  const client =
    await pool.connect();


  try {

    const {

      booking_id,
      amount,
      discount,
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
       PAYMENT STATUS
    =================================================== */

    const normalizedStatus =
      normalizeStatus(
        payment_status || "completed"
      );


    if (
      ![
        "completed",
        "paid",
        "pending"
      ].includes(
        normalizedStatus
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid payment status.",

      });

    }


    /* ===================================================
       DISCOUNT
    =================================================== */

    const discountAmount =
      Math.max(
        Number(
          discount || 0
        ),
        0
      );


    const paymentAmount =
      Number(amount);


    /* ===================================================
       BEGIN TRANSACTION
    =================================================== */

    await client.query(
      "BEGIN"
    );


    /* ===================================================
       GET BOOKING

       Lock ONLY the booking row.
    =================================================== */

    const bookingResult =
      await client.query(
        `
        SELECT

          id,
          booking_status,
          total_amount

        FROM bookings

        WHERE id = $1

        FOR UPDATE
        `,
        [booking_id]
      );


    if (
      bookingResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(404).json({

        success: false,

        message:
          "Booking not found.",

      });

    }


    const booking =
      bookingResult.rows[0];


    /* ===================================================
       CHECK BOOKING STATUS
    =================================================== */

    const bookingStatus =
      normalizeStatus(
        booking.booking_status
      );


    if (
      bookingStatus === "cancelled" ||
      bookingStatus === "rejected"
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "Cannot add a service payment to a cancelled or rejected booking.",

      });

    }


    /* ===================================================
       SERVICE TOTAL
    =================================================== */

    const serviceResult =
      await client.query(
        `
        SELECT

          COALESCE(
            SUM(s.price),
            0
          ) AS service_total

        FROM booking_services bs

        INNER JOIN services s
          ON s.id = bs.service_id

        WHERE bs.booking_id = $1
        `,
        [booking_id]
      );


    const serviceTotal =
      Number(
        serviceResult.rows[0]
          ?.service_total || 0
      );


    if (
      serviceTotal <= 0
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "This booking has no requested services.",

      });

    }


    /* ===================================================
       ALREADY PAID SERVICE AMOUNT
    =================================================== */

    const paidResult =
      await client.query(
        `
        SELECT

          COALESCE(
            SUM(amount),
            0
          ) AS paid_service_amount

        FROM payments

        WHERE booking_id = $1

        AND LOWER(
          COALESCE(
            payment_type,
            ''
          )
        ) = 'service'

        AND LOWER(
          COALESCE(
            payment_status,
            ''
          )
        ) IN (
          'completed',
          'paid'
        )
        `,
        [booking_id]
      );


    const paidServiceAmount =
      Number(
        paidResult.rows[0]
          ?.paid_service_amount || 0
      );


    /* ===================================================
       OUTSTANDING AMOUNT
    =================================================== */

    const outstandingAmount =
      Math.max(

        serviceTotal -
        paidServiceAmount,

        0

      );


    if (
      outstandingAmount <= 0
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "All requested services for this booking have already been paid.",

      });

    }


    /* ===================================================
       DISCOUNT VALIDATION
    =================================================== */

    if (
      discountAmount >
      outstandingAmount
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "Discount cannot be greater than the outstanding service amount.",

      });

    }


    /* ===================================================
       EXPECTED AMOUNT
    =================================================== */

    const expectedAmount =
      outstandingAmount -
      discountAmount;


    /* ===================================================
       PAYMENT AMOUNT VALIDATION
    =================================================== */

    if (
      Math.abs(
        paymentAmount -
        expectedAmount
      ) > 0.01
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          `Payment amount must be ₹${expectedAmount.toFixed(2)} after discount.`,

      });

    }


    /* ===================================================
       INSERT SERVICE PAYMENT
    =================================================== */

    const insertResult =
  await client.query(
    `
    INSERT INTO payments
    (
      booking_id,
      amount,
      discount,
      payment_method,
      payment_status,
      payment_type,
      paid_at
    )

    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5::varchar,
      'service',
      CASE
        WHEN LOWER($5::varchar) IN ('completed', 'paid')
        THEN NOW()
        ELSE NULL
      END
    )

    RETURNING
      id,
      booking_id,
      amount,
      discount,
      payment_method,
      payment_status,
      payment_type,
      paid_at
    `,
    [
      booking_id,
      paymentAmount,
      discountAmount,
      payment_method,
      normalizedStatus,
    ]
  );


    const payment =
      insertResult.rows[0];


    /* ===================================================
       COMMIT
    =================================================== */

    await client.query(
      "COMMIT"
    );


    return res.status(201).json({

      success: true,

      message:
        "Service payment saved successfully.",

      payment,

    });


  } catch (error) {

    try {

      await client.query(
        "ROLLBACK"
      );

    } catch (rollbackError) {

      console.error(
        "ROLLBACK ERROR:",
        rollbackError
      );

    }


    console.error(
      "ADD SERVICE PAYMENT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to add payment.",

      error:
        error.message,

    });


  } finally {

    client.release();

  }

};


/* =====================================================
   GET PAYMENT / INVOICE DETAILS
   GET /api/admin/payments/:id
===================================================== */

export const getAdminPaymentDetails = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!id) {

      return res.status(400).json({

        success: false,

        message:
          "Payment ID is required.",

      });

    }


    /* ===================================================
       GET PAYMENT
    =================================================== */

    const paymentResult =
      await pool.query(
        `
        SELECT

          p.id,
          p.booking_id,
          p.amount,
          p.discount,
          p.payment_method,
          p.payment_status,
          p.payment_type,
          p.paid_at,

          b.booking_status,
          b.check_in,
          b.check_out,
          b.total_amount AS booking_total,

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

        WHERE p.id = $1
        `,
        [id]
      );


    if (
      paymentResult.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Payment not found.",

      });

    }


    const payment =
      paymentResult.rows[0];


    /* ===================================================
       GET SERVICES
    =================================================== */

    const servicesResult =
      await pool.query(
        `
        SELECT

          s.id AS service_id,
          s.service_name,
          s.price

        FROM booking_services bs

        INNER JOIN services s
          ON s.id = bs.service_id

        WHERE bs.booking_id = $1

        ORDER BY s.service_name
        `,
        [payment.booking_id]
      );


    const services =
      servicesResult.rows.map(
        (service) => ({

          ...service,

          price:
            Number(
              service.price || 0
            ),

        })
      );


    /* ===================================================
       RESPONSE
    =================================================== */

    return res.status(200).json({

      success: true,

      payment: {

        ...payment,

        amount:
          Number(
            payment.amount || 0
          ),

        discount:
          Number(
            payment.discount || 0
          ),

        booking_total:
          Number(
            payment.booking_total || 0
          ),

        services,

        invoice_number:
          `INV${String(
            payment.id
          ).padStart(4, "0")}`,

      },

    });


  } catch (error) {

    console.error(
      "GET PAYMENT DETAILS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to load payment details.",

      error:
        error.message,

    });

  }

};


/* =====================================================
   REFUND PAYMENT
   POST /api/admin/payments/:paymentId/refund

   IMPORTANT:
   We lock the payment row separately.

   We DO NOT use:

   LEFT JOIN bookings ... FOR UPDATE

   because PostgreSQL does not allow FOR UPDATE
   on the nullable side of an outer join.
===================================================== */

export const refundAdminPayment = async (
  req,
  res
) => {

  const client =
    await pool.connect();


  try {

    /* ===================================================
       GET PAYMENT ID

       Your route uses :paymentId
    =================================================== */

    const { paymentId } =
      req.params;


    if (!paymentId) {

      return res.status(400).json({

        success: false,

        message:
          "Payment ID is required.",

      });

    }


    /* ===================================================
       BEGIN TRANSACTION
    =================================================== */

    await client.query(
      "BEGIN"
    );


    /* ===================================================
       GET PAYMENT

       IMPORTANT:

       ONLY payments is locked here.

       This fixes:

       FOR UPDATE cannot be applied to the nullable
       side of an outer join
    =================================================== */

    const paymentResult =
      await client.query(
        `
        SELECT

          id,
          booking_id,
          amount,
          discount,
          payment_method,
          payment_status,
          payment_type,
          paid_at

        FROM payments

        WHERE id = $1

        FOR UPDATE
        `,
        [paymentId]
      );


    /* ===================================================
       PAYMENT NOT FOUND
    =================================================== */

    if (
      paymentResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(404).json({

        success: false,

        message:
          "Payment not found.",

      });

    }


    const payment =
      paymentResult.rows[0];


    /* ===================================================
       PAYMENT STATUS
    =================================================== */

    const paymentStatus =
      normalizeStatus(
        payment.payment_status
      );


    /* ===================================================
       ALREADY REFUNDED
    =================================================== */

    if (
      paymentStatus === "refunded"
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "This payment has already been refunded.",

      });

    }


    /* ===================================================
       MUST BE COMPLETED / PAID
    =================================================== */

    if (
      ![
        "completed",
        "paid"
      ].includes(
        paymentStatus
      )
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "Only completed payments can be refunded.",

      });

    }


    /* ===================================================
       GET BOOKING

       This is a separate query.

       We can safely use FOR UPDATE here because
       bookings is no longer on the nullable side
       of an outer join.
    =================================================== */

    let booking = null;


    if (
      payment.booking_id
    ) {

      const bookingResult =
        await client.query(
          `
          SELECT

            id,
            booking_status,
            payment_status,
            total_amount

          FROM bookings

          WHERE id = $1

          FOR UPDATE
          `,
          [payment.booking_id]
        );


      if (
        bookingResult.rows.length > 0
      ) {

        booking =
          bookingResult.rows[0];

      }

    }


    /* ===================================================
       BOOKING NOT FOUND
    =================================================== */

    if (!booking) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(404).json({

        success: false,

        message:
          "Booking associated with this payment was not found.",

      });

    }


    /* ===================================================
       BOOKING STATUS
    =================================================== */

    const bookingStatus =
      normalizeStatus(
        booking.booking_status
      );


    /* ===================================================
       REFUND ONLY CANCELLED / REJECTED
    =================================================== */

    if (
      ![
        "cancelled",
        "rejected"
      ].includes(
        bookingStatus
      )
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "Refund is available only for cancelled or rejected bookings.",

      });

    }


    /* ===================================================
       UPDATE PAYMENT
    =================================================== */

    const refundResult =
      await client.query(
        `
        UPDATE payments

        SET

          payment_status = 'refunded'

        WHERE id = $1

        RETURNING

          id,
          booking_id,
          amount,
          discount,
          payment_method,
          payment_status,
          payment_type,
          paid_at
        `,
        [paymentId]
      );


    /* ===================================================
       CHECK UPDATE
    =================================================== */

    if (
      refundResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );


      return res.status(400).json({

        success: false,

        message:
          "Payment could not be refunded.",

      });

    }


    /* ===================================================
       UPDATE BOOKING PAYMENT STATUS

       Only booking payments should change the entire
       booking payment status.

       Service refund:
       do NOT change bookings.payment_status.
    =================================================== */

    const paymentType =
      normalizeStatus(
        payment.payment_type
      );


    if (
      paymentType === "booking"
    ) {

      await client.query(
        `
        UPDATE bookings

        SET

          payment_status = 'refunded'

        WHERE id = $1
        `,
        [payment.booking_id]
      );

    }


    /* ===================================================
       COMMIT
    =================================================== */

    await client.query(
      "COMMIT"
    );


    /* ===================================================
       SUCCESS
    =================================================== */

    return res.status(200).json({

      success: true,

      message:
        "Payment refunded successfully.",

      payment:
        refundResult.rows[0],

    });


  } catch (error) {

    /* ===================================================
       ROLLBACK
    =================================================== */

    try {

      await client.query(
        "ROLLBACK"
      );

    } catch (rollbackError) {

      console.error(
        "ROLLBACK ERROR:",
        rollbackError
      );

    }


    console.error(
      "===================================="
    );

    console.error(
      "REFUND PAYMENT ERROR"
    );

    console.error(error);

    console.error(
      "===================================="
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to refund payment.",

      error:
        error.message,

    });

  } finally {

    client.release();

  }

};