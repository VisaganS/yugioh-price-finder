const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrape401games(cardName) {

    // format card name and retrieve search results
    // const searchTerm = cardName.trim().replace(/\s+/g, '+');
    const searchTerm = 'Bystial Lubellion';
    const searchURL = `https://store.401games.ca/pages/search-results?q=${searchTerm}`

    try {
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data); //parse HTML

        const results = [];
        console.log(results);
        
    } catch(err) {
        console.error('Error scraping 401 Games: ', err.message);
        return [];
    }
}