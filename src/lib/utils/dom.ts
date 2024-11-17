import { JSDOM } from 'jsdom';

export class DOMParser {
  static parse(html: string) {
    const dom = new JSDOM(html);
    console.log('DOM: ', dom.window.document.title);
    return dom.window.document;
  }

  static getContent(node: Node): string {
    return node.textContent || '';
  }
}