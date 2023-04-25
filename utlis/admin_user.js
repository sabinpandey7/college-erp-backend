const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const prisma = new PrismaClient()

const create_admin_user = async () => {
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD)
  try {
    const user = await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME,
        password: hashedPassword,
        id: Number.parseInt(process.env.ADMIN_ID),
        isAdmin: true,
        role: "TEACHER",
        department: "Engineering",
      },
    })
    console.log("successfully created admin user")
  } catch (error) {
    console.log(error)
  }
}

create_admin_user()
