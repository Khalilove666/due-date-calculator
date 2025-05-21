import { describe, expect, it, test } from "vitest";
import { calculateDueDate, validateInput } from "../src/calculator";

describe("calculateDueDate", () => {
  it('should throw "Invalid submit date/time" for hours outside of 9am-5pm on Weekdays', () => {
    expect(() => calculateDueDate("2025-05-20T17:00:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  it('should throw "Invalid submit date/time" for hours outside of 9am-5pm on Weekdays', () => {
    expect(() => calculateDueDate("2025-05-20T08:59:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  test('should throw "Invalid submit date/time" for Weekend', () => {
    expect(() => calculateDueDate("2025-05-25T08:00:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  it("should return a valid due date", () => {
    expect(calculateDueDate("2025-05-20T10:00:00Z", 8)).toEqual(
      "2025-05-21T10:00:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(calculateDueDate("2025-05-20T16:45:00Z", 45)).toEqual(
      "2025-05-28T13:45:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 102)).toEqual(
      "2025-06-09T14:00:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 97)).toEqual(
      "2025-06-09T09:00:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 8.5)).toEqual(
      "2025-05-22T16:30:00.000Z"
    );
  });
});

describe("validateInput", () => {
  it('should throw "Invalid date format. Date must be in ISO8601 format', () => {
    expect(() => validateInput("", 8)).toThrow(
      "Invalid date format. Date must be in ISO8601 format"
    );
  });

  it('should throw "Invalid date format. Date must be in ISO8601 format', () => {
    expect(() => validateInput("March 15, 2025", 8)).toThrow(
      "Invalid date format. Date must be in ISO8601 format"
    );
  });

  it('should throw "Invalid date format. Date must be in ISO8601 format', () => {
    expect(() => validateInput("March 15, 2025 14:30:00", 8)).toThrow(
      "Invalid date format. Date must be in ISO8601 format"
    );
  });

  it('should throw "Invalid turnaround time. Turnaround time must be positive number"', () => {
    expect(() => validateInput("2025-05-25T08:00:00Z", -8)).toThrow(
      "Invalid turnaround time. Turnaround time must be positive number"
    );
  });

  it("does not throw on valid ISO8601 date and positive hours", () => {
    expect(() => validateInput("2025-05-21T10:00:00Z", 5)).not.toThrow();
  });
});
