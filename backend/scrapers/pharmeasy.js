const puppeteer = require('puppeteer');

const scrapePharmeasy = async (medicineName) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const url = `https://pharmeasy.in/search/all?name=${encodeURIComponent(medicineName)}`;
    console.log('Scraping Pharmeasy:', url);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const results = await page.evaluate(() => {
      const containers = document.querySelectorAll('.ProductCard_infoContainer__58LfU');
      const data = [];

      containers.forEach((item) => {
        const name = item.querySelector('.ProductCard_medicineName__Uzjm7')?.innerText?.trim();
        const rawPrice = item.querySelector('.ProductCard_ourPrice__yU5GB')?.innerText?.trim();
        // Remove asterisk that Pharmeasy adds to prices
        const price = rawPrice?.replace('*', '')?.trim();
        const link = item.closest('a')?.href || item.querySelector('a')?.href;

        if (name && price) {
          data.push({
            name,
            price,
            source: 'Pharmeasy',
            link: link || 'https://pharmeasy.in'
          });
        }
      });

      return data;
    });

    console.log('Pharmeasy results:', results);
    return results;

  } catch (error) {
    console.error('Pharmeasy scraper error:', error.message);
    return [];
  } finally {
    await browser.close();
  }
};

module.exports = scrapePharmeasy;