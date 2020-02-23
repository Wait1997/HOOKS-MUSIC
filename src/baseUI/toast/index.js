import React, { useState, useImperativeHandle, forwardRef } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { CSSTransition } from 'react-transition-group';

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: ${style["theme-color"]};
    font-size: ${style["font-size-l"]};
  }
`;

//外面组件需要拿到这个函数组件的ref,因此用forwardRef
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState('');
  const { text } = props;
  //外面组件拿到组件ref的方法，用useImperativeHandle这个hook
  useImperativeHandle(ref, () => ({
    // 向外以对象暴露一个新方法
    show() {
      // 防抖处理
      if(timer) clearTimeout(timer);
      setShow(true);
      setTimer(setTimeout(() => {
        setShow(false);
      },3000));
    }
  }))

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="drop"
      unmountOnExit
    >
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

export default React.memo(Toast);