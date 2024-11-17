import { TableReadingMode, ConversionOptions, TitleStyle  } from './types';
const { rowsMode, cellsMode } = TableReadingMode;
const { uppercase, lowercase, capitalize, preserve } = TitleStyle;

export const DEFAULT_OPTIONS: Required<ConversionOptions> = {
  preserveNewlines: true,
  wordwrap: 80,
  preserveLinks: true,
  preserveImages: true,
  customReplacements: [
    [/\bJavaScript\b/g, 'JS'], // Replace "JavaScript" with "JS"
    [/\bTypeScript\b/g, 'TS'], // Replace "TypeScript" with "TS"

    // Format numbers
    [/\b(\d{4,})\b/g, (match) => match.replace(/\B(?=(\d{3})+(?!\d))/g, ',')], // Add commas to numbers: 1000000 → 1,000,000

    // Date formatting
    [/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, '$3-$2-$1'], // Convert dates: 25/12/2023 → 2023-12-25

    // Clean up whitespace
    [/\s+/g, ' '], // Replace multiple spaces with single space
    [/\s+([,.!?])/g, '$1'], // Remove spaces before punctuation

    // Common abbreviations
    [/\b(e\.g\.|eg)\b/gi, 'for example'], // Replace e.g. with "for example"
    [/\b(i\.e\.|ie)\b/gi, 'that is'], // Replace i.e. with "that is"

    // Email/URL masking
    [/\b[\w\.-]+@[\w\.-]+\.\w+\b/g, '[EMAIL]'], // Mask email addresses
    [/https?:\/\/\S+/g, '[URL]'], // Mask URLs

    // Case transformations
    [/\b(important|warning|error)\b/gi, (match) => match.toUpperCase()],
  ],
  debugMode: false,
  includeTitle: true,
  includeMetaDescription: true,
  titleStyle: capitalize,
  tableReadingMode: cellsMode,
};
