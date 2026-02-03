import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getQuery } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = query.search as string

  // إذا كان هناك بحث، فلتر النتائج، وإلا اجلب الكل
  if (search) {
    return await prisma.product.findMany({
      where: {
        name: {
          contains: search
        }
      }
    })
  }
  return await prisma.product.findMany()
})