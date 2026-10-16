import { describe, expect, it } from "vitest";

// A check that fails on purpose. It shows that a red run blocks a merge into main.
// This branch is closed without merging and the file never reaches main.
describe("CI gate check", () => {
  it("fails on purpose so the required check goes red", () => {
    expect(1 + 1).toBe(3);
  });
});
