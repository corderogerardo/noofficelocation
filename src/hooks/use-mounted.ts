"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True after the component has mounted on the client. Uses
 * `useSyncExternalStore` so it's hydration-safe (server → false, client →
 * true) without a setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
