import { z } from "astro/zod";
import { languages, type LanguageKey, partsOfSpeech, genders } from "./config";

export const languageKeys = Object.keys(languages) as [
  LanguageKey,
  ...LanguageKey[],
];

/** Per-language structured entry as stored in DB */
export interface LangEntry {
  word: string;
  gender?: string;
  transliteration?: string;
}

/** Flat form field names: el_word, el_gender, el_transliteration, etc. */
const langInputShape = Object.fromEntries(
  languageKeys.flatMap((k) => [
    [`${k}_word`, z.string().optional()],
    [`${k}_gender`, z.enum(genders).optional()],
    [`${k}_transliteration`, z.string().optional()],
  ]),
);

/** Form submission schema — multiple POS (from checkboxes), optional body, flat language fields */
export const submitInputSchema = z.object({
  word: z.string().min(1),
  meaning: z.string().optional(),
  partOfSpeech: z.array(z.enum(partsOfSpeech)).optional().default([]),
  favourite: z.boolean().optional(),
  origin: z.string().optional(),
  body: z.string().optional(),
  featured: z.string().optional(),
  ...langInputShape,
});

export type SubmitInput = z.infer<typeof submitInputSchema>;

/** Update schema — same fields plus slug to identify the row */
export const updateInputSchema = submitInputSchema.extend({
  slug: z.string().min(1),
});

export type UpdateInput = z.infer<typeof updateInputSchema>;
