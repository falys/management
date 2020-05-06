/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 手机号码 */
export function validateMobile(str) {
  const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  return reg.test(str)
}

export function validateCode(str) {
  const reg = /^[\d]{6}$/i
  return reg.test(str)
}
/* 正整数 */
export function valicateInteger(str) {
  var re = /^[0-9]+$/
  return re.test(str)
}

export function valicateNumber(str) {
  var re = /^(^-?\d+$)$/
  return re.test(str)
}

/* 金额校验 */
export function validateAmount(str) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  return reg.test(str)
}

/* 校验银行卡卡号 */
export function validateBankCard(bankno) {
  if (bankno.length > 19 && bankno.length < 25) {
    const reg = /.[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{7}|.[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{7}|.[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{7}|.[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{7}/
    if (reg.test(bankno)) {
      return true
    } else {
      return false
    }
  }
  if (bankno.length < 16 || bankno.length > 19) {
    return false
  }
  var num = /^\d*$/
  if (!num.exec(bankno)) {
    return false
  }
  /* 开头6位 */
  var strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if (strBin.indexOf(bankno.substring(0, 2)) === -1) {
    return false
  }
  var lastNum = bankno.substr(bankno.length - 1, 1) /* 取出最后一位（与luhm进行比较）*/
  lastNum = parseInt(lastNum)
  var first15Num = bankno.substr(0, bankno.length - 1) /* 前15或18位 */
  var newArr = []
  for (var i = first15Num.length - 1; i > -1; i--) { /* 前15或18位倒序存进数组 */
    newArr.push(first15Num.substr(i, 1))
  }
  var arrJiShu = [] /* 奇数位*2的积 <9 */
  var arrJiShu2 = [] /* 奇数位*2的积 >9 */
  var arrOuShu = [] /* 偶数位数组 */
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 === 1) { /* 奇数位 */
      if (parseInt(newArr[j]) * 2 < 9) {
        arrJiShu.push(parseInt(newArr[j]) * 2)
      } else {
        arrJiShu2.push(parseInt(newArr[j]) * 2)
      }
    } else { /* 偶数位 */
      arrOuShu.push(newArr[j])
    }
  }
  var jishu_child1 = [] /* 奇数位*2 >9 的分割之后的数组个位数 */
  var jishu_child2 = [] /* 奇数位*2 >9 的分割之后的数组十位数 */
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }
  var sumJiShu = 0 /* 奇数位*2 < 9 的数组之和 */
  var sumOuShu = 0 /* 偶数位数组之和 */
  var sumJiShuChild1 = 0 /* 奇数位*2 >9 的分割之后的数组个位数之和 */
  var sumJiShuChild2 = 0 /* 奇数位*2 >9 的分割之后的数组十位数之和 */
  var sumTotal = 0
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }
  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }
  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  /* 计算总和 */
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)
  /* 计算Luhm值 */
  var k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10
  var luhm = 10 - k
  if (lastNum === luhm) {
    return true
  } else {
    return false
  }
}
/* 校验身法证号码 */
export function validateIdCard(idcard) {
  var vcity = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
    21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江',
    34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北',
    43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川',
    52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海',
    64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
  }
  if (idcard === '' || idcard === 'undefined') {
    return false
  }
  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
  if (reg.test(idcard) === false) {
    return false
  }
  var province = idcard.substr(0, 2)
  if (vcity[province] === undefined) {
    return false
  }
  var len = idcard.length
  if (len === 15) {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
    var arr_data = idcard.match(re_fifteen)
    var year = arr_data[2]
    var month = arr_data[3]
    var day = arr_data[4]
    var birthday = new Date('19' + year + '/' + month + '/' + day)

    year = '19' + year
    var now = new Date()
    var now_year = now.getFullYear()

    if (birthday.getFullYear() === year && (birthday.getMonth() + 1) === month && birthday.getDate() === day) {
      var time = now_year - year
      if (time < 3 && time > 100) {
        return false
      }
    }
  }
  if (len === 18) {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
    var arr_data1 = idcard.match(re_eighteen)
    var year1 = arr_data1[2]
    var month1 = arr_data1[3]
    var day1 = arr_data1[4]
    var birthday1 = new Date(year1 + '/' + month1 + '/' + day1)
    var now1 = new Date()
    var now_year1 = now1.getFullYear()
    if (birthday1.getFullYear() === year1 && (birthday1.getMonth() + 1) === month1 && birthday1.getDate() === day1) {
      var time1 = now_year1 - year1
      if (time1 < 3 && time1 > 100) {
        return false
      }
    }
  }
  var arrInt = []
  var arrCh = []
  var cardTemp = []
  if (len === 15) {
    arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    cardTemp = 0
    idcard = idcard.substr(0, 6) + '19' + idcard.substr(6, idcard.length - 6)
    for (var i = 0; i < 17; i++) {
      cardTemp += idcard.substr(i, 1) * arrInt[i]
    }
    idcard += arrCh[cardTemp % 11]
  }
  len = idcard.length
  if (len === 18) {
    arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var temp = 0
    var valnum = 0
    for (var j = 0; j < 17; j++) {
      temp += parseInt(idcard.substr(j, 1)) * parseInt(arrInt[j])
    }
    valnum = arrCh[temp % 11]
    if (valnum === idcard.substr(17, 1)) {
      return true
    }
    return false
  }
  return false
}

