import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import  '@/components/style/GlobalStyle.less';
import { ConfigProvider, App } from 'antd'
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import Routers from './Routers';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('zycfc-app')!;
const root = ReactDOMClient.createRoot(container);

root.render(
  <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
    <ConfigProvider locale={locale}>
      <App>
        <Router basename="/">
          <Routers />
        </Router>
      </App>
    </ConfigProvider>
  </StyleProvider>
);
