import test from "node:test";
import assert from "node:assert/strict";
import { TaskStore, resetTaskIdsForTest } from "../src/models/taskStore.js";

test("scheduler interaction flow reflects CRUD in list state", () => {
  resetTaskIdsForTest();
  const store = new TaskStore();

  const taskA = store.add({ name: "Design", startTime: "10:00", endTime: "11:00" });
  const taskB = store.add({ name: "Review", startTime: "10:30", endTime: "11:30" });

  let tasks = store.list();
  assert.equal(tasks.length, 2);
  assert.equal(tasks[0].id, taskA.id);

  store.update(taskB.id, { name: "Code Review", startTime: "11:30", endTime: "12:00" });
  tasks = store.list();
  assert.equal(tasks[1].name, "Code Review");

  store.remove(taskA.id);
  tasks = store.list();
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, taskB.id);
});

test("invalid input scenario is rejected", () => {
  resetTaskIdsForTest();
  const store = new TaskStore();

  assert.throws(() => {
    store.add({ name: "", startTime: "12:00", endTime: "12:30" });
  });
});