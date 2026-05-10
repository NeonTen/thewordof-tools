import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

async function main() {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  })
  console.log("USERS_IN_DB:", users)
  
  await prisma.$disconnect()
  await pool.end()
}

main().catch(e => console.error(e))
