'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('base/search'));
    processInclude(require('compare/product/compare'));
    processInclude(require('wishlist/product/wishlistHeart'));
});
