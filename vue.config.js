const webpack = require('webpack');

module.exports = {
    configureWebpack: {
        resolve: {
            fallback: {
                "http": require.resolve("stream-http"),
                "https": require.resolve("https-browserify"),
                "url": require.resolve("url"),
                "os": require.resolve("os-browserify/browser"),
                "path": require.resolve("path-browserify"),
                "buffer": require.resolve("buffer"),
                "timers": require.resolve("timers-browserify")
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            })
        ]
    },
    devServer: {
        proxy: 'http://localhost:8080'
    }
};
