import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import "./App.css";

function App() {
  return (
    <>

      <Navbar />

      <Hero />

      <section className="section">
        <h2>About</h2>
        <p>
          Our Hotel Management System helps hotels automate bookings,
          room management, billing and customer records.
        </p>
      </section>

      <section className="section">
        <h2>Services</h2>

        <div className="cards">
          <div className="card">Room Booking</div>
          <div className="card">Restaurant</div>
          <div className="card">Billing</div>
          <div className="card">Reports</div>
        </div>

      </section>

      <section className="section">
        <h2>Pricing</h2>

        <div className="cards">

          <div className="card">
            <h3>Basic</h3>
            <h1>₹999</h1>
            <p>per month</p>
          </div>

          <div className="card">
            <h3>Premium</h3>
            <h1>₹1999</h1>
            <p>per month</p>
          </div>

        </div>

      </section>

      <section className="section">
        <h2>Contact Us</h2>
        <p>Email : info@shnoor.com</p>
        <p>Phone : +91 9876543210</p>
      </section>

    </>
  );
}

export default App;