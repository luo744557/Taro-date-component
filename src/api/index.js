import { requestFunc } from '@utils/request';
const $ = requestFunc();

const BASE_URL = '/baidu/api'; // 假装这里有 api

// 城市信息查询接口
export const indexApi = params => $.post(`${BASE_URL}/index/index`, params);