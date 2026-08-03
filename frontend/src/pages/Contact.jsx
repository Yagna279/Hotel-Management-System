import { useState } from "react";
import "./Contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh

    alert("Your message has been sent successfully!");

    // Clear the form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        {/* Left Side */}
        <div className="contact-left">

          <span className="contact-tag">
            CONTACT US
          </span>

          <h2>Let's Get in Touch</h2>

          <p>
            Have questions about our Hotel Management System?
            Our team is here to help you choose the perfect solution
            for your Hotel Business.
          </p>

          <div className="contact-info">

            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:info@shnoor.com">
                info@shnoor.com
              </a>
            </div>

            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <a href="tel:+919876543210">
                +91 9876543210
              </a>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>
                10009 Mount Tabor Road
                <br />
                Odessa, Missouri, United States
              </span>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="contact-right">

          <form className="contact-form" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              rows="5"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;