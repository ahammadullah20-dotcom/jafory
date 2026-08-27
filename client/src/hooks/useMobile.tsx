import * as React from "react";

const MOBILE_BREAKPOINT = 768;
type MediaQueryListener = (event: MediaQueryListEvent) => void;
type LegacyMediaQueryList = MediaQueryList & { addListener?: (listener: MediaQueryListener) => void; removeListener?: (listener: MediaQueryListener) => void };

export function isPhoneUserAgent(userAgent: string) {
  return /android|iphone|ipod|mobile|iemobile|opera mini/i.test(userAgent);
}

export function isPhoneLikeDevice({ compactViewport, phoneUserAgent, coarsePointer, touchPoints }: { compactViewport: boolean; phoneUserAgent: boolean; coarsePointer: boolean; touchPoints: number }) {
  // Desktop-site mode on a phone keeps a phone user agent but provides a wide
  // viewport. Viewport width is therefore the only reliable compact-shell cue.
  return compactViewport;
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
