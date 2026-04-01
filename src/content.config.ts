import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { languages, type LanguageKey } from "./config";

const languageKeys = Object.keys(languages) as [LanguageKey, ...LanguageKey[]];

/** Parses "word (note)" into { word, note } or just { word } */
function parseTranslation(value: string) {
  const match = value.match(/^(.+)\s+\(([^)]+)\)$/);
  if (match) return { word: match[1].trim(), note: match[2].trim() };
  return { word: value.trim() };
}

const langShape = Object.fromEntries(
  languageKeys.map((k) => [k, z.string().optional()]),
) as Record<LanguageKey, z.ZodOptional<z.ZodString>>;

const languagesSchema = z
  .object(langShape)
  .optional()
  .default({})
  .transform((record) =>
    Object.entries(record)
      .filter((entry): entry is [string, string] => entry[1] != null)
      .map(([key, value]) => {
        const lang = key as LanguageKey;
        return { lang, ...parseTranslation(value), ...languages[lang] };
      }),
  );

const words = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/words" }),
  schema: z
    .object({
      word: z.string(),
      slug: z.string(),
      meaning: z.string().optional(),
      partOfSpeech: z
        .array(z.enum(["Noun", "Verb", "Adjective", "Adverb", "Preposition"]))
        .optional()
        .default([]),
      languages: languagesSchema,
      favourite: z.boolean().default(false),
      created: z.coerce.date(),
      featured: z.coerce.date().optional(),
      relatedWords: z.array(z.string()).optional().default([]),
      isComplete: z.boolean().default(false),
      origin: z.string().optional(),
    })
    .transform((data) => ({
      ...data,
      featured: data.featured ?? data.created,
    })),
});

export const collections = { words };
