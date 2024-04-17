# 更新日志

### 3.0.0

`2021年1月25日`

从活动组模版演变到全团队移动端通用模版

- **Build**
  - 🛠 .gitignore 中移除 package-lock.json

### 1.1.1

`2020年12月08日`

更新 webpack 配置

- **Feature**
  - 🌟 更新包分析器配置
  - 🌟 增加单元测试相关文件及依赖包
- **Build**
  - 🛠 .gitignore 中增加单元测试及 sonarqube 相关忽略声明

### 1.1.0

`2020年11月12日`

配合 create-react-app4.0 做的跟进修改

- **Feature**
  - 🌟 升级到 React 17
  - 🌟 升级到 TypeScript 4
  - 🌟 升级到 ESLint 7
  - 🌟 升级`@zycfc/apis`，将 APIs 的活动域名逻辑改为直接从包中获取（`env.activity`）
  - 🌟 增加 HTML .root 加载样式，React 开始渲染时加载动画就会被替换
- **Build**
  - 🛠 开发模式增加快速刷新（Fast Refresh）功能，在修改 tsx 文件时无需刷新页面即可生效（经实际测试，有些逻辑的变更可能需要手动刷新，否则可能会和实际有出入）
  - 🛠 开发模式安装缺失的 npm 包后会自动生效（之前需要重启服务）
- **Bug Fix**
  - 🐞 修改 Modal 组件打开后再关闭 body 的 overflow 属性没有重置的问题
- **Others**
  - 📝 升级了大部分开发依赖的 npm 包

### 1.0.10

`2020年9月15日`

- **Feature**
  - 🌟 增加全局变量`__PROJECT_NAME__`，取值为`package.json`中的 name
- **Build**
  - 🛠 增加新核心环境部署脚本
  - 🛠 生产环境开启 source map
  - 🛠 增加`npm run build:analyzer`命令，可开启打包依赖分析
- **Bug Fix**
  - 🐞 升级`@zycfc/zycfc-request`到最新版本，修复数据加密在 10 月出现的问题
- **Others**
  - 📝 升级 npm 包
  - 📝 移除白骑士相关代码

### 1.0.9

`2020年7月29日`

- **Bug Fix**
  - 🐞 升级`@zycfc/jweixin@1.6.2`，解决`wx.miniProgram.getEnv`缺失 TS 定义的问题
- **Build**
  - 🛠 新增配置代理功能
  - 🛠 config 文件中增加本地开发模式使用生产环境 babel 转码的配置：`useProductionBabelConfig`，为 true 的话可以本地开发转码 ES5
- **Others**
  - 📝 优化百融和统一风险 SDK 的方法

### 1.0.8

`2020年7月20日`

- **Feature**
  - 🌟 增加图片预加载工具方法
- **Build**
  - 🛠 开发默认端口号使用 config 文件中的配置
  - 🛠 优化 ts 配置，增加模块引入路径别名，以后开发可以使用`@/xx`表示引用`src`目录下的文件
- **Bug Fix**
  - 🐞 修复`NODE_ENV`拼写问题（之前错误拼写成了`NODOE_ENV`🤦‍♂️）
- **Others**
  - 📝 更新@zycfc npm 包
  - 📝 更新 babel 相关 npm 包（主要升级@babel/core 版本到 7.9.0，可以使用`export type { XxxTypeName } from 'xx/xx.ts'`语法）
  - 📝 更新 prettier 相关 npm 包（不升级前上边的导出语法 prettier 会报错）
  - 📝 本地开发模板不再显示 eruda

### 1.0.7

`2020年6月30日`

- **Feature**
  - 🌟 增加百融和统一风险 SDK 采集的方法封装，使用时直接调用即可（使用方法见`/doc`中的文档）

### 1.0.6

`2020年6月16日`

- **Feature**
  - 🌟 优化倒计时 hooks 逻辑，取消使用 moment，优化倒计时时间为 0 时的判断逻辑
  - 🌟 给页面增加错误边界
  - 🌟 增加异步组件加载时的 loading 动画
  - 🌟 增加全局变量`__VERSION__`
  - 🌟 增加路由守卫和标题栏组件的使用文档

### 1.0.5

`2020年4月18日`

- **Build**
  - 🛠 优化本地开发资源路径配置
- **Others**
  - 📝 更新 npm 包

### 1.0.4

`2020年4月14日`

- **Feature**
  - 🌟 增加全局环境变量`__IS_PROD__`，判断是否是生产环境
  - 🌟 增加 TypeScript 3.7 新特性支持（具体请看`src/pages/TsNew`）
- **Bug Fix**
  - 🐞 修改使用 ts 可选调用时报`no-unused-expressions`错误的问题

### 1.0.3

`2020年4月2日`

- **Feature**
  - 🌟 增加自定义 hooks-`useCountdown`
  - 🌟 增加自定义 hooks-`useDateCountdown`
- **Bug Fix**
  - 🐞 修复生产模式没有去掉 console 的问题
- **Build**
  - 🛠 统一修改资源路径为 s.hnzycfc.com
- **Others**
  - 📝 将`package-lock.json`从 ignore 中去掉了
  - 📝 去掉了 Sass 支持，如果需要在项目中使用，可以查看 README 中的配置
  - 📝 精简 ESLint 配置
  - 📝 规范文件命名

### 1.0.2

`2020年3月20日`

- **Feature**
  - 🌟 增加懒加载测试模块
- **Bug Fix**
  - 🐞`less-loader`增加`javascriptEnabled: true`配置，避免出现问题

### 1.0.1

`2020年3月5日`

- **Build**
  - 🛠 修改 webpack 打包 js 文件名为 vendors
