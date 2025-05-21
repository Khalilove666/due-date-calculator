import { describe, expect, it, test } from "vitest";
import { CalculateDueDate } from "../src/calculator";

describe("CalculateDueDate", () => {
  it('should throw "Invalid submit date/time" for hours outside of 9am-5pm on Weekdays', () => {
    expect(() => CalculateDueDate("2025-05-20T18:00:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  it('should throw "Invalid submit date/time" for hours outside of 9am-5pm on Weekdays', () => {
    expect(() => CalculateDueDate("2025-05-20T18:00:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  test('should throw "Invalid submit date/time" for Weekend', () => {
    expect(() => CalculateDueDate("2025-05-25T08:00:00Z", 8)).toThrow(
      "Invalid submit date/time"
    );
  });

  it("should return a valid due date", () => {
    expect(CalculateDueDate("2025-05-20T10:00:00Z", 8)).toEqual(
      "2025-05-21T10:00:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(CalculateDueDate("2025-05-20T16:45:00Z", 45)).toEqual(
      "2025-05-28T13:45:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(CalculateDueDate("2025-05-21T16:00:00Z", 102)).toEqual(
      "2025-06-09T14:00:00.000Z"
    );
  });

  it("should return a valid due date", () => {
    expect(CalculateDueDate("2025-05-21T16:00:00Z", 97)).toEqual(
      "2025-06-09T09:00:00.000Z"
    );
  });
});
