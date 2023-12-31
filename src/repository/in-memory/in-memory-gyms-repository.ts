import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

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

  async serachMany(gymName: string, page: number) {
    return this.items
      .filter((item) => item.title === gymName)
      .slice((page - 1) * 20, page * 20)
  }
}
