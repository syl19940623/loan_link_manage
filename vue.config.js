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
        target: 'http://192.168.0.20/dingding/lidu/loan/',
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
