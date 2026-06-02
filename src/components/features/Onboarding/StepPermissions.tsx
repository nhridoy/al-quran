import {
  IoChevronForward,
  IoLocationOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function StepPermissions({
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
            <Button
              variant="white-ghost"
              className="mt-4 w-full rounded-xl bg-white/10 py-2.5 h-auto text-sm font-semibold text-white hover:bg-white/20"
              onClick={onRequestLocation}
            >
              Grant Location Access
            </Button>
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
            <Button
              variant="white-ghost"
              className="mt-4 w-full rounded-xl bg-white/10 py-2.5 h-auto text-sm font-semibold text-white hover:bg-white/20"
              onClick={onRequestNotification}
            >
              Enable Notifications
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
