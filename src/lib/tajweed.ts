interface ColoredSegment {
  text: string;
  color: "madd" | "ghunnah" | "qalqalah" | "ikhfa" | "idgham" | "iqlab" | null;
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

const SHADDAH = "\u0651";
const SUKUN = "\u0652";
const FATHA = "\u064E";
const DAMMA = "\u064F";
const KASRA = "\u0650";
const TANWEEN_FATHA = "\u064B";
const TANWEEN_DAMMA = "\u064C";
const TANWEEN_KASRA = "\u064D";
const MADD_ALIF = "\u0622";
const SUPRA_ALEF = "\u0670";
const NOON = "\u0646";
const MEEM = "\u0645";
const ALIF = "\u0627";
const WAW = "\u0648";
const YAA = "\u064A";

const MADD_LETTERS = ALIF + WAW + YAA;
const QALQALAH_LETTERS = "\u0642\u0637\u0628\u062C\u062F";
const IKHFA_LETTERS =
  "\u062A\u062B\u062C\u062F\u0630\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0641\u0642\u0643";
const IDGHAM_WITH_GHAUNNAH = "\u064A\u0646\u0645\u0648";
const IDGHAM_WITHOUT_GHAUNNAH = "\u0644\u0631";
const IQLAB_LETTER = "\u0628";

function hasTanween(cluster: string): boolean {
  return (
    hasDiacritic(cluster, TANWEEN_FATHA) ||
    hasDiacritic(cluster, TANWEEN_DAMMA) ||
    hasDiacritic(cluster, TANWEEN_KASRA)
  );
}

function hasNoonSakin(cluster: string): boolean {
  return getBaseLetter(cluster) === NOON && hasDiacritic(cluster, SUKUN);
}

function isBareNoon(cluster: string): boolean {
  const base = getBaseLetter(cluster);
  if (base !== NOON) return false;
  return (
    !hasDiacritic(cluster, FATHA) &&
    !hasDiacritic(cluster, DAMMA) &&
    !hasDiacritic(cluster, KASRA) &&
    !hasDiacritic(cluster, SHADDAH) &&
    !hasDiacritic(cluster, SUKUN)
  );
}

function hasNoonSakinOrTanween(cluster: string): boolean {
  return hasNoonSakin(cluster) || isBareNoon(cluster) || hasTanween(cluster);
}

function prevClusterHas(
  clusters: string[],
  i: number,
  diacritic: string,
): boolean {
  if (i <= 0) return false;
  if (i - 1 >= clusters.length) return false;
  return hasDiacritic(clusters[i - 1], diacritic);
}

function isMadd(cluster: string, clusters: string[], i: number): boolean {
  if (cluster.includes(MADD_ALIF)) return true;
  if (cluster.includes(SUPRA_ALEF)) return true;
  const base = getBaseLetter(cluster);
  if (!MADD_LETTERS.includes(base)) return false;

  if (base === WAW || base === YAA) {
    if (
      hasDiacritic(cluster, FATHA) ||
      hasDiacritic(cluster, DAMMA) ||
      hasDiacritic(cluster, KASRA) ||
      hasDiacritic(cluster, TANWEEN_FATHA) ||
      hasDiacritic(cluster, TANWEEN_DAMMA) ||
      hasDiacritic(cluster, TANWEEN_KASRA) ||
      hasDiacritic(cluster, SHADDAH)
    ) {
      return false;
    }
  }

  if (base === ALIF && prevClusterHas(clusters, i, FATHA)) return true;
  if (base === WAW && prevClusterHas(clusters, i, DAMMA)) return true;
  if (base === YAA && prevClusterHas(clusters, i, KASRA)) return true;
  return false;
}

function isGhunnah(cluster: string): boolean {
  const base = getBaseLetter(cluster);
  return hasDiacritic(cluster, SHADDAH) && (base === NOON || base === MEEM);
}

function isQalqalah(cluster: string): boolean {
  const base = getBaseLetter(cluster);
  return QALQALAH_LETTERS.includes(base) && hasDiacritic(cluster, SUKUN);
}

function classifyNoonRule(nextBase: string): ColoredSegment["color"] {
  if (IKHFA_LETTERS.includes(nextBase)) return "ikhfa";
  if (IDGHAM_WITH_GHAUNNAH.includes(nextBase)) return "idgham";
  if (IDGHAM_WITHOUT_GHAUNNAH.includes(nextBase)) return "idgham";
  if (nextBase === IQLAB_LETTER) return "iqlab";
  return null;
}

export function colorizeArabic(text: string): ColoredSegment[] {
  const cleaned = text.replace(/\uFEFF/g, "");
  const clusters = getClusters(cleaned);
  const colors: ColoredSegment["color"][] = clusters.map(() => null);

  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    if (isGhunnah(c)) colors[i] = "ghunnah";
  }

  for (let i = 0; i < clusters.length; i++) {
    if (colors[i] !== null) continue;
    const c = clusters[i];
    if (!hasNoonSakinOrTanween(c)) continue;
    const nextBase = getBaseLetter(clusters[i + 1] ?? "");
    if (!nextBase) continue;
    colors[i] = classifyNoonRule(nextBase);
  }

  for (let i = 0; i < clusters.length; i++) {
    if (colors[i] !== null) continue;
    if (isMadd(clusters[i], clusters, i)) colors[i] = "madd";
  }

  for (let i = 0; i < clusters.length; i++) {
    if (colors[i] !== null) continue;
    if (isQalqalah(clusters[i])) colors[i] = "qalqalah";
  }

  const segments: ColoredSegment[] = [];
  for (let i = 0; i < clusters.length; i++) {
    const prev = segments.at(-1);
    if (prev?.color === colors[i]) {
      prev.text += clusters[i];
    } else {
      segments.push({ text: clusters[i], color: colors[i] });
    }
  }
  return segments;
}
