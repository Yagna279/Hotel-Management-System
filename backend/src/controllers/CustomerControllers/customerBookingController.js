import pool from "../../config/db.js";

// =====================================================
// CREATE CUSTOMER BOOKING
// =====================================================

export const createCustomerBooking = async (req, res) => {

  const client = await pool.connect();

  try {

    const {
      customer_id,
      room_id,
      check_in,
      check_out,
      adults,
      children,
      special_request,
    } = req.body;

    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !customer_id ||
      !room_id ||
      !check_in ||
      !check_out
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Customer, room, check-in and check-out are required.",
      });

    }

    const adultCount =
      Number(adults) || 1;

    const childCount =
      Number(children) || 0;

    if (adultCount < 1) {

      return res.status(400).json({
        success: false,
        message:
          "At least one adult is required.",
      });

    }

    if (childCount < 0) {

      return res.status(400).json({
        success: false,
        message:
          "Children cannot be negative.",
      });

    }

    // ===================================================
    // DATE VALIDATION
    // ===================================================

    const checkInDate =
      new Date(check_in);

    const checkOutDate =
      new Date(check_out);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid booking dates.",
      });

    }

    if (checkOutDate <= checkInDate) {

      return res.status(400).json({
        success: false,
        message:
          "Check-out must be after check-in.",
      });

    }

    // ===================================================
    // START TRANSACTION
    // ===================================================

    await client.query("BEGIN");

    // ===================================================
    // CHECK CUSTOMER
    // ===================================================

    const customerResult =
      await client.query(
        `
        SELECT
          id,
          full_name,
          email,
          phone
        FROM customers
        WHERE id = $1
        `,
        [customer_id]
      );

    if (customerResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });

    }

    const customer =
      customerResult.rows[0];

    // ===================================================
    // CHECK ROOM
    // ===================================================

    const roomResult =
      await client.query(
        `
        SELECT
          id,
          room_number,
          room_type,
          price_per_night,
          status
        FROM rooms
        WHERE id = $1
        FOR UPDATE
        `,
        [room_id]
      );

    if (roomResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message:
          "Room not found.",
      });

    }

    const room =
      roomResult.rows[0];

    // ===================================================
    // CHECK ROOM STATUS
    // ===================================================

    if (
      String(room.status || "").toLowerCase() !==
      "available"
    ) {

      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "This room is currently not available.",
      });

    }

    // ===================================================
    // CHECK EXISTING BOOKING
    // ===================================================

    const existingBookingResult =
      await client.query(
        `
        SELECT id
        FROM bookings
        WHERE room_id = $1
          AND LOWER(
            COALESCE(
              booking_status,
              'confirmed'
            )
          ) NOT IN (
            'cancelled',
            'completed'
          )
          AND check_in < $3
          AND check_out > $2
        LIMIT 1
        `,
        [
          room_id,
          check_in,
          check_out,
        ]
      );

    if (
      existingBookingResult.rows.length > 0
    ) {

      await client.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        message:
          "This room is already booked for the selected dates.",
      });

    }

    // ===================================================
    // CALCULATE NIGHTS
    // ===================================================

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights =
      Math.ceil(
        (
          checkOutDate.getTime() -
          checkInDate.getTime()
        ) / millisecondsPerDay
      );

    if (nights <= 0) {

      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "Invalid number of nights.",
      });

    }

    // ===================================================
    // CALCULATE TOTAL
    // ===================================================

    const pricePerNight =
      Number(room.price_per_night);

    const totalAmount =
      pricePerNight * nights;

    // ===================================================
    // CREATE BOOKING
    // ===================================================

    const bookingResult =
      await client.query(
        `
        INSERT INTO bookings (
          customer_id,
          room_id,
          check_in,
          check_out,
          adults,
          children,
          total_amount,
          booking_status,
          payment_status,
          special_request,
          created_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          'confirmed',
          'pending',
          $8,
          CURRENT_TIMESTAMP
        )
        RETURNING *
        `,
        [
          customer_id,
          room_id,
          check_in,
          check_out,
          adultCount,
          childCount,
          totalAmount,
          special_request || null,
        ]
      );

    const booking =
      bookingResult.rows[0];

    // ===================================================
    // CREATE PAYMENT RECORD
    // ===================================================

    const paymentResult =
      await client.query(
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
          $4,
          $5
        )
        RETURNING *
        `,
        [
          booking.id,
          totalAmount,
          "Pending",
          "pending",
          null,
        ]
      );

    const payment =
      paymentResult.rows[0];

    // ===================================================
    // UPDATE ROOM STATUS
    // ===================================================

    await client.query(
      `
      UPDATE rooms
      SET status = 'OCCUPIED'
      WHERE id = $1
      `,
      [room_id]
    );

    // ===================================================
    // COMMIT
    // ===================================================

    await client.query("COMMIT");

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(201).json({

      success: true,

      message:
        "Room booked successfully.",

      booking,

      payment,

      customer: {
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
      },

      room: {
        id: room.id,
        room_number: room.room_number,
        room_type: room.room_type,
        price_per_night:
          room.price_per_night,
      },

      nights,

      total_amount:
        totalAmount,

    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Create customer booking error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create booking.",

      error:
        error.message,

    });

  } finally {

    client.release();

  }

};


// =====================================================
// GET CUSTOMER BOOKINGS
// =====================================================

export const getCustomerBookings = async (
  req,
  res
) => {

  try {

    const {
      customerId
    } = req.params;

    if (!customerId) {

      return res.status(400).json({
        success: false,
        message:
          "Customer ID is required.",
      });

    }

    // ===================================================
    // CUSTOMER
    // ===================================================

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

    // ===================================================
    // BOOKINGS
    // ===================================================

    const bookingsResult =
      await pool.query(
        `
        SELECT
          b.id,
          b.customer_id,
          b.room_id,
          r.room_number,
          r.room_type,
          r.price_per_night,
          b.check_in,
          b.check_out,
          b.adults,
          b.children,
          b.total_amount,
          b.booking_status,
          b.payment_status,
          b.special_request,
          b.created_at
        FROM bookings b
        LEFT JOIN rooms r
          ON b.room_id = r.id
        WHERE b.customer_id = $1
        ORDER BY b.created_at DESC
        `,
        [customerId]
      );

    // ===================================================
    // STATISTICS
    // ===================================================

    const bookings =
      bookingsResult.rows;

    const totalBookings =
      bookings.length;

    const upcoming =
      bookings.filter(
        (booking) => {

          const status =
            String(
              booking.booking_status || ""
            ).toLowerCase();

          const checkIn =
            new Date(
              booking.check_in
            );

          return (
            checkIn >= new Date() &&
            status !== "cancelled" &&
            status !== "completed"
          );

        }
      ).length;

    const completed =
      bookings.filter(
        (booking) =>
          String(
            booking.booking_status || ""
          ).toLowerCase() ===
          "completed"
      ).length;

    const cancelled =
      bookings.filter(
        (booking) =>
          String(
            booking.booking_status || ""
          ).toLowerCase() ===
          "cancelled"
      ).length;

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({

      success: true,

      customer:
        customerResult.rows[0],

      bookings,

      statistics: {
        totalBookings,
        upcoming,
        completed,
        cancelled,
      },

    });

  } catch (error) {

    console.error(
      "Get customer bookings error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load customer bookings.",

      error:
        error.message,

    });

  }

};