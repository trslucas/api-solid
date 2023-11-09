import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'
import { UserAlreadyExistisError } from '@/use-cases/errors/user-already-exists-error'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const prismaUserRepository = new PrismaUserRepository()

    const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository)
    await authenticateUseCase.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }

  reply.status(200).send()
}
