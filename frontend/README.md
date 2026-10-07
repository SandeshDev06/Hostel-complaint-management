# HostelCare – Hostel Complaint Management System (Frontend)

A complete, modern, responsive frontend application for a college mini-project: **Hostel Complaint Management System (HostelCare)**.

This project empowers hostel students to log grievances regarding hostel facilities (electrical, plumbing, Wi-Fi, sanitation, furniture, etc.) and transparently track the resolution progress through a visual milestone pipeline. Simultaneously, hostel wardens and administrative staff can oversee grievances campus-wide, assign service technicians, and log resolution remarks.

---

## 1. MERN Architecture Overview

This project is built as the **Frontend** component of the **MERN (MongoDB, Express.js, React.js, Node.js)** Stack.

```
┌────────────────────────────────────────────────────────┐
│               MERN STACK ARCHITECTURE                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [ CLIENT / FRONTEND ]                                 │
│  React.js (Vite) + React Router DOM + Axios + Bootstrap│
│  (Current Repository)                                  │
│                          ▲                             │
│                          │  REST API Calls (JSON/JWT)  │
│                          ▼                             │
│  [ SERVER / BACKEND ]                                  │
│  Node.js + Express.js REST API                         │
│  (Port 5000: http://localhost:5000/api)                │
│                          ▲                             │
│                          │  Mongoose ODM               │
│                          ▼                             │
│  [ DATABASE ]                                          │
│  MongoDB / MongoDB Atlas                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

* **Frontend**: React.js (Vite, Bootstrap 5, Axios, React Router DOM)
* **Backend (To be connected)**: Node.js + Express.js
* **Database (To be connected)**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens)

---

## 2. Key Features

### For Students:
- **Registration & Authentication**: Student registration with room allocation, block details, and client-side form validation.
- **Student Dashboard**: Real-time summary cards (*Total Complaints*, *Pending*, *In Progress*, *Resolved*) and quick access to recent complaints.
- **Submit Complaint**: Form with categorized dropdowns (*Electrical, Plumbing, Wi-Fi, Cleaning, Furniture, Room Maintenance, Water, Other*), priority selection (*Low, Medium, High, Urgent*), room auto-fill, and optional image upload with preview.
- **My Complaints & Tracking**: Live search (by ID, category, or description) with multi-criteria filtering by category, priority, and status.
- **Visual Status Timeline**: Interactive milestone tracker:
  $$\text{Submitted} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
- **Student Profile**: View resident details and update contact or room information.

### For Admin / Warden:
- **Admin Dashboard**: Comprehensive metric cards, visual complaints-by-category distribution bars, and resolution pipeline health indicators.
- **All Complaints Management**: Search and filter all student grievances campus-wide.
- **Grievance Action Panel**: Update complaint status (*Pending, Assigned, In Progress, Resolved, Rejected*), assign technicians, and record resolution remarks.
- **Student Directory**: Roster of registered student residents with room numbers, hostel blocks, and a modal view of their complete complaint history.
- **Quick Demo Role Switcher**: One-click toggle in the navbar and login page to easily switch between Student and Admin views during college demonstrations.

---

## 3. Technology Stack

* **Core Framework**: React.js 18
* **Build Tool**: Vite 6
* **UI & Styling**: Bootstrap 5.3 & Bootstrap Icons
* **Routing**: React Router DOM (v6)
* **HTTP Client**: Axios
* **Typography**: Inter (Google Fonts)

---

## 4. Project Structure

```text
Hostel_complaint/
│
├── public/
├── src/
│   ├── components/
│   │   ├── ComplaintTable.jsx     # Reusable responsive complaints table
│   │   ├── DashboardLayout.jsx    # Wrapper for authenticated pages with responsive sidebar
│   │   ├── EmptyState.jsx         # Empty state placeholder
│   │   ├── Footer.jsx             # Application footer
│   │   ├── LoadingSpinner.jsx     # Reusable loading spinner
│   │   ├── Navbar.jsx             # Top brand navbar with role indicators & switch
│   │   ├── PriorityBadge.jsx      # Colored priority pill indicator
│   │   ├── SearchBar.jsx          # Live search input and multi-dropdown filters
│   │   ├── Sidebar.jsx            # Desktop fixed & mobile offcanvas drawer sidebar
│   │   ├── StatCard.jsx           # Metric card with icons and themes
│   │   ├── StatusBadge.jsx        # Colored status badges with icons
│   │   └── Timeline.jsx           # Visual step-by-step resolution timeline
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Landing page (Hero, How It Works, Features)
│   │   ├── Login.jsx              # Login page with demo quick-access buttons
│   │   ├── Register.jsx           # Registration page with validation
│   │   │
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx   # 4 metric cards & recent complaints table
│   │   │   ├── NewComplaint.jsx       # Complaint submission form with photo upload
│   │   │   ├── MyComplaints.jsx       # Search, filter, and cancellation view
│   │   │   ├── ComplaintDetails.jsx   # Detailed ticket view with visual timeline
│   │   │   └── Profile.jsx            # Resident profile & edit view
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx     # 5 metric cards & analytics breakdown
│   │       ├── Complaints.jsx         # Full grievance list with filters
│   │       ├── ComplaintManagement.jsx# Status updater, technician assignment & remarks
│   │       ├── Students.jsx           # Student directory & complaint history modal
│   │       └── Profile.jsx            # Chief Warden profile and duties
│   │
│   ├── services/
│   │   └── api.js                 # Centralized Axios API client & mock adapter
│   │
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication and session state
│   │   └── ComplaintContext.jsx   # Centralized complaint state and CRUD operations
│   │
│   ├── data/
│   │   └── mockData.js            # Realistic initial complaints, students, and credentials
│   │
│   ├── App.jsx                    # Route configuration & role guards
│   ├── main.jsx                   # React root entry point
│   └── index.css                  # Custom styling and Bootstrap overrides
│
├── .env                           # Environment variables (VITE_API_URL, VITE_USE_MOCK)
├── index.html                     # HTML5 template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # Documentation
```

---

## 5. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v22)
- npm (v9 or higher; verified on npm v10)

### Installation

1. Open your terminal in the project directory:
   ```bash
   cd Hostel_complaint
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 6. Demo Credentials (For Presentation & Testing)

