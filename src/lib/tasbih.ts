export interface Dhikr {
  id: string;
  label: string;
  arabic: string;
  target: number;
}

export const PRESETS: Dhikr[] = [
  { id: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ اللّٰه", target: 33 },
  {
    id: "alhamdulillah",
    label: "Alhamdulillah",
    arabic: "الْحَمْدُ لِلّٰه",
    target: 33,
  },
  { id: "allahuAkbar", label: "Allahu Akbar", arabic: "اللّٰهُ أَكْبَر", target: 34 },
];

export function loadCounts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem("tasbihCounts") || "{}");
  } catch {
    return {};
  }
}

export function saveCounts(counts: Record<string, number>) {
  localStorage.setItem("tasbihCounts", JSON.stringify(counts));
}
