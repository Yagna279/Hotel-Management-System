import pool from "../../config/db.js";

/* =====================================================
   GET CUSTOMER PAYMENTS
   GET /api/customer-payments/:customerId
===================================================== */

export const getCustomerPayments = async (req, res) => {

  try {

    const { customerId } = req.params;

    /* ===================================================
       VALIDATE CUSTOMER ID
    =================================================== */

    if (!customerId) {

      return res.status(400).json({

        success: false,

        message:
          "Customer ID is required.",

      });

    }


    /* ===================================================
       CHECK CUSTOMER
    =================================================== */

    const customerResult =
      await pool.query(
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


    if (
      customerResult.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Customer not found.",

      });

    }


    /* ===================================================
       GET PAYMENTS

       IMPORTANT:

       Only the latest payment for each booking is
       returned.

       This prevents an old pending payment from being
       displayed after the customer has completed payment.
    =================================================== */

    const paymentsResult =
      await pool.query(
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
          b.payment_status AS booking_payment_status,

          r.room_number,
          r.room_type

        FROM payments p

        INNER JOIN (
          SELECT DISTINCT ON (booking_id)
            id
          FROM payments
          ORDER BY
            booking_id,
            id DESC
        ) latest
          ON latest.id = p.id

        INNER JOIN bookings b
          ON p.booking_id = b.id

        LEFT JOIN rooms r
          ON b.room_id = r.id

        WHERE b.customer_id = $1

        ORDER BY
          p.id DESC
        `,
        [customerId]
      );


    /* ===================================================
       FORMAT PAYMENTS
    =================================================== */

    const payments =
      paymentsResult.rows.map(
        (payment) => ({

          ...payment,

          amount:
            Number(
              payment.amount || 0
            ),

          invoice_number:
            `INV${String(
              payment.id
            ).padStart(4, "0")}`,

        })
      );


    /* ===================================================
       STATISTICS
    =================================================== */

    let totalSpent = 0;

    let completed = 0;

    let pending = 0;

    let refunds = 0;


    payments.forEach(
      (payment) => {

        const amount =
          Number(
            payment.amount
          ) || 0;


        const status =
          String(
            payment.payment_status || ""
          )
            .toLowerCase()
            .trim();


        /* =============================================
           COMPLETED
        ============================================= */

        if (
          status === "completed" ||
          status === "paid" ||
          status === "success" ||
          status === "successful"
        ) {

          completed += amount;

        }


        /* =============================================
           PENDING
        ============================================= */

        if (
          status === "pending" ||
          status === "unpaid" ||
          status === "processing"
        ) {

          pending += amount;

        }


        /* =============================================
           REFUNDS
        ============================================= */

        if (
          status === "refunded" ||
          status === "refund"
        ) {

          refunds += amount;

        }


        /* =============================================
           TOTAL SPENT

           Refunded payments are excluded.
        ============================================= */

        if (
          status !== "refunded" &&
          status !== "refund"
        ) {

          totalSpent += amount;

        }

      }
    );


    /* ===================================================
       RESPONSE
    =================================================== */

    return res.status(200).json({

      success: true,

      customer:
        customerResult.rows[0],

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
      "GET CUSTOMER PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load customer payments.",

      error:
        error.message,

    });

  }

};


/* =====================================================
   CREATE CUSTOMER PAYMENT
   POST /api/customer-payments
===================================================== */

export const createCustomerPayment = async (
  req,
  res
) => {

  const client =
    await pool.connect();


  try {

    const {
      customer_id,
      booking_id,
      amount,
      payment_method,
    } = req.body;


    /* ===================================================
       VALIDATION
    =================================================== */

    if (
      !customer_id ||
      !booking_id
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Customer ID and booking ID are required.",

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
       NORMALIZE PAYMENT METHOD
    =================================================== */

    const normalizedPaymentMethod =
      String(
        payment_method
      ).trim();


    /* ===================================================
       BEGIN TRANSACTION
    =================================================== */

    await client.query(
      "BEGIN"
    );


    /* ===================================================
       CHECK CUSTOMER
    =================================================== */

    const customerResult =
      await client.query(
        `
        SELECT
          id,
          full_name,
          email
        FROM customers
        WHERE id = $1
        FOR UPDATE
        `,
        [customer_id]
      );


    if (
      customerResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({

        success: false,

        message:
          "Customer not found.",

      });

    }


    /* ===================================================
       GET BOOKING

       FOR UPDATE prevents two payment requests from
       processing the same booking simultaneously.
    =================================================== */

    const bookingResult =
      await client.query(
        `
        SELECT

          id,
          customer_id,
          room_id,
          total_amount,
          booking_status,
          payment_status,
          check_in,
          check_out

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
       CHECK BOOKING OWNER
    =================================================== */

    if (
      String(
        booking.customer_id
      ) !==
      String(
        customer_id
      )
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(403).json({

        success: false,

        message:
          "This booking does not belong to this customer.",

      });

    }


    /* ===================================================
       CHECK BOOKING ALREADY PAID
    =================================================== */

    const bookingPaymentStatus =
      String(
        booking.payment_status || ""
      )
        .toLowerCase()
        .trim();


    if (
      bookingPaymentStatus === "paid"
    ) {

      /*
       * Check if there is already a completed payment.
       * If yes, don't allow another payment.
       */

      const completedPayment =
        await client.query(
          `
          SELECT
            id,
            booking_id,
            amount,
            payment_method,
            payment_status,
            paid_at
          FROM payments
          WHERE booking_id = $1
          AND LOWER(
            COALESCE(
              payment_status,
              ''
            )
          ) IN (
            'completed',
            'paid',
            'success',
            'successful'
          )
          ORDER BY id DESC
          LIMIT 1
          `,
          [booking_id]
        );


      if (
        completedPayment.rows.length > 0
      ) {

        await client.query(
          "ROLLBACK"
        );

        const existingPayment =
          completedPayment.rows[0];

        return res.status(400).json({

          success: false,

          message:
            "This booking has already been paid.",

          payment: {

            ...existingPayment,

            invoice_number:
              `INV${String(
                existingPayment.id
              ).padStart(4, "0")}`,

          },

        });

      }

    }


    /* ===================================================
       CHECK AMOUNT
    =================================================== */

    const bookingTotal =
      Number(
        booking.total_amount
      ) || 0;


    const paymentAmount =
      Number(
        amount
      ) || 0;


    if (
      bookingTotal > 0 &&
      paymentAmount !== bookingTotal
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(400).json({

        success: false,

        message:
          `Payment amount must be ₹${bookingTotal.toLocaleString(
            "en-IN"
          )}.`,

      });

    }


    /* ===================================================
       CHECK EXISTING PAYMENT
    =================================================== */

    const existingPaymentResult =
      await client.query(
        `
        SELECT

          id,
          booking_id,
          amount,
          payment_method,
          payment_status,
          paid_at

        FROM payments

        WHERE booking_id = $1

        ORDER BY id DESC

        LIMIT 1

        FOR UPDATE
        `,
        [booking_id]
      );


    let payment;


    /* ===================================================
       EXISTING PAYMENT FOUND
    =================================================== */

    if (
      existingPaymentResult.rows.length > 0
    ) {

      const existingPayment =
        existingPaymentResult.rows[0];


      const existingStatus =
        String(
          existingPayment.payment_status || ""
        )
          .toLowerCase()
          .trim();


      /* ===============================================
         ALREADY COMPLETED
      =============================================== */

      if (
        existingStatus === "completed" ||
        existingStatus === "paid" ||
        existingStatus === "success" ||
        existingStatus === "successful"
      ) {

        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({

          success: false,

          message:
            "This booking has already been paid.",

          payment: {

            ...existingPayment,

            invoice_number:
              `INV${String(
                existingPayment.id
              ).padStart(4, "0")}`,

          },

        });

      }


      /* ===============================================
         PENDING PAYMENT EXISTS

         UPDATE IT.

         DO NOT CREATE ANOTHER PAYMENT ROW.
      =============================================== */

      if (
        existingStatus === "pending" ||
        existingStatus === "unpaid" ||
        existingStatus === "processing"
      ) {

        const updateResult =
          await client.query(
            `
            UPDATE payments

            SET

              amount = $1,

              payment_method = $2,

              payment_status = 'completed',

              paid_at = NOW()

            WHERE id = $3

            RETURNING

              id,
              booking_id,
              amount,
              payment_method,
              payment_status,
              paid_at
            `,
            [
              paymentAmount,
              normalizedPaymentMethod,
              existingPayment.id,
            ]
          );


        payment =
          updateResult.rows[0];

      }

      /* ===============================================
         OTHER STATUS

         Update existing payment to completed.
      =============================================== */

      else {

        const updateResult =
          await client.query(
            `
            UPDATE payments

            SET

              amount = $1,

              payment_method = $2,

              payment_status = 'completed',

              paid_at = NOW()

            WHERE id = $3

            RETURNING

              id,
              booking_id,
              amount,
              payment_method,
              payment_status,
              paid_at
            `,
            [
              paymentAmount,
              normalizedPaymentMethod,
              existingPayment.id,
            ]
          );


        payment =
          updateResult.rows[0];

      }

    }


    /* ===================================================
       NO EXISTING PAYMENT

       CREATE NEW COMPLETED PAYMENT.
    =================================================== */

    else {

      const insertResult =
        await client.query(
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
            paymentAmount,
            normalizedPaymentMethod,
          ]
        );


      payment =
        insertResult.rows[0];

    }


    /* ===================================================
       UPDATE BOOKING
    =================================================== */

    await client.query(
      `
      UPDATE bookings

      SET
        payment_status = 'paid'

      WHERE id = $1
      `,
      [booking_id]
    );


    /* ===================================================
       COMMIT
    =================================================== */

    await client.query(
      "COMMIT"
    );


    /* ===================================================
       INVOICE NUMBER
    =================================================== */

    const invoiceNumber =
      `INV${String(
        payment.id
      ).padStart(4, "0")}`;


    /* ===================================================
       RESPONSE
    =================================================== */

    return res.status(201).json({

      success: true,

      message:
        "Payment completed successfully.",

      payment: {

        ...payment,

        invoice_number:
          invoiceNumber,

        amount:
          Number(
            payment.amount
          ),

      },

    });

  } catch (error) {

    await client.query(
      "ROLLBACK"
    );

    console.error(
      "CREATE CUSTOMER PAYMENT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to complete payment.",

      error:
        error.message,

    });

  } finally {

    client.release();

  }

};