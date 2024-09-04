import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error';

// This class represents a custom error for request validation failures
export class RequestValidationError extends CustomError{
  statusCode = 400

  // The constructor takes an array of ValidationError objects
  constructor(public errors: ValidationError[]) {
    // Call the parent Error constructor
    super('Invalid parameters');

    // This line is necessary because we are extending a built-in class
    // It ensures that instanceof works correctly for this custom error
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map(error => {
      if ('path' in error) {
        return { message: error.msg, field: error.path };
      } else {
        return { message: error.msg };
      }
    });
  }
}
// 
// Explanation:
// 1. We define a custom error class named RequestValidationError that extends the built-in Error class.
// 2. The constructor takes an array of ValidationError objects as a parameter, which will contain details about validation failures.
// 3. We use the 'public' keyword in the constructor parameter to automatically create and initialize a public property 'errors'.
// 4. We call super() to properly initialize the parent Error class.
// 5. The Object.setPrototypeOf() call is a TypeScript-specific workaround to ensure proper prototype chain setup when extending built-in classes.
// 6. This custom error can be used to handle and format validation errors in a consistent way throughout the application.