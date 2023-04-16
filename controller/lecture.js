const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getLectures = async (req, res) => {
  const { sem, branch, session, admin, student } = req.query

  let match = {}

  if (sem) {
    try {
      match.sem = Number.parseInt(sem)
    } catch (error) {
      console.log(error)
    }
  }

  if (branch) {
    match.branch = branch
  }

  if (student) {
    try {
      match.Lecture_Students = {
        some: {
          user_id: Number.parseInt(student),
        },
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (session) {
    try {
      match.session = Number.parseInt(session)
    } catch (error) {}
  }

  try {
    let lectures = {}
    if (admin && req.user.isAdmin) {
      lectures = await prisma.lecture.findMany({
        where: {
          ...match,
        },
        orderBy: {
          id: "desc",
        },

        include: {
          subject: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    } else if (!admin && req.user.role === "TEACHER") {
      lectures = await prisma.lecture.findMany({
        where: {
          teacher_id: req.user.id,
        },
        orderBy: {
          id: "desc",
        },
        include: {
          subject: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    } else {
      lectures = await prisma.lecture.findMany({
        where: {
          Lecture_Students: {
            some: {
              user_id: req.user.id,
            },
          },
        },
        include: {
          subject: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      })
    }
    return res.status(200).json(lectures)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const createLecture = async (req, res) => {
  const { teacher_id, subject_id, sem, branch, session } = req.body
  try {
    if (!teacher_id || !subject_id || !sem || !branch || !session) {
      return res.status(400).json({ msg: "please provide all values" })
    }
    const lecture = await prisma.lecture.create({
      data: {
        teacher_id: teacher_id,
        subject_id: subject_id,
        sem: sem,
        branch: branch,
        session: session,
      },
    })
    return res.status(201).json(lecture)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getLecture = async (req, res) => {
  const { id } = req.params
  try {
    const lecture = await prisma.lecture.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        Assignment: true,
        Lecture_Students: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subject: true,
        Period: true,
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    if (!lecture) {
      return res.status(404).json({ msg: "id not found" })
    }
    return res.status(200).json(lecture)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const updateLecture = async (req, res) => {
  const { id } = req.params

  try {
    const lecture = await prisma.lecture.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        ...req.body,
      },
    })
    return res.status(200).json(lecture)
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Something went wrong !! please recheck data" })
  }
}
const deleteLecture = async (req, res) => {
  const { id } = req.params
  try {
    const lecture = await prisma.lecture.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(200).json(lecture)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}

const getMembers = async (req, res) => {
  const { id } = req.params

  try {
    const members = await prisma.lecture_Students.findMany({
      where: {
        lecture_id: Number.parseInt(id),
      },
      select: {
        user: {
          select: { id: true, name: true },
        },
      },
    })
    return res.status(200).json(members)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const addMember = async (req, res) => {
  const { id } = req.params
  const { user_id } = req.body
  try {
    if (!user_id) {
      return res.status(400).json({ msg: "please provide user id" })
    }
    const isExists = await prisma.lecture_Students.findFirst({
      where: {
        lecture_id: Number.parseInt(id),
        user_id: user_id,
      },
    })
    if (isExists) {
      return res.status(400).json({ msg: "Already added to lecture" })
    }
    await prisma.lecture_Students.create({
      data: {
        lecture_id: Number.parseInt(id),
        user_id: user_id,
      },
    })
    return res.status(200).json({ msg: "student is added" })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const removeMember = async (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  try {
    await prisma.lecture_Students.deleteMany({
      where: {
        AND: [
          {
            lecture_id: Number.parseInt(id),
          },
          {
            user_id: user_id,
          },
        ],
      },
    })
    return res.status(200).json({ msg: "Student is removed from Lecture" })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getLectures,
  createLecture,
  getLecture,
  updateLecture,
  deleteLecture,
  addMember,
  removeMember,
  getMembers,
}
