const path = require('path');
const paths = require('./paths');

const pkg = require(paths.appPackageJson);

const { SERVER_ENV } = process.env;
const SERVER_ENV_IS_PROD = SERVER_ENV === 'prod';


const config = {
  // 通用配置（dev和prod都生效的）
  global: {
    imageInlineSizeLimit: 8192, // 小图片转行内base64格式的大小限制(kb)
    fontInlineSizeLimit: 8192, // 字体转base64的大小限制(kb)
  },
  // 本地开发配置
  development: {
    host: '0.0.0.0',
    port: 9000,

    sourceMap: true, // 是否开启SourceMap

    // 相对于服务器根目录的路径，用于加载资源。
    publicPath: '/',

    // 是否在本地使用生产的babel打包配置（为了编译效率，默认本地不会转es5）
    useProductionBabelConfig: false,

    // 是否开启https
    useHttps: false,

    // proxy代理
    /*proxyTable: {
      // 用法1： 请求到 /api/xxx 现在会被代理到请求 http://localhost:3000/api/xxx, 例如 /api/user 现在会被代理到请求 http://localhost:3000/api/user
      '/api': 'http://localhost:3000',
      // 用法2： 请求到 /api2/xxx 现在会被代理到请求 http://localhost:3000/xxx, 例如 /api2/user 现在会被代理到请求 http://localhost:3000/user
      '/api2': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api2': '' },
        // secure: false, // 是否验证SSL Certs，默认情况下，不接受运行在 HTTPS 上，且使用了无效证书的后端服务器。如果想要接受，只要设置 secure: false 就行
        // changeOrigin: true, // 将主机标头的原点更改为目标URL，默认false，如果接口跨域，需要进行这个参数配置
      },
    },*/
  },
  // 打包配置
  build: {
    // 是否开启SourceMap
    sourceMap: !SERVER_ENV_IS_PROD,
    // 构建根目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 相对于服务器根目录的路径，用于加载资源。（css、js、font部署的路径。2020年4月7日修改，图片、音视频等除index.html外的所有文件，全部放在「s」域名下）
    publicPath: `/`,
  },
};

module.exports = config;
