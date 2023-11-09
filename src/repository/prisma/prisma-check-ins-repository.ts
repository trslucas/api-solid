import { Checkin, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin> {
    return {
      gym_Id: data.gym_Id,
      user_id: data.user_id,
    }
  }
}
