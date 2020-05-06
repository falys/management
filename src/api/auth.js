import request from '@/utils/request'


export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function refreshToken() {
  return request({
    url: '/admin/refreshToken',
    method: 'post'
  })
}

export function getMenus() {
  return request({
    url: '/admin/menus',
    method: 'get'
  })
}

export function getButtons(data) {
  return request({
    url: '/admin/buttons',
    method: 'get',
    data
  })
}
