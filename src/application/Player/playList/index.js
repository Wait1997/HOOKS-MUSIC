import React, { useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import {
  PlayListWrapper,
  ScrollWrapper,
  ListHeader,
  ListContent
} from './style';
import {
  changeShowPlayList,
  changeSequecePlayList,
  changePlayMode,
  deleteSong,
  changeCurrentSong,
  changeCurrentIndex,
  changePlayList,
  changePlayingState
} from '../store/actionCreators';
import { playMode } from '../../../api/config';
import Scroll from '../../../baseUI/scroll';
import { prefixStyle, getName, shuffle, findIndex } from '../../../api/utils';
import { CSSTransition } from 'react-transition-group';
import Confirm from '../../../baseUI/confirm/index';

function PlayList(props) {
  const [isShow, setIsShow] = useState(false);
  //是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true);
  //touchStart后记录y值
  const [startY, setStartY] = useState(0);
  //touchStart事件是否已经被触发
  const [initialed, setInitialed] = useState(0);
  //用户下滑的距离
  const [distance, setDistance] = useState(0);

  const transform = prefixStyle("transform");

  const playListRef = useRef();
  const listWrapperRef = useRef();
  const confirmRef = useRef();
  const listContentRef = useRef();

  const {
    currentIndex,
    currentSong: immutableCurrentSong,
    showPlayList,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList
  } = props;

  const {clearPreSong} = props; //清空PreSong

  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch,
    clearDispatch
  } = props;

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const changeMode = (e) => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  };

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song);
  };

  const getCurrentIcon = item => {
    //是否是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
    );
  };

  const getFavoriteIcon = (item) => {
    return (
      <i className="iconfont">&#xe601;</i>
    );
  };

  const handleShowClear = () => {
    confirmRef.current.show();
  };

  const handleConfirmClear = () => {
    clearDispatch();
    //修复清空播放列表后点击同样的歌曲，播放器不出现的bug
    clearPreSong();
  };

  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
      text = "单曲循环";
    } else {
      content = '&#xe61b;';
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={(e) => changeMode(e)} dangerouslySetInnerHTML={{ __html: content }}></i>
        <span className="text" onClick={(e) => changeMode(e)}>{text}</span>
      </div>
    );
  };

  const handleScroll = (pos) => {
    //只有当内容偏移量位0的时候才能下滑关闭PlayList 否则一边内容在移动一边列表在移动 出现bug
    let state = pos.y === 0;
    setCanTouch(state);
  };

  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setDistance(0);
    setStartY(e.nativeEvent.touches[0].pageY);//记录y值
    setInitialed(true);
  };

  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance);
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
  };

  const handleTouchEnd = (e) => {
    setInitialed(false);
    //这里设置阈值位150px
    if (distance >= 150) {
      //大于150px则关闭PlayList
      togglePlayListDispatch(false);
    } else {
      //否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
    }
  };

  const onEnterCB = useCallback(() => {
    //让列表显示
    setIsShow(true);
    //最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    //让列表展示
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitCB = useCallback(() => {
    listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`;
  }, [distance, transform]);

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExit={onExitCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: "block" } : { display: "none" }}
        onClick={() => togglePlayListDispatch(false)}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                        {getCurrentIcon(item)}
                        <span className="text">{item.name} - {getName(item.ar)}</span>
                        <span className="like">
                          {getFavoriteIcon(item)}
                        </span>
                        <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                          <i className="iconfont">&#xe63d;</i>
                        </span>
                      </li>
                    );
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text={"是否删除全部?"}
          cancelBtnText={"取消"}
          confirmBtnText={"确定"}
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
  );
}

const mapStateToProps = state => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']),//播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']), //顺序排列时的播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode'])
});

const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    //修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    //修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data));
    },
    clearDispatch() {
      //1.清空两个列表
      dispatch(changePlayList([]));
      dispatch(changeSequecePlayList([]));
      //2.初始currentIndex
      dispatch(changeCurrentIndex(-1));
      //3.关闭PlayList的显示
      dispatch(changeShowPlayList(false));
      //4.将当前歌曲置空
      dispatch(changeCurrentSong({}));
      //5.重置播放状态
      dispatch(changePlayingState(false));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));