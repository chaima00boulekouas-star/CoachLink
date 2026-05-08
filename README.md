# 🏋️‍♂️ CoachLink - Empowering Athletes and Trainers

CoachLink is a comprehensive fitness platform designed to bridge the gap between professional trainers and athletes. It provides a seamless experience for managing training programs, scheduling sessions, and tracking progress, all while facilitating real-time communication.

---

## 🚀 Features

### 🏅 For Athletes
- **Personalized Training**: Access and follow detailed training programs curated by professional coaches.
- **Store & Favorites**: Browse, purchase, and favorite training programs and fitness products.
- **Real-time Interaction**: Chat directly with your coach for guidance and support.
- **Progress Tracking**: Monitor your fitness journey through an intuitive dashboard.

### 📋 For Trainers
- **Comprehensive Dashboard**: Track student statistics, upcoming sessions, and revenue at a glance.
- **Program Management**: Create and manage specialized training programs.
- **Session Scheduling**: Efficiently book and manage sessions with multiple athletes.
- **Live Feed**: Stay updated with real-time notifications and session alerts.

### 🛡️ Administration
- **User Management**: Manage athlete and coach profiles.
- **Platform Analytics**: Oversee the overall health and activity of the ecosystem.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: React Router Dom

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & Bcrypt
- **File Uploads**: Multer
- **Emails**: Nodemailer
- **Payments**: Chargily Pay

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB account (Atlas or local)

### 1. Clone the Repository
```bash
git clone https://github.com/chaima00boulekouas-star/CoachLink.git
cd CoachLink
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your configurations:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CHARGILY_API_KEY=your_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```
Run the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the frontend:
```bash
npm run dev
```

---

## 📂 Project Structure

```
CoachLink/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── store/      # Redux state management
│   │   └── utils/      # Helper functions
├── backend/            # Express application
│   ├── src/
│   │   ├── controllers/# Route handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── server.js   # Main entry point
└── README.md
```

---

## 📜 License
This project is licensed under the ISC License.

---

*Built with ❤️ by the CoachLink Team.*
