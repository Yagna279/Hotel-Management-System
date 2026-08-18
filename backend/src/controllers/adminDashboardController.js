import pool from "../config/db.js";

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

export const getAdminDashboard = async (req, res) => {
  try {

    // ===================================================
    // TOTAL ROOMS
    // ===================================================

    const roomsResult = await pool.query(`
      SELECT COUNT(*) AS total_rooms
      FROM rooms
    `);

    const totalRooms =
      Number(
        roomsResult.rows[0]?.total_rooms || 0
      );


    // ===================================================
    // ROOM STATUS
    // ===================================================

    const roomStatusResult = await pool.query(`
      SELECT
        LOWER(COALESCE(status, 'unknown')) AS status,
        COUNT(*) AS count
      FROM rooms
      GROUP BY LOWER(COALESCE(status, 'unknown'))
    `);

    let availableRooms = 0;
    let occupiedRooms = 0;
    let maintenanceRooms = 0;

    roomStatusResult.rows.forEach((row) => {

      const status =
        String(row.status || "").toLowerCase();

      const count =
        Number(row.count || 0);

      if (status === "available") {

        availableRooms = count;

      } else if (status === "occupied") {

        occupiedRooms = count;

      } else if (
        status === "maintenance" ||
        status === "under maintenance"
      ) {

        maintenanceRooms = count;

      }

    });


    // ===================================================
    // TOTAL CUSTOMERS
    // ===================================================

    const customersResult = await pool.query(`
      SELECT COUNT(*) AS total_customers
      FROM customers
    `);

    const totalCustomers =
      Number(
        customersResult.rows[0]?.total_customers || 0
      );


    // ===================================================
    // TOTAL RESERVATIONS
    // ===================================================

    const reservationsResult = await pool.query(`
      SELECT COUNT(*) AS total_reservations
      FROM bookings
    `);

    const totalReservations =
      Number(
        reservationsResult.rows[0]?.total_reservations || 0
      );


    // ===================================================
    // TOTAL REVENUE
    // ===================================================

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
        ) AS total_revenue
      FROM payments
    `);

    const totalRevenue =
      Number(
        revenueResult.rows[0]?.total_revenue || 0
      );


    // ===================================================
    // RECENT RESERVATIONS
    // ===================================================

    const recentReservationsResult =
      await pool.query(`
        SELECT
          b.id,
          b.check_in,
          b.check_out,
          b.booking_status,
          b.total_amount,

          -- CUSTOMER NAME
          c.full_name AS guest_name,

          -- ROOM DETAILS
          r.room_number,
          r.room_type

        FROM bookings b

        LEFT JOIN customers c
          ON c.id = b.customer_id

        LEFT JOIN rooms r
          ON r.id = b.room_id

        ORDER BY b.id DESC

        LIMIT 5
      `);


    // ===================================================
    // RESERVATION STATISTICS
    // ===================================================

    const reservationStatusResult =
      await pool.query(`
        SELECT
          LOWER(
            COALESCE(
              booking_status,
              'confirmed'
            )
          ) AS status,

          COUNT(*) AS count

        FROM bookings

        GROUP BY
          LOWER(
            COALESCE(
              booking_status,
              'confirmed'
            )
          )
      `);


    const reservationStatistics = {
      total: totalReservations,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
    };


    reservationStatusResult.rows.forEach(
      (row) => {

        const status =
          String(
            row.status || ""
          ).toLowerCase();

        const count =
          Number(
            row.count || 0
          );


        if (status === "confirmed") {

          reservationStatistics.confirmed =
            count;

        } else if (status === "pending") {

          reservationStatistics.pending =
            count;

        } else if (status === "cancelled") {

          reservationStatistics.cancelled =
            count;

        } else if (status === "completed") {

          reservationStatistics.completed =
            count;

        }

      }
    );


    // ===================================================
    // FINAL RESPONSE
    // ===================================================

    res.status(200).json({

      success: true,

      // =================================================
      // DASHBOARD STATISTICS
      // =================================================

      statistics: {

        totalRooms,

        // Frontend uses "reservations"
        reservations: totalReservations,

        // Frontend uses "customers"
        customers: totalCustomers,

        totalReservations,

        totalCustomers,

        totalRevenue,

        availableRooms,

        occupiedRooms,

        maintenanceRooms,

      },


      // =================================================
      // ROOM STATUS
      // =================================================

      roomStatus: {

        total: totalRooms,

        available: availableRooms,

        occupied: occupiedRooms,

        maintenance: maintenanceRooms,

      },


      // =================================================
      // RESERVATION STATISTICS
      // =================================================

      reservationStatistics,


      // =================================================
      // RECENT RESERVATIONS
      // =================================================

      recentReservations:
        recentReservationsResult.rows,

    });

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "ADMIN DASHBOARD ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(error);

    console.error(
      "========================================"
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to load admin dashboard data.",

      error:
        error.message,

    });

  }
};