The frontend includes pre-seeded realistic mock data saved in `localStorage`. You can log in using either the form credentials below or click the **1-Click Demo Buttons** on the Login page:

| Role | Email | Password | Pre-configured Profile |
| :--- | :--- | :--- | :--- |
| **Student** | `student@hostelcare.com` | `password123` | Rahul Patil (Room A-204, Block A) |
| **Admin / Warden** | `admin@hostelcare.com` | `admin123` | Warden S. K. Ramesh (Chief Warden) |

> **Presentation Tip**: While logged in, you can click the **"Switch to Admin"** or **"Switch to Student"** button in the top navigation bar at any time to instantly demo both portals without repeatedly logging in and out.

---

## 7. Future Backend Integration Guide

The frontend is built with strict separation of concerns. All network interactions are encapsulated in `src/services/api.js`.

### Environment Configuration (`.env`)
```properties
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```
* When `VITE_USE_MOCK=true`, the application operates standalone using local storage.
* Set `VITE_USE_MOCK=false` once your Node.js + Express backend is running on port 5000.

### Expected REST API Endpoints

The backend developer should implement the following Express routes:

#### 1. Authentication (`/api/auth`)
* `POST /api/auth/register`
  - Body: `{ fullName, email, password, roomNumber, hostelBlock, phone }`
  - Response: `{ success: true, token: "JWT...", user: { id, name, email, role, roomNumber, hostelBlock } }`
* `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success: true, token: "JWT...", user: { id, name, email, role, roomNumber, hostelBlock } }`

#### 2. Complaints (`/api/complaints`)
* `GET /api/complaints` - Get all complaints (Admin)
* `GET /api/complaints/my` - Get complaints for the logged-in student (extracted from JWT token)
* `GET /api/complaints/:id` - Get complaint details by ID
* `POST /api/complaints` - Submit a new complaint
  - Body: `{ category, roomNumber, priority, description, imageUrl, hostelBlock }`
* `PUT /api/complaints/:id` - Update complaint fields
* `PUT /api/complaints/:id/status` - Update status, technician, and resolution remarks (Admin)
  - Body: `{ status, adminRemarks, assignedTo }`
* `DELETE /api/complaints/:id` - Delete or cancel a complaint

#### 3. Students (`/api/students`)
* `GET /api/students` - Get list of enrolled hostel students and room allocations (Admin)

---

## 8. Available Scripts

* `npm run dev` - Starts the Vite development server on port 5173.
* `npm run build` - Builds production-optimized assets in the `dist` folder.
* `npm run preview` - Locally previews the production build.

---

## 9. License & Attribution

Designed and developed for academic mini-project demonstration.
Built with React, Vite, and Bootstrap.


---

## 10. Advanced Features (v2)

* **Glassmorphism UI** – frosted-glass cards, navbar, sidebar, forms and tables over animated gradient blobs (`src/index.css`).
* **Animations** – page transitions, scroll-reveal (`useReveal`), animated counters (`useCountUp`), floating hero cards, timeline pulse, staggered table rows. Respects `prefers-reduced-motion`.
* **Images** – local SVG illustrations in `public/images/` plus Unsplash feature photos (hidden gracefully if offline).
* **Login with Google** – `src/components/GoogleSignIn.jsx`
  * Set `VITE_GOOGLE_CLIENT_ID` in `.env` to use real Google Identity Services.
  * Leave it empty to use the built-in demo account chooser (no setup needed).
  * Set `VITE_ADMIN_EMAILS=you@gmail.com` to make specific Google accounts Admin/Warden.
  * With a real backend, implement `POST /api/auth/google { credential }` and verify the ID token server-side.
* Users are no longer auto-logged-in; sign in via Google, email, or the 1-click demo buttons.
