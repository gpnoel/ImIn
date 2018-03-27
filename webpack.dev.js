const merge     = require('webpack-merge');
const webpack   = require('webpack')
const common    = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        hmr: 'webpack/hot/dev-server',
        hmr_endpoint: 'webpack-dev-server/client?http://localhost:8008',
        react_hot_loader: 'react-hot-loader/patch'
        // hmr: [
        //     'react-hot-loader/patch',
        //     // 'webpack/hot/dev-server',
        //     'webpack-dev-server/client?http://localhost:8008'
        // ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HashedModuleIdsPlugin(), // relative path of moduleis displayed when HMR is enabled
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});