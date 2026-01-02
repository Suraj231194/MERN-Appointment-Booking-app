# 🏥 MediBook - Healthcare Appointment System

![MediBook Banner](https://img.shields.io/badge/MediBook-Healthcare_Excellence-blue?style=for-the-badge&logo=medical-icon)

A modern, full-stack MERN application for booking doctor appointments, managing schedules, and patient history. Built with **React, Node.js, Express, and MongoDB**, styled with **Tailwind CSS**.

---

## 🚀 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | Dynamic UI with efficient state management (Zustand) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first CSS framework for responsive design |
| **Backend** | ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | Scalable server-side runtime |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | NoSQL database for flexible data schemas |
| **Auth** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) | Secure authentication with Access & Refresh tokens |

---

## ✨ Features

*   **🔐 Secure Authentication**: Role-based access (Patient, Doctor, Admin) with secure cookies.
*   **📅 Dynamic Slot Booking**: Doctors generate daily slots; Patients book concurrently without conflicts (Atomic operations).
*   **🩺 Doctor Dashboard**: View upcoming appointments, patient details, and contact info.
*   **👤 Patient Dashboard**: Browse doctors, book slots, view history, and cancel appointments.
*   **📱 Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v14+)
*   MongoDB (Local or Atlas URI)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/Appointment-Booking.git
cd Appointment-Booking
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
# Create .env file with your credentials (MONGO_URI, JWT_SECRET, etc.)
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

---

## 🔑 Login Credentials

Use these pre-seeded accounts to explore the different roles in the application.

### 👨‍⚕️ Doctors

| Name | Specialty | Email | Password |
| :--- | :--- | :--- | :--- |
| **Dr. Gregory House** | Diagnostic Medicine | `doctor1@hospital.com` | `password123` |
| **Dr. Meredith Grey** | General Surgery | `doctor2@hospital.com` | `password123` |
| **Dr. Derek Shepherd** | Neurosurgery | `doctor3@hospital.com` | `password123` |
| *...and doctors 4-10* | *Various* | `doctorX@hospital.com` | `password123` |

### 🤒 Patients

| Name | Email | Password |
| :--- | :--- | :--- |
| **Patient Zero** | `patient1@hospital.com` | `password123` |
| **John Doe** | `patient2@hospital.com` | `password123` |
| *...and patients 3-10* | `patientX@hospital.com` | `password123` |

### 🛡️ Admin

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@hospital.com` | `password123` |

---

## 📸 Screenshots

| Dashboard | Booking Flow |
| :---: | :---: |
| *(Screenshot Placeholder)* | *(Screenshot Placeholder)* |

---

Made with ❤️ by Suraj Pawar
