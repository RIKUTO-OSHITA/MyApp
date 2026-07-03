import { TaskStore } from "./models/taskStore.js";
import {
  DAY_END_TIME,
  DAY_START_TIME,
  SLOTS_PER_DAY,
  formatHourLabel,
  isHourSlot,
  listDayTimes,
  slotIndexToTime
} from "./utils/timeSlots.js";

const store = new TaskStore();

const timelineGrid = document.querySelector("#timeline-grid");
const taskCount = document.querySelector("#task-count");
const todayLabel = document.querySelector("#today-label");

const dialog = document.querySelector("#task-dialog");
const form = document.querySelector("#task-form");
const dialogTitle = document.querySelector("#dialog-title");
const taskIdInput = document.querySelector("#task-id");
const taskNameInput = document.querySelector("#task-name");
const startTimeInput = document.querySelector("#start-time");
const endTimeInput = document.querySelector("#end-time");
const formError = document.querySelector("#form-error");
const deleteButton = document.querySelector("#delete-button");

const addTaskButton = document.querySelector("#add-task-button");
const cancelButton = document.querySelector("#cancel-button");

function populateSelectOptions(selectEl, times, preferredValue) {
  selectEl.innerHTML = "";
  for (const time of times) {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    selectEl.append(option);
  }

  if (preferredValue && times.includes(preferredValue)) {
    selectEl.value = preferredValue;
  } else if (times.length > 0) {
    selectEl.value = times[0];
  }
}

function refreshEndTimeOptions(preferredEndTime) {
  const options = listDayTimes().filter((time) => time > startTimeInput.value);
  populateSelectOptions(endTimeInput, options, preferredEndTime);
}

function openCreateDialog(defaultStart = "09:00") {
  dialogTitle.textContent = "タスク追加";
  taskIdInput.value = "";
  taskNameInput.value = "";

  populateSelectOptions(startTimeInput, listDayTimes(), defaultStart);
  refreshEndTimeOptions();

  deleteButton.style.visibility = "hidden";
  formError.textContent = "";
  dialog.showModal();
}

function openEditDialog(taskId) {
  const task = store.get(taskId);
  if (!task) {
    return;
  }

  dialogTitle.textContent = "タスク編集";
  taskIdInput.value = task.id;
  taskNameInput.value = task.name;

  populateSelectOptions(startTimeInput, listDayTimes(), task.startTime);
  refreshEndTimeOptions(task.endTime);

  deleteButton.style.visibility = "visible";
  formError.textContent = "";
  dialog.showModal();
}

startTimeInput.addEventListener("change", () => {
  refreshEndTimeOptions(endTimeInput.value);
});

function createSlotRow(slotIndex) {
  const row = document.createElement("div");
  row.className = `slot-row ${isHourSlot(slotIndex) ? "is-hour" : "is-half"}`;
  row.dataset.slot = String(slotIndex);

  const label = document.createElement("div");
  label.className = "slot-label";
  label.textContent = formatHourLabel(slotIndex);

  const line = document.createElement("div");
  line.className = "slot-line";

  row.append(label, line);

  row.addEventListener("dblclick", () => {
    openCreateDialog(slotIndexToTime(slotIndex));
  });

  return row;
}

function taskLanes(tasks) {
  const lanes = [];
  const taskToLane = new Map();

  for (const task of tasks) {
    let placed = false;
    for (let i = 0; i < lanes.length; i += 1) {
      const lane = lanes[i];
      const overlaps = lane.some((other) => task.startSlot < other.endSlot && task.endSlot > other.startSlot);
      if (!overlaps) {
        lane.push(task);
        taskToLane.set(task.id, i);
        placed = true;
        break;
      }
    }

    if (!placed) {
      lanes.push([task]);
      taskToLane.set(task.id, lanes.length - 1);
    }
  }

  return {
    laneCount: Math.max(1, lanes.length),
    taskToLane
  };
}

function createTaskNode(task, laneIndex, laneCount) {
  const node = document.createElement("button");
  node.type = "button";
  node.className = "task-block";
  node.dataset.taskId = task.id;

  node.style.top = `${(task.startSlot / SLOTS_PER_DAY) * 100}%`;
  node.style.height = `${((task.endSlot - task.startSlot) / SLOTS_PER_DAY) * 100}%`;
  node.style.width = `calc(${100 / laneCount}% - 8px)`;
  node.style.left = `calc(${(100 / laneCount) * laneIndex}% + 4px)`;

  node.innerHTML = `
    <strong>${task.name}</strong>
    <span>${task.startTime} - ${task.endTime}</span>
  `;

  node.addEventListener("click", () => {
    openEditDialog(task.id);
  });

  return node;
}

function currentTimeFraction() {
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [startHours, startMinutes] = DAY_START_TIME.split(":").map(Number);
  const [endHours, endMinutes] = DAY_END_TIME.split(":").map(Number);
  const dayStart = startHours * 60 + startMinutes;
  const dayEnd = endHours * 60 + endMinutes;

  if (minutesNow < dayStart || minutesNow > dayEnd) {
    return null;
  }

  return (minutesNow - dayStart) / (dayEnd - dayStart);
}

function renderNowIndicator() {
  const fraction = currentTimeFraction();
  if (fraction === null) {
    return null;
  }

  const nowLine = document.createElement("div");
  nowLine.className = "now-line";
  nowLine.style.top = `${fraction * 100}%`;
  return nowLine;
}

function renderTimeline() {
  const tasks = store.list();

  timelineGrid.innerHTML = "";

  const slotLayer = document.createElement("div");
  slotLayer.className = "slot-layer";

  for (let slot = 0; slot < SLOTS_PER_DAY; slot += 1) {
    slotLayer.append(createSlotRow(slot));
  }

  const taskLayer = document.createElement("div");
  taskLayer.className = "task-layer";

  const { laneCount, taskToLane } = taskLanes(tasks);
  for (const task of tasks) {
    taskLayer.append(createTaskNode(task, taskToLane.get(task.id), laneCount));
  }

  timelineGrid.append(slotLayer, taskLayer);

  const nowLine = renderNowIndicator();
  if (nowLine) {
    timelineGrid.append(nowLine);
  }

  taskCount.textContent = `${tasks.length} tasks`;
}

function renderTodayLabel() {
  if (!todayLabel) {
    return;
  }

  const formatter = new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short"
  });
  todayLabel.textContent = formatter.format(new Date());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    name: taskNameInput.value,
    startTime: startTimeInput.value,
    endTime: endTimeInput.value
  };

  try {
    if (taskIdInput.value) {
      store.update(taskIdInput.value, payload);
    } else {
      store.add(payload);
    }
    dialog.close();
    renderTimeline();
  } catch (error) {
    formError.textContent = error.message;
  }
});

deleteButton.addEventListener("click", () => {
  const targetId = taskIdInput.value;
  if (!targetId) {
    return;
  }

  const confirmed = window.confirm("このタスクを削除しますか？");
  if (!confirmed) {
    return;
  }

  try {
    store.remove(targetId);
    dialog.close();
    renderTimeline();
  } catch (error) {
    formError.textContent = error.message;
  }
});

addTaskButton.addEventListener("click", () => {
  openCreateDialog();
});

cancelButton.addEventListener("click", () => {
  dialog.close();
});

renderTodayLabel();
renderTimeline();
window.setInterval(renderTimeline, 60000);