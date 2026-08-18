import pool from "../config/db.js";


/* =====================================================
   GET ALL SERVICES
   GET /api/admin/services
===================================================== */

export const getAdminServices = async (req, res) => {
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
      ORDER BY id DESC
    `);


    /* ===================================================
       STATISTICS
    =================================================== */

    const statisticsResult = await pool.query(`
      SELECT

        COUNT(*) AS total_services,

        COUNT(
          CASE
            WHEN LOWER(category) = 'food'
            THEN 1
          END
        ) AS food_services,

        COUNT(
          CASE
            WHEN LOWER(category) IN
              ('wellness', 'spa', 'spa & wellness')
            THEN 1
          END
        ) AS wellness_services,

        COUNT(
          CASE
            WHEN LOWER(category) = 'transport'
            THEN 1
          END
        ) AS transport_services

      FROM services
    `);


    const statistics = {
      totalServices: Number(
        statisticsResult.rows[0]?.total_services || 0
      ),

      foodServices: Number(
        statisticsResult.rows[0]?.food_services || 0
      ),

      wellnessServices: Number(
        statisticsResult.rows[0]?.wellness_services || 0
      ),

      transportServices: Number(
        statisticsResult.rows[0]?.transport_services || 0
      ),
    };


    res.status(200).json({

      success: true,

      services: result.rows,

      statistics,

    });

  } catch (error) {

    console.error(
      "GET SERVICES ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "Failed to load services.",

      error: error.message,

    });

  }
};


/* =====================================================
   ADD SERVICE
   POST /api/admin/services
===================================================== */

export const addAdminService = async (req, res) => {

  try {

    const {
      service_name,
      price,
      description,
      category,
      availability,
      status,
    } = req.body;


    /* ===================================================
       VALIDATION
    =================================================== */

    if (!service_name || !service_name.trim()) {

      return res.status(400).json({

        success: false,

        message: "Service name is required.",

      });

    }


    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {

      return res.status(400).json({

        success: false,

        message: "Valid price is required.",

      });

    }


    /* ===================================================
       INSERT SERVICE
    =================================================== */

    const result = await pool.query(
      `
      INSERT INTO services
      (
        service_name,
        price,
        description,
        category,
        availability,
        status
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )

      RETURNING *
      `,
      [
        service_name.trim(),
        Number(price),
        description || "",
        category || "Other",
        availability || "Available",
        status || "Active",
      ]
    );


    res.status(201).json({

      success: true,

      message: "Service added successfully.",

      service: result.rows[0],

    });

  } catch (error) {

    console.error(
      "ADD SERVICE ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "Failed to add service.",

      error: error.message,

    });

  }
};


/* =====================================================
   UPDATE SERVICE
   PUT /api/admin/services/:id
===================================================== */

export const updateAdminService = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      service_name,
      price,
      description,
      category,
      availability,
      status,
    } = req.body;


    /* ===================================================
       VALIDATION
    =================================================== */

    if (!service_name || !service_name.trim()) {

      return res.status(400).json({

        success: false,

        message: "Service name is required.",

      });

    }


    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {

      return res.status(400).json({

        success: false,

        message: "Valid price is required.",

      });

    }


    /* ===================================================
       UPDATE
    =================================================== */

    const result = await pool.query(
      `
      UPDATE services

      SET
        service_name = $1,
        price = $2,
        description = $3,
        category = $4,
        availability = $5,
        status = $6

      WHERE id = $7

      RETURNING *
      `,
      [
        service_name.trim(),
        Number(price),
        description || "",
        category || "Other",
        availability || "Available",
        status || "Active",
        id,
      ]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Service not found.",

      });

    }


    res.status(200).json({

      success: true,

      message: "Service updated successfully.",

      service: result.rows[0],

    });

  } catch (error) {

    console.error(
      "UPDATE SERVICE ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "Failed to update service.",

      error: error.message,

    });

  }
};


/* =====================================================
   DELETE SERVICE
   DELETE /api/admin/services/:id
===================================================== */

export const deleteAdminService = async (req, res) => {

  try {

    const { id } = req.params;


    const result = await pool.query(
      `
      DELETE FROM services

      WHERE id = $1

      RETURNING *
      `,
      [id]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Service not found.",

      });

    }


    res.status(200).json({

      success: true,

      message: "Service deleted successfully.",

    });

  } catch (error) {

    console.error(
      "DELETE SERVICE ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: "Failed to delete service.",

      error: error.message,

    });

  }
};