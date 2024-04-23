const router = require("express").Router();
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();

// URL: /api/posts

router.get(`/`, async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).send(posts);
  } catch ({ name, message }) {
    next(name, message);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      }
    });
    res.status(200).send(post);
  } catch ({ name, message }) {
    next(name, message);
  }
});

// Anything past this you have to be logged in.
router.use((req, res, next) => {
  if (req.user === null) {
    res.sendStatus(401);
  } else next();
});

router.post(`/`, async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: Number(userId)
      }
    });
    res.status(201).send(post);
  } catch ({ name, message }) {
    next(name, message);
  }
});

router.put(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, userId } = req.body;
    const post = await prisma.post.update({
      where: {
        id: Number(id),
        userId: req.user.id
      },
      data: {
        title,
        content,
        userId: Number(userId)
      }
    });
    res.status(200).send(post);
  } catch ({ name, message }) {
    next(name, message);
  }
});

router.delete(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.delete({
      where: {
        id: Number(id),
        userId: req.user.id
      }
    });
    console.log(`req.user.id:`, req.user);
    res.status(200).send(post);
  } catch ({ name, message }) {
    next(name, message);
  }
});

module.exports = router;
