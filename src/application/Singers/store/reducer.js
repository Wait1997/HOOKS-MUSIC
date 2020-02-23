import {fromJS} from 'immutable';
import * as actionTypes from './constants';

const defaultState = fromJS({
  category: "",
  alpha: "",
  singerList: [],
  enterLoading: true, //控制进场Loading
  pullUpLoading: false, //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  listOffset: 0, // 请求列表的偏移量
});

export default (state = defaultState, action) => {
  // console.log(action);
  switch(action.type) {
    case actionTypes.CHANGE_CATOGORY:
      return state.set('category', action.data);
    case actionTypes.CHANGE_ALPHA:
      return state.set('alpha', action.data);
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_LIST_OFFSET:
      return state.set('listOffset', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data);
    default:
      return state;
  }
};