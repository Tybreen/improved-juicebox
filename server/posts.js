const router = require("express").Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();

// URL: /api/posts

module.exports = router;
