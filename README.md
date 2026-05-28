# MediSlot

MediSlot is a modern, responsive web application designed to streamline healthcare clinic operations by empowering patients and doctors with intelligent appointment scheduling. It features role-based dashboards, real-time notification alerts, and dynamic slot management, all wrapped in a premium, fluid user interface.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, GSAP (Animations), TailwindCSS (Custom Tokens) |
| **Backend** | Python, Django, Django REST Framework |
| **Database** | SQLite (Development) / PostgreSQL (Production ready) |
| **Authentication** | JWT (JSON Web Tokens) via simplejwt |

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medislot.git
   cd medislot
   ```

2. **Backend Setup**
   ```bash
   cd medislot_backend
   python -m venv venv
   source venv/Scripts/activate  # Or venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # In a new terminal
   cd FrontendMediSlot
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in your frontend and backend root directories according to the reference below.

## Features Implemented

- [x] **Role-Based Authentication**: Secure login and signup for both Patients and Doctors.
- [x] **Patient Dashboard**: View, filter, and cancel upcoming appointments.
- [x] **Doctor Discovery**: Search and filter doctors by availability, specialization, and rating.
- [x] **Smart Booking Flow**: Restricts patient booking to the specific days the doctor has marked as available.
- [x] **Doctor Dashboard**: Real-time overview of daily stats and pending approvals.
- [x] **Schedule & Slot Management**: Doctors can define their weekly recurring availability or block specific dates out.
- [x] **Notification System**: Real-time alerts for booking requests, approvals, rejections, and cancellations.
- [x] **Premium UI/UX**: Fluid GSAP micro-animations, toast notifications, and strict adherence to modern design tokens.

## Live Deployment

Production URL: `[INSERT_LIVE_URL_HERE]`

## Environment Variables Reference

Below is an `.env.example` file showcasing all required keys for local development. Do not commit actual secrets!

```env
# Backend (.env)
DJANGO_SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://127.0.0.1:8000/api
```