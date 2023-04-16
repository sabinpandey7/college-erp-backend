const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getSubjects = async (req, res) => {
  const { name } = req.query
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        title: {
          contains: name,
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 20,
    })
    return res.status(200).json(subjects)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const createSubject = async (req, res) => {
  const { title, code } = req.body
  try {
    if (!title || !code) {
      return res.status(400).json({ msg: "please provide all values" })
    }
    const subject = await prisma.subject.create({
      data: {
        title,
        code,
      },
    })
    return res.status(201).json(subject)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getSubject = async (req, res) => {
  const { id } = req.params
  try {
    const subject = await prisma.Subject.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!subject) {
      return res.status(404).json({ msg: "id not found" })
    }

    return res.status(200).json(subject)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const updateSubject = async (req, res) => {
  return res.send("update Subject")
}
const deleteSubject = async (req, res) => {
  const { id } = req.params
  try {
    const deletedSubject = await prisma.subject.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(200).json(deletedSubject)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getSubjects,
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject,
}
