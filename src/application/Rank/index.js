import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store/index';
import { filterIndex } from '../../api/utils';
import { Container, List, ListItem, SongList } from './style';
import Loading from '../../baseUI/loading/index';
import Scroll from '../../baseUI/scroll/index';
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from '../Singers/style';

function Rank(props) {
  const { rankList: list, loading, songsCount } = props;
  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS() : [];

  useEffect(() => {
    if (!rankList.length) {
      getRankListDataDispatch();
    }
  }, []);

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`);
  };

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item, index) => {
            return (
              <ListItem key={`${item.coverImgId}${index}`} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <div className="decorate"></div>
                  <span className="update_frequecy">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            );
          })
        }
      </List>
    );
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  };

  // 获取第一个没有歌名的排行
  let globalStartIndex = filterIndex(rankList);
  // 热歌榜(有歌名的列表)
  let officialList = rankList.slice(0, globalStartIndex);
  // 全球榜(没有歌名的列表)
  let globalList = rankList.slice(globalStartIndex);

  let displayStyle = loading ? { "display": "none" } : { "display": "" };

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}> 官方榜 </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}> 全球榜 </h1>
          {renderRankList(globalList, true)}
          {loading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size
});

const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Rank));