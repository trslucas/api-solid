export class MaxNumberOfChekinInError extends Error {
  constructor() {
    super('Max number of check-ins reached')
  }
}
