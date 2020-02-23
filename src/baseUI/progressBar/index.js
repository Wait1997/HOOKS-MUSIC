import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from '../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`;

function ProgressBar(props) {
  const { percent } = props;

  // 设置一个触摸手指对象
  const [touch, setTouch] = useState({});
  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();

  const transform = prefixStyle('transform');

  const progressBtnWidth = 16;

  // 当播放进度改变时 执行此钩子函数
  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      progress.current.style.width = `${offsetWidth}px`;
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
  }, [percent]);

  //处理进度条的偏移
  const _offset = (offsetWidth) => {
    // 进度条当前的长度
    progress.current.style.width = `${offsetWidth}px`;
    // 进度按钮当前的移动偏移量
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  // 手指触摸时
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true; //initial为true 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX; // 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth; // 当前progress的长度
    setTouch(startTouch);
  };

  const progressTouchMove = (e) => {
    // 触摸对象不能存在时return
    if (!touch.initiated) return;
    //滑动距离
    const deltaX = e.touches[0].pageX - touch.startX;
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  const progressTouchEnd = (e) => {
    // 把state中的私有数据做深拷 不要直接修改数据
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  const progressClick = (e) => {
    const rect = progressBar.current.getBoundingClientRect();
    // 元素左边到视窗左边的距离为 rect.left
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  // 触摸结束或者点击结束执行
  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // 计算新的百分比
    const curPercent = progress.current.clientWidth / barWidth; //新的进度计算
    props.percentChange(curPercent); // 把新的进度传给回调函数并执行
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  );
}

export default React.memo(ProgressBar);