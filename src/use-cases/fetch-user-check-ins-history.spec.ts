import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repository/in-memory/in-memory-check-ins-repository'

import { FetchUserCheckinHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckinHistoryUseCase

describe('Get User Metrics Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new FetchUserCheckinHistoryUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: '123a123',
    //   title: 'Academia Legal',
    //   description: null,
    //   phone: null,
    //   latitude: -27.2092052,
    //   longitude: -49.6401091,
    // })
  })

  it('should be able to fetch user check-ins history', async () => {
    await checkInsRepository.create({
      gym_Id: 'gym-01',
      user_id: '213432',
    })
    await checkInsRepository.create({
      gym_Id: 'gym-02',
      user_id: '213432',
    })
    const { checkIns } = await sut.execute({
      userId: '213432',
      page: 1,
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: 'gym-01' }),
      expect.objectContaining({ gym_Id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_Id: `gym-${i}`,
        user_id: '213432',
      })
    }

    const { checkIns } = await sut.execute({
      userId: '213432',
      page: 2,
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: 'gym-21' }),
      expect.objectContaining({ gym_Id: 'gym-22' }),
    ])
  })
})
