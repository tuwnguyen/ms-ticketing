
export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string){
    super(message)

    // This line is necessary when extending built-in classes in TypeScript
    // It ensures that the instanceof operator works correctly with our custom error
    // Without this, JavaScript's prototypal inheritance chain would be broken
    // This is because TypeScript's class inheritance doesn't work perfectly with built-in classes like Error
    // By explicitly setting the prototype, we maintain the correct prototype chain
    // This allows us to use instanceof NotFoundError correctly in our error handling middleware
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string, field?: string }[]
}