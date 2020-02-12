import { CHANGE_SONGS_OF_ARTIST, CHANGE_ARTIST, CHANGE_ENTER_LOADING } from './constants';
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
    dispatch(changeArtist(result.artist));
    dispatch(changeSongs(result.hotSongs));
    dispatch(changeEnterLoading(false));
  }
}