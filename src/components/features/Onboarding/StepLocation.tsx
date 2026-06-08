import { IoChevronForward, IoLocationOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function StepLocation({
  locationGranted,
  isDetecting,
  error,
  locationLabel,
  onRequestLocation,
  onNext,
}: {
  locationGranted: boolean;
  isDetecting: boolean;
  error: string | null;
  locationLabel: string | null;
  onRequestLocation: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Location Access</h2>
        <p className="mt-1 text-sm text-white/50">
          Used for accurate prayer times and Qibla direction
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div
          className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
            locationGranted
              ? "border-green-500/30 bg-green-500/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                locationGranted
                  ? "bg-gradient-to-br from-green-500 to-green-700 shadow-lg"
                  : "bg-white/10"
              }`}
            >
              <IoLocationOutline
                className={`text-xl ${locationGranted ? "text-white" : "text-white/60"}`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${locationGranted ? "text-green-500" : "text-white"}`}
              >
                {locationGranted
                  ? "Location Detected"
                  : "Grant Location Access"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {locationLabel
                  ? `Detected: ${locationLabel}`
                  : "Allows Pure to calculate prayer times and show Qibla direction based on your location."}
              </p>
              {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
            {isDetecting && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            )}
          </div>
          {!locationGranted && !isDetecting && (
            <Button
              variant="white-ghost"
              className="mt-4 w-full rounded-xl bg-white/10 py-2.5 h-auto text-sm font-semibold text-white hover:bg-white/20"
              onClick={onRequestLocation}
            >
              Detect My Location
            </Button>
          )}
        </div>
      </div>

      <Button
        variant="gradient"
        className="flex w-full items-center justify-center gap-2 py-3.5 h-auto text-sm shadow-lg shadow-[#9345f2]/20 hover:shadow-xl hover:shadow-[#9345f2]/30"
        onClick={onNext}
      >
        Continue
        <IoChevronForward className="text-base" />
      </Button>
    </div>
  );
}
