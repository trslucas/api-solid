import { UsersRepository } from '@/repository/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistisError()
    }

    await this.userRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
