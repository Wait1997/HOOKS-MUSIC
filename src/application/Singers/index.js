import React, { useEffect, useRef } from 'react';
import Scroll from '../../baseUI/scroll/index';
import Horizen from '../../baseUI/horizen-item/index';
import { categoryTypes, alphaTypes } from '../../api/config';
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
  EnterLoading
} from './style';
import {
  getSingerList,
  changeCategory,
  changeAlpha,
  getHotSingerList,
  changeEnterLoading,
  changeListOffset,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import { connect } from 'react-redux';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';
import { renderRoutes } from 'react-router-config';

function Singers(props) {
  const scrollRef = useRef(null);

  const { singerList, category, alpha, pageCount, songsCount, pullUpLoading, pullDownLoading, enterLoading } = props;

  const { getHotSinger, updateCategory, updateAlpha, pullUpRefresh, pullDownRefresh } = props;

  useEffect(() => {
    if (!singerList.length && !category && !alpha) {
      getHotSinger();
    }
  }, []);

  const handlePullUp = () => {
    pullUpRefresh(category === '', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefresh(category, pageCount);
  };

  const handleUpdateCatetory = (newVal) => {
    if (category === newVal) return;
    updateCategory(newVal);
    scrollRef.current.refresh();
  };

  const handleUpdateAlpha = (newVal) => {
    if (alpha === newVal) return;
    updateAlpha(newVal);
    scrollRef.current.refresh();
  };

  const enterDetail = id => {
    props.history.push(`/singers/${id}`);
  }

  const renderSingerList = () => {
    const { singerList } = props;

    return (
      <List>
        {
          singerList.toJS().map((item, index) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img src={require('./singer.png')} width="100%" height="100%" alt="music" />}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={"分类（默认热门）："}
          handleClick={(val) => handleUpdateCatetory(val)}
          oldVal={category}
        />
        <Horizen
          list={alphaTypes}
          title={"首字母："}
          handleClick={(val) => handleUpdateAlpha(val)}
          oldVal={alpha}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          onScroll={forceCheck}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          ref={scrollRef}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
      {/* 入场加载动画 */}
      {enterLoading ? <Loading></Loading> : null}
      {renderRoutes(props.route.routes)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  alpha: state.getIn(['singers', 'alpha']),
  category: state.getIn(['singers', 'category']),
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn(['player', 'playList']).size
});


const mapDispatchToProps = (dispatch) => {
  return {
    getHotSinger() {
      dispatch(getHotSingerList());
    },
    updateCategory(newVal) {
      dispatch(changeCategory(newVal));
      dispatch(changeListOffset(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    updateAlpha(newVal) {
      dispatch(changeAlpha(newVal));
      dispatch(changeListOffset(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList());
    },
    // 滑动最底部刷新部分的处理
    pullUpRefresh(hot, count) {
      dispatch(changePullUpLoading(true));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList());
      }
    },
    //顶部下拉刷新
    pullDownRefresh(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changeListOffset(0));
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList());
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));