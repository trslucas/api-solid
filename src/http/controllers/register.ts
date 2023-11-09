import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistisError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUserCase = makeRegisterUseCase()
    await registerUserCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistisError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }

  reply.status(201).send()
}
