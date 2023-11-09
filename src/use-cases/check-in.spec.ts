import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import exp from 'constants'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
    })
    console.log(checkIn.created_at)
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
    })

    await expect(() =>
      sut.execute({
        gymId: '123a123',
        userId: '213432',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 8, 13, 0, 0))
    await sut.execute({
      gymId: '123a123',
      userId: '213432',
    })
    vi.setSystemTime(new Date(2023, 0, 9, 13, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: '123a123',
      userId: '213432',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
