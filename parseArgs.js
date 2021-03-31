const { ArgumentParser } = require('argparse')
const { version } = require('./package.json')
 
const parser = new ArgumentParser({})

parser.add_argument('-s', '--stock', {help: 'type desired company\'s ticker symbol to get it\'s stock value', required: true})
parser.add_argument('-c', '--currency', { help: 'official currency abbreviation, defaults in USD', default: 'USD' })
parser.add_argument('-d', '--date', { help: 'select a date in MM-DD-YYY format, leave blank for latest stock value'})


module.exports = parser