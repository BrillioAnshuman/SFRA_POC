'use strict';

const path = require('path');
const webpack = require('sgmf-scripts').webpack;
const ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];
const glob = require('glob');
const cwd = process.cwd();
const cartridgesPath = path.resolve(cwd, 'cartridges');
const clientPath = path.resolve(cartridgesPath, '*', 'cartridge/client');
const { all: allExcluded, js: jsExcluded, scss: scssExcluded } = require('./webpack.config.exclusions');

const bootstrapPackages = {
    Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
    // Button: 'exports-loader?Button!bootstrap/js/src/button',
    Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
    // Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
    // Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
    // Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/src/util'
};

/**
 * @description Validates if the file is in cartridges excluded from compilation or not.
 * @param {string} filePath -- A file path.
 * @param {...Array} excludedCartridges -- Arrays of cartridges excluded from compilation.
 * @returns {boolean} True if the file is in cartridges excluded from compilation. False otherwise.
 */
// function isFileToBeExcluded(filePath, ...excludedCartridges) {
//     return excludedCartridges.flat().some(cartridgeName => filePath.includes(cartridgeName));
// }

/**
 * @description Iterates over all the scss files in each cartridge (unless the cartridge is explicitly excluded via
 * 'webpack.config.exclusions') and returns an object containing the source scss and target css paths for each scss
 * file found.
 * @returns {Object} -- An object containing the source scss and target css paths for each scss file found.
 */
function findScssFiles() {
    return glob.sync(path.resolve(clientPath, '*', 'scss', '**', '*.scss'))
        .filter(fileSource => !path.basename(fileSource).startsWith('_'))
        .reduce((files, fileSource) => {
            // if (isFileToBeExcluded(fileSource, allExcluded, scssExcluded)) {
            //     return files;
            // }

            let fileTarget = path.relative(cwd, fileSource);
            fileTarget = fileTarget.substring(0, fileTarget.length - 5)
                .replace('scss', 'css')
                .replace('client', 'static');
            // eslint-disable-next-line no-param-reassign
            files[fileTarget] = fileSource;
            return files;
        }, {});
}

/**
 * @description Iterates over all the client js files in each cartridge (unless the cartridge is explicitly excluded
 * via 'webpack.config.exclusions') and returns an object containing the client source and target js paths for each
 * client js file found.
 * @returns {Object} -- An object containing the client source and target js paths for each client js file found.
 */
function findJsFiles() {
    return glob.sync(path.resolve(clientPath, '*', 'js', '*.js')).reduce((files, fileSource) => {
        // if (isFileToBeExcluded(fileSource, allExcluded, jsExcluded)) {
        //     return files;
        // }

        const fileTarget = path.join(path.dirname(path.relative(cwd, fileSource)), path.basename(fileSource, '.js'))
            .replace('client', 'static');
        // eslint-disable-next-line no-param-reassign
        files[fileTarget] = fileSource;
        return files;
    }, {});
}

module.exports = [{
    mode: 'production',
    name: 'js',
    entry: findJsFiles(),
    output: {
        path: path.resolve(__dirname) + '/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /bootstrap(.)*\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread'],
                        cacheDirectory: true
                    }
                }
            }
        ]
    },
    plugins: [new webpack.ProvidePlugin(bootstrapPackages)]
}, {
    mode: 'none',
    name: 'scss',
    entry: findScssFiles(),
    output: {
        path: path.resolve(__dirname) + '/',
        filename: '[name].css'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                        minimize: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('autoprefixer')()
                        ]
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve('node_modules'),
                            path.resolve('node_modules/flag-icon-css/sass')
                        ]
                    }
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({ filename: '[name].css' })
    ]
}];
