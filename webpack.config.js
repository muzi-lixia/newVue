module.exports = {
    entry: './src/index.js',
    output: {
        publicPath: "dist",
        filename: "bundle.js"
    },
    devServer: {
        port: 8080,
        contentBase: 'www'
    }
}