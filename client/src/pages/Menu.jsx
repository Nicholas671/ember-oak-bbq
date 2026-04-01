import { useState, useEffect } from "react";
import MenuModal from "../components/MenuModal";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";

function Menu() {
  const [allItems, setAllItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setAllItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load menu:", err);
        setLoading(false);
      });
  }, []);

  const getItemsByCategory = (category) => {
    return allItems.filter((item) => item.category === category);
  };

  const getHappyHourItems = () => {
    return allItems.filter((item) => item.is_happy_hour);
  };

  const categories = [
    {
      key: "dinner",
      title: "Dinner Menu",
      description: "Slow-smoked meats, hearty sides, and pitmaster specialties",
      icon: "🥩",
    },
    {
      key: "drinks",
      title: "Drinks Menu",
      description: "Craft cocktails, local brews, and curated wines",
      icon: "🥃",
    },
    {
      key: "specials",
      title: "Specials",
      description: "Chef's seasonal features and limited-time offerings",
      icon: "⭐",
    },
    {
      key: "happy-hour",
      title: "Happy Hour",
      description: "Discounted bites and drinks, Tuesday through Friday",
      icon: "🍻",
    },
  ];

  const getModalItems = (key) => {
    if (key === "happy-hour") return getHappyHourItems();
    return getItemsByCategory(key);
  };

  const getModalTitle = (key) => {
    const cat = categories.find((c) => c.key === key);
    return cat ? cat.title : "";
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="page-header">
          <Skeleton type="heading" />
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Skeleton type="text" count={2} />
          </div>
        </div>
        <div className="menu-categories">
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-section">
        <div className="page-header">
          <p className="overline">What We Serve</p>
          <h2>Our Menu</h2>
          <div className="divider" />
          <p>
            Select a category to explore our offerings. Every dish is crafted
            with care, smoked with patience.
          </p>
        </div>

        <div className="menu-categories">
          {categories.map((cat, index) => (
            <ScrollReveal key={cat.key} delay={`${index * 0.1}s`}>
              <div
                className="menu-card"
                onClick={() => setActiveModal(cat.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveModal(cat.key);
                }}
              >
                <span className="menu-card-icon">{cat.icon}</span>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {activeModal && (
        <MenuModal
          title={getModalTitle(activeModal)}
          items={getModalItems(activeModal)}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}

export default Menu;
