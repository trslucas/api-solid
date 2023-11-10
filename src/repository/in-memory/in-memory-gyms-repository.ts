import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    if (!gymId) {
      throw new Error('Gym Id not found!')
    }

    const gym = this.items.find((item) => item.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }
}
