import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repository/gyms-repository'

interface SearchGymUseCaseRequest {
  query: string
  page: number
}

interface SearchGymUserCaseResponse {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymUseCaseRequest): Promise<SearchGymUserCaseResponse> {
    const gyms = await this.gymsRepository.serachMany(query, page)

    return {
      gyms,
    }
  }
}
