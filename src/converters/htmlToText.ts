import { DEFAULT_OPTIONS } from '@/lib/constants';
import { ConversionOptions } from '@/lib/types';
import { Logger } from '@/lib/utils/logger';
import { DOMParser } from '@/lib/utils/dom';


/**
 * Converts HTML to plain text.
 * @param options Conversion options
 * @Category HTML Conversion
 */
export class HtmlToText {
  private options: ConversionOptions;
  private logger: Logger;

  constructor(options: ConversionOptions = DEFAULT_OPTIONS) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.logger = new Logger(this.options.debugMode || false);
  }

  /**
   * Logs debug messages if debugging is enabled.
   * @param message Debug message
   * @param meta Optional meta information
   */
  private debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  /**
   * Converts the title element to text based on the provided style.
   * @param document Parsed HTML document
   * @returns Processed title text or an empty string
   */
  private processTitle(document: Document): string {
    if (!this.options.includeTitle) {
      return '';
    }
    const title = document.title?.trim() || '';
    if (!title) return '';

    switch (this.options.titleStyle) {
      case 'uppercase':
        return `${title.toUpperCase()}\n`;
      case 'lowercase':
        return `${title.toLowerCase()}\n`;
      case 'capitalize':
        return `${title.charAt(0).toUpperCase()}${title.slice(1)}\n`;
      default:
        return `${title}\n`;
    }
  }

  /**
   * Extracts the meta description content.
   * @param document Parsed HTML document
   * @returns Meta description text or an empty string
   */
  private processMetaDescription(document: Document): string {
    if (!this.options.includeMetaDescription) return '';
    const metaDescription = document.querySelector('meta[name="description"]');
    return metaDescription?.getAttribute('content')?.trim() || '';
  }

  /**
   * Converts HTML to plain text.
   * @param html The HTML to convert
   * @returns The plain text
   */
  convert(html: string): string {
    try {
      const document = DOMParser.parse(html);
      let result = '';
      result += this.processTitle(document);
      result += this.processMetaDescription(document);
      this.debug('Title and metadescription are:', { result });

      // Process the content

    } catch (error) {
      this.debug(
        `Failed to convert HTML to text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
    return html;
  }
}
