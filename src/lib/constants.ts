import { TableReadingMode, ConversionOptions, TitleStyle  } from './types';
const { rowsMode, cellsMode } = TableReadingMode;
const { uppercase, lowercase, capitalize, preserve } = TitleStyle;

export const DEFAULT_OPTIONS: Required<ConversionOptions> = {
  preserveNewlines: true,
  wordwrap: 80,
  preserveLinks: true,
  preserveImages: true,
  customReplacements: [],
  debugMode: false,
  includeTitle: true,
  includeMetaDescription: true,
  titleStyle: capitalize,
  tableReadingMode: rowsMode,
};
