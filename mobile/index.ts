import express from 'express'
import webpack from 'webpack'
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')

const app = express()
const compiler = webpack(config)

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    })
)

app.listen(3000, function () {
    console.log('App running on port 3000')
})
