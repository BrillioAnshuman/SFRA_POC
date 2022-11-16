'use strict';
var badgeUrlModel = require('*/cartridge/models/product/badgeUrl');
module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'badge', {
        enumerable: true,
        value: badgeUrlModel(apiProduct)
    });
};

