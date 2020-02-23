import { fromJS } from 'immutable';
import {
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_SEQUECE_PLAYLIST,
  SET_PLAYLIST,
  SET_PLAY_MODE,
  SET_CURRENT_INDEX,
  SET_SHOW_PLAYLIST,
  DELETE_SONG,
  INSERT_SONG,
  CHANGE_SPEED
} from './constants';
import { getSongDetailRequest } from '../../../api/request';

// 切换当前歌曲
export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data)
});

// 切换全屏模式
export const changeFullScreen = (data) => ({
  type: SET_FULL_SCREEN,
  data
});

// 切换播放的状态
export const changePlayingState = (data) => ({
  type: SET_PLAYING_STATE,
  data
});

export const changeSequecePlayList = (data) => ({
  type: SET_SEQUECE_PLAYLIST,
  data: fromJS(data)
});

export const changePlayList = (data) => ({
  type: SET_PLAYLIST,
  data: fromJS(data)
});

export const changePlayMode = (data) => ({
  type: SET_PLAY_MODE,
  data
});

export const changeSpeed = (data) => ({
  type: CHANGE_SPEED,
  data
});

export const changeCurrentIndex = (data) => ({
  type: SET_CURRENT_INDEX,
  data
});

export const changeShowPlayList = (data) => ({
  type: SET_SHOW_PLAYLIST,
  data
});

export const insertSong = (data) => ({
  type: INSERT_SONG,
  data
});

export const deleteSong = (data) => ({
  type: DELETE_SONG,
  data
});

export const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailRequest(id).then(data => {
      let song = data.songs[0];
      dispatch(insertSong(song));
    })
  }
};