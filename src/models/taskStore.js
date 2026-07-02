import { normalizeTaskInput, sortTasks } from "../utils/timeSlots.js";

let idCounter = 1;

function nextId() {
  const id = `task-${idCounter}`;
  idCounter += 1;
  return id;
}

export class TaskStore {
  constructor() {
    this.tasks = [];
  }

  list() {
    return sortTasks(this.tasks);
  }

  add(input) {
    const normalized = normalizeTaskInput(input);
    const task = {
      id: nextId(),
      ...normalized
    };
    this.tasks.push(task);
    return task;
  }

  update(id, input) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error("更新対象のタスクが見つかりません");
    }

    const normalized = normalizeTaskInput(input);
    this.tasks[index] = {
      ...this.tasks[index],
      ...normalized
    };
    return this.tasks[index];
  }

  remove(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index < 0) {
      throw new Error("削除対象のタスクが見つかりません");
    }
    const [removed] = this.tasks.splice(index, 1);
    return removed;
  }

  get(id) {
    return this.tasks.find((task) => task.id === id) || null;
  }
}

export function resetTaskIdsForTest() {
  idCounter = 1;
}