import { getMenus, getButtons } from '@/api/auth'

import Layout from '@/layout'

const permission = {
    state: {
        asynRouters: [],
        navlist: [],
        buttons: [],
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.asynRouters = routers
        },
        SET_NAVLIST: (state, navlist) => {
            state.navlist = navlist
        },
        SET_BUTTONS: (state, buttons) => {
            state.buttons = buttons
        }
    },
    actions: {
        getAsynRoutes({commit}) {
            return new Promise((resolve, reject)=>{
                getMenus().then(response => {
                    if(response !== undefined && response && response.data) {
                        let routes = response.data.routes //这是后端的菜单数据
                        let navs   = response.data.navlist
                        //左侧导航
                        let navlist = [{
                            icon: 'el-icon-lx-home',
                            index: 'dashboard',
                            title: '系统首页'
                        }]

                        navs.forEach((m, i) => {
                            if(m.isNav === 1) {
                                if(m.children) {
                                    let children = [];
                                    for(const child of m.children) {
                                        if(child.hidden === 0) {
                                            const temp = {
                                                index: child.effectUri,
                                                title: child.displayName
                                            }
                                            children.push(temp)
                                        }
                                    }
                                    if(m.hidden === 0) {
                                        let item =  {
                                            icon: m.icon,
                                            index: m.effectUri,
                                            title: m.displayName,
                                            subs: children
                                        }
                                        navlist.push(item)
                                    }

                                } else {
                                    if(m.hidden === 0) {
                                        let item =  {
                                            icon: m.icon,
                                            index: m.effectUri,
                                            title: m.displayName,
                                        }
                                        navlist.push(item)
                                    }
                                }

                            }
                        })
                        console.log(navlist)
                        //路由
                        let menuRouters = []
                        routes.forEach((m, i) => {
                            if (m.effectUri) {
                                let module = {
                                    path: '',
                                    component: Layout,
                                    meta: {title: m.displayName},
                                    children: [
                                        {
                                            path: m.effectUri,
                                            component:() => import('@/views' + m.effectUri),
                                            meta: { title: m.displayName}
                                        }
                                    ]
                                }
                                menuRouters.push(module)
                            }
                        })
                        let errPage =  { path: '*', redirect: '/404', hidden: true }
                        menuRouters.push(errPage)
                        console.log(menuRouters)
                        commit('SET_NAVLIST', navlist)
                        commit('SET_ROUTERS', menuRouters)
                        resolve()
                    } else {
                        reject()
                    }
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getButtons({commit}) {
            return new Promise((resolve, reject)=>{
                getButtons().then(response => {
                    if(response !== undefined && response && response.data) {
                        let buttons = response.data //这是后端的菜单数据
                        commit('SET_BUTTONS', buttons)
                        resolve()
                    } else {
                        reject()
                    }
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        clearnRounts({commit, state}) {
            commit('SET_ROUTERS', [])
        },
        clearnButtons({commit, state}) {
            commit('SET_BUTTONS', [])
        }
    }
}


export default permission
