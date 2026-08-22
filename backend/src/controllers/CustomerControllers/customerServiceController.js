import pool from "../../config/db.js";

/* =====================================================
   GET ALL ACTIVE CUSTOMER SERVICES

   GET /api/customer-services
===================================================== */

export const getCustomerServices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        service_name,
        price,
        description,
        category,
        availability,
        status
      FROM services
      WHERE LOWER(TRIM(status)) = 'active'
      ORDER BY category ASC, service_name ASC
    `);

    const services = result.rows.map((service) => ({
      id: service.id,
      service_name: service.service_name,
      price: Number(service.price) || 0,
      description: service.description || "",
      category: service.category || "",
      availability: service.availability || "",
      status: service.status || "",
    }));

    return res.status(200).json({
      success: true,
      message: "Customer services loaded successfully.",
      services,
    });
  } catch (error) {
    console.error("Get customer services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load customer services.",
      error: error.message,
    });
  }
};

/* =====================================================
   REQUEST CUSTOMER SERVICE

   POST /api/customer-services/request
===================================================== */

export const requestCustomerService = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      customerId,
      bookingId,
      serviceId,
      quantity,
    } = req.body;

    /* =================================================
       VALIDATION
    ================================================= */

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }

    const requestedQuantity = Number(quantity || 1);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number.",
      });
    }

    if (requestedQuantity > 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum quantity allowed is 20.",
      });
    }

    /* =================================================
       START TRANSACTION
    ================================================= */

    await client.query("BEGIN");

    /* =================================================
       CHECK CUSTOMER
    ================================================= */

    const customerResult = await client.query(
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
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    /* =================================================
       CHECK BOOKING

       IMPORTANT:
       Lock only the bookings table row.

       DO NOT use:
       FOR UPDATE

       because rooms is on the nullable side
       of the LEFT JOIN.

       Correct:
       FOR UPDATE OF b
    ================================================= */

    const bookingResult = await client.query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.booking_status,
        b.payment_status,

        r.room_number,
        r.room_type

      FROM bookings b

      LEFT JOIN rooms r
        ON r.id = b.room_id

      WHERE b.id = $1
        AND b.customer_id = $2

      FOR UPDATE OF b
      `,
      [bookingId, customerId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Booking not found for this customer.",
      });
    }

    const booking = bookingResult.rows[0];

    /* =================================================
       CHECK BOOKING STATUS
    ================================================= */

    const bookingStatus = String(
      booking.booking_status || ""
    )
      .trim()
      .toLowerCase();

    if (bookingStatus !== "checked_in") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "Services can only be requested for an active checked-in booking.",
      });
    }

    /* =================================================
       CHECK SERVICE
    ================================================= */

    const serviceResult = await client.query(
      `
      SELECT
        id,
        service_name,
        price,
        description,
        category,
        availability,
        status
      FROM services
      WHERE id = $1
      `,
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const service = serviceResult.rows[0];

    /* =================================================
       CHECK SERVICE STATUS
    ================================================= */

    const serviceStatus = String(
      service.status || ""
    )
      .trim()
      .toLowerCase();

    if (serviceStatus !== "active") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "This service is currently unavailable.",
      });
    }

    /* =================================================
       CHECK SERVICE PRICE
    ================================================= */

    const servicePrice = Number(service.price);

    if (!Number.isFinite(servicePrice) || servicePrice < 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Invalid service price.",
      });
    }

    /* =================================================
       CHECK EXISTING SERVICE REQUEST

       Lock only booking_services row.
    ================================================= */

    const existingServiceResult = await client.query(
      `
      SELECT
        id,
        quantity,
        requested_at
      FROM booking_services
      WHERE booking_id = $1
        AND service_id = $2
      ORDER BY id DESC
      LIMIT 1
      FOR UPDATE
      `,
      [bookingId, serviceId]
    );

    /* =================================================
       EXISTING SERVICE
    ================================================= */

    if (existingServiceResult.rows.length > 0) {
      const existing = existingServiceResult.rows[0];

      const oldQuantity = Number(existing.quantity) || 0;

      const newQuantity =
        oldQuantity + requestedQuantity;

      if (newQuantity > 20) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message:
            "Maximum total quantity for this service is 20.",
        });
      }

      const updatedResult = await client.query(
        `
        UPDATE booking_services
        SET
          quantity = $1,
          requested_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [newQuantity, existing.id]
      );

      await client.query("COMMIT");

      const updatedService =
        updatedResult.rows[0];

      const totalAmount =
        servicePrice * newQuantity;

      return res.status(200).json({
        success: true,
        message:
          "Service request updated successfully.",

        booking: {
          id: booking.id,
          customer_id: booking.customer_id,
          room_id: booking.room_id,
          room_number: booking.room_number,
          room_type: booking.room_type,
          check_in: booking.check_in,
          check_out: booking.check_out,
          booking_status: booking.booking_status,
          payment_status: booking.payment_status,
        },

        service: {
          booking_service_id:
            updatedService.id,

          service_id:
            service.id,

          service_name:
            service.service_name,

          price:
            servicePrice,

          quantity:
            newQuantity,

          amount:
            totalAmount,

          requested_at:
            updatedService.requested_at,
        },
      });
    }

    /* =================================================
       INSERT NEW SERVICE REQUEST
    ================================================= */

    const insertResult = await client.query(
      `
      INSERT INTO booking_services (
        booking_id,
        service_id,
        quantity,
        requested_at
      )
      VALUES (
        $1,
        $2,
        $3,
        CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      [
        bookingId,
        serviceId,
        requestedQuantity,
      ]
    );

    const bookingService =
      insertResult.rows[0];

    /* =================================================
       CALCULATE AMOUNT
    ================================================= */

    const serviceAmount =
      servicePrice * requestedQuantity;

    /* =================================================
       COMMIT
    ================================================= */

    await client.query("COMMIT");

    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(201).json({
      success: true,
      message: "Service requested successfully.",

      booking: {
        id: booking.id,
        customer_id: booking.customer_id,
        room_id: booking.room_id,
        room_number: booking.room_number,
        room_type: booking.room_type,
        check_in: booking.check_in,
        check_out: booking.check_out,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
      },

      service: {
        booking_service_id:
          bookingService.id,

        service_id:
          service.id,

        service_name:
          service.service_name,

        price:
          servicePrice,

        quantity:
          requestedQuantity,

        amount:
          serviceAmount,

        requested_at:
          bookingService.requested_at,
      },
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error(
      "Request customer service error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to request service.",
      error: error.message,
      code: error.code,
    });
  } finally {
    client.release();
  }
};

