import request from '@/utils/request'


export function getRolelist(data) {
    return request({
        url: '/admin/roles/list',
        method: 'post',
        data
    })
}

export function getRolesPermission(data) {
    return request({
        url: '/admin/roles/permissions',
        method: 'post',
        data
    })
}

export function roleCreate(data) {
    return request({
        url: '/admin/roles/create',
        method: 'post',
        data
    })
}

export function roleUpdate(data) {
    return request({
        url: '/admin/roles/update',
        method: 'post',
        data
    })
}

export function roleDelete(data) {
    return request({
        url: '/admin/roles/delete',
        method: 'post',
        data
    })
}

export function roleMemberList(data) {
    return request({
        url: '/admin/roles/member',
        method: 'post',
        data
    })
}

export function roleMemberAdd(data) {
    return request({
        url: '/admin/member/add',
        method: 'post',
        data
    })
}

export function roleMemberDelete(data) {
    return request({
        url: '/admin/member/delete',
        method: 'post',
        data
    })
}

export function assingPermissin(data) {
    return request({
        url: '/admin/assign/permission',
        method: 'post',
        data
    })
}

export function getPermissionList() {
    return request({
        url: '/admin/permission/list',
        method: 'get',
    })
}

export function permissionCreate(data) {
    return request({
        url: '/admin/permission/create',
        method: 'post',
        data
    })
}

export function permissionUpdate(data) {
    return request({
        url: '/admin/permission/update',
        method: 'post',
        data
    })
}

export function permissionDelete(data) {
    return request({
        url: '/admin/permission/delete',
        method: 'post',
        data
    })
}



