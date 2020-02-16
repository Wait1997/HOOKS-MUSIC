import reducer from './reducer';
import * as actionCreators from './actionCreators';
import * as constants from './constants';

// 把暴露的reducer放到全局的redux中
export { reducer, actionCreators, constants };