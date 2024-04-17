import React from 'react';

import './index.less';

const LoadingPage: React.FC = () => {
  return (
    <div>
      <div className="loading-container">
        <img
          src="https://i.hnzycfc.com/vi/icons/pomelo-jump.png"
          style={{ width: '80px', height: '80px' }}
          alt="loading.gif"
        />
        <div className="loading-text">&nbsp;加载中...</div>
      </div>
    </div>
  );
};

export default LoadingPage;
