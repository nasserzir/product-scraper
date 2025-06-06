const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const productUrl = req.query.url;
  if (!productUrl) return res.status(400).send('URL fehlt');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const result = await page.evaluate(() => {
      const title = document.querySelector('title')?.innerText || '';
      const image = document.querySelector('img')?.src || '';
      return { title, image };
    });

    await browser.close();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).send('Fehler beim Scraping');
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
