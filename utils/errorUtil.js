class ErrorUtil extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // This property is used to determine if the error is operational or not (operational errors are errors that are caused by the user)

    Error.captureStackTrace(this, this.constructor); // This line of code is used to capture the stack trace of the error (the line of code where the error occurred)
  }
}

module.exports = ErrorUtil;