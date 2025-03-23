import axios from 'axios';
import { JIAMI, JIEMI } from './crypto';
import Taro from '@tarojs/taro';

axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

// body转换为search格式 ...?a=1&b=2
axios.defaults.transformRequest = [
  (data) => {
    if (data && data.body) {
      let search = '';
      Object.keys(data).forEach((key) => {
        search +=
          encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
      });
      return search.slice(0, search.length - 1);
    }
    return data;
  },
];

// 对异步请求进行计数
// 并发请求时，当且仅当最后返回时触发Success Action
let count = 0;

const { NODE_ENV = null } = process.env;
let isEncrypt = true; // 接口是否加密
// 构建
if (NODE_ENV === 'production' && window.location) {
  if (window.location.origin.indexOf('//dev') !== -1) {
    isEncrypt = false;
  }
} else if (NODE_ENV === 'development') {
  isEncrypt = false;
}
axios.interceptors.request.use(
  (config) => {
    if (!isEncrypt) {
      // 不加密
      config.headers['my-super-requester'] = 'noencryption';
    }
    if (config.method === 'get') {
      config.params = {
        body: isEncrypt ? JIAMI(JSON.stringify(config.params)) : config.params,
      };
    }

    if (config.method === 'post') {
      config.data = {
        body: isEncrypt
          ? JIAMI(JSON.stringify(config.data))
          : JSON.stringify(config.data),
      };
    }

    if (config.global !== false) {
      count = Math.max(count, 0);
      count = count + 1;
      if (count === 1) {
        Taro.showToast({
          title: '加载中…',
          icon: 'loading',
          duration: 0,
        });
      }
    }
    return config;
  },
  (error) => {
    count = -1;
    Taro.showModal({
      title: '温馨提示',
      content: '参数异常',
    });
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  ({ config, data = { code: 500 } }) => {
    // 解密响应体
    if (isEncrypt) {
      data = JSON.parse(JIEMI(data));
    }
    // 全局提示
    if (config.global !== false) {
      count = count - 1;
      if (count === 0) {
        Taro.hideToast();
      }
      if (data.code !== 200) {
        count = -1;
        Taro.showModal({
          title: '温馨提示',
          content: (data.data && data.data.message) || '服务器繁忙，请稍后再试',
        });
      }
    }

    // 失败
    if (data.code !== 200) {
      Taro.hideToast();
      return Promise.reject(data);
    }

    return data;
  },
  (error) => {
    // 主动取消
    if (axios.isCancel(error)) {
      count = count - 1;
      if (count === 0) {
        Taro.hideToast();
      }
    }

    // 其他异常
    else {
      count = -1;
      Taro.hideToast();
      Taro.showModal({
        title: '非常抱歉',
        content: '网络异常',
      });
    }

    return Promise.reject(error);
  }
);

// 环境区分
const prefixMap = {
  dev: {
    normalPrefix: 'baidu.com',
  },
  production: {
    normalPrefix: 'baidu.com',
  },
  
};

const getUrl = (url, type = 'normal') => {
  let env = NODE_ENV;

  // 构建
  if (NODE_ENV === 'production') {
    if (window.location.origin.indexOf('//dev') !== -1) {
      env = 'dev';
    }
  }
  // 开发环境
  else {
    if (NODE_ENV === 'production') {
      env = 'production';
    } else {
      env = '';
    }
  }
  let remoteUrl = url;
  if (env) {
    // 多域名适配
    remoteUrl = prefixMap[env][`${type}Prefix`] + url;
  }
  return remoteUrl;
};

const $2 = {};

$2.get = (url, params = {}, config = {}) => {
  url = getUrl(url, config.apiType);
  return axios.get(url, { params, ...config });
};

$2.post = (url, params = {}, config = {}) => {
  url = getUrl(url, config.apiType);
  return axios.post(url, params, config);
};
export default $2;
