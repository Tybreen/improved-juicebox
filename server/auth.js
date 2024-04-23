const express = require(`express`);
const router = express.Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const bcrypt = require(`bcrypt`);
const jwt = require("jsonwebtoken");

// URL: /auth

router.post(`/register`, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10)
      }
    });

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.status(201).send({ token });
  } catch ({ name, message }) {
    next(name, message);
  }
});

router.post(`/login`, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username
      }
    });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET);
        res.status(200).send({ token });
      } else {
        res.status(401).send("Invalid login credentials.");
      }
    } else {
      res.status(401).send("Invalid login credentials.");
    }
  } catch ({ name, message }) {
    next(name, message);
  }
});

module.exports = router;
