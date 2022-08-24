// 手机号验证
function checkPhone(num) {
  const myReg = /^[1][3456789][0-9]{9}$/;
  if (!myReg.test(num)) {
    return false;
  } else {
    return true;
  }
}

// 邮箱验证
function checkMail(num) {
  const myReg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  return myReg.test(num);
}

// 身份证号验证
function checkIdNumber(val) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  const code = val.substring(17);
  if (p.test(val)) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
}

function checkLicense(code) {
  var result = true
  var reg = /^([159Y]{1})([1239]{1})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-9ABCDEFGHJKLMNPQRTUWXY]{1})$/;
  if (!reg.test(code)) {
    result = false
  }
  //不用I、O、S、V、Z
  var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  var ws = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  var codeArr = []
  var sum = 0
  codeArr[0] = code.substr(0, code.length - 1);
  codeArr[1] = code.substr(code.length - 1, code.length);
  for (var i = 0; i < codeArr[0].length; i++) {
    var Ancode = codeArr[0].charAt(i);
    var Ancodevalue = str.indexOf(Ancode);
    sum += Ancodevalue * ws[i];
  }
  var indexOfCode18 = 31 - (sum % 31);
  var code18 = str.charAt(indexOfCode18);
  if (code18 != codeArr[1]) {
    result = false
  }
  return result;
}

// 生成随机整数
function randomInteger(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export const util = {
  checkPhone,
  checkMail,
  checkIdNumber,
  checkLicense,
  randomInteger
}