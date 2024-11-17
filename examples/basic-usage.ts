import { htmlToText } from 'html-to-text-conv';

/**
 * Basic Usage Example
 * Demonstrates simple HTML to text conversion
 */
const basicHtml = `
  <html>
    <head>
      <title>Basic HTML to Text Conversion</title>
      <meta name="description" content="This is a basic example of HTML to text conversion." />
      <style>
        h1 { color: blue; }
        p { font-size: 16px; }
      </style>
    </head>
    <body>
      <h1>Hello, World!</h1>
      <p>This is a basic example of HTML to text conversion.</p>
    </body>
  </html>
`;

console.log('Basic HTML to Text Conversion:');
console.log(htmlToText(basicHtml));
