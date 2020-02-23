import React, { useRef } from 'react';
import { getName } from '../../../api/utils';
import { CSSTransition } from 'react-transition-group';
import { MiniPlayerContainer } from './style';
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer(props) {

  // 属性
  const { full, song, playing, percent } = props;

  // 方法
  const { clickPlaying, setFullScreen, togglePlayList } = props;

  // mini播放别表的dom对象 初始化为null
  const miniPlayerRef = useRef();

  const handleTogglePlayList = e => {
    // 点击时显示播放列表 回调函数
    togglePlayList(true);
    // 阻止事件冒泡
    e.stopPropagation();
  };

  return (
    <CSSTransition
      // fullScreen为false的时候
      in={!full}
      timeout={400}
      classNames="mini"
      // 进入时执行的钩子函数
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex";
      }}
      // 退出时执行的钩子函数
      onExited={() => {
        miniPlayerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => setFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img className={`play ${playing ? "" : "pause"}`} src={song.al.picUrl} width="40" height="40" alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {
              playing ?
              <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe650;</i>
              :
              <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(MiniPlayer);