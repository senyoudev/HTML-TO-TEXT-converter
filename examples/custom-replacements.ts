import { HtmlToText } from 'html-to-text-conv';

const replacementsHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Custom Replacements Example</title>
</head>
<body>
    <h1>Custom Formatting Examples</h1>
    
    <!-- Currency -->
    <p>Product costs: $1234567.89</p>
    
    <!-- Dates -->
    <p>Release Date: 25/12/2023</p>
    
    <!-- Temperature -->
    <p>Current temperature: 25°C</p>
    
    <!-- Phone Numbers -->
    <p>Contact: 1234567890</p>
    
    <!-- Technical Terms -->
    <p>Built with JavaScript and TypeScript</p>
    
    <!-- Time -->
    <p>Meeting time: 2:30pm</p>
</body>
</html>
`;

const replacementsConverter = new HtmlToText({
  customReplacements: [
    // Format currency
    [
      /\$\s*(\d+)\.?(\d{2})?/g,
      (_, dollars, cents) =>
        `$${Number(dollars).toLocaleString()}${cents ? `.${cents}` : ''}`,
    ],

    // Format dates
    [/(\d{2})\/(\d{2})\/(\d{4})/g, '$3-$2-$1'],

    // Convert temperatures
    [
      /(\d+)°C/g,
      (_, temp) => `${temp}°C (${Math.round((parseInt(temp) * 9) / 5 + 32)}°F)`,
    ],

    // Format phone numbers
    [/(\d{3})(\d{3})(\d{4})/g, '($1) $2-$3'],

    // Technical terms
    [/JavaScript/g, 'JS'],
    [/TypeScript/g, 'TS'],

    // Time format
    [
      /(\d{1,2}):(\d{2})([ap]m)/gi,
      (_, hour, min, meridiem) => `${hour}:${min} ${meridiem.toUpperCase()}`,
    ],
  ],
  preserveNewlines: true,
  wordwrap: 80,
});

console.log('Custom Replacements Example:\n');
console.log(replacementsConverter.convert(replacementsHtml));
