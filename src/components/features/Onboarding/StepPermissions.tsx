import { IoChevronForward, IoNotificationsOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export default function StepPermissions({
  notificationGranted,
  onRequestNotification,
  onNext,
}: {
  notificationGranted: boolean;
  onRequestNotification: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 pt-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        <p className="mt-1 text-sm text-white/50">
          Stay updated with prayer times and reminders
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div
          className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
            notificationGranted
              ? "border-green-500/30 bg-green-500/5"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                notificationGranted
                  ? "bg-gradient-to-br from-green-500 to-green-700 shadow-lg"
                  : "bg-white/10"
              }`}
            >
              <IoNotificationsOutline
                className={`text-xl ${notificationGranted ? "text-white" : "text-white/60"}`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`text-sm font-semibold ${notificationGranted ? "text-green-500" : "text-white"}`}
              >
                {notificationGranted
                  ? "Notifications Enabled"
                  : "Enable Notifications"}
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
