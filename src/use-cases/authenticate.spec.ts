import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let usersRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({
      email: 'trslucassadsas@outlsssss.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be not able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'trslucas@dasdasd.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be not able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password_hash: await hash('12345', 6),
    })

    expect(() =>
      sut.execute({
        email: 'trslucassadsas@outlsssss.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
