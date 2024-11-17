// src/lib/types.ts

// Types
export type TableReadingMode = 'rows' | 'cells';
export type TitleStyle = 'uppercase' | 'lowercase' | 'capitalize' | 'preserve';

// Constants
export const TableReadingMode = {
  rowsMode: 'rows' as const,
  cellsMode: 'cells' as const,
} as const;

export const TitleStyle = {
  uppercase: 'uppercase' as const,
  lowercase: 'lowercase' as const,
  capitalize: 'capitalize' as const,
  preserve: 'preserve' as const,
} as const;

/**
 * Configuration options for HTML conversion
 */
export interface ConversionOptions {
  /** Whether to preserve newlines in the output */
  preserveNewlines?: boolean;

  /** Number of characters before wrapping text */
  wordwrap?: number | false;

  /** Whether to preserve links in the output */
  preserveLinks?: boolean;

  /** Whether to preserve images in the output */
  preserveImages?: boolean;

  /** Custom replacements to apply to the text */
  customReplacements?: Array<
    [RegExp, string | ((substring: string, ...args: any[]) => string)]
  >;

  /** Whether to include the document title */
  includeTitle?: boolean;

  /** Whether to include meta description */
  includeMetaDescription?: boolean;

  /** How to style the title */
  titleStyle?: TitleStyle;

  /** How to read tables */
  tableReadingMode?: TableReadingMode;

  /** Enable debug mode */
  debugMode?: boolean;
}
