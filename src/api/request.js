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

// 首次请求歌手列表 默认是热门歌手 偏移量为0
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
};

// 按歌手类别加载列表
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(
    `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

// 获取排行榜列表
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};

// 获取歌单详情
export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};

// 获取歌手详情
export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`);
};

// 获取歌词的请求
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

// 获取歌曲详情
export const getSongDetailRequest = id => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};