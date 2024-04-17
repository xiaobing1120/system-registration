import React, { ReactNode } from 'react';
import { Result } from 'antd';

interface Error {
  message: string;
  stack: string;
}

interface Props {
  children?: ReactNode;
}

interface StateProps {
  hasError: boolean;
  errMsg: string;
  errStack: string;
}

class ErrorBoundary extends React.Component<Props, StateProps> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errMsg: '',
      errStack: '',
    };
  }

  static getDerivedStateFromError(error: Error): StateProps {
    return {
      hasError: true,
      errMsg: error.message,
      errStack: error.stack,
    };
  }

  render(): React.ReactNode {
    const { hasError, errMsg, errStack } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div style={{ color: '#646a73' }}>
          <Result
            status="warning"
            title="出现了一些问题"
            extra="可能是网络原因导致的，请刷新页面或稍后再试"
          />

          <pre
            style={{
              display: 'none',
            }}
          >
            {errMsg}
            {errStack}
          </pre>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
