# How to Run

This guide explains how to start the Smart Tourist Crowd Monitoring System.

## The Easiest Way (Windows Only)

We have included a one-click launcher to prevent connection errors ("This site can't be reached").

1. Go to the project folder (`crowd-monitor` or `smart-tourist-crowd-monitoring`).
2. Double-click on the **`START-APP.bat`** file.
3. A terminal window will open, start the server automatically, and launch your web browser to `http://127.0.0.1:8080`.
4. **Important**: Leave the black terminal window open while you are using the website! If you close it, the server will stop.

---

## Manual Setup (All Operating Systems)

If you prefer to start the server manually or are not using Windows:

### 1. Start the Backend Server

The backend is a Node.js + Express application that serves the API and the static frontend files.

1. Open a new terminal.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server will start on `http://127.0.0.1:8080`.*

### 2. Open the Frontend

Because the backend serves the frontend as static files, you can simply access the application by opening the following URL in your web browser once the server is running:

**[http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html)**

Alternatively, if you want to open the HTML file directly in your browser (`file:///.../frontend/index.html`), it will still work because CORS is fully enabled on the backend for all origins (`*`).
