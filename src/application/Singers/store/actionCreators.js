import {
  getHotSingerListRequest,
  getSingerListRequest
} from "../../../api/request";
import {
  CHANGE_CATOGORY,
  CHANGE_ALPHA,
  CHANGE_SINGER_LIST,
  CHANGE_LIST_OFFSET,
  CHANGE_ENTER_LOADING,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING
} from './constants';
import { fromJS } from 'immutable';

export const changeCategory = (data) => ({
  type: CHANGE_CATOGORY,
  data
});

export const changeAlpha = (data) => ({
  type: CHANGE_ALPHA,
  data
});

export const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data)
});

export const changeListOffset = (data) => ({
  type: CHANGE_LIST_OFFSET,
  data
});

//进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

//上拉加载loading
export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});

//下拉加载loading
export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
});

//第一次加载热门歌手
export const getHotSingerList = () => {
  return async (dispatch) => {
    try {
      let result = await getHotSingerListRequest(0);
      const data = result.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      // 下拉刷新
      dispatch(changePullDownLoading(false));
      dispatch(changeListOffset(data.length));
    } catch (e) {
      console.log(`${e} 热门歌手数据加载失败`);
    }
  };
};

//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return async (dispatch, getState) => {
    try {
      // 获取偏移量
      const offset = getState().getIn(['singers', 'listOffset']);
      const singerList = getState().getIn(['singers', 'singerList']).toJS();
      let result = await getHotSingerListRequest(offset);
      // 拼接数据 上拉刷新时加载数据
      const data = [...singerList, ...result.artists];
      // 再放回redux
      dispatch(changeSingerList(data));
      dispatch(changePullUpLoading(false));
      dispatch(changeListOffset(data.length));
    } catch (e) {
      console.log(`${e} 热门歌手数据再次加载失败`);
    }
  };
};

//第一次加载对应类别的歌手
export const getSingerList = () => {
  return async (dispatch, getState) => {
    try {
      const offset = getState().getIn(['singers', 'listOffset']);
      const category = getState().getIn(['singers', 'category']);
      const alpha = getState().getIn(['singers', 'alpha']);
      let result = await getSingerListRequest(category, alpha, offset);
      const data = result.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
      dispatch(changeListOffset(data.length));
    } catch (e) {
      console.log(`${e} 歌手数据获取失败`);
    }
  };
};

export const refreshMoreSingerList = () => {
  return async (dispatch, getState) => {
    try {
      const category = getState().getIn(['singers', 'category']);
      const offset = getState().getIn(['singers', 'listOffset']);
      const alpha = getState().getIn(['singers', 'alpha']);
      const singerList = getState().getIn(['singers', 'singerList']).toJS();
      let result = await getSingerListRequest(category, alpha, offset);
      const data = [...singerList, ...result.artists];
      dispatch(changeSingerList(data));
      // 上拉加载
      dispatch(changePullUpLoading(false));
      dispatch(changeListOffset(data.length));
    } catch (e) {
      console.log(`${e} 歌手数据再次获取失败`);
    }
  };
};

