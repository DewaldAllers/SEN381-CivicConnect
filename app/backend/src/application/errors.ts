/** Errors the API layer turns into HTTP responses. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields?: Record<string, string>,
    readonly code?: string
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Not signed in") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super(403, "Forbidden");
  }
}

/** Also used for requests outside the caller's scope, so a reference alone reveals nothing (NFR-001). */
export class NotFoundError extends AppError {
  constructor(message = "Request not found") {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, fields?: Record<string, string>) {
    super(400, message, fields);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(409, message, undefined, code);
  }
}
