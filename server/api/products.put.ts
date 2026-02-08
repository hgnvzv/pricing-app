import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  return await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      price: Number(body.price),              // تعديل السعر القديم
      wholesalePrice: Number(body.wholesalePrice) // إضافة/تعديل سعر الجملة
    }
  })
})