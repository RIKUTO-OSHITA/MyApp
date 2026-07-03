import test from "node:test";
import assert from "node:assert/strict";
import { listDayTimes, normalizeTaskInput, slotIndexToTime, timeToSlotIndex } from "../src/utils/timeSlots.js";

test("timeToSlotIndex converts 30-minute aligned time within the 07:30-18:00 range", () => {
  assert.equal(timeToSlotIndex("07:30"), 0);
  assert.equal(timeToSlotIndex("09:30"), 4);
  assert.equal(timeToSlotIndex("18:00"), 21);
});

test("timeToSlotIndex rejects times outside 07:30-18:00", () => {
  assert.throws(() => timeToSlotIndex("07:00"));
  assert.throws(() => timeToSlotIndex("18:30"));
});

test("slotIndexToTime converts slot index back to time", () => {
  assert.equal(slotIndexToTime(0), "07:30");
  assert.equal(slotIndexToTime(4), "09:30");
  assert.equal(slotIndexToTime(21), "18:00");
});

test("normalizeTaskInput validates order and required fields", () => {
  const normalized = normalizeTaskInput({
    name: "Focus",
    startTime: "10:00",
    endTime: "11:30"
  });

  assert.equal(normalized.startSlot, timeToSlotIndex("10:00"));
  assert.equal(normalized.endSlot, timeToSlotIndex("11:30"));
  assert.throws(() => normalizeTaskInput({ name: "", startTime: "10:00", endTime: "10:30" }));
  assert.throws(() => normalizeTaskInput({ name: "A", startTime: "10:00", endTime: "10:00" }));
  assert.throws(() => normalizeTaskInput({ name: "A", startTime: "10:05", endTime: "10:30" }));
  assert.throws(() => normalizeTaskInput({ name: "A", startTime: "06:30", endTime: "07:30" }));
  assert.throws(() => normalizeTaskInput({ name: "A", startTime: "17:30", endTime: "18:30" }));
});

test("normalizeTaskInput accepts 15-minute aligned times", () => {
  const normalized = normalizeTaskInput({
    name: "Quick sync",
    startTime: "10:15",
    endTime: "10:45"
  });

  assert.equal(normalized.startTime, "10:15");
  assert.equal(normalized.endTime, "10:45");
  assert.equal(normalized.startSlot, timeToSlotIndex("10:15"));
  assert.equal(normalized.endSlot, timeToSlotIndex("10:45"));
});

test("listDayTimes lists every 15-minute time within the day range", () => {
  const times = listDayTimes();

  assert.equal(times.length, 43);
  assert.equal(times[0], "07:30");
  assert.equal(times[1], "07:45");
  assert.equal(times[times.length - 1], "18:00");
  assert.ok(times.includes("10:15"));
  assert.ok(!times.includes("10:05"));
});
