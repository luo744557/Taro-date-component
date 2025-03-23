/**
 * @description 异步请求分发 H5和小程序使用的不一样
 * @author 阴亚会
 * @update 阴亚会
 */
import $ from './request-weapp';
import $2 from './request-h5';
export function requestFunc() {
  if (process.env.TARO_ENV === 'weapp') {
    return $;
  } else {
    return $2;
  }
}
