import { HtmlToText, TableReadingMode, TitleStyle } from 'html-to-text-conv';
const { capitalize } = TitleStyle
const { rowsMode } = TableReadingMode

const advancedHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Advanced Features Demo</title>
    <meta name="description" content="Demonstrating advanced features of the converter"/>
</head>
<body>
    <h1>Advanced HTML Features</h1>
    
    <!-- Nested Lists -->
    <h2>Documentation Structure</h2>
    <ul>
        <li>Chapter 1
            <ul>
                <li>Section 1.1</li>
                <li>Section 1.2
                    <ul>
                        <li>Subsection 1.2.1</li>
                        <li>Subsection 1.2.2</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>Chapter 2
            <ul>
                <li>Section 2.1</li>
                <li>Section 2.2</li>
            </ul>
        </li>
    </ul>

    <!-- Table -->
    <h2>Product Comparison</h2>
    <table>
        <tr>
            <th>Feature</th>
            <th>Basic</th>
            <th>Pro</th>
        </tr>
        <tr>
            <td>Price</td>
            <td>$10/month</td>
            <td>$20/month</td>
        </tr>
        <tr>
            <td>Storage</td>
            <td>10 GB</td>
            <td>100 GB</td>
        </tr>
    </table>

    <!-- Images and Links -->
    <h2>Resources</h2>
    <p>Check our <a href="https://docs.example.com">documentation</a> for more details.</p>
    <img src="diagram.png" alt="Architecture Diagram"/>
</body>
</html>
`;

const advancedConverter = new HtmlToText({
  preserveNewlines: true,
  wordwrap: 80,
  preserveLinks: true,
  preserveImages: true,
  customReplacements: [],
  debugMode: true,
  includeTitle: true,
  includeMetaDescription: true,
  titleStyle: capitalize,
  tableReadingMode: rowsMode,
});

console.log('Advanced HTML to Text Conversion:\n');
console.log(advancedConverter.convert(advancedHtml));
