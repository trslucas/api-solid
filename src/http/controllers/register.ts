import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUserRepository = new PrismaUserRepository()

    const registerUserCase = new RegisterUseCase(prismaUserRepository)
    await registerUserCase.execute({ name, email, password })
  } catch (error) {
    return reply.status(409).send()
  }

  reply.status(201).send()
}
