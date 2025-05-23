const puppeteer = require('puppeteer');
const { debug } = require('../utils/logger');


async function scrape401games(cardName) {
    // format card name and URL
    const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchURL = `https://store.401games.ca/pages/search-results?q=${searchTerm}`
    const searchTerms = cardName.trim().toLowerCase().split(/\s+/); // Used to filter the searched card name apart from similar names returned by webscraper

    debug('Navigating to:', searchURL);

    // launch headless browser
    const browser = await puppeteer.launch({
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--single-process",
            "--no-zygote",
        ],
    });
    const page = await browser.newPage();

    page.on('console', msg => debug('PAGE LOG:', msg.text()));

    try {
        await page.goto(searchURL, 
            {
                waitUntil: 'domcontentloaded',
                timeout: 60000,
            }
        );
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        if (process.env.DEBUG){
            await page.evaluate(() => { debugger; });
        }

        // evaluate page and extract product details
        const products = await page.evaluate((searchTerms) => {
            const shadowHost = document.querySelector('#fast-simon-serp-app');
            if(!shadowHost || !shadowHost.shadowRoot) {
                return [];
            }
            
            const shadowRoot = shadowHost.shadowRoot;
            const productCards = shadowRoot.querySelectorAll('.product-card');

            return Array.from(productCards).map(card => {
                // extract product name
                const titleEl = card.querySelector('.product-card-items-wrapper .info-container .title-container .title-wrapper .title');
                const name = titleEl ? titleEl.textContent.trim() : null;
                
                // extract product link
                const linkEl = card.querySelector('.product-card-items-wrapper .image-wrapper a')
                const link = linkEl ? linkEl.href : null;

                // extract product price
                const priceEl = card.querySelector('.product-card-items-wrapper .info-container .price-container .price')
                let price = priceEl ? priceEl.textContent.trim() : null;
                //remove CAD from price text
                if (price) {
                    price = price.replace('CAD', '').trim();
                }

                // extract availability
                const stockEl = card.querySelector('.product-card-items-wrapper .image-wrapper .in-stock-wrapper')
                let stock = stockEl ? 'In Stock' : 'Out of Stock';

                const condition = "N/A"

                let priceOptions = [{ condition, stock, price }];
                return { name, link, priceOptions };
            })
            // filter out products that don't include all search terms
            .filter(product => {
                if (!product.name){
                    return false;
                } else {
                    const lowerName = product.name.toLowerCase();
                    return searchTerms.every(term => lowerName.includes(term));
                } 
            })
            .filter(product => {
                return product.priceOptions[0].stock == 'In Stock';
            })
        }, searchTerms);

        debug(JSON.stringify(products, null, 2));

        return products;
        
    } catch(err) {
        console.error('Error scraping 401 Games: ', err.message);
        return [];
    } finally {
        await browser.close();
    }
}

module.exports = { scrape401games };
