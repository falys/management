import axios from 'axios';
import { Message } from 'element-ui'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    // withCredentials: true, //跨域
    timeout: 5000
});

service.interceptors.request.use( config => {
    const token = sessionStorage.getItem('token')
    // const expire = sessionStorage.getItem('token_expire') * 1000
    // if (expire && token) {
    //     const expire = sessionStorage.getItem('token_expire') * 1000
    //     const current_time = new Date().getTime() - 1000 * 60 * 3
    //     if (current_time > expire) {
    //         store.dispatch('refreshToken').then(() => {
    //             console.log('refreshToken')
    //         })
    //     }
    // }
    if (token) {
        config.headers['Authorization'] = 'token ' + sessionStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
},error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 0) {
            // -100 Token 过期了;
            if (res.code === -100) {
                sessionStorage.clear()
                Message({
                    message: '登录超时，请重新登录！',
                    type: 'error',
                    duration: 3 * 1000
                })
                setTimeout(() => {
                    location.reload()
                }, 3 * 1000)
                return Promise.reject('error')
            } else {
                Message({
                    message: res.message,
                    type: 'error',
                    duration: 3 * 1000
                })
            }
        } else {
            return response.data
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
