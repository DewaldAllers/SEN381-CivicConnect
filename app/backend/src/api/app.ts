import fs from "node:fs";

import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { AppError } from "../application/errors.js";
import { type RequestApplication } from "../application/request-application.js";
import { hashPassword, verifyPassword } from "../auth/passwords.js";
import { authenticate, principalOf } from "../auth/middleware.js";
import { type SessionStore } from "../auth/sessions.js";
import { type UserDirectory } from "../auth/user-directory.js";

export interface AppDependencies {
  requests: RequestApplication;
  directory: UserDirectory;
  sessions: SessionStore;
  /** Reported by /health so a deployed build can be matched to a commit or tag. */
  version: string;
  /** Folder holding the HTML, CSS and JavaScript pages. Omitted when there is no client to serve. */
  frontendDir?: string;
}

const text = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const param = (req: Request, name: string): string => {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : (value ?? "");
};

const bodyOf = (req: Request): Record<string, unknown> =>
  req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};

/** Compared against when the username is unknown, so unknown users cost the same time as wrong passwords. */
const unknownUserHash = hashPassword("not-a-real-password");

export function createApp(deps: AppDependencies) {
  const { requests, directory, sessions } = deps;
  const app = express();

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
  });
  app.use(express.json());

  const api = express.Router();
  api.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  // ---- Public ----

  api.get("/health", (_req, res) => {
    res.json({ data: { status: "ok", version: deps.version } });
  });

  api.post("/session", async (req, res) => {
    const body = bodyOf(req);
    const user = directory.findByUsername(text(body.username) ?? "");
    const matches = await verifyPassword(
      text(body.password) ?? "",
      user?.passwordHash ?? (await unknownUserHash)
    );
    if (!user || !matches) {
      throw new AppError(401, "Wrong username or password");
    }
    const token = sessions.create(user.id);
    res.json({ data: { token, user: { id: user.id, name: user.name, role: user.role } } });
  });

  // ---- Everything below needs a signed-in user ----

  api.use(authenticate(directory, sessions));

  api.delete("/session", (_req, res) => {
    sessions.revoke(res.locals.token as string);
    res.json({ data: { signedOut: true } });
  });

  api.get("/categories", (_req, res) => {
    res.json({ data: requests.categories() });
  });

  api.post("/requests", async (req, res) => {
    res.status(201).json({ data: await requests.submit(principalOf(res), bodyOf(req)) });
  });

  // Fixed paths are registered before `/requests/:id` so they are not read as references.
  api.get("/requests/mine", async (_req, res) => {
    res.json({ data: await requests.listMine(principalOf(res)) });
  });

  api.get("/requests", async (req, res) => {
    res.json({
      data: await requests.listQueue(principalOf(res), {
        categoryId: text(req.query.categoryId),
        status: text(req.query.status),
        sort: text(req.query.sort),
      }),
    });
  });

  api.get("/staff", async (req, res) => {
    res.json({ data: await requests.listStaff(principalOf(res), text(req.query.categoryId)) });
  });

  api.get("/management/summary", async (req, res) => {
    res.json({
      data: await requests.summary(principalOf(res), {
        categoryId: text(req.query.categoryId),
        status: text(req.query.status),
      }),
    });
  });

  api.get("/management/requests", async (req, res) => {
    res.json({
      data: await requests.managementList(principalOf(res), {
        categoryId: text(req.query.categoryId),
        status: text(req.query.status),
        bucket: text(req.query.bucket),
      }),
    });
  });

  api.get("/requests/:id", async (req, res) => {
    res.json({ data: await requests.getRequest(principalOf(res), param(req, "id")) });
  });

  api.get("/requests/:id/history", async (req, res) => {
    res.json({ data: await requests.history(principalOf(res), param(req, "id")) });
  });

  api.post("/requests/:id/assign", async (req, res) => {
    res.json({
      data: await requests.assign(principalOf(res), param(req, "id"), bodyOf(req)),
    });
  });

  api.patch("/requests/:id/status", async (req, res) => {
    res.json({
      data: await requests.changeStatus(principalOf(res), param(req, "id"), bodyOf(req)),
    });
  });

  api.post("/requests/:id/notes", async (req, res) => {
    res
      .status(201)
      .json({ data: await requests.addNote(principalOf(res), param(req, "id"), bodyOf(req)) });
  });

  api.patch("/requests/:id/due-date", async (req, res) => {
    res.json({
      data: await requests.setDueDate(principalOf(res), param(req, "id"), bodyOf(req)),
    });
  });

  api.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use("/api/v1", api);

  // ---- The pages (plain HTML, CSS and JavaScript) ----

  if (deps.frontendDir && fs.existsSync(deps.frontendDir)) {
    // The stand-in server and the notes in the client folder are not pages.
    app.use((req, res, next) => {
      if (/\.(mjs|md)$/i.test(req.path)) {
        res.status(404).end();
        return;
      }
      next();
    });
    app.use(express.static(deps.frontendDir));
  }

  // ---- Errors ----

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res
        .status(err.status)
        .json({ error: err.message, ...(err.fields && { fields: err.fields }), ...(err.code && { code: err.code }) });
      return;
    }
    const type = (err as { type?: string } | null)?.type;
    if (type === "entity.parse.failed") {
      res.status(400).json({ error: "Malformed JSON" });
      return;
    }
    if (type === "entity.too.large") {
      res.status(413).json({ error: "Request body too large" });
      return;
    }
    // Log the message only: never request bodies, tokens or passwords.
    console.error("Unhandled error:", err instanceof Error ? err.message : "unknown");
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
