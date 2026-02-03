import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // البحث عن المستخدم
  const user = await prisma.user.findUnique({
    where: { username: body.username }
  })

  // التحقق من وجود المستخدم وصحة كلمة المرور
  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'بيانات الدخول غير صحيحة' })
  }

  // إرجاع بيانات المستخدم (بدون كلمة المرور)
  const userData = {
    id: user.id,
    username: user.username,
    role: user.role
  }
  
  // Set session cookie
  setCookie(event, 'auth-session', JSON.stringify(userData), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: true,
    path: '/'
  })
  
  return userData
})