const parser = require('./parseArgs.js')
const args = parser.parse_args()
const currencies = require ('currencies');
const crypto = require ('yahoo-stock-prices');
const chalk = require  ('chalk');
const stringLength = require('string-length');

async function getPrice(stock){
    return await crypto.getCurrentData(stock);
}

async function getHistoricalPrice(stock, month, day, year){
    return await crypto.getHistoricalPrices(month-1, day, year, month-1, day+1, year, stock, '1d');
}

(async () => {
    let currency;
    try{
        currency = await getPrice(args.currency.toUpperCase() + '=X');
    }
    catch{
        return console.error('Error: Oj córuniu, nie ma takiej waluty :)');
    }
    if (args.date ? 0 : 1){
        let price;
        try{
            price = await getPrice(args.stock.toUpperCase());
        }
        catch{
            return console.error('Error: Firma spadła z rowerka');
        }
        console.log(
            '\n◤━━━━━━━━━━ '+chalk.bold.rgb(71, 225, 255)(args.stock.toUpperCase())+' ━━━━━━━━━━◥ ', 
            chalk.whiteBright('\n  Stock value:'), chalk.bold.green(currencies.get(currency.currency).symbol) + chalk.bold.greenBright((price.price * currency.price).toFixed(2)),
            '\n◣━━━━━━━━━━━━━━━━━━━━━━'+  '━'.repeat(stringLength(args.stock)) +'◢\n')
    }
    else{
        let stockDate = args.date.split("-"), price;
        try{
            price = await getHistoricalPrice(args.stock.toUpperCase(), Number(stockDate[0]), Number(stockDate[1]), Number(stockDate[2]));
        }
        catch{
            return console.error('Error: Firma spadła z rowerka');
        }
        try{
            console.log('\n◤━━━━━━━━━━━━━━━━━━━━━━━━━━◥ ', '\n   ', chalk.bold.white(stockDate[1] + "/" + stockDate[0] + "/" + stockDate[2]), chalk.underline.bold.rgb(71, 225, 255)(args.stock.toUpperCase()),
            chalk.whiteBright('\n\n  Highest price:'), chalk.bold.greenBright(currencies.get(currency.currency).symbol + (price[0].high * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Lowest  price:'), chalk.redBright(currencies.get(currency.currency).symbol + (price[0].low * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Opening price:'), chalk.dim.yellow(currencies.get(currency.currency).symbol + (price[0].open * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Closing price:'), chalk.dim.yellow(currencies.get(currency.currency).symbol + (price[0].close * currency.price).toFixed(2)),
            chalk.whiteBright('\n\n  Volume:       '), chalk.bold.white(price[0].volume), '\n◣━━━━━━━━━━━━━━━━━━━━━━━━━━◢\n')
        }
        catch{
            console.error('Error: Data for this day is not of exist');
        }   
    }
})()
