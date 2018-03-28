const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const webpack               = require('webpack');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin')

module.exports = {
    entry: {
        main: './src/js/main.js',
        fb: './src/js/facebookIntegration.js',
        game: ['./src/js/gameDetails.js', './src/js/chat.js'],
        imin: './src/js/imin.js',
        vendor: ['lodash', 'react']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']), // cleans up the dist directory on each build
        new HtmlWebpackPlugin({ // creates a new index.html
            title: 'ImIn',
            inject: true,
            template: 'src/template.index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('styles.css'),
        new CopyWebpackPlugin([
            { from: 'src/markers', to: 'images'},
            { from: 'src/pics', to: 'images'}
        ])
        //new webpack.HashedModuleIdsPlugin() // causes hashes to be named based on relative path of module
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'//,
            // name: false // excludes [name] in file names
            // cacheGroups: {
            //     vendor: {
            //         chunks: "initial",
            //         test: "vendor",
            //         name: "vendor",
            //         enforce: true
            //     }
            // }
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'//,
        //publicPath: '/' //commented out for minimal testing on localhost on client
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
                { 
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }                    
                }
            ]
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000,
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            }]
        }]
    },
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, "node_modules")],
        extensions: ['.js', '.jsx']
    }
}