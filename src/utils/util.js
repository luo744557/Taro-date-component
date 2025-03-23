import Taro from "@tarojs/taro";
const getLocalTime = (nS) => {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(nS);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + "-" + add0(m) + "-" + add0(d) + " " + add0(h) + ":" + add0(mm);
};
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

// 日期格式化
const dateFormatter = (date, fmt) => {
  date = date.constructor === Date ? date : new Date(Number(date));
  var o = {
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S+": date.getMilliseconds(), //毫秒
  };
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      if (k == "y+") {
        fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
      } else if (k == "S+") {
        var lens = RegExp.$1.length;
        lens = lens == 1 ? 3 : lens;
        fmt = fmt.replace(
          RegExp.$1,
          ("00" + o[k]).substr(('""' + o[k]).length - 1, lens)
        );
      } else {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
  }
  return fmt;
};
const getToken = (e, callBack) => {
  Taro.login({
    success(res) {
      console.log("resCode", res);
      handleLoginAction(e, res.code, callBack);
    },
    fail() {
      // setTempLoginCode(null);
    },
  });
};

// 格式化时间差值
const formatDuring = (mss) => {
  var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((mss % (1000 * 60)) / 1000);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  // setTotalMin(total);
  if (days == 0 && hours != 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else if (days == 0 && hours == 0) {
    return minutes + ":" + seconds;
  }
  if (days != 0) {
    return days + " 天 " + hours + ":" + minutes + ":" + seconds;
  }
};
const throttle = function(func, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
};
const debounce = function(func, delay) {
  var timer;
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    // 设置定时器
    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      func.apply(null, args);
    }, delay);
  };
};

const util = {
  formatTime,
  dateFormatter,
  getLocalTime,
  formatDuring,
  throttle,
  debounce,
};
export default util;
