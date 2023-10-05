import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUserCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUserCase({ name, email, password })
  } catch (error) {
    return reply.status(409).send()
  }

  reply.status(201).send()
}
