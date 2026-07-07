const pool = require("./db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedPassword = process.env.SEED_ADMIN_PASSWORD || "devpassword123"; // Default password if not set in .env

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    // Create default admin user
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(seedPassword, salt);

    await pool.query(
      `INSERT INTO admin_users (username, password_hash, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING`,
      ["admin", hash, "manager@emberandoak.com"]
    );
    console.log(`Admin user created (username: admin, password: ${seedPassword})`);

    // Seed menu items
    const menuItems = [
      // Dinner items
      { name: "Brisket Platter", description: "14-hour smoked prime brisket, hand-sliced to order. Served with two sides.", price: 28.99, category: "dinner", sort_order: 1 },
      { name: "Pulled Pork Plate", description: "Slow-smoked pork shoulder with Carolina gold sauce. Served with two sides.", price: 22.99, category: "dinner", sort_order: 2 },
      { name: "Baby Back Ribs", description: "Full rack of St. Louis-style ribs, dry rubbed and glazed. Served with two sides.", price: 32.99, category: "dinner", sort_order: 3 },
      { name: "Smoked Half Chicken", description: "Brined and smoked free-range half chicken with herb butter. Served with two sides.", price: 24.99, category: "dinner", sort_order: 4 },
      { name: "Burnt Ends", description: "Caramelized brisket point cubes tossed in house BBQ glaze. Served with two sides.", price: 26.99, category: "dinner", sort_order: 5 },
      { name: "Smoked Salmon", description: "Applewood-smoked Atlantic salmon with dill cream and pickled onion. Served with two sides.", price: 29.99, category: "dinner", sort_order: 6 },
      { name: "The Pitmaster Combo", description: "Choose any three meats. Served with two sides and cornbread.", price: 38.99, category: "dinner", sort_order: 7 },
      { name: "Wagyu Burger", description: "8oz wagyu patty, aged cheddar, smoked onion jam, brioche bun. Served with fries.", price: 21.99, category: "dinner", sort_order: 8 },
      { name: "Smoked Wings", description: "Jumbo wings, hickory smoked then flash fried. Choice of dry rub or sauced.", price: 16.99, category: "dinner", sort_order: 9 },
      { name: "Mac & Cheese Skillet", description: "Cast-iron baked four-cheese mac with smoked gouda breadcrumb crust.", price: 12.99, category: "dinner", sort_order: 10 },
      { name: "Collard Greens", description: "Slow-braised collards with smoked ham hock and apple cider vinegar.", price: 8.99, category: "dinner", sort_order: 11 },
      { name: "Cornbread", description: "Jalapeño honey butter cornbread baked in cast iron.", price: 6.99, category: "dinner", sort_order: 12 },

      // Drinks
      { name: "Smoky Old Fashioned", description: "Bourbon, smoked maple syrup, Angostura bitters, orange peel.", price: 14.99, category: "drinks", sort_order: 1 },
      { name: "Ember Mule", description: "Rye whiskey, ginger beer, charred lime, black walnut bitters.", price: 13.99, category: "drinks", sort_order: 2 },
      { name: "Pitmaster's Punch", description: "Dark rum, pineapple, passion fruit, chipotle honey, lime.", price: 14.99, category: "drinks", sort_order: 3 },
      { name: "Carolina Sweet Tea", description: "House-brewed black tea with peach syrup. Add bourbon +$5.", price: 4.99, category: "drinks", sort_order: 4 },
      { name: "Oak Barrel Margarita", description: "Barrel-aged tequila, Cointreau, fresh lime, smoked salt rim.", price: 15.99, category: "drinks", sort_order: 5 },
      { name: "Draft IPA — Local Brew", description: "Rotating selection of Asheville-brewed IPAs. Ask your server.", price: 8.99, category: "drinks", sort_order: 6 },
      { name: "Draft Lager", description: "Crisp, clean lager. The perfect pairing for smoked meats.", price: 7.99, category: "drinks", sort_order: 7 },
      { name: "Red Blend — House Pour", description: "Full-bodied red blend with dark cherry and oak notes.", price: 12.99, category: "drinks", sort_order: 8 },
      { name: "Chardonnay — House Pour", description: "Lightly oaked Chardonnay with notes of pear and vanilla.", price: 11.99, category: "drinks", sort_order: 9 },
      { name: "Lavender Lemonade", description: "Fresh-squeezed lemonade with house lavender syrup. Non-alcoholic.", price: 5.99, category: "drinks", sort_order: 10 },

      // Specials
      { name: "Tomahawk Ribeye for Two", description: "32oz bone-in ribeye, reverse-seared over oak. Served with loaded baked potato and grilled asparagus.", price: 89.99, category: "specials", sort_order: 1 },
      { name: "Whole Smoked Cauliflower", description: "Dry-rubbed and smoked cauliflower head with romesco, pickled raisins, and herb oil. Vegan.", price: 19.99, category: "specials", sort_order: 2 },
      { name: "Brisket Poutine", description: "Hand-cut fries, cheese curds, chopped brisket, smoked gravy.", price: 17.99, category: "specials", sort_order: 3 },
      { name: "Peach Cobbler Skillet", description: "Cast-iron peach cobbler with brown sugar crumble and vanilla bean ice cream.", price: 12.99, category: "specials", sort_order: 4 },
    ];

    for (const item of menuItems) {
      await pool.query(
        `INSERT INTO menu_items (name, description, price, category, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [item.name, item.description, item.price, item.category, item.sort_order]
      );
    }

    console.log(`Seeded ${menuItems.length} menu items`);

    // Set some items as happy hour
    await pool.query(
      `UPDATE menu_items SET is_happy_hour = TRUE, happy_hour_price = price * 0.7
       WHERE name IN ('Smoked Wings', 'Mac & Cheese Skillet', 'Cornbread', 'Draft IPA — Local Brew', 'Draft Lager', 'Carolina Sweet Tea', 'Ember Mule', 'Brisket Poutine')`,
    );
    console.log("Set happy hour items with 30% discount");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
