const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function grantPro() {
  const email = 'sajid.cs08@gmail.com'; // Hardcoded for your test account
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'PRO' },
    });
    console.log(`SUCCESS! User ${email} is now PRO.`);
  } catch (error) {
    console.error(`Error updating user:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

grantPro();
