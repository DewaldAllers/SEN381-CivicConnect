import { afterEach } from "vitest";
import { repositoryApp } from "./helpers/repository-app.js";
import { describeRequestRepositoryContract } from "./request-repository.contract.js";

let fixture: Awaited<ReturnType<typeof repositoryApp>> | undefined;
afterEach(async () => { await fixture?.close(); });
describeRequestRepositoryContract("PostgreSQL", async () => {
  fixture = await repositoryApp("postgres");
  return fixture.repository;
});
