# MediBook 🏥

### Modern Healthcare Appointment Management

MediBook is a full-stack healthcare platform designed to simplify the interaction between patients and doctors. It bridges the gap in digital healthcare by providing a seamless, real-time booking experience.

Built with performance and user experience in mind, this project demonstrates a complete production-ready workflow using the MERN stack.

---

## 🌟 Key Features

### For Patients
- **Instant Booking**: Real-time slot availability checks to prevent double bookings.
- **Doctor Discovery**: Browse specialists by category or search by name.
- **Personal Dashboard**: Track appointment history and manage upcoming visits.
- **Secure Access**: JWT-based authentication ensures your health data remains private.

### For Doctors
- **Schedule Management**: Define your availability and slot duration.
- **Patient Overview**: Access patient history and details before the appointment.
- **Analytics**: (Coming Soon) View booking trends and engagement.

### For Administrators
- **System Oversight**: Manage users and appointments across the platform.

---

## 🛠️ Technology Stack

This project leverages a modern JavaScript ecosystem to ensure scalability and developer experience.

**Frontend:**
- **React 19**: Utilizing the latest features for robust UI components.
- **Tailwind CSS**: A utility-first framework for a custom, responsive design system.
- **Zustand**: Minimalist state management for handling global user sessions.
- **Lucide React**: Clean, consistent iconography.

**Backend:**
- **Node.js & Express**: High-performance server-side logic.
- **MongoDB**: Flexible NoSQL database schema for complex healthcare data.
- **JWT**: Stateless, secure authentication strategy.

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Local or Atlas)

### 1. Installation

Clone the repository and install dependencies for both client and server:

```bash
# Clone the repo
git clone https://github.com/Suraj231194/MERN-Appointment-Booking-app.git
cd Appointment-Booking

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Running the App

Start both the backend and frontend dev servers:

```bash
# Terminal 1: Server
cd server
npm run dev

# Terminal 2: Client
cd client
npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## 🧪 Validated Test Accounts

We've pre-seeded the database with diverse user roles so you can test every feature immediately.

| Role | Email | Password |
|------|-------|----------|
| **Doctor** | `doctor1@hospital.com` | `password123` |
| **Patient** | `patient1@hospital.com` | `password123` |
| **Admin** | `admin@hospital.com` | `password123` |

*(You can also use the `seed_appointments.js` script to generate more data if needed.)*

---

## 🎨 Design Philosophy

We tried to move away from generic "bootstrap" looks. The UI is crafted with:
- **Consistent Color System**: A calming medical-blue palette.
- **Responsive Grids**: Layouts that adapt smoothly from mobile to desktop.
- **Interactive States**: Hover effects and transitions that make the app feel alive.

---

This project was built by **Suraj Pawar**.
If you find this useful, give it a ⭐️ on GitHub!
