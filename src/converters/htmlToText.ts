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
    return `${metaDescription?.getAttribute('content')?.trim()}\n` || '';
  }

  private processNode(node: Node): string {
    // If the node is a text node, return the text content
    if (node.nodeType === node.TEXT_NODE) {
      return node.textContent?.trim() || '';
    }

    // If the node is not an element, return an empty string
    if (node.nodeType !== node.ELEMENT_NODE) {
      return '';
    }

    const element = node as Element;
    const tag = element.tagName.toLowerCase();

    switch (tag) {
      case 'br':
        return '\n';
      case 'p':
      case 'div':
      case 'section':
      case 'article':
        return this.processChildren(element) + '\n\n';

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return this.processChildren(element).toUpperCase() + '\n\n';
      case 'a':
        return this.processLink(element);

      case 'img':
        return this.processImage(element);

      case 'ul':
      case 'ol':
        return this.processList(element) + '\n';

      case 'li':
        return `• ${this.processChildren(element)}\n`;

      case 'table':
        return this.processTable(element) + '\n\n';

      default:
        return this.processChildren(element);
    }
  }

  private processChildren(element: Element): string {
    let result = '';
    for (const child of element.childNodes) {
      result += this.processNode(child);
    }
    return result;
  }

  private processLink(element: Element): string {
    const href = element.getAttribute('href');
    const text = this.processChildren(element);
    if (this.options.preserveLinks) {
      return `${text} (${href})`;
    }
    return text;
  }

  private processImage(element: Element): string {
    return '';
  }

  private processList(element: Element): string {
    return '';
  }

  private processTable(element: Element): string {
    return '';
  }

  private normalizeWhitespace(text: string): string {
    // Replace multiple spaces with a single space
    text = text.replace(/[ \t]+/g, ' ');

    // Handle newlines based on options
    if (this.options.preserveNewlines) {
      // Limit consecutive newlines to 2
      text = text.replace(/\n{3,}/g, '\n\n');
    } else {
      // Replace all newlines with spaces
      text = text.replace(/\n+/g, ' ');
    }

    return text.trim();
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
      result += this.processNode(document.body);
      this.debug('Processed content:', { result });

      return this.normalizeWhitespace(result);
    } catch (error) {
      this.debug(
        `Failed to convert HTML to text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
    return html;
  }
}
