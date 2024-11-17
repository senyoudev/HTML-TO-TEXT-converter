# HTML to Text Converter

A powerful TypeScript library for converting HTML content to plain text while preserving structure and formatting.


## Features

- 🎯 Convert HTML to clean, readable plain text
- 🔧 Highly configurable with extensive options
- 📝 Preserve document structure (headings, lists, tables)
- 🔗 Handle links and images
- 📋 Support for nested lists and complex tables
- 🎨 Custom text replacements with RegExp support
- 📏 Word wrapping and whitespace normalization
- 🎭 Debug mode for development
- 📖 TypeScript support with full type definitions

## Installation

```bash
npm i html-to-text-conv
```

## Quick Start

```typescript
import { HtmlToText } from 'html-to-text-conv';

const converter = new HtmlToText();
const text = converter.convert('<h1>Hello World</h1><p>This is a test</p>');
```

## Configuration

```typescript
const converter = new HtmlToText({
  // Core options
  preserveNewlines: true,    // Keep newline characters
  wordwrap: 80,             // Wrap text at 80 characters
  preserveLinks: true,      // Keep URL information
  preserveImages: true,     // Keep image alt text
  includeTitle: true,       // Include document title
  includeMetaDescription: true, // Include meta description
  debugMode: false,         // Enable debug logging
  
  // Table reading options
  tableReadingMode: 'rows', // 'rows' or 'cells'

  // Custom replacements
  customReplacements: [
    [/\bJavaScript\b/g, 'JS'],
    [/\$\s*(\d+)\.?(\d{2})?/g, match => `$${Number(match.slice(1)).toLocaleString()}`],
    [/(\d{2})\/(\d{2})\/(\d{4})/g, '$3-$2-$1'],
  ]
});
```

## Examples

### Basic HTML Conversion

```typescript
const html = `
  <h1>Welcome</h1>
  <p>This is a <a href="https://example.com">link</a>.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
`;

const text = converter.convert(html);
// Output:
// WELCOME
//
// This is a link (https://example.com).
//
// • Item 1
// • Item 2
```

### Complex Document

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Example Page</title>
      <meta name="description" content="This is an example page."/>
    </head>
    <body>
      <h1>Main Title</h1>
      <p>Text with <a href="https://example.com">a link</a>.</p>
      <table>
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Data 1</td><td>Data 2</td></tr>
      </table>
    </body>
  </html>
`;
```

### Custom Replacements

```typescript
const converter = new HtmlToText({
  customReplacements: [
    // Format numbers
    [/\b(\d{4,})\b/g, match => Number(match).toLocaleString()],
    
    // Format dates
    [/(\d{2})\/(\d{2})\/(\d{4})/g, '$3-$2-$1'],
    
    // Format currency
    [/\$\s*(\d+)\.?(\d{2})?/g, (_, dollars, cents) => 
      `$${Number(dollars).toLocaleString()}${cents ? `.${cents}` : ''}`
    ],
    
    // Convert temperatures
    [/(\d+)°C/g, (_, temp) => 
      `${temp}°C (${Math.round(parseInt(temp) * 9/5 + 32)}°F)`
    ]
  ]
});
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.