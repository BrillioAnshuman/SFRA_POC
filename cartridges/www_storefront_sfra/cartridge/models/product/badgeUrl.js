'use strict';
/**
 * @constructor
 * @classdesc Returns badge images for a given product
 * @param {dw.catalog.Product} apiProduct - product to return badge images
 */
function Badges(apiProduct) {
    var baseSceneUrl = 'https://s7d4.scene7.com/is/image/WolverineWorldWide/'; // these URL will be moved to Custom prefs
    var imageParams = '?fmt=png-alpha&;hei=300';
    var badgeUrl = apiProduct ? baseSceneUrl + apiProduct.custom.badge[0] + imageParams : null;
    return {
        badgeImage: apiProduct ? apiProduct.custom.badge[0] : false,
        badgeUrl: badgeUrl
    };
}

module.exports = Badges;
