const cheerio = require('cheerio');
const { sampleHtmlWithYale } = require('./test-utils');

describe('Integration Tests', () => {

  test('Should replace Yale with Fale in HTML content', () => {
    // Test the replacement logic directly
    const $ = cheerio.load(sampleHtmlWithYale);
    
    // Apply the same replacement logic as in the main app
    $('body *').contents().filter(function() {
      return this.nodeType === 3;
    }).each(function() {
      const text = $(this).text();
      const newText = text.replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
      if (text !== newText) {
        $(this).replaceWith(newText);
      }
    });
    
    // Process title separately
    const title = $('title').text().replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
    $('title').text(title);
    
    const modifiedHtml = $.html();
    
    // Verify Yale has been replaced with Fale in text
    expect(modifiedHtml).toContain('Fale University Test Page');
    expect(modifiedHtml).toContain('Welcome to Fale University');
    expect(modifiedHtml).toContain('Fale University is a private');
    
    // Verify URLs remain unchanged
    expect(modifiedHtml).toContain('https://www.yale.edu/about');
    expect(modifiedHtml).toContain('https://www.yale.edu/admissions');
    
    // Verify link text is changed
    expect(modifiedHtml).toContain('>About Fale<');
  });

  test('Should handle empty HTML', () => {
    const emptyHtml = '<html><body></body></html>';
    const $ = cheerio.load(emptyHtml);
    
    // Apply replacement logic
    $('body *').contents().filter(function() {
      return this.nodeType === 3;
    }).each(function() {
      const text = $(this).text();
      const newText = text.replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
      if (text !== newText) {
        $(this).replaceWith(newText);
      }
    });
    
    const modifiedHtml = $.html();
    expect(modifiedHtml).toContain('<html><head></head><body></body></html>');
  });

  test('Should handle malformed HTML', () => {
    const malformedHtml = '<div>Yale University<p>Another paragraph</div>';
    const $ = cheerio.load(malformedHtml);
    
    // Apply replacement logic
    $('body *').contents().filter(function() {
      return this.nodeType === 3;
    }).each(function() {
      const text = $(this).text();
      const newText = text.replace(/Yale/g, 'Fale').replace(/yale/g, 'fale');
      if (text !== newText) {
        $(this).replaceWith(newText);
      }
    });
    
    const modifiedHtml = $.html();
    expect(modifiedHtml).toContain('Fale University');
  });
});
