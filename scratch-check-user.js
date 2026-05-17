require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
  });
}

const prisma = createPrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'sajid.cs08@gmail.com' },
      include: {
        subscriptions: true
      }
    });
    console.log("DB User:", JSON.stringify(user, null, 2));
  } catch (error) {
    console.error("DB Check Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
