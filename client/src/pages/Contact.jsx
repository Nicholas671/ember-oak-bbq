import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <p className="overline">Get in Touch</p>
        <h2>Contact Us</h2>
        <div className="divider" />
        <p>
          Have a question, want to book a private event, or just want to say
          hello? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit}>
            {status === "success" && (
              <div className="success-message">
                Thank you! Your message has been sent. We'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="error-message">
                Something went wrong. Please try again or call us directly.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select a topic...</option>
                <option value="Reservation">Reservation</option>
                <option value="Private Event">Private Event</option>
                <option value="Catering">Catering Inquiry</option>
                <option value="Feedback">Feedback</option>
                <option value="General">General Question</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending}
              style={{ width: "100%" }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-info-card">
          <h3>Visit Us</h3>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h4>Address</h4>
              <p>127 Smokehouse Lane<br />Asheville, NC 28801</p>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <h4>Phone</h4>
              <p>(828) 555-0142</p>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h4>Email</h4>
              <p>info@emberandoak.com</p>
            </div>
          </div>

          <div className="contact-hours">
            <h4>Hours of Operation</h4>
            <div className="hours-row">
              <span>Monday</span>
              <span>Closed</span>
            </div>
            <div className="hours-row">
              <span>Tuesday – Thursday</span>
              <span>4:00 PM – 10:00 PM</span>
            </div>
            <div className="hours-row">
              <span>Friday – Saturday</span>
              <span>4:00 PM – 11:00 PM</span>
            </div>
            <div className="hours-row">
              <span>Sunday</span>
              <span>11:00 AM – 9:00 PM</span>
            </div>
            <div className="hours-row" style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(139,125,107,0.2)" }}>
              <span>Happy Hour</span>
              <span style={{ color: "var(--amber)" }}>Tue–Fri, 4–6 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
