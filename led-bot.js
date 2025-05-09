/*

  LED crypto bot is a Bitcoin trading bot for popular Bitcoin exchanges written
  in node, it features multiple trading methods using technical analysis.

  If you are interested in how the LED crypto bot works, read more about the bot's
  architecture here:

  https://gekko.wizb.it/docs/internals/architecture.html

  Disclaimer:

  USE AT YOUR OWN RISK!

  The author of this project is NOT responsible for any damage or loss caused
  by this software. There can be bugs and the bot may not perform as expected
  or specified. Please consider testing it first with paper trading and/or
  backtesting on historical data. Also look at the code to see what how
  it is working.

*/

console.log(`
  ╦  ╔═╗╔╦╗  ┌─┐┬─┐┬ ┬┌─┐┌┬┐┌─┐ ╔╗ ╔═╗╔╦╗
  ║  ║╣  ║║  │  ├┬┘└┬┘├─┘ │ │ │ ╠╩╗║ ║ ║
  ╩═╝╚═╝═╩╝  └─┘┴└─ ┴ ┴   ┴ └─┘ ╚═╝╚═╝ ╩

`);

const util = require(__dirname + '/core/util');

console.log('\tGekko v' + util.getVersion());
console.log('\tLet\'s get rich together.', '\n\n');

const dirs = util.dirs();

if(util.launchUI()) {
  return require(util.dirs().web + 'server');
}

const pipeline = require(dirs.core + 'pipeline');
const config = util.getConfig();
const mode = util.gekkoMode();

if(
  config.trader.enabled &&
  !config['I understand that LED cryptobot only automates MY OWN trading strategies']
)
  util.die('Do you understand what LED cryptobot will do with your money? Trading cryptocurrency is highly volatile, proceed at your own risk');

// > Learn to beat the humans
// > 'Either you're a sheep or a wolf...'
pipeline({
  config: config,
  mode: mode
});
