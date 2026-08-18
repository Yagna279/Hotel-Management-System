import pool from "../../config/db.js";

// =====================================================
// GET ALL ROOMS FOR CUSTOMER
// =====================================================

export const getCustomerRooms = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        room_number,
        room_type,
        price_per_night,
        status,
        created_at
      FROM rooms
      ORDER BY room_number ASC
      `
    );

    res.status(200).json({
      success: true,
      rooms: result.rows,
    });

  } catch (error) {
    console.error(
      "Customer rooms error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load rooms.",
    });
  }
};