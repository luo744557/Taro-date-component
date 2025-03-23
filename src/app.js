import { Component } from 'react';
import Taro from '@tarojs/taro';
// import { checkWxAppletAuth } from '@api/common';
import './app.less';

const env = process.env.TARO_ENV;

class App extends Component {
  componentDidMount() {
    const openId = Taro.getStorageSync('openId');
    if (!openId && env != 'h5') {
      Taro.login({
        success(res) {
          const jsCode = res.code;
          console.log(jsCode);
          // 假装这里有登录
          // loginApi({
          //   jsCode,
          // })
          //   .then((res) => {     
          //     let { openId } = res.data.insuranceAppletUserPo;
          //     Taro.setStorageSync('openId', openId);
          //   });
        },
        fail() {},
      });
    }
    Taro.getSystemInfo({
      success: res => {
      }
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return this.props.children;
  }
}

export default App;
