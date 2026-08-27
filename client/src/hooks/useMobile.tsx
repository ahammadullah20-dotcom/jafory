import * as React from "react";

const MOBILE_BREAKPOINT = 768;
type MediaQueryListener = (event: MediaQueryListEvent) => void;
type LegacyMediaQueryList = MediaQueryList & { addListener?: (listener: MediaQueryListener) => void; removeListener?: (listener: MediaQueryListener) => void };

export function isPhoneUserAgent(userAgent: string) {
  return /android|iphone|ipod|mobile|iemobile|opera mini/i.test(userAgent);
}

export function isPhoneLikeDevice({ compactViewport, phoneUserAgent, coarsePointer, touchPoints }: { compactViewport: boolean; phoneUserAgent: boolean; coarsePointer: boolean; touchPoints: number }) {
  // A phone requesting Desktop site may expose a wide viewport and sometimes a
  // desktop UA. Preserve the compact shell when touch-capable hardware still
  // identifies the device as a phone; a monitor remains desktop by default.
  return compactViewport || (phoneUserAgent && (coarsePointer || touchPoints > 0)) || (coarsePointer && touchPoints > 0);
}

function getMediaQueryList(query: string): LegacyMediaQueryList | null {
  return typeof window.matchMedia === "function" ? window.matchMedia(query) : null;
}

function mediaMatches(query: string) {
  return getMediaQueryList(query)?.matches ?? false;
}

function isMobileEnvironment() {
  const compactViewport = mediaMatches(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const phoneUserAgent = isPhoneUserAgent(navigator.userAgent);
  const coarsePointer = mediaMatches("(pointer: coarse)");
  return isPhoneLikeDevice({ compactViewport, phoneUserAgent, coarsePointer, touchPoints: navigator.maxTouchPoints ?? 0 });
}

function subscribeToMediaQuery(query: string, listener: MediaQueryListener) {
  const mediaQuery = getMediaQueryList(query);
  if (!mediaQuery) return () => undefined;
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }
  if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener?.(listener);
  }
  return () => undefined;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const onChange = () => setIsMobile(isMobileEnvironment());
    const stopViewport = subscribeToMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`, onChange);
    const stopPointer = subscribeToMediaQuery("(pointer: coarse)", onChange);
    setIsMobile(isMobileEnvironment());
    return () => { stopViewport(); stopPointer(); };
  }, []);

  return !!isMobile;
}
