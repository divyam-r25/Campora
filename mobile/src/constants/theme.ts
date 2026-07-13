// Design direction: campus noticeboard, not generic SaaS blue.
// Deep indigo evokes a late-night library/dorm-lamp feel; the amber accent
// is the "pinned notice" color — used sparingly for actions and highlights.

export const colors = {
  background: "#161B33", // deep indigo — primary surface
  surface: "#1F2547", // slightly lighter panels/cards
  border: "#2D3460",
  textPrimary: "#F7F5F0", // warm off-white, not pure white
  textSecondary: "#8890B0", // muted slate
  accent: "#F2B134", // amber — CTAs, active states, "pinned" highlights
  accentMuted: "#F2B13433",
  success: "#4ADE80",
  danger: "#F26D6D",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: "700" as const },
  h2: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  caption: { fontSize: 13, fontWeight: "400" as const, color: colors.textSecondary },
};
