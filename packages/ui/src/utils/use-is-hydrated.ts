import * as React from "react";

export const useIsHydrated = () => {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
};

function subscribe(setStore: React.Dispatch<boolean>) {
  return () => {
    setStore(true);
  };
}
