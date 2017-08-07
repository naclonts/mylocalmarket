// Define API's host URL - dev or production
var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var apiHost;

module.exports = {
    context: __dirname,

    entry: {
        farmer: './assets/js/markets/farmer.js',
        interactions: './assets/js/markets/interactions.js',
    },

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name].js',
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.DefinePlugin({
            __API_URL__: hostAPI(process.env.NODE_ENV)
        })
    ],

    module: {
        loaders: [ {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },

}

function hostAPI(environment) {
    switch (environment) {
        case 'production':
            return "'https://nathanclonts.com/mylocalmarket/'";
        case 'develop':
            return "'http://localhost:8000/'";
    }
};
