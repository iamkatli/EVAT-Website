# ⚡ Project Setup Guide (EVAT Website Frontend)

This repository contains a **Vite + React** project. Follow the instructions below to set up your environment and run the app locally.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Backend](https://github.com/Chameleon-company/EVAT-App-BE)

---

## ⚙️ Environment Variables

You need a `.env` file at the root of the project to configure API endpoints and other secrets.

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

Also, make sure `.env` is listed in your `.gitignore` so secrets are not pushed to GitHub.

---

## ▶️ Running the App

### The app will not work without the backend running locally

To view the website for development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 👨🏻‍💻 Development

1. Clone the [Backend](https://github.com/Chameleon-company/EVAT-App-BE) locally
2. Follow the readme to install dependencies and run the backend
3. Fork this repository
4. Clone the frontend fork locally
5. Install frontend dependencies and [environment variables](#️-environment-variables) described above and run the development app
   ```bash
   npm install
   npm run dev
   ```
6. Commit your changes
7. Submit a pull request
---