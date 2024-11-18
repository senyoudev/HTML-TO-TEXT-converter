import exp from 'constants';
import { HtmlToText } from '../converters/htmlToText';
import { TableReadingMode, TitleStyle } from '../lib/types';

import EventEmitter from 'events';
EventEmitter.defaultMaxListeners = 30;

describe('Convert Html to Text', () => {
  let converter: HtmlToText;

  beforeEach(() => {
    converter = new HtmlToText();
  });

  describe('Basic Convertion', () => {
    test('Should Handle Empty input', () => {
      expect(converter.convert('')).toBe('');
      expect(converter.convert(' ')).toBe('');
    });

    test('should handle plain text without HTML', () => {
      expect(converter.convert('Hello World')).toBe('Hello World');
    });

    test('should remove basic HTML tags', () => {
      const output = converter.convert('<p>Hello World</p>');
      expect(output).toBe('Hello World');
    });

    describe('Title and Metadescription Processing', () => {
      test('should include title and metadescription', () => {
        const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Title</title>
          </head>
          <body>
            <p>Content</p>
          </body>
        </html>
      `;
        // Test uppercase
        const upperConverter = new HtmlToText({
          includeTitle: true,
          titleStyle: TitleStyle.uppercase,
        });
        expect(upperConverter.convert(html)).toContain('TEST TITLE');

        // Test lowercase
        const lowerConverter = new HtmlToText({
          includeTitle: true,
          titleStyle: TitleStyle.lowercase,
        });
        expect(lowerConverter.convert(html)).toContain('test title');

        // Test capitalize
        const capitalConverter = new HtmlToText({
          includeTitle: true,
          titleStyle: TitleStyle.capitalize,
        });
        expect(capitalConverter.convert(html)).toContain('Test Title');
      });

      test('Should handle metadescription', () => {
        const html = `
        <html>
          <head>
            <meta name="description" content="Test Description"/>
          </head>
          <body>
            <p>Content</p>
          </body>
        </html>
      `;
        const converter = new HtmlToText({ includeMetaDescription: true });
        expect(converter.convert(html)).toContain('Test Description');
      });

      test('Should handle the non-existence of title and metadescription', () => {
        const html = `
            <html>
            <body>
                <p>Content</p>
            </body>
            </html>
        `;
        const converter = new HtmlToText({
          includeTitle: true,
          includeMetaDescription: true,
        });
        expect(converter.convert(html)).not.toContain('undefined');
        expect(converter.convert(html)).not.toContain('undefined');
      });
    });

    describe('Links and Images', () => {
      test('should handle links with preserveLinks option', () => {
        const html = '<a href="https://example.com">Click here</a>';

        const withLinks = new HtmlToText({
          preserveLinks: true,
          debugMode: true,
        });
        expect(withLinks.convert(html)).toBe(
          'Click here (https://example.com)',
        );

        const withoutLinks = new HtmlToText({ preserveLinks: false });
        expect(withoutLinks.convert(html)).toBe('Click here');
      });

      test('should handle images with preserveImages option', () => {
        const html = '<img src="test.jpg" alt="Test Image">';

        const withImages = new HtmlToText({ preserveImages: true });
        expect(withImages.convert(html)).toBe('[Image: Test Image (test.jpg)]');

        const withoutImages = new HtmlToText({ preserveImages: false });
        expect(withoutImages.convert(html)).toBe('');
      });
    });

    describe('Lists Processing', () => {
      test('should handle unordered lists', () => {
        const html = `
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        `;
        expect(converter.convert(html).trim()).toBe('• Item 1\n• Item 2');
      });

      test('should handle nested lists', () => {
        const html = `
            <ul>
                <li>Item 1
                    <ul>
                        <li>Subitem 1</li>
                        <li>Subitem 2</li>
                    </ul>
                </li>
            </ul>
        `;
        const result = converter.convert(html).trim();
        const expected = '• Item 1\n• Subitem 1\n• Subitem 2';

        expect(result).toBe(expected);
      });

      test('should handle empty lists', () => {
        const html = '<ul></ul>';
        expect(converter.convert(html).trim()).toBe('');
      });

      test('should handle lists with empty items', () => {
        const html = `
            <ul>
                <li></li>
                <li>Item</li>
                <li></li>
            </ul>
        `;
        const result = converter.convert(html).trim();
        expect(result).toBe('•\n• Item\n•');
      });
    });

    describe('Table Processing', () => {
      const tableHtml = `
      <table>
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Data 1</td><td>Data 2</td></tr>
      </table>
    `;

      test('should handle tables in rows mode', () => {
        const rowsConverter = new HtmlToText({
          tableReadingMode: TableReadingMode.rowsMode,
          debugMode: true,
        });
        const result = rowsConverter.convert(tableHtml);
        expect(result).toContain('Header 1 Header 2');
        expect(result).toContain('Data 1 Data 2');
      });

      test('should handle tables in cells mode', () => {
        const cellsConverter = new HtmlToText({
          tableReadingMode: TableReadingMode.cellsMode,
        });
        const result = cellsConverter.convert(tableHtml);
        expect(result).toContain('Header 1 Data 1');
        expect(result).toContain('Header 2 Data 2');
      });
    });

    describe('Custom Replacements', () => {
      test('should apply string replacements', () => {
        const converter = new HtmlToText({
          customReplacements: [
            [/test/g, 'TEST'],
            [/hello/g, 'HELLO'],
          ],
        });
        expect(converter.convert('test hello')).toBe('TEST HELLO');
      });

      test('should apply function replacements', () => {
        const converter = new HtmlToText({
          customReplacements: [
            [/\$(\d+)/g, (_, num) => `USD ${Number(num).toLocaleString()}`],
            [
              /(\d+)°C/g,
              (_, temp) =>
                `${temp}°C (${Math.round((parseInt(temp) * 9) / 5 + 32)}°F)`,
            ],
          ],
        });
        expect(converter.convert('Price: $1000')).toContain('USD 1,000');
        expect(converter.convert('Temperature: 20°C')).toContain('20°C (68°F)');
      });
    });

    describe('Word Wrap', () => {
      test('should wrap text at specified width', () => {
        const converter = new HtmlToText({ wordwrap: 10 });
        const result = converter.convert(
          'This is a long line that should be wrapped',
        );
        const lines = result.split('\n');
        lines.forEach((line) => {
          expect(line.length).toBeLessThanOrEqual(10);
        });
      });

      test('should handle long words', () => {
        const converter = new HtmlToText({ wordwrap: 5 });
        const result = converter.convert('supercalifragilisticexpialidocious');
        const lines = result.split('\n');
        lines.forEach((line) => {
          expect(line.length).toBeLessThanOrEqual(5);
        });
      });
    });

    describe('Error Handling', () => {
      test('should handle malformed HTML', () => {
        // Add specific test cases with controlled input
        const malformedCases = [
          '<p>Unclosed paragraph',
          '<div><p>Nested unclosed tags',
          '<>>>Invalid characters<<<',
          '<ul><li>Unclosed list',
          '', // Empty string
        ];

        malformedCases.forEach((html) => {
          expect(() => {
            const result = converter.convert(html);
            // Verify result is a string and has reasonable length
            expect(typeof result).toBe('string');
            expect(result.length).toBeLessThan(1000); // Reasonable limit
          }).not.toThrow();
        });
      });

      test('should handle invalid options gracefully', () => {
        const converter = new HtmlToText({
          wordwrap: -1, // Invalid width
          titleStyle: 'invalid' as any,
        });
        expect(() => {
          converter.convert('<h1>Test</h1>');
        }).not.toThrow();
      });
    });
  });
});
