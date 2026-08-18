import pool from "../config/db.js";

// =====================================================
// GET ALL ADMIN RESERVATIONS
// GET /api/admin/reservations
// =====================================================

export const getAdminReservations = async (req, res) => {
  try {
    const reservationsResult = await pool.query(`
      SELECT
        b.id,
        b.customer_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.booking_status,
        b.total_amount,
        b.remarks,

        c.full_name AS guest_name,
        c.email AS guest_email,
        c.phone AS guest_phone,

        r.room_number,
        r.room_type,
        r.status AS room_status,

        COALESCE(
          p.payment_status,
          'pending'
        ) AS payment_status,

        COALESCE(
          p.payment_method,
          'Not Paid'
        ) AS payment_method,

        COALESCE(
          p.amount,
          0
        ) AS payment_amount

      FROM bookings b

      LEFT JOIN customers c
        ON c.id = b.customer_id

      LEFT JOIN rooms r
        ON r.id = b.room_id

      LEFT JOIN LATERAL (
        SELECT
          payment_status,
          payment_method,
          amount
        FROM payments
        WHERE payments.booking_id = b.id
        ORDER BY payments.id DESC
        LIMIT 1
      ) p
        ON true

      ORDER BY b.check_in DESC, b.id DESC
    `);

    // ===================================================
    // TODAY'S BOOKINGS
    // ===================================================

    const todaysBookingsResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE check_in::date = CURRENT_DATE
        AND LOWER(
          COALESCE(booking_status, 'confirmed')
        ) != 'cancelled'
    `);

    const todaysBookings =
      Number(
        todaysBookingsResult.rows[0]?.count || 0
      );

    // ===================================================
    // AVAILABLE ROOMS
    // ===================================================

    const availableRoomsResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM rooms
      WHERE LOWER(
        COALESCE(status, '')
      ) = 'available'
    `);

    const availableRooms =
      Number(
        availableRoomsResult.rows[0]?.count || 0
      );

    // ===================================================
    // CHECK-INS TODAY
    // ===================================================

    const checkInsResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE check_in::date = CURRENT_DATE
        AND LOWER(
          COALESCE(booking_status, '')
        ) NOT IN (
          'cancelled',
          'rejected'
        )
    `);

    const checkInsToday =
      Number(
        checkInsResult.rows[0]?.count || 0
      );

    // ===================================================
    // PENDING APPROVAL
    // ===================================================

    const pendingResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE LOWER(
        COALESCE(booking_status, '')
      ) = 'pending'
    `);

    const pendingApproval =
      Number(
        pendingResult.rows[0]?.count || 0
      );

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({
      success: true,

      statistics: {
        todaysBookings,
        availableRooms,
        checkInsToday,
        pendingApproval,
      },

      reservations:
        reservationsResult.rows,
    });

  } catch (error) {
    console.error(
      "ADMIN RESERVATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load reservations.",
      error:
        error.message,
    });
  }
};


// =====================================================
// GET AVAILABLE ROOMS
// GET /api/admin/reservations/rooms/available
// =====================================================

