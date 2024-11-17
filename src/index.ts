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
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <ul>
            <li>Subitem 1</li>
            <li>Subitem 2</li>
            <li>Subitem 3</li>
        </ul>
      </ol>
    </div>
    <div id="hero">
        <img src="hero.jpg" alt="Hero Image"/>
    </div>
  </body>
  </html>
`;

const text = converter.convert(html);
