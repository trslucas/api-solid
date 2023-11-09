import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-users-repository'

import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let usersRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucassadsas@outlsssss.com',
      password_hash: await hash('12345', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Lucas Trindade')
  })

  it('should be not able to get user profile with wrong userId', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
