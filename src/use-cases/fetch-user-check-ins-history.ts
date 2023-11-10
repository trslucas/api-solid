import { Checkin } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'

interface FetchUserCheckinHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckinHistoryUseCaseResponse {
  checkIns: Checkin[]
}

export class FetchUserCheckinHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckinHistoryUseCaseRequest): Promise<FetchUserCheckinHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
