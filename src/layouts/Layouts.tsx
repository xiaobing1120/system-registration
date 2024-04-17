import React, { useState, useEffect } from 'react';
import {
  Outlet,
  useLocation, useNavigate,
} from 'react-router-dom';
import Scrollbars from 'react-custom-scrollbars-2';
import LoadingPage from '@/components/LoadingPage';
import BaseContext from '@/context/BaseContext';
import APIHelper from '@/helpers/APIHelper';
import Header from '@/components/Header';
import LeftMenu from '@/components/LeftMenu';
import {
  BasePaginationType, DictAllType, UserType,
} from '@/constants/types';

import './index.less';

const Layouts: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [dictAll, setDictAll] = useState<DictAllType>({
    source: {},
    education: {},
    political: {},
    work_place: {},
    takeJob: { 0: '否', 1: '是' },
    empSex: { WOMAN: '女', MAN: '男' },
  }); // 用户信息
  const [userInfo, setUserInfo] = useState<Partial<UserType>>({}); // 用户信息
  const [basePagination, setBasePagination] = useState<Partial<BasePaginationType>>({}); // 供应商信息

  const [loading, setLoading] = useState<boolean>(true);

  // 初始化
  const onStart = async (): Promise<void> => {
    try{
      await new Promise((resolve, reject) => { resolve({}) })
    }catch (e) {
      console.error(e)
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBasePagination({
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 30, 50, 100],
      showQuickJumper: true,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
    })
    onStart()
  }, []);

  return (
    <BaseContext.Provider
      value={{
        dictAll,
        userInfo,
        basePagination
      }}
    >
      {loading ? (
        <LoadingPage />
      ) : (
        <div id="layout-box">
          <div id="layout-header">
            <Header />
          </div>
          <div id="layout-main">
            <div id="layout-main-left">
              <LeftMenu />
            </div>
            <div id="layout-main-right">
              <Scrollbars>
                <Outlet />
              </Scrollbars>
            </div>
          </div>

        </div>
      )}
    </BaseContext.Provider>
  );
};

export default Layouts;
