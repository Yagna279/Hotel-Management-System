import pool from "../config/db.js";

// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (req, res) => {
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

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !customer_id ||
      !room_id ||
      !check_in ||
      !check_out
    ) {
      return res.status(400).json({
        message:
          "Customer, room, check-in and check-out are required",
      });
    }

    if (
      new Date(check_out) <=
      new Date(check_in)
    ) {
      return res.status(400).json({
        message:
          "Check-out date must be after check-in date",
      });
    }

    await client.query("BEGIN");

    // =================================================
    // CHECK CUSTOMER
    // =================================================

    const customerResult =
      await client.query(
        `
        SELECT id
        FROM customers
        WHERE id = $1
        `,
        [customer_id]
      );

    if (customerResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // =================================================
    // GET ROOM
    // =================================================

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
        message: "Room not found",
      });
    }

    const room = roomResult.rows[0];

    // =================================================
    // CHECK ROOM STATUS
    // =================================================

    const roomStatus =
      String(room.status || "").toLowerCase();

    if (
      roomStatus !== "available"
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          `Room ${room.room_number} is currently ${room.status}`,
      });
    }

    // =================================================
    // CALCULATE NIGHTS
    // =================================================

    const checkInDate =
      new Date(check_in);

    const checkOutDate =
      new Date(check_out);

    const difference =
      checkOutDate.getTime() -
      checkInDate.getTime();

    const nights =
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      );

    if (nights <= 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Invalid booking dates",
      });
    }

    // =================================================
    // TOTAL AMOUNT
    // =================================================

    const totalAmount =
      Number(room.price_per_night) *
      nights;

    // =================================================
    // CREATE BOOKING
    // =================================================

    const bookingResult =
      await client.query(
        `
        INSERT INTO bookings
        (
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
        VALUES
        (
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
          Number(adults) || 1,
          Number(children) || 0,
          totalAmount,
          special_request || null,
        ]
      );

    // =================================================
    // UPDATE ROOM STATUS
    // =================================================

    await client.query(
      `
      UPDATE rooms
      SET status = 'occupied'
      WHERE id = $1
      `,
      [room_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Room booked successfully",
      booking: bookingResult.rows[0],
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Create booking error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create booking",
      error: error.message,
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

    const { customerId } =
      req.params;

    const customerResult =
      await pool.query(
        `
        SELECT
          id,
          full_name,
          email,
          phone,
          role
        FROM customers
        WHERE id = $1
        `,
        [customerId]
      );

    if (
      customerResult.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const bookingsResult =
      await pool.query(
        `
        SELECT
          b.id,
          b.customer_id,
          b.room_id,
          b.check_in,
          b.check_out,
          b.adults,
          b.children,
          b.total_amount,
          b.booking_status,
          b.payment_status,
          b.special_request,
          b.created_at,

          r.room_number,
          r.room_type,
          r.price_per_night

        FROM bookings b

        INNER JOIN rooms r
          ON b.room_id = r.id

        WHERE b.customer_id = $1

        ORDER BY
          b.created_at DESC
        `,
        [customerId]
      );

    const bookings =
      bookingsResult.rows;

    const statistics = {

      totalBookings:
        bookings.length,

      upcoming:
        bookings.filter(
          (booking) =>
            booking.check_in &&
            new Date(
              booking.check_in
            ) >= new Date() &&
            String(
              booking.booking_status
            ).toLowerCase() !==
              "cancelled"
        ).length,

      completed:
        bookings.filter(
          (booking) =>
            String(
              booking.booking_status
            ).toLowerCase() ===
            "completed"
        ).length,

      cancelled:
        bookings.filter(
          (booking) =>
            String(
              booking.booking_status
            ).toLowerCase() ===
            "cancelled"
        ).length,
    };

    res.status(200).json({

      customer:
        customerResult.rows[0],

      bookings,

      statistics,

    });

  } catch (error) {

    console.error(
      "Get customer bookings error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load customer bookings",
    });

  }

};