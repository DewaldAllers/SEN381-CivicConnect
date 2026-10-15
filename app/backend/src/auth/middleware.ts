import { type NextFunction, type Request, type Response } from "express";

import { UnauthorizedError } from "../application/errors.js";
import { type SessionStore } from "./sessions.js";
import { type User, type UserDirectory } from "./user-directory.js";

/** Reads `Authorization: Bearer <token>`, resolves it to a live session, and attaches the user. */
export function authenticate(directory: UserDirectory, sessions: SessionStore) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    const userId = token ? sessions.resolve(token) : undefined;
    const user = userId ? directory.findById(userId) : undefined;
    if (!user) {
      next(new UnauthorizedError());
      return;
    }
    res.locals.principal = user;
    res.locals.token = token;
    next();
  };
}

export function principalOf(res: Response): User {
  return res.locals.principal as User;
}
