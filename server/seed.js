const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require(`bcrypt`);
const { faker } = require("@faker-js/faker");

const createUser = async () => {
  return await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      password: await bcrypt.hash(faker.internet.password(), 10)
    }
  });
};

const createPost = async (userId) => {
  return await prisma.post.create({
    data: {
      title: faker.word.words(),
      content: faker.lorem.paragraph(),
      userId
    }
  });
};

const syncAndSeed = async () => {
  try {
    console.time(`Finished in`);
    for (let i = 1; i <= 3; i++) {
      await createUser();
      console.log(`CREATE USER`);

      for (let j = 0; j < 3; j++) {
        await createPost(i);
        console.log(`CREATE POST FOR USER #${i}`);
      }
    }

    console.timeEnd(`Finished in`);

    console.log(`\nSEED SUCCESS!`);
  } catch (error) {
    console.log(`ERROR IN syncAndSeed():\n\n`, error);
  } finally {
    prisma.$disconnect();
    console.log(`PRISMA DISCONNECTED!\n`);
  }
};

syncAndSeed();
