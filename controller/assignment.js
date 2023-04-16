const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getAssignments = async (req, res) => {
  const { lecture_id } = req.query
  if (!lecture_id) {
    return res.status(400).json({ msg: "Please provide lecture id" })
  }
  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        lecture_id: Number.parseInt(lecture_id),
      },
    })
    return res.status(201).json(assignments)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getAssignment = async (req, res) => {
  const { id } = req.params
  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        assignTo: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            status: true,
          },
        },
      },
    })
    if (!assignment) {
      return res.status(404).json({ msg: "Id not found" })
    }
    return res.status(201).json(assignment)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const updateAssignment = (req, res) => {}
const deleteAssignment = async (req, res) => {
  const { id } = req.params
  try {
    const assignment = await prisma.assignment.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!assignment) {
      return res.status(404).json({ msg: "Id not found" })
    }
    return res.status(201).json(assignment)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}
const createAssignment = async (req, res) => {
  const { lecture_id, question } = req.body

  if (!lecture_id || !question) {
    return res.status(400).json({ msg: "please provide all values" })
  }
  try {
    const members = await prisma.lecture_Students.findMany({
      where: {
        lecture_id: lecture_id,
      },
    })
    const assignment = await prisma.assignment.create({
      data: {
        lecture_id: lecture_id,
        question: question,
      },
    })

    const promises = members.map((user) => {
      return prisma.assignmentAssignTo.create({
        data: {
          assignment_id: assignment.id,
          user_id: user.user_id,
        },
      })
    })

    await Promise.all(promises)

    return res.status(201).json(assignment)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const submitAssigment = async (req, res) => {
  const { id } = req.params
  const { std_id } = req.body
  if (!std_id) {
    return res.status(400).json({ msg: "provide student id" })
  }
  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!assignment) {
      return res.status(404).json({ msg: "Id not found" })
    }
    const submit = await prisma.assignmentAssignTo.update({
      where: {
        assignment_id_user_id: {
          assignment_id: assignment.id,
          user_id: std_id,
        },
      },
      data: {
        status: true,
      },
    })
    return res.status(201).json(submit)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const unSubmitAssignment = async (req, res) => {
  const { id } = req.params
  const { std_id } = req.body
  if (!std_id) {
    return res.status(400).json({ msg: "provide student id" })
  }
  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    })

    if (!assignment) {
      return res.status(404).json({ msg: "Id not found" })
    }
    const submit = await prisma.assignmentAssignTo.update({
      where: {
        assignment_id_user_id: {
          assignment_id: assignment.id,
          user_id: std_id,
        },
      },
      data: {
        status: false,
      },
    })
    return res.status(201).json(submit)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getAssignments,
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssigment,
  unSubmitAssignment,
}
