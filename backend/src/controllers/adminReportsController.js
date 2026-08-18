import pool from "../config/db.js";

/* =====================================================
   GET ADMIN REPORTS
   GET /api/admin/reports
===================================================== */

export const getAdminReports = async (req, res) => {
  try {

    /* ===================================================
       BASIC STATISTICS
    =================================================== */

    const statisticsResult = await pool.query(`
      SELECT

        /* TOTAL REVENUE */
        COALESCE(
          (
            SELECT SUM(amount)
            FROM payments
            WHERE LOWER(COALESCE(payment_status, '')) IN
            ('completed', 'paid')
          ),
          0
        ) AS total_revenue,

        /* TOTAL BOOKINGS */
        (
          SELECT COUNT(*)
          FROM bookings
        ) AS total_bookings,

        /* TOTAL CUSTOMERS */
        (
          SELECT COUNT(*)
          FROM customers
        ) AS total_customers,

        /* TOTAL ROOMS */
        (
          SELECT COUNT(*)
          FROM rooms
        ) AS total_rooms,

        /* OCCUPIED ROOMS */
        (
          SELECT COUNT(DISTINCT room_id)
          FROM bookings
          WHERE LOWER(COALESCE(booking_status, '')) IN
          ('confirmed', 'checked in', 'checked_in')
          AND CURRENT_DATE BETWEEN check_in AND check_out
        ) AS occupied_rooms

    `);


    const stats = statisticsResult.rows[0];

    const totalRooms =
      Number(stats.total_rooms || 0);

    const occupiedRooms =
      Number(stats.occupied_rooms || 0);

    const occupancy =
      totalRooms > 0
        ? Math.round(
            (occupiedRooms / totalRooms) * 100
          )
        : 0;


    /* ===================================================
       REVENUE BY CATEGORY
    =================================================== */

    const roomRevenueResult = await pool.query(`
      SELECT
        COALESCE(SUM(p.amount), 0) AS amount
      FROM payments p
      WHERE LOWER(COALESCE(p.payment_status, '')) IN
      ('completed', 'paid')
    `);


    /*
      Service revenue comes from booking_services.

      If booking_services has amount/price,
      use that value.

      Otherwise services.price is used.
    */

    let serviceRevenue = 0;

    try {

      const serviceResult = await pool.query(`
        SELECT
          COALESCE(
            SUM(
              COALESCE(bs.amount, s.price, 0)
            ),
            0
          ) AS amount
        FROM booking_services bs
        LEFT JOIN services s
          ON s.id = bs.service_id
        LEFT JOIN bookings b
          ON b.id = bs.booking_id
        WHERE LOWER(COALESCE(b.payment_status, '')) IN
        ('paid', 'completed')
      `);

      serviceRevenue =
        Number(
          serviceResult.rows[0]?.amount || 0
        );

    } catch (error) {

      /*
        If booking_services does not have
        an amount column, use service prices.
      */

      console.log(
        "Service amount column not available. Using service price."
      );

      const serviceResult = await pool.query(`
        SELECT
          COALESCE(
            SUM(COALESCE(s.price, 0)),
            0
          ) AS amount
        FROM booking_services bs
        LEFT JOIN services s
          ON s.id = bs.service_id
      `);

      serviceRevenue =
        Number(
          serviceResult.rows[0]?.amount || 0
        );

    }


    const totalRevenue =
      Number(
        stats.total_revenue || 0
      );


    /*
      Approximate room revenue:
      total payment revenue minus service revenue.
    */

    const roomRevenue =
      Math.max(
        totalRevenue - serviceRevenue,
        0
      );


    /*
      Split service revenue into categories.
    */

    const categoryResult = await pool.query(`
      SELECT
        LOWER(COALESCE(s.category, 'other')) AS category,
        COALESCE(
          SUM(COALESCE(s.price, 0)),
          0
        ) AS amount
      FROM booking_services bs
      LEFT JOIN services s
        ON s.id = bs.service_id
      GROUP BY LOWER(COALESCE(s.category, 'other'))
    `);


    let restaurantRevenue = 0;
    let spaRevenue = 0;
    let transportRevenue = 0;
    let otherServiceRevenue = 0;


    categoryResult.rows.forEach((row) => {

      const category =
        String(row.category || "")
          .toLowerCase();

      const amount =
        Number(row.amount || 0);


      if (
        category.includes("food") ||
        category.includes("dining") ||
        category.includes("restaurant")
      ) {

        restaurantRevenue += amount;

      } else if (
        category.includes("wellness") ||
        category.includes("spa")
      ) {

        spaRevenue += amount;

      } else if (
        category.includes("transport")
      ) {

        transportRevenue += amount;

      } else {

        otherServiceRevenue += amount;

      }

    });


    /* ===================================================
       REVENUE OVERVIEW
    =================================================== */

    const revenueOverview = [
      {
        name: "Room Revenue",
        amount: roomRevenue,
      },
      {
        name: "Restaurant",
        amount: restaurantRevenue,
      },
      {
        name: "Spa Services",
        amount: spaRevenue,
      },
      {
        name: "Transport",
        amount: transportRevenue,
      },
    ];


    const maxRevenue =
      Math.max(
        ...revenueOverview.map(
          (item) => item.amount
        ),
        1
      );


    const revenueOverviewWithPercentage =
      revenueOverview.map((item) => ({
        ...item,

        percentage:
          Math.round(
            (item.amount / maxRevenue) * 100
          ),

      }));


    /* ===================================================
       ROOM TYPE ANALYSIS
    =================================================== */

    const roomTypeResult = await pool.query(`
      SELECT
        COALESCE(r.room_type, 'Unknown') AS room_type,
        COUNT(*) AS booking_count
      FROM bookings b
      LEFT JOIN rooms r
        ON r.id = b.room_id
      GROUP BY r.room_type
      ORDER BY booking_count DESC
    `);


    const totalRoomTypeBookings =
      roomTypeResult.rows.reduce(
        (total, row) =>
          total +
          Number(row.booking_count || 0),
        0
      );


    const roomTypeAnalysis =
      roomTypeResult.rows.map((row) => ({

        room_type:
          row.room_type,

        percentage:
          totalRoomTypeBookings > 0
            ? Math.round(
                (
                  Number(row.booking_count) /
                  totalRoomTypeBookings
                ) * 100
              )
            : 0,

      }));


    /* ===================================================
       MONTHLY REVENUE
    =================================================== */

    const monthlyResult = await pool.query(`
      SELECT
        EXTRACT(
          MONTH FROM p.paid_at
        ) AS month_number,

        TO_CHAR(
          p.paid_at,
          'Month'
        ) AS month_name,

        COUNT(DISTINCT p.booking_id) AS bookings,

        COALESCE(
          SUM(p.amount),
          0
        ) AS revenue

      FROM payments p

      WHERE
        LOWER(COALESCE(p.payment_status, '')) IN
        ('completed', 'paid')

      GROUP BY
        EXTRACT(MONTH FROM p.paid_at),
        TO_CHAR(p.paid_at, 'Month')

      ORDER BY month_number
    `);


    /* ===================================================
       MONTHLY OCCUPANCY
    =================================================== */

    const monthlyOccupancyResult =
      await pool.query(`
        SELECT
          EXTRACT(
            MONTH FROM check_in
          ) AS month_number,

          COUNT(*) AS bookings

        FROM bookings

        GROUP BY
          EXTRACT(MONTH FROM check_in)

        ORDER BY month_number
      `);


    const monthlyOccupancyMap = {};

    monthlyOccupancyResult.rows.forEach(
      (row) => {

        monthlyOccupancyMap[
          Number(row.month_number)
        ] =
          Number(row.bookings || 0);

      }
    );


    const monthlyRevenue =
      monthlyResult.rows.map((row) => ({

        month:
          String(row.month_name).trim(),

        month_number:
          Number(row.month_number),

        bookings:
          Number(row.bookings || 0),

        revenue:
          Number(row.revenue || 0),

        occupancy:
          monthlyOccupancyMap[
            Number(row.month_number)
          ] || 0,

      }));


    /* ===================================================
       RESPONSE
    =================================================== */

    res.status(200).json({

      success: true,

      statistics: {

        totalRevenue:
          totalRevenue,

        bookings:
          Number(
            stats.total_bookings || 0
          ),

        occupancy,

        customers:
          Number(
            stats.total_customers || 0
          ),

      },

      revenueOverview:
        revenueOverviewWithPercentage,

      roomTypeAnalysis,

      monthlyRevenue,

    });

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "ADMIN REPORTS ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to load reports.",

      error:
        error.message,

    });

  }
};