const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const webpackDevClientEntry = require.resolve(
  'react-dev-utils/webpackHotDevClient'
);
const reactRefreshOverlayEntry = require.resolve(
  'react-dev-utils/refreshOverlayInterop'
);

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const postcssNormalize = require('postcss-normalize');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');

const config = require('./config');
const pkg = require('../../package.json');

// Source maps 文件比较大，而且再处理大的源文件时，可能导致内存不足问题
const shouldUseSourceMap = config.build.sourceMap;

const { imageInlineSizeLimit, fontInlineSizeLimit } = config.global;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// 检查TypeScript是否配置
const useTypeScript = fs.existsSync(paths.appTsConfig);

const { SERVER_ENV, NODE_ENV } = process.env;
const IS_LOCAL = NODE_ENV === 'development';
const SERVER_ENV_IS_PROD = SERVER_ENV === 'prod';

// 这是开发模式和生产模式通用的配置
// 主要针对于优化开发体验，快速构建和减小打包的资源
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const shouldUseReactRefresh = true;

  // publicPath定义应用服务端路径，要以斜杠`/`结尾
  // 开发模式通常使用根目录
  const publicPath = isEnvProduction
    ? config.build.publicPath
    : config.development.publicPath || '';

  // 当不使用pushState前端路由的时候，可以使用相对资源路径
  const shouldUseRelativeAssetPaths = publicPath === './';

  // 获取style loader的通用方法
  const getStyleLoaders = (cssOptions, preProcessor, preProcessorOptions) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // PostCSS配置，根据package.json中的配置，自动增加css浏览器前缀
        loader: require.resolve('postcss-loader'),
        options: {
          // 标识符，可以是任意的唯一字符，推荐使用'postcss'，
          // 在css文件中使用`@import 'xxx.css'`这种外部样式时需要使用
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // 根据package.json中配置的浏览器列表，引入需要的
            // normalize.css或者sanitize.css代码
            postcssNormalize(),
          ],
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap,
            ...preProcessorOptions,
          },
        }
      );
    }
    return loaders;
  };

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // 在第一个错误出现时抛出失败结果，而不是容忍它。默认情况下，当使用 HMR 时，webpack 会将在终端以及浏览器控制台中，以红色文字记录这些错误，但仍然继续进行打包。
    bail: isEnvProduction,
    // eslint-disable-next-line no-nested-ternary
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'hidden-source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    // 应用的入口文件
    entry:
      isEnvDevelopment && !shouldUseReactRefresh
        ? [
            // 开发环境引入webpackHotDevClient。作用是通过socket连接WebpackDevServer，
            // 当修改css等样式文件时热更新页面（不刷新），当修改js/ts文件时，会刷新页面。
            // 当代码存在错误时，会通过遮罩将错误展示出来。
            // 使用的是Create React App开发的热重载工具，而没有使用WebpackDevServer提供的，
            // 如果要使用webpack提供的，可以替换成下边的两行代码
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            webpackDevClientEntry,
            // Finally, this is your app's code:
            paths.appIndexJs,
            // We include the app code last so that if there is a runtime error during
            // initialization, it doesn't blow up the WebpackDevServer client, and
            // changing JS code would still trigger a refresh.
          ]
        : paths.appIndexJs,
    output: {
      // 构建结果目录
      path: isEnvProduction ? paths.appBuild : undefined,
      // 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。
      // 此选项在 development 模式时的默认值是 true，而在 production 模式时的默认值是 false。
      pathinfo: isEnvDevelopment,
      // 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下。
      // 在开发模式，并不会生成真正的文件
      filename: isEnvProduction ? '[name].[contenthash:8].js' : isEnvDevelopment && 'bundle.js',
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      // 使用代码分隔或按需加载时生成的文件名
      chunkFilename: isEnvProduction
        ? '[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && '[name].chunk.js',
      //output的publicPath决定了异步加载的js，使用htmlWebpackPlugin插入的bundle.js，从css中引入的图片或字体，以及miniCssExtractPlugin分离的css的路径，这个路径是文件引用路径
      // 在开发模式使用"/"
      publicPath,
      // 将sourceMap入口指向到原本的磁盘位置
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      // 默认值是'window'，设置成'this'的话，构建的代码就能在web workers中使用的
      globalObject: 'this',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // 只在production打包模式下使用
        new TerserPlugin({
          // 关闭License文件单独打包
          extractComments: false,
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
              drop_console: SERVER_ENV_IS_PROD,
            },
            mangle: {
              // 解决Safari 10 中的"Cannot declare a let variable twice"问题
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // 打开原因：若使用默认配置，emoji表情和正则表达式可能不能正确压缩
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        // 下面配置只会在production模式下生效
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false`强制使sroucemap输出到分开的文件中
                  inline: false,
                  // `annotation: true`将sourceMappingURL添加到css文件末尾，帮助浏览器找到sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: 'all',
        name: 'vendors',
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      // runtimeChunk: {
      //   name: entrypoint => `runtime-${entrypoint.name}`
      // },
      runtimeChunk: false,
    },
    resolve: {
      // 告诉 webpack 解析模块时应该搜索的目录。
      // 绝对路径和相对路径都能使用，但是要知道它们之间有一点差异。
      // 通过查看当前目录以及祖先路径（即 ./node_modules, ../node_modules 等等），相对路径将类似于 Node 查找 'node_modules' 的方式进行查找。
      modules: ['node_modules', paths.appNodeModules],
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: paths.moduleFileExtensions
        .map((ext) => `.${ext}`)
        .filter((ext) => useTypeScript || !ext.includes('ts')),
      alias: {
        '@': path.resolve(__dirname, '../../src'),
      },
      plugins: [],
    },

    module: {
      strictExportPresence: true,
      rules: [
        // 禁用require.ensure，因为这不是一个标准的语言规范
        { parser: { requireEnsure: false } },
        {
          // "oneIf"会遍历所有其中的loader，直到其中某个符合要求。
          // 如果没有找到符合的loader，则会默认使用最后的file loader
          oneOf: [
            // url loader作用类似file loader，不同点是url loader会将小于limit大小的文件，
            // 转换为base64
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: '[name][hash:8].[ext]',
                publicPath: IS_LOCAL ? '' : 'assets/images/',
                outputPath: IS_LOCAL ? '' : 'assets/images/',
              },
            },
            // 使用babel处理js文件
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-react-app/webpack-overrides'
                ),

                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  isEnvDevelopment &&
                    shouldUseReactRefresh &&
                    require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                // 这个是babel-loader针对webpack的功能，不是babel本身的功能
                // 作用是会缓存一些数据到./node_modules/.cache/babel-loader/目录，
                // 达到更快的rebuild
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            // 使用babel处理app之外的js文件
            // 不同于项目中的js文件，这个只会编译标准的js特性
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve('babel-preset-react-app/dependencies'),
                    { helpers: true },
                  ],
                ],
                cacheDirectory: true,
                // https://github.com/facebook/create-react-app/issues/6846
                cacheCompression: false,

                // Babel sourcemaps在debug node_modules代码时需要，没有的话，vscode
                // 会识别出错误的行数和断点
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            // postcss loader会在css中自动加浏览器前缀
            // css loader会解析css路径，并且把样式中的资源添加到依赖中
            // style loader会把css转为js module，注入到<style>标签中
            // 生产模式使用 MiniCSSExtractPlugin 将CSS样式导出到文件中
            // 开发模式通过 style loader 支持CSS热更新
            // 默认支持.module.css后缀名的CSS Modules
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // // 支持SASS（.scss或者.sass后缀名），也支持SASS Modules
            // {
            //   test: /\.(scss|sass)$/,
            //   exclude: /\.module\.(scss|sass)$/,
            //   use: getStyleLoaders(
            //     {
            //       importLoaders: 2,
            //       sourceMap: isEnvProduction && shouldUseSourceMap,
            //     },
            //     'sass-loader'
            //   ),
            //   // Don't consider CSS imports dead code even if the
            //   // containing package claims to have no side effects.
            //   // Remove this when webpack adds a warning or an error for this.
            //   // See https://github.com/webpack/webpack/issues/6571
            //   sideEffects: true,
            // },
            // 支持Less
            {
              test: /\.less$/,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
                'less-loader',
                {
                  javascriptEnabled: true,
                }
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            {
              test: /\.(ttf|eot|woff|woff2)$/,
              use: [
                {
                  loader: require.resolve('url-loader'),
                  options: {
                    limit: fontInlineSizeLimit,
                    name: '[name][hash:8].[ext]',
                    publicPath,
                    outputPath: IS_LOCAL ? '' : 'assets/fonts/',
                    fallback: require.resolve('file-loader'),
                  },
                },
              ],
            },
            // file loader确保资源被WebpackDevServer解析
            // 在生产模式，这些文件将会被复制到打包后的目录中
            // 没有用'test'参数，所以所有未被前边捕获的文件都会经过这个处理
            {
              loader: require.resolve('file-loader'),
              // 剔除js文件
              // 同时剔除html和json文件，这两个由webpack内部的loader处理
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: '[name][hash:8].[ext]',
                publicPath,
                outputPath: IS_LOCAL ? '' : 'assets/medias/',
              },
            },
            // ! 想加一个新的loader吗？!
            // 如果要加新的loader，不要加在这里，要加在上边的file-loader之上，
            // 因为上边的file-loader会处理所有之前没有命中的文件，因此file-loader
            // 之后的loader就不起作用了
          ],
        },
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        ...(isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined),
      }),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(paths.appPath),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin({
        __SERVER_ENV__: `"${SERVER_ENV}"`,
        __LOCAL__: IS_LOCAL,
        __IS_PROD__: SERVER_ENV_IS_PROD,
        __VERSION__: JSON.stringify(pkg.version),
        __PROJECT_NAME__: `"${pkg.name}"`,
      }),
      // This is necessary to emit hot updates (currently CSS only):
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/master/packages/react-refresh
      isEnvDevelopment &&
        shouldUseReactRefresh &&
        new ReactRefreshWebpackPlugin({
          overlay: {
            entry: webpackDevClientEntry,
            // The expected exports are slightly different from what the overlay exports,
            // so an interop is included here to enable feedback on module-level errors.
            module: reactRefreshOverlayEntry,
            // Since we ship a custom dev client and overlay integration,
            // the bundled socket handling logic can be eliminated.
            sockIntegration: false,
          },
        }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebook/create-react-app/issues/186
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css',
        }),
      // Moment.js会打包进很多语言文件，默认把这些语言文件去掉
      // 如果没有使用Moment.js可以把这个去掉
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // TypeScript 类型检查
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          async: isEnvDevelopment,
          useTypescriptIncrementalApi: true,
          checkSyntacticErrors: true,
          tsconfig: paths.appTsConfig,
          reportFiles: [
            // This one is specifically to match during CI tests,
            // as micromatch doesn't match
            // '../cra-template-typescript/template/src/App.tsx'
            // otherwise.
            '../**/src/**/*.{ts,tsx}',
            '**/src/**/*.{ts,tsx}',
            '!**/src/**/__tests__/**',
            '!**/src/**/?(*.)(spec|test).*',
            '!**/src/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          silent: true,
          // The formatter is invoked directly in WebpackDevServerUtils during development
          formatter: isEnvProduction ? typescriptFormatter : undefined,
        }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: !SERVER_ENV_IS_PROD && !IS_LOCAL,
        reportFilename: path.resolve(
          process.cwd(),
          'bundle-analyze-result.html'
        ),
      }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        context: paths.appSrc,
        // ESLint class options
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      }),
    ].filter(Boolean),

    // 这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。
    // 这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行。
    // -true：提供 polyfill。
    // -"mock"：提供 mock 实现预期接口，但功能很少或没有。
    // -"empty"：提供空对象。
    // -false: 什么都不提供。预期获取此对象的代码，可能会因为获取不到此对象，触发 ReferenceError 而崩溃。尝试使用 require('modulename') 导入模块的代码，可能会触发 Cannot find module "modulename" 错误。
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    // 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。
    // 关闭原因：使用cra提供的FileSizeReporter展示文件大小
    performance: false,
  };
};
