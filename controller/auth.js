const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const prisma = new PrismaClient()

const login = async (req, res) => {
  const { id, password } = req.body
  try {
    if (!id || !password) {
      return res.status(400).json({ msg: "Please provide all values" })
    }
    const user = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!user) {
      return res.status(404).json({ msg: "User doesn't exists" })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ msg: "Wrong password" })
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    )

    return res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        role: user.role,
        branch: user.branch,
        isAdmin: user.isAdmin,
        batch: user.batch,
      },
    })
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}

const register = async (req, res) => {
  const {
    id,
    password,
    branch,
    department,
    name,
    batch,
    father,
    address,
    nationality,
    role,
  } = req.body
  try {
    if (!name || !password || !department || !branch || !id) {
      return res.status(400).json({ msg: "Please provide all fields" })
    }
    const exist = await prisma.user.findFirst({
      where: {
        id: id,
      },
    })
    if (exist) {
      return res.status(400).json({ msg: "Id already exists" })
    }

    const hashedPassword = bcrypt.hashSync(password)

    const user = await prisma.user.create({
      data: {
        id,
        password: hashedPassword,
        department,
        branch,
        name,
        batch,
        father,
        address,
        nationality,
        role,
      },
      select: {
        id: true,
        department: true,
        branch: true,
        name: true,
        isAdmin: true,
        password: false,
      },
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  login,
  register,
}
