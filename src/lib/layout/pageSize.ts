import type { Template } from "@/types/resume";

/** CSS pixels per inch. Browsers always lay out at 96 px per CSS inch. */
export const CSS_PX_PER_IN = 96;

export interface PageDimensions {
  widthIn: number;
  heightIn: number;
  /** Value for the CSS `@page { size: ... }` rule. */
  cssSize: string;
}

export const PAGE_SIZES: Record<Template["pageSize"], PageDimensions> = {
  letter: { widthIn: 8.5, heightIn: 11, cssSize: "letter" },
  a4: { widthIn: 210 / 25.4, heightIn: 297 / 25.4, cssSize: "A4" },
};

/** Height in CSS px available for content once top and bottom margins are removed. */
export function contentHeightPx(template: Template): number {
  const page = PAGE_SIZES[template.pageSize];
  return (page.heightIn - 2 * template.style.marginIn) * CSS_PX_PER_IN;
}
