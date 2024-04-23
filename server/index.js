require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan(`dev`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/auth`, require(`./auth.js`));
app.use(`/api/posts`, require(`./posts.js`));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
