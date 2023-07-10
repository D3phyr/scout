module.exports = {
  pwa: {
    workboxOptions: {
      directoryIndex: 'null',
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/global.scss";',
      },
    },
  },
  configureWebpack: config => {
    if(process.env.NODE_ENV === "production") {
      config.output.filename = 'js/[name].[contenthash:8].min.js'
      config.output.chunkFilename = 'js/[name].[contenthash:8].min.js'
    } else {
      config.output.filename = 'js/[name].js'
      config.output.chunkFilename = 'js/[name].js';
    }
  },
}
