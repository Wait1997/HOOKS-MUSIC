import React, { useEffect } from 'react';
import Slider from '../../components/slider/index';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/index';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading-v2/index';
import {renderRoutes} from 'react-router-config';

function Recommend(props) {

  // console.log(props);

  const { bannerList, recommendList, enterLoading } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect(() => {
    if(!bannerList.size) {
      getBannerDataDispatch();
    }
    if(!recommendList.size) {
      getRecommendListDataDispatch();
    }
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  return (
    <Content play={props.songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      {enterLoading ? <Loading></Loading> : null}
      {renderRoutes(props.route.routes)}
    </Content>
  );
}

//映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  /**
   * 不要在这里将数据 toJS
   * 不然每次diff比对 props 的时候是不一样的引用
   * 还是导致不必要的重渲染 属于滥用 immutable
   */
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
});
// 映射dispatch 到 props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));