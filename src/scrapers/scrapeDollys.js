const puppeteer = require('puppeteer');


async function scrapeDollys(cardName) {
    // format card name and URL
    const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchURL = `https://www.dollys.ca/products/search?q=${searchTerm}&c=228`
    const searchTerms = cardName.trim().toLowerCase().split(/\s+/); // Used to filter the searched card name apart from similar names returned by webscraper

    console.log("Navigating to:", searchURL);
    // launch headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        await page.goto(searchURL, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await page.evaluate(() => { debugger; });

        // evaluate page and extract product details
        const products = await page.evaluate((searchTerms) => {

            const productCards = document.querySelectorAll('.product .inner');

            return Array.from(productCards).map(card => {
                // extract product name
                const titleEl = card.querySelector('.image-meta .meta .name');
                const name = titleEl ? titleEl.textContent.trim() : null;
                
                // get price, condition, and stock of card
                const variants = card.querySelectorAll('.variants .variant-row');

                let priceOptions = Array.from(variants).map(variant => {

                    //extract condition
                    const conditionEl = variant.querySelector('.variant-main-info .variant-description');
                    const condition = conditionEl ? conditionEl.textContent.trim() : null;

                    // extract availability and format
                    const stockEl = variant.querySelector('.variant-main-info .variant-qty');
                    let stock = stockEl ? stockEl.textContent.trim(): null;
                    if (stock && stock.includes("In Stock")){
                        stock = "In Stock";
                    } else if(stock && stock.includes("Out")){
                        stock = "Out of Stock"
                    }

                    // extract price and format
                    const priceEl = variant.querySelector('.variant-buttons .add-to-cart-form .product-price-qty .price');
                    let price = priceEl ? priceEl.textContent.trim(): null;
                    if (price){
                       price = price.replace('CAD$ ','$').trim();
                    }

                    return { condition, stock, price };
                })
                //filter out variants that are not in stock
                .filter(variant => { return variant.stock === "In Stock"});

                return { name, priceOptions };
            })
            // filter out products that have no stock
            .filter(product => { return product.priceOptions.length > 0})
            // filter out products that don't include all search terms & are out of stock
            .filter(product => {
                if (!product.name){
                    return false;
                } else {
                    const lowerName = product.name.toLowerCase();
                    return searchTerms.every(term => lowerName.includes(term));
                } 
            });
        }, searchTerms);

        console.log(JSON.stringify(products, null, 2));

        return products;
        
    } catch(err) {
        console.error('Error scraping Dollys Toys & Games: ', err.message);
        return [];
    } finally {
        await browser.close();
    }
}

// scrapeDollys("Dark Magician");
module.exports = { scrapeDollys };
