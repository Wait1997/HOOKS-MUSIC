import React, { useRef, useEffect, useState } from 'react';
import Scroll from '../scroll/index';
import { PropTypes } from 'prop-types';
import {List,ListItem} from './style';

function Horizen(props) {
  const [refreshCategoryScroll, setRefreshCategoryScroll] = useState(false);
  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const Category = useRef(null);
  
  //加入初始化内容宽度的逻辑
  useEffect(() => {
    let categoryDom = Category.current;
    let tagElem = categoryDom.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElem).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });
    totalWidth += 2;
    categoryDom.style.width = `${totalWidth}px`;
    setRefreshCategoryScroll(true);
  }, [refreshCategoryScroll]);

  const clickHandle = (item) => {
    handleClick(item.key);
  }

  return (
    <Scroll direction={"horizental"} refresh={true}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map((item) => {
              return (
                <ListItem
                  key={item.key}
                  className={`${oldVal === item.key ? 'selected' : ''}`}
                  onClick={() => clickHandle(item)}
                >
                  {item.name}
                </ListItem>
              );
            })
          }
        </List>
      </div>
    </Scroll>
  );
}

/**
 * list 为接收的列表数据
 * oldVal 为当前的 item 值
 * title 为列表左边的标题
 * handleClick 为点击不同的 item 执行的方法
 */
Horizen.defaultProps = {
  list: [],
  handleClick: null
};

Horizen.propTypes = {
  list: PropTypes.array,
  handleClick: PropTypes.func
};

export default React.memo(Horizen);