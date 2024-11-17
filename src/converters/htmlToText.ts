import { DEFAULT_OPTIONS } from '@/lib/constants';
import { ConversionOptions } from '@/lib/types';
import { Logger } from '@/lib/utils/logger';
import { DOMParser } from '@/lib/utils/dom';
import { HtmlToTextConversionError } from '@/lib/errors';
import { rowsMode, cellsMode } from '@/lib/types';


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

      case 'script':
      case 'style':
        return '';

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
    if (!this.options.preserveImages) return '';
    const src = element.getAttribute('src');
    const alt = element.getAttribute('alt');

    if (alt && src) {
      return `[Image: ${alt} (${src})]`;
    } else if (alt) {
      return `[Image: ${alt}]`;
    } else if (src) {
      return `[Image: ${src}]`;
    }

    return '[Image]';
  }

  private processList(element: Element): string {
    let text = '';
    const items = element.querySelectorAll('li');

    for (const item of items) {
      const nestedList = item.querySelector('ul, ol');
      if (nestedList) {
        text += `• ${this.processChildren(item)}\n`;
        text += this.processList(nestedList);
      }
      text += `• ${this.processChildren(item)}\n`;
    }
    return text;
  }

  private processTable(element: Element): string {
    let text = '';
    const rows = element.querySelectorAll('tr');

    if (this.options.tableReadingMode === rowsMode) {
      for (const row of rows) {
        text += this.processRow(row);
      }
    } else if (this.options.tableReadingMode === cellsMode) {
      const numOfCols = rows[0].querySelectorAll('td, th').length;

      for (let colIdx = 0; colIdx < numOfCols; colIdx++) {
        for (const row of rows) {
          const cell = row.cells[colIdx];
          text += this.processChildren(cell) + '\t';
        }
        text += '\n';
      }
    }
    return text;
  }

  private processRow(row: Element): string {
    let text = '';
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      text += this.processChildren(cell) + '\t';
    }
    return text + '\n';
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

    text = this.applyWordWrap(text.trim());

    return text.trim();
  }

  /**
   * Wraps text at the specified width.
   * @param text Text to wrap
   * @returns Wrapped text
   */
  private applyWordWrap(text: string): string {
    if (!this.options.wordwrap || typeof this.options.wordwrap !== 'number') {
      return text;
    }

    this.debug('Applying word wrap', {
      width: this.options.wordwrap,
      originalText: text,
    });

    const width = this.options.wordwrap;
    const lines = text.split('\n');

    const wrappedLines = lines.map((line) => {
      // Skip empty lines
      if (line.trim() === '') return line;

      // Split the line into words
      const words = line.split(' ');
      let result = '';
      let currentLine = '';

      words.forEach((word) => {
        // Check if adding this word would exceed the width
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= width) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            result += `${currentLine}\n`;
          }

          // Check if the word itself exceeds the width
          if (word.length > width) {
            while (word.length > width) {
              result += `${word.slice(0, width)}\n`;
              word = word.slice(width);
            }
          }
          currentLine = word;
        }
      });

      // Append the last line
      if (currentLine) {
        result += currentLine;
      }
    });

    return wrappedLines.join('\n');
  }

  private applyCustomReplacements(text: string): string {
    if (!this.options.customReplacements?.length) return text;

    this.debug('Applying custom replacements', {
      replacements: this.options.customReplacements,
      originalText: text,
    });

    const result = this.options.customReplacements.reduce(
      (currText, [pattern, replacement]) => {
        try {
            if(typeof replacement === 'string') {
                return currText.replace(pattern, replacement);
            } else {
                return currText.replace(pattern, replacement);
            }
        } catch (error) {
          this.debug('Error applying replacement', {
            pattern,
            replacement,
            error,
          });
          // Continue with other replacements if one fails
          return currText;
        }
      },text);

    this.debug('Custom replacements applied', {
      originalText: text,
      resultText: result,
    });

    return result;
  }

  /**
   * Converts HTML to plain text.
   * @param html The HTML to convert
   * @returns The plain text
   */
  convert(html: string): string {
    if (!html || html.trim() === '') {
      return '';
    }

    try {
      const document = DOMParser.parse(html);
      let result = '';
      result += this.processTitle(document);
      result += this.processMetaDescription(document);
      this.debug('Title and metadescription are:', { result });

      result += this.processNode(document.body);
      this.debug('Processed content:', { result });

      result = this.applyCustomReplacements(result);
      this.debug('Applied custom replacements:', { result });

      return this.normalizeWhitespace(result);
    } catch (error) {
      this.debug(
        `Failed to convert HTML to text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HtmlToTextConversionError('Failed to convert HTML to text', {
        error,
      });
    }
  }
}
