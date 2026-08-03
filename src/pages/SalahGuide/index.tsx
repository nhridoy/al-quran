import { useState } from "react";
import { BiBook, BiChevronDown, BiChevronUp, BiError } from "react-icons/bi";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";

type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

const PRAYER_TABS: { key: PrayerName; label: string; rakat: number }[] = [
  { key: "fajr", label: "Fajr", rakat: 2 },
  { key: "dhuhr", label: "Dhuhr", rakat: 4 },
  { key: "asr", label: "Asr", rakat: 4 },
  { key: "maghrib", label: "Maghrib", rakat: 3 },
  { key: "isha", label: "Isha", rakat: 4 },
];

interface Step {
  icon: string;
  title: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  note?: string;
}

const STEPS: Step[] = [
  {
    icon: "🧹",
    title: "Wudu (Ablution)",
    note: "Ensure you are in a state of purity. Perform wudu if needed.",
  },
  {
    icon: "🧭",
    title: "Face the Qibla",
    note: "Stand facing the direction of the Kaaba in Makkah.",
  },
  {
    icon: "💭",
    title: "Niyyah (Intention)",
    arabic: "نَوَيْتُ أَنْ أُصَلِّيَ صَلَاةَ الْفَجْرِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
    transliteration:
      "Nawaytu an usalliya salatal-fajri rak'atayni lillahi ta'ala",
    translation: "I intend to pray two rakats of Fajr for Allah Almighty.",
  },
  {
    icon: "📢",
    title: "Takbirat al-Ihram",
    arabic: "اللهُ أَكْبَر",
    transliteration: "Allahu Akbar",
    translation:
      "Allah is the Greatest. Raise both hands to your ears and begin.",
  },
  {
    icon: "🙏",
    title: "Qiyam (Standing) — Al-Fatiha",
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration:
      "Bismillahir-rahmanir-rahim. Alhamdulillahi rabbil-'alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-ladhina an'amta 'alayhim ghayril-maghdubi 'alayhim wa lad-dallin.",
    translation:
      "In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path.",
  },
  {
    icon: "📖",
    title: "Surah Recitation",
    note: "Recite any surah or verses from the Quran after Al-Fatiha, e.g., Surah al-Ikhlas.",
  },
  {
    icon: "💪",
    title: "Ruku (Bowing)",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhana rabbiyal-'adhim (×3)",
    translation: "Glory be to my Lord, the Almighty.",
  },
  {
    icon: "📏",
    title: "Standing after Ruku",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
    transliteration: "Sami'allahu liman hamidah. Rabbana wa lakal-hamd.",
    translation:
      "Allah hears those who praise Him. Our Lord, to You be all praise.",
  },
  {
    icon: "🕌",
    title: "Sujud (Prostration)",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhana rabbiyal-a'la (×3)",
    translation: "Glory be to my Lord, the Most High.",
  },
  {
    icon: "🧘",
    title: "Sitting between Prostrations",
    arabic: "رَبِّ اغْفِرْ لِي",
    transliteration: "Rabbighfir li (×3)",
    translation: "My Lord, forgive me.",
  },
  {
    icon: "🕌",
    title: "Second Sujud",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhana rabbiyal-a'la (×3)",
    translation: "Glory be to my Lord, the Most High.",
  },
  {
    icon: "🔄",
    title: "Repeat for 2nd Rakat",
    note: "Stand up and repeat the same sequence: Fatiha → Surah → Ruku → Sujud.",
  },
  {
    icon: "🪑",
    title: "Tashahhud (Sitting)",
    arabic:
      "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "At-tahiyyatu lillahi was-salawatu wat-tayyibatu. As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuhu. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallah wa ash-hadu anna Muhammadan 'abduhu wa rasuluhu.",
    translation:
      "All greetings, prayers, and good deeds are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
  },
  {
    icon: "🤲",
    title: "Salawat on Prophet",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidun Majid.",
    translation:
      "O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.",
  },
  {
    icon: "🕊️",
    title: "Salam (Ending)",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    transliteration: "As-salamu 'alaykum wa rahmatullah",
    translation:
      "Peace be upon you and the mercy of Allah. Turn right first, then left.",
  },
];

