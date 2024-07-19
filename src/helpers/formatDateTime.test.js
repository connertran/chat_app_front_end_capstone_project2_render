// formatDateTime.test.js
import { formatDateTime } from "./formatDateTime";

describe("formatDateTime", () => {
  test("should format ISO string correctly", () => {
    const input = "2024-07-16T10:30:00Z";
    const expectedOutput = "10:30 07/16/24";
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  test("should handle midnight correctly", () => {
    const input = "2024-07-16T00:00:00Z";
    const expectedOutput = "00:00 07/16/24";
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  test("should handle different timezones correctly", () => {
    const input = "2024-07-16T18:45:00Z";
    const expectedOutput = "18:45 07/16/24";
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  test("should handle dates near year transition correctly", () => {
    const input = "2023-12-31T23:59:59Z";
    const expectedOutput = "23:59 12/31/23";
    expect(formatDateTime(input)).toBe(expectedOutput);
  });

  test("should handle leap year correctly", () => {
    const input = "2020-02-29T12:00:00Z";
    const expectedOutput = "12:00 02/29/20";
    expect(formatDateTime(input)).toBe(expectedOutput);
  });
});
