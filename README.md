# WEB 前端基于 CRA 的 TypeScript 模板


## 使用注意

1. 先修改`package.json`的`version`和`description`

2. 需要把 Test 模块相关删掉（router 中和 pages/Test）

3. 注意模块拆分，不要单文件代码过长

4. git 提交要及时，按功能块和 bug 修复拆分提交，commit message 要有意义，可回溯

5. 默认`package-lock.json`文件没有忽略，开发时可以先将 lock 文件删除，再安装依赖，自动更新 lock 文件，然后以此版本稳准进行测试和上线。

## 上手 TypecScript

1. TS 和 React 结合使用，建议参考[react-typescript-cheatsheet](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)

2. TS 的学习，建议查看[TypeScript 入门教程](https://ts.xcatliu.com/) 和 [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

## 和老模板的区别

1. `NODE_ENV`只有在本地开发时才是 development，只要是 run build，不论 server 环境是什么，`NODE_ENV`都是 production。

2. webpack DefinePlugin 定义的有两个环境变量，和之前老模板一样，一个是`__SERVER_ENV__`，值是`['dev', 'sit', 'uat', 'grey', 'prod']`中的一个；一个是`__LOCAL__`，值是布尔类型的`true`或`false`。老模板中的`__DEV__`变量在本模板中不存在。

3. 所有页面都在`src/pages`目录下。

4. ~~支持 Less 和 Sass（windows 用 Sass 需要先装 Python，[详见](https://github.com/sass/node-sass#install)）。~~ 由于 Sass 在 windows 上使用不便，所以暂时去掉 Sass 支持，如要增加，请看下方配置。

5. 支持判断端口占用。

6. 暂时没有加`BundleAnalyzerPlugin`，需要的话可以自行引入。

7. px2vw 从本模板开始基准尺寸为 1080 px

## 增加 Sass 支持

1. 安装依赖 `npm i sass sass-loader node-sass -D`

2. 在 webpack 配置的 css 配置下方，插入如下代码：

```js
// 支持SASS（.scss或者.sass后缀名），也支持SASS Modules
{
  test: /\.(scss|sass)$/,
  exclude: /\.module\.(scss|sass)$/,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
    'sass-loader'
  ),
  // Don't consider CSS imports dead code even if the
  // containing package claims to have no side effects.
  // Remove this when webpack adds a warning or an error for this.
  // See https://github.com/webpack/webpack/issues/6571
  sideEffects: true,
},
```
