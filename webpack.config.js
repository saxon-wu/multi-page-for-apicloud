const PATH = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
const PAGE_NAME = 'Home';
const HOME_PATH = `./src/page/${PAGE_NAME}/`;

module.exports = {
    devServer: {
        port: 8080,
        progress: true,
        contentBase: PATH.resolve(__dirname, 'dist'),
        index: `${PAGE_NAME.toLocaleLowerCase()}.html`,
        liveReload: true,
        open: true, // Open your default browser
        overlay: true, // Shows a full-screen overlay in the browser when there are compiler errors or warnings
    },
    mode: 'development', // TODO: "production" should be produced
    entry: `${HOME_PATH}${PAGE_NAME.toLocaleLowerCase()}.js`,
    output: {
        filename: 'bundle.[hash:8].js', // Adding hash ensures that the current file is loaded
        path: PATH.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}), // minify javaScript for production only
            new OptimizeCSSAssetsPlugin({}) // minify CSS for production only
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), // Cleaning up the "/dist" folder
        new HtmlWebpackPlugin({
            title: PAGE_NAME,
            filename: `${PAGE_NAME.toLocaleLowerCase()}.html`,
            template: `${HOME_PATH}${PAGE_NAME.toLocaleLowerCase()}.html`,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: false, //TOTO: "true" should be produced
            }
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ?  '[id].css' : '[id].[hash].css',
            ignoreOrder: true, // Enable to remove warnings about conflicting order
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/i,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties', // This plugin transforms static class properties as well as properties declared with the property initializer syntax
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        // loader: 'style-loader',
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    {
                        // loader: 'style-loader',
                        loader: MiniCssExtractPlugin.loader,
                    },
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ]
            }
        ]
    }
}