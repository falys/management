import request from '@/utils/request'


export function getUserlist(data) {
    return request({
        url: '/admin/user/list',
        method: 'post',
        data
    })
}

export function userCreate(data) {
    return request({
        url: '/admin/user/create',
        method: 'post',
        data
    })
}

export function userUpdate(data) {
    return request({
        url: '/admin/user/update',
        method: 'post',
        data
    })
}

export function userDelete(data) {
    return request({
        url: '/admin/user/delete',
        method: 'post',
        data
    })
}

export function userSearch(data){
    return request({
        url: '/admin/user/search',
        method: 'post',
        data
    })
}
