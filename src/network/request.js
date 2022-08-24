import axios from "axios";
import router from "@/router";
import { Notify } from 'vant';

const instance = axios.create({
  // 接口地址根路径
  baseURL: '/api',
  timeout: 60000
})

const codeInstance = axios.create({
  // 接口地址根路径
  baseURL: '/code',
  timeout: 60000
})

//请求前拦截
instance.interceptors.request.use(config => {
  // const saveAuthorization = window.parent.getToken()
  // if (saveAuthorization != undefined) {
  //   config.headers.common['authorization'] = saveAuthorization
  // }
  return config;
}, err => {
  
})

//请求后拦截
instance.interceptors.response.use(res => {
  if (res.data) {
    const code = res.data.code;
    const ua = window.navigator.userAgent.toLowerCase();
    if (code == 201) {
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        Notify('登录超期，请重新登录');
        setTimeout(() => {
          router.push('login').catch(err => err)
        }, 3000)
      } else {
        Notify('请在微信客户端登录使用');
        setTimeout(() => {
          router.replace('result?type=warning&title=异常登录&describe=请在微信客户端登录使用&redirect=').catch(err => err)
        }, 3000)
      }
    } else if (code == 202) {
      Notify('登录超期，请重新登录');
      setTimeout(() => {
        router.push('login').catch(err => err)
      }, 3000)
    } else if (code == 400) {
      Notify('您没有权限访问该模块');
      setTimeout(() => {
        router.replace('result?type=error&title=暂无权限&describe=您没有权限访问该模块&redirect=goHome').catch(err => err)
      }, 3000)
    } else if (code == 203 || code == 500) {
      Notify('服务异常，请检查您的网络是否正常');
      setTimeout(() => {
        router.push('result?type=error&title=服务异常&describe=服务异常，请检查您的网络是否正常&redirect=goBack').catch(err => err)
      }, 3000)
    }
    return res.data;
  }
}, error => {

})

export function get(url, params, headers) {
  let config = {}
  if (params != undefined) {
    config.params = params;
  }
  if (headers != undefined) {
    config.headers = headers;
  }
  return instance.get(url, config)
}

export function post(url, data, headers) {
  let config = {}
  if (headers != undefined) {
    config.headers = headers;
  }
  var funcName = url + "("
  var paras = {}
  if (data && JSON.stringify(data) != '{}') {
    Object.keys(data).forEach((k, v) => {
      funcName += k + ','
      paras[k] = data[k]
    })
    funcName = funcName.slice(0, -1)
  }
  funcName += ")"
  var postData = {
    "function" : funcName,
    ...paras
  }
  return instance.post('wx.asp', postData, config)
}
