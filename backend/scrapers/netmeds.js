const puppeteer = require('puppeteer');

const scrapeNetmeds = async (medicineName) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1366, height: 768 });

    const url = `https://www.netmeds.com/products/?q=${encodeURIComponent(medicineName)}/`;
    console.log('Scraping Netmeds:', url);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });

    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 8000));
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 3000));

    const results = await page.evaluate(() => {
      const containers = document.querySelectorAll('.product-desc');
      const data = [];

      containers.forEach((item) => {
        const name = item.querySelector('.ukt-title-inactive')?.innerText?.trim();
        const price = item.querySelector('.priceDisplay')?.innerText?.trim();
        const linkEl = item.querySelector('a');
        const link = linkEl?.href || 'https://www.netmeds.com';

        if (name && price) {
          data.push({
            name,
            price,
            source: 'Netmeds',
            link
          });
        }
      });

      return data;
    });

    console.log('Netmeds results:', results);
    return results;

  } catch (error) {
    console.error('Netmeds scraper error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
};

module.exports = scrapeNetmeds;