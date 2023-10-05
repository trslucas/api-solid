import { prisma } from '@/lib/prisma'
import { PrismaUserRepository } from '@/repository/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUserCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already in use')
  }

  const prismaUserRepository = new PrismaUserRepository()

  await prismaUserRepository.create({
    name,
    email,
    password_hash,
  })
}
