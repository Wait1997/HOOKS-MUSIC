import { CHANGE_CURRENT_ALBUM, CHANGE_TOTAL_COUNT, CHANGE_PULLUP_LOADING, CHANGE_START_INDEX, CHANGE_ENTER_LOADING } from './constants';
import { getAlbumDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';

const changeCurrentAlbum = (data) => ({
  type: CHANGE_CURRENT_ALBUM,
  data: fromJS(data)
});

// 上拉加载
export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});

// 进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

const changeTotalCount = (data) => ({
  type: CHANGE_TOTAL_COUNT,
  data
});

export const changeStartIndex = (data) => ({
  type: CHANGE_START_INDEX,
  data
});

export const getAlbumList = (id) => {
  return async dispatch => {
    try {
      let result = await getAlbumDetailRequest(id);
      let data = result.playlist;
      // dispatch整个playlist数据到redux
      dispatch(changeCurrentAlbum(data));
      // 数据请求回来后loading为false
      dispatch(changeEnterLoading(false));
      dispatch(changeStartIndex(0));
      // 歌单中歌曲的总数目
      dispatch(changeTotalCount(data.tracks.length));
    } catch (e) {
      console.log(`${e}获取album数据失败`);
    }
  };
};