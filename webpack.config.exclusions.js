'use strict';

/**
 * @description To exclude client side js or scss from default compilation using the 'build', 'compile:js', or
 * 'compile:scss` commands, the name of the cartridge they are in should be placed in the appropriate array as a string.
 * Please note that in this case the client side js or scss of the excluded cartridge have to be compiled separately
 * and uploaded with the cartridge.
 */
module.exports = {
    all: [],
    js: ['int_experian_sfra'],
    scss: []
};
