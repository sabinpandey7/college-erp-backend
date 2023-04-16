const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getPeriods = async (req, res) => {
  const { lecture_id } = req.query
  if (!lecture_id) {
    return res.status(400).json({ msg: "please provide lecture id" })
  }
  try {
    const periods = await prisma.period.findMany({
      where: {
        lecture_id: Number.parseInt(lecture_id),
      },
      orderBy: {
        date: "desc",
      },
    })
    return res.status(200).json(periods)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}
const getPeriod = async (req, res) => {
  const { id } = req.params
  try {
    const period = await prisma.period.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        Attendence: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    if (!period) {
      return res.status(404).json({ msg: "Id not found" })
    }

    return res.status(201).json(period)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
  try {
  } catch (error) {}
}
const createPeriod = async (req, res) => {
  const { lecture_id, date } = req.body
  if (!lecture_id || !date) {
    return res.status(400).json({ msg: "please provide all values" })
  }
  try {
    const period = await prisma.period.create({
      data: {
        lecture_id: lecture_id,
        date: new Date(date),
      },
    })
    return res.status(201).json(period)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const deletePeriod = async (req, res) => {
  const { id } = req.params
  try {
    const period = await prisma.period.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(201).json(period)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}

const markAttendence = async (req, res) => {
  const { id } = req.params
  const { std_id } = req.body
  try {
    const period = await prisma.period.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!period) {
      return res.status(404).json({ msg: "Id not found" })
    }
    const attendence = await prisma.attendence.create({
      data: {
        periods_id: period.id,
        user_id: Number.parseInt(std_id),
      },
    })
    return res.status(201).json(attendence)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}
const unmarkAttendence = async (req, res) => {
  const { id } = req.params
  const { std_id } = req.body
  try {
    const period = await prisma.period.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!period) {
      return res.status(404).json({ msg: "Id not found" })
    }
    const attendence = await prisma.attendence.delete({
      where: {
        periods_id_user_id: {
          periods_id: period.id,
          user_id: Number.parseInt(std_id),
        },
      },
    })
    return res.status(204).json(attendence)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}

const getAttendence = async (req, res) => {
  const { id } = req.params

  try {
    const attendences = await prisma.attendence.findMany({
      where: {
        periods_id: Number.parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return res.status(200).json(attendences)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getPeriod,
  getPeriods,
  markAttendence,
  unmarkAttendence,
  createPeriod,
  deletePeriod,
  getAttendence,
}
