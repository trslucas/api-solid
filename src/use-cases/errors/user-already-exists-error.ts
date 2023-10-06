export class UserAlreadyExistisError extends Error {
  constructor() {
    super('Email Already exists')
  }
}
