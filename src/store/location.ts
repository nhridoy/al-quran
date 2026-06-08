import { create } from "zustand";
import { getFromStore, putInStore } from "@/lib/cache";
import { GEOLOCATION_TIMEOUT } from "@/lib/const";

const STORE_NAME = "location" as const;
const STORE_KEY = "locationData";

const BIGDATACLOUD_API =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";
const NOMINATIM_API = "https://nominatim.openstreetmap.org/reverse";

export type LookupSource = "gps" | "ip" | "nominatim";

export interface GeoAddress {
  city: string | null;
  countryName: string | null;
  countryCode: string | null;
  principalSubdivision: string | null;
  locality: string | null;
  lookupSource: LookupSource | null;
}

interface PersistedLocation {
  lat: number;
  lng: number;
  address: GeoAddress | null;
  lastUpdated: number;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: GeoAddress | null;
  loading: boolean;
  error: string | null;
  requested: boolean;
  loaded: boolean;
  lastUpdated: number | null;
  load: () => Promise<void>;
  request: () => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void;
}

function getCurrentPosition(timeout: number): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout,
    });
  });
}

interface BigDataCloudResponse {
  latitude?: number;
  longitude?: number;
  countryName?: string | null;
  countryCode?: string | null;
  principalSubdivision?: string | null;
  city?: string | null;
  locality?: string | null;
  postcode?: string | null;
}

interface NominatimAddress {
  country?: string | null;
  country_code?: string | null;
  state?: string | null;
  region?: string | null;
  city?: string | null;
  town?: string | null;
  village?: string | null;
  municipality?: string | null;
  suburb?: string | null;
  neighbourhood?: string | null;
  county?: string | null;
}

interface NominatimResponse {
  address?: NominatimAddress;
}

function mapToAddress(
  source: LookupSource,
  raw: BigDataCloudResponse | NominatimResponse,
): GeoAddress {
  if (source === "nominatim") {
    const addr = (raw as NominatimResponse).address ?? {};
    return {
      city: addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? null,
      countryName: addr.country ?? null,
      countryCode: (addr.country_code ?? "").toUpperCase() || null,
      principalSubdivision: addr.state ?? addr.region ?? null,
      locality: addr.suburb ?? addr.neighbourhood ?? addr.county ?? null,
      lookupSource: "nominatim",
    };
  }

  const bdc = raw as BigDataCloudResponse;
  return {
    city: bdc.city ?? null,
    countryName: bdc.countryName ?? null,
    countryCode: bdc.countryCode ?? null,
    principalSubdivision: bdc.principalSubdivision ?? null,
    locality: bdc.locality ?? null,
    lookupSource: source,
  };
}

async function tryBigDataCloud(
  lat: number,
  lng: number,
  language: string,
): Promise<GeoAddress | null> {
  const url = `${BIGDATACLOUD_API}?latitude=${lat}&longitude=${lng}&localityLanguage=${encodeURIComponent(language)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return mapToAddress("gps", await res.json());
  } catch {
    return null;
  }
}

async function tryNominatim(
  lat: number,
  lng: number,
  language: string,
): Promise<GeoAddress | null> {
  const url = `${NOMINATIM_API}?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=${encodeURIComponent(language)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AlQuran/1.0" },
    });
    if (!res.ok) return null;
    return mapToAddress("nominatim", await res.json());
  } catch {
    return null;
  }
}

async function tryIpGeolocation(
  language: string,
): Promise<{ address: GeoAddress; lat: number; lng: number } | null> {
  const url = `${BIGDATACLOUD_API}?localityLanguage=${encodeURIComponent(language)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as BigDataCloudResponse;
    if (json.latitude == null || json.longitude == null) return null;
    return {
      lat: json.latitude,
      lng: json.longitude,
      address: mapToAddress("ip", json),
    };
  } catch {
    return null;
  }
}

async function resolveLocation(
  language: string,
  timeout: number,
): Promise<{
  lat: number;
  lng: number;
  address: GeoAddress | null;
}> {
  let lat: number | null = null;
  let lng: number | null = null;

  try {
    const pos = await getCurrentPosition(timeout);
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
  } catch {
    // GPS denied — fall through to IP
  }

  if (lat !== null && lng !== null) {
    const address =
      (await tryBigDataCloud(lat, lng, language)) ??
      (await tryNominatim(lat, lng, language));

    return { lat, lng, address };
  }

  const ip = await tryIpGeolocation(language);
  if (ip) {
    return { lat: ip.lat, lng: ip.lng, address: ip.address };
  }

  throw new Error("Failed to detect location");
}

export const useLocationStore = create<LocationState>((set, get) => ({
  lat: null,
  lng: null,
  address: null,
  loading: false,
  error: null,
  requested: false,
  loaded: false,
  lastUpdated: null,

  load: async () => {
    const saved = await getFromStore<PersistedLocation>(STORE_NAME, STORE_KEY);
    if (saved) {
      set({
        lat: saved.lat,
        lng: saved.lng,
        address: saved.address,
        lastUpdated: saved.lastUpdated,
        requested: true,
        loaded: true,
      });
    } else {
      set({ loaded: true });
    }
  },

  request: async () => {
    const state = get();
    if (state.loading) return;
    if (state.requested && state.lat !== null) return;

    set({ loading: true, error: null, requested: true });

    try {
      const result = await resolveLocation("en", GEOLOCATION_TIMEOUT);
      const now = Date.now();

      await putInStore<PersistedLocation>(STORE_NAME, STORE_KEY, {
        lat: result.lat,
        lng: result.lng,
        address: result.address,
        lastUpdated: now,
      });

      set({
        lat: result.lat,
        lng: result.lng,
        address: result.address,
        lastUpdated: now,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to detect location",
        loading: false,
      });
    }
  },

  refresh: async () => {
    set({ requested: false, lat: null, lng: null, address: null });
    await get().request();
  },

  clear: () => {
    set({
      lat: null,
      lng: null,
      address: null,
      loading: false,
      error: null,
      requested: false,
      lastUpdated: null,
    });
  },
}));
