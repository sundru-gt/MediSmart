const scrape1mg = async (medicineName, browser) => {
  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const url = `https://www.1mg.com/search/all?name=${encodeURIComponent(medicineName)}`;
    console.log('Scraping 1mg:', url);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const results = await page.evaluate(() => {
      const containers = document.querySelectorAll('.VerticalProductTile__container__etaGT');
      const data = [];

      containers.forEach((item) => {
        const name = item.querySelector('.VerticalProductTile__header__z1Knt')?.innerText?.trim();
        const priceEl = item.querySelector('.l5Medium');
        const price = priceEl?.innerText?.replace('Original Price:', '')?.replace('Discounted Price:', '')?.replace(/\n/g, '')?.trim();
        const link = item.closest('a')?.href || item.querySelector('a')?.href;

        if (name && price) {
          data.push({ name, price, source: '1mg', link: link || 'https://www.1mg.com' });
        }
      });

      return data;
    });

    await page.close();
    console.log('1mg results:', results.length);
    return results;

  } catch (error) {
    console.error('1mg scraper error:', error.message);
    return [];
  }
};

module.exports = scrape1mg;