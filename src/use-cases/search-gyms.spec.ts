import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymUseCase(gymsRepository)

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
    await gymsRepository.create({
      id: 'gym-1',
      title: 'Legal',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    await gymsRepository.create({
      id: 'gym-2',
      title: 'Triste',
      description: null,
      phone: null,
      latitude: -27.209202,
      longitude: -49.6401081,
    })
    const { gyms } = await sut.execute({
      query: 'Legal',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Legal' })])
  })

  it.skip('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.209202,
        longitude: -49.6401081,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
