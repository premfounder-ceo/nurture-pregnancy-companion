// Pregnancy calculations & baby size reference data
import { differenceInDays, addDays } from "date-fns";

export function computeFromDueDate(dueDate: Date | string | null | undefined) {
  if (!dueDate) return null;
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const conception = addDays(due, -280);
  const now = new Date();
  const daysPregnant = differenceInDays(now, conception);
  const week = Math.max(1, Math.min(42, Math.floor(daysPregnant / 7) + 1));
  const dayOfWeek = ((daysPregnant % 7) + 7) % 7;
  const daysToGo = Math.max(0, differenceInDays(due, now));
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const progress = Math.min(1, Math.max(0, daysPregnant / 280));
  return { week, dayOfWeek, daysToGo, trimester, progress, daysPregnant };
}

export function computeFromLMP(lmp: Date | string) {
  const d = typeof lmp === "string" ? new Date(lmp) : lmp;
  return addDays(d, 280);
}

// Baby size fruit references + typical metrics per week (12-40)
export const BABY_SIZES: Record<number, { fruit: string; length_cm: number; weight_g: number; note: string }> = {
  4:  { fruit: "Poppy seed", length_cm: 0.1, weight_g: 0.4, note: "Cells are dividing rapidly." },
  8:  { fruit: "Raspberry", length_cm: 1.6, weight_g: 1, note: "Tiny limbs are forming." },
  12: { fruit: "Lime", length_cm: 5.4, weight_g: 14, note: "Fingernails start to appear." },
  16: { fruit: "Avocado", length_cm: 11.6, weight_g: 100, note: "Facial expressions are possible." },
  20: { fruit: "Banana", length_cm: 25.6, weight_g: 300, note: "You may feel gentle movements." },
  22: { fruit: "Papaya", length_cm: 27.8, weight_g: 430, note: "Baby's skin is covered with vernix." },
  24: { fruit: "Corn", length_cm: 30, weight_g: 600, note: "Hearing is developing well." },
  28: { fruit: "Eggplant", length_cm: 37.6, weight_g: 1005, note: "Eyes can open and close." },
  32: { fruit: "Squash", length_cm: 42.4, weight_g: 1700, note: "Practicing breathing motions." },
  36: { fruit: "Papaya (large)", length_cm: 47.4, weight_g: 2620, note: "Baby is nearly full-term." },
  40: { fruit: "Watermelon", length_cm: 51.2, weight_g: 3460, note: "Ready to meet you." },
};

export function getBabyInfo(week: number) {
  const keys = Object.keys(BABY_SIZES).map(Number).sort((a, b) => a - b);
  let best = keys[0];
  for (const k of keys) if (k <= week) best = k;
  return BABY_SIZES[best];
}
