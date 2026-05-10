import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = "sajid.cs08@gmail.com"
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  })
  console.log("User upgraded:", user)
  process.exit(0)
}
main()
