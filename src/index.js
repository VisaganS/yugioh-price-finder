const { getCardPrices } = require('./controllers/scraperController.js');

(async () => {
  try {
    const results = await getCardPrices('Dark Magician');
    console.log(results);
  } catch (err) {
    console.error('Error fetching card prices:', err);
  }
})();
