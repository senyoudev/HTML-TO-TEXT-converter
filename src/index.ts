import { HtmlToText } from './converters/htmlToText';

const converter = new HtmlToText({
    debugMode: true,
});

const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Example Page</title>
    <meta name="description" content="This is an example page."/>
  </head>
  <body>
    <div id="main">
      <p>Hello, World!</p>
      <a href="https://example.com">Example</a>
    </div>
  </body>
  </html>
`;

const text = converter.convert(html);
