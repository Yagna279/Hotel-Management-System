import pool from "../config/db.js";

/* =====================================================
   GET SETTINGS
===================================================== */

export const getSettings = async (req, res) => {
  try {
    /* ---------------------------------------------
       Get hotel settings
    --------------------------------------------- */

    const hotelResult = await pool.query(`
      SELECT
        id,
        hotel_name,
        phone,
        address,
        currency,
        timezone,
        email_notifications
      FROM hotel_settings
      ORDER BY id
      LIMIT 1
    `);

    /* ---------------------------------------------
       Get admin user
       We are using the first ADMIN user
    --------------------------------------------- */

    const adminResult = await pool.query(`
      SELECT
        id,
        full_name,
        email
      FROM users
      WHERE UPPER(role) = 'ADMIN'
      ORDER BY id
      LIMIT 1
    `);

    const hotelSettings =
      hotelResult.rows.length > 0
        ? hotelResult.rows[0]
        : null;

    const admin =
      adminResult.rows.length > 0
        ? adminResult.rows[0]
        : null;

    res.status(200).json({
      success: true,

      hotelSettings,

      admin,
    });

  } catch (error) {

    console.error(
      "Get settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load settings.",
      error: error.message,
    });

  }
};


/* =====================================================
   UPDATE SETTINGS
===================================================== */

export const updateSettings = async (req, res) => {

  const client = await pool.connect();

  try {

    const {
      hotelName,
      adminName,
      email,
      phone,
      address,
      currency,
      timezone,
      emailNotifications,
    } = req.body;


    /* ---------------------------------------------
       Validation
    --------------------------------------------- */

    if (!hotelName || !adminName || !email) {

      return res.status(400).json({

        success: false,

        message:
          "Hotel name, admin name and email are required.",

      });

    }


    /* ---------------------------------------------
       Start transaction
    --------------------------------------------- */

    await client.query("BEGIN");


    /* ---------------------------------------------
       Get ADMIN user
    --------------------------------------------- */

    const adminResult = await client.query(`
      SELECT id
      FROM users
      WHERE UPPER(role) = 'ADMIN'
      ORDER BY id
      LIMIT 1
    `);


    if (adminResult.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({

        success: false,

        message:
          "Admin user not found in users table.",

      });

    }


    const adminId =
      adminResult.rows[0].id;


    /* ---------------------------------------------
       Update ADMIN name and email
    --------------------------------------------- */

    await client.query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2
      WHERE id = $3
      `,
      [
        adminName,
        email,
        adminId,
      ]
    );


    /* ---------------------------------------------
       Check hotel_settings
    --------------------------------------------- */

    const settingsResult = await client.query(`
      SELECT id
      FROM hotel_settings
      ORDER BY id
      LIMIT 1
    `);


    /* ---------------------------------------------
       Update existing hotel settings
    --------------------------------------------- */

    if (settingsResult.rows.length > 0) {

      const settingsId =
        settingsResult.rows[0].id;


      await client.query(
        `
        UPDATE hotel_settings
        SET
          hotel_name = $1,
          phone = $2,
          address = $3,
          currency = $4,
          timezone = $5,
          email_notifications = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        `,
        [
          hotelName,
          phone || "",
          address || "",
          currency || "INR",
          timezone || "Asia/Kolkata",
          emailNotifications ?? true,
          settingsId,
        ]
      );

    }

    /* ---------------------------------------------
       Create hotel settings if none exists
    --------------------------------------------- */

    else {

      await client.query(
        `
        INSERT INTO hotel_settings
        (
          hotel_name,
          phone,
          address,
          currency,
          timezone,
          email_notifications,
          updated_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          CURRENT_TIMESTAMP
        )
        `,
        [
          hotelName,
          phone || "",
          address || "",
          currency || "INR",
          timezone || "Asia/Kolkata",
          emailNotifications ?? true,
        ]
      );

    }


    /* ---------------------------------------------
       Commit transaction
    --------------------------------------------- */

    await client.query("COMMIT");


    /* ---------------------------------------------
       Return updated data
    --------------------------------------------- */

    res.status(200).json({

      success: true,

      message:
        "Settings updated successfully.",

    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Update settings error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to update settings.",

      error:
        error.message,

    });

  } finally {

    client.release();

  }

};