/* =====================================================
   GET ACTIVE BOOKINGS FOR SERVICE REQUEST

   GET /api/customer-services/:customerId/bookings

   Only CHECKED-IN bookings are returned.
===================================================== */

export const getCustomerActiveBookings = async (
  req,
  res
) => {
  try {
    const { customerId } = req.params;

    /* =================================================
       VALIDATION
    ================================================= */

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    /* =================================================
       CHECK CUSTOMER
    ================================================= */

    const customerResult = await pool.query(
      `
      SELECT id
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

    /* =================================================
       GET CHECKED-IN BOOKINGS
    ================================================= */

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.booking_status,
        b.payment_status,

        r.room_number,
        r.room_type

      FROM bookings b

      LEFT JOIN rooms r
        ON r.id = b.room_id

      WHERE b.customer_id = $1
        AND LOWER(TRIM(b.booking_status)) = 'checked_in'

      ORDER BY
        b.check_in DESC,
        b.id DESC
      `,
      [customerId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Active bookings loaded successfully.",
      bookings: result.rows,
    });
  } catch (error) {
    console.error(
      "Get customer active bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load active bookings.",
      error: error.message,
    });
  }
};

/* =====================================================
   GET REQUESTED SERVICES FOR A BOOKING

   GET /api/customer-services/booking/:customerId/:bookingId

   Used by Booking Details page.
===================================================== */

export const getCustomerBookingServices = async (
  req,
  res
) => {
  try {
    const {
      customerId,
      bookingId,
    } = req.params;

    /* =================================================
       VALIDATION
    ================================================= */

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    /* =================================================
       CHECK BOOKING BELONGS TO CUSTOMER
    ================================================= */

    const bookingResult = await pool.query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.booking_status,
        b.payment_status,

        r.room_number,
        r.room_type

      FROM bookings b

      LEFT JOIN rooms r
        ON r.id = b.room_id

      WHERE b.id = $1
        AND b.customer_id = $2

      LIMIT 1
      `,
      [bookingId, customerId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found for this customer.",
      });
    }

    /* =================================================
       GET REQUESTED SERVICES
    ================================================= */

    const servicesResult = await pool.query(
      `
      SELECT
        bs.id AS booking_service_id,
        bs.booking_id,
        bs.service_id,
        bs.quantity,
        bs.requested_at,

        s.service_name,
        s.price,
        s.description,
        s.category,
        s.availability,
        s.status

      FROM booking_services bs

      LEFT JOIN services s
        ON s.id = bs.service_id

      WHERE bs.booking_id = $1

      ORDER BY
        bs.requested_at DESC,
        bs.id DESC
      `,
      [bookingId]
    );

    /* =================================================
       FORMAT SERVICES
    ================================================= */

    const services = servicesResult.rows.map(
      (service) => {
        const price =
          Number(service.price) || 0;

        const serviceQuantity =
          Number(service.quantity) || 1;

        const amount =
          price * serviceQuantity;

        return {
          booking_service_id:
            service.booking_service_id,

          booking_id:
            service.booking_id,

          service_id:
            service.service_id,

          service_name:
            service.service_name,

          description:
            service.description || "",

          category:
            service.category || "",

          availability:
            service.availability || "",

          status:
            service.status || "",

          price,

          quantity:
            serviceQuantity,

          amount,

          requested_at:
            service.requested_at,
        };
      }
    );

    /* =================================================
       TOTAL SERVICE AMOUNT
    ================================================= */

    const totalServiceAmount =
      services.reduce(
        (total, service) =>
          total + Number(service.amount || 0),
        0
      );

    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(200).json({
      success: true,
      message:
        "Booking services loaded successfully.",

      booking:
        bookingResult.rows[0],

      services,

      totalServiceAmount,
    });
  } catch (error) {
    console.error(
      "Get customer booking services error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load booking services.",
      error: error.message,
    });
  }
};