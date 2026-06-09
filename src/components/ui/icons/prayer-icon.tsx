import { AsrIcon } from "./asr";
import { DhuhrIcon } from "./dhuhr";
import { FajrIcon } from "./fajr";
import { IshaIcon } from "./isha";
import { MaghribIcon } from "./maghrib";

const icons: Record<string, typeof FajrIcon> = {
  fajr: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

export function PrayerIcon({
  prayerKey,
  className,
}: {
  prayerKey: string;
  className?: string;
}) {
  const Icon = icons[prayerKey] ?? FajrIcon;
  return <Icon className={className} />;
}
