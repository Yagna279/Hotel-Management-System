import "./BookDemo.css";

function BookDemo() {
  return (
    <section id="demo" className="demo">

      <div className="demo-container">

        <span className="demo-tag">
          BOOK A DEMO
        </span>

        <h2>Schedule Your Free Demo</h2>

        <p>
          Discover how the SHNOOR Hotel Management System can simplify your
          Hotel operations. Fill out the form below and our Team will contact
          you to schedule a Personalized Demonstration.
        </p>

        <form className="demo-form">

          <div className="input-row">
            <input
              type="text"
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="input-row">
            <input
              type="tel"
              placeholder="Phone Number"
              required
            />

            <input
              type="text"
              placeholder="Hotel Name"
              required
            />
          </div>

          <textarea
            rows="5"
            placeholder="Tell us about your Hotel or Requirements..."
          ></textarea>

          <button type="submit">
            Book Free Demo
          </button>

        </form>

      </div>

    </section>
  );
}

export default BookDemo;