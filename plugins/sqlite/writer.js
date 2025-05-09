var Store = function (done, pluginMeta) {
  _.bindAll(this);
  this.done = typeof done === 'function' ? done : function () {};

  this.cache = [];
  this.buffered = util.gekkoMode() === "importer";

  this.db = sqlite.initDB(false);
  // Delay execution until db is ready and context is set
  const self = this;
  this.db.serialize(function () {
    self.upsertTables();
  });
};

Store.prototype.upsertTables = function () {
  if (!this.db) {
    util.die("SQLite database not initialized.");
    return;
  }

  var createQueries = [
    `
    CREATE TABLE IF NOT EXISTS ${sqliteUtil.table('candles')} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start INTEGER UNIQUE,
      open REAL NOT NULL,
      high REAL NOT NULL,
      low REAL NOT NULL,
      close REAL NOT NULL,
      vwp REAL NOT NULL,
      volume REAL NOT NULL,
      trades INTEGER NOT NULL
    );
    `
  ];

  const next = _.after(createQueries.length, this.done);

  _.each(createQueries, function (q) {
    this.db.run(q, next);
  }, this);
};
