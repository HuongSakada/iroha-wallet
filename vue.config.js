const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@utils', path.resolve(__dirname, 'src/utils'))
      .set('@router', path.resolve(__dirname, 'src/router.js'))
    return config
  }
}
