import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test" + Date.now() + "@example.com",
        password: "password123"
      }
    });
    console.log("Success:", user);
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
