const parser = require('./parseArgs.js')
const args = parser.parse_args()
const currencies = require ('currencies');
const crypto = require ('yahoo-stock-prices');
const chalk = require  ('chalk');
const stringLength = require('string-length');

let month, day, year, company;

async function getPrice({stock}){
    const price = await crypto.getCurrentData(stock);
    return price;
}

async function getCurrency({currency}){
    const value = await crypto.getCurrentData(currency + '=X');
    return value;
}

async function getHistoricalPrice({stock, date}){
    stockDate = date.split("-");
    day = stockDate[1];
    month = stockDate[0];
    year = stockDate[2];
    const price = await crypto.getHistoricalPrices(Number (month)-1,Number(day),Number (year), Number (month)-1,Number(day)+1,Number (year), stock, '1d');
    return price;
}

function isToday ({date, stock}){
    company = stock;
    if (date === undefined){return 1;}
    else {return 0;}    
}

(async () => {
    if (isToday(args)){
        try{
            price = await getPrice(args);}
        catch{
            console.error('Error: Firma spadła z rowerka')
            return;}
        try{
            currency = await getCurrency(args);}
        catch{
            console.error('Error: Oj córuniu, nie ma takiej waluty :)')
            return;}

        console.log(
            '\n◤━━━━━━━━━━ '+chalk.bold.rgb(71, 225, 255)(company)+' ━━━━━━━━━━◥ ', 
            chalk.whiteBright('\n  Stock value:'), chalk.bold.green(currencies.get(currency.currency).symbol) + chalk.bold.greenBright((price.price * currency.price).toFixed(2)),'\n◣━━━━━━━━━━━━━━━━━━━━━━'+  '━'.repeat(stringLength(company)) +'◢\n')
    }
    else{
        try{
            price = await getHistoricalPrice(args);}
        catch{
            console.error('Error: Firma spadła z rowerka')
            return;}
        try{
            currency = await getCurrency(args);}
        catch{
            console.error('Error: Oj córuniu, nie ma takiej waluty :)')
            return;}
        try{
            console.log('\n◤━━━━━━━━━━━━━━━━━━━━━━━━━━◥ ','\n   ', chalk.bold.white(month + "/" + day + "/" + year), chalk.underline.bold.rgb(71, 225, 255)(company),
            chalk.whiteBright('\n\n  Highest price:'), chalk.bold.greenBright(currencies.get(currency.currency).symbol + (price[0].high * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Lowest  price:'), chalk.redBright(currencies.get(currency.currency).symbol + (price[0].low * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Opening price:'), chalk.dim.yellow(currencies.get(currency.currency).symbol + (price[0].open * currency.price).toFixed(2)),
            chalk.whiteBright('\n  Closing price:'), chalk.dim.yellow(currencies.get(currency.currency).symbol + (price[0].close * currency.price).toFixed(2)),
            chalk.whiteBright('\n\n  Volume:       '), chalk.bold.white(price[0].volume), '\n◣━━━━━━━━━━━━━━━━━━━━━━━━━━◢\n')}
        catch{
            console.error('Error: Data for this day is not of exist');
        }   
    }
})()