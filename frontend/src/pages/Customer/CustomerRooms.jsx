import React, { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [roomType, setRoomType] = useState("All");

  const rooms = [
    {
      id: 1,
      roomNumber: "101",
      name: "Deluxe Room",
      type: "Deluxe",
      price: "₹4,500",
      guests: "2 Guests",
      size: "320 sq.ft",
      rating: "4.8",
      description:
        "Comfortable deluxe room with modern interiors and premium amenities.",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
      available: true,
    },

    {
      id: 2,
      roomNumber: "205",
      name: "Premium Room",
      type: "Premium",
      price: "₹6,500",
      guests: "2 Guests",
      size: "420 sq.ft",
      rating: "4.9",
      description:
        "Elegant premium room designed for a relaxing and luxurious stay.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      available: true,
    },

    {
      id: 3,
      roomNumber: "309",
      name: "Suite Room",
      type: "Suite",
      price: "₹9,500",
      guests: "3 Guests",
      size: "650 sq.ft",
      rating: "5.0",
      description:
        "Spacious suite featuring a separate living area and premium facilities.",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      available: true,
    },

    {
      id: 4,
      roomNumber: "402",
      name: "Executive Room",
      type: "Executive",
      price: "₹7,500",
      guests: "2 Guests",
      size: "480 sq.ft",
      rating: "4.8",
      description:
        "Stylish executive room offering comfort, privacy and modern amenities.",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      available: true,
    },

    {
      id: 5,
      roomNumber: "501",
      name: "Family Suite",
      type: "Suite",
      price: "₹11,000",
      guests: "4 Guests",
      size: "780 sq.ft",
      rating: "4.9",
      description:
        "Large family suite with spacious accommodation for a comfortable stay.",
      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
      available: false,
    },

    {
      id: 6,
      roomNumber: "603",
      name: "Luxury Suite",
      type: "Luxury",
      price: "₹14,500",
      guests: "4 Guests",
      size: "900 sq.ft",
      rating: "5.0",
      description:
        "Our premium luxury suite offering an exceptional hotel experience.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
      available: true,
    },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomNumber.includes(searchTerm);

    const matchesType =
      roomType === "All" || room.type === roomType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="customer-rooms-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CustomerSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="customer-rooms-main">

        {/* TOPBAR */}

        <CustomerTopbar />


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="customer-rooms-content">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="customer-rooms-header">

            <div>
              <h1>Rooms</h1>

              <p>
                Explore our comfortable rooms and find the perfect
                stay for you.
              </p>
            </div>

          </div>


          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="customer-rooms-toolbar">

            <div className="customer-room-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>


            <div className="customer-room-filter">

              <FaFilter />

              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="All">All Rooms</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Premium">Premium</option>
                <option value="Executive">Executive</option>
                <option value="Suite">Suite</option>
                <option value="Luxury">Luxury</option>
              </select>

            </div>

          </div>


          {/* =================================================
              ROOM COUNT
          ================================================= */}

          <div className="customer-room-results">

            <span>
              Showing <strong>{filteredRooms.length}</strong> rooms
            </span>

            <span className="customer-room-availability">
              Available rooms
            </span>

          </div>


          {/* =================================================
              ROOM GRID
          ================================================= */}

          <div className="customer-room-grid">

            {filteredRooms.map((room) => (

              <div
                className="customer-room-card"
                key={room.id}
              >

                {/* ROOM IMAGE */}

                <div className="customer-room-image-wrapper">

                  <img
                    src={room.image}
                    alt={room.name}
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


                {/* ROOM DETAILS */}

                <div className="customer-room-details">

                  <div className="customer-room-title-row">

                    <div>

                      <h2>{room.name}</h2>

                      <span>
                        Room {room.roomNumber}
                      </span>

                    </div>

                    <div className="customer-room-price">

                      <strong>{room.price}</strong>

                      <span>/ night</span>

                    </div>

                  </div>


                  {/* DESCRIPTION */}

                  <p className="customer-room-description">
                    {room.description}
                  </p>


                  {/* ROOM FEATURES */}

                  <div className="customer-room-features">

                    <div>
                      <FaUsers />
                      <span>{room.guests}</span>
                    </div>

                    <div>
                      <FaBed />
                      <span>King Bed</span>
                    </div>

                    <div>
                      <span className="room-size-icon">
                        □
                      </span>
                      <span>{room.size}</span>
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


                  {/* BUTTON */}

                  <button
                    className={`customer-room-book-btn ${
                      !room.available ? "disabled" : ""
                    }`}
                    disabled={!room.available}
                  >

                    {room.available
                      ? "Book This Room"
                      : "Not Available"}

                    {room.available && <FaArrowRight />}

                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              NO RESULTS
          ================================================= */}

          {filteredRooms.length === 0 && (

            <div className="customer-no-rooms">

              <FaBed />

              <h2>No Rooms Found</h2>

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