const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getChats = async (req, res) => {
  try {
    let chats

    chats = await prisma.chat.findMany({
      where: {
        Members: {
          some: {
            user_id: req.user.id,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    })

    return res.status(200).json(chats)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const createChat = async (req, res) => {
  const { title } = req.body
  try {
    if (!title) {
      return res.status(400).json({ msg: "please provide all values" })
    }
    const chat = await prisma.chat.create({
      data: {
        title: title,
      },
    })
    if (chat) {
      await prisma.membersOfChat.create({
        data: {
          chat_id: chat.id,
          user_id: req.user.id,
          is_admin: true,
        },
      })
    }
    return res.status(201).json(chat)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const getChat = async (req, res) => {
  const { id } = req.params
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      select: {
        title: true,
        id: true,
        Members: {
          include: {
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
    if (!chat) {
      return res.status(404).json({ msg: "id not found" })
    }
    return res.status(200).json(chat)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const updateChat = async (req, res) => {
  const { id } = req.params
  const { title } = req.body

  try {
    const chat = await prisma.chat.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        ...req.body,
      },
    })
    return res.status(200).json(chat)
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Something went wrong !! please recheck data" })
  }
}
const deleteChat = async (req, res) => {
  const { id } = req.params
  try {
    const Chat = await prisma.Chat.delete({
      where: {
        id: Number.parseInt(id),
      },
    })
    return res.status(200).json(Chat)
  } catch (error) {
    return res.status(400).json({ msg: "something went wrong" })
  }
}

const getMembers = async (req, res) => {
  const { id } = req.params

  try {
    const members = await prisma.membersOfChat.findMany({
      where: {
        chat_id: Number.parseInt(id),
      },
      select: {
        user: {
          select: { id: true, name: true },
        },
        is_admin: true,
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
    const isExists = await prisma.membersOfChat.findFirst({
      where: {
        chat_id: Number.parseInt(id),
        user_id: user_id,
      },
    })
    if (isExists) {
      return res.status(400).json({ msg: "Already added to Chat" })
    }
    await prisma.membersOfChat.create({
      data: {
        chat_id: Number.parseInt(id),
        user_id: user_id,
      },
    })
    return res.status(200).json({ msg: "member is added" })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}
const removeMember = async (req, res) => {
  const { id } = req.params
  const { user_id } = req.body

  try {
    await prisma.membersOfChat.deleteMany({
      where: {
        AND: [
          {
            chat_id: Number.parseInt(id),
          },
          {
            user_id: user_id,
          },
        ],
      },
    })
    return res.status(200).json({ msg: "Student is removed from Chat" })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const sendMessage = async (req, res) => {
  const { id } = req.params
  const { text } = req.body
  const sender_id = req.user.id

  try {
    if (!text || !sender_id) {
      return res.status(400).json({ msg: "please provide all values" })
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        Members: true,
      },
    })

    if (!chat) {
      return res.status(404).json({ msg: "chat id not found" })
    }

    const member = chat.Members.find((item) => item.user_id == sender_id)

    if (!member) {
      return res.status(403).json({ msg: "you are not member of this chat" })
    }

    await prisma.message.create({
      data: {
        chat_id: Number.parseInt(id),
        sender_id: Number.parseInt(sender_id),
        message: text,
      },
    })

    return res.status(201).json({ msg: "sent" })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

const getMessages = async (req, res) => {
  const { id } = req.params
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        Members: true,
      },
    })

    if (!chat) {
      return res.status(404).json({ msg: "chat id not found" })
    }

    const member = chat.Members.find((item) => item.user_id == req.user.id)

    if (!member) {
      return res.status(403).json({ msg: "you are not member of this chat" })
    }

    const messages = await prisma.message.findMany({
      where: {
        chat_id: Number.parseInt(id),
      },
      include: {
        sender: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })
    return res.status(200).json(messages)
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getChats,
  createChat,
  getChat,
  updateChat,
  deleteChat,
  addMember,
  removeMember,
  getMembers,
  sendMessage,
  getMessages,
}
