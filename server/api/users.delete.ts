import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    // Don't allow deleting the last admin
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    })
    
    const userToDelete = await prisma.user.findUnique({
      where: { id: body.id }
    })
    
    if (userToDelete?.role === 'admin' && adminCount <= 1) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: 'لا يمكن حذف المدير الوحيد في النظام' 
      })
    }
    
    await prisma.user.delete({
      where: { id: body.id }
    })
    
    return { success: true, message: 'تم حذف المستخدم بنجاح' }
  } catch (e: any) {
    if (e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'المستخدم غير موجود' })
    }
    throw e
  }
})