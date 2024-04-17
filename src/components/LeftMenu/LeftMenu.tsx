import React, { useContext, useEffect, useRef, useState } from 'react';
import { Menu } from 'antd';
import { PieChartFilled, HddFilled, IdcardFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom';
import { RecordString } from '@/constants/types';
import './index.less'
import BaseContext from '@/context/BaseContext';

interface CurrentMenuMenuType {
  key: number;
  label: string;
  path?: string;
  icon: React.ReactElement | string;
  children: CurrentMenuMenuType[] | null;
}

// 左侧菜单
const LeftMenu: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentMenu, setCurrentMenu] = useState<CurrentMenuMenuType[]>([])
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string>('welcome')
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string>('')

  const menuData = useRef<RecordString>({})


  return <div className="left-menu">
    <Menu
      style={{ width: '100%' }}
      defaultSelectedKeys={[defaultSelectedKeys]}
      defaultOpenKeys={[defaultOpenKeys]}
      mode="inline"
      theme="light"
      items={
        [
          {
            title: '系统配置',
            label: '系统配置',
            value: '222',
            key: '222'
          }
        ] as any
      }
      onSelect={(e): void => {
        const path = menuData.current[e.key]
        if(path) navigate(path)
      }}
    />
  </div>;
};

export default LeftMenu;
