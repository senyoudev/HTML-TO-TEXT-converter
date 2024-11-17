/**
 * HTML to Text Converter
 * @packageDocumentation
 */

import { HtmlToText } from './converters/htmlToText';
import { ConversionOptions } from './lib/types';

export type {
  ConversionOptions,
  uppercase,
  lowercase,
  capitalize,
  rowsMode,
  cellsMode,
} from './lib/types';

export const htmlToText = (
  html: string,
  options?: ConversionOptions,
): string => {
  const converter = new HtmlToText(options);
  return converter.convert(html);
};