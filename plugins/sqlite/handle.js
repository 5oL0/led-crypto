var _ = require('lodash');
var fs = require('fs');

var util = require('../../core/util.js');
var config = util.getConfig();
var dirs = util.dirs();

// Check that your SQLite configuration exists
if (!config.sqlite) {
  util.die('SQLite configuration not found in your config file.');
}

var adapter = config.sqlite;

var pluginHelper = require(dirs.core + 'pluginUtil');
var pluginMock = {
  slug: 'sqlite adapter',
  dependencies: adapter.dependencies,
};

var cannotLoad = pluginHelper.cannotLoad(pluginMock);
if (cannotLoad) util.die(cannotLoad);

var sqlite3;
if (config.debug) {
  sqlite3 = require('sqlite3').verbose();
} else {
  sqlite3 = require('sqlite3');
}

var version = adapter.version || 'default';
var exchange = (config.watch && config.watch.exchange) ? config.watch.exchange : 'default';
var dbName = exchange.toLowerCase() + '_' + version + '.db';
var dataDir = adapter.dataDirectory || 'history';
var dirPath = dirs.gekko + dataDir;  // This is your data directory path
var fullPath = [dirPath, dbName].join('/');

// Log the paths for debugging
console.log('[SQLite] Data Directory:', dirPath);
console.log('[SQLite] Full DB Path:', fullPath);

var mode = util.gekkoMode();
if (mode === 'realtime' || mode === 'importer') {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('[SQLite] Created directory:', dirPath);
  }
} else if (mode === 'backtest') {
  if (!fs.existsSync(dirPath)) util.die('History directory does not exist.');
  if (!fs.existsSync(fullPath)) {
    util.die(`History database does not exist for exchange ${exchange} at version ${version}.`);
  }
}

module.exports = {
  initDB: () => {
    var journalMode = adapter.journalMode || 'PERSIST';
    var syncMode = journalMode === 'WAL' ? 'NORMAL' : 'FULL';

    console.log('[SQLite] Opening DB at:', fullPath);
    var db = new sqlite3.Database(
      fullPath, 
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
      err => {
        if (err) {
          console.error('[SQLite ERROR] Unable to open DB:', err.message);
          util.die(err);
        }
      }
    );
    db.run('PRAGMA synchronous = ' + syncMode);
    db.run('PRAGMA journal_mode = ' + journalMode);
    db.configure('busyTimeout', 10000);
    return db;
  }
};
