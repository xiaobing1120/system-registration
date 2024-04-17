import { RetweetOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd'
import React, { useContext, useState } from 'react';
import BaseContext from '@/context/BaseContext';

import './index.less';

interface SysSwitchType {
  title: string;
}
const SysSwitch: React.FC<SysSwitchType> = (props) => {
  const { title } = props;
  const { userInfo } = useContext(BaseContext)
  const [currentTitle, setCurrentTitle] = useState(title);

  const navList = [
    {
      title: '首页',
      img: '/link0.png',
      path: '/change',
    },

    {
      title: '员工自助',
      img: '/change1.png',
      // disabled: !userInfo?.staff,
      disabled: userInfo?.jobNumber === 'admin',
      path: '/staff/home',
    },
    {
      title: '综合查询',
      img: '/change2.png',
      disabled: !userInfo?.isLeader,
      path: '/leader/home',
    },

  ];
  // 系统中心鼠标移入
  const onMouseOver = (value: string): void => {
    setCurrentTitle(value);
  };

  // 系统中心鼠标移出
  const onMouseOut = (): void => {
    setCurrentTitle(title);
  };


  const SwitchMenu = (
    <div className="global-header-dropdown">
      <ul>
        {navList
          .filter((item) => !item.disabled)
          ?.map((item, index) => (
            <li
              key={String(index + 1)}
              onMouseOver={(): void => {
                onMouseOver(item.title);
              }}
              onMouseOut={onMouseOut}
              onClick={(): void=> {
                window.location.href = item.path;
              }}
            >
              <span className="hover" />
              <img alt={item.title} src={__LOCAL__ ? `http://10.94.12.5:5600${item.img}` : item.img} />
            </li>
          ))}
      </ul>
      <span>{currentTitle}</span>
    </div>
  );


  return <>
    <div className="global-header-sysSwitch">
      <Dropdown
        placement="bottomRight"
        dropdownRender={(): React.ReactElement => SwitchMenu}
      >
        <div>
          <RetweetOutlined />
          <span>{title}</span>
        </div>
      </Dropdown>
    </div>
  </>
}

export default SysSwitch;
