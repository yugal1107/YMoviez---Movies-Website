# YMoviez - AI-Powered Movie Discovery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**YMoviez** is a modern, feature-rich movie discovery platform that seamlessly blends a sophisticated web application with a powerful machine learning recommendation engine. This project is designed to offer a fluid and personalized user experience, allowing users to explore, rate, and organize movies while receiving intelligent, AI-driven recommendations.

It stands as a testament to the power of combining a full-stack web architecture with data science, creating a product that is both functional and intelligent.

**Live Demo:** [https://ymoviez.vercel.app](https://ymoviez.vercel.app)

---

## ✨ Key Features

- **Interactive Movie Browsing**: Explore movies from various categories like Now Playing, Top Rated, and Popular.
- **AI-Powered Recommendations**: Get personalized movie suggestions based on your viewing patterns, powered by a K-Means clustering model.
- **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
- **Personalized Movie Lists**:
    - **Likes**: Mark movies you love.
    - **Watchlist**: Keep track of movies you want to watch.
    - **Watched History**: Maintain a log of movies you have already seen.
- **Custom Playlists**: Create and manage personal movie playlists.
- **Rating & Comments**: Rate movies on a 10-star scale and engage in discussions through a nested commenting system.
- **Advanced Search**: Instantly search for any movie in the TMDB database.
- **Responsive Design**: A sleek, modern, and fully responsive UI built with React and Tailwind CSS.

---

## 🏗️ Architecture Overview

The project is architected as a microservices-oriented system, composed of three distinct but interconnected components that work in harmony.

```
+------------------------+      +-------------------------+      +--------------------------+
|                        |      |                         |      |                          |
|   Frontend (React)     |----->|    Backend (Node.js)    |----->|   Database (PostgreSQL)  |
| (User Interface)       |      | (User Data, Auth, Proxy)|      |                          |
|                        |      +-------------------------+      +--------------------------+
+------------------------+                |
          |                              |
          | (API Call)                   | (Proxy)
          |                              |
          v                              v
+------------------------+      +--------------------------+
|                        |      |                          |
|  ML Service (FastAPI)  |      |        TMDB API          |
| (Recommendations)      |      | (Movie Data Source)      |
|                        |      |                          |
+------------------------+      +--------------------------+
```

1.  **Frontend (Client)**: A dynamic and responsive single-page application (SPA) built with **React**. It serves as the user's primary interaction point, managing UI state and communicating with the backend and ML services.
2.  **Backend (Server)**: A robust **Node.js (Express)** server responsible for user authentication, managing user-specific data (likes, playlists, ratings), and acting as a secure proxy for the TMDB API to protect sensitive keys.
3.  **Machine Learning Service (Submodule)**: A high-performance **FastAPI (Python)** server that hosts the K-Means clustering model. It exposes a simple API endpoint to deliver intelligent movie recommendations based on a user's viewing history.

This separation of concerns makes the application scalable, maintainable, and demonstrates a powerful fusion of web engineering and machine learning.

---

## 🛠️ Tech Stack

| Component      | Technologies                                                              |
| -------------- | ------------------------------------------------------------------------- |
| **Frontend**   | `React`, `Vite`, `Tailwind CSS`, `TanStack Query`, `Axios`, `Firebase`      |
| **Backend**    | `Node.js`, `Express.js`, `PostgreSQL`, `Firebase Admin`                     |
| **ML Service** | `Python`, `FastAPI`, `Scikit-learn`, `Pandas`, `Uvicorn`                    |
| **Deployment** | `Vercel` (Frontend & Backend), `Docker`                                   |

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)
- [Python](https://www.python.org/downloads/) (v3.9 or later)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

Clone the repository and its submodule using the `--recurse-submodules` flag.

```bash
git clone --recurse-submodules https://github.com/your-username/YMoviez---Movies-Website.git
cd YMoviez---Movies-Website
```

### 2. Backend Setup

The backend server handles user data and proxies TMDB API requests.

```bash
# Navigate to the server directory
cd server

# Install dependencies
pnpm install

# Create a .env file and populate it based on .env.example
# You will need credentials for your PostgreSQL database and Firebase project.
cp .env.example .env

# Run the server
pnpm start
```

### 3. Frontend Setup

The frontend is where all the magic is visible to the user.

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
pnpm install

# Create a .env file and add the backend API URL
echo "VITE_BASE_API_URL=http://localhost:8080" > .env
echo "VITE_BASE_ML_URL=http://localhost:8000" >> .env

# Run the development server
pnpm dev
```

### 4. Machine Learning Service Setup

This service provides movie recommendations.

```bash
# Navigate to the ML submodule directory from the root
cd Movie-Recommendation-System

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Once all three services are running, open your browser and navigate to `http://localhost:5173` (or the port specified by Vite) to see the application in action!

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

-   [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the comprehensive movie data API.
-   [GroupLens](https://grouplens.org/datasets/movielens/) for providing the dataset used to train the recommendation system.
-   The developers of the amazing open-source libraries used in this project.
-   You, for checking out this project!