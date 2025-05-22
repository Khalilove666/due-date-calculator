import { describe, expect, it, test } from "vitest";
import {
  calculateDueDate,
  validateSubmitDate,
  validateTurnaroundTime,
} from "../src/calculator";

describe("calculateDueDate", () => {
  it("should add 1 day", () => {
    expect(calculateDueDate("2025-05-20T10:00:00Z", 8)).toEqual(
      "2025-05-21T10:00:00.000Z"
    );
  });

  it("should handle adding a weekend and extra hours", () => {
    expect(calculateDueDate("2025-05-20T16:45:00Z", 45)).toEqual(
      "2025-05-28T13:45:00.000Z"
    );
  });

  it("should handle adding several weeks: 102 hours difference", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 102)).toEqual(
      "2025-06-09T14:00:00.000Z"
    );
  });

  it("should return 9:00 as due not 17:00", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 97)).toEqual(
      "2025-06-09T09:00:00.000Z"
    );
  });

  it("should handle partial hours: 0.5 hour", () => {
    expect(calculateDueDate("2025-05-21T16:00:00Z", 8.5)).toEqual(
      "2025-05-22T16:30:00.000Z"
    );
  });
});

describe("validateSubmitDate", () => {
  it('should throw "Invalid date format. Date must be in ISO8601 format" for empty date string', () => {
    expect(() => validateSubmitDate("")).toThrow(
      "Invalid date format. Date must be in ISO8601 format."
    );
  });

  it('should throw "Invalid date format. Date must be in ISO8601 format." for "March 15, 2025"', () => {
    expect(() => validateSubmitDate("March 15, 2025")).toThrow(
      "Invalid date format. Date must be in ISO8601 format."
    );
  });

  it('should throw "Invalid date format. Date must be in ISO8601 format." for "March 15, 2025 14:30:00"', () => {
    expect(() => validateSubmitDate("March 15, 2025 14:30:00")).toThrow(
      "Invalid date format. Date must be in ISO8601 format."
    );
  });

  it('should throw "Invalid submit date/time." after 5pm on Weekdays', () => {
    expect(() => validateSubmitDate("2025-05-20T17:00:00Z")).toThrow(
      "Invalid submit date/time."
    );
  });

  it('should throw "Invalid submit date/time." before 9am on Weekdays', () => {
    expect(() => validateSubmitDate("2025-05-20T08:59:00Z")).toThrow(
      "Invalid submit date/time."
    );
  });

  test('should throw "Invalid submit date/time." for Weekend', () => {
    expect(() => validateSubmitDate("2025-05-25T10:00:00Z")).toThrow(
      "Invalid submit date/time."
    );
  });
});

describe("validateTurnaroundTime", () => {
  it('should throw "Invalid turnaround time. Turnaround time must be positive number"', () => {
    expect(() => validateTurnaroundTime(-8)).toThrow(
      "Invalid turnaround time. Turnaround time must be positive number."
    );
  });

  it("does not throw error on positive hours", () => {
    expect(() => validateTurnaroundTime(5)).not.toThrow();
  });
});
