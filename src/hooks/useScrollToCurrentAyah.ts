import { useEffect } from "react";

export function useScrollToCurrentAyah(
  isCurrentAyah: boolean,
  totalNumber: number,
) {
  useEffect(() => {
    if (isCurrentAyah) {
      document
        .getElementById(`ayah-${totalNumber}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrentAyah, totalNumber]);
}
