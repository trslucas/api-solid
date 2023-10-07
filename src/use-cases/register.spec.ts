import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-users-repository'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserCase.execute({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password: '12345',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUserCase.execute({
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
    const usersRepository = new InMemoryUserRepository()
    const registerUserCase = new RegisterUseCase(usersRepository)

    const email = 'trslucas@outlook.com'
    await registerUserCase.execute({
      name: 'Lucas Trindade',
      email,
      password: '12345',
    })

    expect(() =>
      registerUserCase.execute({
        name: 'Lucas Trindade',
        email,
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistisError)
  })
})
