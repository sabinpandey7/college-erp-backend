const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "auth credentials missing" })
  }

  const token = authorization.split(" ")[1]
  try {
    var payload = jwt.verify(token, process.env.SECRET_KEY)
    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        department: true,
        branch: true,
        name: true,
        isAdmin: true,
        role: true,
        password: false,
      },
    })
    if (!user) {
      res.status(401).json({ msg: "user not found" })
    }
    req.user = user
  } catch (e) {
    return res.status(401).json({ msg: e.message })
  }
  next()
}

const verifyAdmin = (req, res, next) => {
  return verifyUser(req, res, function () {
    if (req.user.isAdmin) {
      next()
    } else {
      return res.status(403).json({ msg: "permission denied" })
    }
  })
}

const verifyTeacher = (req, res, next) => {
  return verifyUser(req, res, function () {
    if (req.user.role === "TEACHER" || req.user.isAdmin) {
      next()
    } else {
      return res.status(403).json({ msg: "permission denied" })
    }
  })
}

module.exports = {
  verifyUser,
  verifyAdmin,
  verifyTeacher,
}
