const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
process.traceDeprecation = true;

const common = {
    entry: {
        main: './src/js/main.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'React App'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin()
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: ''
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
            use: [
                'style-loader',
                'css-loader'
            ]
        }]
    },
    resolve: {
        modules: [path.resolve(__dirname), path.resolve(__dirname, "node_modules")],
        extensions: ['.js', '.jsx']
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
        port: 8008,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:8008",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            //,"Access-Control-Allow-Credentials": "true"
        },
        host: "0.0.0.0",
        proxy: {
            '/api/*': {
                target: 'http://localhost:8009',
                secure: false//,
                /*changeOrigin: true,
                bypass: function(req, res, proxyOptions) {
                if (req.headers.accept.indexOf('html') !== -1) {
                    console.log('Skipping proxy for browser request.');
                    return '/index.html';
                }*/
            }
        }
    }
};

/*const frontend = {
     entry: ['./main.js'],
     output: {
        path:'/',
        filename: 'index.js',
    }
};

const backend = {
     entry: ['./backend.js', "./connect.js"],
     output: {
        path:'/',
        filename: 'backend_index.js',
    },
     target: 'node',
     externals: ['mysql']// specify for example node_modules to be not bundled
};

module.exports = [
    Object.assign({} , common, frontend),
    Object.assign({} , common, backend)
];*/

module.exports = common;