const WUDU_STEPS = [
  {
    icon: "💧",
    title: "Wash hands 3×",
    note: "Start with the right hand, then left, up to the wrists.",
  },
  {
    icon: "🦷",
    title: "Rinse mouth 3×",
    note: "Swish water in your mouth and spit it out.",
  },
  {
    icon: "👃",
    title: "Clean nose 3×",
    note: "Sniff water into nostrils and blow it out.",
  },
  {
    icon: "🧏",
    title: "Wash face 3×",
    note: "From forehead to chin, ear to ear.",
  },
  {
    icon: "💪",
    title: "Wash arms to elbows 3×",
    note: "Right arm first, then left, from fingertips to elbows.",
  },
  {
    icon: "💆",
    title: "Wipe head once",
    note: "Pass wet hands over your head from front to back and back.",
  },
  {
    icon: "👂",
    title: "Wipe ears once",
    note: "Using wet fingers, clean inside and behind ears.",
  },
  {
    icon: "🦶",
    title: "Wash feet 3×",
    note: "Right foot first, then left, up to the ankles.",
  },
];

const COMMON_MISTAKES = [
  {
    issue: "Rushing through Salah",
    fix: "Take your time in each position. Pause for at least one 'Subhanallah' in ruku and sujud.",
  },
  {
    issue: "Not straightening back in ruku",
    fix: "Keep your back straight and level, hands on knees with fingers spread.",
  },
  {
    issue: "Looking around during prayer",
    fix: "Keep your gaze focused on the place of sujud.",
  },
  {
    issue: "Racing through Fatiha",
    fix: "Recite each verse clearly, pausing briefly between verses.",
  },
  {
    issue: "Not sitting properly in tashahhud",
    fix: "Sit on your left foot with your right foot upright (if able).",
  },
  {
    issue: "Moving before the imam",
    fix: "Follow the imam without preceding him in any movement.",
  },
];

