export const languages = {
  el: { name: "Greek", emoji: "🇬🇷" },
  de: { name: "German", emoji: "🇩🇪" },
  it: { name: "Italian", emoji: "🇮🇹" },
} as const;

export type LanguageKey = keyof typeof languages;
