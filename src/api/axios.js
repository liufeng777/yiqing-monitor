import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
import { storeInstance } from '../store/index';
import { types } from '../store/types';

const baseURL = window.globalData.host + '/backend/';
axios.interceptors.request.use(config => {
  // axios发出的请求的头部Content-type默认为application/x-www-form-urlencoded, 传文件指明则使用multipart/form-data
  // 上传文件时不要stringify, 并且请自行在相应接口参数里添加admin_id和access_token
  if (config.headers['Content-Type'] !== 'multipart/form-data') {
    // const accessToken = sessionStorage.getItem('access_token') || ''
    // 把参数中的数字转字符串
    Object.getOwnPropertyNames(config.data).forEach((key) => {
      if (config.data[key] === null) {
        config.data[key] = ''
      }
    })
    // finalParams = {
    //   access_token: accessToken,
    //   ...config.data
    // }
    config.data = qs.stringify(config.data)
  }
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    // 把参数转为formData
    const formData = new FormData();
    Object.getOwnPropertyNames(config.data).forEach((key) => {
      if (config.data[key]) {
        formData.append(key, config.data[key])
      }
    })
    config.data = formData
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  // Do something with response data
  return response.data
}, (error) => {
  // Do something with response error
  return Promise.reject(error)
})

// 设置携带cookie
axios.defaults.withCredentials = true;

// export default axisoInstance
const axisoInstance = async (url = '', data = {}, method = 'POST', contentType = 'application/x-www-form-urlencoded') => {
  let res;

  try {
    res = await axios({
      baseURL,
      url,
      data,
      method,
      headers: {'Content-Type': contentType}
    })
    if (res) {
      if (res.res === 1004) {
        storeInstance.dispatch({
          type: types.SET_TOKEN_STATUS,
          payload: true,
        })
        return false
      }
      if (res.res !== 0 && !data.ignoreResCode) {
        message.error(res.msg)
        return false
      }
      return res
    }
  } catch (error) {
    message.error('链接服务器错误')
    // throw new Error(error)
  }
}

export default axisoInstance;