export default function SalahGuide() {
  const [prayer, setPrayer] = useState<PrayerName>("fajr");
  const [showWudu, setShowWudu] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { t } = useLocale();

  const tab = PRAYER_TABS.find((t) => t.key === prayer) ?? PRAYER_TABS[0];
  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <PageShell head={t("salah.pageTitle")} showBack>
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-5 text-white">
        <div className="mb-1 flex items-center gap-2">
          <BiBook className="text-xl" />
          <span className="text-sm font-medium">{t("salah.headerTitle")}</span>
        </div>
        <p className="mt-2 text-sm text-white/80">
          {t("salah.headerSubtitle")}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-2xl bg-surface p-1.5 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        {PRAYER_TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            type="button"
            onClick={() => {
              setPrayer(tabItem.key);
              setStepIndex(0);
            }}
            className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-medium transition-all ${
              prayer === tabItem.key
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt"
            }`}
          >
            <span className="block">
              {t(
                "salah.prayer" +
                  tabItem.key.charAt(0).toUpperCase() +
                  tabItem.key.slice(1),
              )}
            </span>
            <span className="block text-[10px] opacity-70">
              {t("salah.rakats", { rakat: tabItem.rakat })}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowWudu(!showWudu)}
        className="flex w-full items-center justify-between rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border transition-colors hover:bg-surface-alt dark:bg-dark-surface dark:ring-dark-border dark:hover:bg-dark-surface-alt"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text dark:text-dark-text">
          <span>🧹</span> {t("salah.wuduGuide")}
        </span>
        {showWudu ? (
          <BiChevronUp className="text-lg text-text-muted" />
        ) : (
          <BiChevronDown className="text-lg text-text-muted" />
        )}
      </button>
      {showWudu && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <div className="space-y-3">
            {WUDU_STEPS.map((w, idx) => (
              <div key={w.title} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-text dark:text-dark-text">
                    {w.icon} {w.title}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">{w.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-2xl bg-surface px-5 py-3 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {stepIndex + 1}
        </div>
        <span className="flex-1 text-xs font-medium text-text dark:text-dark-text">
          {t("salah.stepCounter", {
            current: stepIndex + 1,
            total: STEPS.length,
          })}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg px-2.5 py-1 text-xs text-text-secondary hover:bg-surface-alt disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
          >
            {t("salah.prevStep")}
          </button>
          <button
            type="button"
            disabled={isLastStep}
            onClick={() =>
              setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
            }
            className="rounded-lg bg-primary px-2.5 py-1 text-xs text-white disabled:opacity-40"
          >
            {t("salah.nextStep")}
          </button>
        </div>
      </div>

      {currentStep && (
        <div className="rounded-2xl bg-surface px-5 py-5 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
              {currentStep.icon}
            </span>
            <div>
              <h2 className="text-sm font-bold text-text dark:text-dark-text">
                {currentStep.title}
              </h2>
              <p className="text-xs text-text-muted">
                {t("salah.fullSequence", {
                  name: t(
                    "salah.prayer" +
                      tab.key.charAt(0).toUpperCase() +
                      tab.key.slice(1),
                  ),
                  rakat: tab.rakat,
                })}
              </p>
            </div>
          </div>

          {currentStep.arabic && (
            <div className="mt-4 rounded-xl bg-surface-alt p-4 text-center dark:bg-dark-surface-alt">
              <p
                className="font-arabic text-lg leading-relaxed text-text dark:text-dark-text"
                style={{ direction: "rtl" }}
              >
                {currentStep.arabic}
              </p>
            </div>
          )}

          {currentStep.transliteration && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-text-muted uppercase">
                {t("salah.transliteration")}
              </p>
              <p className="mt-1 text-sm italic text-text dark:text-dark-text">
                {currentStep.transliteration}
              </p>
            </div>
          )}

          {currentStep.translation && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-text-muted uppercase">
                {t("salah.meaning")}
              </p>
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                {currentStep.translation}
              </p>
            </div>
          )}

          {currentStep.note && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
              <span className="text-sm">💡</span>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {currentStep.note}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
        <h3 className="mb-3 text-xs font-semibold text-text-muted dark:text-dark-text-muted">
          {t("salah.fullSequence", {
            name: t(
              "salah.prayer" +
                tab.key.charAt(0).toUpperCase() +
                tab.key.slice(1),
            ),
            rakat: tab.rakat,
          })}
        </h3>
        <div className="space-y-1">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                i === stepIndex
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-alt dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt"
              }`}
            >
              <span className="shrink-0 text-base">{s.icon}</span>
              <span className="flex-1 truncate">{s.title}</span>
              <span
                className={`shrink-0 text-[10px] ${i < stepIndex ? "text-green-500" : "text-text-muted"}`}
              >
                {i < stepIndex ? "✓" : String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowMistakes(!showMistakes)}
        className="flex w-full items-center justify-between rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border transition-colors hover:bg-surface-alt dark:bg-dark-surface dark:ring-dark-border dark:hover:bg-dark-surface-alt"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text dark:text-dark-text">
          <BiError className="text-amber-500" /> {t("salah.commonMistakes")}
        </span>
        {showMistakes ? (
          <BiChevronUp className="text-lg text-text-muted" />
        ) : (
          <BiChevronDown className="text-lg text-text-muted" />
        )}
      </button>
      {showMistakes && (
        <div className="rounded-2xl bg-surface px-5 py-4 shadow-sm ring-1 ring-border dark:bg-dark-surface dark:ring-dark-border">
          <div className="space-y-3">
            {COMMON_MISTAKES.map((m) => (
              <div
                key={m.issue}
                className="rounded-xl border border-border p-3 dark:border-dark-border"
              >
                <p className="text-xs font-semibold text-text dark:text-dark-text">
                  ⚠️ {m.issue}
                </p>
                <p className="mt-1 text-xs text-text-muted">{m.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
