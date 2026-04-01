# Ember & Oak BBQ — Restaurant Website (PERN Stack)

A full-stack restaurant website built with **PostgreSQL, Express, React, and Node.js**.

---

## Features

- **Landing Page** with toggleable specials/event popup
- **About Page** with photo gallery
- **Menu Page** with modal popups for Dinner, Drinks, Specials, and Happy Hour
- **Contact Page** with email notification to the manager
- **Admin Dashboard** (password-protected) to:
  - Add, edit, delete menu items
  - Upload/change item photos
  - Toggle items on/off for Happy Hour
  - Toggle the landing page popup on/off and edit its message
- Responsive design with an upscale BBQ color scheme (reds, browns, oranges)

---

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** v14+
- **npm** v9+

---

## Setup Instructions

### 1. Clone & Install

```bash
# From the project root
cd server && npm install
cd ../client && npm install
```

### 2. Create the PostgreSQL Database

```bash
# Log into psql
psql -U postgres

# Inside psql:
CREATE DATABASE ember_oak;
\q
```

### 3. Run the Schema & Seed

```bash
cd server
psql -U postgres -d ember_oak -f schema.sql
node seed.js
```

### 4. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ember_oak
JWT_SECRET=your_super_secret_key_change_this
ADMIN_EMAIL=manager@emberandoak.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> **Email Setup**: For Gmail, enable 2FA and create an App Password.
> You can also use services like SendGrid or Mailgun.

### 5. Start the App

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

- **Client**: http://localhost:5173
- **Server API**: http://localhost:5000

### 6. Default Admin Login

```
Username: admin
Password: emberoak2024
```

Change this immediately after first login via the admin panel.

---

## Project Structure

```
restaurant-app/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Header, Footer, MenuModal, SpecialsPopup
│   │   ├── pages/          # Home, About, Menu, Contact, Admin, AdminLogin
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                 # Express backend
│   ├── routes/             # menu, admin, contact, auth
│   ├── middleware/          # JWT auth middleware
│   ├── db.js               # PostgreSQL pool
│   ├── index.js            # Express entry point
│   ├── schema.sql          # Database tables
│   ├── seed.js             # Sample data
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Route                     | Description                   | Auth |
|--------|---------------------------|-------------------------------|------|
| GET    | /api/menu                 | Get all menu items            | No   |
| GET    | /api/menu/:category       | Get items by category         | No   |
| POST   | /api/menu                 | Add a menu item               | Yes  |
| PUT    | /api/menu/:id             | Update a menu item            | Yes  |
| DELETE | /api/menu/:id             | Delete a menu item            | Yes  |
| PATCH  | /api/menu/:id/happy-hour  | Toggle happy hour status      | Yes  |
| GET    | /api/admin/popup          | Get popup settings            | No   |
| PUT    | /api/admin/popup          | Update popup settings         | Yes  |
| POST   | /api/contact              | Send a contact message        | No   |
| POST   | /api/auth/login           | Admin login                   | No   |
| PUT    | /api/auth/change-password | Change admin password         | Yes  |
