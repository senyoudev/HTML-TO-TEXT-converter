/**
 * HTML to Text Converter
 * @packageDocumentation
 */

import { HtmlToText } from './converters/htmlToText';
import type { ConversionOptions } from './lib/types';
import { TableReadingMode, TitleStyle } from './lib/types';

// Export the main class and constants
export { HtmlToText } from './converters/htmlToText';
export { DEFAULT_OPTIONS } from './lib/constants';
export { TableReadingMode, TitleStyle } from './lib/types';

// Export types
export type { ConversionOptions };

/**
 * Convenience function to convert HTML to text
 * @param html HTML string to convert
 * @param options Optional conversion options
 * @returns Converted text string
 */
export const htmlToText = (
  html: string,
  options?: ConversionOptions,
): string => {
  const converter = new HtmlToText(options);
  return converter.convert(html);
};

// Default export
export default HtmlToText;
