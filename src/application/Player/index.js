import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import MiniPlayer from './miniPlayer/index';
import NormalPlayer from './normalPlayer/index';
import {
  getSongUrl,
  isEmptyObject,
  shuffle,
  findIndex
} from '../../api/utils';
import {
  changeCurrentSong,
  changeFullScreen,
  changePlayList,
  changePlayingState,
  changeCurrentIndex,
  changePlayMode,
  changeShowPlayList,
  changeSpeed
} from './store/actionCreators';
import { playMode } from '../../api/config';
import Toast from '../../baseUI/toast/index';
import PlayList from "./playList/index";
import { getLyricRequest } from '../../api/request';
import Lyric from '../../api/lyric-parser';

function Player(props) {

  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);

  const [currentPlayingLyric, setPlayingLyric] = useState("");

  // 歌曲播放进度百分比
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const {
    speed,
    fullScreen,
    playing,
    currentIndex,
    playList: immutablePlayList,
    mode, //模式
    currentSong: immutableCurrentSong,
    sequencePlayList: immutableSequencePlayList, //顺序列表
  } = props;

  const {
    // 切换全屏
    toggleFullScreenDispatch,
    // 切换播放
    togglePlayingDispatch,
    togglePlayListDispatch,
    // 改变当前歌曲索引
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch, //改变playList
    changeModeDispatch, //改变mode
    changeSpeedDispatch
  } = props;

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();

  // 记录当前的歌曲,以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});
  const [modeText, setModeText] = useState("");

  // audio的dom对象
  const audioRef = useRef();
  const toastRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  // 歌曲是否准备好
  const songReady = useRef(true);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return;
    songReady.current = false; // 把标志位置位false 表示现在新的资源没有缓冲完成 不能切歌
    let current = playList[currentIndex];
    // 把当前歌曲到redux
    changeCurrentDispatch(current); // 赋值currentSong
    // 当前的歌曲
    setPreSong(current);
    setPlayingLyric("");
    // 播放当前歌曲
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true); //播放状态
    getLyric(current.id);
    setCurrentTime(0);
    // 获取总的秒数
    setDuration((current.dt / 1000) | 0);
  }, [currentIndex, playList]);

  useEffect(() => {
    // 播放暂停切换
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  useEffect(() => {
    if (!fullScreen) return;
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt
      });
    }
  }, [fullScreen]);

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  // 获取歌词
  const getLyric = async id => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    //避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true;
    }, 3000);
    try {
      let result = await getLyricRequest(id);
      lyric = result.lrc.lyric;
      if (!lyric) {
        currentLyric.current = null;
        return;
      }
      currentLyric.current = new Lyric(lyric, handleLyric, speed);
      currentLyric.current.play();
      currentLineNum.current = 0;
      currentLyric.current.seek(0);
    } catch (e) {
      songReady.current = true;
      audioRef.current.play();
    }
  };

  // 是否播放的切换
  const clickPlaying = (e, state) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 把当前歌曲的播放状态传到redux
    togglePlayingDispatch(state);
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };

  // 当前歌曲的播放时间
  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  // 当歌曲进度改变的时候执行
  const onProgressChange = curPercent => {
    // 根据进度条传回来的时间
    const newTime = curPercent * duration;
    // 当前时间赋值
    setCurrentTime(newTime);
    // 把新的时间赋值给audio 用来更新时间
    audioRef.current.currentTime = newTime;
    // 当歌曲暂停时 点击进度条让歌曲播放
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
    if (currentLyric.current) {
      currentLyric.current.seek(0);
    }
  };

  // 上一首
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index === -1) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 下一首
  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 当播放结束时
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  // 切换播放模式 顺序列表(sequencePlayList)在这里就是用来改变播放列表
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      // 找到当前播放的索引
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      // 把新的列表给redux
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };

  // 当播放出错时
  const handleError = () => {
    songReady.current = true;
    // 播放下一首
    handleNext();
    alert("播放错误")
  };

  const clickSpeed = (newSpeed) => {
    changeSpeedDispatch(newSpeed);
    audioRef.current.playbackRate = newSpeed;
    currentLyric.current.changeSpeed(newSpeed);
    currentLyric.current.seek(currentTime * 1000);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          full={fullScreen}
          mode={mode}
          changeMode={changeMode}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          speed={speed}
          currentLineNum={currentLineNum.current}
          percent={percent}
          modeText={modeText}
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          togglePlayListDispatch={togglePlayListDispatch}
          clickSpeed={clickSpeed}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          full={fullScreen}
          playing={playing}
          percent={percent}
          setFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          togglePlayList={togglePlayListDispatch}
        />
      )}
      <PlayList clearPreSong={setPreSong.bind(null, {})} />
      <audio
        ref={audioRef}
        // 在播放中的事件
        onTimeUpdate={updateTime}
        // 当播放结束
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}

// 映射Redux 全局的 state 到组件的 props 上
const mapStateToProps = state => ({
  // 全屏
  fullScreen: state.getIn(['player', 'fullScreen']),
  // 是否播放
  playing: state.getIn(['player', 'playing']),
  // 当前的歌曲
  currentSong: state.getIn(['player', 'currentSong']),
  // 是否展示播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  // 播放模式
  mode: state.getIn(['player', 'mode']),
  speed: state.getIn(['player', 'speed']),
  // 当前歌曲的索引 初始是SongList列表传过来的索引
  currentIndex: state.getIn(['player', 'currentIndex']),
  // 播放列表
  playList: state.getIn(['player', 'playList']),
  // 顺序列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList'])
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = dispatch => {
  return {
    // 当前是否播放
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    // 当前是否全屏
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    // 当前是否显示播放列表
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 切换当前的索引
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    // 切换播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeSpeedDispatch(data) {
      dispatch(changeSpeed(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player));