import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { Checkin } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'
import { GymsRepository } from '@/repository/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfChekinInError } from './errors/max-number-of-check-ins-error'

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
    userLatitude,
    userLongitude,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfChekinInError()
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
