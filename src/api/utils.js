// 防抖函数
export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};

// 处理数据，找到第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
  for(let i = 0; i < rankList.length - 1; i++) {
    if(rankList[i].tracks.length && !rankList[i+1].tracks.length) {
      return i + 1;
    }
  }
};

// 处理歌手列表拼接歌手名字
export const getName = (list) => {
  let str = "";
  list.map((item,index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  })
  return str;
};

//判断一个对象是否为空对象
export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;

let vendor = (() => {
  //首先通过 transition 属性判断是何种浏览器
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "Transform"
  };
  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if(vendor === false) {
    return false;
  }
  if(vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};

//转换歌曲播放时间
export const formatPlayTime = interval => {
  interval = interval | 0; // 向下取整
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2,"0");
  return `${minute}:${second}`;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//随机算法
export function shuffle(arr) {
  let new_arr = [];
  arr.forEach(item => {
    new_arr.push(item);
  });
  for(let i = 0; i < new_arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = new_arr[i];
    new_arr[i] = new_arr[j];
    new_arr[j] = t;
  }
  return new_arr;
}

//找到当前的歌曲索引
export const findIndex = (song, list) => {
  return list.findIndex(item => {
    return song.id === item.id;
  })
};