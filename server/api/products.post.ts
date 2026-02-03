import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.product.create({
    data: {
      name: body.name,
      price: parseFloat(body.price)
    }
  })
})