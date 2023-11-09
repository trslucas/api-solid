import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-users-repository'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password: '12345',
    })

    const isUserPasswordCorrectlyHashed = await compare(
      '12345',
      user.password_hash,
    )

    expect(isUserPasswordCorrectlyHashed).toBe(true)
  })

  it('should be not able to register with a exists email', async () => {
    const email = 'trslucas@outlook.com'
    await sut.execute({
      name: 'Lucas Trindade',
      email,
      password: '12345',
    })

    await expect(() =>
      sut.execute({
        name: 'Lucas Trindade',
        email,
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistisError)
  })
})
