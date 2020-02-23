import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  Container,
  ImgWrapper,
  CollectButton,
  SongListWrapper,
  BgLayer
} from './style';
import Header from '../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { HEADER_HEIGHT } from '../../api/config';
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import { connect } from 'react-redux';
import Loading from '../../baseUI/loading/index';
import { EnterLoading } from "../Singers/style";
import SongsList from "../SongList/index";
import MusicNote from "../../baseUI/music-note/index";

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true);
  //图片初始化的高度
  const initialHeight = useRef(0);

  //往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  const {
    // 歌手信息
    artist: immutableArtist,
    // 歌手的歌
    songs: immutableSongs,
    loading,
    // 歌曲的数量
    songsCount
  } = props;

  const { getSingerDataDispatch } = props;

  // immutable转换成js
  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();

  const musicNoteRef = useRef();

  useEffect(() => {
    // 当前歌手的id
    const id = props.match.params.id;
    getSingerDataDispatch(id);
    // 大的歌手背景图片的高度(包括boder和padding)
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    // 包裹scroll组件的容器 页面渲染后让这个容器的top为下面的值 稍微望上一点盖住背景底部
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮盖先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    // 此时dom结构已经改变需要调用scroll组件的refresh()
    songScroll.current.refresh();
  }, []);

  // pos是滑动的距离 为负值
  const handleScroll = pos => {
    // 获取高度(为背景图的高度)
    let height = initialHeight.current;
    // 获取滑动的距离
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    // minScrollY为Header和ScrollWrap之间的高度(负值)
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    const percent = Math.abs(newY / height);
    //说明: 在歌手页的布局中，歌单列表其实是没有自己的背景的，
    //layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
    //因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
    if (newY > 0) {
      //处理往下拉的情况,效果：图片放大，按钮跟着偏移(向下)
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      //往上滑动，但是还没超过Header部分
      //layerDOM设置的top的值和SongListWrapper的top值相等
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      // 收藏按钮跟随向上移动newY(即scroll滑动的距离)
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      // 按钮的透明度随着移动逐渐变浅
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  };

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        />
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper} play={songsCount}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              usePageSplit={false}
              musicAnimation={musicAnimation}
            />
          </Scroll>
        </SongListWrapper>
        {loading ? (
          <EnterLoading style={{ zIndex: 100 }}>
            <Loading></Loading>
          </EnterLoading>
        ) : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songs: state.getIn(["singerInfo", "songsOfArtist"]),
  loading: state.getIn(["singerInfo", "loading"]),
  songsCount: state.getIn(['player', 'playList']).size
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      // 数据请求回来前loading为true
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singer));