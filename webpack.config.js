var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,

    entry: './assets/js/markets/farmer.js',

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name].js',
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'})
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // query: {
                //     presets: ['es2015']
                // }
            },
        ],
    },

}
