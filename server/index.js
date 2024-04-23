require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(`dev`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }

  next();
});

app.use(`/auth`, require(`./auth.js`));
app.use(`/api/posts`, require(`./posts.js`));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
