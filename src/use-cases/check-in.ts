import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { Checkin } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'
import { GymsRepository } from '@/repository/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckinUseCaseResponse {
  checkIn: Checkin
}

export class CheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }
    const checkIn = await this.checkInsRepository.create({
      gym_Id: gymId,
      user_id: userId,
    })

    if (!checkIn) {
      throw new InvalidCredentialsError()
    }

    return {
      checkIn,
    }
  }
}
