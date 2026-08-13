import "./Services.css";

import {
  FaBed,
  FaUsers,
  FaFileInvoiceDollar,
  FaBroom,
  FaUtensils,
  FaChartLine,
} from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaBed />,
      title: "Room Booking",
      description:
        "Manage reservations, room availability and online bookings from one centralized dashboard.",
    },
    {
      icon: <FaUsers />,
      title: "Guest Management",
      description:
        "Store guest information, check-ins, check-outs and booking history securely.",
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Billing & Invoicing",
      description:
        "Generate invoices, manage payments and automate billing with complete accuracy.",
    },
    {
      icon: <FaBroom />,
      title: "Housekeeping",
      description:
        "Assign housekeeping tasks, track room status and improve staff productivity.",
    },
    {
      icon: <FaUtensils />,
      title: "Restaurant Management",
      description:
        "Manage restaurant orders, table bookings and billing seamlessly within the same platform.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Reports",
      description:
        "Monitor revenue, occupancy and hotel performance using real-time dashboards and smart reports.",
    },
  ];

  return (
    <section id="services" className="services">

      {/* =========================
          HEADER
      ========================= */}

      <div className="services-header">

        <span className="services-tag">
          OUR SERVICES
        </span>

        <h2>
          Everything You Need to Manage Your Hotel
        </h2>

        <p>
          Streamline hotel operations with an all-in-one management platform
          designed to improve efficiency, guest satisfaction, and business
          performance.
        </p>

      </div>

      {/* =========================
          SERVICES GRID
      ========================= */}

      <div className="services-grid">

        {services.map((service, index) => (
          <div
            className="service-card"
            key={index}
          >

            <div className="service-icon">
              {service.icon}
            </div>

            <h3>
              {service.title}
            </h3>

            <p>
              {service.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Services;