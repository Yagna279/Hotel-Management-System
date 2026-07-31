import "./Pricing.css";

function Pricing() {
  return (
    <section id="pricing" className="pricing">

      <div className="pricing-header">

        <span className="pricing-tag">
          PRICING PLANS
        </span>

        <h2>Choose the Perfect Plan</h2>

        <p>
          Affordable Pricing plans Designed for Hotels of every size.
          Select the plan that best fits your Business Requirements.
        </p>

      </div>

      <div className="pricing-cards">

        {/* Starter Plan */}

        <div className="price-card">

          <h3>Starter</h3>

          <h1>₹1,499<span>/month</span></h1>

          <ul>
            <li>✔ Up to 20 Rooms</li>
            <li>✔ Room Booking</li>
            <li>✔ Guest Management</li>
            <li>✔ Billing & Invoicing</li>
            <li>✔ Email Support</li>
          </ul>

          <button>Choose Plan</button>

        </div>

        {/* Professional Plan */}

        <div className="price-card featured">

          <div className="popular">
            Most Popular
          </div>

          <h3>Professional</h3>

          <h1>₹3,499<span>/month</span></h1>

          <ul>
            <li>✔ Up to 100 Rooms</li>
            <li>✔ Everything in Starter</li>
            <li>✔ Housekeeping Module</li>
            <li>✔ Restaurant Management</li>
            <li>✔ Smart Reports</li>
            <li>✔ Priority Support</li>
          </ul>

          <button>Choose Plan</button>

        </div>

        {/* Enterprise Plan */}

        <div className="price-card">

          <h3>Enterprise</h3>

          <h1>Custom</h1>

          <ul>
            <li>✔ Unlimited Rooms</li>
            <li>✔ Multi-Property Management</li>
            <li>✔ API Integration</li>
            <li>✔ Dedicated Account Manager</li>
            <li>✔ Custom Features</li>
            <li>✔ 24×7 Premium Support</li>
          </ul>

          <button>Contact Sales</button>

        </div>

      </div>

    </section>
  );
}

export default Pricing;