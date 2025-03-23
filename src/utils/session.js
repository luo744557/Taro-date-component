import Taro from '@tarojs/taro'

const getSessionItem = (key) => {
  // return JSON.parse(sessionStorage.getItem(key) || "{}");
  return Taro.getStorageSync(key);
};
const setSessionItem = (key, obj = {}) => {
  // return sessionStorage.setItem(key, JSON.stringify(obj));
  return Taro.setStorageSync(key, obj);
};
const removeSessionItem = (key) => {
  // return sessionStorage.setItem(key, JSON.stringify(obj));
  return Taro.removeStorageSync({key});
};
const session = {
  getSessionItem,
  setSessionItem,
  removeSessionItem
}
export default session;
