const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getRoutines = async (req, res) => {
  try {
    const routines = await prisma.routine.findMany({})
    return res.status(200).json(routines)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const createRoutine = async (req, res) => {
  const { branch, session, sem, batch } = req.body
  try {
    if (!branch || !session || !sem || !batch) {
      return res.status(400).json({ msg: "please provide all values" })
    }

    let isExists = await prisma.routine.findFirst({
      where: {
        branch: branch,
        batch: batch,
      },
    })
    if (isExists) {
      return res
        .status(400)
        .json({ msg: `Already Routine Exists for given batch of branch !!` })
    }
    isExists = await prisma.routine.findFirst({
      where: {
        branch: branch,
        sem: sem,
        session: session,
      },
    })
    if (isExists) {
      return res.status(400).json({
        msg: `Already Routine Exists for given semester of session !!`,
      })
    }

    const routine = await prisma.routine.create({
      data: {
        branch,
        session,
        sem,
        batch,
      },
    })
    return res.status(201).json(routine)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getRoutine = async (req, res) => {
  const { id } = req.params
  try {
    const routine = await prisma.routine.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        schedules: {
          include: {
            subject: true,
            teacher: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    if (!routine) {
      return res.status(404).json({ msg: "id not found" })
    }

    return res.status(200).json(routine)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const updateRoutine = async (req, res) => {
  return res.send("update Subject")
}
const deleteRoutine = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRoutine = await prisma.routine.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(200).json(deletedRoutine)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const getClasses = async (req, res) => {
  const { id } = req.params
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        routine_id: Number.parseInt(id),
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
    return res.status(201).json(schedules)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const addClass = async (req, res) => {
  const { id } = req.params
  const { subject, teacher, start_time, end_time, day } = req.body

  try {
    const schedule = await prisma.schedule.create({
      data: {
        routine_id: Number.parseInt(id),
        subject_id: subject,
        teacher_id: teacher,
        start_time: new Date(`2023-04-12T${start_time}`),
        end_time: new Date(`2023-04-12T${end_time}`),
        day: day,
      },
    })

    return res.status(201).json(schedule)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const removeClass = async (req, res) => {
  const { schedule_id } = req.body
  try {
    const schedule = await prisma.schedule.delete({
      where: {
        id: schedule_id,
      },
    })

    return res.status(201).json(schedule)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getRoutines,
  createRoutine,
  getRoutine,
  updateRoutine,
  deleteRoutine,
  addClass,
  removeClass,
  getClasses,
}
