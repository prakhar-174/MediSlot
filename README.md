# MediSlot - Patient Appointment Booking System

---

## Overview

MediSlot is a web-based patient appointment booking platform designed to eliminate the inefficiencies of manual appointment management in small clinics and healthcare centers. The platform enables patients to discover doctors and book appointments online, while giving doctors and admins full control over their schedules - all through a clean, role-based interface.

---

## Problem Being Solved

Small clinics still rely on phone calls and physical registers to manage appointments. This leads to:

- Double bookings and scheduling conflicts
- Missed appointments with no reminder system
- No centralized record of patient visit history
- Doctors having no structured view of their daily schedule

MediSlot solves this by digitizing the entire appointment lifecycle - from booking to approval to completion.

---

## User Roles

The platform supports two distinct roles:

| Role | Description |
|------|-------------|
| **Patient** | Can register, browse doctors, book appointments, and track history |
| **Doctor / Admin** | Can manage slots, approve or reject bookings, and view daily schedules |

---

## Feature Requirements

### Authentication (Both Roles)

- User registration with name, email, password, and role selection (Patient / Doctor)
- Secure login with JWT or session-based authentication
- Role-based route protection (patients cannot access doctor dashboard and vice versa)
- Logout functionality
- Basic form validation and error messaging

---

### Patient Features

#### 1. Browse Doctors
- View a list of all registered doctors
- Each doctor card should display:
  - Full name
  - Specialization (e.g., Cardiologist, General Physician)
  - Available days/timings
  - A "Book Appointment" button

#### 2. Book an Appointment
- Patient selects a doctor and views their available time slots
- Patient picks a preferred date and available slot
- Patient adds an optional reason/notes for the visit
- Appointment is created with a **Pending** status upon submission
- Patient receives confirmation that the booking request has been sent

#### 3. Appointment History
- Patient can view all their appointments (past and upcoming)
- Each entry shows:
  - Doctor name and specialization
  - Date and time slot
  - Status: Pending / Approved / Rejected / Completed
- Patient can cancel a pending appointment

---

### Doctor / Admin Features

#### 1. Slot Management
- Doctor can define their weekly availability (days + time slots)
- Doctor can add new slots or remove existing ones
- Doctor can block specific dates (e.g., holidays, leave)

#### 2. Appointment Approval
- Doctor sees all incoming appointment requests with status **Pending**
- Doctor can **Approve** or **Reject** each request
- Optional: Doctor can add a rejection reason or note

#### 3. Daily Schedule View
- Doctor can view a calendar or list view of approved appointments for any given day
- Each entry shows patient name, time slot, and visit reason
- Doctor can mark an appointment as **Completed** after the visit

#### 4. Doctor Dashboard
- Summary cards showing:
  - Total appointments today
  - Pending approvals
  - Total patients served (all time)
- Quick access to today's schedule

---

## Appointment Status Flow

```
Patient Books → [PENDING] → Doctor Approves → [APPROVED] → Visit Done → [COMPLETED]
                                ↓
                         Doctor Rejects → [REJECTED]
                                ↓
                       Patient Cancels → [CANCELLED]
```

---