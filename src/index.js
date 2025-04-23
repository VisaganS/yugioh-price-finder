require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const { getCardPrices } = require('./controllers/scraperController.js');

// define get request to retrieve cards
app.get('/card/:cardName', async (req, res) => {

    try {
        const cards = await getCardPrices(req.params.cardName);
        res.json(cards);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to fetch card prices'});
    }
});

app.listen(port,() => {
    console.log(`App listening on port ${port}`);
})