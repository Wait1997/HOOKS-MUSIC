import React from 'react';
import { renderRoutes } from 'react-router-config';
import {
  Top,
  Tab,
  TabItem,
} from './style';
import { NavLink } from 'react-router-dom';
import Player from '../Player/index';

function Home(props) {
  const { route } = props;
  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">幻听</span>
        <span className="iconfont search" onClick={() => props.history.push('/search')}>&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected">
          <TabItem><span> 推荐 </span></TabItem>
        </NavLink>
        <NavLink to="/singers" activeClassName="selected">
          <TabItem><span> 歌手 </span></TabItem>
        </NavLink>
        <NavLink to="/rank" activeClassName="selected">
          <TabItem><span> 排行榜 </span></TabItem>
        </NavLink>
      </Tab>
      {/*推荐 歌手 排行榜 路由之间切换*/}
      {renderRoutes(route.routes)}
      {/*播放器*/}
      <Player />
    </div>
  );
}

export default React.memo(Home);