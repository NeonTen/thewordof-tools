import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT enum_range(NULL::"Role")`
    console.log("Postgres Role Enum:", result)

    const users = await prisma.$queryRaw`SELECT id, role::text FROM "User" LIMIT 5`
    console.log("Users Roles:", users)
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
