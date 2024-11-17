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
    <div id="table">
        <table>
            <thead>
                <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Row 1, Cell 1</td>
                    <td>Row 1, Cell 2</td>
                </tr>
                <tr>
                    <td>Row 2, Cell 1</td>
                    <td>Row 2, Cell 2</td>
                </tr>
            </tbody>
        </table>
    </div>
  </body>
  </html>
`;

const text = converter.convert(html);
