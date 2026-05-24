interface ColoredSegment {
  text: string;
  color: "madd" | "ghunnah" | "qalqalah" | "shaddah" | null;
}

const ARABIC_LETTER = /[\u0621-\u064A\u066E\u066F\u0671-\u06D3]/;
const DIACRITIC = /[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED\u08D0-\u08FF]/;

function isBaseChar(c: string): boolean {
  return ARABIC_LETTER.test(c) || !DIACRITIC.test(c);
}

function getClusters(text: string): string[] {
  const clusters: string[] = [];
  let cur = "";
  for (const c of text) {
    if (isBaseChar(c)) {
      if (cur) clusters.push(cur);
      cur = c;
    } else {
      cur += c;
    }
  }
  if (cur) clusters.push(cur);
  return clusters;
}

function hasDiacritic(cluster: string, char: string): boolean {
  return cluster.includes(char);
}

function getBaseLetter(cluster: string): string {
  for (const c of cluster) {
    if (ARABIC_LETTER.test(c)) return c;
  }
  return cluster;
}

const MADD_LETTERS = "\u0627\u0648\u064A";
const QALQALAH_LETTERS = "\u0642\u0637\u0628\u062C\u062F";
const SHADDAH = "\u0651";
const SUKUN = "\u0652";
const FATHA = "\u064E";
const DAMMA = "\u064F";
const KASRA = "\u0650";
const TANWEEN_FATHA = "\u064B";
const TANWEEN_DAMMA = "\u064C";
const TANWEEN_KASRA = "\u064D";
const MADD_ALIF = "\u0622";

function isMadd(cluster: string): boolean {
  if (cluster.includes(MADD_ALIF)) return true;
  const base = getBaseLetter(cluster);
  if (!MADD_LETTERS.includes(base)) return false;
  if (base === "\u0627" && hasDiacritic(cluster, FATHA)) return true;
  if (base === "\u0648" && hasDiacritic(cluster, DAMMA)) return true;
  if (base === "\u064A" && hasDiacritic(cluster, KASRA)) return true;
  return false;
}

function isGhunnah(cluster: string): boolean {
  const base = getBaseLetter(cluster);
  if (hasDiacritic(cluster, SHADDAH)) {
    if (base === "\u0646" || base === "\u0645") return true;
  }
  if (
    hasDiacritic(cluster, TANWEEN_FATHA) ||
    hasDiacritic(cluster, TANWEEN_DAMMA) ||
    hasDiacritic(cluster, TANWEEN_KASRA)
  ) {
    return true;
  }
  return false;
}

function isQalqalah(cluster: string): boolean {
  const base = getBaseLetter(cluster);
  if (QALQALAH_LETTERS.includes(base) && hasDiacritic(cluster, SUKUN)) {
    return true;
  }
  return false;
}

function isShaddah(cluster: string): boolean {
  return hasDiacritic(cluster, SHADDAH);
}

export function colorizeArabic(text: string): ColoredSegment[] {
  const clusters = getClusters(text);
  const colors: ColoredSegment["color"][] = clusters.map(() => null);

  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    if (isGhunnah(c)) colors[i] = "ghunnah";
    else if (isMadd(c)) colors[i] = "madd";
    else if (isQalqalah(c)) colors[i] = "qalqalah";
    else if (isShaddah(c)) colors[i] = "shaddah";
  }

  const segments: ColoredSegment[] = [];
  for (let i = 0; i < clusters.length; i++) {
    const prev = segments[segments.length - 1];
    if (prev && prev.color === colors[i]) {
      prev.text += clusters[i];
    } else {
      segments.push({ text: clusters[i], color: colors[i] });
    }
  }
  return segments;
}
