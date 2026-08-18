import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";

import {
  FaBed,
  FaUsers,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaBath,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

import "./CustomerRooms.css";

function CustomerRooms() {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate =
    useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [rooms, setRooms] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [roomType, setRoomType] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // ROOM TYPE DETAILS
  // =====================================================

  const roomDetails = {

    "Deluxe Room": {

      type: "Deluxe",

      guests: "2 Guests",

      size: "320 sq.ft",

      rating: "4.8",

      description:
        "Comfortable deluxe room with modern interiors and premium amenities.",

      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",

    },

    "Premium Room": {

      type: "Premium",

      guests: "2 Guests",

      size: "420 sq.ft",

      rating: "4.9",

      description:
        "Elegant premium room designed for a relaxing and luxurious stay.",

      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",

    },

    "Suite Room": {

      type: "Suite",

      guests: "3 Guests",

      size: "650 sq.ft",

      rating: "5.0",

      description:
        "Spacious suite featuring a separate living area and premium facilities.",

      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",

    },

    "Executive Room": {

      type: "Executive",

      guests: "2 Guests",

      size: "480 sq.ft",

      rating: "4.8",

      description:
        "Stylish executive room offering comfort, privacy and modern amenities.",

      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",

    },

    "Family Suite": {

      type: "Suite",

      guests: "4 Guests",

      size: "780 sq.ft",

      rating: "4.9",

      description:
        "Large family suite with spacious accommodation for a comfortable stay.",

      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",

    },

    "Luxury Suite": {

      type: "Luxury",

      guests: "4 Guests",

      size: "900 sq.ft",

      rating: "5.0",

      description:
        "Our premium luxury suite offering an exceptional hotel experience.",

      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",

    },

  };

  // =====================================================
  // FETCH ROOMS FROM DATABASE
  // =====================================================

  useEffect(() => {

    const fetchRooms =
      async () => {

        try {

          setLoading(true);

          setError("");

          const response =
            await fetch(
              "http://localhost:5000/api/customer-rooms"
            );

          const data =
            await response.json();

          console.log(
            "Customer rooms:",
            data
          );

          if (!response.ok) {

            throw new Error(
              data.message ||
              "Failed to load rooms."
            );

          }

          setRooms(
            data.rooms || []
          );

        } catch (error) {

          console.error(
            "Customer rooms error:",
            error
          );

          setError(
            error.message ||
            "Unable to load rooms."
          );

        } finally {

          setLoading(false);

        }

      };

    fetchRooms();

  }, []);

  // =====================================================
  // PREPARE ROOM DATA
  // =====================================================

  const displayRooms =
    rooms.map(
      (room) => {

        const details =
          roomDetails[
            room.room_type
          ] || {

            type:
              room.room_type,

            guests:
              "Guests",

            size:
              "Standard Size",

            rating:
              "4.8",

            description:
              `Comfortable ${room.room_type} with modern facilities and premium amenities.`,

            image:
              "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",

          };

        return {

          ...room,

          ...details,

          price:
            `₹${Number(
              room.price_per_night
            ).toLocaleString(
              "en-IN"
            )}`,

          available:
            String(
              room.status || ""
            ).toLowerCase() ===
            "available",

        };

      }
    );

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRooms =
    displayRooms.filter(
      (room) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          room.room_type
            .toLowerCase()
            .includes(search) ||

          String(
            room.room_number
          )
            .toLowerCase()
            .includes(search);

        const matchesType =
          roomType === "All" ||
          room.type === roomType;

        return (
          matchesSearch &&
          matchesType
        );

      }
    );

  // =====================================================
  // BOOK ROOM
  // =====================================================

  const handleBookRoom =
    (room) => {

      if (!room.available) {
        return;
      }

      navigate(
        `/customer/book-room/${room.id}`
      );

    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="customer-rooms-page">

        <CustomerSidebar />

        <div className="customer-rooms-main">

          <CustomerTopbar />

          <main className="customer-rooms-content">

            <div className="customer-message">

              Loading rooms...

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="customer-rooms-page">

        <CustomerSidebar />

        <div className="customer-rooms-main">

          <CustomerTopbar />

          <main className="customer-rooms-content">

            <div className="customer-message error">

              {error}

            </div>

          </main>

        </div>

      </div>

    );

  }

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="customer-rooms-page">

      {/* SIDEBAR */}

      <CustomerSidebar />

      {/* MAIN */}

      <div className="customer-rooms-main">

        <CustomerTopbar />

        <main className="customer-rooms-content">

          {/* HEADER */}

          <div className="customer-rooms-header">

            <div>

              <h1>
                Rooms
              </h1>

              <p>
                Explore our comfortable rooms and find the perfect
                stay for you.
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="customer-rooms-toolbar">

            <div className="customer-room-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="customer-room-filter">

              <FaFilter />

              <select
                value={roomType}
                onChange={(e) =>
                  setRoomType(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Rooms
                </option>

                <option value="Deluxe">
                  Deluxe
                </option>

                <option value="Premium">
                  Premium
                </option>

                <option value="Executive">
                  Executive
                </option>

                <option value="Suite">
                  Suite
                </option>

                <option value="Luxury">
                  Luxury
                </option>

              </select>

            </div>

          </div>

          {/* RESULT COUNT */}

          <div className="customer-room-results">

            <span>

              Showing{" "}

              <strong>
                {filteredRooms.length}
              </strong>{" "}

              rooms

            </span>

            <span className="customer-room-availability">

              Available rooms

            </span>

          </div>

          {/* ROOM GRID */}

          <div className="customer-room-grid">

            {filteredRooms.map(
              (room) => (

                <div
                  className="customer-room-card"
                  key={room.id}
                >

                  {/* IMAGE */}

                  <div className="customer-room-image-wrapper">

                    <img
                      src={room.image}
                      alt={room.room_type}
                      className="customer-room-image"
                    />

                    <div
                      className={`customer-room-availability-badge ${
                        room.available
                          ? "available"
                          : "occupied"
                      }`}
                    >

                      {room.available
                        ? "Available"
                        : "Currently Occupied"}

                    </div>

                    <div className="customer-room-rating">

                      <FaStar />

                      {room.rating}

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="customer-room-details">

                    <div className="customer-room-title-row">

                      <div>

                        <h2>
                          {room.room_type}
                        </h2>

                        <span>
                          Room {room.room_number}
                        </span>

                      </div>

                      <div className="customer-room-price">

                        <strong>
                          {room.price}
                        </strong>

                        <span>
                          / night
                        </span>

                      </div>

                    </div>

                    <p className="customer-room-description">

                      {room.description}

                    </p>

                    {/* FEATURES */}

                    <div className="customer-room-features">

                      <div>

                        <FaUsers />

                        <span>
                          {room.guests}
                        </span>

                      </div>

                      <div>

                        <FaBed />

                        <span>
                          King Bed
                        </span>

                      </div>

                      <div>

                        <span className="room-size-icon">
                          □
                        </span>

                        <span>
                          {room.size}
                        </span>

                      </div>

                    </div>

                    {/* AMENITIES */}

                    <div className="customer-room-amenities">

                      <span>
                        <FaWifi />
                      </span>

                      <span>
                        <FaTv />
                      </span>

                      <span>
                        <FaSnowflake />
                      </span>

                      <span>
                        <FaBath />
                      </span>

                      <small>
                        Premium Amenities
                      </small>

                    </div>

                    {/* BOOK */}

                    <button
                      className={`customer-room-book-btn ${
                        !room.available
                          ? "disabled"
                          : ""
                      }`}
                      disabled={
                        !room.available
                      }
                      onClick={() =>
                        handleBookRoom(
                          room
                        )
                      }
                    >

                      {room.available
                        ? "Book This Room"
                        : "Not Available"}

                      {room.available && (
                        <FaArrowRight />
                      )}

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

          {/* NO ROOMS */}

          {filteredRooms.length === 0 && (

            <div className="customer-no-rooms">

              <FaBed />

              <h2>
                No Rooms Found
              </h2>

              <p>
                Try changing your search or room type filter.
              </p>

            </div>

          )}

        </main>

      </div>

    </div>

  );
}

export default CustomerRooms;