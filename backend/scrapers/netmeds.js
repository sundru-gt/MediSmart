const scrapeNetmeds = async (medicineName, browser) => {
  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1366, height: 768 });

    const url = `https://www.netmeds.com/products/?q=${encodeURIComponent(medicineName)}/`;
    console.log('Scraping Netmeds:', url);

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForSelector('.product-desc', { timeout: 20000 });

    const results = await page.evaluate(() => {
      const containers = document.querySelectorAll('.product-desc');
      const data = [];

      containers.forEach((item) => {
        const name = item.querySelector('.ukt-title-inactive')?.innerText?.trim();
        const price = item.querySelector('.priceDisplay')?.innerText?.trim();
        const link = item.querySelector('a')?.href || 'https://www.netmeds.com';

        if (name && price) {
          data.push({ name, price, source: 'Netmeds', link });
        }
      });

      return data;
    });

    await page.close();
    console.log('Netmeds results:', results.length);
    return results;

  } catch (error) {
    console.error('Netmeds scraper error:', error.message);
    return [];
  }
};

module.exports = scrapeNetmeds;