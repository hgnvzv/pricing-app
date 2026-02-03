import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        // Don't return password
      }
    })
    return users
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'حدث خطأ في جلب المستخدمين' })
  }
})