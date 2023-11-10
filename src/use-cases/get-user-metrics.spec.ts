import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repository/in-memory/in-memory-check-ins-repository'

import { GetUserCheckinMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserCheckinMetricsUseCase

describe('Fetch User Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserCheckinMetricsUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: '123a123',
    //   title: 'Academia Legal',
    //   description: null,
    //   phone: null,
    //   latitude: -27.2092052,
    //   longitude: -49.6401091,
    // })
  })

  it('should be able to get the number of all user check-ins', async () => {
    await checkInsRepository.create({
      gym_Id: 'gym-01',
      user_id: '213432',
    })
    await checkInsRepository.create({
      gym_Id: 'gym-02',
      user_id: '213432',
    })
    const { checkInsCount } = await sut.execute({
      userId: '213432',
    })
    expect(checkInsCount).toEqual(2)
  })
})
