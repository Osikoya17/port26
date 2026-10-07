/**
 * Mutable state shared between the DOM hero (GSAP) and the WebGL scene (R3F).
 * Kept outside React so per-frame reads never trigger re-renders.
 */
export const heroState = {
  /** 0 → 1 as the hero scrolls out of view. */
  progress: 0,
  /** 0 → 1 once the preloader has finished and the blob has "grown in". */
  intro: 0,
};
