"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

export interface OverflowResult {
  /** Entry ids whose rendered box extends past the bottom margin. */
  overflowIds: Set<string>;
  /** Rendered content height in CSS px. */
  usedPx: number;
  /** Content height that fits on the page in CSS px. */
  availablePx: number;
  isOverflowing: boolean;
}

/** Sub-pixel rounding tolerance so an entry that ends exactly on the margin isn't flagged. */
const TOLERANCE_PX = 0.5;

/** Distance from the top of `container` using layout offsets (ignores drag transforms and any zoom). */
function offsetTopWithin(el: HTMLElement, container: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function sameSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

/**
 * Measures the rendered resume content and reports which entries don't fit.
 * `contentRef` must be a positioned element (e.g. `relative`) whose height grows with its content,
 * and each entry inside it must carry a `data-entry-id` attribute.
 * Re-measures when `deps` change and whenever the content box resizes (fonts loading, edits, etc.).
 */
export function useOverflow(
  contentRef: RefObject<HTMLElement | null>,
  availablePx: number,
  deps: readonly unknown[],
): OverflowResult {
  const [overflowIds, setOverflowIds] = useState<Set<string>>(() => new Set());
  const [usedPx, setUsedPx] = useState(0);

  const measure = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const limit = availablePx + TOLERANCE_PX;
    const next = new Set<string>();
    content.querySelectorAll<HTMLElement>("[data-entry-id]").forEach((el) => {
      const bottom = offsetTopWithin(el, content) + el.offsetHeight;
      if (bottom > limit && el.dataset.entryId) next.add(el.dataset.entryId);
    });
    setUsedPx(content.offsetHeight);
    setOverflowIds((prev) => (sameSet(prev, next) ? prev : next));
  }, [contentRef, availablePx]);

  const observerRef = useRef<{ observer: ResizeObserver; target: HTMLElement } | null>(null);
  // The observer outlives renders, so it calls the latest `measure` through a ref.
  const measureRef = useRef(measure);
  measureRef.current = measure;

  // Measure synchronously after every relevant render so the warning never lags behind a drop.
  // Also (re)attach a ResizeObserver, since the content element can mount later or be replaced.
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (observerRef.current && observerRef.current.target !== content) {
      observerRef.current.observer.disconnect();
      observerRef.current = null;
    }
    if (content && !observerRef.current) {
      const observer = new ResizeObserver(() => measureRef.current());
      observer.observe(content);
      observerRef.current = { observer, target: content };
      // Web fonts can change line wrapping after first paint.
      document.fonts?.ready.then(() => measureRef.current()).catch(() => {});
    }
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  useEffect(() => () => observerRef.current?.observer.disconnect(), []);

  return {
    overflowIds,
    usedPx,
    availablePx,
    isOverflowing: usedPx > availablePx + TOLERANCE_PX,
  };
}
