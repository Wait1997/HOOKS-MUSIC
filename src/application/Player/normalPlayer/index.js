import React, { useRef, useCallback, useEffect } from 'react';
import { prefixStyle, formatPlayTime, getName } from "../../../api/utils";
import { CSSTransition } from 'react-transition-group';
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  ProgressWrapper,
  Operators,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
  List,
  ListItem
} from './style';
import animations from 'create-keyframe-animation';
import ProgressBar from '../../../baseUI/progressBar/index';
import { playMode, list } from '../../../api/config';
import Scroll from '../../../baseUI/scroll/index';

function NormalPlayer(props) {
  // 属性
  const {
    song,
    full,
    mode,
    playing,
    percent,
    duration,
    currentTime,
    currentLineNum,
    currentPlayingLyric,
    currentLyric,
    speed
  } = props;

  // 方法
  const {
    toggleFullScreenDispatch,
    togglePlayListDispatch,
    clickPlaying,
    onProgressChange,
    handlePrev,
    handleNext,
    changeMode,
    clickSpeed
  } = props;

  //处理transform的浏览器兼容问题
  const transform = prefixStyle("transform");

  // 拿到最外层的dom
  const normalPlayerRef = useRef();
  // 中间部分的dom
  const cdWrapperRef = useRef();

  // scroll组件的dom
  const lyricScrollRef = useRef();
  const lyricLineRefs = useRef([]);
  const currentState = useRef(0);

  useEffect(() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      //保持当前歌词在第五条的位置
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      //当前歌词行数小于 <= 5, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);

  /**
   * 1. 中间cd消失,下方播放条显示，这是属于`过渡`
   * 2. `过渡`开始的同时，cd同时移动、放大、缩小到左下方播放条 ，这属于`动画`
   */
  //启用帧动画
  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    // 从cd到mini的cd的缩放比例
    const scale = targetWidth / width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale
    };
  };

  // enter是指当 cd从隐藏到显示的动画
  const enter = () => {
    normalPlayerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale();
    let animation = {
      // 第0帧的时候，先让图片缩小，显示在左下角
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      // 60%的时候，让图片回到cd中心，变大
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      // 变回原来的尺寸，会有一个回弹的效果
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    // 动画的一些配置
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    });
    //运行动画
    animations.runAnimation(cdWrapperRef.current, "move");
  };

  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current;
    //运行完动画之后，注销掉动画
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";
  };

  // leave是指 cd从显示到隐藏的动画
  const leave = () => {
    // 如果当前dom不存在return
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    normalPlayerRef.current.style.display = "none";
    currentState.current = "";
  };

  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
    } else {
      content = '&#xe61b;';
    }
    return content;
  };

  const toggleCurrentState = () => {
    if (currentState.current !== "lyric") {
      currentState.current = "lyric";
    } else {
      currentState.current = "";
    }
  };

  const clickPlayingCB = useCallback((e) => {
    clickPlaying(e, !playing);
  }, [clickPlaying, playing])

  return (
    <CSSTransition
      classNames="normal"
      in={full}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={song.al.picUrl + "?params=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreenDispatch(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="text">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current !== "lyric"}
          >
            <CDWrapper
              style={{
                visibility: currentState.current !== "lyric" ? "visible" : "hidden"
              }}
              playing={playing}
            >
              <div className={`needle ${playing ? '' : 'pause'}`}></div>
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}
                  src={song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current === "lyric"}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={{ visibility: currentState.current === "lyric" ? "visible" : "hidden" }}
                  className="lyric_wrapper"
                >
                  {
                    currentLyric ? currentLyric.lines.map((item, index) => {
                      // 拿到每一行歌词的DOM对象 后面滚动歌词需要
                      lyricLineRefs.current[index] = React.createRef();
                      return (
                        <p
                          className={`text ${currentLineNum === index ? "current" : ""}`}
                          key={item + index}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      );
                    })
                      : <p className="text pure">纯音乐，请欣赏！</p>
                  }
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <List>
            <span>倍速播放</span>
            {
              list.map(item => {
                return (
                  <ListItem
                    key={item.key}
                    className={`${speed === item.key ? 'selected' : ''}`}
                    onClick={() => clickSpeed(item.key)}
                  >
                    {item.name}
                  </ListItem>
                );
              })
            }
          </List>
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={clickPlayingCB}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe723;" : "&#xe731;"
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div
              className="icon i-right"
              onClick={() => togglePlayListDispatch(true)}
            >
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(NormalPlayer);