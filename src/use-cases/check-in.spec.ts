import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfChekinInError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: '123a123',
      title: 'Academia Legal',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        gymId: '123a123',
        userId: '213432',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfChekinInError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })
    vi.setSystemTime(new Date(2023, 0, 9, 13, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in dinstant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript-Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: '213432',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
