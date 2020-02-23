import React, { useEffect } from 'react';
import Slider from '../../components/slider/index';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/index';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading-v2/index';
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from '../Singers/style';

function Recommend(props) {

  const { bannerList, recommendList, enterLoading, songsCount } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  // 相当于componentDidMount中调用
  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      {enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
      {renderRoutes(props.route.routes)}
    </Content>
  );
}

//映射 Redux 全局的state到组件的 props 上
const mapStateToProps = (state) => ({
  /**
   * 不要在这里将数据 toJS
   * 不然每次diff比对 props 的时候是不一样的引用
   * 还是导致不必要的重渲染 属于滥用 immutable
   */
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  // 获取播放列表歌曲的数量
  songsCount: state.getIn(['player', 'playList']).size
});
// 映射dispatch 到 props上 暴露一个对象
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      // diapatch 调用getBannerList()
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    }
  }
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend));