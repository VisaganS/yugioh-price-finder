const { scrape401games } = require('../scrapers/scrape401games');
const { scrapeDollys } = require('../scrapers/scrapeDollys')
const { scrapeHBV } = require('../scrapers/scrapeHBV')

/**
 * Execute all scrapers for a specified card,
 * merge results, and sort by lowest price.
 * 
 * @param {string} cardName
 * @returns {Promise<Array<{name: string, priceOptions: Array}}
**/
async function getCardPrices(cardName) {

    // Run each scraper in parallel
    const [dollysResults, games401Results, hbvResults ] =  await Promise.all([
        scrapeDollys(cardName),
        scrape401games(cardName),
        scrapeHBV(cardName)
    ]);
    
    // Merge Results
    const combined = [
        ...dollysResults,
        ...games401Results,
        ...hbvResults,
      ];
}

module.exports = { getCardPrices };
