'use strict';

const cache = new Cache({ defaultTtl: 300 * 1000 }); //5min

module.exports = cache;