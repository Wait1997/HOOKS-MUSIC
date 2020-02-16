/**
 * 接口请求回来的数据
 * 统一管理
 */

import {axiosInstance} from './config';

// 轮播图
export const getBannerRequest = () => {
  return axiosInstance.get('/banner');
};

// 推荐歌单
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized');
};

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
};

export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(
    `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};

export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`);
};

export const getLyricRequest = id => {
  return axiosInstance.get(`/lyric?id=${id}`);
};

export const getHotKeyWordsRequest = () => {
  return axiosInstance.get('/search/hot');
};

export const getSuggestListRequest = query => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = query => {
  return axiosInstance.get(`/search?keywords=${query}`);
};

export const getSongDetailRequest = id => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};