import pool from "../config/db.js";

// =====================================================
// GET ALL ROOMS
// =====================================================

export const getRooms = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        room_number,
        room_type,
        price_per_night,
        status
      FROM rooms
      ORDER BY room_number ASC
    `);

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(
      "ERROR FETCHING ROOMS:",
      error
    );

    res.status(500).json({
      message: error.message,
    });

  }
};


// =====================================================
// ADD ROOM
// =====================================================

export const createRoom = async (req, res) => {

  try {

    const {
      room_number,
      room_type,
      price_per_night,
      status,
    } = req.body;


    console.log(
      "RECEIVED ROOM DATA:",
      req.body
    );


    // =====================================================
    // VALIDATE DATA
    // =====================================================

    if (
      !room_number ||
      !room_type ||
      !price_per_night ||
      !status
    ) {

      return res.status(400).json({
        message:
          "All room details are required",
      });

    }


    // =====================================================
    // CHECK DUPLICATE ROOM NUMBER
    // =====================================================

    const existingRoom =
      await pool.query(
        `
        SELECT id
        FROM rooms
        WHERE room_number = $1
        `,
        [room_number]
      );


    if (existingRoom.rows.length > 0) {

      return res.status(409).json({
        message:
          "Room number already exists",
      });

    }


    // =====================================================
    // INSERT ROOM
    // =====================================================

    const result =
      await pool.query(
        `
        INSERT INTO rooms
        (
          room_number,
          room_type,
          price_per_night,
          status
        )
        VALUES
        ($1, $2, $3, $4)
        RETURNING
          id,
          room_number,
          room_type,
          price_per_night,
          status
        `,
        [
          room_number,
          room_type,
          price_per_night,
          status,
        ]
      );


    console.log(
      "ROOM ADDED:",
      result.rows[0]
    );


    res.status(201).json({

      message:
        "Room added successfully",

      room:
        result.rows[0],

    });


  } catch (error) {

    console.error(
      "ERROR ADDING ROOM:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// UPDATE ROOM
// =====================================================

export const updateRoom = async (req, res) => {

  try {

    const { id } = req.params;


    const {
      room_number,
      room_type,
      price_per_night,
      status,
    } = req.body;


    // =====================================================
    // VALIDATE
    // =====================================================

    if (
      !room_number ||
      !room_type ||
      !price_per_night ||
      !status
    ) {

      return res.status(400).json({

        message:
          "All room details are required",

      });

    }


    // =====================================================
    // CHECK DUPLICATE ROOM NUMBER
    // EXCLUDING CURRENT ROOM
    // =====================================================

    const existingRoom =
      await pool.query(
        `
        SELECT id
        FROM rooms
        WHERE room_number = $1
        AND id != $2
        `,
        [
          room_number,
          id,
        ]
      );


    if (existingRoom.rows.length > 0) {

      return res.status(409).json({

        message:
          "Room number already exists",

      });

    }


    // =====================================================
    // UPDATE ROOM
    // =====================================================

    const result =
      await pool.query(
        `
        UPDATE rooms
        SET
          room_number = $1,
          room_type = $2,
          price_per_night = $3,
          status = $4
        WHERE id = $5
        RETURNING
          id,
          room_number,
          room_type,
          price_per_night,
          status
        `,
        [
          room_number,
          room_type,
          price_per_night,
          status,
          id,
        ]
      );


    if (result.rows.length === 0) {

      return res.status(404).json({

        message:
          "Room not found",

      });

    }


    console.log(
      "ROOM UPDATED:",
      result.rows[0]
    );


    res.status(200).json({

      message:
        "Room updated successfully",

      room:
        result.rows[0],

    });


  } catch (error) {

    console.error(
      "ERROR UPDATING ROOM:",
      error
    );


    res.status(500).json({

      message:
        error.message,

    });

  }

};


// =====================================================
// DELETE ROOM
// =====================================================

export const deleteRoom = async (req, res) => {

  try {

    const { id } = req.params;


    // =====================================================
    // CHECK ROOM ID
    // =====================================================

    if (!id) {

      return res.status(400).json({

        message:
          "Room ID is required",

      });

    }


    // =====================================================
    // CHECK WHETHER ROOM EXISTS
    // =====================================================

    const existingRoom =
      await pool.query(
        `
        SELECT
          id,
          room_number,
          room_type
        FROM rooms
        WHERE id = $1
        `,
        [id]
      );


    if (existingRoom.rows.length === 0) {

      return res.status(404).json({

        message:
          "Room not found",

      });

    }


    // =====================================================
    // DELETE ROOM
    // =====================================================

    const result =
      await pool.query(
        `
        DELETE FROM rooms
        WHERE id = $1
        RETURNING
          id,
          room_number,
          room_type
        `,
        [id]
      );


    console.log(
      "ROOM DELETED:",
      result.rows[0]
    );


    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    res.status(200).json({

      message:
        "Room deleted successfully",

      room:
        result.rows[0],

    });


  } catch (error) {

    console.error(
      "ERROR DELETING ROOM:",
      error
    );


    // =====================================================
    // FOREIGN KEY ERROR
    // =====================================================

    if (
      error.code === "23503"
    ) {

      return res.status(409).json({

        message:
          "This room cannot be deleted because it is linked to existing bookings. Please handle the related booking first.",

      });

    }


    // =====================================================
    // GENERAL ERROR
    // =====================================================

    res.status(500).json({

      message:
        "Failed to delete room",

      error:
        error.message,

    });

  }

};