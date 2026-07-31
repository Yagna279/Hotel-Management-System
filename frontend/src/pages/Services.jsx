import "./Services.css";

import {
  FaBed,
  FaUsers,
  FaFileInvoiceDollar,
  FaBroom,
  FaUtensils,
  FaChartLine
} from "react-icons/fa";

function Services() {
  return (
    <section id="services" className="services">

      <div className="services-header">

        <span className="services-tag">
          OUR SERVICES
        </span>

        <h2>Everything You Need to Manage Your Hotel</h2>

        <p>
          Streamline Hotel operations with an all-in-one Management platform
          Designed to Improve efficiency, Guest satisfaction, and Business
          performance.
        </p>

      </div>

      <div className="services-grid">

        <div className="service-card">

          <div className="service-icon">
            <FaBed />
          </div>

          <h3>Room Booking</h3>

          <p>
            Manage reservations, Room availability and online Bookings
            from one Centralized dashboard.
          </p>

        </div>

        <div className="service-card">

          <div className="service-icon">
            <FaUsers />
          </div>

          <h3>Guest Management</h3>

          <p>
            Store guest information, Check-ins, Check-outs and Booking
            history securely.
          </p>

        </div>

        <div className="service-card">

          <div className="service-icon">
            <FaFileInvoiceDollar />
          </div>

          <h3>Billing & Invoicing</h3>

          <p>
            Generate invoices, Manage payments and Automate billing
            with complete accuracy.
          </p>

        </div>

        <div className="service-card">

          <div className="service-icon">
            <FaBroom />
          </div>

          <h3>Housekeeping</h3>

          <p>
            Assign Housekeeping tasks, Track room status and Improve
            staff productivity.
          </p>

        </div>

        <div className="service-card">

          <div className="service-icon">
            <FaUtensils />
          </div>

          <h3>Restaurant Management</h3>

          <p>
            Manage restaurant orders, Table bookings and Billing
            seamlessly within the same platform.
          </p>

        </div>

        <div className="service-card">

          <div className="service-icon">
            <FaChartLine />
          </div>

          <h3>Analytics & Reports</h3>

          <p>
            Monitor revenue, occupancy and Hotel performance using
            Real-time Dashboards and Smart reports.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Services;