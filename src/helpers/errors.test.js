// errors.test.js
import { formatError } from "./errors";

describe("formatError", () => {
  test("should format instance error correctly", () => {
    const input = "instance.username is required";
    const expectedOutput = "Your username is invalid";
    expect(formatError(input)).toBe(expectedOutput);
  });

  test("should format duplicated username error correctly", () => {
    const input = "Duplicated username";
    const expectedOutput = "The username is already taken.";
    expect(formatError(input)).toBe(expectedOutput);
  });

  test("should return default error message for unknown errors", () => {
    const input = "Some other error message";
    const expectedOutput = "Please use valid data!";
    expect(formatError(input)).toBe(expectedOutput);
  });
});
