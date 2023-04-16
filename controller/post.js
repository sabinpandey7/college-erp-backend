const { PrismaClient } = require("@prisma/client")
const fs = require("fs")
const prisma = new PrismaClient()

const getPosts = async (req, res) => {
  const { page } = req.query

  try {
    const counts = await prisma.post.count()
    const pageNo = Number.parseInt(page) || 1
    const limit = 2
    const totalPage = Math.ceil(counts / limit)
    if (pageNo > totalPage) {
      return res.status(404).json({ msg: "Page not found" })
    }
    let posts = await prisma.post.findMany({
      skip: (pageNo - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            branch: true,
            department: true,
          },
        },
      },
    })

    posts = posts.map((post) => ({
      ...post,
      image: post.image && `${req.protocol}://${req.headers.host}${post.image}`,
    }))

    return res.status(200).json({ posts, totalPage, page: pageNo })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const createPost = async (req, res) => {
  const { description } = req.body
  try {
    if (!description && !req.file) {
      return res
        .status(400)
        .json({ msg: "please at least description or image" })
    }
    const post = await prisma.post.create({
      data: {
        image: req.file?.filename,
        description: description,
        author_id: req.user.id,
      },
    })
    return res.status(201).json(post)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            branch: true,
            department: true,
          },
        },
      },
    })
    if (!post) {
      return res.status(404).json({ msg: "id not found" })
    }
    const imageUrl =
      post.image && `${req.protocol}://${req.headers.host}${post.image}`
    return res.status(200).json({ ...post, image: imageUrl })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
// const updatePost = async (req, res) => {
//   return res.send("update Post")
// }
const deletePost = async (req, res) => {
  const { id } = req.params

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number.parseInt(id),
      },
    })
    if (!post) {
      return res.status(404).json({ msg: "id not found" })
    }

    if (post.author_id != req.user.id) {
      return res.status(403).json({ msg: "permission denied" })
    }

    if (post.image) {
      fs.unlinkSync("uploads" + post.image)
    }
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(200).json(deletedPost)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getPosts,
  createPost,
  getPost,
  deletePost,
}
