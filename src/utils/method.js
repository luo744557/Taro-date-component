/**
 * @description 公共方法
 * @author 阴亚会
 * @update 阴亚会
 */
import Taro from '@tarojs/taro';

const method = {
  /**
   * 跳转处理
   * @param {string} path app.config.js中的完整地址 例如/pages/home/index
   */
  commonNavigateTo(path) {
    /** @name 底导航路由列表 */
    const switchList = ['/pages/firstpage/firstpage'];
    if (switchList.includes(path)) {
      Taro.switchTab({
        url: path,
      });
    } else {
      Taro.navigateTo({
        url: path,
      });
    }
  },
  /**
   * 微信跳转微信人工客服
   */
  concatWxService() {
    if (wx.openCustomerServiceChat) {
      Taro.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfcff01983feca87028' },
        corpId: 'ww469d9cb72fe0547d',
        success(res) {
          console.log('微信客服调用ok');
        },
        fail(err) {
          console.log('微信客服调用err', err);
          Taro.navigateBack();
        },
      });
    } else {
      Taro.showModal({
        title: '提示',
        showCancel: false,
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        success() {
          Taro.navigateBack();
        },
      });
    }
  },
  /**
   * 跳转微信人工客服弹窗提示
   */
  showServiceMiddle() {
    const that = this;
    Taro.showModal({
      title: '温馨提示',
      content: '微信人工客服工作日9:00-18:00在线。工作时间外您可留言，客服看到后会第一时间处理，感谢您的理解与支持',
      confirmText: '联系客服',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.concatWxService();
        }
      },
    });
  },
  /**
   * 设置页面标题
   */
  setPageBarTitle(title) {
    Taro.setNavigationBarTitle({
      title: title,
    });
  },
};
export default method;
