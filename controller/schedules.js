const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getSchedules = async (req, res) => {
  const { branch, batch, teacher } = req.query
  const match = {}
  try {
    if (branch) {
      match.routine = {
        branch: branch,
      }
    }
    if (batch) {
      match.routine = {
        batch: Number.parseInt(batch),
      }
    }
    if (teacher) {
      match.teacher_id = Number.parseInt(teacher)
    }
    const schedules = await prisma.schedule.findMany({
      where: {
        ...match,
      },
      include: {
        subject: true,
        teacher: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        start_time: "asc",
      },
    })
    res.status(200).json(schedules)
  } catch (error) {
    res.status(400).json({ msg: "something went wrong" })
  }
}

module.exports = {
  getSchedules,
}
