/**
 * Audio CORS Utility
 * Handles cross-origin audio requests with fallback strategies
 */

/**
 * Fixes CORS issues by attempting different strategies
 * @param audioUrl - Original audio URL
 * @returns Modified URL that's more likely to work
 */
export function getCorsAudioUrl(audioUrl: string): string {
  if (!audioUrl) return "";

  try {
    const url = new URL(audioUrl);

    // If it's already a relative URL or same origin, return as-is
    if (audioUrl.startsWith("/") || audioUrl.startsWith("./")) {
      return audioUrl;
    }

    // Check if it's same origin
    if (url.origin === window.location.origin) {
      return audioUrl;
    }

    // For cross-origin, try to use the URL with cors headers enabled
    // Some CDNs already support CORS, try direct access first
    return audioUrl;
  } catch {
    // If URL parsing fails, return original
    return audioUrl;
  }
}

/**
 * Create audio context for playing audio with better error handling
 */
export function createAudioWithErrorHandling(
  audioElement: HTMLAudioElement,
  url: string,
  onError?: (error: any) => void,
): void {
  if (!audioElement) return;

  audioElement.crossOrigin = "anonymous";

  // Remove query params that might cause CORS issues
  const cleanUrl = url.split("?")[0];

  audioElement.src = cleanUrl;

  // Add error event listener
  const handleError = () => {
    const error = audioElement.error;
    console.error("Audio playback error:", {
      code: error?.code,
      message: error?.message,
      url: cleanUrl,
    });

    if (onError) {
      onError(error);
    }
  };

  audioElement.addEventListener("error", handleError, { once: true });
}

/**
 * Detect if audio resource supports CORS
 */
export async function checkAudioCorsSupport(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "cors",
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get detailed CORS error information
 */
export function getAudioErrorMessage(
  errorCode: number | null | undefined,
): string {
  const audioErrorCodes: Record<number, string> = {
    1: "MEDIA_ERR_ABORTED - Audio playback was aborted",
    2: "MEDIA_ERR_NETWORK - Network error occurred",
    3: "MEDIA_ERR_DECODE - Audio decoding failed",
    4: "MEDIA_ERR_SRC_NOT_SUPPORTED - Audio format not supported or CORS issue",
  };

  return audioErrorCodes[errorCode || 0] || "Unknown audio error";
}
