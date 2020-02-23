import {
  CHANGE_SONGS_OF_ARTIST,
  CHANGE_ARTIST,
  CHANGE_ENTER_LOADING
} from './constants';
import { fromJS } from 'immutable';
import { getSingerInfoRequest } from './../../../api/request';

const changeArtist = (data) => ({
  type: CHANGE_ARTIST,
  data: fromJS(data)
});

const changeSongs = (data) => ({
  type: CHANGE_SONGS_OF_ARTIST,
  data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

export const getSingerInfo = (id) => {
  return async dispatch => {
    let result = await getSingerInfoRequest(id);
    // 歌手详情 派发到redux
    dispatch(changeArtist(result.artist));
    // 歌手热门歌曲
    dispatch(changeSongs(result.hotSongs));
    dispatch(changeEnterLoading(false));
  }
}