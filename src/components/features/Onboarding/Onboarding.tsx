import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IoChevronBack,
  IoHeadsetOutline,
  IoMusicalNotesOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useSurahs } from "@/hooks/useSurahs";
import {
  cacheAllAudioForReciter,
  cacheAllJuz,
  cacheAllJuzAudioForReciter,
  cacheAllJuzTafsirFor,
  cacheAllTafsirFor,
} from "@/lib/batchCache";
import { LANGUAGES, RECITERS, TAFSIR_LIST } from "@/lib/const";
import { useLocationStore } from "@/store/location";
import { useSettings } from "@/store/settings";
import ListSelectStep from "./ListSelectStep";
import StepDone from "./StepDone";
import StepPermissions from "./StepPermissions";
import StepWelcome from "./StepWelcome";

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

  const filteredTafsirs = useMemo(
    () => TAFSIR_LIST.filter((t) => t.lang === "en" || t.lang === "bn"),
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
          <Button
            variant="white-ghost"
            className="mb-6 h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={prev}
            aria-label="Back"
          >
            <IoChevronBack className="text-lg" />
          </Button>
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
            className={`absolute inset-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
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
              <ListSelectStep
                icon={<IoHeadsetOutline className="text-2xl text-white" />}
                title="Choose a Reciter"
                description="Select your preferred voice for Quran recitation"
                items={RECITERS.map((r) => ({
                  id: r.identifier,
                  primary: r.englishName,
                  secondary: r.name,
                }))}
                selectedId={reciterId}
                onSelect={setReciterId}
                onContinue={handleReciterContinue}
              />
            )}
            {step === 2 && (
              <ListSelectStep
                icon={<IoMusicalNotesOutline className="text-2xl text-white" />}
                title="Choose Tafsir"
                description="Select your preferred Quran exegesis"
                items={filteredTafsirs.map((t) => ({
                  id: t.id,
                  primary: t.name,
                  secondary: t.authorName,
                  badge: LANGUAGES[t.lang] ?? t.lang,
                }))}
                selectedId={tafsirId}
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
