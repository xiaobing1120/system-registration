import React, { useContext } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import APIHelper from '@/helpers/APIHelper';
import avatar from '@/assets/avatar.png'
import baseContext from '@/context/BaseContext';
import SySwitch from './components/SySwitch'

import './index.less';



const Header: React.FC = () => {
  const { userInfo } = useContext(baseContext)

  // 登出
  const onLogout = (): void => {
    document.cookie = '';
    sessionStorage.clear()
    APIHelper.logout()
  }

  return (
    <Row id="global-header">
      <Col className="global-header-logo">
        <img src={__LOCAL__ ? `http://10.94.12.5:5600/logo_hr.png` : "/logo_hr.png"} alt="logo" />
      </Col>
      <Col className="global-header-name">HR外包人员统计管理平台</Col>
      <Col className="global-header-flex" />
      <Col>
        <SySwitch title="HR外包人员统计" />
      </Col>
      <Col className="global-header-user">
        <img src={avatar} alt="头像" />
        <strong>{userInfo.realname}</strong>
        <Tooltip title="退出登录">
          <span onClick={(): void => onLogout()}>
            <ExportOutlined title="退出" />
          </span>
        </Tooltip >
      </Col>
    </Row>
  );
};

export default Header;
