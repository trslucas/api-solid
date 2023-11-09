import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const prismaUserRepository = new PrismaUserRepository()

  const registerUserCase = new RegisterUseCase(prismaUserRepository)

  return registerUserCase
}
