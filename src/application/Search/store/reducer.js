import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  hotList: [], //热门关键词列表
  suggestList: [], //列表 包括歌单和歌手
  songsList: [], //歌曲列表
  enterLoading: false
});

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.SET_HOT_KEYWRODS:
      return state.set('hotList', action.data);
    case actionTypes.SET_SUGGEST_LIST:
      return state.set('suggestList', action.data);
    case actionTypes.SET_RESULT_SONGS_LIST:
      return state.set('songsList', action.data);
    case actionTypes.SET_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
}