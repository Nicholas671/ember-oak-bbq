function About() {
  return (
    <>
      <section className="page-section">
        <div className="page-header">
          <p className="overline">Our Story</p>
          <h2>About Ember & Oak</h2>
          <div className="divider" />
          <p>
            Born from a love of fire, smoke, and the art of bringing people together
            around great food.
          </p>
        </div>

        {/* Main about section */}
        <div className="about-content">
          <div className="about-text">
            <h3>From Backyard to Table</h3>
            <p>
              Ember & Oak started with a simple belief: barbecue deserves to be
              celebrated, not just consumed. Our founder spent years perfecting
              the craft — traveling pit to pit across the Carolinas, Texas, and
              Kansas City — before bringing that knowledge home to Asheville.
            </p>
            <p>
              We opened our doors in 2019 with a 1,200-gallon custom offset
              smoker, a handful of family recipes, and a determination to honor
              tradition while pushing boundaries. The result is upscale
              smokehouse dining that feels as comfortable as your favorite
              backyard cookout.
            </p>
            <p>
              Every day, our pitmaster arrives before dawn to start the fires.
              Fourteen hours later, our brisket reaches perfection — and it's
              worth every minute.
            </p>
          </div>
          <div className="about-image-container">
            <div className="about-placeholder">
              Replace with photo of the restaurant interior
            </div>
          </div>
        </div>

        {/* Reversed section */}
        <div className="about-content" style={{ marginTop: "3rem" }}>
          <div className="about-image-container" style={{ order: window.innerWidth > 768 ? 0 : 1 }}>
            <div className="about-placeholder">
              Replace with photo of the pitmaster at work
            </div>
          </div>
          <div className="about-text">
            <h3>The Craft of Smoke</h3>
            <p>
              Our pitmaster, with over 20 years of experience, leads a team
              that treats every cut with respect. We hand-select our wood — a
              proprietary blend of post oak and local hickory — and split it
              fresh every morning.
            </p>
            <p>
              We don't rush. Our briskets smoke low and slow at 225°F. Our ribs
              are dry-rubbed with a 12-spice blend and never see a drop of
              sauce until they hit your table. It's a process that demands
              patience and rewards it generously.
            </p>
            <p>
              From the smoker to the plate, every dish is crafted to deliver the
              deepest, most complex flavors that wood and fire can produce.
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div style={{ marginTop: "4rem" }}>
          <div className="page-header">
            <p className="overline">Gallery</p>
            <h2>A Taste of the Experience</h2>
            <div className="divider" />
          </div>

          <div className="about-gallery">
            <div className="gallery-item">
              <div className="gallery-placeholder">
                Smoked Brisket Photo
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                Bar & Cocktails Photo
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                Dining Room Photo
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                The Smoker Photo
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                Team / Staff Photo
              </div>
            </div>
            <div className="gallery-item">
              <div className="gallery-placeholder">
                Outdoor Patio Photo
              </div>
            </div>
          </div>

          <p style={{
            textAlign: "center",
            marginTop: "2rem",
            fontFamily: "var(--font-accent)",
            color: "var(--ash)",
            fontStyle: "italic",
            fontSize: "0.9rem",
          }}>
            Tip: Replace these placeholders with your own photos in the /client/public/images/ folder
          </p>
        </div>
      </section>

      {/* Values / Awards section */}
      <section style={{
        background: "linear-gradient(135deg, var(--oak-dark), var(--charcoal))",
        padding: "5rem 2rem",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--amber)" }}>14</div>
            <div style={{ fontFamily: "var(--font-accent)", color: "var(--ash)", fontStyle: "italic" }}>Hours of Smoking</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--amber)" }}>6</div>
            <div style={{ fontFamily: "var(--font-accent)", color: "var(--ash)", fontStyle: "italic" }}>Years Serving Asheville</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--amber)" }}>100%</div>
            <div style={{ fontFamily: "var(--font-accent)", color: "var(--ash)", fontStyle: "italic" }}>Wood-Fired, Always</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--amber)" }}>12</div>
            <div style={{ fontFamily: "var(--font-accent)", color: "var(--ash)", fontStyle: "italic" }}>Local Farm Partners</div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
