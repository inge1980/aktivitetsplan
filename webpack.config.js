const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const plugins = (isMock, isSBS) => [
    new webpack.DefinePlugin({
        MOCK: JSON.stringify(isMock),
        SBS: JSON.stringify(isSBS),
    }),
    new HtmlWebpackPlugin({
        template: isSBS ? 'example/indexsbs.html' : 'example/indexffs.html',
    }),
];

const BABEL_INCLUDE = [/src/, /example/];

const RULES = [
    {
        test: /\.jsx?/,
        include: BABEL_INCLUDE,
        enforce: 'pre',
        loader: 'babel-loader',
    },
    {
        test: /\.(svg|png)$/,
        use: {
            loader: 'url-loader',
            options: { noquotes: true },
        },
    },
    { test: /\.less$/, loader: 'ignore-loader' },
];

module.exports = function(env) {
    const isDev = env && env.dev;
    const isMock = env && env.mock;
    const isSBS = env && env.sbs;

    return {
        entry: ['whatwg-fetch', './example/example.js'],
        devtool: isDev ? 'source-map' : false,
        output: {
            path: path.resolve(__dirname, 'example/build'),
            filename: 'bundle.js',
            publicPath: '/aktivitetsplanfelles/',
        },
        stats: {
            children: false,
        },
        plugins: plugins(isMock, isSBS),
        module: {
            rules: RULES,
        },
        resolve: {
            alias: {
                '~config': path.resolve(__dirname, './example/config'),
            },
            extensions: ['.js', '.jsx', '.json'],
        },
        devServer: {
            port: 3000,
            open: true,
            contentBase: path.resolve(__dirname, 'example'),
            historyApiFallback: {
                index: '/aktivitetsplanfelles/',
            },
            before: app => {
                app.get('/', (req, res) =>
                    res.redirect('/aktivitetsplanfelles/')
                );
            },
        },
    };
};
