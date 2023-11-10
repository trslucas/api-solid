import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repository/in-memory/in-memory-users-repository'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to create Gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia Legal',
      description: null,
      phone: null,
      latitude: -22.9138352,
      longitude: -43.2374641,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
