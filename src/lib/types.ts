export interface ConversionOptions {
  preserveNewlines?: boolean; // Whether to preserve newlines in the output
  wordwrap?: number; // The width to wrap the text to
  preserveLinks?: boolean; // Keep url information in the text
  preserveImages?: boolean; // Keep image information in the text
  customReplacements?: Array<[RegExp, string]>; // Custom replacements to apply to the text
  debugMode?: boolean; // Whether to output debug information
  includeTitle?: boolean; // Whether to include the title in the output
  includeMetaDescription?: boolean; // Whether to include the meta description in the output
  titleStyle?: titleStyle // The style to apply to the title
  tableReadingMode?: tableReadingMode; // The mode to use when reading tables
}

enum titleStyle {
  uppercase = 'uppercase',
  lowercase = 'lowercase',
  capitalize = 'capitalize',
}

enum tableReadingMode {
  rowsMode = 'rows',
  cellsMode = 'cells',
}


export const { uppercase, lowercase, capitalize } = titleStyle;
export const { rowsMode, cellsMode } = tableReadingMode;
