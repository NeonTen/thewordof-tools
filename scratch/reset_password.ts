import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = "sajid.cs08@gmail.com"
  const password = await bcrypt.hash("protest123", 10)
  const user = await prisma.user.update({
    where: { email },
    data: { password }
  })
  console.log("Password reset for:", email)
  process.exit(0)
}
main()
