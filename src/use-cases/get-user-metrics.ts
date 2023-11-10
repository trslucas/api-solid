import { CheckInsRepository } from '@/repository/check-ins-repository'

interface GetUserCheckinMetricsUseCaseRequest {
  userId: string
}

interface GetUserCheckinMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserCheckinMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserCheckinMetricsUseCaseRequest): Promise<GetUserCheckinMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
