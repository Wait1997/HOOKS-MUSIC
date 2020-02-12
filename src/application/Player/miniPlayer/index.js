import React, { useRef } from 'react';
import { getName } from '../../../api/utils';
import { CSSTransition } from 'react-transition-group';
import { MiniPlayerContainer } from './style';
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer(props) {

  const { full, song, playing, percent } = props;

  const { clickPlaying, setFullScreen, togglePlayList } = props;

  const miniPlayerRef = useRef();

  const handleTogglePlayList = e => {
    togglePlayList(true);
    e.stopPropagation();
  };

  return (
    <CSSTransition
      in={!full}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex";
      }}
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