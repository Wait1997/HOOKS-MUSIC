import React, { useState, useEffect } from 'react';
import { SongList, SongItem } from './style';
import { getName } from '../../api/utils';
import { ONE_PAGE_COUNT } from '../../api/config';
import { connect } from 'react-redux';
import {
  changePlayList,
  changeCurrentIndex,
  changeSequecePlayList
} from '../../application/Player/store/actionCreators';

const SongsList = React.forwardRef((props, refs) => {

  const [startIndex, setStartIndex] = useState(0);

  const { songs, collectCount, showCollect, loading = false, usePageSplit } = props;

  // 接受触发动画的函数
  const { musicAnimation } = props;

  const {
    // 播放列表
    changePlayListDispatch,
    // 当前歌曲的索引
    changeCurrentIndexDispatch,
    // 顺序列表
    changeSequecePlayListDispatch
  } = props;

  const totalCount = songs.length;

  useEffect(() => {
    if (!loading) return;
    if (startIndex + 1 + ONE_PAGE_COUNT >= totalCount) return;
    setStartIndex(startIndex + ONE_PAGE_COUNT);
  }, [loading, startIndex, totalCount]);

  const selectItem = (e, index) => {
    // 播放列表
    changePlayListDispatch(songs);
    // 顺序列表
    changeSequecePlayListDispatch(songs);
    // 在当前列表中的索引
    changeCurrentIndexDispatch(index);
    // 获取当前点击位置距离x,y的坐标(音符下落)
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  let songList = (list) => {
    let res = [];
    // 判断页数是否超过总数
    let end = usePageSplit ? startIndex + ONE_PAGE_COUNT : list.length;
    for (let i = 0; i < end; i++) {
      if (i >= list.length) break;
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count / 1000) / 10}万)</span>
      </div>
    );
  };

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  );
})

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  scrollY: state.getIn(['album', 'scrollY'])
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    changeSequecePlayListDispatch(data) {
      dispatch(changeSequecePlayList(data));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SongsList));