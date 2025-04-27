const express = require("express");
const connectDB = require("./config/connect");
const { port } = require("./config/env");
const oauth2Client = require("./config/googleAuth");
const route = require("./routes");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Google OAuth scopes
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

connectDB();

// Routing
app.use("/api/v1", route);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      name: err.name || "Error",
      message: message,
    },
  });
});

app.listen(port, `0.0.0.0`, () => {
  console.log(`Server is running on port ${port}`);
});
