import test from "node:test";
import assert from "node:assert/strict";
import { TaskStore, resetTaskIdsForTest } from "../src/models/taskStore.js";

test("task store add/edit/delete flow", () => {
  resetTaskIdsForTest();
  const store = new TaskStore();

  const created = store.add({ name: "Morning standup", startTime: "09:00", endTime: "09:30" });
  assert.equal(created.id, "task-1");
  assert.equal(store.list().length, 1);

  const updated = store.update(created.id, {
    name: "Morning sync",
    startTime: "09:30",
    endTime: "10:00"
  });

  assert.equal(updated.name, "Morning sync");
  assert.equal(updated.startSlot, 4);

  const removed = store.remove(created.id);
  assert.equal(removed.id, "task-1");
  assert.equal(store.list().length, 0);
});

test("task store rejects invalid edits", () => {
  resetTaskIdsForTest();
  const store = new TaskStore();
  const created = store.add({ name: "Task", startTime: "08:00", endTime: "08:30" });

  assert.throws(() => {
    store.update(created.id, { name: "Task", startTime: "10:30", endTime: "10:00" });
  });
});