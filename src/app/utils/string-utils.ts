// src/app/utils/string-utils.ts
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')                        // enlève accents
    .replace(/[\u0300-\u036f]/g, '')         // caractères diacritiques
    .replace(/\(.*?\)/g, '')                 // (version live)
    .replace(/\[.*?\]/g, '')                 // [remastered]
    // Supprime seulement les suffixes promotionnels après tiret
    .replace(
      /[-–—]\s?(from (anime|movie|series)|anime|opening|ost|version|theme|live|by|feat\.?|ft\.?)[^-\[\(]*/gi,
      ''
    )
    .replace(/feat\.?|ft\.?/gi, '')          // feat. Sia
    .replace(/[^a-z0-9 ]/gi, '')             // ponctuation
    .replace(/\s{2,}/g, ' ')                 // espaces multiples
    .trim();
}
