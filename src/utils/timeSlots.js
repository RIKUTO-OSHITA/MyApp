export const SLOT_MINUTES = 30;
export const DAY_START_TIME = "07:30";
export const DAY_END_TIME = "18:00";

function isTimeFormat(value) {
  return /^([01]\d|2[0-3]):(00|30)$/.test(value);
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

const DAY_START_MINUTES = timeToMinutes(DAY_START_TIME);
const DAY_END_MINUTES = timeToMinutes(DAY_END_TIME);

export const SLOTS_PER_DAY = (DAY_END_MINUTES - DAY_START_MINUTES) / SLOT_MINUTES;

export function timeToSlotIndex(time) {
  if (!isTimeFormat(time)) {
    throw new Error("Time must be in HH:MM format aligned to 30 minutes");
  }

  const minutes = timeToMinutes(time);
  if (minutes < DAY_START_MINUTES || minutes > DAY_END_MINUTES) {
    throw new Error(`時刻は${DAY_START_TIME}〜${DAY_END_TIME}の範囲で入力してください`);
  }

  return (minutes - DAY_START_MINUTES) / SLOT_MINUTES;
}

export function slotIndexToTime(slotIndex) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > SLOTS_PER_DAY) {
    throw new Error("Slot index out of bounds");
  }

  return minutesToTime(DAY_START_MINUTES + slotIndex * SLOT_MINUTES);
}

export function formatHourLabel(slotIndex) {
  const time = slotIndexToTime(slotIndex);
  return time.endsWith(":00") ? time : "";
}

export function isHourSlot(slotIndex) {
  return slotIndexToTime(slotIndex).endsWith(":00");
}

export function normalizeTaskInput(input) {
  const name = String(input.name || "").trim();
  const startTime = String(input.startTime || "");
  const endTime = String(input.endTime || "");

  if (!name) {
    throw new Error("タスク名は必須です");
  }
  if (!isTimeFormat(startTime) || !isTimeFormat(endTime)) {
    throw new Error("時刻は30分単位で入力してください");
  }

  const startSlot = timeToSlotIndex(startTime);
  const endSlot = timeToSlotIndex(endTime);

  if (startSlot >= endSlot) {
    throw new Error("終了時刻は開始時刻より後にしてください");
  }

  return {
    name,
    startTime,
    endTime,
    startSlot,
    endSlot
  };
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.startSlot !== b.startSlot) {
      return a.startSlot - b.startSlot;
    }
    if (a.endSlot !== b.endSlot) {
      return a.endSlot - b.endSlot;
    }
    return a.id.localeCompare(b.id);
  });
}