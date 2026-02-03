import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // تشفير كلمة المرور قبل الحفظ
  const hashedPassword = await bcrypt.hash(body.password, 10)

  try {
    return await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
        role: body.role
      }
    })
  } catch (e) {
    throw createError({ statusCode: 400, statusMessage: 'اسم المستخدم موجود مسبقاً' })
  }
})