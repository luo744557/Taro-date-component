let path = require('path');
let resolve = path.resolve;
const config = {
  projectName: 'wxmp-supply-chain-C',
  date: '2022-07-05',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  mini: {
    esnextModules: [/@antmjs[\\/]vantui/],
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    optimizeMainPackage: {
      enable: true, // 开启智能提取分包依赖
    },
  },
  h5: {
    esnextModules: [/@antmjs[\\/]vantui/],
    publicPath: '/',
    staticDirectory: 'static',
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          selectorBlackList: ['body'],
        },
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body'],
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    devServer: {
      host: '0.0.0.0',
      port: 3333,
      proxy: {
        '/qds-insurance-scm-api': {
          target: 'https://devopen.fniaoyu.com', // 服务端地址
          changeOrigin: true,
          pathRewrite: {
            '^/qds-insurance-scm-api': '/qds-insurance-scm-api',
          },
        },
      },
      hot: true, // 关闭fast refresh
    },
    router: {
      mode: 'browser',
    },
  },
  alias: {
    '@assets': resolve(__dirname, '..', 'src/assets'),
    '@components': resolve(__dirname, '..', 'src/components'),
    '@pages': resolve(__dirname, '..', 'src/pages'),
    '@api': resolve(__dirname, '..', 'src/api'),
    '@utils': resolve(__dirname, '..', 'src/utils'),
    '@': resolve(__dirname, '..', 'src'),
    '@constant': resolve(__dirname, '..', 'src/constant'),
  },
};
module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
