import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaQuran } from "react-icons/fa";
import {
  IoCheckmarkCircle,
  IoChevronBack,
  IoChevronForward,
  IoGlobeOutline,
  IoHeadsetOutline,
  IoLocationOutline,
  IoMusicalNotesOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useSurahs } from "../../../hooks/useSurahs";
import { LANGUAGES, RECITERS, TAFSIR_LIST } from "../../../lib/const";
import {
  cacheAllAudioForReciter,
  cacheAllJuz,
  cacheAllJuzAudioForReciter,
  cacheAllJuzTafsirFor,
  cacheAllTafsirFor,
} from "../../../lib/db";
import { useLocationStore } from "../../../store/location";
import { useSettings } from "../../../store/settings";

type Step = 0 | 1 | 2 | 3 | 4;

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [reciterId, setReciterId] = useState("ar.alafasy");
  const [tafsirId, setTafsirId] = useState("en-tafsir-maarif-ul-quran");
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const updateSettings = useSettings((s) => s.update);
  const { refresh } = useSurahs();

  useEffect(() => {
    cacheAllJuz();
  }, []);

  const slideRef = useRef<HTMLDivElement>(null);
  const stepIndices = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ id: `step-${i}`, index: i })),
    [],
  );

  const totalSteps = 5;

  const goTo = useCallback(
    (next: Step) => {
      if (animating) return;
      setAnimating(true);
      setDirection(next > step ? 1 : -1);
      setStep(next);
      setTimeout(() => setAnimating(false), 400);
    },
    [animating, step],
  );

  const next = useCallback(() => {
    if (step < totalSteps - 1) goTo((step + 1) as Step);
  }, [step, goTo]);

  const prev = useCallback(() => {
    if (step > 0) goTo((step - 1) as Step);
  }, [step, goTo]);

  const handleReciterContinue = useCallback(() => {
    cacheAllAudioForReciter(reciterId);
    cacheAllJuzAudioForReciter(reciterId);
    next();
  }, [reciterId, next]);

  const handleTafsirContinue = useCallback(() => {
    cacheAllTafsirFor(tafsirId);
    cacheAllJuzTafsirFor(tafsirId);
    next();
  }, [tafsirId, next]);

  const handleFinish = useCallback(async () => {
    await updateSettings({
      translationLang: language,
      reciterId,
      tafsirId,
      onboardingComplete: true,
    });
    await refresh();
    onComplete();
  }, [language, reciterId, tafsirId, updateSettings, refresh, onComplete]);

  const requestLocation = useLocationStore((s) => s.request);

  const handleRequestLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      requestLocation();
    }
    setLocationGranted(true);
  }, [requestLocation]);

  const handleRequestNotification = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((r) => {
        setNotificationGranted(r === "granted");
      });
    } else {
      setNotificationGranted(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-b from-[#0a0618] via-[#100b20] to-[#0a0618]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2e0d8a]/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#9345f2]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pt-12 pb-8">
        {step > 0 && (
          <button
            type="button"
            onClick={prev}
            className="mb-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="Back"
          >
            <IoChevronBack className="text-lg" />
          </button>
        )}

        <div className="mb-8 flex items-center justify-center gap-2">
          {stepIndices.map(({ id, index: i }) => (
            <div
              key={id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step
                  ? "w-8 bg-gradient-to-r from-[#9345f2] to-[#b87aff]"
                  : i < step
                    ? "w-1.5 bg-[#b87aff]/60"
                    : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            ref={slideRef}
            className={`absolute inset-0 ${
              animating
                ? `translate-x-0 opacity-100`
                : `translate-x-0 opacity-100`
            } transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
            style={{
              transform: animating
                ? direction === 1
                  ? "translateX(-30px)"
                  : "translateX(30px)"
                : "translateX(0)",
              opacity: animating ? 0 : 1,
            }}
          >
            {step === 0 && (
              <StepWelcome
                language={language}
                onSelect={(l) => {
                  setLanguage(l);
                  setTimeout(next, 200);
                }}
              />
            )}
            {step === 1 && (
              <StepReciter
                selected={reciterId}
                onSelect={setReciterId}
                onContinue={handleReciterContinue}
              />
            )}
            {step === 2 && (
              <StepTafsir
                language={language}
                selected={tafsirId}
                onSelect={setTafsirId}
                onContinue={handleTafsirContinue}
              />
            )}
            {step === 3 && (
              <StepPermissions
                locationGranted={locationGranted}
                notificationGranted={notificationGranted}
                onRequestLocation={handleRequestLocation}
                onRequestNotification={handleRequestNotification}
                onNext={next}
              />
            )}
            {step === 4 && <StepDone onFinish={handleFinish} />}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex gap-1.5">
            {stepIndices.map(({ id, index: i }) => (
              <div
                key={`${id}-dot`}
                className={`h-2 w-2 rounded-full transition-all duration-500 ${
                  i === step
                    ? "scale-125 bg-[#b87aff] shadow-lg shadow-[#9345f2]/40"
                    : i < step
                      ? "bg-[#b87aff]/50"
                      : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWelcome({
  language,
  onSelect,
}: {
  language: "en" | "bn";
  onSelect: (l: "en" | "bn") => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] shadow-2xl shadow-[#9345f2]/30">
          <FaQuran className="text-3xl text-white" />
        </div>
        <h1 className="bg-gradient-to-r from-white to-[#b87aff] bg-clip-text text-3xl font-bold text-transparent">
          Al Quran
        </h1>
        <p className="text-center text-sm leading-relaxed text-white/50">
          Full Quran with audio, tafsir,
          <br />
          and verse-by-verse recitation
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-white/40">
          Choose Language
        </p>
        <div className="flex gap-3">
          {(
            [
              ["en", "English"],
              ["bn", "বাংলা"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => onSelect(val)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300 active:scale-[0.97] ${
                language === val
                  ? "border-[#9345f2]/50 bg-[#9345f2]/10 shadow-lg shadow-[#9345f2]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-colors ${
                  language === val
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg"
                    : "bg-white/10 text-white/60"
                }`}
              >
                <IoGlobeOutline />
              </div>
              <span
                className={`text-sm font-semibold ${
                  language === val ? "text-white" : "text-white/60"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReciter({
  selected,
  onSelect,
  onContinue,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2]/60 shadow-lg">
          <IoHeadsetOutline className="text-2xl text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Choose a Reciter</h2>
        <p className="text-center text-sm text-white/50">
          Select your preferred voice for Quran recitation
        </p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10">
        <div className="divide-y divide-white/5">
          {RECITERS.map((r) => (
            <button
              key={r.identifier}
              type="button"
              onClick={() => onSelect(r.identifier)}
              className={`flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-all hover:bg-white/5 ${
                selected === r.identifier ? "bg-[#9345f2]/10" : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  selected === r.identifier
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {r.englishName.charAt(0)}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    selected === r.identifier ? "text-white" : "text-white/70"
                  }`}
                >
                  {r.englishName}
                </p>
                <p className="text-xs text-white/40">{r.name}</p>
              </div>
              {selected === r.identifier && (
                <IoCheckmarkCircle className="text-lg text-[#b87aff]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2e0d8a] to-[#9345f2] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9345f2]/20 transition-all hover:shadow-xl hover:shadow-[#9345f2]/30 active:scale-[0.98]"
      >
        Continue
        <IoChevronForward className="text-base" />
      </button>
    </div>
  );
}

function StepTafsir({
  language: _language,
  selected,
  onSelect,
  onContinue,
}: {
  language: "en" | "bn";
  selected: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  const filtered = TAFSIR_LIST.filter(
    (t) => t.lang === "en" || t.lang === "bn",
  );

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e0d8a] to-[#9345f2]/60 shadow-lg">
          <IoMusicalNotesOutline className="text-2xl text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Choose Tafsir</h2>
        <p className="text-center text-sm text-white/50">
          Select your preferred Quran exegesis
        </p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="divide-y divide-white/5">
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-all hover:bg-white/5 ${
                selected === t.id ? "bg-[#9345f2]/10" : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  selected === t.id
                    ? "bg-gradient-to-br from-[#2e0d8a] to-[#9345f2] text-white shadow-lg"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {t.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    selected === t.id ? "text-white" : "text-white/70"
                  }`}
                >
                  {t.name}
                </p>
                <p className="text-xs text-white/40">{t.authorName}</p>
              </div>
              <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                {LANGUAGES[t.lang] ?? t.lang}
              </span>
              {selected === t.id && (
                <IoCheckmarkCircle className="text-lg text-[#b87aff]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2e0d8a] to-[#9345f2] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9345f2]/20 transition-all hover:shadow-xl hover:shadow-[#9345f2]/30 active:scale-[0.98]"
      >
        Continue
        <IoChevronForward className="text-base" />
      </button>
    </div>
  );
}

function StepPermissions({
  locationGranted,
  notificationGranted,
  onRequestLocation,
  onRequestNotification,
  onNext,
}: {
  locationGranted: boolean;
  notificationGranted: boolean;
  onRequestLocation: () => void;
  onRequestNotification: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Permissions</h2>
        <p className="mt-1 text-sm text-white/50">
          Al Quran uses these to enhance your experience
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div
          className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
            locationGranted
              ? "border-[#22c55e]/30 bg-[#22c55e]/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                locationGranted
                  ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-lg"
                  : "bg-white/10"
              }`}
            >
              <IoLocationOutline
                className={`text-xl ${locationGranted ? "text-white" : "text-white/60"}`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${locationGranted ? "text-[#22c55e]" : "text-white"}`}
              >
                Location Access
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Used to calculate accurate prayer times and show Qibla direction
                based on your current location.
              </p>
            </div>
          </div>
          {!locationGranted && (
            <button
              type="button"
              onClick={onRequestLocation}
              className="mt-4 w-full cursor-pointer rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              Grant Location Access
            </button>
          )}
        </div>

        <div
          className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
            notificationGranted
              ? "border-[#22c55e]/30 bg-[#22c55e]/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                notificationGranted
                  ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-lg"
                  : "bg-white/10"
              }`}
            >
              <IoNotificationsOutline
                className={`text-xl ${notificationGranted ? "text-white" : "text-white/60"}`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${notificationGranted ? "text-[#22c55e]" : "text-white"}`}
              >
                Notifications
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Sends prayer time reminders and other important alerts. No spam,
                ever.
              </p>
            </div>
          </div>
          {!notificationGranted && (
            <button
              type="button"
              onClick={onRequestNotification}
              className="mt-4 w-full cursor-pointer rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2e0d8a] to-[#9345f2] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9345f2]/20 transition-all hover:shadow-xl hover:shadow-[#9345f2]/30 active:scale-[0.98]"
      >
        Continue
        <IoChevronForward className="text-base" />
      </button>
    </div>
  );
}

function StepDone({ onFinish }: { onFinish: () => void }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPulse(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div
        className={`transition-all duration-700 ${pulse ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-2xl shadow-[#22c55e]/30">
          <IoCheckmarkCircle className="text-4xl text-white" />
        </div>
      </div>

      <div
        className={`text-center transition-all duration-700 delay-200 ${pulse ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <h1 className="text-2xl font-bold text-white">You're All Set!</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Al Quran is ready. Your preferences are saved,
          <br />
          and cached data will make everything snappy.
        </p>
      </div>

      <div
        className={`w-full max-w-xs space-y-3 transition-all duration-700 delay-500 ${pulse ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <p className="text-center text-xs text-white/40">
          Everything is cached in IndexedDB for offline-first performance.
        </p>
        <button
          type="button"
          onClick={onFinish}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2e0d8a] to-[#9345f2] py-4 text-base font-semibold text-white shadow-lg shadow-[#9345f2]/20 transition-all hover:shadow-xl hover:shadow-[#9345f2]/30 active:scale-[0.98]"
        >
          <FaQuran className="text-sm" />
          Start Reading
        </button>
      </div>
    </div>
  );
}
