import "./About.css";

function About() {
  return (
    <section id="about" className="about">

      {/* Left Side */}
      <div className="about-left">

        <span className="about-tag">
          ABOUT SHNOOR HMS
        </span>

        <h2>
          Smart Hotel Management <br />
          Made Simple
        </h2>

        <p>
          SHNOOR Hotel Management System is an all-in-one platform
          designed to simplify Hotel operations.
        </p>

      </div>

      {/* Right Side */}
      <div className="about-right">

        <div className="feature-card">
          <h3>All-in-One Dashboard</h3>

          <p>
            One place to manage Bookings, Guests and Daily Hotel
            operations with ease.
          </p>
        </div>

        <div className="feature-card">
          <h3>Real-Time Sync</h3>

          <p>
            Rooms, Availability and Booking information stay updated
            instantly across all operations.
          </p>
        </div>

        <div className="feature-card">
          <h3>Direct Bookings</h3>

          <p>
            Accept commission-free Reservations directly through
            your Hotel website.
          </p>
        </div>

        <div className="feature-card">
          <h3>Smart Reports</h3>

          <p>
            View occupancy, revenue and performance reports
            whenever you need them.
          </p>
        </div>

      </div>

    </section>
  );
}

export default About;