export const getAvailableRooms = async (
  req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        room_number,
        room_type,
        status
      FROM rooms
      WHERE LOWER(
        COALESCE(status, '')
      ) = 'available'
      ORDER BY room_number
    `);

    res.status(200).json({
      success: true,
      rooms: result.rows,
    });

  } catch (error) {
    console.error(
      "GET AVAILABLE ROOMS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load available rooms.",
      error:
        error.message,
    });
  }
};


// =====================================================
// UPDATE COMPLETE RESERVATION
// PUT /api/admin/reservations/:id
//
// Updates:
// - Room
// - Check-in
// - Check-out
// - Status
// - Remarks
//
// Also updates room status.
// =====================================================

export const updateReservation = async (
  req,
  res
) => {

  const client =
    await pool.connect();

  try {

    const { id } =
      req.params;

    const {
      room_id,
      check_in,
      check_out,
      booking_status,
      remarks,
    } = req.body;


    // ===================================================
    // VALIDATION
    // ===================================================

    if (!check_in) {
      return res.status(400).json({
        success: false,
        message:
          "Check-in date is required.",
      });
    }

    if (!check_out) {
      return res.status(400).json({
        success: false,
        message:
          "Check-out date is required.",
      });
    }

    if (!booking_status) {
      return res.status(400).json({
        success: false,
        message:
          "Booking status is required.",
      });
    }


    // ===================================================
    // CHECK DATE ORDER
    // ===================================================

    if (
      new Date(check_out) <=
      new Date(check_in)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Check-out date must be after check-in date.",
      });
    }


    // ===================================================
    // START TRANSACTION
    // ===================================================

    await client.query(
      "BEGIN"
    );


    // ===================================================
    // GET CURRENT BOOKING
    // ===================================================

    const currentBookingResult =
      await client.query(
        `
        SELECT
          id,
          room_id,
          booking_status
        FROM bookings
        WHERE id = $1
        FOR UPDATE
        `,
        [id]
      );


    if (
      currentBookingResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        success: false,
        message:
          "Reservation not found.",
      });

    }


    const currentBooking =
      currentBookingResult.rows[0];


    const oldRoomId =
      currentBooking.room_id;

    const newRoomId =
      room_id
        ? Number(room_id)
        : oldRoomId;


    // ===================================================
    // CHECK NEW ROOM EXISTS
    // ===================================================

    if (!newRoomId) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(400).json({
        success: false,
        message:
          "Please select a room.",
      });

    }


    const roomResult =
      await client.query(
        `
        SELECT
          id,
          room_number,
          room_type,
          status
        FROM rooms
        WHERE id = $1
        FOR UPDATE
        `,
        [newRoomId]
      );


    if (
      roomResult.rows.length === 0
    ) {

      await client.query(
        "ROLLBACK"
      );

      return res.status(404).json({
        success: false,
        message:
          "Selected room was not found.",
      });

    }


    // ===================================================
    // CHECK ROOM AVAILABILITY
    // ===================================================

    const normalizedStatus =
      String(
        booking_status
      ).toLowerCase();


    if (
      Number(oldRoomId) !==
        Number(newRoomId) &&
      normalizedStatus !==
        "cancelled"
    ) {

      const newRoomStatus =
        String(
          roomResult.rows[0].status || ""
        ).toLowerCase();


      if (
        newRoomStatus !== "available"
      ) {

        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          success: false,
          message:
            "The selected room is not available.",
        });

      }

    }


    // ===================================================
    // UPDATE BOOKING
    // ===================================================

    await client.query(
      `
      UPDATE bookings
      SET
        room_id = $1,
        check_in = $2,
        check_out = $3,
        booking_status = $4,
        remarks = $5
      WHERE id = $6
      `,
      [
        newRoomId,
        check_in,
        check_out,
        booking_status,
        remarks || "",
        id,
      ]
    );


    // ===================================================
    // RELEASE OLD ROOM IF ROOM CHANGED
    // ===================================================

    if (
      oldRoomId &&
      Number(oldRoomId) !==
        Number(newRoomId)
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Available'
        WHERE id = $1
        `,
        [oldRoomId]
      );

    }


    // ===================================================
    // CANCELLED
    // ===================================================

    if (
      normalizedStatus ===
      "cancelled"
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Available'
        WHERE id = $1
        `,
        [newRoomId]
      );

    }


    // ===================================================
    // REJECTED
    // ===================================================

    else if (
      normalizedStatus ===
      "rejected"
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Available'
        WHERE id = $1
        `,
        [newRoomId]
      );

    }


    // ===================================================
    // CONFIRMED / CHECKED IN
    // ===================================================

    else if (
      [
        "confirmed",
        "checked_in",
      ].includes(
        normalizedStatus
      )
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Occupied'
        WHERE id = $1
        `,
        [newRoomId]
      );

    }


    // ===================================================
    // CHECKED OUT / COMPLETED
    // ===================================================

    else if (
      [
        "checked_out",
        "completed",
      ].includes(
        normalizedStatus
      )
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Available'
        WHERE id = $1
        `,
        [newRoomId]
      );

    }


    // ===================================================
    // PENDING
    // ===================================================

    else if (
      normalizedStatus ===
      "pending"
    ) {

      await client.query(
        `
        UPDATE rooms
        SET status = 'Occupied'
        WHERE id = $1
        `,
        [newRoomId]
      );

    }


    // ===================================================
    // COMMIT
    // ===================================================

    await client.query(
      "COMMIT"
    );


    // ===================================================
    // GET UPDATED RESERVATION
    // ===================================================

    const updatedResult =
      await pool.query(
        `
        SELECT
          b.id,
          b.customer_id,
          b.room_id,
          b.check_in,
          b.check_out,
          b.booking_status,
          b.total_amount,
          b.remarks,

          c.full_name AS guest_name,
          c.email AS guest_email,
          c.phone AS guest_phone,

          r.room_number,
          r.room_type,
          r.status AS room_status,

          COALESCE(
            p.payment_status,
            'pending'
          ) AS payment_status,

          COALESCE(
            p.payment_method,
            'Not Paid'
          ) AS payment_method,

          COALESCE(
            p.amount,
            0
          ) AS payment_amount

        FROM bookings b

        LEFT JOIN customers c
          ON c.id = b.customer_id

        LEFT JOIN rooms r
          ON r.id = b.room_id

        LEFT JOIN LATERAL (
          SELECT
            payment_status,
            payment_method,
            amount
          FROM payments
          WHERE payments.booking_id = b.id
          ORDER BY payments.id DESC
          LIMIT 1
        ) p
          ON true

        WHERE b.id = $1
        `,
        [id]
      );


    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({

      success: true,

      message:
        normalizedStatus === "cancelled"
          ? "Reservation cancelled and room is now available."
          : "Reservation updated successfully.",

      reservation:
        updatedResult.rows[0],

    });

  } catch (error) {

    try {
      await client.query(
        "ROLLBACK"
      );
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error(
      "UPDATE RESERVATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update reservation.",
      error:
        error.message,
    });

  } finally {

    client.release();

  }

};