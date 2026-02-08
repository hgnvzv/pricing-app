import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  return await prisma.product.create({
    data: {
      name: body.name,
      price: Number(body.price),               // نستخدم price بدلاً من retailPrice
      wholesalePrice: Number(body.wholesalePrice) || 0
    }
  })
})