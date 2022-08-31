const webpack = require('webpack');

module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '黎都快贷'
        return args
      })
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://8.141.251.9/iis/dingding/lidu/loan/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  productionSourceMap: true
}
