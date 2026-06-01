import { create, type StoreApi } from "zustand";
import type { StoreName } from "./db";
import { getFromStore } from "./db";

export function createPersistedStore<
  T extends object,
  A extends Record<string, (...args: never[]) => unknown> = Record<
    string,
    never
  >,
>(
  config: { storeName: StoreName; key: string },
  defaults: T,
  actions?: (
    set: StoreApi<
      T & { loaded: boolean; load: () => Promise<void> } & A
    >["setState"],
    get: StoreApi<
      T & { loaded: boolean; load: () => Promise<void> } & A
    >["getState"],
  ) => A,
) {
  type State = T & { loaded: boolean; load: () => Promise<void> } & A;

  return create<State>((set, get) => {
    const base = {
      ...defaults,
      loaded: false as const,
      load: async () => {
        const saved: T | undefined = await getFromStore<T>(
          config.storeName,
          config.key,
        );
        if (saved) set({ ...saved, loaded: true } as State);
        else set({ loaded: true } as State);
      },
    };
    const result = actions ? { ...base, ...actions(set, get) } : base;
    return result as State;
  });
}
