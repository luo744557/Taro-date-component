import Taro from '@tarojs/taro';
import { JIAMI, JIEMI } from './crypto';

// 微信小程序使用__wxConfig.envVersion 获取当前开发环境

const wxConfig =
  process.env.TARO_ENV === 'weapp' && __wxConfig
    ? __wxConfig
    : { envVersion: 'production' };
const env = wxConfig.envVersion; // 提测时先固定开发环境 待探索其他方案
console.log(env, 'env');
const devrequestUrl = 'baidu.com';
const requestUrl = 'baidu.com';

// 小程序开发环境 release-正式 trial-体验 develop-开发
const baseUrl = env === 'release' ? requestUrl : devrequestUrl;

// 超时时间
const timeout = 60000;

const isEncrypt = env === 'release' || env === 'production';
// const isEncrypt = true;
var completeDefaultCallback = function compCallback() {};

// 创建密钥
var cryptoKeys = function cryptoKeys() {
  let key = '';
  for (let index = 1; index < 16; index++) {
    if (index !== 1 && index !== 5 && index !== 7 && index !== 11) {
      key = index + key;
    }
  }
  return key;
};

// 获取请求体
const getRequestData = (method, params, otherParams) => {
  const config = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    params: params ? params : {},
    ...otherParams,
  };

  // 参数不需要body直接返回
  if (config.nobody) {
    if (!config.isMerge && !isEncrypt) {
      config.headers['my-super-requester'] = 'noencryption';
    }
  } else {
    // 不加密
    if ((!config.isMerge && !isEncrypt)) {
      config.headers['my-super-requester'] = 'noencryption';
      if (method === 'get') {
        config.params = {
          body: config.params,
        };
      }

      if (method === 'post') {
        config.params = {
          body: JSON.stringify(config.params),
        };
      }
    }
    // 加密
    if (!config.isMerge && isEncrypt) {
      if (method === 'get') {
        config.params = {
          body: JIAMI(JSON.stringify(config.params), cryptoKeys()),
        };
      }

      if (method === 'post') {
        config.params = {
          body: JIAMI(JSON.stringify(config.params), cryptoKeys()),
        };
      }
    }
  }

  return config;
};

// 获取返回体
const getResponeData = (data, config) => {
  if (!config.isMerge && isEncrypt) {
    data = JSON.parse(JIEMI(data, cryptoKeys()));
  }
  return data;
};
const $ = {};

$.post = (
  url,
  requestData,
  completeCallback = {},
  otherRequestData = {}
) => {
  if (!completeCallback) {
    completeCallback = function compCallback() {};
  }
  return new Promise((resolve, reject) => {
    // 登录接口不加密
    let configData = getRequestData(
      'post',
      requestData,
      otherRequestData,
    );
    let ajaxData = configData.params;
    if (configData.isMerge) {
      ajaxData = { body: JSON.stringify(configData.params) };
    }
    Taro.request({
      url: `${baseUrl}${url}`,
      method: 'POST',
      header: configData.headers,
      data: ajaxData,
      mode: 'no-cors', // 设置H5端是否允许跨域请求
      timeout: timeout, // 超时时间，单位为毫秒 API 支持度: weapp, h5
      success(res) {
        let resData = res.data;
        console.log(resData, 1);
        resData = getResponeData(resData, otherRequestData);
        if (resData.code == '200') {
          resolve(resData);
        } else {
          Taro.hideLoading();
          if (resData.message || resData.data.message) {
            Taro.showModal({
              title: '',
              content: resData.message || resData.data.message,
            });
          } else {
            Taro.showModal({
              title: '',
              content: '服务器异常',
            });
          }
          reject(resData);
        }
      },
      fail(error) {
        let resData = error.data;
        resData = getResponeData(resData, otherRequestData);
        resData(resData);
      },
      complete(res) {
        let resData = res.data;
        resData = getResponeData(resData, otherRequestData);
      },
    });
  });
};

$.get = (
  url,
  requestData,
  completeCallback = completeDefaultCallback,
  otherRequestData = {}
) => {
  return new Promise((resolve, reject) => {
    let configData = getRequestData(
      'get',
      requestData,
      otherRequestData,
    );
    let ajaxData = configData.params;
    if (configData.isMerge) {
      ajaxData = { body: JSON.stringify(configData.params) };
    }
    Taro.request({
      url: `${baseUrl}${url}`,
      method: 'GET',
      header: configData.headers,
      data: ajaxData,
      // mode: 'no-cors',
      timeout: timeout,
      success(res) {
        let resData = res.data;
        resData = getResponeData(resData, otherRequestData);
        if (resData.code == '200' || diyCodeList.includes(resData.code)) {
          resolve(resData);
        } else {
          const errorMsg = resData.message || resData.data.message;
          if (errorMsg) {
            Taro.showModal({
              title: '',
              content: errorMsg,
            });
          } else {
            Taro.showModal({
              title: '',
              content: '网络异常',
            });
          }
          reject(resData);
        }
      },
      fail(error) {
        let resData = error.data;
        resData = getResponeData(resData, otherRequestData);
        Taro.showToast({
          title: '网络异常',
          icon: 'none',
        });
        reject(resData);
      },
      complete(res) {
        let resData = res.data;
        resData = getResponeData(resData, otherRequestData);
        completeCallback(resData);
      },
    });
  });
};

export default $;
