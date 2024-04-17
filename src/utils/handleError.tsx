import { message } from 'antd';

// 处理接口报错
export default function handleError(
  err: {
    returnCode: string;
    returnMsg: string;
  },
  errMsg?: string
): void {
  message.info(errMsg || err.returnMsg || '系统异常，稍后重试～');
}
