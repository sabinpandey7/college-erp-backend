const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const getAttendence = async (req, res) => {
  const { lecture, student } = req.query

  if (!lecture || !student) {
    res
      .status(400)
      .json({ msg: "please provide both lecture's and student's id" })
  }

  try {
    const match = {}
    if (lecture) {
      match.periods = {
        lecture_id: Number.parseInt(lecture),
      }
    }
    if (student) {
      match.user_id = Number.parseInt(student)
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
  getAttendence,
}
