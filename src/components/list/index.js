import React from 'react';
import {
  ListWrapper,
  ListItem,
  List
} from './style';
import LazyLoad from 'react-lazyload';
import { withRouter } from 'react-router-dom';

function RecommendList(props) {

  const { recommendList } = props;

  const enterDetail = (id) => {
    props.history.push(`/recommend/${id}`);
  };

  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {
          recommendList.map((item, index) => {
            return (
              <ListItem key={item.id + index} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  <LazyLoad placeholder={<img src={require('./music.png')} width="100%" height="100%" alt="music" />}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music" />
                  </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{Math.floor(item.playCount / 10000)}万</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  );
}

export default React.memo(
  withRouter(RecommendList));