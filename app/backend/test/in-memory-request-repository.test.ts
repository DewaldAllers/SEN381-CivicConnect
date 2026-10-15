import { InMemoryRequestRepository } from "../src/persistence/in-memory-request-repository.js";
import { describeRequestRepositoryContract } from "./request-repository.contract.js";

describeRequestRepositoryContract("in-memory", async () => new InMemoryRequestRepository());
