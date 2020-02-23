import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Container } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import AlbumDetail from '../../components/album-detail/index';
import { connect } from 'react-redux';
import {
  getAlbumList,
  changePullUpLoading,
  changeEnterLoading
} from './store/actionCreators';
import Loading from '../../baseUI/loading/index';
import { EnterLoading } from '../Singers/style';
import style from '../../assets/global-style';
import { isEmptyObject } from '../../api/utils';
import { HEADER_HEIGHT } from '../../api/config';
import MusicNote from '../../baseUI/music-note/index';

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);

  const headerEl = useRef();
  const musicNoteRef = useRef();

  // 获取歌曲id
  const id = props.match.params.id;
  // console.log(id);

  const { currentAlbum, enterLoading, pullUpLoading, songsCount } = props;
  const { getAlbumDataDispatch, changePullUpLoadingStateDispatch } = props;

  let currentAlbumJS = currentAlbum.toJS();

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  const handleScroll = useCallback(pos => {
    // pos.y 就是滑动纵坐标方向的距离(负值)
    let minScrollY = -HEADER_HEIGHT;
    // 滚动距离与头部高度的%比
    let percent = Math.abs(pos.y / minScrollY);
    // 获取头部的dom对象
    let headerDom = headerEl.current;
    // 滚动距离大于Header的高度时(负值)
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbumJS && currentAlbumJS.name);
      setIsMarquee(true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbumJS]);

  const handlePullUp = () => {
    changePullUpLoadingStateDispatch(true);
    changePullUpLoadingStateDispatch(false);
  }

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbumJS) ? (
            <Scroll
              onScroll={handleScroll}
              pullUp={handlePullUp}
              pullUpLoading={pullUpLoading}
              bounceTop={false}
            >
              <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation}></AlbumDetail>
            </Scroll>
          ) : null
        }
        {enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
};

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  pullUpLoading: state.getIn(['album', 'pullUpLoading']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  startIndex: state.getIn(['album', 'startIndex']),
  totalCount: state.getIn(['album', 'totalCount']),
  songsCount: state.getIn(['player', 'playList']).size,
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
    changePullUpLoadingStateDispatch(state) {
      dispatch(changePullUpLoading(state));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Album));