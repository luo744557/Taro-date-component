// 表单字段格式校验
/**
 *  身份证号码格式校验
 *
 * @param {string} code  身份证号码
 * @return {Boolean}  
 */
 const checkIdCardValid = code => {
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  };
  var pass = true;

  if (!code || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/i.test(code)) {
    //"身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    //"地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != code[17]) {
        //"校验位错误";
        pass = false;
      }
    }
  }
  return pass;
};

/**
 *
 *
 * @param number phone
 * @return {Boolean} 
 */
const checkPhoneValid = phone => {
  // let reg = /^1[3|4|5|7|8][0-9]{9}$/
  let reg = /^\d{11}$/
  return reg.test(phone)
}
//  护照
const checkPassportValid = phone => {
  let reg = /^[a-zA-Z0-9]{1,20}$/
  return reg.test(phone)
}
// 港澳,  台 居民来往内地通行证
const checkPermitValid = PermitNum => {
  let reg = /^[a-zA-Z0-9]{1,11}$/
  return reg.test(PermitNum)
}
// 姓名
const checkNameValid = name => {
  // let reg = /^([\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}|[a-zA-Z.s]{1,20})$/
  return true
}
const formCheck =  {
  checkIdCardValid,
  checkPhoneValid,
  checkPassportValid,
  checkPermitValid,
  checkNameValid
};
export default formCheck