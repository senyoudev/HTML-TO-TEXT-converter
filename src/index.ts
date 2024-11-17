import { HtmlToText } from './converters/htmlToText';

const converter = new HtmlToText({
    debugMode: true,
});

const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Example Page</title>
  </head>
  <body>
    <div id="main">
      <p>Hello, World!</p>
    </div>
  </body>
  </html>
`;

const text = converter.convert(html);
