const { defineConfig } = require('@vue/cli-service');
const path = require('path');
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api/': {
        target: process.env.API_URL, pathRewrite: { '^/api/': '' }, changeOrigin: true
      },
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/theme/vars/*.sass'),
      ]
    }
  }
});
