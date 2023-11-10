import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    gymsRepository.items.push({
      id: '123a123',
      title: 'Lucas Trindade Services',
      phone: '',
      description: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: 0,
      userLongitude: 0,
    })
    console.log(checkIn.created_at)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: '123a123',
        userId: '213432',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: 0,
      userLongitude: 0,
    })
    vi.setSystemTime(new Date(2023, 0, 9, 13, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
