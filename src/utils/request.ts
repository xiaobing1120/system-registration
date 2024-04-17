import axios from 'axios';
import { message } from 'antd';
import { Any } from '@/constants/types';

/* eslint-disable */
const service = axios.create({
  baseURL:"/server",
  timeout: 120000,
});


// 请求前拦截
service.interceptors.request.use(
  async (config: any) => {
    config.data = config.data || {};

    if (__SERVER_ENV__ === 'sit') {
      console.log(`${config.url} 请求前参数`, config.data);
      console.log(`${config.url} 请求前config`, config);
    }

    config.headers = {
      ...config.headers,
      'content-type': 'application/json',
      'ZYCFC-TRACE-ID': 'f2f82e674d00c4d43e883c6cad16f347',
    };

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应后拦截
service.interceptors.response.use(
  async (response: any) => {
    if (__SERVER_ENV__ === 'sit') {
      console.log(`${response.config.url} 响应数据 `, response);
    }

    if(response.config['responseType'] === 'blob' && response.status === 200){
      if(response.headers['content-type'] === 'application/json'){      
        response.data = await response.data.text()
        response.data = JSON.parse(response.data)
      }else{
        const fileName = (response.headers['content-disposition'].match(/filename\=(.+)/) || [])[1]
        if(fileName){
          const blob = new Blob([response.data]);
          const objectURL = URL.createObjectURL(blob);
          let btn = document.createElement('a');
          btn.download = decodeURIComponent(fileName)
          btn.href = objectURL;
          btn.click();
          URL.revokeObjectURL(objectURL);
          // btn = null;
        }
        return {}
      }
    }

    

    let res: Any = {};
    res = response.data;

    if (__SERVER_ENV__ === 'sit') {
      console.log(`${response.config.url} 响应数据 res`, res);
    }

    if (res.code === '200') {
      const { data = {} } = res;
      const { current, size, total } = data || {};
      if (current !== undefined && size !== undefined) {
        return {
          data: data.records || [],
          success: true,
          total,
        };
      }
      return data || {};
    } else {
      if (res.code === '10001') {
        document.cookie = '';
        sessionStorage.clear()
        return window.location.href = '/user/login';
      }
      message.error(res.message);
      return Promise.reject(res);
    }
  },
  (err: { response: { status: any }; message: string }) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误';
          break;

        /*  case 401:
          err.message = '登录失效，请登录';
          window.location.href = window.location.origin + '/login';
          sessionStorage.clear();
          break; */

        case 403:
          err.message = '拒绝访问';
          break;

        case 404:
          err.message = '404，找不到服务或服务正在构建';
          break;

        case 408:
          err.message = '请求超时';
          break;

        case 500:
          err.message = '服务器内部错误';
          break;

        case 501:
          err.message = '服务未实现';
          break;

        case 502:
          err.message = '网关错误';
          break;

        case 503:
          err.message = '服务不可用';
          break;

        case 504:
          err.message = '网关超时';
          break;

        case 505:
          err.message = 'HTTP版本不受支持';
          break;

        default:
      }
    }
    message.error(err.message);
    return Promise.reject(err);
  }
);

export default service;
