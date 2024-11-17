import { htmlToText } from 'html-to-text-convert';

/**
 * Basic Usage Example
 * Demonstrates simple HTML to text conversion
 */
const basicHtml = `
  <h1>Welcome to Our Site</h1>
  <p>This is a simple example with <a href="https://example.com">a link</a>.</p>
  <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>
`;

console.log('Basic HTML to Text Conversion:');
console.log(htmlToText(basicHtml));
