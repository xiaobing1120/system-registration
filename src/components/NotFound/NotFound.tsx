import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import LoadingIcon from '@/assets/loading-icon.gif';

import './index.less';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      className="not-found-page"
      icon={
        <img src={LoadingIcon} style={{ width: '80px' }} alt="no-found.gif" />
      }
      status="error"
      title="页面丢失了"
      extra={
        <div className="tips">
          您所查看的页面已不存在，
          <Button
            type="primary"
            size="small"
            onClick={(): void => {
              navigate('/');
            }}
          >
            一键返回首页
          </Button>
        </div>
      }
    />
  );
};

export default NotFound;
