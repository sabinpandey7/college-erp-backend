const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getUsers = async (req, res) => {
  const { id, branch, batch, role, name } = req.query
  const match = {}

  if (branch) {
    match.branch = branch
  }

  if (batch) {
    try {
      match.batch = Number.parseInt(batch)
    } catch (error) {
      return res.status(400).json({ msg: "Invalid batch" })
    }
  }
  if (role) {
    match.role = role
  }

  if (id) {
    query = `${id}%`
  }
  try {
    const users = !id
      ? await prisma.user.findMany({
          where: {
            ...match,
            name: {
              startsWith: name || "",
            },
          },
          select: {
            id: true,
            department: true,
            branch: true,
            name: true,
            isAdmin: true,
            password: false,
            address: true,
            father: true,
            batch: true,
          },
          take: 20,
        })
      : await prisma.$queryRaw`SELECT id ,department,branch,name,isAdmin FROM user where id LIKE ${query} LIMIT 20`

    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return res.status(204).json(user)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      select: {
        id: true,
        department: true,
        branch: true,
        name: true,
        isAdmin: true,
        password: false,
        address: true,
        father: true,
        batch: true,
        role: true,
        nationality: true,
      },
    })
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const updateUser = async (req, res) => {
  const {
    department,
    branch,
    name,
    address,
    father,
    batch,
    nationality,
    isAdmin,
    role,
  } = req.body
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!user) {
      res.status(404).json({ msg: "user not found" })
    }

    const updatedUser = await prisma.user.update({
      data: {
        name: name || user.name,
        role: role || user.role,
        department: department || user.department,
        role: role || user.role,
        branch: branch || user.branch,
        isAdmin: isAdmin || user.isAdmin,
        father: father || user.father,
        address: address || user.address,
        batch: batch || user.batch,
        nationality: nationality || user.nationality,
      },
      select: {
        id: true,
        department: true,
        branch: true,
        name: true,
        isAdmin: true,
        password: false,
        address: true,
        father: true,
        batch: true,
        role: true,
        nationality: true,
      },
      where: {
        id: Number.parseInt(id),
      },
    })
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const getSummary = async (req, res) => {
  try {
    const teacher = await prisma.user.count({
      where: {
        role: "TEACHER",
      },
    })
    const totals = await prisma.user.count({})

    const results =
      await prisma.$queryRaw`select batch, count(id) as total,count(case when nationality='INDIAN' then 1 else null end) as indian,count(case when nationality='INTERNATIONAl' then 1 else null end) as international from user where role ='STUDENT'  group by batch`

    //big int cannot be serialize so count is converted to int
    const students = results.map((item) => ({
      batch: item.batch,
      total: Number.parseInt(item.total),
      indian: Number.parseInt(item.indian),
      international: Number.parseInt(item.international),
    }))
    return res
      .status(200)
      .json({ students: students, teacher: teacher, totals: totals })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const getUserAssignment = async (req, res) => {
  const { lecture } = req.query
  const { id } = req.params

  try {
    let match = {}
    if (lecture) {
      match.assignment = {
        lecture_id: Number.parseInt(lecture),
      }
    }

    const assigments = await prisma.assignmentAssignTo.findMany({
      where: {
        ...match,
        user_id: Number.parseInt(id),
      },
    })

    res.status(200).json(assigments)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const getUserAttendence = async (req, res) => {
  const { lecture } = req.query
  const { id } = req.params

  if (!lecture) {
    return res.status(400).json({ msg: "please provide  lecture's  id" })
  }

  try {
    const match = {}
    if (lecture) {
      match.periods = {
        lecture_id: Number.parseInt(lecture),
      }
    }
    if (id) {
      match.user_id = Number.parseInt(id)
    }

    const totalPeriods = await prisma.period.count({
      where: {
        lecture_id: Number.parseInt(lecture),
      },
    })

    const attendended = await prisma.attendence.findMany({
      where: {
        ...match,
      },
      select: {
        periods: {
          select: {
            date: true,
          },
        },
      },
    })
    return res.status(200).json({ total: totalPeriods, attendended })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  updateUser,
  getUsers,
  getUser,
  deleteUser,
  getSummary,
  getUserAssignment,
  getUserAttendence,
}
