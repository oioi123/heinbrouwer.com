// Single source of truth for the portfolio's design tokens.
// Keep values here instead of scattering hex codes and breakpoints across components.

export const colors = {
  primary: '#3498db',      // links, accents, active nav
  dark: '#2c3e50',         // headings, footer, dark borders
  accent: '#e74c3c',       // project accent / highlights
  accentHover: '#FF6B6B',  // interactive hover state
  textBody: '#333',
  textMuted: '#666',
  pageBg: '#f9f9f9',
  cardBg: '#ffffff',
  highlightBg: '#ecf0f1',
  overlayHeader: '#27445D',
};

export const shadows = {
  card: '0 4px 6px rgba(0, 0, 0, 0.1)',
  nav: '0 2px 8px rgba(0, 0, 0, 0.15)',
  navScrolled: '0 4px 12px rgba(0,0,0,0.25)',
  content: '0 -10px 20px rgba(0, 0, 0, 0.2)',
  overlay: '0 4px 10px rgba(0, 0, 0, 0.15)',
  prompt: '0 4px 12px rgba(0,0,0,0.2)',
  fab: '0 2px 8px rgba(0,0,0,0.2)',
};

export const MOBILE_BREAKPOINT = 768;
